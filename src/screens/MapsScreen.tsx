import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { timelineEvents, TimelineEvent } from '../../timeline-data';
import FilterModal, { FilterState } from '../components/FilterModal';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MapsScreenProps {
  onClose: () => void;
  onEventPress?: (event: TimelineEvent) => void;
}

// Geocoding data for known locations (approximations)
const locationCoordinates: { [key: string]: { latitude: number; longitude: number } } = {
  'Liozna, Belarus': { latitude: 55.0256, longitude: 30.7985 },
  'Slavuta, Ukraine': { latitude: 50.3023, longitude: 26.8706 },
  'S. Petersburg, Russia': { latitude: 59.9343, longitude: 30.3351 },
  'Lubavitch, Russia': { latitude: 54.5108, longitude: 32.0453 },
  'Vitebsk, Russia': { latitude: 55.1904, longitude: 30.2049 },
  'Niezhin, Russia': { latitude: 51.0426, longitude: 31.8861 },
  'Piyena, Russia': { latitude: 54.2833, longitude: 28.5167 },
  'Rostov, Russia': { latitude: 47.2357, longitude: 39.7015 },
  'Leningrad, Soviet Union': { latitude: 59.9343, longitude: 30.3351 },
  'Warsaw, Poland': { latitude: 52.2297, longitude: 21.0122 },
  'New York, USA': { latitude: 40.7128, longitude: -74.0060 },
  'Brooklyn, New York': { latitude: 40.6782, longitude: -73.9442 },
  'Alma-Ata, Kazakhstan': { latitude: 43.2220, longitude: 76.8512 },
  'Riga, Latvia': { latitude: 56.9496, longitude: 24.1052 },
  'Babinovitch, Russia': { latitude: 54.4667, longitude: 32.1167 },
  'Nikolayev, Ukraine': { latitude: 46.9659, longitude: 32.0000 },
  'Liverpool England.': { latitude: 53.4084, longitude: -2.9916 },
  'Worldwide': { latitude: 40.7128, longitude: -74.0060 }, // Default to NYC for worldwide
};

const MapsScreen: React.FC<MapsScreenProps> = ({ onClose, onEventPress }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({ rebbeim: [], eventTypes: [] });
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const mapRef = useRef<MapView>(null);

  // Request location permission on mount
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    })();
  }, []);

  // Filter events and add coordinates
  const eventsWithLocations = useMemo(() => {
    let events = timelineEvents.filter(event => {
      const coords = locationCoordinates[event.location];
      return coords !== undefined;
    });

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      events = events.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
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

    return events.map(event => ({
      ...event,
      coordinates: locationCoordinates[event.location],
    }));
  }, [searchQuery, filters]);

  const activeFilterCount = filters.rebbeim.length + filters.eventTypes.length;

  // Recenter map on user location
  const recenterOnUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 10,
        longitudeDelta: 10,
      }, 1000);
    } else {
      Alert.alert('Location Not Available', 'Please enable location permissions');
    }
  };

  // Calculate initial region to show all markers
  const initialRegion = useMemo(() => {
    if (eventsWithLocations.length === 0) {
      return {
        latitude: 50.0,
        longitude: 20.0,
        latitudeDelta: 50,
        longitudeDelta: 50,
      };
    }

    const lats = eventsWithLocations.map(e => e.coordinates.latitude);
    const longs = eventsWithLocations.map(e => e.coordinates.longitude);
    
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLong = Math.min(...longs);
    const maxLong = Math.max(...longs);

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLong + maxLong) / 2,
      latitudeDelta: (maxLat - minLat) * 1.5,
      longitudeDelta: (maxLong - minLong) * 1.5,
    };
  }, [eventsWithLocations]);

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
          <Text style={styles.headerTitle}>Event Locations</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Search and Filter Bar */}
        <View style={styles.searchBar}>
          <View style={styles.searchInputWrapper}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search locations..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <Text style={styles.filterIcon}>⚙</Text>
            {activeFilterCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Map */}
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          showsUserLocation={true}
          showsMyLocationButton={false}
        >
          {eventsWithLocations.map((event, index) => (
            <Marker
              key={`${event.eventId}-${index}`}
              coordinate={event.coordinates}
              pinColor="#4a9eff"
            >
              <Callout
                tooltip={false}
                onPress={() => onEventPress?.(event)}
              >
                <View style={styles.calloutContainer}>
                  {event.image && (
                    <Image
                      source={{ uri: `https://www.chabadtimeline.com${event.image}` }}
                      style={styles.calloutImage}
                      resizeMode="cover"
                    />
                  )}
                  <View style={styles.calloutContent}>
                    <Text style={styles.calloutYear}>{event.year}</Text>
                    <Text style={styles.calloutTitle} numberOfLines={2}>
                      {event.title}
                    </Text>
                    <Text style={styles.calloutLocation}>
                      📍 {event.location}
                    </Text>
                    <Text style={styles.calloutTap}>Tap for details</Text>
                  </View>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>

        {/* Recenter Button */}
        <TouchableOpacity
          style={styles.recenterButton}
          onPress={recenterOnUser}
        >
          <Text style={styles.recenterIcon}>📍</Text>
        </TouchableOpacity>

        {/* Event Count */}
        <View style={styles.eventCount}>
          <Text style={styles.eventCountText}>
            {eventsWithLocations.length} location{eventsWithLocations.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Filter Modal */}
        <FilterModal
          visible={filterModalVisible}
          onClose={() => setFilterModalVisible(false)}
          onApply={setFilters}
          currentFilters={filters}
        />
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerRight: {
    width: 44,
  },
  searchBar: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#1a1a1a',
    gap: 10,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#fff',
    fontSize: 16,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    fontSize: 20,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#4a9eff',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  map: {
    flex: 1,
  },
  calloutContainer: {
    width: 240,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  calloutImage: {
    width: '100%',
    height: 120,
  },
  calloutContent: {
    padding: 12,
  },
  calloutYear: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4a9eff',
    marginBottom: 4,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 6,
  },
  calloutLocation: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  calloutTap: {
    fontSize: 11,
    color: '#4a9eff',
    fontStyle: 'italic',
  },
  recenterButton: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4a9eff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  recenterIcon: {
    fontSize: 24,
  },
  eventCount: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  eventCountText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MapsScreen;
