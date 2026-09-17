@echo off
title DigiCards - Digital Visiting Card Platform
echo =======================================================
echo   DigiCards - 100 Themes Digital Visiting Card Platform
echo   Modern Local SaaS Full-Stack Clone
echo =======================================================
echo.

if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
)

if not exist "dist\" (
    echo Building frontend...
    call npm run build
)

echo Server starting at: http://localhost:5000
echo Default Accounts:
echo   - Admin:      admin@example.com / admin123
echo   - Franchisee: franchise@example.com / franchise123
echo   - Customer:   user@example.com / user123
echo.
timeout /t 2 /nobreak >nul
start http://localhost:5000
node server.js
pause
