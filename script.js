// Apni products yahin add ya edit karein.
// Har item me id, name, category, price, tag, desc, aur image dena hai.
const products = [
  {
    id: 1,
    name: "Sand Drape Co-Ord",
    category: "Women",
    price: 62,
    tag: "Trending",
    desc: "Soft premium set with elevated tailoring and relaxed silhouette.",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 2,
    name: "Midnight Tailored Set",
    category: "Men",
    price: 84,
    tag: "Formal",
    desc: "Sharp evening tailoring with clean lines and modern luxury feel.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 3,
    name: "Terracotta Street Hoodie",
    category: "Streetwear",
    price: 48,
    tag: "Hot",
    desc: "Relaxed everyday essential with a bold seasonal color tone.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 4,
    name: "Pearl Linen Abaya",
    category: "Women",
    price: 73,
    tag: "Elegant",
    desc: "Lightweight modest wear with minimal detailing and premium drape.",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 5,
    name: "Graphite Overshirt",
    category: "Men",
    price: 58,
    tag: "New",
    desc: "Smart casual overshirt designed for layered seasonal outfits.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 6,
    name: "Soft Beige Essential Tee",
    category: "Basics",
    price: 29,
    tag: "Daily Wear",
    desc: "Clean-cut staple piece that works with every wardrobe setup.",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80"
  }
];

const cart = [];

const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartSubtotal = document.getElementById("cartSubtotal");
const checkoutItems = document.getElementById("checkoutItems");
const checkoutSubtotal = document.getElementById("checkoutSubtotal");
const checkoutTotal = document.getElementById("checkoutTotal");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const formMessage = document.getElementById("formMessage");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

function money(value) {
  return `$${value}`;
}

function buildCategoryFilter() {
  const categories = ["All", ...new Set(products.map((product) => product.category))];
  categoryFilter.innerHTML = categories
    .map((category) => `<option value="${category}">${category}</option>`)
    .join("");
}

function getVisibleProducts() {
  const search = searchInput.value.trim().toLowerCase();
  const activeCategory = categoryFilter.value;

  return products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search) ||
      product.tag.toLowerCase().includes(search);
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();

  if (!visibleProducts.length) {
    productGrid.innerHTML = `
      <article class="empty-state">
        <h3>No product found</h3>
        <p>Search ya category change karke dobara try karein.</p>
      </article>
    `;
    return;
  }

  productGrid.innerHTML = visibleProducts
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-media">
            <div class="product-image" style="background-image:linear-gradient(180deg, rgba(20,16,13,0.04), rgba(20,16,13,0.35)), url('${product.image}');"></div>
            <span class="product-tag">${product.tag}</span>
          </div>
          <div class="product-body">
            <p class="product-meta">${product.category}</p>
            <h3>${product.name}</h3>
            <p class="product-desc">${product.desc}</p>
            <div class="product-footer">
              <span class="product-price">${money(product.price)}</span>
              <button class="primary-btn" type="button" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function addToCart(productId) {
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const product = products.find((item) => item.id === productId);
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();
  openCart();
}

function changeQuantity(productId, amount) {
  const item = cart.find((product) => product.id === productId);
  if (!item) {
    return;
  }

  item.quantity += amount;

  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  updateCartUI();
}

function removeFromCart(productId) {
  const index = cart.findIndex((item) => item.id === productId);
  if (index >= 0) {
    cart.splice(index, 1);
  }

  updateCartUI();
}

function calculateSubtotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderCartItems() {
  if (!cart.length) {
    cartItems.innerHTML = "<p>Your cart is empty. Add products to continue.</p>";
    checkoutItems.innerHTML = "<p>No products selected yet.</p>";
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <article class="cart-item">
          <div>
            <h4>${item.name}</h4>
            <p>${item.category} - ${money(item.price)} each</p>
            <div class="qty-controls">
              <button type="button" onclick="changeQuantity(${item.id}, -1)">-</button>
              <span>${item.quantity}</span>
              <button type="button" onclick="changeQuantity(${item.id}, 1)">+</button>
            </div>
          </div>
          <div>
            <strong>${money(item.price * item.quantity)}</strong>
            <button type="button" onclick="removeFromCart(${item.id})">Remove</button>
          </div>
        </article>
      `
    )
    .join("");

  checkoutItems.innerHTML = cart
    .map(
      (item) => `
        <article class="checkout-item">
          <div>
            <h4>${item.name}</h4>
            <p>Qty: ${item.quantity}</p>
          </div>
          <strong>${money(item.price * item.quantity)}</strong>
        </article>
      `
    )
    .join("");
}

function updateCartUI() {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = calculateSubtotal();
  const total = subtotal + 12;

  cartCount.textContent = itemCount;
  cartSubtotal.textContent = money(subtotal);
  checkoutSubtotal.textContent = money(subtotal);
  checkoutTotal.textContent = money(total);

  renderCartItems();
}

function openCart() {
  cartDrawer.classList.add("open");
  overlay.classList.add("visible");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("visible");
  cartDrawer.setAttribute("aria-hidden", "true");
}

document.getElementById("openCartButton").addEventListener("click", openCart);
document.getElementById("closeCartButton").addEventListener("click", closeCart);
document.getElementById("checkoutLink").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);

document.getElementById("checkoutForm").addEventListener("submit", (event) => {
  event.preventDefault();

  if (!cart.length) {
    formMessage.textContent = "Please add at least one product before placing your order.";
    return;
  }

  const formData = new FormData(event.currentTarget);
  const customerName = formData.get("name");
  const paymentMethod = formData.get("payment");

  formMessage.textContent = `Thank you ${customerName}. Your order has been placed with ${paymentMethod}.`;
  event.currentTarget.reset();
  cart.length = 0;
  updateCartUI();
});

document.getElementById("newsletterForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector("button");
  button.textContent = "Subscribed";
  button.disabled = true;
});

buildCategoryFilter();
renderProducts();
updateCartUI();
