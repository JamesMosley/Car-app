"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (token: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    try {
      const response = await fetch("http://localhost:8000/me", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        const email = data.email;
        const name = email.split("@")[0];
        // Capitalize first letter
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
        setUser({ email, name: formattedName });
        localStorage.setItem("userName", formattedName);
        localStorage.setItem("userEmail", email);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    // Check for a token or session in localStorage on initial load
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
      fetchUser();
    } else {
      // If not authenticated and not on a public page, redirect
      const publicPages = ["/signin", "/signup"];
      if (!publicPages.includes(pathname)) {
        router.replace("/signin");
      }
    }
  }, [router, pathname]);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:8000/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("isAuthenticated", "true");
      setIsAuthenticated(true);
      
      // Fetch user info after login
      const name = email.split("@")[0];
      const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
      setUser({ email, name: formattedName });
      localStorage.setItem("userName", formattedName);
      localStorage.setItem("userEmail", email);
      
      router.replace("/");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setUser(null);
    setIsAuthenticated(false);
    router.replace("/signin");
  };

  const loginWithGoogle = async (token: string) => {
    try {
      const response = await fetch("http://localhost:8000/google-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error("Google login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("isAuthenticated", "true");
      setIsAuthenticated(true);
      
      // For Google login, we'll need to fetch user info
      await fetchUser();
      
      router.replace("/");
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  };

  const value = { isAuthenticated, user, login, loginWithGoogle, logout, fetchUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
