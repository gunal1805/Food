/**
 * searchRoutes.js - REST API endpoints for food price comparison
 */

const express = require('express');
const ComparisonService = require('../services/ComparisonService');
const LocationService = require('../services/LocationService');

const router = express.Router();

/**
 * GET /api/search
 * Search for food items across all platforms
 * Query params:
 *   - query: Search term (required)
 *   - latitude: User latitude (optional)
 *   - longitude: User longitude (optional)
 *   - address: User address (optional)
 */
router.get('/search', async (req, res) => {
    try {
        const { query, latitude, longitude, address } = req.query;

        if (!query || query.trim() === '') {
            return res.status(400).json({ error: 'Search query is required' });
        }

        // Build location object
        const location = {};
        if (latitude && longitude) {
            location.latitude = parseFloat(latitude);
            location.longitude = parseFloat(longitude);
        } else if (address) {
            location.address = address;
        } else {
            // Default location (Delhi)
            location.latitude = 28.6139;
            location.longitude = 77.2090;
        }

        const results = await ComparisonService.searchItems(query, location);

        res.json({
            success: true,
            query: query,
            results: results,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/compare/:itemName
 * Get detailed comparison for a specific item
 */
router.get('/compare/:itemName', async (req, res) => {
    try {
        const { itemName } = req.params;
        const { latitude, longitude, address } = req.query;

        const location = {};
        if (latitude && longitude) {
            location.latitude = parseFloat(latitude);
            location.longitude = parseFloat(longitude);
        } else if (address) {
            location.address = address;
        } else {
            location.latitude = 28.6139;
            location.longitude = 77.2090;
        }

        const comparison = await ComparisonService.getDetailedComparison(itemName, location);

        res.json({
            success: true,
            comparison: comparison,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Comparison error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/offers
 * Get current offers from all platforms
 */
router.get('/offers', async (req, res) => {
    try {
        const { latitude, longitude, address } = req.query;

        const location = {};
        if (latitude && longitude) {
            location.latitude = parseFloat(latitude);
            location.longitude = parseFloat(longitude);
        } else if (address) {
            location.address = address;
        } else {
            location.latitude = 28.6139;
            location.longitude = 77.2090;
        }

        const offers = await ComparisonService.getAllOffers(location);

        res.json({
            success: true,
            offers: offers,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Offers error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/delivery
 * Get delivery options for a location
 */
router.get('/delivery', async (req, res) => {
    try {
        const { latitude, longitude, address } = req.query;

        const location = {};
        if (latitude && longitude) {
            location.latitude = parseFloat(latitude);
            location.longitude = parseFloat(longitude);
        } else if (address) {
            location.address = address;
        } else {
            location.latitude = 28.6139;
            location.longitude = 77.2090;
        }

        const deliveryOptions = await ComparisonService.calculateDeliveryOptions(location);

        res.json({
            success: true,
            deliveryOptions: deliveryOptions,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Delivery error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/geocode
 * Geocode an address to coordinates
 */
router.get('/geocode', async (req, res) => {
    try {
        const { address } = req.query;

        if (!address) {
            return res.status(400).json({ error: 'Address is required' });
        }

        const result = await LocationService.geocodeAddress(address);

        res.json({
            success: true,
            location: result,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Geocoding error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/reverse-geocode
 * Reverse geocode coordinates to address
 */
router.get('/reverse-geocode', async (req, res) => {
    try {
        const { latitude, longitude } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        const result = await LocationService.reverseGeocode(
            parseFloat(latitude),
            parseFloat(longitude)
        );

        res.json({
            success: true,
            address: result,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/distance
 * Calculate distance between two points
 */
router.get('/distance', async (req, res) => {
    try {
        const { lat1, lon1, lat2, lon2 } = req.query;

        if (!lat1 || !lon1 || !lat2 || !lon2) {
            return res.status(400).json({ error: 'All coordinates are required' });
        }

        const distance = LocationService.calculateDistance(
            parseFloat(lat1),
            parseFloat(lon1),
            parseFloat(lat2),
            parseFloat(lon2)
        );

        res.json({
            success: true,
            distance: distance.toFixed(2),
            unit: 'km',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Distance calculation error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/platforms
 * Get list of all available platforms
 */
router.get('/platforms', async (req, res) => {
    try {
        const platforms = ComparisonService.getAvailablePlatforms();

        res.json({
            success: true,
            platforms: platforms,
            total: platforms.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Platforms error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/redirect
 * Generate redirect URL for an item
 */
router.post('/redirect', async (req, res) => {
    try {
        const { itemId, platform, latitude, longitude } = req.body;

        if (!itemId || !platform) {
            return res.status(400).json({ error: 'itemId and platform are required' });
        }

        const location = { latitude: latitude || 28.6139, longitude: longitude || 77.2090 };
        const adapters = ComparisonService.adapters;
        const adapter = adapters.find(a => a.getName() === platform);

        if (!adapter) {
            return res.status(400).json({ error: 'Platform not found' });
        }

        const redirectURL = adapter.getRedirectURL(itemId, location);

        res.json({
            success: true,
            platform: platform,
            redirectURL: redirectURL,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Redirect error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
