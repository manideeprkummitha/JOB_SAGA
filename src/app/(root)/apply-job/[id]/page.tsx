'use client';

import * as React from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/auth/context/jwt/auth-provider'; // Adjust the import path as necessary
import { useParams } from 'next/navigation';

export default function ApplyJob() {
  const [activeTab, setActiveTab] = React.useState('personalDetails');
  const { userId } = useAuth();
  const params = useParams();
  const jobId = params.id;

  const [jobData, setJobData] = React.useState(null);
  const [error, setError] = React.useState(null);

  const [personalDetails, setPersonalDetails] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    linkedIn: "",
    portfolio: "",
  });

  const [additionalDetails, setAdditionalDetails] = React.useState({
    resume: null,
    coverLetter: null,
    additionalInfo: "",
    status: 'submitted', // Default status
  });

  React.useEffect(() => {
    if (jobId) {
      const fetchJobData = async () => {
        try {
          const response = await axios.get(`http://localhost:7004/api/jobs/${jobId}`);
          setJobData(response.data);
        } catch (err) {
          setError(err);
        }
      };
      fetchJobData();
    }
  }, [jobId]);

  const handleInputChange = (e, setStateFunc) => {
    const { id, value } = e.target;
    setStateFunc(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e, setStateFunc, key) => {
    const file = e.target.files[0];
    setStateFunc(prev => ({ ...prev, [key]: file }));
  };

  const handleApplyJob = async () => {
    if (!userId) {
      console.error('User is not authenticated');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('jobId', jobId);
      formData.append('authServiceId', userId); // Pass userId directly in the request body
      formData.append('firstName', personalDetails.firstName || '');
      formData.append('lastName', personalDetails.lastName || '');
      formData.append('email', personalDetails.email || '');
      formData.append('phone', personalDetails.phone || '');
      formData.append('linkedIn', personalDetails.linkedIn || '');
      formData.append('portfolio', personalDetails.portfolio || '');

      if (additionalDetails.resume) formData.append('resume', additionalDetails.resume);
      if (additionalDetails.coverLetter) formData.append('coverLetter', additionalDetails.coverLetter);
      formData.append('additionalInfo', additionalDetails.additionalInfo || '');
      formData.append('status', additionalDetails.status || 'submitted');
      formData.append('dateApplied', new Date());

      // Log FormData to check values
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await axios.post(`http://localhost:7004/api/apply`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Application response:', response.data);
    } catch (error) {
      console.error('Error applying for job:', error);
    }
  };

  const renderCardContent = () => {
    switch (activeTab) {
      case 'personalDetails':
        return (
          <Card className="overflow-y-auto max-h-[calc(100vh-232px)]">
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>Enter your personal details below.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-4">
                <Input id="firstName" placeholder="First Name" value={personalDetails.firstName} onChange={(e) => handleInputChange(e, setPersonalDetails)} />
                <Input id="lastName" placeholder="Last Name" value={personalDetails.lastName} onChange={(e) => handleInputChange(e, setPersonalDetails)} />
                <Input id="email" placeholder="Email Address" value={personalDetails.email} onChange={(e) => handleInputChange(e, setPersonalDetails)} />
                <Input id="phone" placeholder="Phone Number" value={personalDetails.phone} onChange={(e) => handleInputChange(e, setPersonalDetails)} />
                <Input id="linkedIn" placeholder="LinkedIn Profile URL" value={personalDetails.linkedIn} onChange={(e) => handleInputChange(e, setPersonalDetails)} />
                <Input id="portfolio" placeholder="Portfolio URL" value={personalDetails.portfolio} onChange={(e) => handleInputChange(e, setPersonalDetails)} />
              </form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={() => setActiveTab('additionalDetails')}>Save & Next</Button>
            </CardFooter>
          </Card>
        );
      case 'additionalDetails':
        return (
          <Card className="overflow-y-auto max-h-[calc(100vh-232px)]">
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
              <CardDescription>Upload your resume, cover letter, and any other attachments.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-4">
                <Label htmlFor="resume">Resume/CV</Label>
                <Input id="resume" type="file" onChange={(e) => handleFileChange(e, setAdditionalDetails, 'resume')} />
                <Label htmlFor="coverLetter">Cover Letter</Label>
                <Input id="coverLetter" type="file" onChange={(e) => handleFileChange(e, setAdditionalDetails, 'coverLetter')} />
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <Input id="additionalInfo" placeholder="Additional Information" value={additionalDetails.additionalInfo} onChange={(e) => handleInputChange(e, setAdditionalDetails)} />
              </form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={handleApplyJob}>Submit Application</Button>
            </CardFooter>
          </Card>
        );
      default:
        return null;
    }
  };

  if (error) return <p>Error loading job data: {error.message}</p>;
  if (!jobData) return <p>Loading...</p>;

  return (
    <div className="flex h-full w-full flex-col lg:p-6">
      <main className="flex flex-1 flex-col gap-2 md:gap-8">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Apply for {jobData?.data?.jobTitle || 'the Job'}</h1>
          <span>Fill out the form to apply for the position.</span>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[1fr_180px] lg:grid-cols-[1fr_250px]">
          <div className="grid gap-6 overflow-y-auto h-[calc(100vh-200px)]">
            {renderCardContent()}
          </div>
          <nav className="grid gap-4 text-sm text-muted-foreground">
            <a href="#" onClick={() => setActiveTab('personalDetails')} className={`font-semibold ${activeTab === 'personalDetails' ? 'text-primary' : ''}`}>
              Personal Details
            </a>
            <a href="#" onClick={() => setActiveTab('additionalDetails')} className={`${activeTab === 'additionalDetails' ? 'text-primary' : ''}`}>
              Additional Details
            </a>
          </nav>
        </div>
      </main>
    </div>
  );
}
