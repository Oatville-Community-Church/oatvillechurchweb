#!/usr/bin/env node
/**
 * Fetch YouTube live/upcoming/completed stream status using YouTube Data API v3.
 * Writes a static snapshot to src/data/live-status.json for GitHub Pages hosting.
 * If API key is missing or request fails, this script exits non-fatally.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'churchInformation.json');
const LIVE_STATUS_PATH = path.join(__dirname, '..', 'src', 'data', 'live-status.json');
const API_KEY = process.env.YOUTUBE_API_KEY || '';
const FETCH_TIMEOUT_MS = Number(process.env.YOUTUBE_FETCH_TIMEOUT_MS || 15000);
const FETCH_RETRIES = Number(process.env.YOUTUBE_FETCH_RETRIES || 3);
const API_BASE = 'https://www.googleapis.com/youtube/v3/search';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'oatvillechurchweb-build-bot/1.0 (+https://oatville-community-church.org)',
        Accept: 'application/json'
      }
    }, res => {
      if (res.statusCode !== 200) {
        reject(new Error(`Status ${res.statusCode}`));
        res.resume();
        return;
      }
      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(new Error(`Invalid JSON response: ${error.message}`));
        }
      });
    });
    req.setTimeout(FETCH_TIMEOUT_MS, () => {
      req.destroy(new Error(`Request timeout after ${FETCH_TIMEOUT_MS}ms`));
    });
    req.on('error', reject);
  });
}

async function fetchJsonWithRetry(url) {
  let lastError = null;
  for (let attempt = 1; attempt <= FETCH_RETRIES; attempt += 1) {
    const separator = url.includes('?') ? '&' : '?';
    const cacheBustUrl = `${url}${separator}cb=${Date.now()}-${attempt}`;
    try {
      return await fetchJson(cacheBustUrl);
    } catch (error) {
      lastError = error;
      if (attempt < FETCH_RETRIES) {
        await sleep(300 * attempt);
      }
    }
  }
  throw lastError || new Error('Failed to fetch JSON');
}

function safeReadJson(file) {
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (_) {
    return null;
  }
}

function safeWriteJson(file, obj) {
  const newStr = `${JSON.stringify(obj, null, 2)}\n`;
  try {
    if (fs.existsSync(file)) {
      const existing = fs.readFileSync(file, 'utf8');
      if (existing === newStr) {
        console.log('[fetch-live-status] No change in live-status (skipped write)');
        return false;
      }
    }
  } catch (_) {
    // Continue with write.
  }
  fs.writeFileSync(file, newStr);
  return true;
}

function getChannelIdFromChurchData() {
  const churchData = safeReadJson(DATA_PATH) || {};
  return churchData['you-tube']?.['channel-id'] || 'UCLiIrzYVgwFD0rIEYQoGC5A';
}

function getBestThumb(snippet) {
  return (
    snippet?.thumbnails?.maxres?.url ||
    snippet?.thumbnails?.standard?.url ||
    snippet?.thumbnails?.high?.url ||
    snippet?.thumbnails?.medium?.url ||
    snippet?.thumbnails?.default?.url ||
    ''
  );
}

function normalizeResult(item) {
  if (!item || !item.id || !item.snippet) return null;
  const id = item.id.videoId || item.id;
  if (!id) return null;
  return {
    id,
    title: item.snippet.title || '',
    description: (item.snippet.description || '').slice(0, 500),
    publishedAt: item.snippet.publishedAt || '',
    thumbnail: getBestThumb(item.snippet),
    url: `https://www.youtube.com/watch?v=${id}`,
    liveBroadcastContent: item.snippet.liveBroadcastContent || 'none'
  };
}

async function fetchByEventType(channelId, eventType) {
  const params = new URLSearchParams({
    key: API_KEY,
    part: 'snippet',
    channelId,
    type: 'video',
    order: 'date',
    maxResults: '1',
    eventType
  });
  const url = `${API_BASE}?${params.toString()}`;
  const data = await fetchJsonWithRetry(url);
  if (data?.error) throw new Error(data.error.message || 'YouTube API error');
  const item = data?.items?.[0];
  return normalizeResult(item);
}

async function updateLiveStatus() {
  if (!API_KEY) {
    console.warn('[fetch-live-status] YOUTUBE_API_KEY not set; skipping live status fetch');
    return;
  }

  const channelId = getChannelIdFromChurchData();
  const nowIso = new Date().toISOString();

  try {
    const [liveNow, upcoming, latestCompleted] = await Promise.all([
      fetchByEventType(channelId, 'live'),
      fetchByEventType(channelId, 'upcoming'),
      fetchByEventType(channelId, 'completed')
    ]);

    const state = liveNow ? 'live' : (upcoming ? 'upcoming' : 'offline');
    const payload = {
      source: 'youtube-data-api-v3',
      channelId,
      fetchedAt: nowIso,
      state,
      liveNow: liveNow || null,
      upcoming: upcoming || null,
      latestCompleted: latestCompleted || null
    };

    const changed = safeWriteJson(LIVE_STATUS_PATH, payload);
    if (changed) {
      console.log(`[fetch-live-status] Updated live-status (${state})`);
    }
  } catch (error) {
    console.warn('[fetch-live-status] Fetch skipped (non-fatal):', error.message);
  }
}

if (require.main === module) {
  updateLiveStatus();
}

module.exports = { updateLiveStatus };
