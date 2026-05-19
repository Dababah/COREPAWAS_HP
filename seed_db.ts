import { seedDatabase } from './src/lib/seed';

async function run() {
  console.log('Running manual seed...');
  const result = await seedDatabase();
  console.log('Seed result:', result);
}

run();
