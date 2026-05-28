# ebc-storyboard

A Claude Code plugin that turns a video script into a production-ready HTML storyboard for talking-head lecture videos.

## What it produces

A single self-contained HTML file — open it in any browser, no server needed. Each slide has:

- **Left column** — verbatim audio script with inline animation cue markers
- **Right column** — an instructor SVG shot or a CSS-animated animatic
- **Slide header** — slide number, title, estimated duration, visual type
- **Slide footer** — director notes (camera, lighting, energy, animation timing)

## Slide types

| Type | Description |
|------|-------------|
| Wide Shot | Full figure + desk + environment |
| Medium Shot | Head + torso — the default instructor shot |
| Close-up Shot | Head fills frame — for key moments and direct address |
| `+ Lower Third` | Statutory or web reference overlay on any instructor shot |
| Animatic: Title Card | Section header / chapter marker |
| Animatic: Bullet Reveal | Staggered list of 3–6 points |
| Animatic: Featured Quote | Large editorial quotation |
| Animatic: Quote | Short pull-quote with left accent bar |
| Animatic: Highlight | Single key idea with sub-label |
| Animatic: Split Screen | Two contrasting concepts side by side |
| Animatic: Diagram | 2–3 connected process boxes |
| Animatic: Flowchart — Linear | Multi-step linear process with start/end terminals |
| Animatic: Flowchart — Decision | Process with a decision point and two outcome branches |
| Animatic: Legal Extract — Statute | IPC / CPC / Constitution provision with highlighted key phrase |
| Animatic: Legal Extract — Judgment | SC/HC judgment excerpt with para reference and ratio highlighted |
| Animatic: Key Takeaways | Numbered summary — end of topic or module |
| Animatic: Video Summary | Checklist of topics covered in the lesson |

## Requirements

- [Claude Code](https://claude.ai/code) with plugin support enabled

## Installation

```bash
git clone https://github.com/AbhiMalik/ebc-storyboard ~/plugins/ebc-storyboard
```

Optionally add a shell alias so you don't have to type the full command each time:

```bash
echo 'alias storyboard="claude --model claude-haiku-4-5-20251001 --plugin-dir ~/plugins/ebc-storyboard"' >> ~/.zshrc
source ~/.zshrc
```

## Usage

Launch Claude Code with the plugin loaded (run this in Terminal from the folder where you want the storyboard saved):

```bash
claude --model claude-haiku-4-5-20251001 --plugin-dir ~/plugins/ebc-storyboard
```

Or if you added the alias:

```bash
storyboard
```

Then paste your video script and invoke the skill:

```
/ebc-storyboard:storyboard

[Your script here]
```

Claude will segment the script, assign a visual type to each segment, and write a complete storyboard HTML file in your current working directory.

You can also specify a filename:

```
/ebc-storyboard:storyboard Save as module-3-mens-rea.html

[Script here]
```

## Animation cue markers

Every animatic slide includes inline `▶ cue label` badges in the audio script column. These mark the exact word at which each animation element should appear on screen — designed so a video editor can sync motion graphics frame-accurately without guessing.

**Timing rule:** trigger the animation so it *completes* on the cue word, not starts. For a 0.4s fade-in, begin the animation ~0.4s before the spoken trigger.

## Output example

See [`examples/storyboard-example.html`](examples/storyboard-example.html) — a 14-slide demo on *Understanding Mens Rea in Indian Criminal Law* that exercises every slide type.

## Author

EBC Learning · [ebcpublishing.in](https://www.ebcpublishing.in)
