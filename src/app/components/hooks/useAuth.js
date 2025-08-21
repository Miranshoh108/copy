"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import $api from "@/app/http/api";

export const useAuth = (redirectIfUnauthenticated = false) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const isRefreshingRef = useRef(false);
  const authCheckInProgressRef = useRef(false);
  const interceptorsSetupRef = useRef(false);

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

  const refreshToken = useCallback(async () => {
    if (isRefreshingRef.current) {
      return null;
    }

    isRefreshingRef.current = true;

    try {
      const storedRefreshToken =
        typeof window !== "undefined"
          ? localStorage.getItem("refreshToken")
          : null;

      if (!storedRefreshToken) {
        throw new Error("No refresh token available");
      }
      console.log("response", response);
      const response = await $api.post(
        "/auth/refresh/token",
        {},
        {
          headers: {
            refreshToken: storedRefreshToken,
          },
          // Don't use interceptors for this request to avoid loops
          _skipAuthRetry: true,
        }
      );

      if (response.data?.success || response.data?.status === 200) {
        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data || response.data;

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
    } finally {
      isRefreshingRef.current = false;
    }
  }, []);

  const checkAuth = useCallback(async () => {
    if (authCheckInProgressRef.current) {
      return;
    }

    authCheckInProgressRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const accessToken =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      if (!accessToken) {
        setIsAuthenticated(false);
        setUser(null);
        if (redirectIfUnauthenticated) {
          router.push("/register");
        }
        return;
      }

      try {
        const response = await $api.get("/users/profile/me", {
          _skipAuthRetry: true,
        });

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

        if (apiError.response?.status === 401) {
          try {
            console.log("Attempting token refresh...");
            const newAccessToken = await refreshToken();

            if (newAccessToken) {
              const retryResponse = await $api.get("/users/profile/me", {
                headers: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
                _skipAuthRetry: true,
              });

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
            } else {
              throw new Error("Token refresh returned null");
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);

            clearAuthData();

            if (redirectIfUnauthenticated) {
              router.push("/register");
            }

            setError("Session expired. Please log in again.");
          }
        } else {
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
      authCheckInProgressRef.current = false;
    }
  }, [refreshToken, clearAuthData, redirectIfUnauthenticated, router]);

  const logout = useCallback(() => {
    clearAuthData();
    router.push("/register");
  }, [clearAuthData, router]);

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

  useEffect(() => {
    if (typeof window !== "undefined" && !user && !loading) {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          const accessToken = localStorage.getItem("accessToken");
          if (accessToken) {
            setIsAuthenticated(true);
          }
        }
      } catch (err) {
        console.error("Error loading stored user data:", err);
      }
    }
  }, [user, loading]);

  useEffect(() => {
    checkAuth();
  }, []); 

  useEffect(() => {
    if (interceptorsSetupRef.current) {
      return;
    }

    interceptorsSetupRef.current = true;

    const requestInterceptor = $api.interceptors.request.use(
      (config) => {
        if (config._skipAuthRetry) {
          return config;
        }

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

        if (
          original._skipAuthRetry ||
          original._retry ||
          isRefreshingRef.current ||
          error.response?.status !== 401
        ) {
          return Promise.reject(error);
        }

        original._retry = true;

        try {
          const newAccessToken = await refreshToken();

          if (newAccessToken) {
            original.headers.Authorization = `Bearer ${newAccessToken}`;
            return $api(original);
          } else {
            throw new Error("Failed to refresh token");
          }
        } catch (refreshError) {
          console.error("Token refresh failed in interceptor:", refreshError);

          clearAuthData();

          if (redirectIfUnauthenticated) {
            router.push("/register");
          }

          return Promise.reject(error);
        }
      }
    );

    return () => {
      $api.interceptors.request.eject(requestInterceptor);
      $api.interceptors.response.eject(responseInterceptor);
      interceptorsSetupRef.current = false;
    };
  }, []); 

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
