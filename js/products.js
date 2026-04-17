// Sample Product Data
const products = [
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
    },
    {
        id: 3,
        name: "Leather Jacket",
        category: "jackets",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=300&h=300&fit=crop",
        rating: 4.7,
        reviews: 180,
        badge: null,
        sizes: ["S", "M", "L", "XL"],
        colors: ["black", "brown"],
        description: "Premium leather jacket for a stylish and sophisticated look."
    },
    {
        id: 4,
        name: "Running Shoes",
        category: "shoes",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
        rating: 4.6,
        reviews: 310,
        badge: "POPULAR",
        sizes: ["6", "7", "8", "9", "10", "11", "12", "13"],
        colors: ["black", "white", "blue", "red"],
        description: "Comfortable and durable running shoes for athletic performance."
    },
    {
        id: 5,
        name: "Sunglasses",
        category: "accessories",
        price: 99.99,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop",
        rating: 4.4,
        reviews: 95,
        badge: null,
        sizes: ["One Size"],
        colors: ["black", "brown"],
        description: "Stylish sunglasses with UV protection and premium lenses."
    },
    {
        id: 6,
        name: "Luxury Watch",
        category: "watches",
        price: 249.99,
        image: "https://images.unsplash.com/photo-1523170335684-f1b5dbe3daa0?w=300&h=300&fit=crop",
        rating: 4.9,
        reviews: 420,
        badge: "BESTSELLER",
        sizes: ["One Size"],
        colors: ["silver", "gold"],
        description: "Elegant luxury watch with precision movement and sapphire crystal."
    },
    {
        id: 7,
        name: "Casual T-Shirt",
        category: "shirts",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop&q=80",
        rating: 4.3,
        reviews: 150,
        badge: null,
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        colors: ["white", "gray", "black"],
        description: "Comfortable and versatile casual t-shirt for everyday wear."
    },
    {
        id: 8,
        name: "Chinos Pants",
        category: "pants",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1473181112175-4a46f0307145?w=300&h=300&fit=crop",
        rating: 4.5,
        reviews: 200,
        badge: null,
        sizes: ["30", "32", "34", "36", "38"],
        colors: ["khaki", "navy", "gray"],
        description: "Stylish chinos pants perfect for casual and business settings."
    },
    {
        id: 9,
        name: "Wool Coat",
        category: "jackets",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1539533057440-7b8f11138482?w=300&h=300&fit=crop",
        rating: 4.8,
        reviews: 85,
        badge: "PREMIUM",
        sizes: ["S", "M", "L", "XL"],
        colors: ["black", "gray", "navy"],
        description: "Premium wool coat for warmth and style during cold seasons."
    },
    {
        id: 10,
        name: "Formal Shoes",
        category: "shoes",
        price: 159.99,
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=300&fit=crop",
        rating: 4.7,
        reviews: 140,
        badge: null,
        sizes: ["6", "7", "8", "9", "10", "11", "12"],
        colors: ["black", "brown"],
        description: "Elegant formal shoes suitable for business and formal occasions."
    },
    {
        id: 11,
        name: "Leather Belt",
        category: "accessories",
        price: 39.99,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
        rating: 4.4,
        reviews: 110,
        badge: null,
        sizes: ["30", "32", "34", "36", "38"],
        colors: ["black", "brown"],
        description: "Premium leather belt with elegant buckle design."
    },
    {
        id: 12,
        name: "Sports Watch",
        category: "watches",
        price: 179.99,
        image: "https://images.unsplash.com/photo-1617372237158-7aea39e4b1b9?w=300&h=300&fit=crop",
        rating: 4.6,
        reviews: 270,
        badge: "NEW",
        sizes: ["One Size"],
        colors: ["black", "white", "blue"],
        description: "Water-resistant sports watch perfect for fitness and outdoor activities."
    }
];

// Utility function to create star rating
function createStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Create product card HTML
function createProductCard(product) {
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; background-color: #f0f0f0;">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    ${createStars(product.rating)}
                    <span>(${product.reviews} reviews)</span>
                </div>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <div class="product-actions">
                    <button class="btn btn-primary add-to-cart">Add to Cart</button>
                    <button class="btn btn-outline view-details">View</button>
                </div>
            </div>
        </div>
    `;
}

// Add to cart functionality
function addToCart(productId, size = 'M', quantity = 1) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId && item.size === size);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            size: size,
            quantity: quantity
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Product added to cart!');
}

// Update cart count in navbar
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = count;
    });
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#c0392b'};
        color: white;
        padding: 15px 25px;
        border-radius: 4px;
        z-index: 3000;
        animation: slideIn 0.3s;
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Filter products
function filterProducts(filters) {
    return products.filter(product => {
        // Filter by category
        if (filters.categories && filters.categories.length > 0) {
            if (!filters.categories.includes(product.category)) {
                return false;
            }
        }
        
        // Filter by price
        if (filters.maxPrice && product.price > filters.maxPrice) {
            return false;
        }
        
        // Filter by size
        if (filters.sizes && filters.sizes.length > 0) {
            if (!filters.sizes.some(size => product.sizes.includes(size))) {
                return false;
            }
        }
        
        // Filter by color
        if (filters.colors && filters.colors.length > 0) {
            if (!filters.colors.some(color => product.colors.includes(color))) {
                return false;
            }
        }
        
        return true;
    });
}

// Sort products
function sortProducts(productList, sortType) {
    const sorted = [...productList];
    
    switch(sortType) {
        case 'price-low':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'popularity':
            sorted.sort((a, b) => b.reviews - a.reviews);
            break;
        case 'rating':
            sorted.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
        default:
            sorted.sort((a, b) => b.id - a.id);
    }
    
    return sorted;
}

// Export for other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        products,
        createProductCard,
        addToCart,
        updateCartCount,
        showNotification,
        filterProducts,
        sortProducts,
        createStars
    };
}
