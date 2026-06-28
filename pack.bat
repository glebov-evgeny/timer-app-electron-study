@echo off
echo Packaging Timer...

set "ROOT=%~dp0"
set "SRC=%ROOT%node_modules\electron\dist"
set "OUT=%ROOT%dist\Timer-win32-x64"

if not exist "%SRC%\electron.exe" (
    echo ERROR: electron not found in node_modules
    pause & exit /b 1
)

rmdir /s /q "%OUT%" 2>nul
xcopy /e /i /q "%SRC%" "%OUT%\" >nul

mkdir "%OUT%\resources\app" 2>nul
copy /y "%ROOT%index.html"   "%OUT%\resources\app\" >nul
copy /y "%ROOT%main.js"      "%OUT%\resources\app\" >nul
copy /y "%ROOT%package.json" "%OUT%\resources\app\" >nul

rename "%OUT%\electron.exe" "Timer.exe"

echo Done! Portable app: dist\Timer-win32-x64\Timer.exe
pause
