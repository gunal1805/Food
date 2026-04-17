/**
 * Frontend ML Module for GGS Food Services
 * Handles ML features on the client side
 */

class FoodMLClient {
  constructor(apiBaseUrl = '/api/ml') {
    this.apiBaseUrl = apiBaseUrl;
    this.cache = {};
  }

  /**
   * Get personalized recommendations
   */
  async getRecommendations(foods, budget = 500) {
    try {
      const params = new URLSearchParams({
        foods: JSON.stringify(foods),
        budget
      });

      const response = await fetch(`${this.apiBaseUrl}/recommendations?${params}`);
      const data = await response.json();

      if (data.success) {
        this.cache.recommendations = data.recommendations;
        return data.recommendations;
      }
      throw new Error(data.error);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }

  /**
   * Smart sort foods
   */
  async smartSort(foods, sortBy = 'best') {
    try {
      const params = new URLSearchParams({
        foods: JSON.stringify(foods),
        sortBy
      });

      const response = await fetch(`${this.apiBaseUrl}/smart-sort?${params}`);
      const data = await response.json();

      if (data.success) {
        this.cache.sorted = data.foods;
        return data.foods;
      }
      throw new Error(data.error);
    } catch (error) {
      console.error('Error in smart sort:', error);
      return foods;
    }
  }

  /**
   * Get price prediction
   */
  async predictPrice(food) {
    try {
      const params = new URLSearchParams({
        food: JSON.stringify(food)
      });

      const response = await fetch(`${this.apiBaseUrl}/price-prediction?${params}`);
      const data = await response.json();

      if (data.success) {
        return data.prediction;
      }
      throw new Error(data.error);
    } catch (error) {
      console.error('Error predicting price:', error);
      return null;
    }
  }

  /**
   * Get diet suggestions
   */
  async getDietSuggestions(foods, diet = 'balanced') {
    try {
      const params = new URLSearchParams({
        foods: JSON.stringify(foods),
        diet
      });

      const response = await fetch(`${this.apiBaseUrl}/diet-suggestions?${params}`);
      const data = await response.json();

      if (data.success) {
        return data.suggestions;
      }
      throw new Error(data.error);
    } catch (error) {
      console.error('Error getting diet suggestions:', error);
      return [];
    }
  }

  /**
   * Get demand forecast
   */
  async getDemandForecast(foods) {
    try {
      const params = new URLSearchParams({
        foods: JSON.stringify(foods)
      });

      const response = await fetch(`${this.apiBaseUrl}/demand-forecast?${params}`);
      const data = await response.json();

      if (data.success) {
        return data.forecast;
      }
      throw new Error(data.error);
    } catch (error) {
      console.error('Error getting demand forecast:', error);
      return {};
    }
  }

  /**
   * Get bundle suggestions
   */
  async getBundleSuggestions(selectedFood, allFoods) {
    try {
      const params = new URLSearchParams({
        selectedFood: JSON.stringify(selectedFood),
        foods: JSON.stringify(allFoods)
      });

      const response = await fetch(`${this.apiBaseUrl}/bundle-suggestions?${params}`);
      const data = await response.json();

      if (data.success) {
        return {
          mainItem: data.mainItem,
          suggestions: data.bundleSuggestions,
          totalPrice: Math.round(data.estimatedBundlePrice * 100) / 100
        };
      }
      throw new Error(data.error);
    } catch (error) {
      console.error('Error getting bundle suggestions:', error);
      return { suggestions: [] };
    }
  }

  /**
   * Track user preference
   */
  async trackPreference(food, action = 'view') {
    try {
      const response = await fetch(`${this.apiBaseUrl}/track-preference`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ food, action })
      });

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error tracking preference:', error);
      return false;
    }
  }

  /**
   * Get ML stats
   */
  async getStats() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/stats`);
      const data = await response.json();

      if (data.success) {
        return data.stats;
      }
      throw new Error(data.error);
    } catch (error) {
      console.error('Error getting stats:', error);
      return {};
    }
  }

  /**
   * Display recommendations in UI
   */
  displayRecommendations(containerSelector, recommendations) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    let html = '<div class="ml-section">';
    html += '<h3>🤖 AI Recommendations for You</h3>';
    html += '<div class="ml-recommendations-grid">';

    recommendations.forEach((item, index) => {
      html += `
        <div class="ml-recommendation-card">
          <div class="ml-rank">Top ${item.rank}</div>
          <img src="${item.image_url}" alt="${item.name}" />
          <h4>${item.name}</h4>
          <p class="ml-score">ML Score: ${item.ml_score}%</p>
          <p class="ml-why">${item.why}</p>
          <p class="price">₹${item.price}</p>
          <button class="btn-add" onclick="addToCart('${item.name}')">Add to Cart</button>
        </div>
      `;
    });

    html += '</div></div>';
    container.innerHTML = html;
  }

  /**
   * Display smart sort options
   */
  displaySortOptions(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const options = [
      { value: 'best', label: '⭐ Best Overall' },
      { value: 'cheapest', label: '💰 Cheapest' },
      { value: 'fastest', label: '⚡ Fastest Delivery' },
      { value: 'best-quality', label: '🏆 Best Quality' },
      { value: 'trending', label: '🔥 Trending Now' }
    ];

    let html = '<div class="ml-sort-buttons">';
    options.forEach(opt => {
      html += `
        <button class="btn-sort" onclick="sortByML('${opt.value}')">
          ${opt.label}
        </button>
      `;
    });
    html += '</div>';

    container.innerHTML = html;
  }

  /**
   * Display diet suggestions
   */
  displayDietSuggestions(containerSelector, diet, suggestions) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const dietEmoji = {
      'vegan': '🌱',
      'keto': '🥩',
      'protein': '💪',
      'light': '🥗',
      'comfort': '😋'
    };

    let html = `<div class="ml-diet-section">`;
    html += `<h3>${dietEmoji[diet] || '🍽️'} ${diet.charAt(0).toUpperCase() + diet.slice(1)} Foods</h3>`;
    html += '<div class="ml-diet-grid">';

    suggestions.forEach(item => {
      html += `
        <div class="ml-diet-card">
          <img src="${item.image_url}" alt="${item.name}" />
          <h4>${item.name}</h4>
          <p>₹${item.price}</p>
          <button class="btn-add" onclick="addToCart('${item.name}')">Add</button>
        </div>
      `;
    });

    html += '</div></div>';
    container.innerHTML = html;
  }

  /**
   * Display price prediction
   */
  displayPricePrediction(containerSelector, prediction) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const savings = prediction.savings > 0 ? 
      `💰 Save ₹${prediction.savings}` : 
      `📈 Price increasing`;

    let html = `
      <div class="ml-price-prediction">
        <h4>💡 Smart Price Insight</h4>
        <p>Current Price: <strong>₹${prediction.currentPrice}</strong></p>
        <p>Predicted Price: <strong>₹${prediction.predictedPrice}</strong></p>
        <p>${savings}</p>
        <p class="suggestion">📌 ${prediction.suggestion}</p>
        <p class="confidence">Confidence: ${prediction.confidence}%</p>
      </div>
    `;

    container.innerHTML = html;
  }
}

// Initialize global ML client
const foodML = new FoodMLClient();
