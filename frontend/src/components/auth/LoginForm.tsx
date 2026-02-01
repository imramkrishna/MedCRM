'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAppDispatch } from '@/lib/hooks';
import { loginStart, loginSuccess, loginFailure, type User } from '@/lib/slices/authSlice';
import { post } from '@/lib/api';
import { useCommonToasts } from '@/hooks/useCommonToasts';
interface LoginFormProps {
    type: 'admin' | 'distributor';
    title: string;
    subtitle: string;
}

const LoginForm = ({ type, title, subtitle }: LoginFormProps) => {
    const { showLoginSuccess, showLoginError } = useCommonToasts();
    
    // Default credentials based on user type
    const defaultCredentials = {
        admin: { email: 'admin@email.com', password: 'admin' },
        distributor: { email: 'thor@email.com', password: 'admin' }
    };
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const dispatch = useAppDispatch();
    const router = useRouter();
    
    // Quick login with default credentials
    const handleQuickLogin = () => {
        setEmail(defaultCredentials[type].email);
        setPassword(defaultCredentials[type].password);
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        dispatch(loginStart());

        try {
            setIsLoading(true)
            if (type == "admin") {
                const response = await post('/auth/adminLogin', {
                    email,
                    password
                });
                const apiUser = response.data.user || {};
                const normalizedUser: User = {
                    id: apiUser.id ?? apiUser._id ?? 'unknown',
                    email: apiUser.email ?? email,
                    name: apiUser.name ?? apiUser.ownerName ?? 'Admin',
                    role: 'admin',
                };
                dispatch(loginSuccess(normalizedUser));
                showLoginSuccess();
                router.replace('/admin');
            } else {
                const response = await post('/auth/login', {
                    email,
                    password
                });
                const apiUser = response.data.user || {};
                const normalizedUser: User = {
                    id: apiUser.id ?? apiUser._id ?? 'unknown',
                    email: apiUser.email ?? email,
                    name: apiUser.name ?? apiUser.ownerName ?? 'Distributor',
                    role: 'distributor',
                };
                dispatch(loginSuccess(normalizedUser));
                showLoginSuccess();
                router.replace('/distributor');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Login failed';
            setError(errorMessage);
            dispatch(loginFailure(errorMessage));
            showLoginError();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <Link href="/" className="text-3xl font-bold text-blue-600">
                        Med CRM
                    </Link>
                </div>
                <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                    {title}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    {subtitle}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your password"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>

                        {/* Quick Login Button for Recruiters/Demo */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">For Demo/Testing</span>
                            </div>
                        </div>

                        <div>
                            <button
                                type="button"
                                onClick={handleQuickLogin}
                                className="group relative w-full flex justify-center py-2 px-4 border-2 border-blue-300 text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                            >
                                🚀 Quick Login as {type === 'admin' ? 'Admin' : 'Distributor'}
                            </button>
                            <p className="mt-2 text-center text-xs text-gray-500">
                                Credentials: <span className="font-mono font-semibold">{defaultCredentials[type].email}</span> / <span className="font-mono font-semibold">{defaultCredentials[type].password}</span>
                            </p>
                        </div>

                        {type === 'distributor' && (
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Not a distributor yet?{' '}
                                    <Link href="/become-distributor" className="font-medium text-blue-600 hover:text-blue-500">
                                        Apply here
                                    </Link>
                                </p>
                            </div>
                        )}
                    </form>

                    <div className="mt-6">
                        <div className="text-center">
                            <Link href="/" className="text-sm text-gray-600 hover:text-blue-600">
                                ← Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
