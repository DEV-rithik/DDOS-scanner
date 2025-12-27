import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Fetch attack data from backend
 * @returns {Promise<Array>} Array of attack objects
 */
export async function fetchAttacks() {
  try {
    const response = await axios.get(`${API_BASE_URL}/attacks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching attacks:', error);
    throw error;
  }
}

/**
 * Fetch statistics from backend
 * @returns {Promise<Object>} Statistics object
 */
export async function fetchStats() {
  try {
    const response = await axios.get(`${API_BASE_URL}/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
}
