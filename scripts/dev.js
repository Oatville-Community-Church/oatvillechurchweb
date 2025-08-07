#!/usr/bin/env node

/**
 * Development Server Script
 * Starts the development server with hot reloading and file watching
 */

const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');
const express = require('express');
const chokidar = require('chokidar');

class DevServer {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.srcDir = path.join(this.projectRoot, 'src');
    this.publicDir = path.join(this.projectRoot, 'public');
    this.port = process.env.PORT || 3000;
    this.app = express();
    this.isBuilding = false;
    this.buildQueue = [];
  }

  async startServer() {
    // Serve static files
    this.app.use(express.static(this.publicDir));
    this.app.use('/assets', express.static(path.join(this.srcDir, 'assets')));

    // SPA fallback
    this.app.get('*', (req, res) => {
      res.sendFile(path.join(this.publicDir, 'index.html'));
    });

    return new Promise((resolve) => {
      this.server = this.app.listen(this.port, () => {
        console.log(`🚀 Development server running at http://localhost:${this.port}`);
        resolve();
      });
    });
  }

  async runBuild() {
    if (this.isBuilding) {
      this.buildQueue.push(() => this.runBuild());
      return;
    }

    this.isBuilding = true;
    console.log('🔄 Rebuilding...');

    try {
      const build = require('./build.js');
      await build();
      console.log('✓ Rebuild completed');
      
      // Process queued builds
      if (this.buildQueue.length > 0) {
        const nextBuild = this.buildQueue.shift();
        setImmediate(nextBuild);
      }
    } catch (error) {
      console.error('❌ Rebuild failed:', error.message);
    } finally {
      this.isBuilding = false;
    }
  }

  setupWatcher() {
    const watchPaths = [
      path.join(this.srcDir, '**/*'),
      path.join(this.projectRoot, 'input.css'),
      path.join(this.projectRoot, 'tailwind.config.js')
    ];

    const watcher = chokidar.watch(watchPaths, {
      ignored: [
        /node_modules/,
        /\.git/,
        /\.cache/,
        /public/,
        /dist/
      ],
      persistent: true,
      ignoreInitial: true
    });

    watcher.on('change', (filePath) => {
      console.log(`📝 File changed: ${path.relative(this.projectRoot, filePath)}`);
      this.runBuild();
    });

    watcher.on('add', (filePath) => {
      console.log(`➕ File added: ${path.relative(this.projectRoot, filePath)}`);
      this.runBuild();
    });

    watcher.on('unlink', (filePath) => {
      console.log(`➖ File removed: ${path.relative(this.projectRoot, filePath)}`);
      this.runBuild();
    });

    console.log('👀 File watcher started');
    return watcher;
  }

  async start() {
    console.log('🔧 Starting development environment...\n');

    try {
      // Initial build
      await this.runBuild();
      
      // Start server
      await this.startServer();
      
      // Setup file watcher
      this.watcher = this.setupWatcher();
      
      console.log('\n✨ Development environment ready!');
      console.log('📝 Making changes to files will trigger automatic rebuilds');
      console.log('🛑 Press Ctrl+C to stop the development server');
      
      // Handle graceful shutdown
      process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down development server...');
        this.cleanup();
        process.exit(0);
      });
      
    } catch (error) {
      console.error('❌ Failed to start development environment:', error.message);
      throw error;
    }
  }

  cleanup() {
    if (this.watcher) {
      this.watcher.close();
    }
    if (this.server) {
      this.server.close();
    }
  }
}

async function dev() {
  const server = new DevServer();
  await server.start();
}

if (require.main === module) {
  dev().catch(error => {
    console.error('❌ Development server failed:', error);
    process.exit(1);
  });
}

module.exports = dev;
