@echo off
setlocal
set "APP=%~dp0"
for /r "%APP%node_modules" %%f in (electron.exe) do (
    if exist "%%f" (
        start "" "%%f" "%APP%"
        exit /b 0
    )
)
echo Electron not found. Run: pnpm install
pause
