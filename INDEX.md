# 🚀 Food Price Comparison Website - START HERE!

**Welcome!** This is your complete food price comparison website that compares prices across Swiggy, Zomato, Blinkit, and Zepto based on user location and search query.

---

## ⚡ Quick Start (2 Minutes)

### 1. Install Node.js
Download from [nodejs.org](https://nodejs.org/) and install.

### 2. Run Startup Script

**Windows:**
```batch
start-server.bat
```

**Mac/Linux:**
```bash
bash start-server.sh
```

### 3. Open in Browser
```
file:///path/to/food-compare.html
```
OR after setting up a web server:
```
http://localhost:8000/food-compare.html
```

**That's it! 🎉**

---

## 📚 Documentation Guide

### For Understanding What Was Built:
1. **[BUILD_SUMMARY.md](BUILD_SUMMARY.md)** ← Start here for overview
   - What was delivered
   - Code statistics
   - Technology stack

2. **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** ← Visual guide
   - File structure diagram
   - Data flow visualization
   - System architecture

3. **[FOOD_COMPARE_README.md](FOOD_COMPARE_README.md)** ← Complete guide
   - Features
   - How to use
   - API reference
   - Customization guide

### For Setting Up & Testing:
1. **[FOOD_COMPARE_SETUP.md](FOOD_COMPARE_SETUP.md)** ← Setup instructions
   - Prerequisites
   - Step-by-step installation
   - API endpoints
   - Testing procedures
   - Troubleshooting

### For Quick Reference:
- **[README_BACKEND.md](backend/DEPLOYMENT_GUIDE.md)** - Backend deployment
- **[QUICK_START.md](QUICK_START.md)** - General quick start

---

## 🎯 What This System Does

### Main Features:
- ✅ **Search** for food or groceries across 4 major platforms
- ✅ **Compare** prices side-by-side
- ✅ **See** delivery times and charges
- ✅ **View** available offers and deals
- ✅ **Redirect** to the cheapest option
- ✅ **Works** on all devices (desktop, tablet, mobile)

### Supported Platforms:
- 🍜 **Swiggy** - Food delivery
- 🍽️ **Zomato** - Food delivery  
- 🛒 **Blinkit** - Grocery delivery
- 🚀 **Zepto** - Grocery delivery

### Location Features:
- 📍 GPS geolocation (one-click)
- 🔍 Address search with suggestions
- 🗺️ Google Maps integration (optional)
- 💾 Location caching

---

## 📁 File Organization

### Frontend Files (Open in Browser):
```
food-compare.html         ← Main page (START HERE)
├── css/food-comparison.css    ← Styling
└── js/
    ├── api-config.js             ← API setup
    ├── location-service.js        ← GPS & geolocation
    └── food-comparison.js         ← Search logic
```

### Backend Files (Node.js Server):
```
backend/
├── server.js             ← Main server
├── package.json          ← Dependencies
├── .env.example          ← Environment setup
├── adapters/             ← Platform integrations
│   ├── BaseAdapter.js
│   ├── SwigyAdapter.js
│   ├── ZomatoAdapter.js
│   ├── BlinkitAdapter.js
│   └── ZeptoAdapter.js
├── services/             ← Business logic
│   ├── LocationService.js
│   └── ComparisonService.js
└── routes/               ← REST API
    └── searchRoutes.js
```

---

## 🔗 Available API Endpoints

All endpoints start with: `http://localhost:5000/api/`

### Search Endpoints:
- `GET /search?query=pizza&latitude=28.6&longitude=77.2`
- `GET /compare/pizza?latitude=28.6&longitude=77.2`
- `GET /offers?latitude=28.6&longitude=77.2`

### Location Endpoints:
- `GET /geocode?address=Delhi`
- `GET /reverse-geocode?latitude=28.6&longitude=77.2`
- `GET /distance?lat1=28.6&lon1=77.2&lat2=28.7&lon2=77.3`

### Status Endpoints:
- `GET /platforms`

### Action Endpoints:
- `POST /redirect` (with body: itemId, platform, latitude, longitude)

Full API docs in [FOOD_COMPARE_SETUP.md](FOOD_COMPARE_SETUP.md)

---

## 🧪 Testing Checklist

After starting the server, test these features:

### Location Service:
- [ ] Click GPS button and allow permission
- [ ] Location should display (city, area)
- [ ] Type address - suggestions appear
- [ ] Select suggestion - location updates

### Search:
- [ ] Enter "Pizza" in search
- [ ] Click Search
- [ ] Results from multiple platforms appear
- [ ] Each result shows price, delivery time, platform

### Results:
- [ ] Try different sort options
- [ ] Click "Open in App" button
- [ ] Browser should open platform URL
- [ ] Offers display below results

### Platform Status:
- [ ] All 4 platforms show as active
- [ ] Platform status section visible

---

## 🛠️ Running Locally

### Option 1: Use Startup Scripts (Easiest)
```bash
# Windows
start-server.bat

# Mac/Linux  
bash start-server.sh
```

### Option 2: Manual 
```bash
cd backend
npm install
npm start
```

### Option 3: With Python Web Server
```bash
# In project root directory
python -m http.server 8000
# Then visit: http://localhost:8000/food-compare.html
```

---

## ⚙️ Configuration

### Environment Variables (.env)
Create `backend/.env` with:
```env
PORT=5000
NODE_ENV=development
GOOGLE_MAPS_API_KEY=your_key_here  # Optional
```

### API Configuration
Edit `js/api-config.js` if needed:
- Development: `http://localhost:5000/api`
- Production: Your deployed API URL

---

## 🐛 Troubleshooting

### Error: "npm not recognized"
- Install Node.js from [nodejs.org](https://nodejs.org/)

### Error: "Port 5000 in use"
- Change PORT in .env or kill process using port 5000

### Location not working
- Check browser permissions
- Try manual address entry
- Check browser console (F12) for errors

### Search returns no results
- Verify location is set
- Check backend is running
- Check API_URL in js/api-config.js

### Results not displaying
- Open browser console (F12)
- Check for errors
- Verify backend server is running
- Check network requests in DevTools

See [FOOD_COMPARE_SETUP.md](FOOD_COMPARE_SETUP.md) for more troubleshooting.

---

## 📊 System Architecture (High Level)

```
Browser (User Interface)
    ↓
food-compare.html (Frontend)
    ├── js/location-service.js (GPS, Geocoding)
    ├── js/food-comparison.js (Search, Results)
    └── css/food-comparison.css (Styling)
    ↓ HTTP Requests
Backend Server (Node.js + Express)
    ├── routes/searchRoutes.js (API)
    ├── services/ComparisonService.js (Logic)
    └── adapters/[*]Adapter.js (Platforms)
    ↓ Returns
JSON Results
    ↓
Display on Frontend
```

---

## 💡 Tips & Tricks

### For Development:
- Press `F12` in browser to see network requests
- Check browser console for JavaScript errors
- Use `npm start` for development server

### For Testing:
- Use mock data - no API keys needed
- Test with different addresses
- Try all 4 platforms

### For Extending:
- Add more platforms by creating new adapters
- Customize colors in food-comparison.css
- Add features to food-comparison.js

---

## 📈 Roadmap & Next Steps

### Immediate (This is done):
- ✅ Backend API framework
- ✅ Location service
- ✅ Search UI
- ✅ Results display

### Short Term:
- [ ] Connect real APIs (Swiggy, Zomato, etc)
- [ ] Add user accounts
- [ ] Set up database
- [ ] Add price history

### Medium Term:
- [ ] Mobile app (React Native)
- [ ] More countries
- [ ] Advanced filtering
- [ ] Price alerts

### Long Term:
- [ ] Machine learning for recommendations
- [ ] Subscription service
- [ ] Restaurant partnerships
- [ ] Expansion to other services

---

## 🎓 Learning Resources

### Technologies Used:
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **APIs**: REST, Fetch API, Geolocation API
- **Tools**: npm, Git, VS Code

### Related Docs:
- [Express.js Docs](https://expressjs.com/)
- [MDN JavaScript Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/)
- [Google Maps API](https://developers.google.com/maps)

---

## 📞 Getting Help

1. **Check Documentation**: Start with [FOOD_COMPARE_SETUP.md](FOOD_COMPARE_SETUP.md)
2. **Check Troubleshooting**: See troubleshooting section below
3. **Console Debugging**: Press F12, check for errors
4. **Backend Logs**: Check terminal output for server logs

---

## 📋 File Reference Quick Link

| Document | Purpose |
|----------|---------|
| [BUILD_SUMMARY.md](BUILD_SUMMARY.md) | What was built and statistics |
| [FOOD_COMPARE_README.md](FOOD_COMPARE_README.md) | Complete feature guide |
| [FOOD_COMPARE_SETUP.md](FOOD_COMPARE_SETUP.md) | Setup and testing guide |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | Visual architecture |
| [food-compare.html](food-compare.html) | Main page (start here!) |
| [start-server.bat](start-server.bat) | Windows startup |
| [start-server.sh](start-server.sh) | Mac/Linux startup |

---

## ✅ You're All Set!

Everything is ready to go. Simply:

1. **Install Node.js** if you haven't
2. **Run the startup script**
3. **Open food-compare.html**
4. **Start comparing prices!**

For detailed information, read the documentation files listed above.

---

## 🎉 What's Next?

1. **Test the application** - follow the Testing Checklist
2. **Read the docs** - understand how it works
3. **Customize it** - make it your own
4. **Deploy it** - share it with users
5. **Extend it** - add more features

**Happy exploring! 🚀**

---

*Last Updated: April 16, 2026*  
*Status: ✅ Complete and Ready to Use*  
*Version: 1.0.0 (MVP)*
