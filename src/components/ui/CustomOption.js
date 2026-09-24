import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useThemeContext } from '@theme/ThemeProvider';
import { moderateScale, verticalScale } from '@constants/metrics';

const { width } = Dimensions.get('window');
const ITEM_MARGIN = verticalScale(10);

const CustomOption = ({ items = [], onPress, value, numberOfColumns }) => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  const ITEM_WIDTH = (width * 0.9 - 60) / numberOfColumns;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress?.(item)}
      style={[
        styles.optionContainer,
        { width: ITEM_WIDTH },
        value === item.value && { backgroundColor: theme.colors.primary },
      ]}
    >
      <Text
        style={[
          styles.optionText,
          value === item.value && { color: theme.colors.textSecondary },
        ]}
        numberOfLines={1}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={item => item.value?.toString()}
      numColumns={numberOfColumns ? numberOfColumns : 2}
      bounces={false}
      scrollEnabled={false}
      contentContainerStyle={styles.listContent}
      columnWrapperStyle={styles.columnWrapper}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default CustomOption;

const getStyles = theme =>
  StyleSheet.create({
    listContent: {
      flexGrow: 1,
      gap: ITEM_MARGIN,
      alignItems: 'center',
    },
    columnWrapper: {
      gap: ITEM_MARGIN,
    },
    optionContainer: {
      paddingVertical: verticalScale(15),
      paddingHorizontal: verticalScale(4),
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: verticalScale(10),
      borderWidth: 1,
      borderColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    optionText: {
      color: theme.colors.primary,
      fontSize: moderateScale(14),
      fontWeight: 'bold',
      fontFamily: 'Inter',
      textAlign: 'center',
    },
  });
