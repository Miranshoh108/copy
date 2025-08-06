"use client"; 

import NewProducts from "@/app/components/NewProducts";
import ProductDetail from "../../components/DetailCard/ProductDetail";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { notFound } from "next/navigation";

export default function ProductDetailPage() {
  if (!product) {
    notFound(); 
  }

  return (
    <div className="flex flex-col">
      <Navbar className="w-full" />
      <main className="bg-[#ECF4FF] flex items-center justify-center">
        <div className="w-full max-w-[1240px] py-6">
          <ProductDetail />
          <NewProducts />
        </div>
      </main>
      <Footer className="mt-auto" />
    </div>
  );
}
