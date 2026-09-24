import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useThemeContext } from '@theme/ThemeProvider';
import { CustomAccordion } from '@components/ui/CustomAccordion';
import { verticalScale } from '@constants/metrics';
import { useMotorDetalisStore } from '@store/MOTOR/motorStore';
import { useFilterQuotes } from '@hooks/motorflow/useMotorFlowTop';

const SORT_OPTIONS = [
  { label: 'Price: low to high', value: 1 },
  { label: 'Price: high to low', value: -1 },
];

const MAX_EXCESS = 1500;

const SortModel = ({
  showFilterModal,
  setShowFilterModal,

  referenceId,
  maxAmount = 10000,
  focused,
  quotesList,
}) => {
  const { theme } = useThemeContext();
  const styles = style(theme);

  const [sortOption, setSortOption] = useState(null);
  const [repairOption, setRepairOption] = useState([]);
  const [benefitOptions, setBenefitOptions] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [excessRange, setExcessRange] = useState({ min: 0, max: MAX_EXCESS });
  const [priceRange, setPriceRange] = useState({ min: 0, max: maxAmount });

  const { listQuotes } = useMotorDetalisStore();
  const { mutate: filterQuotes } = useFilterQuotes();

  useEffect(() => {
    if (maxAmount > 0) {
      setPriceRange(prev => ({ ...prev, max: maxAmount }));
    }
  }, [maxAmount]);

  const filterPayload = useCallback(() => {
    const payload = {
      companyIds: companyOptions,
      benefitTitles: benefitOptions,
      repairTypes: repairOption,
      sort:
        sortOption === SORT_OPTIONS[0]
          ? 1
          : sortOption === SORT_OPTIONS[1]
          ? -1
          : null,
      priceMin: priceRange.min,
      priceMax: priceRange.max,
      excessMin: excessRange.min,
      excessMax: excessRange.max,
    };
    filterQuotes({ referenceId: referenceId, data: payload });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    companyOptions,
    benefitOptions,
    repairOption,
    sortOption,
    priceRange,
    excessRange,
    listQuotes,
    filterQuotes,
  ]);

  useEffect(() => {
    if (focused) filterPayload();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focused]);

  useEffect(() => {
    filterPayload();
  }, [filterPayload]);

  return (
    <Modal
      visible={showFilterModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowFilterModal(false)}
     />
  );
};

export default SortModel;

const style = theme =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: theme.colors.modalOverlay,
      justifyContent: 'flex-end',
    },
    container: {
      height: '50%',
      padding: verticalScale(20),
    },
    header: {
      alignItems: 'flex-end',
      marginBottom: verticalScale(20),
    },
    closeBtn: {
      fontSize: verticalScale(20),
      paddingHorizontal: 6,
    },
    section: {
      gap: verticalScale(10),
      marginVertical: verticalScale(15),
    },
    sectionTitle: {
      fontSize: verticalScale(18),
      marginBottom: verticalScale(10),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    accordionContent: {
      marginVertical: verticalScale(20),
    },
    repairOptionsContainer: {
      gap: verticalScale(10),
      paddingBottom: verticalScale(15),
      paddingHorizontal: verticalScale(20),
    },
    repairOption: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    repairOptionText: {
      fontSize: verticalScale(14),
      color: theme.colors.text,
      fontFamily: 'Lato-Regular',
    },
    repairOptionTextActive: {
      color: theme.colors.primary,
    },
  });
