import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  TouchableWithoutFeedback,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const CustomDropDownList = React.forwardRef(
  (
    {
      title,
      data = [],
      defaultOpen = false,
      iconSize = 20,
      iconColor,
      titleStyle,
      contentStyle,
      showSearch = true,
      searchPlaceholder = 'Search...',
      renderItem,
      keyExtractor = (item, index) =>
        (item.id ?? item.value ?? index).toString(),
      onItemPress,
      errors,
      value,
      absolute,
      handleSelect,
      style,
    },
    ref,
  ) => {
    const { theme } = useThemeContext();
    const styles = getStyles(theme);

    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [searchText, setSearchText] = useState('');
    const [selectedValue, setSelectedValue] = useState(value ?? title);

    const rotateAnim = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current;
    const contentAnim = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current;

    // Sync selectedValue with prop
    useEffect(() => {
      setSelectedValue(value ?? title);
    }, [value, title]);

    const toggleOpen = useCallback(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsOpen(prev => !prev);
    }, []);

    useEffect(() => {
      Animated.timing(rotateAnim, {
        toValue: isOpen ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();

      Animated.timing(contentAnim, {
        toValue: isOpen ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    useImperativeHandle(ref, () => ({
      open: () => !isOpen && toggleOpen(),
      close: () => isOpen && toggleOpen(),
      getValue: () => selectedValue,
    }));

    const rotate = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });

    const animatedHeight = contentAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 280],
    });

    const filteredData = (Array.isArray(data) ? data : []).filter(item => {
      const label = (item?.label ?? item)?.toString().toLowerCase() ?? '';
      return label.includes(searchText.toLowerCase());
    });

    const onSelect = item => {
      const val = item.value ?? item;
      setSelectedValue(val.toString());
      handleSelect?.(val);
      onItemPress?.(val);
      toggleOpen();
    };

    const renderDropdownItem = ({ item }) => {
      const val = item.value ?? item;
      const isSelected = val.toString() === selectedValue;

      return (
        <TouchableOpacity
          style={[
            styles.itemContainer,
            isSelected && { backgroundColor: theme.colors.floorBgColor },
          ]}
          onPress={() => onSelect(item)}
        >
          <Text
            style={[
              styles.itemText,
              {
                color: isSelected
                  ? theme.colors.primary
                  : theme.colors.description,
              },
            ]}
          >
            {item.label ?? item}
          </Text>
          {isSelected && (
            <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
          )}
        </TouchableOpacity>
      );
    };

    return (
      <View style={[styles.container, style]}>
        <TouchableWithoutFeedback onPress={toggleOpen}>
          <View
            style={[
              styles.dropdown,
              { borderColor: errors ? theme.colors.red : theme.colors.border },
            ]}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.selectedText,
                titleStyle,
                {
                  color:
                    selectedValue == title
                      ? theme.colors.description
                      : theme.colors.text,
                },
              ]}
            >
              {selectedValue || title}
            </Text>
            <Animated.View style={{ transform: [{ rotate }] }}>
              <Ionicons
                name="chevron-down"
                size={iconSize}
                color={iconColor || theme.colors.description}
              />
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>

        {errors && !isOpen && (
          <View style={styles.errorContainer}>
            <Feather name="info" size={15} color={theme.colors.red} />
            <Text style={[styles.errorText, { color: theme.colors.red }]}>
              {errors}
            </Text>
          </View>
        )}

        <Animated.View
          style={[
            styles.dropdownContent,
            {
              maxHeight: animatedHeight,
              opacity: contentAnim,
              backgroundColor: theme.colors.backgroundColor,
            },
            absolute && styles.absoluteDropdown,
            contentStyle,
          ]}
        >
          {showSearch && (
            <TextInput
              style={styles.searchInput}
              placeholder={searchPlaceholder}
              placeholderTextColor={theme.colors.description}
              value={searchText}
              onChangeText={setSearchText}
            />
          )}

          <FlatList
            data={filteredData}
            keyExtractor={keyExtractor}
            renderItem={renderItem ?? renderDropdownItem}
            keyboardShouldPersistTaps="always"
            nestedScrollEnabled
            style={{ maxHeight: 250 }}
            ListEmptyComponent={
              <Text numberOfLines={1} style={styles.emptyText}>
                No items found
              </Text>
            }
          />
        </Animated.View>
      </View>
    );
  },
);

const getStyles = theme =>
  StyleSheet.create({
    container: {},
    dropdown: {
      height: verticalScale(50),
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
      backgroundColor: theme.colors.backgroundColor,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    selectedText: {
      fontSize: verticalScale(15),
      color: theme.colors.text,
      width: '90%',
    },
    dropdownContent: {
      overflow: 'hidden',
      borderWidth: 1,
      borderRadius: 5,
      borderColor: theme.colors.border,
    },
    absoluteDropdown: {
      position: 'absolute',
      zIndex: 1,
      marginTop: verticalScale(50),
      width: '100%',
    },
    searchInput: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 6,
      padding: 8,
      margin: verticalScale(8),
      color: theme.colors.description,
      backgroundColor: theme.colors.backgroundColor,
    },
    itemContainer: {
      height: verticalScale(45),
      paddingHorizontal: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderColor: theme.colors.border,
    },
    itemText: {
      fontSize: verticalScale(14),
    },
    emptyText: {
      textAlign: 'center',
      paddingVertical: 10,
      color: theme.colors.description,
    },
    errorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 5,
    },
    errorText: {
      marginLeft: 5,
      fontSize: 13,
    },
  });
