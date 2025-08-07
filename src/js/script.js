
function handleContactForm(event) {
    event.preventDefault();
    // Add form handling logic here
    alert('Thank you for your message! We\'ll get back to you soon.');
}

// YouTube API integration to get latest video
async function loadLatestVideo() {
    try {
        const channelId = 'UCLiIrzYVgwFD0rIEYQoGC5A';
        const iframe = document.getElementById('latest-video');
        
        if (!iframe) return;

        // Method 1: Try to use YouTube RSS feed to get latest video
        try {
            const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`)}`);
            const data = await response.json();
            const xmlText = data.contents;
            
            // Parse XML to get latest video ID
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
            const entries = xmlDoc.querySelectorAll('entry');
            
            if (entries.length > 0) {
                const latestEntry = entries[0];
                const videoUrl = latestEntry.querySelector('link')?.getAttribute('href');
                if (videoUrl) {
                    const videoId = videoUrl.split('v=')[1];
                    if (videoId) {
                        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`;
                        console.log('Latest video loaded successfully');
                        return;
                    }
                }
            }
        } catch (rssError) {
            console.log('RSS method failed, trying fallback');
        }

        // Method 2: Fallback to playlist method
        const uploadsPlaylistId = `UU${channelId.substring(2)}`;
        iframe.src = `https://www.youtube.com/embed?listType=playlist&list=${uploadsPlaylistId}&index=0&autoplay=0&rel=0&modestbranding=1`;
        console.log('Fallback playlist method used');
        
    } catch (error) {
        console.log('Video loading error handled gracefully');
        // Ultimate fallback - just embed the channel
        const iframe = document.getElementById('latest-video');
        if (iframe) {
            iframe.src = `https://www.youtube.com/embed?listType=playlist&list=UULiIrzYVgwFD0rIEYQoGC5A&index=0`;
        }
    }
}

// Refresh video every 30 minutes to check for new content
function startVideoRefreshTimer() {
    setInterval(() => {
        loadLatestVideo();
        console.log('Video refresh attempted');
    }, 30 * 60 * 1000); // 30 minutes
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
    loadLatestVideo();
    startVideoRefreshTimer();
});
