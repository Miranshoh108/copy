"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import $api from "@/app/http/api";

export const useAuth = (redirectIfUnauthenticated = false) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Clear auth data helper
  const clearAuthData = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      }
      setIsAuthenticated(false);
      setUser(null);
      setError(null);
    } catch (err) {
      console.error("Error clearing auth data:", err);
    }
  }, []);

  // Refresh token function
  const refreshToken = useCallback(async () => {
    const storedRefreshToken =
      typeof window !== "undefined"
        ? localStorage.getItem("refreshToken")
        : null;

    if (!storedRefreshToken) {
      throw new Error("No refresh token found");
    }

    try {
      const response = await $api.post(
        "/auth/refresh/token",
        {},
        {
          headers: {
            refreshToken: storedRefreshToken,
          },
        }
      );

      if (response.data?.success) {
        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data;

        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", accessToken);
          if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
          }
        }

        return accessToken;
      } else {
        throw new Error("Failed to refresh token");
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      throw error;
    }
  }, []);

  // Check authentication status
  const checkAuth = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const accessToken =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      // If no access token, user is not authenticated
      if (!accessToken) {
        setIsAuthenticated(false);
        setUser(null);
        if (redirectIfUnauthenticated) {
          router.push("/register");
        }
        return;
      }

      try {
        // Try to fetch user profile with current token
        const response = await $api.get("/users/profile/me");

        if (response.data?.success) {
          const userData = response.data.data;

          if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(userData));
          }

          setIsAuthenticated(true);
          setUser(userData);
        } else {
          throw new Error("Failed to fetch user profile");
        }
      } catch (apiError) {
        console.error("Initial token validation failed:", apiError);

        // If 401 error, try to refresh token
        if (apiError.response?.status === 401) {
          try {
            console.log("Attempting token refresh...");
            await refreshToken();

            // Retry the profile request with new token
            const retryResponse = await $api.get("/users/profile/me");

            if (retryResponse.data?.success) {
              const userData = retryResponse.data.data;

              if (typeof window !== "undefined") {
                localStorage.setItem("user", JSON.stringify(userData));
              }

              setIsAuthenticated(true);
              setUser(userData);
            } else {
              throw new Error(
                "Failed to fetch user profile after token refresh"
              );
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);

            // Clear everything and redirect if needed
            clearAuthData();

            if (redirectIfUnauthenticated) {
              router.push("/register");
            }

            setError("Session expired. Please log in again.");
          }
        } else {
          // For non-401 errors, clear auth data
          clearAuthData();

          if (redirectIfUnauthenticated) {
            router.push("/register");
          }

          setError("Authentication failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Auth check error:", error);
      clearAuthData();

      if (redirectIfUnauthenticated) {
        router.push("/register");
      }

      setError("Authentication check failed.");
    } finally {
      setLoading(false);
    }
  }, [refreshToken, clearAuthData, redirectIfUnauthenticated, router]);

  // Logout function
  const logout = useCallback(() => {
    clearAuthData();
    router.push("/register");
  }, [clearAuthData, router]);

  // Update user data
  const updateUser = useCallback((newUserData) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(newUserData));
      }
      setUser(newUserData);
    } catch (err) {
      console.error("Error updating user data:", err);
    }
  }, []);

  // Load user data from localStorage on initial load
  useEffect(() => {
    if (typeof window !== "undefined" && !user && !loading) {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Error loading stored user data:", err);
      }
    }
  }, [user, loading]);

  // Initial auth check
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Set up axios interceptors
  useEffect(() => {
    const requestInterceptor = $api.interceptors.request.use(
      (config) => {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : null;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = $api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const original = error.config;

        // Only retry once and if it's a 401 error
        if (error.response?.status === 401 && !original._retry) {
          original._retry = true;

          try {
            await refreshToken();
            // Update the failed request with new token
            const newToken =
              typeof window !== "undefined"
                ? localStorage.getItem("accessToken")
                : null;

            if (newToken) {
              original.headers.Authorization = `Bearer ${newToken}`;
            }

            return $api(original);
          } catch (refreshError) {
            console.error("Token refresh failed in interceptor:", refreshError);

            // Clear auth data and redirect if needed
            clearAuthData();

            if (redirectIfUnauthenticated) {
              router.push("/register");
            }

            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );

    // Cleanup interceptors
    return () => {
      $api.interceptors.request.eject(requestInterceptor);
      $api.interceptors.response.eject(responseInterceptor);
    };
  }, [refreshToken, clearAuthData, redirectIfUnauthenticated, router]);

  return {
    isAuthenticated,
    user,
    loading,
    error,
    logout,
    updateUser,
    checkAuth,
    clearError: () => setError(null),
  };
};
