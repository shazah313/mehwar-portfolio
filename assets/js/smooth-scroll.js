(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lenis = null;
  var progressBar = null;
  var progressGlow = null;
  var scrollHint = null;
  var lastScroll = 0;

  function headerOffset() {
    var header = document.querySelector('#header, .cp-header, .service-nav');
    return header ? header.offsetHeight + 16 : 80;
  }

  function premiumEase(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function scrollTo(target, opts) {
    var options = opts || {};
    if (typeof target === 'number') {
      if (lenis) {
        lenis.scrollTo(target, {
          duration: options.duration || 1.65,
          easing: options.easing || premiumEase
        });
      } else {
        window.scrollTo({ top: target, behavior: 'smooth' });
      }
      return;
    }
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    if (lenis) {
      lenis.scrollTo(el, {
        offset: -(options.offset != null ? options.offset : headerOffset()),
        duration: options.duration || 1.65,
        easing: options.easing || premiumEase,
        ...options
      });
    } else {
      window.scrollTo({ top: el.offsetTop - headerOffset(), behavior: 'smooth' });
    }
  }

  window.mehwarScrollTo = scrollTo;

  function createProgressBar() {
    if (reducedMotion || progressBar) return;
    progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.setAttribute('aria-hidden', 'true');

    progressGlow = document.createElement('div');
    progressGlow.className = 'scroll-progress-glow';
    progressBar.appendChild(progressGlow);

    document.body.prepend(progressBar);
  }

  function updateProgress(scroll, limit, velocity) {
    if (!progressBar || !limit) return;
    var progress = Math.min(1, Math.max(0, scroll / limit));
    progressBar.style.transform = 'scaleX(' + progress + ')';
    if (progressGlow) {
      progressGlow.style.left = (progress * 100) + '%';
    }
    document.body.classList.toggle('is-scrolling-fast', Math.abs(velocity) > 6);
  }

  function createScrollHint() {
    if (reducedMotion || scrollHint) return;
    if (!document.querySelector('#hero, .page-hero-strip')) return;

    scrollHint = document.createElement('div');
    scrollHint.className = 'scroll-hint-indicator';
    scrollHint.setAttribute('aria-hidden', 'true');
    scrollHint.innerHTML = '<span>Scroll to explore</span><i class="bi bi-chevron-double-down"></i>';
    document.body.appendChild(scrollHint);
  }

  function hideScrollHint(scroll) {
    if (!scrollHint) return;
    if (scroll > 60) scrollHint.classList.add('is-hidden');
  }

  function bindScrollHint() {
    function onScroll(scroll) {
      hideScrollHint(scroll);
    }

    if (lenis) {
      lenis.on('scroll', function (e) { onScroll(e.scroll); });
    } else {
      window.addEventListener('scroll', function () { onScroll(window.scrollY); }, { passive: true });
    }

    onScroll(window.scrollY || 0);
  }

  function initSectionReveal() {
    document.querySelectorAll('.page-banner, .page-hero-strip, .premium-banner').forEach(function (el) {
      el.classList.add('scroll-revealed');
    });

    var selectors = [
      'section:not(#hero):not(.page-banner):not(.page-hero-strip):not(.premium-banner):not(.service-hero)',
      '.story-intro-band',
      '.leadership-layout',
      '.stories-wrap > .story-card',
      '.service-wrap > .glass-card',
      '.robot-showcase',
      '.robot-3d-strip'
    ].join(',');

    var targets = document.querySelectorAll(selectors);
    if (!targets.length) return;

    if (reducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach(function (s) { s.classList.add('scroll-revealed'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -6% 0px' });

    targets.forEach(function (el) { observer.observe(el); });
  }

  function initParallaxLayers() {
    if (reducedMotion) return;

    var layers = [];

    document.querySelectorAll('.hero-bg, .page-hero-bg, .robot-hero-grid, .service-bg').forEach(function (el, i) {
      layers.push({ el: el, speed: 0.38 + i * 0.04, type: 'bg' });
    });

    document.querySelectorAll('.hero-waves').forEach(function (el) {
      layers.push({ el: el, speed: 0.18, type: 'float' });
    });

    document.querySelectorAll('.hero-orb, .orb').forEach(function (el, i) {
      layers.push({ el: el, speed: 0.08 + (i % 3) * 0.04, type: 'orb' });
    });

    document.querySelectorAll('.page-hero-copy h1, .robotics-hero h1').forEach(function (el) {
      layers.push({ el: el, speed: 0.05, type: 'text' });
    });

    if (!layers.length) return;

    function update(scroll) {
      var viewH = window.innerHeight;
      layers.forEach(function (layer) {
        var rect = layer.el.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > viewH + 100) return;

        var centerOffset = (rect.top + rect.height * 0.5) - viewH * 0.5;
        var y = centerOffset * layer.speed;

        if (layer.type === 'bg') {
          layer.el.style.transform = 'translate3d(0, ' + (scroll * layer.speed * 0.35 + y * 0.2) + 'px, 0) scale(1.05)';
        } else if (layer.type === 'orb') {
          layer.el.style.transform = 'translate3d(0, ' + y + 'px, 0)';
        } else if (layer.type === 'text') {
          layer.el.style.transform = 'translate3d(0, ' + (y * 0.3) + 'px, 0)';
        } else {
          layer.el.style.transform = 'translate3d(0, ' + y + 'px, 0)';
        }
      });
    }

    function onScroll(e) {
      var scroll = e && e.scroll != null ? e.scroll : window.scrollY;
      update(scroll);
    }

    if (lenis) {
      lenis.on('scroll', onScroll);
    } else {
      window.addEventListener('scroll', function () { onScroll({ scroll: window.scrollY }); }, { passive: true });
    }

    onScroll({ scroll: window.scrollY || 0 });
  }

  function initAnchorLinks() {
    document.querySelectorAll('a[href*="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href = anchor.getAttribute('href');
        if (!href || href === '#') return;

        var hash = href.indexOf('#') !== -1 ? href.slice(href.indexOf('#')) : '';
        if (!hash || hash === '#') return;

        var onSamePage = href.charAt(0) === '#' ||
          anchor.pathname === window.location.pathname ||
          anchor.pathname.endsWith(window.location.pathname.split('/').pop());

        if (!onSamePage) return;

        var target = document.querySelector(hash);
        if (!target) return;

        e.preventDefault();
        scrollTo(target);

        if (history.replaceState) {
          history.replaceState(null, '', hash);
        }
      });
    });
  }

  function initScrollTop() {
    var btn = document.querySelector('.scroll-top');
    if (!btn) return;

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      scrollTo(0, { duration: 2 });
    });
  }

  function initHashOnLoad() {
    if (!window.location.hash) return;
    var target = document.querySelector(window.location.hash);
    if (!target) return;
    setTimeout(function () { scrollTo(target); }, 500);
  }

  function initAOS() {
    if (typeof AOS === 'undefined') return;
    AOS.init({
      duration: 900,
      easing: 'ease-out-cubic',
      once: true,
      mirror: false,
      offset: 60,
      delay: 0,
      disable: reducedMotion
    });
  }

  function initMediaProtect() {
    function protectVideos() {
      document.querySelectorAll('video').forEach(function (video) {
        video.setAttribute('controlsList', 'nodownload noplaybackrate');
        video.setAttribute('disablePictureInPicture', '');
        video.addEventListener('contextmenu', function (e) { e.preventDefault(); });
      });
    }

    function protectImages() {
      document.querySelectorAll('img').forEach(function (img) {
        img.setAttribute('draggable', 'false');
        img.addEventListener('dragstart', function (e) { e.preventDefault(); });
      });
    }

    document.addEventListener('contextmenu', function (e) {
      if (e.target.closest('img, video, picture, canvas')) e.preventDefault();
    });

    document.addEventListener('dragstart', function (e) {
      if (e.target.closest('img, video')) e.preventDefault();
    });

    protectVideos();
    protectImages();

    if ('MutationObserver' in window) {
      new MutationObserver(function () {
        protectVideos();
        protectImages();
      }).observe(document.body, { childList: true, subtree: true });
    }
  }

  function initLenis() {
    initMediaProtect();

    if (reducedMotion || typeof Lenis === 'undefined') {
      if (reducedMotion) {
        document.documentElement.classList.add('reduced-motion');
      } else {
        document.documentElement.classList.add('no-lenis-scroll');
      }
      createScrollHint();
      bindScrollHint();
      initSectionReveal();
      initAnchorLinks();
      initScrollTop();
      initHashOnLoad();
      initAOS();
      return;
    }

    lenis = new Lenis({
      lerp: 0.068,
      duration: 1.65,
      easing: premiumEase,
      smoothWheel: true,
      syncTouch: true,
      touchMultiplier: 1.35,
      wheelMultiplier: 0.82,
      infinite: false,
      autoResize: true
    });

    document.documentElement.classList.add('lenis', 'lenis-smooth');
    document.body.classList.add('has-smooth-scroll');

    createProgressBar();
    createScrollHint();
    bindScrollHint();

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', function (e) {
      var velocity = e.scroll - lastScroll;
      lastScroll = e.scroll;
      updateProgress(e.scroll, e.limit, velocity);
      document.dispatchEvent(new CustomEvent('mehwar-scroll', { detail: e }));
    });

    initSectionReveal();
    initParallaxLayers();
    initAnchorLinks();
    initScrollTop();
    initAOS();

    window.addEventListener('load', initHashOnLoad);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLenis);
  } else {
    initLenis();
  }
})();
