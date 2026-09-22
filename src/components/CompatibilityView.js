/**
 * ASTRANUMERICS - ARCADE VERSUS MODE / SYNASTRY SCREEN
 */

import { calculateSynastry } from '../utils/numerologyEngine.js';
import { playConfirmSound, playBlipSound } from '../utils/soundEngine.js';

export function renderCompatibilityView(containerId, primaryProfile, system = 'pythagorean') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="synastry-layout">
      <!-- Input Card for Player 2 -->
      <div class="hero-section">
        <h2 class="font-serif text-coral mb-4" style="text-align:center;">🎮 STAGE 3: VERSUS SYNASTRY MATCH</h2>
        <p class="text-secondary" style="text-align:center; font-size:0.9rem; margin-bottom:20px;">
          Match your energetic stats against a companion, partner, or rival in 2-Player VS Mode.
        </p>

        <form id="synastry-form">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">PLAYER 1 NAME</label>
              <input type="text" id="syn-p1-name" class="form-input" value="${primaryProfile.name || ''}" placeholder="Player 1 Name" required />
            </div>
            <div class="form-group">
              <label class="form-label">PLAYER 1 DOB</label>
              <input type="date" id="syn-p1-dob" class="form-input" value="${primaryProfile.dob || '1995-07-21'}" required />
            </div>

            <div class="form-group">
              <label class="form-label">PLAYER 2 NAME</label>
              <input type="text" id="syn-p2-name" class="form-input" placeholder="e.g. Elena Vance" required />
            </div>
            <div class="form-group">
              <label class="form-label">PLAYER 2 DOB</label>
              <input type="date" id="syn-p2-dob" class="form-input" value="1993-11-12" required />
            </div>
          </div>

          <div style="text-align:center; margin-top:16px;">
            <button type="submit" class="btn-primary">
              <span>⚔️ CALCULATE VS SYNASTRY</span>
            </button>
          </div>
        </form>
      </div>

      <!-- VS Match Results -->
      <div id="synastry-results"></div>
    </div>
  `;

  const form = container.querySelector('#synastry-form');
  const resultsDiv = container.querySelector('#synastry-results');

  const runCalculation = (p1, p2) => {
    const res = calculateSynastry(p1, p2, system);

    resultsDiv.innerHTML = `
      <div class="synastry-score-box">
        <span class="card-tag">PARTY ALIGNMENT INDEX</span>
        <div class="synastry-score-ring">
          <span class="score-value">${res.score}</span>
          <span class="score-percent">/ 100 HP</span>
        </div>
        <h2 class="font-serif text-yellow" style="font-size:2.2rem; margin-top:8px;">${res.status}</h2>

        <div class="hp-meter-box" style="max-width:500px; margin: 16px auto;">
          <div class="hp-meter-label">
            <span>PLAYER 1 [LP ${res.profileA.lp}] vs PLAYER 2 [LP ${res.profileB.lp}]</span>
            <span>${res.score}% SYNERGY</span>
          </div>
          <div class="hp-meter-track">
            <div class="hp-meter-fill" style="width: ${res.score}%;"></div>
          </div>
        </div>

        <p class="text-secondary" style="font-size:0.95rem; max-width:540px; margin: 12px auto 0 auto;">
          ${p1.name}'s Life Path <strong>${res.profileA.lp}</strong> links with ${p2.name}'s Life Path <strong>${res.profileB.lp}</strong>.
          Soul Urge vibration (${res.profileA.soul} & ${res.profileB.soul}) creates an engaging party synergy dynamic.
        </p>
      </div>
    `;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    playConfirmSound();
    const p1 = {
      name: form.querySelector('#syn-p1-name').value.trim(),
      dob: form.querySelector('#syn-p1-dob').value
    };
    const p2 = {
      name: form.querySelector('#syn-p2-name').value.trim(),
      dob: form.querySelector('#syn-p2-dob').value
    };
    if (p1.name && p1.dob && p2.name && p2.dob) {
      runCalculation(p1, p2);
    }
  });

  // Sound triggers
  container.querySelectorAll('button, input').forEach(el => {
    el.addEventListener('mouseenter', () => playBlipSound());
  });

  if (primaryProfile.name && primaryProfile.dob) {
    runCalculation(
      { name: primaryProfile.name, dob: primaryProfile.dob },
      { name: "Sample Companion", dob: "1993-11-12" }
    );
  }
}
