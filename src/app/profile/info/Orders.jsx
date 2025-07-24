import { useEffect, useState } from "react";
import { Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("orders");
    if (stored) {
      setOrders(JSON.parse(stored));
    }
  }, []);

  const handleStatusChange = (id, newStatus) => {
    const updated = orders.map((order) =>
      order.id === id ? { ...order, status: newStatus } : order
    );
    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "text-green-600 bg-green-100";
      case "shipping":
        return "text-blue-600 bg-blue-100";
      case "processing":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

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
            orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-blue-200 transition-colors"
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
                  <Select value={order.status} disabled>
                    <SelectTrigger
                      className={`w-[120px] ${getStatusColor(
                        order.status
                      )} cursor-default`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="processing">Tayyorlanmoqda</SelectItem>
                      <SelectItem value="shipping">Yo'lda</SelectItem>
                      <SelectItem value="delivered">Yetkazildi</SelectItem>
                    </SelectContent>
                  </Select>

                  <p className="font-semibold text-gray-900">
                    {order.total} so'm
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Orders;
