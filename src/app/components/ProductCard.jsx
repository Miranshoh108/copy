"use client";
import { useState, useEffect } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { useHomeLikes } from "./hooks/likes";
import { useCartStore } from "./hooks/cart";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useProductStore from "../store/productStore";
import { useTranslation } from "react-i18next";
import i18next from "../../i18n/i18n";

export default function ProductCard({ product }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { toggleLike, likes } = useHomeLikes();
  const [added, setAdded] = useState(false);
  const setCurrentProduct = useProductStore((state) => state.setCurrentProduct);
  const { addCart, updateQuantity, removeCart, cart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    name,
    name_ru,
    name_en,
    image,
    id,
    price,
    discountedPrice,
    reviews_count,
    variants = [],
  } = product;

  const cartItem = cart.find((item) => item.id === id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  // Get localized product name
  const getLocalizedName = () => {
    switch (i18next.language) {
      case "ru":
        return name_ru || name;
      case "en":
        return name_en || name;
      default:
        return name;
    }
  };

  // Get currency text based on language
  const getCurrencyText = () => {
    switch (i18next.language) {
      case "ru":
        return "сум";
      case "en":
        return "sum";
      default:
        return "so'm";
    }
  };

  const getAllImages = () => {
    const images = [];

    if (image) {
      images.push(image);
    }

    variants.forEach((variant) => {
      if (variant.mainImg) {
        const cleanPath = variant.mainImg.replace(/\\/g, "/");
        const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/${cleanPath}`;
        if (!images.includes(imageUrl)) {
          images.push(imageUrl);
        }
      }

      if (variant.productImages && variant.productImages.length > 0) {
        variant.productImages.forEach((img) => {
          const cleanPath = img.replace(/\\/g, "/");
          const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/${cleanPath}`;
          if (!images.includes(imageUrl)) {
            images.push(imageUrl);
          }
        });
      }
    });

    return images.length > 0
      ? images
      : [image || "/images/placeholder-product.jpg"];
  };

  const allImages = getAllImages();
  const isLiked = likes.some((item) => item.id === id);

  const handleLike = (e) => {
    e.stopPropagation();
    toggleLike(product);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setIsLoading(true);

    setTimeout(() => {
      const cartProduct = {
        ...product,
        id: id,
        sale_price: discountedPrice || price,
        original_price: discountedPrice ? price : null,
        quantity: 1,
        checked: false,
      };

      addCart(cartProduct);
      setAdded(true);
      setIsLoading(false);
    }, 300);
  };

  const handleProductClick = () => {
    setCurrentProduct(product);
    router.push(`/product/${id}`);
  };

  const handleMouseMove = (e) => {
    if (!isHovering || allImages.length <= 1) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    const imageIndex = Math.floor((x / width) * allImages.length);
    const clampedIndex = Math.max(
      0,
      Math.min(imageIndex, allImages.length - 1)
    );

    setCurrentImageIndex(clampedIndex);
  };

  const handleMouseEnter = () => {
    if (allImages.length > 1) {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setCurrentImageIndex(0);
  };

  const getCurrentImage = () => {
    return (
      allImages[currentImageIndex] ||
      allImages[0] ||
      "/images/placeholder-product.jpg"
    );
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    const newQty = currentQuantity + 1;
    updateQuantity(id, newQty);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    if (currentQuantity === 1) {
      removeCart(id);
    } else {
      const newQty = currentQuantity - 1;
      updateQuantity(id, newQty);
    }
  };

  const displayName = getLocalizedName();
  const currencyText = getCurrencyText();

  return (
    <div
      className=" bg-white rounded-lg shadow-md flex flex-col w-[190px] relative cursor-pointer hover:shadow-lg transition-shadow h-full"
      onClick={handleProductClick}
    >
      {price && discountedPrice && price > discountedPrice && (
        <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md z-20">
          -{Math.round(((price - discountedPrice) / price) * 100)}%
        </div>
      )}
      <button
        onClick={handleLike}
        className={`cursor-pointer absolute top-2 right-2 z-20 transition-colors hover:scale-110 ${
          isLiked ? "text-red-500" : "text-gray-400"
        }`}
      >
        <Heart
          fill={isLiked ? "red" : "none"}
          size={20}
          className="drop-shadow-sm"
        />
      </button>

      <div
        className="relative w-full h-[210px] overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Image
          src={getCurrentImage()}
          alt={displayName}
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {allImages.length > 1 && isHovering && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 z-10">
            {allImages.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  index === currentImageIndex
                    ? "bg-green-500 scale-125"
                    : "bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="min-h-[45px] flex flex-col justify-center px-2">
        {price && discountedPrice && price !== discountedPrice ? (
          <>
            <span className="text-gray-400 line-through text-sm">
              {price} {currencyText}
            </span>
            <span className="text-gray-800 font-bold text-lg">
              {discountedPrice} {currencyText}
            </span>
          </>
        ) : (
          <p className="text-lg font-bold text-gray-800">
            {price} {currencyText}
          </p>
        )}
      </div>

      <h3 className="text-gray-800 font-medium px-2">{displayName}</h3>

      <div className="p-2">
        <p className="text-gray-700 text-xs">
          {reviews_count && reviews_count > 0
            ? reviews_count
            : Math.floor(Math.random() * 6) + 1}{" "}
          {mounted ? t("product_card.reviews") : ""}
        </p>

        <div className="flex items-center justify-between mt-1">
          {isLoading ? (
            <button
              className="w-full flex items-center justify-center gap-2 border border-[#249B73] text-[#249B73] bg-[#f0f8ff] rounded-lg py-2 cursor-not-allowed"
              disabled
            >
              <span className="loader border-2 border-t-[#249B73] rounded-full w-4 h-4 animate-spin" />
              {mounted ? t("product_card.loading") : ""}
            </button>
          ) : currentQuantity === 0 ? (
            <button
              onClick={(e) => handleAddToCart(e)}
              className="w-full flex cursor-pointer items-center justify-center gap-2 border border-[#249B73] text-[#249B73] hover:bg-[#0d63f50f] transition-all duration-300 rounded-lg py-2"
              title={mounted ? t("product_card.add_to_cart_tooltip") : ""}
            >
              <ShoppingCart size={18} />
              <span className="font-medium">
                {mounted ? t("product_card.add_to_cart") : ""}
              </span>
            </button>
          ) : (
            <div className="w-full flex items-center justify-between border border-[#249B73] rounded-lg px-4 py-2 bg-white shadow-sm transition-all duration-300">
              <button
                onClick={handleDecrement}
                className="text-xl text-[#f44336] cursor-pointer font-bold hover:scale-110 transition-transform duration-200"
                title={mounted ? t("product_card.decrease_tooltip") : ""}
              >
                −
              </button>

              <span className="bg-[#249B73] text-white text-sm w-7 h-7 flex items-center justify-center rounded-full font-semibold shadow-md">
                {currentQuantity}
              </span>

              <button
                onClick={handleIncrement}
                className="text-xl cursor-pointer text-[#4caf50] font-bold hover:scale-110 transition-transform duration-200"
                title={mounted ? t("product_card.increase_tooltip") : ""}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
