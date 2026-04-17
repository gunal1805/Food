# 🚀 GGS Food Services - Quick Start Guide

## 📱 What's New
✅ **Auto-starting Server** - No manual server startup needed!
✅ **Food Images** - Beautiful high-quality food images for every item
✅ **Food Descriptions** - Detailed descriptions of what's in each food item
✅ **Ingredients List** - View all key ingredients at a glance
✅ **Auto-open Browser** - Automatically opens in your browser after launch

---

## 🎯 How to Start

### **Windows Users:**
```bash
Double-click: start-app.bat
```
OR
```bash
npm install -g open
node start-app.js
```

### **Mac/Linux Users:**
```bash
chmod +x start-app.sh
./start-app.sh
```
OR
```bash
node start-app.js
```

---

## 💻 Manual Manual Startup (If Scripts Don't Work)

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Start Server
```bash
npm start
```

### Step 3: Open in Browser
```
Open: ggs-landing.html
```

---

## 📋 Features

### **Landing Page** (`ggs-landing.html`)
- GGS Food Services branded homepage
- Quick search with popular food tags
- Link to price comparison tool
- Platform showcase (Swiggy, Zomato, Blinkit, Zepto)

### **Comparison Page** (`food-compare.html`)
- Search for any food item
- Compare prices across 4 platforms
- See delivery times and chargesView food images and descriptions
- View key ingredients in each food item
- One-click ordering from your preferred app

### **Food Data Now Includes:**
- 🖼️ High-quality food images (Unsplash)
- 📝 Detailed food descriptions
- 🥘 Key ingredients list with tags
- ⭐ Ratings from each platform
- 💰 Real prices and discounts
- ⏱️ Delivery times
- 🚚 Delivery charges

---

## 🔧 Backend API Endpoints

All endpoints automatically include food images, descriptions, and ingredients:

| Endpoint | Purpose |
|----------|---------|
| `GET /api/search` | Search across all platforms |
| `GET /api/compare/:itemName` | Compare specific food |
| `GET /api/offers` | Get platform offers |
| `GET /api/delivery` | Delivery options |
| `GET /api/geocode` | Address to coordinates |
| `GET /api/distance` | Distance calculation |
| `GET /api/platforms` | Platform status |

---

## 📱 Supported Platforms

1. **Swiggy** 🍔 - Food Delivery
2. **Zomato** 🍕 - Food Delivery  
3. **Blinkit** 🛒 - Grocery Delivery
4. **Zepto** 🚀 - Grocery Delivery

---

## 🎨 What to Search For

Try searching for:
- Pizza
- Biryani
- Samosa
- Milk
- Groceries
- Dosa
- Chicken Curry
- Paneer

---

## 📱 How to Use

1. **Open ggs-landing.html** after running start-app
2. **Click "Compare Prices Now"** or use quick search tags
3. **Set your location** (GPS or manual address)
4. **Search for any food item**
5. **Compare prices** across all 4 platforms
6. **View images, descriptions, and ingredients**
7. **Click "Order Now"** to open in your preferred app

---

## 🐛 Troubleshooting

### Server won't start
- Make sure Node.js is installed: `node --version`
- Try: `npm install` in backend folder first
- Check if port 5000 is not already in use

### Browser won't auto-open
- Manually open `ggs-landing.html` in your browser
- Make sure backend server is running (Terminal will show the URL)

### Images not loading
- Check internet connection (images are from Unsplash)
- Images will load after search results appear

### Search returns no results
- Make sure location is set (GPS or address)
- Try searching different food names
- Ensure backend server is running

---

## 📝 API Response Format

Each food item now includes:
```json
{
  "id": "unique_id",
  "name": "Food Name",
  "description": "Detailed description",
  "image": "https://food-image-url",
  "ingredients": ["ingredient1", "ingredient2", ...],
  "price": 150,
  "originalPrice": 200,
  "discount": 25,
  "rating": 4.5,
  "deliveryTime": 30,
  "deliveryCharge": 40,
  "restaurantName": "Restaurant Name",
  "source": "Swiggy"
}
```

---

## 🚀 Next Steps

- Add real API keys for Swiggy, Zomato, Blinkit, Zepto
- Deploy to production (AWS, Heroku, etc.)
- Add user accounts and order history
- Integrate with actual payment systems
- Add more cuisines and categories

---

## ✨ Built With

- **Backend:** Node.js + Express.js
- **Frontend:** HTML5 + CSS3 + Vanilla JavaScript
- **Images:** Unsplash API
- **Server:** Automatic browser opening with `open` npm package

---

**Made with ❤️ by GGS Boys**

Now run `start-app.bat` (Windows) or `./start-app.sh` (Mac/Linux) to start! 🎉
