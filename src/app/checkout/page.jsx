"use client";
import { useCartStore } from "../components/hooks/cart";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import $api from "../http/api";
import OrderItems from "./pages/OrderItems";
import PickupPoints from "./pages/PickupPoints";
import PaymentMethod from "./pages/PaymentMethod";
import OrderSummary from "./pages/OrderSummary";
import ProductModal from "./pages/ProductModal";

export default function Checkout() {
  const { getCheckedItems, getTotalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const checkedItems = getCheckedItems();
  const total = getTotalPrice();

  // Delivery calculation qilish uchun ref
  const deliveryCalculationRef = useRef(null);
  const isCalculatingRef = useRef(false);

  const [userProfile, setUserProfile] = useState(null);
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [pickupPoints, setPickupPoints] = useState([]);
  const [allPickupPoints, setAllPickupPoints] = useState([]);
  const [selectedPickupPoint, setSelectedPickupPoint] = useState(null);
  const [loadingPickupPoints, setLoadingPickupPoints] = useState(false);
  const [formData, setFormData] = useState({
    payment: "card",
  });
  const [loading, setLoading] = useState(true);
  const [regionsLoading, setRegionsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // Yetkazib berish uchun state'lar
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [loadingDelivery, setLoadingDelivery] = useState(false);
  const [deliveryError, setDeliveryError] = useState(null);

  // Foydalanuvchi profilini olish
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await $api.get("/users/profile/me");
        setUserProfile(response.data.myProfile);
      } catch (error) {
        console.error(
          "❌ Foydalanuvchi ma'lumotlarini olishda xatolik:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Viloyatlarni olish
  useEffect(() => {
    const fetchRegions = async () => {
      setRegionsLoading(true);
      try {
        const response = await $api.get("/emu/get/regions");
        if (response.data?.json?.regionlist?.city) {
          setRegions(response.data.json.regionlist.city);
        }
      } catch (error) {
        console.error("❌ Viloyatlarni olishda xatolik:", error);
      } finally {
        setRegionsLoading(false);
      }
    };

    fetchRegions();
  }, []);

  // Savatda mahsulot yo'q bo'lsa cart sahifasiga o'tish
  useEffect(() => {
    if (checkedItems.length === 0) {
      router.push("/cart");
    }
  }, [checkedItems.length, router]);

  // PVZ larni olish
  useEffect(() => {
    const fetchPickupPoints = async () => {
      if (!selectedRegion) {
        setPickupPoints([]);
        setAllPickupPoints([]);
        setSelectedPickupPoint(null);
        // Delivery info ni tozalash
        setDeliveryInfo(null);
        setDeliveryError(null);
        return;
      }

      setLoadingPickupPoints(true);
      try {
        const response = await $api.get("/emu/get/uzbekistan/pvz");

        if (response.data?.data?.pvzlist?.pvz) {
          const allPoints = response.data.data.pvzlist.pvz;
          const selectedRegionData = regions.find(
            (region) => region.code[0] === selectedRegion
          );

          if (selectedRegionData) {
            if (selectedRegionData.name[0] === "UZBEKISTAN") {
              setAllPickupPoints(allPoints);
              setPickupPoints(allPoints);
              if (allPoints.length > 0) {
                setSelectedPickupPoint(allPoints[0]);
              }
            } else {
              const filteredPoints = allPoints.filter(
                (point) =>
                  point.town[0].$.regioncode === selectedRegionData.code[0] ||
                  point.town[0].$.regionname === selectedRegionData.name[0]
              );

              setAllPickupPoints(filteredPoints);
              setPickupPoints(filteredPoints);
              if (filteredPoints.length > 0) {
                setSelectedPickupPoint(filteredPoints[0]);
              }
            }
          }
        }
      } catch (error) {
        console.error("❌ PVZ larni olishda xatolik:", error);
        setPickupPoints([]);
        setAllPickupPoints([]);
        setSelectedPickupPoint(null);
      } finally {
        setLoadingPickupPoints(false);
      }
    };

    fetchPickupPoints();
  }, [selectedRegion, regions]);

  // Delivery calculation function
  const calculateDelivery = useCallback(async () => {
    if (
      !selectedPickupPoint ||
      !checkedItems.length ||
      !userProfile ||
      isCalculatingRef.current
    ) {
      return;
    }

    // Agar aynan shu pickup point uchun allaqachon hisoblangan bo'lsa, qayta hisoblamaymiz
    const currentCalculationKey = `${selectedPickupPoint.code[0]}-${
      checkedItems.length
    }-${JSON.stringify(
      checkedItems.map((item) => ({ id: item.id, quantity: item.quantity }))
    )}`;
    if (deliveryCalculationRef.current === currentCalculationKey) {
      return;
    }

    isCalculatingRef.current = true;
    deliveryCalculationRef.current = currentCalculationKey;
    setLoadingDelivery(true);
    setDeliveryError(null);

    try {
      const totalWeight = checkedItems.reduce((acc, item) => {
        const itemWeight = item.weight || 1;
        return acc + itemWeight * item.quantity;
      }, 0);

      const selectedRegionData = regions.find(
        (region) => region.code[0] === selectedRegion
      );

      const packages = checkedItems.map((item, index) => ({
        id: index + 1,
        weight: (item.weight || 1) * item.quantity,
        length: 10,
        width: 10,
        height: 10,
        name: item.name || item.title || `Mahsulot ${index + 1}`,
        price: parseFloat(
          (item.variant?.price || item.price || 0)
            .toString()
            .replace(/[^\d.-]/g, "")
        ),
        quantity: item.quantity,
      }));

      const deliveryData = {
        senderTown: "Ташкент",
        senderAddress: "Amir Temur ko'chasi 12",
        senderLat: "41.2995",
        senderLon: "69.2401",

        receiverTown:
          selectedPickupPoint.town[0]._ ||
          selectedPickupPoint.town[0].$.regionname,
        receiverRegionCode: selectedPickupPoint.town[0].$.regioncode,
        receiverCountry: "UZ",
        receiverAddress: selectedPickupPoint.address[0],
        receiverPvz: selectedPickupPoint.code[0],
        receiverLat: selectedPickupPoint.lat?.[0] || "41.2995",
        receiverLon: selectedPickupPoint.lon?.[0] || "69.2401",

        weight: Math.max(1, Math.ceil(totalWeight)),
        service: "1",
        payType: "CASH",
        userId: userProfile?.id || "",
        groupId: "",
        priceType: "CUSTOMER",
        packages: packages,

        townfrom: "272765",
        townto: selectedPickupPoint.town[0].$.code,
        mass: Math.max(1, Math.ceil(totalWeight)),
      };

      console.log("Yetkazib berish ma'lumotlari:", deliveryData);

      let response;
      try {
        response = await $api.post("/emu/calculate/delivery", deliveryData);
      } catch (error) {
        console.log("Yangi format ishlamadi, eski formatni sinab ko'ramiz...");

        const oldFormatData = {
          townfrom: "272765",
          townto: selectedPickupPoint.town[0].$.code,
          mass: Math.max(1, Math.ceil(totalWeight)),
          service: "1",

          senderTown: "Ташкент",
          receiverTown:
            selectedPickupPoint.town[0]._ ||
            selectedPickupPoint.town[0].$.regionname,
          receiverPvz: selectedPickupPoint.code[0],
          weight: Math.max(1, Math.ceil(totalWeight)),
          payType: "CASH",
          priceType: "CUSTOMER",
        };

        console.log("Eski format ma'lumotlari:", oldFormatData);
        response = await $api.post("/emu/calculate/delivery", oldFormatData);
      }

      // Javobni qayta ishlash
      if (response.data?.data?.calculator?.calc) {
        const calc = response.data.data.calculator.calc;
        setDeliveryInfo({
          price: parseInt(calc.$.price || calc.price),
          minDays: calc.mindeliverydays || calc.minDays,
          maxDays: calc.maxdeliverydays || calc.maxDays,
          minDate: calc.mindeliverydate || calc.minDate,
          townFrom: calc.townfrom?._ || calc.townFrom || "Tashkent",
          townTo:
            calc.townto?._ || calc.townTo || selectedPickupPoint.town[0]._,
          weight: calc.mass || calc.weight,
          service:
            calc.service?.$.name ||
            calc.service?.name ||
            "Standart yetkazib berish",
        });
      } else if (response.data?.price || response.data?.cost) {
        setDeliveryInfo({
          price: parseInt(response.data.price || response.data.cost),
          minDays: response.data.minDays || 3,
          maxDays: response.data.maxDays || 7,
          townFrom: "Tashkent",
          townTo: selectedPickupPoint.town[0]._,
          weight: totalWeight,
          service: "Standart yetkazib berish",
        });
      } else if (response.data) {
        console.log("Noma'lum javob formati:", response.data);

        const price =
          response.data.deliveryPrice ||
          response.data.shipping_cost ||
          response.data.total_cost ||
          response.data.amount ||
          0;

        setDeliveryInfo({
          price: parseInt(price),
          minDays: response.data.minDays || 3,
          maxDays: response.data.maxDays || 7,
          townFrom: "Tashkent",
          townTo: selectedPickupPoint.town[0]._,
          weight: totalWeight,
          service: "Standart yetkazib berish",
        });
      } else {
        throw new Error("Javob formatida xatolik");
      }
    } catch (error) {
      console.error("❌ Yetkazib berish narxini hisoblashda xatolik:", error);

      let errorMessage =
        "Yetkazib berish narxini hisoblashda xatolik yuz berdi";

      if (error.response) {
        console.log("Server javobi:", error.response.data);
        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server xatoligi: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "Server bilan aloqa o'rnatilmadi";
      }

      setDeliveryError(errorMessage);

      // Default qiymatlar bilan davom etamiz
      setDeliveryInfo({
        price: 25000,
        minDays: 3,
        maxDays: 7,
        townFrom: "Tashkent",
        townTo: selectedPickupPoint.town[0]._,
        weight: totalWeight,
        service: "Standart yetkazib berish",
      });
    } finally {
      setLoadingDelivery(false);
      isCalculatingRef.current = false;
    }
  }, [selectedPickupPoint, checkedItems, regions, selectedRegion, userProfile]);

  // Delivery calculation useEffect - dependencies dan deliveryInfo ni olib tashladik
  useEffect(() => {
    calculateDelivery();
  }, [calculateDelivery]);

  const formatPrice = (price) => {
    if (!price) return "0";
    const numericPrice = parseFloat(price.toString().replace(/[^\d.-]/g, ""));
    return numericPrice.toLocaleString();
  };

  const getVariantData = (product) => {
    if (product.variant) {
      return {
        price: product.variant.discountedPrice || product.variant.price,
        originalPrice: product.variant.price,
        image: product.variant.mainImg
          ? `https://bsmarket.uz/api/${product.variant.mainImg}`
          : product.image,
        color: product.variant.color,
        unit: product.variant.unit,
        stockQuantity: product.variant.stockQuantity,
      };
    }
    return {
      price: product.sale_price || product.price,
      originalPrice: product.original_price,
      image: product.image,
      color: null,
      unit: null,
      stockQuantity: null,
    };
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/images/placeholder-product.jpg";
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.includes("bsmarket.uz/api/")) return imagePath;
    return `https://bsmarket.uz/api/${imagePath}`;
  };

  const getProductImages = (item) => {
    const images = [];
    const variantData = getVariantData(item);

    if (variantData.image) {
      images.push(getImageUrl(variantData.image));
    }

    if (
      item.variant?.productImages &&
      Array.isArray(item.variant.productImages)
    ) {
      item.variant.productImages.forEach((img) => {
        images.push(getImageUrl(img));
      });
    }

    if (item.mainImage && !item.variant) {
      images.push(getImageUrl(item.mainImage));
    }

    if (item.metaImage && !item.variant) {
      images.push(getImageUrl(item.metaImage));
    }

    return images
      .filter(Boolean)
      .filter((img, index, arr) => arr.indexOf(img) === index);
  };

  const handleSubmit = async () => {
    if (!userProfile) {
      console.error("❌ Foydalanuvchi ma'lumotlari topilmadi");
      return;
    }

    if (!selectedRegion) {
      console.log("Iltimos, viloyatni tanlang!");
      return;
    }

    if (!selectedPickupPoint) {
      console.log("Iltimos, topshirish punktini tanlang!");
      return;
    }

    try {
      setLoading(true);

      const orders = checkedItems.map((item) => {
        const selectedRegionData = regions.find(
          (region) => region.code[0] === selectedRegion
        );

        const locationName =
          selectedPickupPoint?.town?.[0]?.$.regionname ||
          selectedRegionData?.name?.[0] ||
          "Tashkent";

        return {
          productId: item.productId || item.id,
          variantId: item.variantId || item.variant?._id,
          paid: formData.payment === "card",
          paymentMethodOnline: formData.payment === "card",
          productQuantity: item.quantity,
          location: {
            la: selectedPickupPoint?.lat?.[0] || "41.3111",
            lo: selectedPickupPoint?.lon?.[0] || "69.2797",
            address: `${locationName}, ${
              selectedPickupPoint?.address?.[0] ||
              selectedPickupPoint?.town?.[0]?._ ||
              ""
            }`,
          },
          receiverPvz: selectedPickupPoint?.code?.[0] || "",
          // Agar delivery ma'lumotlarini jo'natish kerak bo'lsa, alohida field'lar sifatida qo'shamiz
          // deliveryInfo: deliveryInfo ? {
          //   price: deliveryInfo.price,
          //   minDays: deliveryInfo.minDays,
          //   maxDays: deliveryInfo.maxDays
          // } : null
        };
      });

      console.log("📤 Jo'natilayotgan buyurtmalar:", orders);

      const response = await $api.post("/order/bulk/create", {
        orders: orders,
      });

      console.log(
        "✅ Barcha buyurtmalar muvaffaqiyatli yaratildi:",
        response.data
      );

      clearCart();
      router.push("/profile?tab=orders");
    } catch (error) {
      console.error("❌ Buyurtma yaratishda xatolik:", error);

      let errorMessage = "Buyurtma yaratishda xatolik yuz berdi";
      if (error.response) {
        console.log("Server response:", error.response.data);
        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server xatoligi: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "Server bilan aloqa o'rnatilmadi";
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
    setSelectedPickupPoint(null);
    // Delivery info ni tozalash
    setDeliveryInfo(null);
    setDeliveryError(null);
    // Calculation ref ni tozalash
    deliveryCalculationRef.current = null;
  };

  const handlePickupPointSelect = (point) => {
    setSelectedPickupPoint(point);
    // Delivery info ni tozalash - yangi pickup point uchun qayta hisoblash
    setDeliveryInfo(null);
    setDeliveryError(null);
    // Calculation ref ni tozalash
    deliveryCalculationRef.current = null;
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setModalImageIndex(0);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    document.body.style.overflow = "unset";
  };

  const handleImageChange = (direction) => {
    if (!selectedProduct) return;
    const images = getProductImages(selectedProduct);

    if (direction === "next") {
      setModalImageIndex((prev) => (prev + 1) % images.length);
    } else {
      setModalImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const totalWithDelivery = total + (deliveryInfo?.price || 0);

  if (loading) {
    return (
      <div>
        <Head>
          <title>Buyurtma berish</title>
          <meta name="description" content="Checkout - Baraka savdo" />
        </Head>
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Yuklanmoqda...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Buyurtma</title>
        <meta name="description" content="Checkout - Baraka Savdo" />
      </Head>

      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8 max-[720px]:px-2">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Buyurtma</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <OrderItems
              checkedItems={checkedItems}
              onProductClick={openProductModal}
              formatPrice={formatPrice}
              getVariantData={getVariantData}
              getProductImages={getProductImages}
            />

            <PickupPoints
              regions={regions}
              selectedRegion={selectedRegion}
              pickupPoints={pickupPoints}
              allPickupPoints={allPickupPoints}
              selectedPickupPoint={selectedPickupPoint}
              loadingPickupPoints={loadingPickupPoints}
              regionsLoading={regionsLoading}
              deliveryInfo={deliveryInfo}
              loadingDelivery={loadingDelivery}
              deliveryError={deliveryError}
              onRegionChange={handleRegionChange}
              onPickupPointSelect={handlePickupPointSelect}
              formatPrice={formatPrice}
              userProfile={userProfile}
            />

            <PaymentMethod formData={formData} onFormChange={handleChange} />
          </div>

          <OrderSummary
            total={total}
            deliveryInfo={deliveryInfo}
            loadingDelivery={loadingDelivery}
            totalWithDelivery={totalWithDelivery}
            checkedItems={checkedItems}
            selectedRegion={selectedRegion}
            selectedPickupPoint={selectedPickupPoint}
            formatPrice={formatPrice}
            getVariantData={getVariantData}
            onSubmit={handleSubmit}
          />
        </div>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        product={selectedProduct}
        imageIndex={modalImageIndex}
        onClose={closeModal}
        onImageChange={handleImageChange}
        formatPrice={formatPrice}
        getVariantData={getVariantData}
        getProductImages={getProductImages}
      />

      <Footer />
    </div>
  );
}
