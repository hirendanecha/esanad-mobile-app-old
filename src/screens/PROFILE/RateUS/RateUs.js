import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomButton from '@components/ui/CustomButton';
import FloatingLabelInput from '@components/ui/FloatingLabelInput';
import Header from '@components/ui/Header';
import LinearGradient from 'react-native-linear-gradient';
import StarRating from 'react-native-star-rating-widget';
import { getBottomMargin } from '@utils/paddingBottom';

const RateUs = ({ navigation }) => {
  const { theme } = useThemeContext();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);

  const [rating, setRating] = useState(0);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const features = [
    'Fast Scanning',
    'Easy UI',
    'Privacy',
    'Support',
    'Detailed Reports',
    'Frequent Updates',
  ];

  const toggleFeature = feature => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    // Add your submit logic here
    setTimeout(() => {
      setIsLoading(false);
      // navigation.goBack();
    }, 2000);
  };

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 2 }}
      locations={[0.1, 0.2]}
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      style={[styles.container]}
    >
      <Header title="Rate Us" navigation={navigation} />

      <View style={styles.content}>
        <View style={{ padding: verticalScale(20), gap: verticalScale(20) }}>
          {/* Emoji Header */}
          <Text style={styles.headerText}>Enjoy the app Experience 😊</Text>

          {/* Star Rating */}
          <View style={styles.starsContainer}>
            <StarRating
              rating={rating}
              onChange={setRating}
              starSize={verticalScale(40)}
              color="#FFB800"
              emptyColor={theme.colors.textTertiary}
              starStyle={styles.starIcon}
              enableHalfStar={false}
            />
          </View>

          {/* Rating Description */}
          <Text style={styles.ratingDescription}>
            Give Rating 1 - 5 Star. 1 is Disappointed and 5 is Satisfied
          </Text>
        </View>

        {/* Features Section */}
        <View style={{ padding: verticalScale(20), gap: verticalScale(15) }}>
          <Text style={styles.sectionTitle}>
            What Do You Like From This App 😍
          </Text>

          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => toggleFeature(feature)}
                activeOpacity={0.8}
                style={[
                  styles.featureChip,
                  selectedFeatures.includes(feature) &&
                    styles.featureChipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.featureText,
                    selectedFeatures.includes(feature) &&
                      styles.featureTextSelected,
                  ]}
                >
                  {feature}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ padding: verticalScale(20), gap: verticalScale(15) }}>
          {/* Feedback Section */}
          <Text style={styles.sectionTitle}>Tell Us About This App</Text>

          <FloatingLabelInput
            label="Tell us something..."
            value={feedback}
            onChangeText={setFeedback}
            numberOfLines={5}
            maxLength={1000}
            customStyle={styles.textInput}
          />
        </View>

        <CustomButton
          title="Submit"
          onPress={handleSubmit}
          disabled={rating === 0}
          isShowIcon={true}
          buttonStyle={{
            height: verticalScale(50),
            width: '70%',
            alignSelf: 'center',
            marginTop: 'auto',
            marginBottom: getBottomMargin(),
          }}
        />
      </View>
    </LinearGradient>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
    },
    headerText: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.textTertiary,
      textAlign: 'center',
    },
    starsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    starIcon: {
      marginHorizontal: verticalScale(2),
    },
    ratingDescription: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textTertiary,
      textAlign: 'center',
    },
    sectionTitle: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.textTertiary,
      textAlign: 'center',
    },
    featuresContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: verticalScale(10),
    },
    featureChip: {
      paddingHorizontal: verticalScale(10),
      paddingVertical: verticalScale(10),
      borderRadius: verticalScale(20),
      backgroundColor: theme.colors.bgSecondary,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    featureChipSelected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    featureText: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textTertiary,
    },
    featureTextSelected: {
      color: theme.colors.textSecondary,
      fontFamily: 'Lato-Regular',
    },
    textInput: {
      textAlignVertical: 'top',
    },
    characterCount: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textTertiary,
      textAlign: 'right',
      marginTop: verticalScale(5),
      marginRight: verticalScale(5),
    },
    buttonContainer: {},
  });

export default RateUs;
