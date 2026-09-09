(() => {
  'use strict';

  const grid = document.querySelector('#maillots-grid');
  const status = document.querySelector('#maillots-status');
  const types = document.querySelector('#maillots-types');
  const club = document.querySelector('#maillots-club');
  const retry = document.querySelector('#maillots-retry');
  const template = document.querySelector('#maillot-card-template');
  const labels = { domicile: 'Domicile', exterieur: 'Extérieur', third: 'Third' };
  let maillots = [];
  let activeType = 'all';

  function card(maillot) {
    const fragment = template.content.cloneNode(true);
    const article = fragment.querySelector('article');
    article.dataset.maillotId = maillot.id;
    article.querySelector('.maillot-club').textContent = maillot.club;
    article.querySelector('h2').textContent = maillot.name;
    article.querySelector('.maillot-meta').textContent = `${labels[maillot.type] || maillot.type} · ${maillot.season}`;
    article.querySelector('.maillot-sizes').textContent = `Tailles : ${maillot.sizes.join(' · ')}`;
    article.querySelector('.maillot-merchant').textContent = `Boutique : ${maillot.merchant}`;

    const link = article.querySelector('.maillot-affiliate');
    // Preserve the supplied Awin URL verbatim, including its encoded destination.
    link.setAttribute('href', maillot.affiliateUrl);
    link.setAttribute('aria-label', `Voir le maillot — ${maillot.name} (nouvel onglet)`);

    if (maillot.image) {
      const image = document.createElement('img');
      const placeholder = article.querySelector('.maillot-placeholder');
      image.alt = maillot.name;
      image.loading = 'lazy';
      image.decoding = 'async';
      image.width = 600;
      image.height = 600;
      image.addEventListener('load', () => { placeholder.hidden = true; });
      image.addEventListener('error', () => { image.remove(); placeholder.hidden = false; });
      image.src = maillot.image;
      article.querySelector('.maillot-visual').append(image);
    }
    return fragment;
  }

  function render() {
    const visible = maillots.filter(maillot =>
      (activeType === 'all' || maillot.type === activeType) &&
      (!club.value || maillot.club === club.value)
    );
    grid.replaceChildren(...visible.map(card));
    status.textContent = visible.length
      ? `${visible.length} maillot${visible.length > 1 ? 's' : ''}`
      : 'Aucun maillot pour ces filtres. Essayez un autre club ou un autre type.';
    types.querySelectorAll('button').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.type === activeType));
    });
  }

  async function load() {
    retry.hidden = true;
    types.disabled = true;
    club.disabled = true;
    grid.setAttribute('aria-busy', 'true');
    status.textContent = 'Chargement des maillots…';
    try {
      // This collection intentionally never loads or modifies data/products.json.
      const response = await fetch('data/maillots.json');
      if (!response.ok) throw new Error('Maillots indisponibles');
      const data = await response.json();
      if (!Array.isArray(data) || !data.every(item =>
        item && ['id', 'name', 'club', 'type', 'season', 'merchant', 'affiliateUrl'].every(key =>
          typeof item[key] === 'string' && item[key].length > 0
        ) && Array.isArray(item.sizes) && item.sizes.every(size => typeof size === 'string') &&
        (item.image === null || typeof item.image === 'string')
      )) throw new Error('Données maillots invalides');
      maillots = data;
      const clubs = [...new Set(maillots.map(item => item.club))].sort((a, b) => a.localeCompare(b, 'fr'));
      club.replaceChildren(new Option('Tous les clubs', ''), ...clubs.map(name => new Option(name, name)));
      types.disabled = false;
      club.disabled = false;
      render();
    } catch {
      grid.replaceChildren();
      status.textContent = 'Impossible de charger les maillots. Vous pouvez réessayer.';
      retry.hidden = false;
    } finally {
      grid.setAttribute('aria-busy', 'false');
    }
  }

  types.addEventListener('click', event => {
    const button = event.target.closest('button[data-type]');
    if (!button) return;
    activeType = button.dataset.type;
    render();
  });
  club.addEventListener('change', render);
  retry.addEventListener('click', load);
  load();
})();
