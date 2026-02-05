import React from 'react';
import TimelineScreen from './src/screens/TimelineScreen';
import { LanguageProvider } from './src/i18n/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <TimelineScreen />
    </LanguageProvider>
  );
}