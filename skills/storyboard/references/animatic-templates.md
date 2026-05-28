# Animatic Templates

Each snippet goes directly inside `.frame-wrap`. The CSS keyframes (`fadeUp`, `fadeIn`, `scaleIn`, `boxPop`, `slideInLT`) are defined in the page-level stylesheet. Replace placeholder text with content from the script.

---

## bullet-reveal

Staggered fade-up of 3–6 bullet points. Increase `animation-delay` by `0.4s` per additional item.

```html
<div style="width:100%;height:100%;background:#060d1a;display:flex;flex-direction:column;justify-content:center;padding:1.2rem 1.5rem;gap:.65rem">
  <div style="display:flex;align-items:flex-start;gap:.7rem;opacity:0;animation:fadeUp .4s ease .2s forwards">
    <div style="width:7px;height:7px;border-radius:50%;background:#3b82f6;flex-shrink:0;margin-top:.22rem"></div>
    <span style="font-size:.82rem;color:#e2e8f0;line-height:1.45"><strong style="color:#93c5fd">Point one</strong> — supporting detail here</span>
  </div>
  <div style="display:flex;align-items:flex-start;gap:.7rem;opacity:0;animation:fadeUp .4s ease .6s forwards">
    <div style="width:7px;height:7px;border-radius:50%;background:#3b82f6;flex-shrink:0;margin-top:.22rem"></div>
    <span style="font-size:.82rem;color:#e2e8f0;line-height:1.45"><strong style="color:#93c5fd">Point two</strong> — supporting detail here</span>
  </div>
  <div style="display:flex;align-items:flex-start;gap:.7rem;opacity:0;animation:fadeUp .4s ease 1s forwards">
    <div style="width:7px;height:7px;border-radius:50%;background:#3b82f6;flex-shrink:0;margin-top:.22rem"></div>
    <span style="font-size:.82rem;color:#e2e8f0;line-height:1.45"><strong style="color:#93c5fd">Point three</strong> — supporting detail here</span>
  </div>
  <!-- add more items at +0.4s delay each -->
</div>
```

---

## title-card

Bold section title with decorative bar. Use at chapter or module starts.

```html
<div style="width:100%;height:100%;background:linear-gradient(135deg,#0f1729 0%,#1e1b4b 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.8rem;padding:1rem">
  <div style="width:44px;height:3px;background:#3b82f6;border-radius:2px;opacity:0;animation:scaleIn .4s ease .15s forwards"></div>
  <h2 style="font-size:1.35rem;font-weight:800;color:#f8fafc;text-align:center;letter-spacing:-.02em;line-height:1.2;opacity:0;animation:fadeIn .5s ease .4s forwards">Section Title</h2>
  <p style="font-size:.7rem;color:#64748b;text-transform:uppercase;letter-spacing:.12em;opacity:0;animation:fadeIn .5s ease .75s forwards">Module 1 · Chapter 2</p>
  <div style="width:44px;height:3px;background:#3b82f6;border-radius:2px;opacity:0;animation:scaleIn .4s ease 1s forwards"></div>
</div>
```

---

## diagram

Two or three boxes connected by arrows.

### Two-box

```html
<div style="width:100%;height:100%;background:#060d1a;display:flex;align-items:center;justify-content:center;gap:1rem;padding:1rem">
  <div style="background:#1e3a5f;border:1px solid #2d5a9a;border-radius:8px;padding:.7rem 1rem;font-size:.78rem;color:#93c5fd;text-align:center;min-width:90px;line-height:1.3;opacity:0;animation:boxPop .4s ease .2s forwards">Input /<br>Problem</div>
  <div style="color:#3b82f6;font-size:1.4rem;opacity:0;animation:fadeIn .3s ease .75s forwards">→</div>
  <div style="background:#1e3a5f;border:1px solid #2d5a9a;border-radius:8px;padding:.7rem 1rem;font-size:.78rem;color:#93c5fd;text-align:center;min-width:90px;line-height:1.3;opacity:0;animation:boxPop .4s ease 1.1s forwards">Output /<br>Solution</div>
</div>
```

### Three-box

```html
<div style="width:100%;height:100%;background:#060d1a;display:flex;align-items:center;justify-content:center;gap:.7rem;padding:.8rem">
  <div style="background:#1e3a5f;border:1px solid #2d5a9a;border-radius:8px;padding:.6rem .8rem;font-size:.73rem;color:#93c5fd;text-align:center;min-width:76px;line-height:1.3;opacity:0;animation:boxPop .4s ease .2s forwards">Step One</div>
  <div style="color:#3b82f6;font-size:1.2rem;opacity:0;animation:fadeIn .3s ease .7s forwards">→</div>
  <div style="background:#1e3a5f;border:1px solid #2d5a9a;border-radius:8px;padding:.6rem .8rem;font-size:.73rem;color:#93c5fd;text-align:center;min-width:76px;line-height:1.3;opacity:0;animation:boxPop .4s ease 1.05s forwards">Step Two</div>
  <div style="color:#3b82f6;font-size:1.2rem;opacity:0;animation:fadeIn .3s ease 1.5s forwards">→</div>
  <div style="background:#1e3a5f;border:1px solid #2d5a9a;border-radius:8px;padding:.6rem .8rem;font-size:.73rem;color:#93c5fd;text-align:center;min-width:76px;line-height:1.3;opacity:0;animation:boxPop .4s ease 1.85s forwards">Step Three</div>
</div>
```

---

## flowchart-linear

A multi-step linear process (3–5 steps) rendered as an SVG flowchart with start/end terminals. Replace the step labels. Add intermediate boxes by adjusting the horizontal spacing.

```html
<div style="width:100%;height:100%;background:#060d1a;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:.5rem 1rem;gap:.6rem">
  <!-- Optional title row -->
  <div style="font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#334155;opacity:0;animation:fadeIn .3s ease .1s forwards">Process Flow</div>
  <svg viewBox="0 0 370 60" style="width:100%;overflow:visible" xmlns="http://www.w3.org/2000/svg">
    <!-- Start terminal -->
    <g style="opacity:0;animation:fadeIn .4s ease .25s forwards">
      <rect x="0" y="16" width="52" height="26" rx="13" fill="none" stroke="#10b981" stroke-width="1.5"/>
      <text x="26" y="33" text-anchor="middle" font-family="ui-sans-serif,sans-serif" font-size="10" fill="#10b981">Start</text>
    </g>
    <!-- Arrow 1 -->
    <g style="opacity:0;animation:fadeIn .3s ease .6s forwards">
      <line x1="52" y1="29" x2="68" y2="29" stroke="#475569" stroke-width="1.5"/>
      <polygon points="66,24 74,29 66,34" fill="#475569"/>
    </g>
    <!-- Step 1 box -->
    <g style="opacity:0;animation:fadeIn .4s ease .85s forwards">
      <rect x="74" y="13" width="84" height="32" rx="4" fill="none" stroke="#3b82f6" stroke-width="1.5"/>
      <text x="116" y="33" text-anchor="middle" font-family="ui-sans-serif,sans-serif" font-size="10" fill="#93c5fd">Step One</text>
    </g>
    <!-- Arrow 2 -->
    <g style="opacity:0;animation:fadeIn .3s ease 1.25s forwards">
      <line x1="158" y1="29" x2="174" y2="29" stroke="#475569" stroke-width="1.5"/>
      <polygon points="172,24 180,29 172,34" fill="#475569"/>
    </g>
    <!-- Step 2 box -->
    <g style="opacity:0;animation:fadeIn .4s ease 1.5s forwards">
      <rect x="180" y="13" width="84" height="32" rx="4" fill="none" stroke="#3b82f6" stroke-width="1.5"/>
      <text x="222" y="33" text-anchor="middle" font-family="ui-sans-serif,sans-serif" font-size="10" fill="#93c5fd">Step Two</text>
    </g>
    <!-- Arrow 3 -->
    <g style="opacity:0;animation:fadeIn .3s ease 1.9s forwards">
      <line x1="264" y1="29" x2="280" y2="29" stroke="#475569" stroke-width="1.5"/>
      <polygon points="278,24 286,29 278,34" fill="#475569"/>
    </g>
    <!-- End terminal -->
    <g style="opacity:0;animation:fadeIn .4s ease 2.15s forwards">
      <rect x="286" y="16" width="52" height="26" rx="13" fill="none" stroke="#10b981" stroke-width="1.5"/>
      <text x="312" y="33" text-anchor="middle" font-family="ui-sans-serif,sans-serif" font-size="10" fill="#10b981">End</text>
    </g>
    <!-- To add a third step: shift the end terminal right and insert between Arrow 3 and the End terminal -->
  </svg>
</div>
```

---

## flowchart-decision

A process flow with a decision diamond leading to two labelled outcomes. Replace "Decision?", "Path A", and "Path B" labels. The `Yes` path goes down; the `No` path goes right.

```html
<div style="width:100%;height:100%;background:#060d1a;display:flex;align-items:center;justify-content:center;padding:.5rem .8rem">
  <svg viewBox="0 0 400 215" style="width:100%;height:100%" xmlns="http://www.w3.org/2000/svg">
    <!-- Start -->
    <g style="opacity:0;animation:fadeIn .4s ease .2s forwards">
      <rect x="150" y="5" width="100" height="24" rx="12" fill="none" stroke="#10b981" stroke-width="1.5"/>
      <text x="200" y="21" text-anchor="middle" font-family="ui-sans-serif,sans-serif" font-size="10" fill="#10b981">Start</text>
    </g>
    <!-- Arrow down 1 -->
    <g style="opacity:0;animation:fadeIn .3s ease .55s forwards">
      <line x1="200" y1="29" x2="200" y2="45" stroke="#475569" stroke-width="1.5"/>
      <polygon points="195,43 205,43 200,50" fill="#475569"/>
    </g>
    <!-- Process box -->
    <g style="opacity:0;animation:fadeIn .4s ease .8s forwards">
      <rect x="132" y="50" width="136" height="28" rx="4" fill="none" stroke="#3b82f6" stroke-width="1.5"/>
      <text x="200" y="68" text-anchor="middle" font-family="ui-sans-serif,sans-serif" font-size="10" fill="#93c5fd">Process step here</text>
    </g>
    <!-- Arrow down 2 -->
    <g style="opacity:0;animation:fadeIn .3s ease 1.2s forwards">
      <line x1="200" y1="78" x2="200" y2="94" stroke="#475569" stroke-width="1.5"/>
      <polygon points="195,92 205,92 200,99" fill="#475569"/>
    </g>
    <!-- Decision diamond -->
    <g style="opacity:0;animation:fadeIn .4s ease 1.45s forwards">
      <polygon points="200,99 262,127 200,155 138,127" fill="none" stroke="#f59e0b" stroke-width="1.5"/>
      <text x="200" y="124" text-anchor="middle" font-family="ui-sans-serif,sans-serif" font-size="9.5" fill="#fcd34d">Decision?</text>
      <text x="200" y="136" text-anchor="middle" font-family="ui-sans-serif,sans-serif" font-size="8" fill="#92763a">(condition)</text>
    </g>
    <!-- Yes arrow (down) + label -->
    <g style="opacity:0;animation:fadeIn .3s ease 1.9s forwards">
      <line x1="200" y1="155" x2="200" y2="170" stroke="#475569" stroke-width="1.5"/>
      <polygon points="195,168 205,168 200,175" fill="#475569"/>
      <text x="212" y="165" font-family="ui-sans-serif,sans-serif" font-size="9" fill="#64748b">Yes</text>
    </g>
    <!-- Yes outcome box -->
    <g style="opacity:0;animation:fadeIn .4s ease 2.2s forwards">
      <rect x="132" y="175" width="136" height="28" rx="4" fill="none" stroke="#10b981" stroke-width="1.5"/>
      <text x="200" y="193" text-anchor="middle" font-family="ui-sans-serif,sans-serif" font-size="10" fill="#6ee7b7">Outcome A (Yes path)</text>
    </g>
    <!-- No arrow (right) + label -->
    <g style="opacity:0;animation:fadeIn .3s ease 1.9s forwards">
      <line x1="262" y1="127" x2="285" y2="127" stroke="#475569" stroke-width="1.5"/>
      <polygon points="283,122 291,127 283,132" fill="#475569"/>
      <text x="264" y="122" font-family="ui-sans-serif,sans-serif" font-size="9" fill="#64748b">No</text>
    </g>
    <!-- No outcome box -->
    <g style="opacity:0;animation:fadeIn .4s ease 2.2s forwards">
      <rect x="291" y="113" width="104" height="28" rx="4" fill="none" stroke="#ef4444" stroke-width="1.5"/>
      <text x="343" y="131" text-anchor="middle" font-family="ui-sans-serif,sans-serif" font-size="10" fill="#fca5a5">Outcome B (No path)</text>
    </g>
  </svg>
</div>
```

---

## quote

Short definition, principle, or pull-quote with a left accent bar.

```html
<div style="width:100%;height:100%;background:#070c18;display:flex;align-items:center;justify-content:center;padding:1.5rem 2rem">
  <div style="border-left:3px solid #3b82f6;padding-left:1.1rem;opacity:0;animation:fadeIn .6s ease .3s forwards">
    <p style="font-size:.95rem;font-weight:600;color:#e2e8f0;line-height:1.5;font-style:italic">"The quote or definition goes here, exactly as phrased in the script."</p>
    <p style="font-size:.68rem;color:#475569;margin-top:.6rem;letter-spacing:.05em;text-transform:uppercase">Source or attribution</p>
  </div>
</div>
```

---

## featured-quote

A visually prominent quotation for a famous saying or key principle. Larger, editorial treatment with a decorative opening mark.

```html
<div style="width:100%;height:100%;background:linear-gradient(135deg,#0c1424,#0a0a18);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:1.2rem 2rem;position:relative;overflow:hidden">
  <!-- Decorative quotation mark -->
  <div style="position:absolute;top:2px;left:14px;font-size:5.5rem;color:#1a2a4a;line-height:1;font-family:Georgia,serif;opacity:0;animation:fadeIn .3s ease .1s forwards;user-select:none">"</div>
  <!-- Quote text -->
  <p style="font-size:.88rem;font-weight:600;color:#e2e8f0;text-align:center;line-height:1.65;position:relative;z-index:1;opacity:0;animation:fadeIn .6s ease .4s forwards;font-style:italic;max-width:85%">"The full quotation text goes here. Keep it to two or three lines for best legibility on screen."</p>
  <!-- Rule + attribution -->
  <div style="display:flex;flex-direction:column;align-items:center;gap:.3rem;margin-top:.8rem;opacity:0;animation:fadeIn .4s ease 1s forwards">
    <div style="width:32px;height:1.5px;background:#3b82f6;border-radius:1px"></div>
    <p style="font-size:.68rem;color:#64748b;text-transform:uppercase;letter-spacing:.12em;margin-top:.2rem">Author Name · Year or Source</p>
  </div>
</div>
```

---

## legal-extract-statute

An excerpt from a legislative provision — formatted to read like a bare act, with the key phrase underlined in amber. Suits IPC sections, CPC orders, Constitution articles, etc.

```html
<div style="width:100%;height:100%;background:#060d1a;display:flex;align-items:center;justify-content:center;padding:.75rem">
  <div style="background:#0a1020;border:1px solid #1e3a5f;border-radius:6px;padding:.85rem 1.1rem;width:100%;height:100%;display:flex;flex-direction:column;gap:.45rem;opacity:0;animation:fadeIn .5s ease .25s forwards;overflow:hidden">
    <!-- Act name -->
    <div style="font-size:.58rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#475569">The Indian Penal Code, 1860 · Act No. 45 of 1860</div>
    <!-- Section heading -->
    <div style="font-size:.76rem;font-weight:700;color:#93c5fd;border-bottom:1px solid #1e3a5f;padding-bottom:.4rem">Section 300 — Murder</div>
    <!-- Provision text -->
    <div style="font-size:.74rem;color:#94a3b8;line-height:1.7;flex:1;overflow:hidden">
      Except in the cases hereinafter excepted, culpable homicide is murder, if the act by which the death is caused is done
      <span style="border-bottom:1.5px solid #f59e0b;color:#fcd34d;padding:0 1px">with the intention of causing death</span>,
      or with the intention of causing such bodily injury as the offender knows to be likely to cause the death of the person to whom the harm is caused, or if it is done with the knowledge that the act is so imminently dangerous that it must, in all probability, cause death.
    </div>
    <!-- Sub-section note (optional) -->
    <div style="font-size:.62rem;color:#334155;border-top:1px solid #1e2a3a;padding-top:.35rem;font-style:italic">Exception 1 — Culpable homicide is not murder if the offender, whilst deprived of the power of self-control by grave and sudden provocation…</div>
  </div>
</div>
```

**Tips:**
- Replace the statute name, section heading, and provision text with the actual excerpt
- Use `<br>` and `&nbsp;&nbsp;&nbsp;&nbsp;` to replicate sub-section indentation
- Wrap the key phrase in `<span style="border-bottom:1.5px solid #f59e0b;color:#fcd34d">…</span>`
- For Constitution articles, change the header colour to `#a78bfa` (purple)

---

## legal-extract-judgment

An excerpt from a court judgment — with court header, case citation, paragraph reference, and the key passage highlighted. Suits Supreme Court, High Court, and Tribunal decisions.

```html
<div style="width:100%;height:100%;background:#060d1a;display:flex;align-items:center;justify-content:center;padding:.75rem">
  <div style="background:#080e18;border:1px solid #1e293b;border-radius:6px;padding:.8rem 1rem;width:100%;height:100%;display:flex;flex-direction:column;gap:.4rem;opacity:0;animation:fadeIn .5s ease .25s forwards;overflow:hidden">
    <!-- Court header -->
    <div style="text-align:center;border-bottom:1px solid #1e293b;padding-bottom:.4rem">
      <div style="font-size:.6rem;font-weight:700;color:#64748b;letter-spacing:.1em;text-transform:uppercase">Supreme Court of India</div>
      <div style="font-size:.74rem;font-weight:600;color:#cbd5e1;margin-top:.15rem">Plaintiff v. Defendant</div>
      <div style="font-size:.6rem;color:#475569;margin-top:.1rem">AIR 20XX SC XXX &nbsp;·&nbsp; Civil Appeal No. XXXX of 20XX</div>
    </div>
    <!-- Paragraph + key passage -->
    <div style="font-size:.73rem;color:#94a3b8;line-height:1.7;flex:1;overflow:hidden">
      <span style="font-size:.65rem;font-weight:700;color:#475569;margin-right:.4rem">¶ 14.</span>
      The question that arises for consideration is whether the principle enunciated in the earlier decisions applies to the facts of the present case. It is well settled that
      <span style="background:#1c1400;border-bottom:1.5px solid #f59e0b;color:#fcd34d;padding:0 2px">the court must look to the substance of the transaction and not its mere form when determining the true nature of the relationship between the parties</span>.
      This principle has been consistently applied by this Court in a long line of decisions.
    </div>
    <!-- Citation footer -->
    <div style="font-size:.6rem;color:#334155;border-top:1px solid #1e293b;padding-top:.3rem;display:flex;justify-content:space-between">
      <span>Per [Justice Name] J.</span>
      <span>Judgment dt. DD Mon YYYY</span>
    </div>
  </div>
</div>
```

**Tips:**
- Copy the actual paragraph text from the judgment into the body
- Replace the highlighted passage with the key ratio or obiter you want to emphasise
- For High Court decisions, change "Supreme Court of India" and adjust the citation format
- For Tribunal orders (NCLAT, NCLT, TDSAT, etc.), use the tribunal name and order number
- To show a headnote instead of a paragraph, replace the `¶ 14.` span with the headnote number

---

## split-screen

Two equal panels for comparisons, before/after, or two contrasting concepts.

```html
<div style="width:100%;height:100%;background:#060d1a;display:grid;grid-template-columns:1fr 1px 1fr">
  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:.8rem;gap:.5rem;opacity:0;animation:fadeIn .5s ease .2s forwards">
    <div style="font-size:.65rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#3b82f6">Option A</div>
    <div style="font-size:.82rem;color:#94a3b8;text-align:center;line-height:1.45">Description of the first concept or option goes here</div>
  </div>
  <div style="background:#1e293b"></div>
  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:.8rem;gap:.5rem;opacity:0;animation:fadeIn .5s ease .65s forwards">
    <div style="font-size:.65rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#f59e0b">Option B</div>
    <div style="font-size:.82rem;color:#94a3b8;text-align:center;line-height:1.45">Description of the second concept or option goes here</div>
  </div>
</div>
```

---

## highlight

A single key concept in the centre with a coloured accent circle and supporting sub-label.

```html
<div style="width:100%;height:100%;background:radial-gradient(ellipse at center, #1a2540 0%, #060d1a 70%);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.7rem;padding:1rem">
  <div style="width:56px;height:56px;border-radius:50%;background:#1e3a5f;border:2px solid #3b82f6;display:flex;align-items:center;justify-content:center;font-size:1.5rem;opacity:0;animation:boxPop .5s ease .2s forwards">💡</div>
  <div style="font-size:1.05rem;font-weight:800;color:#f8fafc;text-align:center;letter-spacing:-.01em;opacity:0;animation:fadeIn .5s ease .5s forwards">Key Concept Here</div>
  <div style="font-size:.72rem;color:#64748b;text-align:center;max-width:200px;line-height:1.4;opacity:0;animation:fadeIn .5s ease .85s forwards">Supporting detail or clarifying sentence goes here</div>
</div>
```

---

## key-takeaways

Numbered memorable statements — use at the end of a topic or module as a "what to remember" summary. Distinct from `bullet-reveal` because items are numbered and styled as stand-alone assertions.

```html
<div style="width:100%;height:100%;background:#060d1a;display:flex;flex-direction:column;justify-content:center;padding:1rem 1.4rem;gap:.55rem">
  <div style="font-size:.62rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#475569;margin-bottom:.2rem;opacity:0;animation:fadeIn .3s ease .1s forwards">Key Takeaways</div>
  <div style="display:flex;gap:.7rem;align-items:flex-start;opacity:0;animation:fadeUp .4s ease .3s forwards">
    <div style="min-width:22px;height:22px;border-radius:50%;background:#1e3a5f;border:1.5px solid #3b82f6;display:flex;align-items:center;justify-content:center;font-size:.68rem;font-weight:800;color:#3b82f6;flex-shrink:0;margin-top:.05rem">1</div>
    <span style="font-size:.8rem;color:#e2e8f0;line-height:1.5">First takeaway — write as a complete, memorable sentence the student can recite</span>
  </div>
  <div style="display:flex;gap:.7rem;align-items:flex-start;opacity:0;animation:fadeUp .4s ease .7s forwards">
    <div style="min-width:22px;height:22px;border-radius:50%;background:#1e3a5f;border:1.5px solid #3b82f6;display:flex;align-items:center;justify-content:center;font-size:.68rem;font-weight:800;color:#3b82f6;flex-shrink:0;margin-top:.05rem">2</div>
    <span style="font-size:.8rem;color:#e2e8f0;line-height:1.5">Second takeaway — one idea per item, written in plain language</span>
  </div>
  <div style="display:flex;gap:.7rem;align-items:flex-start;opacity:0;animation:fadeUp .4s ease 1.1s forwards">
    <div style="min-width:22px;height:22px;border-radius:50%;background:#1e3a5f;border:1.5px solid #3b82f6;display:flex;align-items:center;justify-content:center;font-size:.68rem;font-weight:800;color:#3b82f6;flex-shrink:0;margin-top:.05rem">3</div>
    <span style="font-size:.8rem;color:#e2e8f0;line-height:1.5">Third takeaway — ideally 3–4 items total for best retention</span>
  </div>
  <!-- item 4: delay 1.5s -->
</div>
```

---

## video-summary

End-of-video recap — a checklist of topics covered in this lesson. Use on the final slide or just before the sign-off.

```html
<div style="width:100%;height:100%;background:#060d1a;display:flex;flex-direction:column;justify-content:center;padding:1rem 1.5rem;gap:.5rem">
  <div style="font-size:.62rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#475569;margin-bottom:.35rem;opacity:0;animation:fadeIn .3s ease .1s forwards">What We Covered</div>
  <div style="display:flex;align-items:center;gap:.7rem;opacity:0;animation:fadeUp .35s ease .3s forwards">
    <svg width="16" height="16" viewBox="0 0 16 16" style="flex-shrink:0" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="7" fill="none" stroke="#10b981" stroke-width="1.5"/><path d="M4.5 8.5 7 11 11.5 5.5" stroke="#10b981" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <span style="font-size:.8rem;color:#e2e8f0">First topic covered in this video</span>
  </div>
  <div style="display:flex;align-items:center;gap:.7rem;opacity:0;animation:fadeUp .35s ease .62s forwards">
    <svg width="16" height="16" viewBox="0 0 16 16" style="flex-shrink:0" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="7" fill="none" stroke="#10b981" stroke-width="1.5"/><path d="M4.5 8.5 7 11 11.5 5.5" stroke="#10b981" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <span style="font-size:.8rem;color:#e2e8f0">Second topic covered in this video</span>
  </div>
  <div style="display:flex;align-items:center;gap:.7rem;opacity:0;animation:fadeUp .35s ease .94s forwards">
    <svg width="16" height="16" viewBox="0 0 16 16" style="flex-shrink:0" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="7" fill="none" stroke="#10b981" stroke-width="1.5"/><path d="M4.5 8.5 7 11 11.5 5.5" stroke="#10b981" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <span style="font-size:.8rem;color:#e2e8f0">Third topic covered in this video</span>
  </div>
  <div style="display:flex;align-items:center;gap:.7rem;opacity:0;animation:fadeUp .35s ease 1.26s forwards">
    <svg width="16" height="16" viewBox="0 0 16 16" style="flex-shrink:0" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="7" fill="none" stroke="#10b981" stroke-width="1.5"/><path d="M4.5 8.5 7 11 11.5 5.5" stroke="#10b981" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <span style="font-size:.8rem;color:#e2e8f0">Fourth topic covered in this video</span>
  </div>
  <!-- add more items at +0.32s delay each -->
</div>
```

---

## lower-third (overlay on instructor shot)

**This is not a standalone animatic.** It is a `<div>` placed inside `.frame-wrap` *after* the instructor SVG. It slides in from the left over the lower portion of the instructor frame — exactly like a broadcast lower-third.

Add this immediately before the closing `</div>` of `.frame-wrap`:

```html
<!-- Lower-third overlay — paste AFTER the instructor SVG, inside .frame-wrap -->
<div style="position:absolute;bottom:0;left:0;width:66%;background:rgba(10,16,28,0.93);border-top:2px solid #3b82f6;padding:.38rem .75rem;transform:translateX(-105%);animation:slideInLT .5s cubic-bezier(.22,.61,.36,1) .6s forwards;z-index:20;backdrop-filter:blur(3px)">
  <div style="font-size:.56rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#3b82f6;margin-bottom:.15rem">Reference</div>
  <div style="font-size:.72rem;color:#e2e8f0;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">Citation text, case name, or URL here</div>
  <div style="font-size:.6rem;color:#64748b;margin-top:.08rem">Source · Publication · Year</div>
</div>
```

**Usage notes:**
- Use on medium or wide instructor shots only — close-ups don't have enough bottom space
- Change `width:66%` to `width:80%` for longer citations
- For a legal case citation: use the case name as the primary line, the reporter citation as the source line
- For a web reference: use the page title as the primary line, the domain as the source line
- For multiple sources on one slide: use two stacked lower-thirds with delays `.6s` and `1.4s`
- The `.shot-badge` will still appear (top-right); move it to `top:8px;right:8px` if needed to avoid overlap

**Slide header type label:** use `lower-third` as the `slide-vtype` when the lower-third is the primary new visual element on a slide.

---

## Tips for adapting all templates

- **Add more items** (bullets, takeaways, checklist rows): copy the item block and increase `animation-delay` by `0.35–0.4s`
- **Adjust pacing**: slower = increase delays; faster = decrease delays
- **Accent colours**: replace `#3b82f6` (blue) with `#f59e0b` (amber), `#10b981` (green), `#8b5cf6` (purple), or `#ef4444` (red)
- **Legal colour convention**: use blue for statute extracts, amber for judgment highlights, purple for constitutional provisions
- **Flowchart labels**: keep text under 14 characters per box for legibility at this frame size
- **Swap emoji** in `highlight`: replace 💡 with ⚖️ (law), 📋 (procedure), 🔍 (analysis), or ✅ (conclusion)
