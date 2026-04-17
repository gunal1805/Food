/**
 * Location Service - Frontend module for geolocation and location management
 * Handles user location input, GPS requests, and location caching
 */

class LocationService {
    constructor() {
        this.currentLocation = null;
        this.locationCache = null;
        this.cacheExpiry = 3600000; // 1 hour
        this.lastLocationTime = null;
        this.locationInput = document.getElementById('locationInput');
        this.geolocationBtn = document.getElementById('geolocationBtn');
        this.currentLocationDisplay = document.getElementById('currentLocation');
        this.locationError = document.getElementById('locationError');
        this.locationLoading = document.getElementById('locationLoading');
        this.changeLocationBtn = document.getElementById('changeLocationBtn');
        this.locationSuggestions = document.getElementById('locationSuggestions');

        this.init();
    }

    init() {
        // Event listeners
        this.geolocationBtn.addEventListener('click', () => this.requestGeolocation());
        this.changeLocationBtn.addEventListener('click', () => this.resetLocation());
        this.locationInput.addEventListener('input', (e) => this.handleLocationInput(e));
        this.locationInput.addEventListener('blur', () => this.hideLocationSuggestions());

        // Try to load location from cache on page load
        this.loadLocationFromCache();
    }

    /**
     * Request user's geolocation using browser's Geolocation API
     */
    async requestGeolocation() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by your browser');
            return;
        }

        this.showLoading(true);
        this.hideError();

        navigator.geolocation.getCurrentPosition(
            (position) => this.handleGeolocationSuccess(position),
            (error) => this.handleGeolocationError(error)
        );
    }

    /**
     * Handle successful geolocation
     */
    async handleGeolocationSuccess(position) {
        const { latitude, longitude } = position.coords;
        
        try {
            // Get address from coordinates
            const address = await this.reverseGeocode(latitude, longitude);
            
            this.currentLocation = {
                latitude,
                longitude,
                address: address.address,
                city: address.city,
                area: address.area,
                pincode: address.pincode,
                source: 'gps'
            };

            this.cacheLocation(this.currentLocation);
            this.displayLocation();
            this.showLoading(false);
            console.log('✅ Location set from GPS:', this.currentLocation);

            // Trigger location changed event
            this.triggerLocationChanged();
        } catch (error) {
            console.error('Error reverse geocoding:', error);
            this.showError('Failed to get address for your location');
            this.showLoading(false);
        }
    }

    /**
     * Handle geolocation errors
     */
    handleGeolocationError(error) {
        this.showLoading(false);

        const errorMessages = {
            1: 'Permission denied. Please enable location access.',
            2: 'Position unavailable. Please try again.',
            3: 'Request timeout. Please try again.',
        };

        const message = errorMessages[error.code] || 'Failed to get your location';
        this.showError(message);
        console.error('Geolocation error:', error);
    }

    /**
     * Handle location input field changes
     */
    async handleLocationInput(event) {
        const query = event.target.value.trim();

        if (query.length < 3) {
            this.hideLocationSuggestions();
            return;
        }

        try {
            this.showLocationSuggestions(query);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    }

    /**
     * Show location suggestions from geocoding
     */
    async showLocationSuggestions(query) {
        try {
            const response = await fetch(
                `${API_URL}/geocode?address=${encodeURIComponent(query)}`
            );
            const data = await response.json();

            if (data.success && data.location) {
                this.displayLocationSuggestions([data.location]);
            }
        } catch (error) {
            console.error('Error getting suggestions:', error);
        }
    }

    /**
     * Display location suggestions in dropdown
     */
    displayLocationSuggestions(suggestions) {
        this.locationSuggestions.innerHTML = '';

        suggestions.forEach((location) => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.innerHTML = `
                <strong>${location.city || 'Unknown'}</strong>
                <small>${location.area || ''} ${location.pincode || ''}</small>
            `;
            item.addEventListener('click', () => this.selectLocation(location));
            this.locationSuggestions.appendChild(item);
        });

        this.locationSuggestions.style.display = 'block';
    }

    /**
     * Hide location suggestions
     */
    hideLocationSuggestions() {
        this.locationSuggestions.style.display = 'none';
    }

    /**
     * Select a location from suggestions
     */
    selectLocation(location) {
        this.currentLocation = {
            address: location.formatted_address || location.address,
            city: location.city,
            area: location.area,
            pincode: location.pincode,
            latitude: location.latitude,
            longitude: location.longitude,
            source: 'manual'
        };

        this.cacheLocation(this.currentLocation);
        this.displayLocation();
        this.hideLocationSuggestions();
        this.triggerLocationChanged();
    }

    /**
     * Display current location in UI
     */
    displayLocation() {
        if (!this.currentLocation) return;

        // Hide input, show location display
        this.locationInput.style.display = 'none';
        this.geolocationBtn.style.display = 'none';
        this.currentLocationDisplay.style.display = 'flex';

        // Update display
        const cityDisplay = document.getElementById('locationCity');
        const areaDisplay = document.getElementById('locationArea');

        cityDisplay.textContent = this.currentLocation.city || 'Unknown Location';
        areaDisplay.textContent = this.currentLocation.area || '';

        console.log('📍 Location displayed:', this.currentLocation);
    }

    /**
     * Reset location and show input again
     */
    resetLocation() {
        this.currentLocation = null;
        this.locationInput.value = '';
        this.locationInput.style.display = 'block';
        this.geolocationBtn.style.display = 'block';
        this.currentLocationDisplay.style.display = 'none';
        this.hideLocationSuggestions();
        this.hideError();
        
        this.triggerLocationChanged();
    }

    /**
     * Get current location
     */
    getCurrentLocation() {
        return this.currentLocation;
    }

    /**
     * Check if user has set location
     */
    isLocationSet() {
        return this.currentLocation !== null;
    }

    /**
     * Cache location to localStorage
     */
    cacheLocation(location) {
        try {
            const cachedData = {
                location: location,
                timestamp: Date.now()
            };
            localStorage.setItem('foodCompareLocation', JSON.stringify(cachedData));
        } catch (error) {
            console.error('Error caching location:', error);
        }
    }

    /**
     * Load location from cache if available and not expired
     */
    loadLocationFromCache() {
        try {
            const cached = localStorage.getItem('foodCompareLocation');
            if (!cached) return;

            const { location, timestamp } = JSON.parse(cached);
            
            // Check if cache is still valid (1 hour)
            if (Date.now() - timestamp < this.cacheExpiry) {
                this.currentLocation = location;
                this.displayLocation();
                console.log('📍 Location loaded from cache:', location);
            } else {
                localStorage.removeItem('foodCompareLocation');
            }
        } catch (error) {
            console.error('Error loading cached location:', error);
        }
    }

    /**
     * Reverse geocode coordinates to address
     */
    async reverseGeocode(latitude, longitude) {
        try {
            const response = await fetch(
                `${API_URL}/reverse-geocode?latitude=${latitude}&longitude=${longitude}`
            );
            const data = await response.json();

            if (data.success) {
                return data.address;
            } else {
                throw new Error(data.error || 'Reverse geocoding failed');
            }
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            // Return mock address
            return {
                address: 'Current Location',
                city: 'City',
                area: 'Area',
                pincode: 'XXXXX'
            };
        }
    }

    /**
     * Get location coordinates
     */
    getCoordinates() {
        if (this.currentLocation) {
            return {
                latitude: this.currentLocation.latitude,
                longitude: this.currentLocation.longitude
            };
        }
        return null;
    }

    /**
     * Show error message
     */
    showError(message) {
        this.locationError.textContent = message;
        this.locationError.style.display = 'block';
    }

    /**
     * Hide error message
     */
    hideError() {
        this.locationError.style.display = 'none';
    }

    /**
     * Show loading indicator
     */
    showLoading(show) {
        this.locationLoading.style.display = show ? 'flex' : 'none';
    }

    /**
     * Trigger location changed event for other modules
     */
    triggerLocationChanged() {
        const event = new CustomEvent('locationChanged', {
            detail: this.currentLocation
        });
        document.dispatchEvent(event);
    }
}

// Initialize location service when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.locationService = new LocationService();
    console.log('✅ Location Service initialized');
});
