'use client'
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Generate Dummy Data
const generateDummyData = () => {
  const data = [];
  const statuses = ["active", "draft", "archived"];
  for (let i = 1; i <= 25; i++) {
    data.push({
      id: i,
      fullName: `Applicant ${i}`,
      jobRole: `Role ${i}`,
      currentCompany: `Company ${i}`,
      appliedDate: `2023-07-${i < 10 ? `0${i}` : i}`,
      resume: `resume${i}.pdf`,
      experience: `${i} years`,
      status: statuses[i % 3],
    });
  }
  return data;
};

const dummyData = generateDummyData();

function AddApplicantDialog({ onAddApplicant }) {
  const [fullName, setFullName] = React.useState<string>("");
  const [jobRole, setJobRole] = React.useState<string>("");
  const [currentCompany, setCurrentCompany] = React.useState<string>("");
  const [appliedDate, setAppliedDate] = React.useState<string>("");
  const [resume, setResume] = React.useState<File | null>(null);
  const [experience, setExperience] = React.useState<string>("");
  const [status, setStatus] = React.useState<string>("active");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setResume(event.target.files[0]);
    }
  };

  const handleAddApplicant = () => {
    onAddApplicant({
      id: dummyData.length + 1,
      fullName,
      jobRole,
      currentCompany,
      appliedDate,
      resume: resume ? resume.name : '',
      experience,
      status,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Applicants
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Applicant</DialogTitle>
          <DialogDescription>
            Enter the details for the new applicant and upload their resume.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="applicantName" className="text-right">
              Full Name
            </Label>
            <Input id="applicantName" className="col-span-3" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="jobRole" className="text-right">
              Job Role
            </Label>
            <Input id="jobRole" className="col-span-3" value={jobRole} onChange={(e) => setJobRole(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="currentCompany" className="text-right">
              Current Company
            </Label>
            <Input id="currentCompany" className="col-span-3" value={currentCompany} onChange={(e) => setCurrentCompany(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="appliedDate" className="text-right">
              Applied Date
            </Label>
            <Input id="appliedDate" type="date" className="col-span-3" value={appliedDate} onChange={(e) => setAppliedDate(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="experience" className="text-right">
              Experience
            </Label>
            <Input id="experience" className="col-span-3" value={experience} onChange={(e) => setExperience(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Input id="status" className="col-span-3" value={status} onChange={(e) => setStatus(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="resumeFile" className="text-right">
              Resume File
            </Label>
            <Input id="resumeFile" type="file" className="col-span-3" onChange={handleFileChange} />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleAddApplicant}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Pagination Component
export const Pagination = ({ page, totalPages, onPageChange }) => {
  const handleNavigation = (type: "prev" | "next") => {
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
              <TableHead className="hidden md:table-cell">Experience</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item.id}>
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
                      <DropdownMenuItem>Save</DropdownMenuItem>
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
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 7;
  const [currentTab, setCurrentTab] = React.useState("all");
  const [applicants, setApplicants] = React.useState(dummyData);

  React.useEffect(() => {
    setPage(1); // Reset to the first page when the tab changes
  }, [currentTab]);

  const filteredData = applicants.filter((applicant) => currentTab === "all" || applicant.status === currentTab);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleAddApplicant = (newApplicant) => {
    setApplicants([...applicants, newApplicant]);
  };

  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full flex-col lg:p-6">
        <div className="flex flex-col sm:gap-4 sm:pb-1">
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Tabs defaultValue="all" onValueChange={(value) => setCurrentTab(value)}>
              {/* <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="draft">Draft</TabsTrigger>
                  <TabsTrigger value="archived" className="hidden sm:flex">
                    Archived
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
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Csv</DropdownMenuItem>
                      <DropdownMenuItem>Pdf</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <AddApplicantDialog onAddApplicant={handleAddApplicant} />
                </div>
              </div> */}
              <TabsContent value="all">
                <ProductTable data={currentData} page={page} totalPages={totalPages} onPageChange={setPage} />
              </TabsContent>
              <TabsContent value="active">
                <ProductTable data={currentData} page={page} totalPages={totalPages} onPageChange={setPage} />
              </TabsContent>
              <TabsContent value="draft">
                <ProductTable data={currentData} page={page} totalPages={totalPages} onPageChange={setPage} />
              </TabsContent>
              <TabsContent value="archived">
                <ProductTable data={currentData} page={page} totalPages={totalPages} onPageChange={setPage} />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
