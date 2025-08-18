"use client";
import { useState, useEffect, useRef } from "react";
import "rc-slider/assets/index.css";
import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight, MoveRight } from "lucide-react";
import Link from "next/link";
import $api from "../http/api";
import Image from "next/image";

const Slider = dynamic(() => import("react-slick"), {
  ssr: false,
  loading: () => (
    <div className="flex gap-4">
      <ProductCardSkeleton />
      <ProductCardSkeleton />
      <ProductCardSkeleton />
      <ProductCardSkeleton />
      <ProductCardSkeleton />
      <ProductCardSkeleton />
    </div>
  ),
});

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col w-[200px] h-full">
      <div className="flex-grow">
        <Skeleton className="w-full h-36 mb-3 rounded-md" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-5 w-full mb-1" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="mt-3">
        <Skeleton className="h-4 w-1/2 mb-3" />
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-10 flex-grow" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    </div>
  );
}

const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      className="absolute -right-10 max-[600px]:hidden top-1/2 transform -translate-y-1/2 z-10 cursor-pointer bg-white rounded-full shadow p-2 hover:bg-gray-200 transition"
    >
      <ChevronRight />
    </div>
  );
};

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      className="absolute -left-10 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer bg-white rounded-full shadow p-2 hover:bg-gray-200 transition"
    >
      <ChevronLeft />
    </div>
  );
};

export default function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sliderWidth, setSliderWidth] = useState(6);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await $api.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products/get/popular`,
          {
            timeout: 10000,
          }
        );

        if (response.data.success && response.data.data) {
          const mappedProducts = response.data.data.map((item) => {
            const variant = item.variants?.[0] || {};

            // Rasm URL
            let imageUrl = "/placeholder.png";
            if (item.mainImage) {
              const cleanPath = item.mainImage.replace(/\\/g, "/");
              imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/${cleanPath}`;
            }

            return {
              id: item._id,
              name: item.name || "Noma'lum mahsulot",
              description: item.description || "",
              price: variant.price || 0,
              discount: variant.discount || 0,
              discountedPrice: variant.discountedPrice || variant.price || 0,
              image: imageUrl,
              variants: item.variants || [], // Pass the entire variants array
              mainImage: item.mainImage,
              reviews_count: item.reviews_count || 0,
            };
          });

          setProducts(mappedProducts);
        } else {
          throw new Error("Ma'lumotlar formatida xatolik");
        }
      } catch (error) {
        console.error("Mahsulotlarni yuklashda xatolik:", error);
        setError(error.message || "Ma'lumotlarni yuklashda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: products.length > 6,
    speed: 500,
    slidesToShow: Math.min(sliderWidth, products.length, 6),
    slidesToScroll: 1,
    arrows: products.length > 6,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(4, products.length),
          infinite: products.length > 4,
          arrows: products.length > 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(3, products.length),
          infinite: products.length > 3,
          arrows: products.length > 3,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: Math.min(2, products.length),
          infinite: products.length > 2,
          arrows: products.length > 2,
        },
      },
    ],
  };

  if (error) {
    return (
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Xit savdo</h2>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600">
              Mahsulotlarni yuklashda xatolik: {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
            >
              Qaytadan urinish
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Xit savdo</h2>
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-x-auto">
            {[...Array(6)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Hozircha mahsulotlar mavjud emas
          </div>
        ) : products.length <= 6 ? (
          <div className="flex gap-4 overflow-x-auto">
            {products.map((product) => (
              <div key={product.id} className="w-[200px] flex-shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="relative">
            <Slider
              {...sliderSettings}
              ref={sliderRef}
              className="slider-transition"
            >
              {products.map((product) => (
                <div key={product.id} className="px-2">
                  <div className="w-[200px]">
                    <ProductCard product={product} />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        )}
      </div>
    </section>
  );
}
