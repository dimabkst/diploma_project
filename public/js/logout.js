document.querySelector('a[href="/logout"]').addEventListener('click', function (e) {
  e.preventDefault();
  localStorage.removeItem('token');
  window.location.href = '/login';
});
