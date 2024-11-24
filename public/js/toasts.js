import { analytics, logEvent } from './firebase-config.js';

// Function to display toast messages
export function showToast(message, type = 'success', duration = 2000) {
  const toastContainer = document.getElementById('toast-container');
  const toastTemplate = document.getElementById('toast-template').cloneNode(true);

  toastTemplate.querySelector('#toast-message').textContent = message;

  toastTemplate.classList.add('toast-message');

  if (type === 'error') {
    toastTemplate.classList.add('error-toast');
  } else {
    toastTemplate.classList.add('success-toast');
  }

  toastTemplate.style.display = 'block'; // Make it visible
  toastContainer.appendChild(toastTemplate);

  toastTemplate.remainingDuration = duration;

  // timeout logic
  const startTimeout = () => {
    console.log(toastTemplate.remainingDuration);
    if (toastContainer.contains(toastTemplate)) {
      toastTemplate.lastStartedAt = Date.now();
      toastTemplate.timeoutId = setTimeout(() => {
        toastContainer.removeChild(toastTemplate);
      }, Number(toastTemplate.remainingDuration));
      toastTemplate.classList.remove('paused');
    }
  };
  const stopTimeout = () => {
    toastTemplate.remainingDuration =
      Number(toastTemplate.remainingDuration) - (Date.now() - Number(toastTemplate.lastStartedAt));
    clearTimeout(toastTemplate.timeoutId);
    toastTemplate.classList.add('paused');
    console.log(toastTemplate.remainingDuration);
  };

  // close button
  const closeButton = toastTemplate.querySelector('.toast-close-button');
  closeButton.addEventListener('click', () => {
    stopTimeout();
    if (toastContainer.contains(toastTemplate)) {
      toastContainer.removeChild(toastTemplate);
    }
  });

  startTimeout();

  toastTemplate.addEventListener('mouseenter', stopTimeout);
  toastTemplate.addEventListener('mouseleave', startTimeout);
}

export function addToastsEventListeners() {
  const toastContainer = document.getElementById('toast-container');

  toastContainer?.addEventListener('click', () => {
    logEvent(analytics, 'toast_click', {
      action: 'clicked',
      timestamp: Date.now(),
    });
  });

  toastContainer?.addEventListener('mouseenter', () => {
    logEvent(analytics, 'toast_hover', {
      action: 'hovered',
      timestamp: Date.now(),
    });
  });
}
