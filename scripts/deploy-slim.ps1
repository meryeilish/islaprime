# Empaqueta SLIM y, opcionalmente, copia al VPS por SMB.
# Uso:
#   powershell -ExecutionPolicy Bypass -File scripts\deploy-slim.ps1
#   powershell -ExecutionPolicy Bypass -File scripts\deploy-slim.ps1 -RemotePath "\\87.237.54.227\C$\Users\Administrator\Desktop\islaprime-web"
#
# No borra public/models del VPS. Reinicia la tarea IslaPrimeWeb si existe.

param(
  [string]$RemotePath = ""
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "==> pack:vps (slim)..."
& powershell -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot "pack-vps.ps1")
if ($LASTEXITCODE -ne 0) { throw "pack-vps fallo" }

$out = Join-Path ([Environment]::GetFolderPath("Desktop")) "islaprime-web"

# Asegurar carpeta data para SQLite en el paquete
$dataDir = Join-Path $out "prisma\data"
New-Item -ItemType Directory -Force -Path $dataDir | Out-Null
if (-not (Test-Path (Join-Path $out ".env.example"))) {
  Copy-Item (Join-Path $root ".env.example") (Join-Path $out ".env.example") -Force
}

if ($RemotePath) {
  Write-Host "==> Copiando a $RemotePath ..."
  if (-not (Test-Path $RemotePath)) {
    New-Item -ItemType Directory -Force -Path $RemotePath | Out-Null
  }
  # Robocopy: no tocar models/videos/env del destino
  $excludeDirs = @("models", "videos", "env")
  robocopy $out $RemotePath /E /XD $excludeDirs /XF .env.local /NFL /NDL /NJH /NJS /nc /ns /np
  $rc = $LASTEXITCODE
  if ($rc -ge 8) { throw "robocopy fallo con codigo $rc" }

  Write-Host "==> Intentando reiniciar IslaPrimeWeb en VPS (WinRM)..."
  try {
    Invoke-Command -ComputerName 87.237.54.227 -ScriptBlock {
      Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
      Start-Sleep 1
      schtasks /Run /TN "IslaPrimeWeb" 2>$null | Out-Null
      "restarted"
    } -ErrorAction Stop
  } catch {
    Write-Host "    (aviso) No se pudo reiniciar por WinRM. Arranca Iniciar-IslaPrime.bat en el VPS."
  }
}

Write-Host "Listo. Paquete local: $out"
