'use client';
import * as React from "react";
import Link from "next/link";
import { MoreHorizontal, PlusCircle, CalendarIcon, Save, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

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
function ProductTable({ data, page, totalPages, onPageChange, onEdit, onDelete, onSave, editingRowId, setEditingRowId }) {
  const [editState, setEditState] = React.useState({
    resumeName: '',
    jobPosition: '',
    company: '',
    dateSaved: '',
    status: 'active'
  });

  React.useEffect(() => {
    if (editingRowId) {
      const rowData = data.find(row => row.id === editingRowId);
      setEditState(rowData || {
        resumeName: '',
        jobPosition: '',
        company: '',
        dateSaved: '',
        status: 'active'
      });
    }
  }, [editingRowId, data]);

  const handleSave = () => {
    if (editState) {
      onSave(editState);
      setEditingRowId(null);
    }
  };

  const handleCancel = () => {
    setEditingRowId(null);
  };

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
                  {editingRowId === item.id ? (
                    <Input
                      value={editState?.resumeName || ''}
                      onChange={(e) => setEditState({ ...editState, resumeName: e.target.value })}
                    />
                  ) : (
                    <Link href="https://www.linkedin.com/feed/" legacyBehavior>
                      <a target="_blank" rel="noopener noreferrer" className="text-white-600 underline">
                        {item.resumeName}
                      </a>
                    </Link>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  {editingRowId === item.id ? (
                    <Input
                      value={editState?.jobPosition || ''}
                      onChange={(e) => setEditState({ ...editState, jobPosition: e.target.value })}
                    />
                  ) : (
                    item.jobPosition
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  {editingRowId === item.id ? (
                    <Input
                      value={editState?.company || ''}
                      onChange={(e) => setEditState({ ...editState, company: e.target.value })}
                    />
                  ) : (
                    item.company
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {editingRowId === item.id ? (
                    <DatePickerDemo
                      date={editState?.dateSaved ? new Date(editState.dateSaved) : new Date()}
                      setDate={(date) => setEditState({ ...editState, dateSaved: format(date, "yyyy-MM-dd") })}
                    />
                  ) : (
                    format(new Date(item.dateSaved), "MMMM dd, yyyy")
                  )}
                </TableCell>
                <TableCell>
                  {editingRowId === item.id ? (
                    <Select
                      onValueChange={(value) => setEditState({ ...editState, status: value })}
                      defaultValue={editState?.status || 'active'}
                      className="w-full"
                    >
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
                  ) : (
                    <Badge variant="outline">{item.status}</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {editingRowId === item.id ? (
                    <>
                      <Button size="sm" className="mr-2" onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={handleCancel}>
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setEditingRowId(item.id)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(item.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
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
  const [editingRowId, setEditingRowId] = React.useState(null);
  const { toast } = useToast();

  React.useEffect(() => {
    setPage(1); // Reset to the first page when the tab changes
  }, [currentTab]);

  const filteredData = resumes.filter((resume) => currentTab === "all" || resume.status === currentTab);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleAddResume = () => {
    if (editingRowId !== null) {
      toast({
        title: "Complete the current addition",
        description: "Please save or cancel the current resume before adding a new one.",
      });
      return;
    }

    const newResume = {
      id: resumes.length + 1,
      resumeName: "",
      jobPosition: "",
      company: "",
      dateSaved: format(new Date(), "yyyy-MM-dd"),
      status: "active",
    };

    // Calculate the new page number for the added resume
    const newTotalItems = resumes.length + 1;
    const newPage = Math.ceil(newTotalItems / itemsPerPage);

    setResumes([...resumes, newResume]);
    setEditingRowId(newResume.id);
    setPage(newPage); // Set to the page where the new resume will appear
  };

  const handleSaveResume = (updatedResume) => {
    setResumes(resumes.map(resume => resume.id === updatedResume.id ? updatedResume : resume));
    setEditingRowId(null);
    toast({
      title: "Resume Updated",
      description: `${updatedResume.resumeName || 'New Resume'} has been saved.`,
    });
  };

  const handleDeleteResume = (id) => {
    const deletedResume = resumes.find(resume => resume.id === id);
    setResumes(resumes.filter(resume => resume.id !== id));
    toast({
      title: "Resume Deleted",
      description: `Resume with ID ${id} has been deleted.`,
      action: (
        <ToastAction
          altText="Undo"
          onClick={() => {
            setResumes(prevResumes => [...prevResumes, deletedResume]);
          }}
        >
          Undo
        </ToastAction>
      ),
    });
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
                  <Button size="sm" className="h-8 gap-1" onClick={handleAddResume}>
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Manually add a Resume
                    </span>
                  </Button>
                </div>
              </div>
              <TabsContent value="all">
                <ProductTable data={currentData} page={page} totalPages={totalPages} onPageChange={setPage} onEdit={(data) => { setEditingRowId(data.id); }} onDelete={handleDeleteResume} onSave={handleSaveResume} editingRowId={editingRowId} setEditingRowId={setEditingRowId} />
              </TabsContent>
              <TabsContent value="active">
                <ProductTable data={currentData} page={page} totalPages={totalPages} onPageChange={setPage} onEdit={(data) => { setEditingRowId(data.id); }} onDelete={handleDeleteResume} onSave={handleSaveResume} editingRowId={editingRowId} setEditingRowId={setEditingRowId} />
              </TabsContent>
              <TabsContent value="draft">
                <ProductTable data={currentData} page={page} totalPages={totalPages} onPageChange={setPage} onEdit={(data) => { setEditingRowId(data.id); }} onDelete={handleDeleteResume} onSave={handleSaveResume} editingRowId={editingRowId} setEditingRowId={setEditingRowId} />
              </TabsContent>
              <TabsContent value="archived">
                <ProductTable data={currentData} page={page} totalPages={totalPages} onPageChange={setPage} onEdit={(data) => { setEditingRowId(data.id); }} onDelete={handleDeleteResume} onSave={handleSaveResume} editingRowId={editingRowId} setEditingRowId={setEditingRowId} />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
