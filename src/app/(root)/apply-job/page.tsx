'use client'

import * as React from "react";
import { useState } from "react";
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

export default function ApplyJob() {
  const [activeTab, setActiveTab] = useState('personalDetails');
  const [applicationData, setApplicationData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    linkedIn: '',
    portfolio: '',
    resume: null,
    coverLetter: null,
    additionalInfo: '',
  });

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (files) {
      setApplicationData((prev) => ({
        ...prev,
        [id]: files[0],
      }));
    } else {
      setApplicationData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleSubmit = () => {
    // Add your submission logic here, e.g., API call
    console.log(applicationData);
    toast({
      title: "Application Submitted",
      description: "Your job application has been successfully submitted.",
    });
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
                <Input id="firstName" placeholder="First Name" value={applicationData.firstName} onChange={handleChange} />
                <Input id="lastName" placeholder="Last Name" value={applicationData.lastName} onChange={handleChange} />
                <Input id="email" placeholder="Email" value={applicationData.email} onChange={handleChange} />
                <Input id="phone" placeholder="Phone Number" value={applicationData.phone} onChange={handleChange} />
              </form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={() => setActiveTab('resumeCoverLetter')}>Save & Next</Button>
            </CardFooter>
          </Card>
        );
      case 'resumeCoverLetter':
        return (
          <Card className="overflow-y-auto max-h-[calc(100vh-232px)]">
            <CardHeader>
              <CardTitle>Resume and Cover Letter</CardTitle>
              <CardDescription>Upload your resume and cover letter.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-4">
                <Label htmlFor="resume">Resume/CV</Label>
                <Input id="resume" type="file" onChange={handleChange} />
                <Label htmlFor="coverLetter">Cover Letter</Label>
                <Input id="coverLetter" type="file" onChange={handleChange} />
              </form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={() => setActiveTab('additionalInformation')}>Save & Next</Button>
            </CardFooter>
          </Card>
        );
      case 'additionalInformation':
        return (
          <Card className="overflow-y-auto max-h-[calc(100vh-232px)]">
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>Provide any additional information.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-4">
                <Input id="linkedIn" placeholder="LinkedIn Profile" value={applicationData.linkedIn} onChange={handleChange} />
                <Input id="portfolio" placeholder="Portfolio Website" value={applicationData.portfolio} onChange={handleChange} />
                <Input id="github" placeholder="GitHub Profile" value={applicationData.github} onChange={handleChange} />
                <Textarea id="additionalInfo" placeholder="Additional Information" value={applicationData.additionalInfo} onChange={handleChange} />
              </form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={handleSubmit}>Submit Application</Button>
            </CardFooter>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full w-full flex-col">
      <main className="flex flex-1 flex-col gap-2 md:gap-8">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Apply for Job</h1>
          <span>Fill out the form to apply for the job</span>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[1fr_180px] lg:grid-cols-[1fr_250px]">
          <div className="grid gap-6 overflow-y-auto h-[calc(100vh-200px)]">
            {renderCardContent()}
          </div>
          <nav className="grid gap-4 text-sm text-muted-foreground">
            <a href="#" onClick={() => setActiveTab('personalDetails')} className={`font-semibold ${activeTab === 'personalDetails' ? 'text-primary' : ''}`}>
              Personal Details
            </a>
            <a href="#" onClick={() => setActiveTab('resumeCoverLetter')} className={`${activeTab === 'resumeCoverLetter' ? 'text-primary' : ''}`}>
              Resume & Cover Letter
            </a>
            <a href="#" onClick={() => setActiveTab('additionalInformation')} className={`${activeTab === 'additionalInformation' ? 'text-primary' : ''}`}>
              Additional Information
            </a>
          </nav>
        </div>
      </main>
    </div>
  );
}
