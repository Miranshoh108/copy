"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      addCart: (product, variantId = null) => {
        const { cart } = get();

        const itemKey = variantId ? `${product.id}_${variantId}` : product.id;
        const existingItem = cart.find((item) => {
          if (variantId) {
            return (
              item.productId === product.id && item.variantId === variantId
            );
          }
          return item.productId === product.id && !item.variantId;
        });

        if (existingItem) {
          set({
            cart: cart.map((item) =>
              (
                variantId
                  ? item.productId === product.id &&
                    item.variantId === variantId
                  : item.productId === product.id && !item.variantId
              )
                ? { ...item, quantity: item.quantity + (product.quantity || 1) }
                : item
            ),
          });
        } else {
          const newCartItem = {
            productId: product.id,
            variantId: variantId || product.selectedVariant || null,
            quantity: product.quantity || 1,
            price:
              product.sale_price || product.discountedPrice || product.price,

            id: product.id,
            name: product.name,
            name_ru: product.name_ru,
            name_en: product.name_en,
            image: product.image,
            original_price:
              product.original_price ||
              (product.discountedPrice ? product.price : null),
            sale_price:
              product.sale_price || product.discountedPrice || product.price,
            checked: false,
            variant: product.variant || null,

            _id: `local_${Date.now()}_${Math.random()}`,
          };

          set({
            cart: [...cart, newCartItem],
          });
        }
      },

      updateCartFromAPI: (apiCart) => {
        if (apiCart && apiCart.products) {
          const cartItems = apiCart.products.map((item) => ({
            ...item,
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
            _id: item._id,

            id: item.productId,
            checked: false,
          }));

          set({ cart: cartItems });
        }
      },

      syncWithAPI: (apiCart) => {
        const { cart: localCart } = get();

        if (!apiCart || !apiCart.products) return;

        const syncedCart = apiCart.products.map((apiItem) => {
          const localItem = localCart.find(
            (local) =>
              local.productId === apiItem.productId &&
              local.variantId === apiItem.variantId
          );

          return {
            ...apiItem,
            id: apiItem.productId,
            checked: localItem?.checked || false,

            name: localItem?.name,
            name_ru: localItem?.name_ru,
            name_en: localItem?.name_en,
            image: localItem?.image,
            sale_price: apiItem.price,
            variant: localItem?.variant,
          };
        });

        set({ cart: syncedCart });
      },

      removeCart: (productId, variantId = null) => {
        set({
          cart: get().cart.filter((item) => {
            if (variantId) {
              return !(
                item.productId === productId && item.variantId === variantId
              );
            }
            return !(item.productId === productId && !item.variantId);
          }),
        });
      },

      clearCart: () => set({ cart: [] }),

      clearCheckedItems: () =>
        set((state) => ({
          cart: state.cart.filter((item) => !item.checked),
        })),

      updateQuantity: (productId, quantity, variantId = null) => {
        if (quantity <= 0) {
          get().removeCart(productId, variantId);
          return;
        }

        set({
          cart: get().cart.map((item) => {
            const isMatch = variantId
              ? item.productId === productId && item.variantId === variantId
              : item.productId === productId && !item.variantId;

            return isMatch ? { ...item, quantity } : item;
          }),
        });
      },

      toggleChecked: (productId, variantId = null) => {
        set({
          cart: get().cart.map((item) => {
            const isMatch = variantId
              ? item.productId === productId && item.variantId === variantId
              : item.productId === productId && !item.variantId;

            return isMatch ? { ...item, checked: !item.checked } : item;
          }),
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

      // To'g'rilangan getTotalPrice funksiyasi
      getTotalPrice: () => {
        return get()
          .cart.filter((item) => item.checked)
          .reduce((total, item) => {
            let price = 0;

            // Variant mavjud bo'lsa, variant narxini ol
            if (item.variant) {
              price = parseFloat(
                (item.variant.discountedPrice || item.variant.price)
                  ?.toString()
                  .replace(/[^\d.-]/g, "") || 0
              );
            } else {
              // Variant yo'q bo'lsa, oddiy narxni ol
              price = parseFloat(
                (item.price || item.sale_price)
                  ?.toString()
                  .replace(/[^\d.-]/g, "") || 0
              );
            }

            return total + price * item.quantity;
          }, 0);
      },

      getCheckedItems: () => get().cart.filter((item) => item.checked),

      getCheckedCount: () => {
        return get().cart.filter((item) => item.checked).length;
      },

      // To'g'rilangan getCartForAPI funksiyasi
      getCartForAPI: () => {
        const { cart } = get();
        return {
          products: cart.map((item) => {
            let price = item.price || item.sale_price;

            // Variant mavjud bo'lsa, variant narxini yuborish
            if (item.variant) {
              price = item.variant.discountedPrice || item.variant.price;
            }

            return {
              productId: item.productId || item.id,
              variantId: item.variantId || null,
              quantity: item.quantity,
              price: price,
            };
          }),
        };
      },

      findCartItem: (productId, variantId = null) => {
        const { cart } = get();
        return cart.find((item) => {
          if (variantId) {
            return item.productId === productId && item.variantId === variantId;
          }
          return item.productId === productId && !item.variantId;
        });
      },

      getProductTotalQuantity: (productId) => {
        const { cart } = get();
        return cart
          .filter((item) => item.productId === productId)
          .reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
      getStorage: () =>
        typeof window !== "undefined" ? localStorage : undefined,
    }
  )
);
