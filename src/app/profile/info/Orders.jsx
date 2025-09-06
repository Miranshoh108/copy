import { useEffect, useState } from "react";
import { Truck, Eye, Star, Trash2, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrderStore } from "@/app/store/orderStore"; 

const Orders = () => {
  const { orders, reviews, addReview, removeReview, getOrderReviews } =
    useOrderStore();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "text-[#249B73] bg-green-100";
      case "shipping":
        return "text-blue-600 bg-blue-100";
      case "processing":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "delivered":
        return "Yetkazildi";
      case "shipping":
        return "Yo'lda";
      case "processing":
        return "Tayyorlanmoqda";
      default:
        return status;
    }
  };

  const formatPrice = (price) => {
    if (!price) return "0";
    const numericPrice = parseFloat(price.toString().replace(/[^\d.-]/g, ""));
    return numericPrice.toLocaleString();
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleCreateReview = async () => {
    if (!newReview.comment.trim()) return;

    try {
      // API chaqiruvi
      const response = await fetch("/api/review/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      });

      if (response.ok) {
        // Store ga qo'shish
        addReview({
          orderId: selectedOrder.id,
          rating: newReview.rating,
          comment: newReview.comment,
        });

        setNewReview({ rating: 5, comment: "" });
        console.log("Sharh muvaffaqiyatli qo'shildi!");
      }
    } catch (error) {
      console.error("Sharh qo'shishda xatolik:", error);
      // Xatolik bo'lsa ham local storage ga qo'shamiz
      addReview({
        orderId: selectedOrder.id,
        rating: newReview.rating,
        comment: newReview.comment,
      });

      setNewReview({ rating: 5, comment: "" });
      console.log("Sharh qo'shildi!");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm("Ushbu sharhni o'chirmoqchimisiz?")) return;

    try {
      const response = await fetch(`/api/review/delete/my/${reviewId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        removeReview(reviewId);
        console.log("Sharh o'chirildi!");
      }
    } catch (error) {
      console.error("Sharhni o'chirishda xatolik:", error);
      // Xatolik bo'lsa ham local dan o'chiramiz
      removeReview(reviewId);
      console.log("Sharh o'chirildi!");
    }
  };

  const canReview = (order) => {
    return (
      order.status === "delivered" && getOrderReviews(order.id).length === 0
    );
  };

  // Buyurtma tafsilotlari
  if (selectedOrder) {
    const orderReviews = getOrderReviews(selectedOrder.id);

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedOrder(null)}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Orqaga
            </button>
            <CardTitle>Buyurtma #{selectedOrder.id}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Buyurtma ma'lumotlari */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Sana</p>
                  <p className="font-medium">{selectedOrder.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`inline-flex px-2 py-1 rounded text-sm ${getStatusColor(
                      selectedOrder.status
                    )}`}
                  >
                    {getStatusText(selectedOrder.status)}
                  </span>
                </div>
                {selectedOrder.customerInfo && (
                  <>
                    <div>
                      <p className="text-sm text-gray-500">Oluvchi</p>
                      <p className="font-medium">
                        {selectedOrder.customerInfo.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedOrder.customerInfo.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Yetkazish</p>
                      <p className="font-medium">
                        {selectedOrder.customerInfo.region}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedOrder.customerInfo.pickupPoint?.name?.[0]}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Mahsulotlar</p>
                <div className="space-y-3">
                  {selectedOrder.products.map((product, index) => (
                    <div
                      key={`${product.id}-${index}`}
                      className="flex justify-between items-center p-3 bg-white rounded border"
                    >
                      <div className="flex items-center gap-3">
                        {product.image && (
                          <img
                            src={
                              product.image.startsWith("http")
                                ? product.image
                                : `https://bsmarket.uz/api/${product.image}`
                            }
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.src =
                                "/images/placeholder-product.jpg";
                            }}
                          />
                        )}
                        <div>
                          <p className="font-medium">{product.name}</p>
                          {product.variant && (
                            <p className="text-sm text-gray-600">
                              {product.variant.color &&
                                `Rang: ${product.variant.color}`}
                              {product.variant.unit &&
                                ` • O'lchov: ${product.variant.unit}`}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {product.quantity} x {formatPrice(product.price)} so'm
                        </p>
                        <p className="text-sm text-gray-600">
                          ={" "}
                          {formatPrice(
                            parseFloat(
                              product.price
                                .toString()
                                .replace(/[^\d.-]/g, "") || 0
                            ) * product.quantity
                          )}{" "}
                          so'm
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Jami:</span>
                    <span className="text-[#249B73]">
                      {formatPrice(selectedOrder.total)} so'm
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sharh qoldirish */}
            {canReview(selectedOrder) && (
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-4">Sharh qoldiring</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Baho
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() =>
                            setNewReview((prev) => ({ ...prev, rating: star }))
                          }
                          className={`${
                            star <= newReview.rating
                              ? "text-yellow-500"
                              : "text-gray-300"
                          } hover:text-yellow-500 transition-colors`}
                        >
                          <Star
                            size={24}
                            fill={
                              star <= newReview.rating ? "currentColor" : "none"
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Izoh
                    </label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) =>
                        setNewReview((prev) => ({
                          ...prev,
                          comment: e.target.value,
                        }))
                      }
                      className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      rows="4"
                      placeholder="Buyurtma haqida fikringizni yozing..."
                    />
                  </div>
                  <button
                    onClick={handleCreateReview}
                    disabled={!newReview.comment.trim()}
                    className="flex items-center gap-2 bg-[#249B73] text-white px-4 py-2 rounded-lg hover:bg-[#1e8560] disabled:bg-gray-400 transition-colors"
                  >
                    <Send size={16} />
                    Sharh yuborish
                  </button>
                </div>
              </div>
            )}

            {/* Mavjud sharhlar */}
            {orderReviews.length > 0 && (
              <div>
                <h3 className="font-semibold mb-4">Sizning sharhingiz</h3>
                <div className="space-y-4">
                  {orderReviews.map((review) => (
                    <div
                      key={review.id}
                      className="border rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={16}
                                className={
                                  star <= review.rating
                                    ? "text-yellow-500"
                                    : "text-gray-300"
                                }
                                fill={
                                  star <= review.rating
                                    ? "currentColor"
                                    : "none"
                                }
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {review.date}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="text-red-600 hover:text-red-800 p-1 transition-colors"
                          title="Sharhni o'chirish"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Buyurtmalar ro'yxati
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mening buyurtmalarim</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <Truck size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">Buyurtmalar mavjud emas.</p>
              <p className="text-gray-400 text-sm">
                Birinchi buyurtmangizni bering!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-green-200 transition-colors hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Truck size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Buyurtma #{order.id}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.date} • {order.items} ta mahsulot
                      </p>
                      {order.customerInfo && (
                        <p className="text-xs text-gray-400">
                          {order.customerInfo.region}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleViewOrder(order)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Eye size={16} />
                      Ko'rish
                    </button>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>

                    <p className="font-semibold text-gray-900 min-w-[120px] text-right">
                      {formatPrice(order.total)} so'm
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Orders;
