// GGS Boys Backend Server
// Node.js + Express for handling product prices and redirects + Food Comparison

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Import food comparison services and routes
const searchRoutes = require('./routes/searchRoutes');
const mlRoutes = require('./routes/mlRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ==================== ROOT ROUTE (Before Static) ====================
// Serve the landing page when accessing root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../ggs-landing.html'));
});

// ==================== SERVE STATIC FILES ====================
// Serve frontend files (HTML, CSS, JS, images) from parent directory
const staticPath = path.join(__dirname, '../');
app.use(express.static(staticPath));

// ==================== FOOD PRICE COMPARISON ROUTES ====================
// Routes for food delivery and grocery comparison
app.use('/api', searchRoutes);

// ==================== MACHINE LEARNING ROUTES ====================
// ML-powered recommendations, sorting, price prediction, and insights
app.use('/api/ml', mlRoutes);

// ==================== PRODUCT DATABASE ====================
// In production, use MongoDB. For now, use JSON file
const productsFile = path.join(__dirname, 'data/products.json');

// Load products from file
function loadProducts() {
    try {
        if (fs.existsSync(productsFile)) {
            const data = fs.readFileSync(productsFile, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
    return [];
}

// Save products to file
function saveProducts(products) {
    try {
        const dir = path.dirname(productsFile);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
    } catch (error) {
        console.error('Error saving products:', error);
    }
}

// ==================== AMAZON API INTEGRATION ====================
async function getAmazonPrice(productName) {
    try {
        // TODO: Implement Amazon Product Advertising API v5
        // For now, return mock data
        return {
            source: 'Amazon',
            price: generateMockPrice(49, 299),
            url: `https://www.amazon.in/s?k=${encodeURIComponent(productName)}`,
            inStock: true,
            lastUpdated: new Date().toISOString()
        };
    } catch (error) {
        console.error('Amazon API Error:', error);
        return null;
    }
}

// ==================== FLIPKART API INTEGRATION ====================
async function getFlipkartPrice(productName) {
    try {
        // TODO: Implement Flipkart Affiliate API
        // For now, return mock data
        return {
            source: 'Flipkart',
            price: generateMockPrice(49, 299),
            url: `https://www.flipkart.com/search?q=${encodeURIComponent(productName)}`,
            inStock: true,
            lastUpdated: new Date().toISOString()
        };
    } catch (error) {
        console.error('Flipkart API Error:', error);
        return null;
    }
}

// ==================== UTILITY FUNCTIONS ====================
function generateMockPrice(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Find cheapest product
function findCheapestProduct(prices) {
    return prices
        .filter(p => p !== null && p.price)
        .sort((a, b) => a.price - b.price)[0];
}

// ==================== API ENDPOINTS ====================

// GET: All products with current prices
app.get('/api/products', async (req, res) => {
    try {
        const products = loadProducts();
        
        // Fetch prices for each product
        const productsWithPrices = await Promise.all(
            products.map(async (product) => {
                const [amazonPrice, flipkartPrice] = await Promise.all([
                    getAmazonPrice(product.name),
                    getFlipkartPrice(product.name)
                ]);

                const prices = [amazonPrice, flipkartPrice].filter(p => p !== null);
                const cheapest = findCheapestProduct(prices);

                return {
                    ...product,
                    prices,
                    cheapestOption: cheapest,
                    originalPrice: product.price
                };
            })
        );

        res.json({
            success: true,
            count: productsWithPrices.length,
            products: productsWithPrices
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET: Single product by ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const products = loadProducts();
        const product = products.find(p => p.id === parseInt(req.params.id));

        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        const [amazonPrice, flipkartPrice] = await Promise.all([
            getAmazonPrice(product.name),
            getFlipkartPrice(product.name)
        ]);

        const prices = [amazonPrice, flipkartPrice].filter(p => p !== null);
        const cheapest = findCheapestProduct(prices);

        res.json({
            success: true,
            product: {
                ...product,
                prices,
                cheapestOption: cheapest,
                originalPrice: product.price
            }
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET: Redirect to cheapest product
app.get('/api/redirect/:id', async (req, res) => {
    try {
        const products = loadProducts();
        const product = products.find(p => p.id === parseInt(req.params.id));

        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        const [amazonPrice, flipkartPrice] = await Promise.all([
            getAmazonPrice(product.name),
            getFlipkartPrice(product.name)
        ]);

        const prices = [amazonPrice, flipkartPrice].filter(p => p !== null);
        const cheapest = findCheapestProduct(prices);

        if (cheapest) {
            // Log redirect for analytics
            logRedirect({
                productId: product.id,
                productName: product.name,
                redirectTo: cheapest.source,
                price: cheapest.price,
                timestamp: new Date().toISOString()
            });

            // Redirect to the cheapest option
            return res.redirect(cheapest.url);
        }

        res.status(404).json({ success: false, error: 'No prices found' });
    } catch (error) {
        console.error('Error redirecting:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET: Price history for a product
app.get('/api/price-history/:id', (req, res) => {
    try {
        const historyFile = path.join(__dirname, `data/price-history-${req.params.id}.json`);
        
        if (fs.existsSync(historyFile)) {
            const history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
            res.json({ success: true, history });
        } else {
            res.json({ success: true, history: [] });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET: Analytics/Redirects
app.get('/api/analytics/redirects', (req, res) => {
    try {
        const analyticsFile = path.join(__dirname, 'data/analytics.json');
        
        if (fs.existsSync(analyticsFile)) {
            const analytics = JSON.parse(fs.readFileSync(analyticsFile, 'utf8'));
            res.json({ success: true, analytics });
        } else {
            res.json({ success: true, analytics: [] });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST: Add/Update product
app.post('/api/products', (req, res) => {
    try {
        const { name, category, price, description } = req.body;

        if (!name || !category || !price) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        const products = loadProducts();
        const newProduct = {
            id: Math.max(...products.map(p => p.id), 0) + 1,
            name,
            category,
            price,
            description,
            image: 'https://via.placeholder.com/300x300?text=' + encodeURIComponent(name),
            rating: 4.5,
            reviews: 0,
            badge: 'NEW',
            sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            colors: ['black', 'white', 'blue'],
            createdAt: new Date().toISOString()
        };

        products.push(newProduct);
        saveProducts(products);

        res.json({ success: true, product: newProduct });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== UTILITY FUNCTIONS ====================
function logRedirect(redirectData) {
    try {
        const analyticsFile = path.join(__dirname, 'data/analytics.json');
        let analytics = [];

        if (fs.existsSync(analyticsFile)) {
            analytics = JSON.parse(fs.readFileSync(analyticsFile, 'utf8'));
        }

        analytics.push(redirectData);
        
        // Keep only last 1000 records
        if (analytics.length > 1000) {
            analytics = analytics.slice(-1000);
        }

        fs.writeFileSync(analyticsFile, JSON.stringify(analytics, null, 2));
    } catch (error) {
        console.error('Error logging redirect:', error);
    }
}

// Fallback for any unmatched routes - serve landing page  
app.use((req, res) => {
    // If it's not an API call and file wasn't found, serve landing page
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '../ggs-landing.html'), (err) => {
            if (err) {
                res.status(404).json({ error: 'File not found' });
            }
        });
    } else {
        res.status(404).json({ error: 'API endpoint not found' });
    }
});

// ==================== ERROR HANDLING ====================
app.use((error, req, res, next) => {
    console.error('Unhandled Error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ success: true, message: 'Server is running' });
});

// ==================== START SERVER ====================
const open = require('open');
app.listen(PORT, async () => {
    console.log(`🚀 GGS Boys Backend Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API Base URL: ${process.env.API_URL || `http://localhost:${PORT}`}`);
    
    // Auto-open browser after server starts (only on local development)
    if (process.env.NODE_ENV !== 'production') {
        const url = `file://${path.resolve(__dirname, '../ggs-landing.html')}`;
        console.log(`🌐 Opening GGS Food Services in browser...`);
        try {
            await open(url);
        } catch (err) {
            console.log('📌 Please open ggs-landing.html manually in your browser');
        }
    } else {
        console.log(`✅ Server is ready. Access at port ${PORT}`);
    }
});

module.exports = app;
