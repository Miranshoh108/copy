"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import $api from "../http/api"; // Import your axios instance

function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [phoneNumber, setPhoneNumber] = useState("+998");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showSmsCard, setShowSmsCard] = useState(false);
  const [smsCode, setSmsCode] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tempRegistrationData, setTempRegistrationData] = useState(null);
  const inputRefs = useRef([]);
  const router = useRouter();

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: "", message: "" }), 4000);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPhoneNumber("+998");
    setPassword("");
    setFirstName("");
    setLastName("");
    setShowSmsCard(false);
    setSmsCode(["", "", "", ""]);
    setNotification({ type: "", message: "" });
    setCurrentUser(null);
    setTempRegistrationData(null);
  };

  const formatPhoneNumber = (value) => {
    let cleaned = value.replace(/[^\d]/g, "");

    if (cleaned.startsWith("998")) {
      cleaned = cleaned.slice(3);
    }

    if (cleaned.length > 9) {
      cleaned = cleaned.slice(0, 9);
    }

    let formatted = "+998";
    if (cleaned.length > 0) {
      formatted += "-" + cleaned.slice(0, 2);
    }
    if (cleaned.length > 2) {
      formatted += "-" + cleaned.slice(2, 5);
    }
    if (cleaned.length > 5) {
      formatted += "-" + cleaned.slice(5, 7);
    }
    if (cleaned.length > 7) {
      formatted += "-" + cleaned.slice(7, 9);
    }

    return formatted;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const validatePhone = () => {
    const phoneDigits = phoneNumber.replace(/[^\d]/g, "").replace(/^998/, "");
    return phoneDigits.length === 9;
  };

  const validateForm = () => {
    if (!validatePhone()) {
      showNotification(
        "warning",
        "Iltimos, to'liq telefon raqam kiriting (+998-XX-XXX-XX-XX formatida)."
      );
      return false;
    }

    if (activeTab === "register") {
      if (!firstName.trim() || !lastName.trim()) {
        showNotification("warning", "Iltimos, ism va familiyangizni kiriting.");
        return false;
      }
    }

    if (activeTab === "login" && !password.trim()) {
      showNotification("warning", "Iltimos, parolni kiriting.");
      return false;
    }

    return true;
  };

  // Register user - sends verification code
  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const registrationData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone_number: phoneNumber.replace(/[^\d]/g, ""), // Send only digits
      };

      const response = await $api.post("/auth/register", registrationData);

      if (response.data.success) {
        setTempRegistrationData(registrationData);
        showNotification("info", "SMS kodi yuborildi!");
        setShowSmsCard(true);
        setSmsCode(["", "", "", ""]);
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      } else {
        showNotification(
          "error",
          response.data.message || "Ro'yxatdan o'tishda xatolik yuz berdi!"
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Server bilan bog'lanishda xatolik yuz berdi!";
      showNotification("error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Login user
  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const loginData = {
        phoneNumber: phoneNumber.replace(/[^\d]/g, ""), // Send only digits
        password: password,
      };

      const response = await $api.post("/auth/login", loginData);

      if (response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;

        // Store tokens and user data
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        setCurrentUser(user);
        setIsAuthenticated(true);
        showNotification(
          "success",
          `Tizimga muvaffaqiyatli kirdingiz, ${user.firstName}!`
        );
      } else {
        showNotification(
          "error",
          response.data.message || "Login qilishda xatolik yuz berdi!"
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Server bilan bog'lanishda xatolik yuz berdi!";
      showNotification("error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // System login for admin/employee
  const handleSystemLogin = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const loginData = {
        phoneNumber: phoneNumber.replace(/[^\d]/g, ""),
        password: password,
      };

      const response = await $api.post("/auth/system/login", loginData);

      if (response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        setCurrentUser(user);
        setIsAuthenticated(true);
        showNotification(
          "success",
          `Tizimga muvaffaqiyatli kirdingiz, ${user.firstName}!`
        );
      } else {
        showNotification(
          "error",
          response.data.message || "System login qilishda xatolik yuz berdi!"
        );
      }
    } catch (error) {
      console.error("System login error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Server bilan bog'lanishda xatolik yuz berdi!";
      showNotification("error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Verify SMS code
  const handleSmsSubmit = async () => {
    const enteredCode = smsCode.join("");

    if (enteredCode.length !== 4) {
      showNotification("warning", "Iltimos, 4 xonali kodni to'liq kiriting.");
      return;
    }

    try {
      setIsLoading(true);

      const verificationData = {
        phoneNumber:
          tempRegistrationData?.phoneNumber ||
          phoneNumber.replace(/[^\d]/g, ""),
        code: enteredCode,
      };

      const response = await $api.post("/auth/verify", verificationData);

      if (response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;

        // Store tokens and user data
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        setCurrentUser(user);
        setShowSmsCard(false);
        showNotification(
          "success",
          `Ro'yxatdan o'tish jarayoni yakunlandi, ${user.firstName}!`
        );

        setTimeout(() => {
          setIsAuthenticated(true);
        }, 1500);
      } else {
        showNotification(
          "error",
          response.data.message || "SMS kodni tasdiqlashda xatolik yuz berdi!"
        );
      }
    } catch (error) {
      console.error("Verification error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Server bilan bog'lanishda xatolik yuz berdi!";
      showNotification("error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh token function
  const refreshToken = async () => {
    try {
      const storedRefreshToken = localStorage.getItem("refreshToken");
      if (!storedRefreshToken) {
        throw new Error("No refresh token found");
      }

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
      handleLogout();
      throw error;
    }
  };

  const handleFormSubmit = () => {
    if (activeTab === "register") {
      handleRegister();
    } else {
      handleLogin();
    }
  };

  const handleSmsChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...smsCode];
      newCode[index] = value;
      setSmsCode(newCode);
      if (value && index < 3) inputRefs.current[index + 1]?.focus();
    }
  };

  const handleCloseSmsCard = () => {
    setShowSmsCard(false);
    setTempRegistrationData(null);
  };

  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      action();
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setActiveTab("login");
    setPhoneNumber("+998");
    setPassword("");
    setFirstName("");
    setLastName("");
    setShowSmsCard(false);
    setSmsCode(["", "", "", ""]);
    setNotification({ type: "", message: "" });
    setTempRegistrationData(null);
  };

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");

    if (token && user) {
      try {
        setCurrentUser(JSON.parse(user));
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        handleLogout();
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // Setup axios interceptor for token refresh
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
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400 to-pink-600 rounded-full opacity-20 blur-3xl"></div>
      </div>

      {/* Notification */}
      {notification.message && (
        <div
          className={`fixed top-4 right-4 max-w-md p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : notification.type === "error"
              ? "bg-red-500 text-white"
              : notification.type === "warning"
              ? "bg-yellow-500 text-white"
              : "bg-blue-500 text-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">{notification.message}</span>
            <button
              onClick={() => setNotification({ type: "", message: "" })}
              className="ml-2 text-white hover:text-gray-200 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {!showSmsCard && (
        <div className="relative max-w-md w-full bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Tab Navigation */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
            {["login", "register"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`flex-1 py-3 px-4 text-sm cursor-pointer font-semibold rounded-xl transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-white text-indigo-600 shadow-lg transform scale-105"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {tab === "login" ? "Kirish" : "Ro'yxatdan o'tish"}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {activeTab === "login" ? "Xush kelibsiz!" : "Ro'yxatdan o'ting"}
              </h2>
              <p className="text-gray-600 text-sm">
                {activeTab === "login"
                  ? "Hisobingizga kirish uchun telefon raqam va parolni kiriting"
                  : "Yangi hisob yaratish uchun ma'lumotlaringizni kiriting"}
              </p>
            </div>

            {activeTab === "register" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    placeholder="Ismingiz"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleFormSubmit)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
                <div className="relative">
                  <input
                    placeholder="Familyangiz"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleFormSubmit)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>
            )}

            <div className="relative">
              <input
                type="tel"
                placeholder="+998-90-123-45-67"
                value={phoneNumber}
                onChange={handlePhoneChange}
                onKeyPress={(e) => handleKeyPress(e, handleFormSubmit)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                📱
              </div>
            </div>

            {activeTab === "login" && (
              <div className="relative">
                <input
                  type="password"
                  placeholder="Parol"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleFormSubmit)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  🔒
                </div>
              </div>
            )}

            <button
              onClick={handleFormSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 cursor-pointer to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  {activeTab === "login"
                    ? "Tekshirilmoqda..."
                    : "Ro'yxatga olinmoqda..."}
                </div>
              ) : activeTab === "login" ? (
                "Kirish"
              ) : (
                "SMS Kodi Olish"
              )}
            </button>
          </div>
        </div>
      )}

      {/* SMS Verification Modal */}
      {showSmsCard && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md w-full bg-white rounded-2xl shadow-2xl p-6 z-40 mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                SMS Kodni Kiriting
              </h3>
              <button
                onClick={handleCloseSmsCard}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-center mb-6">
              <p className="text-gray-600 text-sm">
                {phoneNumber} raqamiga yuborilgan 4 xonali kodni kiriting
              </p>
              {tempRegistrationData && (
                <p className="text-indigo-600 text-sm font-medium mt-2">
                  {tempRegistrationData.firstName}{" "}
                  {tempRegistrationData.lastName}
                </p>
              )}
            </div>

            <div className="flex justify-center space-x-3 mb-6">
              {smsCode.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleSmsChange(index, e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && smsCode.every((d) => d !== "")) {
                      handleSmsSubmit();
                    }
                  }}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-14 h-14 border-2 border-gray-300 rounded-xl text-center text-xl font-bold focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              ))}
            </div>

            <button
              onClick={handleSmsSubmit}
              disabled={isLoading || smsCode.some((d) => d === "")}
              className="w-full cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Tekshirilmoqda...
                </div>
              ) : (
                "Tasdiqlash"
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default AuthPage;
