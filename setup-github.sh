#!/bin/bash
# Push MemristorIndia to GitHub and Connect to Netlify

set -e

cd "$(dirname "$0")"

echo "🚀 MemristorIndia GitHub Setup"
echo "==============================="
echo ""

# Prompt for GitHub username
read -p "Enter your GitHub username: " GITHUB_USER

if [ -z "$GITHUB_USER" ]; then
    echo "❌ GitHub username is required"
    exit 1
fi

echo ""
echo "📝 Setting up GitHub repository..."
echo "   Repository: memristor-india"
echo "   Owner: $GITHUB_USER"
echo ""

# Add remote
git remote add origin "https://github.com/$GITHUB_USER/memristor-india.git" 2>/dev/null || \
git remote set-url origin "https://github.com/$GITHUB_USER/memristor-india.git"

# Ensure main branch
if ! git rev-parse --verify main >/dev/null 2>&1; then
    echo "📍 Renaming branch to 'main'..."
    git branch -M main
fi

echo ""
echo "📤 Pushing to GitHub..."
echo "   (You may be prompted to authenticate)"
echo ""

git push -u origin main

echo ""
echo "✅ GitHub setup complete!"
echo ""
echo "🔗 Next steps:"
echo "   1. Go to: https://app.netlify.com"
echo "   2. Click: 'New site from Git'"
echo "   3. Choose: GitHub"
echo "   4. Select: memristor-india"
echo "   5. Click: Deploy"
echo ""
echo "Your site will be live at: https://memristor-india-xxxx.netlify.app"
echo "Auto-deploy on every git push! 🎉"
