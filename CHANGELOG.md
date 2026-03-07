# Changelog

## Version 1.2.1 - March 7, 2026

### Improvements
- Added handling for alternate youtube transcript style

---

## Version 1.2.0 - February 14, 2026

### New Features
- **Model Selector**: Choose between Haiku 4, Sonnet 4, or Opus 4 models for summarization
- **Cost Information**: See estimated cost per video for each model
- **Model Badge**: Collapsed configuration shows which model is currently selected
- **Smart Defaults**: Defaults to Sonnet 4 for balanced performance

### Improvements
- Model selection is saved with API key and persists across sessions
- API key validation now uses Haiku 4 (faster and cheaper testing)
- "Save API Key" button renamed to "Save Settings" to reflect dual purpose
- Model information displayed in dropdown with clear labels

### Technical Changes
- Added model selection to browser.storage.local
- Background script now uses selected model from storage
- Added model cost calculations and descriptions
- Created comprehensive MODEL_GUIDE.md documentation

---

## Version 1.1.2 - February 14, 2026

### New Features
- **Collapsible Configuration Section**: API key section now collapses to a single line after saving, showing only "🔑 API Key Configured" with an "Edit" link to expand it again
- **Cleaner Interface**: Less visual clutter when API key is already configured

### Improvements
- Configuration section automatically collapses 1.5 seconds after successfully saving API key
- "Edit" button allows quick access to change API key
- More screen space for video info and summaries

---

## Version 1.1.1 - February 14, 2026

### Bug Fixes
- **Critical**: Fixed JavaScript syntax error (duplicate `const wordCount` declaration) that prevented popup from working
- API key saving and password visibility toggle now work correctly

---

## Version 1.1.0 - February 14, 2026

### New Features
- **Summary Caching**: Summaries are now cached per tab/video. When you reopen the popup on the same video, the previous summary is instantly displayed
- **Close Button**: Added an X button in the header to close the popup
- **Better Button Labels**: The "Get Summary" button changes to "Regenerate Summary" when a cached summary exists

### Improvements
- **Fixed Scrollbar Issues**: Eliminated horizontal scrollbar and improved overall scroll behavior
- **Better Text Wrapping**: Summary text now wraps properly without causing layout issues
- **Fixed Width**: Popup maintains consistent width to prevent resizing when summary loads
- **Visual Feedback**: Shows "(cached)" indicator in stats when displaying a previously generated summary

### Technical Changes
- Added `summaryCache` Map in background script to store summaries
- Added `getCachedSummary` message handler
- Improved CSS overflow and text wrapping properties
- Added tab ID and video ID to cache keys for proper isolation

---

## Version 1.0.0 - February 14, 2026

### Initial Release
- Extract YouTube video transcripts
- Generate AI-powered summaries using Claude
- Configurable API key storage
- Clean, intuitive popup interface
- Support for videos with captions in multiple languages
- Copy summary to clipboard
- Transcript word count display
