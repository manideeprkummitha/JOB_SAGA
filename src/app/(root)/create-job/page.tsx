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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CreateNewJob() {
  const [activeTab, setActiveTab] = useState('companyJobDetails');
  const [jobData, setJobData] = useState({
    jobTitle: '',
    companyName: '',
    companyWebsite: '',
    jobLocation: '',
    jobDescription: '',
    jobRequirements: '',
    jobType: '',
    salaryRange: '',
    skills: [],
    applicationStatus: '',
    applicationDate: '',
    followUpDate: '',
    contactPerson: '',
    contactPersonEmail: '',
    contactPersonPhone: '',
    interviewDate: '',
    interviewTime: '',
    interviewLocation: '',
    interviewerName: '',
    interviewNotes: '',
    resume: null,
    coverLetter: null,
    notes: '',
    attachments: [],
  });

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (files) {
      setJobData((prev) => ({
        ...prev,
        [id]: files.length > 1 ? Array.from(files) : files[0],
      }));
    } else {
      setJobData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleSkillChange = (index, value) => {
    setJobData((prev) => {
      const updatedSkills = [...prev.skills];
      updatedSkills[index] = value;
      return { ...prev, skills: updatedSkills };
    });
  };

  const addSkill = () => {
    setJobData((prev) => ({ ...prev, skills: [...prev.skills, ""] }));
  };

  const handleSubmit = () => {
    // Add your submission logic here, e.g., API call
    console.log(jobData);
    toast({
      title: "Job Submitted",
      description: "The job has been successfully created.",
    });
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
                <Input id="companyName" placeholder="Company Name" value={jobData.companyName} onChange={handleChange} />
                <Input id="companyWebsite" placeholder="Company Website" value={jobData.companyWebsite} onChange={handleChange} />
                <Input id="jobLocation" placeholder="Job Location" value={jobData.jobLocation} onChange={handleChange} />
                <Textarea id="jobDescription" placeholder="Job Description" value={jobData.jobDescription} onChange={handleChange} />
                <Textarea id="jobRequirements" placeholder="Job Requirements" value={jobData.jobRequirements} onChange={handleChange} />
                <Input id="jobType" placeholder="Job Type (e.g., Full-time, Part-time)" value={jobData.jobType} onChange={handleChange} />
                <Input id="salaryRange" placeholder="Salary Range" value={jobData.salaryRange} onChange={handleChange} />
              </form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={() => setActiveTab('skillsRequired')}>Save & Next</Button>
            </CardFooter>
          </Card>
        );
      case 'skillsRequired':
        return (
          <Card className="overflow-y-auto max-h-[calc(100vh-232px)]">
            <CardHeader>
              <CardTitle>Skills Required</CardTitle>
              <CardDescription>Enter the skills required for the job below.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-4">
                {jobData.skills.map((skill, index) => (
                  <Input
                    key={index}
                    placeholder={`Skill ${index + 1}`}
                    value={skill}
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                  />
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addSkill}>
                  Add Skill
                </Button>
              </form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={() => setActiveTab('applicationDetails')}>Save & Next</Button>
            </CardFooter>
          </Card>
        );
      case 'applicationDetails':
        return (
          <Card className="overflow-y-auto max-h-[calc(100vh-232px)]">
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
              <CardDescription>Enter the application details below.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-4">
              <Select id="applicationStatus" value={jobData.applicationStatus} onValueChange={(value) => handleSelectChange('applicationStatus', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status of the job" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
              </Select>               
               <Label htmlFor="applicationDate">Application Deadline</Label>
                <Input id="applicationDate" placeholder="Application Date" type="date" value={jobData.applicationDate} onChange={handleChange} />
                {/* <Label htmlFor="followUpDate">Follow-Up Date</Label> */}
                {/* <Input id="followUpDate" placeholder="Follow-Up Date" type="date" value={jobData.followUpDate} onChange={handleChange} /> */}
                <Input id="contactPerson" placeholder="Contact Person" value={jobData.contactPerson} onChange={handleChange} />
                <Input id="contactPersonEmail" placeholder="Contact Person Email" value={jobData.contactPersonEmail} onChange={handleChange} />
                <Input id="contactPersonPhone" placeholder="Contact Person Phone" value={jobData.contactPersonPhone} onChange={handleChange} />
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
                <CardDescription>Enter any additional details below.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="flex flex-col gap-4">
                  <Label htmlFor="benefits">Benefits</Label>
                  <Textarea id="benefits" placeholder="Enter job benefits (e.g., health insurance, retirement plan, vacation days, etc.)" value={jobData.benefits} onChange={handleChange} />
                  {/* <Label htmlFor="resume">Resume/CV</Label>
                  <Input id="resume" type="file" onChange={handleChange} />
                  <Label htmlFor="coverLetter">Cover Letter</Label>
                  <Input id="coverLetter" type="file" onChange={handleChange} /> */}
                  <Label htmlFor="notes">Notes</Label>
                  <Input id="notes" placeholder="Notes" value={jobData.notes} onChange={handleChange} />
                  <Label htmlFor="attachments">Attachments</Label>
                  <Input id="attachments" type="file" onChange={handleChange} multiple />
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
            <a href="#" onClick={() => setActiveTab('skillsRequired')} className={`${activeTab === 'skillsRequired' ? 'text-primary' : ''}`}>
              Skills Required
            </a>
            <a href="#" onClick={() => setActiveTab('applicationDetails')} className={`${activeTab === 'applicationDetails' ? 'text-primary' : ''}`}>
              Application Details
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
