import DatabaseSeeder from './scripts/seedDatabase';

const seeder = new DatabaseSeeder();
const clearFirst = process.argv.includes('--clear') || process.argv.includes('-c');

console.log('🌱 E-Commerce Platform Database Seeder');
console.log('======================================');

if (clearFirst) {
  console.log('⚠️  WARNING: This will clear existing database data');
  console.log('Press Ctrl+C to cancel, or wait 3 seconds to continue...\n');
  
  setTimeout(() => {
    seeder.seed(true);
  }, 3000);
} else {
  console.log('ℹ️  Adding seed data to existing database');
  console.log('Use --clear or -c to clear database first\n');
  seeder.seed(false);
}
