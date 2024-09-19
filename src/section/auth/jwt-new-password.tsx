"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import OTP from "@/components/common/otp/Otp"; // Import the OTP component here

interface FormData {
  otp: string;
  newPassword: string;
  verifyPassword: string;
}

const JwtNewPassword: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    otp: "",
    newPassword: "",
    verifyPassword: "",
  });

  // Handle OTP changes
  const handleOTPChange = (value: string) => {
    setFormData({ ...formData, otp: value });
  };

  // Handle other input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Add form submission logic here (e.g., validate OTP, passwords, update password)
  };

  const handleResetOTP = () => {
    setFormData({ ...formData, otp: "" });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-md rounded-md">
      <h1 className="text-3xl font-bold mb-6">Reset Password</h1>
      <form onSubmit={handleSubmit}>
        {/* OTP Input */}
        <div className="mb-6 w-full flex flex-col gap-2">
          <Label className="mb-1">Enter OTP</Label>
          <div className="w-full">
            <OTP separator={<span>-</span>} value={formData.otp} onChange={handleOTPChange} length={6} />
            <span className="mt-2 text-sm">Entered value: {formData.otp}</span>
          </div>
        </div>

        {/* New Password Input */}
        <div className="mb-4 gap-2">
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

        {/* Confirm New Password Input */}
        <div className="mb-4 gap-2">
          <Label>Confirm New Password</Label>
          <Input
            type="password"
            name="verifyPassword"
            value={formData.verifyPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            className="w-full mt-2 p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Reset Password Button */}
        <Button type="submit" className="w-full">
          Set New Password
        </Button>

        {/* Reset OTP Button */}
        <Button
          type="button"
          onClick={handleResetOTP}
          className="w-full mt-2"
        >
          Reset OTP
        </Button>
      </form>
    </div>
  );
};

export default JwtNewPassword;
