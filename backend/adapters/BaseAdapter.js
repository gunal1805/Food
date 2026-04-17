/**
 * BaseAdapter - Base class for all food delivery/grocery platform adapters
 * Provides common interface for all platform integrations
 */

class BaseAdapter {
    constructor(name, apiKey = null) {
        this.name = name;
        this.apiKey = apiKey;
        this.baseURL = '';
        this.requestCount = 0;
        this.lastRequestTime = null;
        this.rateLimitDelay = 500; // ms between requests
    }

    /**
     * Search for food items
     * @param {string} query - Search term
     * @param {object} location - {latitude, longitude, city, area}
     * @returns {Promise<Array>} Array of items with prices
     */
    async searchItems(query, location) {
        throw new Error('searchItems() must be implemented by subclass');
    }

    /**
     * Get item details including availability
     * @param {string} itemId - Item ID from the platform
     * @param {object} location - Location object
     * @returns {Promise<Object>} Item details
     */
    async getItemDetails(itemId, location) {
        throw new Error('getItemDetails() must be implemented by subclass');
    }

    /**
     * Calculate delivery time and charges
     * @param {object} location - {latitude, longitude, city}
     * @param {number} distance - Distance in km
     * @returns {Promise<Object>} {deliveryTime, deliveryCost, isAvailable}
     */
    async calculateDelivery(location, distance) {
        throw new Error('calculateDelivery() must be implemented by subclass');
    }

    /**
     * Get current offers/deals
     * @param {object} location - Location object
     * @returns {Promise<Array>} Array of active offers
     */
    async getOffers(location) {
        throw new Error('getOffers() must be implemented by subclass');
    }

    /**
     * Get redirect URL for the item
     * @param {string} itemId - Item ID
     * @param {object} location - Location object
     * @returns {string} URL to redirect to
     */
    getRedirectURL(itemId, location) {
        throw new Error('getRedirectURL() must be implemented by subclass');
    }

    /**
     * Check API availability and health
     * @returns {Promise<boolean>}
     */
    async isHealthy() {
        return this.apiKey !== null;
    }

    /**
     * Get platform name
     * @returns {string}
     */
    getName() {
        return this.name;
    }

    /**
     * Rate limit handler - ensures we don't exceed API limits
     */
    async waitForRateLimit() {
        if (this.lastRequestTime) {
            const elapsed = Date.now() - this.lastRequestTime;
            if (elapsed < this.rateLimitDelay) {
                await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay - elapsed));
            }
        }
        this.lastRequestTime = Date.now();
        this.requestCount++;
    }

    /**
     * Format response in standardized format
     */
    formatResponse(item) {
        return {
            id: item.id || null,
            name: item.name || '',
            source: this.name,
            price: item.price || null,
            originalPrice: item.originalPrice || null,
            discount: item.discount || 0,
            image: item.image || null,
            rating: item.rating || null,
            deliveryTime: item.deliveryTime || null,
            deliveryCharge: item.deliveryCharge || 0,
            isAvailable: item.isAvailable !== false,
            redirectURL: item.redirectURL || null,
            lastUpdated: new Date().toISOString()
        };
    }
}

module.exports = BaseAdapter;
