import React, { useState, useMemo, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';
import SearchResultsView from '../components/SearchResultsView';
import ProgressIndicator from '../components/ProgressIndicator';
import EventDetailScreen from './EventDetailScreen';
import ShareModal from '../components/ShareModal';
import CalendarScreen from './CalendarScreen';
import MapsScreen from './MapsScreen';
import { FilterState } from '../components/FilterModal';
import { timelineEvents, TimelineEvent } from '../../timeline-data';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function TimelineScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({ rebbeim: [], eventTypes: [] });
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [eventToShare, setEventToShare] = useState<TimelineEvent | null>(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [mapsVisible, setMapsVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleNavigate = (screen: string) => {
    if (screen === 'calendar') {
      setCalendarVisible(true);
    } else if (screen === 'maps') {
      setMapsVisible(true);
    }
    console.log('Navigate to:', screen);
  };

  const filteredEvents = useMemo(() => {
    let events = timelineEvents;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      events = events.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.hebrewDate.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query)
      );
    }

    // Apply Rebbe filter
    if (filters.rebbeim.length > 0) {
      events = events.filter(event =>
        event.tags.some(tag => filters.rebbeim.includes(tag))
      );
    }

    // Apply Event Type filter
    if (filters.eventTypes.length > 0) {
      events = events.filter(event =>
        filters.eventTypes.includes(event.eventType)
      );
    }

    return events;
  }, [searchQuery, filters]);

  const isSearchActive = searchQuery.trim() !== '' || filters.rebbeim.length > 0 || filters.eventTypes.length > 0;

  const handleEventPress = (event: TimelineEvent, index: number) => {
    // Find the index in the full timeline
    const fullTimelineIndex = timelineEvents.findIndex(e => e.eventId === event.eventId);
    if (fullTimelineIndex !== -1) {
      // Clear search and filters
      setSearchQuery('');
      setFilters({ rebbeim: [], eventTypes: [] });
      // Scroll to the event
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: fullTimelineIndex * SCREEN_HEIGHT,
          animated: true,
        });
        setCurrentEventIndex(fullTimelineIndex);
      }, 100);
    }
  };

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / SCREEN_HEIGHT);
    if (index !== currentEventIndex && index >= 0 && index < timelineEvents.length) {
      setCurrentEventIndex(index);
    }
  };

  const handleProgressSelect = (index: number) => {
    scrollViewRef.current?.scrollTo({
      y: index * SCREEN_HEIGHT,
      animated: true,
    });
    setCurrentEventIndex(index);
  };

  // Show search results view when searching/filtering
  if (isSearchActive) {
    return (
      <View style={styles.container}>
        <Header
          onNavigate={handleNavigate}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFiltersChange={setFilters}
        />
        <SearchResultsView 
          events={filteredEvents} 
          onEventPress={handleEventPress}
        />
      </View>
    );
  }

  // Show normal fullscreen timeline view
  return (
    <View style={styles.container}>
      <Header
        onNavigate={handleNavigate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFiltersChange={setFilters}
      />
      <ScrollView 
        ref={scrollViewRef}
        pagingEnabled={true}
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {timelineEvents.map((event, index) => (
          <ImageBackground
            key={index}
            source={{ uri: `https://www.chabadtimeline.com${event.image}` }}
            style={styles.eventPanel}
            imageStyle={styles.backgroundImage}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.85)']}
              locations={[0, 0.5, 1]}
              style={styles.gradient}
            />
            
            <View style={styles.contentContainer}>
              <View style={styles.eventContent}>
                <View style={styles.hebrewDateBadge}>
                  <Text style={styles.hebrewDateText}>{event.hebrewDate}</Text>
                </View>
                <Text style={styles.eventYear}>{event.year}</Text>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDescription}>{event.description}</Text>
                
                <View style={styles.metaContainer}>
                  <TouchableOpacity style={styles.locationPill}>
                    <Text style={styles.pillText}>📍 {event.location}</Text>
                  </TouchableOpacity>
                  
                  {event.tags.map((tag, tagIndex) => (
                    <TouchableOpacity key={tagIndex} style={styles.tagPill}>
                      <Text style={styles.pillText}>{tag}</Text>
                    </TouchableOpacity>
                  ))}
                  
                  <View style={[styles.tachnunPill, !event.tachnun && styles.noTachnunPill]}>
                    <Text style={styles.pillText}>
                      {event.tachnun ? 'Say Tachanun' : 'No Tachanun'}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.learnMoreButton}
                  onPress={() => setSelectedEvent(event)}
                >
                  <Text style={styles.learnMoreText}>Learn More</Text>
                  <Text style={styles.arrow}>→</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        ))}
      </ScrollView>
      <ProgressIndicator
        totalEvents={timelineEvents.length}
        currentIndex={currentEventIndex}
        onEventSelect={handleProgressSelect}
        events={timelineEvents.map(e => ({ year: e.year, title: e.title }))}
      />

      <EventDetailScreen
        visible={selectedEvent !== null}
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onShareEvent={() => {
          if (selectedEvent) {
            setEventToShare(selectedEvent);
            setShareModalVisible(true);
          }
        }}
        onAddToCalendar={() => console.log('Add to calendar')}
        onViewMap={() => console.log('View map')}
      />

      <ShareModal
        visible={shareModalVisible}
        event={eventToShare}
        onClose={() => setShareModalVisible(false)}
      />

      {calendarVisible && (
        <CalendarScreen
          onClose={() => setCalendarVisible(false)}
          onEventPress={(event) => {
            setCalendarVisible(false);
            setSelectedEvent(event);
          }}
        />
      )}

      {mapsVisible && (
        <MapsScreen
          onClose={() => setMapsVisible(false)}
          onEventPress={(event) => {
            setMapsVisible(false);
            setSelectedEvent(event);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  eventPanel: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'flex-end',
  },
  backgroundImage: {
    resizeMode: 'cover',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingTop: 60,
    paddingBottom: 100,
    paddingHorizontal: 24,
  },
  hebrewDateBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  hebrewDateText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  eventContent: {
    paddingBottom: 20,
  },
  eventYear: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    lineHeight: 34,
  },
  eventDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
    marginBottom: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 10,
  },
  locationPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tagPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tachnunPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  noTachnunPill: {
    backgroundColor: 'rgba(100, 150, 255, 0.25)',
  },
  pillText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '500',
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  learnMoreText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
    marginRight: 8,
  },
  arrow: {
    fontSize: 18,
    color: '#000',
  },
  noResultsContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noResultsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  noResultsSubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});