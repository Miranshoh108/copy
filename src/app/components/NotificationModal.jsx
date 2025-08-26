"use client";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { BookOpenCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotificationsStore } from "../store/useNotificationsStore";
import $api from "../http/api";

export default function NotificationModal({ open, setOpen }) {
  const {
    notifications,
    setNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationsStore();

  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  useEffect(() => {
    if (open) {
      $api
        .get("/notifications/my")
        .then((res) => {
          setNotifications(
            Array.isArray(res.data.notifications) ? res.data.notifications : []
          );
        })
        .catch((err) => {
          console.error("Bildirishnomalarni olishda xatolik:", err.message);
          setNotifications([]);
        });
    }
  }, [open, setNotifications]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="top-70 right-4 p-0 h-[400px] overflow-y-auto">
        <div>
          <div className="flex items-center gap-38 px-4 py-2 border-b">
            <DialogTitle className="text-lg font-semibold">
              Bildirishnomalar
            </DialogTitle>
            <Button
              variant="link"
              onClick={markAllAsRead}
              className="flex items-center gap-1 text-sm text-[#249B73] hover:underline cursor-pointer"
            >
              <BookOpenCheck size={18} />
              <span>Barchasini o'qish</span>
            </Button>
          </div>

          <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto">
            {safeNotifications.length === 0 ? (
              <p className="text-gray-500 text-center">Bildirishnoma yo'q</p>
            ) : (
              safeNotifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded border ${
                    item.read
                      ? "border-gray-200 bg-gray-50"
                      : "border-green-200 bg-green-50"
                  } hover:bg-[#EFF6FF] transition`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3
                          className={`font-medium ${
                            item.readAt ? "text-gray-700" : "text-gray-900"
                          }`}
                        >
                          Bildirishnoma
                        </h3>
                        {!item.read && (
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        )}
                      </div>
                      <p
                        className={`text-sm mt-1 ${
                          item.readAt ? "text-gray-500" : "text-gray-700"
                        }`}
                      >
                        {item.message}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          item.readAt ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!item.read && (
                        <Button
                          variant="link"
                          onClick={() => markAsRead(item.id)}
                          className="text-green-600 hover:text-green-800 text-xs cursor-pointer"
                        >
                          O'qish
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteNotification(item.id)}
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
