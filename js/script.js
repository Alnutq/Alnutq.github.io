// Cursor fade
let cursorTimeout;
function handleMouseMove(e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursor.classList.remove('fade');
    clearTimeout(cursorTimeout);
    cursorTimeout = setTimeout(() => {
        cursor.classList.add('fade');
    }, 3000);
}

// Theme switcher scroll handling
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    const themeSwitcher = document.querySelector('.theme-switcher');
    const st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > lastScrollTop) {
        themeSwitcher.classList.add('hidden');
    } else {
        themeSwitcher.classList.remove('hidden');
    }
    lastScrollTop = st <= 0 ? 0 : st;
});

// Language support
const languages = {
    en: {
        // English translations
    },
    ml: {
        // Malayalam translations
    },
    ar: {
        // Arabic translations
    }
};

function changeLanguage(lang) {
    document.documentElement.setAttribute('lang', lang);
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = languages[lang][key];
    });
}

// Install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

function installWebsite() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            deferredPrompt = null;
        });
    }
}
