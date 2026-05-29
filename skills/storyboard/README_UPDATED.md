# 🎬 Storyboard Skill v2.0 — Professional AI Storyboard Generator

**Transform training scripts into cinema-grade storyboards with AI-generated images, B-roll videos, and detailed production instructions — all automatically.**

---

## ⭐ What's New in v2.0

### Professional 3-Column Layout
```
┌────────────────────────────────────────────────────┐
│  Script (Left)  │  Visual (Middle)  │  Notes (Right)
├────────────────────────────────────────────────────┤
│ Audio dialogue  │ Video/Image/SVG   │ • Camera setup
│                 │ graphics          │ • Lighting specs
│                 │ 16:9 frame        │ • Performance guide
│                 │ Embedded controls │ • Audio specs
│                 │                   │ • AI prompts
└────────────────────────────────────────────────────┘
```

### AI-Powered Generation
- ✅ **Midjourney images** with Indian professionals
- ✅ **Runway ML B-roll videos** from images
- ✅ **Automatic production notes** with full technical specs
- ✅ **AI prompts included** for reference/recreation

---

## 🚀 Quick Start

### Installation (One-Time)
```bash
# 1. Get API keys
#    - Midjourney: https://apiframe.pro
#    - Runway ML: https://app.runwayml.com

# 2. Create .env file
cp examples/.env.example .env

# 3. Add your API keys
MIDJOURNEY_API_KEY=afk_xxxxx
RUNWAY_ML_API_KEY=key_xxxxx
```

### Generate Storyboard
```bash
# Generate with AI images + videos
node storyboard-generator.js your-script.txt --video --output "Module Name"

# Output:
# ✓ Module Name.html (open in browser)
# ✓ Module Name_videos/ (MP4 files)
# ✓ Module Name-metrics.json (cost report)
```

---

## 📋 Features

### Automatic Script Processing
- Intelligently segments script into slides
- Detects visual types (instructor vs animatic vs video)
- Estimates speaking time
- Generates image/video prompts automatically

### AI Image Generation
- **Midjourney** via APIFRAME v2
- Professional photography style
- **Indian professionals** featured in all images
- Automatic prompt generation
- Local caching (30-day TTL)
- Cost: $0.022 per image

### AI Video Generation
- **Runway ML gen4_turbo** B-roll generation
- Transform images to realistic video
- 1920×1080, 24fps, H.264
- Embedded video players in HTML
- Cost: $0.75 per video
- Time: 3-5 minutes per video

### Professional Storyboard HTML
- **3-column layout** (Script | Visual | Production Notes)
- **Embedded videos** with play/pause/fullscreen
- **Responsive design** (desktop/tablet/mobile)
- **Self-contained** (no server needed)
- Professional styling and typography

### Detailed Production Notes
Automatically generated for each slide:
- **Camera:** Framing, positioning, focus depth
- **Lighting:** Key, fill, backlight, color temperature
- **Performance:** Energy level, pace, emotional tone
- **Audio:** Mic type, noise guidelines
- **Video Specs:** Codec, resolution, FPS, duration
- **AI Prompts:** Original Midjourney prompt for reference
- **Animation:** Entry, emphasis, transitions, timing

---

## 📊 Performance & Costs

| Component | Time | Cost |
|-----------|------|------|
| Parse & plan | ~10s | Free |
| AI images (2-4) | 1-2 min | $0.04-0.09 |
| AI videos (2-4) | 3-5 min | $1.50-3.00 |
| HTML assembly | ~10s | Free |
| **Total per storyboard** | **5-7 min** | **$1.54-3.09** |

---

## 📁 Output Files

```
Your Project/
├── Module Name.html              ← Open in browser
├── Module Name-metrics.json       ← Cost & timing
└── Module Name_videos/
    ├── slide_1_timestamp.mp4     ← MP4 videos
    ├── slide_2_timestamp.mp4
    └── ...
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **QUICKSTART.md** | 5-minute setup & usage |
| **SETUP_GUIDE.md** | Detailed first-time setup |
| **FEATURES.md** | Features overview |
| **TROUBLESHOOTING.md** | Common issues & solutions |
| **API_KEYS.md** | Credential management |
| **COST_TRACKING.md** | Budget monitoring |
| **VERSION_2_SUMMARY.md** | Complete package overview |

---

## 🎯 Use Cases

Perfect for:
- ✅ Corporate training modules
- ✅ Compliance training (POSH, HR, etc.)
- ✅ Product explainer videos
- ✅ Internal procedures
- ✅ Educational content
- ✅ Professional video planning

---

## ✨ Key Improvements in v2.0

| Feature | v1.0 | v2.0 |
|---------|------|------|
| Layout | 2-column | **3-column** |
| Images | SVG only | **AI-generated** |
| Videos | None | **AI B-roll** |
| Production Notes | Basic footer | **Detailed right column** |
| Cinematography | Minimal | **Professional specs** |
| AI Prompts | None | **Included & visible** |
| Professional Grade | ⭐⭐ | **⭐⭐⭐⭐⭐** |

---

## 🔧 Requirements

- Node.js 14+
- API keys:
  - **Midjourney:** https://apiframe.pro
  - **Runway ML:** https://app.runwayml.com
- Internet connection
- ~50MB disk space for cache

---

## 💡 Workflow

```
Your Script
    ↓
[1] Parse into slides (~10s)
    ↓
[2] Generate AI images (Midjourney) (~1-2 min)
    ↓
[3] Generate AI videos (Runway ML) (~3-5 min)
    ↓
[4] Create production notes (auto)
    ↓
[5] Build 3-column HTML storyboard
    ↓
[6] Organize videos in output folder
    ↓
Output: Professional storyboard + videos
```

---

## 🎬 What You Get

✅ **Professional Storyboard**
- 3-column cinema-grade layout
- Embedded video players
- Detailed production instructions
- Ready for production teams

✅ **AI-Generated Assets**
- Midjourney images (Indian professionals)
- Runway ML B-roll videos
- Professional quality
- Automatic prompts included

✅ **Complete Documentation**
- Camera setup instructions
- Lighting specifications
- Performance guidelines
- Audio requirements
- Animation timing
- Original AI prompts

✅ **File Organization**
- HTML storyboard (easy to share)
- Video folder (organized by slide)
- Metrics report (for budgeting)

---

## 📖 Getting Started

1. **Read:** `QUICKSTART.md` (5 minutes)
2. **Setup:** `SETUP_GUIDE.md` (10 minutes)
3. **Run:** `node storyboard-generator.js your-script.txt --video --output "My Module"`
4. **Open:** `My Module.html` in browser
5. **Share:** Zip up `My Module.html` + `My Module_videos/` folder

---

## ✅ Status

**Version:** 2.0.0  
**Status:** Production Ready ✅  
**Testing:** Complete with real training scripts  
**Documentation:** Comprehensive  
**Performance:** 5-7 minutes per storyboard  
**Quality:** Professional cinema-grade  

---

## 🚀 Ready to Use

Everything is set up and ready to go. Just:
1. Add your API keys to `.env`
2. Run the command
3. Get professional storyboards automatically

No manual work. Fully automated. Production-ready output.

**Happy storyboarding! 🎬**
