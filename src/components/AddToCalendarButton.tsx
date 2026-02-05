import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import * as Calendar from 'expo-calendar';

interface AddToCalendarButtonProps {
  title: string;
  description: string;
  location?: string;
  hebrewDate: string;
  gregorianDate?: Date | string;
  year?: string;
  style?: any;
  textStyle?: any;
}

export default function AddToCalendarButton({
  title,
  description,
  location,
  hebrewDate,
  gregorianDate,
  year,
  style,
  textStyle,
}: AddToCalendarButtonProps) {
  const [loading, setLoading] = useState(false);

  const requestCalendarPermissions = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === 'granted') {
      return true;
    } else {
      Alert.alert(
        'Permission Required',
        'Calendar access is needed to add events to your calendar'
      );
      return false;
    }
  };

  const getDefaultCalendarSource = async () => {
    if (Platform.OS === 'ios') {
      const defaultCalendar = await Calendar.getDefaultCalendarAsync();
      return defaultCalendar;
    } else {
      // Android
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const defaultCalendar = calendars.find((cal) => cal.isPrimary) || calendars[0];
      return defaultCalendar;
    }
  };

  const addEventToCalendar = async () => {
    const hasPermission = await requestCalendarPermissions();
    if (!hasPermission) return;

    try {
      const defaultCalendar = await getDefaultCalendarSource();

      if (!defaultCalendar) {
        Alert.alert('Error', 'No calendar found on your device');
        return;
      }

      // Ensure date is a Date object
      let startDate: Date;
      if (gregorianDate) {
        startDate = typeof gregorianDate === 'string' 
          ? new Date(gregorianDate) 
          : gregorianDate;
      } else if (year) {
        // Use January 1st of the given year
        startDate = new Date(parseInt(year), 0, 1);
      } else {
        // Fallback to current date
        startDate = new Date();
      }
      const endDate = new Date(startDate);

      const eventId = await Calendar.createEventAsync(defaultCalendar.id, {
        title: title,
        startDate: startDate,
        endDate: endDate,
        location: location || '',
        notes: `${description}\n\nHebrew Date: ${hebrewDate}`,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        allDay: true,
        alarms: [
          {
            relativeOffset: -60, // 1 hour before (in minutes)
            method: Calendar.AlarmMethod.ALERT,
          },
        ],
      });

      Alert.alert('Success!', 'Event added to your calendar');
      return eventId;
    } catch (error) {
      console.error('Calendar error:', error);
      Alert.alert('Error', 'Failed to add event to calendar. Please try again.');
    }
  };

  const handlePress = async () => {
    setLoading(true);
    await addEventToCalendar();
    setLoading(false);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={loading}
      style={[styles.button, style]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={[styles.buttonText, textStyle]}>📅 Add to Calendar</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4a90e2',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
