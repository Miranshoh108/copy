"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create the context
const AppContext = createContext();

// Create the provider component
export function AppProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState("UZ"); // Default: O'zbekcha

  // API dan kategoriyalarni olish
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/catalogs/all`);
        setCategories(response.data.data || response.data); // API javobi moslashuvi uchun
        setLoading(false);
        console.log(response);
      } catch (err) {
        setError("Kategoriyalarni yuklashda xato yuz berdi");
        setLoading(false);
        console.error("API Error:", err); // Xatolikni log qilish
      }
    }
    fetchCategories();
  }, []);

  // Tanlangan tilga qarab kategoriya nomini olish
  const getCategoryName = (category) => {
    if (!category) return "No Name"; // Agar category undefined bo'lsa
    switch (language) {
      case "UZ":
        return category.name_uzb || "No Name";
      case "RU":
        return category.name_rus || "No Name";
      case "ENG":
        return category.name_eng || "No Name";
      default:
        return category.name_uzb || "No Name";
    }
  };

  return (
    <AppContext.Provider
      value={{
        categories,
        loading,
        error,
        language,
        setLanguage,
        getCategoryName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Custom hook (maxsus hook) ni eksport qilish
export function useAppContext() {
  const context = useContext(AppContext);
  
  return context;
}