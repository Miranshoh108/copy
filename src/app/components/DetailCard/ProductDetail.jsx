"use client";
import clsx from "clsx";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Plus,
  RefreshCcw,
  Settings2,
  Store,
  Truck,
  Star,
  Shield,
  Award,
  Users,
  MessageCircle,
  Share2,
  Minus,
  Eye,
  Phone,
  Clock,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import useProductStore from "../../store/productStore";
import { useRouter } from "next/navigation";
import { useCartStore } from "../hooks/cart";
import { useHomeLikes } from "../hooks/likes";

export default function ProductDetail() {
  const currentProduct = useProductStore((state) => state.currentProduct);
  const [activeIndex, setActiveIndex] = useState(0);
  const [thumbStartIndex, setThumbStartIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("#BEBBC2");
  const [selectedInstallment, setSelectedInstallment] = useState(3);
  const [direction, setDirection] = useState("right");
  const [animate, setAnimate] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("13 dyuym");
  const [selectedMemory, setSelectedMemory] = useState("256GB");
  const { toggleLike, isLiked } = useHomeLikes();
  const isInWishlist = isLiked(currentProduct?.id); 

  const toggleWishlist = () => {
    toggleLike(currentProduct);
  };

  const { addCart } = useCartStore();
  const router = useRouter();

  const THUMB_PER_PAGE = 4;
  const colorOptions = [
    { color: "#BEBBC2", name: "Space Gray" },
    { color: "#F9DED7", name: "Rose Gold" },
    { color: "#FCE9DB", name: "Gold" },
    { color: "#E8E8EA", name: "Silver" },
  ];
  const installmentOptions = [3, 6, 12, 16, 18];
  const sizeOptions = ["13 dyuym", "15 dyuym", "16 dyuym"];
  const memoryOptions = ["256GB", "512GB", "1TB"];

  if (!currentProduct)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  const {
    name,
    images = [
      "/images/camera.png",
      "/images/mac.jpeg",
      "/images/mac.jpeg",
      "/images/mac.jpeg",
      "/images/robot.jpg",
      "/images/robot.jpg",
      "/images/mac.jpeg",
      "/images/camera.png",
    ],
    price = "16 114 285",
    axiom_monthly_price = "6 434 000",
    old_price = "18 500 000",
    rating = 4.8,
    reviews_count = 156,
    availability = "stock",
    brand = "Apple",
    model = "MacBook Pro",
    views = 1247,
  } = currentProduct;

  const handleThumbnailClick = (index) => {
    if (index === activeIndex) return;
    setDirection(index > activeIndex ? "right" : "left");
    setAnimate(true);
    setActiveIndex(index);
    if (index >= thumbStartIndex + THUMB_PER_PAGE || index < thumbStartIndex) {
      setThumbStartIndex(
        Math.max(0, Math.min(index, images.length - THUMB_PER_PAGE))
      );
    }
  };

  const handleThumbNext = () => {
    setDirection("right");
    setAnimate(true);
    if (activeIndex < images.length - 1) {
      const newIndex = activeIndex + 1;
      setActiveIndex(newIndex);
      if (newIndex >= thumbStartIndex + THUMB_PER_PAGE) {
        setThumbStartIndex(thumbStartIndex + 1);
      }
    } else {
      setActiveIndex(0);
      setThumbStartIndex(0);
    }
  };

  const handleThumbPrev = () => {
    setDirection("left");
    setAnimate(true);
    if (activeIndex > 0) {
      const newIndex = activeIndex - 1;
      setActiveIndex(newIndex);
      if (newIndex < thumbStartIndex) {
        setThumbStartIndex(thumbStartIndex - 1);
      }
    } else {
      const lastIndex = images.length - 1;
      setActiveIndex(lastIndex);
      setThumbStartIndex(Math.max(0, lastIndex - THUMB_PER_PAGE + 1));
    }
  };

  const handleQuantityChange = (type) => {
    if (type === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    const productToAdd = {
      ...currentProduct,
      quantity,
      selectedColor: colorOptions.find((c) => c.color === selectedColor)?.name,
      selectedSize,
      selectedMemory,
      checked: true,
    };
    addCart(productToAdd);
  };

  const handleBuyNow = () => {
    const productToBuy = {
      ...currentProduct,
      quantity,
      selectedColor: colorOptions.find((c) => c.color === selectedColor)?.name,
      selectedSize,
      selectedMemory,
      checked: true,
    };
    addCart(productToBuy);
    router.push("/checkout");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: name,
        text: `${name} - ${price} so'm`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getAvailabilityStatus = () => {
    switch (availability) {
      case "stock":
        return { text: "Mavjud", color: "text-green-600", bg: "bg-green-100" };
      case "low_stock":
        return {
          text: "Oz miqdorda",
          color: "text-orange-600",
          bg: "bg-orange-100",
        };
      case "out_of_stock":
        return { text: "Tugagan", color: "text-red-600", bg: "bg-red-100" };
      default:
        return { text: "Mavjud", color: "text-green-600", bg: "bg-green-100" };
    }
  };

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setAnimate(false), 500);
      return () => clearTimeout(timer);
    }
  }, [animate]);

  const status = getAvailabilityStatus();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex flex-wrap gap-2 text-[#A0A0A0] mb-6 text-sm md:text-base">
        <span className="cursor-pointer hover:text-[#4889F7]">Nextstore</span>
        <span>/</span>
        <span className="cursor-pointer hover:text-[#4889F7]">
          Kompyuterlar va notebooklar
        </span>
        <span>/</span>
        <span className="cursor-pointer hover:text-[#4889F7]">
          Laptop Notebooklar
        </span>
        <span>/</span>
        <span className="text-[#1E1E1E] font-medium line-clamp-1">{name}</span>
      </div>
      {/* Main section */}
      <div className="flex flex-col lg:flex-row gap-6 md:gap-10">
        {/* Image + thumbnails */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <div className="relative">
            <div className="flex justify-center w-full max-w-full lg:max-w-[500px] aspect-square bg-white rounded-xl relative overflow-hidden shadow-md">
              <div className="relative w-full h-full flex items-center justify-center p-4">
                <Image
                  src={images[activeIndex] || images[0]}
                  alt="Product image"
                  fill
                  className={clsx(
                    "object-contain transition-transform duration-500 ease-in-out",
                    animate &&
                      direction === "right" &&
                      "animate-slide-in-right",
                    animate && direction === "left" && "animate-slide-in-left"
                  )}
                  key={activeIndex}
                />
              </div>
              {/* Action buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-3">
                <button
                  onClick={toggleWishlist}
                  className={clsx(
                    "p-2 rounded-full backdrop-blur-sm cursor-pointer transition-all shadow-md",
                    isInWishlist
                      ? "bg-red-500 text-white"
                      : "bg-white/80 text-gray-600 hover:text-red-500"
                  )}
                >
                  <Heart
                    size={20}
                    fill={isInWishlist ? "currentColor" : "none"}
                  />
                </button>

                <button
                  onClick={handleShare}
                  className="p-2 rounded-full cursor-pointer bg-white/80 backdrop-blur-sm text-gray-600 hover:text-blue-500 transition-colors shadow-md"
                >
                  <Share2 size={20} />
                </button>
                <button className="p-2 rounded-full cursor-pointer bg-white/80 backdrop-blur-sm text-gray-600 hover:text-blue-500 transition-colors shadow-md">
                  <Settings2 size={20} />
                </button>
              </div>
            </div>
            {/* Views counter */}
            <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
              <Eye size={16} />
              <span>{views.toLocaleString()} marta ko'rilgan</span>
            </div>
          </div>
          {/* Thumbnails */}
          <div className="flex items-center relative group">
            <button
              onClick={handleThumbPrev}
              className="absolute left-0 p-2 z-10  bg-white rounded-full shadow-md cursor-pointer opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex justify-between w-full overflow-x-auto scrollbar-hide pl-8 pr-8 md:pl-0 md:pr-0">
              {images
                .slice(thumbStartIndex, thumbStartIndex + THUMB_PER_PAGE)
                .map((img, index) => {
                  const realIndex = thumbStartIndex + index;
                  return (
                    <div
                      key={realIndex}
                      onClick={() => handleThumbnailClick(realIndex)}
                      className={clsx(
                        "flex-shrink-0 w-20 h-20 p-1 bg-white rounded-lg cursor-pointer flex items-center justify-center transition-all mx-1 hover:shadow-md",
                        activeIndex === realIndex
                          ? "border-2 border-[#4889F7] shadow-md"
                          : "border border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={img}
                          alt="thumbnail"
                          fill
                          className="w-auto h-auto object-contain transition-transform hover:scale-105"
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
            <button
              onClick={handleThumbNext}
              className="absolute right-0 p-2 z-10 bg-white rounded-full shadow-md cursor-pointer opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="mt-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">
                Product Information
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Brand:</span> {brand}
                </p>
                <p>
                  <span className="font-medium">Model:</span> {model}
                </p>
                <p>
                  <span className="font-medium">Screen Size:</span>{" "}
                  {selectedSize}
                </p>
                <p>
                  <span className="font-medium">Storage:</span> {selectedMemory}
                </p>
                <p>
                  <span className="font-medium">Color:</span>{" "}
                  {colorOptions.find((c) => c.color === selectedColor)?.name}
                </p>
                
                <p className="pt-2">
                  The {brand} {model} combines powerful performance with sleek
                  design, featuring a stunning display and all-day battery life.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Product details */}
        <div className="w-full lg:w-1/2">
          {/* Product title and rating */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3">
              <h1 className="text-[#1E1E1E] font-bold text-2xl lg:text-3xl leading-tight">
                {brand} {model} {name}
              </h1>
              <div
                className={clsx(
                  "px-3 py-1 rounded-full text-sm font-medium self-start",
                  status.bg,
                  status.color
                )}
              >
                {status.text}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.floor(rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="font-semibold">{rating}</span>
                <span className="text-gray-500">({reviews_count} baho)</span>
              </div>
              <button className="text-[#4889F7] cursor-pointer text-sm hover:underline flex items-center gap-1">
                <MessageCircle size={14} />
                Sharh yozish
              </button>
            </div>
          </div>
          {/* Size selection */}
          <div className="mb-6">
            <p className="text-[#1E1E1E] text-lg font-medium mb-3">
              Ekran o'lchami
            </p>
            <div className="flex flex-wrap gap-2">
              {sizeOptions.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={clsx(
                    "px-4 py-2 rounded-lg border cursor-pointer transition-all text-sm md:text-base",
                    selectedSize === size
                      ? "border-[#4889F7] bg-[#4889F7] text-white"
                      : "border-gray-300 hover:border-[#4889F7] hover:text-[#4889F7]"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          {/* Memory selection */}
          <div className="mb-6">
            <p className="text-[#1E1E1E] text-lg font-medium mb-3">
              Xotira hajmi
            </p>
            <div className="flex flex-wrap gap-2">
              {memoryOptions.map((memory) => (
                <button
                  key={memory}
                  onClick={() => setSelectedMemory(memory)}
                  className={clsx(
                    "px-4 py-2 rounded-lg border cursor-pointer transition-all text-sm md:text-base",
                    selectedMemory === memory
                      ? "border-[#4889F7] bg-[#4889F7] text-white"
                      : "border-gray-300 hover:border-[#4889F7] hover:text-[#4889F7]"
                  )}
                >
                  {memory}
                </button>
              ))}
            </div>
          </div>
          {/* Color options */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
              <p className="text-[#1E1E1E] text-lg font-medium">Rangi</p>
              <p className="text-lg text-[#A0A0A0] font-medium">
                {colorOptions.find((c) => c.color === selectedColor)?.name}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {colorOptions.map(({ color, name }) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={clsx(
                    "w-10 h-10 md:w-12 md:h-12 rounded-lg cursor-pointer transition-all border-2 flex items-center justify-center",
                    selectedColor === color
                      ? "border-[#4889F7] scale-110"
                      : "border-gray-300 hover:border-[#4889F7]"
                  )}
                  style={{ backgroundColor: color }}
                  title={name}
                >
                  {selectedColor === color && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
          {/* Installment options */}

          {/* Price section */}
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-baseline gap-4 mb-2">
              <p className="text-[#1E1E1E] text-2xl lg:text-3xl font-bold">
                {price} so'm
              </p>
              {old_price && (
                <p className="text-gray-400 text-xl line-through">
                  {old_price} so'm
                </p>
              )}
            </div>
          </div>
          {/* Quantity selector and add to cart */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                <span className="text-lg font-medium mr-3">Miqdor:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange("decrease")}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-100 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 font-semibold min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange("increase")}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={availability === "out_of_stock"}
                className={clsx(
                  "flex-1 py-3 px-6 rounded-lg cursor-pointer font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
                  availability === "out_of_stock"
                    ? "bg-gray-300 text-gray-500"
                    : "bg-white border-2 border-[#4889F7] text-[#4889F7] hover:bg-[#4889F7] hover:text-white"
                )}
              >
                <Plus size={18} />
                Savatga qo'shish
              </button>
              <button
                onClick={handleBuyNow}
                disabled={availability === "out_of_stock"}
                className={clsx(
                  "flex-1 py-3 px-6 rounded-lg font-semibold cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                  availability === "out_of_stock"
                    ? "bg-gray-300 text-gray-500"
                    : "bg-[#4889F7] text-white hover:bg-[#0d63f3]"
                )}
              >
                Sotib olish
              </button>
            </div>
          </div>
          {/* Product info */}
          <div className="space-y-4 border-t border-gray-200 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-gray-600">
              <div className="flex items-center gap-2">
                <Store size={20} className="flex-shrink-0" />
                <span>Do'kon:</span>
                <span className="text-black font-semibold">MacBro</span>
              </div>
              <span className="text-green-600 text-sm flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full self-start">
                <Shield size={14} />
                Tasdiqlangan
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-gray-600">
              <div className="flex items-center gap-2">
                <Truck size={20} className="flex-shrink-0" />
                <span>Yetkazib berish:</span>
                <span className="text-black font-semibold">1-2 kun</span>
              </div>
              <span className="text-[#2CB708] font-semibold">30 000 so'm</span>
            </div>

          
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-gray-600">
              <div className="flex items-center gap-2">
                <Phone size={20} className="flex-shrink-0" />
                <span>Qo'llab-quvvatlash:</span>
                <span className="text-black font-semibold">24/7</span>
              </div>
              <button className="text-[#0D63F3] cursor-pointer hover:underline self-start">
                Bog'lanish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
