import { verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import React, { useState } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from 'react-native-ui-datepicker';

const DatePickerModal = ({
  visible,
  onClose,
  onConfirm,
  initialDate,
  minDate,
  maxDate,
}) => {
  const { theme } = useThemeContext();
  const styles = style(theme);
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date());
  const insets = useSafeAreaInsets();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
    >
      <Pressable onPress={onClose} style={styles.overlay} />
      <View style={[styles.modalContent, { paddingBottom: insets.bottom }]}>
        <DateTimePicker
          mode="single"
          date={selectedDate}
          onChange={({ date }) => setSelectedDate(date)}
          styles={{
            today: {
              borderColor: theme.colors.primary,
              borderWidth: 2,
              borderRadius: 10000000,
            },
            selected: {
              backgroundColor: theme.colors.primary,
              fontWeight: 'bold',
              borderRadius: 10000000,
            },
            day_cell: {
              margin: verticalScale(2),
            },
            day_label: {
              color: theme.colors.text,
            },
            weekday_label: {
              color: theme.colors.text,
            },
            year_label: {
              color: theme.colors.text,
            },
            month_label: {
              color: theme.colors.text,
            },
            month_selector_label: {
              color: theme.colors.text,
            },
            year_selector_label: {
              color: theme.colors.text,
            },
            selected_label: { color: theme.colors.textSecondary },
            disabled_label: { color: theme.colors.border },
          }}
          minDate={minDate}
          maxDate={maxDate}
        />

        <View style={styles.actions}>
          <TouchableOpacity onPress={onClose} style={styles.btnCancel}>
            <Text style={styles.textCancel}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onConfirm(selectedDate);
            }}
            style={styles.btnConfirm}
          >
            <Text style={styles.textConfirm}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DatePickerModal;

const style = theme =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: theme.colors.modalOverlay,
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.colors.backgroundColor,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      padding: 20,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 15,
      gap: 15,
    },
    btnCancel: {
      padding: 10,
      backgroundColor: theme.colors.border,
      borderRadius: 8,
    },
    btnConfirm: {
      padding: 10,
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
    },
    textCancel: {
      color: theme.colors.text,
      fontWeight: '600',
    },
    textConfirm: {
      color: theme.colors.textSecondary,
      fontWeight: '600',
    },
  });
