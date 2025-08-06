"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCartStore } from "./hooks/cart";

export default function CartProduct({ product }) {
  const { toggleChecked, updateQuantity, removeCart } = useCartStore();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      handleRemove();
    } else {
      updateQuantity(product.id, newQuantity);
    }
  };

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      removeCart(product.id);
    }, 200);
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

  return (
    <div
      className={`p-4 transition-all duration-200 `}
    >
      <div className="flex items-start space-x-4">
        {/* Checkbox */}
        <div className="flex-shrink-0 mt-2">
          <input
            type="checkbox"
            checked={product.checked}
            onChange={() => toggleChecked(product.id)}
            className="w-5 h-5 text-blue-600 cursor-pointer border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          />
        </div>

        {/* Product Image */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.image || "/images/placeholder.jpg"}
              alt={product.name}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
            {product.name}
          </h3>

          {product.attributes && (
            <p className="text-xs text-gray-500 mb-2">{product.attributes}</p>
          )}

          <div className="flex items-center justify-between max-[480px]:flex-col max-[480px]:text-start">
            {/* Price */}
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-gray-900">
                {formatPrice(product.sale_price)} so&apos;m
              </span>
              {product.original_price &&
                product.original_price !== product.sale_price && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.original_price)} so&apos;m
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
                      ? "Mahsulotni o'chirish"
                      : "Kamaytirish"
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
                  title="Ko'paytirish"
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

              {/* Remove Button */}
              <button
                onClick={handleRemove}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer  transition-colors"
                title="Mahsulotni o'chirish"
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

          {/* Total Price for this item */}
          {product.quantity > 1 && (
            <div className="mt-2 text-right">
              <span className="text-sm text-gray-600">
                Jami:{" "}
                {formatPrice(
                  parseFloat(
                    product.sale_price?.toString().replace(/[^\d.-]/g, "") || 0
                  ) * product.quantity
                )}{" "}
                so&apos;m
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
