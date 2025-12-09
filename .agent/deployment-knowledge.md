# HEALINGBUDS DEPLOYMENT KNOWLEDGE BASE

## CRITICAL DEPLOYMENT INFORMATION - DO NOT FORGET

### cPanel Server Credentials
- **SSH Host**: server712.brixly.uk
- **SSH Port**: 21098
- **SSH User**: healingu
- **SSH Key**: ~/.ssh/id_ed25519 (ED25519 key)
- **Remote Path**: public_html/
- **Live Site**: https://healingbuds.pt

### GitHub Secrets (Already Configured)
- `CPANEL_HOST`: server712.brixly.uk
- `CPANEL_USER`: healingu
- `CPANEL_SSH_KEY`: ED25519 private key content
- Port 21098 is used for SSH

### Deployment Methods

#### 1. Automatic (GitHub Actions)
- **Workflow**: `.github/workflows/deploy.yml`
- **Trigger**: Push to main branch or manual dispatch
- **Process**: Build → SSH → rsync to cPanel
- **Status**: Check at https://github.com/healingbuds/sun712/actions

#### 2. Manual (Local)
- **Script**: `DEPLOY-NOW.ps1`
- **Command**: `.\DEPLOY-NOW.ps1`
- **Requirements**: SSH key at ~/.ssh/id_ed25519

### Common Issues & Solutions

#### Issue: Blank White Screen
**Cause**: Git merge conflict markers in HTML files
**Solution**: 
1. Search for `<<<<<<<` in all files
2. Resolve conflicts
3. Rebuild: `npm run build`
4. Redeploy

**Prevention**: GitHub Actions now checks for conflicts automatically

#### Issue: GitHub Actions SSH Fails (Exit 255)
**Cause**: SSH connection issues
**Solutions**:
1. Verify SSH key is authorized on cPanel
2. Check port 21098 is open
3. Verify hostname: server712.brixly.uk
4. Use manual deployment script as fallback

#### Issue: Wrong Domain References
**Always use**: healingbuds.pt (NOT .co.uk)
**Files to check**:
- `index.html` - All meta tags
- `src/components/SEOHead.tsx` - baseUrl variable
- Any hardcoded URLs

### Build & Deploy Process

```powershell
# 1. Build locally
npm run build

# 2. Deploy manually
.\DEPLOY-NOW.ps1

# 3. Verify
# Visit https://healingbuds.pt
# Hard refresh: Ctrl+Shift+R
```

### File Structure
- **Source**: `src/`
- **Build output**: `dist/` (gitignored)
- **Deployment target**: `public_html/` on cPanel

### Branding Requirements
- **Company Name**: Healing Buds (NOT "Healing Buds Global")
- **Domain**: healingbuds.pt
- **Email**: info@healingbuds.pt
- **Locale**: pt_PT
- **No Lovable references** in production

### Automated Safeguards
1. ✅ Merge conflict detection in CI/CD
2. ✅ dist/ in .gitignore (prevents conflicts)
3. ✅ Pre-deployment validation
4. ✅ Automatic build on push

### Emergency Deployment
If all else fails:
1. Login to cPanel File Manager
2. Navigate to public_html
3. Delete all files
4. Upload contents of `dist/` folder
5. Hard refresh browser

### Knowledge Files Location
- `.agent/merge-conflict-prevention.md`
- `.agent/workflows/pre-deployment-check.md`
- `.agent/automated-deployment.md`
- `.agent/deployment-knowledge.md` (this file)

## REMEMBER
- SSH credentials are in GitHub Secrets
- Port 21098 for SSH
- Always use healingbuds.pt domain
- Check for merge conflicts before deploying
- The automation WORKS when SSH is properly configured
