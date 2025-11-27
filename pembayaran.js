// pembayaran.js - Kompatibel dengan cart.html
document.addEventListener("DOMContentLoaded", function () {
  // ====== UTILITY FUNCTIONS ======
  function formatRupiah(num) {
    return "Rp " + Number(num).toLocaleString("id-ID");
  }

  // ====== AMBIL DATA DARI CART (LOCALSTORAGE) ======
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let discount = 0;
  let shippingCost = 50000; // Default JNE Regular

  console.log("🛒 Data cart dari localStorage:", cart);
  console.log("📊 Jumlah item di cart:", cart.length);

  // ====== ELEMENT REFERENCES ======
  const productListContainer = document.getElementById("product-list");
  const itemCountElement = document.getElementById("item-count");
  const subtotalElement = document.getElementById("subtotal-display");
  const shippingElement = document.getElementById("shipping-cost-display");
  const discountElement = document.getElementById("discount-display");
  const totalElement = document.getElementById("total-display");
  const cartCountEl = document.querySelector(".cart-count");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const addressForm = document.getElementById("addressForm");
  const voucherInput = document.getElementById("voucherInput");
  const applyVoucherBtn = document.getElementById("applyVoucherBtn");

  // ====== RENDER PRODUCTS FROM CART ======
  function renderCartProducts() {
    if (!productListContainer) return;
    
    productListContainer.innerHTML = "";

    if (cart.length === 0) {
      productListContainer.innerHTML = `
        <div class="empty-cart-message">
          <i class="fas fa-shopping-cart"></i>
          <p>Keranjang belanja Anda kosong</p>
          <a href="pemweb.catalogue.html" class="btn btn-warning">
            <i class="fas fa-shopping-bag me-2"></i>Belanja Sekarang
          </a>
        </div>
      `;
      
      // Hide summary if cart is empty
      const summaryRows = document.querySelectorAll(".summary-row");
      summaryRows.forEach(row => row.style.display = "none");
      if (checkoutBtn) checkoutBtn.style.display = "none";
      
      return;
    }

    // Show summary rows
    const summaryRows = document.querySelectorAll(".summary-row");
    summaryRows.forEach(row => row.style.display = "flex");
    if (checkoutBtn) checkoutBtn.style.display = "flex";

    // Render each product
    cart.forEach((item, index) => {
      // Price dari cart.html sudah dalam bentuk NUMBER
      const itemPrice = Number(item.price) || 0;
      const itemQty = Number(item.quantity) || 1;
      const itemTotal = itemPrice * itemQty;
      
      console.log(`📦 Item ${index + 1}:`, {
        name: item.name,
        price: itemPrice,
        quantity: itemQty,
        total: itemTotal,
        formatted: formatRupiah(itemTotal)
      });
      
      const productDiv = document.createElement("div");
      productDiv.classList.add("product-item");
      productDiv.innerHTML = `
        <img src="${item.image || 'images/placeholder.png'}" alt="${item.name}" class="product-img" onerror="this.src='images/placeholder.png'">
        <div class="product-info">
          <div class="product-name">${item.name}</div>
          <div class="text-muted small">Qty: ${itemQty} </div>
          <div class="product-price">${formatRupiah(itemTotal)}</div>
        </div>
      `;
      
      productListContainer.appendChild(productDiv);
    });

    console.log("✅ Produk berhasil dirender:", cart.length, "item");
  }

  // ====== CALCULATE & UPDATE TOTALS (SUM SEMUA PRODUCT PRICE) ======
  function updateTotals() {
    // HITUNG SUBTOTAL - SUM dari (price × quantity) semua item
    let subtotal = 0;
    
    console.log("💰 MENGHITUNG SUBTOTAL:");
    console.log("   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    cart.forEach((item, index) => {
      // Price dari add-to-cart.js sudah NUMBER via parseInt()
      const itemPrice = Number(item.price) || 0;
      const itemQty = Number(item.quantity) || 1;
      const itemTotal = itemPrice * itemQty;
      
      subtotal += itemTotal;
      
      console.log(`   Item ${index + 1}: ${item.name}`);
      console.log(`      ${formatRupiah(itemPrice)} × ${itemQty} = ${formatRupiah(itemTotal)}`);
    });
    
    // Hitung total item
    const totalItems = cart.reduce((sum, item) => sum + Number(item.quantity), 0);
    
    // Hitung total akhir
    const total = subtotal + shippingCost - discount;

    console.log("   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("   📊 SUBTOTAL (SUM):", formatRupiah(subtotal));
    console.log("   🚚 Ongkos Kirim  :", formatRupiah(shippingCost));
    console.log("   🎫 Diskon         :", formatRupiah(discount));
    console.log("   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("   💵 TOTAL BAYAR   :", formatRupiah(total));
    console.log("");

    // UPDATE UI - SUBTOTAL
    if (subtotalElement) {
      subtotalElement.textContent = formatRupiah(subtotal);
      console.log("✅ Subtotal BERHASIL ditampilkan di halaman!");
    } else {
      console.error("❌ Element #subtotal-display TIDAK DITEMUKAN!");
      console.log("   Pastikan HTML memiliki: <span id=\"subtotal-display\">Rp 0</span>");
    }

    // Update UI - Item Count
    if (itemCountElement) {
      itemCountElement.textContent = `(${totalItems} item${totalItems > 1 ? 's' : ''})`;
    }
    
    // Update UI - Shipping
    if (shippingElement) {
      shippingElement.textContent = formatRupiah(shippingCost);
    }
    
    // Update UI - Discount
    if (discountElement) {
      discountElement.textContent = discount > 0 ? `- ${formatRupiah(discount)}` : formatRupiah(0);
    }
    
    // Update UI - Total
    if (totalElement) {
      totalElement.textContent = formatRupiah(total);
    }

    // Update cart count badge di navbar
    if (cartCountEl) {
      cartCountEl.textContent = totalItems > 0 ? totalItems : "";
    }
  }

  // ====== PAYMENT METHOD INTERACTION ======
  const paymentMethods = document.querySelectorAll('.payment-method[data-method]');
  paymentMethods.forEach(method => {
    method.addEventListener('click', function() {
      paymentMethods.forEach(m => m.classList.remove('active'));
      this.classList.add('active');
      const radio = this.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  // ====== SHIPPING METHOD INTERACTION ======
  const shippingMethods = document.querySelectorAll('.payment-method[data-shipping]');
  shippingMethods.forEach(method => {
    method.addEventListener('click', function() {
      shippingMethods.forEach(m => m.classList.remove('active'));
      this.classList.add('active');
      
      const radio = this.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;

      // Update shipping cost
      const costElement = this.querySelector('[data-shipping-cost]');
      if (costElement) {
        shippingCost = parseInt(costElement.dataset.shippingCost) || 50000;
        updateTotals(); // Recalculate
        console.log("🚚 Ongkir diubah menjadi:", formatRupiah(shippingCost));
      }
    });
  });

  // ====== VOUCHER SYSTEM ======
  if (applyVoucherBtn) {
    applyVoucherBtn.addEventListener('click', function() {
      const voucherCode = voucherInput.value.trim().toUpperCase();
      
      const vouchers = {
        'DISKON10': { 
          type: 'percent', 
          value: 10,
          description: 'Diskon 10%'
        },
        'DISKON50K': { 
          type: 'fixed', 
          value: 50000,
          description: 'Diskon Rp 50.000'
        },
        'GRATIS_ONGKIR': { 
          type: 'shipping', 
          value: 0,
          description: 'Gratis Ongkir'
        }
      };

      if (!voucherCode) {
        alert('⚠️ Silakan masukkan kode voucher!');
        return;
      }

      if (vouchers[voucherCode]) {
        const voucher = vouchers[voucherCode];
        
        // Hitung ulang subtotal
        let subtotal = 0;
        cart.forEach(item => {
          subtotal += Number(item.price) * Number(item.quantity);
        });
        
        if (voucher.type === 'percent') {
          discount = Math.floor(subtotal * voucher.value / 100);
        } else if (voucher.type === 'fixed') {
          discount = voucher.value;
        } else if (voucher.type === 'shipping') {
          shippingCost = 0;
          discount = 0;
          
          shippingMethods.forEach(method => {
            const costEl = method.querySelector('.shipping-cost');
            if (costEl) {
              costEl.textContent = "GRATIS";
              costEl.style.color = "#28a745";
            }
          });
        }
        
        updateTotals();
        
        alert(`✅ Voucher "${voucherCode}" berhasil digunakan!\n${voucher.description}`);
        voucherInput.value = '';
        voucherInput.disabled = true;
        applyVoucherBtn.textContent = 'Terpakai';
        applyVoucherBtn.disabled = true;
      } else {
        alert('❌ Kode voucher tidak valid!\n\nCoba:\n- DISKON10\n- DISKON50K\n- GRATIS_ONGKIR');
      }
    });
  }

  // ====== CHECKOUT PROCESS ======
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function() {
      if (cart.length === 0) {
        alert('❌ Keranjang belanja Anda kosong!\nSilakan tambahkan produk terlebih dahulu.');
        window.location.href = 'pemweb.catalogue.html';
        return;
      }

      if (!addressForm.checkValidity()) {
        addressForm.reportValidity();
        return;
      }

      const selectedPayment = document.querySelector('input[name="payment"]:checked');
      if (!selectedPayment) {
        alert('⚠️ Silakan pilih metode pembayaran!');
        return;
      }

      const selectedShipping = document.querySelector('input[name="shipping"]:checked');
      if (!selectedShipping) {
        alert('⚠️ Silakan pilih metode pengiriman!');
        return;
      }

      const paymentMethod = selectedPayment.closest('[data-method]').dataset.method;
      const shippingMethod = selectedShipping.closest('[data-shipping]').dataset.shipping;
      const paymentName = selectedPayment.closest('.payment-method').querySelector('strong').textContent;
      const shippingName = selectedShipping.closest('.payment-method').querySelector('strong').textContent;

      // Hitung subtotal final
      let subtotal = 0;
      cart.forEach(item => {
        subtotal += Number(item.price) * Number(item.quantity);
      });
      
      const total = subtotal + shippingCost - discount;

      const orderData = {
        orderId: 'ORD-' + Date.now(),
        cart: cart,
        subtotal: subtotal,
        shipping: {
          method: shippingMethod,
          name: shippingName,
          cost: shippingCost
        },
        discount: discount,
        total: total,
        payment: {
          method: paymentMethod,
          name: paymentName
        },
        address: {
          name: addressForm.querySelector('input[placeholder="Masukkan nama lengkap"]').value,
          phone: addressForm.querySelector('input[type="tel"]').value,
          address: addressForm.querySelector('textarea').value,
          city: addressForm.querySelector('input[placeholder="Surabaya"]').value,
          postalCode: addressForm.querySelector('input[placeholder="60189"]').value
        },
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      };

      localStorage.setItem("lastOrder", JSON.stringify(orderData));
      
      let orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
      orderHistory.push(orderData);
      localStorage.setItem("orderHistory", JSON.stringify(orderHistory));

      const confirmMessage = `
✅ PESANAN BERHASIL!

Order ID: ${orderData.orderId}
────────────────────────────
Subtotal: ${formatRupiah(subtotal)}
Ongkir: ${formatRupiah(shippingCost)}
Diskon: ${formatRupiah(discount)}
────────────────────────────
Total Pembayaran: ${formatRupiah(total)}
Metode Bayar: ${paymentName}
Pengiriman: ${shippingName}
────────────────────────────

Terima kasih telah berbelanja di IKIYO Furniture! 🎉

Pesanan Anda sedang diproses.
      `.trim();

      alert(confirmMessage);

      localStorage.removeItem("cart");
      localStorage.setItem("cartCount", 0);
      
      setTimeout(() => {
        window.location.href = "pemweb.html";
      }, 500);
    });
  }

  // ====== INITIALIZE ======
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🚀 MEMUAT HALAMAN PEMBAYARAN");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  renderCartProducts();
  updateTotals();
  
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ HALAMAN PEMBAYARAN SIAP!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
});