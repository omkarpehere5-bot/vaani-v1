from typing import Optional, Tuple
from ..config import get_settings
from fastapi import HTTPException
import base64

settings = get_settings()


def transcribe_wav_bytes(data: bytes) -> str:
    # Minimal stub: Return a fixed acknowledgement with byte size
    # Replace with real engine integration when available
    if settings.stt_engine.lower() == "none":
        return ""
    # Engines could be integrated here (vosk/whispercpp/openai)
    return ""


def synthesize_speech(text: str, voice: Optional[str] = None) -> Tuple[str, Optional[str]]:
    engine = settings.tts_engine.lower()
    if engine == "none":
        return (engine, None)
    # If implementing offline engines, return base64 audio here
    return (engine, None)
