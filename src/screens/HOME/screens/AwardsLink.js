import React from 'react';
import { FlatList, StyleSheet, Text, View, Image } from 'react-native';
import Header from '@components/ui/Header';
import { useThemeContext } from '@theme/ThemeProvider';
import { verticalScale } from '@constants/metrics';
import LinearGradient from 'react-native-linear-gradient';
import { Awards } from '@assets/index';
import { getBottomMargin } from '@utils/paddingBottom';

const AWARDS = [
  {
    image: Awards.Award1,
    description:
      'Insurance Authority Company Award Digital Transformation and Smart Services (2018) Recognized for pioneering digital initiatives that modernized insurance services in the UAE. This award highlighted our commitment to innovation and improving customer experience through smart technologies.',
  },
  {
    image: Awards.Award2,
    description:
      'InsureTek Insurance Technology Leader of the Year (2018 & 2019) Acknowledged for leading eSanad’s digital transformation journey, setting benchmarks for the industry. Winning this award two consecutive years reinforced our role as a front-runner in insurtech innovation',
  },
  {
    image: Awards.Award3,
    description:
      'Insurance Authority Company Award Digital Transformation and Smart Services (2019)Awarded for our continued excellence in digitalization, reinforcing our position as a trusted technology leader in the insurance sector. This recognition reflected our ongoing investment in smart, customer centric solutions.',
  },
  {
    image: Awards.Award4,
    description:
      'InsureTek Middle East & Golden Shield Motor Insurance Company of the Year (2018)Honored for excellence in motor insurance by delivering innovative and customer-focused solutions. This award demonstrated our ability to adapt and lead in one of the most competitive insurance segments.',
  },
  {
    image: Awards.Award5,
    description:
      ' Leadership Excellence Award in Technology Innovation GCC Best Employer Brand Awards (2019)Celebrated for driving innovation and transforming the industry through cutting-edge technology. This recognition highlighted eSanad’ s legacy of innovation and leadership in the GCC region.',
  },
  {
    image: Awards.Award6,
    description:
      'Established the First AI-powered Digital Insurance marketplace in the region. eSanad simplifies insurance for individuals and businesses, setting new standards of efficiency and transparency in the industry. Founder & CEO of eSanad',
  },
  {
    image: Awards.Award7,
    description:
      ' White Page Leadership Conclave Global Inspirational Leaders (2023)Selected among 200 leaders across Asia and EMEA for outstanding contributions to organizational growth. This recognition reflects visionary leadership and commitment to shaping the future of digital insurance.',
  },
  {
    image: Awards.Award8,
    description:
      'Digital Insurance Broker of the Year 9th InsureTek Golden Shield AwardsRecognized for transforming the insurance marketplace with innovative solutions and superior service delivery. This award validated eSanad’s role in redefining broker services through technology',
  },
  {
    image: Awards.Award9,
    description:
      ' Insurtech Leader of the Year Finnovex Middle East Summit (2024)Awarded for driving digital excellence and shaping the future of insurtech in the region. This recognition underlines eSanad’s leadership in delivering impactful, customer-first digital solutions',
  },
  {
    image: Awards.Award10,
    description:
      ' GAIP–InsureTek Golden Shield Excellence Awards (2025) Excellence in InnovationCelebrated for breakthrough contributions in digital transformation and innovation within the insurance sector. This recognition highlighted our role in setting new benchmarks for customer experience and industry advancement.',
  },
  {
    image: Awards.Award11,
    description:
      ' Leadership Impact Award Westford Awards (2025)Honored for impactful leadership and organizational excellence on a global platform. This award reflected our commitment to meaningful change, innovation, and creating long-term industry impact.',
  },
  {
    image: Awards.Award12,
    description:
      ' Iminclusive Rising Star of Inclusion, Recognized for advancing diversity and inclusion in the workplace. This award highlighted our efforts to foster an inclusive culture that empowers employees and enhances collaboration.',
  },
  {
    image: Awards.Award13,
    description:
      ' Employee Happiness Awards UAE (2025) Best Use of Technology to Engage EmployeesAcknowledged for leveraging digital tools to enhance employee satisfaction and workplace engagement. This award reflects our dedication to building a positive and tech-enabled organizational culture.',
  },
];

const AwardsLink = ({ navigation }) => {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <View style={styles.imageWrapper}>
        <Image
          resizeMode="contain"
          source={item.image}
          style={styles.awardImage}
        />
      </View>
      <Text style={styles.descriptionText}>{item.description}</Text>
    </View>
  );

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 2 }}
      locations={[0.1, 0.2]}
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      style={styles.mainContainer}
    >
      <Header title="Awards & Recognitions" navigation={navigation} />
      <FlatList
        data={AWARDS}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
    },
    listContent: {
      paddingHorizontal: verticalScale(15),
      paddingTop: verticalScale(20),
      paddingBottom: getBottomMargin(),
      gap: verticalScale(15),
    },
    cardContainer: {
      backgroundColor: theme.colors.backgroundColor,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: verticalScale(15),
      padding: verticalScale(15),
    },
    imageWrapper: {
      width: '100%',
      height: verticalScale(240),
      marginBottom: verticalScale(10),
    },
    awardImage: {
      width: '100%',
      height: '100%',
    },
    descriptionText: {
      fontSize: verticalScale(13),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textTertiary,
      lineHeight: verticalScale(20),
      textAlign: 'center',
    },
  });

export default AwardsLink;
