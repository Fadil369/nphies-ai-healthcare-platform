/**
 * Enhanced Router System for NPHIES-AI Healthcare Platform
 * Comprehensive routing with navigation guards, error handling, and AWS integration
 */

class EnhancedRouter {
    constructor() {
        this.routes = new Map();
        this.middlewares = [];
        this.currentRoute = null;
        this.history = [];
        this.authRequired = new Set();
        this.loadingStates = new Map();
        this.breadcrumbs = [];
        this.init();
    }

    init() {
        this.setupRoutes();
        this.setupEventListeners();
        this.handleInitialRoute();
        this.setupNavigationGuards();
    }

    setupRoutes() {
        // Define all application routes with metadata
        const routeConfig = [
            { path: '/', component: 'index.html', title: 'Home', auth: false, breadcrumb: 'Home' },
            { path: '/login', component: 'login.html', title: 'Login', auth: false, breadcrumb: 'Login' },
            { path: '/dashboard', component: 'dashboard.html', title: 'Dashboard', auth: true, breadcrumb: 'Dashboard' },
            { path: '/nphies', component: 'nphies.html', title: 'NPHIES Integration', auth: true, breadcrumb: 'NPHIES' },
            { path: '/profile', component: 'profile.html', title: 'Profile', auth: true, breadcrumb: 'Profile' },
            { path: '/notifications', component: 'notifications.html', title: 'Notifications', auth: true, breadcrumb: 'Notifications' },
            { path: '/pre-authorization', component: 'pre-authorization.html', title: 'Pre-Authorization', auth: true, breadcrumb: 'Pre-Auth' },
            { path: '/eligibility', component: 'eligibility.html', title: 'Eligibility Check', auth: true, breadcrumb: 'Eligibility' },
            { path: '/ai-assistant', component: 'ai-assistant.html', title: 'AI Assistant', auth: true, breadcrumb: 'AI Assistant' },
            { path: '/claims', component: 'claims.html', title: 'Claims Processing', auth: true, breadcrumb: 'Claims' },
            { path: '/settings', component: 'settings.html', title: 'Settings', auth: true, breadcrumb: 'Settings' },
            { path: '/health-services', component: 'health-services.html', title: 'AWS Health Services', auth: true, breadcrumb: 'Health Services' },
            { path: '/ai-dashboard', component: 'ai-dashboard.html', title: 'AI Dashboard', auth: true, breadcrumb: 'AI Dashboard' }
        ];

        routeConfig.forEach(route => {
            this.routes.set(route.path, route);
            if (route.auth) {
                this.authRequired.add(route.path);
            }
        });
    }

    setupEventListeners() {
        // Handle browser navigation
        window.addEventListener('popstate', (e) => {
            this.handleRoute(window.location.pathname, false);
        });

        // Handle navigation clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-route]')) {
                e.preventDefault();
                const path = e.target.getAttribute('data-route');
                this.navigate(path);
            }
        });

        // Handle form submissions with routing
        document.addEventListener('submit', (e) => {
            if (e.target.matches('[data-route-submit]')) {
                e.preventDefault();
                const path = e.target.getAttribute('data-route-submit');
                this.navigate(path);
            }
        });
    }

    setupNavigationGuards() {
        // Authentication guard
        this.addMiddleware(async (to, from, next) => {
            if (this.authRequired.has(to.path)) {
                const isAuthenticated = await this.checkAuthentication();
                if (!isAuthenticated) {
                    this.showNotification('Authentication required', 'warning');
                    return this.navigate('/login');
                }
            }
            next();
        });

        // Loading state guard
        this.addMiddleware(async (to, from, next) => {
            this.showLoadingState(to.path);
            next();
        });

        // Analytics guard
        this.addMiddleware(async (to, from, next) => {
            this.trackNavigation(to, from);
            next();
        });
    }

    addMiddleware(middleware) {
        this.middlewares.push(middleware);
    }

    async navigate(path, addToHistory = true) {
        try {
            const route = this.routes.get(path);
            if (!route) {
                return this.handle404(path);
            }

            // Run middlewares
            for (const middleware of this.middlewares) {
                let shouldContinue = false;
                await middleware(route, this.currentRoute, () => {
                    shouldContinue = true;
                });
                if (!shouldContinue) return;
            }

            await this.handleRoute(path, addToHistory);
        } catch (error) {
            this.handleError(error, path);
        }
    }

    async handleRoute(path, addToHistory = true) {
        const route = this.routes.get(path);
        if (!route) {
            return this.handle404(path);
        }

        try {
            // Update browser history
            if (addToHistory) {
                window.history.pushState({ path }, route.title, path);
            }

            // Update current route
            this.currentRoute = route;
            this.history.push({ path, timestamp: Date.now() });

            // Update page title
            document.title = `${route.title} - NPHIES-AI Healthcare Platform`;

            // Update breadcrumbs
            this.updateBreadcrumbs(route);

            // Load component
            await this.loadComponent(route);

            // Update navigation state
            this.updateNavigationState(path);

            // Hide loading state
            this.hideLoadingState(path);

            // Trigger route change event
            this.triggerRouteChange(route);

        } catch (error) {
            this.handleError(error, path);
        }
    }

    async loadComponent(route) {
        try {
            // Show loading indicator
            this.showPageLoading();

            // Fetch component content
            const response = await fetch(`/static/${route.component}`);
            if (!response.ok) {
                throw new Error(`Failed to load ${route.component}: ${response.status}`);
            }

            const content = await response.text();
            
            // Parse and inject content
            const parser = new DOMParser();
            const doc = parser.parseFromString(content, 'text/html');
            
            // Extract body content
            const bodyContent = doc.body.innerHTML;
            
            // Update main content area
            const mainContent = document.getElementById('main-content') || document.body;
            mainContent.innerHTML = bodyContent;

            // Execute any scripts in the loaded content
            this.executeScripts(doc);

            // Initialize page-specific functionality
            await this.initializePageFeatures(route);

            this.hidePageLoading();

        } catch (error) {
            this.hidePageLoading();
            throw error;
        }
    }

    executeScripts(doc) {
        const scripts = doc.querySelectorAll('script');
        scripts.forEach(script => {
            if (script.src) {
                // External script
                const newScript = document.createElement('script');
                newScript.src = script.src;
                newScript.async = true;
                document.head.appendChild(newScript);
            } else {
                // Inline script
                try {
                    eval(script.textContent);
                } catch (error) {
                    console.warn('Script execution error:', error);
                }
            }
        });
    }

    async initializePageFeatures(route) {
        // Initialize common features
        this.initializeTooltips();
        this.initializeModals();
        this.initializeFormValidation();

        // Page-specific initialization
        switch (route.path) {
            case '/dashboard':
                await this.initializeDashboard();
                break;
            case '/ai-assistant':
                await this.initializeAIAssistant();
                break;
            case '/health-services':
                await this.initializeHealthServices();
                break;
            case '/claims':
                await this.initializeClaims();
                break;
        }
    }

    async initializeDashboard() {
        // Load dashboard data
        try {
            const [healthData, analyticsData] = await Promise.all([
                fetch('/health').then(r => r.json()),
                fetch('/ai/analytics').then(r => r.json())
            ]);
            
            this.updateDashboardMetrics(healthData, analyticsData);
        } catch (error) {
            console.warn('Dashboard initialization error:', error);
        }
    }

    async initializeAIAssistant() {
        // Initialize WebSocket connection for real-time chat
        if (window.WebSocket) {
            try {
                const ws = new WebSocket(`ws://${window.location.host}/ws/chat`);
                window.aiWebSocket = ws;
                
                ws.onopen = () => {
                    this.showNotification('AI Assistant connected', 'success');
                };
                
                ws.onerror = () => {
                    this.showNotification('AI Assistant connection failed', 'error');
                };
            } catch (error) {
                console.warn('WebSocket initialization error:', error);
            }
        }
    }

    async initializeHealthServices() {
        // Load AWS health services status
        try {
            const servicesStatus = await fetch('/system/status').then(r => r.json());
            this.updateHealthServicesStatus(servicesStatus);
        } catch (error) {
            console.warn('Health services initialization error:', error);
        }
    }

    async initializeClaims() {
        // Initialize claims processing features
        this.setupClaimsValidation();
        this.setupClaimsAutoSave();
    }

    updateBreadcrumbs(route) {
        this.breadcrumbs = ['Home'];
        
        if (route.path !== '/') {
            this.breadcrumbs.push(route.breadcrumb);
        }

        // Update breadcrumb UI
        const breadcrumbContainer = document.getElementById('breadcrumbs');
        if (breadcrumbContainer) {
            breadcrumbContainer.innerHTML = this.breadcrumbs
                .map((crumb, index) => {
                    const isLast = index === this.breadcrumbs.length - 1;
                    return `
                        <span class="breadcrumb-item ${isLast ? 'active' : ''}">
                            ${isLast ? crumb : `<a href="#" data-route="${this.getBreadcrumbPath(index)}">${crumb}</a>`}
                        </span>
                    `;
                })
                .join('<span class="breadcrumb-separator">›</span>');
        }
    }

    getBreadcrumbPath(index) {
        if (index === 0) return '/';
        return this.currentRoute?.path || '/';
    }

    updateNavigationState(currentPath) {
        // Update active navigation items
        document.querySelectorAll('[data-route]').forEach(link => {
            const linkPath = link.getAttribute('data-route');
            link.classList.toggle('active', linkPath === currentPath);
        });

        // Update sidebar navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            const link = item.querySelector('[data-route]');
            if (link) {
                const linkPath = link.getAttribute('data-route');
                item.classList.toggle('active', linkPath === currentPath);
            }
        });
    }

    showLoadingState(path) {
        this.loadingStates.set(path, true);
        
        // Show global loading indicator
        const loader = document.getElementById('route-loader');
        if (loader) {
            loader.style.display = 'block';
        }
    }

    hideLoadingState(path) {
        this.loadingStates.delete(path);
        
        // Hide global loading indicator
        const loader = document.getElementById('route-loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }

    showPageLoading() {
        const pageLoader = document.getElementById('page-loader');
        if (pageLoader) {
            pageLoader.style.display = 'flex';
        }
    }

    hidePageLoading() {
        const pageLoader = document.getElementById('page-loader');
        if (pageLoader) {
            pageLoader.style.display = 'none';
        }
    }

    handle404(path) {
        console.warn(`Route not found: ${path}`);
        
        // Show 404 page
        const mainContent = document.getElementById('main-content') || document.body;
        mainContent.innerHTML = `
            <div class="error-page">
                <div class="error-content">
                    <h1 class="error-code">404</h1>
                    <h2 class="error-title">Page Not Found</h2>
                    <p class="error-message">The page "${path}" could not be found.</p>
                    <div class="error-actions">
                        <button class="btn btn-primary" data-route="/dashboard">Go to Dashboard</button>
                        <button class="btn btn-secondary" onclick="history.back()">Go Back</button>
                    </div>
                </div>
            </div>
        `;

        // Update title
        document.title = '404 - Page Not Found - NPHIES-AI Healthcare Platform';
        
        // Track 404 error
        this.trackError('404', path);
    }

    handleError(error, path) {
        console.error(`Routing error for ${path}:`, error);
        
        // Show error page
        const mainContent = document.getElementById('main-content') || document.body;
        mainContent.innerHTML = `
            <div class="error-page">
                <div class="error-content">
                    <h1 class="error-code">Error</h1>
                    <h2 class="error-title">Something went wrong</h2>
                    <p class="error-message">Failed to load the requested page.</p>
                    <div class="error-actions">
                        <button class="btn btn-primary" onclick="location.reload()">Retry</button>
                        <button class="btn btn-secondary" data-route="/dashboard">Go to Dashboard</button>
                    </div>
                </div>
            </div>
        `;

        // Hide loading states
        this.hideLoadingState(path);
        this.hidePageLoading();
        
        // Track error
        this.trackError('routing_error', path, error.message);
        
        // Show notification
        this.showNotification('Failed to load page', 'error');
    }

    async checkAuthentication() {
        try {
            // Check for auth token
            const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
            if (!token) return false;

            // Validate token with server
            const response = await fetch('/auth/validate', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            return response.ok;
        } catch (error) {
            console.warn('Authentication check failed:', error);
            return false;
        }
    }

    handleInitialRoute() {
        const currentPath = window.location.pathname;
        this.handleRoute(currentPath, false);
    }

    // Utility methods
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);

        // Handle close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
    }

    trackNavigation(to, from) {
        // Analytics tracking
        if (window.gtag) {
            window.gtag('config', 'GA_MEASUREMENT_ID', {
                page_path: to.path,
                page_title: to.title
            });
        }

        // Custom analytics
        console.log(`Navigation: ${from?.path || 'initial'} → ${to.path}`);
    }

    trackError(type, path, message = '') {
        console.error(`Error tracked: ${type} at ${path}`, message);
        
        // Send to analytics/monitoring service
        if (window.gtag) {
            window.gtag('event', 'exception', {
                description: `${type}: ${path} - ${message}`,
                fatal: false
            });
        }
    }

    triggerRouteChange(route) {
        // Dispatch custom event
        const event = new CustomEvent('routechange', {
            detail: { route, router: this }
        });
        window.dispatchEvent(event);
    }

    // Helper methods for page initialization
    initializeTooltips() {
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = e.target.getAttribute('data-tooltip');
                document.body.appendChild(tooltip);
                
                const rect = e.target.getBoundingClientRect();
                tooltip.style.left = rect.left + 'px';
                tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
                
                e.target._tooltip = tooltip;
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
                const modalId = e.target.getAttribute('data-modal');
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.style.display = 'flex';
                }
            });
        });

        document.querySelectorAll('.modal-close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }

    initializeFormValidation() {
        document.querySelectorAll('form[data-validate]').forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
        });
    }

    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });
        
        return isValid;
    }

    // Dashboard specific methods
    updateDashboardMetrics(healthData, analyticsData) {
        // Update health metrics
        const healthStatus = document.getElementById('health-status');
        if (healthStatus) {
            healthStatus.textContent = healthData.status;
            healthStatus.className = `status ${healthData.status}`;
        }

        // Update AI metrics
        const aiStatus = document.getElementById('ai-status');
        if (aiStatus) {
            aiStatus.textContent = analyticsData.ai_status;
        }
    }

    updateHealthServicesStatus(servicesData) {
        const servicesContainer = document.getElementById('aws-services-status');
        if (servicesContainer && servicesData.aws_services_status) {
            // Update AWS services status display
            Object.entries(servicesData.aws_services_status).forEach(([category, services]) => {
                Object.entries(services).forEach(([service, status]) => {
                    const serviceElement = document.getElementById(`service-${service}`);
                    if (serviceElement) {
                        serviceElement.className = `service-status ${status.status}`;
                        serviceElement.textContent = status.status;
                    }
                });
            });
        }
    }

    setupClaimsValidation() {
        const claimsForm = document.getElementById('claims-form');
        if (claimsForm) {
            claimsForm.addEventListener('input', (e) => {
                this.validateClaimsField(e.target);
            });
        }
    }

    validateClaimsField(field) {
        // Claims-specific validation logic
        const value = field.value.trim();
        let isValid = true;

        switch (field.name) {
            case 'patient_id':
                isValid = /^\d{10}$/.test(value);
                break;
            case 'procedure_code':
                isValid = /^[A-Z0-9]{3,10}$/.test(value);
                break;
            case 'amount':
                isValid = /^\d+(\.\d{2})?$/.test(value) && parseFloat(value) > 0;
                break;
        }

        field.classList.toggle('error', !isValid);
        return isValid;
    }

    setupClaimsAutoSave() {
        const claimsForm = document.getElementById('claims-form');
        if (claimsForm) {
            let autoSaveTimer;
            
            claimsForm.addEventListener('input', () => {
                clearTimeout(autoSaveTimer);
                autoSaveTimer = setTimeout(() => {
                    this.autoSaveClaims(claimsForm);
                }, 2000);
            });
        }
    }

    autoSaveClaims(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        localStorage.setItem('claims_draft', JSON.stringify({
            data,
            timestamp: Date.now()
        }));
        
        this.showNotification('Draft saved automatically', 'info');
    }

    // Public API methods
    getCurrentRoute() {
        return this.currentRoute;
    }

    getHistory() {
        return [...this.history];
    }

    canGoBack() {
        return this.history.length > 1;
    }

    goBack() {
        if (this.canGoBack()) {
            window.history.back();
        }
    }

    refresh() {
        if (this.currentRoute) {
            this.handleRoute(this.currentRoute.path, false);
        }
    }
}

// Initialize router when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.router = new EnhancedRouter();
    
    // Expose router methods globally
    window.navigate = (path) => window.router.navigate(path);
    window.goBack = () => window.router.goBack();
    window.refresh = () => window.router.refresh();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedRouter;
}
