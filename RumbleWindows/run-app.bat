@echo off
echo Starting Rumble Boxing Combo Generator...
echo.
echo 1. When app is running, open your browser to: http://localhost:5173
echo 2. Upload an MP3 file (15MB max)
echo 3. View analysis results and generated combos
echo.
echo Press Ctrl+C to stop the application when done
echo.

cd /d %~dp0
call npm run dev