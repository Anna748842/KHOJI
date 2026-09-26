
from typing import Literal
from pydantic import BaseModel, Field


class RoadmapRequest(BaseModel):
    goal: str = Field(min_length=3, max_length=300)
    level: Literal["beginner", "intermediate", "advanced"] = "beginner"
    budget: Literal["free", "low", "flexible"] = "free"
    hours_per_week: int = Field(default=5, ge=1, le=40)


class Resource(BaseModel):
    title: str
    provider: str
    url: str
    resource_type: Literal[
        "course",
        "video",
        "project",
        "article",
        "practice",
        "book",
    ]
    description: str
    difficulty: str
    estimated_hours: float
    price: str
    quality_score: float = Field(ge=0, le=100)


class RoadmapStep(BaseModel):
    title: str
    objective: str
    estimated_hours: float
    skills: list[str]
    resources: list[Resource]


class RoadmapResponse(BaseModel):
    goal: str
    summary: str
    skill_gaps: list[str]
    recommended_duration_weeks: int
    steps: list[RoadmapStep]