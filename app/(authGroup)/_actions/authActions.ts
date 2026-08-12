'use server';

import jwt, { JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

type LoginState = {
    success: boolean;
    statusCode: number;
    message: string;
    data?: {
        accessToken: string;
        refreshToken: string;
        user?: {
            id: string;
            name: string;
            email: string;
            role: string;
            isSuspended: boolean;
        };
    };
};

export const loginAction = async (redirectTo: string, prevState: LoginState, formData: FormData) => {
    const email = formData.get('email');
    const password = formData.get('password');

    const payload = {
        email,
        password,
    };

    try {
        const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await res.json();

        if (result.success) {
            const cookieStore = await cookies();

            cookieStore.set('accessToken', result.data.accessToken, {
                httpOnly: true,
                maxAge: 60 * 60 * 24, 
                sameSite: 'lax',
                path: '/',
            });

            cookieStore.set('refreshToken', result.data.refreshToken, {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 7,  
                sameSite: 'lax',
                path: '/',
            });

            // Store user info in cookie for middleware
            if (result.data.user) {
                cookieStore.set('userRole', result.data.user.role, {
                    httpOnly: true,
                    maxAge: 60 * 60 * 24 * 7,
                    sameSite: 'lax',
                    path: '/',
                });
                cookieStore.set('userName', result.data.user.name, {
                    httpOnly: true,
                    maxAge: 60 * 60 * 24 * 7,
                    sameSite: 'lax',
                    path: '/',
                });
            }

            const decodedToken = jwt.decode(result.data.accessToken) as JwtPayload;

            // Redirect if specified
            if (redirectTo && typeof redirectTo === 'string' && redirectTo.startsWith('/') && !redirectTo.startsWith('//')) {
                redirect(redirectTo);
            }

            // ✅ GearUp Roles
            if (decodedToken?.role === 'CUSTOMER') {
                redirect('/customer-dashboard');
            } else if (decodedToken?.role === 'PROVIDER') {
                redirect('/provider-dashboard');
            } else if (decodedToken?.role === 'ADMIN') {
                redirect('/admin-dashboard');
            }

            // Default redirect
            redirect('/');
        }

        return result;
    } catch (error: any) {
        console.error('Login error:', error);
        return {
            success: false,
            statusCode: 500,
            message: error.message || 'Login failed. Please try again.',
        };
    }
};

// ✅ Logout Action
export const logoutAction = async () => {
    const cookieStore = await cookies();
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    cookieStore.delete('userRole');
    cookieStore.delete('userName');
    redirect('/login');
};

// ✅ Register Action
export const registerAction = async (prevState: any, formData: FormData) => {
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const role = formData.get('role') || 'CUSTOMER';

    const payload = {
        name,
        email,
        password,
        role,
    };

    try {
        const res = await fetch(`${process.env.BACKEND_API_URL}/api/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await res.json();

        if (result.success) {
            redirect('/login?registered=true');
        }

        return result;
    } catch (error: any) {
        console.error('Registration error:', error);
        return {
            success: false,
            statusCode: 500,
            message: error.message || 'Registration failed. Please try again.',
        };
    }
};

// ✅ Get Current User
export const getCurrentUser = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
        return null;
    }

    try {
        const res = await fetch(`${process.env.BACKEND_API_URL}/api/users/me`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const result = await res.json();

        if (result.success) {
            return result.data;
        }

        return null;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
};

// ✅ Check Auth Status
export const isAuthenticated = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    return !!accessToken;
};

// ✅ Get User Role
export const getUserRole = async () => {
    const cookieStore = await cookies();
    return cookieStore.get('userRole')?.value || null;
};

