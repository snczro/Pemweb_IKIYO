// add-to-cart.js (versi lengkap & sinkron otomatis)
document.addEventListener("DOMContentLoaded", () => {
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  const cartCount = document.querySelector(".cart-count");

  // 🛒 Ambil data cart dari localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Hitung jumlah total item di keranjang
  let count = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Simpan & tampilkan jumlah awal
  localStorage.setItem("cartCount", count);
  if (cartCount) cartCount.textContent = count > 0 ? count : "";

  // ✅ Jika ada tombol add-to-cart (halaman produk)
  if (addToCartButtons.length > 0) {
    addToCartButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();

        const name = button.dataset.name;
        const price = parseInt(button.dataset.price);
        const image = button.dataset.image;

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingItem = cart.find((item) => item.name === name);

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.push({ name, price, image, quantity: 1 });
        }

        // Simpan ulang ke localStorage
        localStorage.setItem("cart", JSON.stringify(cart));

        // Hitung ulang total
        const newCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        localStorage.setItem("cartCount", newCount);

        // Update tampilan badge
        if (cartCount) {
          cartCount.textContent = newCount > 0 ? newCount : "";
          cartCount.classList.add("bump");
          setTimeout(() => cartCount.classList.remove("bump"), 300);
        }

        // (Opsional) Redirect ke halaman cart
        window.location.href = "cart.html";
      });
    });
  }

  // ✅ Jika halaman ini adalah cart.html → tampilkan isi keranjang
  const cartContainer = document.querySelector("#cart-items");
  if (cartContainer) {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

    const cartSummary = document.getElementById("cart-summary");
    const discountSection = document.getElementById("discount-section");
    const cartHeader = document.querySelector(".cart-header");

    if (storedCart.length === 0) {
      cartContainer.innerHTML =
        "<p class='text-center mt-5 cart-empty-message'>Keranjang belanja kosong 😔</p>";
      // Sembunyikan summary, diskon, dan tombol jika kosong
      if (cartSummary) cartSummary.style.display = "none";
      if (discountSection) discountSection.style.display = "none";
      if (cartHeader) cartHeader.style.display = "none";
      // Pastikan cartCount juga kosong
      if (cartCount) cartCount.textContent = "";
      localStorage.setItem("cartCount", 0);
      return;
    } else {
      // Tampilkan summary dan diskon jika ada item
      if (cartSummary) cartSummary.style.display = "";
      if (discountSection) discountSection.style.display = "block";
      if (cartHeader) cartHeader.style.display = "";
    }

    let total = 0;
    storedCart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const card = document.createElement("div");
      card.classList.add("card", "rounded-3", "mb-4");
      card.innerHTML = `
        <div class="card-body p-4">
          <div class="row d-flex justify-content-between align-items-center">
            <div class="col-md-2 col-lg-2 col-xl-2">
              <img src="${item.image}" class="img-fluid rounded-3" alt="${
        item.name
      }">
            </div>
            <div class="col-md-3 col-lg-3 col-xl-3">
              <p class="lead fw-normal mb-2">${item.name}</p>
            </div>
            <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
              <button class="btn btn-link px-2 decrease">−</button>
              <input min="1" value="${
                item.quantity
              }" type="number" class="form-control form-control-sm text-center" readonly />
              <button class="btn btn-link px-2 increase">+</button>
            </div>
            <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
              <h5 class="mb-0">Rp${itemTotal.toLocaleString("id-ID")}</h5>
            </div>
            <div class="col-md-1 col-lg-1 col-xl-1 text-end">
              <a href="#" class="text-black remove-item"><i class="fas fa-trash fa-lg"></i></a>
            </div>
          </div>
        </div>
      `;
      cartContainer.appendChild(card);

      const minusBtn = card.querySelector(".decrease");
      const plusBtn = card.querySelector(".increase");
      const removeBtn = card.querySelector(".remove-item");

      minusBtn.addEventListener("click", () => updateQuantity(item.name, -1));
      plusBtn.addEventListener("click", () => updateQuantity(item.name, 1));
      removeBtn.addEventListener("click", () => removeItem(item.name));
    });

    // Update total amount in the existing total element
    const totalAmount = document.getElementById("cart-total");
    if (totalAmount) {
      totalAmount.textContent = `Rp${total.toLocaleString("id-ID")}`;
    }

    // 🔁 Fungsi update quantity (tambah/kurang)
    function updateQuantity(name, delta) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const product = cart.find((i) => i.name === name);

      if (product) {
        product.quantity += delta;
        if (product.quantity <= 0) cart = cart.filter((i) => i.name !== name);
        localStorage.setItem("cart", JSON.stringify(cart));

        // 🔄 Update jumlah total & badge
        const newCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        localStorage.setItem("cartCount", newCount);

        const cartCountEl = document.querySelector(".cart-count");
        if (cartCountEl) cartCountEl.textContent = newCount > 0 ? newCount : "";

        location.reload();
      }
    }

    // 🗑️ Fungsi hapus item
    function removeItem(name) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart = cart.filter((i) => i.name !== name);
      localStorage.setItem("cart", JSON.stringify(cart));

      // 🔄 Update jumlah total & badge
      const newCount = cart.reduce((sum, item) => sum + item.quantity, 0);
      localStorage.setItem("cartCount", newCount);

      const cartCountEl = document.querySelector(".cart-count");
      if (cartCountEl) cartCountEl.textContent = newCount > 0 ? newCount : "";

      location.reload();
    }
  }
});
