"use client";

import React, { useState } from "react";
import Footer from "../components/Footer";
import Head from "next/head";
import Navbar from "../components/Navbar";
import { useCartStore } from "../components/hooks/cart";
import CartProduct from "../components/CartProduct";
import Image from "next/image";
import Button from "../components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/hooks/useAuth";
import NewProducts from "../components/NewProducts";

export default function Cart() {
  const { cart, onChecked, offChecked, getTotalPrice, getCheckedCount } =
    useCartStore();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");
  const { isAuthenticated, loading: authLoading } = useAuth();
  const isAllChecked = cart.every((item) => item.checked);
  const subtotal = getTotalPrice();
  const checkedCount = getCheckedCount();
  const route = useRouter();

  const promoCodes = {
    UZUM10: { discount: 10, type: "percent", description: "10% chegirma" },
    WELCOME15: { discount: 15, type: "percent", description: "15% chegirma" },
    SAVE50000: {
      discount: 50000,
      type: "fixed",
      description: "50,000 so'm chegirma",
    },
    NEWUSER: {
      discount: 20,
      type: "percent",
      description: "20% chegirma yangi foydalanuvchi uchun",
    },
  };

  const toggleChecked = () => {
    if (isAllChecked) {
      offChecked();
    } else {
      onChecked();
    }
  };
  const handleCheckout = () => {
    if (checkedCount === 0) return;

    if (!isAuthenticated && !authLoading) {
      localStorage.setItem("redirectAfterLogin", "/checkout");
      route.push("/register");
      return;
    }

    // Tanlangan mahsulotlarni olish
    const selectedItems = cart.filter((item) => item.checked);

    // Yangi buyurtma yaratish
    const newOrder = {
      id: Date.now(), // noyob ID
      status: "processing",
      date: new Date().toLocaleDateString("uz-UZ"),
      total: total.toLocaleString(),
      items: selectedItems.length,
      products: selectedItems,
    };

    // Eski buyurtmalarni olish
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");

    // Yangisini qo‘shish
    const updatedOrders = [newOrder, ...existingOrders];
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    // Optionally: Tanlangan mahsulotlarni savatchadan o‘chirish
    const remainingCart = cart.filter((item) => !item.checked);
    localStorage.setItem("cart", JSON.stringify(remainingCart));

    // Checkout sahifasiga o'tish
    route.push("/checkout");
  };

  const applyPromoCode = () => {
    const code = promoCode.toUpperCase().trim();
    if (promoCodes[code]) {
      setAppliedPromo({ code, ...promoCodes[code] });
      setPromoError("");
    } else {
      setPromoError("Promokod topilmadi yoki yaroqsiz");
      setAppliedPromo(null);
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoCode("");
    setPromoError("");
  };

  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    if (appliedPromo.type === "percent") {
      return Math.floor((subtotal * appliedPromo.discount) / 100);
    }
    return Math.min(appliedPromo.discount, subtotal);
  };

  const discount = calculateDiscount();
  const total = subtotal - discount;
  const delivery = subtotal > 200000 ? 0 : 25000;
  const finalTotal = total + delivery;

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Savatcha - Bojxona Servis</title>
        <meta name="description" content="Online shopping platform" />
      </Head>

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {cart.length === 0 ? (
          // Empty Cart State - Uzum style
          <div className="flex flex-col items-center justify-center min-h-[500px]">
            <div className="text-center max-w-md">
              <div className="mb-8">
                <Image
                  alt="Empty cart"
                  src="/images/no-cart.png"
                  width={200}
                  height={150}
                  className="mx-auto opacity-60"
                />
              </div>

              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Savatingiz bo'sh
              </h2>

              <p className="text-gray-500 mb-8 leading-relaxed">
                Lekin uni to'ldirish hech qachon kech emas :)
              </p>

              <Button
                onClick={() => route.push("/")}
                className="bg-[#249B73] hover:bg-[#249B73] text-white px-8 py-3 rounded-lg font-medium cursor-pointer  transition-colors"
              >
                Xarid qilishni boshlash
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items - Left Side */}
            <div className="lg:col-span-2 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Savatcha
                </h1>
                <span className="text-gray-500">{cart.length} ta mahsulot</span>
              </div>

              {/* Enhanced Select All */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={isAllChecked && cart.length > 0}
                        onChange={toggleChecked}
                        className="w-5 h-5 text-[#249B73] border-2 cursor-pointer  border-gray-300 rounded-md focus:ring-2 focus:ring-[#249B73] focus:ring-offset-1 transition-all duration-200 group-hover:border-[#249B73]"
                      />
                      {isAllChecked && cart.length > 0 && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <span className="ml-3 text-gray-800 font-medium group-hover:text-[#249B73] transition-colors duration-200">
                      Hammasini tanlash
                    </span>
                  </label>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {checkedCount > 0 && (
                      <span className="bg-green-100 text-[#249B73] px-3 py-1 rounded-full font-medium">
                        {checkedCount} ta tanlandi
                      </span>
                    )}
                    <span className="text-gray-400">
                      {cart.length} ta mahsulot
                    </span>
                  </div>
                </div>

                {/* Progress bar for selected items */}
                {cart.length > 0 && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-[#249B73] h-1.5 rounded-full transition-all duration-300 outline-none"
                        style={{
                          width: `${(checkedCount / cart.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Products List */}
              <div className="space-y-3">
                {cart.map((product, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200"
                  >
                    <CartProduct product={product} />
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary - Right Side */}
            <div className="space-y-4">
              {/* Promo Code */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="font-semibold text-gray-900 mb-4">Promokod</h3>

                {!appliedPromo ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Promokodni kiriting"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 px-3 py-2 border outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-[#249B73] focus:border-[#249B73]"
                        onKeyPress={(e) =>
                          e.key === "Enter" && applyPromoCode()
                        }
                      />
                      <button
                        onClick={applyPromoCode}
                        className="px-4 py-2 bg-[#249B73] cursor-pointer  text-white rounded-lg hover:bg-[#249B73]transition-colors font-medium"
                      >
                        Qo'llash
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-sm text-red-500">{promoError}</p>
                    )}

                    {/* Available Promo Codes */}
                    {/* <div className="mt-4 space-y-2">
                      <p className="text-sm text-gray-600">
                        Mavjud promokodlar:
                      </p>
                      {Object.entries(promoCodes).map(([code, details]) => (
                        <div
                          key={code}
                          className="text-xs bg-gray-50 p-2 rounded border"
                        >
                          <span className="font-medium text-[#249B73]">
                            {code}
                          </span>
                          <span className="text-gray-600">
                            {" "}
                            - {details.description}
                          </span>
                        </div>
                      ))}
                    </div> */}
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
                    <div>
                      <span className="font-medium text-green-800">
                        {appliedPromo.code}
                      </span>
                      <p className="text-sm text-green-600">
                        {appliedPromo.description}
                      </p>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-red-500 hover:text-red-700 cursor-pointer  p-1"
                      title="O'chirish"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Order Total */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Buyurtmangiz
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Mahsulotlar ({checkedCount} ta):</span>
                    <span>{subtotal.toLocaleString()} so'm</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Chegirma:</span>
                      <span>-{discount.toLocaleString()} so'm</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Yetkazib berish:</span>
                    <span className={delivery === 0 ? "text-green-600" : ""}>
                      {delivery === 0
                        ? "Bepul"
                        : `${delivery.toLocaleString()} so'm`}
                    </span>
                  </div>

              

                  <hr className="my-4" />

                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Jami:</span>
                    <span>{finalTotal.toLocaleString()} so'm</span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full mt-6 bg-[#249B73] hover:bg-[#249B73] text-white py-3 rounded-lg cursor-pointer font-medium transition-colors"
                  disabled={checkedCount === 0 || authLoading}
                >
                  {authLoading ? "Tekshirilmoqda..." : "Buyurtma berish"}
                </Button>

                {checkedCount === 0 && (
                  <p className="text-sm text-gray-500 text-center mt-2">
                    Buyurtma berish uchun kamida bitta mahsulot tanlang
                  </p>
                )}
              </div>

              {/* Benefits */}
              <div className="bg-gradient-to-r from-green-50 to-green-50 rounded-lg p-4 border">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Xavfsiz to'lov
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Tez yetkazib berish
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
