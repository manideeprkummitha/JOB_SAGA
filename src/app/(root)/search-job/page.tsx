'use client';

import React, { useEffect, useState } from 'react';
import JobPostCard from '@/components/common/job_post_card/jobpostcard';
import { ScrollAreaDemo } from '@/components/common/filter/filter'; // Make sure this path is correct
import axios from 'axios';
import { useAuth } from '@/auth/context/jwt/auth-provider'; // Auth context for user info
import { FC } from 'react';
import { Search, Loader } from 'lucide-react'; // Loader from lucide-react
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Custom Search Form Component
const CustomSearchForm: FC<{ onSearch: (query: string) => void, clearSearch: () => void }> = ({ onSearch, clearSearch }) => {
  const [titleQuery, setTitleQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = `${titleQuery} ${locationQuery}`.trim(); // Combine title and location queries
    if (query) {
      onSearch(query); // Trigger search based on query
    }
  };

  const handleClear = () => {
    setTitleQuery('');
    setLocationQuery('');
    clearSearch(); // Trigger reset to fetch all jobs
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
      <Button type="button" variant="outline" className="ml-4" onClick={handleClear}>
        Clear
      </Button>
    </form>
  );
};

const JobListingPage = () => {
  const [jobs, setJobs] = useState<any[]>([]); // State to store job listings
  const [loading, setLoading] = useState(true); // Loading state
  const [searchQuery, setSearchQuery] = useState(''); // Search query from search bar
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set()); // State for selected filters
  const [isSearching, setIsSearching] = useState(false); // State to track whether searching
  const { accessToken, userId } = useAuth(); // Get accessToken for authenticated requests

  // Helper: Build query string from selected filters and search query
  const buildQueryParams = () => {
    const params = new URLSearchParams();

    // Append filters to the query
    selectedFilters.forEach((filter: string) => {
      params.append('filters', filter);
    });

    // Append search query if available
    if (searchQuery) {
      params.append('search', searchQuery);
    }

    return params.toString();
  };

  // Fetch jobs based on filters and search query
  const fetchJobs = async () => {
    try {
      console.log('Fetching jobs from API...');
      setLoading(true); // Set loading to true when the fetch starts
      const queryParams = buildQueryParams();
      const response = await axios.get(`http://localhost:7004/api/jobs?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Use token for auth
        },
      });
      console.log('Jobs fetched:', response.data);
      setJobs(response.data ); // Set jobs to the fetched search data or empty if no jobs
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]); // Set jobs to empty array on error
    } finally {
      setLoading(false); // Set loading to false after the fetch finishes
    }
  };

  // Handle search query change
  const handleSearch = (query: string) => {
    setSearchQuery(query); // Update search query
    setIsSearching(true);
  };

  // Clear search query and reset job fetching
  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
  };

  // Fetch jobs on component mount and when filters or search query change
  useEffect(() => {
    fetchJobs(); // Fetch jobs whenever filters or searchQuery changes
  }, [selectedFilters, searchQuery]);

  return (
    <div className="grid grid-cols-12 gap-6 h-screen p-6">
      {/* Search Bar */}
      <div className="col-span-12">
        <CustomSearchForm onSearch={handleSearch} clearSearch={clearSearch} />
      </div>

      {/* Job Listings */}
      <div className="col-span-12 lg:col-span-8 grid grid-cols-1 gap-4 overflow-y-auto h-[calc(100vh-10rem)] custom-scrollbar">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader className="animate-spin size-5" /> {/* Loader with spinning animation */}
          </div>
        ) : jobs.length > 0 ? (
          jobs.map((job) => (
            <JobPostCard key={job._id} job={job} userId={userId} />
          ))
        ) : (
          <div className="text-center text-gray-500">
            <p>{isSearching ? 'No jobs found for your search query.' : 'No jobs available.'}</p>
          </div>
        )}
      </div>

      {/* Filters Section */}
      <div className="col-span-4">
        <ScrollAreaDemo
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
        />
      </div>
    </div>
  );
};

export default JobListingPage;
