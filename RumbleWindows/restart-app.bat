@echo off
echo Stopping any running processes on ports 3001 and 5173...
npx kill-port 3001 5173

echo Starting the application...
echo.
echo Once the servers are running, open your browser to: http://localhost:5173
echo.
echo Press Ctrl+C to stop the servers when done
echo.
call npm run dev