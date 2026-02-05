import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { useTranslation } from '../i18n/LanguageContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface HamburgerMenuProps {
  visible: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
}

export default function HamburgerMenu({ visible, onClose, onNavigate }: HamburgerMenuProps) {
  const { t } = useTranslation();
  const [slideAnim] = useState(new Animated.Value(SCREEN_WIDTH));
  const [rebbeimExpanded, setRebbeimExpanded] = useState(false);

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleNavigate = (screen: string) => {
    onNavigate(screen);
    onClose();
  };

  const rebbeimList = [
    'Alter Rebbe',
    'Mitteler Rebbe',
    'Tzemach Tzedek',
    'Rebbe Maharash',
    'Rebbe Rashab',
    'Frierdiker Rebbe',
    'Lubavitcher Rebbe',
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1.0} 
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.menuContainer,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <View style={styles.menuHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.menuContent} showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate('timeline')}
            >
              <Text style={styles.menuItemText}>{t('timeline')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate('calendar')}
            >
              <Text style={styles.menuItemText}>{t('calendar')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate('upcoming-events')}
            >
              <Text style={styles.menuItemText}>{t('upcomingEvents')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate('maps')}
            >
              <Text style={styles.menuItemText}>{t('maps')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setRebbeimExpanded(!rebbeimExpanded)}
            >
              <Text style={styles.menuItemText}>{t('rebbeim')}</Text>
              <Text style={styles.expandIcon}>{rebbeimExpanded ? '▾' : '▸'}</Text>
            </TouchableOpacity>

            {rebbeimExpanded && (
              <View style={styles.submenu}>
                {rebbeimList.map((rebbe, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.submenuItem}
                    onPress={() => handleNavigate(`Rebbe-${rebbe}`)}
                  >
                    <Text style={styles.submenuItemText}>{rebbe}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate('Donate')}
            >
              <Text style={styles.menuItemText}>{t('donate')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate('Feedback')}
            >
              <Text style={styles.menuItemText}>{t('feedback')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate('Settings')}
            >
              <Text style={styles.menuItemText}>{t('settings')}</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    flex: 1,
  },
  menuContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: SCREEN_WIDTH * 0.75,
    backgroundColor: '#1a1a1a',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  menuHeader: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  closeButtonText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '300',
  },
  menuContent: {
    flex: 1,
    paddingVertical: 20,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuItemText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
  },
  expandIcon: {
    fontSize: 14,
    color: '#999',
  },
  submenu: {
    backgroundColor: '#0f0f0f',
    paddingLeft: 20,
  },
  submenuItem: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  submenuItemText: {
    fontSize: 16,
    color: '#ccc',
  },
});
