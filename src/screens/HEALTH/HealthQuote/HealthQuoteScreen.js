import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useHealthStore } from '@store/HEALTH/healthStore';
import CustomBox from './components/CustomBox';
import { useThemeContext } from '@theme/ThemeProvider';
import HealthComparePlansModal from './models/HealthComparePlansModal';
import HealthPlans from './components/HealthPlan';
import HealthFilterModal from './models/HealthFilterModal';
import Header from '@components/ui/Header';
import LinearGradient from 'react-native-linear-gradient';
import { verticalScale } from '@constants/metrics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Compare from '@assets/icons/Compare';
import { useToast } from '@components/ui/Toast';
import HealthFetchMore from './components/HealthFetchMore';
import {
  useFilterHealthQuotes,
  useGetFilterList,
  useRegenerateQuotes,
} from '@hooks/HEALTH/healthFlow/useHealthFlow';
import RegenerateQuotes from './models/RegenerateQuotes';
import { SCREEN_NAMES } from '@constants/screenNames';
import { getBottomMargin } from '@utils/paddingBottom';
// import { arrayOfQuotes } from 'Dummy';

const HealthQuoteScreen = ({ navigation, route }) => {
  const { theme } = useThemeContext();

  const quoteSPlans = route?.params?.data;
  const { showToast } = useToast();

  const styles = style(theme);
  const insets = useSafeAreaInsets();
  const [morePlan, setMorePlans] = useState([]);
  const [healthApiCall, setHealthApiCall] = useState(false);

  const [openHint, setOpenHint] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [comparePolicy, setComparePolicy] = useState(false);
  const [comparePolicyArray, setComparePolicyArray] = useState([]);
  const [openMemberHint, setOpenMemberHint] = useState([]);
  const [showFetchMore, setShowFetchMore] = useState(false);
  const [regenerate, setRegenerate] = useState(false);
  const {
    healthQuotesList,
    internalRef,
    regeneratedata,
    updateHealthQuotesList,
  } = useHealthStore();

  const { data: filterLists = {}, refetch } = useGetFilterList({
    reqId: internalRef,
  });
  const { mutate: regenerateQuotes } = useRegenerateQuotes();
  const { mutate: filterHealthQuotes } = useFilterHealthQuotes();

  const [arrayOfQuotes, setArrayOfQuotes] = useState([]);
  // console.log('arrayOfQuotes', arrayOfQuotes);

  const healthQuotesLists =
    healthQuotesList.length > 0 ? healthQuotesList : quoteSPlans;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFetchMore(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const companiesMap = new Map();
    if (healthQuotesLists) {
      healthQuotesLists?.forEach(quote => {
        const { company, ...data } = quote;
        const companyId = company?._id;
        if (!companiesMap.has(companyId)) {
          companiesMap.set(companyId, {
            plans: [{ ...data }],
            company: company,
          });
        } else {
          const resultArray = Array.from(companiesMap.values());
          resultArray?.forEach(item => {
            if (item?.company?._id === companyId) {
              const aa = companiesMap.get(companyId);
              companiesMap.set(companyId, {
                plans: [...aa?.plans, { ...data }],
                company: company,
              });
            }
          });
        }
      });
    }
    const resultArray = Array.from(companiesMap.values());
    if (!healthApiCall) {
      const array = [];
      resultArray?.forEach(company => {
        array?.push({
          ...company,
          plans: company?.plans?.sort((a, b) => a?.price - b?.price),
        });
      });
      setArrayOfQuotes(array);
    } else {
      setArrayOfQuotes(resultArray);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [healthQuotesList]);

  const setMorePlansHandler = id => {
    const match = morePlan?.find(i => i?.id === id);
    const nonMatch = morePlan?.filter(i => i?.id !== id);
    let aa = { id: id, value: !match?.value };
    setMorePlans([...nonMatch, aa]);
  };

  const handleTooltipClose = id => {
    const nonMatch = openMemberHint?.filter(i => i?.id !== id);
    let aa = { id: id, value: false };
    setOpenMemberHint([...nonMatch, aa]);
  };

  const handleTooltipOpen = id => {
    const nonMatch = openMemberHint?.filter(i => i?.id !== id);
    let aa = { id: id, value: true };
    setOpenMemberHint([...nonMatch, aa]);
  };

  const renderBottomBar = () => (
    <View style={[styles.bottomBar, { paddingBottom: insets.bottom - 10 }]}>
      <TouchableOpacity
        style={styles.sortButton}
        onPress={() => {
          setShowFilterModal(prev => !prev);
          setToggle('sort');
        }}
        activeOpacity={0.8}
      >
        <Icon
          name="sort-amount-down"
          size={18}
          color={theme.colors.textTertiary}
        />
        <Text style={styles.sortText}>Sort</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => {
          setShowFilterModal(prev => !prev);
          setToggle('filter');
        }}
        activeOpacity={0.8}
      >
        <Icon name="sliders-h" size={18} color={theme.colors.primary} />
        <Text style={styles.filterText}>Filter</Text>
      </TouchableOpacity>
    </View>
  );

  const toggleCompareModal = () => {
    if (comparePolicy === true) {
      setComparePolicy(false);
      return;
    }
    if (comparePolicyArray.length < 2) {
      showToast('Please select at least 2 policies to compare.', 'error');
      return;
    }
    setComparePolicy(prev => !prev);
  };

  const renderCompareButton = () => (
    <TouchableOpacity
      style={[
        styles.compareButton,
        {
          bottom: insets.bottom + 50,
        },
      ]}
      onPress={toggleCompareModal}
      activeOpacity={0.8}
    >
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={[theme.colors.linear1, theme.colors.linear2]}
        style={styles.compareGradient}
      >
        <Compare />
      </LinearGradient>
    </TouchableOpacity>
  );

  const applyFilters = data => {
    console.log({
      data: { coPays: '0' },
      reqId: data?.internalRef || internalRef,
    });

    filterHealthQuotes(
      {
        data: { coPays: '0' },
        reqId: data?.internalRef || internalRef,
      },
      {
        onSuccess: res => {
          console.log('res applying filters', res);
          updateHealthQuotesList(res?.data?.data);
          refetch();
          if (showFetchMore === true) {
            setShowFetchMore(false);
          } else {
            setShowFetchMore(true);
          }
        },
        onError: error => {
          console.log('error applying filters', error);
        },
      },
    );
  };

  const handleRegenerate = () => {
    regenerateQuotes(
      {
        refId: regeneratedata?.internalRef,
        healthInfoId: regeneratedata?.healthInfo?._id,
        proposalNo: regeneratedata?.proposal?.proposalId,
        reqId: regeneratedata?.reqId,
      },
      {
        onSuccess: res => {
          console.log('res regenerate', res?.data?.data);
          applyFilters(res?.data?.data);
        },
      },
    );
  };

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 2 }}
      locations={[0.1, 0.2]}
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      style={[styles.container]}
    >
      <Header
        title="Health Insurance List"
        onBack={() => navigation.goBack()}
        home={true}
        onHome={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: SCREEN_NAMES.BOTTOM_TABS }],
          })
        }
      />

      <View style={{ flex: 1 }}>
        <FlatList
          data={arrayOfQuotes}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          bounces={arrayOfQuotes.length > 0}
          contentContainerStyle={{
            flexGrow: 1,
            gap: verticalScale(15),
            // paddingVertical: verticalScale(10),
            paddingBottom: getBottomMargin() + verticalScale(50),
          }}
          ListHeaderComponent={
            <CustomBox
              proposalId={healthQuotesLists?.[0]?.proposalNo}
              onShare={() => setRegenerate(true)}
            />
          }
          renderItem={({ item, index }) =>
            item?.plans?.map((plan, idx) => {
              let match = false;
              let openMemberHintMatch = false;

              const aa = morePlan?.find(i => i?.id === item?.company?._id);
              if (aa?.value) {
                match = true;
              }
              const bb = openMemberHint?.find(i => i?.id === `${index}-${idx}`);
              if (bb?.value) {
                openMemberHintMatch = true;
              }
              if (!match && idx > 0) {
                return null;
              }

              return (
                <HealthPlans
                  key={`${index}-${idx}`}
                  setMorePlansHandler={setMorePlansHandler}
                  openMemberHintMatch={openMemberHintMatch}
                  index={index}
                  idx={idx}
                  match={match}
                  company={item}
                  plan={plan}
                  handleTooltipClose={handleTooltipClose}
                  handleTooltipOpen={handleTooltipOpen}
                  setOpenHint={setOpenHint}
                  navigation={navigation}
                  openHint={openHint}
                  isCompare={comparePolicyArray.some(
                    policy => policy?._id === plan?._id,
                  )}
                  onUpdate={item => {
                    if (
                      comparePolicyArray.length === 4 &&
                      !comparePolicyArray.some(
                        policy => policy?._id === item?._id,
                      )
                    ) {
                      showToast(
                        'You can only compare up to 4 policies.',
                        'error',
                      );
                      return;
                    }
                    setComparePolicyArray(prev =>
                      prev.some(policy => policy?._id === item?._id)
                        ? prev.filter(policy => policy?._id !== item?._id)
                        : [...prev, item],
                    );
                  }}
                />
              );
            })
          }
        />
      </View>

      {renderBottomBar()}
      {renderCompareButton()}

      <HealthComparePlansModal
        showCompareModal={comparePolicy}
        setShowCompareModal={setComparePolicy}
        quotesList={comparePolicyArray}
        onUpdate={item => {
          setComparePolicyArray(prev =>
            prev.filter(policy => policy?._id !== item?._id),
          );
        }}
      />

      {showFetchMore && <HealthFetchMore applyFilters={applyFilters} />}

      <RegenerateQuotes
        internalRef={healthQuotesLists?.[0]?.healthInfo}
        open={regenerate}
        setOpen={setRegenerate}
        handleRegenerate={handleRegenerate}
      />

      <HealthFilterModal
        toggle={toggle}
        open={showFilterModal}
        setOpen={setShowFilterModal}
        filterLists={filterLists}
        refetch={refetch}
      />
    </LinearGradient>
  );
};

export default HealthQuoteScreen;

const style = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    flex: {
      flex: 1,
    },
    listContent: {
      flexGrow: 1,
      gap: verticalScale(15),
      paddingVertical: verticalScale(10),
      paddingBottom: verticalScale(20),
    },
    headerGap: {
      gap: verticalScale(15),
    },
    bottomBar: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    sortButton: {
      height: verticalScale(50),
      flex: 1,
      backgroundColor: theme.colors.backgroundColor,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      gap: verticalScale(10),
    },
    filterButton: {
      flex: 1,
      backgroundColor: theme.colors.floorBgColor,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      gap: verticalScale(10),
    },
    sortText: {
      color: theme.colors.textTertiary,
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
    },
    filterText: {
      color: theme.colors.primary,
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
    },
    compareButton: {
      position: 'absolute',
      alignSelf: 'center',
      height: verticalScale(60),
      width: verticalScale(60),
      zIndex: 1000,
      borderRadius: verticalScale(30),
      borderWidth: 2,
      borderColor: theme.colors.backgroundColor,
      elevation: 10,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      shadowColor: theme.colors.primary,
    },
    compareGradient: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: verticalScale(30),
    },
  });
