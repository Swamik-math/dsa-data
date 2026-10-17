// Popup script for Auto Scroll & Skip Videos Extension

document.addEventListener('DOMContentLoaded', async () => {
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const statusDiv = document.getElementById('status');
  const optionsBtn = document.getElementById('optionsBtn');

  // Get current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Check current status
  updateStatus();

  // Start button click
  startBtn.addEventListener('click', async () => {
    try {
      await chrome.tabs.sendMessage(tab.id, { action: 'start' });
      updateStatus();
    } catch (error) {
      console.error('Error starting:', error);
      statusDiv.textContent = 'Error: Please refresh the page';
      statusDiv.className = 'status inactive';
    }
  });

  // Stop button click
  stopBtn.addEventListener('click', async () => {
    try {
      await chrome.tabs.sendMessage(tab.id, { action: 'stop' });
      updateStatus();
    } catch (error) {
      console.error('Error stopping:', error);
    }
  });

  // Options button click
  optionsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  // Update status
  async function updateStatus() {
    try {
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'getStatus' });
      if (response && response.isRunning) {
        statusDiv.textContent = 'Status: Active';
        statusDiv.className = 'status active';
        startBtn.disabled = true;
        stopBtn.disabled = false;
      } else {
        statusDiv.textContent = 'Status: Inactive';
        statusDiv.className = 'status inactive';
        startBtn.disabled = false;
        stopBtn.disabled = true;
      }
    } catch (error) {
      // Content script might not be loaded yet
      statusDiv.textContent = 'Status: Ready';
      statusDiv.className = 'status inactive';
      startBtn.disabled = false;
      stopBtn.disabled = true;
    }
  }

  // Update status periodically
  setInterval(updateStatus, 1000);
});

