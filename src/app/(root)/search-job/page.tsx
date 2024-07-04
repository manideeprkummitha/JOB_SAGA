import React from 'react';
import JobPostCard from '@/components/common/job_post_card/jobpostcard';
import {ScrollAreaDemo} from '@/components/common/filter/filter';
const SearchJob = () => {
  return (
    <div className="grid grid-cols-12 h-screen gap-4 ">
      <div className="col-span-8 grid grid-cols-1 gap-4 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide">
        <JobPostCard />
        <JobPostCard />
        <JobPostCard />
        <JobPostCard />
        <JobPostCard />
        <JobPostCard />
      </div>
      <div className="col-span-4">
        <ScrollAreaDemo/>
      </div>
    </div>
  );
};

export default SearchJob;
