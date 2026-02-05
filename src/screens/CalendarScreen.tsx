import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  Pressable,
  Modal,
} from 'react-native';
import { HDate, months } from '@hebcal/core';
import { timelineEvents, TimelineEvent } from '../../timeline-data';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface GroupedEvents {
  [key: string]: TimelineEvent[];
}

const CalendarScreen: React.FC<{ onClose: () => void; onEventPress?: (event: TimelineEvent) => void }> = ({ 
  onClose, 
  onEventPress 
}) => {
  const today = new HDate();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Group events by Hebrew date (day-month format)
  const groupedEvents: GroupedEvents = useMemo(() => {
    const grouped: GroupedEvents = {};
    
    timelineEvents.forEach(event => {
      if (event.hebrewDate) {
        // Parse Hebrew date format: "DD Month YYYY" or "DD Month"
        const parts = event.hebrewDate.split(' ');
        if (parts.length >= 2) {
          const day = parts[0];
          const month = parts[1];
          const key = `${day}-${month}`;
          
          if (!grouped[key]) {
            grouped[key] = [];
          }
          grouped[key].push(event);
        }
      }
    });
    
    return grouped;
  }, []);

  // Get Hebrew month name
  const getHebrewMonthName = (monthNum: number): string => {
    const monthNames = [
      'Nisan', 'Iyar', 'Sivan', 'Tammuz', 'Av', 'Elul',
      'Tishrei', 'Cheshvan', 'Kislev', 'Tevet', 'Shevat', 'Adar',
      'Adar II'
    ];
    return monthNames[monthNum - 1] || '';
  };

  // Get days in current Hebrew month
  const getDaysInMonth = (): number => {
    const hd = new HDate(1, currentMonth, currentYear);
    return hd.daysInMonth();
  };

  // Get first day of week for month (0 = Sunday)
  const getFirstDayOfWeek = (): number => {
    const hd = new HDate(1, currentMonth, currentYear);
    const greg = hd.greg();
    return greg.getDay();
  };

  // Navigate to previous month
  const previousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(13); // or 12 depending on leap year
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
  };

  // Navigate to next month
  const nextMonth = () => {
    const isLeapYear = new HDate(1, 12, currentYear).isLeapYear();
    const maxMonth = isLeapYear ? 13 : 12;
    
    if (currentMonth === maxMonth) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
  };

  // Check if date has events
  const hasEvents = (day: number): boolean => {
    const monthName = getHebrewMonthName(currentMonth);
    const key = `${day}-${monthName}`;
    return !!groupedEvents[key];
  };

  // Check if date is today
  const isToday = (day: number): boolean => {
    return day === today.getDate() && 
           currentMonth === today.getMonth() && 
           currentYear === today.getFullYear();
  };

  // Handle date selection
  const selectDate = (day: number) => {
    const monthName = getHebrewMonthName(currentMonth);
    const key = `${day}-${monthName}`;
    setSelectedDate(key);
  };

  // Get events for selected date
  const getSelectedEvents = (): TimelineEvent[] => {
    if (!selectedDate) return [];
    return groupedEvents[selectedDate] || [];
  };

  // Render calendar grid
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth();
    const firstDayOfWeek = getFirstDayOfWeek();
    const days: React.ReactElement[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(
        <View key={`empty-${i}`} style={styles.dayCell}>
          <View style={styles.emptyDay} />
        </View>
      );
    }

    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const monthName = getHebrewMonthName(currentMonth);
      const key = `${day}-${monthName}`;
      const hasEvent = hasEvents(day);
      const isTodayDate = isToday(day);
      const isSelected = selectedDate === key;

      days.push(
        <TouchableOpacity
          key={day}
          style={styles.dayCell}
          onPress={() => selectDate(day)}
        >
          <View style={[
            styles.day,
            isTodayDate && styles.todayDay,
            isSelected && styles.selectedDay,
          ]}>
            <Text style={[
              styles.dayText,
              hasEvent && styles.dayWithEvent,
              isSelected && styles.selectedDayText,
            ]}>
              {day}
            </Text>
            {hasEvent && <View style={styles.eventDot} />}
          </View>
        </TouchableOpacity>
      );
    }

    return days;
  };

  // Render event card
  const renderEventCard = (event: TimelineEvent) => {
    return (
      <Pressable
        key={event.eventId}
        style={styles.eventCard}
        onPress={() => onEventPress?.(event)}
      >
        {event.image && (
          <Image
            source={{ uri: event.image }}
            style={styles.eventImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.eventContent}>
          <Text style={styles.eventYear}>{event.year}</Text>
          <Text style={styles.eventTitle}>{event.title}</Text>
          {event.description && (
            <Text style={styles.eventDescription} numberOfLines={2}>
              {event.description}
            </Text>
          )}
          {event.location && (
            <Text style={styles.eventLocation}>{event.location}</Text>
          )}
        </View>
      </Pressable>
    );
  };

  const selectedEvents = getSelectedEvents();
  const isCurrentMonth = currentMonth === today.getMonth() && currentYear === today.getFullYear();

  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Hebrew Calendar</Text>
            {isCurrentMonth && (
              <Text style={styles.headerSubtitle}>
                Today: {today.toString()}
              </Text>
            )}
          </View>
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={[styles.content, isTablet && styles.contentTablet]}>
            {/* Calendar Section */}
            <View style={[styles.calendarSection, isTablet && styles.calendarSectionTablet]}>
              {/* Month Navigation */}
              <View style={styles.monthHeader}>
                <TouchableOpacity onPress={previousMonth} style={styles.navButton}>
                  <Text style={styles.navButtonText}>←</Text>
                </TouchableOpacity>
                <View style={styles.monthTitleContainer}>
                  <Text style={styles.monthTitle}>
                    {getHebrewMonthName(currentMonth)} {currentYear}
                  </Text>
                </View>
                <TouchableOpacity onPress={nextMonth} style={styles.navButton}>
                  <Text style={styles.navButtonText}>→</Text>
                </TouchableOpacity>
              </View>

              {/* Day of Week Headers */}
              <View style={styles.weekDaysRow}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <View key={day} style={styles.weekDayCell}>
                    <Text style={styles.weekDayText}>{day}</Text>
                  </View>
                ))}
              </View>

              {/* Calendar Grid */}
              <View style={styles.calendarGrid}>
                {renderCalendar()}
              </View>
            </View>

            {/* Events Section */}
            <View style={[styles.eventsSection, isTablet && styles.eventsSectionTablet]}>
              <Text style={styles.eventsHeader}>
                {selectedDate ? `Events on ${selectedDate.split('-')[0]} ${selectedDate.split('-')[1]}` : 'Select a date'}
              </Text>
              
              {!selectedDate && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    Tap a date on the calendar to view events
                  </Text>
                </View>
              )}

              {selectedDate && selectedEvents.length === 0 && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    No events recorded for this date
                  </Text>
                </View>
              )}

              {selectedDate && selectedEvents.length > 0 && (
                <ScrollView style={styles.eventsList}>
                  {selectedEvents.map(renderEventCard)}
                </ScrollView>
              )}
            </View>
          </View>
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
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '600',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  contentTablet: {
    flexDirection: 'row',
    gap: 20,
  },
  calendarSection: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  calendarSectionTablet: {
    flex: 1,
    marginBottom: 0,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#2a2a2a',
  },
  navButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
  },
  monthTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    padding: 2,
  },
  emptyDay: {
    flex: 1,
  },
  day: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    position: 'relative',
  },
  todayDay: {
    borderWidth: 2,
    borderColor: '#4a9eff',
  },
  selectedDay: {
    backgroundColor: '#4a9eff',
  },
  dayText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  dayWithEvent: {
    color: '#4a9eff',
    fontWeight: '700',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: '700',
  },
  eventDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4a9eff',
  },
  eventsSection: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    minHeight: 300,
  },
  eventsSectionTablet: {
    flex: 1,
  },
  eventsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  eventsList: {
    flex: 1,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  eventImage: {
    width: 100,
    height: 100,
  },
  eventContent: {
    flex: 1,
    padding: 12,
  },
  eventYear: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4a9eff',
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  eventDescription: {
    fontSize: 13,
    color: '#aaa',
    lineHeight: 18,
    marginBottom: 6,
  },
  eventLocation: {
    fontSize: 12,
    color: '#888',
  },
});

export default CalendarScreen;
