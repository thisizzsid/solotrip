"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Listen for login state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // PROTECTED ROUTES LOGIC
  useEffect(() => {
    if (loading) return;

    // Pages that are SAFE to view without login
    const publicPages = ["/", "/login", "/info/about", "/info/safety", "/info/terms", "/info/contact"];
    
    // Check if current path starts with any public page
    const isPublic = publicPages.some(page => pathname === page || pathname.startsWith("/info"));

    if (!user && !isPublic) {
      // If not logged in & trying to access private page -> Go to Login
      router.push("/login");
    }

    if (user && pathname === "/login") {
      // If logged in & trying to access login -> Go to Dashboard
      router.push("/dashboard");
    }

  }, [user, loading, pathname]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useUserAuth = () => {
  return useContext(AuthContext);
};