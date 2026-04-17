/**
 * BlinkitAdapter - Adapter for Blinkit grocery delivery platform
 */

const BaseAdapter = require('./BaseAdapter');

class BlinkitAdapter extends BaseAdapter {
    constructor(apiKey = null) {
        super('Blinkit', apiKey);
        this.baseURL = 'https://www.blinkit.com/api';
        this.rateLimitDelay = 800;
    }

    async searchItems(query, location) {
        try {
            await this.waitForRateLimit();
            
            const mockResults = [
                {
                    id: `blinkit_${Date.now()}_1`,
                    name: `${query} - Premium Grade Fresh`,
                    source: 'Blinkit',
                    price: this.generateMockPrice(35, 180),
                    originalPrice: this.generateMockPrice(45, 220),
                    discount: Math.random() > 0.6 ? Math.floor(Math.random() * 25) : 0,
                    image: 'https://images.unsplash.com/photo-1578926314433-deded841c282?w=400&h=300&fit=crop&q=80',
                    description: `Fresh, premium quality ${query}. Sourced directly from verified suppliers. Perfect for your daily needs.`,
                    ingredients: ['100% Natural', 'No preservatives', 'Fresh & organic', 'Hygienically packed'],
                    rating: (4.4 + Math.random() * 0.4).toFixed(1),
                    deliveryTime: Math.floor(Math.random() * 8) + 9,
                    deliveryCharge: Math.random() > 0.8 ? 0 : Math.floor(Math.random() * 25 + 10),
                    isAvailable: true,
                    category: 'Groceries',
                    quantity: '500g / 1L',
                    expiryDays: 7
                },
                {
                    id: `blinkit_${Date.now()}_2`,
                    name: `${query} - Organic Select`,
                    source: 'Blinkit',
                    price: this.generateMockPrice(40, 200),
                    originalPrice: this.generateMockPrice(50, 250),
                    discount: Math.random() > 0.7 ? Math.floor(Math.random() * 20) : 0,
                    image: 'https://images.unsplash.com/photo-1578926314433-deded841c282?w=400&h=300&fit=crop&q=85',
                    description: `Organic ${query} certified by trusted suppliers. High quality and nutritious choice for health-conscious families.`,
                    ingredients: ['100% Organic certified', 'No chemicals', 'Sustainably sourced', 'Best quality'],
                    rating: (4.3 + Math.random() * 0.5).toFixed(1),
                    deliveryTime: Math.floor(Math.random() * 9) + 8,
                    deliveryCharge: Math.random() > 0.75 ? 0 : Math.floor(Math.random() * 30 + 10),
                    isAvailable: true,
                    category: 'Groceries',
                    quantity: '600g / 1.2L',
                    expiryDays: 10
                }
            ];

            return mockResults.map(item => this.formatResponse(item));
        } catch (error) {
            console.error('Blinkit search error:', error);
            return [];
        }
    }

    async getItemDetails(itemId, location) {
        try {
            await this.waitForRateLimit();
            return {
                id: itemId,
                name: 'Grocery Item',
                price: this.generateMockPrice(30, 200),
                rating: 4.3,
                quantity: '500g / 1L',
                description: 'Fresh quality item from Blinkit'
            };
        } catch (error) {
            console.error('Blinkit getItemDetails error:', error);
            return null;
        }
    }

    async calculateDelivery(location, distance) {
        try {
            // Blinkit is known for ultra-fast delivery (10 mins)
            const deliveryTime = Math.min(10, Math.ceil(distance * 1.5));
            const deliveryCharge = 0; // Free delivery in service areas
            
            return {
                deliveryTime,
                deliveryCost: deliveryCharge,
                isAvailable: true,
                estimatedArrival: new Date(Date.now() + deliveryTime * 60000).toISOString()
            };
        } catch (error) {
            console.error('Blinkit calculateDelivery error:', error);
            return { isAvailable: false };
        }
    }

    async getOffers(location) {
        return [
            { title: '₹50 off on first order', code: 'FIRST50', validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
            { title: 'Free delivery on orders above ₹150', code: 'FREEDEL150', validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) }
        ];
    }

    getRedirectURL(itemId, location) {
        return `https://www.blinkit.com/search?q=${itemId}`;
    }

    generateMockPrice(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

module.exports = BlinkitAdapter;
