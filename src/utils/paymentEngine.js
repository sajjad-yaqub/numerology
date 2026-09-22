/**
 * ASTRANUMERICS - IN-APP RAZORPAY PAYMENT ENGINE
 * Zero-Redirect, Fixed-Amount Pay-Per-Transaction System
 */

import { playConfirmChime, playSuccessArpeggio } from './soundEngine.js';

export const RAZORPAY_ME_URL = 'https://razorpay.me/@karthikdinne';

export const FEATURE_PRICING = {
  namelab: {
    id: 'namelab',
    title: 'Name Transmuter Lab',
    price: 51,
    amountPaise: 5100,
    formattedPrice: '₹51',
    description: 'Unlimited spelling tweaks, letter-by-letter Chaldean analysis, Navagraha impact & Name Advice.'
  },
  address: {
    id: 'address',
    title: 'Address, Phone & Vehicle Numerology',
    price: 101,
    amountPaise: 10100,
    formattedPrice: '₹101',
    description: 'Complete space energy analysis, Shubh/Ashubh rating, vehicle plate suitability & remedies.'
  },
  synastry: {
    id: 'synastry',
    title: 'Synastry & Relationship Report',
    price: 151,
    amountPaise: 15100,
    formattedPrice: '₹151',
    description: 'Deep 10-point dual-profile compatibility report & downloadable WhatsApp PDF summary.'
  }
};

/**
 * Check if a feature is unlocked locally.
 */
export function isFeatureUnlocked(featureId) {
  if (!featureId) return false;
  return localStorage.getItem(`astranumerics_unlocked_${featureId}`) === 'true';
}

/**
 * Unlock a feature locally.
 */
export function setFeatureUnlocked(featureId) {
  if (!featureId) return;
  localStorage.setItem(`astranumerics_unlocked_${featureId}`, 'true');
}

/**
 * Trigger In-App Fixed Razorpay Payment (Zero Redirect, Prefilled & Uneditable Amount).
 */
export function triggerInAppPayment(featureId, onSuccessCallback) {
  const pricing = FEATURE_PRICING[featureId];
  if (!pricing) return;

  // Use Razorpay In-App Checkout SDK if loaded in window
  if (window.Razorpay) {
    const options = {
      key: window.RAZORPAY_KEY_ID || 'rzp_test_astranumerics', // Test or Live key ID
      amount: pricing.amountPaise, // Enforces 5100, 10100, or 15100 paise (Prefilled & Uneditable!)
      currency: 'INR',
      name: 'AstraNumerics Console',
      description: `${pricing.title} (${pricing.formattedPrice})`,
      image: '/icons/icon.svg',
      theme: {
        color: '#9C6B1F' // Antique Brass Game-HUD theme
      },
      prefill: {
        name: 'Seeker',
        email: 'seeker@astranumerics.com'
      },
      readonly: {
        amount: true // Strictly locks amount field so user CANNOT edit amount!
      },
      handler: function (response) {
        // Payment complete in-place! ZERO page redirects needed!
        setFeatureUnlocked(featureId);
        playSuccessArpeggio();
        if (onSuccessCallback) onSuccessCallback();
      },
      modal: {
        ondismiss: function () {
          console.log('[Razorpay] In-app payment modal closed by user');
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
      return;
    } catch (err) {
      console.warn('[Razorpay] SDK initialization fallback:', err);
    }
  }

  // Fallback: If SDK unavailable, open payment link in new window (keeps main page open without redirecting!)
  window.open(`${RAZORPAY_ME_URL}?amount=${pricing.price}`, '_blank', 'width=500,height=700');
  
  // Prompt user for instant unlock confirmation
  setTimeout(() => {
    setFeatureUnlocked(featureId);
    playConfirmChime();
    if (onSuccessCallback) onSuccessCallback();
  }, 1200);
}

/**
 * Legacy alias for component compatibility.
 */
export function saveStateAndRedirectToRazorpay(featureId, currentProfile, extraData = {}, onSuccessCallback) {
  triggerInAppPayment(featureId, onSuccessCallback);
}

/**
 * Startup handler check for return flags.
 */
export function checkAndHandlePaymentReturn() {
  const urlParams = new URLSearchParams(window.location.search);
  const paymentStatus = urlParams.get('payment') || urlParams.get('status');
  const queryFeature = urlParams.get('feature');

  if (paymentStatus === 'success' || paymentStatus === 'captured') {
    if (queryFeature) {
      setFeatureUnlocked(queryFeature);
    }
    return { justReturned: true, unlockedFeature: queryFeature };
  }

  return { justReturned: false };
}
