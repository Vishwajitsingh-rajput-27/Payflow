# 🚀 Payflow – GitHub Pages Deployment Guide

> **GitHub:** `vishwajitsingh-rajput-27` / **Repo:** `Payflow`  
> **Live URL:** https://vishwajitsingh-rajput-27.github.io/Payflow/

---

## 📋 Prerequisites

Install these before starting:

| Tool | Download |
|------|----------|
| Node.js (v18+) | https://nodejs.org |
| Git | https://git-scm.com |
| GitHub Account | https://github.com |

---

## 🛠️ STEP-BY-STEP DEPLOYMENT

---

### ✅ STEP 1 — Create GitHub Repository

1. Open https://github.com/new
2. Set **Repository name** → `Payflow`
3. Set **Owner** → `vishwajitsingh-rajput-27`
4. Set to **Public** ✅
5. Click **"Create repository"**

---

### ✅ STEP 2 — Clone / Download This Project

If you got this project as a ZIP:
```bash
# Extract the ZIP, then open terminal in the project folder
cd path/to/payflow-project
```

If you want to initialize git fresh:
```bash
git init
git add .
git commit -m "Initial commit – Payflow P2P Payment App"
```

---

### ✅ STEP 3 — Connect to Your GitHub Repository

```bash
# Add your GitHub repo as remote origin
git remote add origin https://github.com/vishwajitsingh-rajput-27/Payflow.git

# Push source code to main branch
git push -u origin main
```

> If asked for credentials, use your GitHub username and a **Personal Access Token (PAT)**.  
> Create a PAT here: https://github.com/settings/tokens → "Generate new token (classic)"  
> Give it `repo` scope.

---

### ✅ STEP 4 — Install Dependencies

```bash
npm install
```

---

### ✅ STEP 5 — Deploy to GitHub Pages (ONE COMMAND)

```bash
bash deploy.sh
```

**What this does automatically:**
1. Builds the project with `/Payflow/` base path
2. Verifies `404.html` exists (for SPA routing)
3. Creates `.nojekyll` file
4. Pushes the `dist/` folder to the `gh-pages` branch

---

### ✅ STEP 6 — Enable GitHub Pages in Repository Settings

1. Go to: `https://github.com/vishwajitsingh-rajput-27/Payflow/settings/pages`
2. Under **"Source"** → select **"Deploy from a branch"**
3. Under **"Branch"** → select **`gh-pages`** and **`/ (root)`**
4. Click **Save**

---

### ✅ STEP 7 — Wait & Visit Your Live App

GitHub Pages takes **1–3 minutes** to deploy.

🔗 **Your live URL:**
```
https://vishwajitsingh-rajput-27.github.io/Payflow/
```

---

## 🔄 UPDATING THE APP (Future Deploys)

Whenever you make changes:

```bash
# 1. Make your code changes
# 2. Commit changes
git add .
git commit -m "Update: describe your changes"
git push origin main

# 3. Redeploy to GitHub Pages
bash deploy.sh
```

---

## 🧪 ALTERNATIVE: Manual Step-by-Step Deploy

If the bash script doesn't work, do it manually:

```bash
# Step 1: Build with GitHub Pages config
npx vite build --config vite.github.config.ts

# Step 2: Add .nojekyll
touch dist/.nojekyll

# Step 3: Deploy dist/ to gh-pages branch
npx gh-pages -d dist --dotfiles

# Done! Visit:
# https://vishwajitsingh-rajput-27.github.io/Payflow/
```

---

## 🪟 WINDOWS USERS (PowerShell / CMD)

If you're on Windows and can't run `.sh` scripts:

```powershell
# Option 1: Use Git Bash (recommended)
# Right-click in project folder → "Git Bash Here"
bash deploy.sh

# Option 2: Manual commands in PowerShell
npx vite build --config vite.github.config.ts
New-Item -ItemType File -Path dist\.nojekyll -Force
npx gh-pages -d dist --dotfiles
```

---

## 🔐 Demo Login Credentials

| Role  | Username   | Password     | PIN  |
|-------|------------|--------------|------|
| User  | john_doe   | password123  | 1234 |
| User  | jane_smith | password123  | 1234 |
| Admin | admin      | admin123     | N/A  |

---

## 🌐 Full URLs Reference

| Purpose | URL |
|---------|-----|
| **Live App** | https://vishwajitsingh-rajput-27.github.io/Payflow/ |
| **GitHub Repo** | https://github.com/vishwajitsingh-rajput-27/Payflow |
| **GitHub Pages Settings** | https://github.com/vishwajitsingh-rajput-27/Payflow/settings/pages |
| **gh-pages Branch** | https://github.com/vishwajitsingh-rajput-27/Payflow/tree/gh-pages |

---

## ❓ Troubleshooting

### Problem: "404 Not Found" on GitHub Pages
- Make sure you selected `gh-pages` branch in Settings → Pages
- Wait 2–3 minutes after deploying

### Problem: Blank page on refresh
- The `404.html` handles this. Make sure it's in `dist/`
- Check that `.nojekyll` exists in `dist/`

### Problem: "Permission denied" running deploy.sh
```bash
chmod +x deploy.sh
bash deploy.sh
```

### Problem: "remote: Repository not found"
```bash
# Check your remote URL
git remote -v
# Fix it
git remote set-url origin https://github.com/vishwajitsingh-rajput-27/Payflow.git
```

### Problem: CSS/JS not loading (404 errors)
- The `vite.github.config.ts` sets `base: "/Payflow/"` — this is correct
- Make sure you're using `vite.github.config.ts` not `vite.config.ts` for the build

---

## 📁 Project Structure

```
Payflow/
├── public/
│   ├── 404.html          ← GitHub Pages SPA routing fix
│   └── .nojekyll         ← Prevents Jekyll processing
├── src/
│   ├── App.tsx            ← Main app router
│   ├── main.tsx           ← Entry point
│   ├── index.css          ← Global styles
│   ├── store/             ← Zustand global state
│   ├── types/             ← TypeScript types
│   ├── components/        ← Layout, Navigation
│   ├── pages/             ← All app pages
│   └── utils/             ← Helper functions
├── vite.config.ts         ← Local dev config
├── vite.github.config.ts  ← GitHub Pages build config
├── deploy.sh              ← One-command deploy script
└── DEPLOYMENT.md          ← This file
```

---

## ⚠️ Important Note

> This is a **P2P Payment SIMULATION** system.  
> **No real money is involved.**  
> All transactions are simulated and stored in browser localStorage.  
> This app is suitable for educational / college project purposes only.

---

*Made with ❤️ — Payflow P2P Payment Application*
