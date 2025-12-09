# IMMEDIATE DEPLOYMENT SOLUTION
# Since rsync is not available on Windows, use cPanel File Manager

Write-Host "=== HEALINGBUDS.PT DEPLOYMENT ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "rsync is not available on Windows." -ForegroundColor Yellow
Write-Host "Your site is NOT showing because deployment failed." -ForegroundColor Red
Write-Host ""
Write-Host "=== IMMEDIATE FIX (2 MINUTES) ===" -ForegroundColor Green
Write-Host ""
Write-Host "1. Login to cPanel at your hosting provider"
Write-Host "2. Open 'File Manager'"
Write-Host "3. Navigate to 'public_html'"
Write-Host "4. SELECT ALL files and DELETE them"
Write-Host "5. Click 'Upload'"
Write-Host "6. Drag ALL files from this folder:"
Write-Host "   $PWD\dist"
Write-Host "7. Wait for upload to complete"
Write-Host "8. Visit https://healingbuds.pt"
Write-Host "9. Hard refresh: Ctrl + Shift + R"
Write-Host ""
Write-Host "Opening dist folder now..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
explorer.exe "$PWD\dist"
Write-Host ""
Write-Host "=== ALTERNATIVE: Install rsync for Windows ===" -ForegroundColor Cyan
Write-Host "Run this in PowerShell (Admin):"
Write-Host "winget install --id Git.Git"
Write-Host "Then restart PowerShell and run DEPLOY-NOW.ps1"
