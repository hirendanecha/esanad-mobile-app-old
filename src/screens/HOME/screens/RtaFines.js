import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native';
import Header from '@components/ui/Header';
import { useThemeContext } from '@theme/ThemeProvider';
import { verticalScale, moderateScale } from '@constants/metrics';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CustomAccordion } from '@components/ui/CustomAccordion';

// Icons from assets
import CalIcon from '@assets/NEWICONS/LINKS/Cal';

const RtaFines = ({ navigation }) => {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);

  const SECTIONS = [
    {
      title: 'Useful Links',
      subtitle: 'Essential vehicle & road safety shortcuts',
      icon: <CalIcon width={moderateScale(22)} height={moderateScale(22)} />,
      data: [
        {
          title: 'Car Report',
          description: 'Get a detailed car history report in the UAE.',
          path: 'https://carreport.com/AE',
        },
        {
          title: 'Abu Dhabi Accident',
          description: 'Report or check traffic accidents in Abu Dhabi.',
          path: 'https://evg.ae/_layouts/evg/trafficaccidents.aspx?language=en',
        },
        {
          title: 'Traffic Fines',
          description: 'Check and pay traffic fines across all emirates.',
          subItems: [
            {
              title: 'Abu Dhabi',
              path: 'https://u.ae/en/information-and-services/justice-safety-and-the-law/road-safety/fines',
            },
            {
              title: 'Dubai',
              path: 'https://ums.rta.ae/violations/public-fines/fines-search',
            },
            {
              title: 'Sharjah',
              path: 'https://portal.shjmun.gov.ae/en/eservices/pages/Services.aspx?sercatid=133',
            },
            {
              title: 'Ajman',
              path: 'https://www.ajman.ae/en/happiness-bundle/services/most-used-services/payment-traffic-fines',
            },
            { title: 'Umm Al Quwain', path: 'https://uaqpolice.gov.ae/' },
            {
              title: 'Ras Al Khaimah',
              path: 'https://www.rak.ae/wps/portal/rak/e-services/govt/rakpolice/pay-traffic-fines-guide',
            },
            {
              title: 'Fujairah',
              path: 'https://eservice.fujairahpolice.gov.ae/',
            },
          ],
        },
      ],
    },
  ];

  const handlePress = item => {
    if (item.subItems) return;

    if (item.path && item.path.startsWith('http')) {
      Linking.openURL(item.path);
    } else if (item.screen) {
      navigation.navigate(item.screen);
    }
  };

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.2 }}
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      style={styles.mainContainer}
    >
      <Header title="RTA Fines" navigation={navigation} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {SECTIONS.map((section, sIdx) => (
          <View key={sIdx} style={styles.sectionContainer}>
            {/* Section Header */}
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconWrapper}>{section.icon}</View>
              <View style={styles.sectionTitleWrapper}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
              </View>
            </View>

            {/* Section Items */}
            <View style={styles.itemsWrapper}>
              {section.data.map((item, iIdx) => (
                <CustomAccordion
                  key={iIdx}
                  title={item.title}
                  containerStyle={styles.accordionContainer}
                >
                  <View style={styles.accordionDetails}>
                    <View style={styles.descriptionContainer}>
                      <Text style={styles.itemDescription}>
                        {item.description}
                      </Text>

                      {!item.subItems && (
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => handlePress(item)}
                          style={styles.actionBtn}
                        >
                          <Text style={styles.actionText}>
                            {item.screen ? 'Open Tool' : 'Go to Service'}
                          </Text>
                          <Icon
                            name="arrow-forward"
                            size={14}
                            color={theme.colors.primary}
                          />
                        </TouchableOpacity>
                      )}
                    </View>

                    {item.subItems && (
                      <View style={styles.subItemsList}>
                        <Text style={styles.subItemsHeader}>Emirates:</Text>
                        <View style={styles.emirateGrid}>
                          {item.subItems.map((sub, subIdx) => (
                            <TouchableOpacity
                              key={subIdx}
                              style={styles.emirateChip}
                              activeOpacity={0.6}
                              onPress={() => Linking.openURL(sub.path)}
                            >
                              <Text style={styles.emirateText}>
                                {sub.title}
                              </Text>
                              <Icon
                                name="north-east"
                                size={12}
                                color={theme.colors.primary}
                              />
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                </CustomAccordion>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
    },
    scrollContent: {
      padding: moderateScale(20),
      paddingBottom: verticalScale(40),
      gap: verticalScale(25),
    },
    sectionContainer: {
      gap: verticalScale(15),
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: moderateScale(12),
    },
    sectionIconWrapper: {
      width: moderateScale(40),
      height: moderateScale(40),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: moderateScale(10),
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    sectionTitleWrapper: {
      flex: 1,
    },
    sectionTitle: {
      fontSize: moderateScale(18),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    sectionSubtitle: {
      fontSize: moderateScale(12),
      fontFamily: 'Lato-Regular',
      color: theme.colors.description,
    },
    itemsWrapper: {
      gap: verticalScale(10),
    },
    accordionContainer: {
      borderRadius: moderateScale(10),
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.backgroundColor,
    },
    accordionDetails: {
      padding: moderateScale(15),
      paddingTop: 0,
    },
    descriptionContainer: {
      gap: verticalScale(10),
    },
    itemDescription: {
      fontSize: moderateScale(13),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textTertiary,
      lineHeight: moderateScale(18),
    },
    actionBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: 5,
      paddingVertical: 5,
    },
    actionText: {
      fontSize: moderateScale(12),
      fontFamily: 'Lato-Bold',
      color: theme.colors.primary,
    },
    subItemsList: {
      marginTop: verticalScale(15),
      borderTopWidth: 1,
      borderTopColor: theme.colors.border + '50',
      paddingTop: verticalScale(10),
    },
    subItemsHeader: {
      fontSize: moderateScale(12),
      fontFamily: 'Lato-Bold',
      color: theme.colors.description,
      marginBottom: verticalScale(8),
    },
    emirateGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    emirateChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: theme.colors.bgSecondary,
      borderRadius: 20,
    },
    emirateText: {
      fontSize: moderateScale(12),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
  });

export default RtaFines;
