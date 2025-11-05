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

// Обробка форми замовлення
const cartContent = document.getElementById('cart-content');
const orderForm = document.getElementById('order-form');
const backToCartBtn = document.getElementById('back-to-cart');

orderBtn.addEventListener('mousedown', function(e){ e.stopPropagation(); }, true);
orderBtn.addEventListener('touchstart', function(e){ e.stopPropagation(); }, true);
orderBtn.addEventListener('click', function(e) {
  if (cart.length === 0) {
    alert('Кошик порожній!');
    return;
  }
  cartContent.style.display = 'none';
  orderForm.style.display = 'block';
});

backToCartBtn.addEventListener('mousedown', function(e){ e.stopPropagation(); }, true);
backToCartBtn.addEventListener('touchstart', function(e){ e.stopPropagation(); }, true);
backToCartBtn.addEventListener('click', function() {
  orderForm.style.display = 'none';
  cartContent.style.display = 'block';
});

// Нова Пошта інтеграція
const npCitySearch = document.getElementById('npCitySearch');
const npCitiesList = document.getElementById('npCitiesList');
const npWarehouse = document.getElementById('npWarehouse');
const npCityRef = document.getElementById('npCityRef');
const npCityName = document.getElementById('npCityName');

let citySearchTimeout;

npCitySearch.addEventListener('input', (e) => {
  clearTimeout(citySearchTimeout);
  const query = e.target.value.trim();
  
  if (query.length < 2) {
    npCitiesList.innerHTML = '';
    npCitiesList.classList.remove('active');
    return;
  }

  citySearchTimeout = setTimeout(async () => {
    try {
      const response = await fetch(`/api/nova-poshta/cities?q=${encodeURIComponent(query)}`);
      const cities = await response.json();
      
      if (cities.length > 0) {
        npCitiesList.innerHTML = cities.map(city => `
          <div data-ref="${city.Ref}" data-name="${city.Present}">${city.Present}</div>
        `).join('');
        npCitiesList.classList.add('active');
      } else {
        npCitiesList.innerHTML = '<div>Міста не знайдено</div>';
        npCitiesList.classList.add('active');
      }
    } catch (error) {
      console.error('Failed to fetch cities:', error);
    }
  }, 300);
});

npCitiesList.addEventListener('click', async (e) => {
  const cityDiv = e.target.closest('div');
  if (!cityDiv || !cityDiv.dataset.ref) return;

  const cityRef = cityDiv.dataset.ref;
  const cityName = cityDiv.dataset.name;

  npCitySearch.value = cityName;
  npCityRef.value = cityRef;
  npCityName.value = cityName;
  npCitiesList.classList.remove('active');

  try {
    const response = await fetch(`/api/nova-poshta/warehouses/${cityRef}`);
    const warehouses = await response.json();

    npWarehouse.innerHTML = `
      <option value="">Оберіть відділення</option>
      ${warehouses.map(w => `
        <option value="${w.Description}">${w.Description}</option>
      `).join('')}
    `;
    npWarehouse.disabled = false;
  } catch (error) {
    console.error('Failed to fetch warehouses:', error);
  }
});

// Закриття випадаючого списку при кліку поза ним
document.addEventListener('click', (e) => {
  if (!e.target.closest('.np-cities-wrapper')) {
    npCitiesList.classList.remove('active');
  }
});

orderForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  if (!npCityRef.value || !npWarehouse.value) {
    alert('Будь ласка, оберіть місто та відділення Нової Пошти');
    return;
  }

  const formData = new FormData(orderForm);
  const orderData = {
    customerInfo: {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      delivery: {
        city: npCityName.value,
        cityRef: npCityRef.value,
        warehouse: npWarehouse.value
      },
      comment: formData.get('comment')
    },
    items: cart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.qty,
      total: item.price * item.qty
    })),
    totalAmount: cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  };

  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Помилка при відправці замовлення');
    }
    
  const result = await response.json();
  // Успішне замовлення з номером
  alert(`Дякуємо за замовлення! Ваш номер замовлення: ${result.orderNumber}\nМи зв'яжемося з вами найближчим часом.`);
    cart = [];
    saveCart();
    updateCartUI();
    cartElement.classList.remove('open');
    orderForm.reset();
    orderForm.style.display = 'none';
    cartContent.style.display = 'block';
  } catch (error) {
    alert('Виникла помилка при оформленні замовлення. Будь ласка, спробуйте ще раз.');
  }
});

// ініціалізація
loadCart();
updateCartUI();