const crypto = require('crypto');

// The exact inline scripts from the built HTML
const script1 = `import.meta.url;import("_").catch(()=>1);(async function*(){})().next();window.__vite_is_modern_browser=true`;
const script2 = `!function(){if(window.__vite_is_modern_browser)return;console.warn("vite: loading legacy chunks, syntax error above and the same error below should be ignored");var e=document.getElementById("vite-legacy-polyfill"),n=document.createElement("script");n.src=e.src,n.onload=function(){System.import(document.getElementById('vite-legacy-entry').getAttribute('data-src'))},document.body.appendChild(n)}();`;
const script3 = `!function(){var e=document,t=e.createElement("script");if(!("noModule"in t)&&"onbeforeload"in t){var n=!1;e.addEventListener("beforeload",(function(e){if(e.target===t)n=!0;else if(!e.target.hasAttribute("nomodule")||!n)return;e.preventDefault()}),!0),t.type="module",t.src=".",e.head.appendChild(t),t.remove()}}();`;
const script4 = `System.import(document.getElementById('vite-legacy-entry').getAttribute('data-src'))`;

console.log('Hash 1 (modern browser detection):', 'sha256-' + crypto.createHash('sha256').update(script1).digest('base64'));
console.log('Hash 2 (legacy polyfill loader):', 'sha256-' + crypto.createHash('sha256').update(script2).digest('base64'));
console.log('Hash 3 (nomodule detection):', 'sha256-' + crypto.createHash('sha256').update(script3).digest('base64'));
console.log('Hash 4 (legacy entry loader):', 'sha256-' + crypto.createHash('sha256').update(script4).digest('base64'));
