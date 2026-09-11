# KalaSetu (कलासेतु) — हर हाथ को पहचान

> **A voice-first direct fair trade marketplace connecting rural and tribal Indian artisans with conscious patrons worldwide, eliminating middlemen and empowering master craftspeople with AI cataloging.**

---

## 🌟 Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS & Modern Web Design System
- **Backend & Realtime**: Firebase (Authentication, Cloud Firestore, Cloud Storage)
- **AI Engine**: Google Gemini API for Multimodal Visual & Audio Craft Cataloging
- **Audio & Voice**: Web Speech API with Regional Speech Synthesis & Voice Navigation
- **Data Visualization**: D3.js for Artisan Earnings & Engagement Analytics

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 2. Installation
```bash
# Clone the repository
git clone <repository_url>
cd kalasetu

# Install dependencies
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local` or `.env` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required environment variables in `.env.local`:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_DATABASE_ID`
- `VITE_GEMINI_API_KEY`

Refer to [`.env.example`](.env.example) for placeholder definitions.

### 4. Run Locally
```bash
npm run dev
```

Visit `http://localhost:3000` to interact with KalaSetu.

---

## 📜 License
MIT License. Handcrafted with pride for India's traditional heritage artisans.
