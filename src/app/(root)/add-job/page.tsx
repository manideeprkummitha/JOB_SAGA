'use client'

import * as React from "react";
import axios from "axios";
import Link from "next/link";
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

export default function AddAJob() {
  const [activeTab, setActiveTab] = React.useState('jobDetails');
  const { userId } = useAuth();

  const authServiceId = userId;
  
  const [jobDetails, setJobDetails] = React.useState({
    jobTitle: "",
    companyName: "",
    companyWebsite: "",
    jobLocation: "",
    jobPostingUrl: "",
  });

  const [applicationDetails, setApplicationDetails] = React.useState({
    applicationStatus: "",
    applicationDate: "",
    followUpDate: "",
    contactPerson: "",
    contactPersonEmail: "",
    contactPersonPhone: "",
  });

  const [interviewDetails, setInterviewDetails] = React.useState({
    interviewDate: "",
    interviewTime: "",
    interviewLocation: "",
    interviewerName: "",
    interviewNotes: "",
  });

  const [additionalDetails, setAdditionalDetails] = React.useState({
    resume: null,
    coverLetter: null,
    notes: "",
    attachments: [],
  });

  const handleInputChange = (e, setStateFunc) => {
    const { id, value } = e.target;
    setStateFunc(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e, setStateFunc, key) => {
    const file = e.target.files[0];
    setStateFunc(prev => ({ ...prev, [key]: file }));
  };

  const handleFormSubmit = async () => {
    const formData = new FormData();
    formData.append('jobTitle', jobDetails.jobTitle);
    formData.append('companyName', jobDetails.companyName);
    formData.append('companyWebsite', jobDetails.companyWebsite);
    formData.append('jobLocation', jobDetails.jobLocation);
    formData.append('jobPostingUrl', jobDetails.jobPostingUrl);

    formData.append('applicationStatus', applicationDetails.applicationStatus);
    formData.append('applicationDate', applicationDetails.applicationDate);
    formData.append('followUpDate', applicationDetails.followUpDate);
    formData.append('contactPerson', applicationDetails.contactPerson);
    formData.append('contactPersonEmail', applicationDetails.contactPersonEmail);
    formData.append('contactPersonPhone', applicationDetails.contactPersonPhone);

    formData.append('interviewDate', interviewDetails.interviewDate);
    formData.append('interviewTime', interviewDetails.interviewTime);
    formData.append('interviewLocation', interviewDetails.interviewLocation);
    formData.append('interviewerName', interviewDetails.interviewerName);
    formData.append('interviewNotes', interviewDetails.interviewNotes);

    if (additionalDetails.resume) formData.append('resume', additionalDetails.resume);
    if (additionalDetails.coverLetter) formData.append('coverLetter', additionalDetails.coverLetter);
    formData.append('notes', additionalDetails.notes);
    additionalDetails.attachments.forEach((file, index) => {
      formData.append(`attachments[${index}]`, file);
    });

    try {
      const response = await axios.post(`http://localhost:7004/api/tracking/user/${authServiceId}/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Job tracking entry added:', response.data);
    } catch (error) {
      console.error('Error adding job tracking entry:', error);
    }
  };

  const renderCardContent = () => {
    switch (activeTab) {
      case 'jobDetails':
        return (
          <Card className="overflow-y-auto max-h-[calc(100vh-232px)]">
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>Enter the job details below.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-4">
                <Input id="jobTitle" placeholder="Job Title" value={jobDetails.jobTitle} onChange={(e) => handleInputChange(e, setJobDetails)} />
                <Input id="companyName" placeholder="Company Name" value={jobDetails.companyName} onChange={(e) => handleInputChange(e, setJobDetails)} />
                <Input id="companyWebsite" placeholder="Company Website" value={jobDetails.companyWebsite} onChange={(e) => handleInputChange(e, setJobDetails)} />
                <Input id="jobLocation" placeholder="Job Location" value={jobDetails.jobLocation} onChange={(e) => handleInputChange(e, setJobDetails)} />
                <Input id="jobPostingUrl" placeholder="Job Posting URL" value={jobDetails.jobPostingUrl} onChange={(e) => handleInputChange(e, setJobDetails)} />
              </form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={() => setActiveTab('applicationDetails')}>Save & Next</Button>
            </CardFooter>
          </Card>
        );
      case 'applicationDetails':
        return (
          <Card className="overflow-y-auto max-h-[calc(100vh-200px)]">
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
              <CardDescription>Enter the application details below.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-4">
                <Input id="applicationStatus" placeholder="Application Status" value={applicationDetails.applicationStatus} onChange={(e) => handleInputChange(e, setApplicationDetails)} />
                <Label htmlFor="applicationDate">Application Date</Label>
                <Input id="applicationDate" type="date" value={applicationDetails.applicationDate} onChange={(e) => handleInputChange(e, setApplicationDetails)} />
                <Label htmlFor="followUpDate">Follow-Up Date</Label>
                <Input id="followUpDate" type="date" value={applicationDetails.followUpDate} onChange={(e) => handleInputChange(e, setApplicationDetails)} />
                <Input id="contactPerson" placeholder="Contact Person" value={applicationDetails.contactPerson} onChange={(e) => handleInputChange(e, setApplicationDetails)} />
                <Input id="contactPersonEmail" placeholder="Contact Person Email" value={applicationDetails.contactPersonEmail} onChange={(e) => handleInputChange(e, setApplicationDetails)} />
                <Input id="contactPersonPhone" placeholder="Contact Person Phone" value={applicationDetails.contactPersonPhone} onChange={(e) => handleInputChange(e, setApplicationDetails)} />
              </form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={() => setActiveTab('interviewDetails')}>Save & Next</Button>
            </CardFooter>
          </Card>
        );
      case 'interviewDetails':
        return (
          <Card className="overflow-y-auto max-h-[calc(100vh-200px)]">
            <CardHeader>
              <CardTitle>Interview Details (if applicable)</CardTitle>
              <CardDescription>Enter the interview details below.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-4">
                <Label htmlFor="interviewDate">Interview Date</Label>
                <Input id="interviewDate" type="date" value={interviewDetails.interviewDate} onChange={(e) => handleInputChange(e, setInterviewDetails)} />
                <Input id="interviewTime" placeholder="Interview Time" value={interviewDetails.interviewTime} onChange={(e) => handleInputChange(e, setInterviewDetails)} />
                <Input id="interviewLocation" placeholder="Interview Location" value={interviewDetails.interviewLocation} onChange={(e) => handleInputChange(e, setInterviewDetails)} />
                <Input id="interviewerName" placeholder="Interviewer Name" value={interviewDetails.interviewerName} onChange={(e) => handleInputChange(e, setInterviewDetails)} />
                <Input id="interviewNotes" placeholder="Interview Notes" value={interviewDetails.interviewNotes} onChange={(e) => handleInputChange(e, setInterviewDetails)} />
              </form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={() => setActiveTab('additionalDetails')}>Save & Next</Button>
            </CardFooter>
          </Card>
        );
      case 'additionalDetails':
        return (
          <Card className="overflow-y-auto max-h-[calc(100vh-200px)]">
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
              <CardDescription>Enter any additional details below.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-4">
                <Label htmlFor="resume">Resume/CV</Label>
                <Input id="resume" type="file" onChange={(e) => handleFileChange(e, setAdditionalDetails, 'resume')} />
                <Label htmlFor="coverLetter">Cover Letter</Label>
                <Input id="coverLetter" type="file" onChange={(e) => handleFileChange(e, setAdditionalDetails, 'coverLetter')} />
                <Label htmlFor="notes">Notes</Label>
                <Input id="notes" placeholder="Notes" value={additionalDetails.notes} onChange={(e) => handleInputChange(e, setAdditionalDetails)} />
                <Label htmlFor="attachments">Attachments</Label>
                <Input id="attachments" type="file" onChange={(e) => handleFileChange(e, setAdditionalDetails, 'attachments')} multiple />
              </form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={handleFormSubmit}>Submit</Button>
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
          <h1 className="text-3xl font-semibold">Add a Job</h1>
          <span>Add a job you're interested in to be tracked</span>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[1fr_180px] lg:grid-cols-[1fr_250px]">
          <div className="grid gap-6 overflow-y-auto h-[calc(100vh-200px)]">
            {renderCardContent()}
          </div>
          <nav className="grid gap-4 text-sm text-muted-foreground">
            <a href="#" onClick={() => setActiveTab('jobDetails')} className={`font-semibold ${activeTab === 'jobDetails' ? 'text-primary' : ''}`}>
              Job Details
            </a>
            <a href="#" onClick={() => setActiveTab('applicationDetails')} className={`${activeTab === 'applicationDetails' ? 'text-primary' : ''}`}>
              Application Details
            </a>
            <a href="#" onClick={() => setActiveTab('interviewDetails')} className={`${activeTab === 'interviewDetails' ? 'text-primary' : ''}`}>
              Interview Details
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
