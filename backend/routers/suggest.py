from fastapi import APIRouter

from models.schemas import KeywordRequest, KeywordResponse
from services.ollama_service import suggest_keywords

router = APIRouter()


@router.post("/suggest", response_model=KeywordResponse)
async def get_suggestions(request: KeywordRequest):
    """Get keyword suggestions based on current selections."""
    suggestions, message = await suggest_keywords(request.keywords)
    return KeywordResponse(suggestions=suggestions, message=message)
