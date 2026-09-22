import { calculateSynastry } from '../utils/numerologyEngine.js';
import { playConfirmChime, playChimeTap, playSuccessArpeggio } from '../utils/soundEngine.js';
import { savePendingPaymentState, unlockAllFeatures } from '../main.js';
import { injectRazorpayButton } from '../utils/paymentEngine.js';

export function renderCompatibilityView(containerId, primaryProfile, system = 'pythagorean', isUnlocked = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="synastry-layout">
      <!-- Input Card for Player 2 -->
      <div class="hero-section">
        <h2 class="font-serif-carved text-oxblood mb-4" style="text-align:center;">🔮 CHAMBER 3: SYNASTRY ALIGNMENT</h2>
        <p class="text-secondary" style="text-align:center; font-size:0.95rem; margin-bottom:20px;">
          Match your energetic frequencies against a companion, partner, or rival in the Synastry Chamber.
        </p>

        <form id="synastry-form">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">SEEKER 1 NAME</label>
              <input type="text" id="syn-p1-name" class="form-input" value="${primaryProfile.name || ''}" placeholder="Seeker 1 Name" required />
            </div>
            <div class="form-group">
              <label class="form-label">SEEKER 1 DOB</label>
              <input type="date" id="syn-p1-dob" class="form-input" value="${primaryProfile.dob || '1995-07-21'}" required />
            </div>

            <div class="form-group">
              <label class="form-label">SEEKER 2 NAME</label>
              <input type="text" id="syn-p2-name" class="form-input" value="Elena Vance" placeholder="e.g. Elena Vance" required />
            </div>
            <div class="form-group">
              <label class="form-label">SEEKER 2 DOB</label>
              <input type="date" id="syn-p2-dob" class="form-input" value="1993-11-12" required />
            </div>
          </div>
        </form>
      </div>

      <!-- Match Results -->
      <div id="synastry-results" style="margin-top:24px;"></div>
    </div>
  `;

  const form = container.querySelector('#synastry-form');
  const resultsDiv = container.querySelector('#synastry-results');

  const getInputs = () => ({
    p1: {
      name: form.querySelector('#syn-p1-name').value.trim(),
      dob: form.querySelector('#syn-p1-dob').value
    },
    p2: {
      name: form.querySelector('#syn-p2-name').value.trim(),
      dob: form.querySelector('#syn-p2-dob').value
    }
  });

  const updateView = () => {
    const { p1, p2 } = getInputs();
    savePendingPaymentState('synastry', { p1, p2 });

    if (!isUnlocked) {
      resultsDiv.innerHTML = `
        <div class="number-card synthesis-nexus-card" style="text-align: center; border-color: var(--accent-brass); background: rgba(156, 107, 31, 0.04); padding: 32px 20px; max-width: 600px; margin: 0 auto;">
          <div class="card-header-badge" style="justify-content: center; margin-bottom: 12px;">
            <span class="card-tag">🔒 SACRED LOCK // CHAMBER 3</span>
          </div>
          <h3 class="font-serif-carved text-brass" style="font-size: 1.6rem; margin-bottom: 8px;">FULL SYNASTRY MATCHMAKING REPORT (₹151)</h3>
          <p class="text-secondary mb-4" style="font-size: 0.95rem; max-width: 480px; margin: 0 auto 16px auto; line-height: 1.5;">
            Reveal deep relationship compatibility status, soul urge clashes, karmic synergy, and export downloadable PDF report.
          </p>
          <div id="pay-btn-synastry" style="display: flex; justify-content: center; margin-top: 16px;"></div>
          <p style="font-size:0.8rem; margin-top:16px;" class="text-secondary">
            Already completed payment? <a href="#" id="restore-synastry" style="color:var(--accent-brass); text-decoration:underline;">Click to restore reading access instantly</a>
          </p>
        </div>
      `;
      const btnContainer = resultsDiv.querySelector('#pay-btn-synastry');
      injectRazorpayButton(btnContainer, 'pl_Tf9iPpPjF9mZD9');

      const restoreBtn = resultsDiv.querySelector('#restore-synastry');
      if (restoreBtn) {
        restoreBtn.addEventListener('click', (e) => {
          e.preventDefault();
          unlockAllFeatures();
        });
      }
      return;
    }



    if (!p1.name || !p1.dob || !p2.name || !p2.dob) {
      resultsDiv.innerHTML = `<p class="text-secondary" style="text-align:center;">Enter both seeker profiles above to compute alignment.</p>`;
      return;
    }

    const res = calculateSynastry(p1, p2, system);

    resultsDiv.innerHTML = `
      <div class="synastry-score-box">
        <span class="card-tag">PARTY ALIGNMENT INDEX</span>
        <div class="synastry-score-ring">
          <span class="score-value">${res.score}</span>
          <span class="score-percent">/ 100</span>
        </div>
        <h2 class="font-serif-carved text-brass" style="font-size:2.2rem; margin-top:8px;">${res.status}</h2>

        <div class="hp-meter-box" style="max-width:500px; margin: 16px auto;">
          <div class="hp-meter-label">
            <span>SEEKER 1 [LP ${res.profileA.lp}] vs SEEKER 2 [LP ${res.profileB.lp}]</span>
            <span>${res.score}% SYNERGY</span>
          </div>
          <div class="hp-meter-track">
            <div class="hp-meter-fill" style="width: ${res.score}%;"></div>
          </div>
        </div>

        <p class="text-secondary mb-4" style="font-size:0.95rem; max-width:540px; margin: 12px auto 0 auto;">
          ${p1.name}'s Life Path <strong>${res.profileA.lp}</strong> links with ${p2.name}'s Life Path <strong>${res.profileB.lp}</strong>.
          Soul Urge vibration (${res.profileA.soul} & ${res.profileB.soul}) creates an engaging party synergy dynamic.
        </p>

        <div style="text-align:center; margin-top:16px;">
          <button id="download-syn-pdf" class="btn-primary">
            <span>📜 DOWNLOAD HIGH-RES SYNASTRY REPORT (PDF)</span>
          </button>
        </div>
      </div>
    `;

    const pdfBtn = resultsDiv.querySelector('#download-syn-pdf');
    if (pdfBtn) {
      pdfBtn.addEventListener('click', () => {
        playSuccessArpeggio();
        window.print();
      });
    }
  };

  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
      playChimeTap();
      updateView();
    });
  });

  updateView();
}

