import { calculateAddressNumerology } from '../utils/numerologyEngine.js';
import { CORE_INTERPRETATIONS } from '../data/numerologyData.js';
import { savePendingPaymentState } from '../main.js';
import { injectRazorpayButton } from '../utils/paymentEngine.js';

export function renderAddressPhoneView(containerId, system = 'pythagorean', isUnlocked = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="namelab-container">
      <h2 class="font-serif-carved text-oxblood mb-4" style="text-align:center;">🏠 CHAMBER 6: ADDRESS, PHONE & VEHICLE NUMEROLOGY</h2>
      <p class="text-secondary" style="text-align:center; font-size:0.95rem; margin-bottom:24px;">
        Discover the subconscious environmental vibration of your home address, phone number, or vehicle plate.
      </p>

      <div class="form-grid" style="max-width:640px; margin:0 auto 24px auto;">
        <div class="form-group">
          <label class="form-label" for="address-input">Street Address / House Number</label>
          <input type="text" id="address-input" class="form-input" placeholder="e.g. 742 Evergreen Terrace Apt 4B" />
        </div>
        <div class="form-group">
          <label class="form-label" for="phone-input">Phone Number or License Plate</label>
          <input type="text" id="phone-input" class="form-input" placeholder="e.g. 555-0199 or 7XYZ-88" />
        </div>
      </div>

      <div id="address-results" class="reading-grid"></div>
    </div>
  `;

  const addrInput = container.querySelector('#address-input');
  const phoneInput = container.querySelector('#phone-input');
  const resultsDiv = container.querySelector('#address-results');

  const updateResults = () => {
    const addrVal = addrInput.value.trim();
    const phoneVal = phoneInput.value.trim();

    savePendingPaymentState('address', { addrVal, phoneVal });

    if (!isUnlocked) {
      resultsDiv.innerHTML = `
        <div class="number-card synthesis-nexus-card" style="grid-column: 1/-1; text-align: center; border-color: var(--accent-brass); background: rgba(156, 107, 31, 0.04); padding: 32px 20px; max-width: 600px; margin: 0 auto;">
          <div class="card-header-badge" style="justify-content: center; margin-bottom: 12px;">
            <span class="card-tag">🔒 SACRED LOCK // CHAMBER 6</span>
          </div>
          <h3 class="font-serif-carved text-brass" style="font-size: 1.6rem; margin-bottom: 8px;">ADDRESS, PHONE & VEHICLE NUMEROLOGY (₹101)</h3>
          <p class="text-secondary mb-4" style="font-size: 0.95rem; max-width: 480px; margin: 0 auto 20px auto; line-height: 1.5;">
            Decode structural space energy, vehicle luck ratings, and ancient Shubh/Ashubh remedies.
          </p>
          <div id="pay-btn-address" style="display: flex; justify-content: center; margin-top: 16px;"></div>
        </div>
      `;
      const btnContainer = resultsDiv.querySelector('#pay-btn-address');
      injectRazorpayButton(btnContainer, 'pl_Tf9gZgt7fSf8FR');
      return;
    }


    if (!addrVal && !phoneVal) {
      resultsDiv.innerHTML = `<p class="text-muted" style="grid-column: 1/-1; text-align:center;">Enter an address or phone number above to calculate vibration.</p>`;
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

  addrInput.addEventListener('input', updateResults);
  phoneInput.addEventListener('input', updateResults);
  updateResults();
}

