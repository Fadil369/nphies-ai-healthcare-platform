/* Footer Navigation Component
   Mobile-first bottom navigation with active state, ARIA, and keyboard support
*/
document.addEventListener('DOMContentLoaded', () => {
    const footerHtml = `
    <footer id="mobile-footer" class="fixed bottom-0 left-0 right-0 z-50 glass-effect border-t border-white/10">
        <nav class="flex justify-around items-center h-16 px-4" role="navigation" aria-label="Primary">
            <a href="/dashboard" class="nav-item" data-route="/dashboard" aria-label="Dashboard">
                <div class="flex flex-col items-center space-y-1">
                    <span class="text-xl">📊</span>
                    <span class="text-xs">Dashboard</span>
                </div>
            </a>
            <a href="/nphies" class="nav-item" data-route="/nphies" aria-label="NPHIES">
                <div class="flex flex-col items-center space-y-1">
                    <span class="text-xl">🏥</span>
                    <span class="text-xs">NPHIES</span>
                </div>
            </a>
            <a href="/ai-assistant" class="nav-item" data-route="/ai-assistant" aria-label="AI Assistant">
                <div class="flex flex-col items-center space-y-1">
                    <span class="text-xl">🤖</span>
                    <span class="text-xs">AI</span>
                </div>
            </a>
            <a href="/settings" class="nav-item" data-route="/settings" aria-label="Settings">
                <div class="flex flex-col items-center space-y-1">
                    <span class="text-xl">⚙️</span>
                    <span class="text-xs">Settings</span>
                </div>
            </a>
        </nav>
    </footer>
    `;

    // Insert footer into the document body if not present
    if (!document.getElementById('mobile-footer')) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = footerHtml;
        document.body.appendChild(wrapper.firstElementChild);
    }

    // Apply active state based on current path
    function updateActive() {
        const path = window.location.pathname || '/';
        document.querySelectorAll('#mobile-footer .nav-item').forEach(item => {
            const route = item.getAttribute('data-route');
            if (route === path) {
                item.classList.add('active');
                item.setAttribute('aria-current', 'page');
            } else {
                item.classList.remove('active');
                item.removeAttribute('aria-current');
            }
        });
    }

    updateActive();

    // Listen to navigation changes from NavigationManager if available
    if (window.navigation && typeof window.navigation.getCurrentPath === 'function') {
        const origNavigate = window.navigation.navigate.bind(window.navigation);
        window.navigation.navigate = async (path) => {
            await origNavigate(path);
            updateActive();
        };
    }

    // Keyboard navigation: use 1-4 to jump, and arrow keys with Alt
    document.addEventListener('keydown', (e) => {
        if (e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) return; // let ArrowNavigation handle
        if (['1','2','3','4'].includes(e.key) && !e.metaKey && !e.ctrlKey) {
            const idx = parseInt(e.key, 10) - 1;
            const items = Array.from(document.querySelectorAll('#mobile-footer .nav-item'));
            const target = items[idx];
            if (target) target.click();
        }
    });

    // Make nav-items keyboard focusable and handle Enter/Space to activate
    document.querySelectorAll('#mobile-footer .nav-item').forEach(item => {
        item.setAttribute('tabindex', '0');
        item.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.click();
            }
        });
    });

    // Simple hover/press animation
    document.addEventListener('pointerdown', (e) => {
        const item = e.target.closest('#mobile-footer .nav-item');
        if (item) item.classList.add('pressed');
    });
    document.addEventListener('pointerup', (e) => {
        const item = e.target.closest('#mobile-footer .nav-item');
        if (item) item.classList.remove('pressed');
    });

    // Swipe gestures on footer: left = forward, right = back
    (function setupSwipe() {
        const footer = document.getElementById('mobile-footer');
        if (!footer) return;

        let startX = 0;
        let startY = 0;
        let tracking = false;

        footer.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length === 1) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                tracking = true;
            }
        }, { passive: true });

        footer.addEventListener('touchmove', (e) => {
            if (!tracking) return;
            // Prevent vertical swipes from triggering
            const dx = e.touches[0].clientX - startX;
            const dy = e.touches[0].clientY - startY;
            if (Math.abs(dy) > Math.abs(dx)) {
                tracking = false;
            }
        }, { passive: true });

        footer.addEventListener('touchend', (e) => {
            if (!tracking) return;
            const endX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : startX;
            const dx = endX - startX;
            const threshold = 40; // minimum px to consider a swipe
            if (dx > threshold) {
                // swipe right -> go back
                if (window.arrowNav && typeof window.arrowNav.back === 'function') window.arrowNav.back();
                else if (window.navigation && typeof window.navigation.navigate === 'function') window.navigation.navigate('/dashboard');
            } else if (dx < -threshold) {
                // swipe left -> go forward
                if (window.arrowNav && typeof window.arrowNav.forward === 'function') window.arrowNav.forward();
                else if (window.navigation && typeof window.navigation.navigate === 'function') window.navigation.navigate('/ai-assistant');
            }
            tracking = false;
        }, { passive: true });
    })();
});
