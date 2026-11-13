(() => {
  const icons = {
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    close: '<path d="m18 6-12 12M6 6l12 12"/>',
  };

  window.docIcon = (name, size = 16, className = '') =>
    `<svg class="${className}" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || ''}</svg>`;

  const pages = [
    'index', 'getting-started', 'structure', 'customization', 'components',
    'dashboards', 'applications', 'maps', 'deployment', 'troubleshooting', 'support',
  ];
  const labels = [
    'Overview', 'Getting started', 'Folder structure', 'Customization', 'Components',
    'Dashboards', 'Applications', 'Maps', 'Deployment', 'Troubleshooting', 'FAQ & support',
  ];
  const current = document.body.dataset.page || 'index';
  const index = pages.indexOf(current);

  document.body.insertAdjacentHTML('afterbegin', `
    <a class="skip" href="#main">Skip to content</a>
    <header class="doc-header">
      <button class="icon-btn menu-btn" data-menu aria-label="Toggle navigation" aria-expanded="false">${window.docIcon('menu')}</button>
      <a class="doc-brand" href="index.html" aria-label="Orzen documentation home">
        <img class="logo-light" src="assets/images/logo.svg" alt="Orzen">
        <img class="logo-dark" src="assets/images/logo-dark.svg" alt="Orzen">
      </a>
      <div class="doc-search">
        ${window.docIcon('search', 16, 'search-icon')}
        <input aria-label="Search documentation" placeholder="Search documentation" readonly>
        <span class="kbd">Ctrl K</span>
      </div>
      <div class="header-actions">
        <button class="icon-btn" data-theme-toggle aria-label="Switch color theme">${window.docIcon('moon')}</button>
      </div>
    </header>
    <div class="shell">
      <aside class="sidebar" aria-label="Documentation navigation" data-doc-nav></aside>
      <main id="main" class="article"></main>
      <aside class="toc" aria-label="On this page" data-toc></aside>
    </div>
    <button class="nav-scrim" data-nav-scrim aria-label="Close navigation"></button>
    <dialog class="search-dialog" data-search-dialog aria-label="Search documentation">
      <div class="search-box">
        <input data-search-input aria-label="Search topics" placeholder="Search pages and topics">
        <button class="icon-btn" data-search-close aria-label="Close search">${window.docIcon('close')}</button>
      </div>
      <div class="search-results" data-search-results></div>
    </dialog>
  `);

  const content = document.querySelector('#content');
  document.querySelector('.article')?.append(...content.content.cloneNode(true).childNodes);

  const pager = document.createElement('nav');
  pager.className = 'pager';
  pager.setAttribute('aria-label', 'Previous and next pages');
  pager.innerHTML = `${index > 0
    ? `<a href="${pages[index - 1]}.html"><i class="ri-arrow-left-line" aria-hidden="true"></i><span>${labels[index - 1]}</span></a>`
    : '<span></span>'}
    ${index < pages.length - 1
    ? `<a href="${pages[index + 1]}.html"><span>${labels[index + 1]}</span><i class="ri-arrow-right-line" aria-hidden="true"></i></a>`
    : ''}`;
  document.querySelector('.article')?.append(pager);
})();
