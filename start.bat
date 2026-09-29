@echo off
chcp 65001 >nul
cd /d "%~dp0"
start "BMT 2-7 server" cmd /k node server.js
timeout /t 1 /nobreak >nul
start "" "http://localhost:2727"
echo 부산기계공업고 2-7 알림 사이트가 브라우저에서 열립니다.
echo 서버를 끄려면 "BMT 2-7 server" 창을 닫으세요.
