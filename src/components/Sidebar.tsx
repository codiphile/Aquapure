"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Trash,
  Coins,
  Medal,
  Settings,
  Home,
  LogIn,
  Droplets,
  Waves,
  TrendingUp,
  Award,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";

interface SidebarProps {
  open: boolean;
}

export default function Sidebar({ open }: SidebarProps) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  const handleUnauthenticatedClick = (e: React.MouseEvent, href: string) => {
    if (!isAuthenticated && href !== "/" && href !== "/sign-in") {
      e.preventDefault();
      toast.error("Please log in to access this feature");
    }
  };

  const sidebarItems = [
    { href: "/", icon: Home, label: "Dashboard", requiresAuth: false },
    {
      href: "/report",
      icon: Droplets,
      label: "Report Source",
      requiresAuth: true,
    },
    {
      href: "/collect",
      icon: Waves,
      label: "Clean Water",
      requiresAuth: true,
    },
    { href: "/rewards", icon: Coins, label: "Incentives", requiresAuth: true },
    {
      href: "/leaderboard",
      icon: Award,
      label: "Top Contributors",
      requiresAuth: true,
    },
  ];

  return (
    <aside
      className={`bg-indigo-900 border-r border-indigo-800 fixed top-[56px] bottom-0 left-0 z-20 transform transition-transform duration-300 ease-in-out text-white w-64 ${
        open ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      <nav className="h-full flex flex-col justify-between">
        <div className="px-4 lg:px-8 py-6 space-y-8">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={
                item.requiresAuth && !isAuthenticated ? "/sign-in" : item.href
              }
              passHref
            >
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={`w-full justify-start py-3 ${
                  pathname === item.href
                    ? "bg-sky-900/50 text-sky-400 border-l-4 border-sky-400"
                    : "text-indigo-100 hover:bg-indigo-800"
                } ${item.requiresAuth && !isAuthenticated ? "opacity-70" : ""}`}
                onClick={(e) => handleUnauthenticatedClick(e, item.href)}
                disabled={isLoading}
              >
                <item.icon className="mr-3 h-5 w-5" />
                <span className="text-base">{item.label}</span>
                {item.requiresAuth && !isAuthenticated && (
                  <LogIn className="ml-auto h-4 w-4 text-indigo-300" />
                )}
              </Button>
            </Link>
          ))}
        </div>
        <div className="p-4 border-t border-indigo-800">
          {isAuthenticated ? (
            <Link href="/settings" passHref>
              <Button
                variant={pathname === "/settings" ? "secondary" : "outline"}
                className={`w-full py-3 ${
                  pathname === "/settings"
                    ? "bg-sky-900/50 text-sky-400 border-sky-400"
                    : "text-indigo-100 border-indigo-700 hover:bg-indigo-800"
                }`}
              >
                <Settings className="mr-3 h-5 w-5 text-black hover:text-white" />
                <span className="text-black hover:text-white">Account</span>
              </Button>
            </Link>
          ) : (
            <Link href="/sign-in" passHref>
              <Button
                variant="default"
                className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white"
              >
                <LogIn className="mr-3 h-5 w-5" />
                <span className="text-base">Sign In</span>
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </aside>
  );
}
