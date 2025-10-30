// === Cart Logic ===
const cartIcon = document.querySelector(".cart-icon");
const cartContainer = document.getElementById("cartContainer");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItemsContainer = document.querySelector(".cart-items");
const cartCount = document.querySelector(".cart-count");
const cartTotal = document.querySelector(".cart-total");

let cart = [];

// Buka/tutup cart box
cartIcon.addEventListener("click", () => {
  cartContainer.classList.add("active");
});
closeCartBtn.addEventListener("click", () => {
  cartContainer.classList.remove("active");
});

// Tambah event listener ke setiap tombol Add to Cart
document.querySelector(".checkout-btn").addEventListener("click", function () {
  window.location.href = "cart.html";
});

document.querySelectorAll(".product-cart-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    const productBox = btn.closest(".product-box");
    const name = productBox
      .querySelector(".product-text-title")
      .textContent.trim();
    const img = productBox.querySelector("img").src;

    // Ambil harga hanya dari teks pertama (abaikan <del>)
    const priceElement =
      productBox.querySelector(".product-price") ||
      productBox.querySelector("span");
    if (!priceElement) {
      console.error(`Elemen harga tidak ditemukan untuk ${name}`);
      return;
    }

    const priceText = priceElement.childNodes[0].textContent.replace(
      /[^\d]/g,
      ""
    );
    const price = parseInt(priceText);
    if (isNaN(price)) {
      console.error(`Harga produk tidak valid untuk ${name}`);
      return;
    }

    addToCart(name, price, img);
  });
});

// Fungsi tambah ke keranjang
function addToCart(name, price, img) {
  const existing = cart.find((item) => item.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, img, qty: 1 });
  }

  updateCartUI();

  // Animasi kecil untuk indikator cart
  cartIcon.classList.add("bump");
  setTimeout(() => cartIcon.classList.remove("bump"), 300);
}

// Update tampilan cart box
function updateCartUI() {
  cartItemsContainer.innerHTML = "";
  let total = 0;
  let count = 0;

  cart.forEach((item) => {
    total += item.price * item.qty;
    count += item.qty;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
     <div class="cart-item-info">
        <img src="${item.img}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-text">
      <p>${item.name}</p>
      <div class="cart-controls">
        <button class="decrease">−</button>
        <span>${item.qty}</span>
        <button class="increase">+</button>
      </div>
      <p>Rp. ${(item.price * item.qty).toLocaleString("id-ID")}</p>
    `;
    cartItemsContainer.appendChild(div);

    // Event listener tambah/kurang qty
    div.querySelector(".increase").addEventListener("click", () => {
      item.qty++;
      updateCartUI();
    });
    div.querySelector(".decrease").addEventListener("click", () => {
      item.qty--;
      if (item.qty <= 0) {
        cart = cart.filter((i) => i.name !== item.name);
      }
      updateCartUI();
    });
  });

  cartTotal.textContent = `Rp ${total.toLocaleString("id-ID")}`;
  cartCount.textContent = count;
}

// Scroll Atas//
function carto() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
// Nonaktifkan scroll & panah keyboard
document.querySelectorAll('input[type="number"]').forEach(input => {
  input.addEventListener('wheel', e => e.preventDefault());
  input.addEventListener('keydown', e => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
  });
});
