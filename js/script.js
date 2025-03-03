document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const languageSelect = document.getElementById('language');
    const body = document.body;

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');
    });

    // Language Switch
    fetch('translations.json')
        .then(response => response.json())
        .then(translations => {
            languageSelect.addEventListener('change', (e) => {
                const lang = e.target.value;
                document.querySelectorAll('[data-lang]').forEach(el => {
                    const key = el.getAttribute('data-lang');
                    el.textContent = translations[lang][key];
                });
            });
        });

    // Mentorship Application
    window.applyMentorship = () => {
        alert('Mentorship application submitted!');
    };

    // PWA Install Prompt
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        // Show install button or prompt user here if desired
    });
});