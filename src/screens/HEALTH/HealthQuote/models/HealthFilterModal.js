import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  Image,
} from 'react-native';

import { verticalScale } from '@constants/metrics';
import { useHealthStore } from '@store/HEALTH/healthStore';
import { useThemeContext } from '@theme/ThemeProvider';
import CustomCheckBox from '@components/ui/CustomCheckBox';
import OrDivider from '@components/ui/OrDivider';
import { CustomAccordion } from '@components/ui/CustomAccordion';
import { useFilterHealthQuotes } from '@hooks/HEALTH/healthFlow/useHealthFlow';
import Header from '@components/ui/Header';
import { env } from '@config/index';

const PRICE_OPTIONS = ['Price low to high', 'Price high to low'];

const SORT_OPTIONS = [
  'Cover Low to High',
  'Cover High to Low',
  'Pharmacy Limit Low to High',
  'Pharmacy Limit High to Low',
];

const DEFAULT_FILTER = {
  coPays: '0',
  networkNames: [],
  companyNames: [],
  planType: [],
  tpaNames: [],
  sort: 1,
  clinicOptions: [],
};

const CheckBoxGroup = React.memo(
  ({
    options = [],
    selected,
    onChange,
    multichoice,
    theme,
    keyExtractor,
    labelExtractor,
  }) => (
    <View style={styles(theme).section}>
      {options.length === 0 ? (
        <Text
          style={[
            styles(theme).noDataText,
            { color: theme.colors.description },
          ]}
        >
          No options available
        </Text>
      ) : (
        options.map((item, index) => {
          const key = keyExtractor?.(item, index) ?? index;
          const label = labelExtractor?.(item) ?? item;
          const value = keyExtractor?.(item, index) ?? item;

          const checked = multichoice
            ? Array.isArray(selected) && selected.includes(value)
            : selected === value;

          return (
            <CustomCheckBox
              key={key}
              label={label}
              value={checked}
              onChange={v => onChange(v, value)}
              theme={theme}
            />
          );
        })
      )}
    </View>
  ),
);

const CompanySection = React.memo(
  ({ companies = [], selectedIds = [], onToggle, theme }) => (
    <CustomAccordion title="Company">
      <View style={styles(theme).companyGrid}>
        {companies.map(company => {
          const isSelected = selectedIds.includes(company._id);
          return (
            <TouchableOpacity
              key={company._id}
              activeOpacity={0.7}
              onPress={() => onToggle(!isSelected, company._id)}
              style={[
                styles(theme).companyCard,
                isSelected && styles(theme).companyCardSelected,
              ]}
            >
              <Image
                source={{ uri: `${env.API_URL}${company?.logoImg?.path}` }}
                resizeMode="contain"
                style={styles(theme).companyLogo}
              />
              <Text
                style={[
                  styles(theme).companyName,
                  isSelected && styles(theme).companyNameSelected,
                ]}
              >
                {company.companyName}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </CustomAccordion>
  ),
);

const HealthFilterModal = ({ open, setOpen, toggle, filterLists = {} }) => {
  const { theme } = useThemeContext();
  const { internalRef, updateHealthQuotesList } = useHealthStore();

  const { mutate: filterHealthQuotes } = useFilterHealthQuotes();

  const [priceOption, setPriceOption] = useState(PRICE_OPTIONS[0]);
  const [sortOption, setSortOption] = useState([]);
  const [filter, setFilter] = useState(DEFAULT_FILTER);

  useEffect(() => {
    if (Object.keys(filterLists).length) {
      const uniq = arr => [...new Set(arr.map(i => i?._id).filter(Boolean))];

      setFilter({
        ...DEFAULT_FILTER,
        companyNames: uniq(filterLists.companies || []),
        networkNames: uniq(filterLists.networks || []),
        tpaNames: uniq(filterLists.tpas || []),
        coPays: '0',
      });
    }
  }, [filterLists]);

  const updateMulti = useCallback(
    (key, checked, value) => {
      let newData = {};

      if (key === 'coPays' || key == 'filters' || key == 'sort') {
        setFilter(prev => ({ ...prev, [key]: value }));
        newData = {
          ...filter,
          [key]: value,
        };
      } else {
        setFilter(prev => ({
          ...prev,
          [key]: checked
            ? [...new Set([...prev[key], value])]
            : prev[key].filter(v => v !== value),
        }));
        newData = {
          ...filter,
          [key]: checked
            ? [...new Set([...filter[key], value])]
            : filter[key].filter(v => v !== value),
        };
      }

      console.log('filter', newData);

      filterHealthQuotes(
        {
          data: newData,
          reqId: internalRef,
        },
        {
          onSuccess: res => {
            console.log('res applying filters', res);

            updateHealthQuotesList(res?.data?.data);
          },
          onError: error => {
            console.log('error applying filters', error);
          },
        },
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filter, filterHealthQuotes, internalRef],
  );

  const handleFilterChange = useCallback(
    (type, checked, value) => {
      switch (type) {
        case 'Company':
          updateMulti('companyNames', checked, value);
          break;
        case 'Network':
          updateMulti('networkNames', checked, value);
          break;
        case 'TPA':
          updateMulti('tpaNames', checked, value);
          break;
        case 'Plan':
          updateMulti('planType', checked, value);
          break;
        case 'Co-Pay':
          updateMulti('coPays', true, value);
          break;
        case 'Price':
          updateMulti('sort', true, value);
          break;
        case 'Sort':
          updateMulti('filters', true, [value]);
          break;
        default:
          return;
      }
    },
    [updateMulti],
  );

  const handlePriceChange = (_, option) => {
    setPriceOption(option);
    handleFilterChange('Price', true, option === PRICE_OPTIONS[0] ? 1 : -1);
  };

  const handleSortChange = (_, option) => {
    setSortOption(option);
    handleFilterChange('Sort', true, option);
  };

  const handleReset = () => {
    filterHealthQuotes(
      {
        data: {},
        reqId: internalRef,
      },
      {
        onSuccess: res => {
          console.log('res reset filters', res);
          updateHealthQuotesList(res?.data?.data);
        },
        onError: error => {
          console.log('error reset filters', error);
        },
      },
    );
    setOpen(false);
  };

  return (
    <Modal
      visible={open}
      animationType="slide"
      presentationStyle={toggle === 'filter' ? 'formSheet' : ''}
      transparent={toggle === 'filter' ? false : true}
    >
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
            onBack={() => setOpen(false)}
            textSecondarytyle={{ paddingTop: 0 }}
            refresh
            onRefresh={handleReset}
            noShadow
          />

          <ScrollView contentContainerStyle={styles(theme).scrollContent}>
            {toggle === 'sort' && (
              <>
                <OrDivider simple />

                <CustomAccordion title="Price">
                  <CheckBoxGroup
                    options={PRICE_OPTIONS}
                    selected={priceOption}
                    onChange={handlePriceChange}
                    theme={theme}
                  />
                </CustomAccordion>

                <OrDivider simple />

                <CustomAccordion title="Sort">
                  <CheckBoxGroup
                    options={SORT_OPTIONS}
                    selected={sortOption}
                    onChange={handleSortChange}
                    theme={theme}
                  />
                </CustomAccordion>

                <OrDivider simple />
              </>
            )}

            {toggle === 'filter' && (
              <>
                <OrDivider simple />

                <CustomAccordion title="Co-Pay">
                  <View style={styles(theme).copayRow}>
                    {(filterLists.allCoPays || []).map(item => (
                      <TouchableOpacity
                        key={item}
                        onPress={() => handleFilterChange('Co-Pay', true, item)}
                        style={[
                          styles(theme).copayCard,
                          filter.coPays === item && styles(theme).copayActive,
                        ]}
                      >
                        <Text
                          style={{
                            color:
                              filter.coPays === item
                                ? theme.colors.primary
                                : theme.colors.textTertiary,
                          }}
                        >
                          {item}%
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </CustomAccordion>

                <OrDivider simple />

                <CompanySection
                  companies={filterLists.companies}
                  selectedIds={filter.companyNames}
                  onToggle={(c, v) => handleFilterChange('Company', c, v)}
                  theme={theme}
                />

                <OrDivider simple />

                <CustomAccordion title="Network">
                  <CheckBoxGroup
                    multichoice
                    options={filterLists.networks}
                    selected={filter.networkNames}
                    onChange={(c, v) => handleFilterChange('Network', c, v)}
                    keyExtractor={i => i._id}
                    labelExtractor={i => i.networkName}
                    theme={theme}
                  />
                </CustomAccordion>

                <OrDivider simple />

                <CustomAccordion title="TPA">
                  <CheckBoxGroup
                    multichoice
                    options={filterLists.tpas}
                    selected={filter.tpaNames}
                    onChange={(c, v) => handleFilterChange('TPA', c, v)}
                    keyExtractor={i => i._id}
                    labelExtractor={i => i.TPAName}
                    theme={theme}
                  />
                </CustomAccordion>

                <OrDivider simple />
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default HealthFilterModal;

const styles = theme =>
  StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: theme.colors.backgroundColor },
    scrollContent: { paddingBottom: verticalScale(30) },
    section: {
      gap: verticalScale(10),
      paddingHorizontal: verticalScale(20),
      paddingBottom: verticalScale(20),
    },
    companyGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: verticalScale(10),
      paddingHorizontal: verticalScale(20),
      paddingBottom: verticalScale(20),
    },
    companyCard: {
      width: (Dimensions.get('screen').width - 60.1) / 3,
      padding: verticalScale(10),
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: verticalScale(6),
      alignItems: 'center',
    },
    companyCardSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.floorBgColor,
    },
    companyLogo: { width: 60, height: 60 },
    companyName: {
      fontSize: verticalScale(12),
      color: theme.colors.textTertiary,
      textAlign: 'center',
    },
    companyNameSelected: { color: theme.colors.primary },
    copayRow: {
      flexDirection: 'row',
      gap: 10,
      paddingHorizontal: verticalScale(20),
      paddingBottom: verticalScale(20),
    },
    copayCard: {
      flex: 1,
      padding: verticalScale(10),
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: verticalScale(6),
      alignItems: 'center',
    },
    copayActive: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.floorBgColor,
    },
    noDataText: { textAlign: 'center', paddingVertical: 10 },
  });
