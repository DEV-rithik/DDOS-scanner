import axios from 'axios';

/**
 * Get geolocation data for an IP address using ip-api.com
 * @param {string} ip - IP address to lookup
 * @returns {Promise<Object>} Geolocation data
 */
export async function getGeoLocation(ip) {
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`, {
      timeout: 5000,
      params: {
        fields: 'status,country,countryCode,city,lat,lon'
      }
    });

    if (response.data.status === 'success') {
      return {
        country: response.data.country,
        countryCode: response.data.countryCode,
        city: response.data.city,
        latitude: response.data.lat,
        longitude: response.data.lon
      };
    } else {
      throw new Error('Geolocation lookup failed');
    }
  } catch (error) {
    console.error(`GeoIP lookup error for ${ip}:`, error.message);
    // Return default location if lookup fails
    return {
      country: 'Unknown',
      countryCode: 'XX',
      city: 'Unknown',
      latitude: 0,
      longitude: 0
    };
  }
}
