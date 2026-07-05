(function () {
  'use strict';

  document.querySelectorAll('.cp-nav .cp-dropdown > .cp-drop-toggle').forEach(function (toggle) {
    toggle.addEventListener('click', function (e) {
      if (window.matchMedia('(min-width: 992px)').matches) return;
      e.preventDefault();
      var parent = toggle.closest('.cp-dropdown');
      var open = parent.classList.contains('open');
      document.querySelectorAll('.cp-nav .cp-dropdown.open').forEach(function (el) {
        el.classList.remove('open');
      });
      if (!open) parent.classList.add('open');
    });
  });

  document.querySelector('.cp-menu-toggle')?.addEventListener('click', function () {
    document.querySelector('.cp-mobile-menu')?.classList.toggle('open');
  });

  document.querySelectorAll('.cp-mobile-menu a').forEach(function (link) {
    link.addEventListener('click', function () {
      document.querySelector('.cp-mobile-menu')?.classList.remove('open');
    });
  });
})();
