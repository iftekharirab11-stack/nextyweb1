/* ============================================
   NextyWeb - Admin Dashboard JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize admin components
  initMobileMenu();
  initDashboardStats();
  initManageBlogs();
  initManageReviews();
  initManageServices();
  initManagePortfolio();
});

/* ============================================
   Mobile Menu Toggle
   ============================================ */
function initMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const sidebar = document.querySelector('.admin-sidebar');
  
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        sidebar.classList.remove('active');
      }
    });
  }
}

/* ============================================
   Dashboard Statistics
   ============================================ */
async function initDashboardStats() {
  const statsContainer = document.getElementById('dashboard-stats');
  if (!statsContainer) return;
  
  try {
    // Get counts from all collections
    const [blogsSnap, reviewsSnap, servicesSnap, portfolioSnap, leadsSnap] = await Promise.all([
      collections.blogs.get(),
      collections.reviews.get(),
      collections.services.get(),
      collections.portfolio.get(),
      collections.leads.get()
    ]);
    
    statsContainer.innerHTML = `
      <div class="dashboard-card">
        <div class="dashboard-card-icon">
          <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
        </div>
        <h3>${blogsSnap.size}</h3>
        <p>Blog Posts</p>
      </div>
      <div class="dashboard-card">
        <div class="dashboard-card-icon">
          <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        </div>
        <h3>${reviewsSnap.size}</h3>
        <p>Reviews</p>
      </div>
      <div class="dashboard-card">
        <div class="dashboard-card-icon">
          <svg viewBox="0 0 24 24"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 8h-8v-1c0-1.33 2.67-2 4-2s4 .67 4 2v1z"/></svg>
        </div>
        <h3>${servicesSnap.size}</h3>
        <p>Services</p>
      </div>
      <div class="dashboard-card">
        <div class="dashboard-card-icon">
          <svg viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
        </div>
        <h3>${portfolioSnap.size}</h3>
        <p>Portfolio</p>
      </div>
      <div class="dashboard-card">
        <div class="dashboard-card-icon">
          <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
        </div>
        <h3>${leadsSnap.size}</h3>
        <p>Leads</p>
      </div>
    `;
  } catch (error) {
    console.error('Error loading dashboard stats:', error);
    statsContainer.innerHTML = '<p>Error loading statistics.</p>';
  }
}

/* ============================================
   Manage Blogs
   ============================================ */
function initManageBlogs() {
  const blogForm = document.getElementById('blog-form');
  const blogsList = document.getElementById('blogs-list');
  
  if (blogForm) {
    // Initialize Quill editor
    let quillEditor = null;
    const editorContainer = document.getElementById('editor-container');
    
    if (editorContainer && typeof Quill !== 'undefined') {
      quillEditor = new Quill('#editor-container', {
        theme: 'snow',
        placeholder: 'Write your blog content here...',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
          ]
        }
      });
    }
    
    // Handle blog form submission
    blogForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const title = document.getElementById('blog-title').value;
      const excerpt = document.getElementById('blog-excerpt').value;
      const thumbnailInput = document.getElementById('blog-thumbnail');
      const published = document.getElementById('blog-published').checked;
      
      if (!title) {
        showToast('Please enter a blog title', 'error');
        return;
      }
      
      const content = quillEditor ? quillEditor.root.innerHTML : '';
      
      try {
        let thumbnailUrl = '';
        
        // Upload thumbnail if provided
        if (thumbnailInput.files.length > 0) {
          const file = thumbnailInput.files[0];
          const storageRef = storage.ref(`blogs/${Date.now()}_${file.name}`);
          await storageRef.put(file);
          thumbnailUrl = await storageRef.getDownloadURL();
        }
        
        // Save to Firestore
        await collections.blogs.add({
          title,
          content,
          excerpt,
          thumbnail: thumbnailUrl,
          published,
          author: auth.currentUser?.email || 'Admin',
          date: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showToast('Blog post created successfully!', 'success');
        blogForm.reset();
        if (quillEditor) quillEditor.setContents([]);
        
        // Reload blogs list
        loadBlogsList();
      } catch (error) {
        console.error('Error creating blog:', error);
        showToast('Error creating blog post', 'error');
      }
    });
  }
  
  // Load blogs list
  if (blogsList) {
    loadBlogsList();
  }
}

async function loadBlogsList() {
  const container = document.getElementById('blogs-list');
  if (!container) return;
  
  showLoading(container);
  
  try {
    const snapshot = await collections.blogs.orderBy('date', 'desc').get();
    
    if (snapshot.empty) {
      container.innerHTML = '<div class="empty-state"><h4>No blog posts yet</h4><p>Create your first blog post!</p></div>';
      return;
    }
    
    let html = '<table><thead><tr><th>Title</th><th>Author</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
    
    snapshot.forEach(doc => {
      const blog = doc.data();
      html += `
        <tr>
          <td>${blog.title}</td>
          <td>${blog.author || 'Admin'}</td>
          <td>${formatDate(blog.date)}</td>
          <td><span class="status-badge ${blog.published ? 'published' : 'draft'}">${blog.published ? 'Published' : 'Draft'}</span></td>
          <td class="data-table-actions">
            <button class="btn-icon delete" onclick="deleteBlog('${doc.id}')">
              <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </td>
        </tr>
      `;
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading blogs:', error);
    container.innerHTML = '<p>Error loading blogs.</p>';
  }
}

async function deleteBlog(id) {
  if (!confirm('Are you sure you want to delete this blog post?')) return;
  
  try {
    await collections.blogs.doc(id).delete();
    showToast('Blog post deleted', 'success');
    loadBlogsList();
  } catch (error) {
    console.error('Error deleting blog:', error);
    showToast('Error deleting blog post', 'error');
  }
}

/* ============================================
   Manage Reviews
   ============================================ */
function initManageReviews() {
  const reviewForm = document.getElementById('review-form');
  const reviewsList = document.getElementById('reviews-list');
  
  if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('review-name').value;
      const role = document.getElementById('review-role').value;
      const rating = parseInt(document.getElementById('review-rating').value);
      const text = document.getElementById('review-text').value;
      const avatarInput = document.getElementById('review-avatar');
      
      if (!name || !text || !rating) {
        showToast('Please fill in all required fields', 'error');
        return;
      }
      
      try {
        let avatarUrl = '';
        
        // Upload avatar if provided
        if (avatarInput.files.length > 0) {
          const file = avatarInput.files[0];
          const storageRef = storage.ref(`reviews/${Date.now()}_${file.name}`);
          await storageRef.put(file);
          avatarUrl = await storageRef.getDownloadURL();
        }
        
        // Save to Firestore
        await collections.reviews.add({
          name,
          role: role || 'Client',
          rating,
          text,
          avatarUrl,
          date: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showToast('Review added successfully!', 'success');
        reviewForm.reset();
        
        // Reload reviews list
        loadReviewsList();
      } catch (error) {
        console.error('Error adding review:', error);
        showToast('Error adding review', 'error');
      }
    });
  }
  
  // Load reviews list
  if (reviewsList) {
    loadReviewsList();
  }
}

async function loadReviewsList() {
  const container = document.getElementById('reviews-list');
  if (!container) return;
  
  showLoading(container);
  
  try {
    const snapshot = await collections.reviews.orderBy('date', 'desc').get();
    
    if (snapshot.empty) {
      container.innerHTML = '<div class="empty-state"><h4>No reviews yet</h4><p>Add your first review!</p></div>';
      return;
    }
    
    let html = '<table><thead><tr><th>Name</th><th>Rating</th><th>Review</th><th>Date</th><th>Actions</th></tr></thead><tbody>';
    
    snapshot.forEach(doc => {
      const review = doc.data();
      html += `
        <tr>
          <td>${review.name}</td>
          <td>${generateStars(review.rating)}</td>
          <td>${truncateText(review.text, 50)}</td>
          <td>${formatDate(review.date)}</td>
          <td class="data-table-actions">
            <button class="btn-icon delete" onclick="deleteReview('${doc.id}')">
              <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </td>
        </tr>
      `;
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading reviews:', error);
    container.innerHTML = '<p>Error loading reviews.</p>';
  }
}

async function deleteReview(id) {
  if (!confirm('Are you sure you want to delete this review?')) return;
  
  try {
    await collections.reviews.doc(id).delete();
    showToast('Review deleted', 'success');
    loadReviewsList();
  } catch (error) {
    console.error('Error deleting review:', error);
    showToast('Error deleting review', 'error');
  }
}

/* ============================================
   Manage Services
   ============================================ */
function initManageServices() {
  const serviceForm = document.getElementById('service-form');
  const servicesList = document.getElementById('services-list');
  
  if (serviceForm) {
    serviceForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const title = document.getElementById('service-title').value;
      const description = document.getElementById('service-description').value;
      const icon = document.getElementById('service-icon').value;
      const priceRange = document.getElementById('service-price').value;
      const order = parseInt(document.getElementById('service-order').value) || 0;
      
      if (!title || !description) {
        showToast('Please fill in all required fields', 'error');
        return;
      }
      
      try {
        await collections.services.add({
          title,
          description,
          icon: icon || 'default',
          priceRange: priceRange || 'Contact for pricing',
          order
        });
        
        showToast('Service added successfully!', 'success');
        serviceForm.reset();
        
        // Reload services list
        loadServicesList();
      } catch (error) {
        console.error('Error adding service:', error);
        showToast('Error adding service', 'error');
      }
    });
  }
  
  // Load services list
  if (servicesList) {
    loadServicesList();
  }
}

async function loadServicesList() {
  const container = document.getElementById('services-list');
  if (!container) return;
  
  showLoading(container);
  
  try {
    const snapshot = await collections.services.orderBy('order').get();
    
    if (snapshot.empty) {
      container.innerHTML = '<div class="empty-state"><h4>No services yet</h4><p>Add your first service!</p></div>';
      return;
    }
    
    let html = '<table><thead><tr><th>Title</th><th>Price Range</th><th>Order</th><th>Actions</th></tr></thead><tbody>';
    
    snapshot.forEach(doc => {
      const service = doc.data();
      html += `
        <tr>
          <td>${service.title}</td>
          <td>${service.priceRange}</td>
          <td>${service.order}</td>
          <td class="data-table-actions">
            <button class="btn-icon delete" onclick="deleteService('${doc.id}')">
              <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </td>
        </tr>
      `;
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading services:', error);
    container.innerHTML = '<p>Error loading services.</p>';
  }
}

async function deleteService(id) {
  if (!confirm('Are you sure you want to delete this service?')) return;
  
  try {
    await collections.services.doc(id).delete();
    showToast('Service deleted', 'success');
    loadServicesList();
  } catch (error) {
    console.error('Error deleting service:', error);
    showToast('Error deleting service', 'error');
  }
}

/* ============================================
   Manage Portfolio
   ============================================ */
function initManagePortfolio() {
  const portfolioForm = document.getElementById('portfolio-form');
  const portfolioList = document.getElementById('portfolio-list');
  
  if (portfolioForm) {
    portfolioForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const title = document.getElementById('portfolio-title').value;
      const category = document.getElementById('portfolio-category').value;
      const projectUrl = document.getElementById('portfolio-url').value;
      const imageInput = document.getElementById('portfolio-image');
      
      if (!title || !category) {
        showToast('Please fill in all required fields', 'error');
        return;
      }
      
      try {
        let imageUrl = '';
        
        // Upload image if provided
        if (imageInput.files.length > 0) {
          const file = imageInput.files[0];
          const storageRef = storage.ref(`portfolio/${Date.now()}_${file.name}`);
          await storageRef.put(file);
          imageUrl = await storageRef.getDownloadURL();
        }
        
        // Save to Firestore
        await collections.portfolio.add({
          title,
          category,
          imageUrl,
          projectUrl: projectUrl || '',
          date: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showToast('Portfolio item added successfully!', 'success');
        portfolioForm.reset();
        
        // Reload portfolio list
        loadPortfolioList();
      } catch (error) {
        console.error('Error adding portfolio item:', error);
        showToast('Error adding portfolio item', 'error');
      }
    });
  }
  
  // Load portfolio list
  if (portfolioList) {
    loadPortfolioList();
  }
}

async function loadPortfolioList() {
  const container = document.getElementById('portfolio-list');
  if (!container) return;
  
  showLoading(container);
  
  try {
    const snapshot = await collections.portfolio.orderBy('date', 'desc').get();
    
    if (snapshot.empty) {
      container.innerHTML = '<div class="empty-state"><h4>No portfolio items yet</h4><p>Add your first project!</p></div>';
      return;
    }
    
    let html = '<table><thead><tr><th>Image</th><th>Title</th><th>Category</th><th>Date</th><th>Actions</th></tr></thead><tbody>';
    
    snapshot.forEach(doc => {
      const project = doc.data();
      html += `
        <tr>
          <td><img src="${project.imageUrl || 'https://placehold.co/60x60/1B3A6B/FFFFFF?text=Img'}" alt="${project.title}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;"></td>
          <td>${project.title}</td>
          <td>${project.category}</td>
          <td>${formatDate(project.date)}</td>
          <td class="data-table-actions">
            <button class="btn-icon delete" onclick="deletePortfolioItem('${doc.id}')">
              <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </td>
        </tr>
      `;
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading portfolio:', error);
    container.innerHTML = '<p>Error loading portfolio.</p>';
  }
}

async function deletePortfolioItem(id) {
  if (!confirm('Are you sure you want to delete this portfolio item?')) return;
  
  try {
    await collections.portfolio.doc(id).delete();
    showToast('Portfolio item deleted', 'success');
    loadPortfolioList();
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    showToast('Error deleting portfolio item', 'error');
  }
}

// Make functions globally available
window.deleteBlog = deleteBlog;
window.deleteReview = deleteReview;
window.deleteService = deleteService;
window.deletePortfolioItem = deletePortfolioItem;
