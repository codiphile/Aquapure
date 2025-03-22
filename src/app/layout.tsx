"use client";

import { useState } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import "leaflet/dist/leaflet.css";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [totalEarnings, setTotalEarnings] = useState(0);

  return (
    <ClerkProvider>
      <AuthProvider>
        <html lang="en">
          <body className={inter.className}>
            <div className="min-h-screen bg-indigo-50 flex flex-col">
              <div>
                <Header
                  onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                  totalEarnings={totalEarnings}
                />
              </div>
              <div className="flex flex-1 pt-16">
                <Sidebar open={sidebarOpen} />
                <main className="flex-1 p-4 lg:p-8 ml-0 lg:ml-64 transition-all duration-300">
                  {children}
                </main>
              </div>
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#4338ca",
                  color: "#ffffff",
                  border: "1px solid #3730a3",
                },
                success: {
                  style: {
                    background: "#0ea5e9",
                    color: "#ffffff",
                    border: "1px solid #0284c7",
                  },
                },
                error: {
                  style: {
                    background: "#ef4444",
                    color: "#ffffff",
                    border: "1px solid #b91c1c",
                  },
                },
              }}
            />
          </body>
        </html>
      </AuthProvider>
    </ClerkProvider>
  );
}
