from fastapi import APIRouter

from models.schemas import AnimeRecommendation, RecommendRequest, RecommendResponse
from services.jikan_service import enrich_recommendation
from services.ollama_service import recommend_anime

router = APIRouter()


@router.post("/recommend", response_model=RecommendResponse)
async def get_recommendations(request: RecommendRequest):
    """Get anime recommendations based on selected keywords."""
    anime_list, message = await recommend_anime(request.keywords)

    enriched_anime = []
    for anime in anime_list:
        enrichment = await enrich_recommendation(anime["title"])
        enriched_anime.append(
            AnimeRecommendation(
                title=anime["title"],
                reason=anime["reason"],
                mal_id=enrichment["mal_id"],
                image_url=enrichment["image_url"],
                score=enrichment["score"],
            )
        )

    return RecommendResponse(anime=enriched_anime, message=message)
