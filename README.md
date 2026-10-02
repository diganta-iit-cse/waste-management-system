# 🌱 WasteWise - AI Waste Management & Voice-Accessible Circular Platform

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-emerald.svg)](https://reactjs.org/)
[![Database: MongoDB](https://img.shields.io/badge/Database-MongoDB%20WiredTiger%20(Persistent)-green.svg)](https://www.mongodb.com/)
[![Web Speech API](https://img.shields.io/badge/Voice-Web%20Speech%20API%20Native-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA%20Compliant-amber.svg)](https://www.w3.org/WAI/)
[![Multi-Language](https://img.shields.io/badge/Languages-EN%20%7C%20HI%20%7C%20BN%20%7C%20PA-teal.svg)](https://en.wikipedia.org/wiki/Languages_of_India)
[![License: ISC](https://img.shields.io/badge/License-ISC-green.svg)](https://opensource.org/licenses/ISC)

**WasteWise** is a full-stack MERN (MongoDB, Express.js, React, Node.js) circular waste management platform engineered for the **Smart India Hackathon (SIH)**. It brings together **AI Computer Vision Waste Classification**, **Informal Kabadiwala Scrap Pickups**, **Doorstep Digital Weighing Logistics**, **Multi-Language Speech-to-Text (STT)**, **Text-to-Speech (TTS) Screen Reading**, **High-Contrast Accessibility Mode**, **Live MongoDB Persistence**, and an **Executive Operations Dispatch Desk**.

---

## 🔗 Live Application Access

| Component | URL | Status | Description |
| :--- | :--- | :--- | :--- |
| **Web Application** | [http://localhost:5173/](http://localhost:5173/) | 🟢 **ONLINE** | Interactive Vite + React SPA |
| **REST API Server** | [http://localhost:5000/api](http://localhost:5000/api) | 🟢 **ONLINE** | Express.js API & Business Logic |
| **Live Database Telemetry** | [http://localhost:5000/api/dashboard/db-status](http://localhost:5000/api/dashboard/db-status) | 🟢 **ONLINE** | Real-time MongoDB document count & storage stats |
| **Live Scrap Rates Ticker** | [http://localhost:5000/api/dashboard/scrap-rates](http://localhost:5000/api/dashboard/scrap-rates) | 🟢 **ONLINE** | Real Indian Mandi commodity scrap benchmarks |

---

## 🍃 MongoDB Real Data & Persistent Storage Engine

WasteWise is connected to **persistent MongoDB storage** with realistic Indian circular economy data:

### 1. Storage Architecture
- **Persistent WiredTiger Engine**: All database records are physically persisted to disk inside `server/data/db/` using MongoDB's enterprise WiredTiger storage engine on port `27017`.
- **Zero Data Loss on Restart**: Any newly booked pickup requests, uploaded waste classifications, spoken notes, or profile settings remain saved on disk across application restarts.
- **MongoDB Atlas Ready**: Simply provide your connection string in `server/.env` (`MONGODB_URI=mongodb+srv://...`) and ensure your IP is whitelisted; the system automatically switches to your cloud cluster.

### 2. Live Telemetry & Navbar Status Pill
- The application header displays a live **`🟢 MongoDB: Live`** status badge.
- Clicking the badge opens a telemetry popover showing:
  - Active Database: `wastewise`
  - Host & Port: `127.0.0.1:27017`
  - Engine: `WiredTiger (Persistent Disk Storage)`
  - Physical Document Counts: Users (2), Classifications (25+), Verified Kabadiwalas (8), Pickups, and Total Documents.

### 3. Real Data Collections & Endpoints
1. **Verified SPCB Recycling Centers & Kabadiwalas (`recyclingServices`)**:
   - 8 verified scrap collectors across Delhi NCR, Gurugram, and Noida with official State Pollution Control Board registration codes (e.g., `DPCC/EW-REG/2026/0412`).
   - Real GPS latitude and longitude coordinates (`[lat, lng]`).
   - Verified contact telephone numbers (`+91 98110 44219`, etc.) and accepted waste categories.
   - **Real GPS Proximity**: Click **"Near Me (GPS)"** on the `/services` page to calculate exact distance in kilometers using the Haversine formula (`6371 * c`) from your browser's geolocation.
   - **One-Click Navigation**: Each center card includes a direct link to **Google Maps Turn-by-Turn Navigation**.

2. **Real Mandi Commodity Scrap Buyback Rates (`/api/dashboard/scrap-rates`)**:
   - 10 real-time benchmark scrap commodities updated with daily Indian wholesale prices:
     - Old Newspaper (Raddi): ₹16/kg
     - Corrugated Cardboard: ₹14/kg
     - PET Plastic Bottles (Clear): ₹19/kg
     - HDPE Plastics (Buckets / Milk Jugs): ₹24/kg
     - Iron Scrap (Loha): ₹34/kg
     - Aluminum Beverage Cans & Utensils: ₹115/kg
     - Copper Wire Scrap: ₹460/kg
     - Brass Scrap (Pital): ₹325/kg
     - E-Waste PCB Motherboards: ₹90/kg
     - Glass Bottles & Containers: ₹6/kg

3. **Real Image Metadata Extraction**:
   - Uploading photos on `/classify` dynamically extracts real MIME format (JPEG, PNG, WEBP), calculates base64 payload size in KB, records analysis timestamps, and computes dynamic confidence scoring.

---

## 🎤 Native Voice & Accessibility Features (Requirements #41–#66)

WasteWise implements zero-paid-API, native browser speech capabilities:

### 1. Speech-to-Text (STT) (`components/VoiceInput.jsx`)
- Built using native browser `window.SpeechRecognition` and `window.webkitSpeechRecognition`.
- Supports idle, listening (with pulsing ring and real-time waveform oscillations), and stop states.
- Reusable across search bars, form inputs, notes fields, and modals.

### 2. Multi-Language Indian Speech Input (Requirement #44)
Accessible via the `🌐 Language` selector in the navbar and settings:
- **English (India)**: `en-IN`
- **हिन्दी (Hindi)**: `hi-IN`
- **বাংলা (Bengali)**: `bn-IN`
- **ਪੰਜਾਬੀ (Punjabi)**: `pa-IN`

### 3. Text-to-Speech (TTS) Screen Reader (`components/TextToSpeech.jsx`)
- Powered by native browser `window.speechSynthesis`.
- **Classification Result Reader (Requirement #46)**: Full playback control deck:
  - ▶ **Speak**
  - ⏸ **Pause**
  - ▶ **Resume**
  - ⏹ **Stop**
- **Disposal Instructions Cards (Requirement #47)**: Every card has a `[🔊 Listen]` button reading segregation rules aloud.
- **Voice-Enabled Dashboard (Requirement #48)**: `🔊 Read Dashboard` reads complete user metrics:
  > *"You have classified 25 waste items. 15 were recyclable. 5 were organic. 3 were electronic waste. 2 were hazardous waste."*
- **Automatic Voice Feedback (Requirement #54)**: Spoken audio confirmation after classifications, pickup submissions, and user login (can be toggled in settings).

### 4. Global Floating Voice Assistant (Requirement #52 & #53)
- Floating microphone button (🎤) in the bottom-right corner.
- Activates an assistant modal featuring an animated audio waveform (`VoiceWaveform.jsx`) and intent router:
  - *"Classify my waste"* ➔ Speaks confirmation & navigates to `/classify`
  - *"Find recycling centers"* / *"Kabadiwala"* ➔ Speaks confirmation & navigates to `/services`
  - *"Request a pickup"* ➔ Speaks confirmation & navigates to `/pickup`
  - *"Open my history"* ➔ Navigates to `/history`
  - *"Open dashboard"* ➔ Navigates to `/dashboard`
  - *"Explain recyclable waste"* ➔ Explains eco concepts aloud
  - *"Help"* ➔ Voice guide

### 5. Kabadiwala Voice Search with Keyword Extraction (Requirement #62)
- Speak: *"I have plastic bottles and old newspapers. Find a recycling service."*
- Extracts materials (`Plastic`, `Paper`) and displays matching verified scrap dealers.

### 6. Smart Voice Pickup Autofill (Requirement #63)
- Speak: *"I want to schedule a pickup for 5 kilograms of plastic bottles."*
- Extracts: `Waste Type: Plastic`, `Quantity: 5 kg` and populates the pickup form.
- **Human-in-the-Loop Principle**: Never auto-submits; user reviews and clicks **Submit Pickup Request**.

### 7. High-Contrast Accessibility Mode (Requirement #51)
- One-tap toggle (`A11y`) in navbar and settings.
- Increases font sizes (+112%), enlarges buttons (minimum 48px target), applies pure black high-contrast background with emerald borders, and enforces focus indicator rings (`outline: 3px solid #34d399`).

---

## 🗂️ Component & Directory Structure

```
c:/Users/DIGANTA/Desktop/e-commerce/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── VoiceInput.jsx             # Reusable STT mic button
│   │   │   ├── TextToSpeech.jsx           # Reusable TTS player (Speak/Pause/Resume/Stop)
│   │   │   ├── VoiceAssistant.jsx         # Global bottom-right floating voice assistant
│   │   │   ├── VoiceWaveform.jsx          # Animated multi-bar sound visualizer
│   │   │   ├── VoiceSettings.jsx          # Voice volume, speech rate & language controls
│   │   │   ├── LanguageSelector.jsx       # 🌐 Indian languages switcher (EN, HI, BN, PA)
│   │   │   ├── DisposalInstructionCard.jsx# Waste guide card with [🔊 Listen]
│   │   │   ├── Navbar.jsx                 # Header with MongoDB status pill & voice search
│   │   │   └── Footer.jsx                 # Footer with SIH 2026 badges
│   │   ├── context/
│   │   │   ├── VoiceContext.jsx           # Global voice, language & a11y provider
│   │   │   └── AuthContext.jsx            # User authentication & profile settings
│   │   ├── hooks/
│   │   │   ├── useSpeechRecognition.js    # Browser SpeechRecognition lifecycle hook
│   │   │   └── useTextToSpeech.js         # Browser SpeechSynthesis controls hook
│   │   └── pages/
│   │       ├── HomePage.jsx               # Hero, live scrap ticker, quick search
│   │       ├── ClassifyPage.jsx           # AI waste identification & spoken notes
│   │       ├── ServicesPage.jsx           # Kabadiwala directory with GPS proximity
│   │       ├── PickupPage.jsx             # Doorstep booking form with field mics
│   │       ├── HistoryPage.jsx            # Pickups timeline & classified items history
│   │       ├── DashboardPage.jsx          # 🔊 Read Dashboard stats & eco-credit metrics
│   │       ├── AdminDashboardPage.jsx     # Operations desk & pickup status dispatch
│   │       ├── SettingsPage.jsx           # Voice & Accessibility configuration
│   │       └── LoginPage.jsx              # Sign-in with one-click demo credentials
├── server/
│   ├── config/
│   │   ├── db.js                          # Persistent WiredTiger MongoDB connection
│   │   └── seedData.js                    # Verified recycling centers & seed data
│   ├── controllers/
│   │   ├── classificationController.js    # Image classification & voice notes
│   │   ├── dashboardController.js         # Dashboard stats & /api/dashboard/db-status
│   │   ├── pickupController.js            # Doorstep pickups & admin status update
│   │   └── serviceController.js           # Verified centers & voice keyword filter
│   ├── data/
│   │   └── db/                            # Physical WiredTiger disk database files
│   └── run_test_with_server.js            # Automated 10-point test runner
├── start-dev.js                           # Dual concurrent dev server launcher
└── README.md                              # Complete platform documentation
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ (tested on Node.js v24.19)
- **npm** v10+

### 2. Start Dev Servers (Both Client & Server)
From the project root:
```bash
node start-dev.js
```
- Client launches on: `http://localhost:5173/`
- Server launches on: `http://localhost:5000/`

### 3. Run Automated End-to-End Test Suite
To verify all 10 API endpoints, voice parsing, and database queries:
```bash
node server/run_test_with_server.js
```

---

## 🔑 Demo Credentials

| Role | Email | Password | Quick Login |
| :--- | :--- | :--- | :--- |
| **Eco Citizen** | `user@wastewise.org` | `password123` | Click *"Citizen Demo"* on Login page |
| **Admin HQ** | `admin@wastewise.org` | `password123` | Click *"Admin Demo"* on Login page |

---

## 🌐 Supported Web Speech Languages

| Language | Native Script | Web Speech API Code |
| :--- | :--- | :--- |
| **English (India)** | English | `en-IN` |
| **Hindi** | हिन्दी | `hi-IN` |
| **Bengali** | বাংলা | `bn-IN` |
| **Punjabi** | ਪੰਜਾਬੀ | `pa-IN` |

---

## 📜 WCAG 2.1 AA Compliance
WasteWise follows the Web Content Accessibility Guidelines (WCAG 2.1 AA):
- Dual modal access: Any action executable by voice can also be performed via mouse, touch, or keyboard.
- Full ARIA tags: `role="dialog"`, `aria-label`, `aria-live="polite"`.
- Visible focus rings: `focus:ring-2 focus:ring-emerald-400`.
- Friendly fallbacks: If the browser lacks microphone support or permissions are denied, an informative non-blocking banner is presented without crashing the app.
