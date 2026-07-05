(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointerMq = window.matchMedia('(hover: hover) and (pointer: fine)');
  var narrowMq = window.matchMedia('(max-width: 767px)');
  if (reducedMotion) return;

  var items = [];
  var hasPointer = false;
  var viewport = { x: 0, y: 0 };
  var startTime = performance.now();
  var moveScale = narrowMq.matches ? 0.62 : 1;

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function registerTilt(el, opts) {
    if (!el) return;
    var host = el.parentElement;
    if (host) host.classList.add('mouse-parallax-host');

    items.push({
      el: el,
      mode: 'tilt',
      tilt: (opts.tilt || 10) * moveScale,
      move: (opts.move || 16) * moveScale,
      float: !!opts.float,
      floatAmp: (opts.floatAmp || 14) * moveScale,
      floatSpeed: opts.floatSpeed || 0.0016,
      current: { x: 0, y: 0, rx: 0, ry: 0 },
      target: { x: 0, y: 0, rx: 0, ry: 0 }
    });
  }

  function registerViewportRow(el, opts) {
    if (!el) return;
    el.classList.add('mouse-parallax-row');

    items.push({
      el: el,
      mode: 'viewport',
      moveX: (opts.moveX || 26) * moveScale,
      moveY: (opts.moveY || 12) * moveScale,
      current: { x: 0, y: 0 },
      target: { x: 0, y: 0 }
    });
  }

  function initTargets() {
    registerTilt(document.querySelector('#hero .hero-img img'), {
      tilt: 10,
      move: 16,
      float: true,
      floatAmp: 18,
      floatSpeed: 0.0016
    });

    document.querySelectorAll('#details .features-item').forEach(function (row, index) {
      registerViewportRow(row, {
        moveX: 22 + (index % 2) * 6,
        moveY: 10 + (index % 3) * 2
      });
    });

    var detailsTitle = document.querySelector('#details .section-title');
    if (detailsTitle) {
      registerViewportRow(detailsTitle, { moveX: 14, moveY: 6 });
    }
  }

  function updateFromPoint(clientX, clientY) {
    viewport.x = (clientX / window.innerWidth - 0.5) * 2;
    viewport.y = (clientY / window.innerHeight - 0.5) * 2;

    items.forEach(function (item) {
      if (item.mode === 'viewport') {
        var rect = item.el.getBoundingClientRect();
        if (rect.bottom < -60 || rect.top > window.innerHeight + 60) {
          item.target.x = 0;
          item.target.y = 0;
          return;
        }
        item.target.x = viewport.x * item.moveX;
        item.target.y = viewport.y * item.moveY;
        return;
      }

      if (item.mode === 'tilt') {
        var box = item.el.getBoundingClientRect();
        if (box.bottom < -40 || box.top > window.innerHeight + 40) return;

        var dx = (clientX - (box.left + box.width * 0.5)) / (box.width * 0.55);
        var dy = (clientY - (box.top + box.height * 0.5)) / (box.height * 0.55);

        dx = Math.max(-1, Math.min(1, dx));
        dy = Math.max(-1, Math.min(1, dy));

        item.target.x = dx * item.move;
        item.target.y = dy * item.move;
        item.target.rx = -dy * item.tilt;
        item.target.ry = dx * item.tilt;
      }
    });
  }

  function applyAmbientViewport(now) {
    if (hasPointer || finePointerMq.matches) return;

    var t = (now - startTime) * 0.00085;
    viewport.x = Math.sin(t) * 0.42;
    viewport.y = Math.cos(t * 0.72) * 0.24;

    items.forEach(function (item) {
      if (item.mode !== 'viewport') return;
      var rect = item.el.getBoundingClientRect();
      if (rect.bottom < -60 || rect.top > window.innerHeight + 60) return;
      item.target.x = viewport.x * item.moveX;
      item.target.y = viewport.y * item.moveY;
    });
  }

  function resetTargets() {
    items.forEach(function (item) {
      item.target.x = 0;
      item.target.y = 0;
      if (item.mode === 'tilt') {
        item.target.rx = 0;
        item.target.ry = 0;
      }
    });
  }

  function onPointerMove(e) {
    hasPointer = true;
    updateFromPoint(e.clientX, e.clientY);
  }

  function onPointerDown(e) {
    hasPointer = true;
    updateFromPoint(e.clientX, e.clientY);
  }

  function onPointerEnd() {
    hasPointer = false;
    if (finePointerMq.matches) resetTargets();
  }

  function applyTransform(item, now) {
    if (item.mode === 'viewport') {
      item.el.style.transform =
        'translate3d(' + item.current.x.toFixed(2) + 'px, ' + item.current.y.toFixed(2) + 'px, 0)';
      return;
    }

    var floatY = 0;
    if (item.float) {
      floatY = Math.sin((now - startTime) * item.floatSpeed) * item.floatAmp;
    }

    item.el.style.transform =
      'translate3d(' + item.current.x.toFixed(2) + 'px, ' + (item.current.y + floatY).toFixed(2) + 'px, 0) ' +
      'rotateX(' + item.current.rx.toFixed(2) + 'deg) ' +
      'rotateY(' + item.current.ry.toFixed(2) + 'deg)';
  }

  function tick(now) {
    applyAmbientViewport(now);
    var ease = hasPointer ? 0.1 : 0.055;

    items.forEach(function (item) {
      item.current.x = lerp(item.current.x, item.target.x, ease);
      item.current.y = lerp(item.current.y, item.target.y, ease);

      if (item.mode === 'tilt') {
        item.current.rx = lerp(item.current.rx, item.target.rx, ease);
        item.current.ry = lerp(item.current.ry, item.target.ry, ease);
      }

      applyTransform(item, now);
    });

    requestAnimationFrame(tick);
  }

  function onLayoutChange() {
    moveScale = narrowMq.matches ? 0.62 : 1;
    items.length = 0;
    initTargets();
  }

  function init() {
    initTargets();
    if (!items.length) return;

    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerdown', onPointerDown, { passive: true });
    document.addEventListener('pointerup', onPointerEnd, { passive: true });
    document.addEventListener('pointercancel', onPointerEnd, { passive: true });
    document.addEventListener('mouseleave', onPointerEnd);

    if (narrowMq.addEventListener) {
      narrowMq.addEventListener('change', onLayoutChange);
    } else if (narrowMq.addListener) {
      narrowMq.addListener(onLayoutChange);
    }

    requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
