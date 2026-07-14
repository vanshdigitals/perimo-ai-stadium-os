# PERIMO AI Operating System

![PERIMO Header](https://via.placeholder.com/1200x400/0F172A/FFFFFF?text=PERIMO+AI+Operating+System)

PERIMO is a state-of-the-art AI Operating System built for Smart Stadiums & Tournament Operations. Designed to orchestrate live events, manage crowd intelligence, and provide digital twin visualization—all powered by modern AI copilot interactions.

## 🚀 Features
- **Live Operations Dashboard:** Real-time metrics for crowd density, system health, and throughput.
- **Command Center:** Centralized widget-based architecture (Bento grid) for monitoring facility status.
- **Digital Twin Visualization:** Integrated Google Maps layout for live positional tracking and facility layers.
- **AI Operations Copilot:** Powered by Gemini AI, providing actionable intelligence and automated recommendations.
- **Production-Ready Enterprise UX:** Global command palettes, focus trapping, fixed sidebar footers, and smooth scroll momentum.

## 🛠️ Tech Stack
- **Frontend Framework:** React 19 + Vite
- **Styling:** Tailwind CSS (v4) with a custom design system
- **Routing:** React Router v7
- **AI Integration:** Google Gemini SDK
- **Maps:** Google Maps JavaScript API
- **Icons:** Lucide React
- **Linting:** oxlint
- **TypeScript:** Strict Mode

## 📂 Project Structure
```
PERIMO/
├── frontend/           # React frontend application (Vite)
│   ├── src/            # Source code (components, pages, contexts, features)
│   ├── public/         # Static assets
│   ├── package.json    # Frontend dependencies and scripts
│   └── vite.config.ts  # Vite configuration
├── backend/            # Backend services
├── shared/             # Shared types and utilities
├── infra/              # Infrastructure code
└── docs/               # Project documentation
```

## ⚙️ Environment Variables
The application requires the following environment variables. Do NOT commit real API keys to version control. See `frontend/.env.example` for reference.

```env
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY_HERE
VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
VITE_WSS_ENDPOINT=wss://api.perimo.io/live
```

## 💻 Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vanshdigitals/perimo-ai-stadium-os.git
   cd perimo-ai-stadium-os/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Copy `.env.example` to `.env` and fill in your API keys.

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```

## 🏗️ Build & Deployment

### Manual Build
To create a production build locally:
```bash
cd frontend
npm run build
```

### Vercel Deployment
This repository is configured for seamless deployment on Vercel.

1. Import the repository in your Vercel Dashboard.
2. In the **Framework Preset**, select `Vite`.
3. Set the **Root Directory** to `frontend`.
4. Add the required Environment Variables in the Vercel UI.
5. Click **Deploy**.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
