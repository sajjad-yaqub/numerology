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

// Application State
const state = {
  activeProfile: {
    name: 'Alexander Sterling',
    dob: '1990-05-15',
    alias: 'Alex'
  },
  activeSystem: localStorage.getItem('astranumerics_system') || 'pythagorean',
  activeTab: 'reading',
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
 * Handle redirect back from Razorpay Payment Button (https://www.astranumerics.com/?status=success&feature=...)
 */
function checkPaymentRedirect() {
  const urlParams = new URLSearchParams(window.location.search);
  const statusParam = urlParams.get('status');
  const featureParam = urlParams.get('feature');
  const rzpPaymentId = urlParams.get('razorpay_payment_id');
  const rzpLinkStatus = urlParams.get('razorpay_payment_link_status');
  const rzpPaymentLinkId = urlParams.get('razorpay_payment_link_id');

  const pendingRaw = localStorage.getItem('astranumerics_pending_payment');
  let pending = null;
  if (pendingRaw) {
    try {
      pending = JSON.parse(pendingRaw);
    } catch (e) {
      console.warn('Error parsing pending payment:', e);
    }
  }

  // Check if this is a payment return from Razorpay
  const isPaymentReturn = 
    rzpPaymentId || 
    rzpLinkStatus === 'paid' || 
    rzpPaymentLinkId || 
    statusParam === 'success' || 
    statusParam === '1' ||
    (window.location.search.length > 1 && (rzpPaymentId || statusParam));

  if (isPaymentReturn || (pending && (Date.now() - pending.timestamp < 3600000))) {
    // Determine feature to unlock
    let targetFeature = featureParam;
    if (!targetFeature && pending && pending.feature) {
      targetFeature = pending.feature;
    }

    // Restore profile if saved in pending state
    if (pending && pending.profile && pending.profile.name) {
      state.activeProfile = { ...pending.profile };
    }

    // Unlock target feature (or unlock all paid chambers as a customer-friendly fail-safe)
    if (targetFeature) {
      state.unlockedFeatures[targetFeature] = true;
    } else {
      state.unlockedFeatures['namelab'] = true;
      state.unlockedFeatures['address'] = true;
      state.unlockedFeatures['synastry'] = true;
      targetFeature = 'namelab';
    }

    // Save unlocked status permanently in localStorage
    localStorage.setItem('astranumerics_unlocked_features', JSON.stringify(state.unlockedFeatures));

    // NAVIGATE DIRECTLY TO THE UNLOCKED CHAMBER TAB (Not home reading page!)
    state.activeTab = targetFeature;

    // Clear pending state
    localStorage.removeItem('astranumerics_pending_payment');

    playConfirmChime();
    playSuccessArpeggio();

    // Clean address bar query string back to clean domain URL
    if (window.location.search) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }
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
  checkPaymentRedirect();

  renderAll();
}

document.addEventListener('DOMContentLoaded', init);
