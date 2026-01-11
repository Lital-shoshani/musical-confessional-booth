// Screen Management
const screens = {
    welcome: document.getElementById('welcome-screen'),
    submission: document.getElementById('submission-screen'),
    thankyou: document.getElementById('thankyou-screen')
};

// Buttons
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const songForm = document.getElementById('song-form');

// Navigate to a specific screen
function navigateToScreen(screenName) {
    // Remove active class from all screens
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Add active class to target screen
    if (screens[screenName]) {
        screens[screenName].classList.add('active');
    }
}

// Handle form submission
function handleSubmit(event) {
    event.preventDefault();
    
    const songName = document.getElementById('song-name').value.trim();
    const artistName = document.getElementById('artist-name').value.trim();
    
    // Basic validation (browser's built-in validation handles required fields)
    if (!songName || !artistName) {
        return;
    }
    
    // Here you could send the data to a backend or analytics service
    // Example: fetch('/api/submit', { method: 'POST', body: JSON.stringify({ song: songName, artist: artistName }) });
    
    // Clear the form
    songForm.reset();
    
    // Navigate to thank you screen
    navigateToScreen('thankyou');
}

// Event Listeners
startBtn.addEventListener('click', () => {
    navigateToScreen('submission');
});

restartBtn.addEventListener('click', () => {
    navigateToScreen('welcome');
});

songForm.addEventListener('submit', handleSubmit);

// Keyboard navigation enhancement
document.addEventListener('keydown', (event) => {
    // Allow Enter key on welcome screen to start
    if (event.key === 'Enter' && screens.welcome.classList.contains('active')) {
        navigateToScreen('submission');
    }
});

// Initialize - ensure welcome screen is shown on load
document.addEventListener('DOMContentLoaded', () => {
    navigateToScreen('welcome');
});
