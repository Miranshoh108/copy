import Image from "next/image";
import { Eye } from "lucide-react";

export default function OrderItems({
  checkedItems,
  onProductClick,
  formatPrice,
  getVariantData,
  getProductImages,
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6 max-[720px]:p-3">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Buyurtma mahsulotlari ({checkedItems.length} ta)
      </h2>

      <div className="space-y-4 h-[500px] overflow-y-auto">
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
                    onClick={() => onProductClick(item)}
                  >
                    <Image
                      src={images[0] || "/images/placeholder-product.jpg"}
                      alt={item.name || "Product"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        e.currentTarget.src = "/images/placeholder-product.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <Eye
                        className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        size={20}
                      />
                    </div>
                  </div>

                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {item.quantity}
                  </span>
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
                          variantData.originalPrice !== variantData.price && (
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
  );
}
