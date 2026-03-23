import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
    
    try {
      const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        console.warn('Project ID not found, notifications might not work correctly in production');
      }
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    } catch (e) {
      console.error('Error getting push token:', e);
    }
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}

export async function scheduleDailyReminders() {
  if (Platform.OS === 'web') {
    console.log('Scheduled notifications are not supported on web');
    return;
  }

  // Clear all existing notifications to avoid duplicates
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Reminder 1: "How are you feeling today?" (9:00 AM)
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Good Morning! ☀️",
      body: "How are you feeling today? Take a moment to check in with yourself.",
      data: { screen: 'home' },
    },
    trigger: {
      type: SchedulableTriggerInputTypes.CALENDAR,
      hour: 9,
      minute: 0,
      repeats: true,
    },
  });

  // Reminder 2: "Time for your breathing exercise" (2:00 PM)
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Breathe In, Breathe Out 🧘",
      body: "Time for your breathing exercise. A quick reset can make a big difference.",
      data: { screen: 'breathing-exercise' },
    },
    trigger: {
      type: SchedulableTriggerInputTypes.CALENDAR,
      hour: 14,
      minute: 0,
      repeats: true,
    },
  });

  // Reminder 3: "Don't forget your daily check-in" (8:00 PM)
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Daily Reflection 📝",
      body: "Don't forget your daily check-in. How was your day overall?",
      data: { screen: 'home' },
    },
    trigger: {
      type: SchedulableTriggerInputTypes.CALENDAR,
      hour: 20,
      minute: 0,
      repeats: true,
    },
  });
  
  console.log('Daily reminders scheduled successfully');
}
