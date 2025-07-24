"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const useAuth = (redirectIfUnauthenticated = false) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setIsAuthenticated(true);
          setUser(JSON.parse(storedUser));
        } else {
          setIsAuthenticated(false);
          if (redirectIfUnauthenticated) {
            router.push("/register");
          }
        }
      } catch (error) {
        setIsAuthenticated(false);
        if (redirectIfUnauthenticated) {
          router.push("/register");
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [redirectIfUnauthenticated, router]);

  return { isAuthenticated, user, loading };
};
