'use client';
import * as React from "react";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import axios from 'axios';

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
const ApplicantsTable = ({ data, page, totalPages, onPageChange, jobId }) => {
  return (
    <Card>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
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
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <tfoot>
            <TableRow>
              <TableCell colSpan="6">
                <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
              </TableCell>
            </TableRow>
          </tfoot>
        </Table>
      </CardContent>
    </Card>
  );
};

// Main Component
const SavedApplicantsDetails = ({ params }) => {
  const { id } = params; // Extract the job ID from the route parameters
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 7;
  const [applicants, setApplicants] = React.useState([]);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (id) {
      // Fetch saved applicants for the job
      const fetchApplicants = async () => {
        try {
          const response = await axios.get(`http://localhost:7004/api/savedApplicants`, {
            params: { jobId: id },
          });
          setApplicants(response.data);
        } catch (error:any) {
          console.error("Error fetching applicants:", error);
          setError(error.message || "Error fetching applicants");
        }
      };

      fetchApplicants();
    }
  }, [id]);

  if (!id) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const totalPages = Math.ceil(applicants.length / itemsPerPage);
  const currentData = applicants.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="flex min-h-screen w-full flex-col lg:p-6">
      <div className="flex flex-col sm:gap-4 sm:pb-1">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <h1 className="text-2xl font-bold">Saved Applicants for Job ID: {id}</h1>
          {currentData.length === 0 ? (
            <p>No applicants found for this job.</p>
          ) : (
            <ApplicantsTable data={currentData} page={page} totalPages={totalPages} onPageChange={setPage} />
          )}
        </main>
      </div>
    </div>
  );
};

export default SavedApplicantsDetails;
