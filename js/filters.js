/* ============================================
   Filter Forge — Community Filters Page
   ============================================ */

(function () {
  'use strict';

  var LIVE_URL = 'https://raw.githubusercontent.com/Project-Diablo-2/LootFilters/refs/heads/main/filters.json';
  var LOCAL_URL = 'data/filters.json';
  var grid = document.getElementById('filter-grid');
  var loading = document.getElementById('filters-loading');
  var errorEl = document.getElementById('filters-error');
  var searchInput = document.getElementById('filter-search');
  var noResults = document.getElementById('filters-no-results');
  var filters = [];

  function apiUrlToRepoUrl(apiUrl) {
    // https://api.github.com/repos/X/Y/contents -> https://github.com/X/Y
    var match = apiUrl.match(/api\.github\.com\/repos\/([^/]+\/[^/]+)/);
    return match ? 'https://github.com/' + match[1] : apiUrl;
  }

  function renderFilters(data) {
    filters = data;
    loading.style.display = 'none';
    grid.innerHTML = '';

    data.forEach(function (f, i) {
      var repoUrl = apiUrlToRepoUrl(f.url);
      var card = document.createElement('div');
      card.className = 'filter-card';
      card.setAttribute('data-index', i);
      card.innerHTML =
        '<div class="filter-card-name">' + escapeHtml(f.name) + '</div>' +
        '<div class="filter-card-author">by ' + escapeHtml(f.author) + '</div>' +
        '<div class="filter-card-links">' +
          '<a href="editor.html?author=' + encodeURIComponent(f.author) + '" class="filter-card-load">Load in Editor</a>' +
          '<a href="' + escapeHtml(repoUrl) + '" target="_blank" rel="noopener" aria-label="GitHub repository for ' + escapeHtml(f.name) + '">GitHub</a>' +
        '</div>';
      grid.appendChild(card);
    });

    filterCards(searchInput ? searchInput.value : '');
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function filterCards(query) {
    var terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    var cards = grid.querySelectorAll('.filter-card');

    var visibleCount = 0;
    cards.forEach(function (card) {
      var idx = parseInt(card.getAttribute('data-index'), 10);
      var f = filters[idx];
      var text = (f.name + ' ' + f.author).toLowerCase();
      var visible = terms.length === 0 || terms.every(function (t) { return text.indexOf(t) !== -1; });
      card.classList.toggle('hidden', !visible);
      if (visible) visibleCount++;
    });
    if (noResults) {
      noResults.classList.toggle('hidden', visibleCount > 0 || terms.length === 0);
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      filterCards(this.value);
    });
  }

  fetch(LIVE_URL)
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(renderFilters)
    .catch(function () {
      // Fallback to local copy
      fetch(LOCAL_URL)
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        })
        .then(renderFilters)
        .catch(function () {
          loading.style.display = 'none';
          errorEl.style.display = 'block';
        });
    });
})();
