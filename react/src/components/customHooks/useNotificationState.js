import { useState } from "react";

export function useNotificationState() {
  const [isNotificationGranted, setIsNotificationGranted] = useState(
    Notification.permission === "granted"
  );

  function requestNotificationPermission() {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setIsNotificationGranted(true);
        }
      });
    }
  }
  function displayNotification(title, options) {
    if (isNotificationGranted) {
      const notification = new Notification(title, options);

      notification.onclick = () => {
        console.log("Notification clicked");
      };
    }
  }

	return { isNotificationGranted, requestNotificationPermission, displayNotification }
}
