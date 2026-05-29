# Storyboard Skill — Troubleshooting

## Common Issues & Solutions

### Setup Issues

#### ❌ "MIDJOURNEY_API_KEY not configured"

**Cause:** API key not in `.env` file

**Solution:**
1. Verify `.env` exists: `ls -la .env`
2. Check key is set: `grep MIDJOURNEY_API_KEY .env`
3. If missing, add it:
   ```bash
   echo "MIDJOURNEY_API_KEY=afk_your_actual_key_here" >> .env
   ```

---

#### ❌ "Neither MIDJOURNEY_API_KEY nor OPENAI_API_KEY found"

**Cause:** No image generation service configured

**Solution:**
```bash
# Option 1: Add Midjourney (recommended)
echo "MIDJOURNEY_API_KEY=afk_your_key_here" >> .env

# Option 2: Add OpenAI DALL-E
echo "OPENAI_API_KEY=sk-proj-your_key_here" >> .env
```

---

#### ❌ "Invalid or expired token" (401 error)

**Cause:** API key is wrong, expired, or has no access

**Solution:**
1. Verify key format (should start with correct prefix)
   - Midjourney: `afk_...`
   - OpenAI: `sk-proj-...`
   - Runway: `key_...`
2. Check key hasn't been revoked in provider dashboard
3. Generate new API key:
   - Midjourney: https://apiframe.pro/dashboard
   - OpenAI: https://platform.openai.com/api/keys
   - Runway: https://app.runwayml.com/api

---

### Image Generation Issues

#### ❌ "Insufficient credits" (402 error)

**Cause:** APIFRAME account out of credits

**Solution:**
1. Log in to https://apiframe.pro
2. Go to Billing → Add Payment Method
3. Add credits (minimum $5 for testing)
4. Retry generation

**Prevention:** Set monthly spending limit in dashboard

---

#### ❌ "Image generation timeout"

**Cause:** API taking too long to respond (network issue or service degradation)

**Solution:**
1. Check internet connection: `ping google.com`
2. Retry the command (temporary API issue)
3. Try a simpler script (shorter content = faster generation)
4. Check APIFRAME status: https://status.apiframe.pro

---

#### ❌ "Images look low quality or incorrect"

**Cause:** Auto-generated prompt doesn't match your intent

**Solution:**
1. Edit script to be more descriptive
2. Example bad: "Employee at desk"
3. Example good: "Professional employee sitting at desk in modern office, serious expression, corporate lighting"
4. Regenerate: delete `cache/images/` and run again

---

### Video Generation Issues

#### ❌ "RUNWAY_ML_API_KEY not configured"

**Cause:** No Runway API key in `.env`

**Solution:**
```bash
# If you don't want videos, use --no-images flag
node storyboard-generator.js script.txt --no-images

# Or add Runway key:
echo "RUNWAY_ML_API_KEY=key_your_actual_key_here" >> .env
```

---

#### ❌ "Runway ML error (400): Invalid option — expected one of 'gen3a_turbo'..."

**Cause:** Model or configuration is invalid

**Solution:**
This should be fixed automatically. If you see this:
1. Check config.js has valid model: `grep "model:" lib/config.js`
2. Should be: `model: 'gen4_turbo'`
3. If different, update it in lib/config.js

---

#### ❌ "Runway ML error (401): Incorrect hostname"

**Cause:** Wrong API endpoint

**Solution:**
This should be fixed automatically. If you see this:
1. Check endpoint in config.js: `grep "endpoint:" lib/config.js`
2. Should be: `endpoint: 'https://api.dev.runwayml.com/v1'`
3. Not: `https://api.runwayml.com/v1`

---

#### ❌ "Video generation timeout"

**Cause:** Runway ML taking >10 minutes (very rare)

**Solution:**
1. Normal: videos take 2–5 minutes. This is not a timeout.
2. If actually timing out (>10 min):
   - Check Runway status: https://www.runwayml.com/status
   - Try again later
   - Check account has sufficient credits

---

#### ❌ "Polling... (10 attempts)" appears repeatedly

**Cause:** Video generation still in progress (normal)

**Solution:**
- This is not an error. Videos take 2–5 minutes.
- Wait for "✓ Video generation succeeded" message
- Do not interrupt the process

---

### Output Issues

#### ❌ "Storyboard saved" but HTML is blank or broken

**Cause:** File write failed or corruption

**Solution:**
1. Check file exists: `ls -la my-storyboard.html`
2. Check file size: `wc -c my-storyboard.html` (should be >5KB)
3. Try opening in different browser
4. Regenerate: `rm my-storyboard.html && node storyboard-generator.js script.txt`

---

#### ❌ "Metrics file not created"

**Cause:** Generation failed partway through

**Solution:**
1. Check for error messages in console output
2. Look for partial files: `ls -la` and check timestamps
3. Retry generation
4. If still fails, check preceding errors in troubleshooting

---

### Performance Issues

#### ⚠️ Generation is very slow

**Cause:** Normal for first run; subsequent runs are faster due to caching

**Timeline:**
- First storyboard: 5–8 minutes
- Same images cached: 1–2 minutes
- Same videos cached: <1 minute

**Solution:**
- First run is expected to take 5–8 minutes
- Subsequent runs reuse cached images/videos
- To force regeneration: delete `cache/` directory

---

#### ⚠️ Multiple storyboards slower than expected

**Cause:** Parallel requests hit rate limits

**Solution:**
- Run sequentially: `node ... && node ...`
- Or space them out: add 30-second delays
- Or run in background: `node ... &`

---

### Cost Issues

#### ❌ "Cost higher than expected"

**Cause:** Images/videos regenerated instead of cached

**Solution:**
1. Check cache exists: `ls cache/images/ cache/videos/`
2. Cache is deleted between runs: move to persistent location
3. Review metrics: `cat metrics.json | grep -i cost`
4. Set spending limit in API provider dashboard

---

#### ⚠️ "Monthly spending is high"

**Cause:** Many storyboards generated (normal at scale)

**Solution:**
1. Review usage: `ls -lt *.json | head -20`
2. Set monthly budget: https://apiframe.pro/billing
3. Consider batch generation (multiple in one run)
4. Use image caching for repeated content

See **COST_TRACKING.md** for detailed cost monitoring.

---

## Getting Help

### Debug Mode

Enable verbose logging:

```bash
DEBUG=true node storyboard-generator.js script.txt --video
```

Output will show:
- Every API request/response
- Cache hits/misses
- Polling details
- Timestamps for each step

### Check Specific Metrics

```bash
# Show cost breakdown
cat my-storyboard-metrics.json | jq '.imageMetrics, .videoMetrics'

# Show generation timeline
cat my-storyboard-metrics.json | jq '.totalTime'

# Check for errors
cat my-storyboard-metrics.json | jq '.imageMetrics.failures, .videoMetrics.failures'
```

### Verify API Connectivity

```bash
# Test Midjourney
curl -H "X-API-Key: YOUR_KEY" https://api.apiframe.pro/v2/images

# Test Runway
curl -H "Authorization: Bearer YOUR_KEY" \
     -H "X-Runway-Version: 2024-11-06" \
     https://api.dev.runwayml.com/v1/tasks/test
```

---

## Still Stuck?

1. **Check SETUP_GUIDE.md** — verify all prerequisites
2. **Check QUICKSTART.md** — verify correct command syntax
3. **Check API provider status pages:**
   - APIFRAME: https://status.apiframe.pro
   - Runway: https://www.runwayml.com/status
4. **Enable DEBUG mode** — shows exact API errors
5. **Check .env file** — verify API keys are correct and in right format

---

**Last updated:** 2026-05-29  
**Phase:** 2 (Images + Videos)
