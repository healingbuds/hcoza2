---
description: Always verify paths before executing shell commands
---

# Path Verification Task

## CRITICAL RULE
**ALWAYS verify directory paths and file paths are correct BEFORE executing ANY shell command.**

## Pre-Execution Checklist

### 1. Verify Working Directory
```powershell
# Always check current directory first
Get-Location
# or
pwd
```

### 2. Verify File/Directory Exists
```powershell
# Check if path exists
Test-Path ".\path\to\file"
Test-Path "C:\full\path\to\directory"
```

### 3. Use Absolute Paths When Possible
```powershell
# BAD - Relative path might be wrong
cd ..\somewhere

# GOOD - Absolute path is explicit
Set-Location "C:\Users\ABC\Documents\GitHub\sun712"
```

### 4. Validate Path Variables
```powershell
# Before using $env:USERPROFILE or similar
Write-Host "Using path: $env:USERPROFILE"

# Verify it exists
if (Test-Path $env:USERPROFILE) {
    # Proceed
} else {
    Write-Error "Path does not exist!"
}
```

## Common Path Issues

### PowerShell Variable Syntax
```powershell
# WRONG - Will cause parser error
$path = "$env:USERPROFILE\.ssh\key"  # Error if not escaped

# RIGHT - Proper escaping
$path = "$env:USERPROFILE\.ssh\key"  # Works
$path = Join-Path $env:USERPROFILE ".ssh\key"  # Better
```

### SSH Key Paths on Windows
```powershell
# Always use full path for SSH keys
$sshKey = Join-Path $env:USERPROFILE ".ssh\id_ed25519"

# Verify it exists
if (-not (Test-Path $sshKey)) {
    Write-Error "SSH key not found at: $sshKey"
    exit 1
}
```

### Deployment Paths
```powershell
# Project root
$projectRoot = "C:\Users\ABC\Documents\GitHub\sun712"

# Verify before using
if (-not (Test-Path $projectRoot)) {
    Write-Error "Project directory not found!"
    exit 1
}

Set-Location $projectRoot
```

## Mandatory Path Checks

### Before npm commands
```powershell
# Verify package.json exists
if (-not (Test-Path ".\package.json")) {
    Write-Error "Not in a Node.js project directory!"
    exit 1
}
```

### Before git commands
```powershell
# Verify .git directory exists
if (-not (Test-Path ".\.git")) {
    Write-Error "Not in a git repository!"
    exit 1
}
```

### Before deployment
```powershell
# Verify dist folder exists
if (-not (Test-Path ".\dist")) {
    Write-Error "Build output not found! Run 'npm run build' first."
    exit 1
}
```

## Script Template with Path Validation

```powershell
# Safe Script Template
$ErrorActionPreference = "Stop"

# 1. Define expected paths
$projectRoot = "C:\Users\ABC\Documents\GitHub\sun712"
$distFolder = Join-Path $projectRoot "dist"
$sshKey = Join-Path $env:USERPROFILE ".ssh\id_ed25519"

# 2. Validate all paths
Write-Host "Validating paths..." -ForegroundColor Yellow

if (-not (Test-Path $projectRoot)) {
    Write-Error "Project root not found: $projectRoot"
    exit 1
}

if (-not (Test-Path $sshKey)) {
    Write-Error "SSH key not found: $sshKey"
    exit 1
}

# 3. Change to correct directory
Set-Location $projectRoot
Write-Host "Working directory: $(Get-Location)" -ForegroundColor Green

# 4. Execute commands
# ... your commands here ...
```

## REMEMBER
- ✅ Always use `Test-Path` before accessing files
- ✅ Always verify working directory with `Get-Location`
- ✅ Use `Join-Path` for combining paths
- ✅ Use absolute paths when possible
- ✅ Validate environment variables exist
- ❌ Never assume a path exists
- ❌ Never use relative paths without verification
- ❌ Never execute commands without path validation
