/**
 * Node.js script to seed the database
 * This can be run directly from VS Code without using the terminal
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m'
};

// Logging functions
function log(message) {
  console.log(`${colors.green}[INFO]${colors.reset} ${message}`);
}

function warn(message) {
  console.log(`${colors.yellow}[WARNING]${colors.reset} ${message}`);
}

function error(message) {
  console.log(`${colors.red}[ERROR]${colors.reset} ${message}`);
}

// Main function
async function main() {
  try {
    // Ensure we're in the project root
    const packageJsonPath = path.resolve(__dirname, '../package.json');
    if (!fs.existsSync(packageJsonPath)) {
      error('This script must be run from the project root directory.');
      process.exit(1);
    }

    // Create necessary directories
    log('Creating necessary directories...');
    const dataDir = path.resolve(__dirname, '../packages/api/src/seeders/data');
    fs.mkdirSync(dataDir, { recursive: true });

    // Skip MongoDB check
    log('Skipping MongoDB check due to VS Code terminal issues.');
    warn('Please ensure MongoDB is running before continuing.');
    warn('If the seeder fails, you may need to start MongoDB manually:');
    warn('  - macOS: brew services start mongodb-community');
    warn('  - Linux: sudo systemctl start mongod');
    warn('  - Windows: Start MongoDB service from Services');

    // Run the seeder
    log('Running database seeder...');
    try {
      const apiDir = path.resolve(__dirname, '../packages/api');
      process.chdir(apiDir);
      
      // Execute the seeder
      log('Executing seeder...');
      execSync('npx ts-node src/seeders/ComprehensiveSeeder.ts', { 
        stdio: 'inherit',
        env: process.env
      });
      
      log('Database seeded successfully!');
      log('You can now start the application and explore the data.');
    } catch (execError) {
      error('Failed to seed the database.');
      warn('Common issues:');
      warn('  1. MongoDB is not running');
      warn('  2. MongoDB connection string is incorrect');
      warn('  3. Missing data files');
      warn('  4. TypeScript compilation errors');
      warn('');
      warn('Try running the seeder directly with:');
      warn('  cd packages/api && npx ts-node src/seeders/ComprehensiveSeeder.ts');
      process.exit(1);
    }
  } catch (err) {
    error(`An unexpected error occurred: ${err.message}`);
    process.exit(1);
  }
}

// Run the main function
main().catch(err => {
  error(`Unhandled error: ${err.message}`);
  process.exit(1);
});