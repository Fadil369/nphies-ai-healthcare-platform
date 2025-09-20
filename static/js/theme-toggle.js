(function(){
    const KEY = 'nphies_theme';
    function applyTheme(theme){
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'light'){
            document.documentElement.style.setProperty('--glass-bg', 'rgba(255,255,255,0.85)');
            document.documentElement.style.setProperty('--glass-border', 'rgba(0,0,0,0.08)');
            document.documentElement.style.setProperty('--muted', 'rgba(0,0,0,0.65)');
        } else {
            document.documentElement.style.setProperty('--glass-bg', 'rgba(255,255,255,0.03)');
            document.documentElement.style.setProperty('--glass-border', 'rgba(255,255,255,0.08)');
            document.documentElement.style.setProperty('--muted', 'rgba(255,255,255,0.6)');
        }
    }

    const saved = localStorage.getItem(KEY) || 'dark';
    applyTheme(saved);

    window.NPHIES_Theme = {
        toggle(){
            const next = (document.documentElement.getAttribute('data-theme') === 'light') ? 'dark' : 'light';
            applyTheme(next);
            localStorage.setItem(KEY, next);
        },
        set(theme){ applyTheme(theme); localStorage.setItem(KEY, theme); }
    };
})();
