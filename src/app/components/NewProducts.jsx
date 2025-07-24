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

export default function NewProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sliderWidth, setSliderWidth] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://gw.texnomart.uz/api/web/v1/home/special-products?type=hit_products"
        );
        if (response.status === 200) {
          setProducts(response.data.data.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

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
    infinite: true,
    speed: 500,
    slidesToShow: sliderWidth,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 4 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 2 },
      },
    ],
  };

  return (
    <section className="py-8 ">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Yangi mahsulotlar
          </h2>
          <Link href={"#"} className="flex items-center gap-2 text-blue-500">
            Barchasini ko`&apos;rish <MoveRight />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
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
                <div key={product.id} className="px-2">
                  <ProductCard product={product} />
                </div>
              ))}
            </Slider>
          </div>
        )}
      </div>
    </section>
  );
}
