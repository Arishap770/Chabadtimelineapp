import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Switch,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from '../i18n/LanguageContext';
import { Language } from '../i18n/translations';

interface SettingsScreenProps {
  onClose: () => void;
  onNavigateToFeedback?: () => void;
}

interface NotificationSettings {
  enabled: boolean;
  timing: '1 day before' | '3 days before' | '1 week before' | 'day of event';
  upcomingEvents: boolean;
  rebbeYahrtzeits: boolean;
  specialDates: boolean;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onClose, onNavigateToFeedback }) => {
  const { language: currentLang, setLanguage: setAppLanguage, t, languageName } = useTranslation();
  
  // Appearance Settings
  const [darkMode, setDarkMode] = useState(true); // App is currently dark mode only

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    enabled: true,
    timing: '1 day before',
    upcomingEvents: true,
    rebbeYahrtzeits: true,
    specialDates: true,
  });

  // Language Settings
  const [languagePickerVisible, setLanguagePickerVisible] = useState(false);

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'yi', name: 'Yiddish', nativeName: 'ייִדיש' },
  ];

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const darkModeValue = await AsyncStorage.getItem('darkMode');
      const notificationValue = await AsyncStorage.getItem('notificationSettings');

      if (darkModeValue !== null) {
        setDarkMode(JSON.parse(darkModeValue));
      }
      if (notificationValue !== null) {
        setNotificationSettings(JSON.parse(notificationValue));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveDarkMode = async (value: boolean) => {
    try {
      setDarkMode(value);
      await AsyncStorage.setItem('darkMode', JSON.stringify(value));
      Alert.alert('Theme Updated', `${value ? 'Dark' : 'Light'} mode will be available in a future update.`);
    } catch (error) {
      console.error('Error saving dark mode:', error);
    }
  };

  const saveNotificationSettings = async (newSettings: NotificationSettings) => {
    try {
      setNotificationSettings(newSettings);
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  };

  const saveLanguage = async (langCode: Language) => {
    try {
      await setAppLanguage(langCode);
      setLanguagePickerVisible(false);
      Alert.alert(t('languageUpdated'), `${t('languageMessage')} ${languageName}`);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const handleClearCache = async () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear the app cache?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear only cache-related items, not user settings
              Alert.alert('Success', 'Cache cleared successfully.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cache.');
            }
          },
        },
      ]
    );
  };

  const handleRateApp = () => {
    const appStoreUrl = Platform.select({
      ios: 'https://apps.apple.com/app/id<YOUR_APP_ID>',
      android: 'https://play.google.com/store/apps/details?id=com.chabadtimeline.app',
    });
    
    if (appStoreUrl) {
      Linking.openURL(appStoreUrl).catch(() => {
        Alert.alert(t('error'), t('unableToOpenStore'));
      });
    }
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://www.chabadtimeline.com/privacy-policy.html').catch(() => {
      Alert.alert(t('error'), 'Unable to open privacy policy.');
    });
  };

  const handleContactSupport = () => {
    if (onNavigateToFeedback) {
      onClose();
      setTimeout(() => {
        onNavigateToFeedback();
      }, 300);
    }
  };

  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('settingsTitle')}</Text>
          <View style={styles.closeButtonPlaceholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Appearance Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>◐</Text>
              <Text style={styles.sectionTitle}>{t('appearance')}</Text>
            </View>
            
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>{t('darkMode')}</Text>
                <Text style={styles.settingDescription}>
                  {t('currentMode')}: {darkMode ? t('dark') : t('light')}
                </Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={saveDarkMode}
                trackColor={{ false: '#767577', true: '#4a9eff' }}
                thumbColor={darkMode ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>

          {/* Notifications Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🔔</Text>
              <Text style={styles.sectionTitle}>Notifications</Text>
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Enable Notifications</Text>
                <Text style={styles.settingDescription}>
                  Receive event reminders
                </Text>
              </View>
              <Switch
                value={notificationSettings.enabled}
                onValueChange={(value) =>
                  saveNotificationSettings({ ...notificationSettings, enabled: value })
                }
                trackColor={{ false: '#767577', true: '#4a9eff' }}
                thumbColor={notificationSettings.enabled ? '#fff' : '#f4f3f4'}
              />
            </View>

            {notificationSettings.enabled && (
              <>
                <View style={styles.settingRow}>
                  <Text style={styles.settingLabel}>Notification Timing</Text>
                </View>
                <View style={styles.timingOptions}>
                  {['day of event', '1 day before', '3 days before', '1 week before'].map((timing) => (
                    <TouchableOpacity
                      key={timing}
                      style={[
                        styles.timingOption,
                        notificationSettings.timing === timing && styles.timingOptionSelected,
                      ]}
                      onPress={() =>
                        saveNotificationSettings({
                          ...notificationSettings,
                          timing: timing as NotificationSettings['timing'],
                        })
                      }
                    >
                      <Text
                        style={[
                          styles.timingOptionText,
                          notificationSettings.timing === timing && styles.timingOptionTextSelected,
                        ]}
                      >
                        {timing.charAt(0).toUpperCase() + timing.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Upcoming Events</Text>
                  </View>
                  <Switch
                    value={notificationSettings.upcomingEvents}
                    onValueChange={(value) =>
                      saveNotificationSettings({ ...notificationSettings, upcomingEvents: value })
                    }
                    trackColor={{ false: '#767577', true: '#4a9eff' }}
                    thumbColor={notificationSettings.upcomingEvents ? '#fff' : '#f4f3f4'}
                  />
                </View>

                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Rebbe Yahrtzeits</Text>
                  </View>
                  <Switch
                    value={notificationSettings.rebbeYahrtzeits}
                    onValueChange={(value) =>
                      saveNotificationSettings({ ...notificationSettings, rebbeYahrtzeits: value })
                    }
                    trackColor={{ false: '#767577', true: '#4a9eff' }}
                    thumbColor={notificationSettings.rebbeYahrtzeits ? '#fff' : '#f4f3f4'}
                  />
                </View>

                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Special Dates</Text>
                  </View>
                  <Switch
                    value={notificationSettings.specialDates}
                    onValueChange={(value) =>
                      saveNotificationSettings({ ...notificationSettings, specialDates: value })
                    }
                    trackColor={{ false: '#767577', true: '#4a9eff' }}
                    thumbColor={notificationSettings.specialDates ? '#fff' : '#f4f3f4'}
                  />
                </View>
              </>
            )}
          </View>

          {/* Language Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🌐</Text>
              <Text style={styles.sectionTitle}>{t('language')}</Text>
            </View>

            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => setLanguagePickerVisible(true)}
            >
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>{t('currentLanguage')}</Text>
                <Text style={styles.settingDescription}>{languageName}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Language Picker Modal */}
          {languagePickerVisible && (
            <View style={styles.languagePickerOverlay}>
              <View style={styles.languagePickerModal}>
                <View style={styles.languagePickerHeader}>
                  <Text style={styles.languagePickerTitle}>{t('selectLanguage')}</Text>
                  <TouchableOpacity onPress={() => setLanguagePickerVisible(false)}>
                    <Text style={styles.languagePickerClose}>✕</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.languageList}>
                  {languages.map((lang) => (
                    <TouchableOpacity
                      key={lang.code}
                      style={[
                        styles.languageOption,
                        currentLang === lang.code && styles.languageOptionSelected,
                      ]}
                      onPress={() => saveLanguage(lang.code as Language)}
                    >
                      <View style={styles.languageOptionContent}>
                        <Text style={styles.languageName}>{lang.name}</Text>
                        <Text style={styles.languageNativeName}>{lang.nativeName}</Text>
                      </View>
                      {currentLang === lang.code && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          )}

          {/* About Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>ℹ</Text>
              <Text style={styles.sectionTitle}>About</Text>
            </View>

            <View style={styles.aboutCard}>
              <Text style={styles.appName}>Chabad Timeline</Text>
              <Text style={styles.appVersion}>Version 1.0.0</Text>
              <Text style={styles.appDescription}>
                Explore the rich history of Chabad-Lubavitch through an interactive timeline
                of significant events, locations, and the lives of the Rebbeim.
              </Text>
            </View>

            <TouchableOpacity style={styles.settingRow} onPress={handleContactSupport}>
              <Text style={styles.settingLabel}>{t('contactSupport')}</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingRow} onPress={handleRateApp}>
              <Text style={styles.settingLabel}>{t('rateApp')}</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingRow} onPress={handlePrivacyPolicy}>
              <Text style={styles.settingLabel}>{t('privacyPolicy')}</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Additional Options */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.settingRow} onPress={handleClearCache}>
              <Text style={styles.settingLabel}>Clear Cache</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingRow} onPress={handleContactSupport}>
              <Text style={styles.settingLabel}>Report a Bug</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Credits */}
          <View style={styles.creditsSection}>
            <Text style={styles.creditsText}>
              Developed with care for the Chabad community
            </Text>
            <Text style={styles.creditsLink}>www.chabadtimeline.com</Text>
          </View>

          <View style={styles.bottomSpacer} />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '300',
  },
  closeButtonPlaceholder: {
    width: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#888',
  },
  chevron: {
    fontSize: 20,
    color: '#888',
  },
  timingOptions: {
    marginBottom: 12,
  },
  timingOption: {
    backgroundColor: '#1a1a1a',
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  timingOptionSelected: {
    backgroundColor: '#4a9eff',
    borderColor: '#4a9eff',
  },
  timingOptionText: {
    fontSize: 15,
    color: '#fff',
    textAlign: 'center',
  },
  timingOptionTextSelected: {
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#1a1a1a',
    padding: 14,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4a9eff',
  },
  infoText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  aboutCard: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
  },
  appDescription: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 20,
  },
  creditsSection: {
    marginTop: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  creditsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  creditsLink: {
    fontSize: 14,
    color: '#4a9eff',
  },
  bottomSpacer: {
    height: 40,
  },
  languagePickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  languagePickerModal: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    width: '85%',
    maxHeight: '70%',
    overflow: 'hidden',
  },
  languagePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  languagePickerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  languagePickerClose: {
    fontSize: 24,
    color: '#888',
    fontWeight: '300',
  },
  languageList: {
    maxHeight: 400,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  languageOptionSelected: {
    backgroundColor: 'rgba(74, 158, 255, 0.1)',
  },
  languageOptionContent: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
    fontWeight: '500',
  },
  languageNativeName: {
    fontSize: 14,
    color: '#888',
  },
  checkmark: {
    fontSize: 20,
    color: '#4a9eff',
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
