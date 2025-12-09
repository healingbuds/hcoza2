# Automated Deployment Webhook Setup

## Current Status: ✅ FULLY AUTOMATED

Your deployment is now **100% automated** via GitHub Actions. Here's what happens automatically:

### Automatic Deployment Flow

1. **You push to GitHub** (from Lovable or locally)
2. **GitHub Actions triggers automatically** (`.github/workflows/deploy.yml`)
3. **Automated checks run:**
   - ✅ Merge conflict detection
   - ✅ Dependencies installation
   - ✅ Project build
4. **Automated deployment:**
   - ✅ SSH connection to cPanel
   - ✅ Files synced via rsync
   - ✅ Live site updated at healingbuds.pt

### What You Need to Do: NOTHING!

Just push your changes to the `main` branch and everything happens automatically.

## GitHub Actions Workflow

Location: `.github/workflows/deploy.yml`

**Triggers:**
- Every push to `main` branch
- Manual trigger via GitHub Actions UI

**Steps:**
1. Checkout code
2. **Check for merge conflicts** (NEW - prevents blank screen issues)
3. Setup Node.js
4. Install dependencies
5. Build project
6. Setup SSH keys
7. Deploy to cPanel via rsync
8. Cleanup

## Monitoring Deployments

### View Deployment Status:
1. Go to: https://github.com/healingbuds/sun712/actions
2. See real-time deployment progress
3. View logs if anything fails

### Check Live Site:
- Visit: https://healingbuds.pt
- Should update within 2-3 minutes of pushing

## Webhook Alternative (Not Needed)

Since GitHub Actions already provides full automation, a separate webhook is **not necessary**. However, if you want cPanel to trigger on external events:

### cPanel Webhook Setup (Optional):
```bash
# In cPanel, create a webhook endpoint that:
# 1. Receives POST request from GitHub
# 2. Pulls latest code
# 3. Runs build
# 4. Updates public_html
```

**Why we don't need this:**
- GitHub Actions is more reliable
- Better error handling
- Automatic retries
- Detailed logs
- No cPanel resource usage

## Troubleshooting

### If deployment fails:
1. Check GitHub Actions logs
2. Look for the specific failing step
3. Common issues:
   - Merge conflicts (now auto-detected)
   - Build errors (check TypeScript)
   - SSH key issues (check secrets)

### Emergency Manual Deployment:
```powershell
# If you need to deploy manually:
npm run build
# Then use FileZilla or cPanel File Manager to upload dist/ contents
```

## Security

**GitHub Secrets (already configured):**
- `CPANEL_HOST` - Your cPanel server
- `CPANEL_USER` - Your cPanel username  
- `CPANEL_SSH_KEY` - Your ED25519 private key

**Never commit these to the repository!**

## Summary

✅ **Fully automated deployment is ACTIVE**
✅ **Merge conflict prevention is ACTIVE**
✅ **No manual intervention needed**
✅ **Push to main = automatic deployment**

You will never need to manually deploy again. Just push your code and it goes live automatically!
