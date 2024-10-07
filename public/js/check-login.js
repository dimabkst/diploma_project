/* global htmx */
document.addEventListener('DOMContentLoaded', function () {
  htmx.ajax('GET', '/check-login', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
});
