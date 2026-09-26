
import os
from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    app_name: str = "LearnPath AI"
    database_url: str = "sqlite:///./learnpath.db"
    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"
    youtube_api_key: str = ""
    tavily_api_key: str = ""
    frontend_url: str = "http://localhost:3000"

    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    use_postgres = os.getenv("USE_POSTGRES", "").strip().lower() in {"1", "true", "yes", "on"}
    if (
        not use_postgres
        and settings.database_url.lower().startswith("postgres")
    ):
        settings.database_url = "sqlite:///./learnpath.db"
    return settings