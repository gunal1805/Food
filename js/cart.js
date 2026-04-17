// Cart Page Functionality

function initCartPage() {
    const cartContainer = document.querySelector('.cart-container');
    if (cartContainer) {
        renderCartItems();
        setupCartEventListeners();
    }
}

// Render cart items
function renderCartItems() {
    const cart = loadCart();
    const cartItems = document.querySelector('.cart-items');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
            </div>
        `;
        updateOrderSummary();
        return;
    }
    
    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item" data-item-index="${index}">
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px; background-color: #f0f0f0;">
            </div>
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="item-meta">Size: <strong>${item.size}</strong></p>
                <p class="item-price">${formatPrice(item.price)}</p>
            </div>
            <div class="item-quantity">
                <button class="qty-btn qty-decrease" data-index="${index}">-</button>
                <input type="number" class="qty-input" value="${item.quantity}" min="1" data-index="${index}">
                <button class="qty-btn qty-increase" data-index="${index}">+</button>
            </div>
            <div class="item-total">
                <p class="total-price">${formatPrice(item.price * item.quantity)}</p>
            </div>
            <div class="item-actions">
                <button class="btn-remove" data-index="${index}" title="Remove item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    attachCartEventListeners();
    updateOrderSummary();
}

// Setup cart event listeners
function setupCartEventListeners() {
    attachCartEventListeners();
}

// Attach cart event listeners
function attachCartEventListeners() {
    // Quantity increase
    document.querySelectorAll('.qty-increase').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            updateCartItemQuantity(index, 1);
        });
    });
    
    // Quantity decrease
    document.querySelectorAll('.qty-decrease').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            updateCartItemQuantity(index, -1);
        });
    });
    
    // Quantity input change
    document.querySelectorAll('.qty-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const index = parseInt(e.target.dataset.index);
            const quantity = parseInt(e.target.value);
            if (quantity > 0) {
                setCartItemQuantity(index, quantity);
            }
        });
    });
    
    // Remove item
    document.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.closest('[data-index]').dataset.index);
            removeFromCart(index);
        });
    });
}

// Update cart item quantity
function updateCartItemQuantity(index, change) {
    const cart = loadCart();
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity < 1) {
            cart[index].quantity = 1;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
    }
}

// Set cart item quantity to exact value
function setCartItemQuantity(index, quantity) {
    const cart = loadCart();
    if (cart[index] && quantity > 0) {
        cart[index].quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
    }
}

// Remove from cart
function removeFromCart(index) {
    const cart = loadCart();
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
    showNotification('Item removed from cart');
}

// Update order summary
function updateOrderSummary() {
    const totals = getCartTotal();
    
    const summaryHTML = `
        <div class="order-summary">
            <h3>Order Summary</h3>
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>${formatPrice(totals.subtotal)}</span>
            </div>
            <div class="summary-row">
                <span>Shipping:</span>
                <span>${formatPrice(totals.shipping)}</span>
            </div>
            <div class="summary-row">
                <span>Tax (8%):</span>
                <span>${formatPrice(totals.tax)}</span>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-row total">
                <span>Total:</span>
                <span>${formatPrice(totals.total)}</span>
            </div>
            
            <div class="promo-section">
                <input type="text" id="promoCode" placeholder="Promo code" class="promo-input">
                <button class="btn btn-secondary" id="applyPromo">Apply</button>
            </div>
            
            <a href="checkout.html" class="btn btn-primary btn-block">Proceed to Checkout</a>
            <a href="shop.html" class="btn btn-outline btn-block">Continue Shopping</a>
        </div>
    `;
    
    const summaryContainer = document.querySelector('.order-summary-container');
    if (summaryContainer) {
        summaryContainer.innerHTML = summaryHTML;
        
        // Promo code functionality
        document.getElementById('applyPromo').addEventListener('click', applyPromoCode);
        document.getElementById('promoCode').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') applyPromoCode();
        });
    }
}

// Apply promo code
function applyPromoCode() {
    const promoInput = document.getElementById('promoCode');
    const code = promoInput.value.trim();
    
    if (!code) {
        showNotification('Please enter a promo code', 'error');
        return;
    }
    
    // Simple promo codes for demo
    const promoCodes = {
        'SAVE10': 0.10,
        'SAVE20': 0.20,
        'WELCOME': 0.15
    };
    
    if (promoCodes[code.toUpperCase()]) {
        const discount = promoCodes[code.toUpperCase()];
        const cart = loadCart();
        cart.forEach(item => {
            item.discount = discount;
        });
        localStorage.setItem('cart', JSON.stringify(cart));
        showNotification(`Promo code applied! Discount: ${(discount * 100)}%`);
        updateOrderSummary();
    } else {
        showNotification('Invalid promo code', 'error');
    }
}

// Clear cart
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        localStorage.removeItem('cart');
        updateCartCount();
        renderCartItems();
        showNotification('Cart cleared');
    }
}

// Get cart item count
function getCartItemCount() {
    const cart = loadCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.body.id === 'cart-page' || document.querySelector('.cart-container')) {
            initCartPage();
        }
    });
} else {
    if (document.body.id === 'cart-page' || document.querySelector('.cart-container')) {
        initCartPage();
    }
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initCartPage,
        renderCartItems,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        getCartItemCount
    };
}
