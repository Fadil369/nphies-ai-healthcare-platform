/**
 * Enhanced Navigation System for NPHIES-AI Healthcare Platform
 * Fixes routing issues and provides smooth SPA navigation
 */

class NavigationManager {
    constructor() {
        this.routes = new Map();
        this.currentPath = window.location.pathname;
        this.init();
    }

    init() {
        this.setupRoutes();
        this.setupEventListeners();
        this.handleInitialLoad();
    }

    setupRoutes() {
        // Define all valid routes
        const routes = [
            { path: '/', title: 'Home' },
            { path: '/dashboard', title: 'Dashboard' },
            { path: '/nphies', title: 'NPHIES Integration' },
            { path: '/claims', title: 'Claims Processing' },
            { path: '/eligibility', title: 'Eligibility Check' },
            { path: '/pre-authorization', title: 'Pre-Authorization' },
            { path: '/ai-assistant', title: 'AI Assistant' },
            { path: '/health-services', title: 'AWS Health Services' },
            { path: '/profile', title: 'Profile' },
            { path: '/settings', title: 'Settings' },
            { path: '/notifications', title: 'Notifications' },
            { path: '/login', title: 'Login' }
        ];

        routes.forEach(route => {
            this.routes.set(route.path, route);
        });
    }

    setupEventListeners() {
        // Intercept all link clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');
            
            // Only handle internal routes
            if (href && href.startsWith('/') && !href.startsWith('//')) {
                // Check if it's a valid route
                if (this.routes.has(href)) {
                    e.preventDefault();
                    this.navigate(href);
                }
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            this.handleRoute(window.location.pathname);
        });
    }

    async navigate(path) {
        if (path === this.currentPath) return;

        try {
            // Update browser history
            window.history.pushState({ path }, '', path);
            
            // Handle the route
            await this.handleRoute(path);
            
        } catch (error) {
            console.error('Navigation error:', error);
            this.showError('Navigation failed');
        }
    }

    async handleRoute(path) {
        const route = this.routes.get(path);
        if (!route) {
            this.handle404(path);
            return;
        }

        try {
            // Show loading
            this.showLoading();

            // Update current path
            this.currentPath = path;

            // Update page title
            document.title = `${route.title} - NPHIES-AI Healthcare Platform`;

            // Load page content
            await this.loadPage(path);

            // Update navigation state
            this.updateNavigationState(path);

            // Hide loading
            this.hideLoading();

        } catch (error) {
            this.hideLoading();
            throw error;
        }
    }

    async loadPage(path) {
        try {
            // Map paths to actual files
            const pageMap = {
                '/': 'index.html',
                '/dashboard': 'dashboard.html',
                '/nphies': 'nphies.html',
                '/claims': 'claims.html',
                '/eligibility': 'eligibility.html',
                '/pre-authorization': 'pre-authorization.html',
                '/ai-assistant': 'ai-assistant.html',
                '/health-services': 'health-services.html',
                '/profile': 'profile.html',
                '/settings': 'settings.html',
                '/notifications': 'notifications.html',
                '/login': 'login.html'
            };

            const fileName = pageMap[path] || 'index.html';
            
            // For home page, don't reload if already there
            if (path === '/' && document.querySelector('.hero-section')) {
                return;
            }

            // Fetch page content
            const response = await fetch(`/static/${fileName}`);
            if (!response.ok) {
                throw new Error(`Failed to load ${fileName}`);
            }

            const html = await response.text();
            
            // Parse HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Extract body content
            const newContent = doc.body.innerHTML;
            
            // Update page content with smooth transition
            await this.updatePageContent(newContent);
            
            // Initialize page-specific features
            this.initializePage(path);

        } catch (error) {
            console.error('Failed to load page:', error);
            this.showError('Failed to load page content');
        }
    }

    async updatePageContent(newContent) {
        const body = document.body;
        
        // Add fade out effect
        body.style.opacity = '0.7';
        body.style.transition = 'opacity 0.2s ease';
        
        // Wait for fade out
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Update content
        body.innerHTML = newContent;
        
        // Fade back in
        body.style.opacity = '1';
        
        // Remove transition after animation
        setTimeout(() => {
            body.style.transition = '';
        }, 200);
    }

    initializePage(path) {
        // Initialize common features
        this.initializeCommonFeatures();
        
        // Page-specific initialization
        switch (path) {
            case '/dashboard':
                this.initializeDashboard();
                break;
            case '/ai-assistant':
                this.initializeAIAssistant();
                break;
            case '/claims':
                this.initializeClaims();
                break;
        }
    }

    initializeCommonFeatures() {
        // Re-initialize tooltips, modals, etc.
        this.initializeTooltips();
        this.initializeModals();
        
        // Reinitialize navigation event listeners for new content
        setTimeout(() => {
            this.setupEventListeners();
        }, 100);
    }

    initializeDashboard() {
        // Load dashboard data
        this.loadDashboardData();
    }

    initializeAIAssistant() {
        // Initialize AI chat features
        this.setupAIChat();
    }

    initializeClaims() {
        // Initialize claims processing features
        this.setupClaimsForm();
    }

    async loadDashboardData() {
        try {
            const response = await fetch('/health');
            if (response.ok) {
                const data = await response.json();
                this.updateDashboardMetrics(data);
            }
        } catch (error) {
            console.warn('Failed to load dashboard data:', error);
        }
    }

    updateDashboardMetrics(data) {
        // Update dashboard with real data
        const statusElement = document.getElementById('system-status');
        if (statusElement) {
            statusElement.textContent = data.status || 'Unknown';
            statusElement.className = `status ${data.status || 'unknown'}`;
        }
    }

    setupAIChat() {
        const chatForm = document.getElementById('chat-form');
        if (chatForm) {
            chatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleChatMessage(chatForm);
            });
        }
    }

    async handleChatMessage(form) {
        const messageInput = form.querySelector('input[name="message"]');
        const message = messageInput.value.trim();
        
        if (!message) return;
        
        try {
            // Add user message to chat
            this.addChatMessage(message, 'user');
            
            // Clear input
            messageInput.value = '';
            
            // Send to AI
            const response = await fetch('/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            
            if (response.ok) {
                const data = await response.json();
                this.addChatMessage(data.response, 'ai');
            } else {
                this.addChatMessage('Sorry, I encountered an error. Please try again.', 'ai');
            }
            
        } catch (error) {
            console.error('Chat error:', error);
            this.addChatMessage('Connection error. Please check your internet connection.', 'ai');
        }
    }

    addChatMessage(message, sender) {
        const chatContainer = document.getElementById('chat-messages');
        if (!chatContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${message}</p>
                <span class="message-time">${new Date().toLocaleTimeString()}</span>
            </div>
        `;
        
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    setupClaimsForm() {
        const claimsForm = document.getElementById('claims-form');
        if (claimsForm) {
            claimsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleClaimsSubmission(claimsForm);
            });
        }
    }

    async handleClaimsSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        try {
            this.showLoading();
            
            const response = await fetch('/claims/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                const result = await response.json();
                this.showSuccess('Claim submitted successfully!');
                form.reset();
            } else {
                this.showError('Failed to submit claim. Please try again.');
            }
            
        } catch (error) {
            console.error('Claims submission error:', error);
            this.showError('Network error. Please check your connection.');
        } finally {
            this.hideLoading();
        }
    }

    updateNavigationState(currentPath) {
        // Update active navigation items
        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath) {
                link.classList.add('active');
                link.parentElement?.classList.add('active');
            } else {
                link.classList.remove('active');
                link.parentElement?.classList.remove('active');
            }
        });
    }

    handleInitialLoad() {
        // Handle the current page on initial load
        this.handleRoute(this.currentPath);
    }

    handle404(path) {
        document.title = '404 - Page Not Found - NPHIES-AI Healthcare Platform';
        
        document.body.innerHTML = `
            <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
                <div class="text-center">
                    <div class="mb-8">
                        <h1 class="text-6xl font-bold text-white mb-4">404</h1>
                        <h2 class="text-2xl font-semibold text-gray-300 mb-4">Page Not Found</h2>
                        <p class="text-gray-400 mb-8">The page "${path}" could not be found.</p>
                    </div>
                    <div class="space-x-4">
                        <button onclick="window.navigation.navigate('/dashboard')" 
                                class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Go to Dashboard
                        </button>
                        <button onclick="history.back()" 
                                class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    showLoading() {
        // Create or show loading overlay
        let loader = document.getElementById('page-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'page-loader';
            loader.innerHTML = `
                <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div class="bg-white rounded-lg p-6 flex items-center space-x-3">
                        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span class="text-gray-700">Loading...</span>
                    </div>
                </div>
            `;
            document.body.appendChild(loader);
        }
        loader.style.display = 'block';
    }

    hideLoading() {
        const loader = document.getElementById('page-loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg text-white max-w-sm ${
            type === 'error' ? 'bg-red-600' : 
            type === 'success' ? 'bg-green-600' : 
            'bg-blue-600'
        }`;
        notification.innerHTML = `
            <div class="flex items-center justify-between">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                    ×
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    initializeTooltips() {
        document.querySelectorAll('[title]').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'absolute bg-black text-white px-2 py-1 rounded text-sm z-50';
                tooltip.textContent = e.target.getAttribute('title');
                document.body.appendChild(tooltip);
                
                const rect = e.target.getBoundingClientRect();
                tooltip.style.left = rect.left + 'px';
                tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
                
                e.target._tooltip = tooltip;
                e.target.removeAttribute('title'); // Prevent default tooltip
            });
            
            element.addEventListener('mouseleave', (e) => {
                if (e.target._tooltip) {
                    document.body.removeChild(e.target._tooltip);
                    delete e.target._tooltip;
                }
            });
        });
    }

    initializeModals() {
        document.querySelectorAll('[data-modal]').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = e.target.getAttribute('data-modal');
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.style.display = 'flex';
                }
            });
        });

        document.querySelectorAll('.modal-close, .modal-backdrop').forEach(closeElement => {
            closeElement.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }

    // Public API
    getCurrentPath() {
        return this.currentPath;
    }

    refresh() {
        this.handleRoute(this.currentPath);
    }
}

// Initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.navigation = new NavigationManager();
    
    // Expose navigation methods globally
    window.navigate = (path) => window.navigation.navigate(path);
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationManager;
}
