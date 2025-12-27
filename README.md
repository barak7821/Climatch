# Climatch

AI‑enhanced, weather‑aware outfit suggestions based on live conditions.

🚀 **Live Demo:** https://climatch-dusky.vercel.app

## ✨ Features

### 🤖 AI‑Powered Suggestions

* Generates outfit suggestions based on real-time weather
* Uses OpenRouter for lightweight model responses

### 📍 Location Options

* Auto geolocation (with permission)
* Manual city entry as a fallback

### 🌤️ Sky Visuals

* Dynamic sky gradients by weather + time of day
* Soft overlays to keep readability

### ⛈️ Weather API + Backend Logic

* OpenWeather data fetching
* API routes include caching + rate limiting

## 📸 Screenshots

### Home

<img src="./public/screenshots/home-manual-input.png" alt="Home - Manual Input" width="220" />

### Weather

<div style="display:flex; gap:10px; flex-wrap:wrap;">
  <img src="./public/screenshots/weather-clouds.png" alt="Weather - Clouds" width="180" />
  <img src="./public/screenshots/weather-clear.png" alt="Weather - Clear" width="180" />
  <img src="./public/screenshots/weather-rain.png" alt="Weather - Rain" width="180" />
</div>

## 🧰 Tech Stack

* Next.js (App Router)
* Tailwind CSS
* OpenWeather API
* OpenRouter API

## 📁 Project Structure

```
climatch/
├── app/
│   ├── api/
│   │   ├── weather/route.ts
│   │   └── weatherManual/route.ts
│   ├── lib/
│   │   ├── apiServices.ts
│   │   ├── logger.ts
│   │   ├── rateLimit.ts
│   │   ├── requestCache.ts
│   │   ├── skyPalettes.ts
│   │   └── types.ts
│   ├── services/
│   │   └── weatherApiClient.ts
│   ├── weather/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── utils/
│       ├── WeatherContext.tsx
│       ├── geolocation.ts
│       └── useNotyf.tsx
├── public/
│   └── logo.svg
├── package.json
└── tsconfig.json
```

## 🚀 Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env.local`

```env
OPENWEATHER_API_KEY=your_openweather_key
OPENROUTER_API_KEY=your_openrouter_key
MODE=your_mode
```

`MODE` controls logging. Use `development` for logs, or set to `production` to silence logs.

### 3. Run the app

```bash
npm run dev
```

## 📝 Notes

* The app uses server‑side API routes under `app/api`.
* Geolocation requires browser permission.
* The Home page is served at `/` via `app/page.tsx`.
