import { analytics, logEvent } from './firebase-config.js';
import { createPagination } from './pagination.js';
import { customFetch, productImagePlaceholder } from './utils.js';

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
              <div id="price-filter" class="filter price-filter">
                  <h3 class="filter-title">Price</h3>
                  <div class="price-inputs">
                      <input type="number" id="price-min" class="price-input" placeholder="Min" min="0" step="1" value=""/>
                      <input type="number" id="price-max" class="price-input" placeholder="Max" min="0" step="1" value=""/>
                      <button id="apply-price-filter" class="apply-price-filter">OK</button>
                  </div>
              </div>
              <div id="categories-filter" class="filter checkbox-filter">
                  <h3 class="filter-title">Categories</h3>
              </div>
              <div id="manufacturers-filter" class="filter checkbox-filter">
                  <h3 class="filter-title">Manufacturers</h3>
              </div>

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
  fetchCategories();
  fetchManufacturers();
  fetchProducts();
  addEventListeners();
}

let pagination = {
  page: 1,
  limit: 50,
};
let filters = {
  category_ids: '',
  manufacturer_ids: '',
  price_gte: '',
  price_lte: '',
};
let sorting = {
  sort_name: 'asc',
};

async function fetchProducts() {
  const params = new URLSearchParams({
    ...pagination,
    ...filters,
    ...sorting,
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
    productsList.innerHTML = '<p>No products found</p>';
    return;
  }

  const imagePlaceholder = productImagePlaceholder('product-item-image');
  products.forEach((product) => {
    const productElement = document.createElement('div');
    productElement.classList.add('product-item');
    productElement.innerHTML = `
      ${product.image ? `<img class="product-item-image" src="${product.image}" alt="${product.name}" />` : imagePlaceholder}
      <h3 class="product-title">${product.name}</h3>
      <p class="product-price">$${product.price.toFixed(2)}</p>
      <button class="add-to-cart ${product._count.cartProducts ? 'add-to-cart-active' : ''}" product-id="${product.id}">
          <svg class="product-cart-icon ${product._count.cartProducts ? 'product-cart-icon-active ' : ''}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <polyline points="2 3 5 3 8.5 16 18 16 21 7 6.1 7" />
              <line x1="9.99" y1="20" x2="10.01" y2="20" />
              <line x1="15.99" y1="20" x2="16.01" y2="20" />
          </svg>   
      </button>
    `;
    productsList.appendChild(productElement);
  });

  document.querySelectorAll('.add-to-cart').forEach((button) =>
    button.addEventListener('click', async function (event) {
      await logEvent(analytics, 'add_to_cart');

      const addToCartButton = event.currentTarget;

      const add = !addToCartButton.classList.contains('add-to-cart-active');

      if (add) {
        await addToCart([
          {
            productId: Number(addToCartButton.getAttribute('product-id')),
            quantity: 1,
          },
        ]);
        addToCartButton.classList.add('add-to-cart-active');
      } else {
        await removeFromCart({
          productIds: [Number(addToCartButton.getAttribute('product-id'))],
        });
        addToCartButton.classList.remove('add-to-cart-active');
      }
    })
  );
}

function addEventListeners() {
  document.getElementById('search').addEventListener('input', (event) => {
    filters.search = event.target.value;
    pagination.page = 1; // Reset to first page
    fetchProducts();
  });

  document.getElementById('sorting').addEventListener('change', (event) => {
    const [key, value] = event.target.value.split(':');
    sorting[key] = value;
    fetchProducts();
  });

  const minPriceInput = document.getElementById('price-min');
  const maxPriceInput = document.getElementById('price-max');
  document.getElementById('apply-price-filter').addEventListener('click', () => {
    filters.price_gte = minPriceInput.value;
    filters.price_lte = maxPriceInput.value;
    pagination.page = 1;

    fetchProducts();
  });
  [minPriceInput, maxPriceInput].forEach((input) => {
    input.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        filters.price_gte = minPriceInput.value;
        filters.price_lte = maxPriceInput.value;
        pagination.page = 1;

        fetchProducts();
      }
    });
  });
}

function addToCart(productsData) {
  return customFetch('/api/carts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productsData),
  });
}

function removeFromCart(productsRemoveData) {
  return customFetch('/api/carts', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productsRemoveData),
  });
}

async function fetchCategories() {
  const response = await customFetch('/api/product-categories');
  const data = await response.json();

  const categoriesFilter = document.getElementById('categories-filter');

  if (!data?.productCategories?.length) {
    const noCategoriesTextElement = document.createElement('div');
    noCategoriesTextElement.innerHTM = '<p>No categories found</p>';
    categoriesFilter.appendChild(noCategoriesTextElement);
    return;
  }

  data?.productCategories?.forEach((category) => {
    const categoryElement = document.createElement('div');
    categoryElement.classList.add('checkbox-filter-item');
    categoryElement.innerHTML = `
        <label class="checkbox-filter-label">
            <input type="checkbox" class="category-filter" value="${category.id}" />
            ${category.name}
        </label>
    `;
    categoriesFilter.appendChild(categoryElement);
  });

  document.querySelectorAll('.category-filter').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      filters.category_ids = JSON.stringify(
        Array.from(document.querySelectorAll('.category-filter:checked')).map((checkbox) => Number(checkbox.value))
      );
      pagination.page = 1;
      fetchProducts();
    });
  });
}

async function fetchManufacturers() {
  const response = await customFetch('/api/manufacturers');
  const data = await response.json();

  const manufacturersFilter = document.getElementById('manufacturers-filter');

  if (!data?.manufacturers?.length) {
    const noManufacturersTextElement = document.createElement('div');
    noManufacturersTextElement.innerHTM = '<p>No manufacturers found</p>';
    manufacturersFilter.appendChild(noManufacturersTextElement);
    return;
  }

  data?.manufacturers?.forEach((manufacturer) => {
    const manufacturerElement = document.createElement('div');
    manufacturerElement.classList.add('checkbox-filter-item');
    manufacturerElement.innerHTML = `
        <label class="checkbox-filter-label">
            <input type="checkbox" class="manufacturer-filter" value="${manufacturer.id}" />
            ${manufacturer.name}
        </label>
    `;
    manufacturersFilter.appendChild(manufacturerElement);
  });

  document.querySelectorAll('.manufacturer-filter').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      filters.manufacturer_ids = JSON.stringify(
        Array.from(document.querySelectorAll('.manufacturer-filter:checked')).map((checkbox) => Number(checkbox.value))
      );
      pagination.page = 1;
      fetchProducts();
    });
  });
}
