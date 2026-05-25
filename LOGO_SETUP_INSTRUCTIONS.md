# HeritageHouse Ministries Logo Setup

## Background Logo Update

All background watermark logos across the site have been updated to reference:
```
/public/heritage-house-ministries-logo.png
```

## Files Updated (13 pages)
- `app/live-service/page.tsx`
- `app/events/page.tsx`
- `app/community/page.tsx`
- `app/contact/page.tsx`
- `app/project/page.tsx`
- `app/give/page.tsx`
- `app/project/[slug]/page.tsx`
- `app/announcements/page.tsx`
- `app/mission/page.tsx`
- `app/sermons/page.tsx`
- `app/sermons/[slug]/page.tsx`
- `app/ministry/page.tsx`
- `app/location/page.tsx`

## Setup Instructions

### Step 1: Save the Logo Image
1. Download or save the HeritageHouse Ministries logo image (the circular logo with colorful cross and book)
2. Save it as a PNG file: `heritage-house-ministries-logo.png`
3. Place it in the `gofpmremade/public/` directory

### Step 2: Verify
After saving the file, the background watermark should appear on all pages with the new HeritageHouse Ministries logo at 4% opacity.

## Logo Specifications
- **Filename**: `heritage-house-ministries-logo.png`
- **Location**: `gofpmremade/public/heritage-house-ministries-logo.png`
- **Usage**: Background watermark on all content pages
- **Display**: 
  - Width: `min(80vw, 700px)`
  - Height: `min(80vw, 700px)`
  - Opacity: 0.04 (4%)
  - Position: Fixed, centered, behind content

## Additional Logo References
- **Navbar/Footer Logo**: `/public/heritage-house-logo.svg` (SVG version)
- **Hero Component**: `/public/heritage-house-logo.svg` (SVG version)

## Notes
- The background watermark is semi-transparent (4% opacity) so it doesn't interfere with content
- The logo is responsive and scales with viewport width
- All pages now use the same consistent branding
