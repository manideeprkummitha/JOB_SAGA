'use client';

import * as React from "react";
import Link from "next/link";
import { Home, Package, Package2, Users, MessageCircle, Contact, Search, ChevronRight } from "lucide-react";
import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MenuItem from "./menu-item";
import { useAuth } from '@/auth/context/jwt/auth-provider'; // Adjust the import path if necessary
import axios from "axios";

interface MinimizedSidebarProps {
  userType: 'jobSeeker' | 'recruiter';
  toggleMinimize: () => void;
}

const MinimizedSidebar: FC<MinimizedSidebarProps> = ({ userType, toggleMinimize }) => {
  const [userData, setUserData] = React.useState({ name: 'User Name', email: 'user.email@example.com', initials: 'U', userType: 'jobSeeker' });
  const { accessToken } = useAuth(); // Use access token from the auth provider

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_API}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const { firstName, lastName, email, userType } = response.data.user;
        const initials = `${firstName[0] || 'U'}${lastName[0] || ''}`.toUpperCase();
        setUserData({
          name: `${firstName} ${lastName}`.trim(),
          email: email,
          initials: initials,
          userType: userType || 'jobSeeker', // Fallback to jobSeeker if userType is not defined
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (accessToken) {
      fetchUserData();
    }
  }, [accessToken]);

  const jobSeekerMenuItems = [
    { href: "/home", icon: <Home />, text: "Dashboard" },
    { href: "/search-job", icon: <Search />, text: "Job Search" },
    { href: "/track-job", icon: <Package />, text: "Job Tracker" },
    { href: "/resume-handling", icon: <Users />, text: "Resume Handling" },
    { href: "/company-contacts", icon: <Contact />, text: "Contacts" },
    { href: "/company", icon: <Package />, text: "Companies Interested In" },
    { href: "/message", icon: <MessageCircle />, text: "Messages" },
  ];

  const recruiterMenuItems = [
    { href: "/home", icon: <Home />, text: "Dashboard" },
    { href: "/manage-job", icon: <Package />, text: "Manage Jobs" },
    { href: "/applicant-details", icon: <Package />, text: "Saved Applicants" },
    { href: "/message", icon: <MessageCircle />, text: "Messages" },
    { href: "/company", icon: <Package />, text: "Companies" },
    { href: "/company-contacts", icon: <Contact />, text: "Contacts" },
  ];

  const menuItems = userType === 'jobSeeker' ? jobSeekerMenuItems : recruiterMenuItems;

  return (
    <div className="hidden border-r bg-muted/40 md:block w-20">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b pl-4 pr-2 lg:h-[60px] lg:pl-6 justify-between">
          <div className="flex items-center justify-between w-full">
            <Link href="/home" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6 ml-1" />
            </Link>
            <div
              className="rounded-full h-8 w-8 flex items-center justify-center bg-muted cursor-pointer ml-auto"
              onClick={toggleMinimize}
            >
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-md font-medium lg:px-4 lg:text-md">
            {menuItems.map(({ href, icon, text }) => (
              <MenuItem key={href} href={href} icon={icon} text={text} isMinimized>
              </MenuItem>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 p-4 border-t">
         <Avatar className="h-12 w-12">
            <AvatarImage src="../../../../public/logo/Light Logo.png" alt="User Avatar" />
            <AvatarFallback>{userData.initials}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default MinimizedSidebar;
