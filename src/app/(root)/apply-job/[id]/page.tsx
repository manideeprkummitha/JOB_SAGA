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
  console.log('Initial activeTab:', activeTab);

  const { userId } = useAuth();
  console.log('User ID from auth context:', userId);

  const params = useParams();
  const jobId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  console.log('Job ID from params:', jobId);


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
  console.log('Initial personalDetails:', personalDetails);

  const [additionalDetails, setAdditionalDetails] = React.useState({
    resumeUrl: "", // Updated to store the resume URL
    coverLetter: null,
    additionalInfo: "",
    status: 'submitted', // Default status
  });
  console.log('Initial additionalDetails:', additionalDetails);

  React.useEffect(() => {
    if (jobId) {
      console.log('Fetching job data for jobId:', jobId);
      const fetchJobData = async () => {
        try {
          const response = await axios.get(`http://localhost:7004/api/jobs/${jobId}`);
          console.log('Job data fetched:', response.data);
          setJobData(response.data);
        } catch (err:any) {
          console.error('Error fetching job data:', err);
          setError(err);
        }
      };
      fetchJobData();
    }
  }, [jobId]);

  const handleInputChange = (e, setStateFunc) => {
    const { id, value } = e.target;
    console.log(`Input changed - ID: ${id}, Value: ${value}`);
    setStateFunc(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = async (e, setStateFunc, key) => {
    const file = e.target.files[0];
    console.log(`File selected - Key: ${key}, File Name: ${file.name}`);
  
    if (key === 'resumeUrl') {
      // Upload the resume to the resume API
      console.log('Uploading resume to the resume API');
      try {
        const formData = new FormData();
        formData.append('resume', file); // Attach the file
        formData.append('resumeName', file.name); // Attach the file name
  
        // Send the file and file name to the resume upload API
        const response = await axios.post(`http://localhost:7005/api/resumes`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        // Get the URL of the uploaded resume
        console.log('Resume uploaded successfully. Response:', response);
        const resumeUrl = response.data.resumeDocument;
        console.log('Resume uploaded successfully. URL:', resumeUrl);
  
        // Store the resume URL and name in the state
        setAdditionalDetails(prev => ({ ...prev, resumeUrl, resumeName: file.name }));
  
      } catch (error) {
        console.error('Error uploading resume:', error);
      }
    } else {
      // For other files like cover letter
      console.log('Storing file locally in state for key:', key);
      setStateFunc(prev => ({ ...prev, [key]: file }));
    }
  };
  
  

  const handleApplyJob = async () => {
    if (!userId) {
      console.error('User is not authenticated');
      return;
    }
  
    try {
      console.log('Submitting job application');
  
      const formData = new FormData();
      formData.append('jobId', jobId);
      formData.append('authServiceId', userId); // Pass userId directly in the request body
      formData.append('firstName', personalDetails.firstName || '');
      formData.append('lastName', personalDetails.lastName || '');
      formData.append('email', personalDetails.email || '');
      formData.append('phone', personalDetails.phone || '');
      formData.append('linkedIn', personalDetails.linkedIn || '');
      formData.append('portfolio', personalDetails.portfolio || '');
  
      // Include the resume URL and resume name
      formData.append('resumeUrl', additionalDetails.resumeUrl || '');
      formData.append('resumeName', additionalDetails.resumeName || '');
      if (additionalDetails.coverLetter) formData.append('coverLetter', additionalDetails.coverLetter);
      formData.append('additionalInfo', additionalDetails.additionalInfo || '');
      formData.append('status', additionalDetails.status || 'submitted');
      formData.append('dateApplied', new Date());
  
      // Log FormData to check values
      console.log('FormData to be submitted:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
  
      const response = await axios.post(`http://localhost:7004/api/apply`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Application response:', response.data);
    } catch (error) {
      console.error('Error applying for job:', error);
    }
  };
  
  

  const renderCardContent = () => {
    console.log('Rendering card content for activeTab:', activeTab);
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
              <Button onClick={() => {
                console.log('Navigating to additionalDetails tab');
                setActiveTab('additionalDetails');
              }}>Save & Next</Button>
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
                <Input id="resume" type="file" onChange={(e) => handleFileChange(e, setAdditionalDetails, 'resumeUrl')} />
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
        console.log('No matching tab for activeTab:', activeTab);
        return null;
    }
  };

  if (error) {
    console.error('Error rendering ApplyJob component:', error.message);
    return <p>Error loading job data: {error.message}</p>;
  }
  if (!jobData) {
    console.log('Job data is loading...');
    return <p>Loading...</p>;
  }

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
            <a href="#" onClick={() => {
              console.log('Navigating to personalDetails tab');
              setActiveTab('personalDetails');
            }} className={`font-semibold ${activeTab === 'personalDetails' ? 'text-primary' : ''}`}>
              Personal Details
            </a>
            <a href="#" onClick={() => {
              console.log('Navigating to additionalDetails tab');
              setActiveTab('additionalDetails');
            }} className={`${activeTab === 'additionalDetails' ? 'text-primary' : ''}`}>
              Additional Details
            </a>
          </nav>
        </div>
      </main>
    </div>
  );
}
