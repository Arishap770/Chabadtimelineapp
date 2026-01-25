import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ProgressIndicatorProps {
  totalEvents: number;
  currentIndex: number;
  onEventSelect: (index: number) => void;
  events: Array<{ year: string; title: string }>;
}

export default function ProgressIndicator({ totalEvents, currentIndex, onEventSelect, events }: ProgressIndicatorProps) {
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollViewRef.current && currentIndex >= 0) {
      // Scroll to center the current event
      const itemWidth = 60;
      const offset = Math.max(0, currentIndex * itemWidth - SCREEN_WIDTH / 2 + itemWidth / 2);
      scrollViewRef.current.scrollTo({ x: offset, animated: true });
    }
  }, [currentIndex]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {events.map((event, index) => (
          <TouchableOpacity
            key={index}
            style={styles.eventButton}
            onPress={() => onEventSelect(index)}
          >
            <View style={[styles.dot, currentIndex === index && styles.dotActive]} />
            <Text style={[styles.year, currentIndex === index && styles.yearActive]}>
              {event.year}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  scrollContent: {
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  eventButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    width: 60,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 4,
  },
  dotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4a90e2',
  },
  year: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500',
  },
  yearActive: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
});
