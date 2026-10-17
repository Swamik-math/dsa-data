// Auto Scroll & Skip Videos Content Script

class AutoScrollController {
  constructor() {
    this.isRunning = false;
    this.scrollInterval = null;
    this.checkInterval = null;
    this.config = {
      scrollSpeed: 50, // pixels per interval
      scrollIntervalMs: 50, // milliseconds between scroll steps
      checkIntervalMs: 1000, // check for next button every second
      nextButtonSelectors: [
        'a[aria-label*="next" i]',
        'a[aria-label*="Next" i]',
        'button[aria-label*="next" i]',
        'button[aria-label*="Next" i]',
        'span[aria-label*="next" i]',
        'span[aria-label*="Next" i]',
        'a:contains("Next")',
        'a:contains("next")',
        'button:contains("Next")',
        'button:contains("next")',
        'span:contains("Next")',
        'span:contains("next")',
        'a[class*="next" i]',
        'button[class*="next" i]',
        'span[class*="next" i]',
        'a[id*="next" i]',
        'button[id*="next" i]',
        'span[id*="next" i]',
        '.pagination a:last-child',
        '.pagination button:last-child',
        '.pagination span:last-child',
        '[data-testid*="next" i]',
        'a[href*="page="]',
        'a[href*="p="]',
        'a[href*="next"]',
        'div[role="button"][aria-label*="next" i]',
        'div[role="button"][aria-label*="Next" i]'
      ],
      videoSkipMethods: ['seek', 'speed'], // 'seek' or 'speed'
      videoPlaybackRate: 16
    };
    this.lastScrollHeight = 0;
    this.stableScrollCount = 0;
    this.init();
  }

  async init() {
    // Load configuration from storage
    await this.loadConfig();
    
    // Listen for messages from popup/background
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'start') {
        this.start();
        sendResponse({ success: true });
      } else if (request.action === 'stop') {
        this.stop();
        sendResponse({ success: true });
      } else if (request.action === 'getStatus') {
        sendResponse({ isRunning: this.isRunning });
      } else if (request.action === 'updateConfig') {
        this.config = { ...this.config, ...request.config };
        this.saveConfig();
        sendResponse({ success: true });
      }
      return true;
    });

    // Check if extension should auto-start (optional feature)
    const savedState = await chrome.storage.local.get(['autoStart']);
    if (savedState.autoStart) {
      this.start();
    }
  }

  async loadConfig() {
    const saved = await chrome.storage.sync.get(['scrollConfig']);
    if (saved.scrollConfig) {
      this.config = { ...this.config, ...saved.scrollConfig };
    }
  }

  async saveConfig() {
    await chrome.storage.sync.set({ scrollConfig: this.config });
  }

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastScrollHeight = 0;
    this.stableScrollCount = 0;
    
    // Auto-scroll is disabled
    // this.scrollInterval = setInterval(() => {
    //   this.scrollStep();
    // }, this.config.scrollIntervalMs);

    // Check for next button and handle videos
    this.checkInterval = setInterval(() => {
      this.handleVideos();
      this.checkForNextButton();
    }, this.config.checkIntervalMs);

    // Initial video check
    this.handleVideos();
  }

  stop() {
    this.isRunning = false;
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
      this.scrollInterval = null;
    }
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    // Reset video playback rates
    this.resetVideos();
  }

  scrollStep() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    
    // Check if we've reached the bottom
    if (currentScroll >= maxScroll - 10) {
      // Check if content has loaded (infinite scroll)
      const currentHeight = document.documentElement.scrollHeight;
      if (currentHeight === this.lastScrollHeight) {
        this.stableScrollCount++;
        // If height hasn't changed for 3 checks, assume we're at the end
        if (this.stableScrollCount >= 3) {
          // Will be handled by next button check
        }
      } else {
        this.lastScrollHeight = currentHeight;
        this.stableScrollCount = 0;
      }
    } else {
      // Smooth scroll down
      window.scrollBy({
        top: this.config.scrollSpeed,
        behavior: 'smooth'
      });
    }
  }

  handleVideos() {
    // Handle HTML5 video elements
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      // Apply fast-forward to all videos, not just playing ones
      if (this.config.videoSkipMethods.includes('seek') && !video.paused && video.duration) {
        // Seek to end only if video is playing
        video.currentTime = video.duration - 0.1;
      }
      if (this.config.videoSkipMethods.includes('speed')) {
        // Always apply playback rate
        video.muted = true;
        video.playbackRate = this.config.videoPlaybackRate;
        
        // Add play event listener to ensure rate stays fast
        if (!video.dataset.listenerAdded) {
          video.addEventListener('play', () => {
            video.playbackRate = this.config.videoPlaybackRate;
            video.muted = true;
          });
          video.addEventListener('ratechange', () => {
            if (video.playbackRate !== this.config.videoPlaybackRate) {
              video.playbackRate = this.config.videoPlaybackRate;
            }
          });
          video.dataset.listenerAdded = 'true';
        }
      }
    });

    // Handle YouTube iframes
    const iframes = document.querySelectorAll('iframe[src*="youtube.com"], iframe[src*="youtu.be"]');
    iframes.forEach(iframe => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
          const ytVideo = iframeDoc.querySelector('video');
          if (ytVideo) {
            if (this.config.videoSkipMethods.includes('seek') && !ytVideo.paused && ytVideo.duration) {
              ytVideo.currentTime = ytVideo.duration - 0.1;
            }
            if (this.config.videoSkipMethods.includes('speed')) {
              ytVideo.muted = true;
              ytVideo.playbackRate = this.config.videoPlaybackRate;
              
              // Add event listeners
              if (!ytVideo.dataset.listenerAdded) {
                ytVideo.addEventListener('play', () => {
                  ytVideo.playbackRate = this.config.videoPlaybackRate;
                  ytVideo.muted = true;
                });
                ytVideo.addEventListener('ratechange', () => {
                  if (ytVideo.playbackRate !== this.config.videoPlaybackRate) {
                    ytVideo.playbackRate = this.config.videoPlaybackRate;
                  }
                });
                ytVideo.dataset.listenerAdded = 'true';
              }
            }
          }
        }
      } catch (e) {
        // Cross-origin iframe, try postMessage for YouTube
        if (iframe.src.includes('youtube.com') || iframe.src.includes('youtu.be')) {
          try {
            iframe.contentWindow.postMessage('{"event":"command","func":"seekTo","args":[999999,true]}', '*');
            iframe.contentWindow.postMessage('{"event":"command","func":"setPlaybackRate","args":[' + this.config.videoPlaybackRate + ']}', '*');
          } catch (e) {
            // Ignore cross-origin errors
          }
        }
      }
    });

    // Handle Vimeo and other video iframes
    const videoIframes = document.querySelectorAll('iframe[src*="vimeo"], iframe[src*="dailymotion"]');
    videoIframes.forEach(iframe => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
          const video = iframeDoc.querySelector('video');
          if (video) {
            if (this.config.videoSkipMethods.includes('seek') && !video.paused && video.duration) {
              video.currentTime = video.duration - 0.1;
            }
            if (this.config.videoSkipMethods.includes('speed')) {
              video.muted = true;
              video.playbackRate = this.config.videoPlaybackRate;
              
              // Add event listeners
              if (!video.dataset.listenerAdded) {
                video.addEventListener('play', () => {
                  video.playbackRate = this.config.videoPlaybackRate;
                  video.muted = true;
                });
                video.addEventListener('ratechange', () => {
                  if (video.playbackRate !== this.config.videoPlaybackRate) {
                    video.playbackRate = this.config.videoPlaybackRate;
                  }
                });
                video.dataset.listenerAdded = 'true';
              }
            }
          }
        }
      } catch (e) {
        // Cross-origin iframe
      }
    });
  }

  resetVideos() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      video.playbackRate = 1;
      video.muted = false;
    });
  }

  checkForNextButton() {
    // Check if we're at the bottom and content is stable
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    
    if (currentScroll < maxScroll - 50) {
      return; // Not at bottom yet
    }

    // Try to find next button using various selectors
    let nextButton = null;

    // First, try custom selectors from config
    if (this.config.customNextSelector) {
      try {
        nextButton = document.querySelector(this.config.customNextSelector);
      } catch (e) {
        console.warn('Invalid custom selector:', e);
      }
    }

    // If not found, try default selectors
    if (!nextButton) {
      for (const selector of this.config.nextButtonSelectors) {
        try {
          // Skip :contains selectors as they're not valid CSS
          if (selector.includes(':contains')) {
            const baseSelector = selector.split(':contains')[0];
            const text = selector.match(/:contains\(["']([^"']+)["']\)/)?.[1];
            if (text) {
              const elements = document.querySelectorAll(baseSelector);
              for (const el of elements) {
                if (el.textContent.toLowerCase().includes(text.toLowerCase())) {
                  // Verify it's visible
                  const rect = el.getBoundingClientRect();
                  const style = window.getComputedStyle(el);
                  if (rect.width > 0 && rect.height > 0 && 
                      style.display !== 'none' && 
                      style.visibility !== 'hidden' &&
                      style.opacity !== '0') {
                    nextButton = el;
                    console.log('Found next button with :contains selector:', text);
                    break;
                  }
                }
              }
            }
          } else {
            const elements = document.querySelectorAll(selector);
            for (const el of elements) {
              // Check if element is visible and likely a next button
              const rect = el.getBoundingClientRect();
              const style = window.getComputedStyle(el);
              if (rect.width > 0 && rect.height > 0 && 
                  style.display !== 'none' && 
                  style.visibility !== 'hidden' &&
                  style.opacity !== '0') {
                // Additional check: text content or aria-label
                const text = (el.textContent || el.getAttribute('aria-label') || '').toLowerCase();
                if (text.includes('next') || 
                    el.href?.includes('page=') || 
                    el.href?.includes('p=') ||
                    el.href?.includes('next')) {
                  nextButton = el;
                  console.log('Found next button with selector:', selector);
                  break;
                }
              }
            }
          }
          if (nextButton) break;
        } catch (e) {
          console.warn('Error with selector', selector, ':', e);
          continue;
        }
      }
    }

    // If not found, try a broader search for common next button patterns
    if (!nextButton) {
      console.log('No next button found with standard selectors, trying broader search...');
      const allElements = document.querySelectorAll('a, button');
      for (const el of allElements) {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        if (rect.width > 0 && rect.height > 0 && 
            style.display !== 'none' && 
            style.visibility !== 'hidden' &&
            style.opacity !== '0') {
          const text = (el.textContent || el.getAttribute('aria-label') || '').toLowerCase().trim();
          if (text === 'next' || text === '→' || text === '>' || text === 'next page' || text === 'following') {
            nextButton = el;
            console.log('Found next button with text:', text);
            break;
          }
        }
      }
    }

    // If found, click it
    if (nextButton) {
      console.log('Clicking next button:', nextButton);
      // Reset scroll tracking
      this.lastScrollHeight = 0;
      this.stableScrollCount = 0;
      
      // Scroll button into view before clicking
      try {
        nextButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch (e) {
        // Fallback if scrollIntoView fails
        nextButton.scrollIntoView(true);
      }
      
      // Wait a bit for any lazy loading, then click
      setTimeout(() => {
        try {
          // If it's a span, check if parent is clickable
          let clickTarget = nextButton;
          if (nextButton.tagName === 'SPAN') {
            // Look for clickable parent
            let parent = nextButton.parentElement;
            let iterations = 0;
            while (parent && iterations < 5) {
              const style = window.getComputedStyle(parent);
              if (style.cursor === 'pointer' || parent.onclick || 
                  parent.getAttribute('role') === 'button' ||
                  parent.tagName === 'A' || parent.tagName === 'BUTTON') {
                clickTarget = parent;
                console.log('Found clickable parent:', parent);
                break;
              }
              parent = parent.parentElement;
              iterations++;
            }
          }
          
          console.log('Clicking target:', clickTarget.tagName, clickTarget.className);
          clickTarget.click();
          
          // If it's an <a> tag, also try navigation
          if (clickTarget.tagName === 'A' && clickTarget.href) {
            setTimeout(() => {
              window.location.href = clickTarget.href;
            }, 800);
          }
          
          // Scroll to top of new page after delay
          setTimeout(() => {
            window.scrollTo(0, 0);
          }, 1500);
        } catch (e) {
          console.error('Error clicking next button:', e);
        }
      }, 500);
    } else {
      console.log('Next button not found');
    }
  }
}

// Initialize controller
const controller = new AutoScrollController();

