'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/auth/context/jwt/auth-provider'; // Adjust the import path as needed

export function LoginForm() {
  const { login, loading, authenticated } = useAuth(); // Destructure the login function and state from useAuth
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    console.log('Component mounted');
    setIsMounted(true); // Ensure the component is mounted
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    setError(null); // Reset error state

    try {
      console.log('Attempting to log in with:', { email, password });
      await login(email, password); // Call the login function from AuthProvider
      console.log('Login successful');
      // Redirect to /home after successful login
      router.push('/home');
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.'); // Set error message to display
    }
  };

  if (!isMounted || authenticated) {
    console.log('Component not mounted or already authenticated');
    return null; // Prevent rendering the form if not mounted or authenticated
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => {
                  console.log('Email changed:', e.target.value);
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => {
                  console.log('Password changed:', e.target.value);
                  setPassword(e.target.value);
                }}
              />
            </div>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <a href="/register" className="underline">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
