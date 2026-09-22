/**
 * ASTRANUMERICS - PWA INSTALL BANNER COMPONENT
 * Listens for beforeinstallprompt and provides direct PWA installation.
 */

let deferredPrompt = null;

export function initPWAInstallBanner() {
  const banner = document.getElementById('pwa-install-banner');
  const installBtn = document.getElementById('pwa-install-btn');
  const dismissBtn = document.getElementById('pwa-dismiss-btn');

  if (!banner || !installBtn || !dismissBtn) return;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Show PWA install banner if not dismissed previously
    if (!localStorage.getItem('astranumerics_pwa_dismissed')) {
      banner.classList.remove('hidden');
    }
  });

  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    banner.classList.add('hidden');
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] Install prompt outcome: ${outcome}`);
    deferredPrompt = null;
  });

  dismissBtn.addEventListener('click', () => {
    banner.classList.add('hidden');
    localStorage.setItem('astranumerics_pwa_dismissed', 'true');
  });

  window.addEventListener('appinstalled', () => {
    banner.classList.add('hidden');
    console.log('[PWA] AstraNumerics installed successfully');
  });
}
