
function handleContactForm(event) {
    event.preventDefault();
    // Add form handling logic here
    alert('Thank you for your message! We\'ll get back to you soon.');
}

// Lite YouTube embed activation
function initLiteYouTube() {
    document.querySelectorAll('.lite-yt').forEach(el => {
        const videoId = el.getAttribute('data-videoid');
        if (!videoId) return;
        const activate = () => {
            if (el.classList.contains('lite-yt--activated')) return;
            el.classList.add('lite-yt--activated');
            const iframe = document.createElement('iframe');
            iframe.width = '100%';
            iframe.height = '100%';
            iframe.title = 'YouTube video player';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            iframe.allowFullscreen = true;
            iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&cc_load_policy=0&color=white`;
            el.appendChild(iframe);
        };
        el.addEventListener('click', activate);
        el.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activate();
            }
        });
    });
}

// Additional functionality for the church website
function initializeChurchWebsite() {
    try {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    } catch (error) {
        console.log('Navigation initialization error handled gracefully');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeChurchWebsite();
    initLiteYouTube();
    initYouTubeArchive();
    initMobileNav();
    // Human readable date on homepage latest video if present
    const lvDate = document.getElementById('latest-video-date');
    if (lvDate && lvDate.dataset.iso) {
        const d = new Date(lvDate.dataset.iso);
        if (!isNaN(d)) {
            lvDate.textContent = 'Published: ' + d.toLocaleDateString(undefined, { year:'numeric', month:'short', day:'numeric'});
        }
    }
});

// Mobile navigation (hamburger) toggle
function initMobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const panel = document.getElementById('primary-menu');
    if (!toggle || !panel) return;
    let lastFocus = null;
    function open() {
        panel.classList.remove('hidden');
        panel.classList.add('animate-slide-down');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Close main menu');
        toggle.querySelector('.menu-icon')?.classList.add('hidden');
        toggle.querySelector('.close-icon')?.classList.remove('hidden');
        lastFocus = document.activeElement;
        // Focus first link
        const firstLink = panel.querySelector('[data-nav-link]');
        firstLink && firstLink.focus();
        document.addEventListener('keydown', onKey);
    }
    function close() {
        panel.classList.add('hidden');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open main menu');
        toggle.querySelector('.menu-icon')?.classList.remove('hidden');
        toggle.querySelector('.close-icon')?.classList.add('hidden');
        document.removeEventListener('keydown', onKey);
        lastFocus && (lastFocus instanceof HTMLElement) && lastFocus.focus();
    }
    function onKey(e) {
        if (e.key === 'Escape') {
            close();
        } else if (e.key === 'Tab') {
            // Simple focus trap
            const focusable = panel.querySelectorAll('a[href], button:not([disabled])');
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    }
    toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        expanded ? close() : open();
    });
    // Close on link click (improve single-page nav experience)
    panel.addEventListener('click', e => {
        const link = e.target.closest('[data-nav-link]');
        if (link) {
            // Delay closing slightly to allow smooth scroll trigger
            setTimeout(close, 80);
        }
    });
    // Close on outside click
    document.addEventListener('click', e => {
        if (panel.classList.contains('hidden')) return;
        if (!panel.contains(e.target) && !toggle.contains(e.target)) {
            close();
        }
    });
}

// ------------------ YouTube Archive Page Logic ------------------
function initYouTubeArchive() {
    const grid = document.getElementById('video-grid');
    if (!grid) return; // not on archive page
    const statusEl = document.getElementById('video-status');
    const searchInput = document.getElementById('video-search');
    const clearBtn = document.getElementById('clear-search');
    const rssUpdated = document.getElementById('rss-updated');
    const modal = document.getElementById('video-modal');
    const modalPlayer = document.getElementById('video-modal-player');
    const modalTitle = document.getElementById('video-modal-title');
    const modalDate = document.getElementById('video-modal-date');
    const closeBtn = modal?.querySelector('[data-close-modal]');

    function closeModal() {
        if (!modal) return;
        modal.classList.add('hidden');
        modalPlayer.innerHTML = '';
    }
    closeBtn?.addEventListener('click', closeModal);
    modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    function parseRSS(xmlText) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlText, 'application/xml');
        const entries = Array.from(doc.getElementsByTagName('entry'));
        return entries.map(entry => {
            const get = tag => (entry.getElementsByTagName(tag)[0]?.textContent || '').trim();
            const id = get('yt:videoId') || get('videoId');
            const title = get('title');
            const published = get('published');
            const mediaGroup = entry.getElementsByTagName('media:group')[0];
            let description = '';
            if (mediaGroup) {
                const descEl = mediaGroup.getElementsByTagName('media:description')[0];
                description = (descEl?.textContent || '').trim();
            }
            const thumbnail = id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '';
            return { id, title, published, description, thumbnail };
        }).filter(v => v.id);
    }

    function render(videos) {
        if (!videos.length) {
            grid.innerHTML = '<p class="col-span-full text-center text-sm text-gray-500">No videos found.</p>';
            return;
        }
        grid.innerHTML = videos.map(v => `
          <article class="group bg-white rounded-lg shadow-xs ring-1 ring-black/5 overflow-hidden flex flex-col">
            <button class="relative aspect-video w-full text-left focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500" data-play="${v.id}" aria-label="Play video: ${v.title.replace(/"/g,'&quot;')}">
              <img src="${v.thumbnail}" alt="Thumbnail for ${v.title.replace(/"/g,'&quot;')}" loading="lazy" decoding="async" class="w-full h-full object-cover transition group-hover:scale-105" width="480" height="270" />
              <span class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-sm font-semibold">Play</span>
            </button>
            <div class="p-4 flex flex-col flex-1">
              <h3 class="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">${v.title}</h3>
              <p class="text-xs text-gray-500 mb-3">${formatDate(v.published)}</p>
              <p class="text-xs text-gray-600 line-clamp-3 flex-1">${escapeHtml(v.description).slice(0,160)}</p>
              <div class="mt-4 flex gap-2">
                <button data-inline-play="${v.id}" class="text-blue-600 text-xs hover:underline">Play Here</button>
                <a href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener" class="text-blue-600 text-xs hover:underline">Open on YouTube</a>
              </div>
            </div>
          </article>`).join('');
    }

    function formatDate(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        if (isNaN(d)) return '';
        return d.toLocaleDateString(undefined, { year:'numeric', month:'short', day:'numeric'});
    }
    function escapeHtml(str){return (str||'').replace(/[&<>"']/g,c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;' }[c]));}

    function applySearch(all) {
        const q = searchInput.value.trim().toLowerCase();
        const filtered = q ? all.filter(v => v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q)) : all;
        render(filtered);
        clearBtn.classList.toggle('hidden', !q);
    }

    function attachPlayHandlers(all) {
        grid.addEventListener('click', e => {
            const btn = e.target.closest('[data-play]');
            if (btn) {
                const id = btn.getAttribute('data-play');
                openModal(id, all.find(v=>v.id===id));
            }
            const inlineBtn = e.target.closest('[data-inline-play]');
            if (inlineBtn) {
                const id = inlineBtn.getAttribute('data-inline-play');
                inlinePlay(inlineBtn, id);
            }
        });
    }
    function inlinePlay(anchorEl, id) {
        const card = anchorEl.closest('article');
        if (!card) return;
        const top = card.querySelector('[data-play]');
        if (!top || top.classList.contains('is-playing')) return;
        top.classList.add('is-playing');
        top.innerHTML = `<iframe title=\"YouTube video player\" class=\"w-full h-full\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" allowfullscreen src=\"https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1\"></iframe>`;
    }
    function openModal(id, meta) {
        if (!modal) return;
        modalPlayer.innerHTML = `<iframe title=\"YouTube video player\" class=\"w-full h-full\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" allowfullscreen src=\"https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1\"></iframe>`;
        modalTitle.textContent = meta?.title || 'Video';
        modalDate.textContent = meta?.published ? formatDate(meta.published) : '';
        modal.classList.remove('hidden');
        closeBtn?.focus();
    }

    // Use Vite base path so GitHub Pages deployment (/repoName/) works.
    fetch(`${import.meta.env.BASE_URL}data/you-tube-rss.xml`)
      .then(r => r.ok ? r.text() : Promise.reject(r.status))
      .then(txt => {
        const videos = parseRSS(txt);
        if (rssUpdated) {
            rssUpdated.textContent = `Loaded ${videos.length} videos`;
        }
        render(videos);
        attachPlayHandlers(videos);
        searchInput?.addEventListener('input', () => applySearch(videos));
        clearBtn?.addEventListener('click', () => { searchInput.value=''; applySearch(videos); });
        statusEl.textContent = '';
      })
      .catch(err => {
        console.warn('Video RSS load failed', err);
        statusEl.textContent = 'Unable to load videos right now.';
      });
    statusEl.textContent = 'Loading videos...';
}
