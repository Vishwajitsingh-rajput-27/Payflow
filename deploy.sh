#!/usr/bin/env bash
# ============================================================
#  Payflow – GitHub Pages Deploy Script
#  Usage: bash deploy.sh
# ============================================================
set -e

echo ""
echo "======================================================"
echo "  🚀  Payflow – GitHub Pages Deployment"
echo "======================================================"
echo ""

# 1. Build with GitHub Pages config
echo "📦  Building project for GitHub Pages..."
npx vite build --config vite.github.config.ts

echo ""
echo "✅  Build complete! Output is in ./dist/"
echo ""

# 2. Copy 404.html into dist (already in public/ so vite copies it)
echo "📄  Verifying 404.html exists in dist..."
if [ ! -f dist/404.html ]; then
  cp public/404.html dist/404.html
  echo "     → Copied 404.html manually."
else
  echo "     → 404.html already present."
fi

# 3. Ensure .nojekyll exists
touch dist/.nojekyll
echo "📄  .nojekyll file ensured."

echo ""
echo "🌐  Deploying to GitHub Pages (gh-pages branch)..."
npx gh-pages -d dist --dotfiles

echo ""
echo "======================================================"
echo "  ✅  Deployment Complete!"
echo "  🔗  Live URL:"
echo "      https://vishwajitsingh-rajput-27.github.io/Payflow/"
echo "======================================================"
echo ""
