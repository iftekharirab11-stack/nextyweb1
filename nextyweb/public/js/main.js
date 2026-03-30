/* ============================================
   NextyWeb - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initNavigation();
  initSmoothScroll();
  initActiveNavLink();
  initFAQ();
  initFilterBar();
  initContactForm();
  initCTAForm();
  loadDynamicContent();
});

/* ============================================
   Navigation
   ============================================ */
function initNavigation() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  }
  
  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 16px rgba(27, 58, 107, 0.12)';
      } else {
        navbar.style.boxShadow = '0 2px 8px rgba(27, 58, 107, 0.08)';
      }
    });
  }
}

/* ============================================
   Smooth Scroll
   ============================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

/* ============================================
   Active Navigation Link
   ============================================ */
function initActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();
    if (linkPage === currentPage || 
        (currentPage === '' && linkPage === 'index.html') ||
        (currentPage === 'index.html' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ============================================
   FAQ Accordion
   ============================================ */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        // Close other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });
        
        // Toggle current item
        item.classList.toggle('active');
      });
    }
  });
}

/* ============================================
   Portfolio Filter Bar
   ============================================ */
function initFilterBar() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  
  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        // Filter cards
        portfolioCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
}

/* ============================================
   Contact Form
   ============================================ */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value,
        message: document.getElementById('message').value,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      };
      
      // Validate
      if (!formData.name || !formData.email || !formData.message) {
        showToast('Please fill in all required fields', 'error');
        return;
      }
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      try {
        // Save to Firestore
        await collections.leads.add(formData);
        
        // Send email via EmailJS
        const emailResult = await sendEmail(formData);
        
        showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
        contactForm.reset();
      } catch (error) {
        console.error('Error sending message:', error);
        showToast('Failed to send message. Please try again.', 'error');
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
}

/* ============================================
   CTA Form
   ============================================ */
function initCTAForm() {
  const ctaForm = document.getElementById('cta-form');
  
  if (ctaForm) {
    ctaForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = ctaForm.querySelector('input[type="email"]').value;
      
      if (!email) {
        showToast('Please enter your email address', 'error');
        return;
      }
      
      try {
        await collections.leads.add({
          email: email,
          type: 'cta',
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showToast('Thank you! We\'ll be in touch soon.', 'success');
        ctaForm.reset();
      } catch (error) {
        console.error('Error:', error);
        showToast('Something went wrong. Please try again.', 'error');
      }
    });
  }
}

/* ============================================
   Load Dynamic Content from Firestore
   ============================================ */
async function loadDynamicContent() {
  // Load services preview on homepage
  loadServicesPreview();
  
  // Load portfolio preview on homepage
  loadPortfolioPreview();
  
  // Load reviews preview on homepage
  loadReviewsPreview();
  
  // Load full services on services page
  loadServices();
  
  // Load full portfolio on portfolio page
  loadPortfolio();
  
  // Load full reviews on reviews page
  loadReviews();
  
  // Load blogs on blog page
  loadBlogs();
  
  // Load blog post
  loadBlogPost();
}

/* ============================================
   Load Services Preview (Homepage)
   ============================================ */
async function loadServicesPreview() {
  const container = document.getElementById('services-preview');
  if (!container) return;
  
  showLoading(container);
  
  try {
    const snapshot = await collections.services.orderBy('order').limit(3).get();
    
    if (snapshot.empty) {
      container.innerHTML = '<p class="text-center">No services available yet.</p>';
      return;
    }
    
    let html = '';
    snapshot.forEach(doc => {
      const service = doc.data();
      html += `
        <div class="card">
          <div class="card-icon">
            <svg viewBox="0 0 24 24"><use href="#icon-${service.icon || 'default'}"></use></svg>
          </div>
          <h3>${service.title}</h3>
          <p>${truncateText(service.description, 100)}</p>
          <a href="pages/services.html" class="btn btn-outline">Learn More</a>
        </div>
      `;
    });
    
    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading services:', error);
    container.innerHTML = '<p class="text-center">Error loading services.</p>';
  }
}

/* ============================================
   Load Portfolio Preview (Homepage)
   ============================================ */
async function loadPortfolioPreview() {
  const container = document.getElementById('portfolio-preview');
  if (!container) return;
  
  showLoading(container);
  
  try {
    const snapshot = await collections.portfolio.orderBy('date', 'desc').limit(3).get();
    
    if (snapshot.empty) {
      container.innerHTML = '<p class="text-center">No portfolio items available yet.</p>';
      return;
    }
    
    let html = '';
    snapshot.forEach(doc => {
      const project = doc.data();
      html += `
        <div class="portfolio-card" data-category="${project.category}">
          <img src="${project.imageUrl || 'https://placehold.co/400x300/1B3A6B/FFFFFF?text=Project'}" alt="${project.title}">
          <div class="portfolio-overlay">
            <h4>${project.title}</h4>
            <span>${project.category}</span>
          </div>
        </div>
      `;
    });
    
    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading portfolio:', error);
    container.innerHTML = '<p class="text-center">Error loading portfolio.</p>';
  }
}

/* ============================================
   Load Reviews Preview (Homepage)
   ============================================ */
async function loadReviewsPreview() {
  const container = document.getElementById('reviews-preview');
  if (!container) return;
  
  showLoading(container);
  
  try {
    const snapshot = await collections.reviews.orderBy('date', 'desc').limit(3).get();
    
    if (snapshot.empty) {
      container.innerHTML = '<p class="text-center">No reviews available yet.</p>';
      return;
    }
    
    let html = '';
    snapshot.forEach(doc => {
      const review = doc.data();
      html += `
        <div class="review-card">
          <div class="review-header">
            <img src="${review.avatarUrl || 'https://placehold.co/56x56/1B3A6B/FFFFFF?text=' + review.name.charAt(0)}" alt="${review.name}" class="review-avatar">
            <div class="review-info">
              <h4>${review.name}</h4>
              <span>${review.role || 'Client'}</span>
            </div>
          </div>
          <div class="review-stars">${generateStars(review.rating)}</div>
          <p class="review-text">"${truncateText(review.text, 150)}"</p>
        </div>
      `;
    });
    
    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading reviews:', error);
    container.innerHTML = '<p class="text-center">Error loading reviews.</p>';
  }
}

/* ============================================
   Load Full Services
   ============================================ */
async function loadServices() {
  const container = document.getElementById('services-grid');
  if (!container) return;
  
  showLoading(container);
  
  try {
    const snapshot = await collections.services.orderBy('order').get();
    
    if (snapshot.empty) {
      container.innerHTML = '<p class="text-center">No services available yet.</p>';
      return;
    }
    
    let html = '';
    snapshot.forEach(doc => {
      const service = doc.data();
      html += `
        <div class="card">
          <div class="card-icon">
            <svg viewBox="0 0 24 24"><use href="#icon-${service.icon || 'default'}"></use></svg>
          </div>
          <h3>${service.title}</h3>
          <p>${service.description}</p>
          <p class="price-range">${service.priceRange || 'Contact for pricing'}</p>
          <a href="contact.html" class="btn btn-primary">Get Started</a>
        </div>
      `;
    });
    
    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading services:', error);
    container.innerHTML = '<p class="text-center">Error loading services.</p>';
  }
}

/* ============================================
   Load Full Portfolio
   ============================================ */
async function loadPortfolio() {
  const container = document.getElementById('portfolio-grid');
  if (!container) return;
  
  showLoading(container);
  
  try {
    const snapshot = await collections.portfolio.orderBy('date', 'desc').get();
    
    if (snapshot.empty) {
      container.innerHTML = '<p class="text-center">No portfolio items available yet.</p>';
      return;
    }
    
    let html = '';
    snapshot.forEach(doc => {
      const project = doc.data();
      html += `
        <div class="portfolio-card" data-category="${project.category}">
          <img src="${project.imageUrl || 'https://placehold.co/400x300/1B3A6B/FFFFFF?text=Project'}" alt="${project.title}">
          <div class="portfolio-overlay">
            <h4>${project.title}</h4>
            <span>${project.category}</span>
            ${project.projectUrl ? `<a href="${project.projectUrl}" target="_blank" class="btn btn-secondary">View Project</a>` : ''}
          </div>
        </div>
      `;
    });
    
    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading portfolio:', error);
    container.innerHTML = '<p class="text-center">Error loading portfolio.</p>';
  }
}

/* ============================================
   Load Full Reviews
   ============================================ */
async function loadReviews() {
  const container = document.getElementById('reviews-grid');
  if (!container) return;
  
  showLoading(container);
  
  try {
    const snapshot = await collections.reviews.orderBy('date', 'desc').get();
    
    if (snapshot.empty) {
      container.innerHTML = '<p class="text-center">No reviews available yet.</p>';
      return;
    }
    
    let html = '';
    let totalRating = 0;
    let count = 0;
    
    snapshot.forEach(doc => {
      const review = doc.data();
      totalRating += review.rating;
      count++;
      
      html += `
        <div class="review-card">
          <div class="review-header">
            <img src="${review.avatarUrl || 'https://placehold.co/56x56/1B3A6B/FFFFFF?text=' + review.name.charAt(0)}" alt="${review.name}" class="review-avatar">
            <div class="review-info">
              <h4>${review.name}</h4>
              <span>${review.role || 'Client'}</span>
            </div>
          </div>
          <div class="review-stars">${generateStars(review.rating)}</div>
          <p class="review-text">"${review.text}"</p>
          <span class="review-date">${formatDate(review.date)}</span>
        </div>
      `;
    });
    
    // Update average rating
    const avgRating = count > 0 ? (totalRating / count).toFixed(1) : 0;
    const avgRatingEl = document.getElementById('avg-rating');
    if (avgRatingEl) {
      avgRatingEl.textContent = avgRating;
    }
    
    const totalReviewsEl = document.getElementById('total-reviews');
    if (totalReviewsEl) {
      totalReviewsEl.textContent = count;
    }
    
    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading reviews:', error);
    container.innerHTML = '<p class="text-center">Error loading reviews.</p>';
  }
}

/* ============================================
   Load Blogs
   ============================================ */
async function loadBlogs() {
  const container = document.getElementById('blog-grid');
  if (!container) return;
  
  showLoading(container);
  
  try {
    const snapshot = await collections.blogs.orderBy('date', 'desc').get();
    
    if (snapshot.empty) {
      container.innerHTML = '<p class="text-center">No blog posts available yet.</p>';
      return;
    }
    
    let html = '';
    snapshot.forEach(doc => {
      const blog = doc.data();
      html += `
        <div class="blog-card">
          <img src="${blog.thumbnail || 'https://placehold.co/400x200/1B3A6B/FFFFFF?text=Blog'}" alt="${blog.title}">
          <div class="blog-card-content">
            <div class="blog-card-meta">
              <span>${formatDate(blog.date)}</span>
              <span>${blog.author || 'NextyWeb Team'}</span>
            </div>
            <h3>${blog.title}</h3>
            <p>${truncateText(blog.excerpt || blog.content, 120)}</p>
            <a href="blog-post.html?id=${doc.id}" class="btn btn-outline">Read More</a>
          </div>
        </div>
      `;
    });
    
    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading blogs:', error);
    container.innerHTML = '<p class="text-center">Error loading blogs.</p>';
  }
}

/* ============================================
   Load Single Blog Post
   ============================================ */
async function loadBlogPost() {
  const container = document.getElementById('blog-post-content');
  if (!container) return;
  
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');
  
  if (!postId) {
    container.innerHTML = '<p class="text-center">Blog post not found.</p>';
    return;
  }
  
  showLoading(container);
  
  try {
    const doc = await collections.blogs.doc(postId).get();
    
    if (!doc.exists) {
      container.innerHTML = '<p class="text-center">Blog post not found.</p>';
      return;
    }
    
    const blog = doc.data();
    
    // Update page title and meta
    document.title = `${blog.title} | NextyWeb Blog`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', blog.excerpt || blog.content.substring(0, 160));
    }
    
    container.innerHTML = `
      <article class="blog-post">
        <img src="${blog.thumbnail || 'https://placehold.co/800x400/1B3A6B/FFFFFF?text=Blog'}" alt="${blog.title}" class="blog-post-image">
        <div class="blog-post-meta">
          <span>${formatDate(blog.date)}</span>
          <span>${blog.author || 'NextyWeb Team'}</span>
        </div>
        <h1>${blog.title}</h1>
        <div class="blog-post-body">
          ${blog.content}
        </div>
        <a href="blog.html" class="btn btn-outline">← Back to Blog</a>
      </article>
    `;
  } catch (error) {
    console.error('Error loading blog post:', error);
    container.innerHTML = '<p class="text-center">Error loading blog post.</p>';
  }
}
