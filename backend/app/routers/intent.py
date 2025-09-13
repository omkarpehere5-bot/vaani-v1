from fastapi import APIRouter
from ...app.schemas import IntentInput, IntentOut

router = APIRouter(prefix="/intent", tags=["intent"])


@router.post("/parse", response_model=IntentOut)
def parse_intent(body: IntentInput):
    text = body.text.lower()
    intent = "unknown"
    entities = {}
    confidence = 0.5
    if "remind me" in text or "set a reminder" in text:
        intent = "create_reminder"
        confidence = 0.82
    elif text.startswith("create note") or "note" in text:
        intent = "create_note"
        confidence = 0.78
    elif text.startswith("open"):
        intent = "open_app"
        entities["app"] = text.replace("open", "").strip()
        confidence = 0.7
    elif any(k in text for k in ["what's the time", "what is the time", "current time", "time now", "tell me the time", "kya time", "samay", "waqt"]):
        intent = "get_time"
        confidence = 0.88
    elif any(k in text for k in ["what's the date", "what is the date", "today's date", "current date", "aaj ki tareekh", "date today", "date now", "what day is it", "which day is it"]):
        intent = "get_date"
        confidence = 0.88
    return IntentOut(intent=intent, confidence=confidence, entities=entities)
