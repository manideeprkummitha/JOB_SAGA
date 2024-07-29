'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

const JobDetails = ({ params }) => {
  const { id } = params;
  const [jobDetails, setJobDetails] = useState(null);

  useEffect(() => {
    if (id) {
      console.log("Job ID:", id);
      // Fetch the job details
      const fetchJobDetails = async () => {
        try {
          const response = await axios.get(`/api/jobs/${id}`);
          setJobDetails(response.data);
        } catch (error) {
          console.error("Error fetching job details:", error);
        }
      };

      fetchJobDetails();
    }
  }, [id]);

  if (!id) return <p>Loading...</p>;

  return (
    <div>
      <h1>Job ID: {id}</h1>
      {jobDetails && <div>{JSON.stringify(jobDetails, null, 2)}</div>}
    </div>
  );
};

export default JobDetails;
