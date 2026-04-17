# GGS Boys E-Commerce Platform
### Real-time Price Comparison & Affiliate Redirects

---

## 🎯 Project Overview

GGS Boys is a modern e-commerce platform that:
- ✅ Displays products from your catalog
- ✅ Fetches **real-time prices** from Amazon & Flipkart
- ✅ Shows **price comparisons** across multiple vendors
- ✅ **Redirects customers** to the cheapest option (with affiliate links)
- ✅ **Fully online** - no localhost required
- ✅ **Scalable** - deployed on AWS

---

## 📁 Project Structure

```
ggs-boys-website/
├── index.html                 # Home page
├── shop.html                  # Product shop page
├── cart.html                  # Shopping cart
├── checkout.html              # Checkout process
│
├── css/
│   └── styles.css             # All styling
│
├── js/
│   ├── api-config.js          # 🆕 Backend API configuration
│   ├── main.js                # Navigation & global functions
│   ├── products.js            # Product data management
│   ├── shop.js                # Shop functionality
│   ├── cart.js                # Cart management
│   └── checkout.js            # Checkout logic
│
├── backend/
│   ├── server.js              # 🆕 Express backend server
│   ├── package.json           # 🆕 Node.js dependencies
│   ├── .env.example           # 🆕 Environment template
│   ├── .gitignore             # 🆕 Git ignore rules
│   │
│   ├── data/
│   │   └── products.json      # 🆕 Product database
│   │
│   ├── DEPLOYMENT_GUIDE.md    # 🆕 Complete deployment guide
│   └── README.md              # 🆕 Backend documentation
│
├── .gitignore
└── README.md                  # This file
```

---

## 🚀 Quick Start

### Frontend Only (Development)
```bash
# 1. Open in browser
open index.html

# 2. Products load from fallback (local data)
```

### With Backend (Production-Ready)

**Step 1: Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

**Step 2: Update Frontend API URL**

Edit `js/api-config.js`:
```javascript
const PRODUCTION_API_URL = 'http://localhost:5000/api';  // For local testing
```

**Step 3: Open in Browser**
```bash
# Navigate to your site
open index.html

# Products now load from backend API!
```

---

## 🌐 Deployment (AWS)

### Step 1: Deploy Backend to AWS EC2

```bash
# Full guide: backend/DEPLOYMENT_GUIDE.md
cd backend

# SSH into EC2
ssh -i your-key.pem ubuntu@ec2-instance-ip

# Install Node.js and deploy
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs
git clone <your-repo>
cd ggs-boys-website/backend
npm install
pm2 start server.js --name "ggs-boys-api"
```

### Step 2: Setup Nginx Reverse Proxy
```bash
sudo apt install nginx
# Configure Nginx to forward requests to Node.js
```

### Step 3: Update Frontend API URL

Edit `js/api-config.js`:
```javascript
const PRODUCTION_API_URL = 'https://your-api-domain.com/api';
```

### Result
Your website is now live and:
- ✅ Fetches real prices from Amazon/Flipkart
- ✅ Compares prices across vendors
- ✅ Redirects customers to the cheapest option
- ✅ Tracks analytics

---

## 🔌 API Endpoints

### Backend API (Node.js Express)

**Base URL**: `https://your-api-domain.com/api`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/products` | GET | Get all products with prices |
| `/products/:id` | GET | Get single product with price comparison |
| `/redirect/:id` | GET | Redirect to cheapest vendor |
| `/price-history/:id` | GET | Get price history for product |
| `/analytics/redirects` | GET | View redirect analytics |

### Example Requests

```javascript
// Get all products with live prices
fetch('https://api.yourdomain.com/api/products')
    .then(res => res.json())
    .then(data => console.log(data.products))

// Redirect to cheapest option
window.location.href = `${API_URL}/redirect/1`

// Get price comparison
fetch(`${API_URL}/products/1`)
    .then(res => res.json())
    .then(data => {
        console.log(data.product.prices);  // All prices
        console.log(data.product.cheapestOption);  // Lowest price
    })
```

---

## 💰 Real API Integration

### Amazon Product Advertising API

1. **Get Credentials**
   - Visit: https://advertising.amazon.com/API
   - Sign up for Product Advertising API
   - Get your API key & secret
   - Get your Associate ID

2. **Add to .env**
   ```
   AMAZON_API_KEY=your_key
   AMAZON_API_SECRET=your_secret
   AMAZON_ASSOCIATE_TAG=yourassociateid
   ```

3. **Update server.js** - Replace the mock function with real API call

### Flipkart Affiliate API

1. **Get Credentials**
   - Visit: https://www.flipkart.com/affiliate
   - Sign up as a Flipkart affiliate
   - Get your API key & affiliate ID

2. **Add to .env**
   ```
   FLIPKART_API_KEY=your_key
   FLIPKART_AFFILIATE_ID=your_id
   ```

3. **Update server.js** - Replace the mock function with real API call

---

## 🎨 Frontend Integration

### Show Price Comparison

```html
<button onclick="showPriceComparison(productId)">
    Compare Prices
</button>
```

### Buy at Lowest Price

```html
<button onclick="buyAtLowestPrice(productId)">
    Buy at Lowest Price
</button>
```

This will:
1. Fetch prices from Amazon & Flipkart
2. Find the cheapest option
3. **Redirect with your affiliate link** (earn commission!)

---

## 📊 Features

### ✅ Price Comparison
- Fetch live prices from multiple vendors
- Display side-by-side comparison
- Show availability status

### ✅ Smart Redirects
- Automatically redirect to cheapest option
- Preserve your affiliate links
- Track which platform customers use

### ✅ Analytics
- Track redirect clicks
- Monitor bestsellers
- Analyze customer behavior

### ✅ Daily Updates
- Scheduled price updates
- Price history tracking
- Trend analysis

### ✅ Security
- Environment variable protection
- CORS enabled
- Rate limiting
- Input validation

---

## 📱 How It Works

```
┌─────────────────────────────────────────────────────────┐
│  Customer Visits GGS Boys Website                       │
└──────────────────┬──────────────────────────────────────┘
                   │
        ┌──────────▼──────────┐
        │ Frontend (HTML/JS)  │
        │  Loads products     │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ API Config (api-config.js)      │
        │ Calls: /api/products            │
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────────┐
        │ Node.js Backend (Express)          │
        │ - Fetches Amazon prices            │
        │ - Fetches Flipkart prices          │
        │ - Finds cheapest option            │
        └──────────┬──────────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ Returns JSON:                   │
        │ {                               │
        │   product: {...},               │
        │   prices: [Amazon, Flipkart],   │
        │   cheapestOption: {...}         │
        │ }                               │
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ Frontend Displays Prices         │
        │ Shows: "Buy at ₹999 (Flipkart)"  │
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │ Customer Clicks "Buy Now"        │
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────────┐
        │ API Redirect: /api/redirect/1       │
        │ - Logs redirect to analytics        │
        │ - Redirects to Amazon/Flipkart URL  │
        │ - Includes affiliate link           │
        └──────────┬──────────────────────────┘
                   │
        ┌──────────▼──────────────────────────┐
        │ Customer → Amazon/Flipkart          │
        │ purchases → Commission to you! 💰  │
        └──────────────────────────────────────┘
```

---

## 🔐 Environment Variables

Create `.env` file in `backend/` folder:

```env
NODE_ENV=production
PORT=5000
API_URL=https://your-api-domain.com
FRONTEND_URL=https://your-frontend-domain.com

# Amazon API
AMAZON_API_KEY=xxx
AMAZON_API_SECRET=xxx
AMAZON_ASSOCIATE_TAG=xxx

# Flipkart API
FLIPKART_API_KEY=xxx
FLIPKART_AFFILIATE_ID=xxx
```

---

## 📈 Monetization Strategy

### Affiliate Commissions
- Amazon Associates: 1-10% commission
- Flipkart Affiliate: 5-15% commission
- Every product sold = your commission!

### How You Earn
1. Customer visits your site
2. Clicks "Buy at Lowest Price"
3. Redirected to Amazon/Flipkart with your affiliate link
4. Makes purchase
5. **You earn commission!** 💰

---

## 🛠️ Troubleshooting

### Products Not Loading
```javascript
// Check browser console for errors
console.log(API_URL);
console.log(products);
```

### CORS Errors
- Update `FRONTEND_URL` in backend `.env`
- Ensure CORS is enabled in Express

### Prices Not Updating
- Check API credentials in `.env`
- Verify API rate limits
- Check server logs

### Redirects Not Working
- Verify affiliate links in analytics
- Check browser console for errors
- Ensure API endpoint is reachable

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [DEPLOYMENT_GUIDE.md](backend/DEPLOYMENT_GUIDE.md) | Complete AWS deployment instructions |
| [backend/README.md](backend/README.md) | Backend API documentation |
| [This README](README.md) | Project overview |

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 🙋 Support

### Need Help?
- Check [DEPLOYMENT_GUIDE.md](backend/DEPLOYMENT_GUIDE.md)
- Review API endpoints
- Check server logs: `pm2 logs ggs-boys-api`

### Common Issues
- **Products not showing**: Ensure backend is running
- **Prices not loading**: Check API credentials
- **Redirects failing**: Verify affiliate links

---

## 🚀 Next Steps

### 1. Set Up Backend
```bash
cd backend && npm install
```

### 2. Get API Credentials
- Amazon: https://advertising.amazon.com/API
- Flipkart: https://www.flipkart.com/affiliate

### 3. Configure .env
```bash
cp backend/.env.example backend/.env
# Add your API keys
```

### 4. Test Locally
```bash
npm run dev
# Visit http://localhost:5000/api/products
```

### 5. Deploy to AWS
```bash
# Follow: backend/DEPLOYMENT_GUIDE.md
```

### 6. Promote & Earn
- Share your affiliate links
- Earn commissions 💰

---

Made with ❤️ by GGS Boys Team
