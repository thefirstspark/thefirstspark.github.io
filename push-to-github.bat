@echo off
REM First Spark Hub - Push to GitHub
REM This script pushes your code to GitHub

cd /d "C:\Users\Katel\Desktop\first-spark-hub"

git init
git config user.name "Katelin"
git config user.email "your-email@example.com"
git add .
git commit -m "Initial First Spark Member Hub - Ready for deployment"
git branch -M main
git remote add origin https://github.com/thefirstspark/first-spark-hub.git
git push -u origin main

echo.
echo ===================================
echo Push complete!
echo Visit: https://github.com/thefirstspark/first-spark-hub
echo ===================================
pause
