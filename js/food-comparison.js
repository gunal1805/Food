/**
 * Food Comparison Module - Main frontend logic
 * Handles search, results display, and platform interaction
 */

class FoodComparison {
    constructor() {
        this.searchForm = document.getElementById('searchForm');
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.resultsSection = document.getElementById('resultsSection');
        this.resultsContainer = document.getElementById('resultsContainer');
        this.noResults = document.getElementById('noResults');
        this.searchLoading = document.getElementById('searchLoading');
        this.searchedQuery = document.getElementById('searchedQuery');
        this.searchError = document.getElementById('searchError');
        this.sortBy = document.getElementById('sortBy');
        this.offersSection = document.getElementById('offersSection');
        this.offersContainer = document.getElementById('offersContainer');
        this.platformsStatus = document.getElementById('platformsStatus');
        this.platformsList = document.getElementById('platformsList');

        this.currentResults = [];
        this.currentLocation = null;

        this.init();
    }

    init() {
        // Event listeners
        this.searchForm.addEventListener('submit', (e) => this.handleSearch(e));
        this.sortBy.addEventListener('change', () => this.sortResults(this.sortBy.value));

        // Listen for location changes
        document.addEventListener('locationChanged', (e) => {
            this.currentLocation = e.detail;
            console.log('🌍 Location updated in search module:', this.currentLocation);
        });

        // Load platforms status
        this.loadPlatformsStatus();

        // Load initial offers
        this.loadOffers();

        // Check for search parameter from landing page
        this.checkUrlSearchParam();

        console.log('✅ Food Comparison module initialized');
    }

    /**
     * Check if search parameter exists in URL and auto-trigger search
     */
    checkUrlSearchParam() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        
        if (searchQuery) {
            // Pre-fill search input with the query
            this.searchInput.value = decodeURIComponent(searchQuery);
            
            // Wait a short moment for location to load, then perform search
            setTimeout(() => {
                if (this.currentLocation) {
                    this.handleSearch({ preventDefault: () => {} });
                } else {
                    console.log('⏳ Waiting for location to be set before auto-search...');
                }
            }, 500);
            
            // Clean up URL to remove search parameter
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

    /**
     * Handle search form submission
     */
    async handleSearch(event) {
        event.preventDefault();

        const query = this.searchInput.value.trim();
        if (!query) {
            this.showSearchError('Please enter a search term');
            return;
        }

        // Check location
        if (!window.locationService.isLocationSet()) {
            this.showSearchError('Please set your location first');
            return;
        }

        await this.performSearch(query);
    }

    /**
     * Perform search across all platforms
     */
    async performSearch(query) {
        this.hideSearchError();
        this.showSearchLoading(true);
        this.resultsSection.style.display = 'none';

        try {
            const location = window.locationService.getCoordinates();
            if (!location || !location.latitude) {
                throw new Error('Location is required for search');
            }

            const params = new URLSearchParams({
                query: query,
                latitude: location.latitude,
                longitude: location.longitude
            });

            const response = await fetch(`${API_URL}/search?${params}`);
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Search failed');
            }

            this.currentResults = data.results || [];
            this.displayResults(query);

            // Load fresh offers after search
            this.loadOffers();

        } catch (error) {
            console.error('Search error:', error);
            this.showSearchError(error.message || 'Failed to perform search');
        } finally {
            this.showSearchLoading(false);
        }
    }

    /**
     * Display search results
     */
    displayResults(query) {
        this.searchedQuery.textContent = query;

        if (this.currentResults.length === 0) {
            this.resultsContainer.innerHTML = '';
            this.noResults.style.display = 'flex';
            this.resultsSection.style.display = 'block';
            return;
        }

        this.noResults.style.display = 'none';
        this.renderResults();
        this.resultsSection.style.display = 'block';
    }

    /**
     * Render result cards
     */
    renderResults() {
        this.resultsContainer.innerHTML = '';

        this.currentResults.forEach((item, index) => {
            const card = this.createResultCard(item, index);
            this.resultsContainer.appendChild(card);
        });
    }

    /**
     * Create a single result card
     */
    createResultCard(item, index) {
        const card = document.createElement('div');
        card.className = 'result-card';

        const badges = this.createBadges(item);
        const deliveryTime = item.deliveryTime || 'N/A';
        const deliveryCharge = item.deliveryCharge || 0;
        const price = item.price || 'N/A';
        const originalPrice = item.originalPrice || null;
        const discount = item.discount || 0;

        // Format price display
        const priceDisplay = typeof price === 'number' ? `₹${price}` : price;
        const originalPriceDisplay = originalPrice ? `₹${originalPrice}` : '';

        // Build ingredients list
        const ingredientsList = item.ingredients && item.ingredients.length > 0 
            ? `<div class="result-ingredients">
                <strong>Key Ingredients:</strong>
                <div class="ingredients-list">
                    ${item.ingredients.map(ing => `<span class="ingredient-tag">${ing}</span>`).join('')}
                </div>
              </div>`
            : '';

        // Build description
        const description = item.description 
            ? `<p class="result-description">${item.description}</p>`
            : '';

        // Build image
        const imageUrl = item.image || 'https://via.placeholder.com/400x300?text=Food+Image';

        card.innerHTML = `
            <div class="result-card-image">
                <img src="${imageUrl}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/400x300?text=Food+Image'">
                <div class="result-badges">${badges}</div>
            </div>
            <div class="result-card-content">
                <h3 class="result-title">${item.name || 'Unknown Item'}</h3>
                <p class="result-platform"><i class="fas fa-utensils"></i> <strong>${item.restaurantName || item.source}</strong></p>
                
                ${description}
                ${ingredientsList}

                <div class="result-price-section">
                    <span class="result-price">${priceDisplay}</span>
                    ${originalPriceDisplay ? `<span class="result-original-price">${originalPriceDisplay}</span>` : ''}
                    ${discount > 0 ? `<span class="result-discount">${discount}% OFF</span>` : ''}
                </div>

                <div class="result-info">
                    <div class="info-item">
                        <i class="fas fa-clock"></i>
                        <span>${deliveryTime} mins</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-shipping-fast"></i>
                        <span>₹${deliveryCharge}</span>
                    </div>
                    ${item.rating ? `
                    <div class="info-item result-rating">
                        <i class="fas fa-star"></i>
                        <span>${item.rating}</span>
                    </div>
                    ` : ''}
                </div>

                <div class="result-actions">
                    <button class="btn-redirect" onclick="foodComparison.redirectToApp('${item.id}', '${item.source}')">
                        <i class="fas fa-shopping-cart"></i> Order Now
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    /**
     * Create badges for result card
     */
    createBadges(item) {
        let badges = '';

        if (item.isCheapest) {
            badges += '<span class="badge badge-cheapest">💰 Cheapest</span>';
        }

        if (item.isFastest) {
            badges += '<span class="badge badge-fastest">⚡ Fastest</span>';
        }

        badges += `<span class="badge badge-platform">${item.source}</span>`;

        return badges;
    }

    /**
     * Redirect to app or website
     */
    async redirectToApp(itemId, platform) {
        try {
            const location = window.locationService.getCoordinates();
            
            const response = await fetch(`${API_URL}/redirect`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    itemId: itemId,
                    platform: platform,
                    latitude: location.latitude,
                    longitude: location.longitude
                })
            });

            const data = await response.json();

            if (data.success && data.redirectURL) {
                window.open(data.redirectURL, '_blank');
                
                // Track analytics
                this.trackRedirect(itemId, platform);
            }
        } catch (error) {
            console.error('Redirect error:', error);
            alert('Failed to open app. Please try again.');
        }
    }

    /**
     * Track redirect for analytics
     */
    trackRedirect(itemId, platform) {
        try {
            const analytics = {
                itemId: itemId,
                platform: platform,
                timestamp: new Date().toISOString(),
                location: window.locationService.getCurrentLocation()
            };
            console.log('📊 Tracking redirect:', analytics);
            // Could send to analytics server here
        } catch (error) {
            console.error('Analytics error:', error);
        }
    }

    /**
     * Sort results
     */
    sortResults(sortBy) {
        if (this.currentResults.length === 0) return;

        switch (sortBy) {
            case 'price':
                this.currentResults.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                this.currentResults.sort((a, b) => b.price - a.price);
                break;
            case 'delivery':
                this.currentResults.sort((a, b) => a.deliveryTime - b.deliveryTime);
                break;
            case 'rating':
                this.currentResults.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
        }

        this.renderResults();
    }

    /**
     * Load and display offers
     */
    async loadOffers() {
        try {
            const location = window.locationService.getCoordinates();
            if (!location) return;

            const params = new URLSearchParams({
                latitude: location.latitude,
                longitude: location.longitude
            });

            const response = await fetch(`${API_URL}/offers?${params}`);
            const data = await response.json();

            if (data.success) {
                this.displayOffers(data.offers);
            }
        } catch (error) {
            console.error('Error loading offers:', error);
        }
    }

    /**
     * Display offers
     */
    displayOffers(offers) {
        if (!offers || offers.length === 0) {
            this.offersSection.style.display = 'none';
            return;
        }

        this.offersContainer.innerHTML = '';

        offers.forEach(platformOffers => {
            platformOffers.offers.forEach(offer => {
                const offerCard = document.createElement('div');
                offerCard.className = 'offer-card';

                offerCard.innerHTML = `
                    <div class="platform">${platformOffers.platform}</div>
                    <div class="offer-title">${offer.title}</div>
                    <span class="offer-code">${offer.code}</span>
                `;

                this.offersContainer.appendChild(offerCard);
            });
        });

        this.offersSection.style.display = 'block';
    }

    /**
     * Load and display platform status
     */
    async loadPlatformsStatus() {
        try {
            const response = await fetch(`${API_URL}/platforms`);
            const data = await response.json();

            if (data.success) {
                this.displayPlatformsStatus(data.platforms);
            }
        } catch (error) {
            console.error('Error loading platforms:', error);
        }
    }

    /**
     * Display platform status
     */
    displayPlatformsStatus(platforms) {
        this.platformsList.innerHTML = '';

        platforms.forEach(platform => {
            const badge = document.createElement('div');
            badge.className = 'platform-badge';

            const platformIcons = {
                'Swiggy': '🍽️',
                'Zomato': '🍜',
                'Blinkit': '🛒',
                'Zepto': '🚀'
            };

            const icon = platformIcons[platform.name] || '⭐';
            const status = platform.healthy ? 'Active' : 'Offline';
            const statusClass = platform.healthy ? 'status-active' : 'status-inactive';

            badge.innerHTML = `
                <div class="platform-badge-icon">${icon}</div>
                <div class="platform-badge-name">${platform.name}</div>
                <div class="platform-badge-status ${statusClass}">● ${status}</div>
            `;

            this.platformsList.appendChild(badge);
        });
    }

    /**
     * Show search error
     */
    showSearchError(message) {
        this.searchError.textContent = message;
        this.searchError.style.display = 'block';
    }

    /**
     * Hide search error
     */
    hideSearchError() {
        this.searchError.style.display = 'none';
    }

    /**
     * Show search loading
     */
    showSearchLoading(show) {
        this.searchLoading.style.display = show ? 'flex' : 'none';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.foodComparison = new FoodComparison();
    console.log('✅ Food Comparison UI initialized');
});
