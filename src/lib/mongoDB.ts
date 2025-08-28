import { Db, MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('MONGODB_URI not found');
}

// Use a global variable to preserve the client across module reloads in development.
let globalWithMongo = global as typeof global & {
    _mongoClient?: MongoClient;
};

let client: MongoClient;

if (process.env.NODE_ENV === 'development') {
    if (!globalWithMongo._mongoClient) {
        globalWithMongo._mongoClient = new MongoClient(MONGODB_URI!);
    }
    client = globalWithMongo._mongoClient;
} else {
    client = new MongoClient(MONGODB_URI!);
}

export const db: Db = client.db();
