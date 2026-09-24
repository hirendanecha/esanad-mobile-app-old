import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/Ionicons';
import { useThemeContext } from '@theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Images } from '@assets/index';
import CustomButton from '@components/ui/CustomButton';
import { useAuthStore } from '@store/authStore';
import { SCREEN_NAMES } from '@constants/screenNames';
import { getStyles } from './OnboardingScreen.styles';

const { width: screenWidth } = Dimensions.get('screen');

const onboardingData = [
  {
    id: 1,
    title: 'Welcome To The eSanad',
    description: 'Your all in one insurance manager.',
    image: Images.onBoard0,
  },
  {
    id: 2,
    title: 'One Tap - Full Protected',
    description:
      'An innovation insurance app offering instant policy insurance, secure online payments, and real time notification',
    image: Images.onBoard1,
  },
];

const OnboardingScreen = ({ navigation }) => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);

  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef(null);
  const { setOnBoarded } = useAuthStore();
  const insets = useSafeAreaInsets();

  const renderItem = ({ item, index }) => (
    <View style={styles.slide}>
      <Image source={Images.Logo} resizeMode="contain" style={styles.logo} />

      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>

      <View style={styles.imageWrapper}>
        <Image source={item.image} resizeMode="contain" style={styles.image} />
      </View>
    </View>
  );

  const goToLogin = () => {
    setOnBoarded(true);
    navigation.replace(SCREEN_NAMES.LOGIN_SCREEN);
  };

  const handleNext = () => {
    if (activeSlide < onboardingData.length - 1) {
      carouselRef.current?.snapToNext();
      setActiveSlide(prev => prev + 1);
    } else {
      goToLogin();
    }
  };

  const handlePrevious = () => {
    if (activeSlide > 0) {
      carouselRef.current?.snapToPrev();
      setActiveSlide(prev => prev - 1);
    }
  };

  return (
    <View style={[styles.container]}>
      <ImageBackground
        source={Images.circleBg}
        resizeMode="contain"
        style={styles.bgImage}
      />

      <TouchableOpacity
        style={[
          styles.backButton,
          { opacity: activeSlide > 0 ? 1 : 0, top: insets.top },
        ]}
        onPress={handlePrevious}
        disabled={activeSlide === 0}
        activeOpacity={0.8}
      >
        <Icon name="chevron-back" size={25} color={theme.colors.text} />
      </TouchableOpacity>

      <Carousel
        ref={carouselRef}
        data={onboardingData}
        renderItem={renderItem}
        sliderWidth={screenWidth}
        itemWidth={screenWidth}
        onSnapToItem={setActiveSlide}
        enableMomentum={false}
        lockScrollWhileSnapping
        inactiveSlideScale={0.95}
        inactiveSlideOpacity={0}
      />

      <View style={styles.bottomButtonsRow}>
        {activeSlide < onboardingData.length - 1 && (
          <CustomButton
            type="secondary"
            title="Skip"
            onPress={goToLogin}
            isShowIcon
            buttonStyle={[styles.ctaButton, { width: screenWidth / 2 - 55 }]}
          />
        )}

        <CustomButton
          title={
            activeSlide < onboardingData.length - 1 ? 'Next' : 'Get Started'
          }
          onPress={handleNext}
          isShowIcon
          buttonStyle={[
            styles.ctaButton,
            { width: activeSlide < 1 ? screenWidth / 2 : screenWidth - 40 },
          ]}
        />
      </View>

      <View style={styles.paginationContainer}>
        <Pagination
          dotsLength={onboardingData.length}
          activeDotIndex={activeSlide}
          dotStyle={styles.dot}
          inactiveDotStyle={styles.inactiveDot}
          inactiveDotOpacity={1}
          inactiveDotScale={0.9}
          inactiveDotColor={theme.colors.inactivePage}
          dotContainerStyle={styles.dotContainer}
        />
      </View>
    </View>
  );
};

export default OnboardingScreen;
