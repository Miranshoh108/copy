"use client";
import { useCartStore } from "../components/hooks/cart";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/ui/button";
import Image from "next/image";
import MapComponent from "../components/MapComponent";
import { Eye, X, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import $api from "../http/api";

export default function Checkout() {
  const { getCheckedItems, getTotalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const checkedItems = getCheckedItems();
  const total = getTotalPrice();

  const [userProfile, setUserProfile] = useState(null);
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [pickupPoints, setPickupPoints] = useState([]);
  const [allPickupPoints, setAllPickupPoints] = useState([]); // Barcha punktlar uchun
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

  // Pagination uchun state'lar
  const [showAll, setShowAll] = useState(false);
  const POINTS_PER_PAGE = 5;

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

  useEffect(() => {
    if (checkedItems.length === 0) {
      router.push("/cart");
    }
  }, [checkedItems.length, router]);

  useEffect(() => {
    const fetchPickupPoints = async () => {
      if (!selectedRegion) {
        setPickupPoints([]);
        setAllPickupPoints([]);
        setSelectedPickupPoint(null);
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
            // Agar "UZBEKISTAN" tanlangan bo'lsa, barcha punktlarni ko'rsat
            if (selectedRegionData.name[0] === "UZBEKISTAN") {
              setAllPickupPoints(allPoints);
              setPickupPoints(allPoints); // Xarita uchun barcha punktlar
              if (allPoints.length > 0) {
                setSelectedPickupPoint(allPoints[0]);
              }
            } else {
              // Boshqa viloyatlar uchun filtr qil
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
    setSelectedPickupPoint(null);
    setShowAll(false); // Pagination reset
  };

  const handlePickupPointSelect = (point) => {
    setSelectedPickupPoint(point);
  };

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

  const handleSubmit = async () => {
    if (!userProfile) {
      console.error("❌ Foydalanuvchi ma'lumotlari topilmadi");
      return;
    }

    if (!selectedRegion) {
      alert("Iltimos, viloyatni tanlang!");
      return;
    }

    if (!selectedPickupPoint) {
      alert("Iltimos, topshirish punktini tanlang!");
      return;
    }

    const selectedRegionData = regions.find(
      (region) => region.code[0] === selectedRegion
    );

    const payload = {
      name: `${userProfile.firstName} ${userProfile.lastName}`,
      phone: userProfile.phoneNumber,
      region: selectedRegionData?.name[0] || "",
      regionCode: selectedRegion,
      pickupPoint: selectedPickupPoint,
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
        clearCart();
        router.push("/");
      } else {
        console.error("❌ Serverdan muvaffaqiyatsiz javob:", res.status);
      }
    } catch (error) {
      console.error("❌ Buyurtma yuborishda xatolik:", error);
    }
  };

  // Pagination logikasi
  const getDisplayedPickupPoints = () => {
    const selectedRegionData = regions.find(
      (region) => region.code[0] === selectedRegion
    );

    // Agar Uzbekiston tanlangan bo'lsa
    if (selectedRegionData?.name[0] === "UZBEKISTAN") {
      return showAll
        ? allPickupPoints
        : allPickupPoints.slice(0, POINTS_PER_PAGE);
    }

    // Boshqa viloyatlar uchun hammasini ko'rsat
    return allPickupPoints;
  };

  const shouldShowPagination = () => {
    const selectedRegionData = regions.find(
      (region) => region.code[0] === selectedRegion
    );
    return (
      selectedRegionData?.name[0] === "UZBEKISTAN" &&
      allPickupPoints.length > POINTS_PER_PAGE
    );
  };

  if (loading) {
    return (
      <div>
        <Head>
          <title>Buyurtma berish</title>
          <meta name="description" content="Checkout - Bojxona Servis" />
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
        <meta name="description" content="Checkout - Bojxona Servis" />
      </Head>

      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8 max-[720px]:px-2">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Buyurtma</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Mahsulotlar ro'yxati */}
            <div className="bg-white rounded-lg shadow p-6 mb-6 max-[720px]:p-3">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Buyurtma mahsulotlari ({checkedItems.length} ta)
              </h2>

              <div className="space-y-4">
                {checkedItems.map((item, index) => {
                  const images = getProductImages(item);
                  const variantData = getVariantData(item);

                  return (
                    <div
                      key={`${item.id || item.productId}-${
                        item.variantId || item.variant?._id
                      }-${index}`}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow max-[720px]:p-3"
                    >
                      <div className="flex gap-4">
                        <div className="relative">
                          <div
                            className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden cursor-pointer relative group"
                            onClick={() => openProductModal(item)}
                          >
                            <Image
                              src={
                                images[0] || "/images/placeholder-product.jpg"
                              }
                              alt={item.name || "Product"}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "/images/placeholder-product.jpg";
                              }}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                              <Eye
                                className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                size={20}
                              />
                            </div>
                          </div>

                          {images.length > 1 && (
                            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                              {images.length}
                            </span>
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                            {item.name}
                          </h3>

                          {item.variant && (
                            <div className="text-sm text-gray-600 mb-2 space-y-1">
                              {variantData.color && (
                                <p>
                                  <span className="font-medium">Rang:</span>
                                  {variantData.color}
                                </p>
                              )}
                              {variantData.unit && (
                                <p>
                                  <span className="font-medium">O'lchov:</span>
                                  {variantData.unit}
                                </p>
                              )}
                              {variantData.stockQuantity && (
                                <p>
                                  <span className="font-medium">Omborda:</span>
                                  {variantData.stockQuantity}
                                </p>
                              )}
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-45 max-[760px]:gap-30 max-[680px]:flex-col max-[680px]:gap-2 max-[680px]:items-start">
                              <div className="flex items-center gap-2 max-[430px]:flex-col max-[430px]:items-start">
                                <span className="text-lg font-bold text-[#249B73] ">
                                  {formatPrice(variantData.price)} so'm
                                </span>
                                {variantData.originalPrice &&
                                  variantData.originalPrice !==
                                    variantData.price && (
                                    <span className="text-sm text-gray-400 line-through">
                                      {formatPrice(variantData.originalPrice)}
                                      so'm
                                    </span>
                                  )}
                              </div>

                              {item.quantity > 1 && (
                                <span className="text-sm text-gray-600">
                                  Jami:
                                  {formatPrice(
                                    parseFloat(
                                      variantData.price
                                        ?.toString()
                                        .replace(/[^\d.-]/g, "") || 0
                                    ) * item.quantity
                                  )}
                                  so'm
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {item.description && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-8 max-[720px]:p-2">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                BS Market topshirish punkti
              </h2>

              <div className="bg-white rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Viloyatni tanlang
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline w-4 h-4 mr-1" />
                    Viloyat
                  </label>
                  <select
                    value={selectedRegion}
                    onChange={handleRegionChange}
                    className="w-full cursor-pointer p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    disabled={regionsLoading}
                  >
                    <option value="" disabled>
                      {regionsLoading ? "Yuklanmoqda..." : "Viloyatni tanlang"}
                    </option>
                    {regions.map((region) => (
                      <option key={region.code[0]} value={region.code[0]}>
                        {region.name[0]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* PVZ punktlari ro'yxati - faqat Uzbekiston uchun pagination */}
                {selectedRegion && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Topshirish punktini tanlang
                    </h4>

                    {loadingPickupPoints ? (
                      <div className="text-center py-4">
                        <span className="text-gray-600">
                          PVZ larni yuklanmoqda...
                        </span>
                      </div>
                    ) : allPickupPoints.length > 0 ? (
                      <>
                        <div className="space-y-3 mb-4">
                          {getDisplayedPickupPoints().map((point) => (
                            <div
                              key={point.code[0]}
                              onClick={() => handlePickupPointSelect(point)}
                              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                selectedPickupPoint?.code[0] === point.code[0]
                                  ? "border-green-500 bg-green-50"
                                  : "border-gray-200 hover:border-green-300"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className={`w-4 h-4 rounded-full border-2 mt-1 ${
                                    selectedPickupPoint?.code[0] ===
                                    point.code[0]
                                      ? "border-green-500 bg-green-500"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {selectedPickupPoint?.code[0] ===
                                    point.code[0] && (
                                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-[#249B73]  mt-1">
                                    {point.name[0]}
                                  </div>
                                  <div className="text-sm text-gray-600 mt-1">
                                    {point.address[0]}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    Tel: {point.phone[0]}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {point.town[0].$.regionname}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Ko'proq ko'rish tugmasi - faqat Uzbekiston uchun */}
                        {shouldShowPagination() && (
                          <div className="text-center">
                            <button
                              onClick={() => setShowAll(!showAll)}
                              className="bg-[#249B73] text-white px-6 py-2 rounded-lg hover:bg-[#249B73] transition-colors"
                            >
                              {showAll
                                ? "Kamroq ko'rish"
                                : `Ko'proq ko'rish (${
                                    allPickupPoints.length - POINTS_PER_PAGE
                                  } ta qolgan)`}
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-4 text-gray-600">
                        Bu viloyatda topshirish punktlari topilmadi
                      </div>
                    )}
                  </div>
                )}

                {/* XARITA - har doim ko'rinadi */}
                {selectedRegion && (
                  <MapComponent
                    pickupPoints={pickupPoints}
                    selectedPickupPoint={selectedPickupPoint}
                    onPointSelect={handlePickupPointSelect}
                  />
                )}
              </div>

              {/* Oluvchi ma'lumotlari */}
              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600">👤</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">Oluvchi</div>
                    <div className="text-gray-600">
                      {userProfile
                        ? `${userProfile.firstName} ${userProfile.lastName}`
                        : "Noma'lum"}
                    </div>
                    <div className="text-gray-600">
                      {userProfile
                        ? userProfile.phoneNumber
                        : "Telefon raqami yo'q"}
                    </div>
                  </div>
                  <button className="text-[#249B73] cursor-pointer hover:text-[#249B73]">
                    →
                  </button>
                </div>
              </div>
            </div>

            {/* To'lov turi */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                To'lov turi
              </h2>

              <div className="border rounded-lg p-4 mb-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={formData.payment === "card"}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#249B73] "
                  />
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-6 bg-[#249B73]  rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">💳</span>
                    </div>
                    <div>
                      <div className="font-medium">BS kartasi bilan</div>
                      <div className="text-sm text-gray-600 max-[500px]:hidden">
                        BS Bank ilovasida kartani rasmiylashtirishda va buyurtma
                        uchun tolash mumkin
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Buyurtma xulosasi */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h3 className="text-lg font-semibold mb-4">Buyurtma xulosasi</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Tovarlar</span>
                  <span>{formatPrice(total)} so'm</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Chegirmalar</span>
                  <span>
                    -
                    {formatPrice(
                      checkedItems.reduce((acc, item) => {
                        const variantData = getVariantData(item);
                        if (variantData.originalPrice && variantData.price) {
                          const originalPrice = parseFloat(
                            variantData.originalPrice
                              .toString()
                              .replace(/[^\d.-]/g, "") || 0
                          );
                          const currentPrice = parseFloat(
                            variantData.price
                              .toString()
                              .replace(/[^\d.-]/g, "") || 0
                          );
                          return (
                            acc + (originalPrice - currentPrice) * item.quantity
                          );
                        }
                        return acc;
                      }, 0)
                    )}
                    so'm
                  </span>
                </div>
                <div className="text-sm text-[#249B73]  cursor-pointer hover:underline">
                  Batafsil
                </div>
                <hr />
                <div className="flex justify-between text-xl font-bold">
                  <span>Jami</span>
                  <span>{formatPrice(total)} so'm</span>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!selectedRegion || !selectedPickupPoint}
                className={`w-full py-4 rounded-lg font-medium text-lg transition-colors ${
                  selectedRegion && selectedPickupPoint
                    ? "bg-[#249B73] text-white cursor-pointer hover:bg-[#249B73]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Buyurtmani rasmiylashtirish
              </Button>

              <div className="text-sm text-gray-500 mt-3 text-center">
                Buyurtmani joylashtirganda siz, shaxsga doir ma'lumotlar
                <span className="text-[#249B73] underline cursor-pointer">
                  Maxfiylik kelishuviga
                </span>
                muvofiq qayta ishlanishiga roziliik bildirasiz, hamda
                <span className="text-[#249B73] underline cursor-pointer">
                  Foydalanuvchi kelishuvini
                </span>
                qabul qilasiz.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 cursor-pointer text-white hover:text-gray-300 transition-colors z-10"
          >
            <X size={32} />
          </button>

          <div className="relative w-full h-full flex items-center justify-center max-w-4xl mx-auto">
            {(() => {
              const images = getProductImages(selectedProduct);
              const variantData = getVariantData(selectedProduct);

              return (
                <>
                  {images.length > 1 && (
                    <button
                      onClick={() => handleImageChange("prev")}
                      className="absolute left-4 p-3 text-white cursor-pointer hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full"
                    >
                      <ChevronLeft size={32} />
                    </button>
                  )}

                  <div className="relative max-w-[80vw] max-h-[80vh] w-full h-full flex flex-col items-center justify-center bg-white rounded-lg overflow-hidden">
                    <div className="relative flex-1 w-full">
                      <Image
                        src={
                          images[modalImageIndex] ||
                          "/images/placeholder-product.jpg"
                        }
                        alt={selectedProduct.name}
                        fill
                        className="object-contain"
                      />
                    </div>

                    <div className="w-full p-6 bg-white border-t">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {selectedProduct.name}
                      </h3>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-[#249B73]">
                            {formatPrice(variantData.price)} so'm
                          </span>
                          {variantData.originalPrice &&
                            variantData.originalPrice !== variantData.price && (
                              <span className="text-lg text-gray-400 line-through">
                                {formatPrice(variantData.originalPrice)} so'm
                              </span>
                            )}
                        </div>
                        <span className="text-gray-600">
                          Miqdor: {selectedProduct.quantity}
                        </span>
                      </div>

                      {selectedProduct.variant && (
                        <div className="text-sm text-gray-600 space-y-1">
                          {variantData.color && (
                            <p>
                              <span className="font-medium">Rang:</span>
                              {variantData.color}
                            </p>
                          )}
                          {variantData.unit && (
                            <p>
                              <span className="font-medium">O'lchov:</span>
                              {variantData.unit}
                            </p>
                          )}
                        </div>
                      )}

                      {selectedProduct.description && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-700 line-clamp-3">
                            {selectedProduct.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {images.length > 1 && (
                    <button
                      onClick={() => handleImageChange("next")}
                      className="absolute right-4 p-3 text-white cursor-pointer hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full"
                    >
                      <ChevronRight size={32} />
                    </button>
                  )}

                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                      {modalImageIndex + 1} / {images.length}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
