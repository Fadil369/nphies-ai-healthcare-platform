// Simple Bottom Sheet helper
(function(){
    class BottomSheet {
        constructor() {
            this.sheet = null;
            this.activeElementBeforeOpen = null;
            this._onKey = this._onKey.bind(this);
        }

        create(contentHtml) {
            // create a container element but do not attach yet
            var container = document.createElement('div');
            container.className = 'bottom-sheet';
            container.setAttribute('role','dialog');
            container.setAttribute('aria-modal','true');
            container.setAttribute('aria-hidden','true');
            container.innerHTML = `
                <div class="sheet-handle" style="width:56px;height:6px;background:rgba(255,255,255,0.12);border-radius:4px;margin:8px auto"></div>
                <div class="sheet-content">${contentHtml}</div>
            `;

            // click on overlay closes
            container.addEventListener('click', (e)=>{ if (e.target === container) this.close(); });

            // expose control methods bound to this instance
            var self = this;
            return {
                _container: container,
                open: function(){ self._open(container); },
                close: function(){ self._close(container); }
            };
        }

        _open(container) {
            if (this.sheet) return; // already open
            this.activeElementBeforeOpen = document.activeElement;
            this.sheet = container;
            this.sheet.setAttribute('aria-hidden','false');
            document.body.appendChild(this.sheet);
            // small delay for CSS transitions
            requestAnimationFrame(()=> this.sheet.classList.add('open'));
            // Listen on window to match dispatched keyboard events across environments
            if (typeof window !== 'undefined' && window.addEventListener) window.addEventListener('keydown', this._onKey);
            // focus first tabbable element inside or the container
            var focusable = this.sheet.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            (focusable || this.sheet).focus();
        }

        _close(container){
            if (!this.sheet) return;
            if (this.sheet !== container) return;
            this.sheet.classList.remove('open');
            this.sheet.setAttribute('aria-hidden','true');
            if (typeof window !== 'undefined' && window.removeEventListener) window.removeEventListener('keydown', this._onKey);
            setTimeout(()=> {
                if (this.sheet && this.sheet.parentNode) this.sheet.parentNode.removeChild(this.sheet);
                this.sheet = null;
                if (this.activeElementBeforeOpen && typeof this.activeElementBeforeOpen.focus === 'function'){
                    this.activeElementBeforeOpen.focus();
                }
            }, 320);
        }

        _onKey(e){
            if (!this.sheet) return;
            // ESC closes
            if (e.key === 'Escape' || e.key === 'Esc'){
                e.preventDefault();
                this._close(this.sheet);
                return;
            }
            // Focus trap: keep focus within sheet
            if (e.key === 'Tab'){
                var focusables = Array.prototype.slice.call(this.sheet.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter(function(el){ return !el.disabled && (el.offsetParent !== null || el.getClientRects().length); });
                if (focusables.length === 0) { e.preventDefault(); return; }
                var idx = focusables.indexOf(document.activeElement);
                if (e.shiftKey){
                    // move backward
                    var prev = (idx > 0) ? focusables[idx-1] : focusables[focusables.length-1];
                    e.preventDefault(); prev.focus();
                } else {
                    var next = (idx >= 0 && idx < focusables.length-1) ? focusables[idx+1] : focusables[0];
                    e.preventDefault(); next.focus();
                }
            }
        }
    }

    window.BottomSheet = new BottomSheet();
})();
