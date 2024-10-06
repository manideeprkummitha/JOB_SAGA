"use client";

import * as React from "react";
import  { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import LucideLoader from '@/components/common/loader/lucide-loader'; // Import the loader component
import Link from 'next/link';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from 'axios';
import { useAuth } from '@/auth/context/jwt/auth-provider'; // Adjust the import path as necessary
import { useToast } from '@/components/ui/use-toast'; 
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";


// Helper function to format dates
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return isNaN(date) ? "Invalid Date" : date.toLocaleDateString();
};

// Pagination Component
export const Pagination = ({ page, totalPages, onPageChange }) => {
  const handleNavigation = (type) => {
    const pageNumber = type === "prev" ? page - 1 : page + 1;
    onPageChange(pageNumber);
  };

  return (
    <div className="flex justify-between gap-3 w-full">
      <Button
        size="lg"
        variant="ghost"
        className="p-0 hover:bg-transparent"
        onClick={() => handleNavigation("prev")}
        disabled={page <= 1}
        aria-label="Previous Page"
      >
        Prev
      </Button>
      <p className="text-14 flex items-center px-2">
        {page} / {totalPages}
      </p>
      <Button
        size="lg"
        variant="ghost"
        className="p-0 hover:bg-transparent"
        onClick={() => handleNavigation("next")}
        disabled={page >= totalPages}
        aria-label="Next Page"
      >
        Next
      </Button>
    </div>
  );
};

// EditJobDialog Component
function EditJobDialog({ job, refreshData }) {
  const { toast } = useToast();
  const { accessToken } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  // State for form fields
  const [jobDetails, setJobDetails] = React.useState({
    jobPosition: job.jobPosition || "",
    company: job.company || "",
    companyWebsite: job.companyWebsite || "",
    jobLocation: job.jobLocation || "",
    jobPostingUrl: job.jobPostingUrl || "",
    salaryRange: { min: job.salaryRange?.min || "", max: job.salaryRange?.max || "" },
  });

  const [combinedDetails, setCombinedDetails] = React.useState({
    applicationStatus: job.applicationStatus || "",
    dateApplied: job.dateApplied ? new Date(job.dateApplied).toISOString().split("T")[0] : "",
    followUpDate: job.followUpDate ? new Date(job.followUpDate).toISOString().split("T")[0] : "",
    interviewDate: job.interviewDate ? new Date(job.interviewDate).toISOString().split("T")[0] : "",
    interviewTime: job.interviewTime || "",
    interviewLocation: job.interviewLocation || "",
    resume: null,
    coverLetter: null,
    status: job.status || "draft",
  });

  const handleInputChange = (e, setStateFunc) => {
    const { id, value } = e.target;
    setStateFunc((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e, setStateFunc, key) => {
    const file = e.target.files[0];
    setStateFunc((prev) => ({ ...prev, [key]: file }));
  };

  const handleUpdateJob = async () => {
    try {
      const updatedJob = {
        ...jobDetails,
        ...combinedDetails,
        salaryRange: {
          min: jobDetails.salaryRange.min,
          max: jobDetails.salaryRange.max,
        },
      };

      // Make PUT request to update the job
      await axios.put(`http://localhost:7004/api/tracking/${job._id}`, updatedJob, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      toast({
        title: "Job Updated",
        description: `The job "${jobDetails.jobPosition}" has been successfully updated.`,
      });

      // Close dialog and refresh data
      setIsDialogOpen(false);
      refreshData();
    } catch (error) {
      console.error("Error updating job:", error);
      toast({
        title: "Error",
        description: "There was an error updating the job.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)} className="w-full text-left items-start justify-start" variant="ghost">
        Edit
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
            <DialogDescription>Edit the details for the job. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Job Details */}
            <Input id="jobPosition" placeholder="Job Position" value={jobDetails.jobPosition} onChange={(e) => handleInputChange(e, setJobDetails)} />
            <Input id="company" placeholder="Company Name" value={jobDetails.company} onChange={(e) => handleInputChange(e, setJobDetails)} />
            <Input id="companyWebsite" placeholder="Company Website" value={jobDetails.companyWebsite} onChange={(e) => handleInputChange(e, setJobDetails)} />
            <Input id="jobLocation" placeholder="Job Location" value={jobDetails.jobLocation} onChange={(e) => handleInputChange(e, setJobDetails)} />
            <Input id="jobPostingUrl" placeholder="Job Posting URL" value={jobDetails.jobPostingUrl} onChange={(e) => handleInputChange(e, setJobDetails)} />
            <div className="flex gap-4">
              <Input id="salaryRangeMin" placeholder="Min Salary" value={jobDetails.salaryRange.min} onChange={(e) => handleInputChange(e, (newVal) => setJobDetails((prev) => ({ ...prev, salaryRange: { ...prev.salaryRange, min: newVal.salaryRangeMin } })))} />
              <Input id="salaryRangeMax" placeholder="Max Salary" value={jobDetails.salaryRange.max} onChange={(e) => handleInputChange(e, (newVal) => setJobDetails((prev) => ({ ...prev, salaryRange: { ...prev.salaryRange, max: newVal.salaryRangeMax } })))} />
            </div>

            {/* Combined Details */}
            <Select
              onValueChange={(value) => {
                setCombinedDetails((prevState) => ({
                  ...prevState,
                  applicationStatus: value,
                }));
              }}
              defaultValue={combinedDetails.applicationStatus}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Application Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Label htmlFor="dateApplied">Date Applied</Label>
            <Input id="dateApplied" type="date" placeholder="Date Applied" value={combinedDetails.dateApplied} onChange={(e) => handleInputChange(e, setCombinedDetails)} />

            <Label htmlFor="followUpDate">Follow Up Date</Label>
            <Input id="followUpDate" type="date" value={combinedDetails.followUpDate} onChange={(e) => handleInputChange(e, setCombinedDetails)} />

            <Label htmlFor="resume">Resume/CV</Label>
            <Input id="resume" type="file" onChange={(e) => handleFileChange(e, setCombinedDetails, "resume")} />
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateJob}>Save changes</Button>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Product Table Component
function ProductTable({ data, page, totalPages, onPageChange, refreshData }) {
  const { toast } = useToast();
  const [Loading, setLoading] = useState(false);

  // Handle deleting a job
  const handleDelete = async (trackingId) => {
    try {
      const response = await axios.delete(`http://localhost:7004/api/tracking/${trackingId}`);
      if (response.status === 200) {
        toast({
          title: "Job Deleted",
          description: "The job has been successfully deleted.",
          variant: "destructive",
        });
        // Refresh data after deletion
        refreshData();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete the job.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      toast({
        title: "Error",
        description: "An error occurred while trying to delete the job.",
        variant: "destructive",
      });
    }
  };

  

  return (
    <Card>
    <CardContent className="overflow-x-auto">
      {/* Wrap the entire table content with TooltipProvider */}
      <TooltipProvider>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Sl.No</TableHead>
              <TableHead>Job Position</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Date Saved</TableHead>
              <TableHead className="hidden md:table-cell">Date Applied</TableHead>
              <TableHead className="hidden md:table-cell">Interview Date</TableHead>
              <TableHead className="hidden md:table-cell">Resume</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item._id}>
                <TableCell className="font-medium">{(page - 1) * 7 + index + 1}</TableCell>
                
                {/* Tooltip for Job Position */}
                <TableCell className="font-medium">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-white-600 underline cursor-pointer">
                        {item.jobPosition || "N/A"}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="p-2 text-sm">
                        <p><strong>Job Position:</strong> {item.jobPosition || "N/A"}</p>
                        <p><strong>Company:</strong> {item.company || "N/A"}</p>
                        <p><strong>Location:</strong> {item.jobLocation || "N/A"}</p>
                        <p><strong>Status:</strong> {item.status || "N/A"}</p>
                        <p><strong>Date Applied:</strong> {formatDate(item.dateApplied) || "N/A"}</p>
                        <p><strong>Interview Date:</strong> {formatDate(item.interviewDate) || "N/A"}</p>
                        <p><strong>Resume:</strong> {item.resume ? "Available" : "N/A"}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>

                <TableCell className="font-medium">{item.company || "N/A"}</TableCell>
                <TableCell className="font-medium">{item.jobLocation || "N/A"}</TableCell>
                <TableCell>
                  <Badge variant="outline">{item.status || "N/A"}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{formatDate(item.dateSaved) || "N/A"}</TableCell>
                <TableCell className="hidden md:table-cell">{formatDate(item.dateApplied) || "N/A"}</TableCell>
                <TableCell className="hidden md:table-cell">{formatDate(item.interviewDate) || "N/A"}</TableCell>
                <TableCell className="hidden md:table-cell">{item.resume ? "Available" : "N/A"}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <EditJobDialog job={item} refreshData={refreshData} />
                      <DropdownMenuItem onClick={() => handleDelete(item._id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="bg-transparent">
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan="11">
                <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TooltipProvider>
    </CardContent>
  </Card>
  );
}

// Main Component
export default function TrackJob() {
  const { userId } = useAuth();
  const [page, setPage] = React.useState(1);
  const [currentTab, setCurrentTab] = React.useState("all");
  const [jobData, setJobData] = React.useState([]);
  const itemsPerPage = 7;

  // Fetch data from API
  const fetchData = async () => {
    if (userId) {
      try {
        const response = await axios.get(`http://localhost:7004/api/tracking/user/${userId}`);
        setJobData(response.data.data.jobTrackingData); 
      } catch (error) {
        console.error("Error fetching data:", error);
        setJobData([]);
      }
    }
  };

  // Call fetchData on component mount and when userId changes
  React.useEffect(() => {
    fetchData();
  }, [userId]);

  React.useEffect(() => {
    setPage(1); 
  }, [currentTab]);

  const filteredData = jobData.filter((job) => currentTab === "all" || job.status === currentTab);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full flex-col lg:p-6">
        <div className="flex flex-col sm:gap-4 sm:pb-1">
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Tabs defaultValue="all" onValueChange={(value) => setCurrentTab(value)}>
              <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="all">All Jobs</TabsTrigger>
                <TabsTrigger value="applied">Applied</TabsTrigger>
                <TabsTrigger value="interview">Interview Scheduled</TabsTrigger>
                <TabsTrigger value="offer">Offer Received</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
                <TabsTrigger value="saved">Saved</TabsTrigger>
              </TabsList>
                <div className="ml-auto flex items-center gap-2">
                  <Link href="/add-job" legacyBehavior>
                    <a style={{ color: 'white' }}>
                      <Button size="sm" className="h-8 gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                          Manually add a job
                        </span>
                      </Button>
                    </a>
                  </Link>
                </div>
              </div>
              <TabsContent value="all">
                <ProductTable
                  data={currentData}
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  refreshData={fetchData} 
                />
              </TabsContent>
              <TabsContent value="active">
                <ProductTable
                  data={currentData}
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  refreshData={fetchData} 
                />
              </TabsContent>
              <TabsContent value="draft">
                <ProductTable
                  data={currentData}
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  refreshData={fetchData} 
                />
              </TabsContent>
              <TabsContent value="archived">
                <ProductTable
                  data={currentData}
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  refreshData={fetchData} 
                />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
