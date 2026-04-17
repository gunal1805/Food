// Main Navigation and Global Functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeModals();
    updateCartCount();
    attachGlobalEventListeners();
});

// Initialize Navigation
function initializeNavigation() {
    const hamburgerBtn = document.querySelector('#hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Hamburger menu toggle
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburgerBtn.classList.toggle('active');
        });
    }
    
    // Close menu when link clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            if (hamburgerBtn) hamburgerBtn.classList.remove('active');
        });
    });
    
    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar') && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (hamburgerBtn) hamburgerBtn.classList.remove('active');
        }
    });
}

// Modal Management
function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.close-btn');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// Show Modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

// Hide Modal
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Global Event Listeners
function attachGlobalEventListeners() {
    // View details buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('view-details')) {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                const productId = productCard.dataset.productId;
                showProductDetailModal(productId);
            }
        }
    });
    
    // Add to cart buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                const productId = parseInt(productCard.dataset.productId);
                const product = products.find(p => p.id === productId);
                if (product) {
                    addToCart(productId);
                }
            }
        }
    });
}

// Show Product Detail Modal
function showProductDetailModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('productDetailModal');
    if (!modal) {
        createProductDetailModal();
    }
    
    const modal2 = document.getElementById('productDetailModal');
    const content = modal2.querySelector('.modal-content');
    
    content.innerHTML = `
        <span class="close-btn">&times;</span>
        <div class="product-detail">
            <div class="product-detail-image">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 350px; object-fit: cover; background-color: #f0f0f0; border-radius: 8px;">
            </div>
            <div class="product-detail-info">
                <h2>${product.name}</h2>
                <div class="product-detail-rating">
                    ${createStars(product.rating)}
                    <span>(${product.reviews} reviews)</span>
                </div>
                <p class="product-detail-price">$${product.price.toFixed(2)}</p>
                <p class="product-detail-description">${product.description}</p>
                
                <div class="product-detail-options">
                    <div class="option-group">
                        <label>Size:</label>
                        <select id="sizeSelect" class="product-select">
                            <option value="">Select Size</option>
                            ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div class="option-group">
                        <label>Color:</label>
                        <div class="color-selector">
                            ${product.colors.map(color => `
                                <button class="color-option" data-color="${color}" style="background-color: ${getColorHex(color)};"></button>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="option-group">
                        <label>Quantity:</label>
                        <div class="quantity-selector">
                            <button class="qty-btn minus">-</button>
                            <input type="number" id="qtyInput" value="1" min="1" max="10">
                            <button class="qty-btn plus">+</button>
                        </div>
                    </div>
                </div>
                
                <button class="btn btn-primary btn-large" id="modalAddToCart">Add to Cart</button>
            </div>
        </div>
    `;
    
    // Setup modal events
    const closeBtn = content.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => hideModal('productDetailModal'));
    
    // Quantity controls
    const qtyInput = content.querySelector('#qtyInput');
    content.querySelector('.qty-btn.minus').addEventListener('click', () => {
        if (qtyInput.value > 1) qtyInput.value--;
    });
    content.querySelector('.qty-btn.plus').addEventListener('click', () => {
        if (qtyInput.value < 10) qtyInput.value++;
    });
    
    // Color selection
    content.querySelectorAll('.color-option').forEach(btn => {
        btn.addEventListener('click', () => {
            content.querySelectorAll('.color-option').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });
    
    // Add to cart from modal
    content.querySelector('#modalAddToCart').addEventListener('click', () => {
        const size = content.querySelector('#sizeSelect').value || product.sizes[0];
        const quantity = parseInt(content.querySelector('#qtyInput').value);
        addToCart(productId, size, quantity);
        hideModal('productDetailModal');
    });
    
    showModal('productDetailModal');
}

// Create Product Detail Modal if it doesn't exist
function createProductDetailModal() {
    if (document.getElementById('productDetailModal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'productDetailModal';
    modal.className = 'modal';
    modal.innerHTML = '<div class="modal-content"></div>';
    document.body.appendChild(modal);
}

// Get color hex value
function getColorHex(color) {
    const colorMap = {
        'black': '#000000',
        'white': '#ffffff',
        'blue': '#0066cc',
        'red': '#cc0000',
        'green': '#00cc00',
        'gray': '#808080',
        'navy': '#001a4d',
        'khaki': '#c3b091',
        'brown': '#8b4513',
        'gold': '#d4af37',
        'silver': '#c0c0c0'
    };
    return colorMap[color.toLowerCase()] || '#000000';
}

// Newsletter subscription
function handleNewsletterSubscription(email) {
    if (!email || !email.includes('@')) {
        showNotification('Please enter a valid email', 'error');
        return;
    }
    
    // Simulate API call
    localStorage.setItem('subscribedEmail', email);
    showNotification('Successfully subscribed to our newsletter!');
    
    // Clear input
    const input = document.querySelector('input[type="email"]');
    if (input) input.value = '';
}

// Load cart from localStorage on cart page
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart;
}

// Get cart total
function getCartTotal() {
    const cart = loadCart();
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    
    return {
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total
    };
}

// Format price
function formatPrice(price) {
    return '$' + price.toFixed(2);
}

// Scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button functionality
window.addEventListener('scroll', () => {
    const scrollBtn = document.querySelector('.scroll-top-btn');
    if (scrollBtn) {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Form validation helper
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validatePhone(phone) {
    const regex = /^[\d\s\-\+\(\)]{10,}$/;
    return regex.test(phone);
}

// Initialize on page load
function initializePage() {
    updateCartCount();
    
    // Initialize page-specific scripts
    if (document.body.id === 'shop-page') {
        initShopPage();
    } else if (document.body.id === 'cart-page') {
        initCartPage();
    } else if (document.body.id === 'checkout-page') {
        initCheckoutPage();
    }
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showModal,
        hideModal,
        showProductDetailModal,
        handleNewsletterSubscription,
        loadCart,
        getCartTotal,
        formatPrice,
        scrollToTop,
        validateEmail,
        validatePhone,
        initializePage
    };
}
