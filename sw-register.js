/**
 * Al Nutq - Service Worker Registration
 * Author: Muhammed Navar
 */

// Make sure service workers are supported
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(reg => {
          console.log('Service Worker: Registered');
          
          // Check for updates on page load
          reg.update();
          
          // Listen for controller change (service worker update)
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('Service Worker: Controller Changed');
            // You can notify the user about the update here if you want
          });
        })
        .catch(err => console.log(`Service Worker: Error: ${err}`));
    });
  }
  
  // Handle PWA installation
  let deferredPrompt;
  const pwaPrompt = document.getElementById('pwa-prompt');
  const pwaInstall = document.getElementById('pwa-install');
  const pwaCancel = document.getElementById('pwa-cancel');
  
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show the install prompt after a short delay
    setTimeout(() => {
      if (pwaPrompt) pwaPrompt.classList.add('show');
    }, 3000);
  });
  
  // Install button event
  if (pwaInstall) {
    pwaInstall.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      
      // We've used the prompt, and can't use it again, throw it away
      deferredPrompt = null;
      
      // Hide the install promotion
      pwaPrompt.classList.remove('show');
    });
  }
  
  // Cancel button event
  if (pwaCancel) {
    pwaCancel.addEventListener('click', () => {
      pwaPrompt.classList.remove('show');
      
      // Remember the user's choice not to install for this session
      sessionStorage.setItem('pwa-prompt-dismissed', 'true');
    });
  }
  
  // Check if the app was installed
  window.addEventListener('appinstalled', (evt) => {
    console.log('App was installed');
    // You can perform additional actions after installation
  });
  
  // Check if this is a standalone PWA
  if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
    console.log('Display mode is standalone');
    // The app is running as a PWA, you can customize the experience here
  }