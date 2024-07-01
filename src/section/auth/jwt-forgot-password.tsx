// ForgotPasswordOTP.tsx
"use client"
import React, { useState } from 'react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const JwtForgotPassword: React.FC = () => {
  const [otp, setOTP] = useState<string>('');

  const handleOTPChange = (otpValue: string) => {
    setOTP(otpValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('OTP entered:', otp);
    // Add OTP verification logic here
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-6">Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label>Enter OTP</Label>
          <div className="relative w-full">
            <InputOTP maxLength={6} onChange={handleOTPChange} className="w-full">
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>
        <Button type="submit" className="w-full mt-4 p-2 bg-blue-500 text-white rounded">
          Verify OTP
        </Button>
      </form>
    </div>
  );
};

export default JwtForgotPassword;
