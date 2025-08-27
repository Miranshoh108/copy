import { create } from "zustand";

export const useNotificationsStore = create((set, get) => ({
  notifications: [],

  setNotifications: (newNotifications) => {
    set({
      notifications: Array.isArray(newNotifications) ? newNotifications : [],
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
          id: notification.id || Date.now(), // API dan id keladi, agar yo'q bo'lsa vaqt ishlatamiz
          read: notification.read || false,
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

  clearNotifications: () => {
    set({ notifications: [] });
  },
}));
