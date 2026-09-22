/**
 * ASTRANUMERICS - SACRED OBSERVATORY MAIN CONTROLLER
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

// Application State
const state = {
  activeProfile: {
    name: 'Alexander Sterling',
    dob: '1990-05-15',
    alias: 'Alex'
  },
  activeSystem: localStorage.getItem('astranumerics_system') || 'pythagorean',
  activeTab: 'reading',
  savedProfiles: JSON.parse(localStorage.getItem('astranumerics_vault') || '[]')
};

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
 * Render Active Tab View
 */
function renderTabContent() {
  const { activeTab, activeProfile, activeSystem, savedProfiles } = state;

  // Update tab panes visibility
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.remove('active');
  });

  const activePane = document.getElementById(`pane-${activeTab}`);
  if (activePane) activePane.classList.add('active');

  // Render specific tab component
  switch (activeTab) {
    case 'reading':
      renderCoreReadingView('pane-reading', activeProfile, activeSystem);
      break;
    case 'loshu':
      renderLoShuGridView('pane-loshu', activeProfile);
      break;
    case 'synastry':
      renderCompatibilityView('pane-synastry', activeProfile, activeSystem);
      break;
    case 'namelab':
      renderNameLabView('pane-namelab', activeProfile.name, activeSystem);
      break;
    case 'forecast':
      renderDailyForecastView('pane-forecast', activeProfile);
      break;
    case 'address':
      renderAddressPhoneView('pane-address', activeSystem);
      break;
    case 'vault':
      renderProfileVaultView(
        'pane-vault',
        savedProfiles,
        (profileToLoad) => {
          state.activeProfile = { ...profileToLoad };
          state.activeTab = 'reading';
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
          alert(`Successfully imported ${importedProfiles.length} profiles into Vault.`);
        }
      );
      break;
  }

  // Update Astrolabe Navigation UI
  renderAstrolabeNav('astrolabe-nav-container', state.activeTab, (selectedTab) => {
    state.activeTab = selectedTab;
    renderTabContent();
  });
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
      renderTabContent();
    }
  );

  renderCalculatorForm(
    'hero-section',
    state.activeProfile,
    (updatedProfile) => {
      state.activeProfile = { ...updatedProfile };
      state.activeTab = 'reading';
      renderTabContent();
    },
    (profileToSave) => {
      const exists = state.savedProfiles.some(p => p.name === profileToSave.name && p.dob === profileToSave.dob);
      if (!exists) {
        state.savedProfiles.push(profileToSave);
        saveVaultToStorage();
        renderAll();
        alert(`Profile "${profileToSave.name}" saved to Vault!`);
      } else {
        alert(`Profile "${profileToSave.name}" is already in your Vault.`);
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

  renderAll();
}

document.addEventListener('DOMContentLoaded', init);
