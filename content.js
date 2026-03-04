// content.js - Runs on YouTube pages to extract transcripts

// Listen for messages from popup
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getTranscript") {
    getTranscript()
      .then(transcript => sendResponse({ success: true, transcript }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Will respond asynchronously
  }
  
  if (request.action === "checkYouTubePage") {
    const isVideoPage = isYouTubeVideoPage();
    sendResponse({ isVideoPage, videoId: getVideoId() });
    return false;
  }
});

// Check if we're on a YouTube video page
function isYouTubeVideoPage() {
  return window.location.pathname === "/watch" && getVideoId() !== null;
}

// Get the video ID from URL
function getVideoId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('v');
}

// Extract transcript from YouTube
async function getTranscript() {
  const videoId = getVideoId();
  if (!videoId) {
    throw new Error("Not on a YouTube video page");
  }

  // Method 1: Try to get transcript from YouTube's caption tracks
  try {
    // Find the ytInitialPlayerResponse in the page
    const scripts = document.querySelectorAll('script');
    let playerResponse = null;
    
    for (const script of scripts) {
      const scriptContent = script.textContent;
      if (scriptContent.includes('ytInitialPlayerResponse')) {
        const match = scriptContent.match(/var ytInitialPlayerResponse = ({.+?});/);
        if (match) {
          playerResponse = JSON.parse(match[1]);
          break;
        }
      }
    }

    if (!playerResponse) {
      throw new Error("Could not find player response data");
    }

    // Get captions data
    const captionTracks = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    
    if (!captionTracks || captionTracks.length === 0) {
      throw new Error("No captions available for this video");
    }

    // Get the first available caption track (usually auto-generated or English)
    const captionTrack = captionTracks[0];
    const captionUrl = captionTrack.baseUrl;

    // Fetch the caption data
    const response = await fetch(captionUrl);
    const captionText = await response.text();

    // Parse the XML/JSON caption data
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(captionText, "text/xml");
    
    // Extract text from caption elements
    const textElements = xmlDoc.getElementsByTagName('text');
    let transcript = '';
    
    for (const element of textElements) {
      const text = element.textContent;
      // Decode HTML entities
      const decodedText = decodeHTMLEntities(text);
      transcript += decodedText + ' ';
    }

    if (!transcript.trim()) {
      throw new Error("Transcript extraction failed - no text found");
    }

    return transcript.trim();

  } catch (error) {
    // Method 2: Try to click the transcript button and scrape
    try {
      return await getTranscriptFromButton();
    } catch (fallbackError) {
      throw new Error(`Failed to get transcript: ${error.message}. Fallback also failed: ${fallbackError.message}`);
    }
  }
}

// Fallback method: Click the show transcript button
async function getTranscriptFromButton() {
  // Wait for page to be ready
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Find and click the "Show transcript" button
  const buttons = document.querySelectorAll('button');
  let transcriptButton = null;

  for (const button of buttons) {
    const ariaLabel = button.getAttribute('aria-label');
    if (ariaLabel && ariaLabel.includes('transcript')) {
      transcriptButton = button;
      break;
    }
  }

  if (!transcriptButton) {
    // Try alternative selector
    const moreActionsButton = document.querySelector('button[aria-label*="More actions"]');
    if (moreActionsButton) {
      moreActionsButton.click();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Look for transcript option in menu
      const menuItems = document.querySelectorAll('tp-yt-paper-listbox ytd-menu-service-item-renderer');
      for (const item of menuItems) {
        if (item.textContent.includes('transcript')) {
          item.click();
          break;
        }
      }
    }
  } else {
    transcriptButton.click();
  }

  // Wait for transcript panel to appear
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Find transcript segments
  const transcriptSegments = document.querySelectorAll('ytd-transcript-segment-renderer');
  
  if (transcriptSegments.length === 0) {
    throw new Error("Could not find transcript segments on page");
  }

  let transcript = '';
  for (const segment of transcriptSegments) {
    const textElement = segment.querySelector('.segment-text');
    if (textElement) {
      transcript += textElement.textContent.trim() + ' ';
    }
  }

  return transcript.trim();
}

// Helper function to decode HTML entities
function decodeHTMLEntities(text) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

// Get video title
function getVideoTitle() {
  const titleElement = document.querySelector('h1.ytd-video-primary-info-renderer yt-formatted-string');
  return titleElement ? titleElement.textContent.trim() : 'Unknown Title';
}

// Export video metadata when requested
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getVideoMetadata") {
    sendResponse({
      title: getVideoTitle(),
      videoId: getVideoId(),
      url: window.location.href
    });
    return false;
  }
});
