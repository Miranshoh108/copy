"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const BASE_URL = "https://68282b2f6b7628c529126575.mockapi.io/login";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [phoneNumber, setPhoneNumber] = useState("+998");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showSmsCard, setShowSmsCard] = useState(false);
  const [smsCode, setSmsCode] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const inputRefs = useRef([]);
  const router = useRouter();
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: "", message: "" }), 4000);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPhoneNumber("+998-");
    setFirstName("");
    setLastName("");
    setShowSmsCard(false);
    setSmsCode(["", "", "", ""]);
    setNotification({ type: "", message: "" });
    setCurrentUser(null);
  };

  const formatPhoneNumber = (value) => {
    // Faqat raqamlarni qoldirish
    let cleaned = value.replace(/[^\d]/g, "");

    // Agar 998 bilan boshlansa, uni olib tashlaymiz
    if (cleaned.startsWith("998")) {
      cleaned = cleaned.slice(3);
    }

    // +998 dan keyin maksimal 9 ta raqam
    if (cleaned.length > 9) {
      cleaned = cleaned.slice(0, 9);
    }

    // Formatlash: +998-XX-XXX-XX-XX
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
    // +998 dan keyin aynan 9 ta raqam bo'lishi kerak
    const phoneDigits = phoneNumber.replace(/[^\d]/g, "").replace(/^998/, "");
    return phoneDigits.length === 9;
  };

  // API'dan barcha foydalanuvchilarni olish
  const fetchUsers = async () => {
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) {
        throw new Error("API bilan bog'lanishda xatolik");
      }
      const users = await response.json();
      return users;
    } catch (error) {
      console.error("Fetch users error:", error);
      throw error;
    }
  };

  // Yangi foydalanuvchini ro'yxatga olish
  const registerUser = async (userData) => {
    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Ro'yxatdan o'tishda xatolik");
      }

      const newUser = await response.json();
      return newUser;
    } catch (error) {
      console.error("Register user error:", error);
      throw error;
    }
  };

  const checkOrRegisterUser = async () => {
    try {
      setIsLoading(true);
      const users = await fetchUsers();
      const phoneExists = users.find((u) => u.phoneNumber === phoneNumber);

      if (activeTab === "login") {
        if (!phoneExists) {
          showNotification(
            "error",
            "Bu telefon raqam bilan ro'yxatdan o'tmagan foydalanuvchi topilmadi!"
          );
          return false;
        }

        // login holatida mavjud foydalanuvchini saqlash
        setCurrentUser(phoneExists);
        return true; // SMSga o'tsin
      }

      // Ro'yxatdan o'tishda tekshirish
      if (phoneExists) {
        showNotification(
          "error",
          "Bu telefon raqam allaqachon ro'yxatdan o'tgan!"
        );
        return false;
      }

      const newUserData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber,
      };

      const newUser = await registerUser(newUserData);
      setCurrentUser(newUser);
      return true; // SMSga o'tsin
    } catch (error) {
      console.error("API Error:", error);
      showNotification("error", "Server bilan bog'lanishda xatolik yuz berdi!");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSubmit = async () => {
    if (!validatePhone()) {
      showNotification(
        "warning",
        "Iltimos, to'liq telefon raqam kiriting (+998-XX-XXX-XX-XX formatida)."
      );
      return;
    }

    if (activeTab === "register" && (!firstName.trim() || !lastName.trim())) {
      showNotification("warning", "Iltimos, ism va familiyangizni kiriting.");
      return;
    }

    const success = await checkOrRegisterUser();

    if (success) {
      showNotification("info", "SMS kodi yuborildi: 1234");
      setShowSmsCard(true);
      setSmsCode(["", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
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

  const handleSmsSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      const enteredCode = smsCode.join("");
      if (enteredCode === "1234") {
        setShowSmsCard(false);
        showNotification(
          "success",
          activeTab === "login"
            ? `Tizimga muvaffaqiyatli kirdingiz, ${currentUser?.firstName}!`
            : `Ro'yxatdan o'tish jarayoni yakunlandi, ${currentUser?.firstName}!`
        );

        // ✅ LOCAL STORAGE GA SAQLASH
        localStorage.setItem("token", "mock-token-123456"); // yoki haqiqiy token
        localStorage.setItem("user", JSON.stringify(currentUser));

        // Navigatsiya
        setTimeout(() => {
          setIsAuthenticated(true);
        }, 1500);
      } else {
        showNotification("error", "Noto'g'ri SMS kod! To'g'ri kod: 1234");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleCloseSmsCard = () => {
    setShowSmsCard(false);
  };

  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      action();
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem("token"); // ✅ tokenni o‘chirish
    localStorage.removeItem("user"); // ✅ userni o‘chirish
    setActiveTab("login");
    setPhoneNumber("+998");
    setFirstName("");
    setLastName("");
    setShowSmsCard(false);
    setSmsCode(["", "", "", ""]);
    setNotification({ type: "", message: "" });
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/"); // ✅ Auth bo‘lsa redirect qiladi
    }
  }, [isAuthenticated, router]);
  // Auth sahifasi (oldingi kod)
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
                    ? "bg-white text-indigo-600 shadow-lg  transform scale-105"
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
                  ? "Hisobingizga kirish uchun telefon raqamingizni kiriting"
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
                    onKeyPress={(e) => handleKeyPress(e, handlePhoneSubmit)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
                <div className="relative">
                  <input
                    placeholder="Familyangiz"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handlePhoneSubmit)}
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
                onKeyPress={(e) => handleKeyPress(e, handlePhoneSubmit)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                📱
              </div>
            </div>

            <button
              onClick={handlePhoneSubmit}
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
              {currentUser && (
                <p className="text-indigo-600 text-sm font-medium mt-2">
                  {currentUser.firstName} {currentUser.lastName}
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
