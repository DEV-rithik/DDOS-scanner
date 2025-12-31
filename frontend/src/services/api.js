import axios from 'axios';

// Hardcoded API URL for production
const API_BASE_URL = 'https://ddos-scanner-api.onrender.com/api';

console.log('API URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const fetchAttacks = async () => {
  try {
    console. log('Fetching attacks.. .');
    const response = await api.get('/attacks');
    console.log('Attacks received:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('Error fetching attacks:', error.message);
    return [];
  }
};

export const fetchStats = async () => {
  try {
    console. log('Fetching stats...');
    const response = await api. get('/stats');
    console.log('Stats received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error.message);
    return {
      totalAttacks: 0,
      attacksByProtocol: {},
      topSourceCountries: [],
      topTargetCountries: []
    };
  }
};

export default api;