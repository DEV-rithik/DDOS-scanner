import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fetchAbuseIPDB } from './services/abuseipdb.js';
import { fetchCloudflareRadar } from './services/cloudflareRadar.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
let attacksCache = {
  data: null,
  timestamp: null
};
let statsCache = {
  data: null,
  timestamp: null
};

/**
 * Check if cache is still valid
 * @param {Object} cache - Cache object with timestamp
 * @returns {boolean} True if cache is valid
 */
function isCacheValid(cache) {
  if (!cache.data || !cache.timestamp) return false;
  return Date.now() - cache.timestamp < CACHE_DURATION;
}

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * GET /api/attacks
 * Returns attack data with geolocation
 */
app.get('/api/attacks', async (req, res) => {
  try {
    // Check cache first
    if (isCacheValid(attacksCache)) {
      console.log('Returning cached attack data');
      return res.json(attacksCache.data);
    }

    console.log('Fetching fresh attack data...');
    const apiKey = process.env.ABUSEIPDB_API_KEY;
    const attacks = await fetchAbuseIPDB(apiKey);

    // Update cache
    attacksCache = {
      data: attacks,
      timestamp: Date.now()
    };

    res.json(attacks);
  } catch (error) {
    console.error('Error fetching attacks:', error);
    res.status(500).json({
      error: 'Failed to fetch attack data',
      message: error.message
    });
  }
});

/**
 * GET /api/stats
 * Returns attack statistics
 */
app.get('/api/stats', async (req, res) => {
  try {
    // Check cache first
    if (isCacheValid(statsCache)) {
      console.log('Returning cached statistics');
      return res.json(statsCache.data);
    }

    console.log('Fetching fresh statistics...');
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    const stats = await fetchCloudflareRadar(apiToken);

    // Update cache
    statsCache = {
      data: stats,
      timestamp: Date.now()
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 DDoS Scanner Backend running on port ${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
});
