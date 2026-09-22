/**
 * Dynamically inject Razorpay Payment Button script element into DOM container.
 * Browsers block <script> tags inserted via innerHTML; using document.createElement
 * guarantees execution and button rendering.
 */
export function injectRazorpayButton(containerEl, buttonId, feature = null, onPaidCallback = null) {
  if (!containerEl) return;
  containerEl.innerHTML = '';

  const form = document.createElement('form');
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
  script.setAttribute('data-payment_button_id', buttonId);
  script.async = true;

  form.appendChild(script);
  containerEl.appendChild(form);

  // Auto-detect if Razorpay script updates the form container to 'paid' status in SPA
  if (feature && onPaidCallback) {
    const observer = new MutationObserver(() => {
      const text = containerEl.innerText || containerEl.textContent || '';
      if (text.toLowerCase().includes('paid') || text.toLowerCase().includes('success')) {
        observer.disconnect();
        onPaidCallback(feature);
      }
    });
    observer.observe(containerEl, { childList: true, subtree: true, characterData: true });
  }
}
