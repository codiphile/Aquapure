"use client";

import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { getUserByEmail, createUser } from "@/utils/db/actions";
import { toast } from "react-hot-toast";

type User = {
  id: number;
  email: string;
  name: string;
  clerkId?: string;
  imageUrl?: string | null;
} | null;

type AuthContextType = {
  user: User;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, name: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// For testing, we'll create a mock user
const MOCK_USER = {
  id: 1,
  email: "test@example.com",
  name: "Test User",
  imageUrl:
    "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp",
};

export function LocalAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing login on mount
  useEffect(() => {
    const checkExistingUser = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        if (email) {
          // For demo, just use the mock user or get from DB
          let existingUser = await getUserByEmail(email);
          if (!existingUser) {
            // For demo purposes, create the user if not found
            existingUser = MOCK_USER;
            localStorage.setItem("userEmail", existingUser.email);
          }
          setUser(existingUser);
        }
      } catch (error) {
        console.error("Error checking login state:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingUser();
  }, []);

  const login = async (email: string, name: string) => {
    try {
      setIsLoading(true);
      // Look up or create the user
      let user = await getUserByEmail(email);

      if (!user) {
        // Create new user
        user = await createUser(email, name);
        if (!user) {
          throw new Error("Failed to create user");
        }
      }

      // Store in context and localStorage
      setUser(user);
      localStorage.setItem("userEmail", email);

      // Navigate home
      router.push("/");
      toast.success("Logged in successfully!");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("userEmail");
      setUser(null);
      router.push("/");
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // For demo purposes - auto-login with mock user
  useEffect(() => {
    if (!isLoading && !user) {
      // Uncomment for auto-login:
      // login(MOCK_USER.email, MOCK_USER.name);
    }
  }, [isLoading]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
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
    throw new Error("useAuth must be used within a LocalAuthProvider");
  }
  return context;
}
