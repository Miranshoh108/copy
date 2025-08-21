"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      addCart: (product) => {
        const { cart } = get();
        const existingItem = cart.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            cart: cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            cart: [
              ...cart,
              {
                ...product,
                quantity: 1,
                checked: false,
              },
            ],
          });
        }
      },

      removeCart: (productId) => {
        set({
          cart: get().cart.filter((item) => item.id !== productId),
        });
      },
      clearCart: () => set({ cart: [] }),
      clearCheckedItems: () =>
        set((state) => ({
          cart: state.cart.filter((item) => !item.checked),
        })),
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeCart(productId);
          return;
        }

        set({
          cart: get().cart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        });
      },

      toggleChecked: (productId) => {
        set({
          cart: get().cart.map((item) =>
            item.id === productId ? { ...item, checked: !item.checked } : item
          ),
        });
      },

      onChecked: () => {
        set({
          cart: get().cart.map((item) => ({ ...item, checked: true })),
        });
      },

      offChecked: () => {
        set({
          cart: get().cart.map((item) => ({ ...item, checked: false })),
        });
      },

      clearCart: () => {
        set({ cart: [] });
      },

      getTotalPrice: () => {
        return get()
          .cart.filter((item) => item.checked)
          .reduce((total, item) => {
            const price = parseFloat(
              item.sale_price?.toString().replace(/[^\d.-]/g, "") || 0
            );
            return total + price * item.quantity;
          }, 0);
      },
      getCheckedItems: () => get().cart.filter((item) => item.checked),

      getCheckedCount: () => {
        return get().cart.filter((item) => item.checked).length;
      },
    }),
    {
      name: "cart-storage",
      getStorage: () =>
        typeof window !== "undefined" ? localStorage : undefined,
    }
  )
);
