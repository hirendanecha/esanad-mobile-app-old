import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import Header from '@components/ui/Header';
import { useThemeContext } from '@theme/ThemeProvider';
import { verticalScale } from '@constants/metrics';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import HolidayService from '@api/services/HolidayService';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import AppLoaderLocal from '@components/ui/AppLoaderLocal';

const HolidaysScreen = ({ navigation }) => {
  const { theme } = useThemeContext();
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markedDates, setMarkedDates] = useState({});
  const styles = useStyles(theme);

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const currentYear = moment().year();

      // Fetch current year holidays
      const [y1] = await Promise.all([
        HolidayService.getHolidays('AE', currentYear),
      ]);

      const allHolidays = [...y1];

      // Sort by date
      allHolidays.sort((a, b) => moment(a.date.iso).diff(moment(b.date.iso)));

      setHolidays(allHolidays);

      // Prepare marked dates for Calendar
      const marked = {};
      allHolidays.forEach(h => {
        const dateStr = moment(h.date.iso).format('YYYY-MM-DD');
        marked[dateStr] = {
          selected: true,
          selectedColor: theme.colors.primary,
          selectedTextColor: theme.colors.backgroundColor,
        };
      });
      setMarkedDates(marked);

      setLoading(false);
    } catch (err) {
      console.log('Error fetching holidays:', err);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchHolidays();
      return () => { };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const renderHolidayItem = ({ item }) => {
    const hMoment = moment(item.date.iso);
    const day = hMoment.format('DD');
    const month = hMoment.format('MMM YYYY');
    const isPast = hMoment.isBefore(moment(), 'day');

    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.backgroundColor,
            borderColor: theme.colors.border,
            opacity: isPast ? 0.6 : 1,
          },
        ]}
      >
        <View
          style={[
            styles.dateContainer,
            { backgroundColor: theme.colors.primary + '20' },
          ]}
        >
          <Text style={[styles.dateDay, { color: theme.colors.primary }]}>
            {day}
          </Text>
          <Text
            style={[
              styles.dateMonth,
              { color: theme.colors.primary, fontSize: verticalScale(8) },
            ]}
          >
            {month}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text
            style={[styles.holidayName, { color: theme.colors.textPrimary }]}
          >
            {item.name}
          </Text>
          <Text
            style={[styles.holidayType, { color: theme.colors.textTertiary }]}
          >
            {item.type[0]}
          </Text>
        </View>
        {isPast ? (
          <Icon
            name="check-circle"
            size={20}
            color={theme.colors.textTertiary}
          />
        ) : (
          <Icon name="calendar-clock" size={20} color={theme.colors.primary} />
        )}
      </View>
    );
  };



  return (
    <LinearGradient
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      style={{ flex: 1 }}
    >
      <Header title="Public Holidays" onBack={() => navigation.goBack()} />

      <View
        style={[
          styles.calendarCard,
          {
            backgroundColor: theme.colors.backgroundColor,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Calendar
          minDate={`${moment().year()}-01-01`}
          maxDate={`${moment().year()}-12-31`}
          markedDates={markedDates}
          enableSwipeMonths={true}
          theme={{
            backgroundColor: theme.colors.backgroundColor,
            calendarBackground: theme.colors.backgroundColor,
            textSectionTitleColor: theme.colors.textSecondary,
            selectedDayBackgroundColor: theme.colors.primary,
            selectedDayTextColor: theme.colors.backgroundColor,
            todayTextColor: theme.colors.primary,
            dayTextColor: theme.colors.textPrimary,
            textDisabledColor: theme.colors.textTertiary,
            dotColor: theme.colors.primary,
            selectedDotColor: theme.colors.backgroundColor,
            arrowColor: theme.colors.primary,
            monthTextColor: theme.colors.textPrimary,
            indicatorColor: theme.colors.primary,
            textDayFontFamily: 'Lato-Regular',
            textMonthFontFamily: 'Lato-Bold',
            textDayHeaderFontFamily: 'Lato-Bold',
            textDayFontSize: verticalScale(14),
            textMonthFontSize: verticalScale(16),
            textDayHeaderFontSize: verticalScale(12),
          }}
        />
      </View>

      <FlatList
        data={holidays}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderHolidayItem}
        contentContainerStyle={{
          paddingHorizontal: verticalScale(20),
          paddingBottom: verticalScale(20),
        }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text
            style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
          >
            Full Schedule ({moment().year()})
          </Text>
        }
        ListEmptyComponent={
          <Text
            style={{
              textAlign: 'center',
              color: theme.colors.textTertiary,
              marginTop: 50,
            }}
          >
            No holidays found.
          </Text>
        }
      />
      {loading && <AppLoaderLocal />}
    </LinearGradient>
  );
};

const useStyles = theme =>
  StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    calendarCard: {
      margin: verticalScale(20),
      padding: verticalScale(10),
      borderRadius: verticalScale(20),
      borderWidth: 1,
      elevation: 4,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    sectionTitle: {
      fontSize: verticalScale(18),
      fontFamily: 'Lato-Bold',
      marginVertical: verticalScale(15),
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: verticalScale(15),
      padding: verticalScale(12),
      marginBottom: verticalScale(12),
      borderWidth: 1,
      elevation: 2,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    dateContainer: {
      width: verticalScale(60),
      height: verticalScale(60),
      borderRadius: verticalScale(10),
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: verticalScale(15),
    },
    dateDay: {
      fontSize: verticalScale(18),
      fontWeight: 'bold',
      fontFamily: 'Lato-Bold',
    },
    dateMonth: {
      fontSize: verticalScale(9),
      textTransform: 'uppercase',
      fontFamily: 'Lato-Bold',
      textAlign: 'center',
    },
    infoContainer: {
      flex: 1,
    },
    holidayName: {
      fontSize: verticalScale(15),
      fontFamily: 'Lato-Bold',
      marginBottom: verticalScale(2),
    },
    holidayType: {
      fontSize: verticalScale(11),
      fontFamily: 'Lato-Regular',
    },
  });

export default HolidaysScreen;
