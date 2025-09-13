# API Specification (Overview)

Base URL: http://localhost:8000/api
OpenAPI: /api/openapi.json (auto-generated)

Auth
- POST /auth/register – { name, email, password } → User
- POST /auth/login – form { username=email, password } → { access_token }
- GET /auth/me – bearer token → User

Chat & Intent
- POST /chat – { message, session_id? } → { reply, session_id? }
- POST /intent/parse – { text } → { intent, confidence, entities }

STT
- WS /ws/stt – binary audio frames → { received_bytes }
- POST /stt/transcribe – multipart file → { text }

TTS
- GET /tts/voices → { voices: string[] }
- POST /tts/speak – { text, voice? } → { engine, message, audio_base64? }

Vision
- POST /vision/ocr – file → { text }
- POST /vision/describe – file → { description }

Notes
- POST /notes – { title, content } → Note
- GET /notes → Note[]
- GET /notes/{id} → Note
- PUT /notes/{id} – { title, content } → Note
- DELETE /notes/{id} → { ok }

Reminders
- POST /reminders – { datetime, repeat?, message, location? } → Reminder
- GET /reminders → Reminder[]
- DELETE /reminders/{id} → { ok }

History
- GET /history → [{ id, role, content, created_at }]
- DELETE /history/clear → { ok }

System Control
- POST /system/volume – { level }
- POST /system/brightness – { level }
- POST /system/open – { app }
- POST /system/lock
- POST /system/shutdown
