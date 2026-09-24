import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Dimensions,
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
import { useGetFaq } from '@hooks/profile/useProfile';
import LinearGradient from 'react-native-linear-gradient';

const FaqsScreen = ({ navigation }) => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useThemeContext();
  const styles = style(theme);

  const { data: faqs = [] } = useGetFaq();

  const toggleFAQ = id => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const filteredFAQs = useMemo(() => {
    if (!searchQuery.trim()) {
      return faqs;
    }

    return faqs.filter(faq => {
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
      <Header onBack={() => navigation.goBack()} title="FAQs" />

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

        <View style={styles.faqContainer}>
          <FlatList
            data={filteredFAQs}
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
      marginTop: verticalScale(20),
      overflow: 'hidden',
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

export default FaqsScreen;
