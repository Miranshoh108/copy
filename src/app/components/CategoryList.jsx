"use client";

import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";

export default function CategoryList({ onMoreClick }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("UZ");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://gw.texnomart.uz/api/web/v1/category/catalog"
        );
        setCategories(res.data.data.categories || []);
      } catch (err) {
        console.error("Kategoriya olishda xatolik:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getCategoryName = (category) => {
    if (!category) return "No Name";
    switch (language) {
      case "UZ":
        return category.name || category.name_uzb || "No Name";
      case "RU":
        return category.name_rus || "No Name";
      case "ENG":
        return category.name_eng || "No Name";
      default:
        return category.name || "No Name";
    }
  };

  const previewCategories = categories.slice(0, 7);
  console.log("Category list:", previewCategories);

  return (
    <div className="max-w-[1240px] w-full flex items-start justify-between pt-4 mx-auto">
      <div className="bg-white py-2 px-4 flex gap-10 items-center overflow-x-auto no-scrollbar max-[1100px]:hidden">
        {loading ? (
          <p>Yuklanmoqda...</p>
        ) : (
          <>
            {previewCategories.map((cat) => (
              <div
                key={cat.slug} // ✅ id yo'q, lekin slug bor
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
