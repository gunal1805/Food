/**
 * SwigyAdapter - Adapter for Swiggy food delivery platform
 * Handles searching restaurants, items, and delivery information
 */

const BaseAdapter = require('./BaseAdapter');
const axios = require('axios');

class SwigyAdapter extends BaseAdapter {
    constructor(apiKey = null) {
        super('Swiggy', apiKey);
        this.baseURL = 'https://www.swiggy.com/dapi'; // Real API endpoint
        this.rateLimitDelay = 1000; // Swiggy rate limiting
    }

    async searchItems(query, location) {
        try {
            await this.waitForRateLimit();
            
            // Since Swiggy doesn't have a public API, we'll use mock data
            // In production, integrate with Swiggy's restaurants API
            const mockResults = [
                {
                    id: `swiggy_${Date.now()}_1`,
                    name: `${query} Deluxe from XYZ Restaurant`,
                    source: 'Swiggy',
                    price: this.generateMockPrice(120, 250),
                    originalPrice: this.generateMockPrice(150, 320),
                    discount: Math.random() > 0.5 ? Math.floor(Math.random() * 25) : 0,
                    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&q=80',
                    description: `Authentic ${query} prepared with premium ingredients and traditional spices.`,
                    ingredients: ['Premium quality baseline', 'Fresh herbs & spices', 'No artificial additives', 'Organic oil', 'Hand-picked ingredients'],
                    rating: (4.2 + Math.random()).toFixed(1),
                    deliveryTime: Math.floor(Math.random() * 10) + 28,
                    deliveryCharge: Math.random() > 0.5 ? 0 : Math.floor(Math.random() * 40 + 20),
                    isAvailable: true,
                    restaurantName: 'XYZ Restaurant',
                    cuisine: 'North Indian',
                    preparationTime: 20,
                    serves: '1-2 people'
                },
                {
                    id: `swiggy_${Date.now()}_2`,
                    name: `${query} Special from ABC Cafe`,
                    source: 'Swiggy',
                    price: this.generateMockPrice(110, 230),
                    originalPrice: this.generateMockPrice(140, 300),
                    discount: Math.random() > 0.5 ? Math.floor(Math.random() * 30) : 0,
                    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&q=85',
                    description: `Delicious homemade-style ${query} with authentic flavors and fresh ingredients sourced locally.`,
                    ingredients: ['Fresh vegetables', 'Natural spices blend', 'Coconut milk', 'Garlic & ginger paste', 'Sesame oil'],
                    rating: (4.0 + Math.random()).toFixed(1),
                    deliveryTime: Math.floor(Math.random() * 12) + 25,
                    deliveryCharge: Math.random() > 0.5 ? 0 : Math.floor(Math.random() * 35 + 15),
                    isAvailable: true,
                    restaurantName: 'ABC Cafe',
                    cuisine: 'South Indian',
                    preparationTime: 22,
                    serves: '1 person'
                }
            ];

            return mockResults.map(item => this.formatResponse(item));
        } catch (error) {
            console.error('Swiggy search error:', error);
            return [];
        }
    }

    async getItemDetails(itemId, location) {
        try {
            await this.waitForRateLimit();
            
            return {
                id: itemId,
                name: 'Food Item Name',
                price: this.generateMockPrice(80, 400),
                rating: 4.2,
                reviews: Math.floor(Math.random() * 1000),
                description: 'Delicious food item from Swiggy',
                restaurantName: 'Restaurant Name',
                cuisine: 'Cuisine Type',
                spiceLevel: 'Medium',
                vegetarian: Math.random() > 0.5,
                prepTime: Math.floor(Math.random() * 30) + 10
            };
        } catch (error) {
            console.error('Swiggy getItemDetails error:', error);
            return null;
        }
    }

    async calculateDelivery(location, distance) {
        try {
            const deliveryTime = Math.ceil(distance * 2) + Math.floor(Math.random() * 10);
            const deliveryCharge = distance > 3 ? Math.ceil(distance * 10) : 0;
            
            return {
                deliveryTime,
                deliveryCost: deliveryCharge,
                isAvailable: true,
                estimatedArrival: new Date(Date.now() + deliveryTime * 60000).toISOString()
            };
        } catch (error) {
            console.error('Swiggy calculateDelivery error:', error);
            return { isAvailable: false };
        }
    }

    async getOffers(location) {
        return [
            { title: '30% off on first order', code: 'FIRST30', validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
            { title: 'Free delivery on orders above ₹200', code: 'FREEDEL', validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
        ];
    }

    getRedirectURL(itemId, location) {
        // In production, generate proper Swiggy deep link
        return `https://www.swiggy.com/restaurants/${itemId}`;
    }

    generateMockPrice(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

module.exports = SwigyAdapter;
