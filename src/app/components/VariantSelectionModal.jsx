import React, { useState, useEffect } from "react";
import { X, ShoppingCart, Plus, Minus } from "lucide-react";
import { createPortal } from "react-dom";

const VariantSelectionModal = ({
  isOpen,
  onClose,
  product,
  onAddToCart,
  currencyText = "so'm",
  isAuthenticated = false,
}) => {
  const [selectedVariants, setSelectedVariants] = useState(new Set());
  const [quantities, setQuantities] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [addMode, setAddMode] = useState("single"); 

  useEffect(() => {
    setMounted(true);

    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (product?.variants) {
        const initialQuantities = {};
        product.variants.forEach((variant) => {
          initialQuantities[variant._id] = 1;
        });
        setQuantities(initialQuantities);
        setSelectedVariants(new Set());
        setAddMode("single");
      }
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, product]);

  if (!mounted || !isOpen || !product) return null;

  const checkAuthentication = () => {
    try {
      const token =
        localStorage.getItem("accessToken") || localStorage.getItem("token");
      const isAuth = !!token && token !== "undefined" && token.length > 0;
      console.log(
        "Modal authentication check:",
        isAuth,
        "Token:",
        token ? "exists" : "missing"
      );
      return isAuth;
    } catch (error) {
      console.error("Error checking authentication in modal:", error);
      return false;
    }
  };

  const showNotification = (message, type = "success") => {
    console.log(`${type}: ${message}`);
    if (type === "success") {
      console.log("✅", message);
    } else {
      console.error("❌", message);
    }
  };

  const handleVariantSelect = (variant) => {
    if (addMode === "single") {
      setSelectedVariants(new Set([variant._id]));
    } else {
      const newSelected = new Set(selectedVariants);
      if (newSelected.has(variant._id)) {
        newSelected.delete(variant._id);
      } else {
        newSelected.add(variant._id);
      }
      setSelectedVariants(newSelected);
    }
  };

  const handleAddToCart = async () => {
    if (selectedVariants.size === 0) return;

    setIsLoading(true);
    const authStatus = checkAuthentication();

    try {
      const selectedVariantIds = Array.from(selectedVariants);

      if (addMode === "single" && selectedVariantIds.length === 1) {
        const variant = product.variants.find(
          (v) => v._id === selectedVariantIds[0]
        );
        const cartData = {
          productId: product.id,
          variantId: variant._id,
          quantity: quantities[variant._id] || 1,
          price: variant.discountedPrice || variant.price,
        };

        console.log("Single variant cart data:", cartData);

        if (authStatus) {
          console.log("Adding single variant via API");
          await onAddToCart(cartData);
        } else {
          console.log("Adding single variant to local storage");
          await onAddToCart(cartData);
        }

        showNotification(
          "Variant muvaffaqiyatli savatga qo'shildi!",
          "success"
        );
      } else {
        const cartRequests = selectedVariantIds.map((variantId) => {
          const variant = product.variants.find((v) => v._id === variantId);
          return {
            productId: product.id,
            variantId: variant._id,
            quantity: quantities[variant._id] || 1,
            price: variant.discountedPrice || variant.price,
          };
        });

        console.log("Multiple variants cart data:", cartRequests);

        if (authStatus) {
          console.log("Adding multiple variants via API");
          for (const cartData of cartRequests) {
            await onAddToCart(cartData);
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        } else {
          console.log("Adding multiple variants to local storage");
          for (const cartData of cartRequests) {
            await onAddToCart(cartData);
          }
        }

        showNotification(
          `${selectedVariantIds.length} ta variant savatga qo'shildi!`,
          "success"
        );
      }

      onClose();
    } catch (error) {
      console.error("Error adding to cart:", error);

      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }

      let errorMessage = "Xatolik yuz berdi";

      if (authStatus) {
        errorMessage = `API xatoligi: ${
          error.response?.data?.message || error.message
        }`;
      }

      showNotification(errorMessage, "error");

     
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (variantId, type) => {
    setQuantities((prev) => {
      const currentQuantity = prev[variantId] || 1;
      if (type === "increment") {
        return { ...prev, [variantId]: currentQuantity + 1 };
      } else if (type === "decrement" && currentQuantity > 1) {
        return { ...prev, [variantId]: currentQuantity - 1 };
      }
      return prev;
    });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const calculateTotalPrice = () => {
    let total = 0;
    selectedVariants.forEach((variantId) => {
      const variant = product.variants.find((v) => v._id === variantId);
      if (variant) {
        const price = variant.discountedPrice || variant.price;
        const quantity = quantities[variantId] || 1;
        total += price * quantity;
      }
    });
    return total;
  };

  const totalPrice = calculateTotalPrice();

  const modalContent = (
    <>
      <div
        className={`fixed inset-0 bg-black z-[9998] transition-opacity duration-300 ${
          isOpen ? "opacity-30" : "opacity-0"
        }`}
        onClick={handleBackdropClick}
      />

      <div
        className={`fixed inset-x-0 bottom-20 z-[9999] flex justify-center items-center transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-white rounded-t-2xl w-[600px] mx-auto shadow-2xl h-[80vh] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
            <h3 className="text-lg font-semibold text-gray-800">
              Variantni tanlang
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 cursor-pointer rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="p-4 border-b flex-shrink-0">
            <div className="flex items-start gap-3 mb-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 mb-1">
                  {product.name}
                </h4>
                <p className="text-sm text-gray-600">{product.description}</p>
              </div>
            </div>

            <div className="mb-3 text-xs text-gray-500">
              {isAuthenticated
                ? " Hisobingizga saqlanadi"
                : ""}
            </div>

            <div className="flex gap-2 mb-2">
              <button
                onClick={() => {
                  setAddMode("single");
                  if (selectedVariants.size > 1) {
                    const firstSelected = Array.from(selectedVariants)[0];
                    setSelectedVariants(new Set([firstSelected]));
                  }
                }}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  addMode === "single"
                    ? "bg-[#249B73] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Bitta variant
              </button>
              <button
                onClick={() => setAddMode("multiple")}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  addMode === "multiple"
                    ? "bg-[#249B73] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Bir nechta variant
              </button>
            </div>

            {addMode === "multiple" && (
              <p className="text-xs text-gray-600">
                Bir nechta variant tanlash uchun variantlarni bosing
              </p>
            )}
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Mavjud variantlar ({selectedVariants.size} tanlangan):
            </p>
            <div className="space-y-2">
              {product.variants?.map((variant) => {
                const isSelected = selectedVariants.has(variant._id);
                return (
                  <div
                    key={variant._id}
                    onClick={() => handleVariantSelect(variant)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? "border-[#249B73] bg-[#249B73]/5 ring-2 ring-[#249B73]/20"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {addMode === "multiple" && (
                          <div
                            className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                              isSelected
                                ? "bg-[#249B73] border-[#249B73]"
                                : "border-gray-300"
                            }`}
                          >
                            {isSelected && (
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
                            )}
                          </div>
                        )}

                        {variant.mainImg && (
                          <img
                            src={`${
                              process.env.NEXT_PUBLIC_API_URL
                            }/${variant.mainImg.replace(/\\/g, "/")}`}
                            alt={variant.name || "Variant"}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-800">
                            {variant.name || "Standard"}
                          </p>
                          {variant.color && (
                            <p className="text-sm text-gray-600">
                              Rang: {variant.color}
                            </p>
                          )}
                          {variant.size && (
                            <p className="text-sm text-gray-600">
                              O'lcham: {variant.size}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {variant.discountedPrice &&
                        variant.discountedPrice < variant.price ? (
                          <div>
                            <p className="text-sm text-gray-400 line-through">
                              {new Intl.NumberFormat("ru-RU").format(
                                variant.price
                              )}
                              {currencyText}
                            </p>
                            <p className="font-semibold text-[#249B73]">
                              {new Intl.NumberFormat("ru-RU").format(
                                variant.discountedPrice
                              )}
                              {currencyText}
                            </p>
                          </div>
                        ) : (
                          <p className="font-semibold text-gray-800">
                            {new Intl.NumberFormat("ru-RU").format(
                              variant.price
                            )}
                            {currencyText}
                          </p>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-center gap-4">
                          <span className="text-sm font-medium text-gray-700">
                            Miqdor:
                          </span>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuantityChange(variant._id, "decrement");
                              }}
                              className="w-8 h-8 rounded-full cursor-pointer border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={(quantities[variant._id] || 1) <= 1}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="bg-[#249B73] text-white text-lg font-semibold min-w-[2.5rem] text-center px-3 py-1 rounded-lg">
                              {quantities[variant._id] || 1}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuantityChange(variant._id, "increment");
                              }}
                              className="w-8 h-8 rounded-full cursor-pointer border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 border-t bg-gray-50 rounded-b-2xl flex-shrink-0">
            {/* Jami narx ko'rsatish */}
            {selectedVariants.size > 0 && (
              <div className="mb-3 p-2 bg-white rounded-lg border">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Jami ({selectedVariants.size} ta variant):
                  </span>
                  <span className="text-lg font-bold text-[#249B73]">
                    {new Intl.NumberFormat("ru-RU").format(totalPrice)}{" "}
                    {currencyText}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={selectedVariants.size === 0 || isLoading}
              className={`w-full py-3 rounded-lg font-medium cursor-pointer flex items-center justify-center gap-2 transition-all transform ${
                selectedVariants.size > 0 && !isLoading
                  ? "bg-[#249B73] text-white hover:bg-[#1e8660] hover:scale-[1.02] shadow-lg"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShoppingCart size={18} />
                  <span>
                    {selectedVariants.size > 1
                      ? `${selectedVariants.size} ta variantni savatga qo'shish`
                      : "Savatga qo'shish"}
                    {!isAuthenticated && ""}
                  </span>
                </>
              )}
            </button>

            {!isAuthenticated && (
              <p className="text-xs text-gray-500 text-center mt-2">
                Ro'yxatdan o'tish orqali mahsulotlaringizni saqlang
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
};

export default VariantSelectionModal;
