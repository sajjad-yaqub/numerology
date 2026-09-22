/**
 * ASTRANUMERICS - ADDRESS, PHONE & VEHICLE NUMEROLOGY COMPONENT
 */

import { calculateAddressNumerology } from '../utils/numerologyEngine.js';
import { CORE_INTERPRETATIONS } from '../data/numerologyData.js';

export function renderAddressPhoneView(containerId, system = 'pythagorean') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="namelab-container">
      <h2 class="font-serif text-gold mb-4" style="text-align:center;">🏠 Address, Phone & Vehicle Numerology</h2>
      <p class="text-secondary" style="text-align:center; font-size:0.9rem; margin-bottom:24px;">
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
