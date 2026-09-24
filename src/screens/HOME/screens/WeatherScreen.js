import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from 'react-native-geolocation-service';
import Header from '@components/ui/Header';
import { useThemeContext } from '@theme/ThemeProvider';
import WeatherService from '@api/services/WeatherService';
import AppLoaderLocal from '@components/ui/AppLoaderLocal';

const WeatherScreen = ({ navigation }) => {
  const { theme } = useThemeContext();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const init = async () => {
    setLoading(true);

    Geolocation.getCurrentPosition(
      async pos => {
        const data = await WeatherService.getForecast(
          `${pos.coords.latitude},${pos.coords.longitude}`,
        );
        setWeather(data);
        setLoading(false);
      },
      async () => {
        const data = await WeatherService.getForecast('Dubai');
        setWeather(data);
        setLoading(false);
      },
      { timeout: 15000 },
    );
  };

  useFocusEffect(
    useCallback(() => {
      init();
      return () => {};
    }, []),
  );

  return (
    <LinearGradient
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      style={{ flex: 1 }}
    >
      <Header title="Temperature" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {weather && (
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.backgroundColor,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text style={[styles.city, { color: theme.colors.textPrimary }]}>
              {weather.location.name}
            </Text>
            <View style={styles.row}>
              <Image
                source={{ uri: `https:${weather.current.condition.icon}` }}
                style={{ width: 80, height: 80 }}
              />
              <Text style={[styles.temp, { color: theme.colors.textPrimary }]}>
                {Math.round(weather.current.temp_c)}°C
              </Text>
            </View>
            <Text
              style={{
                fontSize: 18,
                color: theme.colors.textSecondary,
                marginBottom: 20,
              }}
            >
              {weather.current.condition.text}
            </Text>
            <View style={[styles.stats, { borderColor: theme.colors.border }]}>
              <Stat
                icon="water-percent"
                val={`${weather.current.humidity}%`}
                lab="Humidity"
                theme={theme}
              />
              <Stat
                icon="weather-windy"
                val={`${weather.current.wind_kph}km/h`}
                lab="Wind"
                theme={theme}
              />
              <Stat
                icon="thermometer"
                val={`${Math.round(weather.current.feelslike_c)}°C`}
                lab="Feels"
                theme={theme}
              />
            </View>
          </View>
        )}
      </ScrollView>
      {loading && <AppLoaderLocal />}
    </LinearGradient>
  );
};

const Stat = ({ icon, val, lab, theme }) => (
  <View style={{ alignItems: 'center', flex: 1 }}>
    <Icon name={icon} size={22} color={theme.colors.primary} />
    <Text
      style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.textPrimary,
      }}
    >
      {val}
    </Text>
    <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>
      {lab}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
  },
  city: { fontSize: 26, fontWeight: 'bold' },
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  temp: { fontSize: 50, fontWeight: 'bold' },
  stats: {
    flexDirection: 'row',
    width: '100%',
    borderTopWidth: 1,
    paddingTop: 15,
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  forecastItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
});

export default WeatherScreen;
