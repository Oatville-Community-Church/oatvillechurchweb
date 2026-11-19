/**
 * Content loader.
 *
 * Builds the single `churchData` object the site templates read from:
 *
 *   content/*.md            Pastor-editable pages/sections (YAML front matter)
 *   content/ministries/     One file per ministry (+ _index.md for the page-level text)
 *   src/data/site.json      Technical site + SEO settings (developer-owned)
 *   src/data/youtube.json   Written automatically by the YouTube fetch scripts
 *
 * Each content file's front matter keys are merged into the top level of churchData,
 * except where PAGE_KEYS nests a file under a named key. A markdown body is only
 * used for ministries, where it becomes `description` when the front matter has none.
 */
const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const MINISTRIES_DIR = path.join(CONTENT_DIR, 'ministries');
const DATA_DIR = path.join(ROOT, 'src', 'data');
const JSON_SOURCES = ['site.json', 'youtube.json'];

// content/<file>.md -> churchData.<key>.* (instead of merging into the top level)
const PAGE_KEYS = { 'plan-visit': 'planvisit' };

class ContentError extends Error {}

/** Split a markdown file into { data, body }. Throws ContentError with file + line info. */
function parseMarkdownFile(file) {
  const rel = path.relative(ROOT, file);
  const raw = fs.readFileSync(file, 'utf8').replace(/^﻿/, '').replace(/\r\n/g, '\n');
  const match = raw.match(/^---[ \t]*\n([\s\S]*?)\n---[ \t]*(?:\n([\s\S]*))?$/);
  if (!match) {
    throw new ContentError(`${rel}: missing front matter - the file must start with a line of --- and have a closing ---`);
  }
  const doc = YAML.parseDocument(match[1]);
  if (doc.errors.length) {
    const e = doc.errors[0];
    // +2 accounts for the opening --- line (YAML lines are 1-based)
    const line = e.linePos ? e.linePos[0].line + 1 : '?';
    throw new ContentError(`${rel}:${line}: ${e.message.split('\n')[0]}`);
  }
  const data = doc.toJS() ?? {};
  if (typeof data !== 'object' || Array.isArray(data)) {
    throw new ContentError(`${rel}: front matter must be a set of "key: value" lines`);
  }
  return { data, body: (match[2] || '').trim(), rel };
}

function listMarkdown(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.md')).sort().map(f => path.join(dir, f));
}

function loadMinistries() {
  const result = {};
  const indexFile = path.join(MINISTRIES_DIR, '_index.md');
  if (fs.existsSync(indexFile)) Object.assign(result, parseMarkdownFile(indexFile).data);
  result.ministries = listMarkdown(MINISTRIES_DIR)
    .filter(f => path.basename(f) !== '_index.md')
    .map(file => {
      const { data, body } = parseMarkdownFile(file);
      if (body && data.description === undefined) data.description = body;
      return data;
    });
  return result;
}

function loadContent() {
  const churchData = {};

  for (const file of listMarkdown(CONTENT_DIR)) {
    const { data } = parseMarkdownFile(file);
    const pageKey = PAGE_KEYS[path.basename(file, '.md')];
    if (pageKey) churchData[pageKey] = data;
    else Object.assign(churchData, data);
  }

  churchData.ministries = loadMinistries();

  for (const name of JSON_SOURCES) {
    const file = path.join(DATA_DIR, name);
    if (!fs.existsSync(file)) continue;
    try {
      Object.assign(churchData, JSON.parse(fs.readFileSync(file, 'utf8')));
    } catch (e) {
      throw new ContentError(`${path.relative(ROOT, file)}: invalid JSON - ${e.message}`);
    }
  }
  return churchData;
}

module.exports = { loadContent, parseMarkdownFile, listMarkdown, ContentError, CONTENT_DIR, MINISTRIES_DIR, PAGE_KEYS };
