import io
from datetime import datetime, timedelta
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_openapi_available():
    r = client.get("/api/openapi.json")
    assert r.status_code == 200
    assert "paths" in r.json()


def test_auth_register_login_me():
    email = "test@example.com"
    # register
    r = client.post("/api/auth/register", json={"name": "Test", "email": email, "password": "secret123"})
    assert r.status_code in (200, 400)  # allow duplicate on re-run
    # login
    r = client.post("/api/auth/login", data={"username": email, "password": "secret123"}, headers={"Content-Type":"application/x-www-form-urlencoded"})
    assert r.status_code == 200
    token = r.json()["access_token"]
    # me
    r = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    assert r.json()["email"] == email


def test_notes_crud():
    # create
    r = client.post("/api/notes", json={"title": "Note 1", "content": "Hello"})
    assert r.status_code == 200
    note_id = r.json()["id"]
    # list
    r = client.get("/api/notes")
    assert r.status_code == 200
    assert any(n["id"] == note_id for n in r.json())
    # update
    r = client.put(f"/api/notes/{note_id}", json={"title": "Updated", "content": "World"})
    assert r.status_code == 200
    # delete
    r = client.delete(f"/api/notes/{note_id}")
    assert r.status_code == 200


def test_reminders_create_list():
    when = (datetime.utcnow() + timedelta(seconds=10)).isoformat()
    r = client.post("/api/reminders", json={"datetime": when, "message": "Ping"})
    assert r.status_code == 200
    r = client.get("/api/reminders")
    assert r.status_code == 200


def test_stt_tts_and_ocr_endpoints():
    # STT file upload with dummy bytes
    audio_bytes = b"RIFF....WAVEfmt "
    files = {"file": ("test.wav", io.BytesIO(audio_bytes), "audio/wav")}
    r = client.post("/api/stt/transcribe", files=files)
    assert r.status_code == 200
    assert "text" in r.json()

    # TTS
    r = client.post("/api/tts/speak", json={"text": "Hello"})
    assert r.status_code == 200

    # OCR
    img_bytes = b"\x89PNG\r\n\x1a\n" + b"0" * 100
    files = {"file": ("test.png", io.BytesIO(img_bytes), "image/png")}
    r = client.post("/api/vision/ocr", files=files)
    assert r.status_code == 200


def test_e2e_transcribe_create_reminder_list():
    # Simulate transcription -> create reminder -> list reminders
    transcript = "Set a reminder tomorrow at 9 AM to call mom"
    # Chat/intents
    r = client.post("/api/intent/parse", json={"text": transcript})
    assert r.status_code == 200
    # Create reminder directly (simplified)
    when = (datetime.utcnow() + timedelta(hours=24)).isoformat()
    r = client.post("/api/reminders", json={"datetime": when, "message": "call mom"})
    assert r.status_code == 200
    r = client.get("/api/reminders")
    assert r.status_code == 200
