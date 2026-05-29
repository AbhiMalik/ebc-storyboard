#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const config = require('./lib/config.js');
const ScriptParser = require('./lib/script-parser.js');
const ImageGenerator = require('./lib/image-generator.js');
const VideoGenerator = require('./lib/video-generator.js');
const HTMLBuilder = require('./lib/html-builder.js');

class StoryboardGenerator {
  constructor(requireImageGen = true, requireVideoGen = false) {
    config.init(requireImageGen || requireVideoGen);
    this.parser = new ScriptParser();
    this.imageGenerator = new ImageGenerator();
    this.videoGenerator = requireVideoGen ? new VideoGenerator() : null;
    this.htmlBuilder = new HTMLBuilder();
    this.startTime = Date.now();
  }

  async generate(scriptText, options = {}) {
    const outputName = options.outputName || 'storyboard';
    const generateImages = options.generateImages !== false;
    const generateVideos = options.generateVideos === true;

    console.log('\n📖 Parsing script...');
    const { slides, metadata } = this.parser.parse(scriptText);

    console.log(`✓ Parsed ${metadata.totalSlides} slides (~${metadata.estimatedDurationFormatted})`);

    let imageDataMap = {};

    if (generateImages) {
      console.log('\n🎨 Generating images...');

      const imageSlidesToGenerate = slides.filter(
        (s) => s.visualType === 'image'
      );

      console.log(`  ${imageSlidesToGenerate.length} image slides to generate`);

      imageDataMap = await this.imageGenerator.generateImages(
        imageSlidesToGenerate
      );
    }

    if (generateVideos && this.videoGenerator) {
      console.log('\n📹 Generating B-roll videos...');

      const videoDataMap = await this.videoGenerator.generateVideos(
        slides,
        imageDataMap
      );

      // Merge video data into image data map
      for (const [slideId, videoData] of Object.entries(videoDataMap)) {
        if (videoData.type === 'video') {
          imageDataMap[slideId] = { ...imageDataMap[slideId], ...videoData };
        }
      }
    }

    console.log('\n📝 Building HTML...');

    // Copy video files next to HTML for portability
    const videoDir = path.join(process.cwd(), `${outputName}_videos`);
    const updatedImageMap = JSON.parse(JSON.stringify(imageDataMap));

    for (const [slideId, data] of Object.entries(imageDataMap)) {
      if (data && data.type === 'video' && data.filepath) {
        if (!fs.existsSync(videoDir)) {
          fs.mkdirSync(videoDir, { recursive: true });
        }
        const videoFilename = path.basename(data.filepath);
        const outputVideoPath = path.join(videoDir, videoFilename);

        try {
          fs.copyFileSync(data.filepath, outputVideoPath);
          updatedImageMap[slideId].filepath = path.join(`${outputName}_videos`, videoFilename);
        } catch (e) {
          if (config.debug) console.log(`Warning: Could not copy video: ${e.message}`);
        }
      }
    }

    const html = this.htmlBuilder.build(outputName, slides, updatedImageMap);

    const outputPath = path.join(process.cwd(), `${outputName}.html`);
    fs.writeFileSync(outputPath, html, 'utf-8');
    console.log(`✓ Storyboard saved: ${outputPath}`);

    this.generateMetrics(outputName, metadata, imageDataMap);
    return { outputPath, html, slides, imageDataMap };
  }

  generateMetrics(outputName, metadata, imageDataMap) {
    const metrics = {
      title: outputName,
      generatedAt: new Date().toISOString(),
      totalTime: Math.round((Date.now() - this.startTime) / 1000),
      metadata: metadata,
      imageMetrics: this.imageGenerator.getMetrics(),
    };

    if (this.videoGenerator) {
      metrics.videoMetrics = this.videoGenerator.getMetrics();
    }

    metrics.imageDataMap = imageDataMap;

    const metricsPath = path.join(
      process.cwd(),
      `${outputName}-metrics.json`
    );

    fs.writeFileSync(metricsPath, JSON.stringify(metrics, null, 2), 'utf-8');
    console.log(`\n📊 Metrics saved: ${metricsPath}`);

    console.log(`\n✨ Generation complete!`);
    console.log(`   Slides: ${metadata.totalSlides}`);
    console.log(`   Duration: ~${metadata.estimatedDurationFormatted}`);
    console.log(`   Images generated: ${this.imageGenerator.metrics.imagesGenerated}`);
    let totalCost = this.imageGenerator.metrics.totalCost;
    if (this.videoGenerator) {
      console.log(`   Videos generated: ${this.videoGenerator.metrics.videosGenerated}`);
      totalCost += this.videoGenerator.metrics.totalCost;
    }
    console.log(`   Total cost: $${totalCost.toFixed(2)}`);
    console.log(`   Time: ${metrics.totalTime}s`);
  }

  static async fromFile(scriptPath, options = {}) {
    if (!fs.existsSync(scriptPath)) {
      throw new Error(`Script file not found: ${scriptPath}`);
    }

    const scriptText = fs.readFileSync(scriptPath, 'utf-8');
    const generator = new StoryboardGenerator();

    const outputName = options.outputName || path.basename(scriptPath, path.extname(scriptPath));

    return generator.generate(scriptText, {
      ...options,
      outputName,
    });
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
Usage: node storyboard-generator.js <script-file> [options]

Options:
  --no-images     Skip image generation (use placeholder SVGs)
  --video         Generate B-roll videos (requires Runway ML API key)
  --output NAME   Output filename (default: storyboard)

Example:
  node storyboard-generator.js script.txt
  node storyboard-generator.js script.txt --video
  node storyboard-generator.js script.txt --output my-video --video
  node storyboard-generator.js script.txt --no-images
    `);
    return;
  }

  try {
    const scriptFile = args[0];
    const generateImages = !args.includes('--no-images');
    const generateVideos = args.includes('--video');
    const options = {
      generateImages,
      generateVideos,
    };

    const outputIndex = args.indexOf('--output');
    if (outputIndex !== -1 && outputIndex < args.length - 1) {
      options.outputName = args[outputIndex + 1];
    }

    const generator = new StoryboardGenerator(generateImages, generateVideos);
    await generator.generate(
      fs.readFileSync(scriptFile, 'utf-8'),
      {
        ...options,
        outputName: options.outputName || path.basename(scriptFile, path.extname(scriptFile)),
      }
    );
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = StoryboardGenerator;
