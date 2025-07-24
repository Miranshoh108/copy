"use client";

import { useCartStore } from "../components/hooks/cart";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/ui/button";

export default function Checkout() {
  const { cart, getCheckedItems, getTotalPrice, clearCart } = useCartStore();
  const { clearCheckedItems } = useCartStore();
  const router = useRouter();
  const checkedItems = getCheckedItems();
  const total = getTotalPrice();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    delivery: "standard",
    payment: "cash",
  });

  useEffect(() => {
    if (checkedItems.length === 0) {
      router.push("/cart");
    }
  }, [checkedItems.length, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      delivery: formData.delivery,
      payment: formData.payment,
      items: checkedItems,
      totalPrice: total,
    };

    try {
      const res = await fetch(
        "https://68282b2f6b7628c529126575.mockapi.io/imtixon",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        const data = await res.json();
        console.log("✅ Buyurtma muvaffaqiyatli yuborildi:", data);

        // 🧹 Savatchani tozalash
        clearCart(); // <-- Bu yerga yozasiz

        // 🔁 Asosiy sahifaga redirect
        router.push("/");
      } else {
        console.error("❌ Serverdan muvaffaqiyatsiz javob:", res.status);
      }
    } catch (error) {
      console.error("❌ Buyurtma yuborishda xatolik:", error);
    }
  };

  return (
    <div>
      <Head>
        <title>Buyurtma berish</title>
        <meta name="description" content="Checkout - Bojxona Servis" />
      </Head>

      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          Buyurtma berish
        </h1>

        {/* Foydalanuvchi Ma'lumotlari */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4 mb-8">
          <h2 className="text-lg font-semibold text-gray-700">
            Shaxsiy ma'lumotlar
          </h2>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ism"
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Telefon raqam"
            className="w-full px-4 py-2 border rounded-md"
          />
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Yetkazib berish manzili"
            className="w-full px-4 py-2 border rounded-md"
            rows="3"
          />
        </div>

        {/* Yetkazib Berish */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4 mb-8">
          <h2 className="text-lg font-semibold text-gray-700">
            Yetkazib berish
          </h2>
          <label className="block cursor-pointer">
            <input
              type="radio"
              name="delivery"
              value="standard"
              checked={formData.delivery === "standard"}
              onChange={handleChange}
              className="mr-2"
            />
            Toshkent shahriga 1 kun
          </label>
          <label className="block cursor-pointer">
            <input
              type="radio"
              name="delivery"
              value="express"
              checked={formData.delivery === "express"}
              onChange={handleChange}
              className="mr-2"
            />
            O'zbekiston Respublikasi viloyatlariga 1-3 kun
          </label>
        </div>

        {/* To‘lov Usuli */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4 mb-8">
          <h2 className="text-lg font-semibold text-gray-700">To‘lov usuli</h2>

          <label className="block cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="card"
              checked={formData.payment === "card"}
              onChange={handleChange}
              className="mr-2"
            />
            Karta orqali
          </label>
        </div>

        {/* Yakuniy Tasdiqlash */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between text-lg font-semibold mb-4">
            <span>Jami:</span>
            <span>{total.toLocaleString()} so'm</span>
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full bg-[#0D63F5] cursor-pointer text-white py-3 rounded-md hover:bg-blue-600"
          >
            Buyurtmani tasdiqlash
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
