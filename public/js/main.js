let stripe = null;
let elements = null;

if (window.STRIPE_PUBLIC_KEY) {
  stripe = Stripe(window.STRIPE_PUBLIC_KEY);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        showNotification('Thank you! We will contact you soon.', 'success');
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

const categoryButtons = document.querySelectorAll('.category-btn');
categoryButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    categoryButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const category = btn.dataset.category;
    if (category && category !== 'all') {
      window.location.href = `/shop?category=${category}`;
    } else {
      window.location.href = '/shop';
    }
  });
});

const urlParams = new URLSearchParams(window.location.search);
const activeCategory = urlParams.get('category') || 'all';
const activeBtn = document.querySelector(`[data-category="${activeCategory}"]`);
if (activeBtn) activeBtn.classList.add('active');

async function handleCheckout(productId) {
  if (!stripe) {
    showNotification('Stripe is not configured.', 'error');
    return;
  }

  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [{ productId, quantity: 1 }], email: 'customer@example.com' })
    });

    const data = await response.json();

    if (data.error) {
      showNotification(data.error, 'error');
      return;
    }

    const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
    if (error) showNotification(error.message, 'error');
  } catch (error) {
    console.error('Checkout error:', error);
    showNotification('Checkout failed', 'error');
  }
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed; top: 20px; right: 20px; padding: 1rem 1.5rem;
    border-radius: 0.5rem; color: white; z-index: 9999; animation: slideIn 0.3s ease-out;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#38bdf8'};
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out forwards';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

window.DeluxeTech = { checkout: handleCheckout, notification: showNotification };
