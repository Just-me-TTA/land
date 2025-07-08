// Повністю робочий кошик з коректною зміною кількості, кнопками, адаптацією до мобільних, без закриття при взаємодії

const CART_KEY = 'paw_cart_v1';
let cart = [];

const cartElement = document.getElementById('cart');
const cartItemsElement = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const clearCartButton = document.getElementById('clear-cart');
const cartToggleBtn = document.getElementById('cart-toggle');
const cartCountSpan = document.getElementById('cart-count');
const cartNotify = document.getElementById('cart-notify');
const closeCartBtn = document.getElementById('close-cart');
const orderBtn = document.getElementById('order-cart');

// Завантаження кошика з localStorage
function loadCart() {
  try {
    cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    cart = [];
  }
}
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCartUI() {
  cartItemsElement.innerHTML = '';
  let total = 0, count = 0;
  cart.forEach((item, idx) => {
    total += item.price * item.qty;
    count += item.qty;

    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.name}</span>
      <div class="cart-controls">
        <button class="cart-qty-btn" data-action="minus" data-idx="${idx}">−</button>
        <input type="number" min="1" value="${item.qty}" class="cart-qty-input" data-idx="${idx}">
        <button class="cart-qty-btn" data-action="plus" data-idx="${idx}">+</button>
        <span>${item.price * item.qty} грн</span>
        <button class="cart-remove" title="Видалити" data-idx="${idx}">&#10005;</button>
      </div>
    `;
    cartItemsElement.appendChild(li);
  });
  cartTotalElement.innerText = `Сума: ${total} грн`;
  cartCountSpan.innerText = count;

  // Додаємо stopPropagation на інтерактивні елементи, щоб не закривався кошик при взаємодії
  cartItemsElement.querySelectorAll('button, input').forEach(el => {
    el.addEventListener('mousedown', function(e){ e.stopPropagation(); }, true);
    el.addEventListener('touchstart', function(e){ e.stopPropagation(); }, true);
  });

  // Обробка кнопок +/-
  cartItemsElement.querySelectorAll('.cart-qty-btn').forEach(btn => {
    btn.onclick = function(e) {
      const idx = parseInt(btn.dataset.idx, 10);
      if (btn.dataset.action === "plus") {
        cart[idx].qty += 1;
      } else if (btn.dataset.action === "minus" && cart[idx].qty > 1) {
        cart[idx].qty -= 1;
      }
      saveCart(); updateCartUI();
    }
  });
  // Обробка інпуту кількості
  cartItemsElement.querySelectorAll('.cart-qty-input').forEach(input => {
    input.onchange = function(e) {
      const idx = parseInt(input.dataset.idx, 10);
      let val = parseInt(input.value, 10);
      if (isNaN(val) || val < 1) val = 1;
      cart[idx].qty = val;
      saveCart(); updateCartUI();
    }
  });
  // Видалення позиції
  cartItemsElement.querySelectorAll('.cart-remove').forEach(btn => {
    btn.onclick = function(e) {
      const idx = parseInt(btn.dataset.idx, 10);
      cart.splice(idx, 1);
      saveCart();
      updateCartUI();
    }
  });
}

function removeFromCart(id) {
  cart = cart.filter(it => it.id !== id);
  saveCart();
  updateCartUI();
}

// Додаємо обробник для всіх кнопок "До кошика"
document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const card = btn.closest('.product-card');
    const id = card.dataset.id;
    const name = card.dataset.name;
    const price = parseInt(card.dataset.price, 10);
    let item = cart.find(i => i.id === id);
    if (item) {
      item.qty += 1;
    } else {
      cart.push({ id, name, price, qty: 1 });
    }
    saveCart();
    updateCartUI();
    showCartNotify();
  });
});

function showCartNotify() {
  cartNotify.classList.add('show');
  setTimeout(() => cartNotify.classList.remove('show'), 1200);
}

// Очистити кошик
clearCartButton.addEventListener('mousedown', function(e){ e.stopPropagation(); }, true);
clearCartButton.addEventListener('touchstart', function(e){ e.stopPropagation(); }, true);
clearCartButton.addEventListener('click', function(e) {
  cart = [];
  saveCart();
  updateCartUI();
});

// Відкрити кошик
cartToggleBtn.addEventListener('mousedown', function(e){ e.stopPropagation(); }, true);
cartToggleBtn.addEventListener('touchstart', function(e){ e.stopPropagation(); }, true);
cartToggleBtn.addEventListener('click', function(e) {
  cartElement.classList.add('open');
});

// Закрити кошик (іконка х)
closeCartBtn.addEventListener('mousedown', function(e){ e.stopPropagation(); }, true);
closeCartBtn.addEventListener('touchstart', function(e){ e.stopPropagation(); }, true);
closeCartBtn.addEventListener('click', function(e) {
  cartElement.classList.remove('open');
});

// Закрити кошик при кліку поза ним (mousedown для всіх браузерів)
document.addEventListener('mousedown', function(e) {
  if (!cartElement.contains(e.target) && !cartToggleBtn.contains(e.target)) {
    cartElement.classList.remove('open');
  }
});
document.addEventListener('touchstart', function(e) {
  if (!cartElement.contains(e.target) && !cartToggleBtn.contains(e.target)) {
    cartElement.classList.remove('open');
  }
});

// Замовлення (демо: показує alert)
orderBtn.addEventListener('mousedown', function(e){ e.stopPropagation(); }, true);
orderBtn.addEventListener('touchstart', function(e){ e.stopPropagation(); }, true);
orderBtn.addEventListener('click', function(e) {
  if (cart.length === 0) {
    alert('Кошик порожній!');
    return;
  }
  let itemsList = cart.map(item => `${item.name} x${item.qty} = ${item.price * item.qty} грн`).join('\n');
  alert(`Ваше замовлення:\n${itemsList}\n\nЗагальна сума: ${cart.reduce((sum, i) => sum + i.price * i.qty, 0)} грн\n\nДякуємо за замовлення!`);
  cart = [];
  saveCart();
  updateCartUI();
  cartElement.classList.remove('open');
});

// ініціалізація
loadCart();
updateCartUI();