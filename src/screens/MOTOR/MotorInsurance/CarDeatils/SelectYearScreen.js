import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useYearList } from '@hooks/motorflow/useMotorFlow';
import { useMotorStore } from '@store/MOTOR/motorStore';
import { useThemeContext } from '@theme/ThemeProvider';
import { moderateScale, verticalScale } from '@constants/metrics';

import { CustomDropDownList } from '@components/ui/CustomDropDownList';
import CustomOptionList from '@components/ui/CustomOptionList';

const SelectYearScreen = () => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);

  const { year, updateYear, updateStep, updateSubStep } = useMotorStore();
  const { data: yearList = [], isLoading } = useYearList();

  const [value, setValue] = useState(year);
  const [items, setItems] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (yearList.length) {
      setItems(yearList.map(y => ({ label: y, value: y })));
    }
  }, [yearList]);

  const handleYearSelect = val => {
    if (val) {
      setValue(val);
      updateYear(val);
      updateStep(0);
      updateSubStep(2);
    }
  };

  return (
    <View style={styles.container}>
      <CustomDropDownList
        title="Select Year"
        value={value}
        absolute
        data={items}
        handleSelect={handleYearSelect}
        isLoading={isLoading}
        theme={theme}
        keyExtractor={item => item.value.toString()}
        showSearch={true}
        searchPlaceholder="Search year..."
      />
      <CustomOptionList
        items={items}
        value={value}
        onPress={value => handleYearSelect(value?.value)}
      />
    </View>
  );
};

export default SelectYearScreen;

const getStyles = theme =>
  StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: verticalScale(10),
      backgroundColor: theme.colors.backgroundColor,
      gap: verticalScale(10),
    },
    innerContainer: {
      margin: verticalScale(20),
      gap: verticalScale(20),
    },
    headerText: {
      color: theme.colors.primary,
      fontWeight: '400',
      fontSize: moderateScale(14),
      fontFamily: 'Inter',
      textAlign: 'center',
    },
    detailsContainer: {
      gap: verticalScale(14),
      alignItems: 'center',
      textAlign: 'center',
    },
    titleText: {
      color: theme.colors.primary,
      fontWeight: '500',
      fontSize: moderateScale(25),
      fontFamily: 'Inter',
    },
    subtitleText: {
      color: theme.colors.description,
      fontWeight: '500',
      fontSize: moderateScale(15),
      fontFamily: 'Inter',
      textAlign: 'center',
    },
    highlightText: {
      backgroundColor: theme.colors.highlight,
      color: theme.colors.primary,
      fontWeight: 'bold',
    },
  });
