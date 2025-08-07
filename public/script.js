
function handleContactForm(event) {
    event.preventDefault();
    // Add form handling logic here
    alert('Thank you for your message! We\'ll get back to you soon.');
}

// YouTube API integration to get latest video
async function loadLatestVideo() {
    const channelId = 'UCLiIrzYVgwFD0rIEYQoGC5A';
    
    // Fallback to showing the channel's latest uploads playlist
    const iframe = document.getElementById('latest-video');
    if (iframe) {
        // This will show the most recent video from the channel
        iframe.src = `https://www.youtube.com/embed?listType=playlist&list=UU${channelId.substring(2)}&index=0`;
    }
}

// Load the latest video when the page loads
document.addEventListener('DOMContentLoaded', function() {
    loadLatestVideo();
});

// Additional functionality for the church website
function initializeChurchWebsite() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeChurchWebsite);
