# Dark Mode Implementation Guide

## Overview

TaskForge now includes a fully functional dark/light mode toggle with the following features:

- **System preference detection** - Automatically detects user's system theme preference
- **Persistent storage** - Saves user preference in localStorage
- **Instant switching** - Toggle between themes with smooth transitions
- **No flash of wrong theme** - Prevents FOUT with early theme detection
- **Accessible** - Keyboard navigable with proper ARIA labels

## Implementation Details

### 1. Theme Provider (`/components/providers/ThemeProvider.tsx`)

The core theme management system that:
- Manages theme state (`light` | `dark`)
- Handles localStorage persistence
- Applies theme classes to document root
- Prevents hydration mismatches

```typescript
const { theme, toggleTheme, setTheme } = useTheme()
```

### 2. Theme Toggle Component (`/components/common/ThemeToggle.tsx`)

A reusable toggle button that:
- Shows sun/moon icons based on current theme
- Includes proper accessibility attributes
- Smooth hover transitions
- Works on both desktop and mobile

### 3. Theme Script (`/components/providers/ThemeScript.tsx`)

Prevents flash of wrong theme by:
- Running before React hydration
- Detecting saved theme or system preference
- Applying theme class immediately

### 4. Tailwind Configuration

Updated `tailwind.config.js` to use class-based dark mode:
```javascript
darkMode: 'class'
```

## Usage

### Basic Theme Toggle

```tsx
import { useTheme } from '@/components/providers/ThemeProvider'
import ThemeToggle from '@/components/common/ThemeToggle'

function MyComponent() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <ThemeToggle />
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  )
}
```

### Adding Dark Mode Styles

Use Tailwind's dark mode classes:

```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  <h1 className="text-2xl font-bold">Title</h1>
  <p className="text-gray-600 dark:text-gray-400">Description</p>
</div>
```

### CSS Classes Available

The following utility classes are available for dark mode:

#### Backgrounds
- `bg-white dark:bg-gray-900` - Main background
- `bg-gray-50 dark:bg-gray-900` - Page background
- `bg-gray-100 dark:bg-gray-800` - Card background
- `bg-gray-200 dark:bg-gray-700` - Secondary background

#### Text Colors
- `text-gray-900 dark:text-white` - Primary text
- `text-gray-700 dark:text-gray-300` - Secondary text
- `text-gray-500 dark:text-gray-400` - Muted text
- `text-primary-600 dark:text-primary-400` - Link text

#### Borders
- `border-gray-200 dark:border-gray-700` - Standard borders
- `border-gray-300 dark:border-gray-600` - Input borders

#### Form Elements
- `bg-white dark:bg-gray-800` - Input backgrounds
- `placeholder-gray-500 dark:placeholder-gray-400` - Placeholder text

## Testing

### Manual Testing Checklist

1. **Initial Load**
   - [ ] Theme matches system preference on first visit
   - [ ] No flash of wrong theme
   - [ ] Theme persists after page refresh

2. **Theme Toggle**
   - [ ] Toggle button works in navbar
   - [ ] Theme changes instantly
   - [ ] Smooth transitions
   - [ ] Icon changes (sun ↔ moon)

3. **Accessibility**
   - [ ] Keyboard navigation works
   - [ ] ARIA labels are correct
   - [ ] Focus indicators visible

4. **Responsive**
   - [ ] Works on desktop
   - [ ] Works on mobile
   - [ ] Toggle visible in mobile menu

### Test Page

Visit `/test` to see a comprehensive dark mode test page with:
- Current theme display
- Color palette examples
- Text color samples
- Form element styling
- Priority badge examples

## File Structure

```
frontend/
├── components/
│   ├── providers/
│   │   ├── ThemeProvider.tsx    # Theme context and provider
│   │   └── ThemeScript.tsx      # Early theme detection
│   ├── common/
│   │   └── ThemeToggle.tsx      # Toggle button component
│   └── layout/
│       ├── Navbar.tsx           # Updated with dark mode
│       ├── Sidebar.tsx          # Updated with dark mode
│       └── DashboardLayout.tsx  # Updated with dark mode
├── app/
│   ├── layout.tsx               # Root layout with providers
│   ├── globals.css              # Dark mode transitions
│   └── test/
│       └── page.tsx             # Test page
├── tailwind.config.js           # Updated for class-based dark mode
└── DARK_MODE.md                 # This documentation
```

## Performance Considerations

- Theme detection runs before React hydration
- Smooth transitions use CSS transforms
- No unnecessary re-renders
- Minimal bundle size impact

## Browser Support

- Modern browsers with CSS custom properties
- Graceful fallback to light mode for older browsers
- localStorage support required for persistence

## Troubleshooting

### Theme Not Persisting
- Check localStorage is available
- Verify ThemeProvider is wrapping the app
- Check for JavaScript errors

### Flash of Wrong Theme
- Ensure ThemeScript is in the head
- Check script runs before React hydration
- Verify theme detection logic

### Styling Issues
- Use proper dark mode classes
- Check Tailwind configuration
- Verify CSS specificity

## Future Enhancements

- [ ] Theme-specific color schemes
- [ ] Automatic theme switching based on time
- [ ] High contrast mode
- [ ] Custom theme colors
- [ ] Theme export/import
