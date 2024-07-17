'use client'
import Sidebar from "@/components/common/sidebar/sidebar";
import Header from "@/components/common/header/Header";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from "next/navigation";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();

  return (
    <div className="grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] ">
      <Sidebar userType="jobSeeker" />
      <div className="flex flex-col overflow-hidden">
        {/* Conditionally render Header based on the current path */}
        {pathname !== "/message" && <Header />}
        <main className="flex flex-1 flex-col gap-4 lg:gap-6 overflow-y-auto">
          {children}
        </main>
        <Toaster />
      </div>
    </div>
  );
};

export default Layout;
