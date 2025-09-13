from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
import locale
from ...app.db import get_db
from ...app.schemas import ChatInput, ChatResponse
from ...app.models import History
from ...app.security import encrypt_value

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
def chat(input: ChatInput, db: Session = Depends(get_db)):
    user_text = input.message.strip()
    lower = user_text.lower()

    # Local date/time support for fast responses
    reply = None
    if any(k in lower for k in ["what's the time", "what is the time", "current time", "time now", "tell me the time", "kya time", "samay", "waqt"]):
        now = datetime.now()
        reply = f"The current time is {now.strftime('%I:%M %p')}"
    elif any(k in lower for k in ["what's the date", "what is the date", "today's date", "current date", "aaj ki tareekh", "date today", "date now"]):
        now = datetime.now()
        reply = f"Today's date is {now.strftime('%A, %B %d, %Y')}"
    elif any(k in lower for k in ["what day is it", "what's the day", "which day is it", "today is which day"]):
        now = datetime.now()
        reply = f"Today is {now.strftime('%A')}"
    elif lower.startswith("set a reminder"):
        reply = "Sure, I can set a reminder. What date and time?"
    elif lower.startswith("create note") or "note" in lower:
        reply = "Got it, what's the note title and content?"

    if reply is None:
        reply = f"You said: {user_text}. How can I help further?"

    # Store history encrypted (no user linkage in this simple path)
    db.add(History(user_id=0, role="user", content_enc=encrypt_value(user_text)))
    db.add(History(user_id=0, role="assistant", content_enc=encrypt_value(reply)))
    db.commit()

    return ChatResponse(reply=reply, session_id=input.session_id)
