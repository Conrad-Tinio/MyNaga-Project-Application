# Logo Setup Instructions

## Where to Place Your Logo

1. **Place your logo file in the `public` folder:**
   - Recommended file name: `logo.png` or `logo.svg`
   - Recommended format: PNG with transparent background, or SVG
   - Recommended size: At least 200x200 pixels for high quality

2. **For the favicon (browser tab icon):**
   - Same file (`logo.png`) will be used, OR
   - You can create a separate `favicon.ico` file (32x32 or 64x64 pixels)
   - Place it in the `public` folder

## File Locations

```
public/
  ├── logo.png (or logo.svg) ← Place your logo here
  └── favicon.ico (optional) ← Optional favicon file
```

## What's Already Configured

✅ Navbar - Logo will appear next to "MedMap Naga" text
✅ Favicon - Browser tab icon is set to use the logo
✅ Mobile responsive - Logo will scale appropriately

## Supported Formats

- **PNG** (recommended) - Best for photos, complex graphics
- **SVG** (recommended) - Best for simple graphics, scales perfectly
- **ICO** - For favicon only

## After Adding Your Logo

1. Save your logo file as `logo.png` or `logo.svg` in the `public` folder
2. The logo will automatically appear in:
   - The navbar next to "MedMap Naga"
   - Browser tab (favicon)
   - Browser bookmarks

## Notes

- The logo will be optimized by Vite during build
- If the logo file doesn't exist, it will gracefully hide (no errors)
- The logo is set to 40px height (h-10) in the navbar, adjust in Navbar.jsx if needed

