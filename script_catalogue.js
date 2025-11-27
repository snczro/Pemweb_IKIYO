const productsPerPage = 12; /*jumlah produk per halaman*/
const products = document.querySelectorAll('.product-box');
const pagination = document.getElementById('pagination');
let currentPage = 1;
const totalPages = Math.ceil(products.length / productsPerPage);


function showPage(page) {
    const start = (page - 1) * productsPerPage;
    const end = start + productsPerPage;
    products.forEach((p, index) => {
        if(index >= start && index < end){
            p.style.display = "flex";
        } else {
            p.style.display = "none";
        }
    });
    renderPagination();
}

function renderPagination() {
    pagination.innerHTML = "";
    for(let i=1; i<=totalPages; i++){
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = 'page-btn';
        if(i === currentPage) btn.style.backgroundColor = '#B88E2F', btn.style.color = '#fff';
        btn.addEventListener('click', () => {
            currentPage = i;
            showPage(currentPage);
        });
        pagination.appendChild(btn);
    }
}

showPage(currentPage);
