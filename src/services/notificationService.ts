import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATION_STORAGE_KEY = '@notifications_enabled';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationSettings {
  enabled: boolean;
  daysBefore: number; // Days before event to notify
  timeOfDay: { hour: number; minute: number }; // Time to send notification
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: false,
  daysBefore: 1, // Notify 1 day before
  timeOfDay: { hour: 9, minute: 0 }, // 9:00 AM
};

export const registerForPushNotificationsAsync = async (): Promise<string | null> => {
  let token = null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#4a9eff',
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
      alert('Failed to get push notification permissions!');
      return null;
    }
    
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
};

export const saveNotificationSettings = async (settings: NotificationSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving notification settings:', error);
  }
};

export const getNotificationSettings = async (): Promise<NotificationSettings> => {
  try {
    const value = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (error) {
    console.error('Error reading notification settings:', error);
  }
  return DEFAULT_SETTINGS;
};

export const scheduleEventNotification = async (
  eventTitle: string,
  eventDate: Date,
  eventLocation: string,
  settings: NotificationSettings
): Promise<string | null> => {
  try {
    // Calculate notification date
    const notificationDate = new Date(eventDate);
    notificationDate.setDate(notificationDate.getDate() - settings.daysBefore);
    notificationDate.setHours(settings.timeOfDay.hour);
    notificationDate.setMinutes(settings.timeOfDay.minute);
    notificationDate.setSeconds(0);

    // Don't schedule if notification time has passed
    const now = new Date();
    if (notificationDate <= now) {
      return null;
    }

    const daysUntilEvent = Math.ceil(
      (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    let body = '';
    if (daysUntilEvent === 0) {
      body = `Today! ${eventLocation}`;
    } else if (daysUntilEvent === 1) {
      body = `Tomorrow at ${eventLocation}`;
    } else {
      body = `In ${daysUntilEvent} days at ${eventLocation}`;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: eventTitle,
        body: body,
        data: { eventTitle, eventDate: eventDate.toISOString(), eventLocation },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: notificationDate,
      },
    });

    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
};

export const scheduleTodayNotification = async (
  eventTitle: string,
  eventLocation: string
): Promise<string | null> => {
  try {
    const now = new Date();
    const notificationDate = new Date(now);
    
    // Schedule for 9 AM today if before 9 AM, otherwise schedule for now + 5 minutes
    if (now.getHours() < 9) {
      notificationDate.setHours(9, 0, 0, 0);
    } else {
      notificationDate.setMinutes(now.getMinutes() + 5);
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Event Today!',
        body: `${eventTitle} - ${eventLocation}`,
        data: { eventTitle, eventLocation, type: 'today' },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: notificationDate,
      },
    });

    return notificationId;
  } catch (error) {
    console.error('Error scheduling today notification:', error);
    return null;
  }
};

export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling notifications:', error);
  }
};

export const getAllScheduledNotifications = async (): Promise<Notifications.NotificationRequest[]> => {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
};
