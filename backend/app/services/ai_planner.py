import json
from typing import Any

from openai import OpenAI

from app.config import get_settings
from app.schemas import RoadmapResponse


settings = get_settings()
client = OpenAI(api_key=settings.openai_api_key) if settings.openai_api_key else None


def build_roadmap(
    goal: str,
    level: str,
    budget: str,
    hours_per_week: int,
    resources: list[dict[str, Any]],
) -> RoadmapResponse:
    if not settings.openai_api_key or client is None:
        return RoadmapResponse(
            goal=goal,
            summary=f"A practical learning roadmap for becoming proficient in {goal}.",
            skill_gaps=[
                f"{goal} fundamentals",
                "Hands-on project development",
                "Testing and deployment",
            ],
            recommended_duration_weeks=12,
            steps=[
                {
                    "title": "Build the foundations",
                    "objective": f"Learn the core concepts required for {goal}.",
                    "estimated_hours": hours_per_week * 3,
                    "skills": [f"{goal} fundamentals"],
                    "resources": resources[:3],
                },
                {
                    "title": "Build a practical project",
                    "objective": "Apply the concepts in a realistic project.",
                    "estimated_hours": hours_per_week * 5,
                    "skills": ["Problem solving", "Implementation"],
                    "resources": resources[3:6],
                },
            ],
        )

    prompt = f"""
Create a personalized learning roadmap.

Goal: {goal}
Current level: {level}
Budget: {budget}
Hours per week: {hours_per_week}

Available resources:
{json.dumps(resources, indent=2)}

Requirements:
- Identify realistic skill gaps.
- Create 3 to 6 ordered learning steps.
- Prefer free resources when the budget is free.
- Include videos, courses, projects, notes, or practice activities.
- Estimate hours for each step.
- Rank resources using quality, relevance, credibility, practical value, and price.
- Return only valid JSON matching the requested schema.
"""

    completion = client.chat.completions.parse(
        model=settings.openai_model,
        temperature=0.2,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an expert learning-path designer. "
                    "Do not invent URLs. Use only supplied resources."
                ),
            },
            {"role": "user", "content": prompt},
        ],
        response_format=RoadmapResponse,
    )

    parsed = completion.choices[0].message.parsed

    if parsed is None:
        raise ValueError("The AI response could not be parsed.")

    return parsed
