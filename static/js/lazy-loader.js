/**
 * Lazy Loading and Code Splitting System for NPHIES-AI Healthcare Platform
 * Optimized resource loading with route-based splitting and caching
 */

class LazyLoader {
    constructor() {
        this.loadedModules = new Map();
        this.loadingPromises = new Map();
        this.cache = new Map();
        this.preloadQueue = [];
        this.observers = new Map();
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupPreloadStrategies();
        this.setupServiceWorker();
    }

    // Route-based code splitting
    async loadRouteModule(routePath) {
        const moduleKey = this.getModuleKey(routePath);
        
        // Return cached module if available
        if (this.loadedModules.has(moduleKey)) {
            return this.loadedModules.get(moduleKey);
        }

        // Return existing loading promise if in progress
        if (this.loadingPromises.has(moduleKey)) {
            return this.loadingPromises.get(moduleKey);
        }

        // Start loading module
        const loadingPromise = this.loadModule(moduleKey, routePath);
        this.loadingPromises.set(moduleKey, loadingPromise);

        try {
            const module = await loadingPromise;
            this.loadedModules.set(moduleKey, module);
            this.loadingPromises.delete(moduleKey);
            return module;
        } catch (error) {
            this.loadingPromises.delete(moduleKey);
            throw error;
        }
    }

    async loadModule(moduleKey, routePath) {
        const moduleConfig = this.getModuleConfig(routePath);
        const startTime = performance.now();

        try {
            // Load CSS first for better perceived performance
            if (moduleConfig.css) {
                await this.loadCSS(moduleConfig.css);
            }

            // Load JavaScript modules
            const jsPromises = moduleConfig.js.map(jsFile => this.loadJS(jsFile));
            const jsModules = await Promise.all(jsPromises);

            // Load additional resources
            if (moduleConfig.resources) {
                await this.loadResources(moduleConfig.resources);
            }

            const loadTime = performance.now() - startTime;
            this.trackLoadPerformance(moduleKey, loadTime);

            return {
                key: moduleKey,
                js: jsModules,
                css: moduleConfig.css,
                loadTime,
                timestamp: Date.now()
            };
        } catch (error) {
            console.error(`Failed to load module ${moduleKey}:`, error);
            throw error;
        }
    }

    getModuleKey(routePath) {
        const routeModules = {
            '/': 'home',
            '/login': 'auth',
            '/dashboard': 'dashboard',
            '/nphies': 'nphies',
            '/eligibility': 'eligibility',
            '/claims': 'claims',
            '/pre-authorization': 'pre-auth',
            '/ai-assistant': 'ai-assistant',
            '/health-services': 'health-services',
            '/ai-dashboard': 'ai-dashboard',
            '/profile': 'profile',
            '/notifications': 'notifications',
            '/settings': 'settings'
        };
        
        return routeModules[routePath] || 'default';
    }

    getModuleConfig(routePath) {
        const configs = {
            '/dashboard': {
                js: ['/static/js/dashboard.js', '/static/js/charts.js'],
                css: ['/static/css/dashboard.css'],
                resources: ['/static/data/dashboard-config.json']
            },
            '/ai-assistant': {
                js: ['/static/js/ai-chat.js', '/static/js/websocket-client.js'],
                css: ['/static/css/ai-assistant.css'],
                resources: []
            },
            '/health-services': {
                js: ['/static/js/health-services.js', '/static/js/aws-integration.js'],
                css: ['/static/css/health-services.css'],
                resources: ['/static/data/aws-services-config.json']
            },
            '/claims': {
                js: ['/static/js/claims.js', '/static/js/form-validation.js'],
                css: ['/static/css/claims.css', '/static/css/forms.css'],
                resources: ['/static/data/claim-templates.json']
            },
            '/eligibility': {
                js: ['/static/js/eligibility.js', '/static/js/patient-search.js'],
                css: ['/static/css/eligibility.css'],
                resources: []
            },
            '/pre-authorization': {
                js: ['/static/js/pre-auth.js', '/static/js/procedure-lookup.js'],
                css: ['/static/css/pre-auth.css'],
                resources: ['/static/data/procedure-codes.json']
            },
            '/nphies': {
                js: ['/static/js/nphies-integration.js', '/static/js/real-time-status.js'],
                css: ['/static/css/nphies.css'],
                resources: []
            },
            '/ai-dashboard': {
                js: ['/static/js/ai-dashboard.js', '/static/js/monitoring.js', '/static/js/charts.js'],
                css: ['/static/css/ai-dashboard.css', '/static/css/monitoring.css'],
                resources: ['/static/data/ai-metrics.json']
            },
            '/profile': {
                js: ['/static/js/profile.js', '/static/js/user-preferences.js'],
                css: ['/static/css/profile.css'],
                resources: []
            },
            '/settings': {
                js: ['/static/js/settings.js', '/static/js/theme-manager.js'],
                css: ['/static/css/settings.css'],
                resources: ['/static/data/settings-schema.json']
            },
            '/notifications': {
                js: ['/static/js/notifications.js', '/static/js/push-notifications.js'],
                css: ['/static/css/notifications.css'],
                resources: []
            }
        };

        return configs[routePath] || {
            js: ['/static/js/default.js'],
            css: ['/static/css/default.css'],
            resources: []
        };
    }

    async loadCSS(cssFiles) {
        if (!Array.isArray(cssFiles)) {
            cssFiles = [cssFiles];
        }

        const promises = cssFiles.map(cssFile => {
            return new Promise((resolve, reject) => {
                // Check if already loaded
                if (document.querySelector(`link[href="${cssFile}"]`)) {
                    resolve();
                    return;
                }

                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = cssFile;
                link.onload = resolve;
                link.onerror = reject;
                
                document.head.appendChild(link);
            });
        });

        return Promise.all(promises);
    }

    async loadJS(jsFile) {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if (document.querySelector(`script[src="${jsFile}"]`)) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = jsFile;
            script.async = true;
            script.onload = () => resolve(script);
            script.onerror = reject;
            
            document.head.appendChild(script);
        });
    }

    async loadResources(resources) {
        const promises = resources.map(async (resource) => {
            try {
                const response = await fetch(resource);
                if (!response.ok) {
                    throw new Error(`Failed to load resource: ${resource}`);
                }
                const data = await response.json();
                this.cache.set(resource, data);
                return data;
            } catch (error) {
                console.warn(`Failed to load resource ${resource}:`, error);
                return null;
            }
        });

        return Promise.all(promises);
    }

    // Preloading strategies
    setupPreloadStrategies() {
        // Preload critical routes
        this.preloadCriticalRoutes();
        
        // Preload on hover
        this.setupHoverPreload();
        
        // Preload on idle
        this.setupIdlePreload();
    }

    preloadCriticalRoutes() {
        const criticalRoutes = ['/dashboard', '/ai-assistant'];
        
        // Preload after initial page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                criticalRoutes.forEach(route => {
                    this.preloadRoute(route);
                });
            }, 1000);
        });
    }

    setupHoverPreload() {
        document.addEventListener('mouseover', (e) => {
            const link = e.target.closest('[data-route]');
            if (link) {
                const route = link.getAttribute('data-route');
                this.preloadRoute(route);
            }
        });
    }

    setupIdlePreload() {
        if ('requestIdleCallback' in window) {
            const preloadOnIdle = () => {
                requestIdleCallback(() => {
                    if (this.preloadQueue.length > 0) {
                        const route = this.preloadQueue.shift();
                        this.preloadRoute(route);
                        preloadOnIdle(); // Continue with next item
                    }
                });
            };
            
            preloadOnIdle();
        }
    }

    async preloadRoute(routePath) {
        try {
            await this.loadRouteModule(routePath);
            console.log(`Preloaded route: ${routePath}`);
        } catch (error) {
            console.warn(`Failed to preload route ${routePath}:`, error);
        }
    }

    queuePreload(routePath) {
        if (!this.preloadQueue.includes(routePath) && !this.loadedModules.has(this.getModuleKey(routePath))) {
            this.preloadQueue.push(routePath);
        }
    }

    // Intersection Observer for lazy loading
    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            this.intersectionObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.handleIntersection(entry.target);
                        }
                    });
                },
                { threshold: 0.1, rootMargin: '50px' }
            );
        }
    }

    observeElement(element, callback) {
        if (this.intersectionObserver) {
            this.observers.set(element, callback);
            this.intersectionObserver.observe(element);
        }
    }

    handleIntersection(element) {
        const callback = this.observers.get(element);
        if (callback) {
            callback(element);
            this.intersectionObserver.unobserve(element);
            this.observers.delete(element);
        }
    }

    // Service Worker for caching
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/static/js/sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.warn('Service Worker registration failed:', error);
                });
        }
    }

    // Performance tracking
    trackLoadPerformance(moduleKey, loadTime) {
        // Send performance metrics
        if (window.gtag) {
            window.gtag('event', 'timing_complete', {
                name: 'module_load',
                value: Math.round(loadTime),
                event_category: 'performance',
                custom_map: { module: moduleKey }
            });
        }

        console.log(`Module ${moduleKey} loaded in ${loadTime.toFixed(2)}ms`);
    }

    // Image lazy loading
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        images.forEach(img => {
            this.observeElement(img, (element) => {
                element.src = element.dataset.src;
                element.classList.add('loaded');
                element.removeAttribute('data-src');
            });
        });
    }

    // Component lazy loading
    lazyLoadComponents() {
        const components = document.querySelectorAll('[data-lazy-component]');
        
        components.forEach(component => {
            this.observeElement(component, async (element) => {
                const componentName = element.dataset.lazyComponent;
                try {
                    await this.loadComponent(componentName, element);
                } catch (error) {
                    console.error(`Failed to load component ${componentName}:`, error);
                }
            });
        });
    }

    async loadComponent(componentName, container) {
        const componentConfig = {
            'ai-chat-widget': {
                js: '/static/js/components/ai-chat-widget.js',
                css: '/static/css/components/ai-chat-widget.css',
                template: '/static/templates/ai-chat-widget.html'
            },
            'health-metrics-chart': {
                js: '/static/js/components/health-metrics-chart.js',
                css: '/static/css/components/charts.css',
                template: '/static/templates/health-metrics-chart.html'
            },
            'notification-center': {
                js: '/static/js/components/notification-center.js',
                css: '/static/css/components/notifications.css',
                template: '/static/templates/notification-center.html'
            }
        };

        const config = componentConfig[componentName];
        if (!config) {
            throw new Error(`Component ${componentName} not found`);
        }

        // Load component resources
        const [template] = await Promise.all([
            fetch(config.template).then(r => r.text()),
            this.loadCSS(config.css),
            this.loadJS(config.js)
        ]);

        // Inject component
        container.innerHTML = template;
        container.classList.add('component-loaded');

        // Initialize component if initializer exists
        const initFunctionName = `init${componentName.replace(/-([a-z])/g, (g) => g[1].toUpperCase())}`;
        if (window[initFunctionName]) {
            window[initFunctionName](container);
        }
    }

    // Bundle splitting utilities
    async loadBundle(bundleName) {
        const bundles = {
            'vendor': '/static/js/bundles/vendor.js',
            'common': '/static/js/bundles/common.js',
            'charts': '/static/js/bundles/charts.js',
            'forms': '/static/js/bundles/forms.js',
            'ai': '/static/js/bundles/ai.js'
        };

        const bundlePath = bundles[bundleName];
        if (!bundlePath) {
            throw new Error(`Bundle ${bundleName} not found`);
        }

        return this.loadJS(bundlePath);
    }

    // Cache management
    clearCache() {
        this.cache.clear();
        this.loadedModules.clear();
        console.log('Lazy loader cache cleared');
    }

    getCacheSize() {
        return {
            modules: this.loadedModules.size,
            resources: this.cache.size,
            totalMemory: this.estimateMemoryUsage()
        };
    }

    estimateMemoryUsage() {
        let totalSize = 0;
        
        this.cache.forEach((value, key) => {
            totalSize += JSON.stringify(value).length;
        });
        
        return totalSize;
    }

    // Public API
    async loadRouteResources(routePath) {
        try {
            const module = await this.loadRouteModule(routePath);
            
            // Load images lazily
            setTimeout(() => {
                this.lazyLoadImages();
                this.lazyLoadComponents();
            }, 100);
            
            return module;
        } catch (error) {
            console.error(`Failed to load route resources for ${routePath}:`, error);
            throw error;
        }
    }

    preloadNextRoutes(currentRoute) {
        const routeGraph = {
            '/': ['/dashboard', '/login'],
            '/login': ['/dashboard'],
            '/dashboard': ['/nphies', '/ai-assistant', '/claims'],
            '/nphies': ['/eligibility', '/claims', '/pre-authorization'],
            '/claims': ['/eligibility', '/pre-authorization'],
            '/ai-assistant': ['/health-services', '/ai-dashboard']
        };

        const nextRoutes = routeGraph[currentRoute] || [];
        nextRoutes.forEach(route => this.queuePreload(route));
    }

    getLoadedModules() {
        return Array.from(this.loadedModules.keys());
    }

    isModuleLoaded(routePath) {
        const moduleKey = this.getModuleKey(routePath);
        return this.loadedModules.has(moduleKey);
    }
}

// Progressive Web App utilities
class PWAManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupInstallPrompt();
        this.setupOfflineSupport();
        this.setupBackgroundSync();
    }

    setupInstallPrompt() {
        let deferredPrompt;

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            this.showInstallButton();
        });

        document.addEventListener('click', async (e) => {
            if (e.target.matches('#install-app-btn')) {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    console.log(`User ${outcome} the install prompt`);
                    deferredPrompt = null;
                    this.hideInstallButton();
                }
            }
        });
    }

    showInstallButton() {
        const installBtn = document.getElementById('install-app-btn');
        if (installBtn) {
            installBtn.style.display = 'block';
        }
    }

    hideInstallButton() {
        const installBtn = document.getElementById('install-app-btn');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
    }

    setupOfflineSupport() {
        window.addEventListener('online', () => {
            this.showNotification('Back online', 'success');
        });

        window.addEventListener('offline', () => {
            this.showNotification('You are offline', 'warning');
        });
    }

    setupBackgroundSync() {
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            navigator.serviceWorker.ready.then(registration => {
                // Register background sync
                return registration.sync.register('background-sync');
            });
        }
    }

    showNotification(message, type) {
        // Use existing notification system
        if (window.navigationManager) {
            window.navigationManager.showNotification(message, type);
        }
    }
}

// Initialize lazy loader
document.addEventListener('DOMContentLoaded', () => {
    window.lazyLoader = new LazyLoader();
    window.pwaManager = new PWAManager();
    
    // Integrate with router
    window.addEventListener('routechange', (e) => {
        const route = e.detail.route;
        window.lazyLoader.loadRouteResources(route.path);
        window.lazyLoader.preloadNextRoutes(route.path);
    });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LazyLoader, PWAManager };
}
