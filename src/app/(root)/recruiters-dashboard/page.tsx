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

export default function RecruiterDashboard() {
  const { userId } = useAuth(); // Assume you have userId from auth context
  const [jobData, setJobData] = useState([]);
  const [totalOpenJobs, setTotalOpenJobs] = useState(0);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [totalSavedApplicants, setTotalSavedApplicants] = useState(0);

  useEffect(() => {
    if (userId) {
      console.log(`[FETCH DATA] Fetching job data for userId: ${userId}`);

      const fetchJobData = async () => {
        try {
          const response = await fetch(`http://localhost:7004/api/tracking/user/${userId}/recruiter`);

          const result = await response.json();
          if (result.success) {
            const jobs = result.data;

            // Calculate totals
            console.log('[FETCH DATA] Calculating totals from job data.');
            setTotalOpenJobs(result.totals.totalOpenJobs);
            setTotalApplicants(result.totals.totalApplicants);
            setTotalSavedApplicants(result.totals.totalSavedApplicants);

            // Sort jobs by a date field, if available (for this example, we'll assume `createdAt` is available)
            const sortedJobs = jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            console.log('Sorted Jobs:', sortedJobs);

            // Limit to the most recent 5 jobs
            const recentJobs = sortedJobs.slice(0, 5);
            console.log('Recent 5 Jobs:', recentJobs);

            // Set job data for displaying in the table
            setJobData(recentJobs);
            console.log('[FETCH DATA] Job data successfully set.');
          } else {
            console.error('[FETCH DATA] Failed to fetch job data:', result.message);
          }
        } catch (error) {
          console.error('[FETCH DATA] Error fetching job data:', error);
        }
      };

      fetchJobData();
    }
  }, [userId]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-3 md:gap-8 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Open Jobs
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOpenJobs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Applicants
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalApplicants}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Saved Applicants</CardTitle>
              <Save className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSavedApplicants}</div>
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
                  <Link href="/manage-job">
                    View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applicants</TableHead>
                    <TableHead>Saved Applicants</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobData.map((job, index) => (
                    <TableRow key={index}>
                      <TableCell>{job.jobTitle}</TableCell>
                      <TableCell>{job.company.name}</TableCell>
                      <TableCell><Badge variant="outline">{job.status}</Badge></TableCell>
                      <TableCell>{job.applicantsCount}</TableCell>
                      <TableCell>{job.savedApplicantsCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
              </div>
              {/* Add more recent messages as necessary */}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
