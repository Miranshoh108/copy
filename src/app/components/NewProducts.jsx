"use client";
import { useState, useEffect, useRef } from "react";
import "rc-slider/assets/index.css";
import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight, MoveRight } from "lucide-react";
import Link from "next/link";
import $api from "../http/api";

const Slider = dynamic(() => import("react-slick"), {
  ssr: false,
  loading: () => (
    <div className="flex gap-4">
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
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col w-full h-full">
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
      className="absolute max-[600px]:hidden -left-10 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer bg-white rounded-full shadow p-2 hover:bg-gray-200 transition"
    >
      <ChevronLeft />
    </div>
  );
};

export default function DiscountedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sliderWidth, setSliderWidth] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchDiscountedProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await $api.get("/products/get/discounted");

        if (response.status === 200) {
          const discountedProducts = response.data.productsWithDiscount.map(
            (product) => {
              const bestDiscountVariant = product.variants.reduce(
                (best, current) =>
                  current.discount > best.discount ? current : best,
                product.variants[0]
              );

              return {
                ...product,
                mainVariant: bestDiscountVariant,
                discountedVariants: product.variants.filter(
                  (variant) => variant.discount > 0
                ),
              };
            }
          );

          setProducts(discountedProducts);
        }
      } catch (error) {
        console.error("Error fetching discounted products:", error);
        setError("Chegirmali mahsulotlarni yuklashda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    fetchDiscountedProducts();

    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        setSliderWidth(5);
      } else if (width >= 1024) {
        setSliderWidth(4);
      } else if (width >= 768) {
        setSliderWidth(3);
      } else {
        setSliderWidth(2);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: products.length > sliderWidth,
    speed: 500,
    slidesToShow: Math.min(sliderWidth, products.length),
    slidesToScroll: 1,
    arrows: products.length > sliderWidth,
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
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Qayta urinib ko'ring
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Chegirmali mahsulotlar
          </h2>
          <Link
            href="/discounted-products"
            className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition"
          >
            Barchasini ko&apos;rish <MoveRight />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              Hozirda chegirmali mahsulotlar mavjud emas
            </p>
          </div>
        ) : (
          <div className="relative">
            <Slider
              {...sliderSettings}
              ref={sliderRef}
              className={`slider-transition ${
                loading ? "slider-loading" : "slider-loaded"
              }`}
            >
              {products.map((product) => (
                <div key={product._id} className="px-2">
                  <ProductCard
                    product={{
                      ...product,
                      id: product._id,
                      mainImage: product.mainImage,
                      variants: product.variants,
                      price: product.mainVariant?.price,
                      discountedPrice: product.mainVariant?.discountedPrice,
                      discount: product.mainVariant?.discount,
                    }}
                  />
                </div>
              ))}
            </Slider>
          </div>
        )}
      </div>
    </section>
  );
}
