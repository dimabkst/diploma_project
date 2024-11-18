export function createPagination(pagination, totalPages, clickTrigger, paginationContainerId = 'pagination') {
  const currentPage = pagination.page;

  const paginationContainer = document.getElementById(paginationContainerId);
  paginationContainer.innerHTML = ''; // Clear previous

  const addButton = (text, disabled = false, isCurrent = false, page = null) => {
    const button = document.createElement('button');

    button.textContent = text;
    button.disabled = disabled;

    if (isCurrent) button.classList.add('current');

    if (page !== null) {
      button.addEventListener('click', () => {
        pagination.page = page;
        if (!isCurrent && clickTrigger) {
          clickTrigger();
        }
      });
    }

    paginationContainer.appendChild(button);
  };

  // "Previous" button
  addButton('❮', currentPage === 1, false, currentPage - 1);

  // Logic for adding page buttons
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 || // Always show the first page
      i === totalPages || // Always show the last page
      (i >= currentPage - 2 && i <= currentPage + 2) // Pages around the current page
    ) {
      addButton(i, false, i === currentPage, i);
    } else if (i === currentPage - 3 || i === currentPage + 3) {
      // Add ellipses before and after the current range
      const ellipsis = document.createElement('span');
      ellipsis.textContent = '...';
      paginationContainer.appendChild(ellipsis);
    }
  }

  // "Next" button
  addButton('❯', currentPage === totalPages, false, currentPage + 1);
}
