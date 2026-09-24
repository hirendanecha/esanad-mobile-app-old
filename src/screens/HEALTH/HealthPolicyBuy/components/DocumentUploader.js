import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  pick,
  types,
  isErrorWithCode,
  errorCodes,
} from '@react-native-documents/picker';
import { useThemeContext } from '@theme/ThemeProvider';
import { moderateScale, verticalScale } from '@constants/metrics';

import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';

const DocumentUploader = ({
  label,
  isRequired = false,
  isUploaded = false,
  isLoading = false,
  onUpload,
}) => {
  const { theme } = useThemeContext();
  const styles = documentUploaderStyle(theme);

  // Unified error handler for document picker
  const handlePickerError = err => {
    if (isErrorWithCode(err)) {
      switch (err.code) {
        case errorCodes.OPERATION_CANCELED:
          console.log('User canceled document picker');
          break;
        case errorCodes.UNABLE_TO_OPEN_FILE_TYPE:
          Alert.alert(
            'Unsupported File',
            'This file type cannot be opened on this platform.',
          );
          break;
        case errorCodes.IN_PROGRESS:
          Alert.alert('Picker Active', 'A file picker is already open.');
          break;
        default:
          console.error('Document picker error:', err);
          Alert.alert(
            'Error',
            'Something went wrong while picking the document.',
          );
      }
    } else {
      console.error('Unknown error:', err);
      Alert.alert('Error', 'Unexpected issue occurred.');
    }
  };

  const checkPermissions = async () => {
    let permission;
    if (Platform.OS === 'ios') {
      permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
    } else {
      permission = Platform.Version >= 33 ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
    }

    if (!permission) return true;

    try {
      let status = await check(permission);
      if (status === RESULTS.DENIED) {
        status = await request(permission);
      }

      if (status === RESULTS.BLOCKED || status === RESULTS.DENIED) {
        Alert.alert(
          'Permission Required',
          'Storage permission is needed to upload documents. Please enable it in Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => openSettings() }
          ]
        );
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Permission check failed', err);
      return true;
    }
  };

  const handlePickDocument = async () => {
    const hasPermission = await checkPermissions();
    if (!hasPermission) return;

    try {
      if (Platform.OS === 'ios' && !Platform.isPad && !__DEV__) {
        console.log('Running on iOS device');
      } else if (Platform.OS === 'ios') {
        console.log('Running on iOS simulator');
      }

      const result = await pick({
        type: [types.allFiles, types.images, types.pdf],
        allowMultiSelection: true,
      });

      if (result && result.length > 0) {
        console.log('Picked result:', result[0]);
        const file = {
          uri: result[0].fileCopyUri || result[0].uri,
          type: result[0].type,
          name: result[0].name,
          size: result[0].size,
        };

        if (!file.uri) {
          Alert.alert(
            'No File Found',
            'No file could be accessed. If you are testing on iOS Simulator, please test on a real device or add files manually.',
          );
          return;
        }

        onUpload(file);
      } else {
        Alert.alert('No Selection', 'No file was selected.');
      }
    } catch (err) {
      handlePickerError(err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Label Section */}
      <TouchableOpacity
        onPress={handlePickDocument}
        disabled={isLoading}
        activeOpacity={0.8}
        style={styles.labelContainer}
      >
        <Text style={styles.label}>
          {label}
          {isRequired && <Text style={styles.required}> *</Text>}
        </Text>
        <Feather
          name={isUploaded ? 'check-circle' : 'circle'}
          size={20}
          color={isUploaded ? theme.colors.lableText : theme.colors.secondary}
        />
      </TouchableOpacity>
    </View>
  );
};

const documentUploaderStyle = theme =>
  StyleSheet.create({
    container: {},
    labelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: moderateScale(8),
    },
    label: {
      fontSize: moderateScale(14),
      fontWeight: '500',
      color: theme.colors.text,
    },
    required: {
      color: theme.colors.red,
      fontSize: moderateScale(14),
    },
    uploadButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: moderateScale(8),
      paddingVertical: verticalScale(12),
      paddingHorizontal: moderateScale(16),
      borderRadius: moderateScale(8),
      borderWidth: 1,
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.backgroundColor,
    },
    uploadedButton: {
      borderColor: theme.colors.success,
      backgroundColor: `${theme.colors.success}10`,
    },
    loadingButton: {
      opacity: 0.6,
    },
    uploadButtonText: {
      fontSize: moderateScale(14),
      fontWeight: '500',
      color: theme.colors.primary,
    },
    uploadedButtonText: {
      color: theme.colors.success,
    },
  });

export default DocumentUploader;
