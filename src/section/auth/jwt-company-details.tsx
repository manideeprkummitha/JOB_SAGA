'use client';

import { useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export const countries = [
  { code: 'AD', label: 'Andorra', phone: '376' },
  { code: 'AE', label: 'United Arab Emirates', phone: '971' },
  { code: 'AF', label: 'Afghanistan', phone: '93' },
  // Add remaining countries here...
];

export default function Company_Details() {
  const [role, setRole] = useState('job_seeker');

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Company Details</h1>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Select onValueChange={setRole}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="job_seeker">Job Seeker</SelectItem>
                    <SelectItem value="recruiter">Recruiter</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {role === 'job_seeker' ? (
              <>
                <div className="grid gap-2">
                  <Input id="job_title" type="text" placeholder="Current Job Title" required />
                </div>

                <div className="grid gap-2">
                  <Input id="company_name" type="text" placeholder="Current Company" required />
                </div>

                <div className="grid gap-2">
                  <Input id="no_of_years_of_exp" type="text" placeholder="No of years of experience" required />
                </div>

                <div className="grid gap-2">
                  <Input id="social_media_links" type="text" placeholder="LinkedIn" required />
                </div>

                <div className="grid gap-2">
                  <Textarea id="professional_summary" placeholder="Professional Summary" required />
                </div>

                <div className="grid gap-2">
                  <Textarea id="skill_set" placeholder="Skill Set (comma separated)" required />
                </div>

                <div className="grid gap-2">
                  <Input id="preferred_job_locations" type="text" placeholder="Preferred Job Locations" required />
                </div>
              </>
            ) : (
              <>
                <div className="grid gap-2">
                  <Input id="company_name" type="text" placeholder="Company Name" required />
                </div>

                <div className="grid gap-2">
                  <Input id="company_website" type="text" placeholder="Company Website" required />
                </div>

                <div className="grid gap-2">
                  <Textarea id="recruitment_focus_areas" placeholder="Recruitment Focus Areas" required />
                </div>

                <div className="grid gap-2">
                  <Input id="linkedin" type="text" placeholder="LinkedIn" required />
                </div>

                <div className="grid gap-2">
                  <Input id="preferred_job_locations" type="text" placeholder="Preferred Job Locations" required />
                </div>
              </>
            )}

            <Button type="submit" className="w-full">
              Next 
            </Button>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
