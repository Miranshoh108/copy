import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductModal({
  isOpen,
  product,
  imageIndex,
  onClose,
  onImageChange,
  formatPrice,
  getVariantData,
  getProductImages,
}) {
  if (!isOpen || !product) return null;

  const images = getProductImages(product);
  const variantData = getVariantData(product);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 cursor-pointer text-white hover:text-gray-300 transition-colors z-10"
      >
        <X size={32} />
      </button>

      <div className="relative w-full h-full flex items-center justify-center max-w-4xl mx-auto">
        {images.length > 1 && (
          <button
            onClick={() => onImageChange("prev")}
            className="absolute left-4 p-3 text-white cursor-pointer hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full"
          >
            <ChevronLeft size={32} />
          </button>
        )}

        <div className="relative max-w-[80vw] max-h-[80vh] w-full h-full flex flex-col items-center justify-center bg-white rounded-lg overflow-hidden">
          <div className="relative flex-1 w-full">
            <Image
              src={images[imageIndex] || "/images/placeholder-product.jpg"}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>

          <div className="w-full p-6 bg-white border-t">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {product.name}
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
              <span className="text-gray-600">Miqdor: {product.quantity}</span>
            </div>

            {product.variant && (
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

            {product.description && (
              <div className="mt-3">
                <p className="text-sm text-gray-700 line-clamp-3">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {images.length > 1 && (
          <button
            onClick={() => onImageChange("next")}
            className="absolute right-4 p-3 text-white cursor-pointer hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full"
          >
            <ChevronRight size={32} />
          </button>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
            {imageIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
}
