// Main application entry for Vite
// Tailwind v4-first styles (theme + utilities) live in tailwind.css
import './tailwind.css';
import './js/script.js';

// Example: expose build info fetch (can be used later)
export async function fetchBuildInfo() {
  try {
    const res = await fetch('/build-info.json');
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}
