# Instructor Shot SVGs

Three ready-to-embed SVG templates. Each is `viewBox="0 0 400 225"` (16:9). Paste the full `<svg>…</svg>` block directly inside `.frame-wrap`, before the `.shot-badge` span.

The character uses a consistent design — dark-brown hair, warm skin tone, blue business shirt with dark blazer. Background changes with zoom level.

For **lower-third composite frames**, see the [Lower-third composite](#lower-third-composite) section at the bottom of this file.

---

## Close-up Shot

Head fills most of the frame. Just the tops of the shoulders are visible. Use for direct address, key takeaways, or the opening hook.

```html
<svg viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="cu-bg" cx="50%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#353868"/>
      <stop offset="100%" stop-color="#0e0e1a"/>
    </radialGradient>
  </defs>
  <rect width="400" height="225" fill="url(#cu-bg)"/>
  <!-- spotlight halo -->
  <ellipse cx="200" cy="100" rx="135" ry="128" fill="#3a3d70" opacity="0.2"/>
  <!-- shoulders -->
  <path d="M0,225 Q60,178 155,194 Q200,202 245,194 Q340,178 400,225Z" fill="#1a3060"/>
  <!-- collar -->
  <path d="M158,208 Q178,184 200,190 Q222,184 242,208" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" opacity="0.75"/>
  <!-- neck -->
  <rect x="181" y="158" width="38" height="52" rx="7" fill="#d4906a"/>
  <!-- head -->
  <ellipse cx="200" cy="98" rx="88" ry="100" fill="#d4906a"/>
  <!-- hair top -->
  <path d="M112,82 Q116,8 200,3 Q284,8 288,82 Q274,40 200,34 Q126,40 112,82Z" fill="#2c1810"/>
  <!-- hair sides -->
  <path d="M112,82 Q108,110 112,140 Q118,98 126,84Z" fill="#2c1810"/>
  <path d="M288,82 Q292,110 288,140 Q282,98 274,84Z" fill="#2c1810"/>
  <!-- ears -->
  <ellipse cx="112" cy="108" rx="12" ry="17" fill="#c47a56"/>
  <ellipse cx="288" cy="108" rx="12" ry="17" fill="#c47a56"/>
  <!-- eye whites -->
  <ellipse cx="172" cy="103" rx="16" ry="13" fill="white"/>
  <ellipse cx="228" cy="103" rx="16" ry="13" fill="white"/>
  <!-- iris -->
  <circle cx="175" cy="104" r="9" fill="#2c3e50"/>
  <circle cx="231" cy="104" r="9" fill="#2c3e50"/>
  <!-- pupil -->
  <circle cx="176" cy="105" r="5" fill="#111"/>
  <circle cx="232" cy="105" r="5" fill="#111"/>
  <!-- highlight -->
  <circle cx="179" cy="101" r="2.5" fill="white" opacity="0.85"/>
  <circle cx="235" cy="101" r="2.5" fill="white" opacity="0.85"/>
  <!-- eyebrows -->
  <path d="M155,86 Q172,74 190,82" stroke="#2c1810" stroke-width="4.5" fill="none" stroke-linecap="round"/>
  <path d="M210,82 Q228,74 245,86" stroke="#2c1810" stroke-width="4.5" fill="none" stroke-linecap="round"/>
  <!-- nose -->
  <path d="M192,128 Q200,144 208,128" stroke="#b06040" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <ellipse cx="191" cy="130" rx="8" ry="5" fill="#c07050" opacity="0.18"/>
  <ellipse cx="209" cy="130" rx="8" ry="5" fill="#c07050" opacity="0.18"/>
  <!-- mouth -->
  <path d="M180,155 Q200,168 220,155" stroke="#8b3a2a" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M186,148 Q193,143 200,145 Q207,143 214,148" stroke="#9b5040" stroke-width="1.5" fill="none" stroke-linecap="round"/>
</svg>
```

---

## Medium Shot

Head and torso visible down to the desk edge. Hands rest on desk. The default shot for most teaching content.

```html
<svg viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="ms-bg" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#252a4a"/>
      <stop offset="100%" stop-color="#0d1020"/>
    </radialGradient>
  </defs>
  <rect width="400" height="225" fill="url(#ms-bg)"/>
  <!-- desk surface -->
  <rect x="0" y="200" width="400" height="25" fill="#0e1520"/>
  <rect x="0" y="197" width="400" height="6" fill="#1a2535"/>
  <!-- laptop edge (bottom-left) -->
  <rect x="55" y="194" width="105" height="5" rx="1" fill="#1a2840"/>
  <!-- torso + jacket -->
  <rect x="112" y="108" width="176" height="120" rx="16" fill="#2d4f8a"/>
  <path d="M112,108 Q148,130 200,120 Q252,130 288,108 L282,225 Q200,232 118,225Z" fill="#1a3060"/>
  <!-- shirt / tie -->
  <path d="M200,120 L218,163 L200,170 L182,163Z" fill="white" opacity="0.9"/>
  <!-- collar -->
  <path d="M178,120 Q190,106 200,110 Q210,106 222,120 L218,128 L200,123 L182,128Z" fill="white" opacity="0.8"/>
  <!-- neck -->
  <rect x="183" y="78" width="34" height="36" rx="6" fill="#d4906a"/>
  <!-- head -->
  <ellipse cx="200" cy="52" rx="52" ry="58" fill="#d4906a"/>
  <!-- hair -->
  <path d="M148,44 Q151,0 200,0 Q249,0 252,44 Q243,16 200,12 Q157,16 148,44Z" fill="#2c1810"/>
  <path d="M148,44 Q144,62 148,82 Q154,52 162,46Z" fill="#2c1810"/>
  <path d="M252,44 Q256,62 252,82 Q246,52 238,46Z" fill="#2c1810"/>
  <!-- ears -->
  <ellipse cx="148" cy="55" rx="8" ry="12" fill="#c47a56"/>
  <ellipse cx="252" cy="55" rx="8" ry="12" fill="#c47a56"/>
  <!-- eyes -->
  <ellipse cx="181" cy="48" rx="10" ry="8.5" fill="white"/>
  <ellipse cx="219" cy="48" rx="10" ry="8.5" fill="white"/>
  <circle cx="183" cy="49" r="6" fill="#2c3e50"/>
  <circle cx="221" cy="49" r="6" fill="#2c3e50"/>
  <circle cx="184" cy="50" r="3.5" fill="#111"/>
  <circle cx="222" cy="50" r="3.5" fill="#111"/>
  <circle cx="186" cy="47" r="1.5" fill="white" opacity="0.85"/>
  <circle cx="224" cy="47" r="1.5" fill="white" opacity="0.85"/>
  <!-- eyebrows -->
  <path d="M169,35 Q181,27 193,33" stroke="#2c1810" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M207,33 Q219,27 231,35" stroke="#2c1810" stroke-width="3" fill="none" stroke-linecap="round"/>
  <!-- nose -->
  <path d="M194,64 Q200,75 206,64" stroke="#b06040" stroke-width="2" fill="none" stroke-linecap="round"/>
  <ellipse cx="193" cy="65" rx="5" ry="4" fill="#c07050" opacity="0.2"/>
  <ellipse cx="207" cy="65" rx="5" ry="4" fill="#c07050" opacity="0.2"/>
  <!-- mouth -->
  <path d="M186,82 Q200,92 214,82" stroke="#8b3a2a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <!-- arms on desk -->
  <path d="M112,158 Q90,172 98,202 Q115,202 132,178 L132,148Z" fill="#2d4f8a"/>
  <path d="M288,158 Q310,172 302,202 Q285,202 268,178 L268,148Z" fill="#2d4f8a"/>
  <!-- hands -->
  <ellipse cx="100" cy="200" rx="18" ry="12" fill="#d4906a"/>
  <ellipse cx="300" cy="200" rx="18" ry="12" fill="#d4906a"/>
</svg>
```

---

## Wide Shot

Full figure visible — seated at a desk with a bookshelf and plant in the background. Use for introductions, sign-offs, and broad context setting.

```html
<svg viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ws-wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#22273e"/>
      <stop offset="100%" stop-color="#14182a"/>
    </linearGradient>
  </defs>
  <rect width="400" height="225" fill="#0d1020"/>
  <!-- back wall -->
  <rect x="0" y="0" width="400" height="172" fill="url(#ws-wall)"/>
  <!-- bookshelf (left) -->
  <rect x="18" y="18" width="88" height="110" rx="3" fill="#1e2338" opacity="0.9"/>
  <rect x="24" y="28" width="8" height="72" rx="1" fill="#4a5580"/>
  <rect x="35" y="33" width="6" height="67" rx="1" fill="#354070"/>
  <rect x="44" y="25" width="9" height="75" rx="1" fill="#5a6090"/>
  <rect x="56" y="30" width="7" height="70" rx="1" fill="#3a4568"/>
  <rect x="66" y="24" width="10" height="76" rx="1" fill="#4a5580"/>
  <rect x="79" y="36" width="8" height="64" rx="1" fill="#3a4570"/>
  <!-- plant (right) -->
  <rect x="298" y="28" width="44" height="86" rx="3" fill="#19202e" opacity="0.9"/>
  <ellipse cx="320" cy="58" rx="20" ry="24" fill="#1a3820"/>
  <ellipse cx="308" cy="70" rx="13" ry="17" fill="#1f4025"/>
  <ellipse cx="332" cy="64" rx="13" ry="19" fill="#163218"/>
  <rect x="314" y="80" width="12" height="22" rx="2" fill="#2d4a1e"/>
  <!-- desk -->
  <rect x="0" y="168" width="400" height="57" fill="#0e1520"/>
  <rect x="0" y="165" width="400" height="7" fill="#1a2535"/>
  <!-- laptop on desk -->
  <rect x="28" y="144" width="92" height="52" rx="3" fill="#151e30"/>
  <rect x="33" y="147" width="82" height="43" rx="2" fill="#0a1825"/>
  <rect x="35" y="149" width="78" height="39" rx="1" fill="#1a3a6a" opacity="0.55"/>
  <rect x="22" y="192" width="104" height="6" rx="2" fill="#111a28"/>
  <!-- mug -->
  <rect x="246" y="174" width="20" height="22" rx="4" fill="#3a4060"/>
  <path d="M266,179 Q275,179 275,185 Q275,191 266,191" stroke="#3a4060" stroke-width="3" fill="none"/>
  <!-- papers -->
  <rect x="282" y="163" width="72" height="48" rx="2" fill="#e8e0d0" transform="rotate(-4,318,187)"/>
  <rect x="280" y="161" width="72" height="48" rx="2" fill="#f0ead8" transform="rotate(-6,316,185)"/>
  <!-- person — legs under desk -->
  <rect x="166" y="196" width="22" height="29" rx="3" fill="#1a2840"/>
  <rect x="212" y="196" width="22" height="29" rx="3" fill="#1a2840"/>
  <!-- torso -->
  <rect x="158" y="108" width="84" height="88" rx="10" fill="#2d4f8a"/>
  <path d="M158,108 Q174,124 200,116 Q226,124 242,108 L238,195 Q200,200 162,195Z" fill="#1a3060"/>
  <path d="M200,116 L213,148 L200,154 L187,148Z" fill="white" opacity="0.88"/>
  <!-- neck -->
  <rect x="189" y="91" width="22" height="22" rx="5" fill="#d4906a"/>
  <!-- head -->
  <ellipse cx="200" cy="72" rx="30" ry="34" fill="#d4906a"/>
  <!-- hair -->
  <path d="M170,62 Q172,24 200,20 Q228,24 230,62 Q222,38 200,34 Q178,38 170,62Z" fill="#2c1810"/>
  <!-- ears -->
  <ellipse cx="170" cy="73" rx="5" ry="8" fill="#c47a56"/>
  <ellipse cx="230" cy="73" rx="5" ry="8" fill="#c47a56"/>
  <!-- eyes -->
  <ellipse cx="189" cy="68" rx="6" ry="5.5" fill="white"/>
  <ellipse cx="211" cy="68" rx="6" ry="5.5" fill="white"/>
  <circle cx="190" cy="69" r="3.8" fill="#2c3e50"/>
  <circle cx="212" cy="69" r="3.8" fill="#2c3e50"/>
  <circle cx="191" cy="70" r="2.2" fill="#111"/>
  <circle cx="213" cy="70" r="2.2" fill="#111"/>
  <circle cx="192" cy="67" r="1.1" fill="white" opacity="0.8"/>
  <circle cx="214" cy="67" r="1.1" fill="white" opacity="0.8"/>
  <!-- eyebrows -->
  <path d="M183,59 Q190,54 197,58" stroke="#2c1810" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <path d="M203,58 Q210,54 217,59" stroke="#2c1810" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <!-- nose -->
  <path d="M197,76 Q200,83 203,76" stroke="#b06040" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <!-- mouth -->
  <path d="M192,87 Q200,93 208,87" stroke="#8b3a2a" stroke-width="2" fill="none" stroke-linecap="round"/>
  <!-- arms folded on desk -->
  <rect x="152" y="162" width="96" height="18" rx="7" fill="#2d4f8a"/>
  <ellipse cx="155" cy="171" rx="11" ry="9" fill="#d4906a"/>
  <ellipse cx="245" cy="171" rx="11" ry="9" fill="#d4906a"/>
</svg>
```

---

## Lower-third composite

A lower-third composite combines an instructor shot (SVG) with a sliding citation bar overlaid at the bottom-left. Use a **medium** or **wide** shot — the lower-third bar is too tall relative to the frame for a close-up.

### Frame structure

```html
<div class="frame-wrap">
  <!-- 1. Paste the medium or wide shot SVG here -->

  <!-- 2. Lower-third overlay (slides in from left) -->
  <div style="position:absolute;bottom:0;left:0;width:66%;background:rgba(10,16,28,0.93);border-top:2px solid #3b82f6;padding:.38rem .75rem;transform:translateX(-105%);animation:slideInLT .5s cubic-bezier(.22,.61,.36,1) .6s forwards;z-index:20;backdrop-filter:blur(3px)">
    <div style="font-size:.56rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#3b82f6;margin-bottom:.15rem">Reference</div>
    <div style="font-size:.72rem;color:#e2e8f0;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">Citation text, case name, or URL here</div>
    <div style="font-size:.6rem;color:#64748b;margin-top:.08rem">Source · Publication · Year</div>
  </div>

  <!-- 3. Shot badge (top-right, as usual) -->
  <span class="shot-badge">Medium Shot</span>
</div>
```

### Variants by content type

**Legal case citation:**
```html
<div style="font-size:.56rem;...;color:#f59e0b">Case Citation</div>
<div style="font-size:.72rem;...">Vishaka v. State of Rajasthan</div>
<div style="font-size:.6rem;...">AIR 1997 SC 3011 · (1997) 6 SCC 241</div>
```

**Statutory reference:**
```html
<div style="font-size:.56rem;...;color:#3b82f6">Statutory Reference</div>
<div style="font-size:.72rem;...">Section 300, Indian Penal Code, 1860</div>
<div style="font-size:.6rem;...">Act No. 45 of 1860</div>
```

**Web page / article:**
```html
<div style="font-size:.56rem;...;color:#10b981">Source</div>
<div style="font-size:.72rem;...">Article or page title goes here</div>
<div style="font-size:.6rem;...">domain.com · Author · Year</div>
```

**Two consecutive lower-thirds on one slide** (second source fades out as first fades in):
- First bar: `animation-delay: .6s`
- Second bar: set `animation: slideInLT .5s ... 1.6s forwards` — or use a separate `fadeOut` so the first bar disappears before the second appears

### Slide header type label
Use `Medium Shot + Lower Third` or `Wide Shot + Lower Third` in the `slide-vtype` span.
