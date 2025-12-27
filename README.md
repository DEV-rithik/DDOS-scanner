# 🌐 DDoS Attack Tracker

A real-time cyber threat visualization application that displays DDoS attacks and cybersecurity threats on an interactive 3D globe. This project integrates with legitimate threat intelligence sources (AbuseIPDB and Cloudflare Radar) to provide live insights into global cyber attack patterns.

## ✨ Features

- **3D Globe Visualization**: Interactive globe displaying attack sources with animated arcs to target locations
- **Real-time Threat Feed**: Live list of detected attacks with confidence scores and geolocation data
- **Attack Analytics**: Dashboard with statistics including:
  - Total attack count (7-day period)
  - Attacks by protocol (TCP, UDP, ICMP, GRE)
  - Top attack source countries
  - Top target countries
- **Attack Categories**: DDoS, Brute Force, Port Scan, and Suspicious activity
- **Auto-refresh**: Data updates automatically every 5 minutes
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Theme**: Professional cybersecurity-themed interface

## 📸 Screenshots

_[Screenshots will appear here after the application is running]_

## 🔧 Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn** package manager
- API keys (optional, fallback data provided):
  - [AbuseIPDB API Key](https://www.abuseipdb.com/api)
  - [Cloudflare Radar API Token](https://developers.cloudflare.com/radar/)

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/DEV-rithik/DDOS-scanner.git
cd DDOS-scanner
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit the `.env` file and add your API keys (optional):

```env
PORT=3001
ABUSEIPDB_API_KEY=your_abuseipdb_api_key_here
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token_here
```

**Note**: The application will work without API keys using fallback sample data.

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

## 🚀 Running the Application

### Start the Backend Server

```bash
cd backend
npm start
```

The backend server will start on `http://localhost:3001`

For development with auto-reload:
```bash
npm run dev
```

### Start the Frontend

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

Open your browser and navigate to `http://localhost:5173` to view the application.

## 🔑 Getting API Keys

### AbuseIPDB API Key

1. Visit [AbuseIPDB](https://www.abuseipdb.com/)
2. Create a free account
3. Go to your [API page](https://www.abuseipdb.com/api)
4. Generate an API key
5. Add it to your `backend/.env` file

### Cloudflare Radar API Token

1. Visit [Cloudflare Radar](https://radar.cloudflare.com/)
2. Sign up or log in to your Cloudflare account
3. Navigate to [API Tokens](https://dash.cloudflare.com/profile/api-tokens)
4. Create a new token with Radar permissions
5. Add it to your `backend/.env` file

## 📁 Project Structure

```
DDOS-scanner/
├── backend/                    # Backend Node.js server
│   ├── src/
│   │   ├── services/
│   │   │   ├── abuseipdb.js   # AbuseIPDB API integration
│   │   │   ├── cloudflareRadar.js # Cloudflare Radar API
│   │   │   └── geoip.js       # IP geolocation service
│   │   └── index.js           # Express server
│   ├── .env.example           # Environment variables template
│   ├── .gitignore             # Git ignore rules
│   └── package.json           # Backend dependencies
│
├── frontend/                  # Frontend React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Globe.jsx      # 3D globe visualization
│   │   │   ├── Dashboard.jsx  # Statistics dashboard
│   │   │   └── AttackList.jsx # Live threat feed list
│   │   ├── services/
│   │   │   └── api.js         # API service layer
│   │   ├── App.jsx            # Main application component
│   │   ├── App.css            # Application styles
│   │   └── main.jsx           # React entry point
│   ├── index.html             # HTML template
│   ├── vite.config.js         # Vite configuration
│   └── package.json           # Frontend dependencies
│
├── .gitignore                 # Root git ignore rules
└── README.md                  # Project documentation
```

## 🛠 Tech Stack

### Backend
- **Express.js**: Web server framework
- **Axios**: HTTP client for API requests
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variable management

### Frontend
- **React**: UI library
- **Vite**: Build tool and dev server
- **globe.gl**: 3D globe visualization library
- **Three.js**: 3D graphics library
- **Chart.js**: Data visualization charts
- **react-chartjs-2**: React wrapper for Chart.js
- **Axios**: HTTP client

## 🔒 Security Notes

- **Never commit your `.env` file** - It contains sensitive API keys
- The `.env.example` file shows required variables without real values
- API keys should be kept private and rotated regularly
- The application includes fallback data to work without API keys for testing
- All API communications use HTTPS when connecting to external services

## 📝 API Endpoints

### Backend API

- `GET /api/health` - Health check endpoint
- `GET /api/attacks` - Returns attack data with geolocation
- `GET /api/stats` - Returns attack statistics

Data is cached for 5 minutes to avoid rate limits.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This application is for educational and research purposes only. The data displayed comes from legitimate threat intelligence sources. Always use this tool responsibly and in accordance with all applicable laws and regulations.

## 🙏 Acknowledgments

- [AbuseIPDB](https://www.abuseipdb.com/) - IP abuse database
- [Cloudflare Radar](https://radar.cloudflare.com/) - Internet traffic insights
- [ip-api.com](https://ip-api.com/) - IP geolocation service
- [globe.gl](https://globe.gl/) - 3D globe visualization library