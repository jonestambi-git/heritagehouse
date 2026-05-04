/**
 * Migration script to move sermons from JSON file to MongoDB
 * 
 * Run this script once to migrate your existing sermon data:
 * npx tsx scripts/migrate-sermons-to-mongodb.ts
 */

import fs from 'fs/promises';
import path from 'path';
import { getDatabase } from '../lib/db/mongodb';

async function migrateSermons() {
  console.log('🚀 Starting sermon migration from JSON to MongoDB...\n');

  try {
    // Read sermons from JSON file
    const jsonPath = path.join(process.cwd(), 'data', 'sermons.json');
    console.log(`📖 Reading sermons from: ${jsonPath}`);
    
    const jsonData = await fs.readFile(jsonPath, 'utf-8');
    const sermons = JSON.parse(jsonData);
    
    console.log(`✓ Found ${sermons.length} sermons in JSON file\n`);

    if (sermons.length === 0) {
      console.log('⚠️  No sermons to migrate. Exiting.');
      return;
    }

    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    const db = await getDatabase();
    const collection = db.collection('sermons');
    
    console.log('✓ Connected to MongoDB\n');

    // Check if sermons already exist
    const existingCount = await collection.countDocuments();
    
    if (existingCount > 0) {
      console.log(`⚠️  Warning: ${existingCount} sermons already exist in MongoDB`);
      console.log('This will replace all existing sermons. Continue? (Ctrl+C to cancel)\n');
      
      // Wait 3 seconds before proceeding
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // Clear existing sermons
    if (existingCount > 0) {
      console.log('🗑️  Clearing existing sermons...');
      await collection.deleteMany({});
      console.log('✓ Cleared existing sermons\n');
    }

    // Insert sermons into MongoDB
    console.log('📝 Inserting sermons into MongoDB...');
    
    const sermonsWithTimestamps = sermons.map((sermon: any) => ({
      ...sermon,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await collection.insertMany(sermonsWithTimestamps);
    
    console.log(`✓ Successfully inserted ${result.insertedCount} sermons\n`);

    // Verify migration
    const finalCount = await collection.countDocuments();
    console.log('✅ Migration complete!');
    console.log(`   Total sermons in MongoDB: ${finalCount}`);
    
    // Display sample sermon
    const sample = await collection.findOne({});
    if (sample) {
      console.log('\n📄 Sample sermon:');
      console.log(`   Title: ${sample.title}`);
      console.log(`   Slug: ${sample.slug}`);
      console.log(`   Date: ${sample.date}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateSermons();
