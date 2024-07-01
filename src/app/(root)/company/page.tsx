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
        <TableRow>
          <TableCell>1</TableCell>
          <TableCell className="font-medium">Google</TableCell>
          <TableCell className="font-medium">Technology</TableCell>
          <TableCell className="font-medium">New York</TableCell>
          <TableCell className="font-medium">Large</TableCell>
          <TableCell className="font-medium">Public</TableCell>
          <TableCell className="hidden md:table-cell">
            <Badge variant="outline">Active</Badge>
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

        <TableRow>
          <TableCell>1</TableCell>
          <TableCell className="font-medium">Google</TableCell>
          <TableCell className="font-medium">Technology</TableCell>
          <TableCell className="font-medium">New York</TableCell>
          <TableCell className="font-medium">Large</TableCell>
          <TableCell className="font-medium">Public</TableCell>
          <TableCell className="hidden md:table-cell">
            <Badge variant="outline">Active</Badge>
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

        <TableRow>
          <TableCell>1</TableCell>
          <TableCell className="font-medium">Google</TableCell>
          <TableCell className="font-medium">Technology</TableCell>
          <TableCell className="font-medium">New York</TableCell>
          <TableCell className="font-medium">Large</TableCell>
          <TableCell className="font-medium">Public</TableCell>
          <TableCell className="hidden md:table-cell">
            <Badge variant="outline">Active</Badge>
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

        <TableRow>
          <TableCell>1</TableCell>
          <TableCell className="font-medium">Google</TableCell>
          <TableCell className="font-medium">Technology</TableCell>
          <TableCell className="font-medium">New York</TableCell>
          <TableCell className="font-medium">Large</TableCell>
          <TableCell className="font-medium">Public</TableCell>
          <TableCell className="hidden md:table-cell">
            <Badge variant="outline">Active</Badge>
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

        <TableRow>
          <TableCell>1</TableCell>
          <TableCell className="font-medium">Google</TableCell>
          <TableCell className="font-medium">Technology</TableCell>
          <TableCell className="font-medium">New York</TableCell>
          <TableCell className="font-medium">Large</TableCell>
          <TableCell className="font-medium">Public</TableCell>
          <TableCell className="hidden md:table-cell">
            <Badge variant="outline">Active</Badge>
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

        <TableRow>
          <TableCell>1</TableCell>
          <TableCell className="font-medium">Google</TableCell>
          <TableCell className="font-medium">Technology</TableCell>
          <TableCell className="font-medium">New York</TableCell>
          <TableCell className="font-medium">Large</TableCell>
          <TableCell className="font-medium">Public</TableCell>
          <TableCell className="hidden md:table-cell">
            <Badge variant="outline">Active</Badge>
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

        <TableRow>
          <TableCell>1</TableCell>
          <TableCell className="font-medium">Google</TableCell>
          <TableCell className="font-medium">Technology</TableCell>
          <TableCell className="font-medium">New York</TableCell>
          <TableCell className="font-medium">Large</TableCell>
          <TableCell className="font-medium">Public</TableCell>
          <TableCell className="hidden md:table-cell">
            <Badge variant="outline">Active</Badge>
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

        <TableRow>
          <TableCell>1</TableCell>
          <TableCell className="font-medium">Google</TableCell>
          <TableCell className="font-medium">Technology</TableCell>
          <TableCell className="font-medium">New York</TableCell>
          <TableCell className="font-medium">Large</TableCell>
          <TableCell className="font-medium">Public</TableCell>
          <TableCell className="hidden md:table-cell">
            <Badge variant="outline">Active</Badge>
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

        <TableRow>
          <TableCell>1</TableCell>
          <TableCell className="font-medium">Google</TableCell>
          <TableCell className="font-medium">Technology</TableCell>
          <TableCell className="font-medium">New York</TableCell>
          <TableCell className="font-medium">Large</TableCell>
          <TableCell className="font-medium">Public</TableCell>
          <TableCell className="hidden md:table-cell">
            <Badge variant="outline">Active</Badge>
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

        <TableRow>
          <TableCell>1</TableCell>
          <TableCell className="font-medium">Google</TableCell>
          <TableCell className="font-medium">Technology</TableCell>
          <TableCell className="font-medium">New York</TableCell>
          <TableCell className="font-medium">Large</TableCell>
          <TableCell className="font-medium">Public</TableCell>
          <TableCell className="hidden md:table-cell">
            <Badge variant="outline">Active</Badge>
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


        {/* Repeat for more rows */}
      </TableBody>
    </Table>
  </CardContent>
  <CardFooter>
    <div className="text-xs text-muted-foreground">
      Showing <strong>1-10</strong> of <strong>32</strong> items
    </div>
  </CardFooter>
</Card>
  );
}

export default function Company() {
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
                          Filter
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Active</DropdownMenuItem>
                      <DropdownMenuItem>Draft</DropdownMenuItem>
                      <DropdownMenuItem>Archived</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button size="sm" variant="outline" className="h-8 gap-1">
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Export
                    </span>
                  </Button>
                  <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Add Product
                    </span>
                  </Button>
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
