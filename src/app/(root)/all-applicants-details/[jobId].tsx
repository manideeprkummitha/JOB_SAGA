'use client'
import * as React from "react";
import { useRouter } from "next/router"; // Correct import for router
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import axios from "axios";

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
  return (
    <Card>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sl.No</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Job Role</TableHead>
              <TableHead className="hidden md:table-cell">Current Company</TableHead>
              <TableHead className="hidden md:table-cell">Applied Date</TableHead>
              <TableHead className="hidden md:table-cell">Resume</TableHead>
              <TableHead className="hidden md:table-cell">No of years of Experience</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item._id}>
                <TableCell className="font-medium">{(page - 1) * 7 + index + 1}</TableCell>
                <TableCell>
                  <Link href="https://www.linkedin.com/feed/" legacyBehavior>
                    <a target="_blank" rel="noopener noreferrer" className="text-white-600 underline">
                      {item.fullName}
                    </a>
                  </Link>
                </TableCell>
                <TableCell className="font-medium">{item.jobRole}</TableCell>
                <TableCell className="font-medium">{item.currentCompany}</TableCell>
                <TableCell className="hidden md:table-cell">{item.appliedDate}</TableCell>
                <TableCell className="hidden md:table-cell">{item.resume}</TableCell>
                <TableCell className="hidden md:table-cell">{item.experience}</TableCell>
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
                      <DropdownMenuItem onClick={() => handleSaveApplicant(item._id)}>Save</DropdownMenuItem>
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
              <TableCell colSpan="8">
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
export default function ApplicantsContacts() {
  const router = useRouter();
  const { jobId } = router.query; // Correct way to get jobId
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 7;
  const [applicants, setApplicants] = React.useState([]);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (jobId) {
      // Fetch applicants for the job
      const fetchApplicants = async () => {
        try {
          const response = await axios.get(`/api/jobs/${jobId}`);
          setApplicants(response.data.applicants);
        } catch (error) {
          console.error("Error fetching applicants:", error);
          setError(error.message || "Error fetching applicants");
        }
      };

      fetchApplicants();
    }
  }, [jobId]);

  const handleSaveApplicant = async (applicantId) => {
    try {
      await axios.post('/api/savedApplicants', { jobId, applicantId });
      console.log("Applicant saved successfully.");
    } catch (error) {
      console.error("Error saving applicant:", error);
    }
  };

  if (!jobId) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const totalPages = Math.ceil(applicants.length / itemsPerPage);
  const currentData = applicants.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full flex-col lg:p-6">
        <div className="flex flex-col sm:gap-4 sm:pb-1">
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <p>Job Applicants</p>
            <span>Job Post Name</span>
            <ProductTable data={currentData} page={page} totalPages={totalPages} onPageChange={setPage} />
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
