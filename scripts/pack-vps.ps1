# Empaqueta Isla Prime para el VPS en una carpeta aparte del Escritorio.
# Por defecto es SLIM: no copia modelos 3D, HDR ni videos (ya estan en el VPS).
#
# Uso (desde la raiz del proyecto):
#   powershell -ExecutionPolicy Bypass -File scripts\pack-vps.ps1
#   powershell -ExecutionPolicy Bypass -File scripts\pack-vps.ps1 -Full
#
# En el VPS: copia este paquete ENCIMA de la web, sin borrar public/models.

param(
  [switch]$Full
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$desktop = [Environment]::GetFolderPath("Desktop")
$out = Join-Path $desktop "islaprime-web"
$mode = if ($Full) { "FULL (incluye assets pesados)" } else { "SLIM (sin modelos/videos/HDR; ya estan en el VPS)" }

Write-Host "==> Proyecto: $root"
Write-Host "==> Destino:  $out"
Write-Host "==> Modo:     $mode"

Set-Location $root

Write-Host "==> npm run build (standalone)..."
npm run build
if ($LASTEXITCODE -ne 0) { throw "Build fallo" }

$standalone = Join-Path $root ".next\standalone"
$staticDir = Join-Path $root ".next\static"
$publicDir = Join-Path $root "public"

if (-not (Test-Path $standalone)) {
  throw "No existe .next\standalone. Revisa que next.config tenga output: 'standalone'."
}

if (Test-Path $out) {
  Write-Host "==> Limpiando destino anterior..."
  Remove-Item -Recurse -Force $out
}

Write-Host "==> Copiando standalone..."
Copy-Item -Recurse -Force $standalone $out

Write-Host "==> Copiando public y static..."
$outPublic = Join-Path $out "public"
$outNextStatic = Join-Path $out ".next\static"
New-Item -ItemType Directory -Force -Path $outPublic | Out-Null
New-Item -ItemType Directory -Force -Path (Split-Path $outNextStatic) | Out-Null
Copy-Item -Recurse -Force $staticDir $outNextStatic

$skipPublicDirs = @("models", "videos", "env")
Get-ChildItem -LiteralPath $publicDir | ForEach-Object {
  $skip = -not $Full -and $_.PSIsContainer -and ($skipPublicDirs -contains $_.Name)
  if ($skip) {
    Write-Host "    (omitido) public/$($_.Name)/ — ya esta en el VPS"
    return
  }
  Copy-Item -Recurse -Force $_.FullName (Join-Path $outPublic $_.Name)
}

if (-not $Full) {
  $heavyPng = Join-Path $outPublic "images\maps\gateway.png"
  if (Test-Path $heavyPng) {
    Remove-Item -Force $heavyPng
    Write-Host "    (omitido) public/images/maps/gateway.png"
  }
}

# Plantilla de env (sin secretos)
Copy-Item -Force (Join-Path $root ".env.example") (Join-Path $out ".env.example")

# Prisma schema + carpeta data vacía (el .db se crea en el VPS)
$prismaOut = Join-Path $out "prisma"
New-Item -ItemType Directory -Force -Path (Join-Path $prismaOut "data") | Out-Null
Copy-Item -Force (Join-Path $root "prisma\schema.prisma") (Join-Path $prismaOut "schema.prisma")

# Launcher doble clic
@"
@echo off
cd /d "%~dp0"
title Isla Prime Web
echo.
echo  Isla Prime — web
echo  Abre https://islaprime.lat  o  http://TU-IP-VPS:3000
echo  Cierra esta ventana para detener la web.
echo.

if not exist ".env.local" (
  echo [!] Falta .env.local
  echo     Copia .env.example a .env.local y completa AUTH_SECRET, RCON, Steam, DATABASE_URL.
  echo.
  pause
  exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
  echo [!] Node.js no esta instalado en este PC/VPS.
  echo     Instala LTS desde https://nodejs.org y vuelve a abrir este archivo.
  echo.
  pause
  exit /b 1
)

if not exist "prisma\data" mkdir "prisma\data"
set PORT=3000
set HOSTNAME=0.0.0.0
node server.js
pause
"@ | Set-Content -Encoding ASCII (Join-Path $out "Iniciar-IslaPrime.bat")

$leeme = @"
# Isla Prime — paquete VPS ($mode)

1. Instala Node.js LTS en el VPS (https://nodejs.org) si no lo tienes.
2. Copia esta carpeta al VPS ENCIMA de la web actual (WinSCP / RDP).
   - No borres public/models, public/videos ni public/env del VPS.
   - Este paquete slim no los trae a proposito.
3. Si ya tienes .env.local en el VPS, no lo pises.
4. Doble clic en Iniciar-IslaPrime.bat.
5. Abre http://IP-DEL-VPS:3000 (puerto 3000 en el firewall).

No hace falta npm install en este paquete.
Tu PC puede apagarse: la web corre en el VPS.
"@
$leeme | Set-Content -Encoding UTF8 (Join-Path $out "LEEME.txt")

$size = (Get-ChildItem -Recurse $out -File | Measure-Object -Property Length -Sum).Sum
$sizeMb = [math]::Round($size / 1MB, 1)
Write-Host ""
Write-Host "Listo: $out"
Write-Host "Tamano aprox: $sizeMb MB ($mode)"
Write-Host "En el VPS: copia encima, sin borrar public/models."
