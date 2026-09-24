import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useGetAllCarInsuranceCompanies } from '@hooks/company/useCompanyDetails';
import Header from '@components/ui/Header';
import { useThemeContext } from '@theme/ThemeProvider';
import { verticalScale, moderateScale } from '@constants/metrics';
import LinearGradient from 'react-native-linear-gradient';
import { SCREEN_NAMES } from '@constants/screenNames';
import { env } from '@config/index';
import { getBottomMargin } from '@utils/paddingBottom';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - moderateScale(45)) / 2;

const InsurancePartners = ({ navigation }) => {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);

  const { data: partners = [], isLoading: loading } =
    useGetAllCarInsuranceCompanies();

  const renderItem = ({ item }) => {
    const imageUrl = item.logoImg?.path
      ? `${env.API_URL}${item.logoImg.path}`
      : null;

    return (
      <TouchableOpacity
        style={styles.partnerCard}
        onPress={() =>
          Linking.openURL(
            `https://dev.esanad.com/insurance-partners/${item._id}`,
          )
        }
        activeOpacity={0.8}
      >
        <View style={styles.imageWrapper}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.logoImage}
              resizeMode="contain"
            />
          ) : (
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: '#E5E7EB',
                borderRadius: 20,
              }}
            />
          )}
        </View>
        <Text style={styles.partnerName} numberOfLines={2}>
          {item.companyName}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.1 }}
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      style={styles.mainContainer}
    >
      <Header title="Insurance Partners" navigation={navigation} />
      <View style={styles.contentContainer}>
        <FlatList
          data={partners}
          renderItem={renderItem}
          keyExtractor={(item, index) => item._id || index.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
        />
      </View>
    </LinearGradient>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: moderateScale(15),
    },
    titleContainer: {
      alignItems: 'center',
      marginVertical: verticalScale(25),
      gap: verticalScale(5),
    },
    headerTitle: {
      fontSize: moderateScale(24),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
      textAlign: 'center',
    },
    underline: {
      width: moderateScale(50),
      height: 3,
      backgroundColor: theme.colors.primary,
      borderRadius: 2,
    },
    listContent: {
      paddingVertical: verticalScale(20),
      paddingBottom: getBottomMargin(),
    },
    columnWrapper: {
      justifyContent: 'space-between',
      marginBottom: verticalScale(15),
    },
    partnerCard: {
      width: ITEM_WIDTH,
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: moderateScale(16),
      padding: moderateScale(15),
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    imageWrapper: {
      width: '100%',
      height: moderateScale(70),
      backgroundColor: theme.colors.backgroundColor,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: verticalScale(8),
    },
    logoImage: {
      width: '100%',
      height: '100%',
    },
    partnerName: {
      fontSize: moderateScale(13),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
      textAlign: 'center',
    },
  });

export default InsurancePartners;
