# Storyboard Skill — Setup Guide

Complete setup takes **5–10 minutes**. Follow these steps to enable storyboard generation with AI images and videos.

## Prerequisites

- Node.js 14+ (check: `node --version`)
- Claude Code CLI installed
- Internet connection (for API calls)

## Step 1: Clone & Navigate

```bash
cd /Users/abhinandan/plugins/ebc-storyboard/skills/storyboard
```

## Step 2: Create .env File

Copy the example template:

```bash
cp examples/.env.example .env
```

## Step 3: Add API Keys

Edit `.env` and fill in your API keys:

```bash
nano .env
```

### Required Keys

**Option A: Midjourney (APIFRAME) — Recommended for Images**

1. Go to https://apiframe.pro
2. Create account & add payment method
3. Copy your API key
4. Paste into `.env`:
   ```
   MIDJOURNEY_API_KEY=afk_xxxxxxxxxxxxx
   MIDJOURNEY_PROVIDER=apiframe
   ```

**Option B: DALL-E 3 (OpenAI) — Alternative for Images**

1. Go to https://platform.openai.com/api/keys
2. Create API key
3. Paste into `.env`:
   ```
   OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
   ```

### Optional: B-roll Videos

To generate AI B-roll videos (highly recommended):

1. Go to https://app.runwayml.com/api
2. Create API token
3. Paste into `.env`:
   ```
   RUNWAY_ML_API_KEY=key_xxxxxxxxxxxxx
   ```

### Video Settings (Optional)

Adjust video generation parameters in `.env`:

```bash
VIDEO_FPS=24              # Frames per second
VIDEO_BITRATE=5000k       # Bitrate (higher = better quality)
VIDEO_FORMAT=h264         # Codec (h264, h265, vp9)
RUNWAY_DURATION_SECONDS=8 # Video duration per slide
```

## Step 4: Verify Setup

Test that credentials are loaded:

```bash
node -e "require('./lib/config.js').init(true); console.log('✅ Config loaded successfully')"
```

Expected output: `✅ Config loaded successfully`

If you see an error, check:
- `.env` file exists in current directory
- API keys are correct (no extra spaces or quotes)
- Keys have proper format (Midjourney: `afk_...`, OpenAI: `sk-proj-...`, Runway: `key_...`)

## Step 5: Test Generation

Generate a sample storyboard:

```bash
node storyboard-generator.js examples/sample-script.txt --video --output test-run
```

Expected output:
```
📖 Parsing script...
✓ Parsed 9 slides (~1:45)
🎨 Generating images...
📹 Generating B-roll videos...
✓ Storyboard saved: test-run.html
```

Open `test-run.html` in your browser to view the result.

## Troubleshooting

### "API key not found" error

**Problem:** `.env` file not loaded
**Solution:**
- Verify `.env` exists in current directory (not in subdirectory)
- Check file has correct API key format
- Try: `cat .env | grep MIDJOURNEY_API_KEY`

### "Invalid or expired token" error

**Problem:** API key is wrong or expired
**Solution:**
- Verify key is copied correctly (no extra spaces)
- Check key hasn't expired on provider's dashboard
- Generate new API key and update `.env`

### "Insufficient credits" error

**Problem:** APIFRAME account has no credits
**Solution:**
- Log in to https://apiframe.pro
- Add payment method
- Add credits (minimum ~$5 for testing)

### Images/videos not generating

**Problem:** API timeout or failure
**Solution:**
- Check internet connection
- Try running again (temporary API issue)
- Check console output for specific error
- See TROUBLESHOOTING.md for detailed error codes

## Security Best Practices

1. **Never commit .env to git** — it's in `.gitignore`
2. **Rotate API keys regularly** — generate new keys quarterly
3. **Use billing limits** — set max spend per month in provider dashboard
4. **Monitor usage** — check cost metrics weekly via CLI

## Next Steps

→ See **QUICKSTART.md** to generate your first storyboard

→ See **API_KEYS.md** for credential management details

→ See **COST_TRACKING.md** to monitor spending

## Support

For issues:
1. Check **TROUBLESHOOTING.md** for your error
2. Verify API keys are valid in provider dashboard
3. Check internet connection
4. Try running with `DEBUG=true` in `.env` for verbose output

---

**Estimated Setup Time:** 5–10 minutes  
**Total Cost:** ~$0–5 initial credits (reusable for many storyboards)
