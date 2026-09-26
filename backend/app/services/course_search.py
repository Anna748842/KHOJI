from typing import Any

import httpx

from app.config import get_settings


settings = get_settings()


async def search_youtube(query: str, max_results: int = 5) -> list[dict[str, Any]]:
    if not settings.youtube_api_key:
        return []

    params = {
        "part": "snippet",
        "q": query,
        "type": "video",
        "maxResults": max_results,
        "order": "relevance",
        "key": settings.youtube_api_key,
    }

    async with httpx.AsyncClient(timeout=20) as client:
        response = await client.get(
            "https://www.googleapis.com/youtube/v3/search",
            params=params,
        )
        response.raise_for_status()
        payload = response.json()

    return [
        {
            "title": item["snippet"]["title"],
            "provider": "YouTube",
            "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}",
            "resource_type": "video",
            "description": item["snippet"]["description"],
            "difficulty": "unknown",
            "estimated_hours": 1,
            "price": "Free",
            "quality_score": 70,
        }
        for item in payload.get("items", [])
        if item.get("id", {}).get("videoId")
    ]


async def search_tavily(query: str, max_results: int = 5) -> list[dict[str, Any]]:
    if not settings.tavily_api_key:
        return []

    async with httpx.AsyncClient(timeout=20) as client:
        response = await client.post(
            "https://api.tavily.com/search",
            json={
                "api_key": settings.tavily_api_key,
                "query": query,
                "search_depth": "advanced",
                "max_results": max_results,
                "include_answer": False,
            },
        )
        response.raise_for_status()
        payload = response.json()

    return [
        {
            "title": result["title"],
            "provider": "Web",
            "url": result["url"],
            "resource_type": "article",
            "description": result.get("content", ""),
            "difficulty": "unknown",
            "estimated_hours": 1,
            "price": "Free",
            "quality_score": 65,
        }
        for result in payload.get("results", [])
    ]


async def search_resources(goal: str, skill: str) -> list[dict[str, Any]]:
    query = f"{goal} {skill} course tutorial project"

    youtube_results, web_results = await __import__("asyncio").gather(
        search_youtube(query),
        search_tavily(query),
    )

    return youtube_results + web_results
