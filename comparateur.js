(() => {
  'use strict';
  const selects = [...document.querySelectorAll('.compare-select')];
  const rows = document.querySelector('#compare-rows');
  const status = document.querySelector('#compare-status');
  const fields = [
    ['brand', 'Marque'], ['name', 'Modèle'], ['price', 'Prix indicatif'],
    ['cut', 'Coupe'], ['latex', 'Latex / paume'], ['grip', 'Grip'],
    ['durability', 'Durabilité'], ['terrain', 'Terrain recommandé'],
    ['conditions', 'Météo / conditions'], ['fit', 'Fit / ajustement'],
    ['closure', 'Strap / fermeture'], ['keeperlabScore', 'Score KeeperLab'],
    ['sizes', 'Tailles'], ['fingerProtection', 'Protection des doigts'],
    ['weight', 'Poids'], ['badge', 'Sélection KeeperLab'], ['description', 'Description']
  ];
  let products = [];
  function value(p, key) {
    if (!p) return '—';
    const v = p[key] ?? p.specs?.[key];
    if (v === null || v === undefined || v === '' || (Array.isArray(v) && !v.length)) return 'Non renseigné';
    if (key === 'price') {
      if (typeof v !== 'number' || !Number.isFinite(v)) return 'Non renseigné';
      try { return new Intl.NumberFormat('fr-CH', {style: 'currency', currency: p.currency || 'CHF'}).format(v); }
      catch { return 'Non renseigné'; }
    }
    if (typeof v === 'boolean') return v ? 'Oui' : 'Non';
    if (Array.isArray(v)) return v.join(' · ');
    return typeof v === 'object' ? 'Non renseigné' : String(v);
  }
  function render() {
    const chosen = selects.map(s => products.find(p => p.id === s.value));
    rows.replaceChildren();
    fields.forEach(([key, label]) => {
      const row = document.createElement('div'); row.className = 'compare-row'; row.setAttribute('role', 'row');
      const heading = document.createElement('div'); heading.className = 'compare-label'; heading.setAttribute('role', 'rowheader'); heading.textContent = label; row.append(heading);
      chosen.forEach(p => {
        const cell = document.createElement('div'); cell.className = 'compare-value'; cell.setAttribute('role', 'cell'); cell.textContent = value(p, key);
        if (!p || cell.textContent === 'Non renseigné') cell.classList.add('missing');
        row.append(cell);
      });
      rows.append(row);
    });
    chosen.forEach((p, i) => {
      const link = document.querySelector('#compare-detail-' + i);
      link.hidden = !p;
      if (p) { link.href = 'produit.html?id=' + encodeURIComponent(p.id); link.textContent = 'Voir la fiche : ' + p.name + ' →'; }
    });
    status.textContent = chosen.every(Boolean) ? (chosen[0].id === chosen[1].id ? 'Le même gant est sélectionné des deux côtés. Choisissez un autre modèle pour comparer.' : chosen.map(p => p.name).join(' / ')) : 'Sélectionnez un gant de chaque côté pour comparer.';
  }
  selects.forEach(s => s.addEventListener('change', () => {
    const url = new URL(location.href);
    selects.forEach((s, i) => { if (s.value) url.searchParams.set(i ? 'right' : 'left', s.value); else url.searchParams.delete(i ? 'right' : 'left'); });
    history.replaceState(null, '', url); render();
  }));
  async function load() {
    status.textContent = 'Chargement des gants…';
    const retry = document.querySelector('#compare-retry'); retry.hidden = true;
    try {
      const response = await fetch('data/products.json');
      if (!response.ok) throw new Error('Catalogue indisponible');
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Catalogue invalide');
      products = data.filter(p => p.category === 'gants' && typeof p.id === 'string' && p.name);
      const params = new URLSearchParams(location.search);
      selects.forEach((select, i) => {
        select.replaceChildren(new Option('Choisir un gant', ''));
        products.forEach(p => select.add(new Option(p.brand + ' — ' + p.name, p.id)));
        const id = params.get(i ? 'right' : 'left');
        if (products.some(p => p.id === id)) select.value = id;
        select.disabled = !products.length;
      });
      render();
      if (!products.length) status.textContent = 'Aucun gant disponible dans le catalogue pour le moment.';
    } catch {
      status.textContent = 'Impossible de charger les gants. Réessayez dans un instant.'; retry.hidden = false;
    }
  }
  document.querySelector('#compare-retry').addEventListener('click', load);
  render(); load();
})();
