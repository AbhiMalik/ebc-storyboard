# Storyboard Skill — API Key Management

Guide to securely obtaining, storing, and rotating API keys.

## Overview

The skill requires API keys for three services:

| Service | Purpose | Required | Cost |
|---------|---------|----------|------|
| **APIFRAME** | Midjourney images | ✅ Yes (or OpenAI) | $0.02–0.05 per image |
| **Runway ML** | B-roll video generation | ❌ Optional | $0.75 per video |
| **OpenAI** | DALL-E images (alternative) | ❌ Alternative to APIFRAME | $0.08 per image |

## Getting API Keys

### 1. Midjourney via APIFRAME (Recommended)

**Why:** Best quality images, lowest cost ($0.022/image)

**Steps:**
1. Go to https://apiframe.pro
2. Click "Sign Up"
3. Create account with email
4. Add payment method (credit card)
5. Go to Dashboard → API Keys
6. Copy your API key (starts with `afk_`)
7. Add to `.env`:
   ```
   MIDJOURNEY_API_KEY=afk_your_key_here
   MIDJOURNEY_PROVIDER=apiframe
   ```

**Cost:** ~$0.02–0.05 per image  
**Quality:** Excellent, photorealistic  
**Speed:** ~1–2 seconds per image

---

### 2. Runway ML (B-roll Videos)

**Why:** Generate realistic B-roll video from still images

**Steps:**
1. Go to https://app.runwayml.com
2. Click "Sign Up"
3. Create account
4. Verify email
5. Go to Settings → API Tokens
6. Click "Create API Token"
7. Copy token (starts with `key_`)
8. Add to `.env`:
   ```
   RUNWAY_ML_API_KEY=key_your_token_here
   ```

**Cost:** ~$0.75 per video (8-second clip)  
**Quality:** Photorealistic animation from still images  
**Speed:** 2–5 minutes per video

---

### 3. OpenAI DALL-E 3 (Alternative Images)

**Why:** Alternative if you prefer OpenAI over Midjourney

**Steps:**
1. Go to https://platform.openai.com/api/keys
2. Log in (create account if needed)
3. Click "+ Create new secret key"
4. Copy key (starts with `sk-proj-`)
5. Add to `.env`:
   ```
   OPENAI_API_KEY=sk-proj-your_key_here
   ```

**Cost:** ~$0.08 per image  
**Quality:** Good, professional  
**Speed:** ~3–5 seconds per image

⚠️ **Note:** DALL-E 3 was deprecated on 2026-03-04. Use Midjourney instead.

---

## Secure Storage

### The `.env` File

- **Location:** Root of storyboard skill directory
- **Format:** Plain text key=value pairs
- **Access:** Local machine only
- **Backup:** Never commit to git (in `.gitignore`)

### Best Practices

✅ **DO:**
- Store `.env` locally on each user's machine
- Use strong, unique API keys
- Rotate keys quarterly
- Set spending limits in each service's dashboard
- Monitor usage monthly

❌ **DON'T:**
- Commit `.env` to git/GitHub
- Share `.env` via email or chat
- Use the same key across multiple machines
- Leave old keys in `.env` after rotation
- Hardcode keys in code

---

## Rotating Keys (Quarterly)

### Midjourney (APIFRAME)

1. Log in to https://apiframe.pro
2. Go to Dashboard → API Keys
3. Click "Regenerate" on current key
4. Copy new key
5. Update `.env`:
   ```bash
   # Old line:
   MIDJOURNEY_API_KEY=afk_old_key_here
   # New line:
   MIDJOURNEY_API_KEY=afk_new_key_here
   ```
6. Test: `node storyboard-generator.js test.txt`
7. Verify success before deleting old key

### Runway ML

1. Log in to https://app.runwayml.com
2. Go to Settings → API Tokens
3. Click "Revoke" on old token
4. Click "Create API Token" for new one
5. Copy new token
6. Update `.env`:
   ```bash
   RUNWAY_ML_API_KEY=key_new_token_here
   ```
7. Test: `node storyboard-generator.js test.txt --video`

### OpenAI

1. Go to https://platform.openai.com/api/keys
2. Click ✕ next to old key to delete
3. Click "+ Create new secret key"
4. Copy new key
5. Update `.env`:
   ```bash
   OPENAI_API_KEY=sk-proj-new_key_here
   ```

---

## Cost Management

### Set Spending Limits

#### APIFRAME

1. Log in to https://apiframe.pro
2. Go to Billing
3. Set "Monthly Budget" limit
4. You'll be notified before hitting limit

#### Runway ML

1. Log in to https://app.runwayml.com
2. Go to Billing & Usage
3. Set "Monthly Spending Limit"
4. Notifications sent at 50%, 90%, 100%

#### OpenAI

1. Log in to https://platform.openai.com
2. Go to Billing → Usage limits
3. Set "Hard limit" (stops API calls when reached)
4. Set "Soft limit" (email notification)

---

## Monitoring Usage

### Weekly Check

```bash
# View costs from recent storyboards
ls -lt *-metrics.json | head -10
cat storyboard1-metrics.json | jq '{cost: .imageMetrics.totalCost + .videoMetrics.totalCost}'
```

### Monthly Report

**APIFRAME:**
1. Log in to https://apiframe.pro
2. Dashboard → Usage & Billing
3. View monthly spending

**Runway ML:**
1. Log in to https://app.runwayml.com
2. Settings → Billing & Usage
3. View API usage and charges

---

## Troubleshooting Key Issues

### ❌ "Invalid or expired token"

**Cause:** Key was revoked or expired

**Solution:**
1. Generate new key (see sections above)
2. Update `.env`
3. Test: `node storyboard-generator.js test.txt`

### ❌ "Insufficient credits"

**Cause:** Account balance is zero

**Solution:**
1. Log in to provider dashboard
2. Add payment method
3. Top up credits (minimum $5)
4. Wait 1–2 minutes for sync
5. Retry

### ❌ "Key works locally but not on another machine"

**Cause:** `.env` not copied to new machine

**Solution:**
1. Copy `.env` file to new machine's storyboard directory
2. Or create `.env` and add keys manually
3. Test: `node storyboard-generator.js test.txt`

---

## Key Formats Reference

### APIFRAME (Midjourney)

```
afk_7039e5b73a7db556c9979df7651306c37807a7da
```

Starts with `afk_`, followed by 40+ hex characters

### Runway ML

```
key_fc51ba19bfc54a5dd831cb7449ee40995ed45f6062a0a019dcd43b036fc1b2b7d02b6d1a931c21ede024bf78d55e6d1c73c29ab5f90e6aadf1196fe1f19fcf6c
```

Starts with `key_`, followed by long hex string

### OpenAI

```
sk-proj-K1a2B3c4D5e6F7g8H9i0j1k2l3m4n5o6p7q8r9s0t
```

Starts with `sk-proj-`, followed by alphanumeric characters

---

## FAQ

**Q: Can multiple team members share one API key?**  
A: Not recommended. Each person should have their own key for security & cost tracking. Sharing makes it impossible to know who generated what.

**Q: What if I accidentally commit `.env` to git?**  
A: Immediately revoke all keys on provider dashboards. Generate new keys. The old ones are compromised.

**Q: How do I know which key is being used?**  
A: Check `.env`: `grep MIDJOURNEY_API_KEY .env`. Or enable debug mode: `DEBUG=true node ...`

**Q: Can I use the same key on multiple computers?**  
A: Yes, but not recommended. If one computer is compromised, all are at risk.

**Q: Do I need all three API keys?**  
A: No. You need either APIFRAME or OpenAI for images. Runway is optional (for videos).

---

**Last updated:** 2026-05-29
