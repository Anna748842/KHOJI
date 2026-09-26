from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, Integer, JSON, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Roadmap(Base):
    __tablename__ = "roadmaps"

    id: Mapped[UUID] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid4()),
    )
    goal: Mapped[str] = mapped_column(String(300))
    level: Mapped[str] = mapped_column(String(30))
    budget: Mapped[str] = mapped_column(String(30))
    hours_per_week: Mapped[int] = mapped_column(Integer)
    result: Mapped[dict] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )


class Resource(Base):
    __tablename__ = "resources"

    id: Mapped[UUID] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid4()),
    )
    title: Mapped[str] = mapped_column(String(500))
    provider: Mapped[str] = mapped_column(String(100))
    url: Mapped[str] = mapped_column(Text)
    resource_type: Mapped[str] = mapped_column(String(50))
    metadata_json: Mapped[dict] = mapped_column(JSON, default=dict)