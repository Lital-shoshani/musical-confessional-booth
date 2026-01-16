// Screen Management
const screens = {
    welcome: document.getElementById('welcome-screen'),
    submission: document.getElementById('submission-screen'),
    thankyou: document.getElementById('thankyou-screen')
};

// Elements
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const songForm = document.getElementById('song-form');
const songInput = document.getElementById('song-input');
const errorMessage = document.getElementById('error-message');

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

// Validate song input format (should contain song and artist)
function validateSongInput(input) {
    const trimmed = input.trim();
    // Pattern to match separators: em dash (—), hyphen (-), en dash (–), or "by"
    const separatorPattern = /[—\-–]|by/i;
    
    // Check if input contains a separator
    const hasSeparator = separatorPattern.test(trimmed);
    const parts = trimmed.split(separatorPattern);
    
    if (!hasSeparator || parts.length < 2) {
        return false;
    }
    
    // Check that both parts have content
    return parts.every(part => part.trim().length > 0);
}

// Store submission in localStorage
// Note: Submissions are stored for potential backend sync but should NEVER be displayed
// in the UI to maintain anonymity and privacy. Access localStorage directly if needed
// for administrative purposes only.
function storeSubmission(songData) {
    try {
        // Get existing submissions or initialize empty array
        const submissions = JSON.parse(localStorage.getItem('songSubmissions') || '[]');
        
        // Add new submission with timestamp
        submissions.push({
            song: songData,
            timestamp: new Date().toISOString()
        });
        
        // Store back to localStorage
        localStorage.setItem('songSubmissions', JSON.stringify(submissions));
    } catch (error) {
        // Silently fail if localStorage is not available
        console.error('Failed to store submission:', error);
    }
}

// Handle form submission
function handleSubmit(event) {
    event.preventDefault();
    
    const songData = songInput.value.trim();
    
    // Hide any previous error messages
    errorMessage.classList.remove('show');
    
    // Validate input
    if (!songData) {
        errorMessage.classList.add('show');
        return;
    }
    
    // Check if it contains both song and artist
    if (!validateSongInput(songData)) {
        errorMessage.classList.add('show');
        return;
    }
    
    // Store submission in localStorage (but never display it)
    storeSubmission(songData);
    
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
    // Clear form and error messages when returning to start
    songForm.reset();
    errorMessage.classList.remove('show');
    navigateToScreen('welcome');
});

songForm.addEventListener('submit', handleSubmit);

// Hide error message when user starts typing
songInput.addEventListener('input', () => {
    if (errorMessage.classList.contains('show')) {
        errorMessage.classList.remove('show');
    }
});

// Keyboard navigation enhancement
document.addEventListener('keydown', (event) => {
    // Allow Enter key on welcome screen to start
    if (event.key === 'Enter' && screens.welcome.classList.contains('active')) {
        navigateToScreen('submission');
    }
    
    // Prevent Enter key from submitting form on submission screen
    // Instead, it should trigger Spotify search (to be implemented)
    if (event.key === 'Enter' && screens.submission.classList.contains('active')) {
        // Check if the target is the song input field
        if (event.target.id === 'song-input') {
            event.preventDefault();
            // TODO: Trigger Spotify search here when API integration is added
            // For now, just prevent form submission
            console.log('Enter pressed - ready for Spotify search integration');
        }
    }
});

// Initialize - ensure welcome screen is shown on load
document.addEventListener('DOMContentLoaded', () => {
    navigateToScreen('welcome');
});
