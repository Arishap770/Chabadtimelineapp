import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { TimelineEvent } from '../../timeline-data';
import { getEventImage } from '../utils/imageMap';

interface SearchResultsViewProps {
  events: TimelineEvent[];
  onEventPress: (event: TimelineEvent, index: number) => void;
}

export default function SearchResultsView({ events, onEventPress }: SearchResultsViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.resultCount}>{events.length} events</Text>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {events.map((event, index) => (
          <TouchableOpacity
            key={index}
            style={styles.eventCard}
            onPress={() => onEventPress(event, index)}
            activeOpacity={0.9}
          >
            <ImageBackground
              source={getEventImage(event.image)}
              style={styles.cardImage}
              imageStyle={styles.cardImageStyle}
            >
              <View style={styles.cardOverlay}>
                <View style={styles.cardContent}>
                  <Text style={styles.hebrewDate}>{event.hebrewDate}</Text>
                  <Text style={styles.year}>{event.year}</Text>
                </View>
              </View>
            </ImageBackground>
            <View style={styles.cardTextContent}>
              <Text style={styles.eventTitle}>{event.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 80,
  },
  resultCount: {
    fontSize: 14,
    color: '#999',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  eventCard: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  cardImageStyle: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
    padding: 15,
  },
  cardContent: {
    flexDirection: 'column',
  },
  hebrewDate: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 4,
  },
  year: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardTextContent: {
    padding: 15,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
