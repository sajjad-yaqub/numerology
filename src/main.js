/**
 * ASTRANUMERICS - SACRED ARTIFACT GAME CONSOLE MAIN ORCHESTRATOR
 */

import { initCosmicCanvas } from './components/CosmicBackground.js';
import { initPWAInstallBanner } from './components/PWAInstallBanner.js';
import { renderNavbar } from './components/Navbar.js';
import { renderCalculatorForm } from './components/CalculatorForm.js';
import { renderAstrolabeNav } from './components/AstrolabeNav.js';
import { renderCoreReadingView } from './components/CoreReadingView.js';
import { renderLoShuGridView } from './components/LoShuGridView.js';
import { renderCompatibilityView } from './components/CompatibilityView.js';
import { renderNameLabView } from './components/NameLabView.js';
import { renderDailyForecastView } from './components/DailyForecastView.js';
import { renderAddressPhoneView } from './components/AddressPhoneView.js';
import { renderProfileVaultView } from './components/ProfileVaultView.js';
import {
  playChimeTap,
  playConfirmChime,
  playErrorThud,
  playSuccessArpeggio,
  playMilestoneGong,
  startIdleHum,
  stopIdleHum
} from './utils/soundEngine.js';

import { initRouter, navigateTo, getPathFromTab, getRouteFromPath } from './utils/router.js';

// Application State
const state = {
  activeProfile: {
    name: 'Alexander Sterling',
    dob: '1990-05-15',
    alias: 'Alex'
  },
  activeSystem: localStorage.getItem('astranumerics_system') || 'pythagorean',
  activeTab: getRouteFromPath(window.location.pathname),
  savedProfiles: JSON.parse(localStorage.getItem('astranumerics_vault') || '[]'),
  unlockedFeatures: JSON.parse(localStorage.getItem('astranumerics_unlocked_features') || '{}')
};

/**
 * Save pending payment state before redirecting
 */
export function savePendingPaymentState(feature, extraData = {}) {
  const pending = {
    feature,
    profile: state.activeProfile,
    extraData,
    timestamp: Date.now()
  };
  localStorage.setItem('astranumerics_pending_payment', JSON.stringify(pending));
}

/**
 * Unlock a specific feature (strictly single-feature)
 */
export function unlockSpecificFeature(feature) {
  if (!feature || !['namelab', 'address', 'synastry'].includes(feature)) return;
  state.unlockedFeatures = {
    ...state.unlockedFeatures,
    [feature]: true
  };
  localStorage.setItem('astranumerics_unlocked_features', JSON.stringify(state.unlockedFeatures));
  state.activeTab = feature;
  navigateTo(getPathFromTab(feature));
  playConfirmChime();
  playSuccessArpeggio();
  renderAll();
}

/**
 * Handle redirect back from Razorpay Payment Button
 */
function checkPaymentRedirect() {
  // Normalize double question marks in URL (e.g. ?status=paid?payment_id=pay_123 -> ?status=paid&payment_id=pay_123)
  const rawSearch = window.location.search;
  const normalizedSearch = rawSearch.replace(/\?/g, (match, offset) => offset === 0 ? '?' : '&');
  const urlParams = new URLSearchParams(normalizedSearch);
  const fullSearch = rawSearch + normalizedSearch;
  const currentPath = window.location.pathname.toLowerCase();

  const statusParam = urlParams.get('status');
  const featureParam = urlParams.get('feature');
  const rzpPaymentId = urlParams.get('payment_id') || urlParams.get('razorpay_payment_id');
  const rzpLinkStatus = urlParams.get('razorpay_payment_link_status');
  const rzpPaymentLinkId = urlParams.get('razorpay_payment_link_id');

  // ONLY execute if explicitly returning from a payment
  const isPaymentReturn = 
    !!featureParam || 
    !!rzpPaymentId || 
    rzpLinkStatus === 'paid' || 
    !!rzpPaymentLinkId || 
    statusParam === 'paid' || 
    statusParam === 'success' || 
    statusParam === '1' ||
    fullSearch.includes('razorpay') ||
    fullSearch.includes('paid') ||
    fullSearch.includes('payment_id') ||
    (currentPath.includes('namelab') && fullSearch.length > 1) ||
    (currentPath.includes('address') && fullSearch.length > 1) ||
    (currentPath.includes('synastry') && fullSearch.length > 1);

  if (!isPaymentReturn) {
    return;
  }

  const pendingRaw = localStorage.getItem('astranumerics_pending_payment');
  let pending = null;
  if (pendingRaw) {
    try {
      pending = JSON.parse(pendingRaw);
    } catch (e) {
      console.warn('Error parsing pending payment:', e);
    }
  }

  // Determine ONLY the exact single feature that was paid for:
  let targetFeature = null;

  // 1. Direct route path match (/namelab, /address, /synastry)
  if (currentPath.includes('namelab')) targetFeature = 'namelab';
  else if (currentPath.includes('address')) targetFeature = 'address';
  else if (currentPath.includes('synastry')) targetFeature = 'synastry';

  // 2. Razorpay Link / Button ID match in URL
  if (!targetFeature) {
    if (fullSearch.includes('Tf9QgdupaiZRzc') || rzpPaymentLinkId?.includes('Tf9QgdupaiZRzc')) {
      targetFeature = 'namelab';
    } else if (fullSearch.includes('Tf9gZgt7fSf8FR') || rzpPaymentLinkId?.includes('Tf9gZgt7fSf8FR')) {
      targetFeature = 'address';
    } else if (fullSearch.includes('Tf9iPpPjF9mZD9') || rzpPaymentLinkId?.includes('Tf9iPpPjF9mZD9')) {
      targetFeature = 'synastry';
    }
  }

  // 3. Explicit query param ?feature=...
  if (!targetFeature && featureParam && ['namelab', 'address', 'synastry'].includes(featureParam)) {
    targetFeature = featureParam;
  }

  // 4. Pending localStorage feature
  if (!targetFeature && pending && pending.feature) {
    targetFeature = pending.feature;
  }

  // 5. Current activeTab if paid feature
  if (!targetFeature && ['namelab', 'address', 'synastry'].includes(state.activeTab)) {
    targetFeature = state.activeTab;
  }

  if (targetFeature && ['namelab', 'address', 'synastry'].includes(targetFeature)) {
    // STRICTLY UNLOCK ONLY THIS SPECIFIC FEATURE
    state.unlockedFeatures = {
      ...state.unlockedFeatures,
      [targetFeature]: true
    };

    // Save unlocked status permanently in localStorage
    localStorage.setItem('astranumerics_unlocked_features', JSON.stringify(state.unlockedFeatures));

    // Restore profile if saved in pending state
    if (pending && pending.profile && pending.profile.name) {
      state.activeProfile = { ...pending.profile };
    }

    // NAVIGATE DIRECTLY TO THE UNLOCKED CHAMBER PATH
    state.activeTab = targetFeature;
    navigateTo(getPathFromTab(targetFeature));

    // Clear pending state
    localStorage.removeItem('astranumerics_pending_payment');

    playConfirmChime();
    playSuccessArpeggio();

    // Clean address bar query string back to clean route path
    if (window.location.search) {
      window.history.replaceState({}, document.title, getPathFromTab(targetFeature));
    }

    // IMMEDIATELY RE-RENDER DOM SO PAGE UNLOCKS AUTOMATICALLY WITHOUT REFRESH!
    renderAll();
  }
}

/**
 * Initialize listeners for automatic unlock without requiring manual page refresh
 */
function initPaymentAutoUnlockListeners() {
  // PostMessage listener for Razorpay modal completion
  window.addEventListener('message', (event) => {
    try {
      let data = event.data;
      if (typeof data === 'string' && data.startsWith('{')) {
        data = JSON.parse(data);
      }
      if (data && (data.razorpay_payment_id || data.event === 'payment.success' || data.status === 'paid')) {
        const pendingRaw = localStorage.getItem('astranumerics_pending_payment');
        if (pendingRaw) {
          const pending = JSON.parse(pendingRaw);
          if (pending && pending.feature) {
            unlockSpecificFeature(pending.feature);
          }
        }
      }
    } catch (e) {
      // Ignore non-JSON postMessage events
    }
  });

  // Tab focus / visibilitychange listener for mobile app return
  const handleTabReturn = () => {
    checkPaymentRedirect();
  };

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      handleTabReturn();
    }
  });

  window.addEventListener('focus', handleTabReturn);
}

/**
 * Save vault state to LocalStorage
 */
function saveVaultToStorage() {
  localStorage.setItem('astranumerics_vault', JSON.stringify(state.savedProfiles));
}

/**
 * Register Service Worker for PWA Offline Capabilities
 */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('[PWA] Service Worker registered:', reg.scope))
        .catch((err) => console.warn('[PWA] Service Worker registration failed:', err));
    });
  }
}

/**
 * Trigger Oxblood Screen Shake + Thud Sound on Error
 */
export function triggerArcadeError() {
  playErrorThud();
  const main = document.getElementById('app-container');
  if (main) {
    main.classList.remove('arcade-shake');
    void main.offsetWidth; // Force reflow
    main.classList.add('arcade-shake');
    setTimeout(() => main.classList.remove('arcade-shake'), 300);
  }
}

/**
 * Attach metallic sound cues to dynamic DOM elements
 */
function attachGameAudioTriggers() {
  document.querySelectorAll('button, input, select, .number-card, .loshu-cell, .vault-card').forEach(el => {
    if (!el.dataset.audioBound) {
      el.dataset.audioBound = 'true';
      el.addEventListener('mouseenter', () => playChimeTap());
      el.addEventListener('click', () => playConfirmChime());
    }
  });
}

/**
 * Render Active Tab View (Ritual Chambers)
 */
function renderTabContent() {
  const { activeTab, activeProfile, activeSystem, savedProfiles, unlockedFeatures } = state;

  // Manage Idle Hum (hum ONLY on idle/home state, NOT during active reading screens)
  if (activeTab === 'reading' && (!activeProfile.name || !activeProfile.dob)) {
    startIdleHum();
  } else {
    stopIdleHum();
  }

  // Update tab panes visibility
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.remove('active');
  });

  const heroSection = document.getElementById('hero-section');
  if (heroSection) {
    const showHero = ['reading', 'loshu', 'forecast'].includes(activeTab);
    heroSection.style.display = showHero ? 'block' : 'none';
  }

  const activePane = document.getElementById(`pane-${activeTab}`);
  if (activePane) activePane.classList.add('active');

  // Render specific chamber component
  switch (activeTab) {
    case 'reading':
      renderCoreReadingView('pane-reading', activeProfile, activeSystem);
      break;
    case 'loshu':
      renderLoShuGridView('pane-loshu', activeProfile);
      break;
    case 'synastry':
      renderCompatibilityView('pane-synastry', activeProfile, activeSystem, !!unlockedFeatures.synastry);
      break;
    case 'namelab':
      renderNameLabView('pane-namelab', activeProfile.name, activeSystem, !!unlockedFeatures.namelab);
      break;
    case 'forecast':
      renderDailyForecastView('pane-forecast', activeProfile);
      break;
    case 'address':
      renderAddressPhoneView('pane-address', activeSystem, !!unlockedFeatures.address);
      break;

    case 'vault':
      renderProfileVaultView(
        'pane-vault',
        savedProfiles,
        (profileToLoad) => {
          state.activeProfile = { ...profileToLoad };
          state.activeTab = 'reading';
          navigateTo(getPathFromTab('reading'));
          playMilestoneGong();
          renderAll();
        },
        (idxToDelete) => {
          state.savedProfiles.splice(idxToDelete, 1);
          saveVaultToStorage();
          renderAll();
        },
        () => {
          // Export JSON
          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.savedProfiles, null, 2));
          const dlAnchor = document.createElement('a');
          dlAnchor.setAttribute("href", dataStr);
          dlAnchor.setAttribute("download", `AstraNumerics_Vault_Backup_${new Date().toISOString().slice(0,10)}.json`);
          document.body.appendChild(dlAnchor);
          dlAnchor.click();
          dlAnchor.remove();
        },
        (importedProfiles) => {
          state.savedProfiles = [...importedProfiles];
          saveVaultToStorage();
          renderAll();
          playSuccessArpeggio();
          alert(`Successfully imported ${importedProfiles.length} profiles into Vault.`);
        }
      );
      break;
  }

  // Render Navbar with dynamic active chamber indicator
  renderNavbar(
    'app-header',
    state.activeSystem,
    (newSystem) => {
      state.activeSystem = newSystem;
      localStorage.setItem('astranumerics_system', newSystem);
      renderAll();
    },
    state.savedProfiles.length,
    () => {
      state.activeTab = 'vault';
      navigateTo(getPathFromTab('vault'));
      playConfirmChime();
      renderTabContent();
    },
    state.activeTab
  );

  // Render Chamber Reel Bottom Stage Selector
  renderAstrolabeNav('astrolabe-nav-container', state.activeTab, (selectedTab) => {
    if (selectedTab !== state.activeTab) {
      playConfirmChime();
      state.activeTab = selectedTab;
      navigateTo(getPathFromTab(selectedTab));
      renderTabContent();
    }
  });

  attachGameAudioTriggers();
}

/**
 * Render Entire Application DOM
 */
function renderAll() {
  renderNavbar(
    'app-header',
    state.activeSystem,
    (newSystem) => {
      state.activeSystem = newSystem;
      localStorage.setItem('astranumerics_system', newSystem);
      renderAll();
    },
    state.savedProfiles.length,
    () => {
      state.activeTab = 'vault';
      navigateTo(getPathFromTab('vault'));
      playConfirmChime();
      renderTabContent();
    },
    state.activeTab
  );

  renderCalculatorForm(
    'hero-section',
    state.activeProfile,
    (updatedProfile) => {
      state.activeProfile = { ...updatedProfile };
      state.activeTab = 'reading';
      navigateTo(getPathFromTab('reading'));
      playSuccessArpeggio();
      renderTabContent();
    },
    (profileToSave) => {
      const exists = state.savedProfiles.some(p => p.name === profileToSave.name && p.dob === profileToSave.dob);
      if (!exists) {
        state.savedProfiles.push(profileToSave);
        saveVaultToStorage();
        playMilestoneGong();
        renderAll();
        alert(`Profile "${profileToSave.name}" saved to Save Slot Vault!`);
      } else {
        triggerArcadeError();
        alert(`Profile "${profileToSave.name}" is already in your Save Slot Vault.`);
      }
    }
  );

  renderTabContent();
}

/**
 * Application Bootstrap
 */
function init() {
  registerServiceWorker();
  initCosmicCanvas('cosmic-canvas');
  initPWAInstallBanner();
  initPaymentAutoUnlockListeners();

  // Initialize router popstate listener
  initRouter((newTab) => {
    state.activeTab = newTab;
    renderAll();
  });

  checkPaymentRedirect();
  renderAll();
}

document.addEventListener('DOMContentLoaded', init);
