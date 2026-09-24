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
const ITEM_MARGIN = 10;
const ITEM_WIDTH_3 = (width - 93) / 3;
const ITEM_WIDTH_4 = (width - 104) / 4;

const CustomOptionList = ({ items = [], onPress, length, value, column, notAlign }) => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress?.(item)}
      style={[
        styles.optionContainer,
        { width: column == 4 ? ITEM_WIDTH_4 : ITEM_WIDTH_3 },
        value === item.value && { borderColor: theme.colors.primary },
      ]}
    >
      <Text
        style={[
          styles.optionText,
          value === item.value && { color: theme.colors.primary },
        ]}
        numberOfLines={1}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={items.slice(0, length ? length : column == 4 ? 12 : 9)}
      renderItem={renderItem}
      keyExtractor={item => item.value?.toString()}
      numColumns={column == 4 ? 4 : 3}
      bounces={false}
      nestedScrollEnabled
      contentContainerStyle={[styles.listContent, notAlign && { alignItems: 'flex-start' }]}
      columnWrapperStyle={styles.columnWrapper}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default CustomOptionList;

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
      height: verticalScale(27),
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: verticalScale(5),
      paddingHorizontal: verticalScale(10),
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    optionText: {
      fontSize: moderateScale(12),
      fontFamily: 'Lato-Regular',
      color: theme.colors.description,
    },
  });
