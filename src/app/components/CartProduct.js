"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useCartStore } from "./hooks/cart";
import { useTranslation } from "react-i18next";
import i18next from "@/i18n/i18n";

export default function CartProduct({ product }) {
  const { t } = useTranslation();
  const { toggleChecked, updateQuantity, removeCart } = useCartStore();
  const [isRemoving, setIsRemoving] = useState(false);

  const itemId = product.variant?._id || product.id;
  const productId = product.productId || product.id;
  const variantId = product.variantId || product.variant?._id || null;

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      handleRemove();
    } else {
      updateQuantity(productId, newQuantity, variantId);
    }
  };

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      removeCart(productId, variantId);
    });
  };

  const formatPrice = (price) => {
    if (!price) return "0";
    const numericPrice = parseFloat(price.toString().replace(/[^\d.-]/g, ""));
    return numericPrice.toLocaleString();
  };

  const incrementQuantity = () => {
    handleQuantityChange(product.quantity + 1);
  };

  const decrementQuantity = () => {
    if (product.quantity > 1) {
      handleQuantityChange(product.quantity - 1);
    } else {
      handleRemove();
    }
  };

  const handleToggleChecked = () => {
    toggleChecked(productId, variantId);
  };

  // Get localized name based on current language
  const getLocalizedName = () => {
    switch (i18next.language) {
      case "ru":
        return product.name_ru || product.name;
      case "en":
        return product.name_en || product.name;
      default:
        return product.name;
    }
  };

  const getVariantData = () => {
    if (product.variant) {
      return {
        price: product.variant.discountedPrice || product.variant.price,
        originalPrice: product.variant.price,
        image: product.variant.mainImg
          ? `https://bsmarket.uz/api/${product.variant.mainImg}`
          : product.image,
        color: product.variant.color,
        unit: product.variant.unit,
        stockQuantity: product.variant.stockQuantity,
      };
    }
    return {
      price: product.sale_price || product.price,
      originalPrice: product.original_price,
      image: product.image,
      color: null,
      unit: null,
      stockQuantity: null,
    };
  };

  const variantData = getVariantData();

  return (
    <div className={`p-4 transition-all duration-200 `}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 mt-2">
          <input
            type="checkbox"
            checked={product.checked}
            onChange={handleToggleChecked}
            className="w-5 h-5 mt-5 max-[500px]:mt-0 text-[#249B73]  cursor-pointer border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
          />
        </div>

        <div className="flex-shrink-0">
          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={variantData.image || "/images/placeholder.jpg"}
              alt={getLocalizedName()}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
            {getLocalizedName()}
          </h3>

          {product.variant && (
            <div className="text-xs text-gray-500 mb-2 max-[500px]:hidden">
              {variantData.color && (
                <span>
                  {t("cart_product.color")}: {variantData.color}
                </span>
              )}
              {variantData.color && variantData.unit && <span> • </span>}
              {variantData.unit && (
                <span>
                  {t("cart_product.unit")}: {variantData.unit}
                </span>
              )}
              {variantData.stockQuantity && (
                <span>
                  {" "}
                  • {t("cart_product.in_stock")}: {variantData.stockQuantity}
                </span>
              )}
            </div>
          )}

          {product.attributes && (
            <p className="text-xs text-gray-500 mb-2">{product.attributes}</p>
          )}

          <div className="flex items-center justify-between max-[480px]:flex-col max-[480px]:items-start max-[480px]:gap-2">
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-gray-900">
                {formatPrice(variantData.price)} {t("cart.sum")}
              </span>
              {variantData.originalPrice &&
                variantData.originalPrice !== variantData.price && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(variantData.originalPrice)} {t("cart.sum")}
                  </span>
                )}
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={decrementQuantity}
                  className="w-8 h-8 flex items-center cursor-pointer justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                  title={
                    product.quantity === 1
                      ? t("cart_product.remove_product")
                      : t("cart_product.decrease")
                  }
                >
                  {product.quantity === 1 ? (
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>

                <div className="w-10 h-8 flex items-center justify-center text-sm font-medium bg-gray-50 border-x border-gray-300">
                  {product.quantity}
                </div>

                <button
                  onClick={incrementQuantity}
                  className="w-8 h-8 flex cursor-pointer  items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                  title={t("cart_product.increase")}
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <button
                onClick={handleRemove}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer  transition-colors max-[500px]:hidden"
                title={t("cart_product.remove_product")}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          {product.quantity > 1 && (
            <div className="mt-2 text-right">
              <span className="text-sm text-gray-600">
                <div className=" flex gap-1 justify-end">
                  <p className="font-bold">{t("cart_product.total_price")}:</p>
                  {formatPrice(
                    parseFloat(
                      variantData.price?.toString().replace(/[^\d.-]/g, "") || 0
                    ) * product.quantity
                  )}
                  {t("cart.sum")}
                </div>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
