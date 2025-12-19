from fastapi import APIRouter

from models.schemas import ChatRequest, ChatResponse
from services.ollama_service import process_chat_message

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Process a chat message and return keywords or recommendations."""
    result = await process_chat_message(request.message, request.selected_keywords)
    return result
