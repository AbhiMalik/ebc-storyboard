# Storyboard Skill Documentation

Complete documentation for the storyboard generation skill. Start with the appropriate guide for your role.

## For New Users

### 🚀 **Getting Started** → Read [QUICKSTART.md](QUICKSTART.md)

5-minute guide to generate your first storyboard:
- One-time setup
- Generate storyboard command
- Viewing results
- Common tasks

**Time:** 5 minutes | **Goal:** Generate your first storyboard

---

### 📋 **Full Setup** → Read [SETUP_GUIDE.md](SETUP_GUIDE.md)

Step-by-step setup including:
- Prerequisites
- Installing dependencies
- Getting API keys (Midjourney, Runway, OpenAI)
- Verifying configuration
- First test run

**Time:** 10 minutes | **Goal:** Ready to generate storyboards

---

## For Storyboarders

### 🎬 **Generate Storyboards** → [QUICKSTART.md](QUICKSTART.md)

Use the skill to create storyboards:
```bash
node storyboard-generator.js your-script.txt --video --output my-storyboard
```

### 💰 **Monitor Costs** → [COST_TRACKING.md](COST_TRACKING.md)

Understand and track spending:
- Cost breakdown per storyboard
- Monthly budget review
- Cost optimization strategies
- Setting spending limits

### 🔧 **Troubleshoot Issues** → [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

Solve common problems:
- API errors
- Generation failures
- Slow performance
- Quality issues

---

## For Administrators

### 🔐 **API Key Management** → [API_KEYS.md](API_KEYS.md)

Securely manage credentials:
- Obtaining API keys from providers
- Secure storage in `.env`
- Rotating keys quarterly
- Cost controls and limits

### 💡 **Budget Management** → [COST_TRACKING.md](COST_TRACKING.md)

Control team spending:
- Setting monthly budgets
- Monitoring usage
- Cost alerts
- Financial planning

### 📊 **Usage Monitoring** → [COST_TRACKING.md](COST_TRACKING.md)

Track team productivity:
- Weekly cost reports
- Monthly summaries
- Cost per storyboard
- Cost per training hour

---

## Documentation Structure

| Document | For | Purpose | Time |
|----------|-----|---------|------|
| [QUICKSTART.md](QUICKSTART.md) | Everyone | Get started fast | 5 min |
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | New users | Complete setup | 10 min |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Storyboarders | Fix issues | 5–10 min |
| [API_KEYS.md](API_KEYS.md) | Admins | Manage credentials | Reference |
| [COST_TRACKING.md](COST_TRACKING.md) | Admins/users | Monitor spending | Reference |

---

## Quick Reference

### Generate a Storyboard

```bash
# Basic (HTML only)
node storyboard-generator.js script.txt --output my-storyboard

# With B-roll video
node storyboard-generator.js script.txt --video --output my-storyboard

# Without images (placeholders only)
node storyboard-generator.js script.txt --no-images --output my-storyboard
```

### Check Costs

```bash
cat my-storyboard-metrics.json | jq '{
  images: .imageMetrics.imagesGenerated,
  imageCost: .imageMetrics.totalCost,
  videos: .videoMetrics.videosGenerated,
  videoCost: .videoMetrics.totalCost,
  totalCost: (.imageMetrics.totalCost + .videoMetrics.totalCost)
}'
```

### View Help

```bash
node storyboard-generator.js
# Shows all command options and examples
```

---

## Getting Help

1. **Check the right guide:**
   - Setting up? → [SETUP_GUIDE.md](SETUP_GUIDE.md)
   - Generating storyboards? → [QUICKSTART.md](QUICKSTART.md)
   - Hit an error? → [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
   - Managing costs? → [COST_TRACKING.md](COST_TRACKING.md)

2. **Enable debug mode for detailed output:**
   ```bash
   DEBUG=true node storyboard-generator.js script.txt --video
   ```

3. **Check metrics for what happened:**
   ```bash
   cat my-storyboard-metrics.json | jq .
   ```

4. **Verify API credentials:**
   ```bash
   cat .env | grep -i api
   ```

---

## System Requirements

- Node.js 14+
- Internet connection
- API keys for:
  - Image generation: Midjourney (APIFRAME) or OpenAI (DALL-E)
  - Video generation (optional): Runway ML
- Disk space: ~50MB for cache

---

## Workflow Overview

```
Your Script
    ↓
[1] Parse into slides (~10s)
    ↓
[2] Generate images (Midjourney) (~1–2 min)
    ↓
[3] Generate B-roll videos (Runway ML) (~3–5 min)
    ↓
[4] Build HTML storyboard (~10s)
    ↓
Output: storyboard.html + videos
```

**Total time:** ~5–7 minutes per storyboard

---

## Costs

**Typical storyboard cost:** $1.50–3.00

- **Images:** $0.02–0.05 per image (2–4 per storyboard)
- **Videos:** $0.75 per video (2–4 per storyboard)

See [COST_TRACKING.md](COST_TRACKING.md) for detailed cost breakdown.

---

## Support Resources

- **Skill repository:** `/Users/abhinandan/plugins/ebc-storyboard/skills/storyboard`
- **Configuration:** `.env` file in skill directory
- **API credentials:** Stored in `.env` (gitignored, local only)
- **Cache:** `cache/` directory (auto-created, can be deleted)
- **Output:** All storyboards saved to current directory as `*.html`

---

## Common Tasks

### Generate storyboard with video
```bash
node storyboard-generator.js training-module.txt --video --output "Training Module 3"
```

### Generate multiple storyboards
```bash
node storyboard-generator.js script1.txt --video --output v1 &
node storyboard-generator.js script2.txt --video --output v2 &
wait
```

### Check spending this month
```bash
bash cost-report.sh  # See COST_TRACKING.md for script
```

### Regenerate (force fresh images/videos)
```bash
rm -rf cache
node storyboard-generator.js script.txt --video --output my-storyboard
```

### Verify setup is correct
```bash
node storyboard-generator.js examples/sample-script.txt --video --output test
# Should complete without errors
# Open test.html in browser to verify
```

---

## Phase Progress

- ✅ **Phase 1:** Core image generation (Midjourney/APIFRAME)
- ✅ **Phase 2:** B-roll video generation (Runway ML)
- ✅ **Phase 3:** Documentation & team handoff
- 📋 **Phase 4:** User testing & feedback (scheduled)

---

**Last updated:** 2026-05-29  
**Version:** 2.0 (Images + Videos)  
**Status:** Production-ready
