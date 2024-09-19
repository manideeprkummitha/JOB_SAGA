'use client';

import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterOption {
  id: string;
  label: string;
}

interface Filter {
  label: string;
  options: FilterOption[];
}

const filters: Filter[] = [
  {
    label: "Sort by",
    options: [
      { id: 'most_recent', label: 'Most Recent' },
      { id: 'most_relevant', label: 'Most Relevant' },
    ],
  },
  {
    label: "Date Posted",
    options: [
      { id: 'anytime', label: 'Anytime' },
      { id: 'past_month', label: 'Past Month' },
      { id: 'past_week', label: 'Past Week' },
      { id: 'past_24hrs', label: 'Past 24hrs' },
    ],
  },
  {
    label: "Experience Level",
    options: [
      { id: 'internship', label: 'Internship' },
      { id: 'entry_level', label: 'Entry Level' },
      { id: 'associate', label: 'Associate' },
      { id: 'mid_senior_level', label: 'Mid Senior Level' },
      { id: 'director', label: 'Director' },
      { id: 'executive', label: 'Executive' },
    ],
  },
  {
    label: "Job Type",
    options: [
      { id: 'full_time', label: 'Full Time' },
      { id: 'part_time', label: 'Part Time' },
      { id: 'contract', label: 'Contract' },
      { id: 'temporary', label: 'Temporary' },
      { id: 'internship', label: 'Internship' },
      { id: 'other', label: 'Other' },
    ],
  },
  {
    label: "Remote",
    options: [
      { id: 'onsite', label: 'Onsite' },
      { id: 'hybrid', label: 'Hybrid' },
      { id: 'remote', label: 'Remote' },
    ],
  },
  {
    label: "Industry",
    options: [
      { id: 'software_development', label: 'Software Development' },
      { id: 'it_services', label: 'IT Services and IT Consulting' },
      { id: 'technology', label: 'Technology' },
      { id: 'information_and_internet', label: 'Information and Internet' },
      { id: 'financial_services', label: 'Financial Services' },
      { id: 'technology_media', label: 'Technology, Information and Media' },
      { id: 'retail', label: 'Retail' },
      { id: 'staffing_recruiting', label: 'Staffing and Recruiting' },
      { id: 'business_consulting', label: 'Business Consulting and Services' },
      { id: 'human_resources', label: 'Human Resources Services' },
      { id: 'it_services_general', label: 'Information Technology & Services' },
    ],
  },
  {
    label: "Title",
    options: [
      { id: 'software_engineer', label: 'Software Engineer' },
      { id: 'frontend_developer', label: 'Frontend Developer' },
      { id: 'javascript_developer', label: 'JavaScript Developer' },
      { id: 'senior_frontend_developer', label: 'Senior Frontend Developer' },
      { id: 'full_stack_engineer', label: 'Full Stack Engineer' },
      { id: 'ui_engineer', label: 'User Interface Engineer' },
      { id: 'senior_software_engineer', label: 'Senior Software Engineer' },
      { id: 'java_software_engineer', label: 'Java Software Engineer' },
      { id: 'application_developer', label: 'Application Developer' },
      { id: 'cloud_engineer', label: 'Cloud Engineer' },
    ],
  },
  {
    label: "Benefits",
    options: [
      { id: 'medical_insurance', label: 'Medical Insurance' },
      { id: 'vision_insurance', label: 'Vision Insurance' },
      { id: 'dental_insurance', label: 'Dental Insurance' },
      { id: '401k', label: '401(k)' },
      { id: 'pension_plan', label: 'Pension Plan' },
      { id: 'paid_maternity_leave', label: 'Paid Maternity Leave' },
      { id: 'paid_paternity_leave', label: 'Paid Paternity Leave' },
      { id: 'commuter_benefits', label: 'Commuter Benefits' },
      { id: 'student_loan_assistance', label: 'Student Loan Assistance' },
      { id: 'tuition_assistance', label: 'Tuition Assistance' },
      { id: 'disability_insurance', label: 'Disability Insurance' },
    ],
  },
];

interface CheckboxGroupProps {
  options: FilterOption[];
  selectedOptions: Set<string>;
  toggleOption: (id: string) => void;
}

function CheckboxGroup({ options, selectedOptions, toggleOption }: CheckboxGroupProps) {
  return (
    <div className="flex flex-col space-y-4">
      {options.map((option) => (
        <div key={option.id} className="flex items-center space-x-2">
          <Checkbox
            id={option.id}
            checked={selectedOptions.has(option.id)} // Properly reflect checked state
            onCheckedChange={() => toggleOption(option.id)} // Use onCheckedChange
          />
          <label
            htmlFor={option.id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
}

interface DropdownProps {
  label: string;
  children: React.ReactNode;
}

function Dropdown({ label, children }: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(true); // Open by default

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-4 py-2 border rounded-md focus:outline-none mb-1"
      >
        {label}
      </button>
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="max-h-64 overflow-y-auto px-4 py-2 border rounded-md">{children}</div>
      </div>
    </div>
  );
}

export function ScrollAreaDemo({ selectedFilters, setSelectedFilters }) {
  const toggleOption = (id: string) => {
    console.log('Toggling option:', id);
    setSelectedFilters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
        console.log(`Removed ${id} from filters`);
      } else {
        newSet.add(id);
        console.log(`Added ${id} to filters`);
      }
      return newSet;
    });
  };

  const resetFilters = () => {
    setSelectedFilters(new Set());
  };

  return (
    <ScrollArea className="h-[calc(100vh-4rem)] w-full rounded-md border">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium leading-none" style={{ fontSize: '28px' }}>Filter</h4>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Reset
          </button>
        </div>
        {filters.map((filter) => (
          <React.Fragment key={filter.label}>
            <Dropdown label={filter.label}>
              <CheckboxGroup
                options={filter.options}
                selectedOptions={selectedFilters}
                toggleOption={toggleOption}
              />
            </Dropdown>
            <Separator className="my-2" />
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  );
}
