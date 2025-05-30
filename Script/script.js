document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.getElementById('productsContainer');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.querySelector('.modal-close');
    
    loadProducts();
    
    searchBtn.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            loadProducts(searchTerm);
        } else {
            loadProducts();
        }
    });
    
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    }); 
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    async function loadProducts(searchTerm = '') {
        try {
            let url = '/api/products';
            if (searchTerm) {
                url += `?q=${encodeURIComponent(searchTerm)}`;
            }
            
            const response = await fetch(url);
            if (!response.ok) throw new Error('Ошибка загрузки');
            
            const data = await response.json();
            displayProducts(Array.isArray(data) ? data : data.products);
        } catch (error) {
            console.error('Ошибка:', error);
            productsContainer.innerHTML = '<p>Не удалось загрузить товары</p>';
        }
    }
    
    function displayProducts(products) {
    if (!products || products.length === 0) {
        productsContainer.innerHTML = '<p class="no-products">Товары не найдены</p>';
        return;
    }
    
    productsContainer.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image-container">
                <img src="${product.thumbnail}" alt="${product.title}" class="product-image">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-rating">
                    ★ ${product.rating || '4.5'}
                </div>
                <div class="product-price-container">
                    <span class="product-price">$${product.price}</span>
                    <span class="product-arrow">→</span>
                </div>
            </div>
        </div>
    `).join('');

    
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', async (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') return;
            
            const productId = card.getAttribute('data-id');
            await showProductModal(productId);
        });
    });
}
    
    async function showProductModal(productId) {
        try {
            const response = await fetch(`https://dummyjson.com/products/${productId}`);
            if (!response.ok) throw new Error('Ошибка загрузки товара');
            
            const product = await response.json();
            
            modalBody.innerHTML = `
                <div class="modal-header">
                    <img src="${product.thumbnail}" alt="${product.title}" class="modal-image">
                    <div class="modal-info">
                        <h2 class="modal-title">${product.title}</h2>
                        <div class="modal-brand">${product.brand}</div>
                        <div class="modal-rating">★ ${product.rating}</div>
                        <div class="modal-price">$${product.price}</div>
                        <p class="modal-description">${product.description}</p>
                    </div>
                </div>
                <div class="modal-details">
                    <div class="modal-detail-item">
                        <span>Brand:</span>
                        <span>${product.brand}</span>
                    </div>
                    <div class="modal-detail-item">
                        <span>Category:</span>
                        <span>${product.category}</span>
                    </div>
                    <div class="modal-detail-item">
                        <span>Stock:</span>
                        <span>${product.stock} items available</span>
                    </div>
                    <div class="modal-detail-item">
                        <span>Discount:</span>
                        <span>${product.discountPercentage}%</span>
                    </div>
                </div>
                ${product.images && product.images.length > 1 ? `
                <div class="modal-gallery">
                    ${product.images.map(img => `
                        <img src="${img}" alt="${product.title}" class="modal-thumbnail">
                    `).join('')}
                </div>` : ''}
            `;
            
            modal.style.display = 'block';
            
            if (product.images && product.images.length > 1) {
                const thumbnails = document.querySelectorAll('.modal-thumbnail');
                const mainImage = document.querySelector('.modal-image');
                
                thumbnails.forEach(thumb => {
                    thumb.addEventListener('click', () => {
                        mainImage.src = thumb.src;
                        thumbnails.forEach(t => t.classList.remove('active'));
                        thumb.classList.add('active');
                    });
                });
            }
            
        } catch (error) {
            console.error('Ошибка:', error);
            modalBody.innerHTML = '<p>Не удалось загрузить информацию о товаре</p>';
            modal.style.display = 'block';
        }
    }
});