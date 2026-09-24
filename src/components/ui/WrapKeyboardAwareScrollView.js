import React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

const WrapKeyboardAwareScrollView = ({ children }) => {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {children}
    </KeyboardAvoidingView>
  );
};

export default WrapKeyboardAwareScrollView;
