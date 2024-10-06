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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function AddAJob() {
  const [activeTab, setActiveTab] = React.useState('jobDetails');
  const { userId } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [jobDetails, setJobDetails] = React.useState({
    jobPosition: "",
    company: "",
    companyWebsite: "",
    jobLocation: "",
    jobPostingUrl: "",
    salaryRange: { min: "", max: "" },
  });

  const [combinedDetails, setCombinedDetails] = React.useState({
    applicationStatus: "",
    dateApplied: "",
    followUpDate: "",
    contactPerson: "",
    contactPersonEmail: "",
    contactPersonPhone: "",
    interviewDate: "",
    interviewTime: "",
    interviewLocation: "",
    interviewerName: "",
    interviewNotes: "",
    resume: null,
    coverLetter: null,
    notes: "",
    attachments: [],
    status: 'draft', // Default status
  });

  const handleInputChange = (e, setStateFunc) => {
    const { id, value } = e.target;
    setStateFunc(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e, setStateFunc, key) => {
    const file = e.target.files[0];
    setStateFunc(prev => ({ ...prev, [key]: file }));
  };

  const handleSaveJob = async () => {
    if (!userId) {
      console.error('User is not authenticated');
      return;
    }

    try {
      const formData = {
        jobPosition: jobDetails.jobPosition || 'Unknown Position',
        company: jobDetails.company || 'Unknown Company',
        salaryRange: jobDetails.salaryRange || { min: 0, max: 0 },
        location: jobDetails.jobLocation || 'Unknown Location',
        status: combinedDetails.status || 'draft',
        dateApplied: combinedDetails.dateApplied || null,
        followUp: combinedDetails.followUpDate || null,
      };

      console.log(`Saving job tracking entry with authServiceId: ${userId}`);

      const response = await axios.post(`http://localhost:7004/api/tracking/user/${userId}/add`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      toast({
        title: "Job Added Successfully",
        description: "The job has been added to the job tracking system.",
      });

      console.log('Save response:', response.data);

      router.push('/track-job');

    } catch (error) {
      console.error('Error saving job:', error);
      toast({
        title: "Error",
        description: "There was an error adding the job.",
        variant: "destructive",
      });
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
                <Input id="jobPosition" placeholder="Job Position" value={jobDetails.jobPosition} onChange={(e) => handleInputChange(e, setJobDetails)} />
                <Input id="company" placeholder="Company Name" value={jobDetails.company} onChange={(e) => handleInputChange(e, setJobDetails)} />
                <Input id="companyWebsite" placeholder="Company Website" value={jobDetails.companyWebsite} onChange={(e) => handleInputChange(e, setJobDetails)} />
                <Input id="jobLocation" placeholder="Job Location" value={jobDetails.jobLocation} onChange={(e) => handleInputChange(e, setJobDetails)} />
                <Input id="jobPostingUrl" placeholder="Job Posting URL" value={jobDetails.jobPostingUrl} onChange={(e) => handleInputChange(e, setJobDetails)} />
                <div className="flex gap-4">
                  <Input id="salaryRangeMin" placeholder="Min Salary" value={jobDetails.salaryRange.min} onChange={(e) => handleInputChange(e, (newVal) => setJobDetails(prev => ({ ...prev, salaryRange: { ...prev.salaryRange, min: newVal.salaryRangeMin } })))} />
                  <Input id="salaryRangeMax" placeholder="Max Salary" value={jobDetails.salaryRange.max} onChange={(e) => handleInputChange(e, (newVal) => setJobDetails(prev => ({ ...prev, salaryRange: { ...prev.salaryRange, max: newVal.salaryRangeMax } })))} />
                </div>
              </form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={() => setActiveTab('combinedDetails')}>Save & Next</Button>
            </CardFooter>
          </Card>
        );
      case 'combinedDetails':
        return (
          <Card className="overflow-y-auto max-h-[calc(100vh-200px)]">
            <CardHeader>
              <CardTitle>Application, Interview & Additional Details</CardTitle>
              <CardDescription>Enter all remaining details below.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-4">
                {/* Application Details */}
                <Select
                  onValueChange={(value) => {
                    setCombinedDetails((prevState) => ({
                      ...prevState,
                      applicationStatus: value,
                    }));
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Application Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Label htmlFor="dateApplied">Application End Date</Label>
                <Input id="dateApplied" type="date" value={combinedDetails.dateApplied} onChange={(e) => handleInputChange(e, setCombinedDetails)} />

                {/* Interview Details */}
                <Label htmlFor="interviewDate">Interview Date</Label>
                <Input id="interviewDate" type="date" value={combinedDetails.interviewDate} onChange={(e) => handleInputChange(e, setCombinedDetails)} />
                <Input id="interviewTime" placeholder="Interview Time" value={combinedDetails.interviewTime} onChange={(e) => handleInputChange(e, setCombinedDetails)} />
                <Input id="interviewLocation" placeholder="Interview Location" value={combinedDetails.interviewLocation} onChange={(e) => handleInputChange(e, setCombinedDetails)} />

                {/* Additional Details */}
                <Label htmlFor="resume">Resume/CV</Label>
                <Input id="resume" type="file" onChange={(e) => handleFileChange(e, setCombinedDetails, 'resume')} />
                {/* <Label htmlFor="coverLetter">Cover Letter</Label>
                <Input id="coverLetter" type="file" onChange={(e) => handleFileChange(e, setCombinedDetails, 'coverLetter')} /> */}
              </form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={handleSaveJob}>Submit</Button>
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
            <a href="#" onClick={() => setActiveTab('combinedDetails')} className={`${activeTab === 'combinedDetails' ? 'text-primary' : ''}`}>
              Application, Interview & Additional Details
            </a>
          </nav>
        </div>
      </main>
    </div>
  );
}
