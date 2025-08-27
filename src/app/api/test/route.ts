import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoDB';
import User from '@/models/user.model';

export async function GET() {
    try {
        await connectToDatabase();

        const userCount = await User.countDocuments();

        return NextResponse.json(
            {
                message:
                    'Successfully connected to the database and tested model.',
                userCount: userCount,
            },
            { status: 200 }
        );
    } catch (error) {
        const errorMessage =
            error instanceof Error
                ? error.message
                : 'An unknown error occurred';

        return NextResponse.json(
            {
                message: 'Failed to connect to the database.',
                error: errorMessage,
            },
            { status: 500 }
        );
    }
}
