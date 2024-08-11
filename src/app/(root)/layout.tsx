'use client'
import RegularSidebar from "@/components/common/sidebar/maximized-menu";
import MinimizedSidebar from "@/components/common/sidebar/minimzed-menu";
import Header from "@/components/common/header/Header";
import { ReactNode, useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from "next/navigation";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  useEffect(() => {
    if (pathname === "/message") {
      setIsMinimized(true);
    }
  }, [pathname]);

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
