/**
 * ZomatoAdapter - Adapter for Zomato food delivery platform
 */

const BaseAdapter = require('./BaseAdapter');

class ZomatoAdapter extends BaseAdapter {
    constructor(apiKey = null) {
        super('Zomato', apiKey);
        this.baseURL = 'https://www.zomato.com/api';
        this.rateLimitDelay = 1000;
    }

    async searchItems(query, location) {
        try {
            await this.waitForRateLimit();
            
            const mockResults = [
                {
                    id: `zomato_${Date.now()}_1`,
                    name: `${query} Premium from Restaurant Z`,
                    source: 'Zomato',
                    price: this.generateMockPrice(130, 260),
                    originalPrice: this.generateMockPrice(160, 330),
                    discount: Math.random() > 0.5 ? Math.floor(Math.random() * 28) : 0,
                    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&q=80',
                    description: `Professional-made ${query} with Zomato quality standards. Made fresh to order.`,
                    ingredients: ['Premium ingredients', 'Fresh spices', 'Quality oil', 'Carefully selected vegetables', 'No MSG'],
                    rating: (4.3 + Math.random()).toFixed(1),
                    deliveryTime: Math.floor(Math.random() * 12) + 26,
                    deliveryCharge: Math.random() > 0.5 ? 0 : Math.floor(Math.random() * 45 + 20),
                    isAvailable: true,
                    restaurantName: 'Restaurant Z',
                    cuisine: 'Multi-cuisine',
                    preparationTime: 18,
                    serves: '1-2 people'
                },
                {
                    id: `zomato_${Date.now()}_2`,
                    name: `${query} Classic from Gourmet Kitchen`,
                    source: 'Zomato',
                    price: this.generateMockPrice(115, 240),
                    originalPrice: this.generateMockPrice(145, 310),
                    discount: Math.random() > 0.5 ? Math.floor(Math.random() * 25) : 0,
                    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&q=85',
                    description: `Classic ${query} recipe with traditional preparation methods and fresh, locally-sourced ingredients.`,
                    ingredients: ['Local vegetables', 'Traditional spices', 'Pure butter', 'Aromatic herbs', 'Farm-fresh produce'],
                    rating: (4.1 + Math.random()).toFixed(1),
                    deliveryTime: Math.floor(Math.random() * 10) + 28,
                    deliveryCharge: Math.random() > 0.5 ? 0 : Math.floor(Math.random() * 40 + 15),
                    isAvailable: true,
                    restaurantName: 'Gourmet Kitchen',
                    cuisine: 'Indian Fusion',
                    preparationTime: 20,
                    serves: '1 person'
                }
            ];

            return mockResults.map(item => this.formatResponse(item));
        } catch (error) {
            console.error('Zomato search error:', error);
            return [];
        }
    }

    async getItemDetails(itemId, location) {
        try {
            await this.waitForRateLimit();
            return {
                id: itemId,
                name: 'Food Item',
                price: this.generateMockPrice(85, 420),
                rating: 4.1,
                reviews: Math.floor(Math.random() * 800),
                description: 'Food from Zomato restaurant'
            };
        } catch (error) {
            console.error('Zomato getItemDetails error:', error);
            return null;
        }
    }

    async calculateDelivery(location, distance) {
        try {
            const deliveryTime = Math.ceil(distance * 2.2) + Math.floor(Math.random() * 8);
            const deliveryCharge = distance > 2.5 ? Math.ceil(distance * 12) : 0;
            
            return {
                deliveryTime,
                deliveryCost: deliveryCharge,
                isAvailable: true,
                estimatedArrival: new Date(Date.now() + deliveryTime * 60000).toISOString()
            };
        } catch (error) {
            console.error('Zomato calculateDelivery error:', error);
            return { isAvailable: false };
        }
    }

    async getOffers(location) {
        return [
            { title: '₹100 off on orders above ₹300', code: 'ZOMATO100', validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
            { title: 'Pro membership - Free delivery', code: 'PROMEMBER', validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }
        ];
    }

    getRedirectURL(itemId, location) {
        return `https://www.zomato.com/restaurants/${itemId}`;
    }

    generateMockPrice(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

module.exports = ZomatoAdapter;
