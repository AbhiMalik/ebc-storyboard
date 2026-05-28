---
name: storyboard
description: This skill should be used when the user provides a video script and wants to create a storyboard, generate a visual storyboard for a talking-head video, plan a lecture or explainer video, visualise shot types for a video shoot, or create a slide-by-slide shot plan. The skill produces a self-contained HTML file with two-column slides showing the audio script on the left and visual direction (instructor SVG or CSS animatic) on the right. Use this skill whenever the user mentions storyboard, video script, talking head, shot plan, lecture video, or wants to plan a video production.
version: 1.0.0
---

# Video Storyboard Generator

Turn a script into a production-ready HTML storyboard for a talking-head video.

## Output

A single self-contained HTML file saved as `storyboard.html` (or a name the user specifies) in the current directory. Open it in any browser — no server needed.

Each slide has:
- **Left column**: verbatim audio script
- **Right column**: an inline SVG instructor shot or a CSS-animated animatic
- **Slide header**: slide number, title, estimated duration, visual type
- **Slide footer**: director notes (camera, lighting, energy/animation)

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

## Director Notes Rules

Every instructor-shot slide:
- **Camera**: locked off / handheld / slow push-in (default: locked off, eye level)
- **Light**: key direction and fill (default: key left, soft fill right)
- **Energy**: one adjective + delivery instruction ("Direct, slow down on the key phrase")

Every animatic slide:
- **Animation**: timing style note
- **Timing**: how the graphic elements sync to the spoken words

---

## Step 4 — Report on Completion

After saving the file, output a brief summary:

```
Storyboard saved: storyboard.html
Slides: [N] total — [CU] close-up · [MS] medium · [WS] wide · [AN] animatics
Estimated run-time: ~[X:XX]
```
