# Quick Manual Deploy to cPanel
# This uploads the dist folder to your cPanel server

Write-Host "=== Quick Deploy to healingbuds.pt ===" -ForegroundColor Cyan

# Check if dist exists
if (-not (Test-Path ".\dist")) {
    Write-Error "dist folder not found! Run 'npm run build' first."
    exit 1
}

Write-Host "`nDist folder found. Ready to deploy." -ForegroundColor Green
Write-Host "`nPlease enter your cPanel FTP credentials:" -ForegroundColor Yellow

$ftpHost = Read-Host "FTP Host (e.g., ftp.healingbuds.pt)"
$ftpUser = Read-Host "FTP Username"
$ftpPass = Read-Host "FTP Password" -AsSecureString
$plainPass = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($ftpPass))

Write-Host "`nUploading files via FTP..." -ForegroundColor Yellow

# Use WinSCP or similar - for now, show manual instructions
Write-Host "`n=== MANUAL DEPLOYMENT INSTRUCTIONS ===" -ForegroundColor Cyan
Write-Host "1. Open FileZilla or your FTP client"
Write-Host "2. Connect to: $ftpHost"
Write-Host "3. Username: $ftpUser"
Write-Host "4. Navigate to: public_html"
Write-Host "5. Upload ALL contents of the 'dist' folder to public_html"
Write-Host "6. Make sure to OVERWRITE existing files"
Write-Host "7. Visit https://healingbuds.pt and hard refresh (Ctrl+Shift+R)"
Write-Host "`n=== OR USE GITHUB ACTIONS ===" -ForegroundColor Green
Write-Host "The deployment should happen automatically via GitHub Actions."
Write-Host "Check: https://github.com/healingbuds/sun712/actions"
