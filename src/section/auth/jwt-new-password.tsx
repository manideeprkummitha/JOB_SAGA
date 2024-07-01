"use client"
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface FormData {
  newPassword: string;
  verifyPassword: string;
}

const JwtNewPassword: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    newPassword: '',
    verifyPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Add form submission logic here (e.g., validate passwords, update password)
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-6">New Password</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label>New Password</Label>
          <Input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            className="w-full mt-2 p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <Label>Verify Password</Label>
          <Input
            type="password"
            name="verifyPassword"
            value={formData.verifyPassword}
            onChange={handleChange}
            placeholder="Verify new password"
            className="w-full mt-2 p-2 border border-gray-300 rounded"
          />
        </div>
        <Button type="submit" className="w-full mt-4 p-2 bg-blue-500 text-white rounded">
          Set New Password
        </Button>
      </form>
    </div>
  );
};

export default JwtNewPassword;
