# Food Price Comparison - Complete Setup & Testing Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- npm (v6+)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Step 1: Install Dependencies

```bash
cd backend
npm install
cd ..
```

### Step 2: Configure Environment Variables

```bash
# Copy the example file
cp backend/.env.example backend/.env

# Edit backend/.env and add:
# - GOOGLE_MAPS_API_KEY (optional for mock data)
# - API_KEY for each platform (optional)
```

### Step 3: Start Backend Server

```bash
cd backend
npm start
# Server should start on http://localhost:5000
```

### Step 4: Open Frontend

```
Open http://localhost:8000/food-compare.html in your browser
OR
Open file:///path/to/food-compare.html directly
```

## 📋 API Endpoints Available

### Search Endpoints
- **GET** `/api/search?query=pizza&latitude=28.6&longitude=77.2`
  - Search for items across all platforms
  
- **GET** `/api/compare/pizza?latitude=28.6&longitude=77.2`
  - Get detailed comparison for specific item

- **GET** `/api/offers?latitude=28.6&longitude=77.2`
  - Get current offers from all platforms

### Location Endpoints
- **GET** `/api/geocode?address=Delhi`
  - Convert address to coordinates

- **GET** `/api/reverse-geocode?latitude=28.6&longitude=77.2`
  - Convert coordinates to address

- **GET** `/api/distance?lat1=28.6&lon1=77.2&lat2=28.7&lon2=77.3`
  - Calculate distance between two points

### Platform Endpoints
- **GET** `/api/platforms`
  - Get list of available platforms

- **POST** `/api/redirect`
  - Generate redirect URL for an item

## 🧪 Testing the System

### Test 1: Location Service
1. Click the "Use my current location" button
2. Allow browser permission when prompted
3. It should show your city and area

OR

1. Type an address in the location input
2. Select from suggestions
3. Location should be saved

### Test 2: Search Functionality
1. Set your location (required)
2. Enter "Pizza" in search
3. Click Search
4. Results should show items from Swiggy, Zomato, Blinkit, Zepto

### Test 3: Result Sorting
1. Perform a search
2. Use "Sort by" dropdown to:
   - Sort by Price (Low to High)
   - Sort by Price (High to Low)
   - Sort by Delivery Time
   - Sort by Rating

### Test 4: Platform Redirect
1. Click "Open in App" button on any result
2. It should open the platform's URL

### Test 5: Offers Display
1. After search, offers should appear from available platforms
2. Each offer shows code and details

## 🔍 Browser Console Testing

Open browser DevTools (F12) and try:

```javascript
// Check if services are initialized
console.log(window.locationService);
console.log(window.foodComparison);

// Get current location
window.locationService.getCurrentLocation();

// Perform search manually
window.foodComparison.performSearch('biryani');

// Check API connection
fetch('http://localhost:5000/api/platforms').then(r => r.json()).then(d => console.log(d));
```

## 🐛 Troubleshooting

### Issue: API returns 404
- Make sure backend is running on port 5000
- Check that searchRoutes are imported in server.js
- Verify the route path starts with /api

### Issue: Geolocation not working
- Check browser permissions for location
- Some browsers require HTTPS for geolocation
- Test with manual address input instead

### Issue: Results not showing
- Check browser console for errors (F12)
- Verify API_URL is correct in js/api-config.js
- Check that location is set before searching
- Verify backend server is running

### Issue: CORS errors
- Backend has CORS enabled
- If still getting errors, check backend console

## 📦 Project Structure

```
ggs-boys-website/
├── food-compare.html              # Main comparison page
├── css/
│   └── food-comparison.css        # Styling for comparison page
├── js/
│   ├── api-config.js              # API configuration
│   ├── location-service.js        # Location handling
│   └── food-comparison.js         # Main comparison logic
└── backend/
    ├── server.js                  # Express server
    ├── package.json               # Dependencies
    ├── adapters/                  # Platform adapters
    │   ├── BaseAdapter.js
    │   ├── SwigyAdapter.js
    │   ├── ZomatoAdapter.js
    │   ├── BlinkitAdapter.js
    │   └── ZeptoAdapter.js
    ├── services/                  # Business logic
    │   ├── LocationService.js
    │   └── ComparisonService.js
    └── routes/
        └── searchRoutes.js        # API endpoints
```

## 🚀 Next Steps for Production

1. **Get API Keys**: Register with each platform's developer portal
2. **Set Up Database**: Replace JSON with MongoDB
3. **Caching**: Implement Redis for price caching
4. **Authentication**: Add user accounts and save preferences
5. **Analytics**: Track popular searches and redirects
6. **SEO**: Optimize for search engines
7. **Mobile App**: Build native iOS/Android apps
8. **Deployment**: Deploy to AWS/Heroku/DigitalOcean

## 📞 Support

For issues or questions, check the browser console and backend logs for error messages.
