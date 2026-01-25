import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Platform,
  Alert,
  Linking,
  Share as RNShare,
} from 'react-native';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system/legacy';
import { Asset } from 'expo-asset';
import { TimelineEvent } from '../../timeline-data';
import { getShareCardImage } from '../config/share-cards-config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ShareModalProps {
  visible: boolean;
  event: TimelineEvent | null;
  onClose: () => void;
}

export default function ShareModal({ visible, event, onClose }: ShareModalProps) {
  const [isSaving, setIsSaving] = useState(false);

  if (!event) return null;

  const shareCardImage = getShareCardImage(event.eventId);
  const shareText = `Check out this event from the Chabad Timeline: ${event.title}`;
  const eventUrl = `https://www.chabadtimeline.com/events/${event.eventId || ''}`;

  const handleCopyLink = async () => {
    // In web/mobile, we'd use Clipboard API, but for React Native:
    if (Platform.OS === 'web') {
      navigator.clipboard.writeText(eventUrl);
      Alert.alert('Success', 'Link copied to clipboard!');
    } else {
      // For React Native, we'll show the link
      Alert.alert('Event Link', eventUrl, [
        { text: 'OK', style: 'cancel' }
      ]);
    }
  };

  const handleCopyPicture = async () => {
    if (!shareCardImage) {
      Alert.alert('Error', 'No share card available for this event');
      return;
    }

    try {
      // First save to library, then user can access from photos
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant photo library access');
        return;
      }

      // Load the asset and get its downloadable URI
      const asset = Asset.fromModule(shareCardImage);
      await asset.downloadAsync();
      
      if (!asset.localUri) {
        Alert.alert('Error', 'Could not resolve image');
        return;
      }

      await MediaLibrary.saveToLibraryAsync(asset.localUri);
      Alert.alert('Success', 'Picture copied to clipboard! (Saved to Photos)');
    } catch (error) {
      console.error('Error copying picture:', error);
      Alert.alert('Error', 'Failed to copy picture');
    }
  };

  const handleSaveToPhotos = async () => {
    if (!shareCardImage) {
      Alert.alert('Error', 'No share card available for this event');
      return;
    }

    try {
      setIsSaving(true);

      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant photo library access to save images');
        setIsSaving(false);
        return;
      }

      // Load the asset and get its downloadable URI
      const asset = Asset.fromModule(shareCardImage);
      await asset.downloadAsync();
      
      if (!asset.localUri) {
        Alert.alert('Error', 'Could not resolve image');
        setIsSaving(false);
        return;
      }

      // Save to media library
      await MediaLibrary.saveToLibraryAsync(asset.localUri);
      
      Alert.alert('Success', 'Share card saved to photos!');
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert('Error', 'Failed to save image to photos');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNativeShare = async () => {
    if (!shareCardImage) {
      // Fallback to text-only share
      try {
        await RNShare.share({
          message: `${shareText}\n\n${eventUrl}`,
          title: event.title,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
      return;
    }

    try {
      // Load the asset and get its downloadable URI
      const asset = Asset.fromModule(shareCardImage);
      await asset.downloadAsync();
      
      if (!asset.localUri) {
        Alert.alert('Error', 'Could not resolve image');
        return;
      }

      // Copy image to temporary location
      const fileUri = `${FileSystem.cacheDirectory}share-card-${Date.now()}.jpg`;
      await FileSystem.copyAsync({
        from: asset.localUri,
        to: fileUri,
      });

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Error', 'Sharing is not available on this device');
        return;
      }

      // Share image with native share sheet
      await Sharing.shareAsync(fileUri, {
        mimeType: 'image/jpeg',
        dialogTitle: `Share ${event.title}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Failed to share');
    }
  };

  const handleShareToInstagramStories = async () => {
    if (!shareCardImage) {
      Alert.alert('Error', 'No share card available for this event');
      return;
    }

    try {
      // Load the asset and get its downloadable URI
      const asset = Asset.fromModule(shareCardImage);
      await asset.downloadAsync();
      
      if (!asset.localUri) {
        Alert.alert('Error', 'Could not resolve image');
        return;
      }

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert(
          'Expo Go Limitation', 
          'Image sharing to Instagram Stories requires a standalone build. For now, the image has been saved to your photos - you can manually share it from there!'
        );
        // Save to photos as fallback
        await handleSaveToPhotos();
        return;
      }

      // Copy image to a temporary location
      const fileUri = `${FileSystem.cacheDirectory}share-card-${Date.now()}.jpg`;
      await FileSystem.copyAsync({
        from: asset.localUri,
        to: fileUri,
      });

      // Use regular share which will show Instagram as an option
      await Sharing.shareAsync(fileUri, {
        mimeType: 'image/jpeg',
        dialogTitle: 'Share to Instagram Stories',
      });
    } catch (error) {
      console.error('Error sharing to Instagram:', error);
      Alert.alert(
        'Note', 
        'If running in Expo Go, full sharing features require a standalone build. The image has been saved to your photos!'
      );
      await handleSaveToPhotos();
    }
  };

  const handleShareToSocial = async (platform: string) => {
    if (platform === 'whatsapp' || platform === 'whatsapp-status') {
      // Share image with text to WhatsApp
      if (!shareCardImage) {
        Alert.alert('Error', 'No share card available for this event');
        return;
      }

      try {
        // Load the asset and get its downloadable URI
        const asset = Asset.fromModule(shareCardImage);
        await asset.downloadAsync();
        
        if (!asset.localUri) {
          Alert.alert('Error', 'Could not resolve image');
          return;
        }

        // Copy image to temporary location
        const fileUri = `${FileSystem.cacheDirectory}share-card-${Date.now()}.jpg`;
        await FileSystem.copyAsync({
          from: asset.localUri,
          to: fileUri,
        });

        // Share with WhatsApp - this will open WhatsApp with image pre-attached
        await Sharing.shareAsync(fileUri, {
          mimeType: 'image/jpeg',
          dialogTitle: platform === 'whatsapp-status' ? 'Share to WhatsApp Status' : 'Share via WhatsApp',
        });

      } catch (error) {
        console.error(`Error sharing to ${platform}:`, error);
        Alert.alert('Error', 'Failed to share to WhatsApp');
      }
      return;
    }
    
    let url = '';
    
    switch (platform) {
      case 'sms':
        url = `sms:${Platform.OS === 'ios' ? '&' : '?'}body=${encodeURIComponent(shareText + '\n' + eventUrl)}`;
        break;
    }

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Not Available', `Cannot open ${platform}`);
      }
    } catch (error) {
      console.error(`Error opening ${platform}:`, error);
      Alert.alert('Error', `Failed to open ${platform}`);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.overlayTouch} activeOpacity={1} onPress={onClose} />
        
        <View style={styles.modalContainer}>
          <View style={styles.handle} />
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Share Event</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Share Card Preview */}
            {shareCardImage && (
              <View style={styles.previewContainer}>
                <Image
                  source={shareCardImage}
                  style={styles.shareCardImage}
                  resizeMode="contain"
                />
              </View>
            )}

            {/* Share Actions Grid */}
            <Text style={styles.sectionTitle}>Share to</Text>
            <View style={styles.shareGrid}>
              <TouchableOpacity 
                style={styles.shareOption}
                onPress={handleShareToInstagramStories}
              >
                <View style={[styles.shareIcon, { backgroundColor: '#E1306C' }]}>
                  <Image
                    source={require('../../assets/instagram-logo.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.shareLabel}>Story</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.shareOption}
                onPress={() => handleShareToSocial('whatsapp')}
              >
                <View style={[styles.shareIcon, { backgroundColor: '#25D366' }]}>
                  <Image
                    source={require('../../assets/whatsapp-logo.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.shareLabel}>WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.shareOption}
                onPress={() => handleShareToSocial('whatsapp-status')}
              >
                <View style={[styles.shareIcon, { backgroundColor: '#128C7E' }]}>
                  <Image
                    source={require('../../assets/whatsapp-logo.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.shareLabel}>Status</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.shareOption}
                onPress={() => handleShareToSocial('sms')}
              >
                <View style={[styles.shareIcon, { backgroundColor: '#34C759' }]}>
                  <Text style={styles.shareIconText}>💬</Text>
                </View>
                <Text style={styles.shareLabel}>Messages</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.shareOption}
                onPress={handleCopyPicture}
              >
                <View style={[styles.shareIcon, { backgroundColor: '#5856D6' }]}>
                  <Text style={styles.shareIconText}>📋</Text>
                </View>
                <Text style={styles.shareLabel}>Copy</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.shareOption}
                onPress={handleSaveToPhotos}
                disabled={isSaving || !shareCardImage}
              >
                <View style={[styles.shareIcon, { backgroundColor: '#FF9500' }]}>
                  <Text style={styles.shareIconText}>⬇</Text>
                </View>
                <Text style={styles.shareLabel}>Download</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.shareOption}
                onPress={handleNativeShare}
              >
                <View style={[styles.shareIcon, { backgroundColor: '#666' }]}>
                  <Text style={styles.shareIconText}>⋯</Text>
                </View>
                <Text style={styles.shareLabel}>More</Text>
              </TouchableOpacity>
            </View>


          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  overlayTouch: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 34,
    maxHeight: '90%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#444',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#999',
    fontWeight: '300',
  },
  previewContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  shareCardImage: {
    width: '100%',
    height: (SCREEN_WIDTH - 40) * 0.75, // Approximate aspect ratio
    borderRadius: 12,
    backgroundColor: '#000',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  shareGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 16,
  },
  shareOption: {
    width: (SCREEN_WIDTH - 64) / 4,
    alignItems: 'center',
    marginBottom: 8,
  },
  shareIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  shareIconText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  logoImage: {
    width: 36,
    height: 36,
  },
  shareLabel: {
    fontSize: 12,
    color: '#ccc',
    textAlign: 'center',
  },
  additionalActions: {
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#333',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
