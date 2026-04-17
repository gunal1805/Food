// ================== API CONFIGURATION ==================
// Automatically detects deployment environment

// Production API URL (will be updated with your online server)
// After deployment, this will be replaced with your server URL
const PRODUCTION_API_URL = 'https://ggs-food-services.herokuapp.com/api';

// Development API URL (for localhost testing)
const DEVELOPMENT_API_URL = 'http://localhost:5000/api';

// Determine which environment we're in
let API_URL;

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    API_URL = DEVELOPMENT_API_URL;
    console.log('🏠 Running in Development (Local)');
} else {
    // Check if we're on the deployed server
    API_URL = `${window.location.protocol}//${window.location.host}/api`;
    console.log('🌐 Running in Production (Online)');
}

console.log(`🔗 API Base URL: ${API_URL}`);

// ================== FETCH PRODUCTS FROM BACKEND ==================

let products = [];
let productsWithPrices = [];

// Fetch products and their prices from backend API
async function loadProductsFromAPI() {
    try {
        console.log('📦 Loading products from API...');
        const response = await fetch(`${API_URL}/products`);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            productsWithPrices = data.products;
            // Keep original products for compatibility
            products = productsWithPrices.map(p => ({
                id: p.id,
                name: p.name,
                category: p.category,
                price: p.originalPrice,
                image: p.image,
                rating: p.rating,
                reviews: p.reviews,
                badge: p.badge,
                sizes: p.sizes,
                colors: p.colors,
                description: p.description
            }));
            
            console.log(`✅ Loaded ${products.length} products`);
            return products;
        } else {
            console.error('API returned error:', data.error);
            return [];
        }
    } catch (error) {
        console.error('❌ Error loading products:', error);
        // Fallback to static products if API fails
        return getFallbackProducts();
    }
}

// ================== FETCH SINGLE PRODUCT WITH PRICES ==================

async function getProductWithPrices(productId) {
    try {
        const response = await fetch(`${API_URL}/products/${productId}`);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            return data.product;
        } else {
            console.error('API returned error:', data.error);
            return null;
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

// ================== REDIRECT TO CHEAPEST PRODUCT ==================

function buyAtLowestPrice(productId) {
    try {
        // Redirect to API endpoint which will handle the redirect
        window.location.href = `${API_URL}/redirect/${productId}`;
    } catch (error) {
        console.error('Error redirecting:', error);
        alert('Unable to redirect. Please try again.');
    }
}

// ================== SHOW PRICE COMPARISON MODAL ==================

async function showPriceComparison(productId) {
    try {
        const productData = await getProductWithPrices(productId);
        
        if (!productData) {
            alert('Unable to load price information');
            return;
        }
        
        const { prices, cheapestOption } = productData;
        
        // Create modal content
        let html = `
            <div class="price-comparison-modal">
                <h2>Price Comparison</h2>
                <div class="price-options">
        `;
        
        if (prices && prices.length > 0) {
            prices.forEach(price => {
                const isCheapest = cheapestOption && price.source === cheapestOption.source;
                html += `
                    <div class="price-option ${isCheapest ? 'cheapest' : ''}">
                        <h3>${price.source}</h3>
                        <p class="price">₹${price.price.toLocaleString()}</p>
                        <p class="availability ${price.inStock ? 'in-stock' : 'out-of-stock'}">
                            ${price.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                        </p>
                        <a href="${price.url}" target="_blank" class="btn btn-primary">
                            View on ${price.source}
                        </a>
                    </div>
                `;
            });
        } else {
            html += '<p>Price information not available</p>';
        }
        
        html += '</div></div>';
        
        // Display modal
        showModal(html);
    } catch (error) {
        console.error('Error showing price comparison:', error);
    }
}

// ================== FALLBACK PRODUCTS (If API fails) ==================

function getFallbackProducts() {
    console.log('⚠️ Using fallback products (API unavailable)');
    return [
        {
            id: 1,
            name: "Premium Black Shirt",
            category: "shirts",
            price: 49.99,
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
            rating: 4.5,
            reviews: 120,
            badge: "NEW",
            sizes: ["XS", "S", "M", "L", "XL", "XXL"],
            colors: ["black", "white", "blue"],
            description: "Classic black shirt made from premium cotton fabric. Perfect for any occasion."
        },
        {
            id: 2,
            name: "Blue Denim Jeans",
            category: "pants",
            price: 79.99,
            image: "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=300&h=300&fit=crop",
            rating: 4.8,
            reviews: 250,
            badge: "SALE",
            sizes: ["30", "32", "34", "36", "38"],
            colors: ["blue", "black", "gray"],
            description: "Fashionable blue denim jeans with perfect fit and durability."
        }
    ];
}

// ================== INITIALIZE PRODUCTS ON PAGE LOAD ==================

document.addEventListener('DOMContentLoaded', async () => {
    // Load products from API or fallback
    await loadProductsFromAPI();
    
    // Initialize shop page if on shop page
    if (document.body.id === 'shop-page' || document.querySelector('.shop-container')) {
        if (typeof initShopPage === 'function') {
            initShopPage();
        }
    }
    
    // Initialize cart if on cart page
    if (document.querySelector('.cart-container')) {
        if (typeof initCartPage === 'function') {
            initCartPage();
        }
    }
});

// ================== EXPORT FOR OTHER MODULES ==================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadProductsFromAPI,
        getProductWithPrices,
        buyAtLowestPrice,
        showPriceComparison,
        API_URL
    };
}
