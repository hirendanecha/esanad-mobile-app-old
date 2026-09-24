import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useThemeContext } from '@theme/ThemeProvider';
import { verticalScale } from '@constants/metrics';
import Header from '@components/ui/Header';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import NoData from '@components/ui/NoData';

const NotificationScreen = () => {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);
  const navigation = useNavigation();

  const [notifications, setNotifications] = useState([]);

  const renderNotificationItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.notificationCard, item.isUnread && styles.unreadCard]}
        activeOpacity={0.7}
      >
        <View style={styles.contentRow}>
          <View style={[styles.statusDot, item.isUnread && styles.activeDot]} />
          <View style={styles.textContent}>
            <View style={styles.headerRow}>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
            <Text style={styles.messageText} numberOfLines={2}>
              {item.message}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      style={styles.container}
    >
      <Header title="Notifications" onBack={() => navigation.goBack()} />
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<NoData />}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
};

export default NotificationScreen;

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backgroundColor,
    },
    listContent: {
      flexGrow: 1,
      padding: verticalScale(20),
      paddingBottom: verticalScale(30),
    },
    notificationCard: {
      backgroundColor: theme.colors.bgSecondary,
      borderRadius: verticalScale(15),
      padding: verticalScale(15),
      marginBottom: verticalScale(12),
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    unreadCard: {
      backgroundColor: theme.colors.backgroundColor,
      borderColor: theme.colors.primary + '30',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 5,
    },
    contentRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    statusDot: {
      width: verticalScale(8),
      height: verticalScale(8),
      borderRadius: verticalScale(4),
      backgroundColor: 'transparent',
      marginTop: verticalScale(6),
      marginRight: verticalScale(10),
    },
    activeDot: {
      backgroundColor: theme.colors.primary,
    },
    textContent: {
      flex: 1,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: verticalScale(5),
    },
    notificationTitle: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
      flex: 1,
      marginRight: verticalScale(10),
    },
    timeText: {
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textTertiary,
    },
    messageText: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Regular',
      color: theme.colors.description,
      lineHeight: verticalScale(18),
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: verticalScale(100),
    },
    lottieFile: {
      width: verticalScale(250),
      height: verticalScale(250),
    },
    emptyTitle: {
      fontSize: verticalScale(20),
      fontFamily: 'Lato-Black',
      color: theme.colors.text,
      marginTop: verticalScale(10),
    },
    emptySubtitle: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textTertiary,
      textAlign: 'center',
      marginTop: verticalScale(10),
      paddingHorizontal: verticalScale(40),
      lineHeight: verticalScale(20),
    },
  });
