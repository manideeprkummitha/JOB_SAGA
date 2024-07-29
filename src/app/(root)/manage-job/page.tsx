'use client';
import * as React from "react";
import Link from "next/link";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { useAuth } from '@/auth/context/jwt/auth-provider'; // Importing the custom hook

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

// Product Table Component
function ProductTable({ data, page, totalPages, onPageChange }) {
  const itemsPerPage = 7; // Define the number of items per page

  return (
    <Card>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sl.No</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead className="hidden md:table-cell">Job Type</TableHead>
              <TableHead className="hidden md:table-cell">Salary Range</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => {
              // Default to an empty string if no interestingApplicants are present
              const interestingApplicantId = item.interestingApplicants.length > 0 ? item.interestingApplicants[0].$oid : "";

              return (
                <TableRow key={item._id}>
                  <TableCell className="font-medium">{(page - 1) * itemsPerPage + index + 1}</TableCell>
                  <TableCell>
                    <Link href={`/job-description/${item._id}`} legacyBehavior>
                      <a rel="noopener noreferrer" className="underline">
                        {item.jobTitle}
                      </a>
                    </Link>
                  </TableCell>
                  <TableCell className="font-medium">{item.company.name}</TableCell>
                  <TableCell className="font-medium">{item.company.location}</TableCell>
                  <TableCell className="font-medium">{item.jobType}</TableCell>
                  <TableCell className="font-medium">{`$${item.salaryRange.min} - $${item.salaryRange.max}`}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.status}</Badge>
                  </TableCell>
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
                        <Link href={`/all-applicants-details/${item._id}`} passHref>
                          <DropdownMenuItem asChild>
                            <a>Show All Applicants</a>
                          </DropdownMenuItem>
                        </Link>
                        <Link href={`/saved-applicant-details/${item._id}`} passHref>
                          <DropdownMenuItem asChild>
                            <a>Show Saved Applicants</a>
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <tfoot>
            <TableRow>
              <TableCell colSpan="10">
                <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
              </TableCell>
            </TableRow>
          </tfoot>
        </Table>
      </CardContent>
    </Card>
  );
}

// Main Component
export default function ManageJobs() {
  const { accessToken } = useAuth(); // Using the custom hook to get the access token
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 7;
  const [currentTab, setCurrentTab] = React.useState("all");
  const [jobs, setJobs] = React.useState([]);

  // Fetch data from the API
  React.useEffect(() => {
    console.log('useEffect - Fetching jobs');
    const fetchJobs = async () => {
      if (!accessToken) {
        console.error('No access token found');
        return;
      }

      try {
        console.log('Fetching jobs from API');
        const response = await axios.get(`http://localhost:7004/api/jobs`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log('Fetched jobs:', response.data);
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching job data:", error);
        setJobs([]); // Set empty data on error
      }
    };

    fetchJobs();
  }, [accessToken]);

  React.useEffect(() => {
    console.log(`useEffect - Tab changed to ${currentTab}`);
    setPage(1); // Reset to the first page when the tab changes
  }, [currentTab]);

  const filteredData = jobs.filter((job) => currentTab === "all" || job.status === currentTab);
  console.log(`Filtered Data: ${filteredData.length} jobs`);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  console.log(`Total Pages: ${totalPages}`);
  const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  console.log(`Current Data Length: ${currentData.length}`);

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
                  <TabsTrigger value="closed" className="hidden sm:flex">
                    Closed
                  </TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                          Export
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Export</DropdownMenuLabel>
                      <DropdownMenuItem>Csv</DropdownMenuItem>
                      <DropdownMenuItem>Pdf</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Link href="/create-job">
                    <Button size="sm" className="h-8 gap-1">
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Create a job
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
              <TabsContent value="all">
                <ProductTable data={currentData} page={page} totalPages={totalPages} onPageChange={setPage} />
              </TabsContent>
              <TabsContent value="active">
                <ProductTable data={currentData} page={page} totalPages={totalPages} onPageChange={setPage} />
              </TabsContent>
              <TabsContent value="draft">
                <ProductTable data={currentData} page={page} totalPages={totalPages} onPageChange={setPage} />
              </TabsContent>
              <TabsContent value="closed">
                <ProductTable data={currentData} page={page} totalPages={totalPages} onPageChange={setPage} />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
