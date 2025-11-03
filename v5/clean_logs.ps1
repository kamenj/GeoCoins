# Script to remove ALL non-error console.log statements
# Keep only: console.error, console.warn with "Failed", "Invalid", "Error"
# Remove all: console.log (with or without emojis)

$files = @(
    "app.js",
    "db.js",
    "db_remote\connectionManager.js",
    "db_remote\auth.js"
)

foreach ($file in $files) {
    $filePath = Join-Path $PSScriptRoot $file
    if (Test-Path $filePath) {
        Write-Host "Processing: $file"
        
        $lines = Get-Content $filePath
        $newLines = @()
        $removedCount = 0
        
        foreach ($line in $lines) {
            # Keep lines that are:
            # 1. Not console.log/warn at all
            # 2. console.error (always keep errors)
            # 3. console.warn with important messages (Failed, Invalid, Error, deprecated)
            # 4. Already commented out console.*
            
            if ($line -notmatch "console\.(log|warn)\(") {
                # Not a console.log/warn line, keep it
                $newLines += $line
            }
            elseif ($line -match "//.*console\.(log|warn)\(") {
                # Already commented out, keep it
                $newLines += $line
            }
            elseif ($line -match "console\.warn\([^)]*\b(Failed|Invalid|Error|deprecated)\b") {
                # Important warning, keep it
                $newLines += $line
            }
            else {
                # All other console.log and console.warn statements - remove them
                $removedCount++
                # Don't add to newLines
            }
        }
        
        # Write back to file
        $newLines | Set-Content $filePath -Encoding UTF8
        Write-Host "  Removed $removedCount log statements"
        Write-Host "  Completed: $file`n"
    }
    else {
        Write-Host "  File not found: $filePath`n" -ForegroundColor Yellow
    }
}

Write-Host "Log cleanup completed!" -ForegroundColor Green
