# Fix damaged emojis in JS files

$files = @(
    "app.js",
    "db.js",
    "db_remote\auth.js",
    "db_remote\connectionManager.js"
)

foreach ($file in $files) {
    $filePath = Join-Path $PSScriptRoot $file
    if (Test-Path $filePath) {
        Write-Host "Processing: $file"
        
        $content = Get-Content $filePath -Raw -Encoding UTF8
        $originalContent = $content
        
        # Replace damaged emojis with correct ones
        $content = $content -replace 'вќЊ', '❌'
        $content = $content -replace 'вљ пёЏ', '⚠️'
        
        if ($content -ne $originalContent) {
            $content | Set-Content $filePath -Encoding UTF8 -NoNewline
            Write-Host "  Fixed emojis in $file" -ForegroundColor Green
        } else {
            Write-Host "  No damaged emojis found in $file" -ForegroundColor Gray
        }
    }
    else {
        Write-Host "  File not found: $filePath" -ForegroundColor Yellow
    }
}

Write-Host "`nEmoji fix completed!" -ForegroundColor Green
