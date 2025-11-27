document.addEventListener('DOMContentLoaded', function() {
  const searchBar = document.querySelector('.search-bar');
  const cancelBtn = document.querySelector('.search-cancel');
  const searchInput = document.querySelector('input[name="search"]');
  const products = document.querySelectorAll('.product-box');

  /*OPEN-CANCEL SEARCH BAR*/
  document.addEventListener('click', function(event) {
    if (event.target.closest('.nav-search')) {
      searchBar.classList.add('search-bar-active');
    } else if (event.target.closest('.search-cancel')) {
      event.preventDefault();
      searchBar.classList.remove('search-bar-active');
      searchInput.value = '';
      products.forEach(p => p.style.display = 'flex');
    }
  });

  /*input pencarian produk*/
  searchInput.addEventListener('input', function() {
    const filter = searchInput.value.toLowerCase().trim();

    products.forEach(product => {
      const name = product.querySelector('.product-text-title')?.textContent.toLowerCase() || '';

      if (name.includes(filter)) {
        product.style.display = 'flex';
      } else {
        product.style.display = 'none';
      }
    });
  });
});
