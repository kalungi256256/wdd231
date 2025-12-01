// Authentication functionality for Pearl Beans Coffee

document.addEventListener('DOMContentLoaded', function() {
    initAuthForms();
    loadAccountPage();
});

// Initialize authentication forms
function initAuthForms() {
    // Toggle between login and register forms
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (showRegister && showLogin) {
        showRegister.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        });
        
        showLogin.addEventListener('click', function(e) {
            e.preventDefault();
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
        });
    }
    
    // Login form submission
    const loginFormElement = document.getElementById('loginFormElement');
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            // Simple validation
            if (email && password) {
                // Check if user exists in localStorage
                const userData = JSON.parse(localStorage.getItem('pbUserData') || '{}');
                
                if (userData.email === email) {
                    // For demo purposes, accept any password
                    // In real app, you would validate the password
                    
                    // Set login status
                    localStorage.setItem('pbLoggedIn', 'true');
                    
                    // Set expiration if "remember me" is checked
                    if (rememberMe) {
                        const expiration = new Date();
                        expiration.setDate(expiration.getDate() + 30); // 30 days
                        localStorage.setItem('pbLoginExpires', expiration.toISOString());
                    }
                    
                    // Redirect to account page
                    window.location.href = 'account.html';
                } else {
                    alert('Invalid email or password. Please try again.');
                }
            }
        });
    }
    
    // Terms and Privacy modals
    const showTerms = document.getElementById('showTerms');
    const showPrivacy = document.getElementById('showPrivacy');
    
    if (showTerms) {
        showTerms.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('termsModal').style.display = 'flex';
        });
    }
    
    if (showPrivacy) {
        showPrivacy.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('privacyModal').style.display = 'flex';
        });
    }
}

// Load account page content
function loadAccountPage() {
    const accountContainer = document.getElementById('accountContainer');
    if (!accountContainer) return;
    
    const userData = JSON.parse(localStorage.getItem('pbUserData') || '{}');
    const loggedIn = localStorage.getItem('pbLoggedIn');
    
    if (loggedIn !== 'true' || !userData.email) {
        // Not logged in, redirect to join page
        window.location.href = 'join.html';
        return;
    }
    
    // Generate account page content
    accountContainer.innerHTML = `
        <div class="account-grid">
            <div class="account-sidebar">
                <div class="user-profile">
                    <div class="profile-avatar">
                        ${userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <h3>${userData.name || 'User'}</h3>
                    <p>${userData.email || ''}</p>
                    <p class="user-type">${getUserTypeLabel(userData.userType)}</p>
                </div>
                
                <nav class="account-nav">
                    <a href="#" class="active" data-tab="dashboard">
                        <i class="fas fa-home"></i> Dashboard
                    </a>
                    <a href="#" data-tab="orders">
                        <i class="fas fa-shopping-bag"></i> Orders
                    </a>
                    <a href="#" data-tab="profile">
                        <i class="fas fa-user"></i> Profile
                    </a>
                    <a href="#" data-tab="settings">
                        <i class="fas fa-cog"></i> Settings
                    </a>
                    <a href="#" id="logoutBtn">
                        <i class="fas fa-sign-out-alt"></i> Log Out
                    </a>
                </nav>
            </div>
            
            <div class="account-content">
                <div class="account-tab active" id="dashboard">
                    <h2>Welcome, ${userData.name || 'User'}!</h2>
                    <div class="dashboard-stats">
                        <div class="stat-card">
                            <i class="fas fa-coffee"></i>
                            <h3>Total Orders</h3>
                            <p>0</p>
                        </div>
                        <div class="stat-card">
                            <i class="fas fa-dollar-sign"></i>
                            <h3>Total Spent</h3>
                            <p>$0.00</p>
                        </div>
                        <div class="stat-card">
                            <i class="fas fa-star"></i>
                            <h3>Member Since</h3>
                            <p>${new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                    
                    <div class="recent-orders">
                        <h3>Recent Orders</h3>
                        <p>You haven't placed any orders yet.</p>
                        <a href="products.html" class="btn btn-primary">Shop Now</a>
                    </div>
                </div>
                
                <div class="account-tab" id="orders">
                    <h2>Order History</h2>
                    <p>No orders yet. Start shopping to see your order history here.</p>
                </div>
                
                <div class="account-tab" id="profile">
                    <h2>Profile Information</h2>
                    <form id="profileForm">
                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" value="${userData.name || ''}">
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" value="${userData.email || ''}" readonly>
                        </div>
                        <div class="form-group">
                            <label>Phone</label>
                            <input type="tel" value="${userData.phone || ''}">
                        </div>
                        <div class="form-group">
                            <label>Country</label>
                            <input type="text" value="${userData.country || ''}">
                        </div>
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                    </form>
                </div>
                
                <div class="account-tab" id="settings">
                    <h2>Account Settings</h2>
                    <div class="settings-options">
                        <div class="setting">
                            <h4>Email Notifications</h4>
                            <label class="switch">
                                <input type="checkbox" checked>
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div class="setting">
                            <h4>Newsletter Subscription</h4>
                            <label class="switch">
                                <input type="checkbox" checked>
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Initialize tab switching
    const accountNav = document.querySelector('.account-nav');
    if (accountNav) {
        accountNav.addEventListener('click', function(e) {
            e.preventDefault();
            const link = e.target.closest('a');
            if (!link) return;
            
            if (link.id === 'logoutBtn') {
                document.getElementById('logoutModal').style.display = 'flex';
                return;
            }
            
            // Update active tab
            document.querySelectorAll('.account-nav a').forEach(a => a.classList.remove('active'));
            link.classList.add('active');
            
            const tabId = link.dataset.tab;
            document.querySelectorAll('.account-tab').forEach(tab => tab.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    }
    
    // Profile form submission
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Update user data
            userData.name = this.querySelector('input[type="text"]').value;
            userData.phone = this.querySelector('input[type="tel"]').value;
            userData.country = this.querySelectorAll('input')[3].value;
            
            localStorage.setItem('pbUserData', JSON.stringify(userData));
            
            alert('Profile updated successfully!');
        });
    }
    
    // Logout functionality
    const logoutModal = document.getElementById('logoutModal');
    const cancelLogout = document.getElementById('cancelLogout');
    const confirmLogout = document.getElementById('confirmLogout');
    
    if (logoutModal && cancelLogout && confirmLogout) {
        cancelLogout.addEventListener('click', function() {
            logoutModal.style.display = 'none';
        });
        
        confirmLogout.addEventListener('click', function() {
            // Clear login data
            localStorage.removeItem('pbLoggedIn');
            localStorage.removeItem('pbLoginExpires');
            
            // Redirect to home page
            window.location.href = 'index.html';
        });
    }
}

// Helper function to get user type label
function getUserTypeLabel(type) {
    const labels = {
        'buyer': 'Coffee Buyer',
        'roaster': 'Coffee Roaster',
        'retailer': 'Retailer',
        'enthusiast': 'Coffee Enthusiast',
        'farmer': 'Farmer/Supplier'
    };
    return labels[type] || 'Member';
}

export { initAuthForms, loadAccountPage };