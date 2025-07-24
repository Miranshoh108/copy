import { create } from "zustand";
import axios from "axios";

const useAppStore = create((set) => ({
  categories: [],
  loading: true,
  error: null,
  language: "UZ", // Default: Uzbek

  // Fetch categories from API
  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/catalogs/all`);
      set({ categories: response.data.data, loading: false });
    } catch (err) {
      set({ error: "Kategoriyalarni yuklashda xato yuz berdi", loading: false });
    }
  },

  // Set language
  setLanguage: (lang) => set({ language: lang }),

  // Get category name based on selected language
  getCategoryName: (category) => {
    switch (useAppStore.getState().language) {
      case "UZ":
        return category.name_uzb;
      case "RU":
        return category.name_rus;
      case "ENG":
        return category.name_eng;
      default:
        return category.name_uzb;
    }
  },
}));

export default useAppStore;