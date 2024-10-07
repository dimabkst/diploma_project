document.body.addEventListener('htmx:configRequest', (event) => {
  const token = localStorage.getItem('token');
  //   const serverBaseUrl = window.location.origin; // TODO: compare url if use third-party services

  if (token) {
    event.detail.headers['Authorization'] = `Bearer ${token}`;
  }
});
