from fastapi import APIRouter, UploadFile, File
from ..utils.audio import transcribe_wav_bytes

router = APIRouter(prefix="/stt", tags=["stt"])


@router.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    data = await file.read()
    text = transcribe_wav_bytes(data)
    return {"text": text}
