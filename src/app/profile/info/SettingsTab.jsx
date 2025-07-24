"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const SettingsTab = () => {
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

  const languages = [
    { code: "uz", name: "O'zbekcha" },
    { code: "ru", name: "Русский" },
    { code: "en", name: "English" },
  ];

  // LocalStorage'dan sozlamalarni olish
  useEffect(() => {
    const saved = localStorage.getItem("userSettings");
    if (saved) {
      setUserSettings(JSON.parse(saved));
    }
  }, []);

  // Sozlamani umumiy o‘zgartirish
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Bildirishnoma o‘zgarishlari
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setUserSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [name]: checked,
      },
    }));
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
  };

  // Sozlamalarni saqlash
  const handleSaveSettings = () => {
    localStorage.setItem("userSettings", JSON.stringify(userSettings));
  
  };

  // Akkauntdan chiqish
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/register"); // login sahifasiga yo‘naltirish
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Sozlamalar</h2>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
            {["email", "sms", "push"].map((type) => (
              <div key={type} className="flex items-center">
                <input
                  id={`${type}-notifications`}
                  name={type}
                  type="checkbox"
                  checked={userSettings.notifications[type]}
                  onChange={handleNotificationChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={`${type}-notifications`}
                  className="ml-2 block text-sm text-gray-700"
                >
                  {type.toUpperCase()} orqali bildirishnomalar
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
                Profil ko‘rinishi
              </label>
              <select
                name="profileVisibility"
                value={userSettings.privacy.profileVisibility}
                onChange={handlePrivacyChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="public">Hammaga ochiq</option>
                <option value="friends">Do‘stlarimga</option>
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
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="search-visibility"
                className="ml-2 block text-sm text-gray-700"
              >
                Meni qidiruvda ko‘rsatish
              </label>
            </div>
          </div>
        </div>

        {/* Xavfsizlik */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Xavfsizlik</h3>
          <div className="space-y-4">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-50 cursor-pointer text-red-600 rounded-lg hover:bg-red-100 transition"
            >
              Akkauntdan chiqish
            </button>
          </div>
        </div>

        {/* Saqlash tugmasi */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleSaveSettings}
            className="px-6 py-2 bg-blue-600 cursor-pointer text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            O‘zgarishlarni saqlash
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
