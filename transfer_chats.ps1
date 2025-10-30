# Script to transfer VS Code workspace chat history
# from SimpleLoginSite to GeoCoins

$workspaceStoragePath = "$env:APPDATA\Code\User\workspaceStorage"

# Known workspace IDs
$sourceWorkspaceId = "3da440bc87d400d83ef00bdd7cd69382"  # SimpleLoginSite
$targetWorkspaceId = "45ebbc2a415efded4970f52146d257f7"  # GeoCoins

Write-Host "Workspace IDs:" -ForegroundColor Yellow
Write-Host "  Source (SimpleLoginSite): $sourceWorkspaceId" -ForegroundColor Cyan
Write-Host "  Target (GeoCoins): $targetWorkspaceId" -ForegroundColor Cyan

# Define paths
$sourceChatSessions = Join-Path $workspaceStoragePath "$sourceWorkspaceId\chatSessions"
$sourceChatEditingSessions = Join-Path $workspaceStoragePath "$sourceWorkspaceId\chatEditingSessions"

$targetChatSessions = Join-Path $workspaceStoragePath "$targetWorkspaceId\chatSessions"
$targetChatEditingSessions = Join-Path $workspaceStoragePath "$targetWorkspaceId\chatEditingSessions"

# Copy chat sessions
if (Test-Path $sourceChatSessions) {
    Write-Host "`nCopying chat sessions..." -ForegroundColor Yellow
    $sessionFiles = Get-ChildItem $sourceChatSessions -File
    foreach ($file in $sessionFiles) {
        $targetFile = Join-Path $targetChatSessions $file.Name
        Copy-Item $file.FullName $targetFile -Force
        Write-Host "  Copied: $($file.Name)" -ForegroundColor Gray
    }
    Write-Host "Copied $($sessionFiles.Count) chat session(s)" -ForegroundColor Green
} else {
    Write-Host "No chat sessions found in SimpleLoginSite" -ForegroundColor Yellow
}

# Copy chat editing sessions
if (Test-Path $sourceChatEditingSessions) {
    Write-Host "`nCopying chat editing sessions..." -ForegroundColor Yellow
    $editingSessions = Get-ChildItem $sourceChatEditingSessions -Directory
    foreach ($session in $editingSessions) {
        $targetSession = Join-Path $targetChatEditingSessions $session.Name
        Copy-Item $session.FullName $targetSession -Recurse -Force
        Write-Host "  Copied: $($session.Name)" -ForegroundColor Gray
    }
    Write-Host "Copied $($editingSessions.Count) editing session(s)" -ForegroundColor Green
} else {
    Write-Host "No editing sessions found in SimpleLoginSite" -ForegroundColor Yellow
}

# Copy GitHub Copilot chat database
$sourceCopilotChat = Join-Path $workspaceStoragePath "$sourceWorkspaceId\GitHub.copilot-chat"
$targetCopilotChat = Join-Path $workspaceStoragePath "$targetWorkspaceId\GitHub.copilot-chat"

if (Test-Path $sourceCopilotChat) {
    Write-Host "`nCopying GitHub Copilot chat database..." -ForegroundColor Yellow
    if (-not (Test-Path $targetCopilotChat)) {
        New-Item -ItemType Directory -Path $targetCopilotChat -Force | Out-Null
    }
    Copy-Item "$sourceCopilotChat\*" $targetCopilotChat -Recurse -Force
    Write-Host "  Copied: workspace-chunks.db" -ForegroundColor Gray
    Write-Host "Copied chat database" -ForegroundColor Green
} else {
    Write-Host "`nNo chat database found in SimpleLoginSite" -ForegroundColor Yellow
}

Write-Host "`nTransfer complete!" -ForegroundColor Green
Write-Host "Restart VS Code to see the transferred chat history." -ForegroundColor Cyan
