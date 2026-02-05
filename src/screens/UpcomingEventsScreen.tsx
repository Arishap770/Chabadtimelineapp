import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  Platform,
  Switch,
  Alert,
} from 'react-native';
import { HDate, months } from '@hebcal/core';
import * as Calendar from 'expo-calendar';
import { timelineEvents, TimelineEvent } from '../../timeline-data';
import {
  registerForPushNotificationsAsync,
  scheduleEventNotification,
  scheduleTodayNotification,
  cancelAllNotifications,
  getNotificationSettings,
  saveNotificationSettings,
  getAllScheduledNotifications,
  NotificationSettings,
} from '../services/notificationService';
import AddToCalendarButton from '../components/AddToCalendarButton';
import { getEventImage } from '../utils/imageMap';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface UpcomingEventsScreenProps {
  onClose: () => void;
  onEventPress?: (event: TimelineEvent) => void;
}

interface ProcessedEvent extends TimelineEvent {
  daysUntil: number;
  daysUntilNext: number;
  hasPassed: boolean;
  gregorianDate: Date;
}

// Mapping for Hebrew month names to month constants
const HEBREW_MONTHS: { [key: string]: number } = {
  'Nisan': months.NISAN,
  'Iyyar': months.IYYAR,
  'Sivan': months.SIVAN,
  'Tamuz': months.TAMUZ,
  'Av': months.AV,
  'Elul': months.ELUL,
  'Tishrei': months.TISHREI,
  'Cheshvan': months.CHESHVAN,
  'Kislev': months.KISLEV,
  'Tevet': months.TEVET,
  'Shvat': months.SHVAT,
  'Adar': months.ADAR_I,
  'Adar I': months.ADAR_I,
  'Adar II': months.ADAR_II,
};

const UpcomingEventsScreen: React.FC<UpcomingEventsScreenProps> = ({ onClose, onEventPress }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    enabled: false,
    daysBefore: 1,
    timeOfDay: { hour: 9, minute: 0 },
  });
  const [scheduledCount, setScheduledCount] = useState(0);

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    const settings = await getNotificationSettings();
    setNotificationSettings(settings);
    setNotificationsEnabled(settings.enabled);
    
    if (settings.enabled) {
      const scheduled = await getAllScheduledNotifications();
      setScheduledCount(scheduled.length);
    }
  };

  const handleToggleNotifications = async (value: boolean) => {
    if (value) {
      // Enable notifications
      const token = await registerForPushNotificationsAsync();
      if (!token) {
        Alert.alert('Permission Denied', 'Please enable notifications in your device settings.');
        return;
      }

      const newSettings = { ...notificationSettings, enabled: true };
      await saveNotificationSettings(newSettings);
      setNotificationSettings(newSettings);
      setNotificationsEnabled(true);

      // Schedule notifications for upcoming events
      await scheduleUpcomingNotifications(newSettings);
      
      Alert.alert('Notifications Enabled', 'You will receive notifications for upcoming events!');
    } else {
      // Disable notifications
      await cancelAllNotifications();
      const newSettings = { ...notificationSettings, enabled: false };
      await saveNotificationSettings(newSettings);
      setNotificationSettings(newSettings);
      setNotificationsEnabled(false);
      setScheduledCount(0);
      
      Alert.alert('Notifications Disabled', 'All scheduled notifications have been cancelled.');
    }
  };

  const scheduleUpcomingNotifications = async (settings: NotificationSettings) => {
    let count = 0;
    
    for (const event of upcomingEvents) {
      // Schedule notification for each upcoming event
      const notificationId = await scheduleEventNotification(
        event.title,
        event.gregorianDate,
        event.location || 'Location TBD',
        settings
      );
      
      if (notificationId) {
        count++;
      }

      // If event is today, also schedule a "today" notification
      if (event.daysUntilNext === 0) {
        await scheduleTodayNotification(
          event.title,
          event.location || 'Location TBD'
        );
      }
    }
    
    const scheduled = await getAllScheduledNotifications();
    setScheduledCount(scheduled.length);
  };

  const processedEvents = useMemo(() => {
    const today = new HDate();
    const todayGregorian = today.greg();
    
    const events: ProcessedEvent[] = timelineEvents
      .filter(event => event.hebrewDate && event.hebrewDate.trim() !== '')
      .map(event => {
        try {
          // Parse Hebrew date (format: "18 Elul 5505")
          const parts = event.hebrewDate.split(' ');
          if (parts.length < 2) return null;
          
          const day = parseInt(parts[0]);
          const monthName = parts[1];
          const monthNum = HEBREW_MONTHS[monthName];
          
          if (!monthNum || isNaN(day)) return null;
          
          // Calculate for current Hebrew year
          const currentHebrewYear = today.getFullYear();
          const eventDateThisYear = new HDate(day, monthNum, currentHebrewYear);
          const gregorianDateThisYear = eventDateThisYear.greg();
          
          // Calculate days difference
          const diffTime = gregorianDateThisYear.getTime() - todayGregorian.getTime();
          const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          // Check if event has passed this year
          const hasPassed = daysUntil < 0;
          
          // Calculate next occurrence (if passed, use next year)
          let nextEventDate = eventDateThisYear;
          let daysUntilNext = daysUntil;
          
          if (hasPassed) {
            nextEventDate = new HDate(day, monthNum, currentHebrewYear + 1);
            const gregorianDateNextYear = nextEventDate.greg();
            const diffTimeNext = gregorianDateNextYear.getTime() - todayGregorian.getTime();
            daysUntilNext = Math.ceil(diffTimeNext / (1000 * 60 * 60 * 24));
          }
          
          return {
            ...event,
            daysUntil,
            daysUntilNext,
            hasPassed,
            gregorianDate: hasPassed ? new HDate(day, monthNum, currentHebrewYear + 1).greg() : gregorianDateThisYear,
          } as ProcessedEvent;
        } catch (error) {
          console.error('Error processing event:', event.title, error);
          return null;
        }
      })
      .filter((event): event is ProcessedEvent => event !== null);
    
    return events;
  }, []);

  const upcomingEvents = useMemo(() => {
    return processedEvents
      .filter(event => !event.hasPassed)
      .sort((a, b) => a.daysUntilNext - b.daysUntilNext)
      .slice(0, 3);
  }, [processedEvents]);

  const recentEvents = useMemo(() => {
    return processedEvents
      .filter(event => event.hasPassed && event.daysUntil > -365)
      .sort((a, b) => b.daysUntil - a.daysUntil)
      .slice(0, 3);
  }, [processedEvents]);

  const requestCalendarPermissions = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    return status === 'granted';
  };

  const addToCalendar = async (event: ProcessedEvent) => {
    try {
      const hasPermission = await requestCalendarPermissions();
      if (!hasPermission) {
        alert('Calendar permission is required to add events');
        return;
      }

      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const defaultCalendar = calendars.find(cal => cal.allowsModifications) || calendars[0];

      if (!defaultCalendar) {
        alert('No calendar available');
        return;
      }

      const eventDate = event.gregorianDate;
      const endDate = new Date(eventDate);
      endDate.setHours(endDate.getHours() + 1);

      await Calendar.createEventAsync(defaultCalendar.id, {
        title: event.title,
        startDate: eventDate,
        endDate: endDate,
        location: event.location,
        notes: event.description,
        timeZone: 'America/New_York',
      });

      alert('Event added to calendar!');
    } catch (error) {
      console.error('Error adding to calendar:', error);
      alert('Failed to add event to calendar');
    }
  };

  const formatGregorianDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  const renderEventCard = (event: ProcessedEvent, isRecent: boolean = false) => (
    <TouchableOpacity
      key={event.eventId}
      style={[styles.eventCard, isRecent && styles.recentEventCard]}
      onPress={() => onEventPress?.(event)}
    >
      {event.image && (
        <Image
          source={getEventImage(event.image)}
          style={styles.eventImage}
          resizeMode="cover"
        />
      )}
      
      <View style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <Text style={styles.hebrewDate}>{event.hebrewDate}</Text>
          {event.tachnun && (
            <View style={styles.tachnunBadge}>
              <Text style={styles.tachnunText}>No Tachnun</Text>
            </View>
          )}
        </View>

        <Text style={styles.gregorianDate}>
          {formatGregorianDate(event.gregorianDate)}
        </Text>

        {event.location && (
          <Text style={styles.location}>{event.location}</Text>
        )}

        <View style={styles.daysContainer}>
          <Text style={styles.daysText}>
            {isRecent 
              ? `${Math.abs(event.daysUntil)} days ago`
              : event.daysUntilNext === 0 
                ? 'Today!'
                : event.daysUntilNext === 1
                  ? 'Tomorrow'
                  : `In ${event.daysUntilNext} days`
            }
          </Text>
        </View>

        <Text style={styles.eventTitle} numberOfLines={2}>
          {event.title}
        </Text>

        {event.description && (
          <Text style={styles.eventDescription} numberOfLines={3}>
            {event.description}
          </Text>
        )}

        {!isRecent && (
          <AddToCalendarButton
            title={event.title}
            description={event.description}
            location={event.location}
            hebrewDate={event.hebrewDate}
            gregorianDate={event.gregorianDate}
            style={styles.calendarButton}
            textStyle={styles.calendarButtonText}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Upcoming Events</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Notification Settings */}
          <View style={styles.notificationSection}>
            <View style={styles.notificationHeader}>
              <View>
                <Text style={styles.notificationTitle}>Event Notifications</Text>
                <Text style={styles.notificationSubtitle}>
                  Get notified about upcoming events
                </Text>
                {notificationsEnabled && scheduledCount > 0 && (
                  <Text style={styles.notificationCount}>
                    {scheduledCount} notification{scheduledCount !== 1 ? 's' : ''} scheduled
                  </Text>
                )}
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: '#333', true: '#4a9eff' }}
                thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>

          {/* Upcoming Events Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Next Events</Text>
            <Text style={styles.sectionSubtitle}>The next 3 upcoming events</Text>
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map(event => renderEventCard(event, false))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No upcoming events found</Text>
              </View>
            )}
          </View>

          {/* Recent Events Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Events</Text>
            <Text style={styles.sectionSubtitle}>The last 3 events that recently passed</Text>
            {recentEvents.length > 0 ? (
              recentEvents.map(event => renderEventCard(event, true))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No recent events found</Text>
              </View>
            )}
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerRight: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  notificationSection: {
    padding: 20,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 2,
    borderBottomColor: '#4a9eff',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  notificationSubtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  notificationCount: {
    fontSize: 12,
    color: '#4a9eff',
    fontWeight: '600',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a9eff',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
  },
  eventCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  recentEventCard: {
    opacity: 0.9,
  },
  eventImage: {
    width: '100%',
    height: 180,
  },
  eventContent: {
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  hebrewDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a9eff',
  },
  tachnunBadge: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tachnunText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  gregorianDate: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  daysContainer: {
    backgroundColor: '#2a2a2a',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  daysText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a9eff',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: '#aaa',
    lineHeight: 20,
    marginBottom: 12,
  },
  calendarButton: {
    backgroundColor: '#4a9eff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  calendarButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
  },
  bottomPadding: {
    height: 40,
  },
});

export default UpcomingEventsScreen;
