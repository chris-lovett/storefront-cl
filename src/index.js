const products = [
  { id: 1, name: "Classic Tee", price: 24.99, description: "Soft cotton everyday tee in a modern fit." },
  { id: 2, name: "Running Shoes", price: 89.99, description: "Lightweight performance sneakers for daily movement." },
  { id: 3, name: "Coffee Mug", price: 14.50, description: "Ceramic mug with a matte finish and wide handle." },
  { id: 4, name: "Backpack", price: 59.00, description: "Weather-resistant everyday backpack with multiple pockets." },
  { id: 5, name: "Wireless Earbuds", price: 79.99, description: "Compact Bluetooth earbuds with rich bass and all-day battery." },
  { id: 6, name: "Travel Bottle", price: 19.99, description: "Insulated stainless steel bottle for hydration on the go." }
];

const cartStore = new Map(); // demo only - resets on worker restart

function getSessionId(request) {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/sessionId=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function setSessionId(response, sessionId) {
  response.headers.append(
    "Set-Cookie",
    `sessionId=${encodeURIComponent(sessionId)}; Path=/; HttpOnly; SameSite=Lax`
  );
  return response;
}

function getCart(sessionId) {
  if (!cartStore.has(sessionId)) {
    cartStore.set(sessionId, []);
  }
  return cartStore.get(sessionId);
}

function addProductToCart(sessionId, productId) {
  const cart = getCart(sessionId);
  const product = products.find((p) => p.id === productId);

  if (!product) return null;

  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  return cart;
}

function calculateTotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderHtmlPage() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Northstar Goods</title>
  <style>
    :root {
      --bg: #f5f7fb;
      --panel: #ffffff;
      --ink: #111827;
      --muted: #6b7280;
      --border: #e5e7eb;
      --accent: #2563eb;
      --accent-dark: #1d4ed8;
      --success: #16a34a;
      --shadow: 0 10px 20px rgba(17, 24, 39, 0.08);
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: var(--bg);
      color: var(--ink);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px 20px 60px;
    }

    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      padding: 18px 22px;
      background: #0f172a;
      color: white;
      border-radius: 16px;
      box-shadow: var(--shadow);
      margin-bottom: 24px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 700;
      letter-spacing: 0.04em;
    }

    .brand-mark {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      background: linear-gradient(135deg, #60a5fa, #2563eb);
      display: grid;
      place-items: center;
      font-size: 18px;
    }

    .top-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #eff6ff;
      color: var(--ink);
      border-radius: 999px;
      padding: 8px 14px;
      font-weight: 600;
      border: none;
      cursor: pointer;
    }

    .layout {
      display: grid;
      grid-template-columns: minmax(0, 2fr) minmax(300px, 1fr);
      gap: 24px;
    }

    .panel {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 20px;
      box-shadow: var(--shadow);
    }

    .hero {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      margin-bottom: 24px;
      padding: 18px 20px;
      background: linear-gradient(135deg, #dbeafe, #eff6ff);
      border-radius: 18px;
      border: 1px solid #bfdbfe;
    }

    .hero h1 {
      margin: 0 0 8px;
      font-size: clamp(1.8rem, 4vw, 2.6rem);
    }

    .hero p {
      margin: 0;
      color: var(--muted);
      font-size: 1rem;
    }

    .cta {
      background: var(--accent);
      color: white;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      padding: 12px 18px;
      font-size: 1rem;
      font-weight: 700;
    }

    .cta:hover { background: var(--accent-dark); }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 18px;
      margin-top: 18px;
    }

    .product-card {
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 16px;
      background: white;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .product-card h3 {
      margin: 0;
      font-size: 1.15rem;
    }

    .product-card p {
      margin: 0;
      color: var(--muted);
      line-height: 1.5;
      min-height: 60px;
    }

    .product-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
    }

    .price {
      font-size: 1.15rem;
      font-weight: 700;
    }

    .button {
      border: none;
      border-radius: 10px;
      cursor: pointer;
      padding: 10px 14px;
      font-weight: 700;
      transition: transform 0.1s ease;
    }

    .button:active { transform: translateY(1px); }

    .button-primary {
      background: var(--accent);
      color: white;
    }

    .button-secondary {
      background: #f3f4f6;
      color: var(--ink);
    }

    .cart-section h2 {
      margin-top: 0;
    }

    .cart-list {
      list-style: none;
      padding: 0;
      margin: 0 0 18px;
    }

    .cart-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid var(--border);
    }

    .item-name {
      font-weight: 600;
    }

    .item-qty {
      color: var(--muted);
      font-size: 0.9rem;
    }

    .summary {
      font-size: 1.1rem;
      margin-top: 8px;
      font-weight: 700;
    }

    .checkout-form {
      display: grid;
      gap: 12px;
      margin-top: 18px;
    }

    .checkout-form input {
      width: 100%;
      padding: 11px 12px;
      border: 1px solid var(--border);
      border-radius: 10px;
      font-size: 0.98rem;
      background: #fff;
    }

    .checkout-form button {
      margin-top: 8px;
    }

    .status {
      margin-top: 14px;
      min-height: 24px;
      font-weight: 700;
      color: var(--success);
    }

    .profile {
      margin-top: 18px;
      padding-top: 18px;
      border-top: 1px solid var(--border);
    }

    .profile h3 {
      margin: 0 0 12px;
    }

    .profile-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px 12px;
      color: var(--muted);
      font-size: 0.95rem;
    }

    @media (max-width: 850px) {
      .layout {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="topbar">
      <div class="brand">
        <div class="brand-mark">N</div>
        <span>Northstar Goods</span>
      </div>

      <div class="top-actions">
        <button class="pill" id="view-cart-btn">View Cart</button>
      </div>
    </header>

    <section class="hero">
      <div>
        <h1>Shop the essentials</h1>
        <p>Everyday products, modern design, and a simple checkout flow.</p>
      </div>
      <button class="cta" id="scroll-to-products">Browse products</button>
    </section>

    <div class="layout">
      <main class="panel">
        <h2>Featured products</h2>
        <div id="product-grid" class="product-grid"></div>
      </main>

      <aside class="panel cart-section">
        <h2>Your cart</h2>
        <ul id="cart-list" class="cart-list"></ul>
        <div id="cart-total" class="summary">Total: $0.00</div>

        <form id="checkout-form" class="checkout-form">
          <input type="text" name="name" placeholder="Full name" required />
          <input type="email" name="email" placeholder="Email" required />
          <input type="text" name="address" placeholder="Shipping address" required />
          <button type="submit" class="button button-primary">Checkout</button>
        </form>

        <div id="status" class="status" aria-live="polite"></div>

        <div class="profile">
          <h3>Customer profile</h3>
          <div class="profile-grid">
            <div>Member</div><div>Gold</div>
            <div>Orders</div><div>12</div>
            <div>Saved</div><div>4 items</div>
            <div>Shipping</div><div>Free over $50</div>
          </div>
        </div>
      </aside>
    </div>
  </div>

  <script>
    const productGrid = document.getElementById("product-grid");
    const cartList = document.getElementById("cart-list");
    const cartTotal = document.getElementById("cart-total");
    const status = document.getElementById("status");
    const checkoutForm = document.getElementById("checkout-form");

    function renderProducts(products) {
      productGrid.innerHTML = products.map(product => `
        <article class="product-card">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="product-meta">
            <span class="price">$${product.price.toFixed(2)}</span>
            <button class="button button-primary" data-action="add" data-id="${product.id}">Add to cart</button>
          </div>
        </article>
      `).join("");
    }

    async function loadProducts() {
      const response = await fetch("/api/products");
      const data = await response.json();
      renderProducts(data.products);
    }

    async function loadCart() {
      const response = await fetch("/api/cart");
      const data = await response.json();

      if (!data.cart || data.cart.length === 0) {
        cartList.innerHTML = "<li class='item-name'>Your cart is empty.</li>";
        cartTotal.textContent = "Total: $0.00";
        return;
      }

      const total = data.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      cartList.innerHTML = data.cart.map(item => `
        <li class="cart-item">
          <div>
            <div class="item-name">${item.name}</div>
            <div class="item-qty">Qty: ${item.quantity}</div>
          </div>
          <div>$${(item.price * item.quantity).toFixed(2)}</div>
        </li>
      `).join("");

      cartTotal.textContent = `Total: ${new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      }).format(total)}`;
    }

    productGrid.addEventListener("click", async (event) => {
      const button = event.target.closest("[data-action='add']");
      if (!button) return;

      const productId = Number(button.dataset.id);

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId })
      });

      const data = await response.json();

      if (data.ok) {
        status.textContent = "Added to cart.";
        await loadCart();
      } else {
        status.textContent = data.error || "Unable to add item.";
      }
    });

    checkoutForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(checkoutForm);
      const body = {
        name: formData.get("name"),
        email: formData.get("email"),
        address: formData.get("address")
      };

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.ok) {
        status.textContent = `Order placed successfully! Confirmation #${data.orderId}`;
        checkoutForm.reset();
        await loadCart();
      } else {
        status.textContent = data.error || "Checkout failed.";
      }
    });

    document.getElementById("scroll-to-products").addEventListener("click", () => {
      document.getElementById("product-grid").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    document.getElementById("view-cart-btn").addEventListener("click", () => {
      document.querySelector(".cart-section").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    loadProducts();
    loadCart();
  </script>
</body>
</html>
  `;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const sessionId = getSessionId(request) || crypto.randomUUID();

    if (url.pathname === "/api/products") {
      return Response.json({ products });
    }

    if (url.pathname === "/api/cart" && request.method === "GET") {
      const cart = getCart(sessionId);
      const response = new Response(JSON.stringify({ cart }), {
        headers: { "Content-Type": "application/json" }
      });
      return setSessionId(response, sessionId);
    }

    if (url.pathname === "/api/cart" && request.method === "POST") {
      const body = await request.json();
      const productId = Number(body.productId);
      const product = products.find((p) => p.id === productId);

      if (!product) {
        return setSessionId(
          new Response(JSON.stringify({ ok: false, error: "Product not found" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          }),
          sessionId
        );
      }

      const cart = addProductToCart(sessionId, productId);

      const response = new Response(JSON.stringify({ ok: true, cart }), {
        headers: { "Content-Type": "application/json" }
      });

      return setSessionId(response, sessionId);
    }

    if (url.pathname === "/api/checkout" && request.method === "POST") {
      const body = await request.json();
      const cart = getCart(sessionId);

      if (!cart || cart.length === 0) {
        return setSessionId(
          new Response(JSON.stringify({ ok: false, error: "Your cart is empty." }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          }),
          sessionId
        );
      }

      const orderId = `ORD-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
      const total = calculateTotal(cart);

      cartStore.set(sessionId, []);

      const response = new Response(
        JSON.stringify({
          ok: true,
          orderId,
          total,
          customer: {
            name: body.name,
            email: body.email,
            address: body.address
          }
        }),
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      return setSessionId(response, sessionId);
    }

    if (url.pathname === "/") {
      return new Response(renderHtmlPage(), {
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    return new Response("Not found", { status: 404 });
  }
};
