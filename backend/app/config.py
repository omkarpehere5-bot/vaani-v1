from pydantic import BaseSettings, AnyUrl
from functools import lru_cache
from typing import List, Optional
import os

class Settings(BaseSettings):
    app_name: str = "Vaani Backend"
    environment: str = os.getenv("NODE_ENV", "development")
    api_prefix: str = "/api"

    secret_key: str = os.getenv("SECRET_KEY", "dev-secret-key-change-me")
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24

    # Fernet encryption key (urlsafe base64 32-byte key)
    fernet_key: Optional[str] = os.getenv("FERNET_KEY")

    # Database
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///backend/data/app.db")

    # CORS
    cors_origins: List[str] = [
        os.getenv("FRONTEND_ORIGIN", "http://localhost:3000"),
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    # STT/TTS/AI providers
    stt_engine: str = os.getenv("STT_ENGINE", "none")  # vosk | whispercpp | openai | none
    openai_api_key: Optional[str] = os.getenv("OPENAI_API_KEY")

    tts_engine: str = os.getenv("TTS_ENGINE", "none")  # pyttsx3 | coqui | elevenlabs | openai | none
    elevenlabs_api_key: Optional[str] = os.getenv("ELEVENLABS_API_KEY")

    wake_word: str = os.getenv("WAKE_WORD", "hey vaani")

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache
def get_settings() -> Settings:
    return Settings()
