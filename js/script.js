// Global variables
let deferredPrompt = null;
const translations = {};

// Music player variables - shared between pages
let audioPlayer = null;
let playIcon = null;
let isPlaying = false;
let currentPlaylist = '';
let currentSongIndex = -1;
let playlists = {
    'arabic-nasheeds': [
        { path: 'playlists/arabic nasheeds/1.mp3', title: 'Arabic Nasheed 1', artist: 'Various Artists' },
        { path: 'playlists/arabic nasheeds/2.mp3', title: 'Arabic Nasheed 2', artist: 'Various Artists' },
        { path: 'playlists/arabic nasheeds/3.mp3', title: 'Arabic Nasheed 3', artist: 'Various Artists' },
        { path: 'playlists/arabic nasheeds/4.mp3', title: 'Arabic Nasheed 4', artist: 'Various Artists' },
        { path: 'playlists/arabic nasheeds/5.mp3', title: 'Arabic Nasheed 5', artist: 'Various Artists' },
        { path: 'playlists/arabic nasheeds/6.mp3', title: 'Arabic Nasheed 6', artist: 'Various Artists' },
        { path: 'playlists/arabic nasheeds/7.mp3', title: 'Arabic Nasheed 7', artist: 'Various Artists' }
    ],
    'malayalam-songs': [
        { path: 'playlists/malayalam songs/1.mp3', title: 'Malayalam Song 1', artist: 'Malayalam Artist' },
        { path: 'playlists/malayalam songs/2.mp3', title: 'Malayalam Song 2', artist: 'Malayalam Artist' }
    ],
    'gym-nasheeds': [
        { path: 'playlists/gym nasheeds/1.mp3', title: 'Gym Nasheed 1', artist: 'Workout Nasheed' },
        { path: 'playlists/gym nasheeds/2.mp3', title: 'Gym Nasheed 2', artist: 'Workout Nasheed' }
    ]
};

// Custom cursor variables
let cursor = null;
let cursorFollower = null;
let cursorVisible = false;
let cursorTimeout = null;

// Side menu elements
let menuToggle = null;
let sideMenu = null;
let sideMenuClose = null;
let sideMenuOverlay = null;
let themeOptions = null;
let languageOptions = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    // Initialize elements
    initElements();
    
    // Load translations
    await loadTranslations();
    
    // Load saved settings
    loadTheme();
    loadLanguage();
    
    // Initialize features
    initCursor();
    setupSideMenu();
    setupPWA();
    setupScrollBehavior();
    
    // Check if we're on the playlist page
    if (document.getElementById('audio-player')) {
        initMusicPlayer();
    } else {
        // Check for active audio (home page)
        checkForActiveAudio();
        startRandomMusicIfFirstVisit();
    }
});

// Initialize global element references
function initElements() {
    // Elements that exist on both pages
    cursor = document.querySelector('.cursor');
    cursorFollower = document.querySelector('.cursor-follower');
    menuToggle = document.getElementById('menu-toggle');
    sideMenu = document.getElementById('side-menu');
    sideMenuClose = document.getElementById('side-menu-close');
    sideMenuOverlay = document.getElementById('side-menu-overlay');
    themeOptions = document.querySelectorAll('.theme-option');
    languageOptions = document.querySelectorAll('.language-option');
    
    // Music player elements (playlist page only)
    if (document.getElementById('audio-player')) {
        audioPlayer = document.getElementById('audio-player');
        playIcon = document.getElementById('play-icon');
    }
}

// Load translations from JSON file
async function loadTranslations() {
    try {
        const response = await fetch('translations.json');
        if (response.ok) {
            const data = await response.json();
            Object.assign(translations, data);
        } else {
            console.error('Failed to load translations');
        }
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

// Initialize the custom cursor
function initCursor() {
    // Show cursor initially when the mouse moves
    document.addEventListener('mousemove', function(e) {
        if (!cursorVisible) {
            cursor.style.opacity = '1';
            cursorFollower.style.opacity = '1';
            cursorVisible = true;
        }
        
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // Add slight delay to follower for nice effect
        setTimeout(function() {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 50);
        
        // Hide cursor after 3 seconds of inactivity
        clearTimeout(cursorTimeout);
        cursorTimeout = setTimeout(function() {
            cursor.style.opacity = '0';
            cursorFollower.style.opacity = '0';
            cursorVisible = false;
        }, 3000);
    });
    
    // Support for touch devices to hide cursor
    document.addEventListener('touchstart', function() {
        cursor.style.opacity = '0';
        cursorFollower.style.opacity = '0';
        cursorVisible = false;
    });
    
    // Cursor interactions
    document.addEventListener('mousedown', function() {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.7)';
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(0.7)';
    });
    
    document.addEventListener('mouseup', function() {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
    });
    
    // Make cursor disappear when leaving the window
    document.addEventListener('mouseleave', function() {
        cursor.style.opacity = '0';
        cursorFollower.style.opacity = '0';
        cursorVisible = false;
    });
    
    document.addEventListener('mouseenter', function() {
        cursor.style.opacity = '1';
        cursorFollower.style.opacity = '1';
        cursorVisible = true;
        
        // Reset the inactivity timer
        clearTimeout(cursorTimeout);
        cursorTimeout = setTimeout(function() {
            cursor.style.opacity = '0';
            cursorFollower.style.opacity = '0';
            cursorVisible = false;
        }, 3000);
    });
}

// Setup the side menu functionality
function setupSideMenu() {
    if (!menuToggle || !sideMenu || !sideMenuClose || !sideMenuOverlay) return;
    
    menuToggle.addEventListener('click', openSideMenu);
    sideMenuClose.addEventListener('click', closeSideMenu);
    sideMenuOverlay.addEventListener('click', closeSideMenu);
    
    // Theme options
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            setTheme(theme);
            
            // Update active state
            themeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Language options
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
            
            // Update active state
            languageOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Install button if available
    const installBtn = document.getElementById('install-btn');
    if (installBtn) {
        installBtn.addEventListener('click', () => {
            installApp();
            closeSideMenu();
        });
    }
}

function openSideMenu() {
    sideMenu.classList.add('active');
    sideMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSideMenu() {
    sideMenu.classList.remove('active');
    sideMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Setup PWA functionality
function setupPWA() {
    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
        return; // Already installed, exit function
    }
    
    // Handle beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;
        
        // Show the install banner if it exists
        const installBanner = document.getElementById('install-banner');
        if (installBanner) {
            installBanner.classList.add('show');
            
            // Install banner button click
            const installBannerBtn = document.getElementById('install-banner-btn');
            if (installBannerBtn) {
                installBannerBtn.addEventListener('click', () => {
                    installApp();
                });
            }
            
            // Close install banner
            const installClose = document.getElementById('install-close');
            if (installClose) {
                installClose.addEventListener('click', () => {
                    installBanner.classList.remove('show');
                });
            }
        }
    });
    
    // Successfully installed
    window.addEventListener('appinstalled', (evt) => {
        if (document.getElementById('install-banner')) {
            document.getElementById('install-banner').classList.remove('show');
        }
        deferredPrompt = null;
    });
}

function installApp() {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        deferredPrompt = null;
        
        // Hide the install banner if it exists
        const installBanner = document.getElementById('install-banner');
        if (installBanner) {
            installBanner.classList.remove('show');
        }
    });
}

// Scroll behavior for navigation and scroll-to-top button
function setupScrollBehavior() {
    let lastScrollTop = 0;
    const navbar = document.querySelector('.bottom-nav');
    const scrollTopBtn = document.querySelector('.scroll-top');
    
    if (!navbar || !scrollTopBtn) return;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Hide/show navbar
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down
            navbar.classList.add('hidden');
        } else {
            // Scrolling up
            navbar.classList.remove('hidden');
        }
        
        // Show/hide scroll to top button
        if (scrollTop > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Scroll to top when button is clicked
    scrollTopBtn.addEventListener('click', scrollToTop);
}

// Theme management
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update active state in side menu
    document.querySelectorAll('.theme-option').forEach(option => {
        if (option.getAttribute('data-theme') === theme) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Update active state in side menu
        document.querySelectorAll('.theme-option').forEach(option => {
            if (option.getAttribute('data-theme') === savedTheme) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }
}

// Language management
function setLanguage(lang) {
    document.body.setAttribute('lang', lang);
    localStorage.setItem('language', lang);
    
    // Update active state in side menu
    document.querySelectorAll('.language-option').forEach(option => {
        if (option.getAttribute('data-lang') === lang) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

function loadLanguage() {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        document.body.setAttribute('lang', savedLanguage);
        
        // Update active state in side menu
        document.querySelectorAll('.language-option').forEach(option => {
            if (option.getAttribute('data-lang') === savedLanguage) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }
}

// Navigation functions
function navigateTo(target) {
    // Set active nav item
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class based on target
    if (target === 'home') {
        navItems[0].classList.add('active');
        if (window.location.pathname.includes('index.html') || !window.location.pathname.includes('.html')) {
            window.scrollTo({top: 0, behavior: 'smooth'});
        } else {
            window.location.href = 'index.html';
        }
    } else if (target === 'playlist') {
        navItems[1].classList.add('active');
        if (!window.location.pathname.includes('playlists.html')) {
            window.location.href = 'playlists.html';
        }
    } else if (target === 'about') {
        navItems[2].classList.add('active');
        if (window.location.pathname.includes('index.html') || !window.location.pathname.includes('.html')) {
            document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
        } else {
            window.location.href = 'index.html#about';
        }
    }
}

function scrollToTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});
}

// Music player functions (playlist page)
function initMusicPlayer() {
    // Check if audio player exists
    if (!audioPlayer) return;
    
    // Load song durations
    loadSongDurations();
    
    // Set up audio player events
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', songEnded);
    audioPlayer.addEventListener('canplay', updateDuration);
    
    // Enable progress bar seeking
    const progressContainer = document.getElementById('progress-container');
    if (progressContainer) {
        progressContainer.addEventListener('click', seek);
    }
    
    // Initialize the correct playlist tab
    const defaultPlaylistTab = document.querySelector('.playlist-tab.active');
    if (defaultPlaylistTab) {
        const defaultPlaylistId = defaultPlaylistTab.onclick.toString().match(/switchPlaylist\(this, ['"](.+)['"]\)/)[1];
        currentPlaylist = defaultPlaylistId;
    }
    
    // Check if we need to play a random song on load
    checkPlayRandomOnLoad();
    
    // Check if we should continue playing previously playing song
    checkContinuePlayback();
    
    // Before the page unloads, ensure we save the current playback state
    window.addEventListener('beforeunload', function() {
        if (isPlaying) {
            savePlaybackState();
        }
    });
}

// Load song durations (this loads metadata without playing the songs)
function loadSongDurations() {
    for (const playlistId in playlists) {
        playlists[playlistId].forEach((song, index) => {
            const audio = new Audio();
            audio.src = song.path;
            const durationId = `duration-${playlistId.replace('-', '-')}-${index+1}`;
            
            audio.addEventListener('loadedmetadata', function() {
                const minutes = Math.floor(audio.duration / 60);
                const seconds = Math.floor(audio.duration % 60);
                const durationElement = document.getElementById(durationId);
                if (durationElement) {
                    durationElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                }
            });
            
            // Just load metadata, don't play
            audio.preload = 'metadata';
        });
    }
}

// Check if we should play a random song on load
function checkPlayRandomOnLoad() {
    const playRandom = localStorage.getItem('playRandomOnLoad');
    if (playRandom === 'true') {
        // Clear the flag
        localStorage.removeItem('playRandomOnLoad');
        
        // Play a random song
        playRandomSong();
    }
}

// Play a random song from any playlist
function playRandomSong() {
    // Select a random playlist
    const playlistKeys = Object.keys(playlists);
    const randomPlaylistKey = playlistKeys[Math.floor(Math.random() * playlistKeys.length)];
    
    // Select a random song from the playlist
    const randomPlaylist = playlists[randomPlaylistKey];
    const randomSongIndex = Math.floor(Math.random() * randomPlaylist.length);
    const randomSong = randomPlaylist[randomSongIndex];
    
    // Play the random song
    playSong(randomSong.path, randomSong.title, randomSong.artist);
}

// Check if we should continue playing a song from before navigation
function checkContinuePlayback() {
    const musicState = JSON.parse(localStorage.getItem('musicState'));
    if (musicState && musicState.isPlaying) {
        // Find the playlist and song index
        for (const playlistId in playlists) {
            const songIndex = playlists[playlistId].findIndex(song => song.path === musicState.songPath);
            if (songIndex !== -1) {
                // Switch to the correct playlist
                const playlistTab = document.querySelector(`.playlist-tab[onclick*="${playlistId}"]`);
                if (playlistTab) {
                    switchPlaylist(playlistTab, playlistId);
                }
                
                // Play the song at the saved position
                const song = playlists[playlistId][songIndex];
                playSong(song.path, song.title, song.artist);
                
                // Set the current time if provided
                if (musicState.currentTime) {
                    audioPlayer.currentTime = musicState.currentTime;
                }
                
                break;
            }
        }
    }
}

// Check if music is already playing across pages (home page function)
function checkForActiveAudio() {
    const musicState = JSON.parse(localStorage.getItem('musicState'));
    if (musicState && musicState.isPlaying) {
        // If we came from the playlist page with music playing, we don't need to do anything
        // The music will keep playing as it's managed by the playlist page
        console.log('Music is playing from playlist page');
    }
}

// Start random music when website is launched for the first time (home page function)
function startRandomMusicIfFirstVisit() {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
        localStorage.setItem('hasVisited', 'true');
        
        // Redirect to playlist page with a parameter to play random music
        localStorage.setItem('playRandomOnLoad', 'true');
        window.location.href = 'playlists.html';
    }
}

// Play a song by path, title, and artist
function playSong(path, title, artist) {
    if (!audioPlayer) return;
    
    // Find which playlist and index the song is in
    for (const playlistId in playlists) {
        const songIndex = playlists[playlistId].findIndex(song => song.path === path);
        if (songIndex !== -1) {
            currentPlaylist = playlistId;
            currentSongIndex = songIndex;
            
            // Switch to the correct playlist tab if not already active
            const activeContent = document.querySelector('.playlist-content.active');
            if (activeContent && activeContent.id !== currentPlaylist) {
                const playlistTab = document.querySelector(`.playlist-tab[onclick*="${currentPlaylist}"]`);
                if (playlistTab) {
                    switchPlaylist(playlistTab, currentPlaylist);
                }
            }
            break;
        }
    }
    
    // Highlight the current song
    highlightCurrentSong();
    
    // Set up the audio player
    audioPlayer.src = path;
    const titleElement = document.getElementById('song-title');
    if (titleElement) {
        titleElement.innerHTML = title;
    }
    
    const artistElement = document.getElementById('song-artist');
    if (artistElement) {
        artistElement.textContent = artist;
    }
    
    // Start playing
    audioPlayer.play()
        .then(() => {
            // Successfully playing
            isPlaying = true;
            playIcon.classList.remove('fa-play');
            playIcon.classList.add('fa-pause');
            
            // Save the current playback state
            savePlaybackState();
        })
        .catch(error => {
            console.error('Error playing audio:', error);
        });
    
    // Update cover icon based on playlist
    updateCoverIcon();
}

// Update the cover icon based on current playlist
function updateCoverIcon() {
    const coverElement = document.getElementById('song-cover');
    if (!coverElement) return;
    
    if (currentPlaylist === 'arabic-nasheeds') {
        coverElement.innerHTML = '<i class="fas fa-mosque"></i>';
    } else if (currentPlaylist === 'malayalam-songs') {
        coverElement.innerHTML = '<i class="fas fa-music"></i>';
    } else if (currentPlaylist === 'gym-nasheeds') {
        coverElement.innerHTML = '<i class="fas fa-dumbbell"></i>';
    }
}

// Toggle play/pause
function togglePlayPause() {
    if (!audioPlayer) return;
    
    if (currentSongIndex === -1 && playlists[currentPlaylist].length > 0) {
        // If no song is selected, play the first one
        const firstSong = playlists[currentPlaylist][0];
        playSong(firstSong.path, firstSong.title, firstSong.artist);
        return;
    }
    
    if (isPlaying) {
        audioPlayer.pause();
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
        isPlaying = false;
    } else {
        audioPlayer.play();
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
        isPlaying = true;
    }
    
    // Save the current playback state
    savePlaybackState();
}

// Play the next song in the playlist
function playNext() {
    if (currentSongIndex === -1) return;
    
    let nextIndex = currentSongIndex + 1;
    if (nextIndex >= playlists[currentPlaylist].length) {
        nextIndex = 0; // Loop back to the beginning
    }
    
    const nextSong = playlists[currentPlaylist][nextIndex];
    playSong(nextSong.path, nextSong.title, nextSong.artist);
}

// Play the previous song in the playlist
function playPrevious() {
    if (currentSongIndex === -1) return;
    
    // If at the beginning of the song, go to previous song, otherwise restart current song
    if (audioPlayer.currentTime > 3) {
        audioPlayer.currentTime = 0;
        return;
    }
    
    let prevIndex = currentSongIndex - 1;
    if (prevIndex < 0) {
        prevIndex = playlists[currentPlaylist].length - 1; // Loop to the end
    }
    
    const prevSong = playlists[currentPlaylist][prevIndex];
    playSong(prevSong.path, prevSong.title, prevSong.artist);
}

// When song ends, play the next one
function songEnded() {
    playNext();
}

// Update the progress bar
function updateProgress() {
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    if (!progressBar || !currentTimeEl || !audioPlayer) return;
    
    const duration = audioPlayer.duration;
    const currentTime = audioPlayer.currentTime;
    
    if (duration) {
        // Update progress bar
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        
        // Update time display
        const currentMinutes = Math.floor(currentTime / 60);
        const currentSeconds = Math.floor(currentTime % 60);
        currentTimeEl.textContent = `${String(currentMinutes).padStart(2, '0')}:${String(currentSeconds).padStart(2, '0')}`;
        
        // Save the current playback state periodically (every 5 seconds)
        if (Math.floor(currentTime) % 5 === 0) {
            savePlaybackState();
        }
    }
}

// Update duration display when metadata loads
function updateDuration() {
    const durationEl = document.getElementById('duration');
    if (!durationEl || !audioPlayer) return;
    
    const duration = audioPlayer.duration;
    if (duration) {
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        durationEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

// Seek to position in the song
function seek(e) {
    if (!audioPlayer || !audioPlayer.duration) return;
    
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    
    audioPlayer.currentTime = (clickX / width) * duration;
    
    // Save the updated playback state
    savePlaybackState();
}

// Save the current playback state to localStorage
function savePlaybackState() {
    if (currentSongIndex === -1 || !audioPlayer) return;
    
    const currentSong = playlists[currentPlaylist][currentSongIndex];
    const musicState = {
        isPlaying: isPlaying,
        songPath: currentSong.path,
        currentTime: audioPlayer.currentTime,
        duration: audioPlayer.duration,
        title: currentSong.title,
        artist: currentSong.artist,
        playlist: currentPlaylist
    };
    
    localStorage.setItem('musicState', JSON.stringify(musicState));
}

// Reset player display
function resetPlayer() {
    if (!audioPlayer) return;
    
    audioPlayer.pause();
    audioPlayer.src = '';
    
    // Reset HTML content with language support
    const titleElement = document.getElementById('song-title');
    if (titleElement) {
        titleElement.innerHTML = ''; // Clear current content
        
        // Add language-specific content
        const enSpan = document.createElement('span');
        enSpan.setAttribute('data-lang', 'en');
        enSpan.textContent = 'Select a song to play';
        
        const mlSpan = document.createElement('span');
        mlSpan.setAttribute('data-lang', 'ml');
        mlSpan.textContent = 'പ്ലേ ചെയ്യാൻ ഒരു ഗാനം തിരഞ്ഞെടുക്കുക';
        
        const arSpan = document.createElement('span');
        arSpan.setAttribute('data-lang', 'ar');
        arSpan.textContent = 'اختر أغنية للتشغيل';
        
        titleElement.appendChild(enSpan);
        titleElement.appendChild(mlSpan);
        titleElement.appendChild(arSpan);
    }
    
    const artistElement = document.getElementById('song-artist');
    if (artistElement) {
        artistElement.textContent = '';
    }
    
    const durationEl = document.getElementById('duration');
    if (durationEl) {
        durationEl.textContent = '00:00';
    }
    
    const currentTimeEl = document.getElementById('current-time');
    if (currentTimeEl) {
        currentTimeEl.textContent = '00:00';
    }
    
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.style.width = '0%';
    }
    
    if (playIcon) {
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
    }
    
    isPlaying = false;
    
    // Remove highlights from all songs
    const songItems = document.querySelectorAll('.song-item');
    songItems.forEach(item => {
        item.classList.remove('playing');
    });
    
    // Clear saved playback state
    localStorage.removeItem('musicState');
}

// Highlight the currently playing song
function highlightCurrentSong() {
    // Remove highlight from all songs
    const songItems = document.querySelectorAll('.song-item');
    songItems.forEach(item => {
        item.classList.remove('playing');
    });
    
    // Add highlight to current song
    if (currentSongIndex !== -1) {
        const playlistElement = document.getElementById(currentPlaylist);
        if (playlistElement) {
            const songElements = playlistElement.querySelectorAll('.song-item');
            if (songElements[currentSongIndex]) {
                songElements[currentSongIndex].classList.add('playing');
            }
        }
    }
}

// Switch between playlists
function switchPlaylist(element, playlistId) {
    // Update active tab
    const tabs = document.querySelectorAll('.playlist-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    element.classList.add('active');
    
    // Show selected playlist
    const playlistContents = document.querySelectorAll('.playlist-content');
    playlistContents.forEach(playlist => {
        playlist.classList.remove('active');
    });
    document.getElementById(playlistId).classList.add('active');
    
    // Update current playlist
    currentPlaylist = playlistId;
    
    // Highlight current song if it's in this playlist
    highlightCurrentSong();
}