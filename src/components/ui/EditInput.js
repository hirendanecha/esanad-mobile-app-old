import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { moderateScale, verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import Icon from 'react-native-vector-icons/Feather';

const EditInput = ({
  title,
  value,
  onChangeText,
  placeholder,
  error,
  disabled,
  prefix,
  canEdit = true,
  keyboardType = 'default',
  secureTextEntry = false,
  containerStyle,
  inputStyle,
  titleStyle,
  ...props
}) => {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);
  const inputRef = React.useRef(null);
  const [isEditable, setIsEditable] = React.useState(
    canEdit ? false : !disabled,
  );

  const toggleEdit = () => {
    setIsEditable(prev => {
      const nextValue = !prev;
      if (nextValue) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
      return nextValue;
    });
  };

  return (
    <View style={[styles.mainContainer, containerStyle]}>
      {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View
          style={[
            styles.inputContainer,
            error && styles.errorBorder,
            !isEditable && styles.disabledContainer,
          ]}
        >
          {prefix && (
            <Text style={[styles.prefix, !isEditable && styles.disabledPrefix]}>
              {prefix}
            </Text>
          )}
          <TextInput
            ref={inputRef}
            style={[styles.input, inputStyle]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textTertiary}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            editable={isEditable}
            {...props}
          />
        </View>
        {canEdit && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={toggleEdit}
            style={styles.editButton}
            testID="edit-button"
          >
            <Icon
              name={isEditable ? 'check' : 'edit-3'}
              size={moderateScale(18)}
              color={
                isEditable ? theme.colors.primary : theme.colors.textTertiary
              }
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default EditInput;

const createStyles = theme =>
  StyleSheet.create({
    mainContainer: {
      width: '100%',
      paddingVertical: verticalScale(10),
    },
    title: {
      fontSize: moderateScale(12),
      color: theme.colors.textTertiary,
      fontFamily: 'Lato-Regular',
    },
    inputContainer: {
      flex: 1,
      marginTop: verticalScale(5),
      flexDirection: 'row',
      alignItems: 'center',
    },
    input: {
      flex: 1,
      height: Platform.OS === 'android' ? verticalScale(36) : verticalScale(20),
      fontSize: moderateScale(15),
      color: theme.colors.text,
      fontFamily: 'Lato-Bold',
      padding: 0,
    },
    prefix: {
      fontSize: moderateScale(15),
      color: theme.colors.text,
      fontFamily: 'Lato-Bold',
      marginRight: moderateScale(5),
    },
    disabledPrefix: {
      color: theme.colors.text,
    },
    editButton: {
      paddingHorizontal: moderateScale(5),
    },
    errorBorder: {
      borderBottomColor: theme.colors.red,
    },
    errorText: {
      color: theme.colors.red,
      fontSize: moderateScale(12),
      marginTop: verticalScale(5),
      marginLeft: moderateScale(2),
      fontFamily: 'Lato-Regular',
    },
    disabledContainer: {
      opacity: 1, // Keep text clear even when disabled
    },
  });
