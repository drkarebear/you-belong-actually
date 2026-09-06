document.addEventListener('DOMContentLoaded', () => {
  const search = document.getElementById('translated-search');
  const clear = document.getElementById('translated-clear');
  const status = document.getElementById('translated-status');
  const empty = document.getElementById('translated-no-results');
  const items = [...document.querySelectorAll('.scenario-item')];

  function normalize(value) {
    return value.toLowerCase().replace(/[“”‘’]/g, '').replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function update() {
    const query = normalize(search.value);
    let shown = 0;
    items.forEach(item => {
      const haystack = normalize((item.dataset.search || '') + ' ' + item.textContent);
      const match = !query || haystack.includes(query);
      item.hidden = !match;
      if (match) shown += 1;
    });
    clear.hidden = !search.value;
    empty.hidden = shown !== 0;
    status.textContent = query ? `${shown} situation${shown === 1 ? '' : 's'} matched.` : `${items.length} common situations available.`;
  }

  search.addEventListener('input', update);
  clear.addEventListener('click', () => {
    search.value = '';
    update();
    search.focus();
  });

  // Open a linked scenario so keyboard and screen-reader users land on visible content.
  function openHashTarget() {
    if (!location.hash) return;
    const target = document.querySelector(location.hash);
    if (target && target.matches('details.scenario-item')) target.open = true;
  }
  window.addEventListener('hashchange', openHashTarget);
  openHashTarget();
});
