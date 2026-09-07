(() => {
  const header = document.querySelector('.site-header');
  if (!header || document.querySelector('.mobile-menu')) return;

  const menuId = 'keeperlab-mobile-menu';
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'mobile-menu-toggle';
  toggle.setAttribute('aria-label', 'Ouvrir le menu');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', menuId);
  toggle.innerHTML = '<span aria-hidden="true">☰</span>';

  const menu = document.createElement('aside');
  menu.id = menuId;
  menu.className = 'mobile-menu';
  menu.setAttribute('aria-label', 'Navigation mobile');
  menu.setAttribute('aria-modal', 'true');
  menu.setAttribute('role', 'dialog');
  menu.hidden = true;
  menu.innerHTML = '<div class="mobile-menu__top"><a class="mobile-menu__logo" href="site.html" aria-label="KeeperLab, accueil"><span>KEEPER</span>LAB<i></i></a><button class="mobile-menu__close" type="button" aria-label="Fermer le menu">✕</button></div><nav class="mobile-menu__links" aria-label="Navigation mobile"><a href="catalogue.html">CATALOGUE</a><a class="mobile-menu__comparator" href="comparateur.html">COMPARATEUR</a><a href="catalogue.html?category=gants">TROUVE TON GANT</a><a href="articles.html">ARTICLES / BLOG</a><a href="a-propos.html">À PROPOS</a></nav><div class="mobile-menu__bottom"><a class="mobile-menu__cta" href="catalogue.html?category=gants">🧤 TROUVE TON GANT <span aria-hidden="true">→</span></a><p class="mobile-menu__tagline">GEAR. COMPARE. SAVE.</p></div>';

  header.append(toggle);
  document.body.append(menu);

  const closeButton = menu.querySelector('.mobile-menu__close');
  const links = [...menu.querySelectorAll('a')];
  let scrollY = 0;
  let closeTimer;

  function openMenu() {
    clearTimeout(closeTimer);
    scrollY = window.scrollY;
    document.documentElement.style.setProperty('--mobile-menu-top', `${-scrollY}px`);
    document.documentElement.classList.add('mobile-menu-open');
    document.body.classList.add('mobile-menu-open');
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add('is-open'));
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Fermer le menu');
    closeButton.focus();
  }

  function closeMenu({ restoreFocus = true } = {}) {
    if (menu.hidden) return;
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Ouvrir le menu');
    document.documentElement.classList.remove('mobile-menu-open');
    document.body.classList.remove('mobile-menu-open');
    window.scrollTo(0, scrollY);
    closeTimer = window.setTimeout(() => { menu.hidden = true; }, 260);
    if (restoreFocus) toggle.focus();
  }

  toggle.addEventListener('click', () => menu.hidden ? openMenu() : closeMenu());
  closeButton.addEventListener('click', () => closeMenu());
  links.forEach(link => link.addEventListener('click', () => closeMenu({ restoreFocus: false })));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  window.matchMedia('(min-width:768px)').addEventListener('change', event => { if (event.matches) closeMenu({ restoreFocus: false }); });
})();
