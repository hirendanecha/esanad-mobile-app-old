import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import { moderateScale, verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import OfferCard from '../components/OfferCard';
import { CustomDropDownList } from '@components/ui/CustomDropDownList';
import FloatingLabelInput from '@components/ui/FloatingLabelInput';
import { debounce } from '@utils/debounce';
import Header from '@components/ui/Header';
import { useNavigation } from '@react-navigation/native';
import {
  useGetPartnersByOffer,
  useListoffercategories,
} from '@hooks/profile/useProfile';
import NoData from '@components/ui/NoData';
import AvilModal from '../components/AvilModal';
import AvilModalOtp from '../components/AvilModalOtp';

const ByOffers = () => {
  const { theme } = useThemeContext();
  const styles = style(theme);
  const navigation = useNavigation();

  const { data: offersList = [] } = useListoffercategories();
  const { mutate: getPartnersByOffer } = useGetPartnersByOffer();

  const [category, setCategory] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [clubAllOffersDetails, setClubAllOffersDetails] = useState([]);
  const [showCard, setShowCard] = useState(false);
  const [currentOffer, setCurrentOffer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Track if component is mounted
  const isMountedRef = useRef(true);
  const fetchTimeoutRef = useRef(null);

  const fetchOffers = useCallback(
    (searchValue, categoryValue) => {
      if (!isMountedRef.current) return;

      setIsLoading(true);
      const payload = { category: categoryValue };

      getPartnersByOffer(
        { search: searchValue, data: payload },
        {
          onSuccess: res => {
            if (isMountedRef.current) {
              const data = res?.data?.data || [];
              // Filter out any null/undefined items
              const validData = data.filter(
                item => item != null && item !== undefined,
              );
              setClubAllOffersDetails(validData);
              setIsLoading(false);
            }
          },
          onError: err => {
            if (isMountedRef.current) {
              console.error(err);
              setClubAllOffersDetails([]);
              setIsLoading(false);
            }
          },
        },
      );
    },
    [getPartnersByOffer],
  );

  const debouncedFetchRef = useRef(
    debounce((searchValue, categoryValue) => {
      fetchOffers(searchValue, categoryValue);
    }, 1500),
  );

  const handleCategoryChange = useCallback(
    value => {
      if (!isMountedRef.current) return;
      setCategory(value);
      // Clear timeout to prevent race conditions
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
      fetchTimeoutRef.current = setTimeout(() => {
        fetchOffers(searchFilter, value);
      }, 100);
    },
    [searchFilter, fetchOffers],
  );

  const searchOffersHandler = useCallback(
    value => {
      if (!isMountedRef.current) return;
      setSearchFilter(value);
      debouncedFetchRef.current(value, category);
    },
    [category],
  );

  useEffect(() => {
    isMountedRef.current = true;

    // Small delay to ensure component is fully mounted
    const initTimeout = setTimeout(() => {
      if (isMountedRef.current) {
        fetchOffers('', '');
      }
    }, 100);

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      if (initTimeout) clearTimeout(initTimeout);
      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
      // Cancel any pending debounced calls
      if (debouncedFetchRef.current?.cancel) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        debouncedFetchRef.current.cancel();
      }
    };
  }, [fetchOffers]);

  const categoryOptions = useMemo(
    () => [
      { label: 'All', value: '' },
      ...(offersList || [])
        .map(ele => ({
          label: ele?.title || '',
          value: ele?.title || '',
        }))
        .filter(opt => opt.label),
    ],
    [offersList],
  );

  const renderItem = useCallback(({ item, index }) => {
    // Double check item exists
    if (!item || !isMountedRef.current) {
      return null;
    }

    return (
      <OfferCard
        item={item}
        onUpdate={selectedItem => {
          if (isMountedRef.current) {
            setShowCard(true);
            setCurrentOffer(selectedItem);
          }
        }}
      />
    );
  }, []);

  const keyExtractor = useCallback((item, index) => {
    if (!item) return `offer-empty-${index}`;
    return item._id || `offer-${index}`;
  }, []);

  const renderEmptyComponent = useCallback(() => {
    if (isLoading) return null;
    return <NoData />;
  }, [isLoading]);

  // Don't render FlatList until we have initial data or confirmed empty
  if (!isMountedRef.current) {
    return null;
  }

  return (
    <>
      <View style={styles.headerContainer}>
        <CustomDropDownList
          title="All"
          data={categoryOptions}
          value={category}
          handleSelect={handleCategoryChange}
          style={styles.dropdown}
          absolute
          showSearch={false}
          searchPlaceholder="Search categories..."
        />

        <FloatingLabelInput
          label="Search Offers"
          value={searchFilter}
          onChangeText={searchOffersHandler}
          style={styles.searchInput}
          showErrorMessage={false}
          autoCapitalize="none"
        />
      </View>
      <FlatList
        data={clubAllOffersDetails}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={false}
        extraData={clubAllOffersDetails}
      />
      {showCard && currentOffer && (
        <AvilModalOtp
          currentOffer={currentOffer}
          isInput
          handleClose={() => {
            if (isMountedRef.current) {
              setShowCard(false);
              setCurrentOffer(null);
            }
          }}
        />
      )}
    </>
  );
};

const style = theme =>
  StyleSheet.create({
    headerContainer: {
      paddingHorizontal: moderateScale(20),
      paddingVertical: moderateScale(15),
      gap: moderateScale(12),
      flexDirection: 'row',
    },
    dropdown: {
      flex: 1,
    },
    searchInput: {
      width: (Dimensions.get('screen').width - 32 - 12) / 2,
    },
    listContent: {
      flexGrow: 1,
      paddingBottom: moderateScale(20),
      gap: verticalScale(15),
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: moderateScale(40),
    },
    emptyText: {
      fontSize: moderateScale(16),
      textAlign: 'center',
    },
  });

export default ByOffers;
