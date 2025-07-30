#!/bin/bash

# Setup Script for AI-Powered Social Media Features
# This script helps configure the new social media functionality

echo "🤖 Setting Up AI-Powered Social Media Features"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${BLUE}🔍 Checking Prerequisites${NC}"

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

if ! command_exists mongod && ! command_exists brew; then
    echo -e "${YELLOW}⚠️  MongoDB might not be installed. Please ensure MongoDB is running.${NC}"
fi

echo -e "${GREEN}✅ Prerequisites check complete${NC}"
echo ""

# Check current directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Please run this script from the project root directory${NC}"
    exit 1
fi

# Install dependencies if needed
echo -e "${BLUE}📦 Installing Dependencies${NC}"
npm install
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created${NC}"
else
    echo -e "${GREEN}✅ .env file exists${NC}"
fi

# Check for OpenAI API key
echo -e "${BLUE}🔑 Checking AI Configuration${NC}"
if grep -q "OPENAI_API_KEY=your_openai_api_key_here" .env; then
    echo -e "${YELLOW}⚠️  OpenAI API key not configured${NC}"
    echo "The system will use basic keyword-based analysis instead of AI."
    echo "To enable advanced AI features:"
    echo "1. Get an API key from https://platform.openai.com/api-keys"
    echo "2. Replace 'your_openai_api_key_here' in .env with your actual key"
    echo ""
else
    echo -e "${GREEN}✅ OpenAI API key configured${NC}"
fi

# Build the project
echo -e "${BLUE}🔨 Building Project${NC}"
npm run build
echo ""

# Start MongoDB if not running (macOS with Homebrew)
if command_exists brew; then
    echo -e "${BLUE}🍃 Starting MongoDB${NC}"
    brew services start mongodb/brew/mongodb-community 2>/dev/null || echo "MongoDB might already be running"
    echo ""
fi

# Create test data
echo -e "${BLUE}📚 Setting Up Test Data${NC}"
echo "Creating sample social media posts for testing..."

# Start the server in background for testing
echo -e "${BLUE}🚀 Starting Server${NC}"
npm run dev:server &
SERVER_PID=$!

# Wait for server to start
echo "Waiting for server to start..."
sleep 5

# Check if server is running
if curl -s http://localhost:3000/api/status > /dev/null; then
    echo -e "${GREEN}✅ Server is running${NC}"
else
    echo -e "${RED}❌ Server failed to start${NC}"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

# Stop the background server
kill $SERVER_PID 2>/dev/null
echo ""

# Create a quick demo
echo -e "${BLUE}🎬 Creating Demo Script${NC}"
cat > demo-social-features.js << 'EOF'
// Demo Script for Social Media AI Features
const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Sample posts to demonstrate AI categorization
const samplePosts = [
    {
        content: "My golden retriever loves to swim! Any tips for water training?",
        category: "general-discussion",
        expected: "pets"
    },
    {
        content: "Just deployed my React app using Docker containers. DevOps is amazing!",
        category: "general-discussion", 
        expected: "technology"
    },
    {
        content: "Started intermittent fasting and feeling great! Best health decision ever.",
        category: "general-discussion",
        expected: "health-wellness"
    },
    {
        content: "This stupid app is garbage and the developers are morons!",
        category: "general-discussion",
        expected: "moderated content"
    }
];

async function demonstrateFeatures() {
    console.log('🤖 Social Media AI Features Demo');
    console.log('================================');
    
    // This would need actual authentication token in real use
    console.log('Note: Run this after logging in and getting an auth token');
    
    samplePosts.forEach((post, index) => {
        console.log(`\n${index + 1}. Content: "${post.content}"`);
        console.log(`   Original Category: ${post.category}`);
        console.log(`   Expected: ${post.expected}`);
        console.log(`   Features: Auto-categorization, content moderation, notifications`);
    });
    
    console.log('\n🚀 To test these features:');
    console.log('1. Start the server: npm run dev:server');
    console.log('2. Login to get auth token: POST /api/auth/login');
    console.log('3. Create posts: POST /api/social/posts');
    console.log('4. Check notifications: GET /api/social/notifications');
    console.log('5. View categorized posts: GET /api/social/posts?category=pets');
}

demonstrateFeatures();
EOF

node demo-social-features.js
rm demo-social-features.js
echo ""

# Final instructions
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo -e "${BLUE}🚀 Next Steps:${NC}"
echo "1. Start the development server:"
echo "   npm run dev:server"
echo ""
echo "2. Test the social media features:"
echo "   ./scripts/test-social-features.sh"
echo ""
echo "3. Start the frontend (optional):"
echo "   npm run dev:frontend"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "• Social Media AI Features: ./SOCIAL_MEDIA_AI_FEATURES.md"
echo "• API Endpoints: http://localhost:3000/api/status"
echo "• Test Script: ./scripts/test-social-features.sh"
echo ""
echo -e "${YELLOW}💡 Key Features Now Available:${NC}"
echo "✅ Automatic content categorization (pets, tech, health, etc.)"
echo "✅ AI-powered content moderation and rewriting"
echo "✅ Smart notifications for category changes"
echo "✅ Safety filtering for different age groups"
echo "✅ Professional tone enforcement"
echo "✅ Topic detection and suggestions"
echo ""
echo -e "${GREEN}Your social media platform is now intelligent! 🧠✨${NC}"