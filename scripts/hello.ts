/**
 * A simple TypeScript script that prints a hello message
 * This can be run directly from VS Code without using the terminal
 */

// Define a simple interface
interface SystemInfo {
  nodeVersion: string;
  platform: string;
  architecture: string;
  currentDirectory: string;
  timestamp: Date;
}

// Function to get system information
function getSystemInfo(): SystemInfo {
  return {
    nodeVersion: process.version,
    platform: process.platform,
    architecture: process.arch,
    currentDirectory: process.cwd(),
    timestamp: new Date()
  };
}

// Function to print a greeting
function printGreeting(name: string = 'User'): void {
  console.log(`Hello, ${name}!`);
  console.log('Welcome to the shopping cart application.');
  console.log(`Current time: ${new Date().toLocaleTimeString()}`);
}

// Main function
function main(): void {
  console.log('='.repeat(50));
  console.log('TYPESCRIPT HELLO SCRIPT');
  console.log('='.repeat(50));
  
  // Print greeting
  printGreeting();
  
  // Get and print system info
  const sysInfo = getSystemInfo();
  console.log('\nSystem information:');
  console.log(`- Node.js version: ${sysInfo.nodeVersion}`);
  console.log(`- Platform: ${sysInfo.platform}`);
  console.log(`- Architecture: ${sysInfo.architecture}`);
  console.log(`- Current directory: ${sysInfo.currentDirectory}`);
  console.log(`- Timestamp: ${sysInfo.timestamp.toISOString()}`);
  
  console.log('\nScript completed successfully!');
  console.log('='.repeat(50));
}

// Run the main function
main();