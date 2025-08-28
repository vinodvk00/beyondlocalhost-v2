import { serialize } from 'cookie';

type CookieOptions = Parameters<typeof serialize>[2];

export const accessTokenOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    // sameSite: 'strict',
    maxAge: 60 * 60, // Expires in 1 hour
    path: '/',
};

export const refreshTokenOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // Expires in 7 days
    path: '/',
};
