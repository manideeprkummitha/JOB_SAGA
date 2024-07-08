'use client'

import * as React from "react";
import { Button } from "@/components/ui/button";
import Image from 'next/image';

export default function JobDescription() {
  return (
    <div className="flex h-full w-full flex-col p-6 bg-gray-900 text-white">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex items-start gap-4 mb-6">
          <Image src="/path/to/company-logo.png" alt="Company Logo" width={60} height={60} />
          <div>
            <h1 className="text-3xl font-semibold">Software Engineer</h1>
            <p className="text-gray-300">Bengaluru, Karnataka, India · 4 days ago · Over 100 applicants</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1">
                <Image src="/icons/remote-icon.png" alt="Remote" width={20} height={20} />
                Remote
              </span>
              <span className="inline-flex items-center gap-1">
                <Image src="/icons/fulltime-icon.png" alt="Full-time" width={20} height={20} />
                Full-time
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1">
                <Image src="/icons/employees-icon.png" alt="Employees" width={20} height={20} />
                10,001+ employees · Software Development
              </span>
              <span className="inline-flex items-center gap-1">
                <Image src="/icons/alumni-icon.png" alt="Alumni" width={20} height={20} />
                9 school alumni work here
              </span>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold">Job Description</h2>
          <p className="mt-4">
            We are looking for a skilled Software Engineer to join our team. The ideal candidate will have a passion for coding and a strong background in software development. You will be responsible for designing, developing, and maintaining software applications. This role requires excellent problem-solving skills and the ability to work collaboratively with cross-functional teams.
          </p>
          <h3 className="mt-6 text-lg font-semibold">Responsibilities:</h3>
          <ul className="mt-2 list-disc list-inside">
            <li>Design, develop, and maintain software applications.</li>
            <li>Collaborate with cross-functional teams to define, design, and ship new features.</li>
            <li>Write clean, maintainable code with comprehensive unit tests.</li>
            <li>Troubleshoot and debug issues as they arise.</li>
            <li>Participate in code reviews to ensure code quality and adherence to standards.</li>
          </ul>
          <h3 className="mt-6 text-lg font-semibold">Requirements:</h3>
          <ul className="mt-2 list-disc list-inside">
            <li>Bachelor's degree in Computer Science or related field.</li>
            <li>3+ years of experience in software development.</li>
            <li>Proficiency in one or more programming languages (e.g., JavaScript, Python, Java).</li>
            <li>Experience with front-end and back-end development.</li>
            <li>Strong problem-solving and analytical skills.</li>
            <li>Excellent communication and teamwork abilities.</li>
          </ul>
          <h3 className="mt-6 text-lg font-semibold">Benefits:</h3>
          <ul className="mt-2 list-disc list-inside">
            <li>Competitive salary and benefits package.</li>
            <li>Health, dental, and vision insurance.</li>
            <li>401(k) with company match.</li>
            <li>Paid time off and holidays.</li>
            <li>Professional development opportunities.</li>
          </ul>
          <Button className="mt-6">Apply Now</Button>
        </div>
      </div>
    </div>
  );
}
