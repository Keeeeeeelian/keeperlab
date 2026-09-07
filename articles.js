(() => {
  const grid = document.querySelector('.article-grid');
  const cards = [...grid.querySelectorAll('article')];
  const buttons = [...document.querySelectorAll('[data-filter]')];
  const featured = document.querySelector('[data-feature-category]');
  const count = document.querySelector('#article-count > span:last-child');
  const countLabel = document.querySelector('#article-count-label');
  const title = document.querySelector('#article-feed-title');
  const swipeHint = document.querySelector('#article-swipe-hint');
  const labels = { all: 'TOUT VOIR · DU PLUS RÉCENT AU PLUS ANCIEN', guides: 'GUIDES', comparatifs: 'COMPARATIFS', tests: 'TESTS', conseils: 'CONSEILS' };

  cards.sort((a, b) => new Date(b.dataset.date) - new Date(a.dataset.date)).forEach(card => grid.append(card));

  function show(filter) {
    const isAll = filter === 'all';
    const visible = cards.filter(card => isAll || card.dataset.category === filter);
    cards.forEach(card => { card.hidden = !visible.includes(card); });
    grid.classList.toggle('is-all', isAll);
    grid.scrollLeft = 0;
    buttons.forEach(button => {
      const selected = button.dataset.filter === filter;
      button.classList.toggle('selected', selected);
      button.setAttribute('aria-selected', String(selected));
    });
    if (featured) featured.hidden = !isAll && featured.dataset.featureCategory !== filter;
    count.textContent = String(visible.length).padStart(2, '0');
    countLabel.textContent = isAll ? 'TOUS LES ARTICLES' : labels[filter];
    title.textContent = labels[filter];
    swipeHint.hidden = !isAll;
  }

  buttons.forEach(button => button.addEventListener('click', () => show(button.dataset.filter)));
  show('all');
})();
