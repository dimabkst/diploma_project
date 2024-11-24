document.addEventListener('DOMContentLoaded', () => {
  const passwordToggles = document.querySelectorAll('.show-password-icon');

  passwordToggles.forEach((icon) => {
    icon.addEventListener('click', () => {
      const input = icon.previousElementSibling;

      if (input && input.type === 'password') {
        input.type = 'text';
        icon.src = '/images/icons/hide-password-icon.svg';
        icon.alt = 'Hide Password';
      } else if (input) {
        input.type = 'password';
        icon.src = '/images/icons/show-password-icon.svg';
        icon.alt = 'Show Password';
      }
    });
  });
});
