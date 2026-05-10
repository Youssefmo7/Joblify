import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

// Request interceptor: attach Bearer token
client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: unwrap envelope & handle auth errors
client.interceptors.response.use(
    (response) => {
        // If the response has the standard { success, message, data } envelope,
        // return the data directly for convenience
        if (response.data && typeof response.data === 'object' && 'data' in response.data) {
            // Keep meta pagination info attached
            const result = response.data.data;
            if (response.data.meta) {
                result._meta = response.data.meta;
            }
            if (response.data.message) {
                result._message = response.data.message;
            }
            return result;
        }
        return response.data;
    },
    (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message || 'Something went wrong';

        if (status === 401 || status === 403) {
            localStorage.removeItem('access_token');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        // Reject with a normalized error object
        return Promise.reject({
            status,
            message,
            errors: error.response?.data?.errors || {},
            raw: error,
        });
    }
);

export default client;
