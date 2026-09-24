import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { moderateScale, verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import { useGetModelList } from '@hooks/motorflow/useMotorFlow';
import { useMotorStore } from '@store/MOTOR/motorStore';
import { CustomDropDownList } from '@components/ui/CustomDropDownList';
import CustomOptionList from '@components/ui/CustomOptionList';

const { width } = Dimensions.get('window');

const SelectModelScreen = () => {
  const { theme } = useThemeContext();
  const styles = style(theme);

  const { year, brand, model, updateModel, updateStep, updateSubStep } =
    useMotorStore();

  const { data: modelList = [], isLoading } = useGetModelList({
    year,
    make: brand,
  });

  const [value, setValue] = useState(model || null);
  const [items, setItems] = useState([]);

  // Format the model list
  useEffect(() => {
    if (modelList?.length) {
      const formatted = modelList.map(item => ({
        label: item,
        value: item,
      }));
      setItems(formatted);
    }
  }, [modelList]);

  const updateModelValue = selected => {
    updateModel(selected);
    updateStep(0);
    updateSubStep(4);
    setValue(selected);
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerWrapper}>
        <Text style={styles.title}>Your Car Details</Text>
        <Text style={styles.subtitle}>
          Please use the wizard below to tell us which car you want to insure
        </Text>

        <CustomDropDownList
          title="Select Model"
          value={value}
          data={items}
          absolute
          handleSelect={updateModelValue}
          isLoading={isLoading}
          theme={theme}
          keyExtractor={item => item.value.toString()}
          showSearch
          searchPlaceholder="Search model..."
        />
        <CustomOptionList
          value={value}
          items={items}
          onPress={value => updateModelValue(value?.value)}
        />
      </View>
    </View>
  );
};

export default SelectModelScreen;

// Theme-aware styles
const style = theme =>
  StyleSheet.create({
    container: {
      width: '90%',
      flex: 1,
      alignSelf: 'center',
      marginTop: verticalScale(20),
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: verticalScale(10),
      backgroundColor: theme.colors.backgroundColor,
      paddingVertical: verticalScale(20),
    },
    innerWrapper: {
      marginHorizontal: '5%',
      gap: verticalScale(20),
    },
    title: {
      fontSize: moderateScale(22),
      fontWeight: '700',
      fontFamily: 'Inter',
      textAlign: 'center',
      color: theme.colors.primary,
    },
    subtitle: {
      fontSize: moderateScale(14),
      fontWeight: '400',
      fontFamily: 'Inter',
      textAlign: 'center',
      color: theme.colors.description,
    },
  });
