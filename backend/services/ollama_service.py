import json
import os
import re

from ollama import AsyncClient

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
CHAT_MODEL = os.getenv("CHAT_MODEL", "llama3.2")

client = AsyncClient(host=OLLAMA_HOST)


async def check_ollama_health() -> bool:
    try:
        await client.list()
        return True
    except Exception:
        return False


def extract_json_array(text: str) -> list:
    """Extract JSON array from LLM response, handling markdown code blocks."""
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"```(?:json)?\n?", "", text)
        text = text.strip()

    match = re.search(r"\[[\s\S]*\]", text)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass
    return []


INITIAL_KEYWORDS = [
    "Action",
    "Romance",
    "Comedy",
    "Drama",
    "Fantasy",
    "Sci-Fi",
    "Slice of Life",
    "Horror",
    "Mystery",
    "Sports",
    "Mecha",
    "Psychological",
]


async def suggest_keywords(selected: list[str]) -> tuple[list[str], str]:
    """Generate keyword suggestions based on user's current selections."""
    if not selected:
        return INITIAL_KEYWORDS, "What kind of anime are you in the mood for? Select one or more genres to get started!"

    prompt = f"""You are an anime recommendation assistant helping users find their perfect anime.

The user has selected these preferences so far: {', '.join(selected)}

Based on their selections, suggest 6-8 NEW keywords that would help narrow down their taste further.
Do NOT repeat any keywords they've already selected.

Focus on:
- If they selected genres: suggest specific sub-genres, themes, or moods
- If they selected themes: suggest character types, settings, or story elements
- Be specific and interesting (e.g., "Overpowered MC", "Found Family", "Tournament Arc", "Dark Fantasy")

Respond with ONLY a JSON array of keyword strings, nothing else.
Example: ["Isekai", "Magic System", "Underdog Story", "Epic Battles", "Plot Twists", "Emotional"]"""

    try:
        response = await client.chat(
            model=CHAT_MODEL,
            messages=[{"role": "user", "content": prompt}],
        )

        keywords = extract_json_array(response.message.content)
        if keywords:
            filtered = [k for k in keywords if k not in selected]
            message = _get_refinement_message(len(selected))
            return filtered[:8], message
    except Exception as e:
        print(f"Ollama error: {e}")

    return _get_fallback_keywords(selected), "Here are some more options to consider!"


def _get_refinement_message(selection_count: int) -> str:
    if selection_count == 1:
        return "Great choice! Here are some themes and elements that might interest you."
    elif selection_count == 2:
        return "Nice combination! Let's get more specific about what you're looking for."
    elif selection_count <= 4:
        return "We're getting closer! Pick a few more to refine your preferences."
    else:
        return "Excellent taste! Just a couple more selections and I'll have perfect recommendations for you."


def _get_fallback_keywords(selected: list[str]) -> list[str]:
    """Fallback keywords if Ollama fails."""
    all_fallbacks = [
        "Isekai", "Time Travel", "Supernatural", "School Life",
        "Martial Arts", "Music", "Military", "Historical",
        "Overpowered MC", "Underdog", "Anti-Hero", "Ensemble Cast",
        "Dark", "Lighthearted", "Emotional", "Thrilling",
        "World Building", "Character Development", "Plot Twists", "Mind Games",
    ]
    return [k for k in all_fallbacks if k not in selected][:8]


async def recommend_anime(keywords: list[str]) -> tuple[list[dict], str]:
    """Generate anime recommendations based on selected keywords."""
    prompt = f"""You are an anime expert. Based on these user preferences, recommend exactly 3 anime that would be a perfect match.

User preferences: {', '.join(keywords)}

Requirements:
1. Recommend well-known, highly-rated anime that exist on MyAnimeList
2. Each recommendation should strongly match the user's preferences
3. Provide variety - don't recommend sequels or very similar anime

Respond with ONLY a JSON array of objects, each with:
- "title": the exact official English or Romaji title (as it appears on MyAnimeList)
- "reason": one sentence explaining why this matches their preferences

Example:
[
  {{"title": "Fullmetal Alchemist: Brotherhood", "reason": "Epic fantasy adventure with deep themes and incredible world-building"}},
  {{"title": "Steins;Gate", "reason": "Mind-bending sci-fi thriller with unforgettable characters"}},
  {{"title": "Mob Psycho 100", "reason": "Action-comedy with an overpowered protagonist and heartfelt moments"}}
]"""

    try:
        response = await client.chat(
            model=CHAT_MODEL,
            messages=[{"role": "user", "content": prompt}],
        )

        anime_list = extract_json_array(response.message.content)
        if anime_list and len(anime_list) >= 1:
            return anime_list[:3], "Based on your preferences, I think you'll love these anime!"
    except Exception as e:
        print(f"Ollama error: {e}")

    return _get_fallback_recommendations(), "Here are some highly-rated anime that might interest you!"


def _get_fallback_recommendations() -> list[dict]:
    """Fallback recommendations if Ollama fails."""
    return [
        {"title": "Attack on Titan", "reason": "Intense action with deep plot and character development"},
        {"title": "Death Note", "reason": "Psychological thriller with mind games and moral ambiguity"},
        {"title": "My Hero Academia", "reason": "Action-packed superhero story with heart and humor"},
    ]


async def process_chat_message(message: str, selected_keywords: list[str]) -> dict:
    """Process a chat message and extract keywords or provide suggestions."""

    prompt = f"""You are a friendly anime recommendation assistant. The user is looking for anime recommendations.

User's message: "{message}"
Already selected keywords: {', '.join(selected_keywords) if selected_keywords else 'None yet'}

Your task:
1. Understand what the user is looking for
2. Extract or suggest relevant anime keywords/tags based on their message
3. Provide a friendly, conversational reply

Respond with a JSON object containing:
- "reply": A friendly 1-2 sentence response acknowledging their preferences
- "keywords": An array of 4-8 relevant anime keywords extracted from or inspired by their message (genres, themes, moods, tropes like "Isekai", "Romance", "Dark Fantasy", "Overpowered MC", etc.)
- "ready": true if you have enough info to recommend anime (at least 3 clear preferences), false otherwise

Example response:
{{"reply": "Oh, you're into action-packed adventures with strong characters! Let me find some perfect matches.", "keywords": ["Action", "Adventure", "Strong MC", "Epic Battles"], "ready": false}}

Respond with ONLY the JSON object, nothing else."""

    try:
        response = await client.chat(
            model=CHAT_MODEL,
            messages=[{"role": "user", "content": prompt}],
        )

        # Try to parse JSON from response
        text = response.message.content.strip()
        if text.startswith("```"):
            text = re.sub(r"```(?:json)?\n?", "", text)
            text = text.strip()

        # Find JSON object
        match = re.search(r"\{[\s\S]*\}", text)
        if match:
            data = json.loads(match.group())
            return {
                "reply": data.get("reply", "I'd love to help you find great anime!"),
                "suggestions": data.get("keywords", [])[:8],
                "ready_for_recommendations": data.get("ready", False),
            }
    except Exception as e:
        print(f"Ollama chat error: {e}")

    # Fallback response
    return {
        "reply": "I'd love to help you find your next favorite anime! What genres or themes interest you?",
        "suggestions": ["Action", "Romance", "Comedy", "Fantasy", "Sci-Fi", "Mystery"],
        "ready_for_recommendations": False,
    }
