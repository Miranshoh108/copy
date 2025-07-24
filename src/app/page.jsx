import Head from "next/head";
import HeroBanner from "./components/Herobanner";
import Footer from "./components/Footer";
import BestSellers from "./components/BestSellers";
import NewProducts from "./components/NewProducts";
import Navbar from "./components/Navbar";
import Showcase from "./components/Showcase";

export default function Home() {
  return (
    <div className="bg-[#ECF4FF]">
      <Head>
        <title>Bojxona Servis</title>
        <meta name="description" content="Online shopping platform" />
      </Head>
      <Navbar />
      <HeroBanner />
      <BestSellers />
      <NewProducts />
      <BestSellers />
      <NewProducts />
      <Showcase />
      <BestSellers />
      <NewProducts />
      <BestSellers />
      <NewProducts />
      <Footer />
    </div>
  );
}
