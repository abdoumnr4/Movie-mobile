import { Tabs } from 'expo-router'; //permet to do the routing in the app 
import { Chrome as Home, Film } from 'lucide-react-native'; //import the icons from lucide-react-native
import React from 'react';
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#141414',
          borderTopColor: '#333',
        },
        tabBarActiveTintColor: '#E50914',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tabs.Screen //tab.screen is used to create a tab in the bottom tab navigator
        name="index" //this is the name of the screen that will be displayed when the tab is pressed.
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="[id]" //this is the name of the screen that will be displayed when the tab is pressed, is already defined in the app directory.
        options={{
          title: 'Movie Details',
          tabBarIcon: ({ size, color }) => <Film size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}