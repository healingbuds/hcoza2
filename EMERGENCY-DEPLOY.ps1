# EMERGENCY MANUAL DEPLOYMENT
# This will upload your dist folder to cPanel via FTP

Write-Host "=== EMERGENCY DEPLOYMENT TO HEALINGBUDS.PT ===" -ForegroundColor Red

# Check if dist exists
if (-not (Test-Path ".\dist")) {
    Write-Error "dist folder not found! Building now..."
    npm run build
}

Write-Host "`n✅ Dist folder ready" -ForegroundColor Green
Write-Host "`nYou have 2 options:" -ForegroundColor Yellow
Write-Host ""
Write-Host "OPTION 1: Use FileZilla (RECOMMENDED)" -ForegroundColor Cyan
Write-Host "1. Open FileZilla"
Write-Host "2. Host: ftp.healingbuds.pt (or your cPanel server)"
Write-Host "3. Username: Your cPanel username"
Write-Host "4. Password: Your cPanel password"
Write-Host "5. Port: 21"
Write-Host "6. Navigate to: /public_html"
Write-Host "7. DELETE all existing files in public_html"
Write-Host "8. Upload ALL files from the 'dist' folder"
Write-Host "9. Visit https://healingbuds.pt and hard refresh (Ctrl+Shift+R)"
Write-Host ""
Write-Host "OPTION 2: Use cPanel File Manager" -ForegroundColor Cyan
Write-Host "1. Login to cPanel"
Write-Host "2. Open File Manager"
Write-Host "3. Navigate to public_html"
Write-Host "4. DELETE all existing files"
Write-Host "5. Click Upload"
Write-Host "6. Select ALL files from: $PWD\dist"
Write-Host "7. Wait for upload to complete"
Write-Host "8. Visit https://healingbuds.pt and hard refresh (Ctrl+Shift+R)"
Write-Host ""
Write-Host "The dist folder is located at:" -ForegroundColor Green
Write-Host "$PWD\dist"
Write-Host ""
Write-Host "Press any key to open the dist folder in Explorer..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
explorer.exe "$PWD\dist"
