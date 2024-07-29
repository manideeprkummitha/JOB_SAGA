'use client';
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Bookmark, Users } from 'lucide-react';
import Image from 'next/image';
import Link from "next/link";

const JobPostCard = ({ job }) => {
  return (
    <Card className="sm:col-span-2 p-2 border rounded-lg shadow-md">
      <CardHeader className="pb-3 grid grid-cols-[auto,1fr] items-center gap-4">
        <Image
          src={job.companyLogoUrl || '/default-logo.png'} // Assuming you have a default logo
          alt="Company Logo"
          width={50}
          height={50}
          className="w-12 h-12 rounded-lg"
        />
        <div>
          <CardTitle className="text-lg font-semibold">
            {job.companyName || 'Company Name'}
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            {job.companyDescription || 'Company Description'}
          </CardDescription>
          <div className="flex items-center mt-1 text-gray-500 text-sm">
            <Users className="mr-1" size={14} />
            {job.employeeCount || 'N/A'} EMPLOYEES
          </div>
        </div>
      </CardHeader>
      <div className="flex items-center mt-4 px-6">
        {job.isHiring && <CheckCircle className="text-green-600 mr-2" size={16} />}
        {job.isHiring && (
          <span className="text-green-600 font-semibold" style={{ fontSize: "12px" }}>
            ACTIVELY HIRING
          </span>
        )}
      </div>
      <div className="mt-4 px-6">
        <CardDescription className="text-gray-800 font-medium">
          {job.jobTitle || 'Job Title'}
        </CardDescription>
        <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
          <div>
            <span>{job.salary || 'Salary not specified'}</span>
            <span className="mx-2">•</span>
            <span>{job.location || 'Location not specified'}</span>
          </div>
          <div className="text-green-600" style={{ fontSize: "10px" }}>
            {job.recentActivity || 'No recent activity'} • {job.postedDate || 'No date provided'}
          </div>
        </div>
      </div>
      <CardFooter className="flex justify-between items-center mt-4">
        <Button variant="outline" className="text-gray-700 border-gray-300">
          Save
          <Bookmark className="ml-2" size={16} />
        </Button>
        <Link href={`/job-description/${job.id}`} passHref>
          <Button className="bg-black text-white">
            Learn more
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default JobPostCard;
