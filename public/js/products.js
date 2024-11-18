import { createPagination } from './pagination.js';
import { customFetch } from './utils.js';

export function getProductsPage() {
  return `
    <link rel="stylesheet" href="/css/products.css"/>
    <link rel="stylesheet" href="/css/pagination.css"/>

    <div id="products-block">
      <div class="total-products-search-sorting">
          <div class="total-products">Total Products: 123</div>

          <div class="search-sorting">
              <input type="text" id="search" placeholder="Search products..." />

              <select id="sort">
                  <option value="name">Sort by Name</option>
                  <option value="price">Sort by Price</option>
              </select>
          </div>
      </div>

      <div class="filters-product-list-pagination">
          <div class="filters">
              <h3>Filters</h3>
              <label><input type="checkbox" /> Option 1</label><br />
              <label><input type="checkbox" /> Option 2</label><br />
              <label><input type="checkbox" /> Option 3</label><br />
          </div>

          <div class="products-list-pagination">
              <div id="products-list" class="products-list"></div>
              <div id="pagination" class="pagination pagination-row"></div>
          </div>
      </div>
    </div>

    <script src="products.js"></script>
  `;
}

export function productsPageTriggers() {
  fetchProducts();
  addEventListeners();
}

let pagination = {
  page: 1,
  limit: 50,
};
let filters = {
  sort_name: 'asc',
};

async function fetchProducts() {
  const params = new URLSearchParams({
    ...pagination,
    ...filters,
  });

  const response = await customFetch(`/api/products/?${params}`);
  const data = await response.json();

  const totalPages = pagination.limit & data.count ? Math.ceil(data.count / pagination.limit) : 1;

  renderProducts(data.products);
  createPagination(pagination, totalPages, fetchProducts);
}

function renderProducts(products) {
  const productsList = document.getElementById('products-list');
  productsList.innerHTML = ''; // Clear existing products

  if (products.length === 0) {
    productsList.innerHTML = '<p>No products found.</p>';
    return;
  }

  products.forEach((product) => {
    const productElement = document.createElement('div');
    productElement.classList.add('product-item');
    productElement.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3 class="product-title">${product.name}</h3>
      <p class="product-price">$${product.price.toFixed(2)}</p>
      <button class="add-to-cart">Add to Cart</button>
    `;
    productsList.appendChild(productElement);
  });
}

function addEventListeners() {
  document.getElementById('search').addEventListener('input', (event) => {
    filters.search = event.target.value;
    pagination.page = 1; // Reset to first page
    fetchProducts();
  });

  document.getElementById('sort').addEventListener('change', (event) => {
    filters.sort = event.target.value;
    fetchProducts();
  });
}
