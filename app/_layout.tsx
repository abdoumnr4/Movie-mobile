import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import React from 'react';

export default function RootLayout() { // This is the root layout of the app.
  // This hook is used to check if the framework is ready before displaying the app;
  useFrameworkReady();

  return (
    <>
      {/* The Stack component is used for navigation and screen management. */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
