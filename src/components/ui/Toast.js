import { useThemeContext } from '@theme/ThemeProvider';
import React, { createContext, useContext, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

const ToastContext = createContext(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
};

import { setToastRef } from '@utils/toastService';

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const showToast = (message, type = 'info', duration = 3000) => {
    const id = counter.current++;
    setToasts([{ id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  React.useEffect(() => {
    setToastRef(args => {
      const message = typeof args === 'string' ? args : args.message;
      const type = args.type || 'error';
      const duration = args.duration || 3000;
      showToast(message, type, duration);
    });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <View style={styles.container} pointerEvents="box-none">
        {toasts.map(t => (
          <Toast key={t.id} message={t.message} type={t.type} />
        ))}
      </View>
    </ToastContext.Provider>
  );
};

const Toast = ({ message, type }) => {
  const { theme } = useThemeContext();
  const opacity = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const colors = {
    success: theme.colors.lableText,
    error: theme.colors.red,
    info: theme.colors.lableSecondaryText,
    warning: theme.colors.lableThirdText,
    simple: theme.colors.simple,
  };

  return (
    <Animated.View
      style={[styles.toast, { backgroundColor: colors[type], opacity }]}
    >
      <Text
        style={[
          styles.text,
          {
            color: theme.colors.textSecondary,
          },
        ]}
      >
        {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999,
    width: '80%',
    marginHorizontal: '10%',
  },
  toast: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginVertical: 4,
    minWidth: '60%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});
