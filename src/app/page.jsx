"use client";
import Head from "next/head";
import HeroBanner from "./components/Herobanner";
import MobilBanner from "./components/MobilBaner";
import Footer from "./components/Footer";
import BestSellers from "./pages/bestsellers/page";
import SportProduct from "./pages/sport/page";
import HouseholdProduct from "./pages/household/page";
import HobbiesProduct from "./pages/hobbies/page";
import ClothesProduct from "./pages/clothes/page";
import ResultsProduct from "./pages/results/page";
import ComputerProduct from "./pages/computer/page";
import GoodsProduct from "./pages/goods/page";
import ShoesProduct from "./pages/shoes/page";
import SubstancesProduct from "./pages/substances/page";
import HealthProduct from "./pages/health/page";
import DiscountedProducts from "./pages/discounted/page";
import CatagoriesProduct from "./pages/catagoriesproduct/catagoriesproduct";
import Navbar from "./components/Navbar";
import Showcase from "./components/Showcase";
import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import FooterBanner from "./components/FooterBaner";
import MobilShowcase from "./components/MobilShowcase";
import MobilFooterBanner from "./components/FooterMobil";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const loadingRef = useRef(false); // Bir vaqtda faqat bitta loading bo'lishi uchun

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BS Market",
    url: "https://bsmarket.uz",
    description:
      "O'zbekistondagi eng yaxshi onlayn do'kon - elektronika, kiyim, uy-ro'zg'or buyumlari va boshqa mahsulotlar",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://bsmarket.uz/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const componentGroups = [
    [
      <HeroBanner key="hero1" />,
      <MobilBanner key="mobil" />,
      <BestSellers key="bestsellers" />,
      <DiscountedProducts key="discounted" />,
      <ResultsProduct key="results" />,
      <Suspense fallback={<div>Loading...</div>} key="categories">
        <CatagoriesProduct />
      </Suspense>,
    ],
    [
      <Showcase key="showcase" />,
      <MobilShowcase key="mobilshowcase" />,
      <SportProduct key="sport" />,
      <HouseholdProduct key="household" />,
      <HobbiesProduct key="hobbies" />,
      <ClothesProduct key="clothes" />,
    ],
    [
      <FooterBanner key="footerbaner" />,
      <MobilFooterBanner key="mobilfooterbaner" />,
      <ComputerProduct key="computer" />,
      <GoodsProduct key="goods" />,
      <ShoesProduct key="shoes" />,
      <SubstancesProduct key="substances" />,
      <HealthProduct key="health" />,
    ],
  ];

  const loadMore = useCallback(() => {
    if (loadingRef.current || currentPage >= componentGroups.length) {
      return;
    }

    loadingRef.current = true;
    setIsLoading(true);

    // Timeout bilan yangi kontentni yuklash
    setTimeout(() => {
      setCurrentPage((prev) => prev + 1);
      setIsLoading(false);
      loadingRef.current = false;
    }, 800);
  }, [currentPage, componentGroups.length]);

  const handleScroll = useCallback(() => {
    // Agar loading yoki oxirgi sahifada bo'lsa, return qil
    if (loadingRef.current || currentPage >= componentGroups.length) {
      return;
    }

    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Footer yaqinida bo'lganda trigger qil
    const scrollPercentage = (scrollTop + windowHeight) / documentHeight;
    const triggerPoint = 0.85; // 85% scroll qilganda

    if (scrollPercentage >= triggerPoint) {
      loadMore();
    }
  }, [currentPage, loadMore, componentGroups.length]);

  useEffect(() => {
    let ticking = false;

    const scrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", scrollHandler, { passive: true });
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [handleScroll]);

  const renderComponents = () => {
    let components = [];

    for (let i = 0; i < currentPage && i < componentGroups.length; i++) {
      components = [...components, ...componentGroups[i]];
    }

    return components;
  };

  const hasMoreContent = currentPage < componentGroups.length;

  return (
    <div className="bg-[#ECF4FF]">
      <Head>
        <title>BS Market - O'zbekistondagi Eng Yaxshi Onlayn Do'kon</title>
        <meta
          name="description"
          content="BS Market - O'zbekistondagi eng yaxshi onlayn do'kon. Elektronika, kiyim, uy-ro'zg'or buyumlari va boshqa mahsulotlarni arzon narxlarda xarid qiling. Tez yetkazib berish va sifatli xizmat."
        />
        <meta
          name="keywords"
          content="onlayn do'kon, BS Market, elektronika, kiyim, uy-ro'zg'or, O'zbekiston, xarid, arzon narx, tez yetkazib berish"
        />
        <meta name="author" content="BS Market" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="uz" />
        <meta name="revisit-after" content="1 days" />

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="canonical" href="https://bsmarket.uz" />

        <link rel="icon" type="image/png" href="/images/Logo.png" />
        <link rel="apple-touch-icon" href="/images/Logo.png" />

        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="BS Market - O'zbekistondagi Eng Yaxshi Onlayn Do'kon"
        />
        <meta
          property="og:description"
          content="O'zbekistondagi eng yaxshi onlayn do'kon - elektronika, kiyim, uy-ro'zg'or buyumlari va boshqa mahsulotlar"
        />
        <meta property="og:url" content="https://bsmarket.uz" />
        <meta property="og:site_name" content="BS Market" />
        <meta
          property="og:image"
          content="https://bsmarket.uz/images/og-image.jpg"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="uz_UZ" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="BS Market - O'zbekistondagi Eng Yaxshi Onlayn Do'kon"
        />
        <meta
          name="twitter:description"
          content="O'zbekistondagi eng yaxshi onlayn do'kon - elektronika, kiyim, uy-ro'zg'or buyumlari va boshqa mahsulotlar"
        />
        <meta
          name="twitter:image"
          content="https://bsmarket.uz/images/og-image.jpg"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//api.bsmarket.uz" />

        <link rel="preload" href="/images/Logo.png" as="image" />
      </Head>

      <Navbar />

      <div className="min-h-screen">
        {renderComponents()}

        {isLoading && hasMoreContent && (
          <div className="flex justify-center py-8">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#249B73]"></div>
              <span className="text-[#249B73] font-medium text-lg">
                Yuklanmoqda...
              </span>
            </div>
          </div>
        )}
      </div>

      <div data-footer>
        <Footer />
      </div>
    </div>
  );
}
