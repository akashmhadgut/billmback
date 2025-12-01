@echo off
echo Initializing Git repository...
git init
if %errorlevel% neq 0 (
    echo Error: git init failed. Make sure git is installed and in your PATH.
    pause
    exit /b %errorlevel%
)

echo Adding files...
git add .

echo Committing files...
git commit -m "Initial commit"

echo Adding remote origin...
git remote add origin https://github.com/akashmhadgut/bill-management-backend.git
if %errorlevel% neq 0 (
    echo Remote might already exist, setting url...
    git remote set-url origin https://github.com/akashmhadgut/bill-management-backend.git
)

echo Renaming branch to main...
git branch -M main

echo Pushing to GitHub...
git push -u origin main

echo Done.
pause
