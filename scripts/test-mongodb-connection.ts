/**
 * Test MongoDB connection
 * Run: npx tsx scripts/test-mongodb-connection.ts
 */

import { getDatabase } from '../lib/db/mongodb';

async function testConnection() {
  console.log('🔌 Testing MongoDB connection...\n');
  
  try {
    console.log('Connecting to MongoDB...');
    const db = await getDatabase();
    
    console.log('✅ Connected successfully!');
    console.log(`Database name: ${db.databaseName}\n`);
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log(`Collections (${collections.length}):`);
    collections.forEach(col => console.log(`  - ${col.name}`));
    
    // Test sermons collection
    const sermonsCollection = db.collection('sermons');
    const count = await sermonsCollection.countDocuments();
    console.log(`\n📊 Sermons count: ${count}`);
    
    if (count > 0) {
      const sample = await sermonsCollection.findOne({});
      console.log('\n📄 Sample sermon:');
      console.log(`   Title: ${sample?.title}`);
      console.log(`   Slug: ${sample?.slug}`);
    }
    
    console.log('\n✅ MongoDB connection test passed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ MongoDB connection failed:');
    console.error(error);
    
    if (error instanceof Error) {
      console.error('\nError details:');
      console.error(`  Message: ${error.message}`);
      console.error(`  Stack: ${error.stack}`);
    }
    
    process.exit(1);
  }
}

testConnection();
