# Auto Scroll & Skip Videos - Chrome Extension

A powerful Chrome extension that automates browsing through paginated content while intelligently skipping embedded videos.

## Features

✨ **Automatic Page Scrolling**
- Smoothly scrolls through pages to load lazy-loaded content
- Configurable scroll speed and intervals
- Works with infinite scroll pages

▶️ **Smart Video Handling**
- Automatically detects HTML5 videos, YouTube iframes, Vimeo, and DailyMotion
- Multiple skip methods:
  - **Seek to End**: Jumps to the end of the video instantly
  - **Speed Up**: Mutes the video and plays at high speed (2x-16x)
- Choose or combine both methods for maximum efficiency

➡️ **Pagination Navigation**
- Intelligently detects "Next" buttons with multiple selector strategies
- Supports various button labels: "Next", ">", "Load More", etc.
- Handles both link-based and button-based navigation
- Auto-detects pagination parameters in URLs

⚙️ **Customizable Settings**
- Scroll speed control (1-200 pixels per step)
- Interval timing adjustments
- Custom CSS selectors for site-specific next buttons
- Video playback rate selection (2x, 4x, 8x, 16x)
- Optional auto-start functionality

## Installation

### 1. Download/Clone the Extension

Ensure you have all the following files in your extension folder:
```
├── manifest.json
├── background.js
├── content.js
├── popup.html
├── popup.js
├── options.html
├── options.js
└── README.md
```

### 2. Load in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle at top-right)
3. Click **Load unpacked**
4. Select the extension folder
5. The extension should now appear in your Chrome toolbar

### 3. (Optional) Create Icons

To add custom icons, create an `icons` folder with these PNG files:
```
icons/
├── icon16.png (16x16 pixels)
├── icon48.png (48x48 pixels)
└── icon128.png (128x128 pixels)
```

*Note: Icons are optional. The extension works fine without them.*

## Usage

### Basic Usage

1. Navigate to any webpage with pagination
2. Click the extension icon in your toolbar
3. Click **Start** to begin automatic scrolling
4. The extension will:
   - Scroll to the bottom of the page
   - Skip any embedded videos
   - Find and click the next button
   - Repeat until it reaches the end
5. Click **Stop** to halt the automation

### Configuration

1. Click the **Options** button in the popup
2. Adjust settings:
   - **Scroll Speed**: How many pixels to scroll per step
   - **Scroll Interval**: Time between each scroll step (lower = smoother)
   - **Check Interval**: How often to check for buttons/videos
   - **Video Skip Methods**: Choose "Skip to End", "Speed Up", or both
   - **Video Playback Rate**: 2x, 4x, 8x, or 16x speed
   - **Custom Next Selector**: CSS selector for site-specific quirks
   - **Auto-start**: Optionally start automation on every page load
3. Click **Save Settings**

## Advanced Features

### Custom Next Button Selector

If the extension can't find the next button on a specific site, you can provide a custom CSS selector.

**Examples:**

- LinkedIn: `.artdeco-pagination__button[aria-label*="next"]`
- Amazon: `a.s-pagination-next`
- Medium: `a[data-action="next-page"]`
- Reddit: `a[rel="next"]`

To find the right selector:
1. Right-click the next button → **Inspect**
2. Note the element's classes, id, or attributes
3. Craft a CSS selector (or ask ChatGPT)
4. Test it in the Options page

### Supported Video Sources

- ✅ HTML5 `<video>` elements
- ✅ YouTube (`youtube.com`, `youtu.be`)
- ✅ Vimeo (`vimeo.com`)
- ✅ DailyMotion (`dailymotion.com`)
- ✅ Custom video players (basic support)

*Note: Some embedded players might have cross-origin restrictions. The extension handles these gracefully.*

## Compatibility

### Tested On
- News sites (CNN, BBC, etc.)
- Blogs and article archives
- Forum threads (Reddit, HN, etc.)
- Search results
- Social media feeds
- E-commerce product listings

### Known Limitations
- Some sites with heavy JavaScript protections may block pagination clicks
- Custom video players with restricted APIs might not be skippable
- Infinite scroll sites without explicit next buttons will auto-stop when no new content loads
- Sites with strong CORS policies might prevent iframe video detection

## Troubleshooting

### Extension isn't working on a page

**Solutions:**
1. Refresh the page after starting
2. Check if the page has pagination/infinite scroll
3. Try custom selector: Right-click next button → Inspect → craft CSS selector
4. Check Chrome console for errors (press F12, go to Console tab)

### Videos aren't being skipped

**Check:**
1. Video type - exotic players might not be skippable
2. Try changing video skip methods in Options
3. Some embedded videos have cross-origin restrictions (expected behavior)

### Next button not being found

**Try:**
1. Providing a custom CSS selector in Options
2. Looking at console errors (F12 → Console)
3. Ensuring button is visible on page

### Performance issues (slow scrolling)

**Adjust:**
1. Increase scroll interval (e.g., 50ms → 100ms)
2. Decrease scroll speed (e.g., 50 pixels → 30 pixels)
3. Increase check interval (e.g., 1000ms → 2000ms)

## Technical Details

### Architecture

- **Manifest V3**: Modern Chrome extension standard (required for 2024+)
- **Service Worker**: Lightweight background process
- **Content Script**: Runs in page context for DOM manipulation
- **Storage API**: Syncs settings across devices
- **Message Passing**: Clean communication between components

### Permissions

- `activeTab`: Access to current tab for content scripts
- `storage`: Store user configuration
- `<all_urls>`: Run on any website

### How It Works

1. **Popup** sends "start" message to content script
2. **Content Script** loads saved config from storage
3. **Scroll Loop**: Smoothly scrolls page every 50ms
4. **Check Loop**: Every 1s:
   - Detects and skips all videos
   - Finds next button when at bottom
   - Clicks it and repeats
5. **On Stop**: Clears intervals and resets video playback rates

## Best Practices

- ✅ Use reasonable scroll speeds (30-100 for most sites)
- ✅ Test on one page before long automation sessions
- ✅ Keep check interval at 1000ms+ for performance
- ✅ Stop automation when you need to manually interact
- ❌ Don't use extremely high playback rates (16x is usually enough)
- ❌ Avoid running on sites with aggressive rate-limiting

## Contributing

Found a bug or have a feature request? You can:

1. Check the console (F12) for error messages
2. Test with default settings to isolate issues
3. Try custom selectors for site-specific problems
4. Share feedback with the developer

## FAQ

**Q: Will this get my account banned?**
A: Unlikely. This is a client-side automation tool similar to Selenium or RPA tools. Use responsibly and check site ToS.

**Q: Can I pause and resume?**
A: Yes! Click Stop to pause, then Start to resume from where you left off.

**Q: Does it work offline?**
A: Yes, it works on any webpage you can access.

**Q: Can I use it on mobile?**
A: No, Chrome extensions don't work the same way on mobile. This is desktop-only.

**Q: How do I uninstall it?**
A: Visit `chrome://extensions`, find the extension, and click Remove.

## License

This extension is provided as-is for educational and productivity purposes.

## Support

- Check the Options page for detailed setting descriptions
- Review example sites and their custom selectors
- Use browser DevTools (F12) to inspect page structure
- Test with default settings first

---

**Version:** 1.0.0  
**Last Updated:** 2026-02-09  
**Manifest Version:** 3
