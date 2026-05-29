const fs = require('fs');
const path = require('path');
const https = require('https');
const config = require('./config.js');

class ImageGenerator {
  constructor() {
    this.cache = new Map();
    this.metrics = {
      imagesGenerated: 0,
      totalCost: 0,
      totalTime: 0,
      failures: [],
    };
    this.ensureCacheDir();
  }

  ensureCacheDir() {
    if (!fs.existsSync(config.cache.directory)) {
      fs.mkdirSync(config.cache.directory, { recursive: true });
    }
  }

  buildPrompt(slideSpec) {
    const basePrompt = slideSpec.imagePrompt || slideSpec.title;

    const enhancements = [
      'professional photography',
      '16:9 aspect ratio',
      'high quality',
      'cinematic lighting',
      'vibrant colors',
      'corporate training environment',
    ];

    return `${basePrompt}. Style: ${enhancements.join(', ')}`;
  }

  getCacheKey(prompt) {
    return require('crypto').createHash('md5').update(prompt).digest('hex');
  }

  getCachedImage(prompt) {
    const key = this.getCacheKey(prompt);
    const cacheFile = path.join(config.cache.directory, `${key}.json`);

    if (fs.existsSync(cacheFile)) {
      try {
        const cached = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
        if (Date.now() - cached.timestamp < config.cache.ttl) {
          if (config.debug) console.log(`✓ Cache hit: ${key}`);
          return cached.data;
        }
      } catch (e) {
        // Cache corrupted, ignore
      }
    }
    return null;
  }

  cacheImage(prompt, imageData) {
    const key = this.getCacheKey(prompt);
    const cacheFile = path.join(config.cache.directory, `${key}.json`);

    fs.writeFileSync(cacheFile, JSON.stringify({
      timestamp: Date.now(),
      prompt: prompt,
      data: imageData,
    }), 'utf-8');
  }

  async downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
      const filepath = path.join(config.cache.directory, filename);
      const file = fs.createWriteStream(filepath);

      const downloadFile = (urlString) => {
        https.get(urlString, { timeout: 30000 }, (response) => {
          if (response.statusCode === 302 || response.statusCode === 301) {
            file.destroy();
            downloadFile(response.headers.location);
            return;
          }
          response.pipe(file);
        }).on('error', (err) => {
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

  async submitMidjourneyJob(enhancedPrompt) {
    const apiKey = process.env.MIDJOURNEY_API_KEY;
    if (!apiKey) {
      throw new Error('MIDJOURNEY_API_KEY not configured');
    }

    const requestBody = JSON.stringify({
      prompt: enhancedPrompt,
      model: 'midjourney',
    });

    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.apiframe.ai',
        port: 443,
        path: '/v2/images/generate',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': requestBody.length,
          'X-API-Key': apiKey,
        },
        timeout: 30000,
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            if (res.statusCode !== 200 && res.statusCode !== 201 && res.statusCode !== 202) {
              reject(new Error(`APIFRAME error (${res.statusCode}): ${data}`));
              return;
            }
            const result = JSON.parse(data);
            resolve(result);
          } catch (e) {
            reject(new Error(`Failed to parse APIFRAME response: ${e.message}`));
          }
        });
      });

      req.on('error', (e) => reject(e));
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('APIFRAME API request timeout'));
      });

      req.write(requestBody);
      req.end();
    });
  }

  async fetchMidjourneyResult(jobId, maxRetries = 120) {
    const apiKey = process.env.MIDJOURNEY_API_KEY;
    let retries = 0;

    return new Promise((resolve, reject) => {
      const poll = () => {
        const options = {
          hostname: 'api.apiframe.ai',
          port: 443,
          path: `/v2/jobs/${jobId}`,
          method: 'GET',
          headers: {
            'X-API-Key': apiKey,
          },
          timeout: 30000,
        };

        const req = https.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => { data += chunk; });
          res.on('end', () => {
            try {
              if (res.statusCode !== 200) {
                console.error(`API returned ${res.statusCode}: ${data}`);
              }
              const result = JSON.parse(data);

              if (config.debug) console.log(`Poll #${retries + 1}: status=${result.status}`);

              if ((result.status === 'SUCCEEDED' || result.status === 'COMPLETED') && (result.result?.image_urls || result.result?.images)) {
                const imageUrls = result.result.image_urls || result.result.images;
                console.log(`✓ Image generation succeeded: ${imageUrls.length} images`);
                resolve({ ...result, image_urls: imageUrls });
              } else if (result.status === 'QUEUED' || result.status === 'PROCESSING') {
                retries++;
                if (retries % 10 === 0) console.log(`  Polling... (${retries} attempts)`);
                if (retries >= maxRetries) {
                  reject(new Error('Midjourney generation timeout - exceeded max retries'));
                  return;
                }
                setTimeout(poll, 3000);
              } else if (result.status === 'FAILED') {
                reject(new Error(`Midjourney generation failed: ${result.error || 'Unknown error'}`));
              } else {
                retries++;
                if (config.debug) console.log(`  Unknown status: ${result.status}`);
                if (retries >= maxRetries) {
                  reject(new Error(`Midjourney generation timeout (status: ${result.status})`));
                  return;
                }
                setTimeout(poll, 3000);
              }
            } catch (e) {
              reject(new Error(`Failed to parse APIFRAME fetch response: ${e.message}`));
            }
          });
        });

        req.on('error', (e) => {
          console.error(`Request error: ${e.message}`);
          reject(e);
        });
        req.on('timeout', () => {
          req.destroy();
          reject(new Error('APIFRAME fetch request timeout'));
        });

        req.end();
      };

      poll();
    });
  }

  async callMidjourney(enhancedPrompt) {
    if (config.debug) console.log(`🎨 Submitting Midjourney job: ${enhancedPrompt.substring(0, 50)}...`);

    const jobResponse = await this.submitMidjourneyJob(enhancedPrompt);

    if (!jobResponse.jobId) {
      throw new Error('No jobId returned from Midjourney');
    }

    if (config.debug) console.log(`   Job ID: ${jobResponse.jobId}, polling for result...`);

    const result = await this.fetchMidjourneyResult(jobResponse.jobId);
    return result;
  }

  async generateImage(slideSpec) {
    const startTime = Date.now();

    try {
      const enhancedPrompt = this.buildPrompt(slideSpec);

      const cached = this.getCachedImage(enhancedPrompt);
      if (cached) {
        return cached;
      }

      if (config.debug) console.log(`🎨 Generating image: ${slideSpec.title}`);

      const response = await this.callMidjourney(enhancedPrompt);

      if (!response.image_urls || response.image_urls.length === 0) {
        throw new Error('No images returned from Midjourney');
      }

      const imageUrl = response.image_urls[0];
      const filename = `slide_${slideSpec.id}_${Date.now()}.png`;
      const filepath = await this.downloadImage(imageUrl, filename);

      const imageData = {
        url: imageUrl,
        filepath: filepath,
        filename: filename,
        prompt: enhancedPrompt,
        provider: 'midjourney',
        generatedAt: new Date().toISOString(),
      };

      this.cacheImage(enhancedPrompt, imageData);

      this.metrics.imagesGenerated++;
      this.metrics.totalCost += 0.022;
      this.metrics.totalTime += (Date.now() - startTime);

      return imageData;
    } catch (error) {
      this.metrics.failures.push({
        slideId: slideSpec.id,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }

  async generateImages(slides) {
    const results = {};

    for (const slide of slides) {
      if (slide.visualType === 'instructor-shot') {
        results[slide.id] = { type: 'instructor-shot' };
        continue;
      }

      if (slide.visualType === 'animatic') {
        results[slide.id] = { type: 'animatic' };
        continue;
      }

      if (slide.visualType === 'image') {
        try {
          const imageData = await this.generateImage(slide);
          results[slide.id] = {
            type: 'image',
            ...imageData,
          };
        } catch (error) {
          console.error(`❌ Image generation failed for slide ${slide.id}: ${error.message}`);
          results[slide.id] = {
            type: 'placeholder',
            error: error.message,
          };
        }
      }
    }

    return results;
  }

  getMetrics() {
    return {
      ...this.metrics,
      averageTime: this.metrics.imagesGenerated > 0
        ? Math.round(this.metrics.totalTime / this.metrics.imagesGenerated)
        : 0,
    };
  }

  reset() {
    this.cache.clear();
    this.metrics = {
      imagesGenerated: 0,
      totalCost: 0,
      totalTime: 0,
      failures: [],
    };
  }
}

module.exports = ImageGenerator;
