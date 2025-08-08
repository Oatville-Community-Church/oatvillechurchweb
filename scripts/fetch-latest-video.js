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

function fetchRss(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode !== 200) {
        reject(new Error(`Status ${res.statusCode}`));
        res.resume();
        return;
      }
      let data = '';
      res.on('data', d => (data += d));
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
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
    // Persist raw RSS snapshot for debugging / potential future parsing improvements
    try {
      fs.writeFileSync(RSS_SAVE_PATH, rss);
    } catch (e) {
      console.warn('[fetch-latest-video] Failed to write RSS file:', e.message);
    }
    // first <entry>
    const entryMatch = rss.split('<entry>')[1];
    if (!entryMatch) throw new Error('No entries');
    const id = extract(entryMatch, /<yt:videoId>([^<]+)<\/yt:videoId>/);
    const title = decodeHtmlEntities(extract(entryMatch, /<title>([^<]+)<\/title>/));
    const published = extract(entryMatch, /<published>([^<]+)<\/published>/);
    // Description in media:group (may span lines)
    const mediaGroup = extract(entryMatch, /<media:group>([\s\S]*?)<\/media:group>/);
    const description = decodeHtmlEntities(extract(mediaGroup, /<media:description>([\s\S]*?)<\/media:description>/).trim());
    const thumb = id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '';
    if (id) {
      json.latestVideo = json.latestVideo || {};
      json.latestVideo.id = id;
      if (title) json.latestVideo.title = title;
      if (published) json.latestVideo.publishedAt = published;
      if (thumb) json.latestVideo.thumbnail = thumb;
      if (description) json.latestVideo.description = description.slice(0, 500); // keep concise
  const nowIso = new Date().toISOString();
  json.latestVideo.fetchedAt = nowIso;
  // Track RSS fetch timestamp inside you-tube section
  json['you-tube'] = json['you-tube'] || {};
  json['you-tube'].rssFetchedAt = nowIso;
      safeWriteJson(DATA_PATH, json);
      console.log('[fetch-latest-video] Updated latestVideo metadata for', id);
    } else {
      console.log('[fetch-latest-video] No video ID found');
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
