# MongoDB Migration Guide

## Overview

Your sermon storage has been migrated from JSON files to MongoDB to support Vercel deployment. This allows create, update, and delete operations to work in production.

## What Changed

### Before (JSON Storage)
- ❌ Sermons stored in `data/sermons.json`
- ❌ File writes don't work on Vercel (read-only filesystem)
- ❌ Create/Update/Delete failed in production

### After (MongoDB Storage)
- ✅ Sermons stored in MongoDB Atlas
- ✅ All operations work on Vercel
- ✅ Data persists across deployments
- ✅ Scalable and production-ready

## Migration Steps

### 1. Ensure MongoDB is Running

Make sure your MongoDB Atlas cluster is accessible and the connection string in `.env.local` is correct:

```env
MONGODB_URI=mongodb+srv://hillaryprosperwahua_db_user:Dm0AhWe5Nv0KkNJj@cluster0.21dzes8.mongodb.net/church_db?retryWrites=true&w=majority&appName=Cluster0
```

### 2. Install tsx (if not already installed)

```bash
npm install -D tsx
```

### 3. Run the Migration Script

```bash
npx tsx scripts/migrate-sermons-to-mongodb.ts
```

This will:
- Read all sermons from `data/sermons.json`
- Connect to MongoDB
- Insert all sermons into the `sermons` collection
- Verify the migration

### 4. Add Environment Variables to Vercel

Go to your Vercel project settings and add:

**Required:**
- `MONGODB_URI` - Your MongoDB connection string
- `PODCAST_RSS_URL` - Your podcast RSS feed URL
- `YOUTUBE_CHANNEL_ID` - Your YouTube channel ID

**Optional (if you use them separately):**
- `MONGODB_USER`
- `MONGODB_PASSWORD`
- `MONGODB_CLUSTER`
- `MONGODB_DATABASE`

### 5. Deploy to Vercel

```bash
git add .
git commit -m "Migrate sermons to MongoDB"
git push
```

Vercel will automatically deploy your changes.

## Testing

### Test Locally

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to admin sermons page:
   ```
   http://localhost:3000/admin-sermons
   ```

3. Try creating, updating, and deleting sermons

### Test on Vercel

1. After deployment, go to your live site
2. Login to admin panel
3. Test sermon CRUD operations
4. Verify changes persist

## Rollback (if needed)

If you need to rollback to JSON storage:

1. Change imports in these files back to `@/lib/db/json-storage`:
   - `app/api/v1/admin/sermons/route.ts`
   - `app/api/v1/sermons/route.ts`

2. Redeploy

**Note:** This will only work locally, not on Vercel.

## Files Modified

- ✅ Created: `lib/db/mongodb-storage.ts` - MongoDB storage adapter
- ✅ Created: `scripts/migrate-sermons-to-mongodb.ts` - Migration script
- ✅ Updated: `app/api/v1/admin/sermons/route.ts` - Use MongoDB storage
- ✅ Updated: `app/api/v1/sermons/route.ts` - Use MongoDB storage
- ✅ Updated: `lib/db/mongodb.ts` - Made MongoDB URI optional for build

## Troubleshooting

### "MongoDB URI not configured" error

**Solution:** Make sure `MONGODB_URI` is set in your environment variables (both locally and on Vercel).

### Migration script fails

**Solution:** 
1. Check your MongoDB connection string
2. Ensure your IP is whitelisted in MongoDB Atlas
3. Verify the database name is correct

### Sermons not showing after migration

**Solution:**
1. Check MongoDB Atlas to verify sermons were inserted
2. Check Vercel logs for errors
3. Verify environment variables are set correctly

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check MongoDB Atlas logs
3. Verify all environment variables are set
4. Test locally first before deploying

## Data Backup

Your original JSON data is still in `data/sermons.json` as a backup. Keep this file for reference.
