// DEPRECATED: Replaced by lightweight bundle size reporter in vite.config.js.
// Safe to delete this file.
/**
 * Performance Monitoring
 * Track build times and identify bottlenecks
 */

const fs = require('fs').promises;
const path = require('path');

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      buildTime: 0,
      sassTime: 0,
      tailwindTime: 0,
      copyTime: 0,
      bundleSize: 0,
      timestamp: new Date().toISOString()
    };
  }

  async measureBundleSize() {
    const publicDir = path.resolve(__dirname, '..', 'public');
    let totalSize = 0;

    const getDirectorySize = async (dir) => {
      const files = await fs.readdir(dir, { withFileTypes: true });
      for (const file of files) {
        const filePath = path.join(dir, file.name);
        if (file.isDirectory()) {
          await getDirectorySize(filePath);
        } else {
          const stats = await fs.stat(filePath);
          totalSize += stats.size;
        }
      }
    };

    try {
      await getDirectorySize(publicDir);
      this.metrics.bundleSize = totalSize;
    } catch (error) {
      console.warn('Could not measure bundle size:', error.message);
    }
  }

  async saveMetrics() {
    const metricsPath = path.resolve(__dirname, '..', 'temp', 'performance.json');
    await fs.mkdir(path.dirname(metricsPath), { recursive: true });
    await fs.writeFile(metricsPath, JSON.stringify(this.metrics, null, 2));
  }

  async loadPreviousMetrics() {
    const metricsPath = path.resolve(__dirname, '..', 'temp', 'performance.json');
    try {
      const data = await fs.readFile(metricsPath, 'utf8');
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  async generateReport() {
    const previous = await this.loadPreviousMetrics();
    await this.measureBundleSize();

    console.log('\n📊 Performance Report:');
    console.log(`Bundle Size: ${(this.metrics.bundleSize / 1024).toFixed(2)} KB`);
    
    if (previous) {
      const sizeDiff = this.metrics.bundleSize - previous.bundleSize;
      const sizeChange = sizeDiff > 0 ? `+${(sizeDiff / 1024).toFixed(2)}` : `${(sizeDiff / 1024).toFixed(2)}`;
      console.log(`Size Change: ${sizeChange} KB`);
    }

    await this.saveMetrics();
  }
}

module.exports = PerformanceMonitor;
