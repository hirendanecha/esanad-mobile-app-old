import React from 'react';
import { Animations } from '@assets/index';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { Modal, View, StyleSheet } from 'react-native';
import { verticalScale } from '@constants/metrics';
import LottieView from 'lottie-react-native';
import { useThemeContext } from '@theme/ThemeProvider';

export default function AppLoader() {
  const { theme } = useThemeContext();

  const isFetching = useIsFetching({
    predicate: query => query.meta?.showLoader !== false,
  });
  const isMutating = useIsMutating({
    predicate: mutation => mutation.meta?.showLoader !== false,
  });

  if (!isFetching && !isMutating) return null;

  const loading = isFetching > 0 || isMutating > 0;

  return (
    <>
      {loading && (
        <View
          style={[
            styles.backdrop,
            { backgroundColor: theme.colors.modalOverlay },
          ]}
        >
          <LottieView
            source={Animations.quote}
            style={{
              width: verticalScale(300),
              height: verticalScale(300),
            }}
            autoPlay
            loop
            resizeMode="contain"
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
  },
  loaderContainer: {
    padding: verticalScale(20),
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
