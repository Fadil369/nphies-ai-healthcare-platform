/* Arrow Navigation System
   Tracks navigation history and enables back/forward controls with keyboard support
*/
class ArrowNavigation {
    constructor() {
        this.history = [];
        this.currentIndex = -1;
        this.init();
    }

    init() {
        // Bind to popstate to keep in sync with browser history
        window.addEventListener('popstate', (e) => {
            this.syncWithLocation();
        });

        this.setupUI();
        this.trackNavigation();
        this.setupKeyboard();
    }

    setupUI() {
        // Buttons can be added by the page or by a separate include
        if (!document.getElementById('nav-back')) {
            const back = document.createElement('button');
            back.id = 'nav-back';
            back.className = 'nav-arrow glass-effect p-3 rounded-full';
            back.setAttribute('aria-label', 'Go back');
            back.setAttribute('title', 'Back (Alt+←)');
            back.setAttribute('aria-disabled', 'true');
            back.setAttribute('aria-hidden', 'true');
            back.innerHTML = '<span class="text-xl">←</span>';
            back.style.position = 'fixed';
            back.style.left = '1rem';
            back.style.top = '50%';
            back.style.transform = 'translateY(-50%)';
            back.style.zIndex = '40';
            document.body.appendChild(back);
            back.addEventListener('click', () => this.back());
        }

        if (!document.getElementById('nav-forward')) {
            const fwd = document.createElement('button');
            fwd.id = 'nav-forward';
            fwd.className = 'nav-arrow glass-effect p-3 rounded-full';
            fwd.setAttribute('aria-label', 'Go forward');
            fwd.setAttribute('title', 'Forward (Alt+→)');
            fwd.setAttribute('aria-disabled', 'true');
            fwd.setAttribute('aria-hidden', 'true');
            fwd.innerHTML = '<span class="text-xl">→</span>';
            fwd.style.position = 'fixed';
            fwd.style.right = '1rem';
            fwd.style.top = '50%';
            fwd.style.transform = 'translateY(-50%)';
            fwd.style.zIndex = '40';
            document.body.appendChild(fwd);
            fwd.addEventListener('click', () => this.forward());
        }

        this.updateUI();
    }

    trackNavigation() {
        // Initialize with current location
        this.push(window.location.pathname);

        // Intercept internal navigation if NavigationManager exists
        if (window.navigation && typeof window.navigation.navigate === 'function') {
            const origNav = window.navigation.navigate.bind(window.navigation);
            window.navigation.navigate = async (path) => {
                await origNav(path);
                this.push(path);
            };
        }

        // Also attach to clicks on links as fallback
        document.addEventListener('click', (e) => {
            const a = e.target.closest('a');
            if (!a) return;
            const href = a.getAttribute('href');
            if (href && href.startsWith('/') && !href.startsWith('//')) {
                this.push(href);
            }
        });
    }

    push(path) {
        // If currentIndex is not at end, truncate forward history
        if (this.currentIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentIndex + 1);
        }
        // Avoid duplicate consecutive entries
        if (this.history[this.history.length - 1] !== path) {
            this.history.push(path);
            this.currentIndex = this.history.length - 1;
        }
        this.updateUI();
    }

    back() {
        if (this.currentIndex > 0) {
            this.currentIndex -= 1;
            const path = this.history[this.currentIndex];
            window.history.pushState({ path }, '', path);
            if (window.navigation && typeof window.navigation.refresh === 'function') {
                window.navigation.refresh();
            } else {
                window.location.pathname = path;
            }
            this.updateUI();
        }
    }

    forward() {
        if (this.currentIndex < this.history.length - 1) {
            this.currentIndex += 1;
            const path = this.history[this.currentIndex];
            window.history.pushState({ path }, '', path);
            if (window.navigation && typeof window.navigation.refresh === 'function') {
                window.navigation.refresh();
            } else {
                window.location.pathname = path;
            }
            this.updateUI();
        }
    }

    syncWithLocation() {
        const path = window.location.pathname;
        // Try to align currentIndex with path
        const idx = this.history.lastIndexOf(path);
        if (idx !== -1) this.currentIndex = idx;
        else this.push(path);
        this.updateUI();
    }

    setupKeyboard() {
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === 'ArrowLeft') {
                e.preventDefault();
                this.back();
            } else if (e.altKey && e.key === 'ArrowRight') {
                e.preventDefault();
                this.forward();
            }
        });
    }

    updateUI() {
        const back = document.getElementById('nav-back');
        const fwd = document.getElementById('nav-forward');
        if (!back || !fwd) return;
        // Back button state
        if (this.currentIndex > 0) {
            back.classList.remove('is-disabled');
            back.classList.remove('visually-hidden');
            back.disabled = false;
            back.setAttribute('aria-disabled', 'false');
            back.setAttribute('aria-hidden', 'false');
        } else {
            back.classList.add('is-disabled');
            back.classList.add('visually-hidden');
            back.disabled = true;
            back.setAttribute('aria-disabled', 'true');
            back.setAttribute('aria-hidden', 'true');
        }

        // Forward button state
        if (this.currentIndex < this.history.length - 1) {
            fwd.classList.remove('is-disabled');
            fwd.classList.remove('visually-hidden');
            fwd.disabled = false;
            fwd.setAttribute('aria-disabled', 'false');
            fwd.setAttribute('aria-hidden', 'false');
        } else {
            fwd.classList.add('is-disabled');
            fwd.classList.add('visually-hidden');
            fwd.disabled = true;
            fwd.setAttribute('aria-disabled', 'true');
            fwd.setAttribute('aria-hidden', 'true');
        }
    }
}

// Initialize the arrow navigation
document.addEventListener('DOMContentLoaded', () => {
    window.arrowNav = new ArrowNavigation();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArrowNavigation;
}
