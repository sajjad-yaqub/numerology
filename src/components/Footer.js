/**
 * ASTRANUMERICS - SACRED ARTIFACT COMPLIANCE FOOTER & POLICY MODALS
 * Razorpay Compliant Merchant Policies (Privacy, Terms, Refund, Contact).
 */

import { playChimeTap, playConfirmChime } from '../utils/soundEngine.js';

export function renderFooter(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <footer class="app-footer-bar mt-8 py-6 text-center text-xs text-secondary" style="border-top: 2px solid var(--border-color); margin-top: 3rem;">
      <div class="footer-links flex flex-wrap justify-center gap-4 mb-2">
        <button class="footer-link-btn text-accent hover:underline cursor-pointer" data-policy="privacy">Privacy Policy</button>
        <span>•</span>
        <button class="footer-link-btn text-accent hover:underline cursor-pointer" data-policy="terms">Terms of Service</button>
        <span>•</span>
        <button class="footer-link-btn text-accent hover:underline cursor-pointer" data-policy="refund">Refund & Cancellation</button>
        <span>•</span>
        <button class="footer-link-btn text-accent hover:underline cursor-pointer" data-policy="contact">Contact Support</button>
      </div>
      <p class="brand-subtext" style="font-size: 0.8rem; opacity: 0.7;">
        © 2026 ASTRANUMERICS • Sacred Relic Console & Chaldean Matrix Engine. All rights reserved.
      </p>
    </footer>

    <!-- Compliance Policy Modal Container -->
    <div id="policy-modal-overlay" class="modal-overlay" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 9999; align-items: center; justify-content: center; padding: 1rem;">
      <div class="number-card modal-card" style="max-width: 600px; width: 100%; max-height: 85vh; overflow-y: auto; background: var(--bg-card); border-color: var(--accent-brass);">
        <div class="flex justify-between items-center mb-4 pb-2" style="border-bottom: 2px solid var(--border-color);">
          <h3 id="policy-modal-title" class="font-serif-carved text-lg text-accent" style="margin:0;">POLICY NOTICE</h3>
          <button id="policy-modal-close" class="btn-ghost btn-sm" style="font-weight:bold; padding: 2px 8px;">✕ CLOSE</button>
        </div>
        <div id="policy-modal-body" style="font-size: 0.9rem; line-height: 1.6; text-align: left;">
        </div>
      </div>
    </div>
  `;

  // Bind footer policy buttons
  container.querySelectorAll('.footer-link-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => playChimeTap());
    btn.addEventListener('click', (e) => {
      playConfirmChime();
      const policyType = e.target.getAttribute('data-policy');
      openPolicyModal(policyType);
    });
  });

  const overlay = container.querySelector('#policy-modal-overlay');
  const closeBtn = container.querySelector('#policy-modal-close');

  if (closeBtn && overlay) {
    closeBtn.addEventListener('click', () => {
      playChimeTap();
      overlay.style.display = 'none';
    });
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.style.display = 'none';
      }
    });
  }
}

function openPolicyModal(policyType) {
  const overlay = document.getElementById('policy-modal-overlay');
  const title = document.getElementById('policy-modal-title');
  const body = document.getElementById('policy-modal-body');
  if (!overlay || !title || !body) return;

  if (policyType === 'privacy') {
    title.textContent = 'PRIVACY POLICY & DATA SECURITY';
    body.innerHTML = `
      <p><strong>AstraNumerics</strong> values your privacy above all. We do not store, sell, or transmit your birth dates or full names to third-party databases or marketing networks.</p>
      <p style="margin-top:0.75rem;"><strong>Data Storage:</strong> All calculations run locally in your browser environment. Saved profile vaults are stored securely inside your browser's local storage.</p>
      <p style="margin-top:0.75rem;"><strong>Payments:</strong> Payment processing is handled by Razorpay (https://razorpay.me/@karthikdinne). We do not collect or store your UPI IDs, debit/credit card numbers, or bank credentials.</p>
    `;
  } else if (policyType === 'terms') {
    title.textContent = 'TERMS OF SERVICE';
    body.innerHTML = `
      <p>Welcome to <strong>AstraNumerics</strong>. By accessing our PWA and services, you agree to the following terms:</p>
      <ul style="margin-top:0.5rem; padding-left:1.2rem;">
        <li>All numerological charts, Lo Shu grids, and synastry reports are provided for personal self-discovery and entertainment guidance.</li>
        <li>Numerology readings do not substitute for professional medical, legal, or financial advice.</li>
        <li>Micro-service unlocks (₹51, ₹101, ₹151) grant instant digital reading generation.</li>
      </ul>
    `;
  } else if (policyType === 'refund') {
    title.textContent = 'REFUND & CANCELLATION POLICY';
    body.innerHTML = `
      <p><strong>Digital Service Delivery:</strong> Micro-transaction digital services (Name Lab ₹51, Address/Vehicle ₹101, Synastry Report ₹151) are delivered instantly upon payment confirmation.</p>
      <p style="margin-top:0.75rem;"><strong>Refund Policy:</strong> Due to the immediate delivery of digital readings, completed transactions are generally non-refundable. However, if a payment is charged but a technical network error prevents reading unlocking, please contact support for an immediate manual override or full refund within 5–7 business days.</p>
    `;
  } else if (policyType === 'contact') {
    title.textContent = 'CONTACT SUPPORT & MERCHANT DETAILS';
    body.innerHTML = `
      <p>For payment inquiries, transaction assistance, or custom numerology support, please reach out to us:</p>
      <ul style="margin-top:0.5rem; padding-left:1.2rem;">
        <li><strong>Merchant Name:</strong> Karthik Dinne / AstraNumerics</li>
        <li><strong>Official Payment Link:</strong> <a href="https://razorpay.me/@karthikdinne" target="_blank" style="color:var(--accent-brass);">https://razorpay.me/@karthikdinne</a></li>
        <li><strong>Support Email:</strong> <a href="mailto:support@astranumerics.com" style="color:var(--accent-brass);">support@astranumerics.com</a></li>
        <li><strong>Response Time:</strong> Within 24 hours.</li>
      </ul>
    `;
  }

  overlay.style.display = 'flex';
}
