/**
 * Enhanced Navigation Components for NPHIES-AI Healthcare Platform
 * Comprehensive navigation with breadcrumbs, active states, and accessibility
 */

class NavigationManager {
    constructor() {
        this.currentPath = window.location.pathname;
        this.navigationItems = new Map();
        this.breadcrumbHistory = [];
        this.shortcuts = new Map();
        this.init();
    }

    init() {
        this.setupNavigationItems();
        this.createNavigationComponents();
        this.setupKeyboardShortcuts();
        this.setupAccessibility();
        this.bindEvents();
    }

    setupNavigationItems() {
        const navConfig = [
            {
                id: 'dashboard',
                path: '/dashboard',
                title: 'Dashboard',
                icon: 'dashboard',
                shortcut: 'Alt+D',
                category: 'main',
                description: 'Main dashboard with overview metrics'
            },
            {
                id: 'nphies',
                path: '/nphies',
                title: 'NPHIES Integration',
                icon: 'integration',
                shortcut: 'Alt+N',
                category: 'main',
                description: 'Saudi Health Insurance integration'
            },
            {
                id: 'eligibility',
                path: '/eligibility',
                title: 'Eligibility Check',
                icon: 'check-circle',
                shortcut: 'Alt+E',
                category: 'services',
                description: 'Verify patient insurance eligibility'
            },
            {
                id: 'claims',
                path: '/claims',
                title: 'Claims Processing',
                icon: 'file-text',
                shortcut: 'Alt+C',
                category: 'services',
                description: 'Submit and track insurance claims'
            },
            {
                id: 'pre-authorization',
                path: '/pre-authorization',
                title: 'Pre-Authorization',
                icon: 'shield-check',
                shortcut: 'Alt+P',
                category: 'services',
                description: 'Request procedure pre-authorization'
            },
            {
                id: 'ai-assistant',
                path: '/ai-assistant',
                title: 'AI Assistant',
                icon: 'bot',
                shortcut: 'Alt+A',
                category: 'ai',
                description: 'Intelligent healthcare assistant'
            },
            {
                id: 'health-services',
                path: '/health-services',
                title: 'AWS Health Services',
                icon: 'cloud',
                shortcut: 'Alt+H',
                category: 'ai',
                description: 'AWS AI and ML health services'
            },
            {
                id: 'ai-dashboard',
                path: '/ai-dashboard',
                title: 'AI Dashboard',
                icon: 'brain',
                shortcut: 'Alt+I',
                category: 'ai',
                description: 'AI performance and analytics'
            },
            {
                id: 'notifications',
                path: '/notifications',
                title: 'Notifications',
                icon: 'bell',
                shortcut: 'Alt+T',
                category: 'user',
                description: 'System notifications and alerts'
            },
            {
                id: 'profile',
                path: '/profile',
                title: 'Profile',
                icon: 'user',
                shortcut: 'Alt+U',
                category: 'user',
                description: 'User profile and preferences'
            },
            {
                id: 'settings',
                path: '/settings',
                title: 'Settings',
                icon: 'settings',
                shortcut: 'Alt+S',
                category: 'user',
                description: 'Application settings and configuration'
            }
        ];

        navConfig.forEach(item => {
            this.navigationItems.set(item.id, item);
            if (item.shortcut) {
                this.shortcuts.set(item.shortcut, item.path);
            }
        });
    }

    createNavigationComponents() {
        this.createMainNavigation();
        this.createBreadcrumbs();
        this.createQuickActions();
        this.createMobileNavigation();
    }

    createMainNavigation() {
        const navContainer = document.getElementById('main-navigation') || this.createNavContainer();
        
        const categories = this.groupNavigationByCategory();
        let navHTML = '';

        Object.entries(categories).forEach(([category, items]) => {
            navHTML += `
                <div class="nav-category" data-category="${category}">
                    <h3 class="nav-category-title">${this.getCategoryTitle(category)}</h3>
                    <ul class="nav-list">
                        ${items.map(item => this.createNavItem(item)).join('')}
                    </ul>
                </div>
            `;
        });

        navContainer.innerHTML = navHTML;
        this.updateActiveNavigation();
    }

    createNavContainer() {
        const container = document.createElement('nav');
        container.id = 'main-navigation';
        container.className = 'main-navigation';
        container.setAttribute('role', 'navigation');
        container.setAttribute('aria-label', 'Main navigation');
        
        const sidebar = document.querySelector('.sidebar') || document.body;
        sidebar.appendChild(container);
        
        return container;
    }

    createNavItem(item) {
        const isActive = this.currentPath === item.path;
        const activeClass = isActive ? 'active' : '';
        
        return `
            <li class="nav-item ${activeClass}" data-nav-id="${item.id}">
                <a href="${item.path}" 
                   data-route="${item.path}"
                   class="nav-link ${activeClass}"
                   title="${item.description}"
                   aria-label="${item.title} - ${item.description}"
                   ${item.shortcut ? `data-shortcut="${item.shortcut}"` : ''}>
                    <i class="nav-icon icon-${item.icon}" aria-hidden="true"></i>
                    <span class="nav-text">${item.title}</span>
                    ${item.shortcut ? `<span class="nav-shortcut">${item.shortcut}</span>` : ''}
                </a>
            </li>
        `;
    }

    groupNavigationByCategory() {
        const categories = {};
        
        this.navigationItems.forEach(item => {
            if (!categories[item.category]) {
                categories[item.category] = [];
            }
            categories[item.category].push(item);
        });
        
        return categories;
    }

    getCategoryTitle(category) {
        const titles = {
            main: 'Main',
            services: 'Healthcare Services',
            ai: 'AI & Analytics',
            user: 'User & Settings'
        };
        return titles[category] || category.charAt(0).toUpperCase() + category.slice(1);
    }

    createBreadcrumbs() {
        const breadcrumbContainer = document.getElementById('breadcrumbs') || this.createBreadcrumbContainer();
        this.updateBreadcrumbs();
    }

    createBreadcrumbContainer() {
        const container = document.createElement('nav');
        container.id = 'breadcrumbs';
        container.className = 'breadcrumbs';
        container.setAttribute('role', 'navigation');
        container.setAttribute('aria-label', 'Breadcrumb navigation');
        
        const header = document.querySelector('.header') || document.querySelector('.main-content');
        if (header) {
            header.insertBefore(container, header.firstChild);
        } else {
            document.body.appendChild(container);
        }
        
        return container;
    }

    updateBreadcrumbs() {
        const container = document.getElementById('breadcrumbs');
        if (!container) return;

        const breadcrumbs = this.generateBreadcrumbs();
        
        container.innerHTML = `
            <ol class="breadcrumb-list" role="list">
                ${breadcrumbs.map((crumb, index) => {
                    const isLast = index === breadcrumbs.length - 1;
                    return `
                        <li class="breadcrumb-item ${isLast ? 'active' : ''}" role="listitem">
                            ${isLast ? 
                                `<span class="breadcrumb-current" aria-current="page">${crumb.title}</span>` :
                                `<a href="${crumb.path}" data-route="${crumb.path}" class="breadcrumb-link">${crumb.title}</a>`
                            }
                            ${!isLast ? '<i class="breadcrumb-separator" aria-hidden="true">›</i>' : ''}
                        </li>
                    `;
                }).join('')}
            </ol>
        `;
    }

    generateBreadcrumbs() {
        const breadcrumbs = [{ title: 'Home', path: '/' }];
        
        if (this.currentPath !== '/') {
            const currentItem = Array.from(this.navigationItems.values())
                .find(item => item.path === this.currentPath);
            
            if (currentItem) {
                // Add parent breadcrumbs based on category
                if (currentItem.category !== 'main') {
                    breadcrumbs.push({
                        title: this.getCategoryTitle(currentItem.category),
                        path: this.getCategoryRootPath(currentItem.category)
                    });
                }
                
                breadcrumbs.push({
                    title: currentItem.title,
                    path: currentItem.path
                });
            } else {
                // Fallback for unknown paths
                breadcrumbs.push({
                    title: this.pathToTitle(this.currentPath),
                    path: this.currentPath
                });
            }
        }
        
        return breadcrumbs;
    }

    getCategoryRootPath(category) {
        const rootPaths = {
            services: '/dashboard',
            ai: '/ai-dashboard',
            user: '/profile'
        };
        return rootPaths[category] || '/dashboard';
    }

    pathToTitle(path) {
        return path.split('/').pop().split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ') || 'Page';
    }

    createQuickActions() {
        const quickActionsContainer = document.getElementById('quick-actions') || this.createQuickActionsContainer();
        
        const quickActions = [
            { id: 'new-claim', title: 'New Claim', icon: 'plus', action: () => window.navigate('/claims') },
            { id: 'check-eligibility', title: 'Check Eligibility', icon: 'search', action: () => window.navigate('/eligibility') },
            { id: 'ai-chat', title: 'AI Assistant', icon: 'message-circle', action: () => window.navigate('/ai-assistant') },
            { id: 'notifications', title: 'Notifications', icon: 'bell', action: () => this.toggleNotifications() }
        ];

        quickActionsContainer.innerHTML = `
            <div class="quick-actions-list">
                ${quickActions.map(action => `
                    <button class="quick-action-btn" 
                            data-action="${action.id}"
                            title="${action.title}"
                            aria-label="${action.title}">
                        <i class="icon-${action.icon}" aria-hidden="true"></i>
                        <span class="quick-action-text">${action.title}</span>
                    </button>
                `).join('')}
            </div>
        `;

        // Bind quick action events
        quickActions.forEach(action => {
            const btn = quickActionsContainer.querySelector(`[data-action="${action.id}"]`);
            if (btn) {
                btn.addEventListener('click', action.action);
            }
        });
    }

    createQuickActionsContainer() {
        const container = document.createElement('div');
        container.id = 'quick-actions';
        container.className = 'quick-actions';
        
        const header = document.querySelector('.header') || document.querySelector('.main-content');
        if (header) {
            header.appendChild(container);
        }
        
        return container;
    }

    createMobileNavigation() {
        const mobileNav = document.getElementById('mobile-navigation') || this.createMobileNavContainer();
        
        mobileNav.innerHTML = `
            <button class="mobile-nav-toggle" 
                    aria-label="Toggle navigation menu"
                    aria-expanded="false"
                    aria-controls="mobile-nav-menu">
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
            </button>
            
            <div class="mobile-nav-menu" id="mobile-nav-menu" role="menu">
                <div class="mobile-nav-header">
                    <h2>NPHIES-AI</h2>
                    <button class="mobile-nav-close" aria-label="Close navigation menu">×</button>
                </div>
                <div class="mobile-nav-content">
                    ${this.createMobileNavItems()}
                </div>
            </div>
            
            <div class="mobile-nav-overlay"></div>
        `;

        this.bindMobileNavEvents(mobileNav);
    }

    createMobileNavContainer() {
        const container = document.createElement('nav');
        container.id = 'mobile-navigation';
        container.className = 'mobile-navigation';
        container.setAttribute('role', 'navigation');
        container.setAttribute('aria-label', 'Mobile navigation');
        
        document.body.appendChild(container);
        return container;
    }

    createMobileNavItems() {
        const categories = this.groupNavigationByCategory();
        let html = '';

        Object.entries(categories).forEach(([category, items]) => {
            html += `
                <div class="mobile-nav-category">
                    <h3 class="mobile-nav-category-title">${this.getCategoryTitle(category)}</h3>
                    <ul class="mobile-nav-list" role="menu">
                        ${items.map(item => `
                            <li class="mobile-nav-item" role="menuitem">
                                <a href="${item.path}" 
                                   data-route="${item.path}"
                                   class="mobile-nav-link"
                                   aria-label="${item.title}">
                                    <i class="icon-${item.icon}" aria-hidden="true"></i>
                                    <span>${item.title}</span>
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        });

        return html;
    }

    bindMobileNavEvents(mobileNav) {
        const toggle = mobileNav.querySelector('.mobile-nav-toggle');
        const close = mobileNav.querySelector('.mobile-nav-close');
        const overlay = mobileNav.querySelector('.mobile-nav-overlay');
        const menu = mobileNav.querySelector('.mobile-nav-menu');

        const openMenu = () => {
            menu.classList.add('open');
            overlay.classList.add('active');
            toggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('mobile-nav-open');
        };

        const closeMenu = () => {
            menu.classList.remove('open');
            overlay.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('mobile-nav-open');
        };

        toggle.addEventListener('click', openMenu);
        close.addEventListener('click', closeMenu);
        overlay.addEventListener('click', closeMenu);

        // Close on navigation
        mobileNav.addEventListener('click', (e) => {
            if (e.target.matches('[data-route]')) {
                closeMenu();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('open')) {
                closeMenu();
            }
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            const shortcut = this.getShortcutKey(e);
            const path = this.shortcuts.get(shortcut);
            
            if (path && !this.isInputFocused()) {
                e.preventDefault();
                window.navigate(path);
            }
        });
    }

    getShortcutKey(e) {
        const parts = [];
        if (e.ctrlKey) parts.push('Ctrl');
        if (e.altKey) parts.push('Alt');
        if (e.shiftKey) parts.push('Shift');
        if (e.metaKey) parts.push('Meta');
        
        if (e.key && e.key !== 'Control' && e.key !== 'Alt' && e.key !== 'Shift' && e.key !== 'Meta') {
            parts.push(e.key.toUpperCase());
        }
        
        return parts.join('+');
    }

    isInputFocused() {
        const activeElement = document.activeElement;
        return activeElement && (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.contentEditable === 'true'
        );
    }

    setupAccessibility() {
        // Add skip links
        this.createSkipLinks();
        
        // Add focus management
        this.setupFocusManagement();
        
        // Add ARIA live regions
        this.createLiveRegions();
    }

    createSkipLinks() {
        const skipLinks = document.createElement('div');
        skipLinks.className = 'skip-links';
        skipLinks.innerHTML = `
            <a href="#main-content" class="skip-link">Skip to main content</a>
            <a href="#main-navigation" class="skip-link">Skip to navigation</a>
        `;
        
        document.body.insertBefore(skipLinks, document.body.firstChild);
    }

    setupFocusManagement() {
        // Focus management for route changes
        window.addEventListener('routechange', (e) => {
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.focus();
                mainContent.scrollIntoView();
            }
        });
    }

    createLiveRegions() {
        const liveRegion = document.createElement('div');
        liveRegion.id = 'live-region';
        liveRegion.className = 'sr-only';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        
        document.body.appendChild(liveRegion);
    }

    bindEvents() {
        // Listen for route changes
        window.addEventListener('routechange', (e) => {
            this.currentPath = e.detail.route.path;
            this.updateActiveNavigation();
            this.updateBreadcrumbs();
            this.announceRouteChange(e.detail.route);
        });

        // Listen for navigation clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-route]')) {
                this.handleNavigationClick(e);
            }
        });
    }

    handleNavigationClick(e) {
        const link = e.target.closest('[data-route]');
        const path = link.getAttribute('data-route');
        
        // Track navigation analytics
        this.trackNavigation(path, this.currentPath);
        
        // Update navigation state immediately for better UX
        this.preUpdateNavigation(path);
    }

    preUpdateNavigation(path) {
        // Remove active states
        document.querySelectorAll('.nav-item.active, .nav-link.active').forEach(el => {
            el.classList.remove('active');
        });
        
        // Add active state to new item
        const newActiveItem = document.querySelector(`[data-route="${path}"]`);
        if (newActiveItem) {
            newActiveItem.classList.add('active');
            const navItem = newActiveItem.closest('.nav-item');
            if (navItem) {
                navItem.classList.add('active');
            }
        }
    }

    updateActiveNavigation() {
        // Remove all active states
        document.querySelectorAll('.nav-item.active, .nav-link.active').forEach(el => {
            el.classList.remove('active');
        });
        
        // Add active state to current item
        const activeLink = document.querySelector(`[data-route="${this.currentPath}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            const navItem = activeLink.closest('.nav-item');
            if (navItem) {
                navItem.classList.add('active');
            }
        }
    }

    announceRouteChange(route) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = `Navigated to ${route.title}`;
        }
    }

    trackNavigation(to, from) {
        // Send navigation analytics
        if (window.gtag) {
            window.gtag('event', 'page_view', {
                page_path: to,
                page_title: this.getPageTitle(to)
            });
        }
        
        console.log(`Navigation tracked: ${from} → ${to}`);
    }

    getPageTitle(path) {
        const item = Array.from(this.navigationItems.values()).find(item => item.path === path);
        return item ? item.title : this.pathToTitle(path);
    }

    // Utility methods
    toggleNotifications() {
        const notificationsPanel = document.getElementById('notifications-panel');
        if (notificationsPanel) {
            notificationsPanel.classList.toggle('open');
        } else {
            // Navigate to notifications page if panel doesn't exist
            window.navigate('/notifications');
        }
    }

    // Public API
    getCurrentPath() {
        return this.currentPath;
    }

    getNavigationItems() {
        return Array.from(this.navigationItems.values());
    }

    addNavigationItem(item) {
        this.navigationItems.set(item.id, item);
        this.createMainNavigation(); // Refresh navigation
    }

    removeNavigationItem(id) {
        this.navigationItems.delete(id);
        this.createMainNavigation(); // Refresh navigation
    }

    updateNavigationItem(id, updates) {
        const item = this.navigationItems.get(id);
        if (item) {
            Object.assign(item, updates);
            this.createMainNavigation(); // Refresh navigation
        }
    }
}

// Initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.navigationManager = new NavigationManager();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationManager;
}
