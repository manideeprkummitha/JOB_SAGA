// Import necessary modules and types
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider, useAuth } from "@/auth/context/jwt/auth-provider";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Job Saga",
  description: "Track your job search and manage applications seamlessly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider> 
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          <Toaster/>
        </AuthProvider> 
      </body>
    </html>
  );
}
