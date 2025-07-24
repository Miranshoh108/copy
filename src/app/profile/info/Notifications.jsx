"use client";
import { Bell, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNotificationsStore } from "@/app/store/useNotificationsStore";

const Notifications = () => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } =
    useNotificationsStore();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Bildirishnomalar</CardTitle>
          <Button
            variant="link"
            onClick={markAllAsRead}
            className="text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            Hammasini o'qigan deb belgilash
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center">Bildirishnoma yo‘q</p>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${
                  notification.read
                    ? "border-gray-200 bg-gray-50"
                    : "border-blue-200 bg-blue-50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3
                        className={`font-medium ${
                          notification.read ? "text-gray-700" : "text-gray-900"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <p
                      className={`text-sm mt-1 ${
                        notification.read ? "text-gray-500" : "text-gray-700"
                      }`}
                    >
                      {notification.description}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        notification.read ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {notification.time}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!notification.read && (
                      <Button
                        variant="link"
                        onClick={() => markAsRead(notification.id)}
                        className="text-blue-600 hover:text-blue-800 text-xs cursor-pointer"
                      >
                        O'qish
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteNotification(notification.id)}
                      className="text-red-600 hover:text-red-800 cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Notifications;
