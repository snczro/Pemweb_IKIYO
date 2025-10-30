// Sidebar & header
const headerWishlist = document.getElementById('header-wishlist');
const wishlistSidebar = document.getElementById('wishlist-sidebar');
const wishlistItems = document.getElementById('wishlist-items');
const closeWishlistBtn = document.getElementById('close-wishlist');

// Ambil wishlist dari localStorage
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Render wishlist di sidebar
function renderWishlist() {
    wishlistItems.innerHTML = '';
    wishlist.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div>
                <p><strong>${item.name}</strong></p>
                <p>${item.price}</p>
            </div>
            <button class="remove-btn" data-index="${index}">Hapus</button>
        `;
        wishlistItems.appendChild(li);
    });

    // Tombol hapus
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            const idx = e.target.dataset.index;
            wishlist.splice(idx, 1);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            renderWishlist();
        });
    });
}

// trigger ketika wishlist dipencet
headerWishlist.addEventListener('click', e => {
    e.preventDefault();
    renderWishlist();
    wishlistSidebar.classList.add('active');
});

// nutup sidebar
closeWishlistBtn.addEventListener('click', () => {
    wishlistSidebar.classList.remove('active');
});

// Tambah ke wishlist
const wishlistBtn = document.querySelector('.wishlist-btn');
wishlistBtn.addEventListener('click', () => {
    const productName = document.querySelector('.product-details h2').innerText;
    const productPrice = document.querySelector('.product-details .price h3').innerText;
    const productImg = document.querySelector('.product-img img').src;

    // Cek kalau belum ada di wishlist
    const exists = wishlist.some(item => item.name === productName);
    if (!exists) {
        wishlist.push({ name: productName, price: productPrice, img: productImg });
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        renderWishlist();
        alert(`${productName} ditambahkan ke wishlist!`);
    } else {
        alert(`${productName} sudah ada di wishlist!`);
    }
});