import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TimelineScreen from '../screens/TimelineScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Timeline" component={TimelineScreen} />
        {/* Placeholder screens - to be created later */}
        {/* <Stack.Screen name="Calendar" component={CalendarScreen} /> */}
        {/* <Stack.Screen name="Maps" component={MapsScreen} /> */}
        {/* <Stack.Screen name="Donate" component={DonateScreen} /> */}
        {/* <Stack.Screen name="Feedback" component={FeedbackScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
