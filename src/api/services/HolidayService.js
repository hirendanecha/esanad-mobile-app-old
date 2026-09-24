import axios from 'axios';

const API_KEY = 'lm5qB2jfhuhhZdIs4rvZkE5E3LgkwDB7';
const BASE_URL = 'https://calendarific.com/api/v2';

class HolidayService {
    async getHolidays(country = 'AE', year = new Date().getFullYear()) {
        try {
            const response = await axios.get(`${BASE_URL}/holidays`, {
                params: {
                    api_key: API_KEY,
                    country: country,
                    year: year,
                }
            });
            return response.data.response.holidays;
        } catch (error) {
            console.error('HolidayService Error:', error);
            throw error;
        }
    }
}

export default new HolidayService();
