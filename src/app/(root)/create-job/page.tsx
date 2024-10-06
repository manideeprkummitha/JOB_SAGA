'use client';
import * as React from "react";
import { useState } from "react";
import axios from 'axios';
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/auth/context/jwt/auth-provider"; // Assuming this provides the auth token

export default function CreateNewJob() {
  const { accessToken } = useAuth(); // Get access token from context
  const [activeTab, setActiveTab] = useState('companyJobDetails');
  const [jobData, setJobData] = useState({
    jobTitle: '',
    jobDescription: '',
    jobRequirements: '',
    workSchedule: '',
    workLocation: '',
    jobType: '',
    company: {
      name: '',
      industry: '',
      size: '',
      location: '',
    },
    salaryRange: {
      min: 0,
      max: 0,
    },
    benefits: '',
    perks: '',
    vacationLeave: '',
    incentives: '',
    workLifeBalance: '',
    recruiterId: '', // This should be set with the recruiter’s ID
    status: 'open', // Default status set to 'open'
    applicants: [], // To be filled with applicant IDs
    interestingApplicants: [], // To be filled with interesting applicant IDs
  });

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (files) {
      setJobData((prev) => ({
        ...prev,
        [id]: files.length > 1 ? Array.from(files) : files[0],
      }));
    } else {
      if (id.includes('.')) {
        // Handling nested fields like company details and salary range
        const [field, subField] = id.split('.');
        setJobData((prev) => ({
          ...prev,
          [field]: {
            ...prev[field],
            [subField]: value,
          }
        }));
      } else {
        setJobData((prev) => ({
          ...prev,
          [id]: value,
        }));
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await axios.post('http://localhost:7004/api/jobs', jobData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log(response.data); // Handle success response
      toast({
        title: "Job Submitted",
        description: "The job has been successfully created.",
      });
    } catch (error) {
      console.error('Error submitting job:', error.response?.data || error.message);
      toast({
        title: "Submission Error",
        description: error.response?.data.message || "An error occurred while submitting the job.",
      });
    }
  };

  const renderCardContent = () => {
    switch (activeTab) {
      case 'companyJobDetails':
        return (
          <Card className="overflow-y-auto max-h-[calc(100vh-232px)]">
            <CardHeader>
              <CardTitle>Company and Job Details</CardTitle>
              <CardDescription>Enter the company and job details below.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-4">
                <Input id="jobTitle" placeholder="Job Title" value={jobData.jobTitle} onChange={handleChange} />
                <Textarea id="jobDescription" placeholder="Job Description" value={jobData.jobDescription} onChange={handleChange} />
                <Textarea id="jobRequirements" placeholder="Job Requirements" value={jobData.jobRequirements} onChange={handleChange} />
                <Input id="workSchedule" placeholder="Work Schedule" value={jobData.workSchedule} onChange={handleChange} />
                <Input id="workLocation" placeholder="Work Location" value={jobData.workLocation} onChange={handleChange} />
                <Input id="jobType" placeholder="Job Type (e.g., Full-time, Part-time)" value={jobData.jobType} onChange={handleChange} />
              </form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={() => setActiveTab('companyDetails')}>Save & Next</Button>
            </CardFooter>
          </Card>
        );
      case 'companyDetails':
        return (
          <Card className="overflow-y-auto max-h-[calc(100vh-232px)]">
            <CardHeader>
              <CardTitle>Company Details</CardTitle>
              <CardDescription>Enter the company details below.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-4">
                <Input id="company.name" placeholder="Company Name" value={jobData.company.name} onChange={handleChange} />
                <Input id="company.industry" placeholder="Industry" value={jobData.company.industry} onChange={handleChange} />
                <Input id="company.size" placeholder="Company Size" value={jobData.company.size} onChange={handleChange} />
                <Input id="company.location" placeholder="Company Location" value={jobData.company.location} onChange={handleChange} />
              </form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={() => setActiveTab('compensationDetails')}>Save & Next</Button>
            </CardFooter>
          </Card>
        );
      case 'compensationDetails':
        return (
          <Card className="overflow-y-auto max-h-[calc(100vh-232px)]">
            <CardHeader>
              <CardTitle>Compensation and Benefits</CardTitle>
              <CardDescription>Enter the compensation and benefits details below.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-4">
                <Label>Salary Range</Label>
                <div className="flex gap-4 items-center justify-between w-full">
                  <div className="flex flex-col gap-2 items-start justify-start w-[50%]">
                    <Label>Min Salary</Label>
                    <Input id="salaryRange.min" placeholder="Minimum Salary" type="number" value={jobData.salaryRange.min} onChange={handleChange} />
                  </div>
                  <div className="flex flex-col gap-2 items-start justify-start w-[50%]">
                    <Label>Max Salary</Label>
                    <Input id="salaryRange.max" placeholder="Maximum Salary" type="number" value={jobData.salaryRange.max} onChange={handleChange} />
                  </div>
                </div>
                <Textarea id="benefits" placeholder="Benefits" value={jobData.benefits} onChange={handleChange} />
                <Textarea id="perks" placeholder="Perks" value={jobData.perks} onChange={handleChange} />
                <Textarea id="incentives" placeholder="Incentives" value={jobData.incentives} onChange={handleChange} />
                <Textarea id="workLifeBalance" placeholder="Work-Life Balance" value={jobData.workLifeBalance} onChange={handleChange} />
              </form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={handleSubmit}>Submit</Button>
            </CardFooter>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full w-full flex-col lg:p-6">
      <main className="flex flex-1 flex-col gap-2 md:gap-8">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Create a New Job</h1>
          <span>Fill out the form to create a new job listing</span>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[1fr_180px] lg:grid-cols-[1fr_250px]">
          <div className="grid gap-6 overflow-y-auto h-[calc(100vh-200px)]">
            {renderCardContent()}
          </div>
          <nav className="grid gap-4 text-sm text-muted-foreground">
            <a href="#" onClick={() => setActiveTab('companyJobDetails')} className={`font-semibold ${activeTab === 'companyJobDetails' ? 'text-primary' : ''}`}>
              Company & Job Details
            </a>
            <a href="#" onClick={() => setActiveTab('companyDetails')} className={`${activeTab === 'companyDetails' ? 'text-primary' : ''}`}>
              Company Details
            </a>
            <a href="#" onClick={() => setActiveTab('compensationDetails')} className={`${activeTab === 'compensationDetails' ? 'text-primary' : ''}`}>
              Compensation & Benefits
            </a>
          </nav>
        </div>
      </main>
    </div>
  );
}
