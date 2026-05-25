# UI Redesign Guide - Mobile-First Responsive System

## Overview
A comprehensive mobile-first responsive design system has been implemented across the application. This guide explains the new design patterns and how to apply them to all pages.

## Design System Location
- **File**: `gofpmremade/lib/design-system.ts`
- **Exports**: Typography, spacing, colors, glass morphism, responsive utilities, fonts, and animation timing

## Key Changes

### 1. Typography System
All font sizes now use `clamp()` for fluid scaling:

```typescript
// Hero/Page titles
typography.h1 // clamp(2.5rem, 8vw, 8rem)

// Section headings
typography.h2 // clamp(1.8rem, 5vw, 4rem)

// Subsection headings
typography.h3 // clamp(1.3rem, 2.5vw, 1.75rem)

// Card titles
typography.h4 // clamp(1.1rem, 2vw, 1.35rem)

// Body text
typography.body // clamp(13px, 2vw, 14px)

// Small text
typography.small // clamp(12px, 2vw, 13px)

// Labels/captions
typography.label // clamp(8px, 2vw, 10px)
```

### 2. Spacing Scale
Consistent spacing across all pages:

```typescript
// Container padding
spacing.containerPadding // px-4 sm:px-8 lg:px-14
spacing.containerPaddingY // py-8 sm:py-12 lg:py-16

// Section spacing
spacing.sectionGap // gap-6 sm:gap-8 lg:gap-12
spacing.sectionGapLarge // gap-8 sm:gap-12 lg:gap-16

// Vertical spacing
spacing.marginTopLg // mt-8 sm:mt-12
spacing.marginBottomLg // mb-8 sm:mb-12
```

### 3. Color System
Centralized color tokens:

```typescript
colors.primary // #42a7c0 (teal)
colors.text.primary // rgba(255, 255, 255, 1)
colors.text.secondary // rgba(255, 255, 255, 0.7)
colors.text.tertiary // rgba(255, 255, 255, 0.4)
colors.text.muted // rgba(255, 255, 255, 0.25)
colors.background.dark // #0a0a0a
colors.border.light // rgba(255, 255, 255, 0.08)
```

### 4. Glass Morphism
Pre-configured glass effects:

```typescript
glass.base // Full blur with dark background
glass.light // Lighter blur for secondary elements
glass.card // Card-specific styling
```

### 5. Responsive Utilities
Helper classes for responsive layouts:

```typescript
responsive.gridCols.mobile // grid-cols-1
responsive.gridCols.tablet // sm:grid-cols-2
responsive.gridCols.desktop // lg:grid-cols-3
```

## Implementation Pattern

### Before (Old Pattern)
```tsx
<div className="px-6 py-6 sm:px-10 sm:py-8">
  <h1 style={{ fontSize: "clamp(2.6rem, 10vw, 6rem)" }}>Title</h1>
  <p className="text-white/70 text-sm sm:text-base">Body text</p>
</div>
```

### After (New Pattern)
```tsx
import { typography, spacing, colors, fonts } from "@/lib/design-system";

<div className={`${spacing.containerPadding} ${spacing.containerPaddingY}`}>
  <h1 style={{ ...typography.h1, fontFamily: fonts.serif, color: colors.text.primary }}>
    Title
  </h1>
  <p style={{ ...typography.body, color: colors.text.secondary }}>Body text</p>
</div>
```

## Pages Updated
✅ Hero Component (gofpmremade/components/Hero.tsx)
✅ Announcements Page (gofpmremade/app/announcements/page.tsx)
✅ Contact Page (gofpmremade/app/contact/page.tsx)

## Pages Requiring Updates
The following pages should be updated with the new design system:

1. **Community** (`gofpmremade/app/community/page.tsx`)
   - Update heading typography
   - Apply spacing utilities
   - Use color tokens for text

2. **Events** (`gofpmremade/app/events/page.tsx`)
   - Update section headings
   - Apply responsive spacing
   - Use glass morphism utilities

3. **Location** (`gofpmremade/app/location/page.tsx`)
   - Update typography scale
   - Apply container padding
   - Use color system

4. **Sermons** (`gofpmremade/app/sermons/page.tsx`)
   - Update heading sizes
   - Apply spacing scale
   - Use responsive utilities

5. **Give** (`gofpmremade/app/give/page.tsx`)
   - Update form styling
   - Apply typography system
   - Use color tokens

6. **Live Service** (`gofpmremade/app/live-service/page.tsx`)
   - Update heading typography
   - Apply spacing utilities
   - Use glass morphism

7. **Media** (`gofpmremade/app/media/page.tsx`)
   - Update grid layouts
   - Apply responsive spacing
   - Use color system

8. **Ministry** (`gofpmremade/app/ministry/page.tsx`)
   - Update typography
   - Apply spacing scale
   - Use responsive utilities

9. **Mission** (`gofpmremade/app/mission/page.tsx`)
   - Update heading sizes
   - Apply container padding
   - Use color tokens

10. **Projects** (`gofpmremade/app/project/page.tsx`)
    - Update typography scale
    - Apply spacing utilities
    - Use glass morphism

11. **Register** (`gofpmremade/app/register/page.tsx`)
    - Update form styling
    - Apply typography system
    - Use color tokens

12. **Admin Pages** (`gofpmremade/app/(admin)/admin/*/page.tsx`)
    - Update admin UI
    - Apply spacing scale
    - Use color system

## Mobile-First Responsive Breakpoints

- **Mobile**: 320px - 639px (default styles)
- **Tablet**: 640px+ (`sm:` prefix)
- **Desktop**: 1024px+ (`lg:` prefix)
- **Large Desktop**: 1280px+ (`xl:` prefix)

## Font Families
```typescript
fonts.serif // 'Cormorant Garamond' - for headings
fonts.display // 'Playfair Display' - for labels/accents
fonts.body // var(--font-body, sans-serif) - for body text
```

## Animation Timing
```typescript
animation.fast // 0.3s
animation.normal // 0.5s
animation.slow // 0.7s
animation.verySlow // 1s
```

## Best Practices

1. **Always use the design system** for consistency
2. **Use `clamp()` for typography** - never hardcode font sizes
3. **Apply spacing utilities** - don't use arbitrary padding/margins
4. **Use color tokens** - maintain consistent color palette
5. **Test on mobile** - ensure responsive behavior
6. **Use glass morphism** for card/container backgrounds
7. **Maintain font hierarchy** - use appropriate typography levels

## Example: Complete Page Update

```tsx
"use client";

import { motion } from "framer-motion";
import { typography, spacing, colors, glass, fonts } from "@/lib/design-system";

export default function ExamplePage() {
  return (
    <section className="relative w-full min-h-svh overflow-hidden">
      {/* Logo watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true" style={{ zIndex: 0 }}>
        <img src="/logo.png" alt="" className="object-contain" style={{ width: "min(80vw, 700px)", opacity: 0.04 }} />
      </div>

      {/* Content */}
      <div className={`public-content relative flex flex-col items-center ${spacing.containerPadding} ${spacing.containerPaddingY}`} style={{ zIndex: 1 }}>
        {/* Heading */}
        <motion.h1
          style={{
            ...typography.h1,
            fontFamily: fonts.serif,
            color: colors.text.primary,
            marginTop: "clamp(1rem, 3vw, 2rem)",
          }}
        >
          Page Title
        </motion.h1>

        {/* Body */}
        <motion.div
          className={`w-full max-w-4xl ${spacing.marginTopLg}`}
          style={glass.light}
        >
          <p style={{ ...typography.body, color: colors.text.secondary }}>
            Content goes here
          </p>
        </motion.div>
      </div>
    </section>
  );
}
```

## Testing Checklist

- [ ] Mobile view (320px) - text readable, spacing appropriate
- [ ] Tablet view (768px) - layout adapts correctly
- [ ] Desktop view (1024px+) - full layout visible
- [ ] Typography scales smoothly with viewport
- [ ] Colors have sufficient contrast
- [ ] Spacing is consistent throughout
- [ ] Glass morphism effects render correctly
- [ ] Animations perform smoothly
- [ ] Touch targets are at least 44px
- [ ] No horizontal scrolling on mobile

## Support
For questions about the design system, refer to `gofpmremade/lib/design-system.ts` for all available utilities and their values.
