import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useNotificationsStore = create(
  persist(
    (set, get) => ({
      notifications: [
        {
          id: 1,
          title: "Yangi aksiya",
          description: "Bugun faqatgina siz uchun maxsus chegirma!",
          time: "2 kun oldin",
          read: false,
        },
        {
          id: 2,
          title: "Buyurtma holati",
          description: "Buyurtma #12345 yetkazib berildi",
          time: "1 hafta oldin",
          read: true,
        },
        {
          id: 3,
          title: "Bonus ballar",
          description: "Sizga 500 bonus ball yaralandi",
          time: "2 hafta oldin",
          read: true,
        },
        {
          id: 4,
          title: "Buyurtmangiz tasdiqlandi",
          description: "Siz 2 ta mahsulot buyurtma qildingiz",
          time: "1 daqiqa oldin",
          read: false,
        },
        {
          id: 5,
          title: "Yetkazib berish boshlandi",
          description: "Kuryer yo‘lga chiqdi",
          time: "5 daqiqa oldin",
          read: false,
        },
        {
          id: 6,
          title: "Yangi aksiya",
          description: "Bugun faqatgina siz uchun maxsus chegirma!",
          time: "2 kun oldin",
          read: false,
        },
        {
          id: 7,
          title: "Buyurtma holati",
          description: "Buyurtma #12345 yetkazib berildi",
          time: "1 hafta oldin",
          read: true,
        },
        {
          id: 8,
          title: "Bonus ballar",
          description: "Sizga 500 bonus ball yaralandi",
          time: "2 hafta oldin",
          read: true,
        },
        {
          id: 9,
          title: "Buyurtmangiz tasdiqlandi",
          description: "Siz 2 ta mahsulot buyurtma qildingiz",
          time: "1 daqiqa oldin",
          read: false,
        },
        {
          id: 10,
          title: "Yetkazib berish boshlandi",
          description: "Kuryer yo‘lga chiqdi",
          time: "5 daqiqa oldin",
          read: false,
        },
        {
          id: 11,
          title: "Yangi aksiya",
          description: "Bugun faqatgina siz uchun maxsus chegirma!",
          time: "2 kun oldin",
          read: false,
        },
        {
          id: 12,
          title: "Buyurtma holati",
          description: "Buyurtma #12345 yetkazib berildi",
          time: "1 hafta oldin",
          read: true,
        },
        {
          id: 13,
          title: "Bonus ballar",
          description: "Sizga 500 bonus ball yaralandi",
          time: "2 hafta oldin",
          read: true,
        },
        {
          id: 14,
          title: "Buyurtmangiz tasdiqlandi",
          description: "Siz 2 ta mahsulot buyurtma qildingiz",
          time: "1 daqiqa oldin",
          read: false,
        },
        {
          id: 15,
          title: "Yetkazib berish boshlandi",
          description: "Kuryer yo‘lga chiqdi",
          time: "5 daqiqa oldin",
          read: false,
        },
      ],
      addNotification: (notification) => {
        set({
          notifications: [
            ...get().notifications,
            {
              ...notification,
              id: get().notifications.length + 1,
              read: false,
            },
          ],
        });
      },
      markAsRead: (id) => {
        set({
          notifications: get().notifications.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
          ),
        });
      },
      markAllAsRead: () => {
        set({
          notifications: get().notifications.map((notif) => ({
            ...notif,
            read: true,
          })),
        });
      },
      deleteNotification: (id) => {
        set({
          notifications: get().notifications.filter((notif) => notif.id !== id),
        });
      },
      getUnreadCount: () => {
        return get().notifications.filter((notif) => !notif.read).length;
      },
    }),
    {
      name: "notifications-storage",
      getStorage: () =>
        typeof window !== "undefined" ? localStorage : undefined,
    }
  )
);
