'use client'
import * as React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { MoreHorizontal, PlusCircle, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from 'axios';
import { useAuth } from '@/auth/context/jwt/auth-provider'; // Adjust the import path as necessary

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
          {date ? format(date, "PPP") : <span>Pick a date</span>}
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

function AddContactDialog({ onAddContact }) {
  const [date, setDate] = React.useState<Date | null>(null);
  const [name, setName] = React.useState<string>("");
  const [company, setCompany] = React.useState<string>("");
  const [location, setLocation] = React.useState<string>("");
  const [goal, setGoal] = React.useState<string>("");
  const [status, setStatus] = React.useState<string>("active");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleAddContact = async () => {
    try {
      const newContact = {
        name, // Change 'fullName' to 'name'
        company,
        location,
        goal,
        status,
        followUp: date ? format(date, "yyyy-MM-dd") : "",
      };

      // Call the onAddContact function passed via props to update state in parent component
      await onAddContact(newContact);

      // Reset form fields (optional)
      setName("");
      setCompany("");
      setLocation("");
      setGoal("");
      setStatus("active");
      setDate(null);

      // Close the dialog
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1" onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Contact
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
          <DialogDescription>
            Enter the details for the new contact. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Full Name
            </Label>
            <Input id="name" className="col-span-3" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company" className="text-right">
              Company
            </Label>
            <Input id="company" className="col-span-3" value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Input id="location" className="col-span-3" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="goal" className="text-right">
              Goal
            </Label>
            <Input id="goal" className="col-span-3" value={goal} onChange={(e) => setGoal(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <div className="col-span-3">
              <Select onValueChange={setStatus} defaultValue="active" className="w-full">
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="followUp" className="text-right">
              Follow Up
            </Label>
            <DatePickerDemo date={date} setDate={setDate} />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleAddContact}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


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
              <TableHead>Company</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead className="hidden md:table-cell">Goal</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Follow Up</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{(page - 1) * 7 + index + 1}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="font-medium">{item.company}</TableCell>
                <TableCell className="font-medium">{item.location}</TableCell>
                <TableCell className="font-medium">{item.goal}</TableCell>
                <TableCell>
                  <Badge variant="outline">{item.status}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{item.followUp}</TableCell>
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
  const { accessToken } = useAuth(); // Assume useAuth provides the access token
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 7;
  const [currentTab, setCurrentTab] = React.useState("all");
  const [contacts, setContacts] = React.useState([]);

  React.useEffect(() => {
    setPage(1); // Reset to the first page when the tab changes
  }, [currentTab]);

  // Fetch contacts from the API
  React.useEffect(() => {
    if (!accessToken) return;

    const fetchContacts = async () => {
      try {
        const response = await axios.get('http://localhost:7002/api/contact', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setContacts(response.data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, [accessToken]);

  const filteredData = contacts.filter((contact) => currentTab === "all" || contact.status === currentTab);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleAddContact = async (newContact) => {
    try {
      await axios.post('http://localhost:7002/api/contact', newContact, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      setContacts([...contacts, newContact]);
    } catch (error) {
      console.error('Error adding contact:', error);
    }
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
                      <DropdownMenuItem>Csv</DropdownMenuItem>
                      <DropdownMenuItem>Pdf</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <AddContactDialog onAddContact={handleAddContact} />
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
