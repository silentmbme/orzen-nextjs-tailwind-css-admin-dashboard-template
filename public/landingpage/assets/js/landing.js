(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-toggle');
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('#mobile-nav');
  document.querySelectorAll('.component-marquee__track').forEach((track) => {
    const original = track.querySelector('.component-marquee__group');
    const duplicate = original.cloneNode(true);
    duplicate.setAttribute('aria-hidden', 'true');
    duplicate.querySelectorAll('a').forEach((link) => { link.tabIndex = -1; });
    track.append(duplicate);
    track.classList.add('is-looping');
  });
  const presetTracks = document.querySelectorAll('.preset-marquee__track');
  presetTracks.forEach((track) => {
    const duplicate = track.querySelector('.preset-marquee__group').cloneNode(true);
    duplicate.setAttribute('aria-hidden', 'true');
    duplicate.querySelectorAll('a').forEach((link) => { link.tabIndex = -1; });
    duplicate.querySelectorAll('img').forEach((image) => { image.alt = ''; });
    track.append(duplicate);
  });
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const presetObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.querySelector('.preset-marquee__track').classList.toggle('is-looping', entry.isIntersecting);
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.preset-marquee__row').forEach((row) => presetObserver.observe(row));
  } else if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    presetTracks.forEach((track) => track.classList.add('is-looping'));
  }
  const demoImages = document.querySelectorAll(
    '#dashboards .gallery-item img, #applications .gallery-item img, #pages .gallery-item img, #landing-pages .marketing-card img, #documentation .docs-image img',
  );

  function updateDemoImages() {
    const dark = root.dataset.theme === 'dark';
    demoImages.forEach((image) => {
      const lightSrc = image.dataset.lightSrc || image.getAttribute('src');
      image.dataset.lightSrc = lightSrc;
      const nextSrc = dark ? lightSrc.replace(/\.webp$/, '-dark.webp') : lightSrc;
      if (image.getAttribute('src') !== nextSrc) image.setAttribute('src', nextSrc);
    });
  }

  function updateThemeButton() {
    const dark = root.dataset.theme === 'dark';
    themeButton.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    themeButton.setAttribute('title', dark ? 'Switch to light theme' : 'Switch to dark theme');
    themeButton.setAttribute('aria-pressed', String(dark));
    themeButton.querySelector('.theme-icon').className = `theme-icon ${dark ? 'ri-sun-line' : 'ri-moon-line'}`;
  }

  updateThemeButton();
  updateDemoImages();
  themeButton.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch { /* Storage may be unavailable on a local file. */ }
    updateThemeButton();
    updateDemoImages();
  });

  function closeMenu() {
    mobileNav.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  }

  menuButton.addEventListener('click', () => {
    const opening = mobileNav.hidden;
    mobileNav.hidden = !opening;
    menuButton.setAttribute('aria-expanded', String(opening));
    menuButton.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
  });
  mobileNav.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
  document.addEventListener('click', (event) => {
    if (!mobileNav.hidden && !event.target.closest('.site-header')) closeMenu();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) closeMenu();
  });

  const previewOrigin = location.protocol === 'file:' ? 'http://localhost:3000' : location.origin;
  document.querySelectorAll('[data-demo]').forEach((link) => {
    link.href = previewOrigin + link.dataset.demo;
  });
  const documentationBase = location.protocol === 'file:' ? '../public/documentation/' : '/documentation/';
  document.querySelectorAll('a[href^="../documentation/"]').forEach((link) => {
    link.href = documentationBase + link.getAttribute('href').slice('../documentation/'.length);
  });
  document.querySelectorAll('[aria-hidden="true"]').forEach((node) => {
    const symbol = node.textContent.trim();
    if (symbol === '↗' || symbol === '→') {
      node.innerHTML = `<i class="${symbol === '↗' ? 'ri-arrow-right-up-line' : 'ri-arrow-right-line'}" aria-hidden="true"></i>`;
    }
  });
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealTargets = document.querySelectorAll(
      '.hero .eyebrow, .hero h1, .hero-copy, .hero-actions, .hero-facts, .hero-preview .screenshot-frame, .section-intro, .feature-grid > article, .gallery > *, .component-marquee, .marketing-grid > a, .theme-grid > a, .tech-grid > a, .docs-copy, .docs-image, .closing-inner, .footer-intro, .footer-brand, .footer-links > div, .footer-bottom',
    );
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -24px 0px', threshold: 0.08 });

    revealTargets.forEach((target) => {
      const position = Array.prototype.indexOf.call(target.parentElement.children, target);
      target.style.setProperty('--reveal-delay', `${Math.min(position, 4) * 65}ms`);
      target.classList.add('reveal-item');
      observer.observe(target);
    });
  }
  document.querySelector('#year').textContent = String(new Date().getFullYear());
})();
