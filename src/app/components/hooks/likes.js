import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

export const useHomeLikes = create(
  persist(
    (set, get) => ({
      likes: [],

      toggleLike: (product) => {
        const { likes } = get();
        const exists = likes.find((item) => item.id === product.id);
        if (exists) {
          set({ likes: likes.filter((item) => item.id !== product.id) });
        } else {
          set({ likes: [...likes, product] });
        }
      },

      removeLike: (productId) => {
        set({ likes: get().likes.filter((item) => item.id !== productId) });
      },

      clearLikes: () => {
        set({ likes: [] });
      },

      isLiked: (productId) => {
        return get().likes.some((item) => item.id === productId);
      },

      getLikesCount: () => {
        return get().likes.length;
      },

      syncLikesWithBackend: async (token) => {
        const { likes, clearLikes } = get();
        if (!token || likes.length === 0) return;

        try {
          await axios.post(
            "https://your-api.com/api/liked-products", // <-- API URL
            { products: likes },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          clearLikes();
          console.log("Like’lar backendga yuborildi.");
        } catch (error) {
          console.error("Like’larni yuborishda xatolik:", error);
        }
      },
    }),
    {
      name: "likes-storage",
      getStorage: () =>
        typeof window !== "undefined" ? localStorage : undefined,
    }
  )
);
