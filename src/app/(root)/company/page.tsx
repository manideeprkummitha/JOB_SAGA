'use client'
import * as React from "react";
import Link from "next/link";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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

// AddCompanyDialog Component
function AddCompanyDialog({ onAddCompany }) {
  const [name, setName] = React.useState<string>("");
  const [industry, setIndustry] = React.useState<string>("");
  const [location, setLocation] = React.useState<string>("");
  const [size, setSize] = React.useState<string>("small");
  const [type, setType] = React.useState<string>("public");
  const [status, setStatus] = React.useState<string>("active");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const { accessToken } = useAuth(); // Get access token from auth context
  const { toast } = useToast(); // Use the toast hook

  const handleAddCompany = async () => {
    try {
      const newCompany = {
        name,
        industry,
        location,
        size,
        type,
        status,
      };

      // Make POST request to add the new company
      await axios.post('http://localhost:7002/api/contact/company', newCompany, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      // Update the parent component's state
      onAddCompany(newCompany);

      toast({
        title: "Company Added",
        description: "The new company has been successfully added.",
      });

      // Reset form fields
      setName("");
      setIndustry("");
      setLocation("");
      setSize("small");
      setType("public");
      setStatus("active");

      // Close the dialog
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error adding company:', error);
      toast({
        title: "Error",
        description: "There was an error adding the company.",
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
            Add Company
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Company</DialogTitle>
          <DialogDescription>
            Enter the details for the new company. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Company Name
            </Label>
            <Input id="name" className="col-span-3" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="industry" className="text-right">
              Industry
            </Label>
            <Input id="industry" className="col-span-3" value={industry} onChange={(e) => setIndustry(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Input id="location" className="col-span-3" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="size" className="text-right">
              Size
            </Label>
            <div className="col-span-3">
              <Select onValueChange={setSize} defaultValue="small" className="w-full">
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <div className="col-span-3">
              <Select onValueChange={setType} defaultValue="public" className="w-full">
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
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
          <Button type="button" onClick={handleAddCompany}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// EditCompanyDialog Component
function EditCompanyDialog({ company, onUpdateCompany }) {
  const [name, setName] = React.useState<string>(company.name || "");
  const [industry, setIndustry] = React.useState<string>(company.industry || "");
  const [location, setLocation] = React.useState<string>(company.location || "");
  const [size, setSize] = React.useState<string>(company.size || "small");
  const [type, setType] = React.useState<string>(company.type || "public");
  const [status, setStatus] = React.useState<string>(company.status || "active");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const { accessToken } = useAuth();
  const { toast } = useToast();

  const handleOpen = () => {
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleUpdateCompany = async () => {
    try {
      const updatedCompany = {
        name,
        industry,
        location,
        size,
        type,
        status,
      };

      // Make PUT request to update the company
      await axios.put(`http://localhost:7002/api/companies/${company._id}`, updatedCompany, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      // Update the parent component's state
      onUpdateCompany(company._id, updatedCompany);

      toast({
        title: "Company Updated",
        description: "The company has been successfully updated.",
      });

      // Close the dialog
      handleClose();
    } catch (error) {
      console.error('Error updating company:', error);
      toast({
        title: "Error",
        description: "There was an error updating the company.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Instead of DropdownMenuItem, use Button to control the open state */}
      <Button onClick={handleOpen} className="w-full text-left items-start justify-start" variant="ghost">Edit</Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
            <DialogDescription>
              Modify the details for the company. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Company Name</Label>
              <Input id="name" className="col-span-3" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="industry" className="text-right">Industry</Label>
              <Input id="industry" className="col-span-3" value={industry} onChange={(e) => setIndustry(e.target.value)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">Location</Label>
              <Input id="location" className="col-span-3" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="size" className="text-right">Size</Label>
              <div className="col-span-3">
                <Select onValueChange={setSize} value={size} className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Type</Label>
              <div className="col-span-3">
                <Select onValueChange={setType} value={type} className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <div className="col-span-3">
                <Select onValueChange={setStatus} value={status} className="w-full">
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
            <Button type="button" onClick={handleUpdateCompany}>Save changes</Button>
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}




// Product Table Component
function ProductTable({ data, page, totalPages, onPageChange, onUpdateCompany, onDeleteCompany }) {
  const { toast } = useToast(); // Use the toast hook
  const { accessToken } = useAuth();

  const handleDelete = async (companyId, index) => {
    try {
      // Make DELETE request to delete the company
      await axios.delete(`http://localhost:7002/api/companies/${companyId}`, {
        // headers: {
        //   Authorization: `Bearer ${accessToken}`
        // }
      });

      // Remove the company from the state
      onDeleteCompany(companyId);

      toast({
        title: "Company Deleted",
        description: `The company ${data[index].name} has been successfully deleted.`,
        variant: "destructive",
      });
    } catch (error) {
      console.error('Error deleting company:', error);
      toast({
        title: "Error",
        description: "There was an error deleting the company.",
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
              <TableHead>Name</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Type</TableHead>
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
                <TableCell>
                  <Link href="https://www.linkedin.com/feed/" legacyBehavior>
                    <a target="_blank" rel="noopener noreferrer" className="text-white-600 underline">
                      {item.name}
                    </a>
                  </Link>
                </TableCell>
                <TableCell className="font-medium">{item.industry}</TableCell>
                <TableCell className="font-medium">{item.location}</TableCell>
                <TableCell className="font-medium">{item.size}</TableCell>
                <TableCell className="font-medium">{item.type}</TableCell>
                <TableCell className="hidden md:table-cell">
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
                      <EditCompanyDialog 
                          company={item}
                          onUpdateCompany={onUpdateCompany} 
                        />
                      <DropdownMenuItem onClick={() => handleDelete(item._id, index)}>Delete</DropdownMenuItem>
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
export default function Company() {
  const { accessToken } = useAuth();
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 7;
  const [currentTab, setCurrentTab] = React.useState("all");
  const [companies, setCompanies] = React.useState([]);
  const { toast } = useToast(); // Use the toast hook

  React.useEffect(() => {
    setPage(1); // Reset to the first page when the tab changes
  }, [currentTab]);

  React.useEffect(() => {
    if (!accessToken) return;

    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:7002/api/contact/company', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setCompanies(response.data);
        toast({
          title: "Companies Loaded",
          description: "Company data loaded successfully.",
        });
      } catch (error) {
        console.error("Error fetching companies:", error);
        toast({
          title: "Error",
          description: "There was an error fetching the company data.",
          variant: "destructive",
        });
      }
    };

    fetchCompanies();
  }, [accessToken]);

  const filteredData = companies.filter((company) => currentTab === "all" || company.status === currentTab);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleAddCompany = (newCompany) => {
    setCompanies([...companies, newCompany]);
  };

  const handleUpdateCompany = (companyId, updatedCompany) => {
    setCompanies((prevCompanies) => 
      prevCompanies.map((company) => company._id === companyId ? { ...company, ...updatedCompany } : company)
    );
  };
  

  const handleDeleteCompany = (companyId) => {
    setCompanies(companies.filter((company) => company._id !== companyId));
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
                  {/* <DropdownMenu>
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
                  </DropdownMenu> */}
                  <AddCompanyDialog onAddCompany={handleAddCompany} />
                </div>
              </div>
              <TabsContent value="all">
                <ProductTable data={currentData} page={page} totalPages={totalPages} onPageChange={setPage} onUpdateCompany={handleUpdateCompany} onDeleteCompany={handleDeleteCompany} />
              </TabsContent>
              <TabsContent value="active">
                <ProductTable data={currentData} page={page} totalPages={totalPages} onPageChange={setPage} onUpdateCompany={handleUpdateCompany} onDeleteCompany={handleDeleteCompany} />
              </TabsContent>
              <TabsContent value="draft">
                <ProductTable data={currentData} page={page} totalPages={totalPages} onPageChange={setPage} onUpdateCompany={handleUpdateCompany} onDeleteCompany={handleDeleteCompany} />
              </TabsContent>
              <TabsContent value="archived">
                <ProductTable data={currentData} page={page} totalPages={totalPages} onPageChange={setPage} onUpdateCompany={handleUpdateCompany} onDeleteCompany={handleDeleteCompany} />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
