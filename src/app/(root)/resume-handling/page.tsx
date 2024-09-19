'use client';

import * as React from "react";
import axios from "axios";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Table, TableBody, TableFooter, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/auth/context/jwt/auth-provider'; // Adjust the import path as necessary
import { useToast } from "@/components/ui/use-toast"; // Import the useToast hook
import Link from "next/link";

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

// Product Table Component for Resumes
function ProductTable({ data, page, totalPages, onPageChange, onDeleteResume }) {
  const { toast } = useToast(); // Use the toast hook

  const handleDelete = async (resumeId, resumeName) => {
    try {
      // Hit the DELETE API endpoint, passing resumeId directly
      await axios.delete(`http://localhost:7005/api/resumes/${resumeId}`); // resumeId passed directly in the URL

      // Call the parent function to update the state
      onDeleteResume(resumeId);

      // Show success toast
      toast({
        title: "Resume Deleted",
        description: `The resume "${resumeName}" has been successfully deleted.`,
      });
    } catch (error) {
      console.error("Error deleting resume:", error);
      // Show error toast
      toast({
        title: "Error",
        description: "There was an error deleting the resume.",
        variant: "destructive",
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
              <TableHead>Resume Name</TableHead>
              <TableHead>Job Position</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="hidden md:table-cell">Date Saved</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
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
                  <Link href={item.resumeDocument} legacyBehavior>
                    <a rel="noopener noreferrer" className="text-white-600 underline">
                      {item.resumeName}
                    </a>
                  </Link>
                </TableCell>
                <TableCell className="font-medium">{item.jobPosition}</TableCell>
                <TableCell className="font-medium">{item.company}</TableCell>
                <TableCell className="hidden md:table-cell">{formatDate(item.dateSaved)}</TableCell>
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
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(item._id, item.resumeName)}>Delete</DropdownMenuItem>
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

// Dialog Component for Adding a Resume
function AddResumeDialog({ onAddResume }) {
  const { userId } = useAuth();
  const [resumeName, setResumeName] = React.useState("");
  const [jobPosition, setJobPosition] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [resumeFile, setResumeFile] = React.useState(null);
  const [open, setOpen] = React.useState(false); // State to control the dialog visibility
  const { toast } = useToast(); // Use the toast hook

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleAddResume = async () => {
    if (!resumeFile || !resumeName || !jobPosition || !company) {
      toast({
        title: "Error",
        description: "Please fill in all fields and upload a resume file.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("resumeName", resumeName);
    formData.append("jobPosition", jobPosition);
    formData.append("company", company);
    formData.append("resume", resumeFile);
    formData.append("authServiceId", userId); // Ensure authServiceId is passed

    try {
      await onAddResume(formData);
      toast({
        title: "Resume Added",
        description: "Your new resume has been successfully added.",
      });
      setOpen(false); // Close the dialog on successful submission
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error adding the resume.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Manually add a Resume
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Resume</DialogTitle>
          <DialogDescription>
            Enter the details for the new resume. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="resumeName" className="text-right">
              Resume Name
            </Label>
            <Input id="resumeName" value={resumeName} onChange={(e) => setResumeName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="jobPosition" className="text-right">
              Job Position
            </Label>
            <Input id="jobPosition" value={jobPosition} onChange={(e) => setJobPosition(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company" className="text-right">
              Company
            </Label>
            <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="resumeFile" className="text-right">
              Upload Resume
            </Label>
            <Input id="resumeFile" type="file" onChange={handleFileChange} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleAddResume}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Main Component to Track Resumes
export default function TrackResumes() {
  const { userId, accessToken } = useAuth();
  const [page, setPage] = React.useState(1);
  const [currentTab, setCurrentTab] = React.useState("all");
  const [resumeData, setResumeData] = React.useState([]);
  const itemsPerPage = 7;
  const { toast } = useToast(); // Use the toast hook

  React.useEffect(() => {
    if (userId) {
      // Fetch resumes from API
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:7005/api/users/${userId}/resumes`);
          setResumeData(response.data);
          toast({
            title: "Resumes Loaded",
            description: "Resume data loaded successfully.",
          });
        } catch (error) {
          console.error("Error fetching data:", error);
          setResumeData([]);
          toast({
            title: "Error",
            description: "There was an error fetching the resume data.",
            variant: "destructive",
          });
        }
      };

      fetchData();
    }
  }, [userId, accessToken, toast]);

  React.useEffect(() => {
    setPage(1); // Reset to the first page when the tab changes
  }, [currentTab]);

  const filteredData = Array.isArray(resumeData) ? resumeData.filter((resume) => currentTab === "all" || resume.status === currentTab) : [];
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleAddResume = async (formData) => {
    try {
      await axios.post(`http://localhost:7005/api/resumes`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // After adding the resume, fetch the updated list of resumes
      const response = await axios.get(`http://localhost:7005/api/users/${userId}/resumes`);
      setResumeData(response.data);
      toast({
        title: "Resume Added",
        description: "The resume has been successfully added.",
      });
    } catch (error) {
      console.error('Error adding resume:', error);
      toast({
        title: "Error",
        description: "There was an error adding the resume.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteResume = (resumeId) => {
    // Update the state by removing the deleted resume
    setResumeData((prevData) => prevData.filter((resume) => resume._id !== resumeId));
  };

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
                  <AddResumeDialog onAddResume={handleAddResume} />
                </div>
              </div>
              <TabsContent value="all">
                <ProductTable data={currentData} page={page} totalPages={totalPages} onPageChange={setPage} onDeleteResume={handleDeleteResume} />
              </TabsContent>
              <TabsContent value="active">
                <ProductTable data={currentData} page={page} totalPages={totalPages} onPageChange={setPage} onDeleteResume={handleDeleteResume} />
              </TabsContent>
              <TabsContent value="draft">
                <ProductTable data={currentData} page={page} totalPages={totalPages} onPageChange={setPage} onDeleteResume={handleDeleteResume} />
              </TabsContent>
              <TabsContent value="archived">
                <ProductTable data={currentData} page={page} totalPages={totalPages} onPageChange={setPage} onDeleteResume={handleDeleteResume} />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
