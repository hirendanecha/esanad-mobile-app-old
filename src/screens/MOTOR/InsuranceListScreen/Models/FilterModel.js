import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useThemeContext } from '@theme/ThemeProvider';
import { CustomAccordion } from '@components/ui/CustomAccordion';
import CustomCheckBox from '@components/ui/CustomCheckBox';
import CustomRangeSlider from '@components/ui/CustomRangeSlider';
import Header from '@components/ui/Header';
import OrDivider from '@components/ui/OrDivider';
import { verticalScale } from '@constants/metrics';
import { useMotorDetalisStore } from '@store/MOTOR/motorStore';
import { useFilterQuotes } from '@hooks/motorflow/useMotorFlowTop';
import { env } from '@config/index';

const SORT_OPTIONS = [
  { label: 'Price: low to high', value: 1 },
  { label: 'Price: high to low', value: -1 },
];
const REPAIR_OPTIONS = [
  { label: 'Agency', value: 'agency' },
  { label: 'Non Agency', value: 'nonagency' },
];
const MAX_EXCESS = 1500;
const SCREEN_WIDTH = Dimensions.get('screen').width;
const SLIDER_WIDTH = SCREEN_WIDTH - 60;
const COMPANY_CARD_WIDTH = (SCREEN_WIDTH - 60.1) / 3;

const DEFAULT_FILTER = {
  sort: -1,
  repairOption: [],
  benefitTitles: [],
  companyIds: [],
  excessMax: MAX_EXCESS,
  excessMin: 0,
  priceMax: 1000,
  priceMin: 0,
};

const buildFilterPayload = filters => ({
  companyIds: filters.companyIds,
  benefitTitles: filters.benefitTitles,
  repairTypes: filters.repairOption,
  sort: filters.sort,
  priceMin: filters.priceMin,
  priceMax: filters.priceMax,
  excessMin: filters.excessMin,
  excessMax: filters.excessMax,
});

const RepairTypeSection = ({ repairOption, onRepairChange, theme }) => (
  <CustomAccordion title="Repair Type">
    <View style={styles(theme).repairOptionsContainer}>
      {REPAIR_OPTIONS.map(option => (
        <TouchableOpacity
          key={option.value}
          style={styles(theme).repairOption}
          onPress={() => onRepairChange(option.value)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles(theme).repairOptionText,
              repairOption.includes(option.value) &&
                styles(theme).repairOptionTextActive,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </CustomAccordion>
);

const CompanySection = ({
  companyName,
  companyIds,
  onCompanyToggle,
  theme,
}) => {
  return (
    <CustomAccordion title="Company">
      <View style={styles(theme).companyGrid}>
        {companyName.map(company => {
          const isSelected = companyIds.includes(company._id);
          return (
            <TouchableOpacity
              key={company._id}
              activeOpacity={0.8}
              style={[
                styles(theme).companyCard,
                isSelected && styles(theme).companyCardSelected,
              ]}
              onPress={() => onCompanyToggle(!isSelected, company._id)}
            >
              <Image
                source={{ uri: `${env.API_URL}${company?.company?.path}` }}
                resizeMode="contain"
                style={styles(theme).companyLogo}
              />
              <Text
                style={[
                  styles(theme).companyName,
                  isSelected && styles(theme).companyNameSelected,
                ]}
              >
                {company.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </CustomAccordion>
  );
};

const FilterModal = ({
  showFilterModal,
  setShowFilterModal,
  benifitList,
  companyName,
  referenceId,
  maxAmount = 10000,
  toggle,
}) => {
  const { theme } = useThemeContext();
  const { listQuotes } = useMotorDetalisStore();
  const { mutate: filterQuotes } = useFilterQuotes();

  const [filter, setFilter] = useState(DEFAULT_FILTER);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (maxAmount > 0 && filter.priceMax === 1000) {
      setFilter(prev => ({ ...prev, priceMax: maxAmount }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxAmount]);

  useEffect(() => {
    if (showFilterModal && referenceId) {
      const payload = buildFilterPayload(filter);
      filterQuotes({ referenceId, data: payload });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, showFilterModal, referenceId]);

  const handleFilterChange = (type, checked, value) => {
    switch (type) {
      case 'Sort':
        setFilter(prev => ({ ...prev, sort: value }));
        break;
      case 'Repair':
        setFilter(prev => ({
          ...prev,
          repairOption: checked
            ? [...new Set([...prev.repairOption, value])]
            : prev.repairOption.filter(v => v !== value),
        }));
        break;
      case 'Company':
        setFilter(prev => ({
          ...prev,
          companyIds: checked
            ? [...new Set([...prev.companyIds, value])]
            : prev.companyIds.filter(v => v !== value),
        }));
        break;
      case 'Benefit':
        setFilter(prev => ({
          ...prev,
          benefitTitles: checked
            ? [...new Set([...prev.benefitTitles, value])]
            : prev.benefitTitles.filter(v => v !== value),
        }));
        break;
      case 'ExcessRange':
        setFilter(prev => ({
          ...prev,
          excessMin: value.min,
          excessMax: value.max,
        }));
        break;
      case 'PriceRange':
        setFilter(prev => ({
          ...prev,
          priceMin: value.min,
          priceMax: value.max,
        }));
        break;
      default:
        return;
    }
  };

  const handleSortChange = value => {
    handleFilterChange('Sort', true, value);
  };

  const handleRepairChange = value => {
    const isCurrentlySelected = filter.repairOption.includes(value);
    handleFilterChange('Repair', !isCurrentlySelected, value);
  };

  const handleCompanyToggle = (checked, companyId) => {
    handleFilterChange('Company', checked, companyId);
  };

  const handleBenefitChange = (checked, benefitValue) => {
    handleFilterChange('Benefit', checked, benefitValue);
  };

  const handleExcessRangeChange = value => {
    handleFilterChange('ExcessRange', true, value);
  };

  const handlePriceRangeChange = value => {
    handleFilterChange('PriceRange', true, value);
  };

  const handleReset = () => {
    setInitialized(false);
    setFilter({
      ...DEFAULT_FILTER,
      priceMax: maxAmount,
    });
    setTimeout(() => setShowFilterModal(false), 300);
  };

  const handleClose = () => setShowFilterModal(false);

  return (
    <Modal
      visible={showFilterModal}
      animationType="slide"
      presentationStyle={toggle === 'filter' ? 'formSheet' : ''}
      transparent={toggle === 'filter' ? false : true}
    >
      <GestureHandlerRootView style={styles(theme).rootView}>
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.modalOverlay,
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={[
              {
                backgroundColor: theme.colors.backgroundColor,
                height: toggle === 'filter' ? '100%' : '50%',
              },
            ]}
          >
            <Header
              title="Filter"
              onBack={handleClose}
              textSecondarytyle={{ paddingTop: 0 }}
              refresh
              onRefresh={handleReset}
              noShadow
            />

            <ScrollView
              contentContainerStyle={styles(theme).scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {toggle === 'sort' ? (
                <View
                  style={{
                    padding: verticalScale(20),
                  }}
                >
                  <Text
                    style={{
                      fontSize: verticalScale(18),
                      marginBottom: verticalScale(10),
                      fontFamily: 'Lato-Bold',
                      color: theme.colors.text,
                    }}
                  >
                    Sort
                  </Text>
                  <View
                    style={{
                      paddingBottom: verticalScale(15),
                    }}
                  >
                    {SORT_OPTIONS.map(option => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          {
                            height: verticalScale(40),
                            paddingHorizontal: verticalScale(20),
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor:
                              filter.sort === option.value
                                ? theme.colors.bgSecondary
                                : theme.colors.backgroundColor,
                          },
                        ]}
                        onPress={() => handleSortChange(option.value)}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            {
                              fontSize: verticalScale(16),
                              color: theme.colors.text,
                              fontFamily: 'Lato-Regular',
                            },
                            filter.sort === option.value && {
                              color: theme.colors.primary,
                              fontFamily: 'Lato-Bold',
                            },
                          ]}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ) : (
                <>
                  <OrDivider simple />

                  <RepairTypeSection
                    repairOption={filter.repairOption}
                    onRepairChange={handleRepairChange}
                    theme={theme}
                  />

                  <OrDivider simple />

                  <CustomAccordion title="Excess Charges">
                    <View style={styles(theme).sliderContainer}>
                      <CustomRangeSlider
                        sliderWidth={SLIDER_WIDTH}
                        min={0}
                        max={MAX_EXCESS}
                        step={1}
                        initialMin={filter.excessMin}
                        initialMax={filter.excessMax}
                        onValueChange={handleExcessRangeChange}
                        theme={theme}
                      />
                    </View>
                  </CustomAccordion>

                  <OrDivider simple />

                  <CustomAccordion title="Policy Price">
                    <View style={styles(theme).sliderContainer}>
                      <CustomRangeSlider
                        sliderWidth={SLIDER_WIDTH}
                        min={0}
                        max={maxAmount}
                        step={10}
                        initialMin={filter.priceMin}
                        initialMax={filter.priceMax}
                        onValueChange={handlePriceRangeChange}
                        theme={theme}
                      />
                    </View>
                  </CustomAccordion>

                  <OrDivider simple />

                  <CustomAccordion title="Benefits">
                    <View
                      style={{
                        paddingBottom: verticalScale(15),
                        paddingHorizontal: verticalScale(20),
                        gap: verticalScale(10),
                      }}
                    >
                      {benifitList?.map(benefit => {
                        const isChecked =
                          filter.benefitTitles.includes(benefit);
                        return (
                          <CustomCheckBox
                            key={benefit}
                            label={benefit}
                            value={isChecked}
                            onChange={checked =>
                              handleBenefitChange(checked, benefit)
                            }
                            theme={theme}
                          />
                        );
                      })}
                    </View>
                  </CustomAccordion>

                  <OrDivider simple />

                  <CompanySection
                    companyName={companyName}
                    companyIds={filter.companyIds}
                    onCompanyToggle={handleCompanyToggle}
                    theme={theme}
                  />

                  <OrDivider simple />
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

export default FilterModal;

const styles = theme =>
  StyleSheet.create({
    rootView: {
      flex: 1,
    },
    backdrop: {
      flexGrow: 1,
      backgroundColor: theme.colors.backgroundColor,
      paddingBottom: verticalScale(90),
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 30,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    section: {
      gap: verticalScale(10),
    },
    sectionTitle: {
      fontSize: verticalScale(18),
      fontWeight: '600',
      marginBottom: verticalScale(5),
      color: theme.colors.text,
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
    sliderContainer: {
      paddingHorizontal: verticalScale(20),
    },
    companyGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: verticalScale(10),
      paddingBottom: verticalScale(15),
      paddingHorizontal: verticalScale(20),
    },
    companyCard: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: verticalScale(5),
      width: COMPANY_CARD_WIDTH,
      padding: verticalScale(10),
      alignItems: 'center',
      gap: verticalScale(5),
      justifyContent: 'center',
      backgroundColor: theme.colors.backgroundColor,
    },
    companyCardSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.floorBgColor,
    },
    companyLogo: {
      width: 60,
      height: 60,
    },
    companyName: {
      fontSize: verticalScale(12),
      color: theme.colors.textTertiary,
      fontFamily: 'Lato-Regular',
      textAlign: 'center',
    },
    companyNameSelected: {
      color: theme.colors.primary,
      fontFamily: 'Lato-Bold',
    },
  });
