"use client";
import { useState, useEffect, Suspense } from "react";
import ProductCard from "../../components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
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

// Har bir breakpoint uchun to'liq qatorlar sonini hisoblash funksiyasi
function getCompleteRowsCount(totalProducts) {
  const width = window.innerWidth;
  let itemsPerRow;

  if (width <= 640) {
    itemsPerRow = 2;
  } else if (width <= 768) {
    itemsPerRow = 3;
  } else if (width <= 1024) {
    itemsPerRow = 4;
  } else if (width <= 1330) {
    itemsPerRow = 5;
  } else {
    itemsPerRow = 6;
  }

  // To'liq qatorlar sonini hisoblash
  const completeRows = Math.floor(totalProducts / itemsPerRow);
  return completeRows * itemsPerRow;
}

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md flex flex-col w-full relative h-full">
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

function HealthProductContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [displayProducts, setDisplayProducts] = useState([]);
  const skeletonCount = useSkeletonCount();
  const currentCategoryId =
    searchParams?.get("category") || "689dc92de9443d84b885e483";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Ekran o'lchami o'zgarganda mahsulotlarni qayta hisoblash
  useEffect(() => {
    if (products.length > 0) {
      const completeRowsCount = getCompleteRowsCount(products.length);
      setDisplayProducts(products.slice(0, completeRowsCount));
    }
  }, [products]);

  // Window resize event listener qo'shish
  useEffect(() => {
    const handleResize = () => {
      if (products.length > 0) {
        const completeRowsCount = getCompleteRowsCount(products.length);
        setDisplayProducts(products.slice(0, completeRowsCount));
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [products]);

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

          // 30 ta mahsulotgacha olamiz
          const limitedProducts = categoryProducts.slice(0, 30);
          setProducts(limitedProducts);

          // To'liq qatorlar sonini hisoblash va ko'rsatish
          const completeRowsCount = getCompleteRowsCount(
            limitedProducts.length
          );
          setDisplayProducts(limitedProducts.slice(0, completeRowsCount));
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

 

  return (
    <section className="py-4">
      <div className="max-w-7xl mx-auto px-6 max-[500px]:px-1">
        {loading ? (
          <div className="max-w-7xl mx-auto px-6 max-[500px]:px-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 max-[500px]:gap-2">
              {[...Array(30)].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          </div>
        ) : displayProducts.length === 0 ? ("") : (
          <div className="max-w-7xl mx-auto ">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 max-[500px]:gap-2">
              {displayProducts.map((product) => (
                <div
                  key={product.id}
                  className="w-full flex items-center justify-center"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default function HealthProduct() {
  const skeletonCount = useSkeletonCount();
  return (
    <Suspense
      fallback={
        <section className="py-4">
          <div className="max-w-7xl mx-auto px-6 max-[500px]:px-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 max-[500px]:gap-2">
              {[...Array(30)].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </section>
      }
    >
      <HealthProductContent />
    </Suspense>
  );
}
