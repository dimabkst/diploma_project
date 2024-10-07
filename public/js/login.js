document.addEventListener('htmx:afterRequest', function (event) {
  if (event.detail.pathInfo.requestPath === '/login' && event.detail.xhr.status === 200) {
    const response = JSON.parse(event.detail.xhr.responseText);

    if (response.token) {
      localStorage.setItem('token', response.token);

      window.location.href = '/';
    }
  }
});
