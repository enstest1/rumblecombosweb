@echo off
echo Installing dependencies - this may take a few minutes...

echo Installing root dependencies...
call npm install

echo Installing API dependencies...
cd apps\api
call npm install

echo Installing Web dependencies...
cd ..\web
call npm install

echo All dependencies installed!
cd ..\..
echo Starting the application...
echo.
echo Once the servers are running, open your browser to: http://localhost:5173
echo.
echo Press Ctrl+C to stop the servers when done
echo.
call npm run dev