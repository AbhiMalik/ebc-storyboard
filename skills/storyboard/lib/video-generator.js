const fs = require('fs');
const path = require('path');
const https = require('https');
const config = require('./config.js');

class VideoGenerator {
  constructor() {
    this.cache = new Map();
    this.metrics = {
      videosGenerated: 0,
      totalCost: 0,
      totalTime: 0,
      failures: [],
    };
    this.ensureCacheDir();
  }

  ensureCacheDir() {
    const videoDir = path.join(config.cache.directory.replace('images', 'videos'));
    if (!fs.existsSync(videoDir)) {
      fs.mkdirSync(videoDir, { recursive: true });
    }
  }

  getCacheKey(imageFilepath, duration) {
    return require('crypto')
      .createHash('md5')
      .update(`${imageFilepath}-${duration}`)
      .digest('hex');
  }

  getCachedVideo(imageFilepath, duration) {
    const key = this.getCacheKey(imageFilepath, duration);
    const cacheFile = path.join(
      config.cache.directory.replace('images', 'videos'),
      `${key}.json`
    );

    if (fs.existsSync(cacheFile)) {
      try {
        const cached = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
        if (Date.now() - cached.timestamp < config.cache.ttl) {
          if (config.debug) console.log(`✓ Video cache hit: ${key}`);
          return cached.data;
        }
      } catch (e) {
        // Cache corrupted, ignore
      }
    }
    return null;
  }

  cacheVideo(imageFilepath, duration, videoData) {
    const key = this.getCacheKey(imageFilepath, duration);
    const cacheFile = path.join(
      config.cache.directory.replace('images', 'videos'),
      `${key}.json`
    );

    fs.writeFileSync(
      cacheFile,
      JSON.stringify({
        timestamp: Date.now(),
        imageFilepath,
        duration,
        data: videoData,
      }),
      'utf-8'
    );
  }

  async downloadVideo(url, filename) {
    return new Promise((resolve, reject) => {
      const videoDir = config.cache.directory.replace('images', 'videos');
      const filepath = path.join(videoDir, filename);
      const file = fs.createWriteStream(filepath);

      const downloadFile = (urlString) => {
        https
          .get(urlString, { timeout: 60000 }, (response) => {
            if (response.statusCode === 302 || response.statusCode === 301) {
              file.destroy();
              downloadFile(response.headers.location);
              return;
            }
            response.pipe(file);
          })
          .on('error', (err) => {
            file.destroy();
            reject(err);
          });
      };

      file.on('finish', () => {
        file.close();
        resolve(filepath);
      });

      file.on('error', (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });

      downloadFile(url);
    });
  }

  async submitRunwayJob(imageFilepath, duration) {
    const apiKey = process.env.RUNWAY_ML_API_KEY;
    if (!apiKey) {
      throw new Error('RUNWAY_ML_API_KEY not configured');
    }

    // Read image file and convert to base64 for submission
    let imageData;
    try {
      imageData = fs.readFileSync(imageFilepath);
    } catch (e) {
      throw new Error(`Cannot read image file: ${imageFilepath}`);
    }

    const requestBody = JSON.stringify({
      model: config.runwayML.model,
      promptImage: `data:image/png;base64,${imageData.toString('base64')}`,
      ratio: config.runwayML.ratio,
      duration: Math.min(duration, config.runwayML.duration),
    });

    return new Promise((resolve, reject) => {
      const url = new URL(`${config.runwayML.endpoint}/image_to_video`);
      const options = {
        hostname: url.hostname,
        port: 443,
        path: url.pathname + url.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': requestBody.length,
          Authorization: `Bearer ${apiKey}`,
          'X-Runway-Version': config.runwayML.apiVersion,
        },
        timeout: 30000,
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            if (res.statusCode !== 200 && res.statusCode !== 201) {
              reject(new Error(`Runway ML error (${res.statusCode}): ${data}`));
              return;
            }
            const result = JSON.parse(data);
            resolve(result);
          } catch (e) {
            reject(new Error(`Failed to parse Runway response: ${e.message}`));
          }
        });
      });

      req.on('error', (e) => reject(e));
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Runway ML API request timeout'));
      });

      req.write(requestBody);
      req.end();
    });
  }

  async fetchRunwayResult(taskId, maxRetries = 120) {
    const apiKey = process.env.RUNWAY_ML_API_KEY;
    let retries = 0;

    return new Promise((resolve, reject) => {
      const poll = () => {
        const url = new URL(`${config.runwayML.endpoint}/tasks/${taskId}`);
        const options = {
          hostname: url.hostname,
          port: 443,
          path: url.pathname + url.search,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'X-Runway-Version': config.runwayML.apiVersion,
          },
          timeout: 30000,
        };

        const req = https.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            try {
              if (res.statusCode !== 200) {
                reject(new Error(`Runway fetch error (${res.statusCode}): ${data}`));
                return;
              }

              const result = JSON.parse(data);

              if (config.debug) console.log(`Poll #${retries + 1}: status=${result.status}`);

              if (result.status === 'SUCCEEDED') {
                if (result.output && result.output.length > 0) {
                  console.log(`✓ Video generation succeeded`);
                  resolve(result);
                } else {
                  reject(new Error('No video output from Runway ML'));
                }
              } else if (result.status === 'QUEUED' || result.status === 'PROCESSING') {
                retries++;
                if (retries % 20 === 0) console.log(`  Polling... (${retries} attempts)`);
                if (retries >= maxRetries) {
                  reject(new Error('Video generation timeout - exceeded max retries'));
                  return;
                }
                setTimeout(poll, 5000);
              } else if (result.status === 'FAILED') {
                reject(new Error(`Video generation failed: ${result.error || 'Unknown error'}`));
              } else {
                retries++;
                if (config.debug) console.log(`  Unknown status: ${result.status}`);
                if (retries >= maxRetries) {
                  reject(new Error(`Video generation timeout (status: ${result.status})`));
                  return;
                }
                setTimeout(poll, 5000);
              }
            } catch (e) {
              reject(new Error(`Failed to parse Runway fetch response: ${e.message}`));
            }
          });
        });

        req.on('error', (e) => {
          console.error(`Request error: ${e.message}`);
          reject(e);
        });
        req.on('timeout', () => {
          req.destroy();
          reject(new Error('Runway fetch request timeout'));
        });

        req.end();
      };

      poll();
    });
  }

  async generateVideo(slideSpec, imageFilepath) {
    const startTime = Date.now();

    try {
      const duration = slideSpec.speakingTime || 10;

      // Check cache first
      const cached = this.getCachedVideo(imageFilepath, duration);
      if (cached) {
        return cached;
      }

      if (config.debug) console.log(`🎬 Submitting Runway job: ${slideSpec.title}`);

      const jobResponse = await this.submitRunwayJob(imageFilepath, duration);

      if (!jobResponse.id && !jobResponse.task_id) {
        throw new Error('No task ID returned from Runway ML');
      }

      const taskId = jobResponse.id || jobResponse.task_id;

      if (config.debug) console.log(`   Task ID: ${taskId}, polling for result...`);

      const result = await this.fetchRunwayResult(taskId);

      const videoUrl = result.output[0];
      const filename = `slide_${slideSpec.id}_${Date.now()}.mp4`;
      const filepath = await this.downloadVideo(videoUrl, filename);

      const videoData = {
        url: videoUrl,
        filepath: filepath,
        filename: filename,
        slideId: slideSpec.id,
        duration: duration,
        generatedAt: new Date().toISOString(),
      };

      this.cacheVideo(imageFilepath, duration, videoData);

      this.metrics.videosGenerated++;
      this.metrics.totalCost += 0.75;
      this.metrics.totalTime += Date.now() - startTime;

      return videoData;
    } catch (error) {
      this.metrics.failures.push({
        slideId: slideSpec.id,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }

  async generateVideos(slides, imageDataMap) {
    const results = {};

    for (const slide of slides) {
      if (!imageDataMap[slide.id] || imageDataMap[slide.id].type !== 'image') {
        results[slide.id] = { type: 'none' };
        continue;
      }

      const imageData = imageDataMap[slide.id];
      if (!imageData.filepath) {
        results[slide.id] = { type: 'placeholder', error: 'No image file' };
        continue;
      }

      try {
        const videoData = await this.generateVideo(slide, imageData.filepath);
        results[slide.id] = {
          type: 'video',
          ...videoData,
        };
      } catch (error) {
        console.error(`❌ Video generation failed for slide ${slide.id}: ${error.message}`);
        results[slide.id] = {
          type: 'placeholder',
          error: error.message,
        };
      }
    }

    return results;
  }

  getMetrics() {
    return {
      ...this.metrics,
      averageTime:
        this.metrics.videosGenerated > 0
          ? Math.round(this.metrics.totalTime / this.metrics.videosGenerated)
          : 0,
    };
  }

  reset() {
    this.cache.clear();
    this.metrics = {
      videosGenerated: 0,
      totalCost: 0,
      totalTime: 0,
      failures: [],
    };
  }
}

module.exports = VideoGenerator;
