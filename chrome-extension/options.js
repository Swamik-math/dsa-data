// Options page script for Auto Scroll & Skip Videos Extension

// Default configuration
const DEFAULT_CONFIG = {
  scrollSpeed: 50,
  scrollIntervalMs: 50,
  checkIntervalMs: 1000,
  videoSkipMethods: ['seek', 'speed'],
  videoPlaybackRate: 16,
  customNextSelector: '',
  autoStart: false
};

// DOM elements
const elements = {
  scrollSpeed: document.getElementById('scrollSpeed'),
  scrollSpeedValue: document.getElementById('scrollSpeedValue'),
  scrollIntervalMs: document.getElementById('scrollIntervalMs'),
  scrollIntervalMsValue: document.getElementById('scrollIntervalMsValue'),
  checkIntervalMs: document.getElementById('checkIntervalMs'),
  checkIntervalMsValue: document.getElementById('checkIntervalMsValue'),
  methodSeek: document.getElementById('methodSeek'),
  methodSpeed: document.getElementById('methodSpeed'),
  videoPlaybackRate: document.getElementById('videoPlaybackRate'),
  customNextSelector: document.getElementById('customNextSelector'),
  autoStart: document.getElementById('autoStart'),
  saveBtn: document.getElementById('saveBtn'),
  resetBtn: document.getElementById('resetBtn'),
  statusMessage: document.getElementById('statusMessage')
};

// Initialize options
document.addEventListener('DOMContentLoaded', () => {
  loadOptions();
  setupEventListeners();
});

// Load options from storage
async function loadOptions() {
  try {
    const saved = await chrome.storage.sync.get(['scrollConfig', 'autoStart']);
    const config = { ...DEFAULT_CONFIG, ...saved.scrollConfig };

    // Set values
    elements.scrollSpeed.value = config.scrollSpeed;
    elements.scrollSpeedValue.textContent = config.scrollSpeed;
    elements.scrollIntervalMs.value = config.scrollIntervalMs;
    elements.scrollIntervalMsValue.textContent = config.scrollIntervalMs;
    elements.checkIntervalMs.value = config.checkIntervalMs;
    elements.checkIntervalMsValue.textContent = config.checkIntervalMs;
    elements.methodSeek.checked = (config.videoSkipMethods || []).includes('seek');
    elements.methodSpeed.checked = (config.videoSkipMethods || []).includes('speed');
    elements.videoPlaybackRate.value = config.videoPlaybackRate || 16;
    elements.customNextSelector.value = config.customNextSelector || '';
    elements.autoStart.checked = saved.autoStart || false;
  } catch (error) {
    console.error('Error loading options:', error);
    showStatus('Error loading options', 'error');
  }
}

// Setup event listeners
function setupEventListeners() {
  // Update value displays
  elements.scrollSpeed.addEventListener('input', (e) => {
    elements.scrollSpeedValue.textContent = e.target.value;
  });

  elements.scrollIntervalMs.addEventListener('input', (e) => {
    elements.scrollIntervalMsValue.textContent = e.target.value;
  });

  elements.checkIntervalMs.addEventListener('input', (e) => {
    elements.checkIntervalMsValue.textContent = e.target.value;
  });

  // Save button
  elements.saveBtn.addEventListener('click', saveOptions);

  // Reset button
  elements.resetBtn.addEventListener('click', resetToDefaults);
}

// Save options
async function saveOptions() {
  try {
    const videoSkipMethods = [];
    if (elements.methodSeek.checked) videoSkipMethods.push('seek');
    if (elements.methodSpeed.checked) videoSkipMethods.push('speed');

    // Validate that at least one method is selected
    if (videoSkipMethods.length === 0) {
      showStatus('Please select at least one video skip method', 'error');
      return;
    }

    const config = {
      scrollSpeed: parseInt(elements.scrollSpeed.value) || 50,
      scrollIntervalMs: parseInt(elements.scrollIntervalMs.value) || 50,
      checkIntervalMs: parseInt(elements.checkIntervalMs.value) || 1000,
      videoSkipMethods: videoSkipMethods,
      videoPlaybackRate: parseInt(elements.videoPlaybackRate.value) || 16,
      customNextSelector: elements.customNextSelector.value.trim()
    };

    // Validate custom selector if provided
    if (config.customNextSelector) {
      try {
        document.querySelectorAll(config.customNextSelector);
      } catch (e) {
        showStatus('Invalid CSS selector. Please check your syntax.', 'error');
        return;
      }
    }

    // Validate values
    if (config.scrollSpeed < 1 || config.scrollSpeed > 200) {
      showStatus('Scroll speed must be between 1 and 200', 'error');
      return;
    }

    if (config.scrollIntervalMs < 10 || config.scrollIntervalMs > 500) {
      showStatus('Scroll interval must be between 10 and 500ms', 'error');
      return;
    }

    if (config.checkIntervalMs < 100 || config.checkIntervalMs > 5000) {
      showStatus('Check interval must be between 100 and 5000ms', 'error');
      return;
    }

    // Save to storage
    await chrome.storage.sync.set({
      scrollConfig: config,
      autoStart: elements.autoStart.checked
    });

    showStatus('✓ Settings saved successfully!', 'success');

    // Notify all content scripts about config change
    const tabs = await chrome.tabs.query({});
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, {
        action: 'updateConfig',
        config: config
      }).catch(() => {
        // Ignore errors for tabs that don't have content script
      });
    });
  } catch (error) {
    console.error('Error saving options:', error);
    showStatus('Error saving options: ' + error.message, 'error');
  }
}

// Reset to defaults
async function resetToDefaults() {
  if (confirm('Are you sure you want to reset all settings to defaults?')) {
    try {
      await chrome.storage.sync.set({
        scrollConfig: DEFAULT_CONFIG,
        autoStart: false
      });

      // Reload options
      loadOptions();
      showStatus('✓ Settings reset to defaults!', 'success');

      // Notify all content scripts
      const tabs = await chrome.tabs.query({});
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          action: 'updateConfig',
          config: DEFAULT_CONFIG
        }).catch(() => {
          // Ignore errors
        });
      });
    } catch (error) {
      console.error('Error resetting options:', error);
      showStatus('Error resetting options', 'error');
    }
  }
}

// Show status message
function showStatus(message, type) {
  const statusEl = elements.statusMessage;
  statusEl.textContent = message;
  statusEl.className = `status-message ${type}`;

  // Auto-hide after 4 seconds
  setTimeout(() => {
    statusEl.className = 'status-message';
  }, 4000);
}
