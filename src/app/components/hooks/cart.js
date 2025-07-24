"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      // Add item to cart
      addCart: (product) => {
        const { cart } = get();
        const existingItem = cart.find((item) => item.id === product.id);

        if (existingItem) {
          // If item exists, increase quantity
          set({
            cart: cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          // If new item, add to cart
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

      // Remove item from cart
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
      // Update item quantity
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

      // Toggle item checked state
      toggleChecked: (productId) => {
        set({
          cart: get().cart.map((item) =>
            item.id === productId ? { ...item, checked: !item.checked } : item
          ),
        });
      },

      // Check all items
      onChecked: () => {
        set({
          cart: get().cart.map((item) => ({ ...item, checked: true })),
        });
      },

      // Uncheck all items
      offChecked: () => {
        set({
          cart: get().cart.map((item) => ({ ...item, checked: false })),
        });
      },

      // Clear entire cart
      clearCart: () => {
        set({ cart: [] });
      },

      // Get total price of checked items
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

      // Get checked items count
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
