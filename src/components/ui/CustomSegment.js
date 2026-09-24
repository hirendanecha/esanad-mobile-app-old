// import { useThemeContext } from '@theme/ThemeProvider';
// import React, { useRef, useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';

// const CustomSegment = ({
//   options,
//   selectedIndex,
//   onChange,
//   height = 48,
//   activeColor,
//   inactiveColor,
//   disabledColor,
//   underlineColor,
//   backgroundColor,
//   textStyle,
//   style,
// }) => {
//   const { theme } = useThemeContext();

//   // Use theme as default colors
//   const ACTIVE = activeColor || theme.colors.primary;
//   const INACTIVE = inactiveColor || theme.colors.description;
//   const DISABLED = disabledColor || theme.colors.border;
//   const UNDERLINE = underlineColor || theme.colors.primary;
//   const BACKGROUND = backgroundColor || theme.colors.backgroundColor;

//   const styles = styless(theme);
//   const translateX = useRef(new Animated.Value(0)).current;
//   const [segWidth, setSegWidth] = useState(0);

//   useEffect(() => {
//     if (segWidth > 0) {
//       Animated.spring(translateX, {
//         toValue: selectedIndex * segWidth,
//         useNativeDriver: true,
//       }).start();
//     }
//   }, [selectedIndex, segWidth, translateX]);

//   const onLayout = e => {
//     const total = e.nativeEvent.layout.width;
//     if (!total || options.length === 0) return;
//     const nextSeg = total / options.length;
//     setSegWidth(nextSeg);
//     translateX.setValue(selectedIndex * nextSeg);
//   };

//   return (
//     <View
//       onLayout={onLayout}
//       style={[styles.container, { height, backgroundColor: BACKGROUND }, style]}
//     >
//       <Animated.View
//         style={[
//           styles.underline,
//           {
//             width: segWidth || 1,
//             backgroundColor: UNDERLINE,
//             transform: [{ translateX }],
//           },
//         ]}
//       />

//       {options.map((opt, index) => {
//         const optionObj = typeof opt === 'string' ? { label: opt } : opt;
//         const isActive = index === selectedIndex;
//         const isDisabled = optionObj.disabled;

//         return (
//           <Pressable
//             key={`${optionObj.label}-${index}`}
//             style={styles.option}
//             android_ripple={
//               !isDisabled
//                 ? { color: theme.colors.text + '10', borderless: false }
//                 : undefined
//             }
//             disabled={isDisabled}
//             onPress={() => !isDisabled && onChange(index)}
//             accessibilityRole="button"
//             accessibilityState={{ selected: isActive, disabled: isDisabled }}
//             accessibilityLabel={`Segment ${index + 1}: ${optionObj.label}`}
//           >
//             <View style={styles.optionContent}>
//               {optionObj.icon && (
//                 <Icon
//                   name={optionObj.icon}
//                   size={18}
//                   color={isDisabled ? DISABLED : isActive ? ACTIVE : INACTIVE}
//                   style={{ marginRight: 6 }}
//                 />
//               )}
//               <Text
//                 style={[
//                   styles.text,
//                   {
//                     color: isDisabled ? DISABLED : isActive ? ACTIVE : INACTIVE,
//                   },
//                   textStyle,
//                 ]}
//               >
//                 {optionObj.label}
//               </Text>
//             </View>
//           </Pressable>
//         );
//       })}
//     </View>
//   );
// };

// const styless = theme =>
//   StyleSheet.create({
//     container: {
//       position: 'relative',
//       flexDirection: 'row',
//       borderBottomWidth: StyleSheet.hairlineWidth,
//       borderBottomColor: theme.colors.border,
//       overflow: 'hidden',
//     },
//     underline: {
//       position: 'absolute',
//       bottom: 0,
//       height: 3,
//     },
//     option: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//       paddingHorizontal: 8,
//     },
//     optionContent: {
//       flexDirection: 'row',
//       alignItems: 'center',
//     },
//     text: {
//       fontSize: 14,
//       fontWeight: '600',
//     },
//   });

// export default CustomSegment;

import { verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CustomSegment = ({
  options,
  selectedIndex,
  onChange,
  activeColor,
  inactiveColor,
  disabledColor,
  underlineColor,
  backgroundColor,
  textStyle,
  style,
}) => {
  const { theme } = useThemeContext();

  // Use theme as default colors
  const ACTIVE = activeColor || theme.colors.backgroundColor;
  const INACTIVE = inactiveColor || theme.colors.primary;
  const DISABLED = disabledColor || theme.colors.border;
  const UNDERLINE = underlineColor || theme.colors.primary;
  const BACKGROUND = backgroundColor || theme.colors.backgroundColor;

  const styles = styless(theme);
  const translateX = useRef(new Animated.Value(0)).current;
  const [segWidth, setSegWidth] = useState(0);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    if (segWidth > 0 && isLayoutReady) {
      Animated.spring(translateX, {
        toValue: selectedIndex * segWidth,
        useNativeDriver: true,
        tension: 68,
        friction: 12,
      }).start();
    }
  }, [selectedIndex, segWidth, translateX, isLayoutReady]);

  const onLayout = e => {
    const total = e.nativeEvent.layout.width;
    if (!total || options.length === 0) return;
    const nextSeg = total / options.length;
    setSegWidth(nextSeg);

    if (!isLayoutReady) {
      translateX.setValue(selectedIndex * nextSeg);
      setIsLayoutReady(true);
    }
  };

  return (
    <View
      onLayout={onLayout}
      style={[styles.container, { backgroundColor: BACKGROUND }, style]}
    >
      {segWidth > 0 && (
        <Animated.View
          style={[
            styles.underline,
            {
              width: segWidth,
              backgroundColor: UNDERLINE,
              transform: [{ translateX }],
            },
          ]}
        />
      )}

      {options.map((opt, index) => {
        const optionObj = typeof opt === 'string' ? { label: opt } : opt;
        const isActive = index === selectedIndex;
        const isDisabled = optionObj.disabled;

        return (
          <Pressable
            key={`${optionObj.label}-${index}`}
            style={[styles.option, optionObj?.flex]}
            android_ripple={
              !isDisabled
                ? { color: theme.colors.text + '10', borderless: false }
                : undefined
            }
            disabled={isDisabled}
            onPress={() => !isDisabled && onChange(index)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive, disabled: isDisabled }}
            accessibilityLabel={`Segment ${index + 1}: ${optionObj.label}`}
          >
            <View style={styles.optionContent}>
              {optionObj.icon && (
                <Icon
                  name={optionObj.icon}
                  size={18}
                  color={isDisabled ? DISABLED : isActive ? ACTIVE : INACTIVE}
                  style={{ marginRight: 6 }}
                />
              )}
              <Text
                style={[
                  styles.text,
                  {
                    color: isDisabled ? DISABLED : isActive ? ACTIVE : INACTIVE,
                  },
                  textStyle,
                ]}
              >
                {optionObj.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

const styless = theme =>
  StyleSheet.create({
    container: {
      position: 'relative',
      flexDirection: 'row',
      overflow: 'hidden',
      borderWidth: 1,
      borderRadius: verticalScale(5),
      alignSelf: 'center',
      borderColor: theme.colors.primary,
      height: verticalScale(40),
    },
    underline: {
      position: 'absolute',
      bottom: 0,
      height: '100%',
    },
    option: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    optionContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    text: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
    },
  });

export default CustomSegment;
