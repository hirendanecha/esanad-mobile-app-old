import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { moderateScale, verticalScale } from '@constants/metrics';

import { useGetBrandList } from '@hooks/motorflow/useMotorFlow';
import { useMotorStore } from '@store/MOTOR/motorStore';
import { useThemeContext } from '@theme/ThemeProvider';
import { CustomDropDownList } from '@components/ui/CustomDropDownList';
import CustomOptionList from '@components/ui/CustomOptionList';
import { useGetTopBrandList } from '@hooks/motorflow/useMotorFlowTop';

const SelectBrandScreen = () => {
  const { theme } = useThemeContext();
  const styles = style(theme);
  const { year, brand, updateBrand, updateStep, updateSubStep } =
    useMotorStore();

  const { data: brandList = [], isLoading } = useGetBrandList({ year });
  const { data: topBrandList = [] } = useGetTopBrandList({ year });

  const [value, setValue] = useState(brand || null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (brandList?.length) {
      const formatted = brandList.map(item => ({
        label: item,
        value: item,
      }));
      setItems(formatted);
    }
  }, [brandList]);

  const updateBrandValue = val => {
    if (val) {
      updateBrand(val);
      updateStep(0);
      updateSubStep(3);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerWrapper}>
        <Text style={styles.title}>Your Car Details</Text>

        <CustomDropDownList
          title="Select Brand"
          value={value}
          data={items}
          absolute
          handleSelect={updateBrandValue}
          isLoading={isLoading}
          keyExtractor={item => item.value.toString()}
          showSearch={true}
          searchPlaceholder="Search brand..."
        />

        <CustomOptionList
          items={topBrandList.map(item => ({
            label: item,
            value: item,
          }))}
          length={topBrandList.length}
          value={value}
          onPress={val => updateBrandValue(val?.value)}
        />
      </View>
    </View>
  );
};

export default SelectBrandScreen;

// Screen styles
const style = theme =>
  StyleSheet.create({
    container: {
      width: '90%',
      alignSelf: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: verticalScale(10),
      marginTop: verticalScale(20),
      backgroundColor: theme.colors.backgroundColor,
      flex: 1,
    },
    innerWrapper: {
      margin: '5%',
      gap: verticalScale(20),
    },
    title: {
      color: theme.colors.primary,
      fontWeight: '700',
      fontSize: moderateScale(22),
      fontFamily: 'Inter',
      textAlign: 'center',
    },
  });
