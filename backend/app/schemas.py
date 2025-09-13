from datetime import datetime, timedelta
from pydantic import BaseModel, EmailStr
from typing import Optional, List


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserBase(BaseModel):
    name: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserOut(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class LoginInput(BaseModel):
    email: EmailStr
    password: str


class NoteBase(BaseModel):
    title: str
    content: str


class NoteCreate(NoteBase):
    pass


class NoteOut(NoteBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ReminderBase(BaseModel):
    datetime: datetime
    repeat: Optional[str] = None
    message: str
    location: Optional[str] = None


class ReminderCreate(ReminderBase):
    pass


class ReminderOut(ReminderBase):
    id: int
    user_id: int
    is_active: bool

    class Config:
        from_attributes = True


class ChatInput(BaseModel):
    message: str
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    reply: str
    session_id: Optional[str] = None


class IntentInput(BaseModel):
    text: str


class IntentOut(BaseModel):
    intent: str
    confidence: float
    entities: dict


class OCRResponse(BaseModel):
    text: str


class DescribeResponse(BaseModel):
    description: str


class TTSInput(BaseModel):
    text: str
    voice: Optional[str] = None


class TTSResponse(BaseModel):
    engine: str
    message: str
    audio_base64: Optional[str] = None
