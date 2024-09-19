'use client';
import { useEffect, useState } from 'react';
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  FileText,
  Save,
  Users,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from '@/auth/context/jwt/auth-provider';

export default function JobSeekerDashboard() {
  const [data, setData] = useState({
    totalAppliedJobs: 0,
    upcomingInterviews: 0,
    totalSavedJobs: 0,
    activeSavedJobs: 0,
    jobTrackingData: [], // Added this to hold job tracking data
  });

  const { accessToken, userId } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:7004/api/tracking/user/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Fetched Data:", result.data);
          
          // Sort jobTrackingData by dateApplied or interviewDate (choose appropriate one)
          const sortedData = result.data.jobTrackingData.sort((a, b) => {
            const dateA = new Date(a.dateApplied || a.interviewDate);
            const dateB = new Date(b.dateApplied || b.interviewDate);
            return dateB - dateA; // Sort in descending order (latest first)
          });

          console.log("Sorted Data:", sortedData);

          // Slice the data to only get the 5 most recent job insights
          const recentData = sortedData.slice(0, 5);
          console.log("Recent 5 Job Insights:", recentData);

          setData({ ...result.data, jobTrackingData: recentData });
        } else {
          console.error('Failed to fetch data:', await response.json());
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [accessToken]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applied Jobs</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalAppliedJobs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Interviews</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.upcomingInterviews}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Saved Jobs</CardTitle>
              <Save className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalSavedJobs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Saved Jobs</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.activeSavedJobs}</div>
            </CardContent>
          </Card>
        </div>

        {/* Jobs Insights Section */}
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Your Jobs Insights</CardTitle>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/track-job">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Position</TableHead>
                    <TableHead className="hidden xl:table-cell">Company</TableHead>
                    <TableHead className="hidden xl:table-cell">Status</TableHead>
                    <TableHead className="hidden xl:table-cell">Date Applied</TableHead>
                    <TableHead className="text-right">Interview Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.jobTrackingData.map((job) => (
                    <TableRow key={job._id}>
                      <TableCell>
                        <div className="font-medium">{job.jobId?.jobTitle || job.jobPosition}</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">{job.jobId?.jobDescription}</div>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">{job.jobId?.company.name || job.company}</TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <Badge className="text-xs" variant="outline">{job.status}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell lg:hidden xl:table-cell">{job.dateApplied ? new Date(job.dateApplied).toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell className="text-right">{job.interviewDate ? new Date(job.interviewDate).toLocaleDateString() : 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Messages Section */}
          <Card>
            <CardHeader className='flex flex-row items-center'> 
              <CardTitle>Recent Messages</CardTitle>
              <Button asChild size="sm" className="ml-auto gap-1">
                  <Link href="/message">
                    View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/01.png" alt="Avatar" />
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">Olivia Martin</p>
                  <p className="text-sm text-muted-foreground">olivia.martin@email.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/02.png" alt="Avatar" />
                  <AvatarFallback>JL</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">Jackson Lee</p>
                  <p className="text-sm text-muted-foreground">jackson.lee@email.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/03.png" alt="Avatar" />
                  <AvatarFallback>IN</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">Isabella Nguyen</p>
                  <p className="text-sm text-muted-foreground">isabella.nguyen@email.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/04.png" alt="Avatar" />
                  <AvatarFallback>WK</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">William Kim</p>
                  <p className="text-sm text-muted-foreground">will@email.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/05.png" alt="Avatar" />
                  <AvatarFallback>SD</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">Sofia Davis</p>
                  <p className="text-sm text-muted-foreground">sofia.davis@email.com</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
