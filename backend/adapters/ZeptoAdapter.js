/**
 * ZeptoAdapter - Adapter for Zepto grocery delivery platform
 */

const BaseAdapter = require('./BaseAdapter');

class ZeptoAdapter extends BaseAdapter {
    constructor(apiKey = null) {
        super('Zepto', apiKey);
        this.baseURL = 'https://www.zepto.app/api';
        this.rateLimitDelay = 800;
    }

    async searchItems(query, location) {
        try {
            await this.waitForRateLimit();
            
            const mockResults = [
                {
                    id: `zepto_${Date.now()}_1`,
                    name: `${query} - Premium Selection`,
                    source: 'Zepto',
                    price: this.generateMockPrice(32, 185),
                    originalPrice: this.generateMockPrice(42, 235),
                    discount: Math.random() > 0.65 ? Math.floor(Math.random() * 22) : 0,
                    image: 'https://images.unsplash.com/photo-1578926314433-deded841c282?w=400&h=300&fit=crop&q=80',
                    description: `Zepto's premium ${query} selection. Fast delivery with best price guarantee and quality assurance.`,
                    ingredients: ['Best quality assured', 'Hygienically sourced', 'Fast delivery', 'Price guaranteed'],
                    rating: (4.5 + Math.random() * 0.3).toFixed(1),
                    deliveryTime: Math.floor(Math.random() * 9) + 7,
                    deliveryCharge: Math.random() > 0.8 ? 0 : Math.floor(Math.random() * 20 + 10),
                    isAvailable: true,
                    category: 'Groceries',
                    quantity: '500g / 1L',
                    expiryDays: 8
                },
                {
                    id: `zepto_${Date.now()}_2`,
                    name: `${query} - Express Fresh`,
                    source: 'Zepto',
                    price: this.generateMockPrice(35, 195),
                    originalPrice: this.generateMockPrice(45, 250),
                    discount: Math.random() > 0.7 ? Math.floor(Math.random() * 20) : 0,
                    image: 'https://images.unsplash.com/photo-1578926314433-deded841c282?w=400&h=300&fit=crop&q=85',
                    description: `Express fresh ${query} available with ultra-fast delivery. Premium quality guaranteed with Zepto's quality check.`,
                    ingredients: ['Fresh & fresh-checked', 'Zepto quality certified', 'Express delivery', 'Same-day guarantee'],
                    rating: (4.4 + Math.random() * 0.4).toFixed(1),
                    deliveryTime: Math.floor(Math.random() * 8) + 7,
                    deliveryCharge: Math.random() > 0.75 ? 0 : Math.floor(Math.random() * 25 + 10),
                    isAvailable: true,
                    category: 'Groceries',
                    quantity: '600g / 1.2L',
                    expiryDays: 9
                }
            ];

            return mockResults.map(item => this.formatResponse(item));
        } catch (error) {
            console.error('Zepto search error:', error);
            return [];
        }
    }

    async getItemDetails(itemId, location) {
        try {
            await this.waitForRateLimit();
            return {
                id: itemId,
                name: 'Grocery Item',
                price: this.generateMockPrice(28, 190),
                rating: 4.4,
                quantity: '500g / 1L',
                description: 'Premium grocery from Zepto'
            };
        } catch (error) {
            console.error('Zepto getItemDetails error:', error);
            return null;
        }
    }

    async calculateDelivery(location, distance) {
        try {
            // Zepto is also known for fast delivery (10-15 mins)
            const deliveryTime = Math.min(15, Math.ceil(distance * 1.8));
            const deliveryCharge = 0; // Free delivery in service areas
            
            return {
                deliveryTime,
                deliveryCost: deliveryCharge,
                isAvailable: true,
                estimatedArrival: new Date(Date.now() + deliveryTime * 60000).toISOString()
            };
        } catch (error) {
            console.error('Zepto calculateDelivery error:', error);
            return { isAvailable: false };
        }
    }

    async getOffers(location) {
        return [
            { title: '₹75 off on orders above ₹250', code: 'ZEPTO75', validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
            { title: 'Buy 1 Get 1 on select items', code: 'BOGO', validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
        ];
    }

    getRedirectURL(itemId, location) {
        return `https://www.zepto.app/search?q=${itemId}`;
    }

    generateMockPrice(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

module.exports = ZeptoAdapter;
