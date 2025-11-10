import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

const refreshToken = async () => {
    if (isRefreshing && refreshPromise) {
        return refreshPromise;
    }

    isRefreshing = true;
    refreshPromise = axios.get(`${BASE_URL}/auth/ping`, { withCredentials: true })
        .then(() => {
            isRefreshing = false;
            refreshPromise = null;
        })
        .catch((error) => {
            isRefreshing = false;
            refreshPromise = null;
            throw error;
        });

    return refreshPromise;
};

export const apiRequest = async (config: any) => {
    const makeRequest = () => axios({
        ...config,
        baseURL: BASE_URL,
        withCredentials: true,
    });

    try {
        return await makeRequest();
    } catch (error: any) {
        if (error.response?.status === 401 && !config._retry) {
            config._retry = true;
            try {
                await refreshToken();
                return await makeRequest();
            } catch (refreshError) {
                // If refresh fails, clear auth and redirect
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('auth_user');
                    localStorage.removeItem('auth_isAuthenticated');
                    window.location.href = '/auth/distributor-login';
                }
                throw refreshError;
            }
        }
        throw error;
    }
};

// Convenience methods
export const get = (url: string, config = {}) => apiRequest({ method: 'GET', url, ...config });
export const post = (url: string, data = {}, config = {}) => apiRequest({ method: 'POST', url, data, ...config });
export const put = (url: string, data = {}, config = {}) => apiRequest({ method: 'PUT', url, data, ...config });
export const del = (url: string, config = {}) => apiRequest({ method: 'DELETE', url, ...config });
