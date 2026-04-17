/**
 * LocationService - Handles geolocation, geocoding, and distance calculations
 */

const axios = require('axios');

class LocationService {
    constructor() {
        this.googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY || null;
        this.cacheTimeout = 60000; // 1 minute
        this.locationCache = {};
    }

    /**
     * Get coordinates from address using Google Geocoding API
     * @param {string} address - Full address
     * @returns {Promise<{latitude, longitude, formatted_address}>}
     */
    async geocodeAddress(address) {
        try {
            if (!this.googleMapsApiKey) {
                // Return mock coordinates for testing
                console.warn('GOOGLE_MAPS_API_KEY not set, using mock location');
                return this.getMockLatLong(address);
            }

            // Check cache first
            const cacheKey = `geocode_${address}`;
            if (this.locationCache[cacheKey] && Date.now() - this.locationCache[cacheKey].timestamp < this.cacheTimeout) {
                return this.locationCache[cacheKey].data;
            }

            const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address: address,
                    key: this.googleMapsApiKey
                }
            });

            if (response.data.results && response.data.results.length > 0) {
                const location = response.data.results[0];
                const result = {
                    latitude: location.geometry.location.lat,
                    longitude: location.geometry.location.lng,
                    formatted_address: location.formatted_address,
                    components: location.address_components
                };

                // Cache the result
                this.locationCache[cacheKey] = {
                    data: result,
                    timestamp: Date.now()
                };

                return result;
            }

            throw new Error('No results found for address');
        } catch (error) {
            console.error('Geocoding error:', error);
            return this.getMockLatLong(address);
        }
    }

    /**
     * Get address from coordinates using Reverse Geocoding
     * @param {number} latitude
     * @param {number} longitude
     * @returns {Promise<{address, city, area, pincode}>}
     */
    async reverseGeocode(latitude, longitude) {
        try {
            if (!this.googleMapsApiKey) {
                console.warn('GOOGLE_MAPS_API_KEY not set, using mock location');
                return this.getMockAddress(latitude, longitude);
            }

            // Check cache first
            const cacheKey = `reverse_${latitude}_${longitude}`;
            if (this.locationCache[cacheKey] && Date.now() - this.locationCache[cacheKey].timestamp < this.cacheTimeout) {
                return this.locationCache[cacheKey].data;
            }

            const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    latlng: `${latitude},${longitude}`,
                    key: this.googleMapsApiKey
                }
            });

            if (response.data.results && response.data.results.length > 0) {
                const location = response.data.results[0];
                const result = this.parseAddressComponents(location);

                // Cache the result
                this.locationCache[cacheKey] = {
                    data: result,
                    timestamp: Date.now()
                };

                return result;
            }

            throw new Error('No results found for coordinates');
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            return this.getMockAddress(latitude, longitude);
        }
    }

    /**
     * Calculate distance between two points (Haversine formula)
     * @param {number} lat1 - User latitude
     * @param {number} lon1 - User longitude
     * @param {number} lat2 - Destination latitude
     * @param {number} lon2 - Destination longitude
     * @returns {number} Distance in kilometers
     */
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    /**
     * Get delivery time based on distance
     * @param {number} distance - Distance in km
     * @param {string} platform - Platform name (affects estimation)
     * @returns {number} Estimated delivery time in minutes
     */
    estimateDeliveryTime(distance, platform = 'default') {
        const baseTime = {
            'Swiggy': (d) => Math.ceil(d * 2) + 20,
            'Zomato': (d) => Math.ceil(d * 2.2) + 22,
            'Blinkit': (d) => Math.min(10, Math.ceil(d * 1.5)),
            'Zepto': (d) => Math.min(15, Math.ceil(d * 1.8))
        };

        const calculator = baseTime[platform] || baseTime.default || ((d) => Math.ceil(d * 2.5) + 25);
        return calculator(distance);
    }

    /**
     * Check if a location has service availability
     * @param {object} location - {latitude, longitude, city}
     * @returns {Promise<boolean>}
     */
    async isServiceAvailable(location) {
        // In production, check against service maps from each platform
        // For now, assume service is available if location is provided
        return location && (location.latitude || location.address);
    }

    /**
     * Get nearby locations (could be used for showing nearby restaurants/stores)
     * @param {number} latitude
     * @param {number} longitude
     * @param {number} radiusKm - Radius in km
     * @returns {Promise<Array>} Nearby locations
     */
    async getNearbyLocations(latitude, longitude, radiusKm = 5) {
        // This would integrate with Places API
        // For MVP, return mock data
        return [
            { name: 'Restaurant 1', latitude: latitude + 0.01, longitude: longitude + 0.01, distance: 0.5 },
            { name: 'Store 1', latitude: latitude - 0.01, longitude: longitude + 0.02, distance: 1.2 }
        ];
    }

    /**
     * Parse address components from geocoding response
     */
    parseAddressComponents(location) {
        const components = {};
        location.address_components.forEach(component => {
            const types = component.types;
            if (types.includes('locality')) components.city = component.long_name;
            if (types.includes('administrative_area_level_2')) components.area = component.long_name;
            if (types.includes('postal_code')) components.pincode = component.long_name;
            if (types.includes('country')) components.country = component.long_name;
        });

        return {
            address: location.formatted_address,
            city: components.city || 'Unknown',
            area: components.area || 'Unknown',
            pincode: components.pincode || 'Unknown',
            country: components.country || 'Unknown'
        };
    }

    /**
     * Convert degrees to radians
     */
    toRad(degrees) {
        return degrees * (Math.PI / 180);
    }

    /**
     * Mock data generators (for testing without API keys)
     */
    getMockLatLong(address) {
        // Generate consistent mock coordinates based on address
        const hash = address.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
        const latitude = 28.6 + ((hash % 100) / 1000);
        const longitude = 77.2 + ((hash % 100) / 1000);
        
        return {
            latitude,
            longitude,
            formatted_address: `${address}, India`,
            mock: true
        };
    }

    getMockAddress(latitude, longitude) {
        return {
            address: 'Mock Address, City',
            city: 'Delhi',
            area: 'Test Area',
            pincode: '110001',
            country: 'India',
            mock: true
        };
    }

    /**
     * Clear cache (useful for testing)
     */
    clearCache() {
        this.locationCache = {};
    }
}

module.exports = new LocationService();
