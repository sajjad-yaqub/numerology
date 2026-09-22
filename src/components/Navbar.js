/**
 * ASTRANUMERICS - SACRED ARTIFACT NAVBAR COMPONENT
 */

import { toggleAudio, getAudioState, playConfirmChime, playChimeTap } from '../utils/soundEngine.js';
import { getLanguage, setLanguage, t } from '../utils/i18n.js';

export function renderNavbar(containerId, activeSystem, onSystemChange, savedCount, onOpenVault, activeTab = 'reading') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const isAudioActive = getAudioState();
  const currentLang = getLanguage();

  const chamberLabels = {
    reading: `CHAMBER 1: ${t('chambers.codex', 'CODEX')}`,
    loshu: `CHAMBER 2: ${t('chambers.matrix', 'MATRIX')}`,
    synastry: `CHAMBER 3: ${t('chambers.synastry', 'SYNASTRY')}`,
    namelab: `CHAMBER 4: ${t('chambers.nameLab', 'NAME LAB')}`,
    forecast: `CHAMBER 5: ${t('chambers.dailyVibe', 'DAILY VIBE')}`,
    address: `CHAMBER 6: ${t('chambers.address', 'ADDRESS')}`,
    vault: `CHAMBER 7: ${t('chambers.vault', 'VAULT')}`
  };

  const activeChamberLabel = chamberLabels[activeTab] || chamberLabels.reading;

  container.innerHTML = `
    <a href="#" class="header-brand" title="AstraNumerics Console">
      <img src="/icons/icon.svg" alt="AstraNumerics" class="brand-icon" />
      <span class="brand-title">${t('brand', 'ASTRANUMERICS')}</span>
    </a>

    <div class="header-actions">
      <!-- Dynamic Artifact Status Badge -->
      <div class="sys-status-badge" title="Active Chamber Indicator">
        <span class="status-dot"></span>
        <span>${activeChamberLabel} // ACTIVE</span>
      </div>

      <!-- i18n Language Switcher Toggle -->
      <div class="system-toggle lang-switcher" title="Select Display Language">
        <button class="system-btn ${currentLang === 'en' ? 'active' : ''}" data-lang="en">EN</button>
        <button class="system-btn ${currentLang === 'hi' ? 'active' : ''}" data-lang="hi">हिन्दी</button>
        <button class="system-btn ${currentLang === 'ta' ? 'active' : ''}" data-lang="ta">தமிழ்</button>
      </div>

      <!-- Metallic Chime Sound Toggler -->
      <button id="nav-audio-btn" class="audio-toggle-btn ${isAudioActive ? 'active' : ''}" title="Toggle Metallic Sound FX">
        <span>${isAudioActive ? t('audio.on', '🔔 CHIME SOUND') : t('audio.off', '🔕 SOUND OFF')}</span>
      </button>

      <!-- System Selector Toggle -->
      <div class="system-toggle" title="Switch Calculation Engine">
        <button class="system-btn ${activeSystem === 'pythagorean' ? 'active' : ''}" data-system="pythagorean">${t('system.pythagorean', 'Pythagorean')}</button>
        <button class="system-btn ${activeSystem === 'chaldean' ? 'active' : ''}" data-system="chaldean">${t('system.chaldean', 'Chaldean')}</button>
      </div>

      <!-- Vault Quick Launcher -->
      <button id="nav-vault-btn" class="btn-ghost btn-sm" title="Saved Codex Vault">
        💾 <span class="vault-badge-count">${savedCount}</span>
      </button>
    </div>
  `;

  // Bind Language switcher
  container.querySelectorAll('.lang-switcher .system-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => playChimeTap());
    btn.addEventListener('click', (e) => {
      playConfirmChime();
      const lang = e.target.getAttribute('data-lang');
      if (lang && lang !== currentLang) {
        setLanguage(lang);
      }
    });
  });

  // Bind Audio toggle
  const audioBtn = container.querySelector('#nav-audio-btn');
  if (audioBtn) {
    audioBtn.addEventListener('mouseenter', () => playChimeTap());
    audioBtn.addEventListener('click', () => {
      const active = toggleAudio();
      audioBtn.classList.toggle('active', active);
      audioBtn.querySelector('span').textContent = active ? t('audio.on', '🔔 CHIME SOUND') : t('audio.off', '🔕 SOUND OFF');
    });
  }

  // Bind system switcher
  container.querySelectorAll('.system-toggle:not(.lang-switcher) .system-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => playChimeTap());
    btn.addEventListener('click', (e) => {
      playConfirmChime();
      const system = e.target.getAttribute('data-system');
      if (system && system !== activeSystem) {
        onSystemChange(system);
      }
    });
  });

  // Bind vault launcher
  const vaultBtn = container.querySelector('#nav-vault-btn');
  if (vaultBtn) {
    vaultBtn.addEventListener('mouseenter', () => playChimeTap());
    vaultBtn.addEventListener('click', () => {
      playConfirmChime();
      onOpenVault();
    });
  }
}

