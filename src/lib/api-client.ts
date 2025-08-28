import { IUser } from '@/models/user.model';

export type RegisterFormData = Omit<
    IUser,
    | '_id'
    | 'role'
    | 'createdAt'
    | 'updatedAt'
    | 'isPasswordCorrect'
    | 'generateAccessToken'
    | 'generateRefreshToken'
>;

export type LoginFormData = Pick<IUser, 'username' | 'password'>;

type FetchOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    headers?: Record<string, string>;
};

class ApiClient {
    /**
     * A private wrapper around the native `fetch` API.
     * It simplifies making API requests by handling JSON stringification,
     * setting default headers, and providing a consistent error handling mechanism.
     * @param endpoint The API endpoint to call (e.g., '/auth/register').
     * @param options Configuration for the request (method, body, headers).
     * @returns A promise that resolves with the JSON response.
     */
    private async fetch<T>(
        endpoint: string,
        options: FetchOptions = {}
    ): Promise<T> {
        const { method = 'GET', body, headers = {} } = options;

        const defaultHeaders = {
            'Content-Type': 'application/json',
            ...headers,
        };

        const response = await fetch(`/api${endpoint}`, {
            method,
            headers: defaultHeaders,
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            const errorPayload = await response.json();
            throw new Error(
                errorPayload.message || 'An unknown error occurred'
            );
        }

        return response.json();
    }

    // --- Authentication Methods ---

    async registerUser(userData: RegisterFormData) {
        return this.fetch<{ message: string; user: IUser }>('/auth/register', {
            method: 'POST',
            body: userData,
        });
    }

    async loginUser(credentials: LoginFormData) {
        return this.fetch<{ message: string; user: IUser }>('/auth/login', {
            method: 'POST',
            body: credentials,
        });
    }

    async logoutUser() {
        return this.fetch<{ message: string }>('/auth/logout', {
            method: 'POST',
        });
    }
}

export const apiClient = new ApiClient();
