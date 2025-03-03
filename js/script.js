/**
 * Al Nutq - Main JavaScript File
 * Author: Muhammed Navar
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let lastScrollTop = 0;
    let isScrolling;
    let currentLang = 'en';
    let deferredPrompt;
    
    // Get DOM elements
    const body = document.body;
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    const floatingNav = document.querySelector('.floating-nav');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const langToggle = document.getElementById('lang-toggle');
    const langSelector = document.getElementById('language-selector');
    const langButtons = document.querySelectorAll('.lang-btn');
    const searchToggle = document.getElementById('search-toggle');
    const searchContainer = document.getElementById('search-container');
    const pwaPrompt = document.getElementById('pwa-prompt');
    const pwaInstall = document.getElementById('pwa-install');
    const pwaCancel = document.getElementById('pwa-cancel');
    const header = document.querySelector('header');
    
    // Custom cursor initialization
    if (!isMobileDevice()) {
        document.addEventListener('mousemove', function(e) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        });
        
        document.addEventListener('mousedown', function() {
            cursor.style.transform = 'translate(-50%, -50%) scale(0.7)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(0.7)';
        });
        
        document.addEventListener('mouseup', function() {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        // Add hover effect on links and buttons
        const hoverElements = document.querySelectorAll('a, button, .nav-item');
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorFollower.style.borderColor = 'var(--light-blue)';
                cursor.style.transform = 'translate(-50%, -50%) scale(0.5)';
            });
            
            element.addEventListener('mouseleave', function() {
                cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorFollower.style.borderColor = 'var(--light-blue)';
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    } else {
        // Hide custom cursor on mobile devices
        cursor.style.display = 'none';
        cursorFollower.style.display = 'none';
        
        // Add touch ripple effect for mobile
        const buttons = document.querySelectorAll('button, a, .nav-item');
        buttons.forEach(button => {
            button.addEventListener('touchstart', createRipple);
        });
    }
    
    // Theme toggle functionality
    themeToggle.addEventListener('click', function() {
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'dark');
        }
    });
    
    // Language toggle functionality
    langToggle.addEventListener('click', function() {
        langSelector.classList.toggle('show');
    });
    
    // Close language selector when clicking outside
    document.addEventListener('click', function(e) {
        if (!langToggle.contains(e.target) && !langSelector.contains(e.target)) {
            langSelector.classList.remove('show');
        }
    });
    
    // Language selection
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            
            // Remove active class from all buttons
            langButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Set the language
            setLanguage(lang);
            
            // Hide the language selector
            setTimeout(() => {
                langSelector.classList.remove('show');
            }, 300);
        });
    });
    
    // Search toggle functionality
    searchToggle.addEventListener('click', function() {
        searchContainer.classList.toggle('active');
        if (searchContainer.classList.contains('active')) {
            document.getElementById('global-search').focus();
        }
    });
    
    // Hide search when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchToggle.contains(e.target) && !searchContainer.contains(e.target)) {
            searchContainer.classList.remove('active');
        }
    });
    
    // Scroll event for floating navigation
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Show/hide floating nav based on scroll direction
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            floatingNav.classList.add('hide');
        } else {
            floatingNav.classList.remove('hide');
        }
        
        // Header transparency effect
        if (scrollTop > 100) {
            header.style.backgroundColor = body.classList.contains('dark-theme') ? 
                'rgba(18, 26, 38, 0.9)' : 'rgba(245, 248, 250, 0.9)';
        } else {
            header.style.backgroundColor = 'transparent';
        }
        
        lastScrollTop = scrollTop;
        
        // Clear our timeout throughout the scroll
        window.clearTimeout(isScrolling);
        
        // Set a timeout to hide the floating nav after scrolling stops
        isScrolling = setTimeout(function() {
            floatingNav.classList.remove('hide');
        }, 1000);
    });
    
    // Article filtering functionality
    const categoryFilter = document.getElementById('category-filter');
    const authorFilter = document.getElementById('author-filter');
    const languageFilter = document.getElementById('language-filter');
    const articles = document.querySelectorAll('.article-card[data-category]');
    
    if (categoryFilter && authorFilter && languageFilter) {
        const filterArticles = () => {
            const selectedCategory = categoryFilter.value;
            const selectedAuthor = authorFilter.value;
            const selectedLanguage = languageFilter.value;
            
            articles.forEach(article => {
                const category = article.getAttribute('data-category');
                const author = article.getAttribute('data-author');
                const language = article.getAttribute('data-language');
                
                const categoryMatch = selectedCategory === 'all' || category === selectedCategory;
                const authorMatch = selectedAuthor === 'all' || author === selectedAuthor;
                const languageMatch = selectedLanguage === 'all' || language === selectedLanguage;
                
                if (categoryMatch && authorMatch && languageMatch) {
                    article.style.display = 'flex';
                } else {
                    article.style.display = 'none';
                }
            });
        };
        
        categoryFilter.addEventListener('change', filterArticles);
        authorFilter.addEventListener('change', filterArticles);
        languageFilter.addEventListener('change', filterArticles);
    }
    
    // PWA Installation
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;
        // Show the install prompt after 5 seconds
        setTimeout(() => {
            pwaPrompt.classList.add('show');
        }, 5000);
    });
    
    // Install button event
    if (pwaInstall) {
        pwaInstall.addEventListener('click', async () => {
            if (deferredPrompt) {
                // Show the installation prompt
                deferredPrompt.prompt();
                // Wait for the user to respond to the prompt
                const { outcome } = await deferredPrompt.userChoice;
                // We no longer need the prompt, clear it
                deferredPrompt = null;
                // Hide the install prompt
                pwaPrompt.classList.remove('show');
            }
        });
    }
    
    // Cancel button event
    if (pwaCancel) {
        pwaCancel.addEventListener('click', () => {
            pwaPrompt.classList.remove('show');
        });
    }
    
    // Add animation classes on scroll
    const animateElements = document.querySelectorAll('.article-card, .mentorship-content, .eu-content');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        animateElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        animateElements.forEach(element => {
            element.classList.add('fade-in');
        });
    }
    
    // Load stored preferences
    loadPreferences();
    
    // Helper Functions
    
    // Function to check if device is mobile
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    // Create ripple effect for touch
    function createRipple(e) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 500);
    }
    
    // Function to set language
    function setLanguage(lang) {
        currentLang = lang;
        
        // Save language preference
        localStorage.setItem('language', lang);
        
        // Set body language attribute
        document.documentElement.lang = lang;
        
        // Set direction for Arabic
        if (lang === 'ar') {
            document.documentElement.dir = 'rtl';
        } else {
            document.documentElement.dir = 'ltr';
        }
        
        // Load translations
        loadTranslations(lang);
    }
    
    // Load translations from JSON file
    async function loadTranslations(lang) {
        try {
            const response = await fetch('translations.json');
            const translations = await response.json();
            
            // Update all translatable elements
            const elements = document.querySelectorAll('[data-translate]');
            elements.forEach(element => {
                const key = element.getAttribute('data-translate');
                if (translations[lang] && translations[lang][key]) {
                    element.textContent = translations[lang][key];
                }
            });
            
            // Update placeholders
            const inputs = document.querySelectorAll('input[placeholder], textarea[placeholder]');
            inputs.forEach(input => {
                const key = input.getAttribute('data-translate-placeholder');
                if (key && translations[lang] && translations[lang][key]) {
                    input.placeholder = translations[lang][key];
                }
            });
            
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }
    
    // Load user preferences (theme and language)
    function loadPreferences() {
        // Load theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
        
        // Load language preference
        const savedLang = localStorage.getItem('language');
        if (savedLang) {
            // Update language buttons
            langButtons.forEach(btn => {
                if (btn.getAttribute('data-lang') === savedLang) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            // Set the language
            setLanguage(savedLang);
        }
    }
});