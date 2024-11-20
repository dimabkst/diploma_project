import { toastError } from './errors.js';
import { customFetch, productImagePlaceholder, redirect } from './utils.js';

export function getCartPage() {
  return `
    <link rel="stylesheet" href="/css/cart.css"/>

    <div id="cart-block">
        <div id="cart" class="cart">
            <div class="cart-header">
                <h1 class="cart-title">Cart</h1>
                <button id="clear-cart-button" class="cart-button clear-cart-button">Clear Cart</button>
            </div>
            
            <div id="cart-products" class="cart-products"></div>

            <div class="cart-summary">
                <p id="cart-total-price" class="cart-total-price"></p>
                <button id="cart-checkout-button" class="cart-button cart-checkout-button">Checkout</button>
            </div>
        </div>
    </div>

    <script src="cart.js"></script>
  `;
}

export function cartPageTriggers() {
  fetchCart();
  addEventListeners();
}

async function fetchCart() {
  const response = await customFetch(`/api/carts`);
  const data = await response.json();

  renderCart(data);
}

function renderCart(cartData) {
  document.getElementById('cart-total-price').innerHTML = `$${cartData.totalAmount.toFixed(2)}`;

  const cartProducts = document.getElementById('cart-products');
  cartProducts.innerHTML = ''; // Clear existing products

  if (cartData.cartProducts.length === 0) {
    cartProducts.innerHTML = '<p>No products added yet</p>';
    return;
  }

  const imagePlaceholder = productImagePlaceholder('cart-product-image');
  cartData.cartProducts.forEach((cartProduct) => {
    if (cartProduct.product.name === '1') {
      cartProduct.product.image =
        'https://firebasestorage.googleapis.com/v0/b/simply-depo-staging-media/o/converted%2FU63I2u8CaHa8T6EHCKEjDyAASiA2%2F1ad11a8071b2ae1f497b72efc352241adff74e713c6496d0291dcc90b86db010.png?alt=media&token=9fb0b719-ba39-4cf8-bdc1-2f2262524ba7';
    }
    const cartProductElement = document.createElement('div');
    cartProductElement.classList.add('cart-product');
    cartProductElement.innerHTML = `
        <button class="cart-button remove-cart-product-button" cart-product-id="${cartProduct.id}">Remove</button>
        ${cartProduct.product.image ? `<img class="cart-product-image" src="${cartProduct.product.image}" alt="${cartProduct.product.name}" />` : imagePlaceholder}
        <h3 class="cart-product-name">${cartProduct.product.name}</h3>
        <div class="cart-product-quantity-control">
            <button ${cartProduct.quantity === 1 ? 'disabled' : ''} class="cart-button cart-product-quantity-decrement" cart-product-id="${cartProduct.id}" cart-product-quantity="${cartProduct.quantity}">-</button>
            <input type="number" class="cart-product-quantity" cart-product-id="${cartProduct.id}" value="${cartProduct.quantity}" min="1" required>
            <button class="cart-button cart-product-quantity-increment" cart-product-id="${cartProduct.id}" cart-product-quantity="${cartProduct.quantity}">+</button>
        </div>
        <p class="cart-product-total-price">$${cartProduct.totalAmount.toFixed(2)}</p>
    `;
    cartProducts.appendChild(cartProductElement);
  });

  document.querySelectorAll('.remove-cart-product-button').forEach((button) =>
    button.addEventListener('click', function (event) {
      removeFromCart({
        cartProductIds: [Number(event.target.getAttribute('cart-product-id'))],
      })
        .then((response) => response.json())
        .then((data) => renderCart(data));
    })
  );

  document.querySelectorAll('.cart-product-quantity-decrement').forEach((button) =>
    button.addEventListener('click', function (event) {
      updateCartQuantities([
        {
          cartProductId: Number(event.target.getAttribute('cart-product-id')),
          quantity: Number(event.target.getAttribute('cart-product-quantity')) - 1,
        },
      ])
        .then((response) => response.json())
        .then((data) => renderCart(data));
    })
  );

  document.querySelectorAll('.cart-product-quantity-increment').forEach((button) =>
    button.addEventListener('click', function (event) {
      updateCartQuantities([
        {
          cartProductId: Number(event.target.getAttribute('cart-product-id')),
          quantity: Number(event.target.getAttribute('cart-product-quantity')) + 1,
        },
      ])
        .then((response) => response.json())
        .then((data) => renderCart(data));
    })
  );

  document.querySelectorAll('.cart-product-quantity').forEach((input) =>
    input.addEventListener('blur', function (event) {
      const newQuantity = Number(event.target.value);
      if (newQuantity >= 1) {
        updateCartQuantities([
          {
            cartProductId: Number(event.target.getAttribute('cart-product-id')),
            quantity: newQuantity,
          },
        ])
          .then((response) => response.json())
          .then((data) => renderCart(data));
      } else {
        toastError('Quantity must be at least 1');
        fetchCart(); // Reset the cart UI if invalid input
      }
    })
  );
}

function addEventListeners() {
  document.getElementById('clear-cart-button').addEventListener('click', () => {
    removeFromCart({
      removeAll: true,
    })
      .then((response) => response.json())
      .then((data) => renderCart(data));
  });

  document.getElementById('cart-checkout-button').addEventListener('click', () => {
    createOrder().then((response) => {
      if (response?.ok) {
        redirect('/orders');
      }
    });
  });
}

function removeFromCart(cartProductsRemoveData) {
  return customFetch('/api/carts', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cartProductsRemoveData),
  });
}

function updateCartQuantities(cartProductsUpdateData) {
  return customFetch('/api/carts', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cartProductsUpdateData),
  });
}

function createOrder() {
  return customFetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });
}
