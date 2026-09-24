import { SCREEN_NAMES } from '@constants/screenNames';
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function LogoutReset() {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: SCREEN_NAMES.LOGIN_SCREEN }],
    });
  }
}

// add other navigation functions that you need and export them
