(() => {
  const search = document.getElementById('decoder-search');
  const clear = document.getElementById('clear-search');
  const terms = Array.from(document.querySelectorAll('.decoder-term'));
  const filters = Array.from(document.querySelectorAll('.filter-button'));
  const status = document.getElementById('decoder-status');
  const noResults = document.getElementById('decoder-no-results');
  if (!search || !terms.length || !status) return;

  let activeFilter = 'all';

  function normalize(value) {
    return value.toLowerCase().replace(/[’']/g, "'").trim();
  }

  function update() {
    const query = normalize(search.value);
    let visible = 0;

    terms.forEach((term) => {
      const categoryMatch = activeFilter === 'all' || term.dataset.category === activeFilter;
      const haystack = normalize(`${term.dataset.search || ''} ${term.textContent || ''}`);
      const queryMatch = !query || haystack.includes(query);
      const show = categoryMatch && queryMatch;
      term.hidden = !show;
      if (show) visible += 1;
    });

    const totalText = visible === 1 ? '1 term shown.' : `${visible} terms shown.`;
    status.textContent = totalText;
    noResults.hidden = visible !== 0;
    clear.hidden = query.length === 0;
  }

  search.addEventListener('input', update);
  search.addEventListener('search', update);

  clear.addEventListener('click', () => {
    search.value = '';
    search.focus();
    update();
  });

  filters.forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter || 'all';
      filters.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      update();
    });
  });

  // If a quick link lands on a decoder entry, open it and move keyboard focus to its summary.
  function openHashTarget() {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (target && target.matches('details.decoder-term')) {
      target.hidden = false;
      target.open = true;
      const summary = target.querySelector('summary');
      if (summary) summary.setAttribute('tabindex', '-1');
    }
  }

  window.addEventListener('hashchange', openHashTarget);
  openHashTarget();
  update();
})();
