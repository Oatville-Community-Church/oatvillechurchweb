
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
            iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
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
});
