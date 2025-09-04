"use client";
import { useState, useEffect, useRef } from "react";
import "rc-slider/assets/index.css";
import ProductCard from "../../components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight } from "lucide-react";
import $api from "@/app/http/api";
import { useTranslation } from "react-i18next";
import i18next from "@/i18n/i18n";

function useSkeletonCount() {
  const [skeletonCount, setSkeletonCount] = useState(null);

  useEffect(() => {
    const updateSkeletonCount = () => {
      const width = window.innerWidth;
      if (width <= 640) {
        setSkeletonCount(2);
      } else if (width <= 768) {
        setSkeletonCount(3);
      } else if (width <= 1024) {
        setSkeletonCount(4);
      } else if (width <= 1330) {
        setSkeletonCount(5);
      } else {
        setSkeletonCount(6);
      }
    };

    updateSkeletonCount();

    window.addEventListener("resize", updateSkeletonCount);

    return () => window.removeEventListener("resize", updateSkeletonCount);
  }, []);

  return skeletonCount;
}

const Slider = dynamic(() => import("react-slick"), {
  ssr: false,
});

function SkeletonLoader() {
  const skeletonCount = useSkeletonCount();

  return (
    <div className="flex gap-4 overflow-hidden">
      {[...Array(skeletonCount)].map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md flex flex-col w-[190px] max-[420px]:w-[180px] max-[400px]:w-[170px] max-[380px]:w-[160px] max-[361px]:w-[150px] relative h-full">
      <div className="flex-grow">
        <Skeleton className="w-full h-[210px] mb-2 rounded-t-lg" />

        <div className="min-h-[45px] flex flex-col justify-center px-2 mt-[2px]">
          <Skeleton className="h-4 w-1/2 mb-1" />
          <Skeleton className="h-5 w-3/4" />
        </div>

        <div className="px-2">
          <Skeleton className="h-5 w-full mb-2" />
        </div>

        <div className="px-2">
          <Skeleton className="h-4 w-2/3 mb-1" />
        </div>
      </div>

      <div className="p-2 mt-auto">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-full rounded-lg" />
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
      className="absolute -right-10 max-[800px]:hidden top-1/2 transform -translate-y-1/2 z-10 cursor-pointer bg-white rounded-full shadow p-2 hover:bg-gray-200 transition max-[1330px]:right-0"
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
      className="absolute -left-10 max-[800px]:hidden top-1/2 transform -translate-y-1/2 z-10 cursor-pointer bg-white rounded-full shadow p-2 hover:bg-gray-200 transition max-[1330px]:-left-5"
    >
      <ChevronLeft />
    </div>
  );
};

export default function BestSellers() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const sliderRef = useRef(null);
  const skeletonCount = useSkeletonCount(); 

  useEffect(() => {
    setMounted(true);
  }, []);

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

            let imageUrl = "/placeholder.png";
            if (item.mainImage) {
              const cleanPath = item.mainImage.replace(/\\/g, "/");
              imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/${cleanPath}`;
            }

            const getLocalizedName = () => {
              switch (i18next.language) {
                case "ru":
                  return item.name_ru || item.name;
                case "en":
                  return item.name_en || item.name;
                default:
                  return item.name;
              }
            };

            const getLocalizedDescription = () => {
              switch (i18next.language) {
                case "ru":
                  return item.description_ru || item.description;
                case "en":
                  return item.description_en || item.description;
                default:
                  return item.description;
              }
            };

            return {
              id: item._id,
              name: getLocalizedName(),
              name_ru: item.name_ru,
              name_en: item.name_en,
              description: getLocalizedDescription(),
              price: variant.price || 0,
              discount: variant.discount || 0,
              discountedPrice: variant.discountedPrice || variant.price || 0,
              image: imageUrl,
              variants: item.variants || [],
              mainImage: item.mainImage,
              reviews_count: item.reviews_count || 0,
            };
          });

          setProducts(mappedProducts);
        } else {
          throw new Error(t("bestsellers.data_format_error"));
        }
      } catch (error) {
        console.error("Mahsulotlarni yuklashda xatolik:", error);
        setError(error.message || t("bestsellers.loading_error"));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [i18next.language, t]);

  const sliderSettings = {
    dots: false,
    infinite: products.length > skeletonCount,
    speed: 500,
    slidesToShow: Math.min(skeletonCount, products.length),
    slidesToScroll: 1,
    arrows: products.length > skeletonCount,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1330,
        settings: {
          slidesToShow: Math.min(5, products.length),
          infinite: products.length > 5,
          arrows: products.length > 5,
        },
      },
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
        <div className="max-w-7xl mx-auto px-6 max-[500px]:px-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 max-[500px]:font-medium max-[500px]:text-xl max-[500px]:px-2">
              {mounted ? t("bestsellers.title") : ""}
            </h2>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600">
              {mounted ? t("bestsellers.error_message") : ""}: {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
            >
              {mounted ? t("bestsellers.retry_button") : ""}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4">
      <div className="max-w-7xl mx-auto px-6 max-[500px]:px-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 max-[500px]:font-medium max-[500px]:text-xl max-[500px]:px-2">
            {mounted ? t("bestsellers.title") : ""}
          </h2>
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {[...Array(skeletonCount)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {mounted ? t("bestsellers.no_products") : ""}
          </div>
        ) : products.length <= skeletonCount ? (
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
