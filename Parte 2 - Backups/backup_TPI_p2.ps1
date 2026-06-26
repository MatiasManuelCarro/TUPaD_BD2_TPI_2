# Crear carpeta principal de resguardos (si no existe)
$basePath = ".\resguardos_tpi"
if (!(Test-Path $basePath)) {
    New-Item -ItemType Directory -Path $basePath | Out-Null
}

# Crear subcarpeta con fecha actual (YYYY-MM-DD)
$dateFolder = (Get-Date -Format "yyyy-MM-dd")
$backupPath = Join-Path $basePath $dateFolder
New-Item -ItemType Directory -Path $backupPath -Force | Out-Null

# Ejecutar mongodump con conexión a Atlas
& "C:\Program Files\MongoDB\Tools\100\bin\mongodump.exe" --uri="mongodb+srv://TuturnoAdmin:Admin123@cluster0.dsobdqg.mongodb.net/gestionTurnos" --out $backupPath


Write-Host "Respaldo completado en $backupPath"
