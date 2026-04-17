/**
 * ML API Routes for GGS Food Services
 * Exposes machine learning features through REST endpoints
 */

const express = require('express');
const FoodML = require('../ml/FoodML');

const router = express.Router();
const ml = new FoodML();

/**
 * Endpoint 1: GET /api/ml/recommendations
 * Get personalized food recommendations
 */
router.get('/recommendations', (req, res) => {
  try {
    const { foods, budget = 500, category = '' } = req.query;
    
    if (!foods) {
      return res.status(400).json({
        error: 'Foods array required',
        example: '/api/ml/recommendations?foods=[...]&budget=500'
      });
    }

    const foodsArray = typeof foods === 'string' ? JSON.parse(foods) : foods;
    const recommendations = ml.getRecommendations(foodsArray, [], parseInt(budget));

    res.json({
      success: true,
      count: recommendations.length,
      recommendations,
      message: 'ML-powered personalized recommendations',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Endpoint 2: GET /api/ml/smart-sort
 * Smart sorting with ML
 */
router.get('/smart-sort', (req, res) => {
  try {
    const { foods, sortBy = 'best' } = req.query;

    if (!foods) {
      return res.status(400).json({
        error: 'Foods array required',
        sortOptions: ['best', 'cheapest', 'fastest', 'best-quality', 'trending']
      });
    }

    const foodsArray = typeof foods === 'string' ? JSON.parse(foods) : foods;
    const sorted = ml.smartSort(foodsArray, sortBy);

    res.json({
      success: true,
      sortMethod: sortBy,
      count: sorted.length,
      foods: sorted,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Endpoint 3: GET /api/ml/price-prediction
 * Predict optimal prices for items
 */
router.get('/price-prediction', (req, res) => {
  try {
    const { food, historicalPrices = '[]' } = req.query;

    if (!food) {
      return res.status(400).json({
        error: 'Food object required',
        example: 'GET /api/ml/price-prediction?food={...}'
      });
    }

    const foodObj = typeof food === 'string' ? JSON.parse(food) : food;
    const prices = typeof historicalPrices === 'string' ? 
      JSON.parse(historicalPrices) : historicalPrices;

    const prediction = ml.predictOptimalPrice(foodObj, prices);

    res.json({
      success: true,
      prediction,
      confidence: prediction.confidence,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Endpoint 4: GET /api/ml/diet-suggestions
 * Get food suggestions based on diet type
 */
router.get('/diet-suggestions', (req, res) => {
  try {
    const { foods, diet = 'balanced' } = req.query;

    const validDiets = ['vegan', 'keto', 'protein', 'light', 'comfort', 'balanced'];
    
    if (!foods) {
      return res.status(400).json({
        error: 'Foods array required',
        validDiets,
        example: '/api/ml/diet-suggestions?foods=[...]&diet=vegan'
      });
    }

    if (!validDiets.includes(diet)) {
      return res.status(400).json({
        error: 'Invalid diet type',
        validDiets
      });
    }

    const foodsArray = typeof foods === 'string' ? JSON.parse(foods) : foods;
    const suggestions = ml.getSuggestionsByDiet(foodsArray, diet);

    res.json({
      success: true,
      diet,
      count: suggestions.length,
      suggestions,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Endpoint 5: GET /api/ml/demand-forecast
 * Forecast which items will be popular
 */
router.get('/demand-forecast', (req, res) => {
  try {
    const { foods } = req.query;

    if (!foods) {
      return res.status(400).json({
        error: 'Foods array required',
        example: '/api/ml/demand-forecast?foods=[...]'
      });
    }

    const foodsArray = typeof foods === 'string' ? JSON.parse(foods) : foods;
    const forecast = ml.forecastDemand(foodsArray);

    const byDemand = {
      'Very High': forecast.filter(f => f.demand === 'Very High'),
      'High': forecast.filter(f => f.demand === 'High'),
      'Medium': forecast.filter(f => f.demand === 'Medium'),
      'Low': forecast.filter(f => f.demand === 'Low')
    };

    res.json({
      success: true,
      forecast: byDemand,
      total: forecast.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Endpoint 6: GET /api/ml/bundle-suggestions
 * Get bundle recommendations
 */
router.get('/bundle-suggestions', (req, res) => {
  try {
    const { selectedFood, foods } = req.query;

    if (!foods) {
      return res.status(400).json({
        error: 'Foods array required',
        example: '/api/ml/bundle-suggestions?selectedFood={...}&foods=[...]'
      });
    }

    const foodsArray = typeof foods === 'string' ? JSON.parse(foods) : foods;
    const selected = typeof selectedFood === 'string' ? 
      JSON.parse(selectedFood) : selectedFood;

    const bundles = ml.getBundleSuggestions(selected, foodsArray);

    res.json({
      success: true,
      mainItem: selected,
      bundleSuggestions: bundles,
      count: bundles.length,
      estimatedBundlePrice: selected.price + bundles.reduce((a, b) => a + b.price, 0),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Endpoint 7: POST /api/ml/track-preference
 * Track user preferences for ML learning
 */
router.post('/track-preference', (req, res) => {
  try {
    const { food, action = 'view' } = req.body;

    if (!food) {
      return res.status(400).json({
        error: 'Food object required in request body',
        validActions: ['view', 'like', 'purchase', 'skip']
      });
    }

    ml.trackUserPreference(food, action);

    res.json({
      success: true,
      message: 'Preference tracked',
      action,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Endpoint 8: GET /api/ml/stats
 * Get ML stats and insights
 */
router.get('/stats', (req, res) => {
  try {
    const stats = {
      userPreferences: ml.userPreferences,
      itemsTracked: ml.itemHistory.length,
      topCategories: Object.entries(ml.userPreferences)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([cat, score]) => ({ category: cat, score })),
      mlModules: [
        'recommendations',
        'price-prediction',
        'smart-sorting',
        'diet-suggestions',
        'demand-forecasting',
        'bundle-suggestions'
      ]
    };

    res.json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
