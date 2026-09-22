/**
 * ASTRANUMERICS - SACRED ARTIFACT NAVBAR COMPONENT
 */

import { toggleAudio, getAudioState, playConfirmChime, playChimeTap } from '../utils/soundEngine.js';

const CHAMBER_NAMES = {
  reading: 'CHAMBER 1: CODEX',
  loshu: 'CHAMBER 2: MATRIX',
  synastry: 'CHAMBER 3: SYNASTRY',
  namelab: 'CHAMBER 4: NAME LAB',
  forecast: 'CHAMBER 5: DAILY VIBE',
  address: 'CHAMBER 6: ADDRESS',
  vault: 'CHAMBER 7: VAULT'
};

export function renderNavbar(containerId, activeSystem, onSystemChange, savedCount, onOpenVault, activeTab = 'reading') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const isAudioActive = getAudioState();
  const chamberLabel = CHAMBER_NAMES[activeTab] || 'CHAMBER 1: CODEX';

  container.innerHTML = `
    <a href="#" class="header-brand" title="AstraNumerics Console">
      <img src="/icons/icon.svg" alt="AstraNumerics" class="brand-icon" />
      <span class="brand-title">ASTRANUMERICS</span>
    </a>

    <div class="header-actions">
      <!-- Dynamic Artifact Status Badge -->
      <div class="sys-status-badge" title="Active Chamber Indicator">
        <span class="status-dot"></span>
        <span>${chamberLabel} // ACTIVE</span>
      </div>

      <!-- Metallic Chime Sound Toggler -->
      <button id="nav-audio-btn" class="audio-toggle-btn ${isAudioActive ? 'active' : ''}" title="Toggle Metallic Sound FX">
        <span>${isAudioActive ? '🔔 CHIME SOUND' : '🔕 SOUND OFF'}</span>
      </button>

      <!-- System Selector Toggle -->
      <div class="system-toggle" title="Switch Calculation Engine">
        <button class="system-btn ${activeSystem === 'pythagorean' ? 'active' : ''}" data-system="pythagorean">Pythagorean</button>
        <button class="system-btn ${activeSystem === 'chaldean' ? 'active' : ''}" data-system="chaldean">Chaldean</button>
      </div>

      <!-- Vault Quick Launcher -->
      <button id="nav-vault-btn" class="btn-ghost btn-sm" title="Saved Codex Vault">
        💾 <span class="vault-badge-count">${savedCount}</span>
      </button>
    </div>
  `;

  // Bind Audio toggle
  const audioBtn = container.querySelector('#nav-audio-btn');
  if (audioBtn) {
    audioBtn.addEventListener('mouseenter', () => playChimeTap());
    audioBtn.addEventListener('click', () => {
      const active = toggleAudio();
      audioBtn.classList.toggle('active', active);
      audioBtn.querySelector('span').textContent = active ? '🔔 CHIME SOUND' : '🔕 SOUND OFF';
    });
  }

  // Bind system switcher
  container.querySelectorAll('.system-btn').forEach(btn => {
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
