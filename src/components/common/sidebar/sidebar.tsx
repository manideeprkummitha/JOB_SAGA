"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Home, Package, Package2, Users, MessageCircle, Contact, SearchIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FC, ReactNode } from "react";

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

const Sidebar: FC = () => {
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/home" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">Job Saga</span>
          </Link>
          <Link href="/notifications" className="relative ml-auto h-8 w-8">
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
            <Badge className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full ">
              6
            </Badge>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <MenuItem href="/home" icon={<Home className="h-4 w-4" />} text="Dashboard" />
            <MenuItem href="/search-job" icon={<SearchIcon className="h-4 w-4" />} text="Job Search">
              <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">6</Badge>
            </MenuItem>
            <MenuItem href="/track-job" icon={<Package className="h-4 w-4" />} text="Job Tracker" />
            <MenuItem href="/resume-handling" icon={<Users className="h-4 w-4" />} text="Resume Handling" />
            <MenuItem href="/company-contacts" icon={<Contact className="h-4 w-4" />} text="Contacts" />
            <MenuItem href="/message" icon={<MessageCircle className="h-4 w-4" />} text="Messages" />
            <MenuItem href="/manage-job" icon={<Package className="h-4 w-4" />} text="Manage Jobs" />
            <MenuItem href="/applicant-contacts" icon={<Package className="h-4 w-4" />} text="Saved Applicants" />
            {/* <MenuItem href="/validate-resume" icon={<Package className="h-4 w-4" />} text="Validate Resumes" /> */}
            <MenuItem href="/company" icon={<Package className="h-4 w-4" />} text="Company" />
            {/* <MenuItem href="/applicant-contacts" icon={<Package className="h-4 w-4" />} text="Saved Applicants" active /> */}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
