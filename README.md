# Vaani – Voice Assistant (Frontend + Backend)

This project includes a React frontend and a local-first FastAPI backend for Vaani.

Highlights
- Local-first privacy with SQLite and optional encryption (Fernet)
- REST + WebSocket API on localhost
- STT/TTS/OCR/Vision endpoints with offline-first stubs that work without cloud keys
- Notes, Reminders (APScheduler), History, and basic System control
- JWT auth (email/password)

## Quickstart (Backend)

1) Create and activate a Python 3.10+ venv, then install dependencies:

```
pip install -r backend/requirements.txt
```

2) Copy environment file:

```
cp .env.example .env
```

3) Run the backend:

```
uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

OpenAPI docs: http://localhost:8000/api/docs

SQLite DB is stored at backend/data/app.db

## Environment Variables
See .env.example for all options.

Key ones:
- SECRET_KEY – JWT signing secret
- FERNET_KEY – Optional, enables field encryption
- DATABASE_URL – Defaults to SQLite in backend/data/app.db
- STT_ENGINE, TTS_ENGINE – Choose engines (none by default)

## Frontend Integration
The frontend uses a small client in client/utils/apiClient.ts to call the backend.
- BASE defaults to http://localhost:8000/api
- If the backend is unreachable, the UI speaks a friendly fallback message and uses local responses.

## Packaging as Desktop App (Electron + PyInstaller)

1) Package backend with PyInstaller:
```
pip install pyinstaller
pyinstaller --name vaani-backend --add-data "backend/data:backend/data" --hidden-import "passlib.handlers.bcrypt" -F backend/app/main.py
```
This produces dist/vaani-backend (or .exe).

2) Electron shell
- Create an Electron main process that spawns the backend on app ready:
```js
// electron/main.js
const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
let backend;
function createWindow() {
  const win = new BrowserWindow({ width: 1200, height: 800 });
  win.loadURL('http://localhost:3000');
}
app.whenReady().then(() => {
  backend = spawn(process.platform === 'win32' ? 'vaani-backend.exe' : './vaani-backend', [], { cwd: process.resourcesPath || process.cwd() });
  createWindow();
});
app.on('before-quit', () => { if (backend) backend.kill(); });
```
- Bundle the frontend as usual and point to the local dev/production URL.

3) Cross-platform build
Use electron-builder or similar to create installers for Windows/macOS/Linux.

## Testing
Run tests with pytest:
```
pip install -r backend/requirements.txt
pytest backend/tests -q
```

Tests cover: auth, notes CRUD, reminders, STT/TTS/OCR endpoints, and one E2E flow.

## Security & Privacy
- Use FERNET_KEY to encrypt sensitive data at rest
- CLI for rotation: backend/app/cli_rotate_key.py

## Deploying to cloud
- Local-first by default; for cloud use PostgreSQL by setting DATABASE_URL
- To deploy the frontend: use Netlify or Vercel. Connect via MCP and deploy.
