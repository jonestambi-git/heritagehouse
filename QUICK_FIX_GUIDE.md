# Quick Fix Guide - Before Production

## 🚨 CRITICAL FIXES (Do These First!)

### Fix 1: Remove Credentials from Git (5 minutes)

**Step 1**: Remove .env from git history
```bash
git rm --cached .env
```

**Step 2**: Add .env to .gitignore
```bash
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Remove .env from version control"
```

**Step 3**: Create .env.example (for reference)
```bash
cp .env .env.example
```

**Step 4**: Edit .env.example to remove sensitive values
```
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-secure-password
```

**Step 5**: Commit the example file
```bash
git add .env.example
git commit -m "Add .env.example template"
```

---

### Fix 2: Set Environment Variables on Hosting Platform (5 minutes)

**For Vercel**:
1. Go to Project Settings → Environment Variables
2. Add these variables:
   ```
   ADMIN_EMAIL = your-email@example.com
   ADMIN_PASSWORD = strong-secure-password
   NEXT_PUBLIC_SITE_URL = https://yourdomain.com
   PODCAST_RSS_URL = your-podcast-rss-url (if needed)
   ```
3. Redeploy

**For Netlify**:
1. Go to Site Settings → Build & Deploy → Environment
2. Add the same variables
3. Trigger a new deploy

**For Other Platforms**:
- Refer to their documentation for setting environment variables
- Usually found in Settings or Configuration section

---

### Fix 3: Add Logo Files (10 minutes)

**Step 1**: Save the HeritageHouse Ministries logo
- Save as PNG: `heritage-house-ministries-logo.png`
- Save as SVG: `heritage-house-logo.svg`

**Step 2**: Place in public folder
```bash
cp heritage-house-ministries-logo.png gofpmremade/public/
cp heritage-house-logo.svg gofpmremade/public/
```

**Step 3**: Verify files exist
```bash
ls -la gofpmremade/public/heritage-house*
```

**Step 4**: Commit to git
```bash
git add gofpmremade/public/heritage-house*
git commit -m "Add HeritageHouse Ministries logo files"
```

---

## ✅ VERIFICATION STEPS

### Test Locally First
```bash
# Build the project
npm run build

# Start production server
npm run start

# Visit http://localhost:3000
# Check:
# - Logo displays in navbar
# - Logo displays in footer
# - Background watermark visible
# - All pages load without errors
```

### Check Environment Variables
```bash
# Create .env.local for testing
cat > .env.local << EOF
ADMIN_EMAIL=test@example.com
ADMIN_PASSWORD=test-password
NEXT_PUBLIC_SITE_URL=http://localhost:3000
EOF

# Run build again
npm run build
```

---

## 🔒 SECURITY CHECKLIST

Before deploying:

- [ ] `.env` file is NOT in git
- [ ] `.env` is in `.gitignore`
- [ ] Environment variables set on hosting platform
- [ ] Admin password is strong (not "ADMIN_PASSWORD")
- [ ] HTTPS is enabled
- [ ] No console.log statements in production code
- [ ] All API endpoints are secure

---

## 📝 OPTIONAL IMPROVEMENTS

### Remove Console Logging (10 minutes)
Search for and remove/wrap these:
- `console.log()`
- `console.info()`
- `console.warn()`
- `console.error()`

Wrap in:
```typescript
if (process.env.NODE_ENV === 'development') {
  console.log('debug message');
}
```

### Add Error Boundaries (15 minutes)
Create `app/error.tsx`:
```typescript
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

---

## 🚀 DEPLOYMENT COMMANDS

### Using Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Using Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Using Docker
```bash
# Build Docker image
docker build -t heritage-house .

# Run container
docker run -p 3000:3000 heritage-house
```

---

## ⚠️ COMMON ISSUES & FIXES

### Issue: "Environment variable not found"
**Fix**: Make sure variable is set on hosting platform, not just locally

### Issue: "Logo not displaying"
**Fix**: Verify files exist in `public/` folder and paths are correct

### Issue: "API calls failing"
**Fix**: Check API endpoints are accessible and environment variables are set

### Issue: "Build fails"
**Fix**: Run `npm run build` locally to see error messages

---

## 📞 SUPPORT

If you get stuck:

1. Check the PRODUCTION_READINESS_REPORT.md
2. Review hosting platform documentation
3. Check browser console for errors
4. Check hosting platform logs
5. Test locally first with `npm run build && npm run start`

---

## Summary

**Time to fix**: ~20 minutes
**Difficulty**: Easy
**Impact**: Critical for security

Once you complete these steps, your project will be ready for production! 🎉
