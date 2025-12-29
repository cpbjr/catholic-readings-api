#!/bin/bash
# Catholic Readings API - GitHub Repository Setup Script
# This script initializes and pushes the repository to GitHub

set -e  # Exit on any error

echo "🙏 Catholic Readings API - GitHub Setup"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Repository details
REPO_NAME="catholic-readings-api"
GITHUB_USER="cpbjr"
REPO_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

echo -e "${BLUE}Repository:${NC} ${REPO_NAME}"
echo -e "${BLUE}GitHub User:${NC} ${GITHUB_USER}"
echo -e "${BLUE}Remote URL:${NC} ${REPO_URL}"
echo ""

# Step 1: Check if we're in the right directory
echo -e "${YELLOW}Step 1:${NC} Verifying directory..."
CURRENT_DIR=$(basename "$PWD")
if [ "$CURRENT_DIR" != "$REPO_NAME" ]; then
    echo -e "${RED}Error:${NC} Not in catholic-readings-api directory"
    echo "Please run this script from: Projects/Daily Summary/catholic-readings-api/"
    exit 1
fi
echo -e "${GREEN}✓${NC} In correct directory"
echo ""

# Step 2: Check if files exist
echo -e "${YELLOW}Step 2:${NC} Checking for required files..."
if [ ! -f "README.md" ]; then
    echo -e "${RED}Error:${NC} README.md not found"
    exit 1
fi
if [ ! -f "LICENSE" ]; then
    echo -e "${RED}Error:${NC} LICENSE not found"
    exit 1
fi
if [ ! -d "readings" ]; then
    echo -e "${RED}Error:${NC} readings/ directory not found"
    exit 1
fi
if [ ! -d "liturgical-calendar" ]; then
    echo -e "${RED}Error:${NC} liturgical-calendar/ directory not found"
    exit 1
fi
echo -e "${GREEN}✓${NC} All required files present"
echo ""

# Step 3: Initialize git (if not already initialized)
echo -e "${YELLOW}Step 3:${NC} Initializing git repository..."
if [ ! -d ".git" ]; then
    git init
    echo -e "${GREEN}✓${NC} Git repository initialized"
else
    echo -e "${GREEN}✓${NC} Git repository already exists"
fi
echo ""

# Step 4: Add all files
echo -e "${YELLOW}Step 4:${NC} Adding files to git..."
git add .
echo -e "${GREEN}✓${NC} Files staged for commit"
echo ""

# Step 5: Create initial commit
echo -e "${YELLOW}Step 5:${NC} Creating initial commit..."
if git rev-parse --verify HEAD >/dev/null 2>&1; then
    echo -e "${BLUE}Note:${NC} Repository already has commits"
    echo "Skipping initial commit"
else
    git commit -m "Initial commit: Catholic Readings API for GitHub Pages

- 247 liturgical entries for 2025
- Daily Mass readings (First Reading, Psalm, Gospel)
- Celebrations and feast days with biographical data
- JSON format for easy API integration
- USCCB verification links
- Wikipedia research links
- MIT License - free for all uses

Built to serve the New Evangelization through technology."
    echo -e "${GREEN}✓${NC} Initial commit created"
fi
echo ""

# Step 6: Set main branch
echo -e "${YELLOW}Step 6:${NC} Setting main branch..."
git branch -M main
echo -e "${GREEN}✓${NC} Branch set to 'main'"
echo ""

# Step 7: Add remote (if not already added)
echo -e "${YELLOW}Step 7:${NC} Configuring remote repository..."
if git remote get-url origin >/dev/null 2>&1; then
    CURRENT_REMOTE=$(git remote get-url origin)
    if [ "$CURRENT_REMOTE" != "$REPO_URL" ]; then
        echo -e "${BLUE}Note:${NC} Updating remote URL"
        git remote set-url origin "$REPO_URL"
    else
        echo -e "${GREEN}✓${NC} Remote already configured correctly"
    fi
else
    git remote add origin "$REPO_URL"
    echo -e "${GREEN}✓${NC} Remote added: origin"
fi
echo ""

# Step 8: Push to GitHub
echo -e "${YELLOW}Step 8:${NC} Pushing to GitHub..."
echo ""
echo -e "${RED}IMPORTANT:${NC} Make sure you've created the repository on GitHub first!"
echo "Go to: https://github.com/new"
echo "Repository name: ${REPO_NAME}"
echo "Description: Free Catholic Mass readings and liturgical calendar API via GitHub Pages"
echo "Public: YES"
echo "Initialize: NO"
echo ""
read -p "Have you created the repository on GitHub? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo -e "${RED}Aborting.${NC} Please create the repository first."
    exit 0
fi

echo ""
echo "Pushing to GitHub..."
if git push -u origin main; then
    echo -e "${GREEN}✓${NC} Successfully pushed to GitHub!"
else
    echo -e "${RED}Error:${NC} Failed to push to GitHub"
    echo ""
    echo "Common issues:"
    echo "1. Repository doesn't exist on GitHub yet"
    echo "2. Wrong GitHub username in URL"
    echo "3. Authentication failed (need to enter password or token)"
    echo ""
    echo "Try running manually:"
    echo "  git push -u origin main"
    exit 1
fi
echo ""

# Step 9: Next steps
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Repository Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo ""
echo "1. Enable GitHub Pages:"
echo "   • Go to: https://github.com/${GITHUB_USER}/${REPO_NAME}/settings/pages"
echo "   • Source: Deploy from 'main' branch, / (root)"
echo "   • Click 'Save'"
echo ""
echo "2. Add repository topics:"
echo "   • Go to: https://github.com/${GITHUB_USER}/${REPO_NAME}"
echo "   • Click gear icon next to 'About'"
echo "   • Add topics: catholic, api, liturgy, mass-readings, calendar"
echo "   • Add website: https://${GITHUB_USER}.github.io/${REPO_NAME}/"
echo ""
echo "3. Wait 1-2 minutes for GitHub Pages to deploy"
echo ""
echo "4. Test your API:"
echo "   curl https://${GITHUB_USER}.github.io/${REPO_NAME}/liturgical-calendar/2025/12-25.json"
echo ""
echo -e "${BLUE}Documentation:${NC}"
echo "   • See DEPLOYMENT-GUIDE.md for detailed instructions"
echo "   • See GITHUB-METADATA.md for discoverability tips"
echo ""
echo -e "${GREEN}🙏 Built to serve the New Evangelization through technology!${NC}"
echo ""
