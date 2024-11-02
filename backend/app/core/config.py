# external imports
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Literal


# TODO: add proper config (see https://github.com/fastapi/full-stack-fastapi-template at backend/app/core/config.py)
class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        # Use top level .env file (one level above ./backend/)
        env_file="./.env",
        env_ignore_empty=True,
        extra="ignore",
    )
    PROJECT_NAME: str
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: Literal["local", "staging", "production"] = "local"

settings = Settings()  # type: ignore
