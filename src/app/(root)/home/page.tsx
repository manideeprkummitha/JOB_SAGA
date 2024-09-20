'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/auth/context/jwt/auth-provider'; // Adjust the import path if necessary
import JobSeekerDashboard from '../job-seekers-dashboard/page';
import RecruiterDashboard from '../recruiters-dashboard/page';
import { AlertCircle, Loader } from 'lucide-react'; // Lucide icons
import axios from 'axios';
import { Button } from '@/components/ui/button';

const Home = () => {
  const { accessToken } = useAuth();
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching user data...");

    const fetchUserData = async () => {
      try {
        console.log("Access token:", accessToken);

        const response = await axios.get(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_API}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log("User data response:", response.data);

        setUserType(response.data.user.userType);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        console.log("Finished fetching user data");
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchUserData();
    } else {
      console.log("No access token found");
      setLoading(false);
    }
  }, [accessToken]);

  if (loading) {
    console.log("Loading state:", loading);
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">
          <Loader className="size-5 animate-spin text-muted-foreground"/>
        </div>
      </div>
    );
  }

  console.log("User type:", userType);

  return (
    <div className="lg:p-6">
      {userType === 'job seeker' ? (
        <>
          <JobSeekerDashboard />
        </>
      ) : userType === 'recruiter' ? (
        <>
          <RecruiterDashboard />
        </>
      ) : (
        <div className="flex flex-col items-center w-full justify-center h-full text-center">
          <AlertCircle className="h-10 w-10 text-yellow-500 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Profile Incomplete</h2>
          <p className="text-lg mb-4">
            Please update your profile to gain access to the dashboard.
          </p>
          <Button variant={'default'} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Update Profile
          </Button>
        </div>
      )}
    </div>
  );
};

export default Home;
