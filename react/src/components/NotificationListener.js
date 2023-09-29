import { useEffect } from "react";
import { useNotificationState } from "./customHooks/useNotificationState";
import Echo from 'laravel-echo';

export default function NotificationListener() {
  const {
    isNotificationGranted,
    requestNotificationPermission,
    displayNotification,
  } = useNotificationState();

  useEffect(() => {
		if(isNotificationGranted) {
			const echo = new Echo({
				broadcaster: 'socket.io',
				host: window.location.hostname + ':6001',
			})

			echo.channel('notifications')
			.listen('DesktopNotification', (notification)=> {
				const {title, message} = notification;
				displayNotification(title, {body: message});
			})
		}
	}, [isNotificationGranted]);
}
