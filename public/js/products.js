import { createPagination } from './pagination.js';
import { customFetch } from './utils.js';

export function getProductsPage() {
  return `
    <link rel="stylesheet" href="/css/products.css"/>
    <link rel="stylesheet" href="/css/pagination.css"/>

    <div id="products-block">
      <div class="products-count-search-sorting">
          <div id="products-count" class="products-count"></div>

          <div class="search-sorting">
              <input type="text" id="search" class="search" placeholder="Search products..." />

              <select id="sorting" class="sorting">
                  <option value="sort_name:asc">Name A-Z</option>
                  <option value="sort_name:desc">Name Z-A</option>
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

  renderProducts(data.products, data.count);
  createPagination(pagination, totalPages, fetchProducts);
}

function renderProducts(products, count) {
  const productsCount = document.getElementById('products-count');
  productsCount.innerHTML = `Found products: ${count || 0}`;

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

  document.getElementById('sorting').addEventListener('change', (event) => {
    const [key, value] = event.target.value.split(':');
    filters[key] = value;
    fetchProducts();
  });
}
