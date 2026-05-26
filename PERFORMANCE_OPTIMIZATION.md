# Performance Optimization Guide

## Overview
This document outlines the performance optimizations implemented for the HeritageHouse Ministries website to ensure fast page loads and smooth user experience.

## Implemented Optimizations

### 1. Next.js Configuration (`next.config.js`)

#### Image Optimization
- **Format Support**: AVIF and WebP for modern browsers
- **Responsive Sizes**: Multiple device sizes for optimal delivery
- **Caching**: 1-year cache TTL for immutable assets
- **Compression**: Automatic compression enabled

#### Build Optimization
- **SWC Minification**: Faster JavaScript minification
- **Source Maps**: Disabled in production for smaller bundle size
- **Package Imports**: Optimized imports for Framer Motion and Leaflet

#### Caching Headers
- **Static Assets**: 1-year cache for images and fonts
- **Security Headers**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection

### 2. Code Splitting & Lazy Loading

#### Dynamic Imports
```typescript
// Example: Lazy load heavy components
const MapComponent = dynamic(() => import('@/components/LocationMap'), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});
```

#### Route-Based Code Splitting
- Each page route is automatically code-split
- Only necessary code is loaded per page
- Reduces initial bundle size

### 3. Image Optimization

#### Best Practices
- Use Next.js `Image` component instead of `<img>`
- Specify `width` and `height` for all images
- Use responsive sizes with `sizes` prop
- Lazy load images with `loading="lazy"`

#### Example:
```typescript
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={200}
  priority={false}
  loading="lazy"
/>
```

### 4. Font Optimization

#### Google Fonts
- Fonts are imported in `app/layout.tsx`
- Uses `display: swap` for faster text rendering
- Preloaded in document head

#### CSS Variables
- Fonts stored as CSS variables
- Reduces repeated font declarations
- Faster style application

### 5. API Response Caching

#### Revalidation Strategy
- **Homepage**: 1 hour revalidation
- **Media Page**: 1 hour revalidation
- **API Routes**: Cache-Control headers set appropriately

#### Example:
```typescript
// Revalidate every hour
export const revalidate = 3600;
```

### 6. Bundle Size Optimization

#### Tree Shaking
- Unused code is removed during build
- Only necessary dependencies are included
- Framer Motion imports are optimized

#### Minification
- JavaScript minified with SWC
- CSS minified automatically
- HTML minified in production

### 7. Performance Metrics

#### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

#### Optimization Techniques
- Preload critical resources
- Defer non-critical JavaScript
- Optimize CSS delivery
- Minimize render-blocking resources

### 8. Caching Strategy

#### Browser Caching
- Static assets: 1 year
- HTML pages: No cache (always fresh)
- API responses: Varies by endpoint

#### CDN Caching
- Images cached at edge
- Fonts cached at edge
- Static assets served from CDN

### 9. Database Query Optimization

#### MongoDB Indexes
- Indexes on frequently queried fields
- Compound indexes for common queries
- Connection pooling enabled

#### Query Optimization
- Limit returned fields
- Use pagination for large datasets
- Cache frequently accessed data

### 10. Frontend Performance

#### Framer Motion
- Use `will-change` sparingly
- Prefer `transform` and `opacity` for animations
- Avoid animating layout properties

#### CSS
- Use CSS Grid and Flexbox
- Minimize reflows and repaints
- Use CSS variables for theming

#### JavaScript
- Minimize main thread work
- Use Web Workers for heavy computation
- Debounce/throttle event handlers

## Performance Checklist

### Before Deployment
- [ ] Run Lighthouse audit
- [ ] Check Core Web Vitals
- [ ] Test on slow 3G network
- [ ] Test on low-end devices
- [ ] Verify image optimization
- [ ] Check bundle size
- [ ] Test API response times
- [ ] Verify caching headers

### Monitoring
- [ ] Set up performance monitoring
- [ ] Track Core Web Vitals
- [ ] Monitor API response times
- [ ] Track error rates
- [ ] Monitor user experience metrics

## Tools for Performance Testing

### Lighthouse
```bash
npm run build
npm run start
# Open Chrome DevTools > Lighthouse
```

### WebPageTest
- Visit https://www.webpagetest.org/
- Enter your domain
- Analyze results

### Google PageSpeed Insights
- Visit https://pagespeed.web.dev/
- Enter your domain
- Get recommendations

## Performance Tips

### For Developers
1. Use `next/image` for all images
2. Lazy load non-critical components
3. Minimize JavaScript in critical path
4. Use CSS for animations when possible
5. Optimize database queries
6. Cache API responses
7. Use CDN for static assets
8. Monitor bundle size

### For Content
1. Optimize images before uploading
2. Use WebP format when possible
3. Compress videos
4. Minimize text content
5. Use descriptive alt text
6. Avoid auto-playing media

### For Users
1. Enable browser caching
2. Use modern browser
3. Check internet connection
4. Clear browser cache if issues
5. Disable browser extensions
6. Use desktop for better performance

## Future Optimizations

### Potential Improvements
- [ ] Implement service worker for offline support
- [ ] Add progressive image loading
- [ ] Implement request batching
- [ ] Add GraphQL for efficient data fetching
- [ ] Implement edge caching
- [ ] Add compression middleware
- [ ] Implement lazy loading for routes
- [ ] Add performance budgets

### Advanced Techniques
- [ ] Implement streaming SSR
- [ ] Use incremental static regeneration (ISR)
- [ ] Implement partial pre-rendering
- [ ] Use edge functions for dynamic content
- [ ] Implement request deduplication
- [ ] Add automatic image optimization

## Troubleshooting

### Slow Page Load
1. Check network tab in DevTools
2. Identify slow resources
3. Check API response times
4. Verify image sizes
5. Check for render-blocking resources

### High Bundle Size
1. Run `npm run build` and check output
2. Use `next/bundle-analyzer` to visualize
3. Remove unused dependencies
4. Implement code splitting
5. Use dynamic imports

### Poor Core Web Vitals
1. Check LCP: Optimize largest element
2. Check FID: Reduce JavaScript
3. Check CLS: Fix layout shifts
4. Use Lighthouse for recommendations

## Resources

- [Next.js Performance](https://nextjs.org/learn/seo/web-performance)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [Framer Motion Performance](https://www.framer.com/motion/performance/)

## Monitoring & Analytics

### Recommended Tools
- Google Analytics 4
- Sentry for error tracking
- LogRocket for session replay
- Datadog for infrastructure monitoring
- New Relic for application performance

### Key Metrics to Track
- Page load time
- Time to interactive
- Core Web Vitals
- Error rate
- API response time
- User engagement
- Conversion rate
