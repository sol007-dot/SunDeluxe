const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const stripe = require('stripe');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Stripe
const stripeClient = process.env.STRIPE_SECRET_KEY ? stripe(process.env.STRIPE_SECRET_KEY) : null;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Import data
const config = require('./data/config');
const products = require('./data/products');
const services = require('./data/services');
const categories = require('./data/categories');

// Helper functions
function getProductsByCategory(categorySlug) {
  return products.filter(p => p.category === categorySlug);
}

function getProductById(id) {
  return products.find(p => p.id === id);
}

function getRelatedProducts(currentProductId, category, limit = 3) {
  return products
    .filter(p => p.category === category && p.id !== currentProductId)
    .slice(0, limit);
}

function getServiceById(id) {
  return services.find(s => s.id === id);
}

// Routes

// Home Page
app.get('/', (req, res) => {
  const featuredProducts = products.slice(0, 4);
  const categoryCounts = categories.map(cat => ({
    ...cat,
    count: getProductsByCategory(cat.slug).length
  }));
  
  res.render('index', {
    title: 'Deluxe-TECH - Premium Computer Sales & IT Solutions',
    config,
    products: featuredProducts,
    categories: categoryCounts,
    services: services.slice(0, 3),
    stripeKey: process.env.STRIPE_PUBLIC_KEY
  });
});

// Shop Page
app.get('/shop', (req, res) => {
  const categoryFilter = req.query.category;
  let filteredProducts = products;
  
  if (categoryFilter) {
    filteredProducts = getProductsByCategory(categoryFilter);
  }
  
  const categoryCounts = categories.map(cat => ({
    ...cat,
    count: getProductsByCategory(cat.slug).length
  }));
  
  res.render('shop', {
    title: 'Shop - Deluxe-TECH',
    config,
    products: filteredProducts,
    categories: categoryCounts,
    selectedCategory: categoryFilter || 'all',
    stripeKey: process.env.STRIPE_PUBLIC_KEY
  });
});

// Product Detail Page
app.get('/products/:id', (req, res) => {
  const product = getProductById(req.params.id);
  
  if (!product) {
    return res.status(404).render('404', {
      title: 'Product Not Found',
      config
    });
  }
  
  const relatedProducts = getRelatedProducts(product.id, product.category);
  
  res.render('product', {
    title: `${product.name} - Deluxe-TECH`,
    config,
    product,
    relatedProducts,
    stripeKey: process.env.STRIPE_PUBLIC_KEY
  });
});

// Services Page
app.get('/services', (req, res) => {
  res.render('services', {
    title: 'Services - Deluxe-TECH',
    config,
    services,
    stripeKey: process.env.STRIPE_PUBLIC_KEY
  });
});

// Contact Page
app.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact Us - Deluxe-TECH',
    config,
    stripeKey: process.env.STRIPE_PUBLIC_KEY
  });
});

// Contact Form Submission
app.post('/api/contact', (req, res) => {
  const { name, email, phone, inquiryType, message } = req.body;
  
  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ 
      error: 'Name, email, and message are required' 
    });
  }
  
  // In production, you'd send an email here
  console.log('Contact form submission:', {
    name,
    email,
    phone,
    inquiryType,
    message,
    timestamp: new Date().toISOString()
  });
  
  // TODO: Implement email sending
  
  res.json({ 
    success: true,
    message: 'Thank you for your message. We will get back to you soon!'
  });
});

// Stripe Checkout
app.post('/api/checkout', async (req, res) => {
  if (!stripeClient) {
    return res.status(400).json({ 
      error: 'Stripe not configured. Please set STRIPE_SECRET_KEY in environment variables.' 
    });
  }
  
  const { items } = req.body;
  
  try {
    const lineItems = items.map(item => {
      const product = getProductById(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.description.substring(0, 100),
            images: [product.image]
          },
          unit_amount: Math.round(product.price * 100)
        },
        quantity: item.quantity || 1
      };
    });
    
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/shop`,
      customer_email: req.body.email
    });
    
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Order Success Page
app.get('/success', (req, res) => {
  res.render('success', {
    title: 'Order Successful - Deluxe-TECH',
    config,
    sessionId: req.query.session_id
  });
});

// 404 Page
app.use((req, res) => {
  res.status(404).render('404', {
    title: 'Page Not Found',
    config
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n✅ Deluxe-TECH Website Running!`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`📦 Stripe: ${stripeClient ? 'Connected ✓' : 'Not Configured ⚠️'}`);
  console.log(`\n💡 Press Ctrl+C to stop\n`);
});

module.exports = app;
