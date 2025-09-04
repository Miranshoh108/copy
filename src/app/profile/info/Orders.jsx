import { useEffect, useState } from "react";
import { Truck, Eye, Star, Trash2, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Orders = () => {
  const [orders, setOrders] = useState([
    {
      id: "12345",
      date: "2024-08-25",
      items: 3,
      status: "delivered",
      total: "125000",
      products: [
        { id: 1, name: "iPhone 15 Pro", price: "50000", quantity: 1 },
        { id: 2, name: "AirPods Pro", price: "35000", quantity: 1 },
        { id: 3, name: "iPhone qopqog'i", price: "40000", quantity: 1 },
      ],
    },
    {
      id: "12346",
      date: "2024-08-26",
      items: 2,
      status: "shipping",
      total: "89000",
      products: [
        { id: 4, name: "Samsung Galaxy S24", price: "45000", quantity: 1 },
        { id: 5, name: "Zaryadlash kabeli", price: "44000", quantity: 1 },
      ],
    },
    {
      id: "12347",
      date: "2024-08-27",
      items: 1,
      status: "processing",
      total: "35000",
      products: [
        { id: 6, name: "Bluetooth quloqlik", price: "35000", quantity: 1 },
      ],
    },
  ]);

  const [reviews, setReviews] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "text-[#249B73]  bg-green-100";
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

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleCreateReview = async () => {
    if (!newReview.comment.trim()) return;

    // API chaqiruvi simulatsiyasi
    const reviewData = {
      id: Date.now(),
      orderId: selectedOrder.id,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split("T")[0],
      userId: "current-user", // Haqiqiy dasturda foydalanuvchi ID si bo'ladi
    };

    // /review/create API ga so'rov yuborish simulatsiyasi
    console.log("POST /review/create", reviewData);

    setReviews((prev) => [...prev, reviewData]);
    setNewReview({ rating: 5, comment: "" });

    // Muvaffaqiyatli xabar
    alert("Sharh muvaffaqiyatli qo'shildi!");
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm("Ushbu sharhni o'chirmoqchimisiz?")) return;

    // /review/delete/my/:id API ga so'rov yuborish simulatsiyasi
    console.log(`DELETE /review/delete/my/${reviewId}`);

    setReviews((prev) => prev.filter((review) => review.id !== reviewId));
    alert("Sharh o'chirildi!");
  };

  const getOrderReviews = (orderId) => {
    return reviews.filter((review) => review.orderId === orderId);
  };

  const canReview = (order) => {
    return (
      order.status === "delivered" && getOrderReviews(order.id).length === 0
    );
  };

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
              <div className="grid grid-cols-2 gap-4 mb-4">
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
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Mahsulotlar</p>
                <div className="space-y-2">
                  {selectedOrder.products.map((product) => (
                    <div
                      key={product.id}
                      className="flex justify-between items-center"
                    >
                      <span>{product.name}</span>
                      <span>
                        {product.quantity} x {product.price} so'm
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Jami:</span>
                    <span>{selectedOrder.total} so'm</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sharh qoldirish (faqat yetkazilgan buyurtmalar uchun) */}
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
                          } hover:text-yellow-500`}
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
                      className="w-full p-3 border rounded-lg resize-none"
                      rows="4"
                      placeholder="Buyurtma haqida fikringizni yozing..."
                    />
                  </div>
                  <button
                    onClick={handleCreateReview}
                    disabled={!newReview.comment.trim()}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
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
                          className="text-red-600 hover:text-red-800 p-1"
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mening buyurtmalarim</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-gray-500">Buyurtmalar mavjud emas.</p>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[600px] space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-green-200 transition-colors"
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
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 px-3 py-1 rounded-lg hover:bg-blue-50"
                      >
                        <Eye size={16} />
                        Ko'rish
                      </button>

                      <Select value={order.status} disabled>
                        <SelectTrigger
                          className={`w-[120px] ${getStatusColor(
                            order.status
                          )} cursor-default border-0`}
                        >
                          <SelectValue>
                            {getStatusText(order.status)}
                          </SelectValue>
                        </SelectTrigger>
                      </Select>

                      <p className="font-semibold text-gray-900 min-w-[100px] text-right">
                        {order.total} so'm
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Orders;
