// Breadcrumb Component
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { Bell, CircleUser, Menu, Search, Package2, Home, Package, Users, MessageCircle, Contact, SearchIcon, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FC, ReactNode } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useAuth } from "@/auth/context/jwt/auth-provider";
import { authServiceAxios } from '@/utils/axios';
import { authEndpoints } from '@/utils/endpoints';
import Link from "next/link";

const BreadcrumbDemo: FC = () => {
  const pathname = usePathname();

  // Extract ID from the URL if it exists (e.g., /all-applicants-details/[id] or /saved-applicant-details/[id])
  const applicantId = pathname.split("/")[2]; // Extract the ID from the URL

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Manage Jobs - Always the base link */}
        <BreadcrumbItem>
          <BreadcrumbLink href="/manage-job">Manage Jobs</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        {/* Flow 1: Manage Jobs > All Applicants > Applicant */}
        {pathname.startsWith("/all-applicants-details") && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href="/all-applicants-details">All Applicants</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            {/* Show dynamic applicant ID if present */}
            {applicantId && (
              <BreadcrumbItem>
                <BreadcrumbPage>Applicant {applicantId}</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </>
        )}

        {/* Flow 2: Manage Jobs > Saved Applicants > Saved Applicant */}
        {pathname.startsWith("/saved-applicant-details") && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href="/saved-applicant-details">Saved Applicants</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            {/* Show dynamic saved applicant ID if present */}
            {applicantId && (
              <BreadcrumbItem>
                <BreadcrumbPage>Saved Applicant {applicantId}</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};



const SearchForm: FC = () => {
  return (
    <form className="flex-grow">
      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Search ..." className="w-full appearance-none bg-background pl-8 shadow-none" />
      </div>
    </form>
  );
};

// MenuItem component integrated here
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

const UserMenu: FC = () => {
  const { logout, accessToken } = useAuth(); // Access the logout function and accessToken from the AuthProvider
  const router = useRouter();

  const handleLogout = async () => {
    try {
      console.log('Attempting to log out...');
      await authServiceAxios.post(authEndpoints.logout, { accessToken }); // Pass accessToken in the logout request
      console.log('Logged out successfully');
      await logout(); // Clear the state in the AuthProvider
      router.replace("/");
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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
        <DropdownMenuItem asChild>
          <a href="/forms">My Profile</a>
        </DropdownMenuItem>
        {/* <DropdownMenuItem asChild>
          <a href="/settings">Settings</a>
        </DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild onClick={handleLogout}>
          <a>Logout</a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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

const Header: FC<{ isMinimized: boolean; toggleMinimize: () => void }> = ({ isMinimized, toggleMinimize }) => {
  const pathname = usePathname();

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 justify-between transition-all">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <a href="#" className="flex items-center gap-2 text-lg font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="sr-only">Job Saga</span>
            </a>
            <MenuItem href="/manage-job" icon={<Package className="h-4 w-4" />} text="Manage Jobs" />
            <MenuItem href="/all-applicants" icon={<Users className="h-4 w-4" />} text="All Applicants" />
            <MenuItem href="/saved-applicants" icon={<Users className="h-4 w-4" />} text="Saved Applicants" />
          </nav>
        </SheetContent>
      </Sheet>

      {/* Render BreadcrumbDemo only on manage-job, all-applicants-details pages */}
      {(pathname.startsWith("/manage-job") || pathname.startsWith("/all-applicants-details")) && (
        <BreadcrumbDemo />
      )}

      <div className="flex items-center gap-4 ml-auto w-full md:w-auto">
        {/* <SearchForm /> */}
        <ModeToggle />
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;
