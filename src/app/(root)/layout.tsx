import Sidebar from "@/components/common/sidebar/sidebar";
import Header from "@/components/common/header/Header";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster"
interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] ">
      <Sidebar />
      <div className="flex flex-col overflow-hidden">
        <Header />
        <main className="flex flex-1 flex-col gap-4 lg:gap-6 lg:p-6 overflow-y-auto">
          {children}
        </main>
        <Toaster/>
      </div>
    </div>
  );
};

export default Layout;
