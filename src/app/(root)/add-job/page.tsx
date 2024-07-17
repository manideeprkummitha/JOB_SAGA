'use client'

import * as React from "react";
import Link from "next/link";
import { CircleUser, Menu, Package2, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddAJob() {
  const [activeTab, setActiveTab] = React.useState('jobDetails');

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
                <Input id="jobTitle" placeholder="Job Title" />
                <Input id="companyName" placeholder="Company Name" />
                <Input id="companyWebsite" placeholder="Company Website" />
                <Input id="jobLocation" placeholder="Job Location" />
                <Input id="jobPostingUrl" placeholder="Job Posting URL" />
              </form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button>Save & Next</Button>
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
                <Input id="applicationStatus" placeholder="Application Status" />
                <Label htmlFor="applicationDate">Application Date</Label>
                <Input id="applicationDate" placeholder="Application Date" type="date" />
                <Label htmlFor="followUpDate">Follow-Up Date</Label>
                <Input id="followUpDate" placeholder="Follow-Up Date" type="date" />
                <Input id="contactPerson" placeholder="Contact Person" />
                <Input id="contactPersonEmail" placeholder="Contact Person Email" />
                <Input id="contactPersonPhone" placeholder="Contact Person Phone" />
              </form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button>Save & Next</Button>
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
                <Input id="interviewDate" placeholder="Interview Date" type="date" />
                <Input id="interviewTime" placeholder="Interview Time" />
                <Input id="interviewLocation" placeholder="Interview Location" />
                <Input id="interviewerName" placeholder="Interviewer Name" />
                <Input id="interviewNotes" placeholder="Interview Notes" />
              </form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button>Save & Next</Button>
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
                <Input id="resume" type="file" />
                <Label htmlFor="coverLetter">Cover Letter</Label>
                <Input id="coverLetter" type="file" />
                <Label htmlFor="notes">Notes</Label>
                <Input id="notes" placeholder="Notes" />
                <Label htmlFor="attachments">Attachments</Label>
                <Input id="attachments" type="file" />
                <Input id="attachments" type="file" />
              </form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button>Submit</Button>
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
