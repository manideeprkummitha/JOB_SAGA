'use client';

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Home, Package, Package2, Users, MessageCircle, Contact, Search, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FC, ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import NotificationsCard from '../notifications_card/notificationscard';

interface MenuItemProps {
  href: string;
  icon: ReactNode;
  text: string;
  children?: ReactNode;
}

const MenuItem: FC<MenuItemProps> = ({ href, icon, text, children }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'bg-muted text-primary' : 'text-muted-foreground hover:text-primary'}`}>
      {icon}
      {text}
      {children}
    </Link>
  );
};

interface SidebarProps {
  userType: 'jobSeeker' | 'recruiter';
}

const Sidebar: FC<SidebarProps> = ({ userType }) => {
  const jobSeekerMenuItems = [
    { href: "/home", icon: <Home className="h-4 w-4" />, text: "Dashboard" },
    { href: "/search-job", icon: <Search className="h-4 w-4" />, text: "Job Search", badge: 6 },
    { href: "/track-job", icon: <Package className="h-4 w-4" />, text: "Job Tracker" },
    { href: "/resume-handling", icon: <Users className="h-4 w-4" />, text: "Resume Handling" },
    { href: "/company-contacts", icon: <Contact className="h-4 w-4" />, text: "Contacts" },
    { href: "/company", icon: <Package className="h-4 w-4" />, text: "Companies Intrested In" },
    { href: "/message", icon: <MessageCircle className="h-4 w-4" />, text: "Messages",badge: 6 },
  ];

  const recruiterMenuItems = [
    { href: "/home", icon: <Home className="h-4 w-4" />, text: "Dashboard" },
    { href: "/manage-job", icon: <Package className="h-4 w-4" />, text: "Manage Jobs" },
    { href: "/applicant-details", icon: <Package className="h-4 w-4" />, text: "Saved Applicants" },
    { href: "/message", icon: <MessageCircle className="h-4 w-4" />, text: "Messages",badge: 6 },
    { href: "/company", icon: <Package className="h-4 w-4" />, text: "Companies" },
    { href: "/company-contacts", icon: <Contact className="h-4 w-4" />, text: "Contacts" },
  ];

  const menuItems = userType === 'jobSeeker' ? jobSeekerMenuItems : recruiterMenuItems;

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b pl-4 pr-2 lg:h-[60px] lg:pl-6 justify-between">
          <div className="flex items-center justify-between w-full">
            <Link href="/home" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">Job Saga</span>
            </Link>
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="relative h-8 w-8">
                    <Bell className="h-4 w-4" />
                    <span className="sr-only">Toggle notifications</span>
                    <Badge className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full">6</Badge>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col h-full">
                  <SheetHeader className="flex-shrink-0">
                    <SheetTitle>Notifications</SheetTitle>
                    <SheetDescription>
                      Here are your recent notifications.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto custom-scrollbar py-4">
                    <div className="grid gap-4">
                      <NotificationsCard />
                      <NotificationsCard />
                      <NotificationsCard />
                      <NotificationsCard />
                      <NotificationsCard />
                      <NotificationsCard />
                      <NotificationsCard />
                      <NotificationsCard />
                      <NotificationsCard />
                      <NotificationsCard />
                      <NotificationsCard />
                      <NotificationsCard />
                      <NotificationsCard />
                      <NotificationsCard />
                    </div>
                  </div>
                  <SheetFooter className="flex-shrink-0">
                    <SheetClose asChild>
                      <Button type="button" className="text-sm py-1 px-4">Close</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
              <div className="rounded-full h-8 w-8 flex items-center justify-center bg-muted cursor-pointer ml-auto">
                <ChevronLeft className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {menuItems.map(({ href, icon, text, badge }) => (
              <MenuItem key={href} href={href} icon={icon} text={text}>
                {badge && <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">{badge}</Badge>}
              </MenuItem>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 p-4 border-t">
          <Avatar>
            <AvatarImage src="../../../../public/logo/Light Logo.png" alt="User Avatar" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-medium">User Name</p>
            <p className="text-xs text-muted-foreground">user.email@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
