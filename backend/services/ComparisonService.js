/**
 * ComparisonService - Orchestrates price comparison across multiple platforms
 */

const SwigyAdapter = require('../adapters/SwigyAdapter');
const ZomatoAdapter = require('../adapters/ZomatoAdapter');
const BlinkitAdapter = require('../adapters/BlinkitAdapter');
const ZeptoAdapter = require('../adapters/ZeptoAdapter');
const LocationService = require('./LocationService');

class ComparisonService {
    constructor() {
        this.adapters = [
            new SwigyAdapter(process.env.SWIGGY_API_KEY || null),
            new ZomatoAdapter(process.env.ZOMATO_API_KEY || null),
            new BlinkitAdapter(process.env.BLINKIT_API_KEY || null),
            new ZeptoAdapter(process.env.ZEPTO_API_KEY || null)
        ];
        this.searchCache = {};
        this.cacheTimeout = 300000; // 5 minutes
    }

    /**
     * Search for items across all platforms
     * @param {string} query - Search term
     * @param {object} location - {latitude, longitude} or {address}
     * @returns {Promise<Array>} Sorted results with all platform options
     */
    async searchItems(query, location) {
        try {
            // Normalize location
            const normalizedLocation = await this.normalizeLocation(location);
            
            // Check cache
            const cacheKey = `search_${query}_${JSON.stringify(normalizedLocation)}`;
            if (this.searchCache[cacheKey] && Date.now() - this.searchCache[cacheKey].timestamp < this.cacheTimeout) {
                return this.searchCache[cacheKey].data;
            }

            // Search across all platforms in parallel
            const searchPromises = this.adapters.map(adapter =>
                adapter.searchItems(query, normalizedLocation)
                    .catch(error => {
                        console.error(`Error searching ${adapter.getName()}:`, error);
                        return [];
                    })
            );

            const results = await Promise.all(searchPromises);
            const allResults = results.flat();

            // Group results by item name and find best price
            const groupedResults = this.groupAndRank(allResults);

            // Cache results
            this.searchCache[cacheKey] = {
                data: groupedResults,
                timestamp: Date.now()
            };

            return groupedResults;
        } catch (error) {
            console.error('Search error:', error);
            return [];
        }
    }

    /**
     * Get comparison for a specific item across all platforms
     * @param {string} itemName - Item name
     * @param {object} location - Location object
     * @returns {Promise<Object>} Detailed comparison
     */
    async getDetailedComparison(itemName, location) {
        try {
            const normalizedLocation = await this.normalizeLocation(location);
            
            const results = await this.searchItems(itemName, normalizedLocation);
            
            if (results.length === 0) {
                return { error: 'No results found' };
            }

            // Group by platform
            const byPlatform = {};
            results.forEach(item => {
                if (!byPlatform[item.source]) {
                    byPlatform[item.source] = [];
                }
                byPlatform[item.source].push(item);
            });

            // Find best deals
            const cheapest = results[0];
            const fastest = results.reduce((prev, current) =>
                (current.deliveryTime || 999) < (prev.deliveryTime || 999) ? current : prev
            );

            return {
                itemName: itemName,
                totalResults: results.length,
                platforms: Object.keys(byPlatform).length,
                cheapest: cheapest,
                fastest: fastest,
                allResults: results,
                byPlatform: byPlatform,
                location: normalizedLocation
            };
        } catch (error) {
            console.error('Detailed comparison error:', error);
            return { error: error.message };
        }
    }

    /**
     * Get available offers from all platforms for a location
     * @param {object} location - Location object
     * @returns {Promise<Array>} All active offers
     */
    async getAllOffers(location) {
        try {
            const normalizedLocation = await this.normalizeLocation(location);

            const offerPromises = this.adapters.map(adapter =>
                adapter.getOffers(normalizedLocation)
                    .then(offers => ({
                        platform: adapter.getName(),
                        offers: offers
                    }))
                    .catch(error => {
                        console.error(`Error fetching offers from ${adapter.getName()}:`, error);
                        return { platform: adapter.getName(), offers: [] };
                    })
            );

            const allOffers = await Promise.all(offerPromises);
            return allOffers;
        } catch (error) {
            console.error('Get offers error:', error);
            return [];
        }
    }

    /**
     * Calculate optimal delivery based on location
     * @param {object} location - Location object
     * @returns {Promise<Array>} Delivery info from all platforms
     */
    async calculateDeliveryOptions(location) {
        try {
            const normalizedLocation = await this.normalizeLocation(location);

            const deliveryPromises = this.adapters.map(async adapter => {
                try {
                    const delivery = await adapter.calculateDelivery(
                        normalizedLocation,
                        0 // Distance will be calculated between user and store
                    );
                    return {
                        platform: adapter.getName(),
                        ...delivery
                    };
                } catch (error) {
                    console.error(`Error calculating delivery for ${adapter.getName()}:`, error);
                    return { platform: adapter.getName(), isAvailable: false };
                }
            });

            const deliveryOptions = await Promise.all(deliveryPromises);
            return deliveryOptions;
        } catch (error) {
            console.error('Calculate delivery error:', error);
            return [];
        }
    }

    /**
     * Normalize location from various formats
     * @param {object} location - Can be {latitude, longitude} or {address}
     * @returns {Promise<object>} Normalized location
     */
    async normalizeLocation(location) {
        try {
            if (!location) {
                throw new Error('Location is required');
            }

            // If address is provided, geocode it
            if (location.address && (!location.latitude || !location.longitude)) {
                const geocoded = await LocationService.geocodeAddress(location.address);
                return {
                    latitude: geocoded.latitude,
                    longitude: geocoded.longitude,
                    address: geocoded.formatted_address,
                    original_address: location.address
                };
            }

            // If coordinates are provided, optionally reverse geocode
            if (location.latitude && location.longitude) {
                const address = await LocationService.reverseGeocode(
                    location.latitude,
                    location.longitude
                );
                return {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    city: address.city,
                    area: address.area,
                    address: address.address
                };
            }

            throw new Error('Location must have either address or latitude/longitude');
        } catch (error) {
            console.error('Location normalization error:', error);
            // Return a default location
            return { latitude: 28.6139, longitude: 77.2090, city: 'Delhi' };
        }
    }

    /**
     * Group results by item name and rank by price
     */
    groupAndRank(results) {
        // Sort by price (cheapest first)
        const sorted = results.sort((a, b) => {
            if (a.price !== b.price) {
                return a.price - b.price;
            }
            // If price is same, prioritize by delivery time
            return (a.deliveryTime || 999) - (b.deliveryTime || 999);
        });

        // Add ranking metadata
        return sorted.map((item, index) => ({
            ...item,
            rank: index + 1,
            savings: sorted[0].price ? item.price - sorted[0].price : 0,
            isCheapest: index === 0,
            isFastest: results.reduce((min, current) =>
                (current.deliveryTime || 999) < (min.deliveryTime || 999) ? current : min
            ) === item
        }));
    }

    /**
     * Get all available adapters (platforms)
     * @returns {Array} List of platforms
     */
    getAvailablePlatforms() {
        return this.adapters.map(adapter => ({
            name: adapter.getName(),
            healthy: adapter.isHealthy()
        }));
    }

    /**
     * Clear search cache
     */
    clearCache() {
        this.searchCache = {};
    }
}

module.exports = new ComparisonService();
