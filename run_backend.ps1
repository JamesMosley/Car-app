$ErrorActionPreference = "Stop"
Write-Host "Starting Backend Server..."
& ".\.venv\Scripts\Activate.ps1"
Set-Location backend
uvicorn main:app --reload --port 8000
