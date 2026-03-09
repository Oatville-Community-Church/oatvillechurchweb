#!/usr/bin/env node
/**
 * Fetch latest YouTube video metadata (RSS-based, no API key) and persist
 * simplified info into churchInformation.json (latestVideo fields).
 * If fetch fails, leaves existing data untouched for stability.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'churchInformation.json');
const FETCH_TIMEOUT_MS = Number(process.env.YOUTUBE_FETCH_TIMEOUT_MS || 15000);
const FETCH_RETRIES = Number(process.env.YOUTUBE_FETCH_RETRIES || 3);
// Load channel id dynamically from data file (fallback to constant).
let CHANNEL_ID = 'UCLiIrzYVgwFD0rIEYQoGC5A';
try {
  if (fs.existsSync(DATA_PATH)) {
    const d = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    if (d['you-tube'] && d['you-tube']['channel-id']) CHANNEL_ID = d['you-tube']['channel-id'];
  }
} catch (_) { }
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const RSS_SAVE_PATH = path.join(__dirname, '..', 'src', 'data', 'you-tube-rss.xml');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchText(url, redirectCount = 0) {
  const MAX_REDIRECTS = 3;
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'oatvillechurchweb-build-bot/1.0 (+https://oatville-community-church.org)',
        'Accept': 'application/atom+xml,application/xml,text/xml;q=0.9,*/*;q=0.8',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        'Accept-Encoding': 'identity'
      }
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        if (redirectCount >= MAX_REDIRECTS) {
          reject(new Error('Too many redirects'));
          res.resume();
          return;
        }
        const redirectUrl = new URL(res.headers.location, url).toString();
        res.resume();
        fetchText(redirectUrl, redirectCount + 1).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Status ${res.statusCode}`));
        res.resume();
        return;
      }
      let data = '';
      res.setEncoding('utf8');
      res.on('data', d => (data += d));
      res.on('end', () => resolve(data));
    });
    req.setTimeout(FETCH_TIMEOUT_MS, () => {
      req.destroy(new Error(`Request timeout after ${FETCH_TIMEOUT_MS}ms`));
    });
    req.on('error', reject);
  });
}

async function fetchRss(url) {
  let lastError = null;
  for (let attempt = 1; attempt <= FETCH_RETRIES; attempt += 1) {
    const cacheBust = `${Date.now()}-${attempt}`;
    const sep = url.includes('?') ? '&' : '?';
    const requestUrl = `${url}${sep}cb=${cacheBust}`;
    try {
      return await fetchText(requestUrl);
    } catch (error) {
      lastError = error;
      if (attempt < FETCH_RETRIES) {
        await sleep(300 * attempt);
      }
    }
  }
  throw lastError || new Error('Failed to fetch RSS');
}

function extract(str, re) {
  const m = re.exec(str);
  return m ? m[1] : '';
}

function safeWriteJson(file, obj) {
  const newStr = JSON.stringify(obj, null, 2);
  try {
    if (fs.existsSync(file)) {
      const existing = fs.readFileSync(file, 'utf8');
      if (existing === newStr) {
        console.log('[fetch-latest-video] No change in latestVideo (skipped write)');
        return;
      }
    }
  } catch (_) {
    // ignore diff check errors; proceed with write
  }
  fs.writeFileSync(file, newStr);
}

function decodeHtmlEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function parseEntriesFromRss(rss) {
  const fallbackDescription = 'Watch the latest message from Oatville Community Church on YouTube.';
  const entries = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let entryMatch;
  while ((entryMatch = entryRegex.exec(rss)) !== null) {
    const rawEntry = entryMatch[1];
    const id = extract(rawEntry, /<yt:videoId>([^<]+)<\/yt:videoId>/);
    const title = decodeHtmlEntities(extract(rawEntry, /<title>([^<]+)<\/title>/));
    const published = extract(rawEntry, /<published>([^<]+)<\/published>/);
    const mediaGroup = extract(rawEntry, /<media:group>([\s\S]*?)<\/media:group>/);
    const description = decodeHtmlEntities(extract(mediaGroup, /<media:description>([\s\S]*?)<\/media:description>/).trim());
    if (!id) continue;
    entries.push({
      id,
      title,
      publishedAt: published,
      description: description ? description.slice(0, 500) : fallbackDescription,
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
    });
  }
  return entries;
}

function normalizeRssSnapshot(rss) {
  // Remove cache-busting query param echoed by YouTube in feed self-link.
  return rss
    .replace(/&amp;cb=\d+(?:-\d+)?/g, '')
    .replace(/&cb=\d+(?:-\d+)?/g, '');
}

function isLikelyLivestream(entry) {
  const haystack = `${entry?.title || ''} ${entry?.description || ''}`.toLowerCase();
  return /\blive\s*stream\b|\blivestream\b/.test(haystack);
}

function mergeVideoRecord(prev, next, fetchedAtIso) {
  const merged = {
    ...(prev || {}),
    id: next.id,
    title: typeof next.title === 'string' ? next.title : (prev?.title || ''),
    description: typeof next.description === 'string' ? next.description : (prev?.description || ''),
    thumbnail: typeof next.thumbnail === 'string' ? next.thumbnail : (prev?.thumbnail || ''),
    publishedAt: typeof next.publishedAt === 'string' ? next.publishedAt : (prev?.publishedAt || '')
  };
  const changed =
    (prev?.id || '') !== (merged.id || '') ||
    (prev?.title || '') !== (merged.title || '') ||
    (prev?.description || '') !== (merged.description || '') ||
    (prev?.thumbnail || '') !== (merged.thumbnail || '') ||
    (prev?.publishedAt || '') !== (merged.publishedAt || '');
  if (changed) {
    merged.fetchedAt = fetchedAtIso;
  } else if (prev?.fetchedAt) {
    merged.fetchedAt = prev.fetchedAt;
  }
  return { merged, changed };
}

async function updateLatestVideo() {
  if (!fs.existsSync(DATA_PATH)) {
    console.warn('[fetch-latest-video] Data file missing, aborting');
    return;
  }
  let json;
  try { json = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8')); } catch (e) {
    console.warn('[fetch-latest-video] Could not parse JSON');
    return;
  }
  try {
    const rss = await fetchRss(RSS_URL);
    const normalizedRss = normalizeRssSnapshot(rss);
    // Persist raw RSS snapshot for debugging / potential future parsing improvements
    try {
      fs.writeFileSync(RSS_SAVE_PATH, normalizedRss);
    } catch (e) {
      console.warn('[fetch-latest-video] Failed to write RSS file:', e.message);
    }
    const entries = parseEntriesFromRss(normalizedRss);
    if (!entries.length) throw new Error('No entries');

    const latestVideo = entries[0];
    const latestStream = entries.find(isLikelyLivestream);
    const nowIso = new Date().toISOString();

    let hasChanges = false;
    const latestVideoResult = mergeVideoRecord(json.latestVideo, latestVideo, nowIso);
    json.latestVideo = latestVideoResult.merged;
    hasChanges = hasChanges || latestVideoResult.changed;

    if (latestStream) {
      const latestStreamResult = mergeVideoRecord(json.latestStream, latestStream, nowIso);
      json.latestStream = latestStreamResult.merged;
      hasChanges = hasChanges || latestStreamResult.changed;
    }

    // Keep an update marker for cache busting and diagnostics if something changed,
    // or if this marker has never been initialized before.
    json['you-tube'] = json['you-tube'] || {};
    if (hasChanges || !json['you-tube'].rssFetchedAt) {
      json['you-tube'].rssFetchedAt = nowIso;
      hasChanges = true;
    }

    if (hasChanges) {
      safeWriteJson(DATA_PATH, json);
      console.log('[fetch-latest-video] Updated latest YouTube metadata for', latestVideo.id);
    } else {
      console.log('[fetch-latest-video] No channel changes detected (skipped write)');
    }
  } catch (e) {
    console.log('[fetch-latest-video] Fetch skipped (non-fatal):', e.message);
  }
}

// Allow importing as a module (e.g., future Vite plugin) or running directly
if (require.main === module) {
  updateLatestVideo();
}

module.exports = { updateLatestVideo };
