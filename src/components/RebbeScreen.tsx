import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
} from 'react-native';
import { Audio } from 'expo-av';
import { RebbeData } from '../../rebbeim-data';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface RebbeScreenProps {
  rebbeData: RebbeData;
  onClose: () => void;
  onEventPress?: (event: any) => void;
}

const RebbeScreen: React.FC<RebbeScreenProps> = ({ rebbeData, onClose, onEventPress }) => {
  const [playingNiggun, setPlayingNiggun] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    // Configure audio mode
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
    });

    // Cleanup function
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const handlePlayNiggun = async (audioFile: string) => {
    try {
      // If same niggun is playing, pause it
      if (playingNiggun === audioFile && soundRef.current) {
        await soundRef.current.pauseAsync();
        setPlayingNiggun(null);
        return;
      }

      // Stop and unload previous sound
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      setIsLoading(true);

      // Load and play new sound
      const { sound } = await Audio.Sound.createAsync(
        { uri: `https://www.chabadtimeline.com${audioFile}` },
        { shouldPlay: true }
      );

      soundRef.current = sound;
      setPlayingNiggun(audioFile);
      setIsLoading(false);

      // Set up playback status update
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingNiggun(null);
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsLoading(false);
      setPlayingNiggun(null);
    }
  };

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
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{rebbeData.name}</Text>
          {rebbeData.fullName && (
            <Text style={styles.headerSubtitle}>{rebbeData.fullName}</Text>
          )}
        </View>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Biography Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Biography</Text>
          <Text style={styles.description}>{rebbeData.description}</Text>
        </View>

        {/* Family Section */}
        {rebbeData.family && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Family</Text>
            <View style={styles.familyContent}>
              <View style={styles.familyRow}>
                <Text style={styles.familyLabel}>Last Name:</Text>
                <Text style={styles.familyValue}>{rebbeData.family.lastName}</Text>
              </View>
              
              {rebbeData.family.father && (
                <View style={styles.familyRow}>
                  <Text style={styles.familyLabel}>Father:</Text>
                  <Text style={styles.familyValue}>{rebbeData.family.father}</Text>
                </View>
              )}
              
              {rebbeData.family.mother && (
                <View style={styles.familyRow}>
                  <Text style={styles.familyLabel}>Mother:</Text>
                  <Text style={styles.familyValue}>{rebbeData.family.mother}</Text>
                </View>
              )}
              
              {rebbeData.family.wife && (
                <View style={styles.familyRow}>
                  <Text style={styles.familyLabel}>Wife:</Text>
                  <Text style={styles.familyValue}>{rebbeData.family.wife}</Text>
                </View>
              )}
              
              {rebbeData.family.children && rebbeData.family.children.length > 0 && (
                <View style={styles.familyRow}>
                  <Text style={styles.familyLabel}>Children:</Text>
                  <View style={styles.familyList}>
                    {rebbeData.family.children.map((child, index) => (
                      <Text key={index} style={styles.familyValue}>• {child}</Text>
                    ))}
                  </View>
                </View>
              )}
              
              {rebbeData.family.siblings && rebbeData.family.siblings.length > 0 && (
                <View style={styles.familyRow}>
                  <Text style={styles.familyLabel}>Siblings:</Text>
                  <View style={styles.familyList}>
                    {rebbeData.family.siblings.map((sibling, index) => (
                      <Text key={index} style={styles.familyValue}>• {sibling}</Text>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Sefarim Section */}
        {rebbeData.sefarim && rebbeData.sefarim.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sefarim</Text>
            <View style={styles.sefarimGrid}>
              {rebbeData.sefarim.map((sefer, index) => (
                <View key={index} style={styles.seferCard}>
                  {sefer.titleHebrew && (
                    <Text style={styles.seferTitleHebrew}>{sefer.titleHebrew}</Text>
                  )}
                  <Text style={styles.seferTitle}>{sefer.title}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Niggunim Section */}
        {rebbeData.niggunim && rebbeData.niggunim.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Niggunim</Text>
            <View style={styles.niggunimList}>
              {rebbeData.niggunim.map((niggun, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.niggunCard}
                  onPress={() => handlePlayNiggun(niggun.audioFile)}
                  disabled={isLoading}
                >
                  <View style={styles.niggunIcon}>
                    <Text style={styles.niggunIconText}>
                      {isLoading && playingNiggun === niggun.audioFile
                        ? '...'
                        : playingNiggun === niggun.audioFile
                        ? '❚❚'
                        : '▸'}
                    </Text>
                  </View>
                  <View style={styles.niggunInfo}>
                    <Text style={styles.niggunTitle}>{niggun.title}</Text>
                    {niggun.description && (
                      <Text style={styles.niggunDescription}>{niggun.description}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Timeline Events Section */}
        {rebbeData.timeline && rebbeData.timeline.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Timeline Events ({rebbeData.timeline.length})
            </Text>
            <View style={styles.timelineList}>
              {rebbeData.timeline.map((event, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.eventCard}
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
                    <Text style={styles.eventYear}>{event.year}</Text>
                    <Text style={styles.eventTitle} numberOfLines={2}>
                      {event.title}
                    </Text>
                    <Text style={styles.eventDate}>{event.hebrewDate}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

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
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  headerRight: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a9eff',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#ccc',
    lineHeight: 24,
  },
  familyContent: {
    gap: 12,
  },
  familyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  familyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#888',
    minWidth: 100,
  },
  familyValue: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
  familyList: {
    flex: 1,
    gap: 4,
  },
  sefarimGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  seferCard: {
    width: (SCREEN_WIDTH - 64) / 2,
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  seferTitleHebrew: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a9eff',
    marginBottom: 8,
  },
  seferTitle: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
  },
  niggunimList: {
    gap: 12,
  },
  niggunCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
    gap: 16,
  },
  niggunIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4a9eff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  niggunIconText: {
    fontSize: 20,
    color: '#fff',
  },
  niggunInfo: {
    flex: 1,
  },
  niggunTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  niggunDescription: {
    fontSize: 14,
    color: '#888',
  },
  timelineList: {
    gap: 12,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  eventImage: {
    width: 100,
    height: 100,
  },
  eventContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
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
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 12,
    color: '#888',
  },
  bottomPadding: {
    height: 40,
  },
});

export default RebbeScreen;
