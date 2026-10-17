// Background Service Worker for Auto Scroll & Skip Videos Extension

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default configuration
    chrome.storage.sync.set({
      scrollConfig: {
        scrollSpeed: 50,
        scrollIntervalMs: 50,
        checkIntervalMs: 1000,
        videoSkipMethods: ['seek', 'speed'],
        videoPlaybackRate: 16,
        customNextSelector: ''
      }
    });
  }
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getTabId') {
    sendResponse({ tabId: sender.tab?.id });
  }
  return true;
});

