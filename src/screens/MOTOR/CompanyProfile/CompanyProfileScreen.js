import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { moderateScale, verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import { useGetCompanyDetails } from '@hooks/company/useCompanyDetails';
import { CustomStarRating } from '@components/ui/CustomStarRating';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CompanyProfileScreen = ({ navigation, route }) => {
  const { theme } = useThemeContext();
  const insets = useSafeAreaInsets();
  const { company_Id } = route?.params || {};
  console.log('company_Id', company_Id);

  const { data: companyData = {}, isLoading } = useGetCompanyDetails({
    id: company_Id,
  });

  if (isLoading) {
    return (
      <View style={styles(theme).loader}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const renderReview = ({ item }) => {
    const reviewLines = item?.text?.split('\n') || [];
    return (
      <View style={styles(theme).reviewBox}>
        <Text style={styles(theme).reviewAuthor}>{item?.author_name}</Text>
        <Text style={styles(theme).reviewTime}>
          {item?.relative_time_description}
        </Text>

        <CustomStarRating
          rating={item?.rating || 0}
          readOnly
          size={18}
          containerStyle={{ marginTop: 4, marginBottom: 6 }}
        />

        {reviewLines.map((line, idx) => (
          <Text key={idx} style={styles(theme).reviewText}>
            {line}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <>
      <TouchableOpacity
        style={[styles(theme).backBtn, { marginTop: insets.top + 10 }]}
        activeOpacity={0.8}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color={theme.colors.primary} />
      </TouchableOpacity>

      <ScrollView bounces={false} style={styles(theme).container}>
        <Image
          source={{
            uri: `https://api.dev.esanad.com/${companyData?.bannerImg?.path}`,
          }}
          style={styles(theme).banner}
          resizeMode="stretch"
        />

        <View
          style={[
            styles(theme).card,
            { flexDirection: 'row', marginTop: -verticalScale(50) },
          ]}
        >
          <Image
            source={{
              uri: `https://api.dev.esanad.com/${companyData?.logoImg?.path}`,
            }}
            style={styles(theme).logo}
            resizeMode="contain"
          />
          <View style={styles(theme).infoBlock}>
            <Text style={styles(theme).companyName}>
              {companyData?.companyName}
            </Text>

            <View style={styles(theme).row}>
              <Text style={styles(theme).label}>Headquarters:</Text>
              <Text style={styles(theme).value}>
                {companyData?.headquarters}
              </Text>
            </View>

            <View style={styles(theme).row}>
              <Text style={styles(theme).label}>Year started:</Text>
              <Text style={styles(theme).value}>
                {companyData?.startedYear}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles(theme).card}>
          <Text style={styles(theme).companyName}>
            {companyData?.companyName}
          </Text>
          {companyData?.dec && (
            <Text style={styles(theme).desc}>
              {companyData?.dec.replace(/<[^>]+>/g, '')}
            </Text>
          )}
        </View>

        <View style={styles(theme).card}>
          <View style={styles(theme).ratingHeader}>
            <View style={styles(theme).ratingRow}>
              <Text
                style={{
                  color: theme.colors.description,
                  fontSize: moderateScale(18),
                  marginRight: 8,
                  fontWeight: '600',
                }}
              >
                On
              </Text>
              <Image
                source={require('../../../assets/images/common/google-name.png')}
                style={{
                  width: verticalScale(100),
                  height: verticalScale(50),
                  borderRadius: 8,
                }}
                resizeMode="cover"
              />
            </View>
            <View style={styles(theme).ratingRow}>
              <Text style={styles(theme).label}>Overall rating:</Text>
              <CustomStarRating
                rating={companyData?.googleRating || 0}
                readOnly
                size={20}
                step={0.5}
                containerStyle={{ marginLeft: 6 }}
              />
              <Text style={styles(theme).ratingValue}>
                {companyData?.googleRating}
              </Text>
            </View>
          </View>

          <Text style={styles(theme).subTitle}>Latest reviews</Text>

          <FlatList
            data={companyData?.googleReviews || []}
            renderItem={renderReview}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
            contentContainerStyle={{ gap: verticalScale(5) }}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default CompanyProfileScreen;

const styles = theme =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.backgroundColor },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    banner: { width: '100%', height: verticalScale(350) },
    backBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: verticalScale(16),
      position: 'absolute',
      zIndex: 1,
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: verticalScale(8),
      padding: verticalScale(12),
    },
    card: {
      backgroundColor: theme.colors.backgroundColor,
      marginHorizontal: verticalScale(16),
      marginVertical: verticalScale(8),
      borderRadius: verticalScale(12),
      padding: verticalScale(16),
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    logo: {
      width: verticalScale(100),
      height: verticalScale(100),
      borderRadius: 8,
    },
    infoBlock: { marginLeft: 16, flex: 1 },
    companyName: {
      fontSize: moderateScale(18),
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 8,
    },
    row: { flexDirection: 'row', marginBottom: 4 },
    label: {
      color: theme.colors.description,
      fontSize: moderateScale(14),
      marginRight: 8,
    },
    value: {
      fontSize: moderateScale(14),
      fontWeight: '500',
      color: theme.colors.text,
    },
    desc: {
      color: theme.colors.description,
      fontSize: moderateScale(14),
      marginTop: 8,
      lineHeight: 20,
    },
    ratingHeader: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      paddingBottom: verticalScale(12),
      marginBottom: verticalScale(12),
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    ratingValue: {
      fontSize: moderateScale(14),
      fontWeight: '600',
      color: theme.colors.primary,
      marginLeft: 4,
    },
    subTitle: {
      fontSize: moderateScale(16),
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 8,
    },
    reviewBox: {
      marginBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      paddingBottom: 16,
    },
    reviewAuthor: {
      fontSize: moderateScale(15),
      fontWeight: '600',
      color: theme.colors.text,
    },
    reviewTime: {
      fontSize: moderateScale(12),
      color: theme.colors.description,
      fontStyle: 'italic',
      marginTop: 2,
    },
    reviewText: {
      fontSize: moderateScale(14),
      color: theme.colors.text,
      marginTop: 4,
    },
  });
