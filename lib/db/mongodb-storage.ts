import { getDatabase } from './mongodb';
import type { Sermon } from '@/lib/types/sermon';

const COLLECTION_NAME = 'sermons';

/**
 * Read all sermons from MongoDB
 */
export async function readSermons(): Promise<Sermon[]> {
  try {
    const db = await getDatabase();
    const sermons = await db
      .collection(COLLECTION_NAME)
      .find({})
      .sort({ dateISO: -1, date: -1 })
      .toArray();
    
    // Convert MongoDB _id to string and map to Sermon type
    return sermons.map((doc) => ({
      slug: doc.slug,
      title: doc.title,
      subtitle: doc.subtitle,
      series: doc.series,
      tag: doc.tag,
      date: doc.date,
      dateISO: doc.dateISO,
      pastor: doc.pastor,
      pastorRole: doc.pastorRole,
      scripture: doc.scripture,
      excerpt: doc.excerpt,
      body: doc.body,
      featured: doc.featured,
      podcastLinks: doc.podcastLinks,
    })) as Sermon[];
  } catch (error) {
    console.error('Error reading sermons from MongoDB:', error);
    throw error;
  }
}

/**
 * Get sermon by slug
 */
export async function getSermonBySlug(slug: string): Promise<Sermon | null> {
  try {
    const db = await getDatabase();
    const sermon = await db.collection(COLLECTION_NAME).findOne({ slug });
    
    if (!sermon) {
      return null;
    }
    
    return {
      slug: sermon.slug,
      title: sermon.title,
      subtitle: sermon.subtitle,
      series: sermon.series,
      tag: sermon.tag,
      date: sermon.date,
      dateISO: sermon.dateISO,
      pastor: sermon.pastor,
      pastorRole: sermon.pastorRole,
      scripture: sermon.scripture,
      excerpt: sermon.excerpt,
      body: sermon.body,
      featured: sermon.featured,
      podcastLinks: sermon.podcastLinks,
    } as Sermon;
  } catch (error) {
    console.error('Error getting sermon by slug from MongoDB:', error);
    throw error;
  }
}

/**
 * Create a new sermon
 */
export async function createSermon(sermon: Sermon): Promise<Sermon> {
  try {
    const db = await getDatabase();
    
    // Check if sermon with same slug already exists
    const existing = await db.collection(COLLECTION_NAME).findOne({ slug: sermon.slug });
    if (existing) {
      throw new Error(`Sermon with slug "${sermon.slug}" already exists`);
    }
    
    await db.collection(COLLECTION_NAME).insertOne({
      ...sermon,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    return sermon;
  } catch (error) {
    console.error('Error creating sermon in MongoDB:', error);
    throw error;
  }
}

/**
 * Update a sermon by slug
 */
export async function updateSermon(slug: string, updatedSermon: Sermon): Promise<Sermon | null> {
  try {
    const db = await getDatabase();
    
    const result = await db.collection(COLLECTION_NAME).findOneAndUpdate(
      { slug },
      { 
        $set: {
          ...updatedSermon,
          updatedAt: new Date(),
        }
      },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      return null;
    }
    
    return {
      slug: result.slug,
      title: result.title,
      subtitle: result.subtitle,
      series: result.series,
      tag: result.tag,
      date: result.date,
      dateISO: result.dateISO,
      pastor: result.pastor,
      pastorRole: result.pastorRole,
      scripture: result.scripture,
      excerpt: result.excerpt,
      body: result.body,
      featured: result.featured,
      podcastLinks: result.podcastLinks,
    } as Sermon;
  } catch (error) {
    console.error('Error updating sermon in MongoDB:', error);
    throw error;
  }
}

/**
 * Delete a sermon by slug
 */
export async function deleteSermon(slug: string): Promise<boolean> {
  try {
    const db = await getDatabase();
    const result = await db.collection(COLLECTION_NAME).deleteOne({ slug });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting sermon from MongoDB:', error);
    throw error;
  }
}

/**
 * Count total sermons
 */
export async function countSermons(): Promise<number> {
  try {
    const db = await getDatabase();
    return await db.collection(COLLECTION_NAME).countDocuments();
  } catch (error) {
    console.error('Error counting sermons in MongoDB:', error);
    throw error;
  }
}

/**
 * Write sermons to MongoDB (for compatibility with JSON storage interface)
 * This replaces all sermons in the collection
 */
export async function writeSermons(sermons: Sermon[]): Promise<void> {
  try {
    const db = await getDatabase();
    
    // Clear existing sermons
    await db.collection(COLLECTION_NAME).deleteMany({});
    
    // Insert new sermons
    if (sermons.length > 0) {
      await db.collection(COLLECTION_NAME).insertMany(
        sermons.map(sermon => ({
          ...sermon,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      );
    }
  } catch (error) {
    console.error('Error writing sermons to MongoDB:', error);
    throw error;
  }
}
