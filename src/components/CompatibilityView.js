/**
 * ASTRANUMERICS - SYNASTRY & COMPATIBILITY VIEW COMPONENT
 */

import { calculateSynastry } from '../utils/numerologyEngine.js';
import { addXP, unlockBadge } from '../utils/gamificationEngine.js';

export function renderCompatibilityView(containerId, primaryProfile, system = 'pythagorean') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="synastry-layout">
      <!-- Input Card for Partner / Companion Profile -->
      <div class="hero-section">
        <h2 class="font-serif text-gold mb-4" style="text-align:center;">Relationship & Synastry Matcher</h2>
        <p class="text-secondary" style="text-align:center; font-size:0.9rem; margin-bottom:20px;">
          Compare your energetic frequency with a partner, friend, or business associate.
        </p>

        <form id="synastry-form">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Your Name</label>
              <input type="text" id="syn-p1-name" class="form-input" value="${primaryProfile.name || ''}" placeholder="Person 1 Full Name" required />
            </div>
            <div class="form-group">
              <label class="form-label">Your DOB</label>
              <input type="date" id="syn-p1-dob" class="form-input" value="${primaryProfile.dob || '1995-07-21'}" required />
            </div>

            <div class="form-group">
              <label class="form-label">Companion / Partner Name</label>
              <input type="text" id="syn-p2-name" class="form-input" placeholder="e.g. Elena Vance" required />
            </div>
            <div class="form-group">
              <label class="form-label">Companion / Partner DOB</label>
              <input type="date" id="syn-p2-dob" class="form-input" value="1993-11-12" required />
            </div>
          </div>

          <div style="text-align:center; margin-top:16px;">
            <button type="submit" class="btn-primary">
              <span>💕 Calculate Synastry Match</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Results Display Pane -->
      <div id="synastry-results"></div>
    </div>
  `;

  const form = container.querySelector('#synastry-form');
  const resultsDiv = container.querySelector('#synastry-results');

  const runCalculation = (p1, p2) => {
    const res = calculateSynastry(p1, p2, system);

    resultsDiv.innerHTML = `
      <div class="synastry-score-box">
        <span class="card-tag">Energetic Alignment Index</span>
        <div class="synastry-score-ring">
          <span class="score-value">${res.score}</span>
          <span class="score-percent">/ 100</span>
        </div>
        <h2 class="font-serif text-gold">${res.status}</h2>
        <p class="text-secondary" style="font-size:0.92rem; max-width:540px; margin: 12px auto 0 auto;">
          ${p1.name}'s Life Path <strong>${res.profileA.lp}</strong> harmonizes with ${p2.name}'s Life Path <strong>${res.profileB.lp}</strong>.
          Soul Urge vibration (${res.profileA.soul} & ${res.profileB.soul}) creates an engaging spiritual dynamic.
        </p>
      </div>
    `;

    addXP(25, 'Synastry Compatibility Chart Calculated');
    unlockBadge('synastry_soul');
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
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

  // Auto-run if primary profile exists
  if (primaryProfile.name && primaryProfile.dob) {
    runCalculation(
      { name: primaryProfile.name, dob: primaryProfile.dob },
      { name: "Sample Companion", dob: "1993-11-12" }
    );
  }
}
