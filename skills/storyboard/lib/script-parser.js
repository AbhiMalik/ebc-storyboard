class ScriptParser {
  constructor() {
    this.instructorShotKeywords = [
      'opening', 'introduction', 'welcome', 'hi ', 'hello',
      'in summary', 'to sum up', 'conclusion', 'remember',
      'i want to', 'i\'d like to', 'let me tell you',
      'now let\'s', 'you\'ve learned', 'you\'ve seen',
      'thank you', 'that\'s all', 'goodbye', 'see you',
    ];

    this.animaticKeywords = [
      'here', 'as you can see', 'notice', 'observe',
      'look at', 'following', 'steps', 'process',
      'key points', 'main ideas', 'highlights',
      'showing', 'displays', 'example', 'illustration',
      'defines', 'defines', 'statutory', 'provisions',
      'section', 'article', 'paragraph', 'principle',
      'compare', 'difference', 'vs', 'versus',
      'checklist', 'list', 'bullet', 'framework',
      'quote', 'cited', 'mentioned', 'states that',
    ];

    this.imageKeywords = [
      'scene', 'manager', 'employee', 'office', 'meeting',
      'situation', 'scenario', 'action', 'interaction',
      'person', 'people', 'moment', 'happens', 'occurred',
      'looks', 'appears', 'shows', 'depicts',
    ];
  }

  normalizeText(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ');
  }

  estimateSpeakingTime(wordCount) {
    const wordsPerSecond = 2.5;
    return Math.round(wordCount / wordsPerSecond / 5) * 5;
  }

  detectVisualType(text, speakerLabel) {
    const normalized = this.normalizeText(text);

    const instructorScore = this.instructorShotKeywords.filter(
      (kw) => normalized.includes(kw)
    ).length;

    const animaticScore = this.animaticKeywords.filter(
      (kw) => normalized.includes(kw)
    ).length;

    const imageScore = this.imageKeywords.filter(
      (kw) => normalized.includes(kw)
    ).length;

    if (speakerLabel && (speakerLabel.includes('Chairperson') || speakerLabel.includes('Member'))) {
      return 'animator-chart';
    }

    if (instructorScore > animaticScore && instructorScore > imageScore) {
      return 'instructor-shot';
    }

    if (imageScore > 1 && imageScore > animaticScore) {
      return 'image';
    }

    if (animaticScore > 0) {
      return 'animatic';
    }

    return 'instructor-shot';
  }

  detectAnimaticType(text) {
    const normalized = this.normalizeText(text);

    if (normalized.includes('key') && normalized.includes('point')) return 'bullet-reveal';
    if (normalized.includes('step') || normalized.includes('process')) return 'flowchart-linear';
    if (normalized.includes('compare') || normalized.includes('vs')) return 'split-screen';
    if (normalized.includes('quote') || normalized.includes('cited')) return 'featured-quote';
    if (normalized.includes('section') || normalized.includes('statute')) return 'legal-extract-statute';
    if (normalized.includes('judgment') || normalized.includes('para')) return 'legal-extract-judgment';
    if (normalized.includes('checklist') || normalized.includes('summary')) return 'key-takeaways';
    if (normalized.includes('introduce') || normalized.includes('define')) return 'title-card';

    return 'bullet-reveal';
  }

  generateSlideTitle(text, context = '') {
    const words = text.split(/\s+/).slice(0, 8).join(' ');
    let title = words.replace(/[?!.,:]/g, '').trim();

    if (title.length > 60) {
      title = title.substring(0, 57) + '…';
    }

    return title || `Slide: ${context}`;
  }

  splitIntoSlides(script) {
    const lines = script.split('\n').map((line) => line.trim());
    const slides = [];
    let currentSlide = null;
    let currentSpeaker = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (!line) continue;

      const speakerMatch = line.match(/^([A-Za-z\s()]+?):\s*(.*)/);
      if (speakerMatch) {
        const speaker = speakerMatch[1].trim();
        const text = speakerMatch[2].trim();

        if (currentSlide && currentSpeaker !== speaker) {
          slides.push(currentSlide);
          currentSlide = null;
        }

        if (!currentSlide) {
          currentSpeaker = speaker;
          currentSlide = {
            id: slides.length + 1,
            speaker: speaker,
            text: text,
            fullText: text,
          };
        } else {
          currentSlide.text += ' ' + text;
          currentSlide.fullText += '\n' + line;
        }
      } else if (currentSlide) {
        currentSlide.text += ' ' + line;
        currentSlide.fullText += '\n' + line;
      }

      const wordCount = (currentSlide?.text || '').split(/\s+/).length;
      if (wordCount > 100) {
        slides.push(currentSlide);
        currentSlide = null;
      }
    }

    if (currentSlide) {
      slides.push(currentSlide);
    }

    return slides;
  }

  enrichSlides(slides) {
    return slides.map((slide, index) => {
      const wordCount = slide.text.split(/\s+/).length;
      const speakingTime = this.estimateSpeakingTime(wordCount);

      return {
        ...slide,
        index: index,
        number: index + 1,
        title: this.generateSlideTitle(slide.text),
        wordCount: wordCount,
        speakingTime: speakingTime,
        duration: `~0:${speakingTime < 60 ? speakingTime : '59'}`,
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

    if (normalized.includes('employee') && normalized.includes('upset')) {
      return 'Indian employee looking upset or concerned after receiving critical feedback, corporate office setting, realistic emotion. Style: professional photography, 16:9 aspect ratio, high quality, cinematic lighting, vibrant colors, corporate training environment';
    }

    if (normalized.includes('meeting') || normalized.includes('discussion')) {
      return 'Professional ICC committee meeting in conference room with Indian members discussing, formal governance setting, business training. Style: professional photography, 16:9 aspect ratio, high quality, cinematic lighting, vibrant colors';
    }

    if (normalized.includes('workplace') && normalized.includes('conflict')) {
      return 'Indian workplace conflict resolution discussion, professional corporate setting, business training scenario. Style: professional photography, 16:9 aspect ratio, high quality, cinematic lighting, vibrant colors';
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
