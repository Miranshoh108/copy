"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { BookOpenCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotificationsStore } from "../store/useNotificationsStore";

export default function NotificationModal({ open, setOpen }) {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } =
    useNotificationsStore();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="top-70 left-235 p-0">
        <div className="flex items-center gap-40 px-4 py-2 border-b">
          <DialogTitle className="text-lg font-semibold">
            Bildirishnomalar
          </DialogTitle>
          <Button
            variant="link"
            onClick={markAllAsRead}
            className="flex items-center gap-1 text-sm text-[#1862D9] hover:underline cursor-pointer"
          >
            <BookOpenCheck size={18} />
            <span>Barchasini o‘qish</span>
          </Button>
        </div>

        <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-center">Bildirishnoma yo‘q</p>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded border ${
                  item.read
                    ? "border-gray-200 bg-gray-50"
                    : "border-blue-200 bg-blue-50"
                } hover:bg-[#EFF6FF] transition`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3
                        className={`font-medium ${
                          item.read ? "text-gray-700" : "text-gray-900"
                        }`}
                      >
                        {item.title}
                      </h3>
                      {!item.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <p
                      className={`text-sm mt-1 ${
                        item.read ? "text-gray-500" : "text-gray-700"
                      }`}
                    >
                      {item.description}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        item.read ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {item.time}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!item.read && (
                      <Button
                        variant="link"
                        onClick={() => markAsRead(item.id)}
                        className="text-blue-600 hover:text-blue-800 text-xs cursor-pointer"
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
      </DialogContent>
    </Dialog>
  );
}
