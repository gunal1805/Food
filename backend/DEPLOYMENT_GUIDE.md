# GGS Boys Backend - Setup & Deployment Guide

## 📋 Table of Contents
1. [Local Development](#local-development)
2. [AWS Deployment](#aws-deployment)
3. [API Integration](#api-integration)
4. [Real API Setup](#real-api-setup)
5. [Price Updates](#price-updates)

---

## 🚀 Local Development

### Prerequisites
- Node.js 14+ and npm 6+
- Git
- Postman (optional, for testing APIs)

### Installation

1. **Install Dependencies**
```bash
cd backend
npm install
```

2. **Setup Environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start Development Server**
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Test Endpoints
```bash
# Get all products with prices
curl http://localhost:5000/api/products

# Get single product
curl http://localhost:5000/api/products/1

# Redirect to cheapest product
curl http://localhost:5000/api/redirect/1

# Check server health
curl http://localhost:5000/health
```

---

## ☁️ AWS Deployment

### Option 1: EC2 (Recommended for Full Control)

#### Step 1: Launch EC2 Instance
1. Go to [AWS EC2 Console](https://console.aws.amazon.com/ec2)
2. Click "Launch Instance"
3. Choose: **Ubuntu Server 22.04 LTS** (Free tier eligible)
4. Instance type: **t2.micro** (Free tier)
5. Configure Security Group:
   - Add HTTP (port 80)
   - Add HTTPS (port 443)
   - Add Custom TCP (port 5000) - for development
6. Launch and save your `.pem` file

#### Step 2: Connect to Instance
```bash
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

#### Step 3: Setup on EC2
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js & npm
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Clone your repository
git clone <your-repo-url>
cd ggs-boys-website/backend

# Install dependencies
npm install

# Create .env file on server
nano .env
# Add your environment variables

# Start server with PM2
pm2 start server.js --name "ggs-boys-api"
pm2 startup
pm2 save
```

#### Step 4: Setup Reverse Proxy with Nginx
```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/default
```

Add this configuration:
```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    server_name _;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Test Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### Step 5: Setup SSL Certificate (HTTPS)
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# Update Nginx config to use SSL
sudo nano /etc/nginx/sites-available/default
```

---

### Option 2: AWS Lambda + API Gateway (Serverless)

1. Deploy with AWS SAM:
```bash
pip install aws-sam-cli
sam init
sam build
sam deploy --guided
```

2. Or use Vercel (easier for Node.js):
```bash
npm install -g vercel
vercel login
vercel deploy
```

---

### Option 3: Heroku (Simplest)

1. **Install Heroku CLI**
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Windows
# Download from https://devcenter.heroku.com/articles/heroku-cli
```

2. **Deploy**
```bash
cd backend
git init
git add .
git commit -m "Initial commit"

heroku login
heroku create ggs-boys-api
git push heroku main
```

3. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set AMAZON_API_KEY=your_key
heroku config:set FLIPKART_API_KEY=your_key
```

4. **View Logs**
```bash
heroku logs --tail
```

---

## 🔗 API Integration with Frontend

### Update Frontend to Use Backend API

Edit `js/products.js`:
```javascript
// Replace local products with API call
const API_URL = 'https://your-live-server.com/api';

// Load products from backend
async function loadProductsFromAPI() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();
        return data.products;
    } catch (error) {
        console.error('Error loading products:', error);
        return [];
    }
}

// Use in shop page initialization
document.addEventListener('DOMContentLoaded', async () => {
    products = await loadProductsFromAPI();
    initShopPage();
});
```

### Frontend "Buy Now" Button
```javascript
// When user clicks "Buy Now" or "Low Price" button
async function buyNow(productId) {
    window.location.href = `https://your-api.com/api/redirect/${productId}`;
}
```

---

## 🔑 Real API Setup

### Amazon Product Advertising API

1. **Get API Credentials**
   - Go to [Amazon Associates](https://affiliate-program.amazon.com/)
   - Sign up and get your Associate ID
   - Go to [Product Advertising API](https://advertising.amazon.com/API)
   - Request access and get API credentials

2. **Implementation in backend/server.js**
```javascript
async function getAmazonPrice(productName, asin) {
    const connection = new aws4.AwsV4({
        accessKeyId: process.env.AMAZON_API_KEY,
        secretAccessKey: process.env.AMAZON_API_SECRET
    });
    
    const response = await connection.call(
        'ProductAdvertisingAPI',
        'GetItems',
        {
            ItemIds: [asin],
            Resources: ['Images.Primary.Medium', 'Offers.Listings.Price']
        }
    );
    
    return {
        source: 'Amazon',
        price: response.Items[0].Offers.Listings[0].Price.Amount,
        url: response.Items[0].DetailPageURL,
        asin: asin
    };
}
```

### Flipkart Affiliate API

1. **Get Credentials**
   - Join [Flipkart Affiliate Program](https://www.flipkart.com/affiliate)
   - Get your affiliate ID and API key

2. **Implementation**
```javascript
async function getFlipkartPrice(productId) {
    const response = await axios.get(
        `https://api.flipkart.com/products/${productId}`,
        {
            headers: {
                'Authorization': `Bearer ${process.env.FLIPKART_API_KEY}`
            }
        }
    );
    
    return {
        source: 'Flipkart',
        price: response.data.price,
        url: `https://flipkart.refersion.com/${process.env.FLIPKART_AFFILIATE_ID}/${productId}`,
        productId: productId
    };
}
```

---

## 📊 Price Updates

### Daily Price Update Scheduler

Add to `server.js`:
```javascript
const cron = require('node-cron');

// Update prices every day at 2 AM
cron.schedule('0 2 * * *', async () => {
    console.log('Running daily price update...');
    const products = loadProducts();
    
    for (const product of products) {
        const [amazonPrice, flipkartPrice] = await Promise.all([
            getAmazonPrice(product.name),
            getFlipkartPrice(product.name)
        ]);
        
        // Save price history
        savePriceHistory(product.id, {
            amazon: amazonPrice,
            flipkart: flipkartPrice,
            timestamp: new Date()
        });
    }
    
    console.log('Price update completed');
});
```

---

## 🔐 Security Best Practices

1. **Never commit `.env` file**
   - Add to `.gitignore`
   - Use environment variables in production

2. **Rate Limiting**
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

3. **Input Validation**
```javascript
const validator = require('express-validator');

app.post('/api/products', [
    validator.body('name').isString().trim().escape(),
    validator.body('price').isFloat({ min: 0 }),
], (req, res) => {
    // Handle validation errors
});
```

---

## 📝 Monitoring & Logging

### PM2 Monitoring
```bash
pm2 monit  # Real-time monitoring
pm2 logs   # View logs
pm2 start server.js --name "api" --log-date-format "YYYY-MM-DD HH:mm:ss"
```

### CloudWatch (for AWS)
```bash
# Install CloudWatch agent
aws configure
```

---

## ✅ Checklist Before Going Live

- [ ] Set up `.env` with all API keys
- [ ] Test all endpoints on server
- [ ] Enable HTTPS/SSL
- [ ] Set up logging
- [ ] Configure CORS properly
- [ ] Set up monitoring/alerts
- [ ] Test price redirects
- [ ] Update frontend API URL
- [ ] Set up backup strategy
- [ ] Document API for team

---

## 🆘 Troubleshooting

### Server won't start
```bash
# Check if port 5000 is in use
lsof -i :5000
# Kill process if needed
kill -9 <PID>
```

### CORS errors
```javascript
// Add proper CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
```

### API calls timing out
```bash
# Increase timeout in server
app.use(express.json({ timeout: '50s' }));
```

---

## 📚 Useful Resources

- [Node.js Docs](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [AWS Documentation](https://docs.aws.amazon.com/)
- [Amazon Product Advertising API](https://advertising.amazon.com/API)
- [Flipkart Affiliate Program](https://www.flipkart.com/affiliate)
