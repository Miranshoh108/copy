"use client";
import { useState, useEffect, useRef, Suspense } from "react";
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
import { useSearchParams } from "next/navigation";

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
  loading: () => <SkeletonLoader />,
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

function ResultsProductContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sliderWidth, setSliderWidth] = useState(6);
  const [mounted, setMounted] = useState(false);
  const sliderRef = useRef(null);
  const skeletonCount = useSkeletonCount();
  const currentCategoryId =
    searchParams?.get("category") || "689dc67ee9443d84b885e451";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (!currentCategoryId) {
        setError("No category ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await $api.get(
          `/products/get/query?category=${currentCategoryId}`
        );

        if (response.status === 200 && response.data && response.data.results) {
          const categoryProducts = response.data.results.map((product) => {
            const bestDiscountVariant =
              product.variants && product.variants.length > 0
                ? product.variants.reduce(
                    (best, current) =>
                      (current.discount || 0) > (best.discount || 0)
                        ? current
                        : best,
                    product.variants[0]
                  )
                : null;

            let imageUrl = "/placeholder.png";
            if (product.mainImage) {
              const cleanPath = product.mainImage.replace(/\\/g, "/");
              imageUrl = `${
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
              }/${cleanPath}`;
            }

            const getProductName = () => {
              switch (i18next.language) {
                case "ru":
                  return product.name_ru || product.name;
                case "en":
                  return product.name_en || product.name;
                default:
                  return product.name;
              }
            };

            const getProductDescription = () => {
              switch (i18next.language) {
                case "ru":
                  return (
                    product.shortDescription_ru || product.shortDescription
                  );
                case "en":
                  return (
                    product.shortDescription_en || product.shortDescription
                  );
                default:
                  return product.shortDescription;
              }
            };

            return {
              ...product,
              id: product._id,
              name: getProductName(),
              shortDescription: getProductDescription(),
              image: imageUrl,
              mainVariant: bestDiscountVariant,
              discountedVariants: product.variants
                ? product.variants.filter(
                    (variant) => (variant.discount || 0) > 0
                  )
                : [],
              price: bestDiscountVariant?.price || 0,
              discountedPrice:
                bestDiscountVariant?.discountedPrice ||
                bestDiscountVariant?.price ||
                0,
              discount: bestDiscountVariant?.discount || 0,
            };
          });

          setProducts(categoryProducts);
        } else {
          console.log("No results found in response");
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching category products:", error);
        setError(`Error loading products: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [currentCategoryId, i18next.language]);

  const sliderSettings = {
    dots: false,
    infinite: products.length > 6,
    speed: 500,
    slidesToShow: Math.min(sliderWidth, products.length, 6),
    slidesToScroll: 1,
    arrows: products.length > 6,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    variableHeight: true,
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

  if (loading) {
    return (
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-6 max-[500px]:px-1">
          <div className="flex gap-4 overflow-hidden">
            {[...Array(skeletonCount)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6 max-[500px]:px-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 max-[500px]:font-medium max-[500px]:text-xl max-[500px]:px-2">
              {mounted ? t("catagories1.title") : ""}
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

  // Return null (hide component) if products count is less than 6
  if (products.length < 7) {
    return null;
  }

  return (
    <section className="py-4">
      <div className="max-w-7xl mx-auto px-6 max-[500px]:px-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 max-[500px]:font-medium max-[500px]:text-xl max-[500px]:px-2">
            {mounted ? t("catagories1.title") : ""}
          </h2>
        </div>

        {products.length <= 6 ? (
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
                <div key={product._id} className="px-2">
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

export default function ResultsProduct() {
  const skeletonCount = useSkeletonCount();
  return (
    <Suspense
      fallback={
        <section className="py-4">
          <div className="max-w-7xl mx-auto px-6 max-[500px]:px-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 max-[500px]:font-medium max-[500px]:text-xl max-[500px]:px-2">
                Loading...
              </h2>
            </div>
            <div className="flex gap-4 overflow-hidden">
              {[...Array(skeletonCount)].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </section>
      }
    >
      <ResultsProductContent />
    </Suspense>
  );
}
