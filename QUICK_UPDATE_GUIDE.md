# Quick Update Guide - Applying Design System to Remaining Pages

## Overview
This guide provides step-by-step instructions for updating the remaining pages with the new mobile-first responsive design system.

## Quick Reference

### Import Statement (Add to top of each page)
```tsx
import { typography, spacing, colors, glass, fonts } from "@/lib/design-system";
```

### Common Replacements

#### Container Padding
```tsx
// OLD
className="px-6 py-6 sm:px-10 sm:py-8"

// NEW
className={`${spacing.containerPadding} ${spacing.containerPaddingY}`}
```

#### Page Heading
```tsx
// OLD
<h1 className="font-heading mt-4 sm:mt-6 text-white font-black leading-[0.92] tracking-tight text-center"
  style={{ fontSize: "clamp(2.6rem, 10vw, 6rem)" }}>

// NEW
<h1 className="text-white font-black leading-[0.92] tracking-tight text-center"
  style={{
    ...typography.h1,
    fontFamily: fonts.serif,
    marginTop: "clamp(1rem, 3vw, 2rem)",
  }}>
```

#### Body Text
```tsx
// OLD
<p className="font-body text-white/70 text-sm sm:text-base leading-relaxed">

// NEW
<p style={{ ...typography.body, color: colors.text.secondary }}>
```

#### Section Heading
```tsx
// OLD
<h2 className="font-heading text-white font-black text-lg sm:text-xl leading-tight tracking-tight">

// NEW
<h2 style={{
  ...typography.h3,
  fontFamily: fonts.serif,
  color: colors.text.primary,
}}>
```

#### Label/Caption
```tsx
// OLD
<span className="font-body text-xs tracking-widest uppercase" style={{ color: "#42a7c0" }}>

// NEW
<span style={{ ...typography.label, color: colors.primary }}>
```

#### Glass Container
```tsx
// OLD
style={{
  background: "rgba(0,0,0,0.45)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "16px",
}}

// NEW
style={glass.light}
```

#### Spacing Between Sections
```tsx
// OLD
className="mt-8 sm:mt-12 gap-4"

// NEW
className={`${spacing.marginTopLg} ${spacing.spacingSm}`}
```

## Page-by-Page Updates

### 1. Events Page (`gofpmremade/app/events/page.tsx`)

**Key Changes:**
- Update main heading with `typography.h1` and `fonts.serif`
- Apply `spacing.containerPadding` to main container
- Replace all `text-white/70` with `color: colors.text.secondary`
- Replace all `text-white/40` with `color: colors.text.tertiary`
- Update section headings with `typography.h3`
- Apply `glass.light` to card containers

**Estimated Time**: 15-20 minutes

### 2. Location Page (`gofpmremade/app/location/page.tsx`)

**Key Changes:**
- Update heading typography
- Apply responsive container padding
- Update all text colors using color tokens
- Replace glass morphism inline styles with `glass.light`
- Update label styling with `typography.label`
- Apply spacing utilities to sections

**Estimated Time**: 15-20 minutes

### 3. Sermons Page (`gofpmremade/app/sermons/page.tsx`)

**Key Changes:**
- Update page heading with design system
- Apply container padding utilities
- Update typography for sermon cards
- Replace color values with tokens
- Apply glass effects to containers
- Update spacing between elements

**Estimated Time**: 20-25 minutes

### 4. Give Page (`gofpmremade/app/give/page.tsx`)

**Key Changes:**
- Update form labels with `typography.label` and `colors.primary`
- Apply responsive container padding
- Update heading typography
- Replace form styling with design system colors
- Apply glass morphism to form container
- Update button styling

**Estimated Time**: 15-20 minutes

### 5. Live Service Page (`gofpmremade/app/live-service/page.tsx`)

**Key Changes:**
- Update heading with `typography.h1` and `fonts.serif`
- Apply container padding utilities
- Update all text colors with tokens
- Replace glass effects with `glass.light`
- Update spacing between sections
- Apply responsive utilities

**Estimated Time**: 10-15 minutes

### 6. Media Page (`gofpmremade/app/media/page.tsx`)

**Key Changes:**
- Update heading typography
- Apply container padding
- Update grid layout spacing
- Replace color values with tokens
- Apply glass effects to cards
- Update responsive spacing

**Estimated Time**: 15-20 minutes

### 7. Ministry Page (`gofpmremade/app/ministry/page.tsx`)

**Key Changes:**
- Update page heading
- Apply container padding utilities
- Update typography for all text levels
- Replace color values with tokens
- Apply glass morphism effects
- Update spacing utilities

**Estimated Time**: 15-20 minutes

### 8. Mission Page (`gofpmremade/app/mission/page.tsx`)

**Key Changes:**
- Update heading typography
- Apply responsive container padding
- Update all text colors
- Replace glass effects
- Apply spacing utilities
- Update responsive grid layouts

**Estimated Time**: 15-20 minutes

### 9. Projects Page (`gofpmremade/app/project/page.tsx`)

**Key Changes:**
- Update heading typography
- Apply container padding
- Update card styling with glass effects
- Replace color values with tokens
- Apply spacing utilities
- Update responsive layouts

**Estimated Time**: 15-20 minutes

### 10. Register Page (`gofpmremade/app/register/page.tsx`)

**Key Changes:**
- Update form labels with design system
- Apply container padding utilities
- Update heading typography
- Replace form styling with tokens
- Apply glass morphism to form
- Update button styling

**Estimated Time**: 15-20 minutes

### 11. Admin Pages (`gofpmremade/app/(admin)/admin/*/page.tsx`)

**Key Changes:**
- Update admin heading typography
- Apply container padding
- Update table/list styling
- Replace color values with tokens
- Apply glass effects to containers
- Update spacing utilities

**Estimated Time**: 30-40 minutes (for all admin pages)

## Batch Update Process

### For Each Page:

1. **Add Import**
   ```tsx
   import { typography, spacing, colors, glass, fonts } from "@/lib/design-system";
   ```

2. **Update Container**
   ```tsx
   className={`${spacing.containerPadding} ${spacing.containerPaddingY}`}
   ```

3. **Update Headings**
   - h1: Use `typography.h1` + `fonts.serif`
   - h2: Use `typography.h2` + `fonts.serif`
   - h3: Use `typography.h3` + `fonts.serif`
   - h4: Use `typography.h4` + `fonts.serif`

4. **Update Text Colors**
   - Primary text: `color: colors.text.primary`
   - Secondary text: `color: colors.text.secondary`
   - Tertiary text: `color: colors.text.tertiary`
   - Muted text: `color: colors.text.muted`

5. **Update Glass Effects**
   - Replace inline styles with `style={glass.light}` or `style={glass.base}`

6. **Update Spacing**
   - Replace `mt-8 sm:mt-12` with `spacing.marginTopLg`
   - Replace `gap-4 sm:gap-6` with `spacing.spacingMd`

7. **Test**
   - Mobile (320px)
   - Tablet (768px)
   - Desktop (1024px+)

## Common Patterns

### Pattern 1: Page with Heading + Content
```tsx
<section className="relative w-full min-h-svh overflow-hidden">
  <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true" style={{ zIndex: 0 }}>
    <img src="/logo.png" alt="" className="object-contain" style={{ width: "min(80vw, 700px)", opacity: 0.04" }} />
  </div>

  <div className={`public-content relative flex flex-col items-center ${spacing.containerPadding} ${spacing.containerPaddingY}`} style={{ zIndex: 1 }}>
    <h1 style={{ ...typography.h1, fontFamily: fonts.serif, color: colors.text.primary }}>
      Page Title
    </h1>
    
    <div className={`w-full max-w-4xl ${spacing.marginTopLg}`}>
      <p style={{ ...typography.body, color: colors.text.secondary }}>
        Content here
      </p>
    </div>
  </div>
</section>
```

### Pattern 2: Card Grid
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
  {items.map((item) => (
    <div key={item.id} style={glass.light}>
      <h3 style={{ ...typography.h4, fontFamily: fonts.serif, color: colors.text.primary }}>
        {item.title}
      </h3>
      <p style={{ ...typography.body, color: colors.text.secondary }}>
        {item.description}
      </p>
    </div>
  ))}
</div>
```

### Pattern 3: Form
```tsx
<form style={glass.light} className={`p-6 sm:p-8`}>
  <label style={{ ...typography.label, color: colors.primary }}>
    Field Label
  </label>
  <input className="w-full" />
  <p style={{ ...typography.small, color: colors.text.tertiary }}>
    Helper text
  </p>
</form>
```

## Verification Checklist

After updating each page:

- [ ] Import statement added
- [ ] Container padding applied
- [ ] All headings updated with typography system
- [ ] All text colors use color tokens
- [ ] Glass effects replaced with utilities
- [ ] Spacing utilities applied
- [ ] Mobile view tested (320px)
- [ ] Tablet view tested (768px)
- [ ] Desktop view tested (1024px+)
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Animations smooth
- [ ] Colors have good contrast

## Estimated Total Time

- **High Priority Pages** (4 pages): 60-80 minutes
- **Medium Priority Pages** (4 pages): 60-80 minutes
- **Lower Priority Pages** (3 pages): 45-60 minutes
- **Total**: 165-220 minutes (~3-4 hours)

## Tips & Tricks

1. **Use Find & Replace** to speed up common replacements
2. **Copy patterns** from already-updated pages
3. **Test frequently** to catch issues early
4. **Use DevTools** to verify responsive behavior
5. **Keep design system file open** for reference

## Troubleshooting

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

## Next Steps

1. Start with high-priority pages
2. Update 1-2 pages per session
3. Test thoroughly after each update
4. Gather feedback from team
5. Make adjustments as needed
6. Deploy to production

## Questions?

Refer to:
- `gofpmremade/lib/design-system.ts` - All available utilities
- `UI_REDESIGN_GUIDE.md` - Detailed implementation guide
- `REDESIGN_SUMMARY.md` - Overview and context
- Updated pages (Hero, Announcements, Contact, Community) - Working examples
