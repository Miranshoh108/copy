"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import $api from "@/app/http/api";


const SettingsTab = ({ onLogout, currentUser }) => {
  const router = useRouter();

  const [userSettings, setUserSettings] = useState({
    language: "uz",
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
    privacy: {
      profileVisibility: "public",
      searchVisibility: true,
    },
  });

  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success', 'error', null

  const languages = [
    { code: "uz", name: "O'zbekcha" },
    { code: "ru", name: "Русский" },
    { code: "en", name: "English" },
  ];

  // API dan sozlamalarni olish
  const fetchUserSettings = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      $api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await $api.get("/users/settings");

      if (response.data.status === 200) {
        setUserSettings(response.data.settings);
      }
    } catch (error) {
      console.error("Sozlamalarni yuklashda xatolik:", error);
      // Fallback: localStorage dan olish
      const saved = localStorage.getItem("userSettings");
      if (saved) {
        setUserSettings(JSON.parse(saved));
      }
    }
  };

  // LocalStorage'dan sozlamalarni olish (fallback)
  useEffect(() => {
    fetchUserSettings();
  }, []);

  // Sozlamani umumiy o'zgartirish
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setSaveStatus(null);
  };

  // Bildirishnoma o'zgarishlari
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setUserSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [name]: checked,
      },
    }));
    setSaveStatus(null);
  };

  // Maxfiylik sozlamalari
  const handlePrivacyChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserSettings((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
    setSaveStatus(null);
  };

  // Sozlamalarni API ga saqlash
  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      setSaveStatus(null);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Token mavjud emas");
      }

      $api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await $api.put("/users/settings", userSettings);

      if (response.data.status === 200) {
        // LocalStorage'ga ham saqlash (cache uchun)
        localStorage.setItem("userSettings", JSON.stringify(userSettings));
        setSaveStatus("success");

        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        throw new Error("Sozlamalarni saqlashda xatolik");
      }
    } catch (error) {
      console.error("Sozlamalarni saqlashda xatolik:", error);
      setSaveStatus("error");

      // Fallback: faqat localStorage'ga saqlash
      localStorage.setItem("userSettings", JSON.stringify(userSettings));

      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Parolni o'zgartirish
  const handleChangePassword = async () => {
    // Bu yerda parol o'zgartirish modal oynasi ochilishi mumkin
    // Hozircha console.log
    console.log("Parol o'zgartirish sahifasiga o'tish");
    // router.push("/change-password");
  };

  // Akkauntni o'chirish
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Akkauntingizni o'chirishni rostdan ham xohlaysizmi? Bu amalni bekor qilib bo'lmaydi."
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Token mavjud emas");
      }

      $api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await $api.delete("/users/profile/me");

      if (response.data.status === 200) {
        alert("Akkaunt muvaffaqiyatli o'chirildi");
        onLogout();
      } else {
        throw new Error("Akkauntni o'chirishda xatolik");
      }
    } catch (error) {
      console.error("Akkauntni o'chirishda xatolik:", error);
      alert("Akkauntni o'chirishda xatolik yuz berdi");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Sozlamalar</h2>
        {saveStatus && (
          <div
            className={`px-3 py-1 rounded-full text-sm ${
              saveStatus === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {saveStatus === "success"
              ? "Muvaffaqiyatli saqlandi"
              : "Saqlashda xatolik"}
          </div>
        )}
      </div>

      <div className="space-y-8">
        {/* Umumiy Sozlamalar */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Umumiy sozlamalar
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Til
              </label>
              <select
                name="language"
                value={userSettings.language}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Bildirishnomalar */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Bildirishnomalar
          </h3>
          <div className="space-y-3">
            {[
              { key: "email", label: "Email orqali bildirishnomalar" },
              { key: "sms", label: "SMS orqali bildirishnomalar" },
              { key: "push", label: "Push bildirishnomalar" },
            ].map((notification) => (
              <div key={notification.key} className="flex items-center">
                <input
                  id={`${notification.key}-notifications`}
                  name={notification.key}
                  type="checkbox"
                  checked={userSettings.notifications[notification.key]}
                  onChange={handleNotificationChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={`${notification.key}-notifications`}
                  className="ml-2 block text-sm text-gray-700"
                >
                  {notification.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Maxfiylik */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Maxfiylik</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profil ko'rinishi
              </label>
              <select
                name="profileVisibility"
                value={userSettings.privacy.profileVisibility}
                onChange={handlePrivacyChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              >
                <option value="public">Hammaga ochiq</option>
                <option value="friends">Do'stlarimga</option>
                <option value="private">Faqat men</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                id="search-visibility"
                name="searchVisibility"
                type="checkbox"
                checked={userSettings.privacy.searchVisibility}
                onChange={handlePrivacyChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label
                htmlFor="search-visibility"
                className="ml-2 block text-sm text-gray-700"
              >
                Meni qidiruvda ko'rsatish
              </label>
            </div>
          </div>
        </div>

        {/* Xavfsizlik */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Xavfsizlik</h3>
          <div className="space-y-4">
            <button
              onClick={handleChangePassword}
              className="px-4 py-2 bg-blue-50 cursor-pointer text-blue-600 rounded-lg hover:bg-blue-100 transition"
            >
              Parolni o'zgartirish
            </button>

            <div className="border-t pt-4">
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-50 cursor-pointer text-red-600 rounded-lg hover:bg-red-100 transition"
              >
                Akkauntni o'chirish
              </button>
              <p className="text-xs text-gray-500 mt-1">
                Bu amalni bekor qilib bo'lmaydi
              </p>
            </div>

            <div className="border-t pt-4">
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-gray-50 cursor-pointer text-gray-600 rounded-lg hover:bg-gray-100 transition"
              >
                Akkauntdan chiqish
              </button>
            </div>
          </div>
        </div>

        {/* Account Info */}
        {currentUser && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Akkount ma'lumotlari
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Foydalanuvchi ID:</span>
                <span className="font-mono">{currentUser.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ro'yxatdan o'tgan sana:</span>
                <span>{currentUser.memberSince}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Foydalanuvchi turi:</span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    currentUser.role === "admin"
                      ? "bg-purple-100 text-purple-800"
                      : currentUser.isWorker
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {currentUser.role === "admin"
                    ? "Administrator"
                    : currentUser.isWorker
                    ? "Xodim"
                    : "Mijoz"}
                </span>
              </div>
              {currentUser.tokenVersion && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Token versiyasi:</span>
                  <span>{currentUser.tokenVersion}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Saqlash tugmasi */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleSaveSettings}
            disabled={loading}
            className="px-6 py-2 bg-green-600 cursor-pointer text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saqlanmoqda..." : "O'zgarishlarni saqlash"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
