import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Dimensions,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import Header from '@components/ui/Header';
import CustomSearchInput from '@components/ui/CustomSearchInput';
import { moderateScale, verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import Whatsapp from '@assets/icons/Whatsapp';
import Email from '@assets/icons/Email';
import Location from '@assets/icons/Location';
import Headphones from '@assets/icons/Headphones';
import { useGetFaq } from '@hooks/profile/useProfile';
import LinearGradient from 'react-native-linear-gradient';
import { SCREEN_NAMES } from '@constants/screenNames';

const HelpAndSupport = ({ navigation }) => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useThemeContext();
  const styles = style(theme);

  const { data: faqs = [] } = useGetFaq();

  const handleLink = async (url, type) => {
    try {
      await Linking.openURL(url);
      console.log(`Opening URL: ${url}`);
    } catch (err) {
      console.warn('Linking error:', err);
    }
  };

  const supportOptions = [
    {
      id: 1,
      icon: <Whatsapp />,
      title: 'Get\nConnect',
      onPress: () =>
        handleLink(
          'https://api.whatsapp.com/send/?phone=971600500888&text&type=phone_number&app_absent=0',
        ),
    },
    {
      id: 2,
      icon: <Headphones />,
      title: 'Call\nSupport',
      onPress: () => handleLink('tel:+971600500888'),
    },
    {
      id: 3,
      icon: <Email />,
      title: 'Email\nSupport',
      onPress: () => handleLink('mailto:hello@esanad.com'),
    },
    {
      id: 4,
      icon: <Location />,
      title: 'Office\nLocation',
      onPress: () =>
        handleLink(
          'https://maps.app.goo.gl/ubZKnA9UNBYQWTCcA?g_st=com.skype.skype.sharingextension',
        ),
    },
  ];

  const toggleFAQ = id => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  // Memoized filtered FAQs with proper search functionality
  const filteredFAQs = useMemo(() => {
    if (!searchQuery.trim()) {
      return faqs.slice(0, 5); // Show only first 5 when no search
    }

    // Filter based on search query
    return faqs.slice(0, 5).filter(faq => {
      const searchLower = searchQuery.toLowerCase().trim();
      const questionMatch = faq.question?.toLowerCase().includes(searchLower);
      const answerMatch = faq.answer?.toLowerCase().includes(searchLower);
      return questionMatch || answerMatch;
    });
  }, [faqs, searchQuery]);

  const AnimatedFAQItem = ({ faq, isExpanded, onToggle }) => {
    const animatedHeight = useSharedValue(0);
    const rotation = useSharedValue(0);

    React.useEffect(() => {
      animatedHeight.value = withTiming(isExpanded ? 1 : 0, {
        duration: 500,
      });
      rotation.value = withTiming(isExpanded ? 1 : 0, {
        duration: 500,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isExpanded]);

    const heightStyle = useAnimatedStyle(() => {
      const maxHeight = interpolate(animatedHeight.value, [0, 1], [0, 200]);
      return {
        maxHeight,
        opacity: animatedHeight.value,
      };
    });

    const rotationStyle = useAnimatedStyle(() => {
      const rotate = interpolate(rotation.value, [0, 1], [0, 180]);
      return {
        transform: [{ rotate: `${rotate}deg` }],
      };
    });

    return (
      <View style={styles.faqItem}>
        <TouchableOpacity
          style={styles.faqQuestion}
          onPress={onToggle}
          activeOpacity={0.8}
        >
          <Text style={styles.faqQuestionText}>{faq.question}</Text>
          <Animated.View style={rotationStyle}>
            <Icon name="chevron-down" size={24} color={theme.colors.text} />
          </Animated.View>
        </TouchableOpacity>

        <Animated.View style={[styles.faqAnswerContainer, heightStyle]}>
          <View style={styles.faqAnswer}>
            <Text style={styles.faqAnswerText}>{faq.answer}</Text>
          </View>
        </Animated.View>
      </View>
    );
  };

  const renderSupportOption = item => (
    <TouchableOpacity
      key={item.id}
      style={styles.optionCard}
      onPress={item.onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>{item.icon}</View>
      <Text style={styles.optionTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderFAQItem = ({ item, index }) => (
    <AnimatedFAQItem
      faq={item}
      isExpanded={expandedFAQ === index}
      onToggle={() => toggleFAQ(index)}
    />
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon name="search" size={48} color={theme.colors.description} />
      <Text style={styles.emptyText}>No FAQs found</Text>
      <Text style={styles.emptySubText}>
        Try searching with different keywords
      </Text>
    </View>
  );

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 2 }}
      locations={[0.1, 0.2]}
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      style={styles.container}
    >
      <Header onBack={() => navigation.goBack()} title="Help and Support" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          padding: verticalScale(20),
        }}
      >
        <CustomSearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          title="Search insurance topics..."
        />
        <View style={styles.supportOptionsContainer}>
          {supportOptions.map(renderSupportOption)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FAQs</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate(SCREEN_NAMES.FAQ_SCREEN)}
            activeOpacity={0.8}
          >
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.faqContainer}>
          <FlatList
            data={filteredFAQs.slice(0, 5)}
            renderItem={renderFAQItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            ListEmptyComponent={renderEmptyComponent}
            contentContainerStyle={{
              flexGrow: 1,
            }}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const style = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    section: {
      marginTop: verticalScale(30),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: verticalScale(15),
    },
    sectionTitle: {
      fontSize: verticalScale(24),
      fontFamily: 'Lato-Black',
      color: theme.colors.text,
    },
    supportOptionsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: verticalScale(15),
      marginTop: verticalScale(20),
    },
    optionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.backgroundColor,
      padding: verticalScale(15),
      borderRadius: moderateScale(12),
      gap: verticalScale(12),
      width: (Dimensions.get('screen').width - 55) / 2,
    },
    iconContainer: {
      width: verticalScale(50),
      height: verticalScale(50),
      borderRadius: moderateScale(25),
      backgroundColor: theme.colors.bgSecondary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    optionTitle: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    faqContainer: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: verticalScale(15),
      overflow: 'hidden',
    },
    viewAllText: {
      fontSize: moderateScale(16),
      fontFamily: 'Lato-Black',
      color: theme.colors.primary,
      textDecorationLine: 'underline',
    },
    faqItem: {
      borderTopWidth: 0.5,
      borderBottomWidth: 0.5,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.bgSecondary,
    },
    faqQuestion: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: verticalScale(15),
      paddingVertical: verticalScale(15),
    },
    faqQuestionText: {
      fontSize: moderateScale(16),
      color: theme.colors.text,
      fontFamily: 'Lato-Bold',
      flex: 1,
    },
    faqAnswerContainer: {
      overflow: 'hidden',
    },
    faqAnswer: {
      paddingHorizontal: verticalScale(14),
      paddingBottom: verticalScale(16),
    },
    faqAnswerText: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Regular',
      color: theme.colors.description,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: verticalScale(40),
    },
    emptyText: {
      fontSize: moderateScale(18),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
      marginTop: verticalScale(16),
    },
    emptySubText: {
      fontSize: moderateScale(14),
      fontFamily: 'Lato-Regular',
      color: theme.colors.description,
      marginTop: verticalScale(8),
    },
  });

export default HelpAndSupport;
