import { verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import React, { memo, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, I18nManager } from 'react-native';

// Constants
const DEFAULT_DOT_SIZE = 26;
const DEFAULT_STROKE_WIDTH = 5;
const DEFAULT_SPACING = 24;
const DEFAULT_THICKNESS = 2;
const DOT_INNER_SIZE = 10;
const DOT_OUTER_SIZE = 25;
const BORDER_WIDTH = 3.5;
const DOT_CONTAINER_WIDTH = 30;
const LABEL_MAX_WIDTH = 60;
const CONNECTOR_HEIGHT = 8;
const CONNECTOR_BORDER_WIDTH = 2;

// Helper function to get step colors
const getStepColors = (isActive, isCompleted, theme) => {
  if (isActive) return theme.active;
  if (isCompleted) return theme.active;
  return theme.inactive;
};

// Helper function to get accessibility label
const getAccessibilityLabel = (index, isActive, isCompleted, label) => {
  const base = label ?? `Step ${index + 1}`;
  if (isActive) return `${base}, current step`;
  if (isCompleted) return `${base}, completed`;
  return `${base}, incomplete`;
};

// StepDot Component
const StepDot = memo(
  ({
    index,
    isActive,
    isCompleted,
    isPressable,
    onPress,
    size = DEFAULT_DOT_SIZE,
    style,
    label,
    showLabels,
    orientation = 'horizontal',
    labelPosition = 'below',
    labelStyle,
    testID,
    theme: propTheme,
  }) => {
    const { theme: contextTheme } = useThemeContext();
    const theme = propTheme || contextTheme?.stepIndicator;

    const diameter = Math.max(20, size);
    const radius = diameter / 2;
    const backgroundColor = getStepColors(isActive, isCompleted, theme);
    const a11yLabel = useMemo(
      () => getAccessibilityLabel(index, isActive, isCompleted, label),
      [index, isActive, isCompleted, label],
    );

    const isVertical = orientation === 'vertical';
    const isRightLabel = labelPosition === 'right' || isVertical;

    const dotContent = (
      <View
        style={[
          styles.stepContainer,
          isVertical && styles.stepContainerVertical,
          styles.dotWrapper,
        ]}
      >
        <View style={styles.dotAlignCenter}>
          <View
            style={[
              {
                borderWidth: BORDER_WIDTH,
                alignItems: 'center',
                justifyContent: 'center',
                width: DOT_OUTER_SIZE,
                height: DOT_OUTER_SIZE,
                borderRadius: radius,
                borderColor: backgroundColor,
              },
              // (isActive || isCompleted) && {
              //   backgroundColor: backgroundColor,
              // },
              style,
            ]}
          >
            <View
              style={[
                {
                  width: 10,
                  height: 10,
                  borderRadius: 50,
                  overflow: 'hidden',
                },
                (isActive || isCompleted) && {
                  backgroundColor: backgroundColor,
                },
              ]}
            />
          </View>
        </View>

        {showLabels && label && labelPosition !== 'top' && (
          <View style={[isRightLabel ? styles.labelRight : styles.labelBelow]}>
            <Text
              numberOfLines={1}
              style={[styles.label, { color: theme.labelText }, labelStyle]}
            >
              {label}
            </Text>
          </View>
        )}
      </View>
    );

    const accessibilityProps = {
      accessible: true,
      accessibilityLabel: a11yLabel,
      accessibilityState: { selected: isActive },
      testID: testID ? `${testID}-step-${index}` : undefined,
    };

    if (isPressable && onPress) {
      return (
        <Pressable
          onPress={onPress}
          hitSlop={10}
          disabled={!isPressable}
          accessibilityRole="button"
          {...accessibilityProps}
        >
          {dotContent}
        </Pressable>
      );
    }

    return <View {...accessibilityProps}>{dotContent}</View>;
  },
);

StepDot.displayName = 'StepDot';

// Connector Component
const Connector = memo(({ isCompleted, isActive, length, theme }) => {
  const { theme: contextTheme } = useThemeContext();
  // const theme = propTheme || contextTheme?.stepIndicator;

  const connectorStyle = [
    styles.connector,
    {
      flex: length === 'flex' ? 1 : undefined,
      backgroundColor: isActive
        ? theme.active
        : isCompleted
        ? theme.completed
        : undefined,
    },
  ];

  return <View style={connectorStyle} />;
});

Connector.displayName = 'Connector';

// Main StepIndicator Component
export const StepIndicator = memo(
  ({
    steps,
    currentStep,
    onStepPress,
    orientation = 'horizontal',
    size = DEFAULT_DOT_SIZE,
    strokeWidth = DEFAULT_STROKE_WIDTH,
    spacing = DEFAULT_SPACING,
    allowFutureSelection = true,
    showLabels = true,
    labelPosition = 'below',
    style: containerStyle,
    stepStyle,
    labelStyle,
    subLabelStyle,
    testID,
    theme: propTheme,
  }) => {
    const { theme: contextTheme } = useThemeContext();
    const theme = propTheme || contextTheme?.stepIndicator;
    const isRTL = I18nManager.isRTL;
    const isHorizontal = orientation === 'horizontal';

    const wrapperStyle = useMemo(
      () => [
        isHorizontal ? styles.wrapperHorizontal : styles.wrapperVertical,
        isHorizontal && isRTL && styles.wrapperRTL,
        containerStyle,
      ],
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [orientation, isRTL, containerStyle],
    );

    const renderStep = (step, index) => {
      const isActive = index === currentStep;
      const isCompleted = index < currentStep;
      const canPress =
        !!onStepPress && (allowFutureSelection || index <= currentStep);
      const isLastStep = index === steps.length - 1;

      const stepNode = (
        <StepDot
          key={`step-${step.key}`}
          index={index}
          isActive={isActive}
          isCompleted={isCompleted}
          isPressable={canPress}
          onPress={canPress ? () => onStepPress?.(index) : undefined}
          size={size}
          strokeWidth={strokeWidth}
          theme={theme}
          style={stepStyle}
          label={step.label}
          subLabel={step.subLabel}
          showLabels={showLabels}
          orientation={orientation}
          labelPosition={labelPosition}
          labelStyle={labelStyle}
          subLabelStyle={subLabelStyle}
          testID={testID}
        />
      );

      if (isLastStep) return stepNode;

      const spacingStyle = isHorizontal
        ? { width: spacing }
        : { height: spacing };

      return (
        <React.Fragment key={`group-${step.key}`}>
          {stepNode}
          <View style={spacingStyle} />
          <Connector
            isActive={isActive}
            isCompleted={isCompleted}
            theme={theme}
            length="flex"
            thickness={DEFAULT_THICKNESS}
            orientation={orientation}
            size={size}
          />
          <View style={spacingStyle} />
        </React.Fragment>
      );
    };

    return <View style={wrapperStyle}>{steps.map(renderStep)}</View>;
  },
);

StepIndicator.displayName = 'StepIndicator';

const styles = StyleSheet.create({
  stepContainer: {
    alignItems: 'center',
  },
  stepContainerVertical: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotWrapper: {
    width: DOT_CONTAINER_WIDTH,
    marginHorizontal: -2.5,
    zIndex: 999,
  },
  dotAlignCenter: {
    width: DOT_CONTAINER_WIDTH,
    alignItems: 'center',
  },
  dotOuter: {
    borderWidth: BORDER_WIDTH,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelRight: {
    marginLeft: 8,
    justifyContent: 'center',
    flexShrink: 1,
  },
  labelBelow: {
    marginTop: 6,
    alignItems: 'center',
    maxWidth: 120,
  },
  label: {
    fontSize: verticalScale(12),
    fontWeight: '600',
    position: 'absolute',
    width: LABEL_MAX_WIDTH,
    textAlign: 'center',
    fontFamily: 'Lato-Bold',
  },
  connector: {
    height: CONNECTOR_HEIGHT,
    alignSelf: 'flex-start',
    marginTop: CONNECTOR_HEIGHT,
    borderTopWidth: CONNECTOR_BORDER_WIDTH,
    borderBottomWidth: CONNECTOR_BORDER_WIDTH,
    borderColor: 'white',
    // zIndex: -1,
  },
  wrapperHorizontal: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: 20,
  },
  wrapperRTL: {
    flexDirection: 'row-reverse',
  },
  wrapperVertical: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  subLabel: {
    fontSize: verticalScale(12),
    marginTop: 2,
  },
  checkmark: {
    fontSize: verticalScale(14),
    fontWeight: '800',
  },
});

export default StepIndicator;
