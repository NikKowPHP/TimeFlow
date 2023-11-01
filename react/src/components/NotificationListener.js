import { useEffect } from "react";
import { useNotificationState } from "./customHooks/useNotificationState";
import Pusher from "pusher-js";


export default function NotificationListener() {
  const { isNotificationGranted, displayNotification } = useNotificationState();

  useEffect(() => {
    if (isNotificationGranted) {
      const pusher = new Pusher("d8b02c52b2962fbc73f2", {
        cluster:'eu'
      });
      const channel = pusher.subscribe("notifications");
      channel.bind('DesktopNotificationEvent', (event) => {

        const { title, message } = event;
        console.log("received notification: ", event);
        displayNotification(title, { body: message });
      });
      return () => {
        channel.unbind("DesktopNotificationEvent");
        pusher.unsubscribe("notifications");
      };
    }
  }, []);
}
