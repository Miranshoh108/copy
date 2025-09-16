"use client";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import $api from "../http/api";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [loginType, setLoginType] = useState("sms");
  const [phoneNumber, setPhoneNumber] = useState("+998");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [showSmsCard, setShowSmsCard] = useState(false);
  const [smsCode, setSmsCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tempRegistrationData, setTempRegistrationData] = useState(null);
  const [smsStep, setSmsStep] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const inputRefs = useRef([]);
  const router = useRouter();
  const authCheckDoneRef = useRef(false);
  const interceptorsSetupRef = useRef(false);

  useEffect(() => {
    if (!authCheckDoneRef.current) {
      checkAuthStatus();
      authCheckDoneRef.current = true;
    }
  }, []);

  const checkAuthStatus = async () => {
    setIsCheckingAuth(true);

    const accessToken =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!accessToken) {
      setIsCheckingAuth(false);
      return;
    }

    try {
      const { data } = await $api.get("/users/profile/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        _skipAuthRetry: true,
      });

      if (data?.success && data?.data) {
        const user = data.data;
        localStorage.setItem("user", JSON.stringify(user));
        setCurrentUser(user);
        setIsAuthenticated(true);
        router.push("/");
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error("Token verification error:", error);

      const refreshToken =
        typeof window !== "undefined"
          ? localStorage.getItem("refreshToken")
          : null;

      if (refreshToken && error.response?.status === 401) {
        try {
          await handleTokenRefresh();

          const newAccessToken = localStorage.getItem("accessToken");
          const retryResponse = await $api.get("/users/profile/me", {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
            _skipAuthRetry: true,
          });

          if (retryResponse.data?.success && retryResponse.data?.data) {
            const user = retryResponse.data.data;
            localStorage.setItem("user", JSON.stringify(user));
            setCurrentUser(user);
            setIsAuthenticated(true);
            router.push("/");
          } else {
            handleLogout();
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          handleLogout();
        }
      } else {
        handleLogout();
      }
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setLoginType("sms");
    setPhoneNumber("+998");
    setFirstName("");
    setLastName("");
    setPassword("");
    setShowSmsCard(false);
    setSmsCode(["", "", "", "", "", ""]);
    setNotification({ type: "", message: "" });
    setCurrentUser(null);
    setTempRegistrationData(null);
    setSmsStep("");
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
    if (loginType === "system") {
      if (!validatePhone()) {
        showNotification(
          "warning",
          "Iltimos, to'liq telefon raqam kiriting (+998-XX-XXX-XX-XX formatida)."
        );
        return false;
      }
      if (!password.trim()) {
        showNotification("warning", "Iltimos, parol kiriting.");
        return false;
      }
    } else {
      if (!validatePhone()) {
        showNotification(
          "warning",
          "Iltimos, to'liq telefon raqam kiriting (+998-XX-XXX-XX-XX formatida)."
        );
        return false;
      }

      if (activeTab === "register") {
        if (!firstName.trim() || !lastName.trim()) {
          showNotification(
            "warning",
            "Iltimos, ism va familiyangizni kiriting."
          );
          return false;
        }
      }
    }

    return true;
  };

  const handleAuthSuccess = async (authData) => {
    const { user, accessToken, refreshToken } = authData;

    localStorage.setItem("accessToken", accessToken);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    localStorage.setItem("user", JSON.stringify(user));

    setCurrentUser(user);
    setIsAuthenticated(true);

    try {
      const profileResponse = await $api.get("/users/profile/me");
      if (profileResponse.data.success) {
        const freshUserData = profileResponse.data.data;
        localStorage.setItem("user", JSON.stringify(freshUserData));
        setCurrentUser(freshUserData);
      }
    } catch (error) {
      console.error("Failed to fetch fresh user profile:", error);
    }
  };

  const handleSystemLogin = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const requestData = {
        phone_number: `+${phoneNumber.replace(/[^\d]/g, "")}`,
        password: password,
      };

      const response = await $api.post("/auth/system/login", requestData);

      if (response.data.status === 200) {
        const authData = {
          user: {
            firstName: response.data.firstName || "",
            lastName: response.data.lastName || "",
            email: response.data.email || "",
            phoneNumber: phoneNumber.replace(/[^\d]/g, ""),
          },
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken || null,
        };

        await handleAuthSuccess(authData);

        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        showNotification("error", "Login ma'lumotlari noto'g'ri!");
      }
    } catch (error) {
      console.error("System login error:", error);
      const errorMessage =
        error.response?.data?.message || "Login qilishda xatolik yuz berdi!";
      showNotification("error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRequest = async () => {
    if (!validatePhone()) return;

    try {
      setIsLoading(true);

      const requestData = {
        phoneNumber: phoneNumber.replace(/[^\d]/g, ""),
      };

      const response = await $api.post("/auth/login/request-sms", requestData);

      if (response.data.success) {
        setSmsStep("login");
        showNotification("info", "SMS kodi yuborildi!");
        setShowSmsCard(true);
        setSmsCode(["", "", "", "", "", ""]);
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      } else {
        showNotification(
          "error",
          response.data.message ||
            "Telefon raqam topilmadi yoki xatolik yuz berdi!"
        );
      }
    } catch (error) {
      console.error("Login request error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Server bilan bog'lanishda xatolik yuz berdi!";
      showNotification("error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterRequest = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const registrationData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone_number: phoneNumber.replace(/[^\d]/g, ""),
      };

      const response = await $api.post("/auth/register", registrationData);

      if (response.data.success) {
        setTempRegistrationData(registrationData);
        setSmsStep("register");
        showNotification("info", "SMS kodi yuborildi!");
        setShowSmsCard(true);
        setSmsCode(["", "", "", "", "", ""]);
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

  const handleSmsSubmit = async () => {
    const enteredCode = smsCode.join("");

    if (enteredCode.length !== 6) {
      showNotification("warning", "Iltimos, 6 xonali kodni to'liq kiriting.");
      return;
    }

    try {
      setIsLoading(true);

      const verificationData = {
        phoneNumber: phoneNumber.replace(/[^\d]/g, ""),
        code: enteredCode,
      };

      let endpoint = "";
      if (smsStep === "login") {
        endpoint = "/auth/login/verify-sms";
      } else if (smsStep === "register") {
        endpoint = "/auth/register/verify-sms";
      }

      const response = await $api.post(endpoint, verificationData);

      if (response.data.success) {
        await handleAuthSuccess(response.data.data);
        setShowSmsCard(false);

        const message =
          smsStep === "register"
            ? `Ro'yxatdan o'tish jarayoni yakunlandi, ${response.data.data.user.firstName}!`
            : `Tizimga muvaffaqiyatli kirdingiz, ${response.data.data.user.firstName}!`;

        showNotification("success", message);

        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        showNotification(
          "error",
          response.data.message || "SMS kodni tasdiqlashda xatolik yuz berdi!"
        );
        setSmsCode(["", "", "", "", "", ""]);
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      }
    } catch (error) {
      console.error("Verification error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Server bilan bog'lanishda xatolik yuz berdi!";
      showNotification("error", errorMessage);
      setSmsCode(["", "", "", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenRefresh = async () => {
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
          _skipAuthRetry: true, // Prevent interceptor loops
        }
      );

      if (response.data.success || response.data.status === 200) {
        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data || response.data;

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
      handleRegisterRequest();
    } else {
      if (loginType === "system") {
        handleSystemLogin();
      } else {
        handleLoginRequest();
      }
    }
  };

  const handleSmsChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...smsCode];
      newCode[index] = value;
      setSmsCode(newCode);
      if (value && index < 5) {
        setTimeout(() => inputRefs.current[index + 1]?.focus(), 0);
      }
    }
  };

  const handleCloseSmsCard = () => {
    setShowSmsCard(false);
    setTempRegistrationData(null);
    setSmsStep("");
    setSmsCode(["", "", "", "", "", ""]);
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
    setLoginType("sms");
    setPhoneNumber("+998");
    setFirstName("");
    setLastName("");
    setPassword("");
    setShowSmsCard(false);
    setSmsCode(["", "", "", "", "", ""]);
    setNotification({ type: "", message: "" });
    setTempRegistrationData(null);
    setSmsStep("");
  };

  // Setup interceptors only once
  useEffect(() => {
    if (interceptorsSetupRef.current) {
      return;
    }

    interceptorsSetupRef.current = true;

    const requestInterceptor = $api.interceptors.request.use(
      (config) => {
        // Skip interceptor if marked
        if (config._skipAuthRetry) {
          return config;
        }

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

        // Skip retry if already tried, marked to skip, or not 401
        if (
          original._retry ||
          original._skipAuthRetry ||
          error.response?.status !== 401
        ) {
          return Promise.reject(error);
        }

        original._retry = true;

        try {
          const newToken = await handleTokenRefresh();
          if (newToken) {
            original.headers.Authorization = `Bearer ${newToken}`;
            return $api(original);
          }
        } catch (refreshError) {
          console.error("Token refresh failed in interceptor:", refreshError);
          return Promise.reject(error);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      $api.interceptors.request.eject(requestInterceptor);
      $api.interceptors.response.eject(responseInterceptor);
      interceptorsSetupRef.current = false;
    };
  }, []); // Empty dependency array

  // Auto-dismiss notifications
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ type: "", message: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Show loading spinner while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-green-50 to-green-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-green-50 to-green-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400 to-[#249B73]  rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400 to-[#249B73]  rounded-full opacity-20 blur-3xl"></div>
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
              : "bg-green-500 text-white"
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
                    ? "bg-white text-[#249B73]  shadow-lg transform scale-105"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {tab === "login" ? "Kirish" : "Ro'yxatdan o'tish"}
              </button>
            ))}
          </div>

          {/* Login Type Selector (only for login tab) */}
          {activeTab === "login" && (
            <div className="flex bg-gray-50 rounded-xl p-1 mb-6">
              <button
                onClick={() => setLoginType("sms")}
                className={`flex-1 py-2 px-3 text-sm cursor-pointer font-medium rounded-lg transition-all duration-300 ${
                  loginType === "sms"
                    ? "bg-white text-[#249B73]  shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                SMS orqali
              </button>
              <button
                onClick={() => setLoginType("system")}
                className={`flex-1 py-2 px-3 text-sm cursor-pointer font-medium rounded-lg transition-all duration-300 ${
                  loginType === "system"
                    ? "bg-white text-[#249B73]  shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Parol bilan
              </button>
            </div>
          )}

          {/* Form */}
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {activeTab === "login" ? "Xush kelibsiz!" : "Ro'yxatdan o'ting"}
              </h2>
              <p className="text-gray-600 text-sm">
                {activeTab === "login"
                  ? loginType === "system"
                    ? "Telefon raqam va parolingizni kiriting"
                    : "Telefon raqamingizni kiriting, sizga SMS kod yuboramiz"
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
                    className="w-full px-4 py-3 border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
                <div className="relative">
                  <input
                    placeholder="Familyangiz"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleFormSubmit)}
                    className="w-full px-4 py-3 border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
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
                className="w-full px-4 py-3 border border-gray-300 outline-none rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                📱
              </div>
            </div>

            {/* Password field for system login */}
            {activeTab === "login" && loginType === "system" && (
              <div className="relative">
                <input
                  type="password"
                  placeholder="Parolingizni kiriting"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleFormSubmit)}
                  className="w-full px-4 py-3 border border-gray-300 outline-none rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  🔒
                </div>
              </div>
            )}

            <button
              onClick={handleFormSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#249B73]  cursor-pointer to-[#249B73]  text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  {activeTab === "login" && loginType === "system"
                    ? "Kirilmoqda..."
                    : "SMS yuborilmoqda..."}
                </div>
              ) : activeTab === "login" && loginType === "system" ? (
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
                {phoneNumber} raqamiga yuborilgan 6 xonali kodni kiriting
              </p>
              {tempRegistrationData && (
                <p className="text-[#249B73]  text-sm font-medium mt-2">
                  {tempRegistrationData.firstName}
                  {tempRegistrationData.lastName}
                </p>
              )}
            </div>

            <div className="flex justify-center space-x-2 mb-6">
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
                  className="w-12 h-14 border-2 border-gray-300 rounded-xl text-center text-xl font-bold focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
              ))}
            </div>

            <button
              onClick={handleSmsSubmit}
              disabled={isLoading || smsCode.some((d) => d === "")}
              className="w-full cursor-pointer bg-gradient-to-r from-[#249B73]  to-[#249B73]  text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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

            <div className="mt-4 text-center">
              <p className="text-gray-500 text-sm">
                Kod noto'g'ri bo'lsa, qaytadan kiriting
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AuthPage;
