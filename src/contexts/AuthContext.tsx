"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { getUserByClerkId, createUser } from "@/utils/db/actions";
import { toast } from "react-hot-toast";

type User = {
  id: number;
  email: string;
  name: string;
  clerkId: string;
  imageUrl?: string | null;
} | null;

type AuthContextType = {
  user: User;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const { signOut } = useClerk();

  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const syncUser = async () => {
      if (!isClerkLoaded) return;

      if (!clerkUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        // Try to get user from database by Clerk ID
        let dbUser = await getUserByClerkId(clerkUser.id);

        // If user doesn't exist in DB, create one
        if (!dbUser) {
          const primaryEmail = clerkUser.primaryEmailAddress?.emailAddress;

          if (!primaryEmail) {
            console.error("User has no primary email");
            setIsLoading(false);
            return;
          }

          dbUser = await createUser(
            primaryEmail,
            clerkUser.fullName || clerkUser.username || "User",
            clerkUser.id,
            clerkUser.imageUrl
          );
        }

        setUser(dbUser);
      } catch (error) {
        console.error("Error syncing user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    syncUser();
  }, [clerkUser, isClerkLoaded]);

  const logout = async () => {
    try {
      await signOut();
      router.push("/");
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: isLoading || !isClerkLoaded,
        isAuthenticated: !!clerkUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
