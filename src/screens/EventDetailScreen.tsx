import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TimelineEvent } from '../../timeline-data';
import { detailedEvents } from '../../detailed-events-data';
import ShareModal from '../components/ShareModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface EventDetailScreenProps {
  visible: boolean;
  event: TimelineEvent | null;
  onClose: () => void;
  onShareEvent?: () => void;
  onAddToCalendar?: () => void;
  onViewMap?: () => void;
}

export default function EventDetailScreen({
  visible,
  event,
  onClose,
  onShareEvent,
  onAddToCalendar,
  onViewMap,
}: EventDetailScreenProps) {
  const [shareModalVisible, setShareModalVisible] = useState(false);
  
  if (!event) return null;

  // Try to get detailed event data
  const detailedEvent = event.eventId
    ? detailedEvents.find(e => e.id === event.eventId)
    : null;

  const handleShare = () => {
    setShareModalVisible(true);
    if (onShareEvent) onShareEvent();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {event.title}
            </Text>
            <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
              <Text style={styles.shareButtonText}>Share</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Hero Image */}
            <Image
              source={{ uri: `https://www.chabadtimeline.com${event.image}` }}
              style={styles.heroImage}
              resizeMode="cover"
            />

            {/* Content Section */}
            <View style={styles.contentSection}>
              <View style={styles.dateBadge}>
                <Text style={styles.hebrewDate}>{event.hebrewDate}</Text>
              </View>

              <Text style={styles.year}>{event.year}</Text>
              <Text style={styles.title}>{event.title}</Text>

              <Text style={styles.description}>
                {detailedEvent?.shortDescription || event.description}
              </Text>

              {/* Extended Description Sections */}
              {detailedEvent?.background && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Background</Text>
                  <Text style={styles.sectionText}>{detailedEvent.background}</Text>
                </View>
              )}

              {detailedEvent?.whatHappened && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>What Happened</Text>
                  <Text style={styles.sectionText}>{detailedEvent.whatHappened}</Text>
                </View>
              )}

              {detailedEvent?.aftermathImpact && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Aftermath & Impact</Text>
                  <Text style={styles.sectionText}>{detailedEvent.aftermathImpact}</Text>
                </View>
              )}

              {/* Metadata Badges */}
              <View style={styles.badgesContainer}>
                <TouchableOpacity style={styles.badge} onPress={onViewMap}>
                  <Text style={styles.badgeText}>📍 {event.location}</Text>
                </TouchableOpacity>

                {event.tags.map((tag, index) => (
                  <View key={index} style={styles.badge}>
                    <Text style={styles.badgeText}>{tag}</Text>
                  </View>
                ))}

                <View style={[styles.badge, !event.tachnun && styles.noTachnunBadge]}>
                  <Text style={styles.badgeText}>
                    {event.tachnun ? 'Say Tachanun' : 'No Tachanun'}
                  </Text>
                </View>

                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={onAddToCalendar}
                >
                  <Text style={styles.actionButtonText}>Add to Calendar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleShare}
                >
                  <Text style={styles.actionButtonText}>Share Event</Text>
                </TouchableOpacity>

                {event.location && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={onViewMap}
                  >
                    <Text style={styles.actionButtonText}>View on Map</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Quotes Section */}
              {detailedEvent?.quotes && detailedEvent.quotes.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Related Quotes</Text>
                  {detailedEvent.quotes.map((quote, index) => (
                    <View key={index} style={styles.quoteContainer}>
                      <Text style={styles.quoteText}>"{quote.text}"</Text>
                      <Text style={styles.quoteSource}>— {quote.source}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Customs Section */}
              {detailedEvent?.customs && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Customs & Observances</Text>
                  {detailedEvent.customs.farbrengen && (
                    <Text style={styles.customText}>• Farbrengen</Text>
                  )}
                  {detailedEvent.customs.kiddush && (
                    <Text style={styles.customText}>• Kiddush</Text>
                  )}
                  {detailedEvent.customs.kapota && (
                    <Text style={styles.customText}>• Wear Kapota</Text>
                  )}
                  {detailedEvent.customs.writePan && (
                    <Text style={styles.customText}>• Write Pan</Text>
                  )}
                  {detailedEvent.customs.extraTzedaka && (
                    <Text style={styles.customText}>• Extra Tzedaka</Text>
                  )}
                  {detailedEvent.customs.specialLearning && (
                    <Text style={styles.customText}>
                      • Special Learning: {detailedEvent.customs.specialLearning}
                    </Text>
                  )}
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>

      <ShareModal
        visible={shareModalVisible}
        event={event}
        onClose={() => setShareModalVisible(false)}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '300',
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  shareButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 24,
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  heroImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.56, // 16:9 aspect ratio
    backgroundColor: '#1a1a1a',
  },
  contentSection: {
    padding: 20,
  },
  dateBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
  },
  hebrewDate: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  year: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffa500',
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    lineHeight: 36,
  },
  description: {
    fontSize: 16,
    color: '#ccc',
    lineHeight: 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 15,
    color: '#ccc',
    lineHeight: 24,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  noTachnunBadge: {
    backgroundColor: 'rgba(100, 150, 255, 0.25)',
  },
  badgeText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '500',
  },
  actionsContainer: {
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  quoteContainer: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4a90e2',
  },
  quoteText: {
    fontSize: 15,
    color: '#fff',
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: 8,
  },
  quoteSource: {
    fontSize: 13,
    color: '#999',
  },
  customText: {
    fontSize: 15,
    color: '#ccc',
    lineHeight: 24,
    marginBottom: 8,
  },
});
