/**
 * ASTRANUMERICS - CYBERPUNK HUD NAVBAR COMPONENT
 */

import { toggleAudio, getAudioState } from '../utils/soundEngine.js';

export function renderNavbar(containerId, activeSystem, onSystemChange, savedCount, onOpenVault) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const isAudioActive = getAudioState();

  container.innerHTML = `
    <a href="#" class="header-brand" title="AstraNumerics Cyberpunk HUD">
      <img src="/icons/icon.svg" alt="AstraNumerics" class="brand-icon" />
      <span class="brand-title">AstraNumerics</span>
    </a>

    <div class="header-actions">
      <!-- Tactical System Status Badge -->
      <div class="sys-status-badge" title="System Status: Online">
        <span class="status-dot"></span>
        <span>SYS_ONLINE // V1.0</span>
      </div>

      <!-- 432Hz Audio Drone Toggler -->
      <button id="nav-audio-btn" class="audio-toggle-btn ${isAudioActive ? 'active' : ''}" title="Toggle 432Hz Solfeggio Audio Drone">
        <span>${isAudioActive ? '🔊 AUDIO // ON' : '🔇 AUDIO // OFF'}</span>
      </button>

      <!-- System Selector Toggle -->
      <div class="system-toggle" title="Switch Calculation Engine">
        <button class="system-btn ${activeSystem === 'pythagorean' ? 'active' : ''}" data-system="pythagorean">Pythagorean</button>
        <button class="system-btn ${activeSystem === 'chaldean' ? 'active' : ''}" data-system="chaldean">Chaldean</button>
      </div>

      <!-- Vault Quick Launcher -->
      <button id="nav-vault-btn" class="btn-ghost btn-sm" title="Saved Profiles Codex">
        💾 <span class="vault-badge-count">${savedCount}</span>
      </button>
    </div>
  `;

  // Bind Audio toggle
  const audioBtn = container.querySelector('#nav-audio-btn');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const active = toggleAudio();
      audioBtn.classList.toggle('active', active);
      audioBtn.querySelector('span').textContent = active ? '🔊 AUDIO // ON' : '🔇 AUDIO // OFF';
    });
  }

  // Bind system switcher
  container.querySelectorAll('.system-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const system = e.target.getAttribute('data-system');
      if (system && system !== activeSystem) {
        onSystemChange(system);
      }
    });
  });

  // Bind vault launcher
  const vaultBtn = container.querySelector('#nav-vault-btn');
  if (vaultBtn) {
    vaultBtn.addEventListener('click', onOpenVault);
  }
}
