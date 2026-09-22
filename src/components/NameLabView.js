/**
 * ASTRANUMERICS - NAME OPTIMIZATION LAB COMPONENT
 */

import { calculateNameNumbers } from '../utils/numerologyEngine.js';
import { CORE_INTERPRETATIONS } from '../data/numerologyData.js';

export function renderNameLabView(containerId, initialName = '', system = 'pythagorean') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="namelab-container">
      <h2 class="font-serif text-gold mb-4" style="text-align:center;">🧪 Name Optimization & Vibration Lab</h2>
      <p class="text-secondary" style="text-align:center; font-size:0.9rem; margin-bottom:24px;">
        Test alternate spellings, business titles, pen names, or brand names to see instant energetic vibration shifts.
      </p>

      <div class="form-group" style="max-width:540px; margin:0 auto 24px auto;">
        <label class="form-label" for="lab-name-input">Type Any Name or Phrase</label>
        <input type="text" id="lab-name-input" class="form-input" value="${initialName || 'Astra Lightworks'}" placeholder="Enter name to test..." />
      </div>

      <div id="lab-results"></div>
    </div>
  `;

  const input = container.querySelector('#lab-name-input');
  const resultsDiv = container.querySelector('#lab-results');

  const updateLab = () => {
    const text = input.value.trim();
    if (!text) {
      resultsDiv.innerHTML = `<p class="text-muted" style="text-align:center;">Type a name to begin live vibration analysis.</p>`;
      return;
    }

    const nameNums = calculateNameNumbers(text, system);
    const interpExp = CORE_INTERPRETATIONS[nameNums.expression.reduced] || CORE_INTERPRETATIONS[1];
    const interpSoul = CORE_INTERPRETATIONS[nameNums.soulUrge.reduced] || CORE_INTERPRETATIONS[1];

    resultsDiv.innerHTML = `
      <!-- Letter Tag Ribbon -->
      <div style="text-align:center; margin-bottom:12px;">
        <span class="card-tag">Letter-by-Letter Breakdown (${system.toUpperCase()} System)</span>
      </div>

      <div class="letter-breakdown-grid" style="justify-content:center;">
        ${nameNums.letterDetails.map(item => `
          <div class="letter-tag ${item.isVowel ? 'vowel' : ''}" title="${item.isVowel ? 'Vowel (Soul Urge)' : 'Consonant (Personality)'}">
            <span class="letter-char">${item.char.toUpperCase()}</span>
            <span class="letter-val">${item.val}</span>
          </div>
        `).join('')}
      </div>

      <!-- Core Summary Badges -->
      <div class="reading-grid" style="margin-top:24px;">
        <div class="number-card">
          <div class="card-header-badge">
            <span class="card-tag">Expression Number</span>
            <div class="number-badge-glow">${nameNums.expression.reduced}</div>
          </div>
          <h3 class="card-title">${interpExp.title}</h3>
          <p class="card-summary">${interpExp.summary}</p>
        </div>

        <div class="number-card">
          <div class="card-header-badge">
            <span class="card-tag">Soul Urge (Vowels)</span>
            <div class="number-badge-glow">${nameNums.soulUrge.reduced}</div>
          </div>
          <h3 class="card-title">${interpSoul.title}</h3>
          <p class="card-summary">${interpSoul.summary}</p>
        </div>

        <div class="number-card">
          <div class="card-header-badge">
            <span class="card-tag">Personality (Consonants)</span>
            <div class="number-badge-glow">${nameNums.personality.reduced}</div>
          </div>
          <h3 class="card-title">Outer Vibration ${nameNums.personality.reduced}</h3>
          <p class="card-summary">This represents the outer impression and initial aura projected by this name vibration.</p>
        </div>
      </div>
    `;
  };

  input.addEventListener('input', updateLab);
  updateLab();
}
