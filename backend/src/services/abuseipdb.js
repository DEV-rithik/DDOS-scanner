import axios from 'axios';
import { getGeoLocation } from './geoip.js';

/**
 * Fetch blacklisted IPs from AbuseIPDB
 * @param {string} apiKey - AbuseIPDB API key
 * @returns {Promise<Array>} Array of attack data
 */
export async function fetchAbuseIPDB(apiKey) {
  if (!apiKey || apiKey === 'your_abuseipdb_api_key_here') {
    console.log('AbuseIPDB API key not configured, using fallback data');
    return getFallbackData();
  }

  try {
    const response = await axios.get('https://api.abuseipdb.com/api/v2/blacklist', {
      headers: {
        'Key': apiKey,
        'Accept': 'application/json'
      },
      params: {
        confidenceMinimum: 90,
        limit: 50
      },
      timeout: 10000
    });

    const attacks = [];
    
    if (response.data && response.data.data) {
      for (const item of response.data.data) {
        const geoData = await getGeoLocation(item.ipAddress);
        
        // Categorize attack based on abuse confidence score
        let attackType;
        if (item.abuseConfidenceScore >= 90) {
          attackType = 'DDoS';
        } else if (item.abuseConfidenceScore >= 70) {
          attackType = 'Brute Force';
        } else if (item.abuseConfidenceScore >= 50) {
          attackType = 'Port Scan';
        } else {
          attackType = 'Suspicious';
        }

        attacks.push({
          id: item.ipAddress.replace(/\./g, '-'),
          ip: item.ipAddress,
          attackType,
          confidence: item.abuseConfidenceScore,
          reportCount: item.totalReports || 0,
          lastReported: item.lastReportedAt || new Date().toISOString(),
          ...geoData
        });
      }
    }

    return attacks.length > 0 ? attacks : getFallbackData();
  } catch (error) {
    console.error('AbuseIPDB API error:', error.message);
    return getFallbackData();
  }
}

/**
 * Get fallback sample data when API is unavailable
 * @returns {Array} Sample attack data
 */
function getFallbackData() {
  return [
    {
      id: '1-1-1-1',
      ip: '1.1.1.1',
      attackType: 'DDoS',
      confidence: 95,
      reportCount: 150,
      lastReported: new Date().toISOString(),
      country: 'United States',
      countryCode: 'US',
      city: 'Los Angeles',
      latitude: 34.0522,
      longitude: -118.2437
    },
    {
      id: '2-2-2-2',
      ip: '2.2.2.2',
      attackType: 'Brute Force',
      confidence: 85,
      reportCount: 120,
      lastReported: new Date().toISOString(),
      country: 'China',
      countryCode: 'CN',
      city: 'Beijing',
      latitude: 39.9042,
      longitude: 116.4074
    },
    {
      id: '3-3-3-3',
      ip: '3.3.3.3',
      attackType: 'Port Scan',
      confidence: 75,
      reportCount: 90,
      lastReported: new Date().toISOString(),
      country: 'Russia',
      countryCode: 'RU',
      city: 'Moscow',
      latitude: 55.7558,
      longitude: 37.6173
    },
    {
      id: '4-4-4-4',
      ip: '4.4.4.4',
      attackType: 'DDoS',
      confidence: 92,
      reportCount: 180,
      lastReported: new Date().toISOString(),
      country: 'Germany',
      countryCode: 'DE',
      city: 'Berlin',
      latitude: 52.5200,
      longitude: 13.4050
    },
    {
      id: '5-5-5-5',
      ip: '5.5.5.5',
      attackType: 'Brute Force',
      confidence: 88,
      reportCount: 110,
      lastReported: new Date().toISOString(),
      country: 'Brazil',
      countryCode: 'BR',
      city: 'São Paulo',
      latitude: -23.5505,
      longitude: -46.6333
    }
  ];
}
