# Al Nutq - Islamic Community Website

Al Nutq (full name: Zawiya Al Nutq) is a comprehensive website aimed at refuting Wahhabi ideology and Bid'ah in general. The platform provides authentic Islamic knowledge based on traditional understandings of Islam.

## Features

- **Modern Design**: Glassmorphism style with dark and light theme options
- **Responsive**: Fully responsive design that works on all devices
- **Multilingual**: Complete support for English, Malayalam, and Arabic
- **PWA Support**: Progressive Web App capabilities for installation on mobile devices
- **Article System**: Categorized articles with search and filter functionality
- **Edified Ummah Section**: Community and podcast platform integration
- **Mentorship Program**: Request form for personalized guidance
- **Accessibility**: ARIA-compliant for better accessibility

## File Structure

```
alnutq/
├── index.html            # Main homepage
├── style.css             # Main stylesheet
├── script.js             # Main JavaScript file
├── sw-register.js        # Service Worker registration
├── service-worker.js     # Service Worker for offline capabilities
├── manifest.json         # PWA manifest
├── translations.json     # Multilingual text content
├── offline.html          # Offline fallback page
├── mentorship.html       # Mentorship request page
├── edified-ummah.html    # Edified Ummah community page
├── articles/
│   └── taraweeh.html     # Sample article page
└── assets/
    ├── nutq logo.svg     # Al Nutq logo
    ├── eu logo.svg       # Edified Ummah logo
    ├── favicon.ico       # Favicon
    ├── icons/            # PWA icons in various sizes
    └── fonts/
        └── Monadi-Regular.ttf  # Arabic font
```

## Installation & Deployment

1. **Local Development**:
   - Clone this repository
   - Open `index.html` in your browser
   - For full functionality, use a local server (e.g., Live Server extension for VS Code)

2. **Web Hosting**:
   - Upload all files to your web hosting service
   - Ensure your server supports HTTPS for PWA functionality

3. **Custom Domain Configuration**:
   - Point your domain (e.g., alnutq.com) to your hosting
   - Update the URLs in `manifest.json` if necessary

## PWA Configuration

The website is configured as a Progressive Web App, allowing users to install it on their devices. The key files for PWA functionality are:

- `manifest.json`: Defines app metadata and icons
- `service-worker.js`: Handles caching and offline functionality
- `sw-register.js`: Registers the service worker
- `offline.html`: Displayed when the user is offline

## Multilingual Support

The site supports English, Malayalam, and Arabic languages. Text translations are stored in `translations.json`. The language can be switched using the language selector in the floating navigation bar.

## Theme Toggle

Users can switch between dark and light themes using the theme toggle button in the floating navigation bar. The theme preference is saved in localStorage.

## Adding New Articles

To add a new article:

1. Create a new HTML file in the `articles/` directory
2. Use the existing `taraweeh.html` as a template
3. Update the content as needed
4. Add the article to the articles grid in `index.html`

## Development Notes

- **CSS Variables**: Custom properties are defined in `:root` in `style.css`
- **JavaScript Modules**: Functionality is separated into logical modules
- **Service Worker**: Caches assets for offline use and handles background sync
- **IndexedDB**: Used for storing form submissions when offline

## Browser Compatibility

The website is designed to work with modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Internet Explorer is not supported.

## Credits

- **Design & Development**: Muhammed Navar
- **Framework**: Custom HTML, CSS, and JavaScript (no frameworks)
- **Icons**: Font Awesome
- **Fonts**: Montserrat, Anek Malayalam, Monadi

## License

Copyright © 2025 Muhammed Navar. All Rights Reserved.

---

For more information, visit [NavarMP.github.io](https://NavarMP.github.io)