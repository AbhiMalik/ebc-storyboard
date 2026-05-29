# Storyboard Skill — Quickstart

Generate a professional storyboard with AI images and B-roll video in **5 minutes**.

## One-Time Setup (5 min)

```bash
# 1. Copy example .env
cp examples/.env.example .env

# 2. Add your API keys to .env
nano .env
# → MIDJOURNEY_API_KEY=afk_...
# → RUNWAY_ML_API_KEY=key_...

# 3. Test setup
node storyboard-generator.js examples/sample-script.txt --video --output test
# Open test.html in browser ✅
```

Done! Now you're ready to generate storyboards.

## Generate a Storyboard (2 min)

### Basic: HTML storyboard only

```bash
node storyboard-generator.js your-script.txt --output my-storyboard
```

Output:
- `my-storyboard.html` — Interactive storyboard (open in browser)
- `my-storyboard-metrics.json` — Cost & timing stats

### Full: HTML + AI B-roll video

```bash
node storyboard-generator.js your-script.txt --video --output my-video
```

Output:
- `my-video.html` — Storyboard with video preview
- `slide_*.mp4` — Individual B-roll clips
- `my-video-metrics.json` — Full generation metrics

### Skip images (use placeholders)

```bash
node storyboard-generator.js your-script.txt --no-images
```

## Timeline Expectations

| Task | Time |
|------|------|
| Parse script | ~10s |
| Generate images (2-4) | ~1-2 min |
| Generate B-roll videos (2-4) | ~3-5 min |
| Build HTML | ~10s |
| **Total** | **~5-7 min** |

## Script Format

Plain text, any length:

```
Slide title or opening line here.

This is the audio script for the slide.
Roughly 40–80 words per slide.

Next slide topic here.

More script content.
```

The skill auto-segments into slides at natural breaks.

## View Results

After generation:

1. **Open HTML in browser:**
   ```bash
   open my-storyboard.html
   ```

2. **Check metrics:**
   ```bash
   cat my-storyboard-metrics.json
   ```
   Shows:
   - Images generated & cost
   - Videos generated & cost
   - Total generation time
   - Any failures or warnings

3. **Download files:**
   - All files saved in current directory
   - Videos are ready for post-production
   - HTML is ready for review/sharing

## Common Tasks

### Regenerate images only

```bash
node storyboard-generator.js your-script.txt --output my-version-2
```

(Images are cached; delete cache to force regeneration)

### Change output name

```bash
node storyboard-generator.js your-script.txt --video --output "Training Module 3"
```

Output: `Training Module 3.html`, `Training Module 3.mp4`

### Run multiple storyboards in parallel

```bash
node storyboard-generator.js script1.txt --video --output storyboard-1 &
node storyboard-generator.js script2.txt --video --output storyboard-2 &
node storyboard-generator.js script3.txt --video --output storyboard-3 &
wait
```

All three generate simultaneously (faster if you have multiple API requests).

## Monitoring Costs

Check spending after each generation:

```bash
cat my-storyboard-metrics.json | grep -E "totalCost|videosGenerated|imagesGenerated"
```

Expected costs:
- **Images:** ~$0.02–0.05 per storyboard (2–4 images)
- **Videos:** ~$0.75–1.50 per storyboard (2–4 videos)
- **Total:** ~$1–2 per storyboard

See **COST_TRACKING.md** to set spending limits & monitor monthly usage.

## Troubleshooting

**Error: "API key not found"**
→ Check `.env` file exists in current directory and has API keys

**Error: "Insufficient credits"**
→ Add credits to APIFRAME account (https://apiframe.pro)

**Videos taking too long?**
→ Normal: Runway ML can take 3–5 minutes per video. Check progress: tail output file

**Images look bad?**
→ Try regenerating: delete `cache/images/` and run again with different prompt

See **TROUBLESHOOTING.md** for detailed error solutions.

---

**Next:** See **SETUP_GUIDE.md** for detailed setup & API key management  
**Next:** See **COST_TRACKING.md** to monitor spending  
**Next:** See **TROUBLESHOOTING.md** for error solutions
