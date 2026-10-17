# Development & Testing Guide

## File Structure

Your complete extension should have:

```
chrome-extension/
├── manifest.json           # Extension configuration (Manifest V3)
├── background.js           # Service worker (background process)
├── content.js              # Main automation script
├── popup.html              # Popup UI
├── popup.js                # Popup functionality
├── options.html            # Settings page
├── options.js              # Settings logic
├── README.md               # Full documentation
├── QUICKSTART.md           # Quick start guide
├── ICONS_SETUP.md          # Icon setup instructions
├── TESTING.md              # This file
└── icons/                  # (Optional) Custom icons folder
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Loading the Extension

### Development Mode

1. Go to `chrome://extensions/`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select the `chrome-extension` folder
5. The extension appears in your toolbar

### Reloading After Changes

After editing files:
1. Go to `chrome://extensions/`
2. Find your extension
3. Click the refresh icon (or press Ctrl+R)
4. The changes are applied immediately

## Testing Checklist

### Popup UI
- [ ] Click extension icon → popup appears
- [ ] **Start** button enabled when inactive
- [ ] **Stop** button enabled when running
- [ ] Status shows correct state (Active/Inactive)
- [ ] **Options** button opens settings page

### Options Page
- [ ] All fields load current values
- [ ] Can adjust scroll speed (1-200)
- [ ] Can adjust intervals (in milliseconds)
- [ ] Can toggle video skip methods
- [ ] Can select video playback rates
- [ ] Can enter custom selector
- [ ] **Save** button works
- [ ] **Reset** button restores defaults
- [ ] Settings persist after refresh

### Auto-Scroll Feature
- [ ] Scrolls smoothly down the page
- [ ] Scrolls at configured speed
- [ ] Stops at bottom of page
- [ ] Works with infinite scroll pages
- [ ] Resets scroll on new page

### Video Skipping
- [ ] Detects HTML5 video elements
- [ ] Seeks videos to end (if seek method enabled)
- [ ] Speeds up videos (if speed method enabled)
- [ ] Detects YouTube iframes
- [ ] Detects Vimeo iframes
- [ ] Handles cross-origin restrictions gracefully
- [ ] Mutes video during speed-up

### Next Button Detection
- [ ] Finds common "Next" button labels
- [ ] Handles button elements
- [ ] Handles anchor (link) elements  
- [ ] Works with pagination links
- [ ] Works with "Load More" buttons
- [ ] Clicks discovered button
- [ ] Resets scroll after clicking
- [ ] Scrolls to top of new page

### Edge Cases
- [ ] Stops when no next button found
- [ ] Handles content loading delays
- [ ] Gracefully handles errors
- [ ] Works with multiple pagination systems
- [ ] Respects user stop command

## Testing on Different Sites

### News Sites (BBC, CNN, Reuters)
```
Expected: Article lists with pagination
Test: Scroll through multiple pages
```

### Reddit
```
Expected: Thread posts, pagination
Test: Scroll through posts, load more
Status: Works well
```

### LinkedIn
```
Expected: Feed with pagination
Test: Check video skip on embedded content
Status: Requires custom selector for some feeds
Custom selector: .artdeco-pagination__button[aria-label*="next"]
```

### GitHub
```
Expected: Issue/PR lists
Test: Pagination at bottom
Status: Works with default selectors
```

### Amazon
```
Expected: Search results with pagination
Test: Navigate through product pages
Status: Works well with custom selector: a.s-pagination-next
```

## Debugging

### Enable Console Logging

The content script logs important events. Access console:
1. Right-click page → **Inspect** (or press F12)
2. Go to **Console** tab
3. Look for extension messages

### Common Errors and Solutions

#### "Cannot read property of undefined"
- Usually means content script not fully loaded
- Solution: Refresh page (F5) and try again

#### "Invalid CSS selector"
- Custom selector syntax error
- Solution: Test selector in console first:
  ```javascript
  document.querySelectorAll('your-selector')
  ```

#### Content script not responding
- Content script might not be injected
- Solution: Reload extension in chrome://extensions

#### Storage access errors
- Storage API permission issue
- Solutions: Check manifest includes "storage"

### Console Commands (for testing)

In the page console, you can manually test:

```javascript
// Get current auto-scroll status
chrome.runtime.sendMessage({action: 'getStatus'}, response => {
  console.log('Running:', response.isRunning);
});

// Start manually
chrome.runtime.sendMessage({action: 'start'});

// Stop manually
chrome.runtime.sendMessage({action: 'stop'});

// Update config (advanced)
chrome.runtime.sendMessage({
  action: 'updateConfig',
  config: {
    scrollSpeed: 100,
    videoPlaybackRate: 8
  }
});
```

## Performance Testing

### Metrics to Monitor

1. **CPU Usage**: Watch Task Manager while extension runs
2. **Memory Usage**: Should stay under 50MB
3. **Scroll Smoothness**: Should be fluid at configured speed
4. **Response Time**: Should respond to stop command within 1 second

### Performance Optimization Tips

If running slowly:
1. Increase scroll interval (50ms → 100ms)
2. Increase check interval (1000ms → 2000ms)
3. Decrease scroll speed if at 16x
4. Check if page has heavy animations

## Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 88+ | ✅ Full support |
| Edge | 88+ | ✅ Full support |
| Brave | Recent | ✅ Full support |
| Opera | Recent | ✅ Full support |

## Known Limitations

1. **Content Security Policy**: Some sites with strict CSP might block operations
2. **Cross-Origin Iframes**: Limited access to videos in iframes from other domains
3. **Protected Videos**: DRM-protected videos cannot be skipped
4. **JavaScript-Heavy Sites**: Some SPAs might need custom logic
5. **Rate-Limiting**: Some sites block automation (use responsibly)

## Build for Distribution

### Before Publishing to Chrome Web Store

1. ✅ Ensure all files are included
2. ✅ Test on multiple websites
3. ✅ Add proper icons (128x128, 48x48, 16x16)
4. ✅ Write clear description
5. ✅ Test permissions are minimal
6. ✅ Prepare screenshots

### Package for Distribution

```bash
# Create ZIP for submission
zip -r auto-scroll-extension.zip chrome-extension/
```

### Remove Before Distribution

Never include:
- `.git` folder
- `node_modules` (if applicable)
- `.env` files
- Development notes

## Troubleshooting Common Issues

### Q: Extension doesn't load
**A:** 
1. Check manifest.json syntax (use validator)
2. Ensure all referenced files exist
3. Look for errors in `chrome://extensions`

### Q: Content script not running
**A:**
1. Refresh page after loading extension
2. Check console for security errors
3. Verify content_scripts is in manifest

### Q: Settings not saving
**A:**
1. Check storage permission in manifest
2. Verify no console errors (F12)
3. Try resetting in Options page

### Q: Videos not being skipped
**A:**
1. Check videos are not DRM-protected
2. Verify skip method is enabled in Options
3. Try both seek and speed methods

### Q: Next button not found
**A:**
1. Inspect button to get CSS selector
2. Add custom selector in Options
3. Check if button is visible initially

## Testing With Multiple Tabs

The extension is tab-aware:
- Each tab runs independently
- Settings are global (affect all tabs)
- Start/stop one tab independently

## Advanced: Modifying Content Script

To modify scroll behavior:
1. Edit `content.js`
2. Reload extension in `chrome://extensions`
3. Refresh target page
4. Test immediately

Key methods to customize:
- `scrollStep()` - Modify scroll logic
- `handleVideos()` - Add video types
- `checkForNextButton()` - Improve detection

## Resources

- [Manifest V3 Documentation](https://developer.chrome.com/docs/extensions/mv3/)
- [Chrome Extension API](https://developer.chrome.com/docs/extensions/reference/)
- [Content Scripts](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)

---

Ready to test? Start with QUICKSTART.md!
