"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import $api from "../http/api";

export default function CategoryList({ onMoreClick }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("UZ");

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

  const getCategoryName = (category) => {
    if (!category) return "";

    switch (language) {
      case "RU":
        return category.nameRu || category.name;
      case "ENG":
        return category.nameEn || category.name;
      default:
        return category.name;
    }
  };

  const previewCategories = categories.slice(0, 9);

  return (
    <div className="max-w-[1240px] w-full flex items-start justify-between pt-4 mx-auto">
      <div className="bg-white py-2 px-4 flex gap-10 items-center overflow-x-auto no-scrollbar max-[1100px]:hidden">
        {loading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="animate-spin w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-600">Yuklanmoqda...</span>
          </div>
        ) : categories.length === 0 ? (
          <p className="text-sm text-gray-500">Kategoriyalar topilmadi</p>
        ) : (
          <>
            {previewCategories.map((cat, index) => (
              <div
                key={cat._id || index}
                className="group flex flex-col items-center justify-center min-w-[80px] cursor-pointer hover:scale-105 transition-transform duration-200"
              >
                <span className="text-sm text-center whitespace-nowrap text-gray-700 group-hover:text-[#0D63F5] transition-colors duration-200">
                  {getCategoryName(cat)}
                </span>
              </div>
            ))}

            <button
              onClick={onMoreClick}
              className="text-[#0D63F5] font-semibold hover:underline whitespace-nowrap cursor-pointer"
            >
              Yana →
            </button>
          </>
        )}
      </div>
    </div>
  );
}
