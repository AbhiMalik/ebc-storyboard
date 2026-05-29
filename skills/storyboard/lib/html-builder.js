const fs = require('fs');
const path = require('path');

class HTMLBuilder {
  constructor(references) {
    this.references = references || {};
    this.shotSVGs = this.loadShotSVGs();
    this.animatics = this.loadAnimatics();
  }

  loadShotSVGs() {
    try {
      const svgPath = path.join(__dirname, '../references/shot-svgs.md');
      if (fs.existsSync(svgPath)) {
        return fs.readFileSync(svgPath, 'utf-8');
      }
    } catch (e) {
      console.warn('Could not load shot SVGs');
    }
    return '';
  }

  loadAnimatics() {
    try {
      const animPath = path.join(__dirname, '../references/animatic-templates.md');
      if (fs.existsSync(animPath)) {
        return fs.readFileSync(animPath, 'utf-8');
      }
    } catch (e) {
      console.warn('Could not load animatic templates');
    }
    return '';
  }

  extractSVGByType(shotType) {
    const patterns = {
      'wide': /## Wide Shot[\s\S]*?<svg[\s\S]*?<\/svg>/i,
      'medium': /## Medium Shot[\s\S]*?<svg[\s\S]*?<\/svg>/i,
      'close-up': /## Close-up Shot[\s\S]*?<svg[\s\S]*?<\/svg>/i,
    };

    const pattern = patterns[shotType?.toLowerCase()] || patterns.medium;
    const match = this.shotSVGs.match(pattern);
    return match ? match[0].replace(/^##.*\n/, '').replace(/```html\n/, '').replace(/\n```/, '') : this.getPlaceholderSVG(shotType);
  }

  getPlaceholderSVG(shotType = 'medium') {
    return `<svg viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
  <rect width="1920" height="1080" fill="#f8fafc"/>
  <text x="960" y="540" font-size="32" text-anchor="middle" fill="#94a3b8">
    ${shotType.charAt(0).toUpperCase() + shotType.slice(1)} Shot (SVG)
  </text>
</svg>`;
  }

  extractAnimaticByType(animType) {
    const patterns = {
      'bullet-reveal': /## bullet-reveal[\s\S]*?(?=##[^#]|$)/i,
      'title-card': /## title-card[\s\S]*?(?=##[^#]|$)/i,
      'flowchart-linear': /## flowchart-linear[\s\S]*?(?=##[^#]|$)/i,
      'split-screen': /## split-screen[\s\S]*?(?=##[^#]|$)/i,
      'quote': /## quote[\s\S]*?(?=##[^#]|$)/i,
      'featured-quote': /## featured-quote[\s\S]*?(?=##[^#]|$)/i,
      'legal-extract-statute': /## legal-extract-statute[\s\S]*?(?=##[^#]|$)/i,
      'legal-extract-judgment': /## legal-extract-judgment[\s\S]*?(?=##[^#]|$)/i,
      'key-takeaways': /## key-takeaways[\s\S]*?(?=##[^#]|$)/i,
    };

    const pattern = patterns[animType?.toLowerCase()] || patterns['bullet-reveal'];
    const match = this.animatics.match(pattern);
    return match ? match[0].replace(/^##.*\n/, '').replace(/```html\n/g, '').replace(/\n```/g, '') : this.getPlaceholderAnimatic(animType);
  }

  getPlaceholderAnimatic(animType = 'bullet-reveal') {
    return `<svg viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
  <rect width="1920" height="1080" fill="#f8fafc"/>
  <text x="960" y="540" font-size="32" text-anchor="middle" fill="#94a3b8">
    ${animType} Animation
  </text>
</svg>`;
  }

  buildImageFrame(imageData) {
    if (!imageData || imageData.type === 'placeholder') {
      return this.getPlaceholderAnimatic('image');
    }

    if (imageData.type === 'video' && imageData.filepath) {
      const videoPath = path.relative(process.cwd(), imageData.filepath);
      return `<video controls style="width:100%;height:100%;object-fit:cover;" controlsList="nodownload">
  <source src="${videoPath}" type="video/mp4">
  Your browser does not support the video tag.
</video>`;
    }

    if (imageData.filepath) {
      const imagePath = path.relative(process.cwd(), imageData.filepath);
      return `<img src="${imagePath}" alt="Generated slide image" style="width:100%;height:100%;object-fit:cover;">`;
    }

    return this.getPlaceholderAnimatic('image');
  }

  buildSlideHTML(slide, imageData) {
    let visual = '';
    let visualLabel = 'Animatic';

    if (slide.visualType === 'image' && imageData) {
      if (imageData.type === 'video') {
        visual = this.buildImageFrame(imageData);
        visualLabel = 'B-roll Video';
      } else if (imageData.type === 'image') {
        visual = this.buildImageFrame(imageData);
        visualLabel = 'Image';
      } else {
        visual = this.getPlaceholderAnimatic('image');
        visualLabel = 'Image (Placeholder)';
      }
    } else if (slide.visualType === 'instructor-shot') {
      const shotType = this.determineShotType(slide.text);
      visual = this.extractSVGByType(shotType);
      visualLabel = `${shotType} Shot`;
    } else {
      visual = this.extractAnimaticByType(slide.animaticType);
      visualLabel = slide.animaticType || 'Animatic';
    }

    const directorNotes = this.generateDirectorNotes(slide, imageData);

    return `<div class="slide">
  <div class="slide-header">
    <span class="slide-num">Slide ${String(slide.number).padStart(2, '0')}</span>
    <span class="slide-title-text">${this.escapeHTML(slide.title)}</span>
    <span class="slide-vtype">${this.escapeHTML(visualLabel)}</span>
    <span class="slide-duration">${slide.duration}</span>
    <button class="replay-btn" onclick="replaySlide(this)">↺ Replay</button>
  </div>
  <div class="col-audio">
    <div class="col-label">Audio Script</div>
    <p class="audio-text"><strong>${this.escapeHTML(slide.speaker)}:</strong> ${this.escapeHTML(slide.text)}</p>
  </div>
  <div class="col-visual">
    <div class="col-label">Visual</div>
    <div class="frame-wrap">
      ${visual}
      <span class="shot-badge">${visualLabel}</span>
    </div>
  </div>
  <div class="col-direction">
    <div class="col-label">Production Notes</div>
    <div class="dir-notes-detailed">${directorNotes}</div>
  </div>
  <div class="slide-footer">
    <span class="footer-item"><span>Duration:</span> ${slide.duration}</span>
    <span class="footer-item"><span>Words:</span> ${slide.wordCount}</span>
    <span class="footer-item"><span>Type:</span> ${slide.visualType}</span>
  </div>
</div>`;
  }

  determineShotType(text) {
    const normalized = text.toLowerCase();
    if (normalized.includes('opening') || normalized.includes('welcome') || normalized.includes('introduction')) {
      return 'Wide';
    }
    if (normalized.includes('conclusion') || normalized.includes('summary') || normalized.includes('thank')) {
      return 'Wide';
    }
    return 'Medium';
  }

  generateDirectorNotes(slide, imageData) {
    const shotType = this.determineShotType(slide.text);

    if (slide.visualType === 'instructor-shot') {
      return `
        <div class="note-section">
          <strong>Camera & Framing:</strong><br>
          • Shot: ${shotType} Shot<br>
          • Position: Locked off, eye level<br>
          • Depth: Corporate office background<br>
          • Focus: Sharp on talent, subtle background blur
        </div>
        <div class="note-section">
          <strong>Lighting:</strong><br>
          • Key Light: Soft 45° from left<br>
          • Fill Light: Soft light from right (3:1 ratio)<br>
          • Backlight: Subtle separation light<br>
          • Temperature: 5600K (daylight)
        </div>
        <div class="note-section">
          <strong>Performance & Audio:</strong><br>
          • Energy: Professional, confident delivery<br>
          • Pace: Clear, measured speaking<br>
          • Audio: Lapel mic, background noise minimal<br>
          • Duration: ${slide.speakingTime}s
        </div>
      `;
    }

    if (slide.visualType === 'image') {
      if (imageData && imageData.type === 'video') {
        const promptText = imageData.prompt ? imageData.prompt.replace(/Style:.*?(?=Style:|$)/g, '').trim() : 'N/A';
        return `
          <div class="note-section">
            <strong>AI Image Prompt:</strong><br>
            <span class="prompt-text">${this.escapeHTML(promptText)}</span>
          </div>
          <div class="note-section">
            <strong>Video Specifications:</strong><br>
            • Source: AI-generated B-roll (Runway ML)<br>
            • Model: gen4_turbo<br>
            • Resolution: 1920×1080 (Full HD)<br>
            • Codec: H.264, 24fps<br>
            • Duration: ${imageData.duration || slide.speakingTime}s
          </div>
          <div class="note-section">
            <strong>Visual Treatment:</strong><br>
            • Motion: Subtle camera movement<br>
            • Cut: Fade in/fade out at transitions<br>
            • Color Grade: Professional corporate palette<br>
            • Realism: Photorealistic, natural lighting
          </div>
          <div class="note-section">
            <strong>Audio Sync:</strong><br>
            • Video starts with narration<br>
            • Pacing: Video duration matches speaking time<br>
            • Optional: Background music bed (low mix)
          </div>
        `;
      }
      return `
        <div class="note-section">
          <strong>Image Specifications:</strong><br>
          • Source: AI-generated (Midjourney)<br>
          • Resolution: 1920×1080 (Full HD)<br>
          • Style: Professional photography<br>
          • Subjects: Indian professionals
        </div>
        <div class="note-section">
          <strong>Visual Treatment:</strong><br>
          • Animation: Ken Burns zoom (slow, subtle)<br>
          • Zoom Amount: 1.05x over duration<br>
          • Duration: ${slide.speakingTime}s<br>
          • Fade: Fade in 0.3s, fade out 0.3s
        </div>
      `;
    }

    return `
      <div class="note-section">
        <strong>Graphic Animation:</strong><br>
        • Type: ${slide.animaticType || 'Animated graphic'}<br>
        • Style: Professional, corporate<br>
        • Timing: Staggered reveal on narration cues<br>
        • Duration: ${slide.speakingTime}s
      </div>
      <div class="note-section">
        <strong>Animation Details:</strong><br>
        • Entry: Fade-up or slide-in (0.3s)<br>
        • Emphasis: Bold typography, clean layout<br>
        • Transitions: 0.2s ease-in-out<br>
        • Color: Professional corporate palette
      </div>
    `;
  }

  escapeHTML(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  buildCSS() {
    return `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:#f0f4f8;color:#1e293b;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;padding:2rem 1.5rem;min-height:100vh}
.sb-header{text-align:center;margin-bottom:2.5rem}
.sb-title{font-size:clamp(1.4rem,3vw,2rem);font-weight:700;color:#0f172a;letter-spacing:-.02em}
.sb-meta{color:#94a3b8;font-size:.8rem;margin-top:.4rem;letter-spacing:.05em;text-transform:uppercase}
.sb-note{color:#64748b;font-size:.75rem;margin-top:.8rem;max-width:800px;line-height:1.6}
.slide{display:grid;grid-template-columns:1fr 1fr 1fr;grid-template-rows:auto 1fr auto;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:2rem;overflow:hidden;max-width:1400px;margin-inline:auto;box-shadow:0 1px 4px rgba(0,0,0,.07)}
.slide-header{grid-column:1/-1;background:#f1f5f9;padding:.6rem 1.2rem;display:flex;align-items:center;gap:.8rem;border-bottom:1px solid #e2e8f0;flex-wrap:wrap}
.slide-num{font-size:.68rem;font-weight:800;color:#94a3b8;letter-spacing:.12em;text-transform:uppercase;min-width:4.5rem}
.slide-title-text{font-size:.85rem;font-weight:600;color:#334155;flex:1;min-width:200px}
.slide-duration{font-size:.72rem;color:#94a3b8;font-variant-numeric:tabular-nums}
.slide-vtype{font-size:.65rem;color:#64748b;background:#e2e8f0;border-radius:4px;padding:2px 8px;font-weight:700;text-transform:uppercase;letter-spacing:.06em}
.col-audio{padding:1.25rem 1.5rem;background:#ffffff;border-right:1px solid #e8edf4}
.col-visual{background:#f8fafc;display:flex;flex-direction:column;padding:1.25rem 1.5rem;gap:.75rem;border-right:1px solid #e8edf4}
.col-direction{background:#fafbfc;padding:1.25rem 1.5rem;border-right:1px solid #e8edf4;overflow-y:auto}
.col-label{font-size:.65rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#94a3b8;margin-bottom:.75rem;display:flex;align-items:center;gap:.5rem}
.col-label::before{content:'';display:block;width:3px;height:10px;background:currentColor;border-radius:2px}
.audio-text{font-size:.88rem;line-height:1.8;color:#475569}
.audio-text strong{color:#1e293b;font-weight:600}
.frame-wrap{position:relative;width:100%;aspect-ratio:16/9;border:1px solid #cbd5e1;border-radius:6px;overflow:hidden;background:#e8edf4;display:flex;align-items:center;justify-content:center}
.frame-wrap img{width:100%;height:100%;object-fit:cover}
.frame-wrap svg{width:100%;height:100%;display:block}
.frame-wrap video{width:100%;height:100%;object-fit:cover;background:#000}
.shot-badge{position:absolute;bottom:8px;left:8px;background:rgba(255,255,255,.9);color:#475569;font-size:.6rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:3px 7px;border-radius:3px;z-index:10;border:1px solid #e2e8f0}
.dir-note{font-size:.72rem;color:#94a3b8;line-height:1.5}
.dir-note strong{color:#64748b}
.dir-notes-detailed{font-size:.75rem;line-height:1.6;color:#475569}
.dir-notes-detailed strong{color:#1e293b;font-weight:600;display:block;margin-top:.5rem;margin-bottom:.25rem}
.note-section{margin-bottom:.75rem;padding-bottom:.75rem;border-bottom:1px solid #e2e8f0}
.note-section:last-child{border-bottom:none;margin-bottom:0;padding-bottom:0}
.note-section strong{color:#1e293b;font-weight:600;font-size:.8rem}
.note-section br{margin:.2rem 0}
.prompt-text{display:block;background:#f1f5f9;padding:.5rem;border-left:3px solid #3b82f6;border-radius:3px;font-style:italic;color:#334155;font-size:.7rem;line-height:1.5;margin-top:.3rem}
.slide-footer{grid-column:1/-1;background:#f8fafc;border-top:1px solid #e2e8f0;padding:.5rem 1.2rem;display:flex;gap:2rem;flex-wrap:wrap}
.footer-item{font-size:.7rem;color:#94a3b8}
.footer-item span{color:#64748b;font-weight:600}
.replay-btn{background:none;border:1px solid #e2e8f0;border-radius:4px;padding:.18rem .5rem;font-size:.65rem;font-weight:700;color:#94a3b8;cursor:pointer;letter-spacing:.04em;display:flex;align-items:center;gap:.25rem;margin-left:.5rem;transition:color .15s,border-color .15s,background .15s;font-family:inherit}
.replay-btn:hover{color:#3b82f6;border-color:#bfdbfe;background:#eff6ff}
@media(max-width:1200px){.slide{grid-template-columns:1fr 1fr;max-width:900px}.col-direction{grid-column:1/-1;border-top:1px solid #e8edf4;border-right:none;padding:.75rem 1.5rem}}
@media(max-width:800px){.slide{grid-template-columns:1fr}.col-audio{border-right:none;border-bottom:1px solid #e8edf4}.col-visual{border-right:none;border-bottom:1px solid #e8edf4}.col-direction{grid-column:1/-1;border-top:1px solid #e8edf4;border-right:none}}`;
  }

  build(title, slides, imageDataMap = {}) {
    const slidesHTML = slides
      .map((slide) => this.buildSlideHTML(slide, imageDataMap[slide.id]))
      .join('\n\n');

    const totalDuration = slides.reduce((sum, s) => sum + s.speakingTime, 0);
    const durMin = Math.floor(totalDuration / 60);
    const durSec = totalDuration % 60;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="generation-time" content="${new Date().toISOString()}">
  <meta name="images-generated" content="${Object.values(imageDataMap).filter(d => d?.type === 'image').length}">
  <title>${this.escapeHTML(title)} — Storyboard</title>
  <style>
    ${this.buildCSS()}
  </style>
</head>
<body>
  <header class="sb-header">
    <h1 class="sb-title">${this.escapeHTML(title)}</h1>
    <p class="sb-meta">${slides.length} slides · ~${durMin}:${String(durSec).padStart(2, '0')} · ${new Date().toLocaleDateString()}</p>
    <p class="sb-note">This is a production storyboard generated with DALL-E 3 for key scenes. Each slide shows the audio script on the left and the visual treatment on the right. Open in any browser — no server required.</p>
  </header>

  ${slidesHTML}

  <script>
    document.querySelectorAll('.frame-wrap').forEach(function(f){f._orig=f.innerHTML});
    function replaySlide(btn){var f=btn.closest('.slide').querySelector('.frame-wrap');if(f&&f._orig)f.innerHTML=f._orig}
  </script>
</body>
</html>`;

    return html;
  }
}

module.exports = HTMLBuilder;
