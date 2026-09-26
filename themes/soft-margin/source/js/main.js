/* Progressive enhancement: normal links and the full comic work without JS. */
'use strict';
document.documentElement.classList.add('js');
const menu = document.querySelector('.menu-toggle');
const nav = document.getElementById('main-nav');
if (menu && nav) {
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    nav.toggleAttribute('data-open', open);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      menu.setAttribute('aria-expanded', 'false'); nav.removeAttribute('data-open'); menu.focus();
    }
  });
}
const dialog = document.getElementById('lightbox');
const pictures = [...document.querySelectorAll('a[data-lightbox]')];
let active = 0, opener = null;
if (dialog && typeof dialog.showModal === 'function') {
  const image = document.getElementById('lightbox-image');
  const previous = dialog.querySelector('.lightbox-prev');
  const next = dialog.querySelector('.lightbox-next');
  function show(index) {
    active = Math.max(0, Math.min(index, pictures.length - 1));
    const link = pictures[active];
    image.src = link.href;
    image.alt = link.dataset.alt || link.querySelector('img').alt;
    document.getElementById('lightbox-title').textContent = link.dataset.caption;
    document.getElementById('lightbox-count').textContent = `${active + 1} / ${pictures.length}`;
    document.getElementById('lightbox-original').href = link.href;
    previous.disabled = active === 0; next.disabled = active === pictures.length - 1;
  }
  pictures.forEach((link, index) => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); opener = link; show(index); dialog.showModal(); document.body.style.overflow = 'hidden';
  }));
  previous.addEventListener('click', () => show(active - 1));
  next.addEventListener('click', () => show(active + 1));
  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { document.body.style.overflow = ''; opener?.focus({ preventScroll: true }); });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault(); show(active + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  let touch = null;
  image.addEventListener('touchstart', event => {
    touch = event.touches.length === 1 ? [event.touches[0].clientX, event.touches[0].clientY] : null;
  }, { passive: true });
  image.addEventListener('touchend', event => {
    if (!touch || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - touch[0];
    const dy = event.changedTouches[0].clientY - touch[1];
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) show(active + (dx < 0 ? 1 : -1));
    touch = null;
  }, { passive: true });
}
const topButton = document.querySelector('.back-top');
if (topButton) {
  const update = () => { topButton.hidden = window.scrollY < 650; };
  window.addEventListener('scroll', update, { passive: true }); update();
  topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }));
}
const pages = [...document.querySelectorAll('.comic-page')];
if (pages.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const number = entry.target.id.replace('page-', '');
      document.querySelector('.reader-progress').textContent = `${number} / ${String(pages.length).padStart(2, '0')}`;
      document.querySelectorAll('.page-jumps a').forEach(a => {
        if (a.hash === '#' + entry.target.id) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-20% 0px -55% 0px', threshold: 0 });
  pages.forEach(page => observer.observe(page));
}
