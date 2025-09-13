import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import RedirectResponse
from .config import get_settings
from .db import Base, engine
from .routers import auth as auth_router
from .routers import chat as chat_router
from .routers import intent as intent_router
from .routers import notes as notes_router
from .routers import reminders as reminders_router
from .routers import system as system_router
from .routers import tts as tts_router
from .routers import stt as stt_router
from .routers import vision as vision_router

settings = get_settings()

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    openapi_url=f"{settings.api_prefix}/openapi.json",
    docs_url=f"{settings.api_prefix}/docs",
    redoc_url=f"{settings.api_prefix}/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers under /api
app.include_router(auth_router.router, prefix=settings.api_prefix)
app.include_router(chat_router.router, prefix=settings.api_prefix)
app.include_router(intent_router.router, prefix=settings.api_prefix)
app.include_router(notes_router.router, prefix=settings.api_prefix)
app.include_router(reminders_router.router, prefix=settings.api_prefix)
app.include_router(system_router.router, prefix=settings.api_prefix)
app.include_router(tts_router.router, prefix=settings.api_prefix)
app.include_router(stt_router.router, prefix=settings.api_prefix)
app.include_router(vision_router.router, prefix=settings.api_prefix)


@app.get("/")
async def root():
    return RedirectResponse(url=settings.api_prefix + "/docs")


# Simple WS for STT streaming (echo size)
@app.websocket("/ws/stt")
async def ws_stt(websocket: WebSocket):
    await websocket.accept()
    try:
        async for message in websocket.iter_bytes():
            # Echo back a very small JSON with bytes count
            await websocket.send_json({"received_bytes": len(message)})
    except WebSocketDisconnect:
        pass


# Entrypoint (for uvicorn: uvicorn backend.app.main:app --reload)
