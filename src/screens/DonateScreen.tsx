import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useTranslation } from '../i18n/LanguageContext';

interface DonateScreenProps {
  onClose: () => void;
}

const DonateScreen: React.FC<DonateScreenProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const cashTag = '$arishap1';
  const cashAppUrl = `https://cash.app/${cashTag}`;

  const handleDonate = async () => {
    try {
      const canOpen = await Linking.canOpenURL(cashAppUrl);
      if (canOpen) {
        await Linking.openURL(cashAppUrl);
      } else {
        Alert.alert(
          t('openCashApp'),
          'This will open CashApp in your browser.',
          [
            { text: t('cancel'), style: 'cancel' },
            { text: 'Continue', onPress: () => Linking.openURL(cashAppUrl) }
          ]
        );
      }
    } catch (error) {
      Alert.alert(t('error'), 'Could not open CashApp. Please try again later.');
    }
  };

  const copyCashTag = async () => {
    try {
      await Clipboard.setStringAsync(cashTag);
      setCopied(true);
      Alert.alert(t('success'), t('cashTagCopied'));
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      Alert.alert(t('error'), 'Could not copy to clipboard.');
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
          <Text style={styles.headerTitle}>{t('donate')}</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Title */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>{t('donateTitle')}</Text>
            <Text style={styles.subtitle}>
              {t('donateMessage')}
            </Text>
          </View>

          {/* What Donations Help With */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Support Helps With:</Text>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>Maintaining and updating the app regularly</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>Server and hosting costs</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>Developing new features and improvements</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>Keeping the app ad free</Text>
            </View>
          </View>

          {/* CashApp Section */}
          <View style={styles.cashAppSection}>
            <View style={styles.cashAppCard}>
              <Text style={styles.cashAppLabel}>{t('cashTag')}</Text>
              <Text style={styles.cashTag}>{cashTag}</Text>
              
              <TouchableOpacity 
                style={styles.copyButton}
                onPress={copyCashTag}
              >
                <Text style={styles.copyButtonText}>
                  {copied ? '✓ Copied!' : t('copyCashTag')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Primary Donate Button */}
            <TouchableOpacity 
              style={styles.donateButton}
              onPress={handleDonate}
              activeOpacity={0.8}
            >
              <Text style={styles.donateButtonText}>{t('openCashApp')}</Text>
            </TouchableOpacity>
          </View>

          {/* Thank You Message */}
          <View style={styles.thankYouSection}>
            <Text style={styles.thankYouText}>
              {t('thankYouMessage')}
            </Text>
            <Text style={styles.blessingText}>
              May Hashem bless you abundantly for your kindness!
            </Text>
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
  scrollContent: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 32,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a9eff',
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 16,
    color: '#4a9eff',
    marginRight: 12,
    fontWeight: 'bold',
  },
  listText: {
    fontSize: 16,
    color: '#ccc',
    flex: 1,
    lineHeight: 24,
  },
  cashAppSection: {
    marginBottom: 32,
    alignItems: 'center',
  },
  cashAppCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00C853',
    marginBottom: 20,
  },
  cashAppLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cashTag: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00C853',
    marginBottom: 16,
  },
  copyButton: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  copyButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  donateButton: {
    backgroundColor: '#00C853',
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#00C853',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  donateButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  amountCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amountLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a9eff',
    minWidth: 80,
  },
  amountDescription: {
    fontSize: 15,
    color: '#aaa',
    flex: 1,
  },
  thankYouSection: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
    marginTop: 8,
  },
  thankYouText: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  blessingText: {
    fontSize: 16,
    color: '#4a9eff',
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});

export default DonateScreen;
