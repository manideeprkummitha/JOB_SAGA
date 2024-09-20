'use client'

import { Metadata } from "next";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/common/form_sidebar/form_Sidebar";
import Header from "@/components/common/header/Header";
import Sidebar from "@/components/common/sidebar/sidebar";
import { useAuth } from "@/auth/context/jwt/auth-provider"; // Import useAuth
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CircularIndeterminate from "@/components/common/loader/loader"; // Loading indicator

// export const metadata: Metadata = {
//   title: "Forms",
//   description: "Advanced form example using react-hook-form and Zod.",
// };

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/forms/",
  },
  {
    title: "Notifications",
    href: "/forms/notifications",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const { authenticated, loading } = useAuth(); // Get auth state
  console.log("authenticated", authenticated);
  console.log("loading", loading);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !authenticated) {
      router.push("/login"); // Redirect to login if not authenticated
    } else {
      setIsLoading(false); // Set loading to false once authenticated
    }
  }, [loading, authenticated, router]);

  if (loading || isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <CircularIndeterminate />
      </div>
    );
  }

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/forms-light.png"
          width={1280}
          height={791}
          alt="Forms"
          className="block dark:hidden"
        />
        <Image
          src="/examples/forms-dark.png"
          width={1280}
          height={791}
          alt="Forms"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden md:flex md:h-screen md:overflow-hidden">
        <div className="flex-1 flex flex-col">
          {/* Main layout for settings */}
          <main className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="px-16 py-10 pb-16 space-y-6">
              <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">
                  Manage your account settings and set e-mail preferences.
                </p>
              </div>
              <Separator className="my-6" />
              <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="lg:w-1/5">
                  <SidebarNav items={sidebarNavItems} />
                </aside>
                <div className="flex-1 lg:max-w-2xl">{children}</div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
