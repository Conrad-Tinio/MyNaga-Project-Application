# MedMap Naga - Health Resource Dashboard

A prototype application for helping solve health-related concerns in Naga, Bicol, Philippines. This frontend-only prototype provides a comprehensive dashboard for managing and finding medical resources across Naga City health facilities.

## Features

### 1. Real-Time Medical Resource Availability Dashboard
- Centralized citywide view of critical medical resources
- Shows availability of medicines, blood supply, hospital beds, oxygen tanks, and emergency equipment
- Status indicators: Available, Low, Out of Stock
- Timestamped updates showing data freshness

### 2. Facility-Level Filtering
- Filter by facility type:
  - Public hospitals
  - Infirmaries
  - Barangay health centers
  - Partner pharmacies
- Combined filtering with location and availability status

### 3. Emergency-Aware Suggestions
- Automatically highlights nearest facilities with available resources
- Considers user location, resource type, and current availability
- Prioritizes facilities by proximity during emergencies

### 4. MedMap Assist - Personalized Resource Chatbot
- Conversational assistant for finding medical resources
- Plain language interface (e.g., "Where can I find O+ blood?")
- Non-diagnostic, resource-focused only
- User-friendly for seniors, caregivers, and first-time users

### 5. Dual-Access Views (Public vs Restricted)
- **Public View**: Simplified availability indicators for citizens
- **Restricted View**: Detailed stock levels, historical usage, and update controls for health workers and LGU staff

### 6. LGU Admin Panel for Inventory Updates
- Secure admin interface for facility staff
- Manual and scheduled update capabilities
- Flags outdated or missing updates
- Real-time inventory management

### 7. Low-Stock Alerts
- Automatic notifications when resources reach critical levels
- Configurable thresholds per resource type
- Alert dashboard for LGU staff

### 8. Analytics and Demand Heatmaps (LGU Dashboard)
- Aggregated, anonymized analytics
- Demand patterns and search frequency
- Facility utilization metrics
- Evidence-based procurement insights

### 9. Privacy-by-Design and Legal Compliance
- No medical diagnoses or personal medical histories stored
- Only aggregated and anonymized usage data
- Compliant with RA 10173 (Data Privacy Act)
- Clear disclaimers defining system scope

## Tech Stack

- **Vite** - Build tool and dev server
- **React** - UI framework
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Recharts** - Chart library for analytics
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Demo Credentials

For accessing the Admin Panel and Analytics Dashboard:

- **Admin Account:**
  - Email: `admin@naga.gov.ph`
  - Password: any (for demo purposes)

- **Staff Account:**
  - Email: `staff@naga.gov.ph`
  - Password: any (for demo purposes)

## Project Structure

```
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── ResourceCard.jsx
│   │   └── StatusBadge.jsx
│   ├── context/             # React context providers
│   │   └── AuthContext.jsx
│   ├── data/                # Mock data and utilities
│   │   └── mockData.js
│   ├── pages/               # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Chatbot.jsx
│   │   ├── AdminPanel.jsx
│   │   ├── Analytics.jsx
│   │   └── Login.jsx
│   ├── App.jsx              # Main app component with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile devices

## Notes

- This is a **prototype** - no backend or database integration
- All data is mock data for demonstration purposes
- Resource availability should be verified by contacting facilities directly
- The system does not provide medical advice or diagnoses

## License

This project is a prototype for hackathon purposes.
