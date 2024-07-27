import axios from "axios";

// Define the base URL for the microservices using environment variables
const AUTH_SERVICE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_API;
const USER_MANAGEMENT_SERVICE_URL = 'http://localhost:7002';

console.log("NEXT_PUBLIC_AUTH_SERVICE_API IS", AUTH_SERVICE_URL);
console.log("USER_MANAGEMENT_SERVICE_URL IS", USER_MANAGEMENT_SERVICE_URL);

// Create Axios instances for the services
const authServiceAxios = axios.create({ baseURL: AUTH_SERVICE_URL });
const userServiceAxios = axios.create({ baseURL: USER_MANAGEMENT_SERVICE_URL });

console.log("AuthServiceAxios instance created with baseURL:", AUTH_SERVICE_URL);
console.log("UserServiceAxios instance created with baseURL:", USER_MANAGEMENT_SERVICE_URL);

// Request interceptor for logging request details
const requestInterceptor = (config) => {
    console.log('Request Config:', config);
    return config;
};

const errorInterceptor = (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
};

authServiceAxios.interceptors.request.use(requestInterceptor, errorInterceptor);
userServiceAxios.interceptors.request.use(requestInterceptor, errorInterceptor);

// Response interceptor for logging response details and errors
const responseInterceptor = (response) => {
    console.log('Response:', response);
    return response;
};

const responseErrorInterceptor = (error) => {
    console.error('Axios Error:', error);
    if (error.response) {
        console.error('Response Error Data:', error.response.data);
        console.error('Response Error Status:', error.response.status);
        console.error('Response Error Headers:', error.response.headers);
    } else {
        console.error('Error Message:', error.message);
    }
    return Promise.reject((error.response && error.response.data) || 'Something went wrong');
};

authServiceAxios.interceptors.response.use(responseInterceptor, responseErrorInterceptor);
userServiceAxios.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

export { authServiceAxios, userServiceAxios };
