import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { moderateScale, verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import { debounce } from '@utils/debounce';
import { useNavigation } from '@react-navigation/native';
import {
  useGetPartnersByCategory,
  useListPartnersCategories,
} from '@hooks/profile/useProfile';
import NoData from '@components/ui/NoData';
import PartnerCard from '../components/PartnerCard';
import CustomSearchInput from '@components/ui/CustomSearchInput';
import { Category } from '@assets/index';
import Dining from '@assets/NEWICONS/CLUB/Dining';
import Health from '@assets/NEWICONS/CLUB/Health';
import Travel from '@assets/NEWICONS/CLUB/Travel';
import Entertainment from '@assets/NEWICONS/CLUB/Entertainment';
import Home from '@assets/NEWICONS/CLUB/Home';
import Transportation from '@assets/NEWICONS/CLUB/Transportation';
import Sports from '@assets/NEWICONS/CLUB/Sports';
import Vet from '@assets/NEWICONS/CLUB/Vet';
import Grocery from '@assets/NEWICONS/CLUB/Grocery';
import Personal from '@assets/NEWICONS/CLUB/Personal';
import Shopping from '@assets/NEWICONS/CLUB/Shopping';
import { getBottomMargin } from '@utils/paddingBottom';

const ByPartners = () => {
  const { theme } = useThemeContext();
  const styles = style(theme);
  const navigation = useNavigation();

  const { data: offersList = [] } = useListPartnersCategories();
  const { mutate: getPartnersByCategory } = useGetPartnersByCategory();

  const [category, setCategory] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [clubAllOffersDetails, setClubAllOffersDetails] = useState([]);
  const [showCard, setShowCard] = useState(false);
  const [currentOffer, setCurrentOffer] = useState(null);

  // Track if component is mounted
  const isMountedRef = useRef(true);

  const fetchOffers = useCallback(
    (searchValue, categoryValue) => {
      const payload = { category: categoryValue };

      getPartnersByCategory(
        { search: searchValue, data: payload },
        {
          onSuccess: res => {
            // Only update state if component is still mounted
            if (isMountedRef.current) {
              setClubAllOffersDetails(res?.data?.data || []);
            }
          },
          onError: err => {
            if (isMountedRef.current) {
              console.error(err);
            }
          },
        },
      );
    },
    [getPartnersByCategory],
  );

  const debouncedFetchRef = useRef(
    debounce((searchValue, categoryValue) => {
      fetchOffers(searchValue, categoryValue);
    }, 1000),
  );

  const handleCategoryChange = value => {
    const newValue = category === value ? '' : value;
    setCategory(newValue);
    fetchOffers(searchFilter, newValue);
  };

  const searchOffersHandler = value => {
    setSearchFilter(value);
    debouncedFetchRef.current(value, category);
  };

  useEffect(() => {
    isMountedRef.current = true;
    fetchOffers('', '');

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      // Cancel any pending debounced calls
      if (debouncedFetchRef.current?.cancel) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        debouncedFetchRef.current.cancel();
      }
    };
  }, [fetchOffers]);

  const categoryOptions = useMemo(() => {
    const getCategoryImage = title => {
      if (title.includes('Dining')) return <Dining />;
      if (title.includes('Health')) return <Health />;
      if (title.includes('Travel')) return <Travel />;
      if (title.includes('Entertainment')) return <Entertainment />;
      if (title.includes('Home')) return <Home />;
      if (title.includes('Transportation')) return <Transportation />;
      if (title.includes('Sports')) return <Sports />;
      if (title.includes('Vet')) return <Vet />;
      if (title.includes('Grocery')) return <Grocery />;
      if (title.includes('Personal')) return <Personal />;
      if (title.includes('Shopping')) return <Shopping />;
      return null;
    };

    return [
      ...offersList.map(ele => ({
        label: ele?.title,
        value: ele?.title,
        image: getCategoryImage(ele?.title || ''),
      })),
    ];
  }, [offersList]);

  const renderItem = ({ item, index }) => {
    if (!item) return null;

    return (
      <PartnerCard
        item={item}
        onUpdate={item => {
          setShowCard(true);
          setCurrentOffer(item);
        }}
      />
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.headerContainer}
    >
      <View style={{ gap: verticalScale(20) }}>
        <CustomSearchInput
          value={searchFilter}
          onChange={searchOffersHandler}
          title="Search..."
          container={styles.searchInput}
        />
        <View style={{ gap: verticalScale(10) }}>
          <Text
            style={{
              fontSize: verticalScale(16),
              fontFamily: 'Lato-Bold',
              color: theme.colors.text,
              marginHorizontal: verticalScale(20),
            }}
          >
            Categories
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {categoryOptions.map((item, index) => (
              <View
                style={{
                  alignItems: 'center',
                  width: verticalScale(85),
                  gap: verticalScale(6),
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={index}
                  onPress={() => handleCategoryChange(item.value)}
                  style={[
                    styles.categoryCard,
                    category === item.value && styles.activeCategoryCard,
                  ]}
                >
                  {item.image}
                </TouchableOpacity>
                <Text
                  style={[
                    styles.categoryText,
                    category === item.value && styles.activeCategoryText,
                  ]}
                  numberOfLines={2}
                >
                  {item.label}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
        <Text
          style={{
            fontSize: verticalScale(16),
            fontFamily: 'Lato-Bold',
            color: theme.colors.text,
            marginHorizontal: verticalScale(20),
          }}
        >
          Latest Offer
        </Text>
      </View>

      <FlatList
        data={clubAllOffersDetails}
        renderItem={renderItem}
        keyExtractor={(item, index) => item?._id || `partner-${index}`}
        ListEmptyComponent={() => <NoData />}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        columnWrapperStyle={{ gap: verticalScale(15) }}
        numColumns={2}
        removeClippedSubviews={false}
      />
    </ScrollView>
  );
};

const style = theme =>
  StyleSheet.create({
    headerContainer: {
      flexGrow: 1,
    },
    dropdown: {
      flex: 1,
    },
    searchInput: {
      flex: 1,
      marginHorizontal: verticalScale(20),
      marginTop: verticalScale(20),
    },
    listContent: {
      flexGrow: 1,
      paddingBottom: getBottomMargin(),
      gap: verticalScale(15),
      padding: moderateScale(20),
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
    categoryScroll: {
      paddingHorizontal: moderateScale(20),
      gap: moderateScale(10),
      paddingVertical: verticalScale(5),
      flexGrow: 1,
    },
    categoryCard: {
      height: verticalScale(75),
      width: verticalScale(75),
      borderRadius: moderateScale(70),
      backgroundColor: theme.colors.backgroundColor,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: verticalScale(15),
    },
    activeCategoryCard: {
      borderColor: theme.colors.primary,
    },
    categoryImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    activeCategoryImage: {
      tintColor: theme.colors.backgroundColor,
    },
    categoryText: {
      fontSize: moderateScale(12),
      fontFamily: 'Lato-Bold',
      color: theme.colors.textTertiary,
      textAlign: 'center',
    },
    activeCategoryText: {
      color: theme.colors.primary,
      fontFamily: 'Lato-Bold',
    },
  });

export default ByPartners;
