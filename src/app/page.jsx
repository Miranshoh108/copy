import Head from "next/head";
import HeroBanner from "./components/Herobanner";
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
import { Suspense } from "react";
export default function Home() {
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

        {/* Viewport va responsive */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://bsmarket.uz" />

        {/* Favicon */}
        <link rel="icon" type="image/png" href="/images/Logo.png" />
        <link rel="apple-touch-icon" href="/images/Logo.png" />

        {/* Open Graph Meta Tags (Facebook) */}
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
      <HeroBanner />
      <BestSellers />
      <DiscountedProducts />
      <ResultsProduct />
      <Suspense fallback={<div>Loading...</div>}>
        <CatagoriesProduct />
      </Suspense>
      <Showcase />
      <SportProduct />
      <HouseholdProduct />
      <HobbiesProduct />
      <ClothesProduct />
      <HeroBanner />
      <ComputerProduct />
      <GoodsProduct />
      <ShoesProduct />
      <SubstancesProduct />
      <HealthProduct />
      <Footer />
    </div>
  );
}
