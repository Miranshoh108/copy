"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import $api from "@/app/http/api";

export const useAuth = (redirectIfUnauthenticated = false) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const clearAuthData = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  const checkAuth = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setIsAuthenticated(false);
        if (redirectIfUnauthenticated) {
          router.push("/register");
        }
        return;
      }

      try {
        const response = await $api.get("/users/profile/me");

        if (response.data.success) {
          const userData = response.data.data;

          localStorage.setItem("user", JSON.stringify(userData));

          setIsAuthenticated(true);
          setUser(userData);
        } else {
          throw new Error("Failed to fetch user profile");
        }
      } catch (apiError) {
        console.error("Token validation failed:", apiError);

        if (apiError.response?.status === 401) {
          try {
            await refreshToken();
            const retryResponse = await $api.get("/users/profile/me");

            if (retryResponse.data.success) {
              const userData = retryResponse.data.data;
              localStorage.setItem("user", JSON.stringify(userData));
              setIsAuthenticated(true);
              setUser(userData);
            } else {
              throw new Error(
                "Failed to fetch user profile after token refresh"
              );
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            clearAuthData();
            if (redirectIfUnauthenticated) {
              router.push("/register");
            }
          }
        } else {
          clearAuthData();
          if (redirectIfUnauthenticated) {
            router.push("/register");
          }
        }
      }
    } catch (error) {
      console.error("Auth check error:", error);
      clearAuthData();
      if (redirectIfUnauthenticated) {
        router.push("/register");
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    const storedRefreshToken = localStorage.getItem("refreshToken");

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

      if (response.data.success) {
        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data;

        localStorage.setItem("accessToken", accessToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        return accessToken;
      } else {
        throw new Error("Failed to refresh token");
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      throw error;
    }
  };

  const logout = () => {
    clearAuthData();
    router.push("/register");
  };

  const updateUser = (newUserData) => {
    localStorage.setItem("user", JSON.stringify(newUserData));
    setUser(newUserData);
  };

  useEffect(() => {
    checkAuth();
  }, [redirectIfUnauthenticated, router]);

  useEffect(() => {
    const requestInterceptor = $api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("accessToken");
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

        if (error.response?.status === 401 && !original._retry) {
          original._retry = true;
          try {
            await refreshToken();
            return $api(original);
          } catch (refreshError) {
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

    return () => {
      $api.interceptors.request.eject(requestInterceptor);
      $api.interceptors.response.eject(responseInterceptor);
    };
  }, [redirectIfUnauthenticated, router]);

  return {
    isAuthenticated,
    user,
    loading,
    logout,
    updateUser,
    checkAuth, 
  };
};
