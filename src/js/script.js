
function handleContactForm(event) {
    event.preventDefault();
    // Add form handling logic here
    alert('Thank you for your message! We\'ll get back to you soon.');
}

// YouTube API integration to get latest video
async function loadLatestVideo() {
    try {
        const channelId = 'UCLiIrzYVgwFD0rIEYQoGC5A';
        
        // Fallback to showing the channel's latest uploads playlist
        const iframe = document.getElementById('latest-video');
        if (iframe) {
            // This will show the most recent video from the channel
            iframe.src = `https://www.youtube.com/embed?listType=playlist&list=UU${channelId.substring(2)}&index=0`;
        }
    } catch (error) {
        console.log('Video loading error handled gracefully');
    }
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
});
