# Chrome Extension Icons Setup Guide

This file explains how to add icons to the extension.

## Quick Start (Development)

The extension works without icons. Chrome will use a default icon. To test in development:
1. Load the extension in `chrome://extensions`
2. Icons are optional for development

## Adding Custom Icons

### Step 1: Create icons directory

```bash
mkdir icons
```

### Step 2: Create or download PNG icons

You need three PNG files:
- `icon16.png` (16×16 pixels)
- `icon48.png` (48×48 pixels) 
- `icon128.png` (128×128 pixels)

### Option A: Use an online icon generator

1. Go to https://www.pixelartmaker.com or similar tool
2. Create a simple 128×128 design
3. Export as PNG
4. Resize to 16×16 and 48×48 using image editor or online tool
5. Save to `icons/` folder

### Option B: Quick command-line solution (with ImageMagick)

```bash
# Create a simple gradient icon
convert -size 128x128 gradient:blue-purple icons/icon128.png

# Resize for smaller sizes
convert icons/icon128.png -resize 48x48 icons/icon48.png
convert icons/icon128.png -resize 16x16 icons/icon16.png
```

### Option C: Use included SVG converter

If you have a SVG file, convert it:
```bash
# Using ImageMagick with SVG support
convert icons/source.svg -resize 128x128 icons/icon128.png
```

### Step 3: Verify in manifest.json

The manifest should reference:
```json
"action": {
  "default_popup": "popup.html",
  "default_icon": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}
```

This is already configured. Just add your files to the `icons/` folder.

## Simple Online Tools

- **Pixlr**: https://pixlr.com (online image editor)
- **Remove.bg**: https://remove.bg/icons (icon creation)
- **Favicon Generator**: https://favicon.io (quick PNG generator)

## Recommended Icon Design

For a scroll automation extension, consider icons featuring:
- Scrollbar or down arrow
- Fast-forward symbol
- Automation/robot theme
- Simple, recognizable design

### Design Tips

1. Use contrasting colors for visibility in Chrome toolbar
2. Keep design simple for 16px size
3. Leave padding around edges for small sizes
4. Use PNG32 with transparency for best results

## Testing Without Icons

The extension works perfectly fine without custom icons. Chrome will display:
- A default gray circle on the toolbar
- Default icon in `chrome://extensions`

You can continue development and testing without creating icons.

## If Icons Are Missing

If you reference icons in manifest.json but they're missing:
- Chrome will use a default icon (gray circle)
- Extension will still function normally
- No errors will appear - this is expected behavior

## Icon Dimensions

| Size | Usage |
|------|-------|
| 16px | Toolbar icon (small) |
| 48px | Toolbar icon (medium), Options page, Popup |
| 128px | Chrome Web Store, Extensions page |

## Examples

### Simple Automation Icon

Text: "→→→" (right arrows) on circular background

### Scroll Icon

Represent scrolling movement with visual elements

### Combined

Scrollbar + play/fast-forward buttons

---

For now, just proceed without icons. The extension works great as-is!
