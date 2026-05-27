# Deluxe-TECH Website

A premium, fully-featured technology business website built with Express.js, EJS, and Stripe integration.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 14.0
- npm >= 6.0

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Run development server
npm run dev
```

Visit http://localhost:3000

## 📁 Project Structure

```
├── server.js              # Express server
├── package.json           # Dependencies
├── .env.example          # Environment variables template
├── data/                 # Content data files
│   ├── config.js        # Company configuration
│   ├── products.js      # Product catalog
│   ├── services.js      # Services list
│   └── categories.js    # Product categories
├── views/               # EJS templates
│   ├── layout.ejs       # Main layout
│   ├── index.ejs        # Home page
│   ├── shop.ejs         # Shop page
│   ├── product.ejs      # Product detail
│   ├── services.ejs     # Services page
│   ├── contact.ejs      # Contact page
│   ├── success.ejs      # Order success
│   └── 404.ejs          # Error page
└── public/              # Static files
    ├── styles/
    │   ├── main.css     # Core styles
    │   └── layout.css   # Layout styles
    └── js/
        └── main.js      # Main scripts
```

## 🎨 Features

✅ Responsive design
✅ Product catalog with categories
✅ Stripe checkout integration
✅ Contact form
✅ Service listings
✅ Professional animations
✅ Dark theme UI
✅ Fast performance

## ⚙️ Configuration

Edit `data/config.js` to customize:
- Company name and contact info
- Business hours
- Colors and branding

Edit `data/products.js` to add/modify products.
Edit `data/services.js` to add/modify services.

## 💳 Stripe Setup

1. Get API keys from https://dashboard.stripe.com/apikeys
2. Add to `.env`:
   ```
   STRIPE_PUBLIC_KEY=pk_test_xxxxx
   STRIPE_SECRET_KEY=sk_test_xxxxx
   ```
3. Restart server

## 🚀 Deployment

### Heroku
```bash
heroku create
git push heroku main
```

### Other platforms
The app works on any Node.js hosting (AWS, DigitalOcean, Netlify, etc.)

## 📝 License

Apache License 2.0
