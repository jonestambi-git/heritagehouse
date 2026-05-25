/**
 * Design System - Responsive Mobile-First Utilities
 * Centralized styling patterns for consistent UI across all pages
 */

// ─── Typography Scale ────────────────────────────────────────────────────────

export const typography = {
  // Hero/Page titles
  h1: {
    fontSize: "clamp(2.5rem, 8vw, 8rem)",
    fontWeight: 700,
    lineHeight: 0.88,
    letterSpacing: "-0.02em",
  },
  h1Light: {
    fontSize: "clamp(2.5rem, 8vw, 8rem)",
    fontWeight: 300,
    fontStyle: "italic",
    lineHeight: 0.88,
    letterSpacing: "-0.02em",
  },
  // Section headings
  h2: {
    fontSize: "clamp(1.8rem, 5vw, 4rem)",
    fontWeight: 700,
    lineHeight: 1.05,
    letterSpacing: "-0.01em",
  },
  // Subsection headings
  h3: {
    fontSize: "clamp(1.3rem, 2.5vw, 1.75rem)",
    fontWeight: 700,
    lineHeight: 1.2,
  },
  // Card titles
  h4: {
    fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
    fontWeight: 600,
    lineHeight: 1.3,
  },
  // Body text
  body: {
    fontSize: "clamp(13px, 2vw, 14px)",
    lineHeight: 1.8,
  },
  // Small text
  small: {
    fontSize: "clamp(12px, 2vw, 13px)",
    lineHeight: 1.7,
  },
  // Labels/captions
  label: {
    fontSize: "clamp(8px, 2vw, 10px)",
    letterSpacing: "0.22em",
    textTransform: "uppercase",
  },
} as const;

// ─── Spacing Scale ──────────────────────────────────────────────────────────

export const spacing = {
  // Container padding
  containerPadding: "px-4 sm:px-8 lg:px-14",
  containerPaddingY: "py-8 sm:py-12 lg:py-16",
  
  // Section spacing
  sectionGap: "gap-6 sm:gap-8 lg:gap-12",
  sectionGapLarge: "gap-8 sm:gap-12 lg:gap-16",
  
  // Vertical spacing
  spacingXs: "gap-2 sm:gap-3",
  spacingSm: "gap-3 sm:gap-4",
  spacingMd: "gap-4 sm:gap-6",
  spacingLg: "gap-6 sm:gap-8",
  spacingXl: "gap-8 sm:gap-12",
  
  // Margin utilities
  marginTopSm: "mt-4 sm:mt-6",
  marginTopMd: "mt-6 sm:mt-8",
  marginTopLg: "mt-8 sm:mt-12",
  marginTopXl: "mt-12 sm:mt-16",
  
  marginBottomSm: "mb-4 sm:mb-6",
  marginBottomMd: "mb-6 sm:mb-8",
  marginBottomLg: "mb-8 sm:mb-12",
  marginBottomXl: "mb-12 sm:mb-16",
} as const;

// ─── Colors ─────────────────────────────────────────────────────────────────

export const colors = {
  primary: "#42a7c0",
  primaryLight: "rgba(66, 167, 192, 0.1)",
  primaryDark: "#2d7a8f",
  
  accent: "#D4AF37",
  accentLight: "rgba(212, 175, 55, 0.1)",
  
  text: {
    primary: "rgba(255, 255, 255, 1)",
    secondary: "rgba(255, 255, 255, 0.7)",
    tertiary: "rgba(255, 255, 255, 0.4)",
    muted: "rgba(255, 255, 255, 0.25)",
  },
  
  background: {
    dark: "#0a0a0a",
    darker: "#080808",
    glass: "rgba(0, 0, 0, 0.6)",
    glassLight: "rgba(0, 0, 0, 0.45)",
    overlay: "rgba(0, 0, 0, 0.92)",
  },
  
  border: {
    light: "rgba(255, 255, 255, 0.08)",
    lighter: "rgba(255, 255, 255, 0.06)",
    accent: "rgba(66, 167, 192, 0.3)",
  },
} as const;

// ─── Glass Morphism ─────────────────────────────────────────────────────────

export const glass = {
  base: {
    background: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "2px",
  },
  light: {
    background: "rgba(0, 0, 0, 0.45)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    borderRadius: "2px",
  },
  card: {
    background: "#111",
    border: "1px solid rgba(255, 255, 255, 0.07)",
    borderRadius: "2px",
  },
} as const;

// ─── Responsive Utilities ───────────────────────────────────────────────────

export const responsive = {
  // Grid layouts
  gridCols: {
    mobile: "grid-cols-1",
    tablet: "sm:grid-cols-2",
    desktop: "lg:grid-cols-3",
    desktopWide: "xl:grid-cols-4",
  },
  
  // Flex layouts
  flexCol: "flex flex-col",
  flexRow: "flex flex-row",
  flexCenter: "flex items-center justify-center",
  flexBetween: "flex items-center justify-between",
  
  // Visibility
  hideMobile: "hidden sm:block",
  hideTablet: "hidden lg:block",
  showMobileOnly: "sm:hidden",
  showTabletOnly: "hidden sm:block lg:hidden",
} as const;

// ─── Animation Timing ───────────────────────────────────────────────────────

export const animation = {
  fast: { duration: 0.3 },
  normal: { duration: 0.5 },
  slow: { duration: 0.7 },
  verySlow: { duration: 1 },
} as const;

// ─── Fonts ──────────────────────────────────────────────────────────────────

export const fonts = {
  serif: "'Cormorant Garamond', Georgia, serif",
  display: "'Playfair Display', Georgia, serif",
  body: "var(--font-body, sans-serif)",
} as const;

// ─── Helper Functions ───────────────────────────────────────────────────────

export function getResponsiveClass(mobile: string, tablet?: string, desktop?: string): string {
  let classes = mobile;
  if (tablet) classes += ` ${tablet}`;
  if (desktop) classes += ` ${desktop}`;
  return classes;
}

export function getResponsiveStyle(mobile: any, tablet?: any, desktop?: any) {
  return {
    mobile,
    tablet,
    desktop,
  };
}
