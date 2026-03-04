// background.js - Service worker for API calls

// Cache for storing summaries per tab/video
const summaryCache = new Map();

// Listen for messages from popup
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "summarizeTranscript") {
    summarizeWithClaude(request.transcript, request.videoTitle)
      .then(summary => {
        // Cache the summary
        const cacheKey = `${request.tabId}-${request.videoId}`;
        summaryCache.set(cacheKey, {
          summary,
          transcript: request.transcript,
          videoTitle: request.videoTitle,
          timestamp: Date.now()
        });
        sendResponse({ success: true, summary });
      })
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Will respond asynchronously
  }
  
  if (request.action === "getCachedSummary") {
    const cacheKey = `${request.tabId}-${request.videoId}`;
    const cached = summaryCache.get(cacheKey);
    if (cached) {
      sendResponse({ success: true, cached: true, data: cached });
    } else {
      sendResponse({ success: true, cached: false });
    }
    return false;
  }
  
  if (request.action === "testApiKey") {
    testApiKey(request.apiKey)
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

// Summarize transcript using Claude API
async function summarizeWithClaude(transcript, videoTitle = "YouTube Video") {
  // Get API key and selected model from storage
  const { apiKey, selectedModel } = await browser.storage.local.get(['apiKey', 'selectedModel']);
  
  if (!apiKey) {
    throw new Error("No API key configured. Please set your Anthropic API key in the extension popup.");
  }
  
  // Use selected model or default to Sonnet 4
  const model = selectedModel || 'claude-sonnet-4-20250514';

  // Prepare the prompt
  const prompt = `Please provide a comprehensive summary of this YouTube video transcript. Include:

1. Main Topic: What is the video about?
2. Key Points: The most important information covered (bullet points)
3. Notable Details: Any interesting facts, statistics, or insights
4. Conclusion: The main takeaway or conclusion

Video Title: ${videoTitle}

Transcript:
${transcript}`;

  try {
    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 2048,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    // Extract the summary from Claude's response
    const summary = data.content[0].text;
    
    return summary;
    
  } catch (error) {
    if (error.message.includes('API Error: 401')) {
      throw new Error("Invalid API key. Please check your Anthropic API key.");
    }
    throw error;
  }
}

// Test if API key is valid
async function testApiKey(apiKey) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001', // Use fastest/cheapest model for testing
        max_tokens: 10,
        messages: [{
          role: 'user',
          content: 'Hi'
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Invalid API key');
    }

    return true;
  } catch (error) {
    throw new Error(`API key validation failed: ${error.message}`);
  }
}
