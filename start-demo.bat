@echo off
setlocal
cd /d "%~dp0"
set "NODE_EXE=C:\Users\11967\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if exist "%NODE_EXE%" (
  "%NODE_EXE%" server.mjs
) else (
  node server.mjs
)
pause
