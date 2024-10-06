'use client'
import * as React from "react";
import Link from "next/link";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/auth/context/jwt/auth-provider";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import LucideLoader from "@/components/common/loader/lucide-loader"; // Import the loader

// AddContactDialog Component
function AddContactDialog({ onAddContact }) {
  const [name, setName] = React.useState<string>("");
  const [company, setCompany] = React.useState<string>("");
  const [location, setLocation] = React.useState<string>("");
  const [goal, setGoal] = React.useState<string>("");
  const [status, setStatus] = React.useState<string>("active");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const { accessToken } = useAuth(); // Get access token from auth context
  const { toast } = useToast(); // Use the toast hook

  const handleAddContact = async () => {
    try {
      const newContact = {
        name,
        company,
        location,
        goal,
        status,
      };

      // Make POST request to add the new contact
      await axios.post('http://localhost:7002/api/contact', newContact, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      // Update the parent component's state
      onAddContact(newContact);

      toast({
        title: "Contact Added",
        description: "The new contact has been successfully added.",
      });

      // Reset form fields
      setName("");
      setCompany("");
      setLocation("");
      setGoal("");
      setStatus("active");

      // Close the dialog
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error adding contact:', error);
      toast({
        title: "Error",
        description: "There was an error adding the contact.",
        variant: "destructive",
      });
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
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleAddContact}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Product Table Component
function ProductTable({ data, page, totalPages, onPageChange, onUpdateContact, onDeleteContact }) {
  const { toast } = useToast(); // Use the toast hook
  const { accessToken } = useAuth();

  const handleDelete = async (contactId, index) => {
    try {
      await axios.delete(`http://localhost:7002/api/contact/${contactId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });

      onDeleteContact(contactId);

      toast({
        title: "Contact Deleted",
        description: `The contact ${data[index].name} has been successfully deleted.`,
        variant: "destructive",
      });
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast({
        title: "Error",
        description: "There was an error deleting the contact.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Sl.No</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Goal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium">{(page - 1) * 7 + index + 1}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="font-medium">{item.company}</TableCell>
                  <TableCell className="font-medium">{item.location}</TableCell>
                  <TableCell className="font-medium">{item.goal}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleDelete(item._id, index)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-transparent">
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan="11">
                  <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </>
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

// Main Component
export default function Contact() {
  const { accessToken } = useAuth();
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 7;
  const [currentTab, setCurrentTab] = React.useState("all");
  const [contacts, setContacts] = React.useState([]);
  const [loading, setLoading] = React.useState(true); // Add loading state
  const { toast } = useToast(); // Use the toast hook

  React.useEffect(() => {
    setPage(1); // Reset to the first page when the tab changes
  }, [currentTab]);

  React.useEffect(() => {
    if (!accessToken) return;

    const fetchContacts = async () => {
      setLoading(true); // Set loading to true when starting fetch
      try {
        const response = await axios.get('http://localhost:7002/api/contact', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setContacts(response.data);
        toast({
          title: "Contacts Loaded",
          description: "Contact data loaded successfully.",
        });
      } catch (error) {
        console.error("Error fetching contacts:", error);
        toast({
          title: "Error",
          description: "There was an error fetching the contact data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchContacts();
  }, [accessToken]);

  const filteredData = contacts.filter((contact) => currentTab === "all" || contact.status === currentTab);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleAddContact = (newContact) => {
    setContacts([...contacts, newContact]);
  };

  const handleUpdateContact = (contactId, updatedContact) => {
    setContacts(contacts.map((contact) => contact._id === contactId ? updatedContact : contact));
  };

  const handleDeleteContact = (contactId) => {
    setContacts(contacts.filter((contact) => contact._id !== contactId));
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
                  <AddContactDialog onAddContact={handleAddContact} />
                </div>
              </div>
              {/* Conditionally render loader or ProductTable */}
              <TabsContent value="all">
                {loading ? (
                  <LucideLoader /> // Show loader when loading
                ) : (
                  <ProductTable 
                    data={currentData} 
                    page={page} 
                    totalPages={totalPages} 
                    onPageChange={setPage} 
                    onUpdateContact={handleUpdateContact} 
                    onDeleteContact={handleDeleteContact} 
                  />
                )}
              </TabsContent>
              <TabsContent value="active">
                {loading ? (
                  <LucideLoader /> // Show loader when loading
                ) : (
                  <ProductTable 
                    data={currentData} 
                    page={page} 
                    totalPages={totalPages} 
                    onPageChange={setPage} 
                    onUpdateContact={handleUpdateContact} 
                    onDeleteContact={handleDeleteContact} 
                  />
                )}
              </TabsContent>
              <TabsContent value="draft">
                {loading ? (
                  <LucideLoader /> // Show loader when loading
                ) : (
                  <ProductTable 
                    data={currentData} 
                    page={page} 
                    totalPages={totalPages} 
                    onPageChange={setPage} 
                    onUpdateContact={handleUpdateContact} 
                    onDeleteContact={handleDeleteContact} 
                  />
                )}
              </TabsContent>
              <TabsContent value="archived">
                {loading ? (
                  <LucideLoader /> // Show loader when loading
                ) : (
                  <ProductTable 
                    data={currentData} 
                    page={page} 
                    totalPages={totalPages} 
                    onPageChange={setPage} 
                    onUpdateContact={handleUpdateContact} 
                    onDeleteContact={handleDeleteContact} 
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
