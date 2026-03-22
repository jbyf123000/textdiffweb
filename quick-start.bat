@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
powershell -ExecutionPolicy Bypass -File "%SCRIPT_DIR%quick-start.ps1"

if errorlevel 1 (
  echo.
  echo 启动失败，请检查上面的错误信息。
  exit /b 1
)

echo.
echo 按任意键退出...
pause >nul
