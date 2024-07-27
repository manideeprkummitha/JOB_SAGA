'use client'
// context/auth/auth-context.tsx
import { createContext } from 'react';
import { AuthContextType } from '../../types';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  authenticated: false,
  unauthenticated: true,
  formSubmitted: false,
  userId: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  setFormSubmitted: () => {},
});
