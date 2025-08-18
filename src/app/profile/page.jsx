"use client";
import {
  User,
  Settings,
  ShoppingBag,
  Heart,
  CreditCard,
  MapPin,
  Bell,
  LogOut,
  Camera,
  Gift,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import ProfileTab from "./info/ProfileTab";
import Orders from "./info/Orders";
import Favorites from "./info/Favorites";
import Cards from "./info/Cards";
import Addresses from "./info/Addresses";
import Notifications from "./info/Notifications";
import SettingsTab from "./info/SettingsTab";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useHomeLikes } from "../components/hooks/likes";
import $api from "../http/api";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const { likes } = useHomeLikes();

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token mavjud emas");
      }

      $api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await $api.get("/users/profile/me");

      if (response.data.status === 200) {
        const profileData = response.data.myProfile;

        const formattedUser = {
          id: profileData._id,
          name: `${profileData.firstName} ${profileData.lastName}`,
          phone: profileData.phoneNumber,
          email: profileData.email || "",
          avatar: profileData.avatar
            ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}${
                profileData.avatar
              }`
            : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          gender: profileData.gender,
          age: profileData.age,
          interests: profileData.interests || [],
          isWorker: profileData.isWorker,
          role: profileData.role,
          isOnline: profileData.isOnline,
          lastLogin: profileData.lastLogin,
          lastActivity: profileData.last_activity,
          telegramId: profileData.telegramId,
          tokenVersion: profileData.tokenVersion,
          // Default qiymatlar (keyinchalik boshqa API'lardan to'ldirilishi mumkin)
          totalOrders: 24, // Bu ma'lumot orders API dan kelishi kerak
          totalSpent: "2,450,000", // Bu ma'lumot orders API dan kelishi kerak
          loyaltyPoints: 1250, // Bu ma'lumot loyalty API dan kelishi kerak
          memberSince: new Date(profileData.createdAt).toLocaleDateString(
            "uz-UZ"
          ),
          orders: [], // Orders API dan keladi
          addresses: [], // Addresses API dan keladi
        };

        setUser(formattedUser);

        // LocalStorage'da cache uchun saqlash
        localStorage.setItem("user", JSON.stringify(formattedUser));
      } else {
        throw new Error("Profile ma'lumotlarini olishda xatolik");
      }
    } catch (error) {
      console.error("Profile yuklashda xatolik:", error);
      setError(error.message || "Profile yuklashda xatolik yuz berdi");

      // Fallback: localStorage dan olishga harakat qilamiz
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setError(null); // Cache mavjud bo'lsa xatolikni yashirish
        } catch (parseError) {
          console.error("localStorage parse xatolik:", parseError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Profile ma'lumotlarini yangilash
  const updateUserProfile = async (updatedData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token mavjud emas");
      }

      $api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await $api.put("/users/profile/me", {
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        email: updatedData.email,
        phoneNumber: updatedData.phone,
        gender: updatedData.gender,
        age: updatedData.age,
      });

      if (response.data.status === 200) {
        // Yangilangan ma'lumotlarni qayta yuklash
        await fetchUserProfile();
        return true;
      } else {
        throw new Error("Profile yangilashda xatolik");
      }
    } catch (error) {
      console.error("Profile yangilashda xatolik:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Avatar o'zgartirish
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token mavjud emas");
      }

      const formData = new FormData();
      formData.append("avatar", file);

      // Avatar uchun Content-Type ni o'chirish (FormData o'zi belgilaydi)
      const response = await $api.post("/users/profile/avatar", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === 200) {
        // Avatar muvaffaqiyatli yuklandi, user ma'lumotlarini yangilash
        const newAvatarUrl = `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
        }${response.data.avatar}`;

        setUser((prev) => ({
          ...prev,
          avatar: newAvatarUrl,
        }));

        // LocalStorage'ni yangilash
        const updatedUser = {
          ...user,
          avatar: newAvatarUrl,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Avatar yuklashda xatolik:", error);

      // Fallback: faqat local ko'rinish uchun
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const menuItems = [
    { id: "profile", icon: User, label: "Shaxsiy ma'lumotlar", count: null },
    {
      id: "orders",
      icon: ShoppingBag,
      label: "Buyurtmalarim",
      count: user?.orders?.length || 0,
    },
    { id: "favorites", icon: Heart, label: "Sevimlilar", count: likes.length },
    { id: "cards", icon: CreditCard, label: "To'lov kartalari", count: null },
    {
      id: "addresses",
      icon: MapPin,
      label: "Manzillarim",
      count: user?.addresses?.length || 0,
    },
    { id: "notifications", icon: Bell, label: "Bildirishnomalar", count: null },
    { id: "settings", icon: Settings, label: "Sozlamalar", count: null },
  ];

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        $api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        // Server'ga logout so'rovi yuborish
        await $api.post("/auth/logout");
      }
    } catch (error) {
      console.error("Logout xatolik:", error);
    } finally {
      // Local ma'lumotlarni tozalash
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("avatar");
      // Authorization header ni tozalash
      delete $api.defaults.headers.common["Authorization"];
      window.location.href = "/register";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Profile ma'lumotlari yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchUserProfile}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Foydalanuvchi ma'lumotlari topilmadi</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Error banner agar cache ishlatayotgan bo'lsa */}
      {error && user && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-4 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Server bilan aloqa uzilgan. Saqlangan ma'lumotlar
                ko'rsatilmoqda.
                <button
                  onClick={fetchUserProfile}
                  className="ml-2 underline hover:no-underline"
                >
                  Qayta urinish
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-green-600 to-green-700 text-white">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-20 h-16 rounded-full border-3 border-white object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
                      }}
                    />
                    <button
                      className="absolute cursor-pointer -bottom-1 -right-1 w-6 h-6 bg-white text-green-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                      onClick={() => fileInputRef.current.click()}
                    >
                      <Camera size={12} />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <p className="text-green-200 text-sm">{user.phone}</p>
                    {user.isOnline && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                        <span className="text-green-200 text-xs">Online</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{user.totalOrders}</div>
                    <div className="text-green-200 text-xs">Buyurtmalar</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {user.loyaltyPoints}
                    </div>
                    <div className="text-green-200 text-xs">Bonus ball</div>
                  </div>
                </div>
              </div>

              {/* Menu */}
              <div className="p-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full cursor-pointer flex items-center justify-between p-3 rounded-lg text-left hover:bg-gray-50 transition-colors ${
                      activeTab === item.id
                        ? "bg-green-50 text-green-700 border-r-2 border-green-600"
                        : "text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    {item.count > 0 && (
                      <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                        {item.count}
                      </span>
                    )}
                  </button>
                ))}

                <button
                  onClick={handleLogout}
                  className="w-full cursor-pointer flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2"
                >
                  <LogOut size={18} />
                  <span className="text-sm font-medium">Chiqish</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <ProfileTab
                user={user}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                setUser={setUser}
                updateUserProfile={updateUserProfile}
              />
            )}
            {activeTab === "orders" && <Orders />}
            {activeTab === "favorites" && <Favorites />}
            {activeTab === "cards" && <Cards />}
            {activeTab === "addresses" && <Addresses />}
            {activeTab === "notifications" && <Notifications />}
            {activeTab === "settings" && (
              <SettingsTab
                onLogout={handleLogout}
                isAuthenticated={true}
                currentUser={user}
              />
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
