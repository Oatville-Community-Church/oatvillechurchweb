#!/usr/bin/env node
// DEPRECATED: Replaced by `vite preview` for production preview.
// Safe to delete this file.
/**
 * Production Server Script
 * Optimized production build and server
 */

const path = require('path');
const express = require('express');
const compression = require('compression');

class ProductionServer {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.publicDir = path.join(this.projectRoot, 'public');
    this.port = process.env.PORT || 3000;
    this.app = express();
  }

  setupMiddleware() {
    // Enable gzip compression
    this.app.use(compression());

    // Security headers
    this.app.use((req, res, next) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      next();
    });

    // Cache static assets
    this.app.use(express.static(this.publicDir, {
      maxAge: '1y',
      setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache');
        }
      }
    }));

    // SPA fallback
    this.app.get('*', (req, res) => {
      res.sendFile(path.join(this.publicDir, 'index.html'));
    });
  }

  async start() {
    console.log('🚀 Starting production server...');
    
    this.setupMiddleware();

    return new Promise((resolve) => {
      this.server = this.app.listen(this.port, () => {
        console.log(`✨ Production server running at http://localhost:${this.port}`);
        console.log(`📁 Serving files from: ${this.publicDir}`);
        resolve();
      });
    });
  }

  stop() {
    if (this.server) {
      this.server.close();
      console.log('🛑 Production server stopped');
    }
  }
}

async function serve() {
  const server = new ProductionServer();
  
  try {
    await server.start();
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down production server...');
      server.stop();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Failed to start production server:', error.message);
    throw error;
  }
}

if (require.main === module) {
  serve().catch(error => {
    console.error('❌ Production server failed:', error);
    process.exit(1);
  });
}

module.exports = serve;
