from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Roadmap
from app.schemas import RoadmapRequest, RoadmapResponse
from app.services.ai_planner import build_roadmap
from app.services.course_search import search_resources


router = APIRouter(prefix="/api/roadmaps", tags=["roadmaps"])


@router.post("", response_model=RoadmapResponse)
async def create_roadmap(
    request: RoadmapRequest,
    db: Session = Depends(get_db),
) -> RoadmapResponse:
    initial_resources = await search_resources(
        goal=request.goal,
        skill=request.goal,
    )

    roadmap = build_roadmap(
        goal=request.goal,
        level=request.level,
        budget=request.budget,
        hours_per_week=request.hours_per_week,
        resources=initial_resources,
    )

    db_record = Roadmap(
        goal=request.goal,
        level=request.level,
        budget=request.budget,
        hours_per_week=request.hours_per_week,
        result=roadmap.model_dump(mode="json"),
    )

    db.add(db_record)
    db.commit()

    return roadmap