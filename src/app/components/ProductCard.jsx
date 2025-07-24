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

  const {
    name,
    image,
    id,
    sale_price, // actual price field
    axiom_monthly_price,
    stickers,
    reviews_count,
  } = product;

  // Check if product is liked
  const isLiked = likes.some((item) => item.id === id);

  const handleLike = (e) => {
    e.stopPropagation();
    toggleLike({
      name,
      price: sale_price,
      image,
      id,
      sale_price,
      axiom_monthly_price,
      reviews_count,
    });
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setIsLoading(true); // Loadingni yoqamiz

    setTimeout(() => {
      addCart({
        ...product,
        quantity: 1,
        checked: false,
      });

      setAdded(true);
      setQuantity(1);
      setIsLoading(false); // Loading tugadi
    }, 300); 
  };

  const handleProductClick = () => {
    setCurrentProduct(product); 
    router.push(`/product/${id}`);
  };

  return (
    <div
      className="group bg-white rounded-lg shadow-md p-4 flex flex-col relative cursor-pointer hover:shadow-lg transition-shadow h-full"
      onClick={handleProductClick}
    >

      <button
        onClick={handleLike}
        className={`cursor-pointer absolute top-2 right-2 z-10 transition-colors hover:scale-110 ${
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
        <div className="relative w-full h-36 mb-3">
          <Image
            src={image || "/images/placeholder-product.jpg"}
            alt={name}
            className="object-contain"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <p className="text-lg font-bold text-gray-800">{sale_price} so'm</p>
        <h3 className="text-gray-800 font-medium mt-1 line-clamp-2 h-12">
          {name}
        </h3>

        {axiom_monthly_price && (
          <p className="text-gray-500 text-sm mt-1">{axiom_monthly_price}</p>
        )}
      </div>

      <div className="mt-3">
        <p className="text-gray-500 text-xs">{reviews_count || 0} ta sharh</p>
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
              <span className="font-medium">Savatga qo‘shish</span>
            </button>
          ) : (
            <div className="w-full flex items-center justify-between border border-[#0D63F5] rounded-lg px-4 py-2 bg-white shadow-sm transition-all duration-300">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (quantity === 1) {
                    setQuantity(0);
                    removeCart(product.id); // Savatchadan olib tashlash
                  } else {
                    const newQty = quantity - 1;
                    setQuantity(newQty);
                    updateQuantity(product.id, newQty); // Savatchani yangilash
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
                  updateQuantity(product.id, newQty); // Savatchani yangilash
                }}
                className="text-xl cursor-pointer text-[#4caf50] font-bold hover:scale-110 transition-transform duration-200"
                title="Qo‘shish"
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
