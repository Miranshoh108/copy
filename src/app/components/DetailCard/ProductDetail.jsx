"use client";
import clsx from "clsx";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Plus,
  Settings2,
  MessageCircle,
  Share2,
  Minus,
  Eye,
  X,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import useProductStore from "../../store/productStore";
import { useRouter } from "next/navigation";
import { useCartStore } from "../hooks/cart";
import { useHomeLikes } from "../hooks/likes";
import { useTranslation } from "react-i18next";
import $api from "@/app/http/api";

export default function ProductDetail() {
  const { t } = useTranslation();
  const currentProduct = useProductStore((state) => state.currentProduct);
  const [activeIndex, setActiveIndex] = useState(0);
  const [thumbStartIndex, setThumbStartIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [direction, setDirection] = useState("right");
  const [animate, setAnimate] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { toggleLike, isLiked } = useHomeLikes();
  const isInWishlist = isLiked(currentProduct?.id);
  const [isLoading, setIsLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalActiveIndex, setModalActiveIndex] = useState(0);
  const [modalDirection, setModalDirection] = useState("right");
  const [modalAnimate, setModalAnimate] = useState(false);

  const { addCart, updateQuantity, removeCart, cart } = useCartStore();
  const router = useRouter();

  const THUMB_PER_PAGE = 4;

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token =
          localStorage.getItem("accessToken") || localStorage.getItem("token");
        setIsAuthenticated(
          !!token && token !== "undefined" && token.length > 0
        );
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (!currentProduct)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  const getCurrentCartItem = () => {
    const productId = currentProduct.id || currentProduct._id;
    const currentVariant =
      currentProduct?.variants?.[selectedVariant] ||
      currentProduct?.variants?.[0] ||
      {};
    const variantId = currentVariant._id;

    return cart.find(
      (item) =>
        (item.id === productId || item.productId === productId) &&
        item.variantId === variantId
    );
  };

  const cartItem = getCurrentCartItem();
  const currentQuantityInCart = cartItem ? cartItem.quantity : 0;

  // Get total quantity for this product across all variants
  const getTotalProductQuantity = () => {
    const productId = currentProduct.id || currentProduct._id;
    return cart
      .filter((item) => item.id === productId || item.productId === productId)
      .reduce((total, item) => total + item.quantity, 0);
  };

  const showNotification = (message, type = "success") => {
    console.log(`${type}: ${message}`);
    if (typeof window !== "undefined" && window.toast) {
      window.toast(message, type);
    }
  };

  const getCurrentImage = () => {
    return images[activeIndex] || "/images/placeholder.png";
  };

  const toggleWishlist = () => {
    toggleLike(currentProduct);
  };

  // Hozirgi variant
  const currentVariant =
    currentProduct?.variants?.[selectedVariant] ||
    currentProduct?.variants?.[0] ||
    {};

  // Hozirgi variantning rasmlarini olish
  const getCurrentVariantImages = () => {
    const variantImages = [];

    // Variantning asosiy rasmi
    if (currentVariant.mainImg) {
      const mainImg = currentVariant.mainImg.startsWith("https")
        ? currentVariant.mainImg
        : `${process.env.NEXT_PUBLIC_API_URL}/${currentVariant.mainImg.replace(
            /\\/g,
            "/"
          )}`;
      variantImages.push(mainImg);
    }

    // Variantning qo'shimcha rasmlari
    if (currentVariant.productImages) {
      currentVariant.productImages.forEach((img) => {
        const imageUrl = img.startsWith("https")
          ? img
          : `${process.env.NEXT_PUBLIC_API_URL}/${img.replace(/\\/g, "/")}`;
        variantImages.push(imageUrl);
      });
    }

    // Agar variant rasmlari bo'lmasa, mahsulotning umumiy rasmlarini ishlatish
    if (variantImages.length === 0) {
      if (currentProduct?.mainImage) {
        const mainImage = currentProduct.mainImage.startsWith("https")
          ? currentProduct.mainImage
          : `${
              process.env.NEXT_PUBLIC_API_URL
            }/${currentProduct.mainImage.replace(/\\/g, "/")}`;
        variantImages.push(mainImage);
      }

      if (currentProduct?.metaImage) {
        const metaImage = currentProduct.metaImage.startsWith("https")
          ? currentProduct.metaImage
          : `${
              process.env.NEXT_PUBLIC_API_URL
            }/${currentProduct.metaImage.replace(/\\/g, "/")}`;
        variantImages.push(metaImage);
      }
    }

    return variantImages.filter(Boolean);
  };

  const images = getCurrentVariantImages();

  // Modal functions
  const openModal = (index) => {
    setModalActiveIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "unset";
  };

  const handleModalNext = () => {
    setModalDirection("right");
    setModalAnimate(true);
    setModalActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handleModalPrev = () => {
    setModalDirection("left");
    setModalAnimate(true);
    setModalActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleModalKeyDown = (e) => {
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowRight") handleModalNext();
    if (e.key === "ArrowLeft") handleModalPrev();
  };

  // Variant o'zgarganda rasmlarni yangilash
  useEffect(() => {
    setActiveIndex(0);
    setThumbStartIndex(0);
    // Reset quantity to match cart when variant changes
    const newCartItem = getCurrentCartItem();
    setQuantity(1); // Reset input to 1, but cart counter will show actual amount
  }, [selectedVariant]);

  // Modal keyboard events
  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("keydown", handleModalKeyDown);
      return () => document.removeEventListener("keydown", handleModalKeyDown);
    }
  }, [isModalOpen]);

  // Reset modal animation
  useEffect(() => {
    if (modalAnimate) {
      const timer = setTimeout(() => setModalAnimate(false));
      return () => clearTimeout(timer);
    }
  }, [modalAnimate]);

  const { description, shortDescription, variants = [] } = currentProduct;

  const name = currentProduct?.name || "";

  // Hozirgi variantning ma'lumotlari
  const {
    color,
    unit,
    price: variantPrice,
    discountedPrice: variantDiscountedPrice,
    discount = 0,
    stockQuantity = 0,
    saleStatus = "active",
  } = currentVariant;

  // Narxlarni to'g'ri ko'rsatish
  const displayPrice = variantPrice || currentProduct?.price || 0;
  const displayDiscountedPrice =
    variantDiscountedPrice || currentProduct?.discountedPrice;

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
    if (type === "increase" && quantity < stockQuantity) {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const createLocalCartProduct = (qty = 1) => {
    const productId = currentProduct.id || currentProduct._id;
    return {
      ...currentProduct,
      id: productId,
      productId: productId,
      variantId: currentVariant._id,
      name: currentProduct.name,
      image: getCurrentImage(),
      price: displayPrice,
      discountedPrice: displayDiscountedPrice,
      sale_price: displayDiscountedPrice || displayPrice,
      axiom_monthly_price: currentProduct.axiom_monthly_price,
      quantity: qty,
      checked: false,
      variant: {
        color: currentVariant.color,
        unit: currentVariant.unit,
        stockQuantity: currentVariant.stockQuantity,
      },
    };
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      showNotification("Savatga qo'shish uchun tizimga kiring", "warning");
      router.push("/login");
      return;
    }

    setIsLoading(true);

    try {
      const productId = currentProduct.id || currentProduct._id;
      const variantId = currentVariant._id;

      const cartData = {
        products: [
          {
            productId: productId,
            variantId: variantId,
            quantity: quantity,
            price: displayDiscountedPrice || displayPrice,
          },
        ],
      };

      const response = await $api.post("/cart/add/product", cartData);

      if (response.data && response.data.status === 200) {
        const localCartProduct = createLocalCartProduct(quantity);
        addCart(localCartProduct, variantId);
        showNotification(
          "Mahsulot muvaffaqiyatli savatga qo'shildi!",
          "success"
        );
        setQuantity(1);
      } else {
        throw new Error("API javobida xatolik");
      }
    } catch (error) {
      console.error("Error in handleAddToCart:", error);
      showNotification(
        "Savatga qo'shishda xatolik yuz berdi. Qaytadan urinib ko'ring.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleIncrement = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      showNotification("Tizimga kirish talab etiladi", "warning");
      router.push("/login");
      return;
    }

    const productId = currentProduct.id || currentProduct._id;
    const variantId = currentVariant._id;
    const newQty = currentQuantityInCart + 1;

    try {
      const updateData = {
        products: [
          {
            productId: productId,
            variantId: variantId,
            quantity: newQty,
            price: displayDiscountedPrice || displayPrice,
          },
        ],
      };

      const response = await $api.post("/cart/add/product", updateData);

      if (response.data && response.data.status === 200) {
        updateQuantity(productId, newQty, variantId);
      } else {
        throw new Error("API javobida xatolik");
      }
    } catch (error) {
      console.error("Error updating cart via API:", error);
      showNotification("Miqdorni yangilashda xatolik yuz berdi.", "error");
    }
  };

  const handleDecrementDetail = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      showNotification("Tizimga kirish talab etiladi", "warning");
      router.push("/login");
      return;
    }

    const productId = currentProduct.id || currentProduct._id;
    const variantId = currentVariant._id;

    if (currentQuantityInCart === 1) {
      showNotification("Mahsulotni o'chirish uchun savatga kiring", "info");
      return;
    }

    const newQty = currentQuantityInCart - 1;

    try {
      const updateData = {
        products: [
          {
            productId: productId,
            variantId: variantId,
            quantity: newQty,
            price: displayDiscountedPrice || displayPrice,
          },
        ],
      };

      const response = await $api.post("/cart/add/product", updateData);

      if (response.data && response.data.status === 200) {
        updateQuantity(productId, newQty, variantId);
      } else {
        throw new Error("API javobida xatolik");
      }
    } catch (error) {
      console.error("Error updating cart via API:", error);
      showNotification("Miqdorni yangilashda xatolik yuz berdi.", "error");
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      showNotification("Xarid qilish uchun tizimga kiring", "warning");
      router.push("/login");
      return;
    }

    try {
      const productId = currentProduct.id || currentProduct._id;
      const variantId = currentVariant._id;

      const cartData = {
        products: [
          {
            productId: productId,
            variantId: variantId,
            quantity: quantity,
            price: displayDiscountedPrice || displayPrice,
          },
        ],
      };

      const response = await $api.post("/cart/add/product", cartData);

      if (response.data && response.data.status === 200) {
        const productToBuy = {
          id: productId,
          productId: productId,
          variantId: currentVariant._id,
          name: currentProduct.name,
          image: getCurrentImage(),
          price: displayPrice,
          discountedPrice: displayDiscountedPrice,
          sale_price: displayDiscountedPrice || displayPrice,
          quantity,
          selectedVariant: currentVariant,
          checked: true,
          variant: {
            color: currentVariant.color,
            unit: currentVariant.unit,
            stockQuantity: currentVariant.stockQuantity,
          },
        };
        addCart(productToBuy);
        router.push("/checkout");
      } else {
        throw new Error("API javobida xatolik");
      }
    } catch (error) {
      console.error("Error in handleBuyNow:", error);
      showNotification(
        "Xarid qilishda xatolik yuz berdi. Qaytadan urinib ko'ring.",
        "error"
      );
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: name,
        text: `${name} - ${displayPrice} so'm`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getAvailabilityStatus = () => {
    if (stockQuantity === 0) {
      return {
        text: t("product.out_of_stock"),
        color: "text-red-600",
        bg: "bg-red-100",
      };
    } else if (stockQuantity < 5) {
      return {
        text: t("product.low_stock"),
        color: "text-orange-600",
        bg: "bg-orange-100",
      };
    } else {
      return {
        text: t("product.available"),
        color: "text-[#249B73] ",
        bg: "bg-green-100",
      };
    }
  };

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setAnimate(false));
      return () => clearTimeout(timer);
    }
  }, [animate]);

  const status = getAvailabilityStatus();

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 text-[#A0A0A0] mb-6 text-sm md:text-base">
          <span className="cursor-pointer hover:text-[#249B73]">
            {t("product.products")}
          </span>
          <span>/</span>
          <span className="text-[#1E1E1E] font-medium line-clamp-1">
            {name}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 ">
          <div className="w-full lg:w-[60%] flex flex-col gap-6">
            <div className="relative">
              <div className="flex justify-center w-full max-w-full h-[600px] lg:max-w-[100%] aspect-square bg-white rounded-xl relative overflow-hidden shadow-md">
                <div className="relative w-full h-[600px] flex items-center justify-center p-4">
                  <Image
                    src={images[activeIndex] || "/images/placeholder.png"}
                    alt="Product image"
                    fill
                    className={clsx(
                      "object-cover transition-transform duration-500 ease-in-out",
                      animate &&
                        direction === "right" &&
                        "animate-slide-in-right",
                      animate && direction === "left" && "animate-slide-in-left"
                    )}
                    key={`${selectedVariant}-${activeIndex}`}
                    onClick={() => openModal(activeIndex)}
                  />
                </div>

                <div
                  className="absolute bottom-75 right-85 bg-black/50 text-white p-4 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => openModal(activeIndex)}
                >
                  <Eye size={22} />
                </div>

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
                    className="p-2 rounded-full cursor-pointer bg-white/80 backdrop-blur-sm text-gray-600 hover:text-green-500 transition-colors shadow-md"
                  >
                    <Share2 size={20} />
                  </button>
                  <button className="p-2 rounded-full cursor-pointer bg-white/80 backdrop-blur-sm text-gray-600 hover:text-green-500 transition-colors shadow-md">
                    <Settings2 size={20} />
                  </button>
                </div>

                {discount > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-semibold">
                    -{discount}%
                  </div>
                )}
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex items-center text-center relative group px-4">
                <button
                  onClick={handleThumbPrev}
                  className="absolute -left-6 p-2 z-10  bg-white rounded-full shadow-md cursor-pointer opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex gap-10 w-[500px] overflow-x-auto scrollbar-hide">
                  {images
                    .slice(thumbStartIndex, thumbStartIndex + THUMB_PER_PAGE)
                    .map((img, index) => {
                      const realIndex = thumbStartIndex + index;
                      return (
                        <div
                          key={`${selectedVariant}-thumb-${realIndex}`}
                          onClick={() => handleThumbnailClick(realIndex)}
                          className={clsx(
                            "flex-shrink-0 w-20 h-20 bg-white rounded-lg cursor-pointer flex items-center justify-center transition-all mx-1 hover:shadow-md",
                            activeIndex === realIndex
                              ? "border-2 border-[#249B73] shadow-md"
                              : "border border-gray-200 hover:border-gray-300"
                          )}
                        >
                          <div className="relative w-full h-full">
                            <Image
                              src={img}
                              alt="thumbnail"
                              fill
                              className="w-auto h-auto transition-transform rounded-lg "
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
                <button
                  onClick={handleThumbNext}
                  className="absolute right-18 p-2 z-10 bg-white rounded-full shadow-md cursor-pointer opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          <div className="w-full lg:w-[40%]">
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3">
                <h1 className="text-[#1E1E1E] font-bold text-2xl lg:text-3xl leading-tight">
                  {name}
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
                <button className="text-[#249B73] cursor-pointer text-sm hover:underline flex items-center gap-1">
                  <MessageCircle size={14} />
                  {t("product.write_review")}
                </button>
              </div>
            </div>

            {variants.length > 1 && (
              <div className="mb-6">
                <p className="text-[#1E1E1E] text-lg font-medium mb-3">
                  {t("product.colors")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant, index) => (
                    <button
                      key={variant._id}
                      onClick={() => setSelectedVariant(index)}
                      className={clsx(
                        "px-4 py-2 rounded-lg border cursor-pointer transition-all text-sm md:text-base",
                        selectedVariant === index
                          ? "border-[#249B73] bg-[#249B73] text-white"
                          : "border-gray-300 hover:border-[#249B73] hover:text-[#249B73]"
                      )}
                    >
                      {variant.color || `Variant ${index + 1}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-baseline gap-4 mb-2">
                <p className="text-[#1E1E1E] text-2xl lg:text-3xl font-bold">
                  {displayDiscountedPrice &&
                  displayDiscountedPrice !== displayPrice
                    ? `${displayDiscountedPrice.toLocaleString()} so'm`
                    : `${displayPrice.toLocaleString()} so'm`}
                </p>
                {displayDiscountedPrice &&
                  displayDiscountedPrice !== displayPrice && (
                    <p className="text-red-400 text-xl line-through">
                      {displayPrice.toLocaleString()} so'm
                    </p>
                  )}
              </div>
              {discount > 0 && (
                <p className="text-[#249B73]  font-medium">
                  {t("product.with_discount", { discount })}
                </p>
              )}
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  <span className="text-lg font-medium mr-3">
                    {t("product.quantity")}:
                  </span>

                  {currentQuantityInCart > 0 ? (
                    <div className="flex items-center border border-[#249B73] rounded-lg bg-white shadow-sm transition-all duration-300">
                      <button
                        onClick={handleDecrementDetail}
                        className="p-2 text-red-500 cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 py-2 font-semibold min-w-[60px] text-center bg-[#249B73] text-white">
                        {currentQuantityInCart}
                      </span>
                      <button
                        onClick={handleIncrement}
                        disabled={currentQuantityInCart >= stockQuantity}
                        className="p-2 cursor-pointer text-green-500 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ) : (
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
                        disabled={quantity >= stockQuantity}
                        className="p-2 cursor-pointer hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {t("product.in_stock")}: {stockQuantity}
                  {unit || t("product.piece")}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={
                    stockQuantity === 0 ||
                    saleStatus !== "active" ||
                    isLoading ||
                    !isAuthenticated
                  }
                  className={clsx(
                    "flex-1 py-3 px-6 rounded-lg cursor-pointer font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
                    stockQuantity === 0 ||
                      saleStatus !== "active" ||
                      !isAuthenticated
                      ? "bg-gray-300 text-gray-500"
                      : "bg-white border-2 border-[#249B73] text-[#249B73] hover:bg-[#249B73] hover:text-white"
                  )}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Plus size={18} />
                      {!isAuthenticated
                        ? t("product.login_required")
                        : t("product.add_to_cart")}
                    </>
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={
                    stockQuantity === 0 ||
                    saleStatus !== "active" ||
                    !isAuthenticated
                  }
                  className={clsx(
                    "flex-1 py-3 px-6 rounded-lg font-semibold cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                    stockQuantity === 0 ||
                      saleStatus !== "active" ||
                      !isAuthenticated
                      ? "bg-gray-300 text-gray-500"
                      : "bg-[#249B73] text-white hover:bg-[#249B73]"
                  )}
                >
                  {!isAuthenticated
                    ? t("product.login_required")
                    : t("product.buy_now")}
                </button>
              </div>
            </div>

            {description && (
              <div className="mb-6 bg-white p-4 rounded-lg border">
                <h3 className="text-lg font-semibold mb-3">
                  {t("product.description")}
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {description}
                </p>
              </div>
            )}

            <div className="mt-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">
                  {t("product.details")}
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  {color && (
                    <p>
                      <span className="font-medium">{t("product.color")}:</span>
                      {color}
                    </p>
                  )}
                  {unit && (
                    <p>
                      <span className="font-medium">{t("product.unit")}:</span>
                      {unit}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">{t("product.stock")}:</span>
                    {stockQuantity} {unit || t("product.piece")}
                  </p>
                  {discount > 0 && (
                    <p>
                      <span className="font-medium">
                        {t("product.discount")}:
                      </span>
                      {t("product.with_discount", { discount })}
                    </p>
                  )}

                  {shortDescription && (
                    <p className="pt-2">{shortDescription}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button
            onClick={closeModal}
            className="absolute top-4 cursor-pointer right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X size={32} />
          </button>

          <div className="relative w-full h-full flex items-center justify-center">
            {images.length > 1 && (
              <button
                onClick={handleModalPrev}
                className="absolute left-4 p-3 cursor-pointer text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full"
              >
                <ChevronLeft size={32} />
              </button>
            )}

            <div className="relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center">
              <Image
                src={images[modalActiveIndex] || "/images/placeholder.png"}
                alt="Product image fullscreen"
                fill
                className={clsx(
                  "object-contain transition-transform duration-500 ease-in-out",
                  modalAnimate &&
                    modalDirection === "right" &&
                    "animate-slide-in-right",
                  modalAnimate &&
                    modalDirection === "left" &&
                    "animate-slide-in-left"
                )}
                key={`modal-${selectedVariant}-${modalActiveIndex}`}
              />
            </div>

            {images.length > 1 && (
              <button
                onClick={handleModalNext}
                className="absolute right-4 cursor-pointer p-3 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full"
              >
                <ChevronRight size={32} />
              </button>
            )}

            {images.length > 1 && (
              <div className="absolute bottom-4 left-320 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                {modalActiveIndex + 1} / {images.length}
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-[80vw] overflow-x-auto">
              {images.map((img, index) => (
                <button
                  key={`modal-thumb-${index}`}
                  onClick={() => {
                    setModalDirection(
                      index > modalActiveIndex ? "right" : "left"
                    );
                    setModalAnimate(true);
                    setModalActiveIndex(index);
                  }}
                  className={clsx(
                    "flex-shrink-0 w-16 h-16 cursor-pointer rounded-lg overflow-hidden border-2 transition-all",
                    modalActiveIndex === index
                      ? "border-white"
                      : "border-transparent opacity-60 hover:opacity-80"
                  )}
                >
                  <Image
                    src={img}
                    alt={`thumbnail ${index + 1}`}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
