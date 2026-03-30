/* ============================================
   NextyWeb - Admin Authentication
   ============================================ */

// Check authentication state
auth.onAuthStateChanged(user => {
  const currentPage = window.location.pathname;
  const isAdminPage = currentPage.includes('/admin/');
  const isLoginPage = currentPage.includes('index.html') || currentPage.endsWith('/admin/');
  
  if (isAdminPage && !isLoginPage) {
    // Protected admin page - check if logged in
    if (!user) {
      // Not logged in, redirect to login
      window.location.href = 'index.html';
    } else {
      // Logged in, update UI with user info
      updateUserInfo(user);
    }
  } else if (isLoginPage && user) {
    // Already logged in, redirect to dashboard
    window.location.href = 'dashboard.html';
  }
});

// Update user info in admin header
function updateUserInfo(user) {
  const userNameEl = document.querySelector('.admin-user-name');
  const userEmailEl = document.querySelector('.admin-user-email');
  const userAvatarEl = document.querySelector('.admin-user-avatar');
  
  if (userNameEl) {
    userNameEl.textContent = user.displayName || 'Admin';
  }
  
  if (userEmailEl) {
    userEmailEl.textContent = user.email;
  }
  
  if (userAvatarEl) {
    userAvatarEl.src = user.photoURL || 'https://placehold.co/40x40/1B3A6B/FFFFFF?text=A';
  }
}

// Login function
async function login(email, password) {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    let errorMessage = 'Login failed. Please try again.';
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address.';
        break;
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Please try again later.';
        break;
    }
    
    return { success: false, error: errorMessage };
  }
}

// Logout function
async function logout() {
  try {
    await auth.signOut();
    window.location.href = 'index.html';
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
}

// Initialize login form
document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('login-form');
  
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const errorEl = document.getElementById('login-error');
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      
      // Validate
      if (!email || !password) {
        if (errorEl) {
          errorEl.textContent = 'Please enter both email and password.';
          errorEl.classList.add('show');
        }
        return;
      }
      
      // Show loading state
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Signing in...';
      submitBtn.disabled = true;
      
      if (errorEl) {
        errorEl.classList.remove('show');
      }
      
      // Attempt login
      const result = await login(email, password);
      
      if (result.success) {
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
      } else {
        // Show error
        if (errorEl) {
          errorEl.textContent = result.error;
          errorEl.classList.add('show');
        }
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
  
  // Initialize logout buttons
  const logoutBtns = document.querySelectorAll('.logout-btn');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      await logout();
    });
  });
});

// Protect admin pages
function protectAdminPage() {
  const user = auth.currentUser;
  if (!user) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

// Get current user
function getCurrentUser() {
  return auth.currentUser;
}

// Check if user is admin (you can extend this with custom claims)
async function isUserAdmin() {
  const user = auth.currentUser;
  if (!user) return false;
  
  try {
    const idTokenResult = await user.getIdTokenResult();
    return idTokenResult.claims.admin === true;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}
