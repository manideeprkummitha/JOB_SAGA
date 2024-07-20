'use client'
import * as React from "react";
import Link from "next/link";
import { MoreHorizontal, PlusCircle, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast"; // Import the useToast hook

// Generate Dummy Data
const generateDummyData = () => {
  const data = [];
  const statuses = ["active", "draft", "archived"];
  for (let i = 1; i <= 25; i++) {
    data.push({
      id: i,
      resumeName: `Resume ${i}`,
      jobPosition: `Software Engineer ${i}`,
      company: `Company ${i}`,
      dateSaved: `2023-07-${i < 10 ? `0${i}` : i}`,
      status: statuses[i % 3],
      validation: `${i * 10}%`,
    });
  }
  return data;
};

const dummyData = generateDummyData();

function DatePickerDemo({ date, setDate }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "MMMM dd, yyyy") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

// Function to add or edit a resume via dialog
function ResumeDialog({ onAddResume, onEditResume, editData, closeDialog }) {
  const [date, setDate] = React.useState<Date | null>(editData ? new Date(editData.dateSaved) : null);
  const [file, setFile] = React.useState<File | null>(null);
  const [resumeName, setResumeName] = React.useState<string>(editData ? editData.resumeName : "");
  const [jobPosition, setJobPosition] = React.useState<string>(editData ? editData.jobPosition : "");
  const [company, setCompany] = React.useState<string>(editData ? editData.company : "");
  const [status, setStatus] = React.useState<string>(editData ? editData.status : "active");
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (editData) {
      onEditResume({
        ...editData,
        resumeName,
        jobPosition,
        company,
        dateSaved: date ? format(date, "yyyy-MM-dd") : "",
        status,
      });
      toast({
        title: "Resume Updated",
        description: `${resumeName} has been updated.`,
      });
    } else {
      onAddResume({
        id: dummyData.length + 1,
        resumeName,
        jobPosition,
        company,
        dateSaved: date ? format(date, "yyyy-MM-dd") : "",
        status,
        validation: "0%",
      });
      toast({
        title: "Resume Added",
        description: `${resumeName} has been added.`,
      });
    }
    closeDialog();
  };

  return (
    <Dialog open={true} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Resume" : "Add New Resume"}</DialogTitle>
          <DialogDescription>
            Enter the details for handling your resume.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="resumeFile" className="text-right">
              Resume File
            </Label>
            <Input id="resumeFile" type="file" className="col-span-3" onChange={handleFileChange} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="resumeName" className="text-right">
              Resume Name
            </Label>
            <Input id="resumeName" className="col-span-3" value={resumeName} onChange={(e) => setResumeName(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="jobPosition" className="text-right">
              Job Position
            </Label>
            <Input id="jobPosition" className="col-span-3" value={jobPosition} onChange={(e) => setJobPosition(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company" className="text-right">
              Company
            </Label>
            <Input id="company" className="col-span-3" value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <div className="col-span-3">
              <Select onValueChange={setStatus} defaultValue={status} className="w-full">
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>
            Save changes
          </Button>
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
function ProductTable({ data, page, totalPages, onPageChange, onEdit, onDelete }) {
  return (
    <Card>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sl.No</TableHead>
              <TableHead>Resume Name</TableHead>
              <TableHead>Job Position</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="hidden md:table-cell">Date Saved</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead>Validation</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{(page - 1) * 7 + index + 1}</TableCell>
                <TableCell className="font-medium">
                  <Link href="https://www.linkedin.com/feed/" legacyBehavior>
                    <a target="_blank" rel="noopener noreferrer" className="text-white-600 underline">
                      {item.resumeName}
                    </a>
                  </Link>
                </TableCell>
                <TableCell className="font-medium">{item.jobPosition}</TableCell>
                <TableCell className="font-medium">{item.company}</TableCell>
                <TableCell className="hidden md:table-cell">{format(new Date(item.dateSaved), "MMMM dd, yyyy")}</TableCell>
                <TableCell>
                  <Badge variant="outline">{item.status}</Badge>
                </TableCell>
                <TableCell className="font-medium">{item.validation}</TableCell>
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
                      <DropdownMenuItem onClick={() => onEdit(item)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(item.id)}>Delete</DropdownMenuItem>
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
export default function TrackJob() {
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 7;
  const [currentTab, setCurrentTab] = React.useState("all");
  const [resumes, setResumes] = React.useState(dummyData);
  const [editData, setEditData] = React.useState(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    setPage(1); // Reset to the first page when the tab changes
  }, [currentTab]);

  const filteredData = resumes.filter((resume) => currentTab === "all" || resume.status === currentTab);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleAddResume = (newResume) => {
    setResumes([...resumes, newResume]);
  };

  const handleEditResume = (updatedResume) => {
    setResumes(resumes.map(resume => resume.id === updatedResume.id ? updatedResume : resume));
    setEditData(null);
  };

  const handleDeleteResume = (id) => {
    setResumes(resumes.filter(resume => resume.id !== id));
    toast({ title: "Resume Deleted", description: `Resume with ID ${id} has been deleted.` });
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                          Export
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Export by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Csv</DropdownMenuItem>
                      <DropdownMenuItem>Pdf</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button size="sm" className="h-8 gap-1" onClick={() => setIsDialogOpen(true)}>
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Manually add a Resume
                    </span>
                  </Button>
                </div>
              </div>
              <TabsContent value="all">
                <ProductTable data={currentData} page={page} totalPages={totalPages} onPageChange={setPage} onEdit={(data) => { setEditData(data); setIsDialogOpen(true); }} onDelete={handleDeleteResume} />
              </TabsContent>
              <TabsContent value="active">
                <ProductTable data={currentData} page={page} totalPages={totalPages} onPageChange={setPage} onEdit={(data) => { setEditData(data); setIsDialogOpen(true); }} onDelete={handleDeleteResume} />
              </TabsContent>
              <TabsContent value="draft">
                <ProductTable data={currentData} page={page} totalPages={totalPages} onPageChange={setPage} onEdit={(data) => { setEditData(data); setIsDialogOpen(true); }} onDelete={handleDeleteResume} />
              </TabsContent>
              <TabsContent value="archived">
                <ProductTable data={currentData} page={page} totalPages={totalPages} onPageChange={setPage} onEdit={(data) => { setEditData(data); setIsDialogOpen(true); }} onDelete={handleDeleteResume} />
              </TabsContent>
            </Tabs>
            {isDialogOpen && (
              <ResumeDialog
                editData={editData}
                onAddResume={handleAddResume}
                onEditResume={handleEditResume}
                closeDialog={() => {
                  setIsDialogOpen(false);
                  setEditData(null);
                }}
              />
            )}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
