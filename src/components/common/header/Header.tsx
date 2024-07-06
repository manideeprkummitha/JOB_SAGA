"use client";

import Link from "next/link";
import { Bell, CircleUser, Menu, Search, Package2, Home, Package, Users, MessageCircle, Contact, SearchIcon, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { FC, ReactNode } from "react";
import { useTheme } from "next-themes";

const SearchForm: FC = () => {
  return (
    <form className="flex-grow">
      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search ..."
          className="w-full appearance-none bg-background pl-8 shadow-none"
        />
      </div>
    </form>
  );
};

const CustomSearchForm: FC = () => {
  return (
    <form className="flex items-center gap-4">
      <div className="relative w-64">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Title, Skill, Developer"
          className="w-full appearance-none bg-background pl-8 shadow-none"
        />
      </div>
      <div className="relative w-64">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Location"
          className="w-full appearance-none bg-background pl-8 shadow-none"
        />
      </div>
      <Button type="submit" variant="default" className="w-auto">
        Search
      </Button>
    </form>
  );
};

const UserMenu: FC = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <CircleUser className="h-5 w-5" />
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/forms/" passHref>
          <DropdownMenuItem asChild>
            <a>My Profile</a>
          </DropdownMenuItem>
        </Link>
        <Link href="/settings" passHref>
          <DropdownMenuItem asChild>
            <a>Settings</a>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <Link href="/logout" passHref>
          <DropdownMenuItem asChild>
            <a>Logout</a>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const MenuItem: FC<{ href: string; icon: ReactNode; text: string; children?: ReactNode }> = ({ href, icon, text, children }) => {
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

const ModeToggle: FC = () => {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Header: FC = () => {
  const pathname = usePathname();

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 justify-between">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="sr-only">Job Saga</span>
            </Link>
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
            <MenuItem href="/validate-resume" icon={<Package className="h-4 w-4" />} text="Validate Resumes" />
          </nav>
        </SheetContent>
      </Sheet>
      {pathname === '/search-job' && (
        <div className="flex items-center gap-4">
          <CustomSearchForm />
        </div>
      )}
      <div className="flex items-center gap-4 ml-auto w-full md:w-auto">
        {pathname !== '/search-job' && <SearchForm />}
        <ModeToggle />
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;
