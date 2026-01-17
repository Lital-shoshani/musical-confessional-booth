// YouTube API Integration for Musical Confessional Booth
// Provides autocomplete search, song preview, and submission tracking

// YouTube API Configuration
const CONFIG = {
    YOUTUBE_API_KEY: 'AIzaSyB-5QJsq06s94gULJeU7zQk0neVzL4eGrM'
};

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
const autocompleteDropdown = document.getElementById('autocomplete-dropdown');
const previewCard = document.getElementById('spotify-preview');
const previewAlbum = document.getElementById('preview-album');
const previewTitle = document.getElementById('preview-title');
const previewArtist = document.getElementById('preview-artist');
const previewPlayBtn = document.getElementById('preview-play');
const previewProgress = document.getElementById('preview-progress');
const progressFill = document.getElementById('progress-fill');
const previewTime = document.getElementById('preview-time');

// YouTube API state
let searchTimeout = null;
let youtubePlayer = null;
let currentVideoId = null;
let selectedSong = null;
let isPlaying = false;
let progressInterval = null;

// Check if API key is configured
function checkAPIKey() {
    if (typeof CONFIG === 'undefined' || !CONFIG.YOUTUBE_API_KEY || CONFIG.YOUTUBE_API_KEY === 'YOUR_API_KEY_HERE') {
        console.error('YouTube API key not configured. Please copy config.example.js to config.js and add your API key.');
        return false;
    }
    return true;
}

// Navigate to a specific screen
function navigateToScreen(screenName) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    
    if (screens[screenName]) {
        screens[screenName].classList.add('active');
    }
}

// Search YouTube for songs
async function searchYouTube(query) {
    if (!checkAPIKey()) return [];
    
    if (!query || query.trim().length < 2) return [];
    
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?` +
            `part=snippet&type=video&videoCategoryId=10&maxResults=5` +
            `&q=${encodeURIComponent(query + ' official audio')}` +
            `&key=${CONFIG.YOUTUBE_API_KEY}`
        );
        
        if (!response.ok) {
            console.error('YouTube API error:', response.status);
            return [];
        }
        
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error('Error searching YouTube:', error);
        return [];
    }
}

// Show autocomplete dropdown
function showAutocomplete(results) {
    autocompleteDropdown.innerHTML = '';
    
    if (results.length === 0) {
        autocompleteDropdown.classList.remove('show');
        return;
    }
    
    results.forEach(item => {
        const div = document.createElement('div');
        div.className = 'autocomplete-item';
        
        const title = item.snippet.title;
        const channelTitle = item.snippet.channelTitle;
        const thumbnail = item.snippet.thumbnails.default.url;
        const videoId = item.id.videoId;
        
        div.innerHTML = `
            <div class="autocomplete-item-thumb">
                <img src="${thumbnail}" alt="${title}">
            </div>
            <div class="autocomplete-item-info">
                <div class="autocomplete-item-title">${title}</div>
                <div class="autocomplete-item-artist">${channelTitle}</div>
            </div>
        `;
        
        div.addEventListener('click', () => {
            selectSong({
                title: title,
                artist: channelTitle,
                videoId: videoId,
                thumbnail: thumbnail
            });
            autocompleteDropdown.classList.remove('show');
        });
        
        autocompleteDropdown.appendChild(div);
    });
    
    autocompleteDropdown.classList.add('show');
}

// Hide autocomplete dropdown
function hideAutocomplete() {
    autocompleteDropdown.classList.remove('show');
}

// Select a song from autocomplete
function selectSong(song) {
    selectedSong = song;
    songInput.value = `${song.title} — ${song.artist}`;
    
    // Reset player state
    stopPlayer();
    
    // Update preview card
    previewAlbum.innerHTML = `<img src="${song.thumbnail}" alt="${song.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
    previewTitle.textContent = song.title;
    previewArtist.textContent = song.artist;
    previewCard.style.display = 'flex';
    
    // Hide progress initially
    previewProgress.style.display = 'none';
    
    currentVideoId = song.videoId;
    
    // Hide error if shown
    errorMessage.classList.remove('show');
}

// Format time from seconds to MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Update progress bar
function updateProgress() {
    if (!youtubePlayer || !isPlaying) return;
    
    try {
        const currentTime = youtubePlayer.getCurrentTime();
        const duration = youtubePlayer.getDuration();
        
        if (duration > 0) {
            const progress = (currentTime / duration) * 100;
            progressFill.style.width = `${progress}%`;
            previewTime.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
        }
    } catch (error) {
        // Player not ready, ignore
    }
}

// Stop player and reset
function stopPlayer() {
    if (youtubePlayer) {
        try {
            youtubePlayer.pauseVideo();
        } catch (error) {
            // Player not ready, ignore
        }
    }
    
    isPlaying = false;
    previewPlayBtn.classList.remove('playing');
    previewProgress.style.display = 'none';
    
    if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
    }
}

// Initialize YouTube Player (hidden)
function initYouTubePlayer(videoId) {
    if (!youtubePlayer) {
        youtubePlayer = new YT.Player('youtube-player', {
            height: '1',
            width: '1',
            videoId: videoId,
            playerVars: {
                'autoplay': 0,
                'controls': 0
            },
            events: {
                'onStateChange': onPlayerStateChange
            }
        });
    } else {
        youtubePlayer.loadVideoById(videoId);
    }
}

// Handle player state changes
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        isPlaying = true;
        previewPlayBtn.classList.add('playing');
        previewProgress.style.display = 'block';
        
        // Start progress update interval
        if (progressInterval) clearInterval(progressInterval);
        progressInterval = setInterval(updateProgress, 100);
    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
        stopPlayer();
    }
}

// Handle preview play button click
previewPlayBtn.addEventListener('click', () => {
    if (!currentVideoId) return;
    
    if (!youtubePlayer) {
        initYouTubePlayer(currentVideoId);
        setTimeout(() => {
            if (youtubePlayer) {
                youtubePlayer.playVideo();
            }
        }, 500);
    } else {
        if (isPlaying) {
            youtubePlayer.pauseVideo();
        } else {
            youtubePlayer.playVideo();
        }
    }
});

// Handle input changes with debounce
songInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    
    // Hide error message when typing
    if (errorMessage.classList.contains('show')) {
        errorMessage.classList.remove('show');
    }
    
    // Clear selected song if user modifies input
    if (selectedSong && query !== `${selectedSong.title} — ${selectedSong.artist}`) {
        selectedSong = null;
        previewCard.style.display = 'none';
        stopPlayer();
    }
    
    // Debounce search
    clearTimeout(searchTimeout);
    
    if (query.length < 2) {
        hideAutocomplete();
        return;
    }
    
    searchTimeout = setTimeout(async () => {
        const results = await searchYouTube(query);
        showAutocomplete(results);
    }, 300);
});

// Close autocomplete when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.autocomplete-wrapper')) {
        hideAutocomplete();
    }
});

// Validate song input format (should contain song and artist)
function validateSongInput(input) {
    const trimmed = input.trim();
    const separatorPattern = /[—\-–]|by/i;
    
    const hasSeparator = separatorPattern.test(trimmed);
    const parts = trimmed.split(separatorPattern);
    
    if (!hasSeparator || parts.length < 2) {
        return false;
    }
    
    return parts.every(part => part.trim().length > 0);
}

// Store submission in localStorage
function storeSubmission(songData) {
    try {
        const submissions = JSON.parse(localStorage.getItem('songSubmissions') || '[]');
        
        submissions.push({
            song: songData.title || songData,
            artist: songData.artist || '',
            videoId: songData.videoId || '',
            timestamp: new Date().toISOString()
        });
        
        localStorage.setItem('songSubmissions', JSON.stringify(submissions));
    } catch (error) {
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
    
    // Store submission - prefer selected song data
    if (selectedSong) {
        storeSubmission(selectedSong);
    } else {
        storeSubmission(songData);
    }
    
    // Clear state
    songForm.reset();
    selectedSong = null;
    currentVideoId = null;
    previewCard.style.display = 'none';
    stopPlayer();
    hideAutocomplete();
    
    // Navigate to thank you screen
    navigateToScreen('thankyou');
}

// Event Listeners
startBtn.addEventListener('click', () => {
    navigateToScreen('submission');
});

restartBtn.addEventListener('click', () => {
    songForm.reset();
    errorMessage.classList.remove('show');
    selectedSong = null;
    currentVideoId = null;
    previewCard.style.display = 'none';
    stopPlayer();
    hideAutocomplete();
    navigateToScreen('welcome');
});

songForm.addEventListener('submit', handleSubmit);

// Keyboard navigation enhancement
document.addEventListener('keydown', (event) => {
    // Allow Enter key on welcome screen to start
    if (event.key === 'Enter' && screens.welcome.classList.contains('active')) {
        navigateToScreen('submission');
    }
    
    // On submission screen, Enter key triggers search (handled by autocomplete)
    // Form submission only happens via button click
    if (event.key === 'Enter' && screens.submission.classList.contains('active')) {
        if (event.target.id === 'song-input') {
            event.preventDefault();
            
            // If a song is selected, play/pause
            if (selectedSong && currentVideoId) {
                if (youtubePlayer && isPlaying) {
                    youtubePlayer.pauseVideo();
                } else if (youtubePlayer) {
                    youtubePlayer.playVideo();
                } else {
                    initYouTubePlayer(currentVideoId);
                    setTimeout(() => {
                        if (youtubePlayer) {
                            youtubePlayer.playVideo();
                        }
                    }, 500);
                }
            }
        }
    }
});

// Initialize YouTube IFrame API
window.onYouTubeIframeAPIReady = function() {
    console.log('YouTube IFrame API ready');
};

// Initialize - ensure welcome screen is shown on load
document.addEventListener('DOMContentLoaded', () => {
    navigateToScreen('welcome');
    
    // Check if API key is configured
    if (!checkAPIKey()) {
        console.warn('⚠️ YouTube API integration not available. Please configure your API key in config.js');
    }
});
