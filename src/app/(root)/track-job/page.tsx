'use client'
import React, { useState, useEffect } from 'react';
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
import { TooltipProvider } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axios from 'axios';
import { useAuth } from '@/auth/context/jwt/auth-provider'; // Adjust the import path as necessary
import { useToast } from '@/components/ui/use-toast'; 

// Helper function to format dates
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return isNaN(date) ? 'Invalid Date' : date.toLocaleDateString();
};

// Pagination Component
export const Pagination = ({ page, totalPages, onPageChange }) => {
  const handleNavigation = (type) => {
    const pageNumber = type === 'prev' ? page - 1 : page + 1;
    onPageChange(pageNumber);
  };

  return (
    <div className="flex justify-between gap-3 w-full">
      <Button
        size="lg"
        variant="ghost"
        className="p-0 hover:bg-transparent"
        onClick={() => handleNavigation('prev')}
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
        onClick={() => handleNavigation('next')}
        disabled={page >= totalPages}
        aria-label="Next Page"
      >
        Next
      </Button>
    </div>
  );
};

// Product Table Component
function ProductTable({ data, page, totalPages, onPageChange, refreshData }) {
  const { toast } = useToast();

  // Handle deleting a job
  const handleDelete = async (trackingId) => {
    try {
      const response = await axios.delete(`http://localhost:7004/api/tracking/${trackingId}`);
      if (response.status === 200) {
        toast({
          title: 'Job Deleted',
          description: 'The job has been successfully deleted.',
          variant: 'destructive',
        });
        refreshData();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete the job.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while trying to delete the job.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardContent className="overflow-x-auto">
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
              <TableHead className="hidden md:table-cell">Follow Up</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item._id}>
                <TableCell className="font-medium">{(page - 1) * 7 + index + 1}</TableCell>
                <TableCell className="font-medium">
                  {item.jobId && item.jobId._id ? (
                    <Link href={`/job-description/${item.jobId._id}`} legacyBehavior>
                      <a rel="noopener noreferrer" className="text-white-600 underline">
                        {item.jobId.jobTitle}
                      </a>
                    </Link>
                  ) : (
                    <span className="text-white-600">{item.jobPosition}</span>
                  )}
                </TableCell>
                <TableCell className="font-medium">{item.jobId?.company.name || item.company}</TableCell>
                <TableCell className="font-medium">{item.jobId?.workLocation || 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant="outline">{item.status}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{formatDate(item.dateSaved)}</TableCell>
                <TableCell className="hidden md:table-cell">{formatDate(item.dateApplied)}</TableCell>
                <TableCell className="hidden md:table-cell">{formatDate(item.followUpDate)}</TableCell>
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
                      <DropdownMenuItem onClick={() => handleDelete(item._id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="bg-transparent">
            <TableRow className="hover:bg-transparent ">
              <TableCell colSpan="11">
                <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}

// Main Component
export default function TrackJob() {
  const { userId } = useAuth();
  const [page, setPage] = React.useState(1);
  const [currentTab, setCurrentTab] = React.useState('all');
  const [jobData, setJobData] = React.useState([]);
  const [loading, setLoading] = React.useState(true); // Add loading state
  const itemsPerPage = 7;

  // Fetch data from API
  const fetchData = async () => {
    if (userId) {
      setLoading(true); // Set loading to true when starting the fetch
      try {
        const response = await axios.get(`http://localhost:7004/api/tracking/user/${userId}`);
        setJobData(response.data.data.jobTrackingData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setJobData([]);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    }
  };

  // Call fetchData on component mount and when userId changes
  useEffect(() => {
    fetchData();
  }, [userId]);

  useEffect(() => {
    setPage(1);
  }, [currentTab]);

  const filteredData = jobData.filter((job) => currentTab === 'all' || job.status === currentTab);
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
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="draft">Draft</TabsTrigger>
                  <TabsTrigger value="archived" className="hidden sm:flex">
                    Archived
                  </TabsTrigger>
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
                {loading ? (
                  <div className=' h-full flex items-center justify-center '>
                        <LucideLoader />
                  </div>
                ) : (
                  <ProductTable
                    data={currentData}
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    refreshData={fetchData}
                  />
                )}
              </TabsContent>
              <TabsContent value="active">
                {loading ? (
                  <LucideLoader />
                ) : (
                  <ProductTable
                    data={currentData}
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    refreshData={fetchData}
                  />
                )}
              </TabsContent>
              <TabsContent value="draft">
                {loading ? (
                  <LucideLoader />
                ) : (
                  <ProductTable
                    data={currentData}
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    refreshData={fetchData}
                  />
                )}
              </TabsContent>
              <TabsContent value="archived">
                {loading ? (
                  <LucideLoader />
                ) : (
                  <ProductTable
                    data={currentData}
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    refreshData={fetchData}
                  />
                )}
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
