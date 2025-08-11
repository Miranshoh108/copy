"use client";
import { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { useHomeLikes } from "./hooks/likes";
import { useCartStore } from "./hooks/cart";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useProductStore from "../store/productStore";

export default function ProductCard({ product }) {
  const router = useRouter();
  const { toggleLike, likes } = useHomeLikes();
  const [added, setAdded] = useState(false);
  const setCurrentProduct = useProductStore((state) => state.setCurrentProduct);
  const [quantity, setQuantity] = useState(0);
  const { addCart, updateQuantity, removeCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Konsolga chiqaramiz
  console.log("Mahsulot:", product.name);
  console.log("Price:", product.price);
  console.log("DiscountedPrice:", product.discountedPrice);

  const {
    name,
    image,
    id,
    price, // oddiy narx
    discountedPrice, // chegirmali narx
    axiom_monthly_price,
    stickers,
    reviews_count,
    variants = [], // variants array
  } = product;

  // Get all available images from variants
  const getAllImages = () => {
    const images = [];

    // Add main product image
    if (image) {
      images.push(image);
    }

    // Add variant main images and product images
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
      addCart({
        ...product,
        quantity: 1,
        checked: false,
      });
      setAdded(true);
      setQuantity(1);
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

    // Calculate which image to show based on mouse position
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

  return (
    <div
      className="group bg-white rounded-lg shadow-md p-4 flex flex-col relative cursor-pointer hover:shadow-lg transition-shadow h-full"
      onClick={handleProductClick}
    >
      {price && discountedPrice && price > discountedPrice && (
        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md z-20">
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

      <div className="flex-grow">
        {/* Rasm with hover effect */}
        <div
          className="relative w-full h-36 mb-3 overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Image
            src={getCurrentImage()}
            alt={name}
            className="object-contain transition-all duration-300 ease-in-out"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Image indicators - show only if there are multiple images and hovering */}
          {allImages.length > 1 && isHovering && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 z-10">
              {allImages.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                    index === currentImageIndex
                      ? "bg-blue-500 scale-125"
                      : "bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="min-h-[45px] flex flex-col justify-center">
          {price && discountedPrice && price !== discountedPrice ? (
            <>
              <span className="text-red-500 line-through text-sm">
                {price} so'm
              </span>
              <span className="text-gray-800 font-bold text-lg">
                {discountedPrice} so'm
              </span>
            </>
          ) : (
            <p className="text-lg font-bold text-gray-800">{price} so'm</p>
          )}
        </div>

        <h3 className="text-gray-800 font-medium mt-1 line-clamp-2 h-12">
          {name}
        </h3>

        {axiom_monthly_price && (
          <p className="text-gray-500 text-sm mt-1">{axiom_monthly_price}</p>
        )}
      </div>

      <div className="mt-3">
        <p className="text-gray-500 text-xs">
          {reviews_count && reviews_count > 0
            ? reviews_count
            : Math.floor(Math.random() * 6) + 1}{" "}
          ta sharh
        </p>

        <div className="flex items-center justify-between mt-3">
          {isLoading ? (
            <button
              className="w-full flex items-center justify-center gap-2 border border-[#0D63F5] text-[#0D63F5] bg-[#f0f8ff] rounded-lg py-2 cursor-not-allowed"
              disabled
            >
              <span className="loader border-2 border-t-[#0D63F5] rounded-full w-4 h-4 animate-spin" />
              Yuklanmoqda...
            </button>
          ) : quantity === 0 ? (
            <button
              onClick={(e) => handleAddToCart(e)}
              className="w-full flex cursor-pointer items-center justify-center gap-2 border border-[#0D63F5] text-[#0D63F5] hover:bg-[#0d63f50f] transition-all duration-300 rounded-lg py-2"
              title="Savatga qo'shish"
            >
              <ShoppingCart size={18} />
              <span className="font-medium">Savatga qo'shish</span>
            </button>
          ) : (
            <div className="w-full flex items-center justify-between border border-[#0D63F5] rounded-lg px-4 py-2 bg-white shadow-sm transition-all duration-300">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (quantity === 1) {
                    setQuantity(0);
                    removeCart(product.id);
                  } else {
                    const newQty = quantity - 1;
                    setQuantity(newQty);
                    updateQuantity(product.id, newQty);
                  }
                }}
                className="text-xl text-[#f44336] cursor-pointer font-bold hover:scale-110 transition-transform duration-200"
                title="Kamaytirish"
              >
                −
              </button>

              <span className="bg-[#0D63F5] text-white text-sm w-7 h-7 flex items-center justify-center rounded-full font-semibold shadow-md">
                {quantity}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const newQty = quantity + 1;
                  setQuantity(newQty);
                  updateQuantity(product.id, newQty);
                }}
                className="text-xl cursor-pointer text-[#4caf50] font-bold hover:scale-110 transition-transform duration-200"
                title="Qo'shish"
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
