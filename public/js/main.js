import { showToast } from './toasts.js';

const defaultErrorMessage = 'Something went wrong';

// Capture all global errors
window.onerror = function (message, source, lineno, colno, error) {
  console.error('Error caught:', message, source, lineno, colno, error);

  showToast(defaultErrorMessage, 'error');

  // Prevent the default error handling
  return true;
};

// Capture unhandled promise rejections
window.onunhandledrejection = function (event) {
  console.error('Unhandled promise rejection:', event.reason);

  showToast(defaultErrorMessage, 'error');

  // Prevent the default rejection handling
  return true;
};

// Capture htmx errors
document.body.addEventListener('htmx:responseError', (event) => {
  const xhr = event.detail.xhr;
  const status = xhr.status;

  if (status >= 400) {
    const errorMessage = JSON.parse(xhr.responseText).message || defaultErrorMessage;
    showToast(errorMessage, 'error');
  }
});

// add bearer token to each htmx request
document.body.addEventListener('htmx:configRequest', (event) => {
  const token = localStorage.getItem('token');
  //   const serverBaseUrl = window.location.origin; // TODO: compare url if use third-party services

  if (token) {
    event.detail.headers['Authorization'] = `Bearer ${token}`;
  }
});

// logout button logic
document.querySelector('a[href="/logout"]').addEventListener('click', function (e) {
  e.preventDefault();
  localStorage.removeItem('token');
  window.location.href = '/login';
});
