import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models.schemas import HealthResponse
from routers import anime, chat, recommend, suggest
from services.ollama_service import check_ollama_health

load_dotenv()

app = FastAPI(
    title="AI Anime Advisor API",
    description="Backend API for AI-powered anime recommendations",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(suggest.router, prefix="/api", tags=["suggestions"])
app.include_router(recommend.router, prefix="/api", tags=["recommendations"])
app.include_router(anime.router, prefix="/api", tags=["anime"])
app.include_router(chat.router, prefix="/api", tags=["chat"])


@app.get("/health", response_model=HealthResponse)
async def health_check():
    ollama_ok = await check_ollama_health()
    return HealthResponse(
        status="healthy" if ollama_ok else "degraded",
        ollama=ollama_ok,
        message="All systems operational" if ollama_ok else "Ollama is not available",
    )


@app.get("/")
async def root():
    return {"message": "AI Anime Advisor API", "docs": "/docs"}
