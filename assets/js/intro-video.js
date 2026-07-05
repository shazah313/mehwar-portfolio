(function () {
  'use strict';

  const VIDEO_SRC = 'https://firebasestorage.googleapis.com/v0/b/albishara-d8d73.firebasestorage.app/o/mehwarintro.mp4?alt=media&token=8df5b4a7-6783-4c42-a10c-e6c76b95c695';

  const trigger = document.getElementById('watch-intro-video');
  const modal = document.getElementById('intro-video-modal');
  const player = document.getElementById('intro-video-player');

  if (!trigger || !modal || !player) return;

  const closeBtn = modal.querySelector('.intro-video-close');
  const backdrop = modal.querySelector('.intro-video-backdrop');

  function openModal(e) {
    e.preventDefault();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (!player.getAttribute('src') && player.querySelector('source')) {
      player.load();
    }
    player.play().catch(() => {});
    closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    player.pause();
    player.currentTime = 0;
  }

  trigger.addEventListener('click', openModal);

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  player.addEventListener('contextmenu', (e) => e.preventDefault());

  player.addEventListener('dragstart', (e) => e.preventDefault());

  player.setAttribute('controlsList', 'nodownload noplaybackrate');
  player.disablePictureInPicture = true;
})();
