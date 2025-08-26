import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useNotificationsStore = create(
  persist(
    (set, get) => ({
      notifications: [],
      setNotifications: (newNotifications) => {
        set({
          notifications: Array.isArray(newNotifications)
            ? newNotifications
            : [],
        });
      },

      addNotification: (notification) => {
        const currentNotifications = get().notifications;
        const safeNotifications = Array.isArray(currentNotifications)
          ? currentNotifications
          : [];

        set({
          notifications: [
            ...safeNotifications,
            {
              ...notification,
              id: safeNotifications.length + 1,
              read: false,
            },
          ],
        });
      },

      markAsRead: (id) => {
        const currentNotifications = get().notifications;
        const safeNotifications = Array.isArray(currentNotifications)
          ? currentNotifications
          : [];

        set({
          notifications: safeNotifications.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
          ),
        });
      },

      markAllAsRead: () => {
        const currentNotifications = get().notifications;
        const safeNotifications = Array.isArray(currentNotifications)
          ? currentNotifications
          : [];

        set({
          notifications: safeNotifications.map((notif) => ({
            ...notif,
            read: true,
          })),
        });
      },

      deleteNotification: (id) => {
        const currentNotifications = get().notifications;
        const safeNotifications = Array.isArray(currentNotifications)
          ? currentNotifications
          : [];

        set({
          notifications: safeNotifications.filter((notif) => notif.id !== id),
        });
      },

      getUnreadCount: () => {
        const currentNotifications = get().notifications;
        const safeNotifications = Array.isArray(currentNotifications)
          ? currentNotifications
          : [];
        return safeNotifications.filter((notif) => !notif.read).length;
      },
    }),
    {
      name: "notifications-storage",
      getStorage: () =>
        typeof window !== "undefined" ? localStorage : undefined,
      onRehydrateStorage: () => (state) => {
        if (state && !Array.isArray(state.notifications)) {
          state.notifications = [];
        }
      },
    }
  )
);
