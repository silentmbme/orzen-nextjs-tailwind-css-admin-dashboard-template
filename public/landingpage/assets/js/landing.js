(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-toggle');
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('#mobile-nav');

  function updateThemeButton() {
    const dark = root.dataset.theme === 'dark';
    themeButton.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    themeButton.setAttribute('title', dark ? 'Switch to light theme' : 'Switch to dark theme');
    themeButton.setAttribute('aria-pressed', String(dark));
    themeButton.querySelector('.theme-icon').className = `theme-icon ${dark ? 'ri-sun-line' : 'ri-moon-line'}`;
  }

  updateThemeButton();
  themeButton.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch { /* Storage may be unavailable on a local file. */ }
    updateThemeButton();
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
  document.querySelectorAll('[aria-hidden="true"]').forEach((node) => {
    const symbol = node.textContent.trim();
    if (symbol === '↗' || symbol === '→') {
      node.innerHTML = `<i class="${symbol === '↗' ? 'ri-arrow-right-up-line' : 'ri-arrow-right-line'}" aria-hidden="true"></i>`;
    }
  });
  document.querySelector('#year').textContent = String(new Date().getFullYear());
})();
