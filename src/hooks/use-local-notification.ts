import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

type LocalNotification = {
  ids: string[];
  shown: string[];
  unread: string[];
};

const MAX_ITEMS = 500;
const MAX_SHOWN_ITEMS = 100;

const limitArraySize = <T>(array: T[], maxSize: number = MAX_ITEMS): T[] => {
  if (array.length > maxSize) {
    return array.slice(-maxSize); // remove oldest id
  }
  return array;
};

const localNotificationAtom = atomWithStorage<LocalNotification>(
  "local-notification",
  {
    ids: [],
    shown: [],
    unread: [],
  },
  {
    getItem: (key, initialValue) => {
      const storedValue = localStorage.getItem(key);
      if (!storedValue) return initialValue;

      try {
        const parsedValue = JSON.parse(storedValue) as LocalNotification;
        // Limit array size when getting from storage
        return {
          ids: limitArraySize(parsedValue.ids || []),
          shown: limitArraySize(parsedValue.shown || [], MAX_SHOWN_ITEMS),
          unread: limitArraySize(parsedValue.unread || []),
        };
      } catch {
        return initialValue;
      }
    },
    setItem: (key, value) => {
      // Limit array size before saving to storage
      const limitedValue = {
        ids: limitArraySize(value.ids),
        shown: limitArraySize(value.shown, MAX_SHOWN_ITEMS),
        unread: limitArraySize(value.unread),
      };

      localStorage.setItem(key, JSON.stringify(limitedValue));
    },
    removeItem: (key) => localStorage.removeItem(key),
  }
);

export function useLocalNotification() {
  const [localNotification, setLocalNotification] = useAtom(localNotificationAtom);

  // Add ID to notification list
  const addToLocalNotification = (id: string) => {
    setLocalNotification(current => {
      if (current.ids.includes(id)) return current;
      return {
        ...current,
        ids: [...current.ids, id],
        // Do not add manga ID to unread list anymore
      };
    });
  };

  // Remove ID from notification list
  const removeFromLocalNotification = (id: string) => {
    setLocalNotification(current => ({
      ...current,
      ids: current.ids.filter(notificationId => notificationId !== id),
      // Keep unread list because ID in unread list is chapter ID, not manga ID
    }));
  };

  // Mark ID as seen
  const markAsShown = (id: string) => {
    setLocalNotification(current => {
      if (current.shown.includes(id)) return current;
      return {
        ...current,
        shown: [...current.shown, id],
      };
    });
  };

  // Mark ID as read (remove from unread)
  const markAsRead = (id: string) => {
    setLocalNotification(current => ({
      ...current,
      unread: current.unread.filter(notificationId => notificationId !== id),
    }));
  };

  // Mark ID as unread (add to unread)
  const markAsUnread = (id: string) => {
    setLocalNotification(current => {
      if (current.unread.includes(id)) return current;
      return {
        ...current,
        unread: [...current.unread, id],
      };
    });
  };

  // Check if ID has been seen
  const isShown = (id: string): boolean => {
    return localNotification.shown.includes(id);
  };

  // Check if ID is in notification list
  const isInLocalNotification = (id: string): boolean => {
    return localNotification.ids.includes(id);
  };

  // Check if ID is unread
  const isUnread = (id: string): boolean => {
    return localNotification.unread.includes(id);
  };

  // Clear all notifications
  const clearAllLocalNotifications = () => {
    setLocalNotification({ ids: [], shown: [], unread: [] });
  };

  // Clear all shown status
  const clearAllShownStatus = () => {
    setLocalNotification(current => ({
      ...current,
      shown: [],
    }));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setLocalNotification(current => ({
      ...current,
      unread: [],
    }));
  };

  return {
    localNotification,
    addToLocalNotification,
    removeFromLocalNotification,
    markAsShown,
    markAsRead,
    markAsUnread,
    isShown,
    isUnread,
    isInLocalNotification,
    clearAllLocalNotifications,
    clearAllShownStatus,
    markAllAsRead,
    rawSetLocalNotification: setLocalNotification
  };
}
