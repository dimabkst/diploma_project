// Function to display toast messages
export function showToast(message, type = 'success', duration = 2000) {
  const toastContainer = document.getElementById('toast-container');
  const toastTemplate = document.getElementById('toast-template').cloneNode(true);

  toastTemplate.querySelector(`#toast-message`).textContent = message;

  toastTemplate.classList.add('toast-message');

  if (type === 'error') {
    toastTemplate.classList.add('error-toast');
  } else {
    toastTemplate.classList.add('success-toast');
  }

  toastTemplate.style.display = 'block'; // Make it visible
  toastContainer.appendChild(toastTemplate);

  // Remove the toast after a specified duration
  setTimeout(() => {
    toastContainer.removeChild(toastTemplate);
  }, duration);
}
