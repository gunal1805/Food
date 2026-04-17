// Checkout Page Functionality

let currentStep = 1;
const totalSteps = 3;

function initCheckoutPage() {
    const checkoutContainer = document.querySelector('.checkout-container');
    if (checkoutContainer) {
        loadCheckoutData();
        setupCheckoutEventListeners();
        showStep(1);
    }
}

// Show specific step
function showStep(step) {
    if (step < 1 || step > totalSteps) return;
    
    currentStep = step;
    
    // Hide all steps
    document.querySelectorAll('.checkout-step').forEach(s => {
        s.classList.remove('active');
    });
    
    // Show current step
    const currentStepEl = document.querySelector(`[data-step="${step}"]`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
    }
    
    // Update progress indicators
    updateProgressIndicators();
    
    // Update order summary
    updateCheckoutOrderSummary();
}

// Update progress indicators
function updateProgressIndicators() {
    document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
        const stepNum = index + 1;
        indicator.classList.remove('active', 'completed');
        
        if (stepNum === currentStep) {
            indicator.classList.add('active');
        } else if (stepNum < currentStep) {
            indicator.classList.add('completed');
        }
    });
}

// Setup checkout event listeners
function setupCheckoutEventListeners() {
    // Next buttons
    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (validateCurrentStep()) {
                showStep(currentStep + 1);
            }
        });
    });
    
    // Previous buttons
    document.querySelectorAll('.btn-prev').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showStep(currentStep - 1);
        });
    });
    
    // Address type toggle
    document.querySelectorAll('input[name="addressType"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            showAddressForm(e.target.value);
        });
    });
    
    // Payment method toggle
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            showPaymentForm(e.target.value);
        });
    });
    
    // Confirm order button
    const confirmBtn = document.querySelector('.btn-confirm-order');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (validateCurrentStep()) {
                completeOrder();
            }
        });
    }
}

// Show address form based on type
function showAddressForm(type) {
    const addressForms = document.querySelectorAll('.address-form');
    addressForms.forEach(form => {
        form.style.display = 'none';
    });
    
    const selectedForm = document.querySelector(`[data-address-type="${type}"]`);
    if (selectedForm) {
        selectedForm.style.display = 'block';
    }
}

// Show payment form based on method
function showPaymentForm(method) {
    const paymentForms = document.querySelectorAll('.payment-form');
    paymentForms.forEach(form => {
        form.style.display = 'none';
    });
    
    const selectedForm = document.querySelector(`[data-payment-method="${method}"]`);
    if (selectedForm) {
        selectedForm.style.display = 'block';
    }
}

// Validate current step
function validateCurrentStep() {
    switch(currentStep) {
        case 1:
            return validateShippingStep();
        case 2:
            return validatePaymentStep();
        case 3:
            return true; // Review step just displays data
        default:
            return false;
    }
}

// Validate shipping step
function validateShippingStep() {
    const form = document.querySelector('[data-step="1"] form');
    if (!form) return true;
    
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });
    
    // Validate email
    const email = form.querySelector('input[type="email"]');
    if (email && email.value && !validateEmail(email.value)) {
        email.classList.add('error');
        isValid = false;
    }
    
    // Validate phone
    const phone = form.querySelector('input[type="tel"]');
    if (phone && phone.value && !validatePhone(phone.value)) {
        phone.classList.add('error');
        isValid = false;
    }
    
    if (!isValid) {
        showNotification('Please fill in all required fields correctly', 'error');
    }
    
    return isValid;
}

// Validate payment step
function validatePaymentStep() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    if (!paymentMethod) {
        showNotification('Please select a payment method', 'error');
        return false;
    }
    
    if (paymentMethod.value === 'card') {
        return validateCardDetails();
    }
    
    return true;
}

// Validate card details
function validateCardDetails() {
    const cardForm = document.querySelector('[data-payment-method="card"]');
    if (!cardForm) return true;
    
    const cardNumber = cardForm.querySelector('input[placeholder*="Card Number"]');
    const expiry = cardForm.querySelector('input[placeholder*="MM/YY"]');
    const cvv = cardForm.querySelector('input[placeholder*="CVV"]');
    
    let isValid = true;
    
    if (!cardNumber || !cardNumber.value.replace(/\s/g, '').match(/^\d{13,19}$/)) {
        if (cardNumber) cardNumber.classList.add('error');
        isValid = false;
    }
    
    if (!expiry || !expiry.value.match(/^\d{2}\/\d{2}$/)) {
        if (expiry) expiry.classList.add('error');
        isValid = false;
    }
    
    if (!cvv || !cvv.value.match(/^\d{3,4}$/)) {
        if (cvv) cvv.classList.add('error');
        isValid = false;
    }
    
    if (!isValid) {
        showNotification('Please enter valid card details', 'error');
    }
    
    return isValid;
}

// Load checkout data
function loadCheckoutData() {
    const cart = loadCart();
    updateCheckoutOrderSummary();
}

// Update checkout order summary
function updateCheckoutOrderSummary() {
    const totals = getCartTotal();
    const summaryElement = document.querySelector('.checkout-summary');
    
    if (summaryElement) {
        const cart = loadCart();
        summaryElement.innerHTML = `
            <h3>Order Summary</h3>
            <div class="summary-items">
                ${cart.map(item => `
                    <div class="summary-item">
                        <span>${item.name} (${item.quantity}x)</span>
                        <span>${formatPrice(item.price * item.quantity)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="summary-divider"></div>
            <div class="summary-row">
                <span>Subtotal</span>
                <span>${formatPrice(totals.subtotal)}</span>
            </div>
            <div class="summary-row">
                <span>Shipping</span>
                <span>${formatPrice(totals.shipping)}</span>
            </div>
            <div class="summary-row">
                <span>Tax</span>
                <span>${formatPrice(totals.tax)}</span>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-row total">
                <span>Total</span>
                <span>${formatPrice(totals.total)}</span>
            </div>
        `;
    }
}

// Get shipping data
function getShippingData() {
    const form = document.querySelector('[data-step="1"] form');
    if (!form) return null;
    
    return {
        fullName: form.querySelector('input[name="fullName"]')?.value,
        email: form.querySelector('input[name="email"]')?.value,
        phone: form.querySelector('input[name="phone"]')?.value,
        address: form.querySelector('input[name="address"]')?.value,
        city: form.querySelector('input[name="city"]')?.value,
        state: form.querySelector('input[name="state"]')?.value,
        zip: form.querySelector('input[name="zip"]')?.value,
        country: form.querySelector('select[name="country"]')?.value
    };
}

// Get payment data
function getPaymentData() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
    
    if (paymentMethod === 'card') {
        const form = document.querySelector('[data-payment-method="card"]');
        return {
            method: 'card',
            cardName: form.querySelector('input[placeholder*="Name"]')?.value,
            cardNumber: form.querySelector('input[placeholder*="Card Number"]')?.value.slice(-4),
            expiry: form.querySelector('input[placeholder*="MM/YY"]')?.value
        };
    } else if (paymentMethod === 'paypal') {
        return { method: 'paypal' };
    } else if (paymentMethod === 'apple') {
        return { method: 'apple_pay' };
    }
}

// Complete order
function completeOrder() {
    const shippingData = getShippingData();
    const paymentData = getPaymentData();
    const cart = loadCart();
    const totals = getCartTotal();
    
    const orderData = {
        orderNumber: generateOrderNumber(),
        date: new Date().toLocaleDateString(),
        shipping: shippingData,
        payment: paymentData,
        items: cart,
        totals: totals
    };
    
    // Save order
    localStorage.setItem('lastOrder', JSON.stringify(orderData));
    localStorage.removeItem('cart');
    
    // Show success modal
    showOrderSuccessModal(orderData);
    updateCartCount();
}

// Generate unique order number
function generateOrderNumber() {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Show order success modal
function showOrderSuccessModal(orderData) {
    const modal = document.getElementById('orderSuccessModal');
    if (!modal) {
        createOrderSuccessModal();
    }
    
    const content = document.querySelector('#orderSuccessModal .modal-content');
    content.innerHTML = `
        <span class="close-btn">&times;</span>
        <div class="success-content">
            <div class="success-icon">✓</div>
            <h2>Order Confirmed!</h2>
            <p>Thank you for your purchase</p>
            
            <div class="order-details">
                <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
                <p><strong>Order Date:</strong> ${orderData.date}</p>
                <p><strong>Total Amount:</strong> ${formatPrice(orderData.totals.total)}</p>
            </div>
            
            <div class="shipping-details">
                <h4>Shipping To:</h4>
                <p>${orderData.shipping.fullName}</p>
                <p>${orderData.shipping.address}</p>
                <p>${orderData.shipping.city}, ${orderData.shipping.state} ${orderData.shipping.zip}</p>
            </div>
            
            <p class="confirmation-email">A confirmation email has been sent to <strong>${orderData.shipping.email}</strong></p>
            
            <div class="success-actions">
                <a href="index.html" class="btn btn-primary">Continue Shopping</a>
                <a href="javascript:void(0)" class="btn btn-secondary" onclick="location.href='javascript:history.back()'">Download Invoice</a>
            </div>
        </div>
    `;
    
    const closeBtn = content.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        hideModal('orderSuccessModal');
        window.location.href = 'index.html';
    });
    
    showModal('orderSuccessModal');
}

// Create order success modal if it doesn't exist
function createOrderSuccessModal() {
    if (document.getElementById('orderSuccessModal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'orderSuccessModal';
    modal.className = 'modal';
    modal.innerHTML = '<div class="modal-content"></div>';
    document.body.appendChild(modal);
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.body.id === 'checkout-page' || document.querySelector('.checkout-container')) {
            initCheckoutPage();
        }
    });
} else {
    if (document.body.id === 'checkout-page' || document.querySelector('.checkout-container')) {
        initCheckoutPage();
    }
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initCheckoutPage,
        showStep,
        completeOrder,
        generateOrderNumber
    };
}
