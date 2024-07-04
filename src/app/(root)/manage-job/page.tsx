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

function ProductTable() {
  return (
    <Card>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sl.No</TableHead>
              <TableHead>Job Position</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="hidden md:table-cell">Salary-Range</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Date Saved</TableHead>
              <TableHead className="hidden md:table-cell">Date Applied</TableHead>
              <TableHead className="hidden md:table-cell">Follow Up</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell className="font-medium">Software Engineer</TableCell>
              <TableCell className="font-medium">Google</TableCell>
              <TableCell className="font-medium">$5000</TableCell>
              <TableCell className="font-medium">New York</TableCell>
              <TableCell>
                <Badge variant="outline">Draft</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">2023-07-12</TableCell>
              <TableCell className="hidden md:table-cell">2023-07-12</TableCell>
              <TableCell className="hidden md:table-cell">2023-07-12</TableCell>
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

            <TableRow>
              <TableCell>1</TableCell>
              <TableCell className="font-medium">Software Engineer</TableCell>
              <TableCell className="font-medium">Google</TableCell>
              <TableCell className="font-medium">$5000</TableCell>
              <TableCell className="font-medium">New York</TableCell>
              <TableCell>
                <Badge variant="outline">Draft</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">2023-07-12</TableCell>
              <TableCell className="hidden md:table-cell">2023-07-12</TableCell>
              <TableCell className="hidden md:table-cell">2023-07-12</TableCell>
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

            <TableRow>
              <TableCell>1</TableCell>
              <TableCell className="font-medium">Software Engineer</TableCell>
              <TableCell className="font-medium">Google</TableCell>
              <TableCell className="font-medium">$5000</TableCell>
              <TableCell className="font-medium">New York</TableCell>
              <TableCell>
                <Badge variant="outline">Draft</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">2023-07-12</TableCell>
              <TableCell className="hidden md:table-cell">2023-07-12</TableCell>
              <TableCell className="hidden md:table-cell">2023-07-12</TableCell>
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

            <TableRow>
              <TableCell>1</TableCell>
              <TableCell className="font-medium">Software Engineer</TableCell>
              <TableCell className="font-medium">Google</TableCell>
              <TableCell className="font-medium">$5000</TableCell>
              <TableCell className="font-medium">New York</TableCell>
              <TableCell>
                <Badge variant="outline">Draft</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">2023-07-12</TableCell>
              <TableCell className="hidden md:table-cell">2023-07-12</TableCell>
              <TableCell className="hidden md:table-cell">2023-07-12</TableCell>
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

            <TableRow>
              <TableCell>1</TableCell>
              <TableCell className="font-medium">Software Engineer</TableCell>
              <TableCell className="font-medium">Google</TableCell>
              <TableCell className="font-medium">$5000</TableCell>
              <TableCell className="font-medium">New York</TableCell>
              <TableCell>
                <Badge variant="outline">Draft</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">2023-07-12</TableCell>
              <TableCell className="hidden md:table-cell">2023-07-12</TableCell>
              <TableCell className="hidden md:table-cell">2023-07-12</TableCell>
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

            <TableRow>
              <TableCell>1</TableCell>
              <TableCell className="font-medium">Software Engineer</TableCell>
              <TableCell className="font-medium">Google</TableCell>
              <TableCell className="font-medium">$5000</TableCell>
              <TableCell className="font-medium">New York</TableCell>
              <TableCell>
                <Badge variant="outline">Draft</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">2023-07-12</TableCell>
              <TableCell className="hidden md:table-cell">2023-07-12</TableCell>
              <TableCell className="hidden md:table-cell">2023-07-12</TableCell>
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

            <TableRow>
              <TableCell>1</TableCell>
              <TableCell className="font-medium">Software Engineer</TableCell>
              <TableCell className="font-medium">Google</TableCell>
              <TableCell className="font-medium">$5000</TableCell>
              <TableCell className="font-medium">New York</TableCell>
              <TableCell>
                <Badge variant="outline">Draft</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">2023-07-12</TableCell>
              <TableCell className="hidden md:table-cell">2023-07-12</TableCell>
              <TableCell className="hidden md:table-cell">2023-07-12</TableCell>
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

            <TableRow>
              <TableCell>1</TableCell>
              <TableCell className="font-medium">Software Engineer</TableCell>
              <TableCell className="font-medium">Google</TableCell>
              <TableCell className="font-medium">$5000</TableCell>
              <TableCell className="font-medium">New York</TableCell>
              <TableCell>
                <Badge variant="outline">Draft</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">2023-07-12</TableCell>
              <TableCell className="hidden md:table-cell">2023-07-12</TableCell>
              <TableCell className="hidden md:table-cell">2023-07-12</TableCell>
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

            <TableRow>
              <TableCell>1</TableCell>
              <TableCell className="font-medium">Software Engineer</TableCell>
              <TableCell className="font-medium">Google</TableCell>
              <TableCell className="font-medium">$5000</TableCell>
              <TableCell className="font-medium">New York</TableCell>
              <TableCell>
                <Badge variant="outline">Draft</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">2023-07-12</TableCell>
              <TableCell className="hidden md:table-cell">2023-07-12</TableCell>
              <TableCell className="hidden md:table-cell">2023-07-12</TableCell>
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

            <TableRow>
              <TableCell>1</TableCell>
              <TableCell className="font-medium">Software Engineer</TableCell>
              <TableCell className="font-medium">Google</TableCell>
              <TableCell className="font-medium">$5000</TableCell>
              <TableCell className="font-medium">New York</TableCell>
              <TableCell>
                <Badge variant="outline">Draft</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">2023-07-12</TableCell>
              <TableCell className="hidden md:table-cell">2023-07-12</TableCell>
              <TableCell className="hidden md:table-cell">2023-07-12</TableCell>
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

            {/* Repeat for more rows */}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-10</strong> of <strong>32</strong> products
        </div>
      </CardFooter>
    </Card>
  );
}

export default function Manage_Jobs() {
  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <div className="flex flex-col sm:gap-4 sm:pb-1">
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Tabs defaultValue="all">
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
                      <DropdownMenuLabel>Export</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Csv</DropdownMenuItem>
                      <DropdownMenuItem>Pdf</DropdownMenuItem>
                      {/* <DropdownMenuItem>Archived</DropdownMenuItem> */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {/* <Button size="sm" variant="outline" className="h-8 gap-1">
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Export
                    </span>
                  </Button> */}
                  <Link href="/create-job" >
                    <Button size="sm" className="h-8 gap-1">
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Create a job
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
              <TabsContent value="all">
                <ProductTable />
              </TabsContent>
              <TabsContent value="active">
                <ProductTable />
              </TabsContent>
              <TabsContent value="draft">
                <ProductTable />
              </TabsContent>
              <TabsContent value="archived">
                <ProductTable />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
