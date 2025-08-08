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
const CHANNEL_ID = 'UCLiIrzYVgwFD0rIEYQoGC5A';
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

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

(async () => {
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
    // crude extraction for first <entry>
    const entryMatch = rss.split('<entry>')[1];
    if (!entryMatch) throw new Error('No entries');
    const id = extract(entryMatch, /<yt:videoId>([^<]+)<\/yt:videoId>/);
    const title = extract(entryMatch, /<title>([^<]+)<\/title>/);
    const published = extract(entryMatch, /<published>([^<]+)<\/published>/);
    const thumb = id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '';
    if (id) {
      json.latestVideo = json.latestVideo || {};
      json.latestVideo.id = id;
      json.latestVideo.title = title || json.latestVideo.title || 'Latest Sermon';
      json.latestVideo.publishedAt = published || json.latestVideo.publishedAt || '';
      json.latestVideo.thumbnail = thumb;
      json.latestVideo.description = json.latestVideo.description || 'Latest sermon from our church.';
      fs.writeFileSync(DATA_PATH, JSON.stringify(json, null, 2));
      console.log('[fetch-latest-video] Updated latestVideo metadata');
    } else {
      console.log('[fetch-latest-video] No video ID found');
    }
  } catch (e) {
    console.log('[fetch-latest-video] Fetch skipped (non-fatal):', e.message);
  }
})();
