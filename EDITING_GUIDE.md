# Editing Guide - Deluxe-TECH Website

Quick reference for editing your website content.

## 🎯 Quick Start

All content lives in the `data/` folder. Edit these files, restart the server, and your changes appear instantly!

```bash
npm run dev  # Auto-restarts on file changes
```

## 📝 What to Edit & How

### 1. Company Details
**File:** `data/config.js`

```javascript
company: {
  name: 'Deluxe-TECH Computer Resources',  // Your company name
  shortName: 'Deluxe-TECH',                // Short name for nav bar
  tagline: 'Premium Computer Sales & IT Solutions',
  phone: '+1 (555) 123-4567',              // Your phone
  email: 'support@deluxe-tech.com',        // Support email
  emergencyPhone: '+1 (555) 123-9999',     // 24/7 emergency line
  address: '123 Tech Street, Silicon Valley, CA 94025'
}

businessHours: {
  monday: '9:00 AM - 6:00 PM',
  // ... add other days
}
```

### 2. Add/Edit Products
**File:** `data/products.js`

**To add a new product:**
```javascript
{
  id: 'unique-product-id',           // Must be unique!
  name: 'Product Name',
  category: 'laptops',               // Must match category slug
  price: 1299.99,
  description: 'Full product description here',
  image: 'https://example.com/image.jpg',  // Product image URL
  badge: 'Best Seller',              // Optional: 'Best Seller', 'Gaming Pick', etc.
  specs: [
    'Spec 1 - details here',
    'Spec 2 - details here',
    'Spec 3 - details here'
  ],
  inStock: true
}
```

**To remove a product:** Delete its entire object from the array.

**To edit a product:** Find it in the array and update its fields.

**Image tips:**
- Use `https://images.unsplash.com` for free stock photos
- Images should be ~500x400px
- Keep URLs short

### 3. Add/Edit Services
**File:** `data/services.js`

```javascript
{
  id: 'service-id',                  // Unique ID
  name: 'Service Name',
  price: 'From $99',                 // Price display
  turnaround: '1-2 Days',           // Delivery time
  description: 'What this service does',
  image: '🔧',                       // Emoji for the service
  features: [
    'Feature 1',
    'Feature 2',
    'Feature 3'
  ]
}
```

**Common service emojis:**
- 🔧 Repair
- 🏢 Business
- 💾 Data
- 🌐 Networking
- ⚙️ Setup
- 🛡️ Security

### 4. Categories
**File:** `data/categories.js`

Don't typically need to edit—categories are auto-derived from product data. But you can customize here:

```javascript
{
  id: 'laptops',
  slug: 'laptops',
  name: 'Laptops',
  description: 'High-performance laptops for work, gaming, and creation',
  icon: '💻',
  color: '#38bdf8'  // Hex color for category
}
```

## 🎨 Design Changes

### Change Brand Colors
**File:** `public/styles/main.css`

```css
:root {
  --primary-dark: #0b0e1a;    /* Background */
  --accent: #38bdf8;           /* Primary accent (blue) */
  --gold: #fbbf24;             /* Highlight color */
  --success: #10b981;          /* Positive action (green) */
  --danger: #ef4444;           /* Error/warning (red) */
}
```

### Change Fonts
**File:** `views/layout.ejs`

Find the Google Fonts link and update:
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@400;700&display=swap">
```

Then update in `main.css`:
```css
--font-display: 'YourFont', sans-serif;  /* Headings */
--font-body: 'YourFont', sans-serif;     /* Body text */
```

## 🔧 Advanced Editing

### Add Product Badges
In `data/products.js`, set the `badge` field:

```javascript
badge: 'Best Seller'    // Shows gold badge on product
```

Available badges:
- `'Best Seller'`
- `'Gaming Pick'`
- `'Pro Choice'`
- `'Editor's Choice'`
- `'New Arrival'`

Any other text will display as a custom badge.

### Change Product Categories
To add a new category:

1. Update `data/categories.js`:
```javascript
{
  id: 'new-category',
  slug: 'new-category',
  name: 'New Category',
  icon: '🎯',
  color: '#8b5cf6'
}
```

2. Add products with `category: 'new-category'` in `data/products.js`

3. The category automatically appears in filters!

### Customize Product Specs
Product specs appear as a checklist on detail pages and as tags on listing pages.

In `data/products.js`:
```javascript
specs: [
  'Spec 1 with full details',
  'Spec 2 with full details',
  'Spec 3 with full details'
]
```

The first 2-3 specs show as tags on cards, all show on detail page.

## 🚀 Environment Variables

**File:** `.env`

```bash
PORT=3000                    # Server port
NODE_ENV=development         # or production

# Stripe
STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx

# Email (for contact form)
SMTP_HOST=smtp.gmail.com
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password

APP_URL=http://localhost:3000
```

## 📸 Product Image URLs

Use free stock photo sites:

### Unsplash
```
https://images.unsplash.com/photo-ID?w=500&h=400&fit=crop
```

### Pexels
```
https://images.pexels.com/photos/PHOTO_ID/pexels-photo-PHOTO_ID.jpeg
```

### Pixabay
```
https://pixabay.com/get/IMAGE_URL.jpg
```

## ✅ Before Going Live

- [ ] Update company info in `config.js`
- [ ] Add all your products in `products.js`
- [ ] Update all product images (use real product photos)
- [ ] Add your services in `services.js`
- [ ] Set Stripe API keys in `.env`
- [ ] Update contact email and phone
- [ ] Change colors to match brand
- [ ] Test all links and forms
- [ ] Check mobile view
- [ ] Deploy!

## 🐛 Troubleshooting

**Changes not showing?**
- Restart server: `Ctrl+C` then `npm run dev`
- Clear browser cache: `Ctrl+Shift+Delete`
- Check console for errors: `Ctrl+Shift+J`

**Products not appearing?**
- Check `category` matches a category slug
- Check product `id` is unique
- Restart server

**Checkout button not working?**
- Add Stripe keys to `.env`
- Restart server
- Check browser console for errors

**Contact form not sending?**
- Add SMTP details to `.env`
- Check spam folder
- Test with simple text first

## 📞 Need Help?

1. Check `README.md` for setup help
2. Look at existing examples in `data/` files
3. Check browser console for error messages
4. Verify all required fields are filled in

Happy editing! 🚀
