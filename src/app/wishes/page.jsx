"use client";

import Head from "next/head";
import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useHomeLikes } from "../components/hooks/likes";
import ProductCard from "../components/ProductCard";
import Image from "next/image";
import Button from "../components/ui/button";
import NewProducts from "../components/NewProducts";

export default function Wishes() {
  const { likes, syncLikesWithBackend } = useHomeLikes();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  useEffect(() => {
    if (token) {
      syncLikesWithBackend(token);
    }
  }, [token]);

  return (
    <div>
      <Head>
        <title>Bojxona Servis</title>
        <meta name="description" content="Online shopping platform" />
      </Head>
      <Navbar />
      <section className="py-8 bg-gray-100">
        {likes.length === 0 ? (
          <div className="flex flex-col items-center text-center px-4">
            <Image
              src={"/images/no-like.png"}
              alt="No image"
              width="100"
              height="400"
              priority
            />
            <p className="text-2xl font-semibold">Sizga yoqqanini qoʻshing</p>
            <p className="text-md py-3 max-w-md">
              Afsuski hozirda siz yoqtirgan mahsulotlar yo'q
            </p>

            <Button className="cursor-pointer mt-2">
              <a href="/">Bosh sahifaga qaytish</a>
            </Button>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              Xit savdo
            </h2>
            <div className="grid grid-cols-7 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {likes.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>
          </div>
        )}
      </section>
      <NewProducts />
      <Footer />
    </div>
  );
}
