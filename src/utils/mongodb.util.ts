import mongoose, { Connection } from 'mongoose';

interface MongooseCache {
    conn: Connection | null;
    promise: Promise<Connection> | null;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('MONGODB_URI undefined');
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
    global.mongoose = cached;
}

/**
 * Connect to MongoDB database
 * Uses connection caching to prevent multiple connections in serverless environments
 */
async function connectDB(): Promise<Connection> {
    if (cached.conn) {
        console.log('Using cached MongoDB connection');
        return cached.conn;
    }

    if (!cached.promise) {
        console.log('Creating new MongoDB connection...');

        const opts = {
            bufferCommands: false, // Disable command buffering
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            family: 4, // Use IPv4, skip trying IPv6
        };

        cached.promise = mongoose
            .connect(MONGODB_URI as string, opts)
            .then((mongoose) => {
                console.log('MongoDB connected successfully');
                return mongoose.connection;
            });
    }

    try {
        cached.conn = await cached.promise;

        setupConnectionListeners(cached.conn);

        return cached.conn;
    } catch (error) {
        cached.promise = null;
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

function setupConnectionListeners(connection: Connection): void {
    connection.on('connected', () => {
        console.log('MongoDB connected to', connection.db?.databaseName);
    });

    connection.on('error', (error) => {
        console.error('MongoDB connection error:', error);
    });

    connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
        await connection.close();
        console.log('MongoDB connection closed due to app termination');
        process.exit(0);
    });
}

async function disconnectDB(): Promise<void> {
    try {
        await mongoose.disconnect();
        cached.conn = null;
        cached.promise = null;
        console.log('MongoDB disconnected successfully');
    } catch (error) {
        console.error('Error disconnecting from MongoDB:', error);
        throw error;
    }
}

function getConnectionStatus(): string {
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
    };

    return (
        states[mongoose.connection.readyState as keyof typeof states] ||
        'unknown'
    );
}

function isConnected(): boolean {
    return mongoose.connection.readyState === 1;
}

export { connectDB, disconnectDB, getConnectionStatus, isConnected };

export default connectDB;
