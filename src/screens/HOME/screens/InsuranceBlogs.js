import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '@components/ui/Header';
import { moderateScale, verticalScale } from '@constants/metrics';
import { useGetBlog } from '@hooks/home/useHomeFlow';
import { useThemeContext } from '@theme/ThemeProvider';
import { getBottomMargin } from '@utils/paddingBottom';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const InsuranceBlogs = () => {
  const navigation = useNavigation();
  const { theme } = useThemeContext();
  const styles = useStyles(theme);

  const { data: blogsResponse, isLoading } = useGetBlog();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const blogs = blogsResponse?.data ?? [];

  const filteredBlogs = useMemo(() => {
    return blogs.filter(blog => blog?.platform !== 'insurancetimes');
  }, [blogs]);

  const handleBlogPress = blog => {
    navigation.navigate('BlogDetails', { blog });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => handleBlogPress(item)}
    >
      <View style={styles.imageContainer}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {item?.blogType === 'news' ? 'News' : 'Article'}
          </Text>
        </View>
        <Image
          source={{ uri: item?.heroImage?.url }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.textContent}>
        <View style={styles.dateContainer}>
          <Icon
            name="calendar-month"
            size={verticalScale(18)}
            color={theme.colors.description}
          />
          <Text style={styles.dateText}>
            {new Date(item?.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <Text style={styles.blogTitle} numberOfLines={2}>
          {item?.title}
        </Text>
        <Text style={styles.blogDescription} numberOfLines={2}>
          {item?.meta?.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      style={{ flex: 1 }}
    >
      <Header title="Insurance Blogs" onBack={() => navigation.goBack()} />
      <FlatList
        data={filteredBlogs}
        renderItem={renderItem}
        keyExtractor={item => item._id || item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isLoading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No blogs found at the moment.
              </Text>
            </View>
          )
        }
      />
    </LinearGradient>
  );
};

export default InsuranceBlogs;

const useStyles = theme =>
  StyleSheet.create({
    listContainer: {
      paddingBottom: getBottomMargin(),
      paddingTop: verticalScale(20),
      gap: verticalScale(15),
    },
    card: {
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: verticalScale(25),
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginHorizontal: verticalScale(20),
      overflow: 'hidden',
    },
    imageContainer: {
      height: moderateScale(200),
    },
    image: {
      width: '100%',
      height: '100%',
    },
    badge: {
      position: 'absolute',
      top: moderateScale(15),
      right: moderateScale(15),
      zIndex: 2,
      backgroundColor: theme.colors.primary,
      paddingHorizontal: moderateScale(12),
      paddingVertical: moderateScale(6),
      borderRadius: moderateScale(20),
    },
    badgeText: {
      fontSize: moderateScale(12),
      fontFamily: 'Lato-Bold',
      color: theme.colors.backgroundColor,
    },
    textContent: {
      paddingHorizontal: verticalScale(20),
      paddingVertical: verticalScale(15),
      gap: verticalScale(8),
    },
    blogTitle: {
      fontSize: moderateScale(18),
      fontFamily: 'Lato-Bold',
      color: theme.colors.primary,
      lineHeight: moderateScale(26),
    },
    blogDescription: {
      fontSize: moderateScale(14),
      fontFamily: 'Lato-Regular',
      color: theme.colors.description,
      lineHeight: moderateScale(20),
    },
    dateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: moderateScale(6),
    },
    dateText: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Regular',
      color: theme.colors.description,
    },
    emptyContainer: {
      marginTop: verticalScale(100),
      alignItems: 'center',
    },
    emptyText: {
      fontSize: moderateScale(16),
      fontFamily: 'Lato-Regular',
      color: theme.colors.description,
    },
  });
