/* ============================================
   Filter Forge — Community Filters Page
   ============================================ */

(function () {
  'use strict';

  // Same bundled list the editor's "Import from Author" uses, synced from
  // the Maaaaaarrk/LootFilters fork by the update-resources skill.
  var FILTERS_URL = 'data/filters.json';
  var AUTHOR_FILES_URL = 'data/author-filters.json';
  var grid = document.getElementById('filter-grid');
  var loading = document.getElementById('filters-loading');
  var errorEl = document.getElementById('filters-error');
  var searchInput = document.getElementById('filter-search');
  var noResults = document.getElementById('filters-no-results');
  var emptyEl = document.getElementById('filters-empty');
  var filters = [];
  var escapeHtml = FF.escapeHtml;

  function apiUrlToRepoUrl(apiUrl) {
    // https://api.github.com/repos/X/Y/contents -> https://github.com/X/Y
    var match = apiUrl.match(/api\.github\.com\/repos\/([^/]+\/[^/]+)/);
    return match ? 'https://github.com/' + match[1] : apiUrl;
  }

  function fetchJson(url) {
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    });
  }

  // Attach each author's .filter files (from author-filters.json) by author name
  function attachFiles(data, authorFilters) {
    var byAuthor = {};
    (authorFilters || []).forEach(function (a) { byAuthor[a.author] = a.files || []; });
    data.forEach(function (f) { f.files = byAuthor[f.author] || []; });
    return data;
  }

  function fileCountLabel(count) {
    return count + ' filter file' + (count === 1 ? '' : 's');
  }

  function renderFilters(data) {
    filters = data;
    loading.classList.add('hidden');
    grid.innerHTML = '';
    if (emptyEl) emptyEl.classList.toggle('hidden', data.length > 0);

    data.forEach(function (f, i) {
      var repoUrl = apiUrlToRepoUrl(f.url);
      var card = document.createElement('div');
      card.className = 'filter-card';
      card.setAttribute('data-index', i);
      card.innerHTML =
        '<h2 class="filter-card-name">' + escapeHtml(f.name) + '</h2>' +
        '<div class="filter-card-author">by ' + escapeHtml(f.author) +
          (f.files.length ? ' &middot; ' + fileCountLabel(f.files.length) : '') + '</div>' +
        '<div class="filter-card-links">' +
          '<a href="editor.html?author=' + encodeURIComponent(f.author) + '" class="filter-card-load">Load in Editor</a>' +
          '<a href="' + escapeHtml(repoUrl) + '" target="_blank" rel="noopener" aria-label="GitHub repository for ' + escapeHtml(f.name) + '">GitHub</a>' +
        '</div>';
      grid.appendChild(card);
    });

    filterCards(searchInput ? searchInput.value : '');
  }

  function filterCards(query) {
    var terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    var cards = grid.querySelectorAll('.filter-card');

    var visibleCount = 0;
    cards.forEach(function (card) {
      var idx = parseInt(card.getAttribute('data-index'), 10);
      var f = filters[idx];
      var fileNames = f.files.map(function (file) { return file.displayName || file.name; }).join(' ');
      var text = (f.name + ' ' + f.author + ' ' + fileNames).toLowerCase();
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

  fetchJson(FILTERS_URL)
    .then(function (data) {
      // File counts are a bonus; render without them if that list fails
      return fetchJson(AUTHOR_FILES_URL)
        .catch(function () { return []; })
        .then(function (authorFilters) { return attachFiles(data, authorFilters); });
    })
    .then(renderFilters)
    .catch(function () {
      loading.classList.add('hidden');
      errorEl.classList.remove('hidden');
    });
})();
