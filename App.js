import React from 'react';
import TimelineScreen from './src/screens/TimelineScreen';
import { LanguageProvider } from './src/i18n/LanguageContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <TimelineScreen />
      </LanguageProvider>
    </SafeAreaProvider>
  );
}