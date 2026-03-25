@echo off
setlocal EnableDelayedExpansion

REM ══════════════════════════════════════════════════════════════
REM  benolivas.com — repo setup script
REM  Run this from inside your benolivas.com\ folder
REM  Right-click the folder → Open in Terminal → type: setup.bat
REM ══════════════════════════════════════════════════════════════

echo.
echo  ┌─────────────────────────────────────────┐
echo  │   benolivas.com — repo setup            │
echo  └─────────────────────────────────────────┘
echo.

REM ── CHECK: running from right folder ───────────────────────────
if not exist "index.html" (
  echo  ERROR: Run this from inside your benolivas.com\ folder.
  echo  That folder should contain index.html.
  pause
  exit /b 1
)
echo  [OK] Running from correct folder: %CD%
echo.

REM ── CHECK: git installed ────────────────────────────────────────
where git >nul 2>&1
if errorlevel 1 (
  echo  ERROR: Git not found.
  echo  Install from: https://git-scm.com/download/win
  echo  Then re-run this script.
  pause
  exit /b 1
)
echo  [OK] Git found.
echo.

REM ══════════════════════════════════════════════════════════════
REM  STEP 1 — Create folder structure
REM ══════════════════════════════════════════════════════════════
echo  Step 1: Creating folder structure...

if not exist "data"                        mkdir "data"
if not exist "assets"                      mkdir "assets"
if not exist "assets\logo"                 mkdir "assets\logo"
if not exist "assets\memes"               mkdir "assets\memes"
if not exist "assets\memebot"             mkdir "assets\memebot"
if not exist "assets\portfolio"           mkdir "assets\portfolio"
if not exist "assets\portfolio\thumbnails" mkdir "assets\portfolio\thumbnails"
if not exist "assets\portfolio\gifs"      mkdir "assets\portfolio\gifs"
if not exist "assets\portfolio\video"     mkdir "assets\portfolio\video"

echo  [OK] Folders created.
echo.

REM ══════════════════════════════════════════════════════════════
REM  STEP 2 — Move JSON files into data\
REM  (safe: only moves if file exists in root AND not already in data\)
REM ══════════════════════════════════════════════════════════════
echo  Step 2: Moving JSON files to data\...

for %%f in (memes.json vignettes.json facts.json portfolio.json) do (
  if exist "%%f" (
    if not exist "data\%%f" (
      move "%%f" "data\%%f" >nul
      echo  Moved: %%f → data\%%f
    ) else (
      echo  Skipped: %%f already in data\
    )
  ) else (
    if not exist "data\%%f" (
      echo  WARNING: %%f not found in root or data\
    )
  )
)
echo.

REM ══════════════════════════════════════════════════════════════
REM  STEP 3 — Add .gitkeep to empty asset folders
REM  (Git doesn't track empty folders without a file inside)
REM ══════════════════════════════════════════════════════════════
echo  Step 3: Adding .gitkeep files to empty asset folders...

for %%d in (
  "assets\logo"
  "assets\memes"
  "assets\memebot"
  "assets\portfolio\thumbnails"
  "assets\portfolio\gifs"
  "assets\portfolio\video"
) do (
  if not exist "%%~d\.gitkeep" (
    type nul > "%%~d\.gitkeep"
  )
)
echo  [OK] .gitkeep files in place.
echo.

REM ══════════════════════════════════════════════════════════════
REM  STEP 4 — Rename _gitignore to .gitignore if needed
REM ══════════════════════════════════════════════════════════════
echo  Step 4: Checking .gitignore...

if exist "_gitignore" (
  if not exist ".gitignore" (
    rename "_gitignore" ".gitignore"
    echo  Renamed _gitignore → .gitignore
  ) else (
    del "_gitignore"
    echo  Deleted _gitignore (.gitignore already exists)
  )
) else (
  if exist ".gitignore" (
    echo  [OK] .gitignore already present.
  ) else (
    echo  WARNING: No .gitignore found. Creating one...
    (
      echo proxy.php
      echo .DS_Store
      echo Thumbs.db
      echo .vscode/
      echo .idea/
      echo *.log
    ) > .gitignore
    echo  [OK] .gitignore created.
  )
)
echo.

REM ══════════════════════════════════════════════════════════════
REM  STEP 5 — Show current state, safety check before git init
REM ══════════════════════════════════════════════════════════════
echo  Step 5: Current folder contents:
echo  ─────────────────────────────────────────
dir /b
echo  ─────────────────────────────────────────
echo.
echo  proxy.php must NOT appear above.
echo  (It exists locally for your use but should not be committed.)
echo.
set /p SAFE="Looks good? Ready to initialize git? (y/n): "
if /i not "!SAFE!"=="y" (
  echo  Aborted. Fix anything above, then re-run.
  pause
  exit /b 1
)
echo.

REM ══════════════════════════════════════════════════════════════
REM  STEP 6 — Git init and first commit
REM ══════════════════════════════════════════════════════════════
echo  Step 6: Initializing git repo...

REM Check if already initialized
if exist ".git" (
  echo  Git already initialized. Skipping init.
) else (
  git init
)
echo.

echo  Staging all files...
git add -A

echo.
echo  Staged files (proxy.php must NOT appear):
echo  ─────────────────────────────────────────
git status --short
echo  ─────────────────────────────────────────
echo.

set /p COMMIT="proxy.php is absent. Safe to commit? (y/n): "
if /i not "!COMMIT!"=="y" (
  echo  Aborted. Check .gitignore, then re-run.
  pause
  exit /b 1
)

git commit -m "Initial commit — BEN OS v2.2"
echo.

REM ══════════════════════════════════════════════════════════════
REM  STEP 7 — Connect to GitHub and push
REM ══════════════════════════════════════════════════════════════
echo  ─────────────────────────────────────────────────────────
echo  Step 7: Connect to GitHub
echo.
echo  First, go create an EMPTY private repo at:
echo    https://github.com/new
echo.
echo  Settings:
echo    Name:           benolivas-com
echo    Visibility:     Private
echo    Initialize:     OFF (no README, no .gitignore, nothing)
echo.
echo  Then copy the HTTPS URL. Looks like:
echo    https://github.com/YOUR_USERNAME/benolivas-com.git
echo  ─────────────────────────────────────────────────────────
echo.
set /p REPO_URL="Paste your GitHub repo URL here: "

if "!REPO_URL!"=="" (
  echo  No URL entered. Skipping GitHub push.
  echo  Run these manually when ready:
  echo    git remote add origin YOUR_REPO_URL
  echo    git branch -M main
  echo    git push -u origin main
  goto DONE
)

REM Remove existing remote if re-running
git remote remove origin >nul 2>&1

git remote add origin "!REPO_URL!"
git branch -M main

echo.
echo  Pushing to GitHub...
git push -u origin main

if errorlevel 1 (
  echo.
  echo  Push failed. Common causes:
  echo    - Wrong URL (check for typos)
  echo    - Not authenticated — run: git credential-manager
  echo    - Repo wasn't created empty (delete and recreate it)
  echo.
  echo  When fixed, run manually:
  echo    git push -u origin main
  pause
  exit /b 1
)

:DONE
echo.
echo  ══════════════════════════════════════════════════
echo  Done. Verify on GitHub:
echo    [ ] proxy.php does NOT appear
echo    [ ] data\ has 4 JSON files
echo    [ ] assets\ subfolders exist
echo    [ ] .gitignore is visible
echo  ══════════════════════════════════════════════════
echo.
echo  Future updates — three commands:
echo    git add -A
echo    git commit -m "your message"
echo    git push
echo.
pause
endlocal
