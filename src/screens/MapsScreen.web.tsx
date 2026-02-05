import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MapsScreenProps {
  onClose: () => void;
  onEventPress?: (event: any) => void;
}

// Stub component for web - Maps only available on native platforms
const MapsScreen: React.FC<MapsScreenProps> = ({ onClose }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Maps are only available on mobile devices</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MapsScreen;
