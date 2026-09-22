import { calculateNameNumbers } from '../utils/numerologyEngine.js';
import { CORE_INTERPRETATIONS } from '../data/numerologyData.js';
import { playChimeTap, playConfirmChime } from '../utils/soundEngine.js';
import { isFeatureUnlocked, saveStateAndRedirectToRazorpay, FEATURE_PRICING } from '../utils/paymentEngine.js';

export function renderNameLabView(containerId, initialName = '', system = 'pythagorean', activeProfile = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const unlocked = isFeatureUnlocked('namelab');
  const pricing = FEATURE_PRICING.namelab;

  container.innerHTML = `
    <div class="namelab-container">
      <h2 class="font-serif-carved text-oxblood mb-4" style="text-align:center;">🧪 CHAMBER 4: NAME TRANSMUTER LAB</h2>
      <p class="text-secondary" style="text-align:center; font-size:0.95rem; margin-bottom:24px;">
        Type any name, business title, or alias to analyze instant frequency shifts.
      </p>

      <div class="form-group" style="max-width:540px; margin:0 auto 24px auto;">
        <label class="form-label" for="lab-name-input">INPUT NAME / TITLE PHRASE</label>
        <input type="text" id="lab-name-input" class="form-input" value="${initialName || 'Astra Lightworks'}" placeholder="Enter name to test..." />
      </div>

      ${!unlocked ? `
        <div class="number-card paywall-gating-card mb-6" style="max-width:540px; margin: 0 auto 24px auto; text-align: center; border-color: var(--accent-brass); background: rgba(156, 107, 31, 0.05);">
          <span class="card-tag">SACRED UNLOCK REQUIRED</span>
          <h3 class="font-serif-carved text-accent" style="margin-top:8px;">UNLOCK NAME TRANSMUTER LAB</h3>
          <p class="text-secondary" style="font-size:0.9rem; margin-bottom:16px;">
            ${pricing.description}
          </p>
          <button id="btn-unlock-namelab" class="btn-gold btn-md" style="font-weight:bold; font-size:1rem; padding: 12px 24px;">
            ⚡ UNLOCK NOW FOR ${pricing.formattedPrice} (UPI / GPay)
          </button>
        </div>
      ` : ''}

      <div id="lab-results"></div>
    </div>
  `;

  const input = container.querySelector('#lab-name-input');
  const resultsDiv = container.querySelector('#lab-results');
  const unlockBtn = container.querySelector('#btn-unlock-namelab');

  if (unlockBtn) {
    unlockBtn.addEventListener('click', () => {
      playConfirmChime();
      const currentInput = input ? input.value.trim() : initialName;
      saveStateAndRedirectToRazorpay('namelab', activeProfile || { name: currentInput }, { currentInput });
    });
  }

  const updateLab = () => {
    const text = input.value.trim();
    if (!text) {
      resultsDiv.innerHTML = `<p class="text-secondary" style="text-align:center;">Type a phrase above to begin energy analysis.</p>`;
      return;
    }

    const nameNums = calculateNameNumbers(text, system);
    const interpExp = CORE_INTERPRETATIONS[nameNums.expression.reduced] || CORE_INTERPRETATIONS[1];
    const interpSoul = CORE_INTERPRETATIONS[nameNums.soulUrge.reduced] || CORE_INTERPRETATIONS[1];

    if (!unlocked) {
      // Show teaser breakdown for unpaid users
      resultsDiv.innerHTML = `
        <div style="text-align:center; opacity: 0.6; pointer-events: none; filter: blur(1px);">
          <span class="card-tag">SAMPLE TEASER (${system.toUpperCase()})</span>
          <div class="reading-grid" style="margin-top:16px;">
            <div class="number-card">
              <div class="card-header-badge">
                <span class="card-tag">EXPRESSION VALUE</span>
                <div class="number-badge-glow">${nameNums.expression.reduced}</div>
              </div>
              <h3 class="card-title">${interpExp.title}</h3>
              <p class="card-summary">🔒 Unlock for ${pricing.formattedPrice} to reveal complete Chaldean letter breakdown & Navagraha analysis.</p>
            </div>
          </div>
        </div>
      `;
      return;
    }

    resultsDiv.innerHTML = `
      <div style="text-align:center; margin-bottom:12px;">
        <span class="card-tag">LETTER FREQUENCY BREAKDOWN (${system.toUpperCase()})</span>
      </div>

      <div class="letter-breakdown-grid" style="justify-content:center;">
        ${nameNums.letterDetails.map(item => `
          <div class="letter-tag ${item.isVowel ? 'vowel' : ''}" title="${item.isVowel ? 'Vowel (Soul Urge)' : 'Consonant (Personality)'}">
            <span class="letter-char">${item.char.toUpperCase()}</span>
            <span class="letter-val">${item.val}</span>
          </div>
        `).join('')}
      </div>

      <div class="reading-grid" style="margin-top:24px;">
        <div class="number-card">
          <div class="card-header-badge">
            <span class="card-tag">EXPRESSION VALUE</span>
            <div class="number-badge-glow">${nameNums.expression.reduced}</div>
          </div>
          <h3 class="card-title">${interpExp.title}</h3>
          <p class="card-summary">${interpExp.summary}</p>
        </div>

        <div class="number-card">
          <div class="card-header-badge">
            <span class="card-tag">SOUL URGE (VOWELS)</span>
            <div class="number-badge-glow">${nameNums.soulUrge.reduced}</div>
          </div>
          <h3 class="card-title">${interpSoul.title}</h3>
          <p class="card-summary">${interpSoul.summary}</p>
        </div>

        <div class="number-card">
          <div class="card-header-badge">
            <span class="card-tag">PERSONALITY SHIELD</span>
            <div class="number-badge-glow">${nameNums.personality.reduced}</div>
          </div>
          <h3 class="card-title">Outer Vibration ${nameNums.personality.reduced}</h3>
          <p class="card-summary">Outer aura and initial impression projected by this title vibration.</p>
        </div>
      </div>
    `;
  };

  input.addEventListener('input', () => {
    playChimeTap();
    updateLab();
  });

  updateLab();
}

