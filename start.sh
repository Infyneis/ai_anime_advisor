#!/bin/bash

# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║                                                                           ║
# ║   🌸 AI Anime Advisor - Setup & Launch Script 🌸                          ║
# ║                                                                           ║
# ║   Discover your next favorite anime with AI-powered recommendations       ║
# ║                                                                           ║
# ║   Features:                                                               ║
# ║   • 🦙 Local AI with Ollama (llama3.2)                                    ║
# ║   • 🎬 Real anime data from MyAnimeList                                   ║
# ║   • 🎨 Beautiful anime-themed UI                                          ║
# ║   • 🐳 Docker-ready for production                                        ║
# ║                                                                           ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

set -e

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 🎨 Color Palette - Anime-inspired colors for terminal output              │
# └───────────────────────────────────────────────────────────────────────────┘
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
PINK='\033[38;5;213m'
NC='\033[0m' # No Color

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 🛠️  Helper Functions - Pretty printing for a beautiful experience         │
# └───────────────────────────────────────────────────────────────────────────┘

# 📦 Print a decorative header box
print_header() {
  echo ""
  echo -e "${PINK}╔══════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${PINK}║${NC}  ${CYAN}$1${NC}"
  echo -e "${PINK}╚══════════════════════════════════════════════════════════════╝${NC}"
  echo ""
}

# ▶️ Print a step indicator
print_step() {
  echo -e "${BLUE}   ▶${NC} $1"
}

# ✅ Print a success message
print_success() {
  echo -e "${GREEN}   ✓${NC} $1"
}

# ⚠️ Print a warning message
print_warning() {
  echo -e "${YELLOW}   ⚠${NC} $1"
}

# ❌ Print an error message
print_error() {
  echo -e "${RED}   ✗${NC} $1"
}

# 🔍 Check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 📋 Parse Command Line Arguments                                           │
# └───────────────────────────────────────────────────────────────────────────┘
MODE="dev"
for arg in "$@"; do
  case $arg in
  --prod)
    MODE="prod"
    ;;
  --stop)
    MODE="stop"
    ;;
  --build)
    MODE="build"
    ;;
  --help | -h)
    echo ""
    echo -e "${PINK}🌸 AI Anime Advisor - Help${NC}"
    echo ""
    echo "Usage: ./start.sh [options]"
    echo ""
    echo "Options:"
    echo "  --prod   🚀 Build and run in production mode (Docker)"
    echo "  --build  🔨 Build Docker images only"
    echo "  --stop   🛑 Stop all running services"
    echo "  --help   📖 Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./start.sh          # Start in development mode"
    echo "  ./start.sh --prod   # Start in production mode"
    echo "  ./start.sh --stop   # Stop all services"
    echo ""
    exit 0
    ;;
  esac
done

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 🎌 ASCII Art Banner - Welcome to AI Anime Advisor!                        │
# └───────────────────────────────────────────────────────────────────────────┘
clear
echo ""
echo -e "${PINK}"
cat <<"EOF"
                    ⣀⣤⣤⣤⣤⣤⣀
                 ⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦
               ⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧
              ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
             ⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇
             ⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃
              ⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏
                ⠙⢿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋
                   ⠉⠛⠿⠿⠿⠿⠛⠉
EOF
echo -e "${NC}"
echo -e "${PURPLE}     ╔═══════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}     ║${NC}   ${PINK}🌸${NC} ${CYAN}A I   A N I M E   A D V I S O R${NC} ${PINK}🌸${NC}   ${PURPLE}        ║${NC}"
echo -e "${PURPLE}     ╚═══════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "        ${CYAN}✨ Discover your next favorite anime with AI ✨${NC}"
echo ""

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 🛑 Stop Mode - Gracefully shutdown all services                           │
# └───────────────────────────────────────────────────────────────────────────┘
if [ "$MODE" = "stop" ]; then
  print_header "🛑 Stopping All Services"

  print_step "Stopping Docker containers..."
  docker compose down 2>/dev/null || true

  print_success "All services have been stopped"
  echo ""
  echo -e "   ${CYAN}Thank you for using AI Anime Advisor! 🌸${NC}"
  echo -e "   ${CYAN}See you next time! じゃあね！${NC}"
  echo ""
  exit 0
fi

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 🔍 Dependency Check - Making sure everything is ready                     │
# └───────────────────────────────────────────────────────────────────────────┘
print_header "🔍 Checking Dependencies"

# 🐳 Docker Check
print_step "Looking for Docker..."
if ! command_exists docker; then
  print_error "Docker is not installed!"
  echo ""
  echo -e "   ${YELLOW}📥 Please install Docker Desktop:${NC}"
  echo -e "   ${CYAN}   https://www.docker.com/products/docker-desktop${NC}"
  echo ""
  exit 1
fi
print_success "Docker is installed"

# 🐳 Docker Running Check
print_step "Checking if Docker daemon is running..."
if ! docker info >/dev/null 2>&1; then
  print_error "Docker is not running!"
  echo ""
  echo -e "   ${YELLOW}🚀 Please start Docker Desktop and try again${NC}"
  echo ""
  exit 1
fi
print_success "Docker daemon is running"

# 🦙 Ollama Check
print_step "Looking for Ollama..."
if ! command_exists ollama; then
  print_error "Ollama is not installed!"
  echo ""
  echo -e "   ${YELLOW}📥 Please install Ollama:${NC}"
  if [[ "$OSTYPE" == "darwin"* ]]; then
    echo -e "   ${CYAN}   brew install ollama${NC}"
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo -e "   ${CYAN}   curl -fsSL https://ollama.ai/install.sh | sh${NC}"
  fi
  echo -e "   ${CYAN}   Or visit: https://ollama.ai${NC}"
  echo ""
  exit 1
fi
print_success "Ollama is installed"

# 🦙 Ollama Running Check
print_step "Checking if Ollama is running..."
if ! curl -s http://localhost:11434/api/tags >/dev/null 2>&1; then
  print_warning "Ollama is not running, starting it now..."
  ollama serve >/dev/null 2>&1 &
  sleep 3

  if ! curl -s http://localhost:11434/api/tags >/dev/null 2>&1; then
    print_error "Failed to start Ollama!"
    echo ""
    echo -e "   ${YELLOW}🔧 Please start Ollama manually:${NC}"
    echo -e "   ${CYAN}   ollama serve${NC}"
    echo ""
    exit 1
  fi
  print_success "Ollama started successfully"
else
  print_success "Ollama is running"
fi

# 🧠 LLM Model Check
print_step "Checking for llama3.2 model..."
if ! ollama list 2>/dev/null | grep -q "llama3.2"; then
  print_warning "llama3.2 model not found, downloading..."
  echo ""
  echo -e "   ${CYAN}📥 This may take a few minutes (2-4 GB download)${NC}"
  echo ""
  ollama pull llama3.2
  echo ""
fi
print_success "llama3.2 model is ready"

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 🔨 Build Mode - Build Docker images only                                  │
# └───────────────────────────────────────────────────────────────────────────┘
if [ "$MODE" = "build" ]; then
  print_header "🔨 Building Docker Images"

  print_step "Building backend image..."
  docker compose build backend
  print_success "Backend image built"

  print_step "Building frontend image..."
  docker compose build frontend
  print_success "Frontend image built"

  echo ""
  echo -e "   ${GREEN}✨ All Docker images built successfully!${NC}"
  echo ""
  echo -e "   ${CYAN}Run ${YELLOW}./start.sh --prod${CYAN} to start the application${NC}"
  echo ""
  exit 0
fi

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 🚀 Production Mode - Deploy with Docker Compose                           │
# └───────────────────────────────────────────────────────────────────────────┘
if [ "$MODE" = "prod" ]; then
  print_header "🚀 Starting Production Mode"

  print_step "Building and starting containers..."
  docker compose up -d --build

  print_step "Waiting for services to initialize..."
  echo ""

  # ⏳ Animated loading
  for i in {1..10}; do
    echo -ne "\r   ${PINK}🌸${NC} Loading"
    for j in $(seq 1 $i); do echo -n "."; done
    for j in $(seq $i 9); do echo -n " "; done
    sleep 1
  done
  echo ""
  echo ""

  # 🔍 Health Check
  if curl -s http://localhost:8000/health >/dev/null 2>&1; then
    print_success "Backend is healthy"
  else
    print_warning "Backend is still warming up..."
  fi
  print_success "Frontend is ready"

  # 🎉 Success Banner
  echo ""
  echo -e "${PINK}╔═══════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${PINK}║${NC}                                                               ${PINK}║${NC}"
  echo -e "${PINK}║${NC}   ${GREEN}🎉 AI Anime Advisor is now running! 🎉${NC}                     ${PINK}║${NC}"
  echo -e "${PINK}║${NC}                                                               ${PINK}║${NC}"
  echo -e "${PINK}║${NC}   ${CYAN}🌐 Frontend:${NC}  http://localhost:3000                        ${PINK}║${NC}"
  echo -e "${PINK}║${NC}   ${CYAN}🔧 Backend:${NC}   http://localhost:8000                        ${PINK}║${NC}"
  echo -e "${PINK}║${NC}   ${CYAN}📚 API Docs:${NC}  http://localhost:8000/docs                   ${PINK}║${NC}"
  echo -e "${PINK}║${NC}                                                               ${PINK}║${NC}"
  echo -e "${PINK}║${NC}   ${YELLOW}To stop:${NC} ./start.sh --stop                                  ${PINK}║${NC}"
  echo -e "${PINK}║${NC}                                                               ${PINK}║${NC}"
  echo -e "${PINK}╚═══════════════════════════════════════════════════════════════╝${NC}"
  echo ""

  # 🌐 Open browser
  if [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:3000
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open http://localhost:3000 2>/dev/null || true
  fi

  exit 0
fi

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 💻 Development Mode - Local development with hot reload                  │
# └───────────────────────────────────────────────────────────────────────────┘
print_header "💻 Starting Development Mode"

# 📦 pnpm Check
print_step "Looking for pnpm..."
if ! command_exists pnpm; then
  print_warning "pnpm not found, installing..."
  npm install -g pnpm
fi
print_success "pnpm is available"

# 📦 Frontend Dependencies
print_step "Installing frontend dependencies..."
cd frontend
pnpm install --silent
cd ..
print_success "Frontend dependencies installed"

# 🐍 Python Virtual Environment
print_step "Setting up Python environment..."
cd backend
if [ ! -d "venv" ]; then
  python3 -m venv venv
fi
source venv/bin/activate
pip install -q -r requirements.txt
cd ..
print_success "Python environment ready"

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 🚀 Launch Development Servers                                            │
# └───────────────────────────────────────────────────────────────────────────┘
print_header "🚀 Launching Development Servers"

# 🧹 Cleanup function for graceful shutdown
cleanup() {
  echo ""
  echo ""
  print_header "👋 Shutting Down"

  print_step "Stopping backend server..."
  kill $BACKEND_PID 2>/dev/null || true
  print_success "Backend stopped"

  print_step "Stopping frontend server..."
  kill $FRONTEND_PID 2>/dev/null || true
  print_success "Frontend stopped"

  echo ""
  echo -e "   ${CYAN}Thank you for using AI Anime Advisor! 🌸${NC}"
  echo -e "   ${CYAN}Happy anime watching! アニメを楽しんでね！${NC}"
  echo ""
  exit 0
}
trap cleanup SIGINT SIGTERM

# 🔧 Start Backend
print_step "Starting FastAPI backend server..."
cd backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
cd ..

# ⏳ Wait for backend
sleep 3

# 🎨 Start Frontend
print_step "Starting Next.js frontend server..."
cd frontend
pnpm dev &
FRONTEND_PID=$!
cd ..

# ⏳ Wait for frontend
sleep 5

# 🎉 Success Banner
echo ""
echo -e "${PINK}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PINK}║${NC}                                                               ${PINK}║${NC}"
echo -e "${PINK}║${NC}   ${GREEN}🎉 Development servers are running! 🎉${NC}                      ${PINK}║${NC}"
echo -e "${PINK}║${NC}                                                               ${PINK}║${NC}"
echo -e "${PINK}║${NC}   ${CYAN}🎨 Frontend:${NC}  http://localhost:3000                         ${PINK}║${NC}"
echo -e "${PINK}║${NC}   ${CYAN}🔧 Backend:${NC}   http://localhost:8000                         ${PINK}║${NC}"
echo -e "${PINK}║${NC}   ${CYAN}📚 API Docs:${NC}  http://localhost:8000/docs                    ${PINK}║${NC}"
echo -e "${PINK}║${NC}                                                               ${PINK}║${NC}"
echo -e "${PINK}║${NC}   ${YELLOW}🔄 Hot reload is enabled for both servers${NC}                   ${PINK}║${NC}"
echo -e "${PINK}║${NC}   ${YELLOW}⌨️  Press Ctrl+C to stop${NC}                                    ${PINK}║${NC}"
echo -e "${PINK}║${NC}                                                               ${PINK}║${NC}"
echo -e "${PINK}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# 🌐 Open browser
if [[ "$OSTYPE" == "darwin"* ]]; then
  open http://localhost:3000
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  xdg-open http://localhost:3000 2>/dev/null || true
fi

# ⏳ Keep script running
wait $BACKEND_PID $FRONTEND_PID
