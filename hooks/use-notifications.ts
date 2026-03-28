import { registerForPushNotificationsAsync, scheduleDailyReminders } from '@/lib/notifications';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

export function useNotifications() {
  const router = useRouter();
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    // 1. Register for notifications and schedule daily reminders
    registerForPushNotificationsAsync().then(token => {
      scheduleDailyReminders();
    });

    // 2. Listen for notifications while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received in foreground:', notification);
    });

    // 3. Listen for user interaction with notifications (tapping on them)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      
      if (data?.screen) {
        // Navigate based on notification data
        if (data.screen === 'home') {
          router.push('/(tabs)');
        } else if (data.screen === 'breathing-exercise') {
          router.push('/breathing-exercise');
        }
      }
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);
}
