# TokenScope Deployment & Git Promotion Guide
**Document Version:** 1.1  
**Last Updated:** 2026-07-11  
**Purpose:** Complete deployment workflow from GitHub to DigitalOcean with all URLs, steps, and verification procedures.

---

## CHAPTER 0: GITHUB SETUP

### 0.1 Create the Repository on GitHub

**Step 1: Log into GitHub**
```
Go to: https://github.com/login
Email: philcheevers@gmail.com
```

**Step 2: Create New Repository**
```
Click "+" icon (top right) → "New repository"
```

**Step 3: Configure Repository**
- **Repository name:** `tokenscope`
- **Description:** Cost monitoring dashboard for tracking AI provider usage
- **Visibility:** Private (select "Private")
- **Initialize:** Do NOT check "Add a README" (we have our own docs)
- **Do NOT check:** "Add .gitignore" (we have our own)
- **Click:** "Create repository"

**Step 4: Repository URL**
After creation, you'll see:
```
https://github.com/philcheevers-pixel/tokenscope.git
```
Copy this URL—you'll need it for local setup.

---

### 0.2 Local Repository Setup

**Step 1: Clone Repository (if starting fresh)**
```bash
cd C:\Users\philc\CLAUDE\ BULLSHIT
git clone https://github.com/philcheevers-pixel/tokenscope.git
cd tokenscope
```

**OR if repo already exists locally:**
```bash
cd C:\Users\philc\CLAUDE\ BULLSHIT
git init
git remote add origin https://github.com/philcheevers-pixel/tokenscope.git
```

**Step 2: Verify Git Configuration**
```bash
git config --global user.name "Phil Cheevers"
git config --global user.email "philcheevers@gmail.com"
git config --list
```

**Step 3: Verify Remote**
```bash
git remote -v
# Should show:
# origin  https://github.com/philcheevers-pixel/tokenscope.git (fetch)
# origin  https://github.com/philcheevers-pixel/tokenscope.git (push)
```

---

### 0.3 Connect GitHub to DigitalOcean (OAuth Setup)

**Step 1: Go to DigitalOcean Console**
```
https://cloud.digitalocean.com/apps
Click "Create App"
```

**Step 2: Select GitHub as Source**
```
Source: GitHub
Click "Authorize DigitalOcean"
```

**Step 3: GitHub OAuth Authorization**
- GitHub will ask: "Authorize DigitalOcean?"
- Click "Authorize anthropics" (or your account name)
- Approve permissions (DigitalOcean needs to read your repos)

**Step 4: Select Repository**
```
After OAuth approval, select:
Repository: philcheevers-pixel/tokenscope
Branch: main
```

**Step 5: Configure App Settings on DigitalOcean**
- **App name:** TokenScope
- **Region:** US (sfo3 or nyc3) or EU (lon, ams)
- Click "Create App"

**Step 6: DigitalOcean Creates app.yaml**
- DO will auto-generate app.yaml from your repo
- OR you can provide your own app.yaml (in repo root)
- We've already created it—just push it to GitHub

---

### 0.4 GitHub Repository Settings

After repository creation, configure these settings:

**Go to:** Settings → General
- Description: "Cost monitoring dashboard for 22 AI providers"
- Homepage: `https://tokenscope-xxx.ondigitalocean.app` (fill in after deployment)

**Go to:** Settings → Branches
- Default branch: `main`
- Require pull request reviews: Not required for single developer
- Require status checks: Not required initially (can add later)

**Go to:** Settings → Visibility
- Confirm: "Private" (not public)

**Go to:** Settings → Deploy keys
- Add DigitalOcean's deploy key (automatically added via OAuth)

---

### 0.5 Verify GitHub + DigitalOcean Connection

**Check on GitHub:**
```
Settings → Integrations & applications → Applications
Should show: "DigitalOcean" connected with permissions
```

**Check on DigitalOcean:**
```
Dashboard → Apps → TokenScope
Settings → GitHub
Should show: Connected to github.com/philcheevers-pixel/tokenscope
Branch: main
```

**Webhook Verification:**
```
DigitalOcean dashboard → Apps → TokenScope → Settings → GitHub
Should show active webhook to https://api.digitalocean.com/v2/apps/webhooks/...
```

---

### 0.6 GitHub Repository URLs Reference

| Item | URL |
|------|-----|
| Repository | https://github.com/philcheevers-pixel/tokenscope |
| Clone URL (HTTPS) | https://github.com/philcheevers-pixel/tokenscope.git |
| Main branch | https://github.com/philcheevers-pixel/tokenscope/tree/main |
| Settings | https://github.com/philcheevers-pixel/tokenscope/settings |
| Deploy keys | https://github.com/philcheevers-pixel/tokenscope/settings/keys |

---

### 0.7 Current Status & First Deployment Verification

**Step 1: Find TokenScope App in DigitalOcean**
```
Go to: https://cloud.digitalocean.com/apps
Look for: "tokenscope" in the Apps list
You should see:
  - App name: tokenscope
  - Deployment status: "Deployed X days ago"
  - Service: "1 Web Service"
```

**Step 2: View App Details**
```
Click on "tokenscope" app
This opens the app dashboard showing:
  - Current deployment status
  - Service status
  - Environment information
  - GitHub connection status
```

**Step 3: Verify GitHub Connection is Active**
```
From app dashboard, click "Settings" tab
Look for: "GitHub Deployment" or "Source"
Should show:
  - Repository: philcheevers-pixel/tokenscope
  - Branch: main (or master if already connected)
  - Status: Connected
  - Webhook: Active
```

**Step 4: Check Deployment History**
```
From app dashboard, click "Deployments" tab
You should see:
  - Previous deployments listed with dates
  - Status: "Active", "In Progress", or "Failed"
  - Each deployment shows commit hash and message
  - Click on any deployment to view build logs
```

**Step 5: Get Your Live App URL**
```
From app dashboard, top right shows:
  "Live App" button → https://tokenscope-xxx.ondigitalocean.app
Copy this URL for testing and sharing
```

**Step 6: What Happens When You Push to GitHub**

After you push code to GitHub (which we just did):

1. **Immediately (0-30 seconds):**
   - GitHub sends webhook to DigitalOcean
   - DigitalOcean receives notification of new commit
   - Status: "Deploying..."

2. **Build Phase (1-2 minutes):**
   - DigitalOcean pulls latest code from GitHub
   - Runs `pip install -r requirements.txt`
   - Status: "Building..."
   - Check logs if build fails

3. **Deployment Phase (30 seconds - 1 minute):**
   - Runs `python backend.py`
   - Frontend HTML deployed
   - Status: "Deploying..."
   - Check logs if startup fails

4. **Live (Total: 2-5 minutes):**
   - App is live at https://tokenscope-xxx.ondigitalocean.app
   - Status: "Active"
   - Old deployment marked as "Superseded"

**Step 7: Monitor First Deployment**

```
1. Go to https://cloud.digitalocean.com/apps
2. Click "tokenscope"
3. Click "Deployments" tab
4. Click latest deployment (at top)
5. Watch the logs scroll in real-time
6. Look for errors (red text)
7. When "Active", deployment successful
```

**Step 8: Test Live Deployment**

After app shows "Active":

```bash
# Test backend is running
curl https://tokenscope-xxx.ondigitalocean.app/

# Test frontend loads
Open in browser: https://tokenscope-xxx.ondigitalocean.app/TokenScope-v11.0.html

# Test API (with your API key)
curl "https://tokenscope-xxx.ondigitalocean.app/api/claude/costs?key=YOUR_KEY"
```

**Step 9: Check Logs for Issues**

If deployment fails or app doesn't respond:

```
Dashboard → Apps → TokenScope → Deployments → Latest
Click "Logs" tab and look for:
  - [ERROR] lines (Python errors)
  - Exit code 1 (crash)
  - "port already in use" (conflict)
  - "module not found" (missing dependency)
```

---

## CHAPTER 1: GIT PROMOTION PROCESS

### 1.1 Branch Strategy

**Primary Strategy: `main` branch (Direct to Production)**
- Repository: `https://github.com/philcheevers-pixel/tokenscope`
- Deployment: Automatic on merge to `main`
- Workflow: Commit → Push to main → DigitalOcean auto-deploys

**Why `main` for this project:**
- Single developer workflow
- DigitalOcean auto-deployment configured
- Fast iteration cycle
- Code is tested locally before push

### 1.2 Files to Commit

**Core Application Files:**
```
TokenScope-v11.0.html          (Frontend, auto-fetch wired)
backend.py                      (Flask backend, 22 providers)
model-capabilities.json         (Model benchmark data)
requirements.txt                (Python dependencies)
app.yaml                        (DigitalOcean config)
.env.example                    (Environment template, NOT .env itself)
.gitignore                      (Excludes .env and secrets)
```

**Documentation Files (DOCX):**
```
TOKENSCOPE-MASTER-API-REFERENCE.docx
TOKENSCOPE-PROVIDER-SPECIFICATIONS.docx
TOKENSCOPE-API-DATA-STRUCTURES.docx
TOKENSCOPE-STATUS-MASTER.docx
TokenScope-Project-Plan-2026-07-10.docx
TOKENSCOPE-DEPLOYMENT-GUIDE.docx  (This file)
```

### 1.3 Commit Message Format

```
feat: auto-fetch wired + all 22 providers ready for data

- Frontend auto-fetches historical data when user logs in
- All 22 providers have fetch functions (live + pending)
- COST_DATA structure ready for 120-day accumulation
- Documentation complete (API reference, deployment guide)

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
```

### 1.4 Git Commands (Step by Step)

**Step 1: Stage files**
```bash
git add TokenScope-v11.0.html backend.py model-capabilities.json requirements.txt app.yaml .env.example .gitignore
git add TOKENSCOPE-*.docx TokenScope-Project-Plan-*.docx TOKENSCOPE-DEPLOYMENT-GUIDE.docx
```

**Step 2: Verify staging**
```bash
git status
```
(Should show all files ready to commit, nothing untracked)

**Step 3: Commit**
```bash
git commit -m "feat: auto-fetch wired + all 22 providers ready for data

- Frontend auto-fetches historical data when user logs in
- All 22 providers have fetch functions (live + pending)
- COST_DATA structure ready for 120-day accumulation
- Documentation complete (API reference, deployment guide)

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

**Step 4: Push to GitHub**
```bash
git push -u origin main
```

### 1.5 Verification After Push

✅ **GitHub repo updated:** https://github.com/philcheevers-pixel/tokenscope
✅ **All commits visible** on GitHub main branch
✅ **DigitalOcean deployment triggered** (watch deploy logs)

---

## CHAPTER 2: GIT PROMOTION PROCESS (continued from Chapter 1)

---

## CHAPTER 3: DIGITALOCEAN DEPLOYMENT

### 2.1 Prerequisites

**Your DigitalOcean Account:**
- Account created at https://cloud.digitalocean.com
- Project created (free tier available)
- GitHub connected for auto-deploy (OAuth)

**Information You'll Need:**
- DigitalOcean account email
- Project name
- App name (TokenScope)
- Region preference (US: sfo3, nyc3; EU: lon, ams)

### 2.2 How to Get Your DigitalOcean App Info

**Step 1: Log into DigitalOcean**
```
Go to: https://cloud.digitalocean.com/login
Email: [your email]
```

**Step 2: Find Your App**
```
Dashboard → Apps (left sidebar) → TokenScope
```

**Step 3: Copy App Details**
From the app page, copy:
- App ID: shown in URL bar (`/apps/{app-id}`)
- App name: "TokenScope" (or whatever you named it)
- Live URL: shown as "https://tokenscope-xxx.ondigitalocean.app"

**Step 4: Find Your GitHub Connection**
```
Settings → GitHub Deployment
Should show: Connected to github.com/philcheevers-pixel
```

### 2.3 DigitalOcean App Configuration (app.yaml)

**Location in repo:** `app.yaml` (root directory)

**Content:**
```yaml
name: TokenScope
services:
- name: backend
  github:
    repo: philcheevers-pixel/tokenscope
    branch: main
  build_command: pip install -r requirements.txt
  run_command: python backend.py
  http_port: 8080
  envs:
  - key: FLASK_ENV
    value: production
  - key: PORT
    value: "8080"
  health_check:
    http_path: /
  http_routes:
  - path: /api
static_sites:
- name: frontend
  github:
    repo: philcheevers-pixel/tokenscope
    branch: main
  source_dir: /
  routes:
  - path: /
    file: TokenScope-v11.0.html
```

### 2.4 Environment Variables (.env)

**Template File:** `.env.example` (checked into git, shared)
```
FLASK_ENV=production
PORT=8080
API_BASE=http://localhost:8080
```

**Actual File:** `.env` (local only, NOT in git)
```
FLASK_ENV=production
PORT=8080
API_BASE=https://tokenscope-xxx.ondigitalocean.app
```

**Note:** Replace `tokenscope-xxx` with your actual app URL from DigitalOcean.

**Gitignore Entry:** `.gitignore` should contain:
```
.env
.DS_Store
__pycache__/
*.pyc
```

### 2.5 Python Dependencies (requirements.txt)

**Location in repo:** `requirements.txt` (root directory)

**Content:**
```
Flask==2.3.0
flask-cors==4.0.0
requests==2.31.0
python-docx==0.8.11
```

---

## CHAPTER 4: DEPLOYMENT WORKFLOW

### 3.1 Complete Deployment Process

**Local Development:**
1. Make code changes locally
2. Test on localhost:8080
3. Verify database/API responses work
4. Stage files with `git add`
5. Commit with meaningful message
6. Push to GitHub: `git push origin main`

**DigitalOcean Auto-Deploy:**
1. GitHub receives push to `main`
2. DigitalOcean webhook triggered
3. DigitalOcean pulls latest code
4. Runs `requirements.txt` install
5. Starts `python backend.py`
6. Deploys frontend HTML
7. Live at: https://tokenscope-xxx.ondigitalocean.app

**Total time:** ~2-5 minutes from push to live

### 3.2 Monitoring Deployment

**Watch Logs:**
1. Go to: https://cloud.digitalocean.com/apps
2. Click "TokenScope"
3. Click "Deployments" tab
4. Click latest deployment
5. View build + runtime logs

**Common Issues:**
- Build fails: Check `requirements.txt` syntax
- Startup fails: Check backend.py for syntax errors
- 503 Service Unavailable: App crashed, check logs

### 3.3 Verify Live Deployment

**Test Backend:**
```bash
curl https://tokenscope-xxx.ondigitalocean.app/
# Should return: {"status": "ok", "service": "TokenScope Backend v2", ...}
```

**Test Frontend:**
```
Open in browser: https://tokenscope-xxx.ondigitalocean.app/TokenScope-v11.0.html
# Should load the UI, click LOGIN to test
```

**Test API (with key):**
```bash
curl "https://tokenscope-xxx.ondigitalocean.app/api/claude/costs?key=YOUR_API_KEY"
# Should return historical data for Claude
```

---

## CHAPTER 5: ROLLBACK PROCEDURE

### 4.1 If Deployment Fails

**Option 1: Revert Last Commit (Safest)**
```bash
git revert HEAD
git push origin main
# DigitalOcean auto-redeploys previous version
```

**Option 2: Manual Rollback on DigitalOcean**
1. Go to: https://cloud.digitalocean.com/apps
2. Click "TokenScope" → "Deployments"
3. Find previous working deployment
4. Click "..." → "Redeploy"

### 4.2 If Service is Down

**Check Status:**
```bash
curl -I https://tokenscope-xxx.ondigitalocean.app/
# If 503 or timeout: backend crashed
```

**Check Logs:**
1. DigitalOcean dashboard → TokenScope → Runtime logs
2. Look for Python errors or exit codes
3. Common issues:
   - Missing API key in environment
   - Syntax error in backend.py
   - Missing dependency in requirements.txt

**Quick Fix:**
1. Fix the issue locally
2. Commit and push
3. Wait 2-5 minutes for auto-redeploy
4. Verify with curl

---

## CHAPTER 6: BRANCH & ENVIRONMENT REFERENCE

### 5.1 Repository URLs

| Component | URL |
|-----------|-----|
| GitHub Repo | https://github.com/philcheevers-pixel/tokenscope |
| Main Branch | https://github.com/philcheevers-pixel/tokenscope/tree/main |
| DigitalOcean Apps | https://cloud.digitalocean.com/apps |

### 5.2 Environment Matrix

| Environment | Frontend URL | Backend URL | .env Required? |
|-------------|--------------|------------|-----------------|
| Local Dev | file:// or localhost:8080 | http://localhost:8080 | .env (local) |
| Production (DO) | https://tokenscope-xxx.ondigitalocean.app | https://tokenscope-xxx.ondigitalocean.app | .env.example (git) |

### 5.3 Port Configuration

- **Local:** 8080 (Flask backend)
- **Production:** 8080 (DigitalOcean app)
- **Frontend:** Served from root `/`
- **Backend API:** Served from `/api/*`

---

## CHAPTER 7: TROUBLESHOOTING

### 6.1 Common Issues & Solutions

**Issue: "Connection refused" on localhost**
- Backend not running
- Solution: Run `python backend.py` in terminal

**Issue: CORS error in browser console**
- Backend CORS not enabled
- Solution: Verify `CORS(app)` in backend.py line 16

**Issue: 404 on /api/providers**
- Backend not reachable or API route missing
- Solution: Check backend.py lines 251-266 for route definition

**Issue: API key rejected**
- Key not stored in browser
- Solution: Click LOGIN on provider, paste full key, wait for "Key saved"

**Issue: DigitalOcean deployment stuck**
- Build or startup taking too long
- Solution: Check logs at DigitalOcean dashboard → Deployments

### 6.2 Debugging Steps

1. **Check git status:**
   ```bash
   git status
   ```

2. **Verify files staged:**
   ```bash
   git diff --cached
   ```

3. **Check backend starts:**
   ```bash
   python backend.py
   # Should show: "Running on http://0.0.0.0:8080"
   ```

4. **Test API locally:**
   ```bash
   curl http://localhost:8080/api/providers
   ```

5. **Check deployment logs on DO:**
   - Dashboard → TokenScope → Deployments → latest → Logs

---

## CHAPTER 8: SECURITY CHECKLIST

### 7.1 Before Each Deployment

- [ ] `.env` file is NOT in git (only `.env.example`)
- [ ] `.gitignore` contains `.env`
- [ ] No API keys hardcoded in backend.py
- [ ] All secrets in `.env` only
- [ ] No sensitive data in documentation
- [ ] GitHub repo is private (check Settings → Visibility)

### 7.2 DigitalOcean Security

- [ ] OAuth connection is to correct GitHub account
- [ ] App only deploys from `main` branch
- [ ] Environment variables set in DO dashboard (not in code)
- [ ] No credentials in app.yaml

---

## CHAPTER 9: DEPLOYMENT CHECKLIST

**Before Pushing:**
- [ ] Code tested locally
- [ ] All files staged correctly
- [ ] Commit message is descriptive
- [ ] `.env` is NOT staged (only `.env.example`)

**After Pushing:**
- [ ] GitHub shows new commit on main
- [ ] DigitalOcean starts deployment (~30 seconds)
- [ ] Build completes without errors (~2 minutes)
- [ ] App is live at https://tokenscope-xxx.ondigitalocean.app

**After Deployment:**
- [ ] Test backend: `curl https://tokenscope-xxx.ondigitalocean.app/`
- [ ] Test frontend: Open URL in browser
- [ ] Test API: Login and fetch data

---

**End of Deployment Guide**

Use this guide for all future deployments. Keep your app URL (tokenscope-xxx.ondigitalocean.app) handy for testing and sharing.
