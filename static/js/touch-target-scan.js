// Add `.touch-target` to interactive elements that are missing it to ensure 44x44 tap targets.
(function(){
  function needsTouchTarget(el){
    if (el.classList && el.classList.contains('touch-target')) return false;
    var rect = el.getBoundingClientRect ? el.getBoundingClientRect() : {width:0,height:0};
    // prefer to add to elements that look interactive
    var tag = el.tagName ? el.tagName.toLowerCase() : '';
    var interactive = (tag === 'a' || tag === 'button' || el.getAttribute && el.getAttribute('role') === 'button' || el.onclick);
    if (!interactive) return false;
    return rect.width < 44 || rect.height < 44;
  }

  function ensureTargets(){
    var candidates = document.querySelectorAll('a, button, [role="button"], input[type="button"], input[type="submit"]');
    candidates.forEach(function(el){
      try{ if (needsTouchTarget(el)) el.classList.add('touch-target'); } catch(e){}
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ensureTargets);
  else ensureTargets();
})();
