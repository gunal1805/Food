/**
 * Machine Learning Module for GGS Food Services
 * Provides recommendations, price predictions, and smart sorting
 */

class FoodML {
  constructor() {
    this.userPreferences = {};
    this.itemHistory = [];
    this.priceHistory = {};
  }

  /**
   * FEATURE 1: Personalized Food Recommendations
   * Recommends food based on user preferences and history
   */
  getRecommendations(allFoods, userHistory = [], userBudget = 500) {
    if (!allFoods || allFoods.length === 0) return [];

    const scored = allFoods.map(food => {
      let score = 0;

      // Score 1: Price Match (40 points)
      const priceScore = Math.max(0, 40 - Math.abs(food.price - userBudget) / 10);
      score += priceScore;

      // Score 2: Rating (30 points)
      const ratingScore = (food.rating || 3.5) * 6;
      score += Math.min(30, ratingScore);

      // Score 3: Delivery Time (20 points - faster is better)
      const speedScore = Math.max(0, 20 - (food.preparationTime || 30) / 2);
      score += speedScore;

      // Score 4: Category Match with History (20 points)
      if (userHistory.length > 0) {
        const categoryScore = userHistory.some(item => 
          item.category === food.category
        ) ? 20 : 0;
        score += categoryScore;
      }

      // Score 5: Offers/Discounts (10 points bonus)
      if (food.discount && food.discount > 0) {
        score += 10;
      }

      return { ...food, ml_score: Math.round(score), rank: 0 };
    });

    // Sort by ML score (highest first)
    const recommended = scored
      .sort((a, b) => b.ml_score - a.ml_score)
      .slice(0, 10)
      .map((item, index) => ({
        ...item,
        rank: index + 1,
        why: this._getRecommendationReason(item)
      }));

    return recommended;
  }

  /**
   * FEATURE 2: Smart Price Prediction
   * Predicts optimal time to order based on historical patterns
   */
  predictOptimalPrice(foodItem, historicalPrices = []) {
    if (!foodItem || !foodItem.price) {
      return {
        predictedPrice: foodItem.price,
        confidence: 0,
        suggestion: "No historical data"
      };
    }

    // Simple ML: Average price + trend prediction
    const prices = [...historicalPrices, foodItem.price];
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const trend = prices[prices.length - 1] - avgPrice;

    const predictedPrice = foodItem.price - (trend * 0.5);
    const confidence = Math.min(100, (historicalPrices.length * 10));

    let suggestion = "Price stable";
    if (trend > 10) suggestion = "Price trending up - order now!";
    if (trend < -10) suggestion = "Price dropping - might lower soon";

    return {
      currentPrice: foodItem.price,
      predictedPrice: Math.round(predictedPrice * 100) / 100,
      savings: Math.round((foodItem.price - predictedPrice) * 100) / 100,
      confidence: Math.min(100, confidence),
      suggestion
    };
  }

  /**
   * FEATURE 3: Smart Sorting Algorithm
   * Sorts foods by multiple ML factors
   */
  smartSort(foods, sortType = "best") {
    const scored = foods.map(food => ({
      ...food,
      valueScore: this._calculateValueScore(food),
      qualityScore: this._calculateQualityScore(food),
      speedScore: this._calculateSpeedScore(food)
    }));

    switch (sortType) {
      case "best":
        return scored.sort((a, b) => 
          (b.valueScore + b.qualityScore + b.speedScore) - 
          (a.valueScore + a.qualityScore + a.speedScore)
        );
      
      case "cheapest":
        return scored.sort((a, b) => a.price - b.price);
      
      case "fastest":
        return scored.sort((a, b) => 
          (a.preparationTime || 30) - (b.preparationTime || 30)
        );
      
      case "best-quality":
        return scored.sort((a, b) => b.valueScore - a.valueScore);
      
      case "trending":
        // Foods with good rating, price, and speed
        return scored.sort((a, b) => 
          ((b.rating || 0) * 10 + b.valueScore) - 
          ((a.rating || 0) * 10 + a.valueScore)
        );
      
      default:
        return foods;
    }
  }

  /**
   * FEATURE 4: Personalized Diet Suggestions
   * ML-based dietary recommendations
   */
  getSuggestionsByDiet(allFoods, dietType = "balanced") {
    const dietKeywords = {
      "vegan": ["vegetable", "salad", "vegan", "plant", "tofu"],
      "keto": ["meat", "cheese", "egg", "butter", "nuts"],
      "protein": ["chicken", "meat", "fish", "protein", "egg"],
      "light": ["salad", "light", "low-cal", "fresh"],
      "comfort": ["burger", "pizza", "fried", "cheese", "cream"]
    };

    const keywords = dietKeywords[dietType] || [];
    
    return allFoods
      .map(food => {
        const matches = keywords.filter(kw => 
          (food.description || "").toLowerCase().includes(kw) ||
          (food.name || "").toLowerCase().includes(kw) ||
          (food.ingredients || []).some(ing => 
            ing.toLowerCase().includes(kw)
          )
        ).length;

        return { ...food, dietScore: matches };
      })
      .filter(f => f.dietScore > 0)
      .sort((a, b) => b.dietScore - a.dietScore)
      .slice(0, 8);
  }

  /**
   * FEATURE 5: Demand Forecasting
   * Predicts which items will be popular
   */
  forecastDemand(foods) {
    return foods.map(food => {
      // Factors: rating, reviews (implied), time of day
      const ratingFactor = (food.rating || 3.5) * 20;
      const priceFactor = Math.max(0, 30 - (food.price / 50));
      const speedFactor = Math.max(0, 20 - (food.preparationTime || 30) / 2);
      
      const demandScore = Math.round(ratingFactor + priceFactor + speedFactor);
      const demand = 
        demandScore > 60 ? "Very High" :
        demandScore > 45 ? "High" :
        demandScore > 30 ? "Medium" :
        "Low";

      return { ...food, demandScore, demand };
    });
  }

  /**
   * FEATURE 6: Bundle Recommendations
   * Suggests complementary items to order together
   */
  getBundleSuggestions(selectedFood, allFoods) {
    if (!selectedFood) return [];

    const bundles = {
      "pizza": ["soft-drink", "dessert", "salad"],
      "burger": ["fries", "drink", "sauce"],
      "salad": ["dressing", "drink", "bread"],
      "pasta": ["sauce", "drink", "bread"],
      "biryani": ["raita", "curry", "drink"],
      "dosa": ["sambar", "chutney", "drink"]
    };

    const category = (selectedFood.name || "").toLowerCase();
    const complementary = bundles[category] || [];

    return allFoods
      .filter(food => 
        complementary.some(comp => 
          (food.name || "").toLowerCase().includes(comp) ||
          (food.description || "").toLowerCase().includes(comp)
        )
      )
      .slice(0, 3);
  }

  // ==================== HELPER FUNCTIONS ====================

  _calculateValueScore(food) {
    const pricePerUnit = food.price / (food.serves ? parseInt(food.serves) : 1);
    return Math.max(0, 50 - pricePerUnit);
  }

  _calculateQualityScore(food) {
    return ((food.rating || 3.5) / 5) * 50;
  }

  _calculateSpeedScore(food) {
    return Math.max(0, 50 - (food.preparationTime || 30));
  }

  _getRecommendationReason(food) {
    const reasons = [];
    
    if (food.rating >= 4.5) reasons.push("Highly rated");
    if (food.discount && food.discount > 0) reasons.push("Has discount");
    if ((food.preparationTime || 30) < 20) reasons.push("Quick delivery");
    if (!reasons.length) reasons.push("Good value");

    return reasons.join(" • ");
  }

  /**
   * Track user interaction for better recommendations
   */
  trackUserPreference(foodItem, action = "view") {
    if (!this.userPreferences[foodItem.category]) {
      this.userPreferences[foodItem.category] = 0;
    }
    
    const weight = action === "purchase" ? 5 : action === "like" ? 2 : 1;
    this.userPreferences[foodItem.category] += weight;
    
    this.itemHistory.push({
      ...foodItem,
      timestamp: new Date(),
      action
    });
  }
}

// Export for Node.js
if (typeof module !== "undefined" && module.exports) {
  module.exports = FoodML;
}
