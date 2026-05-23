#!/bin/bash
# Deploy MemristorIndia to Netlify

set -e

export PATH="/Users/mdyousufsk/.local/node/bin:$PATH"
cd "$(dirname "$0")"

echo "🚀 MemristorIndia Deployment to Netlify"
echo "========================================"
echo ""

# Check if dist exists
if [ ! -d "dist" ]; then
    echo "📦 Building production version..."
    npm run build
    echo "✅ Build complete"
else
    echo "✅ Production build already exists"
fi

echo ""
echo "🔐 Authenticating with Netlify..."
echo "   (This will open your browser)"
echo ""

netlify deploy --prod --dir=dist

echo ""
echo "✅ Deployment complete!"
echo "Your site is now live at the URL above."
