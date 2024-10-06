'use client';
import * as React from "react";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import axios from 'axios';
import { useToast } from "@/components/ui/use-toast"; // Importing the useToast hook
import LucideLoader from "@/components/common/loader/lucide-loader"; // Importing LucideLoader for the loading state

// Pagination Component
const Pagination = ({ page, totalPages, onPageChange }) => {
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

// Applicants Table Component
const ApplicantsTable = ({ data, page, totalPages, onPageChange, jobId, onDeleteApplicant }) => {

  const { toast } = useToast(); // Initializing the useToast hook
  const [loading, setLoading] = React.useState(false); // Add a loading state

  const handleSaveApplicant = async (applicantId) => {
    if (loading) return; // Prevent further execution if already loading
    setLoading(true); // Set loading to true
    
    try {
      const response = await axios.post(`http://localhost:7004/api/savedApplicants`, {
        jobId,
        applicantId,
      });

      // Handle success or already saved logic
      if (response.status === 400) {
        toast({
          title: "Applicant Already Saved",
          description: response.data.message || "This applicant has already been saved for this job.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Applicant Saved",
          description: "The applicant has been successfully saved.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving the applicant.",
        variant: "destructive",
      });
    } finally {
      setLoading(false); // Reset loading state after the operation
    }
  };

  const handleDeleteApplicant = async (applicationId) => {
    if (loading) return; // Prevent execution if already loading
    setLoading(true); // Set loading state to true

    try {
      const response = await axios.delete(`http://localhost:7004/api/apply/delete?applicationId=${applicationId}`);

      if (response.status === 400) {
        toast({
          title: "Applicant Not Found",
          description: response.data.message || "This application has already been deleted or does not exist.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Application Deleted",
          description: "The application has been successfully deleted.",
        });
        onDeleteApplicant(applicationId); // Update the UI by removing the deleted applicant
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error deleting the application.",
        variant: "destructive",
      });
    } finally {
      setLoading(false); // Reset loading state after the operation
    }
  };

  return (
    <Card>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Sl.No</TableHead>
              <TableHead>Applicant Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((applicant, index) => (
              <TableRow key={applicant._id}>
                <TableCell className="font-medium">{(page - 1) * 7 + index + 1}</TableCell>
                <TableCell>{`${applicant.firstName} ${applicant.lastName}`}</TableCell>
                <TableCell>{applicant.email}</TableCell>
                <TableCell className="hidden md:table-cell">{applicant.phone}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="outline">{applicant.status}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost" disabled={loading}>
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleSaveApplicant(applicant._id)} disabled={loading}>Save Applicant</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteApplicant(applicant._id)} disabled={loading}>Delete</DropdownMenuItem>
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
};

// Main Component
const ApplicantsDetails = ({ params }) => {
  const { id } = params; // Extract the job ID from the route parameters
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 7;
  const [applicants, setApplicants] = React.useState([]);
  const [jobName, setJobName] = React.useState('');
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true); // Add a loading state

  React.useEffect(() => {
    if (id) {
      const fetchJobDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:7004/api/jobs/${id}`);
          setJobName(response.data.data.jobTitle);
        } catch (error) {
          console.error("Error fetching job details:", error);
          setError(error.message || "Error fetching job details");
        }
      };

      const fetchApplicants = async () => {
        try {
          const response = await axios.get(`http://localhost:7004/api/apply/list`, {
            params: { jobId: id },
          });
          setApplicants(response.data);
        } catch (error) {
          console.error("Error fetching applicants:", error);
          setError(error.message || "Error fetching applicants");
        } finally {
          setLoading(false); // Stop the loading state after fetching
        }
      };

      fetchJobDetails();
      fetchApplicants();
    }
  }, [id]);

  const handleDeleteApplicant = (applicantId) => {
    setApplicants((prevApplicants) =>
      prevApplicants.filter((applicant) => applicant._id !== applicantId)
    );
  };

  if (loading) return <LucideLoader />; // Show loader when fetching data
  if (!id) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const totalPages = Math.ceil(applicants.length / itemsPerPage);
  const currentData = applicants.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="flex min-h-screen w-full flex-col lg:p-6">
      <div className="flex flex-col sm:gap-4 sm:pb-1">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <h1 className="text-2xl font-bold">Applicants for Job: {jobName}</h1>
          {currentData.length === 0 ? (
            <p>No applicants found for this job.</p>
          ) : (
            <ApplicantsTable 
              data={currentData} 
              page={page} 
              totalPages={totalPages} 
              onPageChange={setPage} 
              jobId={id} 
              onDeleteApplicant={handleDeleteApplicant} 
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default ApplicantsDetails;
