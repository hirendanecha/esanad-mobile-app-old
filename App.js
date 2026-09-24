import React, { useEffect } from 'react';
import { LogBox, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SocketProvider } from './src/provider/SocketProvider';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@api/queryClient';
import { ThemeProvider } from '@theme/ThemeProvider';
import AppLoader from '@components/ui/AppLoader';
import RootNavigation from '@navigation/RootNavigation';
import { authStore } from '@store/authStore';
import { ToastProvider } from '@components/ui/Toast';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LottieLoaderProvider } from '@provider/LottieLoaderProvider';
import { navigationRef } from '@provider/RootNavigation';

function App() {
  if (__DEV__) {
    require('./ReactotronConfig');
  }

  LogBox.ignoreAllLogs();

  useEffect(() => {
    const initializeApp = async () => {
      await authStore.waitForHydration();
      const token = authStore.token;
      if (token) {
        console.log('User is logged in');
      }
    };

    initializeApp();
  }, []);

  function AppContent() {
    return (
      <ToastProvider>
        <LottieLoaderProvider>
          <RootNavigation />
          <AppLoader />
        </LottieLoaderProvider>
      </ToastProvider>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer ref={navigationRef}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <SocketProvider>
              <StatusBar barStyle={'dark-content'} />
              <ThemeProvider>
                <AppContent />
              </ThemeProvider>
            </SocketProvider>
          </SafeAreaProvider>
        </QueryClientProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
