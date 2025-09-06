const crypto = require('crypto');

// The exact inline scripts from the built HTML
const script1 = `import.meta.url;import("_").catch(()=>1);(async function*(){})().next();window.__vite_is_modern_browser=true`;
const script2 = `!function(){if(window.__vite_is_modern_browser)return;console.warn("vite: loading legacy chunks, syntax error above and the same error below should be ignored");var e=document.getElementById("vite-legacy-polyfill"),n=document.createElement("script");n.src=e.src,n.onload=function(){System.import(document.getElementById('vite-legacy-entry').getAttribute('data-src'))},document.body.appendChild(n)}();`;

console.log('Hash 1 (modern browser detection):', 'sha256-' + crypto.createHash('sha256').update(script1).digest('base64'));
console.log('Hash 2 (legacy polyfill loader):', 'sha256-' + crypto.createHash('sha256').update(script2).digest('base64'));
