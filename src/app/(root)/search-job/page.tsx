'use client';

import React, { useEffect, useState } from 'react';
import JobPostCard from '@/components/common/job_post_card/jobpostcard';
import { ScrollAreaDemo } from '@/components/common/filter/filter';
import axios from 'axios';

const SearchJob = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        console.log('Fetching jobs from API...');
        const response = await axios.get('http://localhost:7004/api/jobs?all=true');
        console.log('Jobs fetched:', response.data);
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="grid grid-cols-12 h-screen gap-4 lg:p-6">
      <div className="col-span-8 grid grid-cols-1 gap-4 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide">
        {jobs.map((job, index) => (
          <JobPostCard key={index} job={job} />
        ))}
      </div>
      <div className="col-span-4">
        <ScrollAreaDemo />
      </div>
    </div>
  );
};

export default SearchJob;
