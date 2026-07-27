import { useEffect } from "react";

export default function useNotification(completed) {
  useEffect(() => {
    if (!completed) return;

    if (!("Notification" in window)) return;

    async function notify() {
      if (Notification.permission === "default") {
        await Notification.requestPermission();
      }

      if (Notification.permission === "granted") {
        new Notification("🎉 Focus Session Complete", {
          body: "Great work! Time for a well-deserved break.",
          icon: "/logo192.png", // optional, change later
        });
      }
    }

    notify();
  }, [completed]);
}