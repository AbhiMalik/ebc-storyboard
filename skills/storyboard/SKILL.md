---
name: storyboard
description: Professional AI-powered storyboard generator. Creates production-ready storyboards from training scripts with AI-generated images, B-roll videos, and detailed cinematography notes. Features 3-column professional layout, Midjourney image generation (Indian professionals), Runway ML B-roll video generation, detailed production specifications, and complete director notes. Use when providing a video script to create storyboards, plan video production, generate B-roll video content, or create training materials.
version: 2.0.0
---

# Professional AI Video Storyboard Generator

Transform training scripts into **cinema-grade storyboards** with AI-generated images, B-roll videos, and production-ready cinematography instructions.

## Output

Three types of files in your output directory:

### 1. **Professional Storyboard HTML** (`{name}.html`)
Interactive 3-column storyboard viewable in any browser:

**Left Column:** Audio Script
- Full verbatim dialogue
- Speaker labels
- Word counts
- Duration per slide

**Middle Column:** Visual Frame
- AI-generated B-roll videos (Runway ML) with embedded player
- Professional instructor shot SVGs
- Animated graphics (animatics)
- Shot badges and timestamps

**Right Column:** Production Notes
- Detailed camera & framing instructions
- Lighting specifications (key, fill, backlight, temperature)
- Performance & audio guidelines
- Video specifications (codec, resolution, FPS, duration)
- **AI image generation prompts** (for recreation/modification)
- Animation timing and transitions
- Color grading and visual treatment notes

### 2. **Video Files** (`{name}_videos/` folder)
- Individual MP4 B-roll video clips per slide
- Ready for video production or post-processing
- 1920×1080, H.264, 24fps

### 3. **Metrics Report** (`{name}-metrics.json`)
- Cost breakdown (images + videos)
- Generation timing per component
- Image/video count and specs
- Useful for budgeting and tracking

## Features

### 🎨 **AI Image Generation**
- **Midjourney** (via APIFRAME) for professional photorealistic images
- **Indian professional representation** — all characters are Indian professionals in authentic workplace scenarios
- Auto-generated prompts based on script content
- Images cached locally (30-day TTL) to save cost on regeneration

### 📹 **AI Video Generation**
- **Runway ML (gen4_turbo)** transforms still images into realistic B-roll video
- Natural camera movement and lighting transitions
- 1920×1080, 24fps, H.264 codec
- ~$0.75 per video, 2-5 minutes per generation
- Videos cached and organized in dedicated folder

### 📋 **Professional Storyboard Layout**
- **3-column design** — Script | Visuals | Production Notes
- Detailed cinematography instructions in right column
- AI image/video generation prompts included for reference
- Responsive design (adapts to tablet/mobile)
- Professional color scheme and typography

### 📊 **Complete Production Documentation**
- Camera setup (framing, focus, depth)
- Lighting specifications (key, fill, backlight, color temperature)
- Performance & audio guidelines
- Video codec and quality specs
- Animation timing and transitions
- Ready for handoff to production teams

## Workflow

1. **Parse script** → segment into slides at natural breakpoints
2. **Detect visual types** → auto-assign instructor shots or animatics
3. **Generate AI images** → Midjourney creates professional images
4. **Generate AI videos** → Runway ML converts images to B-roll video
5. **Create production notes** → detailed cinematography instructions per slide
6. **Build 3-column HTML** → professional storyboard with embedded media
7. **Organize files** → HTML + video folder + metrics report

---

## Step 1 — Parse the Script

Segment the script at natural breakpoints:

- Each distinct topic, concept, or rhetorical section
- Roughly every 15–30 seconds of speech (~40–80 words)
- At transitional phrases ("Now let's look at…", "In summary…", "The key point is…")

**Target:** 8–20 slides for a typical 3–8 min video.

Give each slide:
- A short title (4–6 words)
- An estimated duration (e.g. `~0:20`)

---

## Step 2 — Assign a Visual to Each Slide

### Instructor shot vs animatic

| Use an **instructor shot** when… | Use an **animatic** when… |
|----------------------------------|--------------------------|
| Opening or closing of the video | Listing 3+ key points |
| Direct address to the viewer | Introducing a topic/chapter |
| Motivational or emotional appeal | Explaining a process or flow |
| Transitional bridge between topics | Comparing two things |
| No graphic concept in the script | Script references a diagram, list, or quote |

### Instructor Shot Types

| Shot | Crop | Use for |
|------|------|---------|
| **Close-up** | Head fills ~70 % of frame | Key takeaway, direct personal message, opening hook, emotional moment |
| **Medium** | Head + torso to desk edge | General explanation, most content slides (the default) |
| **Wide** | Full figure + desk + environment | Introduction, sign-off, broad context setting |

**Default rule**: when in doubt, use medium shot.

### Animatic Types

| Type | Use for |
|------|---------|
| `bullet-reveal` | Listing key points (3–6 items) |
| `title-card` | Topic introduction, chapter marker, module header |
| `diagram` | Simple process with 2–3 connected boxes |
| `flowchart-linear` | Multi-step linear process (3–5 steps with start/end terminals) |
| `flowchart-decision` | Process with a decision point leading to two labelled outcomes |
| `quote` | Short definition, principle, or pull quote with left accent bar |
| `featured-quote` | Famous or impactful quotation — large, editorial, visually prominent |
| `legal-extract-statute` | Excerpt from a statutory provision (IPC, CPC, Constitution, etc.) with key phrase highlighted |
| `legal-extract-judgment` | Excerpt from a court judgment (SC/HC/Tribunal) with para reference and highlighted ratio |
| `split-screen` | Before/after, two options, or two contrasting concepts |
| `highlight` | Zooming in on one key idea with a supporting sub-label |
| `key-takeaways` | Numbered memorable summary — use at end of a topic or module |
| `video-summary` | End-of-video checklist of topics covered in the lesson |
| `lower-third` | Web reference, case citation, or URL overlaid on an instructor shot (not a standalone slide) |

**Note on `lower-third`:** This type is always used *together with* an instructor shot (medium or wide), never as a standalone animatic. It slides in from the bottom-left of the instructor frame. When you decide to use it, the `slide-vtype` label should read `[Shot Type] + Lower Third`, e.g. `Medium Shot + Lower Third`.

---

## Step 3 — Build the HTML File

Read the SVG templates from:
`${CLAUDE_PLUGIN_ROOT}/references/shot-svgs.md`

Read the animatic snippets from:
`${CLAUDE_PLUGIN_ROOT}/references/animatic-templates.md`

### Page-level HTML shell

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Video Title] — Storyboard</title>
  <style>
    [PASTE THE FULL CSS BLOCK BELOW]
  </style>
</head>
<body>
  <header class="sb-header">
    <h1 class="sb-title">[Video Title]</h1>
    <p class="sb-meta">[N] slides · Est. [total duration] · [Today's date]</p>
    <p class="sb-cue-legend">Inline <span class="anim-cue" style="pointer-events:none">cue label</span> badges mark the exact narration point at which the named graphic element should appear on screen.</p>
  </header>
  [slides…]
  <script>
    document.querySelectorAll('.frame-wrap').forEach(function(f){f._orig=f.innerHTML});
    function replaySlide(btn){var f=btn.closest('.slide').querySelector('.frame-wrap');if(f&&f._orig)f.innerHTML=f._orig}
  </script>
</body>
</html>
```

### CSS — paste this verbatim

```css
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:#f0f4f8;color:#1e293b;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;padding:2rem 1.5rem;min-height:100vh}
.sb-header{text-align:center;margin-bottom:2.5rem}
.sb-title{font-size:clamp(1.4rem,3vw,2rem);font-weight:700;color:#0f172a;letter-spacing:-.02em}
.sb-meta{color:#94a3b8;font-size:.8rem;margin-top:.4rem;letter-spacing:.05em;text-transform:uppercase}
.slide{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:auto 1fr auto;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:2rem;overflow:hidden;max-width:1100px;margin-inline:auto;box-shadow:0 1px 4px rgba(0,0,0,.07)}
.slide-header{grid-column:1/-1;background:#f1f5f9;padding:.6rem 1.2rem;display:flex;align-items:center;gap:.8rem;border-bottom:1px solid #e2e8f0}
.slide-num{font-size:.68rem;font-weight:800;color:#94a3b8;letter-spacing:.12em;text-transform:uppercase;min-width:4.5rem}
.slide-title-text{font-size:.85rem;font-weight:600;color:#334155}
.slide-duration{margin-left:auto;font-size:.72rem;color:#94a3b8;font-variant-numeric:tabular-nums}
.slide-vtype{font-size:.65rem;color:#64748b;background:#e2e8f0;border-radius:4px;padding:2px 8px;font-weight:700;text-transform:uppercase;letter-spacing:.06em}
.col-audio{padding:1.25rem 1.5rem;background:#ffffff;border-right:1px solid #e8edf4}
.col-visual{background:#f8fafc;display:flex;flex-direction:column;padding:1.25rem 1.5rem;gap:.75rem}
.col-label{font-size:.65rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#94a3b8;margin-bottom:.75rem;display:flex;align-items:center;gap:.5rem}
.col-label::before{content:'';display:block;width:3px;height:10px;background:currentColor;border-radius:2px}
.audio-text{font-size:.88rem;line-height:1.8;color:#475569}
.audio-text strong{color:#1e293b;font-weight:600}
.frame-wrap{position:relative;width:100%;aspect-ratio:16/9;border:1px solid #cbd5e1;border-radius:6px;overflow:hidden;background:#e8edf4}
.frame-wrap::before{content:'';position:absolute;inset:0;background:
  linear-gradient(135deg,#cbd5e1 5px,transparent 5px) 0 0/14px 14px no-repeat,
  linear-gradient(225deg,#cbd5e1 5px,transparent 5px) 100% 0/14px 14px no-repeat,
  linear-gradient(315deg,#cbd5e1 5px,transparent 5px) 0 100%/14px 14px no-repeat,
  linear-gradient(45deg,#cbd5e1 5px,transparent 5px) 100% 100%/14px 14px no-repeat;
  z-index:5;pointer-events:none}
.frame-wrap > svg{width:100%;height:100%;display:block}
.shot-badge{position:absolute;bottom:8px;left:8px;background:rgba(255,255,255,.9);color:#475569;font-size:.6rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:3px 7px;border-radius:3px;z-index:10;border:1px solid #e2e8f0}
.dir-note{font-size:.72rem;color:#94a3b8;line-height:1.5}
.dir-note strong{color:#64748b}
.slide-footer{grid-column:1/-1;background:#f8fafc;border-top:1px solid #e2e8f0;padding:.5rem 1.2rem;display:flex;gap:2rem;flex-wrap:wrap}
.footer-item{font-size:.7rem;color:#94a3b8}
.footer-item span{color:#64748b;font-weight:600}
.anim-cue{display:inline-flex;align-items:center;background:rgba(59,130,246,.07);border:1px solid rgba(59,130,246,.2);color:#3b82f6;font-size:.57rem;font-weight:700;padding:.08rem .38rem .08rem .26rem;border-radius:3px;letter-spacing:.02em;vertical-align:middle;white-space:nowrap;margin:0 3px;font-style:normal;line-height:1.5;user-select:none}
.anim-cue::before{content:'▶';font-size:.44rem;margin-right:.22rem;opacity:.6}
.sb-cue-legend{color:#94a3b8;font-size:.7rem;margin-top:.55rem;text-align:center}
.replay-btn{background:none;border:1px solid #e2e8f0;border-radius:4px;padding:.18rem .5rem;font-size:.65rem;font-weight:700;color:#94a3b8;cursor:pointer;letter-spacing:.04em;display:flex;align-items:center;gap:.25rem;margin-left:.5rem;transition:color .15s,border-color .15s,background .15s;font-family:inherit}
.replay-btn:hover{color:#3b82f6;border-color:#bfdbfe;background:#eff6ff}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes scaleIn{from{opacity:0;transform:scaleX(0)}to{opacity:1;transform:scaleX(1)}}
@keyframes boxPop{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}
@keyframes slideInLT{from{transform:translateX(-105%)}to{transform:translateX(0)}}
```

### Slide HTML pattern — instructor shot

```html
<div class="slide">
  <div class="slide-header">
    <span class="slide-num">Slide 01</span>
    <span class="slide-title-text">Welcome &amp; Introduction</span>
    <span class="slide-vtype">Wide Shot</span>
    <span class="slide-duration">~0:20</span>
    <button class="replay-btn" onclick="replaySlide(this)">↺ Replay</button>
  </div>
  <div class="col-audio">
    <div class="col-label">Audio Script</div>
    <p class="audio-text">Script text here.</p>
  </div>
  <div class="col-visual">
    <div class="col-label">Visual</div>
    <div class="frame-wrap">
      <!-- PASTE the appropriate SVG from shot-svgs.md here -->
      <span class="shot-badge">Wide Shot</span>
    </div>
    <p class="dir-note"><strong>Camera:</strong> Eye level, locked off &nbsp;·&nbsp; <strong>Light:</strong> Key left, fill right &nbsp;·&nbsp; <strong>Energy:</strong> Warm, welcoming</p>
  </div>
  <div class="slide-footer">
    <span class="footer-item"><span>Duration:</span> ~20s</span>
    <span class="footer-item"><span>Transition:</span> Cut to next</span>
    <span class="footer-item"><span>B-roll:</span> None</span>
  </div>
</div>
```

### Slide HTML pattern — animatic

```html
<div class="slide">
  <div class="slide-header">
    <span class="slide-num">Slide 03</span>
    <span class="slide-title-text">Three Core Principles</span>
    <span class="slide-vtype">Animatic: Bullet Reveal</span>
    <span class="slide-duration">~0:35</span>
    <button class="replay-btn" onclick="replaySlide(this)">↺ Replay</button>
  </div>
  <div class="col-audio">
    <div class="col-label">Audio Script</div>
    <p class="audio-text">Script text here.</p>
  </div>
  <div class="col-visual">
    <div class="col-label">Visual</div>
    <div class="frame-wrap">
      <!-- PASTE the animatic snippet from animatic-templates.md, filling in the content -->
    </div>
    <p class="dir-note"><strong>Animation:</strong> Staggered fade-up, 0.35s per item &nbsp;·&nbsp; <strong>Timing:</strong> Each point on its verbal cue</p>
  </div>
  <div class="slide-footer">
    <span class="footer-item"><span>Duration:</span> ~35s</span>
    <span class="footer-item"><span>Transition:</span> Cut</span>
  </div>
</div>
```

---

## Director Notes Rules — Professional Grade

### Instructor Shot Specifications

Every instructor-shot slide must include:

**Camera:**
- Frame type (locked off / handheld / slow push / pan)
- Height (eye level / down shot / low angle)
- Framing (rule of thirds placement, headroom, look space)
- Depth of field (shallow f/2.8, medium f/5.6, or deep f/11)
- Focal length reference if applicable (standard lens, 50mm equivalent)
- Example: `Locked tripod, eye level, rule-of-thirds right placement, shallow DOF (f/2.8), soft on background`

**Light:**
- Key light angle and intensity (e.g., "45° left, 3-stop ratio")
- Fill light placement and strength
- Back light / rim light if used
- Colour temperature if needed (5600K daylight, 3200K tungsten, etc.)
- Example: `Key left 45° (5600K), fill right 2-stop reduction, no rim light`

**Talent Direction:**
- Eyeline (direct camera, down at notes, toward co-speaker)
- Facial expression (neutral, concerned, confident, authoritative)
- Hand/body placement (hands resting, gesturing to emphasise, on desk)
- Delivery pace (normal, deliberate, energetic)
- Pause points and emotional beats
- Example: `Eyeline direct to camera, expression shifts from neutral to concerned at "I felt uncomfortable," hands resting on desk throughout`

**Blocking Notes:**
- Position in frame relative to background elements
- Continuity with previous/next slide (same outfit, desk, position)
- Props visible and their placement
- Example: `Centre-frame, bookshelf visible left background, same blue jacket as Slide 1, laptop bottom-left corner`

**Full example director note:**
```
SCENE: INT. OFFICE — DAY | TALENT: Chairperson (neutral) → concerned
CAMERA: Locked tripod, eye level, subject on right third, shallow DOF (f/2.8)
LIGHT: Key 45° left (5600K), fill 2-stop right, no rim light
BLOCKING: Seated at desk, hands resting, bookshelf visible left background
TALENT: Neutral expression (0:00–0:15), shifts to concerned on "I felt uncomfortable" (0:16–0:45)
DELIVERY: Measured pace, deliberate emphasis on "uncomfortable," brief pause after
CONTINUITY: Same blue jacket as Slide 1, same desk position
```

### Animatic Specifications

Every animatic slide must include:

**Animation Details:**
- Animation type (fade-up, slide-in, scale, etc.) per element
- Duration per element (e.g., "0.4s fade-up")
- Delay timing (exact millisecond cue when each element appears)
- Easing curve (ease, ease-in, ease-out, cubic-bezier, etc.)
- Example: `Item 1: 0.4s fade-up, delay 0.2s, ease · Item 2: 0.4s fade-up, delay 0.6s, ease`

**Synchronisation:**
- Exact timing for each graphic cue (word count / speaking rate → ms)
- Pause integration (how long element holds on screen before exit)
- Transition between items (instant cut, fade, crossfade)
- Example: `Cue 1 at 1.2s (first sentence ends), hold 2.8s, exit fade at 4.0s`

**Text & Graphic Specs:**
- Font family, weight, size, tracking (e.g., "Inter Bold, 18pt, +0.05em tracking")
- Colour and opacity (e.g., "#1e293b, 100% opacity")
- Alignment (left, centre, right, justified)
- Accent/highlight specs (colour, duration, animation)
- Example: `Bullet text: Inter 400, 14pt, line-height 1.5, #475569 · Bold keys: Inter 600, same size, #2563eb`

**Spatial Layout:**
- Safe title area (keep text within 80% frame width)
- Vertical spacing and alignment
- Padding/margins from frame edges
- Example: `Safe area: 40px left/right margins, centre-aligned, 12px vertical spacing between bullets`

**Full example animatic director note:**
```
TYPE: Bullet-Reveal | DURATION: 0.45s total
ANIMATION: Staggered fade-up per bullet (0.4s duration, ease)
TIMINGS: 
  · Bullet 1: Cue @ 0:05 (1.2s), delay 0.2s, hold 4.2s, exit fade 0.3s @ 4.7s
  · Bullet 2: Cue @ 0:15 (3.6s), delay 0.6s, hold 3.8s, exit fade 0.3s @ 5.1s
  · Bullet 3: Cue @ 0:25 (6.0s), delay 1.0s, hold 3.4s, exit fade 0.3s @ 5.5s
TEXT: Inter 400, 14pt, #475569, line-height 1.5 · Bold keys: Inter 600, #2563eb
SAFE AREA: 80% frame width, 40px margins, centre-aligned
ACCENT: Blue bullet (3b82f6) appears at same time as text (no delay)
```

---

## Step 3b — Script Markup (Professional)

Enhance the script in the audio column with production-ready markup:

### Speaker Labels
Identify all speakers clearly:
```
NARRATOR: "In many workplace situations..."
CHAIRPERSON: "Colleague A said I looked beautiful..."
MEMBER 1: "We need to understand: Was this..."
```

### Timing & Word Counts
Convert rough durations to precise word counts:
```
NARRATOR: [48 words @ 150 WPM = 19s]
"In many workplace situations, colleagues exchange polite compliments. But under the POSH Act, when does a compliment become unwelcome behaviour amounting to sexual harassment? This video breaks down a very common scenario."
```

### Emphasis & Delivery
Mark key phrases for talent direction:
```
NARRATOR: "The immediate answer is: **Not necessarily.**" [beat, 1s pause]
```

### Sync Cues
Mark exact millisecond cues for animation triggers:
```
NARRATOR: "A compliment becomes harassment when it carries: <@1200ms>sexual intention</>, <@1600ms>unwelcome nature</>, or <@2000ms>forms a pattern</>"
```

### Pauses & Beats
Explicit silence points:
```
CHAIRPERSON: "Colleague A said I looked beautiful and confident. I felt uncomfortable." [2s beat]
```

---

## Step 4 — Production Specifications

Add a **Production Notes** section at the top of the storyboard HTML header:

```html
<div class="prod-notes">
  <h2>Production Specifications</h2>
  <dl>
    <dt>Format:</dt><dd>1920×1080 (16:9, broadcast standard)</dd>
    <dt>Frame Rate:</dt><dd>24fps (cinema) or 29.97fps (NTSC broadcast)</dd>
    <dt>Colour Space:</dt><dd>Rec. 709 (HD standard) / Rec. 2020 (4K if applicable)</dd>
    <dt>Audio Spec:</dt><dd>Stereo 48kHz, -23 LUFS (broadcast standard)</dd>
    <dt>Safe Areas:</dt><dd>Action: 90%, Title: 80% (broadcast safe)</dd>
    <dt>Talent Required:</dt><dd>1 on-camera (Chairperson role), voice actors for 2 ICC members</dd>
    <dt>Location:</dt><dd>INT. OFFICE — Professional office with desk, bookshelf, plant (see Slide 1 blocking)</dd>
    <dt>Equipment:</dt><dd>Single camera, tripod-locked, no movement</dd>
    <dt>Lighting Kit:</dt><dd>3-point standard (key 45°, fill, back light setup)</dd>
    <dt>Delivery Format:</dt><dd>H.264 MP4 (ProRes 422 HQ for archive)</dd>
    <dt>Captions:</dt><dd>Burnt-in SRT at bottom 15% safe area, white 16pt sans-serif</dd>
  </dl>
</div>
```

---

## Step 5 — Audio & Synchronisation

For each slide, specify:

**Music & SFX:**
- Music bed timing: "Enters at 0:00, swells at 0:45 (key point), exits at 4:20"
- Sound effects: "Subtle pen-click SFX when Chairperson opens briefing (Slide 6, 0:32)"
- Silence cues: "2-second silent beat after 'Not necessarily' for emphasis (Slide 3, 0:18–0:20)"

**Voice-Over Sync:**
- Exact sync points for VO changes (Narrator → Chairperson → Panel)
- Overlap points if any (fade between speakers)

**Example:**
```
Slide 5:
AUDIO SPEC: Narrator VO + Bullet animations synced
Music: Neutral 140 bpm bed (low, backing only), enters at 0:00, ducks at each cue, holds throughout
VO Sync: Cue 1 @ 1.2s, Cue 2 @ 3.6s, Cue 3 @ 6.0s (hard cuts, no overlap)
```

---

## Step 6 — Accessibility & Compliance

Include in header or footer:

**Closed Captions:**
- Time code + speaker + caption text
- Example: `[00:05–00:12] NARRATOR: "In many workplace situations, colleagues exchange polite compliments."`

**Audio Description Notes:**
- For visuals without dialogue, add descriptive captions
- Example: `[VISUAL ONLY] Close-up on speaker's face, concerned expression, hands resting on desk`

**Compliance Markers:**
- Training module standard (e.g., "EBC Training Module v2.1")
- Accessibility level (e.g., "WCAG AA compliant")
- Legal/regulatory context (e.g., "POSH Act training module")

**Example footer:**
```html
<footer class="compliance-footer">
  <p><strong>Accessibility:</strong> WCAG AA compliant · Captions included · Audio description available</p>
  <p><strong>Standards:</strong> EBC Training Module v2.1 · POSH Act 2013 compliant</p>
  <p><strong>Produced:</strong> 29 May 2026 · Last updated: [date]</p>
</footer>
```

---

## Step 7 — Visual Design System

Include specs for consistent styling:

**Colour Palette:**
```
Primary: #3b82f6 (blue, informational)
Accent: #f59e0b (amber, caution/legal)
Success: #10b981 (green, acceptable)
Alert: #ef4444 (red, violation/concern)
Text Primary: #1e293b (dark slate)
Text Secondary: #64748b (medium slate)
Background: #f8fafc (light slate)
```

**Typography System:**
```
Display: Inter 700, 28pt, tracking -0.02em (slide titles)
Heading: Inter 600, 18pt, tracking 0em (section heads)
Body: Inter 400, 14pt, line-height 1.5 (narrative text)
Label: Inter 700, 11pt, tracking 0.12em, uppercase (UI labels)
Caption: Inter 400, 12pt, line-height 1.4 (captions, notes)
```

**Spacing & Layout:**
```
Gutter: 16px (slide content spacing)
Safe margin: 40px (from frame edges)
Line-height: 1.5 base (readability), 1.2 for titles
Padding: 12px vertical per item (bullets, list rows)
```

---

## Step 3b — Generate & Integrate SVG Visuals (Direct Embedding)

**Visuals are created as embedded SVG code directly in the HTML template.**

### Direct SVG Integration Approach

Instead of a multi-agent workflow, create SVGs directly and embed them into the HTML structure:

1. **For each slide**, generate an SVG graphic matching the assigned visual type
2. **Embed the SVG code directly** into the `<div class="frame-wrap">` element
3. **Use consistent design** across all instructor shots (same character, outfit, setting)
4. **Add annotations** in director notes about SVG visual specifications

### SVG Specifications by Visual Type

**Instructor Shot SVG Template:**
```
- ViewBox: 0 0 400 225 (standard 16:9 ratio)
- Character: Consistent design with hair colour, skin tone, professional outfit
- Setting: Office background (bookshelf, desk, plant, windows)
- Shot Types:
  • Wide: Full figure (head to feet), seated or standing, arms visible
  • Medium: Head + torso to desk edge, hands visible, approachable
  • Close-up: Head fills ~70% of frame, shoulders only, intimate
- Expressions: Neutral, concerned, confident, authoritative, warm, measured
```

**B-roll Scenario SVG Template:**
```
- ViewBox: 0 0 600 400 (wider for two-character scenes)
- Characters: 2–4 figures with professional dress and diverse appearance
- Setting: Office environment (desk, conference table, windows, props)
- Scenarios:
  • Compliment: Neutral, professional interaction
  • Discussion: ICC panel seated at table with multiple speakers
  • Positive: Open body language, smiling, handshake
  • Uncomfortable: Defensive posture, crossed arms, backing away
- Visual Contrast: Use body language and colour cues to show tone
```

**Animatic SVG Template:**
```
- ViewBox: 0 0 400–450 300–320 (flexible for content)
- Background: Light blue #f4f7fb or relevant colour
- Text: Inter font family, appropriate sizes and weights
- Bullets/Items: Circles or custom icons (3–6 items)
- Accents: Blue #3b82f6 (info), Amber #f59e0b (legal), Red #ef4444 (alert), Green #10b981 (positive)
- Animation Notes: Include text annotations within SVG showing timing (e.g., "0.4s fade-up, 0.2s delay")
```

### SVG Generation Best Practices

1. **Consistent Character Design**: Use the same hair colour, skin tone, and outfit across all presenter shots
2. **Professional Office Setting**: Include desk, bookshelf, plant, windows for depth and context
3. **Body Language as Communication**: Use posture, hand placement, and facial expressions to reinforce message
4. **Colour Coding**: Use green for positive scenarios, red for concerning, blue for neutral/informational
5. **Accessibility**: Ensure sufficient colour contrast (WCAG AA) in all graphics
6. **ViewBox Consistency**: Maintain 16:9 aspect ratio for all slides

### Integration Checklist

Verify:
- ✅ Each slide has an SVG graphic in the `<div class="frame-wrap">` element
- ✅ SVG viewBox maintains 16:9 aspect ratio (e.g., 0 0 400 225)
- ✅ Presenter character is consistent across all instructor shots (same hair, outfit, setting)
- ✅ B-roll scenarios show clear visual contrast (positive vs uncomfortable body language)
- ✅ Animatic placeholders include timing annotations
- ✅ All text is readable with good contrast
- ✅ HTML renders without console errors
- ✅ Shot badges match the visual type label
- ✅ Director notes reference the SVG design approach

---

## Step 4 — Report on Completion

After saving the file, output a detailed summary:

```
Storyboard saved: storyboard.html

SLIDES: [N] total — [WS] wide shots · [MS] medium shots · [CU] close-up shots · [AN] animatics
VISUALS: [X] instructor shots (SVG embedded) · [Y] B-roll scenes (SVG mockups) · [Z] animatic layouts (SVG)
ESTIMATED RUN-TIME: ~[MM:SS]
WORD COUNT: [N] words @ 150 WPM average

PRODUCTION SPEC:
  Format: 1920×1080, 24fps, Rec. 709
  Talent: 1 on-camera presenter + voice-over roles
  Location: Office environment
  Lighting: 3-point standard setup
  Audio: Presenter VO + music bed + SFX cues

VISUAL ASSETS:
  Instructor Shots (consistent character across all):
    - Professional office setting (bookshelf, desk, plant, windows)
    - Hair: [Colour], Skin: [Tone], Outfit: [Description]
    - Shot types: wide (full figure), medium (head+torso), close-up (head only)
    - Expressions: [List relevant expressions per slide]
  
  B-roll Scenarios (SVG mockups for stock footage):
    - [Scene 1]: [Description and body language]
    - [Scene 2]: [Description and body language]
    - [Scene 3]: [Description with visual contrast]
  
  Animatic Layouts (motion graphics):
    - [Slide N]: [Type] — [Items/bullets] with animation timing
    - [Slide M]: [Type] — [Items/bullets] with animation timing

ACCESSIBILITY:
  ✓ All dialogue captured in script
  ✓ Visual descriptions in director notes
  ✓ Colour contrast: WCAG AA compliant
  ✓ SVG Visuals: Inline graphics, no external dependencies
  ✓ Duration: [MM:SS] (within standard training session)

PRODUCTION STATUS:
  ✓ All visuals embedded as SVG code
  ✓ Consistent character design across presenter shots
  ✓ Clear visual contrast between scenarios
  ✓ Animation timing and specifications documented
  ✓ Ready for director/producer review
  ✓ Ready for stock B-roll replacement (SVG mockups show intended framing/composition)

---

## Usage Guide

### Command Line

```bash
# Generate HTML storyboard only
node storyboard-generator.js your-script.txt --output "Module Name"

# Generate storyboard WITH AI images and B-roll videos
node storyboard-generator.js your-script.txt --video --output "Module Name"

# Generate without image generation (use placeholders)
node storyboard-generator.js your-script.txt --no-images --output "Module Name"
```

### Setup Requirements

1. **Midjourney API Key** (for images)
   - Get from: https://apiframe.pro
   - Add to `.env` file: `MIDJOURNEY_API_KEY=afk_xxxxx`

2. **Runway ML API Key** (for B-roll videos)
   - Get from: https://app.runwayml.com
   - Add to `.env` file: `RUNWAY_ML_API_KEY=key_xxxxx`

### Output Files

Running the skill generates:

```
your-project/
├── Module Name.html              # Professional 3-column storyboard
├── Module Name-metrics.json       # Cost & timing report
└── Module Name_videos/            # Video files
    ├── slide_1_*.mp4
    ├── slide_2_*.mp4
    └── ...
```

### What You Get Automatically

✅ **3-Column Professional Layout**
- Audio script (left)
- Visual frame with embedded videos (middle)
- Detailed production notes (right)

✅ **AI-Generated Images & Videos**
- Midjourney images featuring Indian professionals
- Runway ML B-roll video from images
- Auto-organized in dedicated video folder

✅ **Detailed Production Instructions**
- Camera framing and positioning
- Lighting specs (key, fill, backlight, color temp)
- Performance & audio guidelines
- Video codec specifications
- **AI image generation prompts** for reference/recreation
- Animation timing and transitions
- Color grading notes

✅ **Production-Ready Artifacts**
- Self-contained HTML (no server needed)
- Embedded video players (play/pause/fullscreen)
- Responsive design (desktop/tablet/mobile)
- Cost breakdown and metrics

### Cost & Timeline

| Component | Time | Cost |
|-----------|------|------|
| Parse & plan | ~10s | Free |
| Midjourney images (2-4) | ~1-2 min | $0.04-0.09 |
| Runway ML videos (2-4) | ~3-5 min | $1.50-3.00 |
| HTML assembly | ~10s | Free |
| **Total per storyboard** | **~5-7 min** | **~$1.54-3.09** |

### Customization

The skill automatically:
- ✅ Detects visual type (instructor vs animatic)
- ✅ Generates image prompts with Indian professionals
- ✅ Creates video frames from images
- ✅ Generates detailed cinematography notes
- ✅ Organizes all files in output folder

No manual intervention needed!
```
