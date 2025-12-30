import axios from 'axios';

// Use environment variable or fallback to Render URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ddos-scanner-api.onrender.com/api';

console.log('API URL:', API_BASE_URL); // Debug log

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds (Render free tier can be slow to wake up)
});

export const fetchAttacks = async () => {
  try {
    console.log('Fetching attacks.. .');
    const response = await api.get('/attacks');
    console.log('Attacks received:', response.data. length);
    return response.data;
  } catch (error) {
    console.error('Error fetching attacks:', error. message);
    // Return empty array instead of crashing
    return [];
  }
};

export const fetchStats = async () => {
  try {
    console.log('Fetching stats...');
    const response = await api.get('/stats');
    console.log('Stats received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error.message);
    // Return default stats instead of crashing
    return {
      totalAttacks: 0,
      attacksByProtocol: {},
      topSourceCountries: [],
      topTargetCountries: []
    };
  }
};

export default api;