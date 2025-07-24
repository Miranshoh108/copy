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

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ⬅️ Yangi holat
  const fileInputRef = useRef(null);
  const { likes } = useHomeLikes();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAvatar = localStorage.getItem("avatar");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser({
        name: `${parsedUser.firstName} ${parsedUser.lastName}`,
        phone: parsedUser.phoneNumber,
        email: parsedUser.email || "",
        avatar:
          storedAvatar ||
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        totalOrders: 24,
        totalSpent: "2,450,000",
        loyaltyPoints: 1250,
        memberSince:
          parsedUser.memberSince || new Date().toLocaleDateString("uz-UZ"),
        orders: parsedUser.orders || [],
        addresses: parsedUser.addresses || [],
      });
    }

    setLoading(false); // ⬅️ Yuklash tugadi
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        localStorage.setItem("avatar", reader.result);
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

  if (loading || !user) {
    return <div className="text-center py-10">Ma'lumotlar yuklanmoqda...</div>;
  }
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/register"); // login sahifasiga yo‘naltirish
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-20 h-16 rounded-full border-3 border-white object-cover"
                    />
                    <button
                      className="absolute cursor-pointer -bottom-1 -right-1 w-6 h-6 bg-white text-blue-600 rounded-full flex items-center justify-center"
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
                    <p className="text-blue-200 text-sm">{user.phone}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{user.totalOrders}</div>
                    <div className="text-blue-200 text-xs">Buyurtmalar</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {user.loyaltyPoints}
                    </div>
                    <div className="text-blue-200 text-xs">Bonus ball</div>
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
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    {item.count > 0 && (
                      <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                        {item.count}
                      </span>
                    )}
                  </button>
                ))}

                <button
                  onClick={() => {
                    localStorage.removeItem("user");
                    localStorage.removeItem("avatar");
                    window.location.href = "/";
                  }}
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
