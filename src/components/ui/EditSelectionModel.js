import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { moderateScale, verticalScale } from '@constants/metrics';
import { useMotorStore } from '@store/MOTOR/motorStore';
import CarIcon from '@assets/icons/Motor/Car';
import { useThemeContext } from '@theme/ThemeProvider';

const { width, height } = Dimensions.get('window');

const EditSelectionModal = ({ visible, onClose }) => {
  const {
    year,
    brand,
    model,
    updateStep,
    updateSubStep,
    updateYear,
    updateBrand,
    updateModel,
    updateTrim,
  } = useMotorStore();

  const { theme } = useThemeContext();
  const styles = style(theme);

  const Item = ({ label, value, subStep, withIcon = false, bg, onPress }) => {
    if (!value) return null;

    return (
      <TouchableOpacity
        onPress={() => {
          updateStep(0);
          updateSubStep(subStep);
          onPress && onPress();
          setTimeout(() => onClose(), 100);
        }}
      >
        <View style={[styles.itemContainer, bg ? { backgroundColor: bg } : {}]}>
          <View style={styles.row}>
            {withIcon && (
              <View style={styles.iconRow}>
                <CarIcon fill={theme.colors.description} />
              </View>
            )}
            <Text style={[styles.itemText, { color: theme.colors.text }]}>
              {label} - {value}
            </Text>
            <Icon name="edit-3" size={16} color={theme.colors.primary} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable onPress={onClose} style={styles.backdrop}>
        <View style={styles.modalContent}>
          {/* Header */}
          <Text style={styles.headerText}>Edit Your Selection</Text>

          {/* Options */}
          <Item
            label="Year"
            value={year || 2024}
            subStep={1}
            withIcon
            bg={theme.colors.floorBgColor}
            onPress={() => {
              updateYear(null);
              updateBrand(null);
              updateModel(null);
              updateTrim(null);
            }}
          />
          <Item
            label="Brand"
            value={brand}
            subStep={2}
            withIcon
            onPress={() => {
              updateBrand(null);
              updateModel(null);
              updateTrim(null);
            }}
          />
          <Item
            label="Model"
            value={model}
            subStep={3}
            withIcon
            bg={theme.colors.floorBgColor}
            onPress={() => {
              updateModel(null);
              updateTrim(null);
            }}
          />
        </View>
      </Pressable>
    </Modal>
  );
};

export default EditSelectionModal;

const style = theme =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.colors.backgroundColor,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: verticalScale(30),
      maxHeight: height * 0.6,
    },
    headerText: {
      fontSize: moderateScale(18),
      fontWeight: '500',
      fontFamily: 'Inter',
      color: theme.colors.primary,
      margin: verticalScale(20),
    },
    itemContainer: {
      borderTopWidth: 1,
      borderColor: theme.colors.border,
      paddingVertical: verticalScale(20),
      width: width,
      paddingHorizontal: '8%',
    },
    itemText: {
      fontWeight: '400',
      fontSize: moderateScale(12),
      fontFamily: 'Inter',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    iconRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: verticalScale(10),
    },
  });
