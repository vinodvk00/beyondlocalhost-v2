import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
    username: string;
    fullname: string;
    password?: string;
    role: 'admin' | 'user';
    profilePicture?: string;
    refreshToken?: string;
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
}

const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        role: {
            type: String,
            required: true,
            enum: ['admin', 'user'],
            default: 'user',
        },
        profilePicture: {
            type: String,
            default:
                'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        },

        refreshToken: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();

    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error: any) {
        next(error);
    }
});

userSchema.methods.isPasswordCorrect = async function (
    password: string
): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (): string {
    if (!process.env.ACCESS_TOKEN_SECRET || !process.env.ACCESS_TOKEN_EXPIRY) {
        throw new Error(
            'ACCESS_TOKEN_SECRET or ACCESS_TOKEN_EXPIRY is not defined'
        );
    }

    const payload = {
        _id: this._id,
        username: this.username,
        fullname: this.fullname,
        role: this.role,
    };

    const secret = process.env.ACCESS_TOKEN_SECRET as jwt.Secret;

    const options: jwt.SignOptions = {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY as any,
    };

    return jwt.sign(payload, secret, options);
};

userSchema.methods.generateRefreshToken = function (): string {
    if (
        !process.env.REFRESH_TOKEN_SECRET ||
        !process.env.REFRESH_TOKEN_EXPIRY
    ) {
        throw new Error(
            'REFRESH_TOKEN_SECRET or REFRESH_TOKEN_EXPIRY is not defined'
        );
    }

    const payload = {
        _id: this._id,
    };

    const secret = process.env.REFRESH_TOKEN_SECRET as jwt.Secret;

    const options: jwt.SignOptions = {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY as any,
    };

    return jwt.sign(payload, secret, options);
};

export const roles = {
    ADMIN: 'admin',
    USER: 'user',
};

const User =
    (mongoose.models.User as Model<IUser>) ||
    mongoose.model<IUser>('User', userSchema);

export default User;
