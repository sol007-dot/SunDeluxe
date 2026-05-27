// Initialize Stripe
let stripe = null;
let elements = null;

if (window.STRIPE_PUBLIC_KEY) {
  stripe = Stripe(window.STRIPE_PUBLIC_KEY);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      name: document.getElementById('name')?.value,
      email: document.getElementById('email')?.value,
      phone: document.getElementById('phone')?.value,
      inquiryType: document.getElementById('inquiryType')?.value,
      message: document.getElementById('message')?.value
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        showNotification('Thank you! We will get back to you soon.', 'success');
        contactForm.reset();
      } else {
        showNotification(data.error || 'Something went wrong', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Failed to send message', 'error');
    }
  });
}

// Category Filter
const categoryButtons = document.querySelectorAll('.category-btn');
categoryButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all buttons
    categoryButtons.forEach(b => b.classList.remove('active'));
    // Add active class to clicked button
    btn.classList.add('active');

    // Get the category from data attribute or href
    const category = btn.dataset.category || btn.getAttribute('href')?.split('=')[1];

    if (category && category !== 'all') {
      window.location.href = `/shop?category=${category}`;
    } else if (category === 'all') {
      window.location.href = '/shop';
    }
  });
});

// Set active category button on load
const urlParams = new URLSearchParams(window.location.search);
const activeCategory = urlParams.get('category') || 'all';
const activeBtn = document.querySelector(`[data-category="${activeCategory}"]`);
if (activeBtn) {
  activeBtn.classList.add('active');
}

// Stripe Checkout Handler
async function handleCheckout(productId, productName, price) {
  if (!stripe) {
    showNotification('Stripe is not configured. Please try again later.', 'error');
    return;
  }

  const items = [{
    productId: productId,
    quantity: 1
  }];

  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items, email: 'customer@example.com' })
    });

    const data = await response.json();

    if (data.error) {
      showNotification(data.error, 'error');
      return;
    }

    // Redirect to Stripe checkout
    const { error } = await stripe.redirectToCheckout({
      sessionId: data.sessionId
    });

    if (error) {
      showNotification(error.message, 'error');
    }
  } catch (error) {
    console.error('Checkout error:', error);
    showNotification('Checkout failed', 'error');
  }
}

// Notification System
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Add styles if not already in CSS
  if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        color: white;
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
      }
      .notification-success {
        background: #10b981;
      }
      .notification-error {
        background: #ef4444;
      }
      .notification-info {
        background: #38bdf8;
      }
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);

  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out forwards';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Add to cart functionality (if needed)
function addToCart(productId, productName, price) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: productId, name: productName, price: price, quantity: 1 });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  showNotification(`${productName} added to cart!`, 'success');
}

// Page load animations
document.addEventListener('DOMContentLoaded', () => {
  // Add animation to cards on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.card, .product-card, .service-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});

// Mobile menu toggle (if you add a hamburger menu later)
function toggleMobileMenu() {
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) {
    navLinks.classList.toggle('active');
  }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    // Close any open modals
    document.querySelectorAll('.modal').forEach(modal => {
      modal.style.display = 'none';
    });
  }
});

// Export for use in other scripts
window.DeluxeTech = {
  checkout: handleCheckout,
  addToCart: addToCart,
  notification: showNotification
};
