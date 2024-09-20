import React from 'react';

interface PageHeaderProps {
  title: string;
  subtext?: string; // Optional prop
  type?: string; // Optional prop, defaults to "title"
}

const PageHeader: React.FC<PageHeaderProps> = ({ type = "title", title, subtext }) => {
  return (
    <div className="flex flex-col items-start justify-start gap-2">
      <h1 className="text-3xl font-semibold text-white">{title}</h1>
      {subtext && <p className='text-white text-md '>{subtext}</p>} {/* Conditionally render subtext */}
    </div>
  );
};

export default PageHeader;
