# Remaining Updates Checklist

## Current Status
- ✅ **5 pages completed** (Hero, Announcements, Contact, Community, Events)
- ⏳ **22 pages remaining**
- 📊 **18.5% complete**

## Quick Update Template

For each remaining page, follow this template:

### 1. Add Import
```tsx
import { typography, spacing, colors, glass, fonts } from "@/lib/design-system";
```

### 2. Update Main Container
```tsx
// OLD
className="px-6 py-6 sm:px-10 sm:py-8"

// NEW
className={`${spacing.containerPadding} ${spacing.containerPaddingY}`}
```

### 3. Update Page Heading
```tsx
// OLD
style={{ fontSize: "clamp(2.6rem, 10vw, 6rem)" }}

// NEW
style={{
  ...typography.h1,
  fontFamily: fonts.serif,
  marginTop: "clamp(1rem, 3vw, 2rem)",
}}
```

### 4. Update All Text
```tsx
// OLD
className="text-white/70 text-sm"

// NEW
style={{ ...typography.body, color: colors.text.secondary }}
```

### 5. Update Glass Effects
```tsx
// OLD
style={{
  background: "rgba(0,0,0,0.45)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.12)",
}}

// NEW
style={glass.light}
```

### 6. Update Spacing
```tsx
// OLD
className="mt-8 sm:mt-12 gap-4 sm:gap-6"

// NEW
className={`${spacing.marginTopLg} ${spacing.spacingMd}`}
```

## Pages to Update

### High Priority (3 pages) - ~60 minutes
- [ ] **Location** - `gofpmremade/app/location/page.tsx` (870 lines - complex)
- [ ] **Sermons** - `gofpmremade/app/sermons/page.tsx`
- [ ] **Give** - `gofpmremade/app/give/page.tsx`

### Medium Priority (4 pages) - ~60 minutes
- [ ] **Live Service** - `gofpmremade/app/live-service/page.tsx`
- [ ] **Media** - `gofpmremade/app/media/page.tsx`
- [ ] **Ministry** - `gofpmremade/app/ministry/page.tsx`
- [ ] **Mission** - `gofpmremade/app/mission/page.tsx`

### Lower Priority (3 pages) - ~45 minutes
- [ ] **Projects** - `gofpmremade/app/project/page.tsx`
- [ ] **Register** - `gofpmremade/app/register/page.tsx`
- [ ] **Admin Pages** - `gofpmremade/app/(admin)/admin/*/page.tsx` (14 pages)

## Key Replacements

### Typography
```
h1:      typography.h1
h2:      typography.h2
h3:      typography.h3
h4:      typography.h4
body:    typography.body
small:   typography.small
label:   typography.label
```

### Colors
```
Primary text:    colors.text.primary
Secondary text:  colors.text.secondary
Tertiary text:   colors.text.tertiary
Muted text:      colors.text.muted
Primary accent:  colors.primary
Accent color:    colors.accent
```

### Spacing
```
Container:       spacing.containerPadding + spacing.containerPaddingY
Top margin:      spacing.marginTopLg
Bottom margin:   spacing.marginBottomLg
Small gap:       spacing.spacingSm
Medium gap:      spacing.spacingMd
Large gap:       spacing.spacingLg
```

### Glass Effects
```
Light glass:     glass.light
Base glass:      glass.base
Card glass:      glass.card
```

## Batch Update Strategy

### Option 1: Sequential (Recommended)
1. Update 1-2 pages per session
2. Test thoroughly after each update
3. Commit changes
4. Move to next page

### Option 2: Parallel
1. Update multiple pages simultaneously
2. Test all at once
3. Commit all changes
4. Faster but higher risk

### Option 3: Automated
1. Create a script to replace common patterns
2. Manual review of each file
3. Test and commit

## Testing Checklist for Each Page

- [ ] Mobile view (320px) - text readable, no overflow
- [ ] Tablet view (768px) - layout adapts correctly
- [ ] Desktop view (1024px+) - full layout visible
- [ ] Typography scales smoothly
- [ ] Colors have sufficient contrast
- [ ] Spacing is consistent
- [ ] Glass effects render correctly
- [ ] Animations smooth (60fps)
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Touch targets ≥ 44px
- [ ] No horizontal scrolling on mobile

## Time Estimates

| Phase | Pages | Time | Status |
|-------|-------|------|--------|
| Phase 1 | 4 | 90 min | ✅ Complete |
| Phase 2 | 1 | 20 min | ✅ Complete |
| Phase 3 | 3 | 60 min | ⏳ Ready |
| Phase 4 | 4 | 60 min | ⏳ Ready |
| Phase 5 | 3 | 45 min | ⏳ Ready |
| Admin | 14 | 60 min | ⏳ Ready |
| **Total** | **27** | **335 min** | **18.5%** |

## Next Immediate Actions

1. **Update Location page** (20-25 min)
   - Complex page with map and FAQs
   - Follow template carefully
   - Test map functionality

2. **Update Sermons page** (20-25 min)
   - Likely has list/grid layout
   - Update typography and spacing
   - Test filtering/search if present

3. **Update Give page** (15-20 min)
   - Form page
   - Update form styling
   - Test form functionality

4. **Verify all compile** (5 min)
   - Run diagnostics
   - Check for errors

5. **Test on devices** (10 min)
   - Mobile, tablet, desktop
   - Check responsive behavior

## Common Issues & Solutions

### Issue: Text not visible
**Solution**: Check color contrast. Use `colors.text.primary` for main text.

### Issue: Spacing looks wrong
**Solution**: Use spacing utilities instead of arbitrary values.

### Issue: Glass effect not showing
**Solution**: Ensure `style={glass.light}` is applied to container.

### Issue: Typography too large/small
**Solution**: Use correct typography level (h1, h2, h3, h4, body, small, label).

### Issue: Mobile layout broken
**Solution**: Check responsive classes (grid-cols-1, sm:grid-cols-2, lg:grid-cols-3).

## Success Criteria

- ✅ All pages updated with design system
- ✅ No TypeScript errors
- ✅ No console errors
- ✅ Responsive on all devices
- ✅ Consistent styling throughout
- ✅ All tests passing
- ✅ Ready for production

## Resources

- Design System: `gofpmremade/lib/design-system.ts`
- Implementation Guide: `UI_REDESIGN_GUIDE.md`
- Quick Reference: `QUICK_UPDATE_GUIDE.md`
- Project Summary: `REDESIGN_SUMMARY.md`
- Progress Tracker: `BATCH_UPDATE_PROGRESS.md`

## Notes

- Each page update is independent
- No breaking changes to functionality
- Responsive design improves UX
- Consistent styling across site
- Easier maintenance going forward

---

**Ready to continue?** Start with Location page next!
