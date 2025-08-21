"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  Menu,
  Search,
  Bell,
  Heart,
  ShoppingCart,
  Mail,
  ShoppingBagIcon,
  User,
  MapPin,
  Download,
  HomeIcon,
  Loader2,
} from "lucide-react";
import { useCartStore } from "./hooks/cart";
import { useHomeLikes } from "./hooks/likes";
import CategoryList from "./CategoryList";
import NotificationModal from "./NotificationModal";
import { useNotificationsStore } from "../store/useNotificationsStore";
import $api from "../http/api";
import { useTranslation } from "react-i18next";
import i18next from "../../i18n/i18n";
export default function Navbar() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
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

  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchSuggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const searchInputRef = useRef(null);
  const searchDropdownRef = useRef(null);

  const handleLanguageChange = (lang) => {
    const languageMap = {
      UZ: "uz",
      RU: "ru",
      ENG: "en",
    };
    i18next.changeLanguage(languageMap[lang]);
    localStorage.setItem("language", languageMap[lang]);
  };

  const [popularSearches] = useState([
    t("navbar.popular_searches_items.phone", "Telefon"),
    t("navbar.popular_searches_items.computer", "Kompyuter"),
    t("navbar.popular_searches_items.clothing", "Kiyim"),
    t("navbar.popular_searches_items.shoes", "Poyafzal"),
    t("navbar.popular_searches_items.book", "Kitob"),
    t("navbar.popular_searches_items.cosmetics", "Kosmetika"),
    t("navbar.popular_searches_items.appliances", "Maishiy texnika"),
    t("navbar.popular_searches_items.sport", "Sport tovarlari"),
  ]);

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }
  }, []);

  const fetchSearchSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const searchParams = {
        name: query,
        q: query,
        limit: 10,
      };

      const res = await $api.get("/products/get/query", {
        params: searchParams,
      });

      console.log("Search API Response:", res.data);

      // Handle different response structures
      let products = [];

      if (res.data && res.data.results && Array.isArray(res.data.results)) {
        // If response has results array (like in your JSON structure)
        products = res.data.results;
      } else if (res.data && Array.isArray(res.data)) {
        // If response is directly an array
        products = res.data;
      } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
        // If response has data property with array
        products = res.data.data;
      }

      // Filter and format products for suggestions
      const suggestions = products.map((product) => ({
        _id: product._id,
        name: getProductName(product), // Get localized name
        shortDescription: getProductDescription(product),
        mainImage: product.mainImage,
        price:
          product.variants && product.variants[0]
            ? product.variants[0].price
            : null,
      }));

      setSuggestions(suggestions);
    } catch (err) {
      console.error("Search API error:", err);
      setSuggestions([]);
    }
  };

  const getProductName = (product) => {
    switch (i18next.language) {
      case "ru":
        return product.name_ru || product.name;
      case "en":
        return product.name_en || product.name;
      default:
        return product.name;
    }
  };

  const getProductDescription = (product) => {
    switch (i18next.language) {
      case "ru":
        return product.shortDescription_ru || product.shortDescription;
      case "en":
        return product.shortDescription_en || product.shortDescription;
      default:
        return product.shortDescription;
    }
  };

  const SearchResults = ({ suggestions, onSelect, searchQuery }) => {
    const { t } = useTranslation();

    if (!suggestions.length) {
      return (
        <div className="p-4 text-center text-gray-500">
          <Search size={24} className="mx-auto mb-2 text-gray-300" />
          <p className="text-sm">
            {searchQuery ? t("navbar.no_results") : t("navbar.start_typing")}
          </p>
        </div>
      );
    }

    return (
      <div className="max-h-80 overflow-y-auto">
        {suggestions.map((product) => (
          <button
            key={product._id}
            onClick={() => onSelect(product.name)}
            className="w-full text-left px-3 py-3 hover:bg-gray-50 rounded-md flex items-center gap-3 transition-colors border-b border-gray-50 last:border-b-0"
          >
            {product.mainImage && (
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/${product.mainImage}`}
                alt={product.name}
                className="w-10 h-10 object-cover rounded-md"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {product.name}
              </p>
              {product.shortDescription && (
                <p className="text-xs text-gray-500 truncate">
                  {product.shortDescription}
                </p>
              )}
            </div>
            {product.price && (
              <div className="text-sm font-medium text-green-600">
                {product.price.toLocaleString()} so'm
              </div>
            )}
          </button>
        ))}
      </div>
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSearchSuggestions(searchQuery);
    });

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target) &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (query) => {
    const searchTerm = query || searchQuery;
    if (searchTerm.trim()) {
      const updated = [
        searchTerm,
        ...recentSearches.filter((s) => s !== searchTerm),
      ].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("recentSearches", JSON.stringify(updated));

      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchQuery("");
      setShowSearchDropdown(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    handleSearchSubmit();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

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
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        if (
          parsedUser &&
          (parsedUser.phoneNumber || parsedUser.id || parsedUser._id)
        ) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("User data parsing error:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "unset";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    setExpandedGroups({});
    setExpandedGroup(null);
  }, [selectedCategory]);

  const toggleDropdown = () => {
    if (isOpen) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsAnimating(false);
      });
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

  const getCategoryName = (category) => {
    if (!category) return "";

    switch (i18next.language) {
      case "ru":
        return category.name_ru || category.name;
      case "en":
        return category.name_en || category.name;
      default:
        return category.name;
    }
  };

  const getCategoryImageUrl = (category) => {
    if (!category || !category.category_img) return null;

    const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    if (category.category_img.startsWith("http")) {
      return category.category_img;
    }

    const imagePath = category.category_img.startsWith("/")
      ? category.category_img
      : `/${category.category_img}`;

    return `${baseURL}${imagePath}`;
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
            <MapPin className="text-[#249B73]" />{" "}
            <>{mounted ? t("navbar.location") : null}</>
          </a>

          <div className="flex gap-10">
            <a
              href="mailto:it.ideal.forest@gmail.com"
              className="flex items-center gap-3 cursor-pointer max-[500px]:hidden text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Mail className="text-[#249B73]" />
              <span>{mounted ? t("navbar.contact") : null}</span>
            </a>
            <select
              value={
                i18next.language === "uz"
                  ? "UZ"
                  : i18next.language === "ru"
                  ? "RU"
                  : "ENG"
              }
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="border border-gray-200 rounded-lg cursor-pointer px-2 py-1 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
            <button className="bg-gradient-to-r text-[12px] from-[#249B73] to-[#249B73] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md cursor-pointer transition-all duration-200 hover:shadow-lg transform hover:scale-105 font-semibold">
              <Download size={18} />
              {mounted ? t("navbar.download") : null}
            </button>
          </div>

          <div className="relative max-[670px]:hidden">
            <button
              onClick={toggleDropdown}
              disabled={loading}
              className={`catalog-btn bg-gradient-to-r from-[#249B73] to-[#249B73] w-[150px] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md cursor-pointer transition-all duration-200 hover:shadow-lg transform hover:scale-105 ${
                isOpen ? "bg-gradient-to-r from-[#249B73] to-[#249B73]" : ""
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : isOpen ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )}
              <span className="font-semibold">
                {mounted ? t("navbar.catalog") : null}
              </span>
            </button>
          </div>

          <div className="relative w-1/3 max-[670px]:hidden">
            <form onSubmit={handleSearch} className="relative w-full">
              <label htmlFor="search" className="sr-only">
                Mahsulotlarni izlash
              </label>
              <input
                id="search"
                ref={searchInputRef}
                type="text"
                placeholder={mounted ? t("navbar.search_placeholder") : null}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchDropdown(true)}
                className="border border-gray-200 rounded-lg px-4 py-3 w-full outline-none transition-all bg-white pr-12 focus:ring-2 focus:ring-[#249B73] focus:border-[#249B73] shadow-sm"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 bg-[#249B73] hover:bg-[#249B73] cursor-pointer text-white px-4 rounded-r-lg transition-all duration-200"
              >
                <Search size={20} />
              </button>
            </form>

            {showSearchDropdown && (
              <div
                ref={searchDropdownRef}
                className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto"
              >
                {searchQuery && searchSuggestions.length > 0 && (
                  <div className="p-2">
                    <div className="text-xs font-medium text-gray-500 px-3 py-2 uppercase tracking-wide">
                      {mounted ? t("navbar.search_results") : null}
                    </div>
                    {searchSuggestions.map((product) => (
                      <button
                        key={product._id}
                        onClick={() => handleSearchSubmit(product.name)}
                        className="w-full cursor-pointer text-left px-3 py-2 hover:bg-gray-50 rounded-md flex items-center gap-3 transition-colors"
                      >
                        <Search size={16} className="text-gray-400" />
                        <span className="text-gray-700">{product.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                {!searchQuery && recentSearches.length > 0 && (
                  <div className="p-2 border-b border-gray-100">
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Oxirgi qidiruvlar
                      </span>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-green-600 hover:text-green-700 cursor-pointer font-medium"
                      >
                        {mounted ? t("navbar.clear_searches") : null}
                      </button>
                    </div>
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearchSubmit(search)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md flex items-center gap-3 transition-colors"
                      >
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-gray-700">{search}</span>
                      </button>
                    ))}
                  </div>
                )}

                {!searchQuery && (
                  <div className="p-2">
                    <div className="text-xs font-medium text-gray-500 px-3 py-2 uppercase tracking-wide">
                      {mounted ? t("navbar.recent_searches") : null}
                    </div>
                    {popularSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearchSubmit(search)}
                        className="w-full text-left px-3 py-2 cursor-pointer hover:bg-gray-50 rounded-md flex items-center gap-3 transition-colors"
                      >
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                        <span className="text-gray-700">{search}</span>
                      </button>
                    ))}
                  </div>
                )}

                {searchQuery && searchSuggestions.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    <Search size={24} className="mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">
                      {mounted ? t("navbar.no_results") : null}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setOpen(true)}
              className="relative flex flex-col items-center cursor-pointer group"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-[#ECF4FF] rounded-md group-hover:bg-[#dbeafe] transition-colors relative">
                <Bell size={20} className="text-[#249B73]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-600 pt-1">
                {mounted ? t("navbar.notifications") : null}
              </span>
            </button>

            <NotificationModal open={open} setOpen={setOpen} />

            <button
              onClick={() => router.push("/wishes")}
              className="flex flex-col items-center cursor-pointer relative group"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-[#ECF4FF] rounded-md relative group-hover:bg-[#dbeafe] transition-colors">
                <Heart size={20} className="text-[#249B73]" />
                {likes.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {likes.length}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-600 pt-1">
                {mounted ? t("navbar.wishlist") : null}
              </span>
            </button>

            <button
              onClick={() => router.push("/cart")}
              className="flex flex-col items-center cursor-pointer relative group"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-[#ECF4FF] rounded-md relative group-hover:bg-[#dbeafe] transition-colors">
                <ShoppingCart size={20} className="text-[#249B73]" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {cart.length}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-600 pt-1">
                {mounted ? t("navbar.cart") : null}
              </span>
            </button>

            {isAuthenticated ? (
              <Link href="/profile">
                <button className="flex flex-col items-center cursor-pointer group">
                  <div className="w-10 h-10 flex items-center justify-center bg-[#ECF4FF] rounded-md group-hover:bg-[#dbeafe] transition-colors">
                    <User className="w-6 h-6 text-[#249B73]" />
                  </div>
                  <span className="text-xs text-gray-600 pt-1">
                    {mounted ? t("navbar.profile") : null}
                  </span>
                </button>
              </Link>
            ) : (
              <Link className="self-start" href="/register">
                <button className="px-8 py-3 text-white rounded-md cursor-pointer bg-[#249B73] from-[#EED3DC] to-[#CDD6FD] hover:from-[#e6c7d3] hover:to-[#c4cefb] transition-all duration-200 transform hover:scale-105">
                  {mounted ? t("navbar.login") : null}
                </button>
              </Link>
            )}
          </div>
        </div>

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
              className="border border-gray-200 rounded-lg px-4 py-2 w-full outline-none transition-all bg-gray-50 pr-12 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={handleIconClick}
              className="absolute inset-y-0 right-0 bg-[#249B73] cursor-pointer text-white px-4 rounded-r-lg transition-all hover:bg-[#249B73]"
            >
              <Search size={20} />
            </button>
          </form>
        </div>

        {!isOpen && <CategoryList onMoreClick={toggleDropdown} />}
      </header>

      <div
        className={`catalog-dropdown fixed top-[120px] left-0 right-0 z-40 transition-all duration-300 ${
          isOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-4"
        } ${isAnimating ? "pointer-events-none" : ""}`}
      >
        <div className="bg-white max-w-full h-auto">
          <div className="max-w-[1250px] mx-auto border border-gray-100 overflow-hidden">
            <div className="flex h-[88vh]">
              <div className="w-[280px] bg-gradient-to-b from-gray-50 to-white border-r border-gray-100">
                <div className="py-4 px-2 space-y-1 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="animate-spin w-8 h-8 text-green-500" />
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
                              ? "bg-gradient-to-r from-green-50 to-green-100 text-green-700 shadow-sm border-l-4 border-green-500"
                              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt={getCategoryName(category)}
                                  className="w-6 h-6 mr-2 object-contain"
                                  onError={(e) => {
                                    console.error(
                                      "Image load error for category:",
                                      category.name,
                                      imageUrl
                                    );
                                    e.target.style.display = "none";
                                    const iconElement =
                                      e.target.parentElement.querySelector(
                                        ".fallback-icon"
                                      );
                                    if (iconElement) {
                                      iconElement.style.display =
                                        "inline-block";
                                    }
                                  }}
                                />
                              ) : null}
                              <ShoppingBagIcon
                                className="w-4 h-4 mr-2 fallback-icon"
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
                                isSelected ? "text-green-500" : "text-gray-400"
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
                    : mounted
                    ? t("navbar.select_category")
                    : null}
                </h2>

                {subCategoriesLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="animate-spin w-8 h-8 text-green-500" />
                  </div>
                ) : subCategories.length === 0 ? (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    {selectedCategory
                      ? mounted
                        ? t("navbar.no_subcategories")
                        : t("navbar.select_category")
                      : null}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {subCategories.map((subCategory, idx) => {
                      const getSubCategoryName = (subCat) => {
                        switch (i18next.language) {
                          case "ru":
                            return subCat.name_ru || subCat.name;
                          case "en":
                            return subCat.name_en || subCat.name;
                          default:
                            return subCat.name;
                        }
                      };

                      return (
                        <div
                          key={subCategory._id || idx}
                          className="p-4 bg-white rounded-xl hover:border-green-400 transition-all duration-300 cursor-pointer group"
                        >
                          <a
                            href={`/category/${selectedCategory._id}/subcategory/${subCategory._id}`}
                            className="block"
                          >
                            <h3 className="font-medium text-gray-800 group-hover:text-green-600 transition-colors duration-300 leading-relaxed">
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
          <HomeIcon size={20} className="text-[#249B73]" />
          <span className="text-xs">{mounted ? t("navbar.home") : null}</span>
        </button>
        <button
          onClick={() => setOpen(true)}
          className="flex flex-col items-center text-gray-600"
        >
          <Bell size={20} className="text-[#249B73]" />
          <span className="text-xs">
            {mounted ? t("navbar.notifications") : null}
          </span>
        </button>
        <button
          onClick={() => router.push("/wishes")}
          className="flex flex-col items-center text-gray-600"
        >
          <Heart size={20} className="text-[#249B73]" />
          <span className="text-xs">
            {mounted ? t("navbar.wishlist") : null}
          </span>
        </button>
        <button
          onClick={() => router.push("/cart")}
          className="flex flex-col items-center text-gray-600"
        >
          <ShoppingCart size={20} className="text-[#249B73]" />
          <span className="text-xs">{mounted ? t("navbar.cart") : null}</span>
        </button>
        {isAuthenticated ? (
          <button
            onClick={() => router.push("/profile")}
            className="flex flex-col items-center text-gray-600"
          >
            <User size={20} className="text-[#249B73]" />
            <span className="text-xs">
              {mounted ? t("navbar.profile") : null}
            </span>
          </button>
        ) : (
          <button
            onClick={() => router.push("/register")}
            className="flex flex-col items-center text-gray-600"
          >
            <User size={20} className="text-[#249B73]" />
            <span className="text-xs">
              {mounted ? t("navbar.login") : null}
            </span>
          </button>
        )}
      </div>
      <div className="w-full h-[1px] bg-gray-300"></div>
    </>
  );
}
