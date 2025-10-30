
document.addEventListener("DOMContentLoaded", function () {
  const productItems = document.querySelectorAll(".product-item");
  const subtotalElement = document.querySelector(".summary-row:nth-of-type(1) .price");
  const shippingElement = document.querySelector(".summary-row:nth-of-type(2) span:last-child");
  const discountElement = document.querySelector(".summary-row:nth-of-type(3) span:last-child");
  const totalElement = document.querySelector(".summary-row.total span:last-child");

  // Fungsi konversi teks "Rp 3.000.000" → angka
  function parseRupiah(str) {
    return Number(str.replace(/[^0-9]/g, "")) || 0;
  }

  // Fungsi konversi angka → "Rp 3.000.000"
  function formatRupiah(num) {
    return "Rp " + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  // Hitung subtotal dari semua produk
  let subtotal = 0;
  productItems.forEach((item) => {
    const priceText = item.querySelector(".product-price").textContent.trim();
    const qtyText = item.querySelector(".text-muted.small").textContent.trim();
    const price = parseRupiah(priceText);
    const qty = parseInt(qtyText.replace(/[^0-9]/g, "")) || 1;
    subtotal += price * qty;
  });

  // Ambil ongkir & diskon dari halaman
  const shipping = parseRupiah(shippingElement.textContent);
  const discount = parseRupiah(discountElement.textContent);

  // Hitung total
  const total = subtotal + shipping - discount;

  // Tampilkan hasil
  subtotalElement.textContent = formatRupiah(subtotal);
  totalElement.textContent = formatRupiah(total);
});
