# Storyboard Skill — Cost Tracking & Budget Management

Monitor spending and control costs for storyboard generation.

## Cost Breakdown

### Per-Storyboard Costs

| Component | Unit Cost | Typical | Range |
|-----------|-----------|---------|-------|
| **Images (Midjourney)** | $0.022 each | 2–4 images | $0.04–0.09 |
| **Videos (Runway ML)** | $0.75 each | 2–4 videos | $1.50–3.00 |
| **Total per storyboard** | — | **~$1.50–3.00** | $0.04–3.09 |

### Monthly Cost Examples

| Scenario | Storyboards/Month | Cost |
|----------|-------------------|------|
| Light use | 5 | ~$7–15 |
| Regular use | 20 | ~$30–60 |
| Heavy use | 100 | ~$150–300 |

---

## Viewing Costs

### Per-Storyboard Metrics

After generation, check costs:

```bash
# Show all metrics
cat my-storyboard-metrics.json | jq .

# Show only costs
cat my-storyboard-metrics.json | jq '{
  images: .imageMetrics | {generated: .imagesGenerated, cost: .totalCost},
  videos: .videoMetrics | {generated: .videosGenerated, cost: .totalCost},
  total: (.imageMetrics.totalCost + .videoMetrics.totalCost)
}'
```

Expected output:
```json
{
  "images": {
    "generated": 2,
    "cost": 0.044
  },
  "videos": {
    "generated": 2,
    "cost": 1.5
  },
  "total": 1.544
}
```

---

### Monthly Summary Script

Track all storyboards generated this month:

```bash
#!/bin/bash
# save as: cost-report.sh

echo "📊 Monthly Cost Report"
echo "======================================"

total_cost=0
total_images=0
total_videos=0

for metrics in *-metrics.json; do
  if [ -f "$metrics" ]; then
    img_cost=$(jq '.imageMetrics.totalCost // 0' "$metrics")
    vid_cost=$(jq '.videoMetrics.totalCost // 0' "$metrics")
    images=$(jq '.imageMetrics.imagesGenerated // 0' "$metrics")
    videos=$(jq '.videoMetrics.videosGenerated // 0' "$metrics")
    title=$(jq -r '.title' "$metrics")
    
    storyboard_cost=$(echo "$img_cost + $vid_cost" | bc)
    
    echo "$title: \$$storyboard_cost ($images images, $videos videos)"
    
    total_cost=$(echo "$total_cost + $storyboard_cost" | bc)
    total_images=$(($total_images + $images))
    total_videos=$(($total_videos + $videos))
  fi
done

echo "======================================"
echo "Total: \$$total_cost ($total_images images, $total_videos videos)"
```

Run it:
```bash
chmod +x cost-report.sh
./cost-report.sh
```

---

## Setting Spending Limits

### APIFRAME (Midjourney)

**Prevent overspending:**

1. Log in to https://apiframe.pro
2. Go to **Billing** → **Spending Limit**
3. Set monthly budget (e.g., $100)
4. Select "Notify me" or "Stop billing"
5. Save

**Expected monthly usage:**
- 1–2 storyboards/month: $5–10
- 10–20 storyboards/month: $50–100
- Set limit 20–30% higher than expected

---

### Runway ML

**Prevent overspending:**

1. Log in to https://app.runwayml.com
2. Go to **Billing & Usage** → **Spending Limits**
3. Set monthly budget (e.g., $100)
4. Select alert threshold (50%, 90%, 100%)
5. Save

---

### OpenAI (DALL-E)

**Prevent overspending:**

1. Log in to https://platform.openai.com
2. Go to **Billing** → **Usage limits**
3. Set "Hard limit" (stops API when reached)
4. Set "Soft limit" (email alert)
5. Save

---

## Optimizing Costs

### Strategy 1: Use Image Caching

Images are cached for 30 days. Reuse them:

```bash
# First storyboard with new images
node storyboard-generator.js script-v1.txt --video --output version1
# Cost: ~$1.54 (full cost)

# Second storyboard with SAME images (same image slides)
node storyboard-generator.js script-v2.txt --video --output version2
# Cost: ~$1.50 (videos only, images cached)

# Savings: ~$0.04 per storyboard
```

**Benefit:** Save 3–5% by reusing images across variations

---

### Strategy 2: Generate Images Only

Skip videos for internal review, add videos later:

```bash
# Quick version (review only)
node storyboard-generator.js script.txt --output review
# Cost: ~$0.05 (images only)

# After approval, generate full version
node storyboard-generator.js script.txt --video --output final
# Cost: ~$1.50 (videos, images from cache)
```

**Benefit:** Save $1.50 per review cycle

---

### Strategy 3: Batch Generation

Generate multiple storyboards in one session:

```bash
# One by one (slow, updates API calls separately)
node storyboard-generator.js script1.txt --video --output v1
node storyboard-generator.js script2.txt --video --output v2

# In parallel (fast, better API rate limiting)
node storyboard-generator.js script1.txt --video --output v1 &
node storyboard-generator.js script2.txt --video --output v2 &
wait
```

**Benefit:** Faster throughput, better API concurrency

---

### Strategy 4: Longer Video Duration

Runway charges per video, not per second. Longer videos are better value:

```bash
# In .env:
RUNWAY_DURATION_SECONDS=8  # Default: 8 seconds, cost $0.75

# If you increase to 10 seconds, same cost!
RUNWAY_DURATION_SECONDS=10
```

**Benefit:** More content per dollar

---

## Cost Tracking Best Practices

### Weekly Review

Every Friday, check usage:

```bash
# Summary of this week's storyboards
find . -name "*-metrics.json" -mtime -7 -exec jq -c '{title, cost: (.imageMetrics.totalCost + .videoMetrics.totalCost)}' {} \;
```

### Monthly Budget Review

First day of month:

```bash
# Get last month's spending
./cost-report.sh  # See script above

# Compare to budget
# If >90% of budget: alert team to slow down
# If <50% of budget: can increase usage
```

### Quarterly Audit

Every 3 months:

1. Download usage reports from APIFRAME, Runway, OpenAI dashboards
2. Reconcile with storyboard metrics
3. Review billing to catch unexpected charges
4. Rotate API keys (see API_KEYS.md)

---

## Cost Alerts

### Set Up Email Alerts

#### APIFRAME

1. Log in to https://apiframe.pro
2. **Settings** → **Email Notifications**
3. Check "Monthly usage alert"
4. Set threshold (e.g., "Alert at 80% of budget")

#### Runway ML

1. Log in to https://app.runwayml.com
2. **Settings** → **Notifications**
3. Check "Usage alerts"
4. Set email address

---

## Troubleshooting Cost Issues

### ❌ "Cost is higher than expected"

**Cause:** Images/videos regenerated instead of cached

**Check:**
```bash
# List cache contents
ls -la cache/images/
ls -la cache/videos/

# If cache is empty, everything regenerates
```

**Solution:**
- Cache is 30 days by default
- To keep longer: manually back up `cache/` directory
- Or delete specific old cache files to preserve some

---

### ❌ "Unexpected charge on credit card"

**Cause:** Residual charges from test runs or API errors

**Check:**
1. Go to provider dashboard (APIFRAME, Runway, OpenAI)
2. Review transaction history
3. Look for failed API calls or retries
4. Report disputes to provider support

---

### ❌ "Cost per storyboard varies widely"

**Cause:** Different number of image/video slides per storyboard

**Check:**
```bash
cat my-storyboard-metrics.json | jq '{
  title,
  slides: .metadata.totalSlides,
  images: .imageMetrics.imagesGenerated,
  videos: .videoMetrics.videosGenerated,
  cost: (.imageMetrics.totalCost + .videoMetrics.totalCost)
}'
```

**Solution:**
- Standardize scripts to have consistent slide counts
- Or adjust image/video generation logic based on content

---

## Financial Planning

### Budget Calculation

```
Monthly budget = (storyboards × avg_cost_per_storyboard) × 1.2 (buffer)

Example:
- 20 storyboards/month × $1.50 = $30
- With 20% buffer: $30 × 1.2 = $36/month
```

### Cost Per Training Hour

Calculate true cost of video production:

```
Total monthly cost: $30
Total training minutes produced: 60 minutes (4 videos × 15 min avg)
Cost per minute: $30 / 60 = $0.50/minute
Cost per hour: $0.50 × 60 = $30/hour
```

Professional video production: typically $500–2,000/hour  
Storyboard skill production: $30/hour  
**Savings: 94–95%**

---

## FAQ

**Q: Why do costs vary between storyboards?**  
A: Number of image/video slides varies. More slides = more cost. Check metrics for details.

**Q: Can I reduce cost by using lower-quality images?**  
A: No. APIFRAME charges same for all quality levels. Use lower quality only if needed for your workflow.

**Q: Does caching really save money?**  
A: Yes. If you regenerate the same content, images from cache = no charge.

**Q: What if I accidentally generate too many storyboards?**  
A: Set spending limits (see above). Provider will stop charging before you hit hard limit.

**Q: Can I get a refund for test runs?**  
A: Contact provider support. Most are willing to credit test/accidental charges.

---

**Last updated:** 2026-05-29
