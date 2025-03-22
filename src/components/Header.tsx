// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Coins,
  Droplet,
  Search,
  Bell,
  User,
  ChevronDown,
  LogIn,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  getUnreadNotifications,
  markNotificationAsRead,
  getUserBalance,
} from "@/utils/db/actions";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  onMenuClick: () => void;
  totalEarnings: number;
}

export default function Header({ onMenuClick, totalEarnings }: HeaderProps) {
  const { user: authUser, isLoading, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [balance, setBalance] = useState(0);

  console.log("user info", authUser);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (authUser) {
        const unreadNotifications = await getUnreadNotifications(authUser.id);
        setNotifications(unreadNotifications);
      }
    };

    fetchNotifications();

    // Set up periodic checking for new notifications
    const notificationInterval = setInterval(fetchNotifications, 30000); // Check every 30 seconds

    return () => clearInterval(notificationInterval);
  }, [authUser]);

  useEffect(() => {
    const fetchUserBalance = async () => {
      if (authUser) {
        const userBalance = await getUserBalance(authUser.id);
        setBalance(userBalance);
      }
    };

    fetchUserBalance();

    // Add an event listener for balance updates
    const handleBalanceUpdate = (event: CustomEvent) => {
      setBalance(event.detail);
    };

    window.addEventListener(
      "balanceUpdated",
      handleBalanceUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        "balanceUpdated",
        handleBalanceUpdate as EventListener
      );
    };
  }, [authUser]);

  const handleNotificationClick = async (notificationId: number) => {
    await markNotificationAsRead(notificationId);
    setNotifications((prevNotifications) =>
      prevNotifications.filter(
        (notification) => notification.id !== notificationId
      )
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <header className="bg-indigo-900 border-b border-indigo-800 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between h-16 px-0 lg:px-8 pr-4 lg:pr-8">
        <div className="flex items-center pl-2 lg:pl-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-indigo-800 mr-1"
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <Link href="/" className="flex items-center space-x-1">
            <Droplet className="h-8 w-8 text-sky-400" />
            <span className="text-xl font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
              AquaPure
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center justify-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-300" />
            <input
              type="text"
              placeholder="Find cleanup projects..."
              className="w-full py-2 pl-10 pr-4 border border-indigo-700 bg-indigo-800/50 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent placeholder:text-white placeholder:opacity-70"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4 pr-4 lg:pr-8">
          <div className="flex items-center border border-sky-500 bg-indigo-800 rounded-full px-2 py-1 text-sm mr-2">
            <Coins className="h-4 w-4 text-sky-400 mr-1" />
            <span className="text-white">{balance || totalEarnings || 0}</span>
          </div>

          {notifications.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-white hover:bg-indigo-800"
                >
                  <Bell className="h-5 w-5" />
                  <Badge
                    className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-sky-500 text-white text-xs rounded-full min-w-[1.25rem]"
                    variant="destructive"
                  >
                    {notifications.length}
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 bg-indigo-900 border-indigo-700 text-white"
              >
                {notifications.map((notification: any) => (
                  <DropdownMenuItem
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id)}
                    className="py-2 px-3 cursor-pointer hover:bg-indigo-800 text-white focus:bg-indigo-800 focus:text-white"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {notification.message}
                      </p>
                      <p className="text-xs text-indigo-300">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {!isAuthenticated ? (
            <Link href="/sign-in">
              <Button className="bg-sky-500 hover:bg-sky-600 text-white text-sm md:text-base">
                Sign In
                <LogIn className="ml-1 md:ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </Link>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex items-center text-white hover:bg-indigo-800"
                >
                  <User className="h-5 w-5 mr-1" />
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-indigo-900 border-indigo-700 text-white"
              >
                <DropdownMenuItem className="hover:bg-indigo-800 text-white focus:bg-indigo-800 focus:text-white">
                  {authUser?.name || "User"}
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-indigo-800 text-white focus:bg-indigo-800 focus:text-white">
                  <Link href="/settings">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-indigo-800 text-white focus:bg-indigo-800 focus:text-white">
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={logout}
                  className="hover:bg-indigo-800 text-white focus:bg-indigo-800 focus:text-white"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
