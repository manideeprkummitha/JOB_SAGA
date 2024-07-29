'use client';

import * as React from "react";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { Building, Briefcase, UsersRound, Bookmark, MapPin, DollarSign } from "lucide-react";
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useAuth } from '@/auth/context/jwt/auth-provider';

export default function JobDescription() {
  const [jobData, setJobData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const params = useParams();
  const id = params.id;
  const { userId } = useAuth();

  console.log('Params ID:', id);

  React.useEffect(() => {
    if (id) {
      const fetchJobData = async () => {
        console.log('Fetching job data for ID:', id);
        try {
          const response = await axios.get(`http://localhost:7004/api/jobs/${id}`);
          console.log('Response Data:', response.data);
          setJobData(response.data);
        } catch (err) {
          console.error('Error fetching job data:', err);
          setError(err);
        }
      };

      fetchJobData();
    }
  }, [id]);

  console.log('Job Data:', jobData);
  console.log('Error:', error);

  if (error) return <p>Error loading job data: {error.message}</p>;
  if (!jobData) return <p>Loading...</p>;

  const handleSaveJob = async () => {
    if (!userId) {
      console.error('User is not authenticated');
      return;
    }

    const { jobTitle, company, salaryRange, workLocation } = jobData.data;

    try {
      console.log(`Saving job with authServiceId: ${userId}`);
      const response = await axios.post(`http://localhost:7004/api/tracking/user/${userId}/add`, {
        jobId: id,
        jobPosition: jobTitle || 'Unknown Position',
        company: company.name || 'Unknown Company',
        salaryRange: salaryRange || { min: 0, max: 0 },
        jobLocation: workLocation || 'Unknown Location',
        status: 'active',
        dateSaved: new Date(),
      });
      console.log('Save response:', response.data);
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  return (
    <div className="flex h-full w-full flex-col p-6 pb-10 text-white lg:p-6 mb-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex items-start gap-4 mb-6">
          <Image src={'/images/company-logo.png'} alt="Company Logo" width={60} height={60} />
          <div className="flex-1">
            <h1 className="text-3xl font-semibold">{jobData?.data?.jobTitle || 'No Title'}</h1>
            <p className="text-gray-300">{jobData?.data?.workLocation || 'Location not specified'} · {new Date(jobData?.data?.createdAt).toLocaleDateString()} · Over 100 applicants</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                {jobData?.data?.jobType || 'N/A'}
              </span>
              {jobData?.data?.workSchedule && (
                <span className="inline-flex items-center gap-1">
                  . {jobData.data.workSchedule}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1">
                <Building className="h-4 w-4" />
                {jobData?.data?.company?.size ? `${jobData.data.company.size} employees` : 'Company size not specified'} · {jobData?.data?.company?.industry || 'Industry not specified'}
              </span>
              {jobData?.data?.company?.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {jobData.data.company.location}
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <UsersRound className="h-4 w-4" />
                9 school alumni work here•
              </span>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <Button className="bg-black text-white">Apply Now</Button>
            <Button
              variant="outline"
              className="text-gray-700 border-gray-300 flex items-center"
              onClick={handleSaveJob}
            >
              Save
              <Bookmark className="ml-2" size={16} />
            </Button>
          </div>
        </div>
        <div className="bg-zinc-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold">About the Job</h2>
          <p className="mt-4">{jobData?.data?.jobDescription || 'No Description Available'}</p>
          {jobData?.data?.jobRequirements && (
            <>
              <h3 className="mt-6 text-lg font-semibold">Job Requirements</h3>
              <p className="mt-2">{jobData.data.jobRequirements}</p>
            </>
          )}
          {jobData?.data?.rolesAndResponsibilities && (
            <>
              <h3 className="mt-6 text-lg font-semibold">Roles And Responsibilities</h3>
              <ul className="mt-2 list-disc list-inside">
                {jobData.data.rolesAndResponsibilities.map((role, index) => (
                  <li key={index}>{role}</li>
                ))}
              </ul>
            </>
          )}
          {jobData?.data?.qualifications && (
            <>
              <h3 className="mt-6 text-lg font-semibold">Qualifications & Experience</h3>
              <ul className="mt-2 list-disc list-inside">
                {jobData.data.qualifications.map((qualification, index) => (
                  <li key={index}>{qualification}</li>
                ))}
              </ul>
            </>
          )}
          {jobData?.data?.skills && (
            <>
              <h3 className="mt-6 text-lg font-semibold">Skills Associated with the Job Post</h3>
              <ul className="mt-2 list-disc list-inside">
                {jobData.data.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </>
          )}
          {jobData?.data?.salaryRange && (
            <>
              <h3 className="mt-6 text-lg font-semibold">Salary Range</h3>
              <p className="mt-2"><DollarSign className="inline-block h-4 w-4" /> ${jobData.data.salaryRange.min} - ${jobData.data.salaryRange.max}</p>
            </>
          )}
          {jobData?.data?.benefits && (
            <>
              <h3 className="mt-6 text-lg font-semibold">Benefits</h3>
              <p className="mt-2">{jobData.data.benefits}</p>
            </>
          )}
          {jobData?.data?.perks && (
            <>
              <h3 className="mt-6 text-lg font-semibold">Perks</h3>
              <p className="mt-2">{jobData.data.perks}</p>
            </>
          )}
          {jobData?.data?.vacationLeave && (
            <>
              <h3 className="mt-6 text-lg font-semibold">Vacation Leave</h3>
              <p className="mt-2">{jobData.data.vacationLeave}</p>
            </>
          )}
          {jobData?.data?.incentives && (
            <>
              <h3 className="mt-6 text-lg font-semibold">Incentives</h3>
              <p className="mt-2">{jobData.data.incentives}</p>
            </>
          )}
          {jobData?.data?.workLifeBalance && (
            <>
              <h3 className="mt-6 text-lg font-semibold">Work-Life Balance</h3>
              <p className="mt-2">{jobData.data.workLifeBalance}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
