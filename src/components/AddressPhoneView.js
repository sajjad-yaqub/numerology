import { calculateAddressNumerology } from '../utils/numerologyEngine.js';
import { CORE_INTERPRETATIONS } from '../data/numerologyData.js';
import { playChimeTap, playConfirmChime } from '../utils/soundEngine.js';
import { isFeatureUnlocked, saveStateAndRedirectToRazorpay, FEATURE_PRICING } from '../utils/paymentEngine.js';

export function renderAddressPhoneView(containerId, system = 'pythagorean', activeProfile = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const unlocked = isFeatureUnlocked('address');
  const pricing = FEATURE_PRICING.address;

  container.innerHTML = `
    <div class="namelab-container">
      <h2 class="font-serif-carved text-oxblood mb-4" style="text-align:center;">🏠 CHAMBER 6: ADDRESS, PHONE & VEHICLE NUMEROLOGY</h2>
      <p class="text-secondary" style="text-align:center; font-size:0.95rem; margin-bottom:24px;">
        Discover the environmental vibration of your home address, phone number, or vehicle plate.
      </p>

      <div class="form-grid" style="max-width:640px; margin:0 auto 24px auto;">
        <div class="form-group">
          <label class="form-label" for="address-input">Street Address / House Number</label>
          <input type="text" id="address-input" class="form-input" placeholder="e.g. Flat 402, Royal Palms" />
        </div>
        <div class="form-group">
          <label class="form-label" for="phone-input">Phone Number or License Plate</label>
          <input type="text" id="phone-input" class="form-input" placeholder="e.g. MH02CB1234" />
        </div>
      </div>

      ${!unlocked ? `
        <div class="number-card paywall-gating-card mb-6" style="max-width:640px; margin: 0 auto 24px auto; text-align: center; border-color: var(--accent-brass); background: rgba(156, 107, 31, 0.05);">
          <span class="card-tag">SACRED UNLOCK REQUIRED</span>
          <h3 class="font-serif-carved text-accent" style="margin-top:8px;">UNLOCK ADDRESS & VEHICLE NUMEROLOGY</h3>
          <p class="text-secondary" style="font-size:0.9rem; margin-bottom:16px;">
            ${pricing.description}
          </p>
          <button id="btn-unlock-address" class="btn-gold btn-md" style="font-weight:bold; font-size:1rem; padding: 12px 24px;">
            ⚡ UNLOCK NOW FOR ${pricing.formattedPrice} (UPI / GPay)
          </button>
        </div>
      ` : ''}

      <div id="address-results" class="reading-grid"></div>
    </div>
  `;

  const addrInput = container.querySelector('#address-input');
  const phoneInput = container.querySelector('#phone-input');
  const resultsDiv = container.querySelector('#address-results');
  const unlockBtn = container.querySelector('#btn-unlock-address');

  if (unlockBtn) {
    unlockBtn.addEventListener('click', () => {
      playConfirmChime();
      const addrVal = addrInput ? addrInput.value.trim() : '';
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';
      saveStateAndRedirectToRazorpay('address', activeProfile, { addrVal, phoneVal });
    });
  }

  const updateResults = () => {
    const addrVal = addrInput.value.trim();
    const phoneVal = phoneInput.value.trim();

    if (!addrVal && !phoneVal) {
      resultsDiv.innerHTML = `<p class="text-secondary" style="grid-column: 1/-1; text-align:center;">Enter an address or phone number above to calculate vibration.</p>`;
      return;
    }

    if (!unlocked) {
      resultsDiv.innerHTML = `
        <div class="number-card" style="grid-column: 1/-1; text-align:center; opacity: 0.7;">
          <span class="card-tag">SAMPLE VIBRATION PREVIEW</span>
          <p class="text-secondary" style="margin-top:8px;">🔒 Unlock for ${pricing.formattedPrice} to reveal complete Shubh/Ashubh environmental rating, planetary ruler, and remedy guidance.</p>
        </div>
      `;
      return;
    }

    let html = '';

    if (addrVal) {
      const resAddr = calculateAddressNumerology(addrVal, system);
      const interp = CORE_INTERPRETATIONS[resAddr.reduced] || CORE_INTERPRETATIONS[1];

      html += `
        <div class="number-card">
          <div class="card-header-badge">
            <span class="card-tag">House / Building Vibration</span>
            <div class="number-badge-glow">${resAddr.reduced}</div>
          </div>
          <h3 class="card-title">${interp.title}</h3>
          <p class="card-summary">
            Address "<strong>${addrVal}</strong>" reduces to vibration <strong>${resAddr.reduced}</strong>.
            This home atmosphere fosters ${interp.summary.toLowerCase()}
          </p>
        </div>
      `;
    }

    if (phoneVal) {
      const resPhone = calculateAddressNumerology(phoneVal, system);
      const interp = CORE_INTERPRETATIONS[resPhone.reduced] || CORE_INTERPRETATIONS[1];

      html += `
        <div class="number-card">
          <div class="card-header-badge">
            <span class="card-tag">Phone / Vehicle Vibration</span>
            <div class="number-badge-glow">${resPhone.reduced}</div>
          </div>
          <h3 class="card-title">${interp.title}</h3>
          <p class="card-summary">
            Entry "<strong>${phoneVal}</strong>" carries the energy of number <strong>${resPhone.reduced}</strong>.
            It influences communication, daily interactions, and mobility flow.
          </p>
        </div>
      `;
    }

    resultsDiv.innerHTML = html;
  };

  addrInput.addEventListener('input', () => {
    playChimeTap();
    updateResults();
  });
  phoneInput.addEventListener('input', () => {
    playChimeTap();
    updateResults();
  });
  updateResults();
}

