from fastapi import APIRouter
from ..schemas import TTSInput, TTSResponse
from ..utils.audio import synthesize_speech
from ..config import get_settings

router = APIRouter(prefix="/tts", tags=["tts"])


@router.get("/voices")
def voices():
    # Minimal static list; extend when engines are configured
    return {"voices": ["default", "female", "male"]}


@router.post("/speak", response_model=TTSResponse)
def speak(body: TTSInput):
    engine, audio_b64 = synthesize_speech(body.text, body.voice)
    if audio_b64:
        return TTSResponse(engine=engine, message="ok", audio_base64=audio_b64)
    # If no engine configured, indicate that frontend should fallback
    return TTSResponse(engine=engine, message="tts_unavailable", audio_base64=None)
