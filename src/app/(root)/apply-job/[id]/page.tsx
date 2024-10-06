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
import {Loader} from "lucide-react"
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
    resumeFile: null, 
    resumeName: "",
    resumeUrl: "",
    coverLetter: null,
    status: 'applied',
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
        } catch (err) {
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

  const handleFileChange = (e, setStateFunc, key) => {
    const file = e.target.files[0];
    console.log(`File selected - Key: ${key}, File Name: ${file.name}`);

    if (key === 'resumeFile') {
      console.log('Storing resume file in state.');
      setStateFunc(prev => ({ ...prev, resumeFile: file, resumeName: file.name }));
    } else if (key === 'coverLetter') {
      console.log('Storing cover letter in state.');
      setStateFunc(prev => ({ ...prev, coverLetter: file }));
    }
  };

  const handleApplyJob = async () => {
    console.log('Starting job application process...');
  
    // Log the userId to verify if it's available
    console.log('User ID before submitting application:', userId);
  
    if (!userId) {
      console.error('User is not authenticated');
      return;
    }
  
    try {
      // Step 1: Upload the resume to the resume API if a file is provided
      let resumeUrl = additionalDetails.resumeUrl;
      let resumeName = additionalDetails.resumeName;
  
      if (additionalDetails.resumeFile) {
        console.log('Uploading resume to the resume API...');
        const formData = new FormData();
        formData.append('resume', additionalDetails.resumeFile); // Attach the file object
        formData.append('resumeName', additionalDetails.resumeName); // Attach the file name
  
        // Add additional fields for the resume API
        formData.append('authServiceId', userId); // Double-check userId
        formData.append('jobPosition', jobData?.data?.jobTitle || ''); // Add job position if available
        formData.append('company', jobData?.data?.company?.name || ''); // Add company name if available
  
        try {
          const uploadResponse = await axios.post(`http://localhost:7005/api/resumes`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log('Resume upload response:', uploadResponse.data);
  
          // Step 2: Capture the resume details from the resume API response
          resumeUrl = uploadResponse.data.resumeDocument;
          resumeName = uploadResponse.data.resumeName;
          console.log('Resume URL:', resumeUrl);
          console.log('Resume Name:', resumeName);
        } catch (uploadError) {
          console.error('Error uploading resume:', uploadError);
          return; // Exit if resume upload fails
        }
      }
  
      // Step 3: Prepare job application form data with the resume details
      console.log('Proceeding to job application submission...');
      const applicationFormData = new FormData();
      applicationFormData.append('jobId', jobId);
      applicationFormData.append('authServiceId', userId); // Append userId to the form data
      applicationFormData.append('firstName', personalDetails.firstName || '');
      applicationFormData.append('lastName', personalDetails.lastName || '');
      applicationFormData.append('email', personalDetails.email || '');
      applicationFormData.append('phone', personalDetails.phone || '');
      applicationFormData.append('linkedIn', personalDetails.linkedIn || '');
      applicationFormData.append('portfolio', personalDetails.portfolio || '');
      applicationFormData.append('resumeUrl', resumeUrl);
      applicationFormData.append('resumeName', resumeName);
  
      if (additionalDetails.coverLetter) {
        console.log('Attaching cover letter to form data.');
        applicationFormData.append('coverLetter', additionalDetails.coverLetter);
      }
  
      applicationFormData.append('status', additionalDetails.status || 'submitted');
  
      // Log formData to verify all entries before sending
      console.log('FormData to be submitted to the job application API:');
      for (let [key, value] of applicationFormData.entries()) {
        console.log(`${key}: ${value}`);
      }
  
      // Step 4: Submit job application with the resume details
      console.log('Sending job application to API...');
      const response = await axios.post(`http://localhost:7004/api/apply`, applicationFormData, {
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
                <Input id="resume" type="file" onChange={(e) => handleFileChange(e, setAdditionalDetails, 'resumeFile')} />
                <Label htmlFor="coverLetter">Cover Letter</Label>
                <Input id="coverLetter" type="file" onChange={(e) => handleFileChange(e, setAdditionalDetails, 'coverLetter')} />
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
    return (
      <div className="flex items-center justify-center">
        <Loader className="animate-spin text-muted-foreground size-5"/>
      </div>
    );
  }
  if (!jobData) {
    console.log('Job data is loading...');
    return (
      <div className="flex items-center justify-center">
        <Loader className="animate-spin text-muted-foreground size-5"/>
      </div>
    );
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
