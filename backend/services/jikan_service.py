import asyncio
from typing import Any

import httpx

from models.schemas import AnimeDetail, AnimeGenre, AnimeStudio

JIKAN_BASE_URL = "https://api.jikan.moe/v4"

_last_request_time = 0
_rate_limit_delay = 0.4


async def _rate_limit():
    """Ensure we don't exceed Jikan's rate limit (3 requests per second)."""
    global _last_request_time
    current_time = asyncio.get_event_loop().time()
    time_since_last = current_time - _last_request_time
    if time_since_last < _rate_limit_delay:
        await asyncio.sleep(_rate_limit_delay - time_since_last)
    _last_request_time = asyncio.get_event_loop().time()


async def search_anime(title: str) -> dict | None:
    """Search for an anime by title and return the best match."""
    await _rate_limit()

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.get(
                f"{JIKAN_BASE_URL}/anime",
                params={"q": title, "limit": 1, "sfw": True},
            )
            response.raise_for_status()
            data = response.json()

            if data.get("data") and len(data["data"]) > 0:
                return data["data"][0]
        except Exception as e:
            print(f"Jikan search error: {e}")

    return None


async def get_anime_by_id(mal_id: int) -> AnimeDetail | None:
    """Fetch detailed anime information by MAL ID."""
    await _rate_limit()

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.get(f"{JIKAN_BASE_URL}/anime/{mal_id}")
            response.raise_for_status()
            data = response.json()

            if data.get("data"):
                return _parse_anime_data(data["data"])
        except Exception as e:
            print(f"Jikan fetch error: {e}")

    return None


def _parse_anime_data(data: dict[str, Any]) -> AnimeDetail:
    """Parse Jikan API response into AnimeDetail model."""
    images = data.get("images", {})
    image_url = images.get("jpg", {}).get("large_image_url") or images.get("jpg", {}).get("image_url")

    trailer = data.get("trailer", {})
    trailer_url = trailer.get("embed_url") if trailer else None

    aired = data.get("aired", {})
    aired_string = aired.get("string") if aired else None

    genres = [
        AnimeGenre(mal_id=g["mal_id"], name=g["name"])
        for g in data.get("genres", [])
    ]

    studios = [
        AnimeStudio(mal_id=s["mal_id"], name=s["name"])
        for s in data.get("studios", [])
    ]

    return AnimeDetail(
        mal_id=data["mal_id"],
        title=data.get("title", "Unknown"),
        title_japanese=data.get("title_japanese"),
        synopsis=data.get("synopsis"),
        score=data.get("score"),
        scored_by=data.get("scored_by"),
        rank=data.get("rank"),
        popularity=data.get("popularity"),
        episodes=data.get("episodes"),
        status=data.get("status"),
        aired=aired_string,
        duration=data.get("duration"),
        rating=data.get("rating"),
        genres=genres,
        studios=studios,
        image_url=image_url,
        trailer_url=trailer_url,
    )


async def enrich_recommendation(title: str) -> dict:
    """Search for an anime and return enriched data with MAL ID and image."""
    anime_data = await search_anime(title)

    if anime_data:
        images = anime_data.get("images", {})
        image_url = images.get("jpg", {}).get("large_image_url") or images.get("jpg", {}).get("image_url")

        return {
            "mal_id": anime_data["mal_id"],
            "image_url": image_url,
            "score": anime_data.get("score"),
        }

    return {"mal_id": None, "image_url": None, "score": None}
