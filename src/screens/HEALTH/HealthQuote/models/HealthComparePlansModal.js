import React, { useCallback, useMemo, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { moderateScale, verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import { formatNumber } from '@utils/formateNumber';
import { useCompareQuotes } from '@hooks/policy/useMotorPolicy';
import NoData from '@components/ui/NoData';
import CustomButton from '@components/ui/CustomButton';
import { env } from '@config/index';
import { useCompareHealthQuotes } from '@hooks/HEALTH/healthFlow/useHealthFlow';
import { useHealthStore } from '@store/HEALTH/healthStore';

const MAX_PLANS = 4;
const MIN_PLANS = 2;

const QuoteCard = React.memo(({ item, theme, styles, onRemove }) => {
  const logoSource = {
    uri: `${env.API_URL}/${
      item?.company?.logoImg?.path || item?.companyData?.logoImg?.path
    }`,
  };

  const companyName =
    item?.company?.companyName ||
    item?.company?.name ||
    item?.company?.praktoraCompanyName ||
    item?.companyData?.companyName ||
    'Health Insurance';

  const planName = item?.plan?.planName || 'Health Plan';

  return (
    <View style={[styles.quoteCard, { borderColor: theme.colors.border }]}>
      <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
        <Icon name="close" size={moderateScale(18)} color={theme.colors.text} />
      </TouchableOpacity>

      <View style={styles.cardHeader}>
        <Image source={logoSource} style={styles.companyLogo} />
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.companyName}>{companyName}</Text>

        <Text style={styles.insuranceTypeBadge}>{planName}</Text>

        <View style={styles.coverAmountContainer}>
          <Text style={styles.coverLabel}>Cover Amount (AED):</Text>
          <Text style={styles.coverValue}>AED 10,00,000</Text>
        </View>
      </View>
    </View>
  );
});

const HealthComparePlansModal = ({
  showCompareModal,
  setShowCompareModal,
  quotesList = [],
  onUpdate,
}) => {
  const { theme } = useThemeContext();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { mutate: compareHealthQuotes } = useCompareHealthQuotes();
  const [isVisible, setIsVisible] = useState(false);

  const insets = useSafeAreaInsets();
  const { internalRef } = useHealthStore();
  console.log('internalRef', internalRef);

  const opacity = useSharedValue(0);

  useEffect(() => {
    if (showCompareModal) {
      setIsVisible(true);
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      opacity.value = withTiming(0, { duration: 300 }, finished => {
        finished && runOnJS(setIsVisible)(false);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCompareModal]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: withTiming(showCompareModal ? 0 : 50) }],
  }));

  const handleCompare = useCallback(() => {
    if (quotesList.length < MIN_PLANS) {
      Alert.alert(
        'Selection Required',
        `Please select at least ${MIN_PLANS} plans to compare!`,
      );
      return;
    }

    if (quotesList.length > MAX_PLANS) {
      Alert.alert(
        'Too Many Plans',
        `You can select up to ${MAX_PLANS} plans only!`,
      );
      return;
    }

    compareHealthQuotes({
      reqId: internalRef,
      data: { ids: quotesList.map(q => q._id) },
    });

    setShowCompareModal(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quotesList]);

  const renderPlans = useMemo(
    () =>
      quotesList.map(item => (
        <QuoteCard
          key={item._id}
          item={item}
          theme={theme}
          styles={styles}
          onRemove={() => onUpdate(item)}
        />
      )),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [quotesList],
  );

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.backdrop, backdropStyle]}>
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        activeOpacity={1}
        onPress={() => setShowCompareModal(false)}
      />

      <Animated.View
        style={[
          styles.container,
          containerStyle,
          { bottom: insets.bottom + 140 },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.placeholder} />
          <Text style={styles.title}>Compare Plans</Text>
          <TouchableOpacity onPress={() => setShowCompareModal(false)}>
            <Text style={styles.closeBtn}>✕</Text>
          </TouchableOpacity>
        </View>

        {quotesList.length === 0 ? (
          <View style={styles.noDataContainer}>
            <NoData />
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {renderPlans}
          </ScrollView>
        )}

        <View style={styles.horizontalLine} />

        {quotesList.length > 1 && (
          <CustomButton
            title="Compare Plans"
            buttonStyle={styles.compareButton}
            isShowIcon
            onPress={handleCompare}
          />
        )}
      </Animated.View>
    </Animated.View>
  );
};

export default HealthComparePlansModal;

const createStyles = theme =>
  StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.modalOverlay,
      zIndex: 100,
    },
    container: {
      position: 'absolute',
      left: 0,
      right: 0,
      marginHorizontal: verticalScale(20),
      borderRadius: verticalScale(15),
      padding: verticalScale(15),
      backgroundColor: theme.colors.backgroundColor,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: verticalScale(20),
    },
    placeholder: { width: verticalScale(22) },
    title: {
      fontSize: verticalScale(18),
      fontWeight: '700',
      color: theme.colors.text,
    },
    closeBtn: {
      fontSize: verticalScale(22),
      color: theme.colors.primary,
    },
    compareButton: {
      width: '75%',
      alignSelf: 'center',
      marginTop: verticalScale(20),
    },
    quoteCard: {
      flexDirection: 'row',
      borderWidth: 1,
      borderRadius: verticalScale(5),
      padding: verticalScale(10),
      marginBottom: verticalScale(10),
      backgroundColor: theme.colors.backgroundColor,
    },
    noDataContainer: {
      paddingBottom: verticalScale(20),
    },
    removeButton: {
      position: 'absolute',
      top: 8,
      right: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 20,
      padding: 4,
      zIndex: 1,
    },
    cardHeader: { marginRight: verticalScale(12) },
    companyLogo: {
      width: verticalScale(45),
      height: verticalScale(45),
      resizeMode: 'contain',
    },
    cardBody: { flex: 1, gap: verticalScale(8) },
    companyName: {
      fontSize: verticalScale(14),
      fontWeight: '700',
      color: theme.colors.text,
    },
    insuranceTypeBadge: {
      fontSize: moderateScale(10),
      backgroundColor: theme.colors.highlight,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 5,
      alignSelf: 'flex-start',
      color: theme.colors.text,
    },
    coverAmountContainer: {
      flexDirection: 'row',
      gap: verticalScale(8),
    },
    coverLabel: {
      fontSize: verticalScale(12),
      color: theme.colors.description,
    },
    coverValue: {
      fontSize: verticalScale(12),
      fontWeight: '700',
      color: theme.colors.text,
    },
    horizontalLine: {
      position: 'absolute',
      bottom: -15,
      alignSelf: 'center',
      height: 30,
      width: 30,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.backgroundColor,
      transform: [{ rotate: '45deg' }],
    },
  });
