// Shop Page Functionality

let currentPage = 1;
const itemsPerPage = 12;
let filteredProducts = [...products];

function initShopPage() {
    renderProducts(filteredProducts);
    setupFilterListeners();
    setupSortListener();
    setupPaginationListeners();
}

// Render products on page
function renderProducts(productsToRender) {
    const productGrid = document.querySelector('.products-grid');
    if (!productGrid) return;
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = productsToRender.slice(startIndex, endIndex);
    
    productGrid.innerHTML = paginatedProducts
        .map(product => createProductCard(product))
        .join('');
    
    // Attach event listeners
    attachProductEventListeners();
    updatePaginationButtons(productsToRender.length);
}

// Attach event listeners to product cards
function attachProductEventListeners() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.querySelector('.add-to-cart').addEventListener('click', (e) => {
            e.preventDefault();
            const productId = parseInt(card.dataset.productId);
            addToCart(productId);
        });
        
        card.querySelector('.view-details').addEventListener('click', (e) => {
            e.preventDefault();
            const productId = parseInt(card.dataset.productId);
            showProductDetailModal(productId);
        });
    });
}

// Setup filter listeners
function setupFilterListeners() {
    // Category filter
    const categoryCheckboxes = document.querySelectorAll('input[data-filter="category"]');
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    // Price filter
    const priceRange = document.getElementById('price-range');
    if (priceRange) {
        priceRange.addEventListener('input', (e) => {
            document.getElementById('price-value').textContent = e.target.value;
            applyFilters();
        });
    }
    
    // Size filter
    const sizeCheckboxes = document.querySelectorAll('input[data-filter="size"]');
    sizeCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    // Color filter
    const colorCheckboxes = document.querySelectorAll('input[data-filter="color"]');
    colorCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    // Clear filters button
    const clearFiltersBtn = document.getElementById('clear-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
}

// Apply filters
function applyFilters() {
    currentPage = 1;
    
    // Get selected categories
    const selectedCategories = Array.from(document.querySelectorAll('input[data-filter="category"]:checked'))
        .map(cb => cb.value);
    
    // Get max price
    const maxPrice = parseInt(document.getElementById('price-range')?.value || 500);
    
    // Get selected sizes
    const selectedSizes = Array.from(document.querySelectorAll('input[data-filter="size"]:checked'))
        .map(cb => cb.value);
    
    // Get selected colors
    const selectedColors = Array.from(document.querySelectorAll('input[data-filter="color"]:checked'))
        .map(cb => cb.value);
    
    // Create filter object
    const filters = {
        categories: selectedCategories.length > 0 ? selectedCategories : null,
        maxPrice: maxPrice,
        sizes: selectedSizes.length > 0 ? selectedSizes : null,
        colors: selectedColors.length > 0 ? selectedColors : null
    };
    
    // Filter products
    filteredProducts = filterProducts(filters);
    
    // Apply sorting
    const sortSelect = document.getElementById('sort');
    if (sortSelect) {
        filteredProducts = sortProducts(filteredProducts, sortSelect.value);
    }
    
    renderProducts(filteredProducts);
}

// Setup sort listener
function setupSortListener() {
    const sortSelect = document.getElementById('sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentPage = 1;
            filteredProducts = sortProducts(filteredProducts, e.target.value);
            renderProducts(filteredProducts);
        });
    }
}

// Update pagination info
function updatePaginationButtons(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationInfo = document.getElementById('pagination-numbers');
    
    if (paginationInfo) {
        const startItem = (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(currentPage * itemsPerPage, totalItems);
        paginationInfo.textContent = `Showing ${startItem}-${endItem} of ${totalItems} products`;
    }
    
    // Update pagination buttons
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
        prevBtn.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                renderProducts(filteredProducts);
                scrollToTop();
            }
        };
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage >= totalPages;
        nextBtn.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderProducts(filteredProducts);
                scrollToTop();
            }
        };
    }
}

// Setup pagination listeners
function setupPaginationListeners() {
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderProducts(filteredProducts);
                scrollToTop();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderProducts(filteredProducts);
                scrollToTop();
            }
        });
    }
}

// Clear all filters
function clearAllFilters() {
    currentPage = 1;
    
    // Uncheck all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    
    // Reset price range to max
    const priceRange = document.getElementById('price-range');
    if (priceRange) {
        priceRange.value = 500;
        document.getElementById('price-value').textContent = '500';
    }
    
    filteredProducts = [...products];
    renderProducts(filteredProducts);
}

// Get filter summary
function getFilterSummary() {
    const summary = [];
    
    const categories = Array.from(document.querySelectorAll('input[data-filter="category"]:checked'))
        .map(cb => cb.value);
    if (categories.length > 0) {
        summary.push(`Categories: ${categories.join(', ')}`);
    }
    
    const maxPrice = document.getElementById('price-range')?.value;
    if (maxPrice && maxPrice < 500) {
        summary.push(`Max Price: $${maxPrice}`);
    }
    
    const sizes = Array.from(document.querySelectorAll('input[data-filter="size"]:checked'))
        .map(cb => cb.value);
    if (sizes.length > 0) {
        summary.push(`Sizes: ${sizes.join(', ')}`);
    }
    
    const colors = Array.from(document.querySelectorAll('input[data-filter="color"]:checked'))
        .map(cb => cb.value);
    if (colors.length > 0) {
        summary.push(`Colors: ${colors.join(', ')}`);
    }
    
    return summary;
}

// Initialize on page load if on shop page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.body.id === 'shop-page' || document.querySelector('.shop-container')) {
            initShopPage();
        }
    });
} else {
    if (document.body.id === 'shop-page' || document.querySelector('.shop-container')) {
        initShopPage();
    }
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initShopPage,
        renderProducts,
        applyFilters,
        clearAllFilters,
        getFilterSummary
    };
}
