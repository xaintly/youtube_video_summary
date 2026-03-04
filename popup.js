// popup.js - Popup logic and UI interactions

document.addEventListener('DOMContentLoaded', async () => {
  // Get DOM elements
  const closeBtn = document.getElementById('closePopup');
  const apiKeyInput = document.getElementById('apiKeyInput');
  const saveApiKeyBtn = document.getElementById('saveApiKey');
  const toggleKeyBtn = document.getElementById('toggleKeyVisibility');
  const apiKeyStatus = document.getElementById('apiKeyStatus');
  const apiKeyCollapsed = document.getElementById('apiKeyCollapsed');
  const apiKeyExpanded = document.getElementById('apiKeyExpanded');
  const editApiKeyBtn = document.getElementById('editApiKey');
  const modelSelect = document.getElementById('modelSelect');
  const modelCostInfo = document.getElementById('modelCostInfo');
  const modelBadgeCollapsed = document.getElementById('modelBadgeCollapsed');
  const getSummaryBtn = document.getElementById('getSummary');
  const loadingIndicator = document.getElementById('loadingIndicator');
  const errorDiv = document.getElementById('error');
  const summaryResult = document.getElementById('summaryResult');
  const summaryText = document.getElementById('summaryText');
  const copySummaryBtn = document.getElementById('copySummary');
  const videoInfo = document.getElementById('videoInfo');
  const videoTitle = document.getElementById('videoTitle');
  const stats = document.getElementById('stats');
  const transcriptLengthSpan = document.getElementById('transcriptLength');

  let currentTranscript = null;
  let currentVideoMetadata = null;
  
  // Model information
  const modelInfo = {
    'claude-haiku-4-5-20251001': {
      name: 'Haiku 4',
      cost: '~$0.004 per 30-min video',
      badge: 'Haiku 4'
    },
    'claude-sonnet-4-20250514': {
      name: 'Sonnet 4',
      cost: '~$0.03 per 30-min video',
      badge: 'Sonnet 4'
    },
    'claude-opus-4-5-20251101': {
      name: 'Opus 4',
      cost: '~$0.11 per 30-min video',
      badge: 'Opus 4'
    }
  };

  // Close button handler
  closeBtn.addEventListener('click', () => {
    window.close();
  });

  // Edit API key button handler
  editApiKeyBtn.addEventListener('click', () => {
    apiKeyCollapsed.classList.add('hidden');
    apiKeyExpanded.classList.remove('hidden');
  });
  
  // Model selector change handler
  modelSelect.addEventListener('change', () => {
    const selectedModel = modelSelect.value;
    const info = modelInfo[selectedModel];
    modelCostInfo.textContent = `${info.name}: ${info.cost}`;
  });

  // Load saved API key and model
  const { apiKey, selectedModel } = await browser.storage.local.get(['apiKey', 'selectedModel']);
  
  // Set model (default to Sonnet 4 if not set)
  const model = selectedModel || 'claude-sonnet-4-20250514';
  modelSelect.value = model;
  const info = modelInfo[model];
  modelCostInfo.textContent = `${info.name}: ${info.cost}`;
  modelBadgeCollapsed.textContent = info.badge;
  
  if (apiKey) {
    apiKeyInput.value = apiKey;
    // Show collapsed state
    apiKeyCollapsed.classList.remove('hidden');
    apiKeyExpanded.classList.add('hidden');
    getSummaryBtn.disabled = false;
  }

  // Check if we're on a YouTube video page
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  const currentTab = tabs[0];

  if (currentTab.url && currentTab.url.includes('youtube.com/watch')) {
    try {
      const response = await browser.tabs.sendMessage(currentTab.id, { 
        action: 'checkYouTubePage' 
      });
      
      if (response.isVideoPage) {
        const metadata = await browser.tabs.sendMessage(currentTab.id, {
          action: 'getVideoMetadata'
        });
        
        currentVideoMetadata = metadata;
        videoTitle.textContent = metadata.title;
        videoInfo.classList.remove('hidden');
        
        // Check for cached summary
        const cacheResponse = await browser.runtime.sendMessage({
          action: 'getCachedSummary',
          tabId: currentTab.id,
          videoId: metadata.videoId
        });
        
        if (cacheResponse.success && cacheResponse.cached) {
          // Display cached summary
          const cached = cacheResponse.data;
          currentTranscript = cached.transcript;
          summaryText.textContent = cached.summary;
          summaryResult.classList.remove('hidden');
          
          // Show transcript stats
          const wordCount = cached.transcript.split(/\s+/).length;
          transcriptLengthSpan.textContent = `Transcript: ${wordCount} words (cached)`;
          stats.classList.remove('hidden');
          
          // Update button to show it can regenerate
          if (apiKey) {
            getSummaryBtn.textContent = 'Regenerate Summary';
            getSummaryBtn.disabled = false;
          }
        } else if (apiKey) {
          getSummaryBtn.disabled = false;
        }
      } else {
        showError('Please navigate to a YouTube video page');
        getSummaryBtn.disabled = true;
      }
    } catch (error) {
      showError('Could not connect to YouTube page. Please refresh and try again.');
      getSummaryBtn.disabled = true;
    }
  } else {
    showError('Please navigate to a YouTube video page');
    getSummaryBtn.disabled = true;
  }

  // Toggle API key visibility
  toggleKeyBtn.addEventListener('click', () => {
    const type = apiKeyInput.type === 'password' ? 'text' : 'password';
    apiKeyInput.type = type;
    toggleKeyBtn.textContent = type === 'password' ? '👁️' : '🔒';
  });

  // Save API key
  saveApiKeyBtn.addEventListener('click', async () => {
    const key = apiKeyInput.value.trim();
    
    if (!key) {
      showStatus(apiKeyStatus, 'Please enter an API key', 'error');
      return;
    }

    if (!key.startsWith('sk-ant-')) {
      showStatus(apiKeyStatus, 'Invalid API key format. Should start with sk-ant-', 'error');
      return;
    }

    showStatus(apiKeyStatus, 'Validating API key...', 'info');
    saveApiKeyBtn.disabled = true;

    try {
      // Test the API key
      const response = await browser.runtime.sendMessage({
        action: 'testApiKey',
        apiKey: key
      });

      if (response.success) {
        // Save to storage
        const selectedModelValue = modelSelect.value;
        await browser.storage.local.set({ 
          apiKey: key,
          selectedModel: selectedModelValue
        });
        
        // Update badge
        const info = modelInfo[selectedModelValue];
        modelBadgeCollapsed.textContent = info.badge;
        
        showStatus(apiKeyStatus, 'Settings saved successfully ✓', 'success');
        
        // Collapse the section after a brief delay
        setTimeout(() => {
          apiKeyCollapsed.classList.remove('hidden');
          apiKeyExpanded.classList.add('hidden');
        }, 1500);
        
        getSummaryBtn.disabled = false;
      } else {
        showStatus(apiKeyStatus, `Invalid API key: ${response.error}`, 'error');
      }
    } catch (error) {
      showStatus(apiKeyStatus, `Error: ${error.message}`, 'error');
    } finally {
      saveApiKeyBtn.disabled = false;
    }
  });

  // Get summary
  getSummaryBtn.addEventListener('click', async () => {
    try {
      // Clear previous results
      errorDiv.classList.add('hidden');
      summaryResult.classList.add('hidden');
      loadingIndicator.classList.remove('hidden');
      getSummaryBtn.disabled = true;

      // Get transcript from content script
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      const response = await browser.tabs.sendMessage(tabs[0].id, {
        action: 'getTranscript'
      });

      if (!response.success) {
        throw new Error(response.error);
      }

      currentTranscript = response.transcript;
      
      // Show transcript stats
      const wordCount = currentTranscript.split(/\s+/).length;
      transcriptLengthSpan.textContent = `Transcript: ${wordCount} words`;
      stats.classList.remove('hidden');

      // Send to Claude for summarization
      const summaryResponse = await browser.runtime.sendMessage({
        action: 'summarizeTranscript',
        transcript: currentTranscript,
        videoTitle: currentVideoMetadata?.title || 'YouTube Video',
        tabId: tabs[0].id,
        videoId: currentVideoMetadata?.videoId
      });

      if (!summaryResponse.success) {
        throw new Error(summaryResponse.error);
      }

      // Display summary
      summaryText.textContent = summaryResponse.summary;
      summaryResult.classList.remove('hidden');
      loadingIndicator.classList.add('hidden');
      
      // Update stats text to remove "(cached)" if it was there
      transcriptLengthSpan.textContent = transcriptLengthSpan.textContent.replace(' (cached)', '');
      
      // Update button text
      getSummaryBtn.textContent = 'Regenerate Summary';

    } catch (error) {
      showError(error.message);
      loadingIndicator.classList.add('hidden');
    } finally {
      getSummaryBtn.disabled = false;
    }
  });

  // Copy summary
  copySummaryBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(summaryText.textContent);
      const originalText = copySummaryBtn.textContent;
      copySummaryBtn.textContent = 'Copied! ✓';
      setTimeout(() => {
        copySummaryBtn.textContent = originalText;
      }, 2000);
    } catch (error) {
      showError('Failed to copy to clipboard');
    }
  });

  // Helper functions
  function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
  }

  function showStatus(element, message, type) {
    element.textContent = message;
    element.className = `status status-${type}`;
    element.classList.remove('hidden');
    
    if (type === 'success') {
      setTimeout(() => {
        element.classList.add('hidden');
      }, 3000);
    }
  }
});
