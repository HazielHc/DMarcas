@echo off
title Diversas Marcas - Servidor Local
echo ===================================================
echo   Iniciando Catalogo Web de Diversas Marcas...
echo ===================================================
cd /d "%~dp0"

echo Abriendo navegador en http://localhost:5173
start http://localhost:5173

echo Iniciando catálogo y API local...
echo Presiona Ctrl + C en esta ventana para detener los servidores.
npm run dev
pause
