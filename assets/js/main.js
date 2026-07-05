/**
* Template Name: Bootslander
* Updated for Mehwar Technology — smooth scroll integration
*/

(function() {
  "use strict";

  let scrollTop = document.querySelector('.scroll-top');
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function toggleScrolledAt(scrollY) {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader) return;
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  function toggleScrollTopAt(scrollY) {
    if (scrollTop) {
      scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }

  function navmenuScrollspyAt(scrollY) {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    });
  }

  function onPageScroll(y) {
    const scrollY = y != null ? y : window.scrollY;
    toggleScrolledAt(scrollY);
    toggleScrollTopAt(scrollY);
    navmenuScrollspyAt(scrollY);
  }

  document.addEventListener('scroll', () => onPageScroll(window.scrollY), { passive: true });
  document.addEventListener('mehwar-scroll', (e) => onPageScroll(e.detail.scroll));
  window.addEventListener('load', () => onPageScroll(window.scrollY));

  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', (e) => {
      if (e.target.closest('.toggle-dropdown')) return;
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });
  });

  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  if (typeof GLightbox !== 'undefined') {
    GLightbox({ selector: '.glightbox' });
  }

  if (typeof PureCounter !== 'undefined') {
    new PureCounter();
  }

  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

})();

(function() {
  'use strict';

  function initGalleryAnimations() {
    const galleryItems = document.querySelectorAll('.gallery .gallery-item');
    if (!galleryItems.length) return;

    if ('IntersectionObserver' in window) {
      const galleryObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            galleryObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      galleryItems.forEach(item => galleryObserver.observe(item));
    } else {
      galleryItems.forEach(item => item.classList.add('animate-in'));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGalleryAnimations);
  } else {
    initGalleryAnimations();
  }
})();
