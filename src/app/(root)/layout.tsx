'use client';

import RegularSidebar from "@/components/common/sidebar/maximized-menu";
import MinimizedSidebar from "@/components/common/sidebar/minimzed-menu";
import Header from "@/components/common/header/Header";
import { ReactNode, useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { usePathname, useRouter } from "next/navigation";
import CircularIndeterminate from "@/components/common/loader/loader";
import { useAuth } from "@/auth/context/jwt/auth-provider"; // Import useAuth

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, authenticated, loading } = useAuth(); // Access auth state
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  useEffect(() => {
    if (pathname === "/message") {
      setIsMinimized(true);
    }

    // Check if the user is not authenticated and not loading
    if (!loading && !authenticated) {
      router.push("/login");
    } else {
      // Simulate a loading delay for demonstration purposes
      const timer = setTimeout(() => {
        setIsLoading(false); // Set loading to false after the delay
      }, 2000);

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [pathname, loading, authenticated, router]);

  if (loading || isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <CircularIndeterminate />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full">
      {isMinimized ? (
        <MinimizedSidebar userType="jobSeeker" toggleMinimize={toggleMinimize} />
      ) : (
        <RegularSidebar userType="jobSeeker" toggleMinimize={toggleMinimize} />
      )}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header isMinimized={isMinimized} toggleMinimize={toggleMinimize} />
        <main className="flex flex-1 flex-col gap-4 lg:gap-6 overflow-y-auto">
          {children}
        </main>
        <Toaster />
      </div>
    </div>
  );
};

export default Layout;
