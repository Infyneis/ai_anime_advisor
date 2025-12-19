from fastapi import APIRouter, HTTPException

from models.schemas import AnimeDetail
from services.jikan_service import get_anime_by_id

router = APIRouter()


@router.get("/anime/{mal_id}", response_model=AnimeDetail)
async def get_anime_details(mal_id: int):
    """Get detailed anime information by MAL ID."""
    anime = await get_anime_by_id(mal_id)

    if not anime:
        raise HTTPException(status_code=404, detail="Anime not found")

    return anime
