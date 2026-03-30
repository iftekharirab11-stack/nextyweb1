/* ============================================
   NextyWeb - Firebase Configuration
   ============================================
   
   IMPORTANT: Replace the placeholder values below with your actual Firebase project credentials.
   
   To get your Firebase config:
   1. Go to https://console.firebase.google.com/
   2. Create a new project or select an existing one
   3. Click on the web icon (</>) to add a web app
   4. Register your app and copy the config object
   5. Paste your config values below
   
   ============================================ */

// Firebase configuration object
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Initialize Firebase Auth
const auth = firebase.auth();

// Initialize Firebase Storage
const storage = firebase.storage();

/* ============================================
   Firestore Collections Reference
   ============================================ */
const collections = {
  blogs: db.collection('blogs'),
  reviews: db.collection('reviews'),
  services: db.collection('services'),
  portfolio: db.collection('portfolio'),
  leads: db.collection('leads')
};

/* ============================================
   Helper Functions
   ============================================ */

// Show loading spinner
function showLoading(container) {
  container.innerHTML = `
    <div class="loading-container">
      <div class="spinner"></div>
    </div>
  `;
}

// Show toast notification
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.classList.add('show'), 100);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Format date
function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Generate star rating HTML
function generateStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += i <= rating ? '★' : '☆';
  }
  return stars;
}

// Truncate text
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/* ============================================
   EmailJS Configuration (for Contact Form)
   ============================================
   
   IMPORTANT: Replace with your EmailJS credentials.
   
   To set up EmailJS:
   1. Go to https://www.emailjs.com/
   2. Create an account and get your public key
   3. Create an email service and get your service ID
   4. Create an email template and get your template ID
   5. Paste your values below
   
   ============================================ */

const emailJSConfig = {
  publicKey: 'YOUR_EMAILJS_PUBLIC_KEY',
  serviceId: 'YOUR_EMAILJS_SERVICE_ID',
  templateId: 'YOUR_EMAILJS_TEMPLATE_ID'
};

// Initialize EmailJS (if loaded)
if (typeof emailjs !== 'undefined') {
  emailjs.init(emailJSConfig.publicKey);
}

// Send email via EmailJS
async function sendEmail(formData) {
  if (typeof emailjs === 'undefined') {
    console.warn('EmailJS not loaded');
    return { success: false, error: 'EmailJS not loaded' };
  }
  
  try {
    const response = await emailjs.send(
      emailJSConfig.serviceId,
      emailJSConfig.templateId,
      {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        service: formData.service,
        message: formData.message
      }
    );
    return { success: true, response };
  } catch (error) {
    return { success: false, error };
  }
}
