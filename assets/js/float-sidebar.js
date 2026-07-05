(function () {
  'use strict';

  var zone = document.querySelector('.float-sidebar-zone');
  if (!zone) return;

  var EDGE_TRIGGER = 52;
  var hideTimer = null;
  var mq = window.matchMedia('(min-width: 1200px)');

  function openSidebar() {
    clearTimeout(hideTimer);
    zone.classList.add('is-open');
  }

  function closeSidebar() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      zone.classList.remove('is-open');
    }, 380);
  }

  function onMouseMove(e) {
    if (!mq.matches) return;

    var nearEdge = e.clientX >= window.innerWidth - EDGE_TRIGGER;
    var rect = zone.getBoundingClientRect();
    var overPanel =
      e.clientX >= rect.left - 16 &&
      e.clientX <= rect.right + 8 &&
      e.clientY >= rect.top - 16 &&
      e.clientY <= rect.bottom + 16;

    if (nearEdge || overPanel) {
      openSidebar();
    } else if (!zone.matches(':hover')) {
      closeSidebar();
    }
  }

  zone.addEventListener('mouseenter', openSidebar);
  zone.addEventListener('mouseleave', closeSidebar);
  zone.addEventListener('focusin', openSidebar);
  zone.addEventListener('focusout', function (e) {
    if (!zone.contains(e.relatedTarget)) closeSidebar();
  });

  document.addEventListener('mousemove', onMouseMove, { passive: true });

  mq.addEventListener('change', function () {
    if (!mq.matches) zone.classList.remove('is-open');
  });
})();
