import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('react-native-localize', () => ({
  getLocales: () => [{
    countryCode: 'US',
    languageTag: 'en-US',
    languageCode: 'en',
    isRTL: false,
  }],
  getNumberFormatSettings: () => ({
    decimalSeparator: '.',
    groupingSeparator: ',',
  }),
  getCalendar: () => 'gregorian',
  getCountry: () => 'US',
  getCurrencies: () => ['USD'],
  getTemperatureUnit: () => 'celsius',
  getTimeZone: () => 'America/New_York',
  uses24HourClock: () => true,
  usesMetricSystem: () => true,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View, Text, Image, ScrollView } = require('react-native');
  return {
    createAnimatedComponent: jest.fn((component) => component),
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedStyle: jest.fn(() => ({})),
    useAnimatedProps: jest.fn(() => ({})),
    useDerivedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedScrollHandler: jest.fn(() => ({})),
    useAnimatedGestureHandler: jest.fn(() => ({})),
    withTiming: jest.fn((val) => val),
    withSpring: jest.fn((val) => val),
    withRepeat: jest.fn((val) => val),
    withSequence: jest.fn((val) => val),
    withDelay: jest.fn((_, val) => val),
    runOnUI: jest.fn((fn) => fn),
    useEvent: jest.fn(),
    View,
    Text,
    Image,
    ScrollView,
    Extrapolate: { CLAMP: 'clamp' },
    Extrapolation: { CLAMP: 'clamp' },
    interpolate: jest.fn(),
    interpolateColor: jest.fn(),
    addWhitelistedNativeProps: jest.fn(),
    Animated: { View, Text, Image, ScrollView, addWhitelistedNativeProps: jest.fn(), createAnimatedComponent: jest.fn((component) => component) },
    SlideInRight: { duration: jest.fn() },
    SlideOutLeft: { duration: jest.fn() },
    FadeIn: { duration: jest.fn() },
    FadeOut: { duration: jest.fn() },
    FadeInDown: { duration: jest.fn() },
    Easing: {
      bezier: jest.fn(),
      inOut: jest.fn(fn => fn),
      ease: jest.fn(),
      in: jest.fn(fn => fn),
      out: jest.fn(fn => fn),
      linear: jest.fn(),
    },
  };
});

jest.mock('react-native-geolocation-service', () => ({
  addListener: jest.fn(),
  getCurrentPosition: jest.fn(),
  removeListeners: jest.fn(),
  requestAuthorization: jest.fn(),
  setRNConfiguration: jest.fn(),
  startObserving: jest.fn(),
  stopObserving: jest.fn(),
}));

jest.mock('react-native-worklets', () => ({
  createSerializable: jest.fn(),
  makeShareableClone: jest.fn(),
  makeMutable: jest.fn(),
  Worklets: {
    createRunInContextFn: jest.fn(),
    createContext: jest.fn()
  }
}));
jest.mock('react-native-blob-util', () => ({
  DocumentDir: () => {},
  fetch: jest.fn(),
  base64: { encode: jest.fn(), decode: jest.fn() },
  fs: {
    dirs: { DocumentDir: '' },
    exists: jest.fn(),
    mkdir: jest.fn(),
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}));

jest.mock('react-native-pdf', () => 'Pdf');

jest.mock('@react-native-documents/picker', () => ({
  pick: jest.fn(),
  types: {}
}));

jest.mock('react-native-webview', () => {
  const { View } = require('react-native');
  return { WebView: View };
});

jest.mock('react-native-share', () => ({
  default: jest.fn(),
  Share: jest.fn(),
}));

jest.mock('@react-native-clipboard/clipboard', () => ({
  default: {
    getString: jest.fn(),
    setString: jest.fn()
  }
}));

jest.mock('react-native-fs', () => ({
  DocumentDirectoryPath: '',
  CachesDirectoryPath: '',
  downloadFile: jest.fn(),
  readFile: jest.fn(),
  writeFile: jest.fn(),
  stat: jest.fn(),
  unlink: jest.fn()
}));

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => <>{children}</>,
    SafeAreaConsumer: ({ children }) => children(inset),
    useSafeAreaInsets: () => inset,
    SafeAreaView: ({ children, style }) => <View style={style}>{children}</View>,
  };
});

jest.mock('react-native-permissions', () => {
  const RESULTS = {
    UNAVAILABLE: 'unavailable',
    DENIED: 'denied',
    BLOCKED: 'blocked',
    GRANTED: 'granted',
    LIMITED: 'limited',
  };
  return {
    check: jest.fn(() => Promise.resolve(RESULTS.GRANTED)),
    request: jest.fn(() => Promise.resolve(RESULTS.GRANTED)),
    PERMISSIONS: {
      IOS: { PHOTO_LIBRARY: 'ios.permission.PHOTO_LIBRARY', CAMERA: 'ios.permission.CAMERA' },
      ANDROID: { READ_EXTERNAL_STORAGE: 'android.permission.READ_EXTERNAL_STORAGE' },
    },
    RESULTS,
  };
});

jest.mock('react-native-fast-image', () => {
  const React = require('react');
  const { View } = require('react-native');
  const FastImage = ({ children, ...props }) => <View {...props}>{children}</View>;
  FastImage.resizeMode = {
    contain: 'contain',
    cover: 'cover',
    stretch: 'stretch',
    center: 'center',
  };
  FastImage.priority = {
    low: 'low',
    normal: 'normal',
    high: 'high',
  };
  return FastImage;
});

jest.mock('reactotron-react-native', () => ({
  configure: jest.fn().mockReturnThis(),
  useReactNative: jest.fn().mockReturnThis(),
  connect: jest.fn().mockReturnThis(),
  clear: jest.fn(),
  createEnhancer: jest.fn(),
}));

jest.mock('react-native-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');
  return ({ children, ...props }) => <View {...props}>{children}</View>;
});

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('react-native-vector-icons/Feather', () => 'Icon');
jest.mock('react-native-vector-icons/FontAwesome6', () => 'Icon');
jest.mock('react-native-vector-icons/Entypo', () => 'Icon');
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

jest.mock('@theme/ThemeProvider', () => {
  const React = require('react');
  const theme = {
    colors: {
      primary: '#007AFF',
      secondary: '#C7C7CC',
      red: '#FF3B30',
      border: '#C7C7CC',
      backgroundColor: '#FFFFFF',
      text: '#000000',
      description: '#8E8E93',
      textTertiary: '#AEAEB2',
      bgSecondary: '#F2F2F7',
      placeholder: '#C7C7CC',
      lableText: '#34C759',
      lableSecondaryText: '#5856D6',
      lableThirdText: '#FF9500',
      simple: '#8E8E93',
      modalOverlay: 'rgba(0,0,0,0.5)',
      highlight: '#FFCC00',
      floorBgColor: '#E5E5EA',
      lableFourthText: '#8E8E93',
      orange: '#FF9500',
      white: '#FFFFFF',
      bgLinear1: '#FFFFFF',
      bgLinear2: '#F2F2F7',
    },
    stepIndicator: {
      active: '#007AFF',
      inactive: '#C7C7CC',
      completed: '#34C759',
      labelText: '#000000',
    }
  };
  return {
    ThemeProvider: ({ children }) => <>{children}</>,
    useThemeContext: () => ({
      theme,
      isDarkMode: false,
      toggleTheme: jest.fn(),
    }),
  };
});

jest.mock('@react-navigation/stack', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    createStackNavigator: jest.fn(() => ({
      Navigator: ({ children }) => <View>{children}</View>,
      Screen: ({ children }) => <View>{children}</View>,
    })),
    TransitionPresets: {
      SlideFromRightIOS: {},
    },
  };
});
