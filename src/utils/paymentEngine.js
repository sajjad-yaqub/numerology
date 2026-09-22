/**
 * Dynamically inject Razorpay Payment Button script element into DOM container.
 * Browsers block <script> tags inserted via innerHTML; using document.createElement
 * guarantees execution and button rendering.
 */
export function injectRazorpayButton(containerEl, buttonId) {
  if (!containerEl) return;
  containerEl.innerHTML = '';

  const form = document.createElement('form');
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
  script.setAttribute('data-payment_button_id', buttonId);
  script.async = true;

  form.appendChild(script);
  containerEl.appendChild(form);
}
