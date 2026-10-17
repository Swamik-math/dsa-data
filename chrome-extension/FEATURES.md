# Features & Use Cases

A complete guide to all features and how to use them effectively.

## Core Features

### 1. Automatic Page Scrolling

**What it does:**
- Smoothly scrolls from top to bottom of the page
- Activates lazy-loaded content
- Works with infinite scroll pages

**How to use:**
1. Click extension icon → **Start**
2. Watch as the page scrolls automatically
3. Click **Stop** when done or reached desired point

**Configuration:**
```
Scroll Speed:      1-200 pixels per step
                   Default: 50 (moderate speed)
                   Lower = slower, smoother
                   Higher = faster, choppier

Scroll Interval:   10-500 milliseconds
                   Default: 50ms (very smooth)
                   Lower = smoother but more CPU usage
                   Higher = less smooth but more efficient
```

**Use Cases:**
- Loading lazy images on long pages
- Reading full articles with infinite scroll
- Discovering all posts in feed-style sites
- Browsing product listings

---

### 2. Video Detection & Skipping

**Supported Formats:**
- ✅ HTML5 `<video>` elements
- ✅ YouTube embedded videos
- ✅ Vimeo videos
- ✅ DailyMotion videos
- ✅ Most mainstream video platforms

**Skip Methods:**

#### A) Seek to End
- Jumps video to the very end instantly
- Video stops playing
- No sound or visual playback
- **Best for:** News clips, auto-play ads, tutorial videos
- **Fast:** Almost instantaneous

#### B) Speed Up
- Video plays at high speed (2x-16x)
- Muted automatically  
- Completes quickly
- **Best for:** Showing you saw the content
- **Visible:** You see fast-playing content

**How to Choose:**
- **Seek Only**: Fastest, cleanest, handles all videos
- **Speed Only**: Shows engagement with content
- **Both**: Default, most compatible, fallback options
- **Neither**: Don't skip videos (let them play normally)

**Configuration:**
```
Skip Methods:      ☑ Seek to End
                   ☑ Speed Up
                   (both enabled by default)

Playback Rate:     2x, 4x, 8x, or 16x
                   Default: 16x (very fast)
                   Faster = less time per video
```

**Use Cases:**
- Automatically skip video ads
- Bypass auto-play content on news sites
- Speed through tutorial videos
- Handle mixed content (text + video)

---

### 3. Pagination Navigation

**What it detects:**
- "Next" buttons
- ">" arrows
- "Load More" buttons
- Numbered pagination (page 1, 2, 3...)
- Pagination parameters in URLs
- Different button styles (links, buttons, divs)

**Default Detection Strategy:**

1. Check aria-label attributes for "next"
2. Search element text for "Next", "next", ">", "More"
3. Look for classes with "next" in name
4. Find href attributes with pagination params
5. Look for data-testid attributes

**How it works:**
1. Scrolls to bottom of page
2. Checks if at bottom
3. Searches for next button
4. Clicks and waits for page load
5. Scrolls to top of new page
6. Repeats until no next button found

**Configuration:**

```
Custom Selector:   Leave empty for auto-detection
                   Or provide CSS selector like:
                   .pagination .next
                   [data-action='next']
                   a[href*='page=']
```

**Use Cases:**
- Paginated news archives
- Forum thread navigation
- Gallery/portfolio browsing
- Search result pagination
- Product listing navigation

---

### 4. Settings Persistence

**What's saved:**
- All option page settings
- Scroll speed preferences
- Video skip methods
- Custom selectors
- Auto-start preference

**Storage:**
- Syncs across devices (if logged into Chrome)
- Persists after browser restart
- Can reset to defaults anytime

**Per-Tab Independence:**
- Each tab has separate state (running/stopped)
- Settings apply globally to all tabs
- Start/stop controls per tab

---

## Advanced Features

### Custom Next Button Selector

**When to use:**
- Extension doesn't find next button automatically
- Site uses non-standard button labels
- Need site-specific customization

**How to find the selector:**

1. Open the page with pagination
2. Right-click the "Next" button
3. Select **"Inspect"** (or press F12)
4. Browser DevTools opens
5. Look at the HTML structure

**Examples by site:**

| Site | Selector |
|------|----------|
| LinkedIn | `.artdeco-pagination__button[aria-label*="next"]` |
| Amazon | `a.s-pagination-next` |
| eBay | `.pagination a[id*="next"]` |
| Medium | `a[data-action="next-page"]` |
| GitHub | `a[rel="next"]` |
| Reddit | `a[rel="next"]` |
| Medium | `button[aria-label*="next"]` |

**Testing Your Selector:**

Before saving, test in page console (F12 → Console):

```javascript
// Test your selector
document.querySelectorAll('your-selector-here')

// Should return the next button element
// If empty array, selector is wrong
```

**Valid CSS Selector Examples:**
- By class: `.next-button`
- By ID: `#nextBtn`
- By attribute: `[data-next]`
- By combination: `button.pagination.next`
- Complex: `.container > a[href*="page"]`

---

### Auto-Start Feature

**What it does:**
Enable to automatically start scrolling when you visit any page.

**How to enable:**
1. Go to Options page
2. Check "Auto-start on page load"
3. Save settings

**Use cases:**
- Batch processing multiple sites
- Hands-free browsing
- Automated content collection

**Warning:** Use carefully to avoid excessive bandwidth usage.

---

## Performance Optimization

### For Slow Computers

```
Adjust these to reduce CPU usage:
- Increase Scroll Interval: 50ms → 100ms or 150ms
- Decrease Scroll Speed: 50 → 30 or 40 pixels
- Increase Check Interval: 1000ms → 2000ms
```

### For Faster Browsing

```
Adjust these for maximum speed:
- Decrease Scroll Interval: 50ms → 25ms
- Increase Scroll Speed: 50 → 100 pixels
- Can also decrease Check Interval
```

### Memory Usage

Extension typically uses:
- **Idle:** ~5-10 MB
- **Running:** ~15-30 MB
- **Long sessions:** May reach 50 MB

Monitor in Chrome Task Manager:
1. Press Shift+Esc
2. Find "Auto Scroll & Skip Videos"
3. Monitor memory usage

---

## Troubleshooting

### Issue: Next button not found

**Solutions (in order):**

1. **Verify button exists:**
   - Scroll manually to bottom
   - Check if next button is visible

2. **Try hiding overlays:**
   - Close popups/modals (common on news sites)
   - These might hide the button

3. **Use custom selector:**
   - Right-click next button → Inspect
   - Copy CSS path or craft selector
   - Paste in Options → Custom Selector

4. **Check page-specific issues:**
   - Some sites require login
   - Some disable bot navigation
   - Some use AJAX (needs patience)

### Issue: Scrolling too slow/fast

**Solutions:**
- Adjust Scroll Speed in Options
- Adjust Scroll Interval timing
- Test different combinations

### Issue: Videos not skipping

**Causes:**
- DRM-protected content (intentional block)
- Cross-origin restrictions
- Custom player implementation

**Solutions:**
1. Try different skip method (seek vs speed)
2. Verify video is not DRM-protected
3. Check browser console for errors (F12)

### Issue: Extension stops suddenly

**Causes:**
- No next button found (expected)
- Content loaded but no pagination
- Site-specific restrictions

**Solutions:**
1. Check if you're at the end
2. Provide custom selector
3. Check console for errors

---

## Best Practices

### ✅ DO

- Test on one page before long sessions
- Use reasonable scroll speeds (30-100)
- Monitor first run to ensure behavior
- Keep check interval at 1000ms+ for performance
- Stop before manual interaction needed
- Use custom selectors for known sites

### ❌ DON'T

- Use on heavily rate-limited sites
- Enable 16x playback rate + high scroll speed simultaneously
- Leave running unattended on sensitive sites
- Ignore site terms of service
- Use extremely low intervals (<50ms for check)
- Expect perfect detection on every site

---

## Security & Privacy

**What this extension does:**
- Runs only on web pages you visit
- Doesn't track activity
- Doesn't send data anywhere
- Uses Chrome's storage API locally

**What it doesn't do:**
- ❌ Read your passwords
- ❌ Install other software
- ❌ Collect personal data
- ❌ Sync data to servers
- ❌ Modify website content (except video playback)

**Permissions Explained:**
- `activeTab`: Control current tab's content
- `storage`: Save your settings
- `<all_urls>`: Run on any website you visit

---

## Integration Examples

### Real-world Usage Scenarios

#### Scenario 1: News Archive Browsing
```
Site: BBC News archive (paginated)
Config:
  - Scroll Speed: 50
  - Check Interval: 1000ms
  - Skip videos: Both methods
  - Custom selector: Leave blank

Result: Scrolls through articles, skips video clips, clicks next at bottom
```

#### Scenario 2: Reddit Thread Reading
```
Site: Reddit thread
Config:
  - Scroll Speed: 100 (faster for short content)
  - Check Interval: 800ms
  - Skip videos: Speed up (2x)
  - Works with Load More button

Result: Scrolls through posts, loads more comments, skips video posts
```

#### Scenario 3: LinkedIn Feed
```
Site: LinkedIn feed
Config:
  - Scroll Speed: 30 (smooth for mixed media)
  - Scroll Interval: 100ms (very smooth)
  - Custom selector: `.artdeco-pagination__button[aria-label*="next"]`
  - Skip both video types

Result: Smooth scrolling, video ad skipping, pagination navigation
```

---

## FAQ

**Q: Can I use this on any website?**
A: Mostly yes, but some sites block automation or require login.

**Q: Does this violate ToS?**
A: Check individual site ToS. Generally similar to manual browsing but faster.

**Q: Will my account get banned?**
A: Unlikely - this is client-side automation like Selenium. Use responsibly.

**Q: Can I pause and resume?**
A: Yes, click Stop to pause, Start to resume from that position.

**Q: Does it work on mobile?**
A: No, Chrome extensions don't work on mobile browsers.

**Q: How much internet does it use?**
A: Same as manual browsing - just faster page loads.

**Q: Can I customize videos further?**
A: Edit content.js's handleVideos() method for advanced modifications.

---

## Getting Help

### Resource Links
1. **Full README**: See README.md for comprehensive guide
2. **Quick Start**: See QUICKSTART.md for immediate setup
3. **Testing**: See TESTING.md for debugging help
4. **This Guide**: Features & Use Cases (current file)

### Debug Checklist
- [ ] Extension is loaded in chrome://extensions
- [ ] Developer mode is ON
- [ ] Manifest.json has no syntax errors
- [ ] Page is refreshed after loading extension
- [ ] Content script errors in F12 console?
- [ ] Settings saved in options page?

---

**Happy automating! 🚀**
