const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const lines = envContent.split('\n');
    for (const line of lines) {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match && !line.startsWith('#')) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^"(.*)"$/, '$1');
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

function validateConfig(requireImageGen = true) {
  const errors = [];

  if (requireImageGen) {
    const hasMidjourney = process.env.MIDJOURNEY_API_KEY;
    const hasOpenAI = process.env.OPENAI_API_KEY;

    if (!hasMidjourney && !hasOpenAI) {
      errors.push('Neither MIDJOURNEY_API_KEY nor OPENAI_API_KEY found in .env file');
    }
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }
}

module.exports = {
  openai: {
    apiKey: () => process.env.OPENAI_API_KEY,
    model: 'dall-e-3',
    imageSize: '1920x1080',
    imageQuality: 'hd',
    revisedPrompt: true,
  },

  midjourney: {
    apiKey: () => process.env.MIDJOURNEY_API_KEY,
    provider: process.env.MIDJOURNEY_PROVIDER || 'apiframe',
    mode: 'fast',
    quality: 1,
    stylize: 750,
  },

  runwayML: {
    apiKey: () => process.env.RUNWAY_ML_API_KEY,
    endpoint: 'https://api.dev.runwayml.com/v1',
    apiVersion: '2024-11-06',
    model: 'gen4_turbo',
    ratio: '1280:720',
    duration: 8,
    pollInterval: 5000,
    maxRetries: 120,
    costPerVideo: 0.75,
  },

  tts: {
    service: process.env.TTS_SERVICE || 'google',
    apiKey: () => process.env.TTS_API_KEY,
  },

  video: {
    fps: parseInt(process.env.VIDEO_FPS || '24'),
    bitrate: process.env.VIDEO_BITRATE || '5000k',
    format: process.env.VIDEO_FORMAT || 'h264',
    preset: 'medium',
  },

  cache: {
    directory: process.env.CACHE_DIR || './cache/images',
    ttl: 30 * 24 * 60 * 60 * 1000,
  },

  output: {
    htmlFile: 'storyboard.html',
    videoFile: 'storyboard.mp4',
    slidesDir: 'slides/',
    metricsFile: 'generation-metrics.json',
  },

  debug: process.env.DEBUG === 'true',

  init: function(requireImageGen = true) {
    loadEnv();
    validateConfig(requireImageGen);
  },
};
