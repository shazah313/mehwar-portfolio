(function () {
  'use strict';

  document.querySelectorAll('.service-bg').forEach(bg => {
    for (let i = 0; i < 12; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 6 + 2;
      p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;top:${Math.random()*100}%;animation-duration:${15+Math.random()*20}s;animation-delay:${Math.random()*5}s;opacity:${0.1+Math.random()*0.3};background:var(--sp-accent);border-radius:50%;position:absolute;`;
      bg.appendChild(p);
    }
  });

  if (typeof AOS !== 'undefined' && !document.querySelector('script[src*="smooth-scroll.js"]')) {
    AOS.init({ duration: 850, easing: 'ease-out-cubic', once: true, offset: 70 });
  }
})();
