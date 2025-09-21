const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('static/profile.html', 'utf8');
const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });

// Wait a short time for scripts to load
setTimeout(()=>{
  const window = dom.window;
  try{
    // polyfill requestAnimationFrame for jsdom
    if (!window.requestAnimationFrame) window.requestAnimationFrame = function(cb){ return setTimeout(cb, 16); };
    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id){ clearTimeout(id); };

    // Ensure bottom-sheet helper is loaded into the JSDOM window
    const bsCode = fs.readFileSync('static/js/bottom-sheet.js', 'utf8');
    try{ window.eval(bsCode); } catch(e){ /* fall through */ }
    if(!window.BottomSheet) return console.error('BottomSheet not found');
    const sheet = window.BottomSheet.create('<div><button id="a">A</button><button id="b">B</button></div>');
    sheet.open();
    setTimeout(()=>{
      // simulate Tab navigation
      const doc = window.document;
      const first = doc.getElementById('a');
      const last = doc.getElementById('b');
      first.focus();
      // simulate Tab keypress to go to last
      const ev = new window.KeyboardEvent('keydown', { key: 'Tab' });
      window.dispatchEvent(ev);
      const activeAfterTab = doc.activeElement.id || '(none)';
      // simulate Escape
      const ev2 = new window.KeyboardEvent('keydown', { key: 'Escape' });
      window.dispatchEvent(ev2);
      setTimeout(()=>{
        const sheetStill = window.document.querySelector('.bottom-sheet');
        console.log('ACTIVE_AFTER_TAB:', activeAfterTab);
        console.log('SHEET_PRESENT_AFTER_ESC:', !!sheetStill);
        process.exit(0);
      }, 400);
    }, 200);
  }catch(err){ console.error(err); process.exit(2); }
}, 400);
