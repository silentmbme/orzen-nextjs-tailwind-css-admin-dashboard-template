(() => {
  const groupIcons = {
    introduction: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
    customization: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
    components: '<path d="m12.83 2.18 8 4.42a2 2 0 0 1 0 3.5l-8 4.42a1.7 1.7 0 0 1-1.66 0l-8-4.42a2 2 0 0 1 0-3.5l8-4.42a1.7 1.7 0 0 1 1.66 0Z"/><path d="m22 14.5-9.17 5.08a1.7 1.7 0 0 1-1.66 0L2 14.5"/>',
    applications: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/>',
    maps: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15M15 6v15"/>',
    deployment: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.9 12.9 0 0 1 22 2c0 2.72-.78 7.5-6.05 11a22.4 22.4 0 0 1-3.95 2Z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  };
  const svg = (name, size = 15, className = '') =>
    `<svg class="${className}" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${groupIcons[name]}</svg>`;

  const docs = [
    ['Introduction', 'introduction', [
      ['Overview', 'index.html', 'A practical introduction to Orzen Admin'],
      ['Getting started', 'getting-started.html', 'Install and run the Next.js application'],
      ['Folder structure', 'structure.html', 'Find routes, features, and shared components'],
    ]],
    ['Customization', 'customization', [
      ['Theme customization', 'customization.html#theme', 'Themes and CSS variables'],
      ['Layout configuration', 'customization.html#layout', 'Header, sidebar, and layout preferences'],
      ['Sidebar & header', 'customization.html#navigation', 'Navigation configuration'],
      ['Typography', 'customization.html#typography', 'Typography and shared tokens'],
      ['Adding new pages', 'customization.html#pages', 'App Router page conventions'],
    ]],
    ['Components', 'components', [
      ['UI components', 'components.html#ui', 'Buttons, cards, feedback, and overlays'],
      ['Charts', 'components.html#charts', 'Recharts chart showcases'],
      ['Forms', 'components.html#forms', 'Form elements, layouts, validation, and editors'],
      ['Tables', 'components.html#tables', 'Basic, editable, and expandable tables'],
    ]],
    ['Applications', 'applications', [
      ['Dashboards', 'dashboards.html', 'Sales, CRM, commerce, SaaS, HR, and AI dashboards'],
      ['Applications', 'applications.html#apps', 'Workspace applications'],
      ['Authentication', 'applications.html#auth', 'Login and account flows'],
      ['Utility pages', 'applications.html#utility', 'Settings and utility routes'],
    ]],
    ['Maps', 'maps', [
      ['Vector maps', 'maps.html#vector', 'D3 geographic visualizations'],
      ['Google Maps', 'maps.html#google', 'Google Maps loader and environment keys'],
      ['Leaflet maps', 'maps.html#leaflet', 'React Leaflet examples and tile settings'],
    ]],
    ['Deployment', 'deployment', [
      ['Production build', 'deployment.html#build', 'Create an optimized Next.js build'],
      ['Deployment', 'deployment.html#hosting', 'Hosting and environment requirements'],
      ['Troubleshooting', 'troubleshooting.html', 'Common setup and runtime issues'],
      ['FAQ & support', 'support.html', 'Support-ready answers'],
    ]],
  ];

  const currentPage = `${document.body.dataset.page || 'index'}.html`;
  const nav = document.querySelector('[data-doc-nav]');
  if (nav) {
    let activePageFound = false;
    nav.innerHTML = docs.map(([group, icon, items]) => `
      <section class="nav-group">
        <button type="button" aria-expanded="true">
          ${svg(icon, 15, 'nav-group-icon')}<span>${group}</span><i class="ri-arrow-down-s-line chevron" aria-hidden="true"></i>
        </button>
        <ul>${items.map(([label, href]) => {
          const isCurrent = href.split('#')[0] === currentPage && !activePageFound;
          if (isCurrent) activePageFound = true;
          return `<li><a href="${href}" class="${isCurrent ? 'active' : ''}">${label}</a></li>`;
        }).join('')}</ul>
      </section>`).join('');

    nav.addEventListener('click', (event) => {
      const button = event.target.closest('.nav-group > button');
      if (button) {
        const list = button.nextElementSibling;
        const isOpen = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!isOpen));
        list.hidden = isOpen;
      }
      if (event.target.closest('a') && matchMedia('(max-width: 760px)').matches) closeNavigation();
    });
  }

  const themeButton = document.querySelector('[data-theme-toggle]');
  const preferredTheme = localStorage.getItem('orzen-doc-theme') || 'system';
  const setTheme = (preference) => {
    const actual = preference === 'system'
      ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : preference;
    document.documentElement.dataset.theme = actual;
    localStorage.setItem('orzen-doc-theme', preference);
    themeButton.innerHTML = window.docIcon(actual === 'dark' ? 'sun' : 'moon');
    themeButton.setAttribute('aria-label', actual === 'dark' ? 'Use light theme' : 'Use dark theme');
  };

  const originalIcon = window.docIcon;
  window.docIcon = (name, size = 16, className = '') => {
    if (name === 'sun') {
      return `<svg class="${className}" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2m4.95-14.95 1.41-1.41M5.64 18.36l1.41-1.41M22 12h-2M4 12H2m16.36 6.36-1.41-1.41M7.05 7.05 5.64 5.64"/></svg>`;
    }
    return originalIcon(name, size, className);
  };
  setTheme(preferredTheme);
  themeButton?.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));

  const menu = document.querySelector('[data-menu]');
  const sidebar = document.querySelector('.sidebar');
  const scrim = document.querySelector('[data-nav-scrim]');
  function closeNavigation() {
    sidebar?.classList.remove('open');
    document.body.classList.remove('nav-open');
    menu?.setAttribute('aria-expanded', 'false');
  }
  menu?.addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('open');
    document.body.classList.toggle('nav-open', isOpen);
    menu.setAttribute('aria-expanded', String(isOpen));
  });
  scrim?.addEventListener('click', closeNavigation);

  document.querySelectorAll('pre').forEach((pre) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Copy';
    button.setAttribute('aria-label', 'Copy code');
    button.addEventListener('click', async () => {
      const code = pre.querySelector('code')?.textContent || '';
      try {
        await navigator.clipboard.writeText(code);
        button.textContent = 'Copied';
        window.setTimeout(() => { button.textContent = 'Copy'; }, 1200);
      } catch {
        button.textContent = 'Select code';
      }
    });
    pre.append(button);
  });

  const article = document.querySelector('.article');
  const toc = document.querySelector('[data-toc]');
  if (article && toc) {
    const headings = [...article.querySelectorAll('h2[id], h3[id]')];
    toc.innerHTML = `<b>On this page</b>${headings.map((heading) => `<a href="#${heading.id}" data-id="${heading.id}">${heading.textContent}</a>`).join('')}`;
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) toc.querySelectorAll('a').forEach((link) => link.classList.toggle('active', link.dataset.id === entry.target.id));
    }), { rootMargin: '-20% 0px -70%' });
    headings.forEach((heading) => observer.observe(heading));
  }

  const dialog = document.querySelector('[data-search-dialog]');
  const searchInput = document.querySelector('[data-search-input]');
  const results = document.querySelector('[data-search-results]');
  const allPages = docs.flatMap(([category, , items]) => items.map(([title, href, description]) => ({ category, title, href, description })));
  let activeResult = -1;

  function renderResults(query = '') {
    const normalized = query.trim().toLowerCase();
    const found = allPages.filter((item) => `${item.title} ${item.description} ${item.category}`.toLowerCase().includes(normalized));
    results.innerHTML = found.length
      ? found.map((item) => `<a class="result" href="${item.href}"><b>${item.title}</b><small>${item.category} · ${item.description}</small></a>`).join('')
      : '<p class="result">No matching documentation. Try a broader term.</p>';
    activeResult = -1;
  }

  function openSearch() {
    if (!dialog.open) dialog.showModal();
    searchInput.value = '';
    renderResults();
    searchInput.focus();
  }

  function moveResult(direction) {
    const links = [...results.querySelectorAll('a.result')];
    if (!links.length) return;
    activeResult = (activeResult + direction + links.length) % links.length;
    links.forEach((link, index) => link.classList.toggle('is-active', index === activeResult));
    links[activeResult].scrollIntoView({ block: 'nearest' });
  }

  document.querySelector('.doc-search input')?.addEventListener('focus', openSearch);
  document.querySelector('[data-search-close]')?.addEventListener('click', () => dialog.close());
  searchInput?.addEventListener('input', (event) => renderResults(event.target.value));
  searchInput?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); moveResult(1); }
    if (event.key === 'ArrowUp') { event.preventDefault(); moveResult(-1); }
    if (event.key === 'Enter' && activeResult >= 0) results.querySelectorAll('a.result')[activeResult]?.click();
  });
  dialog?.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openSearch(); }
    if (event.key === 'Escape') closeNavigation();
  });
})();
