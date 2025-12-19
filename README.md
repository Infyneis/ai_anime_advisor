<p align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/sparkles.svg" alt="AI Anime Advisor" width="100" height="100" />
</p>

<h1 align="center">AI Anime Advisor</h1>
<h3 align="center">Discover your next favorite anime with AI-powered recommendations <code>#8/365 - Year Coding Challenge</code></h3>

<p align="center">
  <em>Interactive keyword selection powered by Ollama and enriched with MyAnimeList data</em>
</p>

<p align="center">
  <a href="https://github.com/Infyneis">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://www.linkedin.com/in/samy-djemili/">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Ollama-Local_AI-white?style=flat-square&logo=ollama" alt="Ollama" />
</p>

---

## Overview

An interactive **AI-powered anime recommendation** application that learns your preferences through progressive keyword selection. Select genres, themes, and moods, and let the AI narrow down the perfect anime for you. Features a beautiful anime-inspired UI with sakura petal animations and glassmorphism effects.

<p align="center">
  <img src="https://img.shields.io/badge/🚀_Year_Coding_Challenge-Project_%238-FF6B9D?style=for-the-badge" alt="Year Coding Challenge" />
  <img src="https://img.shields.io/badge/📅_Completed-December_19,_2024-C084FC?style=for-the-badge" alt="Completed" />
  <img src="https://img.shields.io/badge/🎨_Theme-Anime_Pink-FF6B9D?style=for-the-badge" alt="Theme" />
</p>

---

## Features

| Feature | Description |
|---------|-------------|
| 🎯 **Smart Keywords** | AI suggests relevant keywords based on your selections |
| 🔄 **Progressive Refinement** | Narrow down preferences through multiple rounds |
| 🎬 **3 Perfect Picks** | Get exactly 3 anime recommendations tailored to you |
| 📖 **Rich Details** | View synopsis, ratings, episodes, studios, and more |
| 🌸 **Anime UI** | Beautiful pink/purple theme with sakura animations |
| 🦙 **100% Local AI** | Powered by Ollama - no API costs, full privacy |
| 📊 **MAL Integration** | Real anime data from MyAnimeList via Jikan API |
| 🐳 **Docker Ready** | One-command setup with Docker Compose |

---

## Tech Stack

<table>
  <tr>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=nextjs" width="48" height="48" alt="Next.js" />
      <br>Next.js 16
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" />
      <br>React 19
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=ts" width="48" height="48" alt="TypeScript" />
      <br>TypeScript
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="Tailwind" />
      <br>Tailwind CSS
    </td>
    <td align="center" width="96">
      <img src="https://ui.shadcn.com/apple-touch-icon.png" width="48" height="48" alt="shadcn" />
      <br>shadcn/ui
    </td>
  </tr>
  <tr>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=fastapi" width="48" height="48" alt="FastAPI" />
      <br>FastAPI
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=python" width="48" height="48" alt="Python" />
      <br>Python 3.12
    </td>
    <td align="center" width="96">
      <img src="https://ollama.com/public/ollama.png" width="48" height="48" alt="Ollama" />
      <br>Ollama
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=docker" width="48" height="48" alt="Docker" />
      <br>Docker
    </td>
    <td align="center" width="96">
      <img src="https://pnpm.io/img/pnpm-no-name-with-frame.svg" width="48" height="48" alt="pnpm" />
      <br>pnpm
    </td>
  </tr>
</table>

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Next.js Frontend                          │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────────┐  │
│  │ Keyword      │  │ Anime Cards   │  │ Anime Detail     │  │
│  │ Selection    │  │ (3 results)   │  │ Drawer           │  │
│  └──────────────┘  └───────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                        HTTP Requests
                              │
┌─────────────────────────────────────────────────────────────┐
│                   FastAPI Backend                           │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────────┐  │
│  │ POST         │  │ POST          │  │ GET              │  │
│  │ /suggest     │  │ /recommend    │  │ /anime/{id}      │  │
│  └──────────────┘  └───────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
    ┌────┴────┐          ┌────┴────┐          ┌────┴────┐
    │ Ollama  │          │ Ollama  │          │ Jikan   │
    │ llama3.2│          │ llama3.2│          │ API     │
    └─────────┘          └─────────┘          └─────────┘
```

---

## Project Structure

```
ai_anime_advisor/
├── 🚀 start.sh                      # One-click setup & launch
├── 🐳 docker-compose.yml            # Production containers
├── 🐳 docker-compose.dev.yml        # Development containers
├── 📦 backend/
│   ├── 🐍 main.py                   # FastAPI app entry
│   ├── 📋 requirements.txt          # Python dependencies
│   ├── 🐳 Dockerfile                # Backend container
│   ├── routers/
│   │   ├── 💡 suggest.py            # Keyword suggestions
│   │   ├── 🎬 recommend.py          # Anime recommendations
│   │   └── 📖 anime.py              # Anime details
│   ├── services/
│   │   ├── 🦙 ollama_service.py     # Ollama AI integration
│   │   └── 🌐 jikan_service.py      # MAL API wrapper
│   └── models/
│       └── 📝 schemas.py            # Pydantic models
├── 📦 frontend/
│   ├── 🐳 Dockerfile                # Frontend container
│   ├── 📦 package.json              # Node dependencies
│   ├── src/
│   │   ├── app/
│   │   │   ├── 🏠 layout.tsx        # Root layout
│   │   │   ├── 📄 page.tsx          # Main advisor page
│   │   │   └── 🎨 globals.css       # Anime theme styles
│   │   ├── components/
│   │   │   ├── ui/                  # shadcn components
│   │   │   ├── 🏷️ keyword-cloud.tsx # Clickable keywords
│   │   │   ├── 🎴 anime-card.tsx    # Anime result card
│   │   │   ├── 📋 anime-drawer.tsx  # Detail drawer
│   │   │   ├── 💬 chat-bubble.tsx   # AI message
│   │   │   └── 🌸 sakura-bg.tsx     # Animated background
│   │   ├── lib/
│   │   │   ├── 🔧 utils.ts          # Utilities
│   │   │   └── 🌐 api.ts            # API client
│   │   └── types/
│   │       └── 📝 anime.ts          # TypeScript types
│   └── public/
└── 📖 README.md
```

---

## Quick Start

### Prerequisites

- 🐳 **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop)
- 🦙 **Ollama** - [Download](https://ollama.ai)
- 🟢 **Node.js 18+** - [Download](https://nodejs.org) (for dev mode)

### One-Command Launch 🎯

```bash
./start.sh
```

This script automatically:

1. ✅ Checks for Docker, Ollama, and pnpm
2. 🦙 Pulls llama3.2 model if needed
3. 📦 Installs all dependencies
4. 🚀 Starts backend on **<http://localhost:8000>**
5. 🎨 Starts frontend on **<http://localhost:3000>**
6. 🌐 Opens your browser

---

## How It Works

### The Recommendation Flow

```
🎬 Start
    │
    ▼
┌──────────────────┐
│  Select Genres   │  Action, Romance, Fantasy, etc.
└──────────────────┘
    │
    ▼
┌──────────────────┐
│  AI Suggests     │  More specific: Isekai, Dark Fantasy, etc.
│  New Keywords    │
└──────────────────┘
    │
    ▼ (repeat 2-3 times)
┌──────────────────┐
│  Get 3 Anime     │  Perfect matches for your taste
│  Recommendations │
└──────────────────┘
    │
    ▼
┌──────────────────┐
│  View Details    │  Synopsis, ratings, episodes, trailer
└──────────────────┘
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/suggest` | POST | Get keyword suggestions based on selections |
| `/api/recommend` | POST | Get 3 anime recommendations |
| `/api/anime/{id}` | GET | Get detailed anime info from MAL |
| `/health` | GET | Backend health check |

---

## Scripts

| Command | Description |
|---------|-------------|
| `./start.sh` | Start in development mode |
| `./start.sh --prod` | Build and run in production |
| `./start.sh --build` | Build Docker images only |
| `./start.sh --stop` | Stop all services |

---

## Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| 🌸 Anime Pink | `#FF6B9D` | Primary accent, highlights |
| 💜 Anime Purple | `#C084FC` | Secondary accent |
| 💙 Anime Blue | `#60A5FA` | Tertiary accent |
| ⚫ Dark | `#1a1625` | Background |
| ⚫ Card | `#2d2640` | Card backgrounds |
| 🌸 Sakura | `#FFB7C5` | Petal animations |

### Effects

- **Glassmorphism**: Frosted glass cards with blur
- **Sakura Petals**: Falling animation in background
- **Gradient Text**: Pink → Purple → Blue
- **Hover Glow**: Soft pink glow on interactive elements

---

## Manual Setup

<details>
<summary>Click to expand manual setup instructions</summary>

### 1. Start Ollama

```bash
ollama serve &
ollama pull llama3.2
```

### 2. Start Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. Start Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

</details>

---

## Troubleshooting

### Ollama not responding

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Restart Ollama
ollama serve
```

### Port already in use

```bash
# Find process using port
lsof -i :3000
lsof -i :8000

# Kill it
kill -9 <PID>
```

### No recommendations appearing

- Ensure Ollama has llama3.2 model: `ollama list`
- Check backend logs for errors
- Verify Jikan API is accessible (not rate limited)

---

## License

This project is open source and available for personal/educational use.

---

## Acknowledgments

- 🦙 [Ollama](https://ollama.ai) - Local LLM runtime
- 🎬 [Jikan API](https://jikan.moe) - MyAnimeList unofficial API
- ⚛️ [Next.js](https://nextjs.org) - React framework
- 🎨 [shadcn/ui](https://ui.shadcn.com) - UI components
- 🚀 [FastAPI](https://fastapi.tiangolo.com) - Python API framework
- 💡 [Lucide](https://lucide.dev) - Beautiful icons

---

<p align="center">
  Made with 🌸 by <strong>Samy DJEMILI</strong>
</p>

<p align="center">
  <a href="#top">⬆️ Back to top</a>
</p>
