from pydantic import BaseModel


class KeywordRequest(BaseModel):
    keywords: list[str] = []


class KeywordResponse(BaseModel):
    suggestions: list[str]
    message: str


class AnimeRecommendation(BaseModel):
    title: str
    mal_id: int | None = None
    reason: str
    image_url: str | None = None
    score: float | None = None


class RecommendRequest(BaseModel):
    keywords: list[str]


class RecommendResponse(BaseModel):
    anime: list[AnimeRecommendation]
    message: str


class AnimeGenre(BaseModel):
    mal_id: int
    name: str


class AnimeStudio(BaseModel):
    mal_id: int
    name: str


class AnimeDetail(BaseModel):
    mal_id: int
    title: str
    title_japanese: str | None = None
    synopsis: str | None = None
    score: float | None = None
    scored_by: int | None = None
    rank: int | None = None
    popularity: int | None = None
    episodes: int | None = None
    status: str | None = None
    aired: str | None = None
    duration: str | None = None
    rating: str | None = None
    genres: list[AnimeGenre] = []
    studios: list[AnimeStudio] = []
    image_url: str | None = None
    trailer_url: str | None = None


class HealthResponse(BaseModel):
    status: str
    ollama: bool
    message: str


class ChatRequest(BaseModel):
    message: str
    selected_keywords: list[str] = []


class ChatResponse(BaseModel):
    reply: str
    suggestions: list[str]
    ready_for_recommendations: bool
