import axios from 'axios';

const WEATHER_API_KEY = '659f86ae36f44851b2873605262602';
const BASE_URL = 'https://api.weatherapi.com/v1';

const WeatherService = {
    getForecast: async (city) => {
        try {
            const response = await axios.get(`${BASE_URL}/forecast.json`, {
                params: {
                    key: WEATHER_API_KEY,
                    q: city,
                    days: 3,
                    aqi: 'no',
                    alerts: 'no',
                },
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                throw new Error(error.response.data.error.message);
            }
            throw new Error('Failed to fetch weather data');
        }
    },
};

export default WeatherService;
