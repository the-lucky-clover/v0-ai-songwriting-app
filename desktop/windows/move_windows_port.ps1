<#
Conservative relocation script to move Windows-specific source files
into `desktop/windows/internal/` to isolate the port.

Run from the `desktop/windows` directory:
  .\move_windows_port.ps1

This script will only move items that exist and will create the
`internal/` folder and any necessary subfolders.
#>

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$internal = Join-Path $root "internal"

Write-Host "Creating internal folder at: $internal"
if (-not (Test-Path $internal)) { New-Item -ItemType Directory -Path $internal | Out-Null }

$itemsToMove = @(
    'v0-ai-songwriting-app.sln',
    'V0AISongwritingApp.csproj',
    'App',
    'Assets',
    'Animations',
    'App.xaml',
    'App.xaml.cs',
    'MainWindow.xaml',
    'MainWindow.xaml.cs',
    'README.md'
)

foreach ($item in $itemsToMove) {
    $src = Join-Path $root $item
    if (Test-Path $src) {
        $dest = Join-Path $internal $item
        if ((Get-Item $src) -is [System.IO.DirectoryInfo]) {
            Write-Host "Moving directory: $item -> internal\$item"
            Move-Item -Path $src -Destination $dest -Force
        } else {
            $destDir = Split-Path $dest -Parent
            if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir | Out-Null }
            Write-Host "Moving file: $item -> internal\$item"
            Move-Item -Path $src -Destination $dest -Force
        }
    } else {
        Write-Host "Not found (skipping): $item"
    }
}

Write-Host "Relocation complete. Review `desktop/windows/internal/` for moved files." -ForegroundColor Green
