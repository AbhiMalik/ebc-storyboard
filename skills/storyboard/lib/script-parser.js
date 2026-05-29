class ScriptParser {
  constructor() {
    // Valid speaker names in POSH/training scripts
    this.validSpeakers = [
      'manager', 'employee', 'chairperson', 'member',
      'external member', 'narrator', 'instructor',
      'speaker', 'actor', 'subordinate'
    ];
  }

  normalizeText(text) {
    return text.toLowerCase().trim().replace(/\s+/g, ' ');
  }

  estimateSpeakingTime(wordCount) {
    const wordsPerSecond = 2.5;
    return Math.round(wordCount / wordsPerSecond / 5) * 5;
  }

  // Pattern-based detection instead of keyword counting
  hasLegalPatterns(text) {
    const legalKeywords = ['posh act', 'section', 'statute', 'judgment', 'court', 'ipc', 'cpc', 'para', 'clause', 'provision', 'legal', 'law', 'illegal'];
    return legalKeywords.some(kw => text.includes(kw));
  }

  hasDialoguePatterns(text) {
    return /["'][^"']*["']|responds?|says?|asks?|tells?|speaker|character/.test(text);
  }

  hasListPatterns(text) {
    return /^[\s]*[•\-*]\s|^\d+\.|key points?|following|steps?|list/.test(text);
  }

  hasInstructorPatterns(text) {
    const instructorKeywords = ['opening', 'introduction', 'welcome', 'conclusion', 'summary', 'thank you', 'let me', 'remember', 'important'];
    return instructorKeywords.some(kw => text.includes(kw));
  }

  detectVisualType(text, speakerLabel) {
    const normalized = this.normalizeText(text);

    // Legal/Definition content → animatic
    if (this.hasLegalPatterns(normalized)) {
      return 'animatic';
    }

    // Dialogue or quoted text → image
    if (this.hasDialoguePatterns(normalized)) {
      return 'image';
    }

    // Lists or bullet content → animatic
    if (this.hasListPatterns(normalized)) {
      return 'animatic';
    }

    // Instructor narration → instructor-shot
    if (this.hasInstructorPatterns(normalized)) {
      return 'instructor-shot';
    }

    // Default fallback
    return 'instructor-shot';
  }

  detectAnimaticType(text) {
    const normalized = this.normalizeText(text);

    // Detect legal judgment extracts
    if (normalized.includes('judgment') || normalized.includes('court') || /\d+ ?sc ?\d+/.test(text)) {
      return 'legal-extract-judgment';
    }

    // Detect legal statute extracts
    if (normalized.includes('section') || normalized.includes('statute') || normalized.includes('provision') || normalized.includes('clause')) {
      return 'legal-extract-statute';
    }

    // Detect comparisons/contrasts
    if (normalized.includes('compare') || normalized.includes('vs') || normalized.includes('versus') || normalized.includes('difference')) {
      return 'split-screen';
    }

    // Detect processes/steps
    if (normalized.includes('process') || normalized.includes('step') || normalized.includes('following') || /^\s*\d+\./.test(text)) {
      return 'flowchart-linear';
    }

    // Detect featured quotes
    if (normalized.includes('quote') || /^["'][^"']+["']/.test(text)) {
      return 'featured-quote';
    }

    // Detect key takeaways
    if (normalized.includes('checklist') || normalized.includes('takeaway') || normalized.includes('summary') || normalized.includes('remember')) {
      return 'key-takeaways';
    }

    // Detect section titles
    if (normalized.includes('chapter') || normalized.includes('section') || normalized.includes('introduce') || normalized.includes('define')) {
      return 'title-card';
    }

    // Detect bullet points/lists
    if (this.hasListPatterns(text)) {
      return 'bullet-reveal';
    }

    return 'bullet-reveal';
  }

  isSpeakerLine(line) {
    // Check if line starts with known speaker pattern
    const speakerRegex = /^([A-Za-z\s()\d]+?):\s*(.+)/;
    const match = line.match(speakerRegex);

    if (!match) return false;

    const potentialSpeaker = match[1].toLowerCase();

    // Must match a valid speaker pattern
    return this.validSpeakers.some(speaker => potentialSpeaker.includes(speaker)) ||
           /member\s+\d+/.test(potentialSpeaker) ||
           /^[a-z\s()]+\s+\([a-z\s]+\)$/.test(potentialSpeaker);
  }

  generateSlideTitle(text, speaker = '') {
    const words = text.split(/\s+/);

    // Too short - use entire text if meaningful
    if (words.length < 5) {
      return text.length > 0 ? text.substring(0, 60) : `${speaker} speaks`;
    }

    // Extract first sentence or meaningful phrase
    let title = text.match(/^[^.!?]*[.!?]/)?.[0] || text.slice(0, 70);
    title = title.replace(/[?!.:,;]/g, '').trim();

    // Avoid single words
    if (title.split(/\s+/).length === 1 && title.length < 20) {
      title = text.substring(0, 70);
    }

    if (title.length > 65) {
      title = title.substring(0, 62) + '…';
    }

    return title || `${speaker} speaks`;
  }

  splitIntoSlides(script) {
    const lines = script.split('\n').map((line) => line.trim());
    const slides = [];
    let currentSlide = null;
    let currentSpeaker = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Empty line = potential slide break
      if (!line) {
        if (currentSlide && currentSlide.text.split(/\s+/).length > 15) {
          slides.push(currentSlide);
          currentSlide = null;
          currentSpeaker = null;
        }
        continue;
      }

      // Check if this is a speaker line
      if (this.isSpeakerLine(line)) {
        const speakerMatch = line.match(/^([A-Za-z\s()\d]+?):\s*(.*)/);
        const speaker = speakerMatch[1].trim();
        const text = speakerMatch[2].trim();

        // Speaker change = new slide
        if (currentSpeaker && currentSpeaker !== speaker) {
          if (currentSlide) {
            slides.push(currentSlide);
          }
          currentSlide = {
            id: slides.length + 1,
            speaker: speaker,
            text: text,
            fullText: text,
          };
          currentSpeaker = speaker;
        } else {
          // Same speaker or first slide
          if (!currentSlide) {
            currentSlide = {
              id: slides.length + 1,
              speaker: speaker,
              text: text,
              fullText: text,
            };
            currentSpeaker = speaker;
          } else {
            // Same speaker continues
            currentSlide.text += ' ' + text;
            currentSlide.fullText += '\n' + line;
          }
        }
      } else {
        // Continuation line for current speaker
        if (currentSlide) {
          currentSlide.text += ' ' + line;
          currentSlide.fullText += '\n' + line;
        }
      }

      // Only close slide if it exceeds reasonable length AND there's more content coming
      const wordCount = (currentSlide?.text || '').split(/\s+/).length;
      if (wordCount > 150 && i < lines.length - 1) {
        if (currentSlide) {
          slides.push(currentSlide);
          currentSlide = null;
        }
      }
    }

    if (currentSlide && currentSlide.text.split(/\s+/).length > 5) {
      slides.push(currentSlide);
    }

    return slides.filter(s => s && s.text && s.text.split(/\s+/).length > 5);
  }

  enrichSlides(slides) {
    return slides.map((slide, index) => {
      const wordCount = slide.text.split(/\s+/).length;
      const speakingTime = this.estimateSpeakingTime(wordCount);

      return {
        ...slide,
        index: index,
        number: index + 1,
        title: this.generateSlideTitle(slide.text, slide.speaker),
        wordCount: wordCount,
        speakingTime: speakingTime,
        duration: `~0:${String(speakingTime).padStart(2, '0')}`,
        visualType: this.detectVisualType(slide.text, slide.speaker),
        animaticType: this.detectAnimaticType(slide.text),
        imagePrompt: this.generateImagePrompt(slide.text, slide.speaker),
      };
    });
  }

  generateImagePrompt(text, speaker) {
    const normalized = this.normalizeText(text);

    if (normalized.includes('manager') && normalized.includes('feedback')) {
      return 'Indian professional manager providing firm feedback to employee in corporate office, serious focused expression, training environment. Style: professional photography, 16:9 aspect ratio, high quality, cinematic lighting, vibrant colors, corporate training environment';
    }

    if (normalized.includes('employee') && (normalized.includes('upset') || normalized.includes('uncomfortable'))) {
      return 'Indian employee looking upset or concerned after receiving critical feedback, corporate office setting, realistic emotion. Style: professional photography, 16:9 aspect ratio, high quality, cinematic lighting, vibrant colors, corporate training environment';
    }

    if (normalized.includes('meeting') || normalized.includes('discussion') || normalized.includes('icc')) {
      return 'Professional ICC committee meeting in conference room with Indian members discussing, formal governance setting, business training. Style: professional photography, 16:9 aspect ratio, high quality, cinematic lighting, vibrant colors';
    }

    if (normalized.includes('workplace') && normalized.includes('conflict')) {
      return 'Indian workplace conflict resolution discussion, professional corporate setting, business training scenario. Style: professional photography, 16:9 aspect ratio, high quality, cinematic lighting, vibrant colors';
    }

    if (normalized.includes('advances') || normalized.includes('romantic')) {
      return 'Indian professional workplace scenario showing respectful interaction between colleagues, corporate office environment, training context. Style: professional photography, 16:9 aspect ratio, high quality, cinematic lighting, vibrant colors';
    }

    if (normalized.includes('posh') || normalized.includes('harassment')) {
      return 'Professional Indian workplace environment with diverse team members, corporate training context, business setting. Style: professional photography, 16:9 aspect ratio, high quality, cinematic lighting, vibrant colors';
    }

    return `Professional Indian corporate training scenario: ${text.substring(0, 60)}. Style: professional photography, 16:9 aspect ratio, high quality, cinematic lighting, vibrant colors`;
  }

  parse(scriptText) {
    const slides = this.splitIntoSlides(scriptText);
    const enrichedSlides = this.enrichSlides(slides);

    const totalDuration = enrichedSlides.reduce((sum, s) => sum + s.speakingTime, 0);

    return {
      slides: enrichedSlides,
      metadata: {
        totalSlides: enrichedSlides.length,
        estimatedDuration: totalDuration,
        estimatedDurationFormatted: `${Math.floor(totalDuration / 60)}:${String(totalDuration % 60).padStart(2, '0')}`,
        generatedAt: new Date().toISOString(),
      },
    };
  }
}

module.exports = ScriptParser;
