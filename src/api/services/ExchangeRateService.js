import axios from 'axios';

const API_KEY = '18c79d998271bcd2d26016d7';
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

class ExchangeRateService {
    async getLatestRates(base = 'AED') {
        try {
            const response = await axios.get(`${BASE_URL}/latest/${base}`);
            return response.data;
        } catch (error) {
            console.error('ExchangeRateService Error:', error);
            throw error;
        }
    }

    async convert(from, to, amount) {
        try {
            const response = await axios.get(`${BASE_URL}/pair/${from}/${to}/${amount}`);
            return response.data;
        } catch (error) {
            console.error('ExchangeRateService Error:', error);
            throw error;
        }
    }
}

export default new ExchangeRateService();
