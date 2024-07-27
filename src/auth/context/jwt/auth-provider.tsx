'use client'
// Import necessary modules and types
import React, { useReducer, ReactNode, useContext, useEffect } from 'react';
import { AuthContext } from './auth-context';
import {
    AuthStateType, 
    AuthAction, 
    AuthActionTypes, 
    AuthContextType 
} from '@/auth/types';
import { authServiceAxios } from "@/utils/axios";
import { authEndpoints } from '@/utils/endpoints';
import { useRouter } from 'next/navigation';
// Initial state of authentication
const initialState: AuthStateType = {
    user: null,
    loading: false,
    authenticated: false,
    unauthenticated: true,
    formSubmitted: false,
    userId: null,
    accessToken: null, // Add accessToken to the initial state
};

// Reducer function to handle authentication actions
const authReducer = (state: AuthStateType, action: AuthAction): AuthStateType => {
    console.log('Reducer Action:', action);
    switch (action.type) {
        case AuthActionTypes.INITIAL:
            return {
                ...state,
                loading: true,
            };
        case AuthActionTypes.LOGIN:
        case AuthActionTypes.REGISTER:
            console.log('Updating state with user data:', action.payload);
            return {
                ...state,
                user: action.payload.user,
                userId: action.payload.userId,
                accessToken: action.payload.accessToken, // Update accessToken in the state
                authenticated: true,
                unauthenticated: false,
                loading: false,
            };
        case AuthActionTypes.LOGOUT:
            console.log('Clearing user state on logout');
            return {
                ...state,
                user: null,
                userId: null,
                accessToken: null, // Clear accessToken on logout
                authenticated: false,
                unauthenticated: true,
                loading: false,
            };
        case AuthActionTypes.SET_FORM_SUBMITTED:
            console.log('Setting form submission status:', action.payload.formSubmitted);
            return {
                ...state,
                formSubmitted: action.payload.formSubmitted,
            };
        default:
            return state;
    }
};

// AuthProvider component to provide authentication state and actions
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const router = useRouter();

    // useEffect(() => {
    //     // Check if the user is not logged in
    //     if (!state.user && !state.accessToken && !state.loading) {
    //         router.push('/login');
    //     }
    // }, [state.user, state.accessToken, state.loading, router]);

    // Log the initial state on component mount
    useEffect(() => {
        console.log('Initial AuthProvider State:', state);
    }, []);

    // Log the current state after each action
    useEffect(() => {
        console.log('Current AuthProvider State:', state);
    }, [state]);

    const login = async (email: string, password: string) => {
        console.log('Attempting to login with:', { email, password });
        dispatch({ type: AuthActionTypes.INITIAL });

        try {
            const response = await authServiceAxios.post(authEndpoints.login, { email, password });
            console.log('Login response received:', response.data);

            const { user, userId, accessToken } = response.data;

            dispatch({
                type: AuthActionTypes.LOGIN,
                payload: { user, userId, accessToken }, // Include accessToken in payload
            });
        } catch (error) {
            console.error('Login error:', error);
            dispatch({ type: AuthActionTypes.LOGOUT });
        }
    };

    const register = async (
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        phone: string,
        country: string,
        city: string,
        userType: string
    ) => {
        console.log('Attempting to register with:', {
            email, password, firstName, lastName, phone, country, city, userType
        });
        dispatch({ type: AuthActionTypes.INITIAL });

        try {
            const response = await authServiceAxios.post(authEndpoints.register, {
                email,
                password,
                firstName,
                lastName,
                phone,
                country,
                city,
                userType,
            });
            console.log('Registration response received:', response.data);

            const { user, userId, accessToken } = response.data;

            dispatch({
                type: AuthActionTypes.REGISTER,
                payload: { user, userId, accessToken }, // Include accessToken in payload
            });
        } catch (error) {
            console.error('Registration error:', error);
            dispatch({ type: AuthActionTypes.LOGOUT });
        }
    };

    const logout = async () => {
        console.log('Attempting to logout');
        try {
            await authServiceAxios.post(authEndpoints.logout, {}, {
                headers: {
                    Authorization: `Bearer ${state.accessToken}` // Include accessToken in the Authorization header
                }
            });
            console.log('Logout successful');
            dispatch({ type: AuthActionTypes.LOGOUT });
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const setFormSubmitted = (submitted: boolean) => {
        console.log('Setting form submission status to:', submitted);
        dispatch({ type: AuthActionTypes.SET_FORM_SUBMITTED, payload: { formSubmitted: submitted } });
    };

    const value: AuthContextType = {
        user: state.user,
        loading: state.loading,
        authenticated: state.authenticated,
        unauthenticated: state.unauthenticated,
        formSubmitted: state.formSubmitted,
        userId: state.userId,
        accessToken: state.accessToken, // Add accessToken to context value
        login,
        register,
        logout,
        setFormSubmitted,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use authentication context
export const useAuth = () => {
    return useContext(AuthContext);
};
