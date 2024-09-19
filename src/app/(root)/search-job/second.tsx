'use client';

import React, { useEffect, useState } from 'react';
import JobPostCard from '@/components/common/job_post_card/jobpostcard';
import { ScrollAreaDemo } from '@/components/common/filter/filter'; // Filter Component
import axios from 'axios';
import { useAuth } from '@/auth/context/jwt/auth-provider'; // Auth context for user info
import { FC } from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CustomSearchForm: FC<{ onSearch: (query: string) => void }> = ({ onSearch }) => {
    const [titleQuery, setTitleQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const query = `${titleQuery} ${locationQuery}`.trim(); // Combine title and location queries
      onSearch(query); // Trigger search based on query
    };
  
    return (
      <form className="flex items-center gap-4" onSubmit={handleSubmit}>
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Title, Skill, Developer"
            value={titleQuery}
            onChange={(e) => setTitleQuery(e.target.value)}
            className="w-full appearance-none bg-background pl-8 shadow-none"
          />
        </div>
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Location"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            className="w-full appearance-none bg-background pl-8 shadow-none"
          />
        </div>
        <Button type="submit" variant="default" className="w-auto">
          Search
        </Button>
      </form>
    );
};

const JobListingPage = () => {
    const [jobs, setJobs] = useState([]); // State to store job listings
    const [loading, setLoading] = useState(true); // Loading state
    const [searchQuery, setSearchQuery] = useState(''); // Search query from search bar
    const [selectedFilters, setSelectedFilters] = useState(new Set()); // Selected filters
    const { accessToken, userId } = useAuth(); // Get accessToken for authenticated requests

    useEffect(() => {
        const fetchJobs = async () => {
          try {
            console.log('Fetching jobs from API...');
            const response = await axios.get('http://localhost:7004/api/jobs?all=true', {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            });
            console.log('Jobs fetched:', response.data);
            setJobs(response.data);
          } catch (error) {
            console.error('Error fetching jobs:', error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchJobs();
      }, []);

    return(
        <div className="grid grid-cols-12 gap-6 h-screen p-6">
            <div className="col-span-12">
            <CustomSearchForm  />
        </div>

        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 gap-4 overflow-y-auto h-[calc(100vh-10rem)] custom-scrollbar">
            {jobs.map((job) => (
            <JobPostCard key={job._id} job={job} userId={userId} />
            ))}
        </div>
        <div className="col-span-4">
            <ScrollAreaDemo
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            />
        </div>
        </div>
    );
};