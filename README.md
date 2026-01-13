# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Getting Started

### 1. Start the Backend

The backend is a FastAPI application. You need to run it in a separate terminal.

```powershell
.\run_backend.ps1
```

Or manually:

```powershell
.\.venv\Scripts\Activate.ps1
cd backend
uvicorn main:app --reload --port 8000
```

### 2. Start the Frontend

In a new terminal:

```bash
npm run dev
```

The frontend will be available at http://localhost:9002
The backend will be available at http://localhost:8000
