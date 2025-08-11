"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  X,
  Menu,
  Search,
  Bell,
  Heart,
  ShoppingCart,
  Mail,
  Phone,
  Laptop,
  Home,
  Shirt,
  Dumbbell,
  HeartPulse,
  Music,
  Car,
  SprayCan,
  Hammer,
  Shovel,
  ShoppingBag,
  Baby,
  Utensils,
  Notebook,
  ShoppingBagIcon,
  User,
  MapPin,
  Download,
  HomeIcon,
  Loader2,
} from "lucide-react";
import { useCartStore } from "./hooks/cart";
import { useHomeLikes } from "./hooks/likes";
import { useAuth } from "./hooks/useAuth";
import CategoryList from "./CategoryList";
import NotificationModal from "./NotificationModal";
import { useNotificationsStore } from "../store/useNotificationsStore";
import $api from "../http/api";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedSubCat, setSelectedSubCat] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subCategoriesLoading, setSubCategoriesLoading] = useState(false);
  const [language, setLanguage] = useState("UZ");
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [open, setOpen] = useState(false);

  const { cart } = useCartStore();
  const { likes } = useHomeLikes();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await $api.get("/categories/get/all", {
          params: {
            page: 1,
            limit: 50,
            sort: "asc",
          },
        });
        console.log("Categories API response:", response.data);
        if (response.data.success) {
          setCategories(response.data.data);
          if (response.data.data.length > 0) {
            setSelectedCategory(response.data.data[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!selectedCategory?._id || !isOpen) return;

      try {
        setSubCategoriesLoading(true);
        const response = await $api.get(
          `/sub/types/get/by/category/${selectedCategory._id}`
        );

        console.log("Subcategories API response:", response.data);

        if (response.data.status === 200 && response.data.data) {
          // The API returns data directly in response.data.data array
          setSubCategories(response.data.data || []);
        } else {
          setSubCategories([]);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        setSubCategories([]);
      } finally {
        setSubCategoriesLoading(false);
      }
    };

    fetchSubCategories();
  }, [selectedCategory, isOpen]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.phoneNumber) {
      setIsAuthenticated(true);
    }
  }, []);

  const toggleGroup = (title) => {
    setExpandedGroup((prevTitle) => (prevTitle === title ? null : title));
  };

  // Handle body overflow
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  // Reset expanded groups when category changes
  useEffect(() => {
    setExpandedGroups({});
    setExpandedGroup(null);
  }, [selectedCategory]);

  // Toggle dropdown with animation
  const toggleDropdown = () => {
    if (isOpen) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsAnimating(false);
      }, 200);
    } else {
      setIsOpen(true);
    }
  };

  const inputRef = useRef(null);

  const handleIconClick = () => {
    inputRef.current?.focus();
  };

  const notifications = useNotificationsStore((state) => state.notifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleCategoryClick = (category) => {
    console.log("Category clicked:", category._id, category.name);
    setSelectedCategory(category);
    setSubCategories([]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        !event.target.closest(".catalog-dropdown") &&
        !event.target.closest(".catalog-btn")
      ) {
        toggleDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Get category name based on language
  const getCategoryName = (category) => {
    if (!category) return "";

    switch (language) {
      case "RU":
        return category.nameRu || category.name_ru || category.name;
      case "ENG":
        return category.nameEn || category.name_en || category.name;
      default:
        return category.name;
    }
  };

  // Get category image URL - add your base URL here
  const getCategoryImageUrl = (category) => {
    if (!category || !category.category_img) return null;

    // Assuming your backend base URL - adjust this according to your setup
    const baseURL =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

    // If category_img already includes the full path, use it as is
    if (category.category_img.startsWith("http")) {
      return category.category_img;
    }

    // Otherwise, prepend the base URL
    return `${baseURL}${category.category_img}`;
  };

  return (
    <>
      <header className="sticky top-0 w-full mx-auto rounded-lg shadow-lg z-50 py-2 bg-white/95 backdrop-blur-sm max-[1260px]:px-4">
        <div className="flex mx-auto justify-between max-w-[1240px] gap-10">
          <a
            href="https://www.google.com/maps/place/Yunusabad"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:underline"
          >
            <MapPin className="text-[#1862D9]" /> Toshkent
          </a>

          <div className="flex gap-10">
            <a
              href="mailto:azikmelor7705@gmail.com"
              className="flex items-center gap-3 cursor-pointer max-[500px]:hidden text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Mail className="text-[#1862D9]" />
              <span>Aloqa uchun</span>
            </a>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border border-gray-200 rounded-lg px-2 py-1 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="UZ">UZ</option>
              <option value="RU">RU</option>
              <option value="ENG">ENG</option>
            </select>
          </div>
        </div>

        <div className="max-w-[1240px] w-full flex items-start justify-between pt-4 mx-auto">
          <button
            onClick={() => router.push("/")}
            className="cursor-pointer text-2xl leading-6 font-bold flex flex-col hover:opacity-80 transition-opacity"
          >
            <span className="text-gray-800">BOJXONA</span>
            <span className="text-[#249B73] text-xs text-center tracking-[16px]">
              SERVIS
            </span>
          </button>

          <div className="hidden max-[670px]:block">
            <button className="bg-gradient-to-r text-[12px] from-[#0D63F5] to-[#0D63F5] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md cursor-pointer transition-all duration-200 hover:shadow-lg transform hover:scale-105 font-semibold">
              <Download size={18} />
              YUKLAB OLISH
            </button>
          </div>

          {/* Catalog Button */}
          <div className="relative max-[670px]:hidden">
            <button
              onClick={toggleDropdown}
              disabled={loading}
              className={`catalog-btn bg-gradient-to-r from-[#0D63F5] to-[#0D63F5] w-[150px] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md cursor-pointer transition-all duration-200 hover:shadow-lg transform hover:scale-105 ${
                isOpen ? "bg-gradient-to-r from-[#0D63F5] to-[#0D63F5]" : ""
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : isOpen ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )}
              <span className="font-semibold">KATALOG</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative w-1/3 max-[670px]:hidden">
            <form onSubmit={handleSearch} className="relative w-full">
              <label htmlFor="search" className="sr-only">
                Mahsulotlarni izlash
              </label>
              <input
                id="search"
                ref={inputRef}
                type="text"
                placeholder="Mahsulotlarni izlash"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2 w-full outline-none transition-all bg-gray-50 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleIconClick}
                className="absolute inset-y-0 right-0 bg-[#0D63F5] cursor-pointer text-white px-4 rounded-r-lg transition-all hover:bg-[#0052d9]"
              >
                <Search size={20} />
              </button>
            </form>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setOpen(true)}
              className="relative flex flex-col items-center cursor-pointer group"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-[#ECF4FF] rounded-md group-hover:bg-[#dbeafe] transition-colors relative">
                <Bell size={20} className="text-[#1862D9]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-600 pt-1">Aloqa</span>
            </button>

            <NotificationModal open={open} setOpen={setOpen} />

            <button
              onClick={() => router.push("/wishes")}
              className="flex flex-col items-center cursor-pointer relative group"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-[#ECF4FF] rounded-md relative group-hover:bg-[#dbeafe] transition-colors">
                <Heart size={20} className="text-[#1862D9]" />
                {likes.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {likes.length}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-600 pt-1">Tanlanganlar</span>
            </button>

            <button
              onClick={() => router.push("/cart")}
              className="flex flex-col items-center cursor-pointer relative group"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-[#ECF4FF] rounded-md relative group-hover:bg-[#dbeafe] transition-colors">
                <ShoppingCart size={20} className="text-[#1862D9]" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {cart.length}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-600 pt-1">Savat</span>
            </button>

            {isAuthenticated ? (
              <Link href="/profile">
                <button className="flex flex-col items-center cursor-pointer group">
                  <div className="w-10 h-10 flex items-center justify-center bg-[#ECF4FF] rounded-md group-hover:bg-[#dbeafe] transition-colors">
                    <User className="w-6 h-6 text-[#1862D9]" />
                  </div>
                  <span className="text-xs text-gray-600 pt-1">Profil</span>
                </button>
              </Link>
            ) : (
              <Link className="self-start" href="/register">
                <button className="px-8 py-3 text-black rounded-md cursor-pointer bg-gradient-to-r from-[#EED3DC] to-[#CDD6FD] hover:from-[#e6c7d3] hover:to-[#c4cefb] transition-all duration-200 transform hover:scale-105">
                  KIRISH
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="relative w-full mt-4 hidden max-[670px]:block max-w-[1240px] mx-auto">
          <form onSubmit={handleSearch} className="relative w-full">
            <label htmlFor="mobile-search" className="sr-only">
              Mahsulotlarni izlash
            </label>
            <input
              id="mobile-search"
              type="text"
              placeholder="Mahsulotlarni izlash"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2 w-full outline-none transition-all bg-gray-50 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={handleIconClick}
              className="absolute inset-y-0 right-0 bg-[#0D63F5] cursor-pointer text-white px-4 rounded-r-lg transition-all hover:bg-[#0052d9]"
            >
              <Search size={20} />
            </button>
          </form>
        </div>

        {!isOpen && <CategoryList onMoreClick={toggleDropdown} />}
      </header>

      {/* Category Dropdown */}
      <div
        className={`catalog-dropdown fixed top-[120px] left-0 right-0 z-40 transition-all duration-300 ${
          isOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-4"
        } ${isAnimating ? "pointer-events-none" : ""}`}
      >
        <div className="bg-white max-w-full h-auto">
          <div className="max-w-[1250px] mx-auto border border-gray-100 overflow-hidden">
            <div className="flex h-[85vh]">
              <div className="w-[280px] bg-gradient-to-b from-gray-50 to-white border-r border-gray-100">
                <div className="py-4 px-2 space-y-1 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
                    </div>
                  ) : categories.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      Kategoriyalar topilmadi
                    </div>
                  ) : (
                    categories.map((category, index) => {
                      const isSelected = selectedCategory?._id === category._id;
                      const imageUrl = getCategoryImageUrl(category);

                      return (
                        <div
                          key={category._id || index}
                          onClick={() => handleCategoryClick(category)}
                          className={`py-3 px-4 rounded-lg cursor-pointer transition-all duration-200 text-sm font-medium relative group ${
                            isSelected
                              ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm border-l-4 border-blue-500"
                              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt={getCategoryName(category)}
                                  className="w-4 h-4 mr-2 object-contain"
                                  onError={(e) => {
                                    // Fallback to a default icon if image fails to load
                                    e.target.style.display = "none";
                                    e.target.nextElementSibling.style.display =
                                      "inline-block";
                                  }}
                                />
                              ) : null}
                              {/* Fallback icon - only show if image fails or doesn't exist */}
                              <ShoppingBagIcon
                                className="w-4 h-4 mr-2"
                                style={{
                                  display: imageUrl ? "none" : "inline-block",
                                }}
                              />
                              <span className="truncate">
                                {getCategoryName(category)}
                              </span>
                            </div>
                            <svg
                              className={`w-4 h-4 transition-transform duration-200 ${
                                isSelected ? "text-blue-500" : "text-gray-400"
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto max-h-full p-6 bg-white">
                <h2 className="text-2xl font-bold text-[#1e7d5d] mb-6">
                  {selectedCategory
                    ? getCategoryName(selectedCategory)
                    : "Kategoriya tanlang"}
                </h2>

                {subCategoriesLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
                  </div>
                ) : subCategories.length === 0 ? (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    {selectedCategory
                      ? "Bu kategoriyada hozircha mahsulotlar yo'q"
                      : "Kategoriya tanlang"}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {subCategories.map((subCategory, idx) => {
                      const getSubCategoryName = (subCat) => {
                        switch (language) {
                          case "RU":
                            return subCat.name_ru || subCat.name;
                          case "ENG":
                            return subCat.name_en || subCat.name;
                          default:
                            return subCat.name;
                        }
                      };

                      return (
                        <div
                          key={subCategory._id || idx}
                          className="p-4 bg-white rounded-xl  hover:border-blue-400 
             hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
                        >
                          <a
                            href={`/category/${selectedCategory._id}/subcategory/${subCategory._id}`}
                            className="block"
                          >
                            <h3
                              className="font-semibold text-gray-800 group-hover:text-blue-600 
                   transition-colors duration-300 leading-relaxed"
                            >
                              {getSubCategoryName(subCategory)}
                            </h3>
                          </a>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full z-50 bg-white border-t border-gray-200 px-4 py-2 flex justify-between items-center md:hidden">
        <button
          onClick={() => router.push("/")}
          className="flex flex-col items-center text-gray-600"
        >
          <HomeIcon size={20} className="text-[#1862D9]" />
          <span className="text-xs">Bosh sahifa</span>
        </button>
        <button
          onClick={() => setOpen(true)}
          className="flex flex-col items-center text-gray-600"
        >
          <Bell size={20} className="text-[#1862D9]" />
          <span className="text-xs">Aloqa</span>
        </button>
        <button
          onClick={() => router.push("/wishes")}
          className="flex flex-col items-center text-gray-600"
        >
          <Heart size={20} className="text-[#1862D9]" />
          <span className="text-xs">Tanlangan</span>
        </button>
        <button
          onClick={() => router.push("/cart")}
          className="flex flex-col items-center text-gray-600"
        >
          <ShoppingCart size={20} className="text-[#1862D9]" />
          <span className="text-xs">Savat</span>
        </button>
        {isAuthenticated ? (
          <button
            onClick={() => router.push("/profile")}
            className="flex flex-col items-center text-gray-600"
          >
            <User size={20} className="text-[#1862D9]" />
            <span className="text-xs">Profil</span>
          </button>
        ) : (
          <button
            onClick={() => router.push("/register")}
            className="flex flex-col items-center text-gray-600"
          >
            <User size={20} className="text-[#1862D9]" />
            <span className="text-xs">Kirish</span>
          </button>
        )}
      </div>
      <div className="w-full h-[1px] bg-gray-300"></div>
    </>
  );
}
