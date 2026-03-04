# Quick Start Guide 🚀

## Get Up and Running in 5 Minutes!

### Step 1: Get Your Anthropic API Key (2 minutes)

1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to [API Keys](https://console.anthropic.com/settings/keys)
4. Click "Create Key"
5. Copy your API key (starts with `sk-ant-`)

**Cost Note**: Your first few dollars of usage are typically free credits, then it's ~1-2 cents per video summary.

---

### Step 2: Install the Extension (1 minute)

**Quick Method (Temporary - for testing):**

1. Open Firefox
2. Type `about:debugging#/runtime/this-firefox` in the address bar
3. Click "Load Temporary Add-on..."
4. Navigate to this folder and select `manifest.json`
5. Done! The extension appears in your toolbar

**Note**: Temporary extensions are removed when Firefox closes. For permanent installation, see the full README.

---

### Step 3: Configure the Extension (1 minute)

1. Click the extension icon in your Firefox toolbar (purple play button)
2. Paste your API key into the "Anthropic API Key" field
3. Click "Save API Key"
4. Wait for the success message ✓

---

### Step 4: Try It Out! (1 minute)

1. Go to any YouTube video (e.g., [this TED talk](https://www.youtube.com/watch?v=8S0FDjFBj8o))
2. Make sure the video has captions (look for the CC button)
3. Click the extension icon
4. Click "Get Summary"
5. Wait ~10-30 seconds
6. Read your AI-generated summary! 🎉

---

## What Happens Next?

The extension:
1. Extracts the video transcript from YouTube
2. Sends it to Claude AI
3. Returns a comprehensive summary with:
   - Main topic
   - Key points
   - Notable details
   - Conclusion

---

## Troubleshooting Quick Fixes

**"No captions available"**
→ Try a different video with captions enabled

**Extension icon grayed out**
→ Make sure you're on a YouTube video page (`/watch?v=...`)

**"Invalid API key"**
→ Double-check you copied the full key from console.anthropic.com

**Extension disappeared**
→ If you used "Load Temporary Add-on", reload it from `about:debugging`

---

## Tips for Best Results

✅ **Works best with**: Educational content, tutorials, podcasts, interviews
✅ **Supports**: English and many other languages (if captions available)
✅ **Video length**: Works with any length, but longer videos cost more to summarize
✅ **Copy summaries**: Click the "Copy" button to paste into notes or documents

---

## What's the Cost?

Using Claude Sonnet 4:
- **Short video (5-10 min)**: ~$0.01
- **Medium video (20-30 min)**: ~$0.02-0.03
- **Long video (1+ hour)**: ~$0.05-0.10

**Way cheaper than paid summary services!** 💰

---

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Customize the summary prompt in `background.js`
- Try different Claude models for speed vs. quality tradeoffs

---

**Enjoy faster learning! 🎓**
