(function () {
  'use strict';

  function initCardTilt() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.querySelectorAll('.robot-char-card').forEach(function (card) {
      card.style.touchAction = 'manipulation';

      function applyTilt(e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'translateY(-10px) perspective(600px) rotateX(' + (-y * 8) + 'deg) rotateY(' + (x * 8) + 'deg)';
      }

      function resetTilt() {
        card.style.transform = '';
      }

      card.addEventListener('pointermove', applyTilt);
      card.addEventListener('pointerdown', applyTilt);
      card.addEventListener('pointerleave', resetTilt);
      card.addEventListener('pointerup', resetTilt);
      card.addEventListener('pointercancel', resetTilt);
    });
  }

  function lazyInit(selector, initFn) {
    var el = document.querySelector(selector);
    if (!el || typeof IntersectionObserver === 'undefined') {
      if (el) initFn(selector);
      return;
    }

    var started = false;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!started && entry.isIntersecting) {
          started = true;
          initFn(selector);
          observer.disconnect();
        }
      });
    }, { rootMargin: '120px' });

    observer.observe(el);
  }

  window.addEventListener('load', function () {
    if (typeof MehwarRobotics === 'undefined') return;

    MehwarRobotics.initHero('#robot-canvas-container');
    lazyInit('#robot-canvas-mini', MehwarRobotics.initStrip.bind(MehwarRobotics));
    lazyInit('.robot-model-preview', function () {
      MehwarRobotics.initPreviews('.robot-model-preview');
    });
    initCardTilt();
  });
})();
