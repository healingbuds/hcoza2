---
description: Daily automated organization and maintenance task
---

# Daily Organization & Maintenance Task

## Purpose
Ensure all project files, knowledge base, and documentation are properly organized, labeled, and follow best practices.

## Daily Checklist

### 1. Knowledge Base Organization
- [ ] Review all `.agent/*.md` files
- [ ] Ensure naming follows: `kebab-case-description.md`
- [ ] Verify all critical information is documented
- [ ] Update deployment credentials if changed
- [ ] Check for duplicate or outdated information

### 2. Workflow Organization
- [ ] Review `.agent/workflows/*.md` files
- [ ] Ensure all workflows have proper YAML frontmatter
- [ ] Verify workflow descriptions are clear
- [ ] Test critical workflows (deployment, pre-deployment checks)
- [ ] Remove obsolete workflows

### 3. File Structure Validation
```
sun712/
├── .agent/
│   ├── deployment-knowledge.md (Critical deployment info)
│   ├── merge-conflict-prevention.md (Conflict prevention)
│   ├── automated-deployment.md (Automation guide)
│   └── workflows/
│       ├── pre-deployment-check.md (Pre-deploy validation)
│       └── verify-paths.md (Path verification)
├── .github/
│   └── workflows/
│       ├── deploy.yml (Main deployment workflow)
│       └── deploy-ftp.yml (FTP fallback)
├── src/ (Source code)
├── dist/ (Build output - gitignored)
├── public/ (Static assets)
└── [deployment scripts].ps1
```

### 4. Script Organization
- [ ] Review all `.ps1` deployment scripts
- [ ] Ensure scripts have clear names:
  - `DEPLOY-NOW.ps1` - Manual deployment
  - `EMERGENCY-DEPLOY.ps1` - Emergency instructions
  - `quick-deploy.ps1` - Quick deploy helper
- [ ] Remove duplicate or broken scripts
- [ ] Test critical scripts
- [ ] Add comments and documentation

### 5. Git Repository Health
- [ ] Check for uncommitted changes: `git status`
- [ ] Verify `.gitignore` is correct (dist/, .env, etc.)
- [ ] Ensure no sensitive data in commits
- [ ] Check for merge conflict markers: `grep -r "<<<<<<<"`
- [ ] Verify branch is up to date with remote

### 6. GitHub Secrets Validation
- [ ] Verify all required secrets exist:
  - `CPANEL_HOST`: server712.brixly.uk
  - `CPANEL_USER`: healingu
  - `CPANEL_SSH_KEY`: ED25519 private key
- [ ] Test secrets work (check latest GitHub Actions run)
- [ ] Update if credentials changed

### 7. Documentation Updates
- [ ] Update `README.md` with latest changes
- [ ] Ensure deployment instructions are current
- [ ] Document any new features or changes
- [ ] Update troubleshooting guides

### 8. Code Quality
- [ ] Run linter: `npm run lint`
- [ ] Check for TypeScript errors
- [ ] Verify build succeeds: `npm run build`
- [ ] Test locally: `npm run dev`

### 9. Deployment Verification
- [ ] Check latest GitHub Actions status
- [ ] Verify site is live: https://healingbuds.pt
- [ ] Test critical functionality
- [ ] Check browser console for errors
- [ ] Verify meta tags are correct (healingbuds.pt, not .co.uk)

### 10. Cleanup Tasks
- [ ] Remove old build artifacts (if not gitignored)
- [ ] Clear node_modules if needed: `npm ci`
- [ ] Remove temporary files
- [ ] Archive old deployment scripts

## Best Practices

### File Naming Conventions
- **Markdown files**: `kebab-case-description.md`
- **PowerShell scripts**: `PascalCase-Action.ps1` or `UPPERCASE-ACTION.ps1` for critical
- **Workflows**: `kebab-case-workflow.md`
- **Components**: `PascalCase.tsx`

### Documentation Standards
- Always include purpose/description at top
- Use clear headers and sections
- Include code examples where relevant
- Keep information current and accurate
- Remove outdated information

### Knowledge Base Organization
```
.agent/
├── deployment-knowledge.md (Main deployment reference)
├── merge-conflict-prevention.md (Specific issue prevention)
├── automated-deployment.md (Automation overview)
└── workflows/
    ├── pre-deployment-check.md (Deployment checklist)
    └── verify-paths.md (Path validation rules)
```

### Script Organization
- Keep deployment scripts in project root
- Use clear, descriptive names
- Include comments explaining purpose
- Test before committing
- Remove broken/obsolete scripts

## Automation Opportunities

### GitHub Actions for Organization
```yaml
# .github/workflows/daily-maintenance.yml
name: Daily Maintenance
on:
  schedule:
    - cron: '0 0 * * *' # Daily at midnight
  workflow_dispatch:

jobs:
  organize:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check for issues
        run: |
          # Check for merge conflicts
          grep -r "<<<<<<< HEAD" . && exit 1 || true
          # Check for TODO comments
          grep -r "TODO" src/ || true
```

## Monthly Deep Cleanup
- [ ] Review all dependencies: `npm outdated`
- [ ] Update packages if needed
- [ ] Archive old branches
- [ ] Review and update all documentation
- [ ] Audit GitHub Actions usage
- [ ] Review and optimize build process

## Emergency Contacts
- **Repository**: https://github.com/healingbuds/sun712
- **Live Site**: https://healingbuds.pt
- **cPanel**: server712.brixly.uk:21098

## Remember
✅ Organization prevents problems
✅ Documentation saves time
✅ Automation reduces errors
✅ Regular maintenance prevents emergencies
