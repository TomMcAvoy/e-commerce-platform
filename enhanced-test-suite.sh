#!/bin/bash

# Enhanced E-Commerce Platform Test Suite
# Incorporates multiple testing tools and methodologies

API_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:3002"

echo "🚀 Enhanced E-Commerce Platform Test Suite"
echo "=========================================="
echo "API URL: $API_URL"
echo "Frontend URL: $FRONTEND_URL"
echo ""

# Function to check if a tool is available
check_tool() {
    if command -v "$1" >/dev/null 2>&1; then
        echo "✅ $1 is available"
        return 0
    else
        echo "❌ $1 is not installed"
        return 1
    fi
}

# 1. Basic Health Checks (curl)
echo "1️⃣ BASIC HEALTH CHECKS"
echo "======================="
curl -s "$API_URL/health" | jq '.' 2>/dev/null || curl -s "$API_URL/health"
echo ""

# 2. API Testing with Newman (if available)
echo "2️⃣ POSTMAN/NEWMAN API TESTING"
echo "============================="
if check_tool newman; then
    echo "📋 Creating Postman collection for Newman..."
    cat > /tmp/ecommerce-api-tests.json << 'EOF'
{
  "info": {
    "name": "E-Commerce API Tests",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/health",
          "host": ["{{base_url}}"],
          "path": ["health"]
        }
      },
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Health check returns 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "pm.test('Response has status OK', function () {",
              "    var jsonData = pm.response.json();",
              "    pm.expect(jsonData.status).to.eql('OK');",
              "});"
            ]
          }
        }
      ]
    }
  ]
}
EOF
    
    # Run Newman tests
    newman run /tmp/ecommerce-api-tests.json --env-var "base_url=$API_URL" \
           --reporters cli,json --reporter-json-export /tmp/newman-results.json
    
    # Cleanup
    rm -f /tmp/ecommerce-api-tests.json
else
    echo "⚠️  Newman not available. Install with: npm install -g newman"
fi
echo ""

# 3. Performance Testing with Artillery (if available)
echo "3️⃣ PERFORMANCE TESTING"
echo "======================"
if check_tool artillery; then
    echo "🎯 Running load test with Artillery..."
    cat > /tmp/artillery-config.yml << EOF
config:
  target: '$API_URL'
  phases:
    - duration: 30
      arrivalRate: 5
  defaults:
    headers:
      Origin: '$FRONTEND_URL'

scenarios:
  - name: "Health check load test"
    requests:
      - get:
          url: "/health"
      - get:
          url: "/api/products"
EOF
    
    artillery run /tmp/artillery-config.yml
    rm -f /tmp/artillery-config.yml
else
    echo "⚠️  Artillery not available. Install with: npm install -g artillery"
fi
echo ""

# 4. Browser Testing with Playwright (if available)
echo "4️⃣ BROWSER AUTOMATION TESTING"
echo "============================="
if npm list playwright >/dev/null 2>&1; then
    echo "🎭 Running Playwright tests..."
    cat > /tmp/playwright-test.js << 'EOF'
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Test debug page
    await page.goto('http://localhost:3002/debug-api.html');
    const title = await page.title();
    console.log('✅ Debug page loaded:', title);
    
    // Click health check button
    await page.click('button[onclick="testHealthEndpoint()"]');
    console.log('✅ Health check button clicked');
    
    // Wait for results
    await page.waitForSelector('#results .result', { timeout: 5000 });
    const resultText = await page.textContent('#results .result');
    console.log('✅ Test result:', resultText.substring(0, 50) + '...');
    
  } catch (error) {
    console.log('❌ Playwright test failed:', error.message);
  } finally {
    await browser.close();
  }
})();
EOF
    
    cd /Users/thomasmcavoy/GitHub/shoppingcart && node /tmp/playwright-test.js
    rm -f /tmp/playwright-test.js
else
    echo "⚠️  Playwright not available. Install with: npm install playwright"
fi
echo ""

# 5. Security Testing with OWASP ZAP (if available)
echo "5️⃣ SECURITY SCANNING"
echo "===================="
if check_tool zap-baseline.py; then
    echo "🛡️  Running OWASP ZAP security scan..."
    zap-baseline.py -t "$FRONTEND_URL" -J zap-report.json
else
    echo "⚠️  OWASP ZAP not available. Install from: https://www.zaproxy.org/"
fi
echo ""

# 6. Database Health Check
echo "6️⃣ DATABASE CONNECTIVITY"
echo "========================"
if check_tool mongo; then
    echo "🗄️  Testing MongoDB connection..."
    mongo --eval "db.adminCommand('ismaster')" --quiet || echo "❌ MongoDB connection failed"
else
    echo "⚠️  MongoDB client not available"
fi

if check_tool redis-cli; then
    echo "📦 Testing Redis connection..."
    redis-cli ping || echo "❌ Redis connection failed"
else
    echo "⚠️  Redis client not available"
fi
echo ""

# 7. Infrastructure Checks
echo "7️⃣ INFRASTRUCTURE HEALTH"
echo "========================"
echo "💾 Disk space:"
df -h | head -n 2

echo "🧠 Memory usage:"
free -h | head -n 2

echo "⚡ CPU load:"
uptime

echo "🌐 Network connectivity:"
ping -c 1 google.com >/dev/null 2>&1 && echo "✅ Internet connection OK" || echo "❌ No internet connection"
echo ""

# 8. Docker Health (if using containers)
echo "8️⃣ CONTAINER HEALTH"
echo "==================="
if check_tool docker; then
    echo "🐳 Docker containers:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "No containers running"
    
    if check_tool docker-compose; then
        echo "🔗 Docker Compose services:"
        docker-compose ps 2>/dev/null || echo "No docker-compose services found"
    fi
else
    echo "⚠️  Docker not available"
fi
echo ""

# 9. Generate Test Report
echo "9️⃣ TEST REPORT GENERATION"
echo "========================="
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_FILE="test-report-$TIMESTAMP.json"

cat > "$REPORT_FILE" << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "test_suite": "Enhanced E-Commerce Platform Tests",
  "environment": {
    "api_url": "$API_URL",
    "frontend_url": "$FRONTEND_URL",
    "node_version": "$(node --version 2>/dev/null || echo 'Not installed')",
    "npm_version": "$(npm --version 2>/dev/null || echo 'Not installed')"
  },
  "tools_available": {
    "curl": $(check_tool curl >/dev/null && echo 'true' || echo 'false'),
    "jq": $(check_tool jq >/dev/null && echo 'true' || echo 'false'),
    "newman": $(check_tool newman >/dev/null && echo 'true' || echo 'false'),
    "artillery": $(check_tool artillery >/dev/null && echo 'true' || echo 'false'),
    "docker": $(check_tool docker >/dev/null && echo 'true' || echo 'false'),
    "mongo": $(check_tool mongo >/dev/null && echo 'true' || echo 'false'),
    "redis-cli": $(check_tool redis-cli >/dev/null && echo 'true' || echo 'false')
  }
}
EOF

echo "📊 Test report generated: $REPORT_FILE"
echo ""

# 10. Recommendations
echo "🔟 TOOL RECOMMENDATIONS"
echo "======================="
echo "📦 Package Managers & Installation:"
echo "   brew install newman artillery jq"
echo "   npm install -g @playwright/test artillery newman"
echo "   pip install ansible"
echo ""
echo "🔧 Infrastructure Tools:"
echo "   Docker: https://docs.docker.com/get-docker/"
echo "   Ansible: https://docs.ansible.com/ansible/latest/installation_guide/"
echo "   Terraform: https://learn.hashicorp.com/terraform/getting-started/install"
echo ""
echo "📊 Monitoring Tools:"
echo "   Prometheus: https://prometheus.io/download/"
echo "   Grafana: https://grafana.com/get"
echo "   ELK Stack: https://www.elastic.co/elastic-stack"
echo ""

echo "================================"
echo "🏁 Enhanced Test Suite Completed!"
echo "================================"
