/* ============================================
   Filter Forge — FAQ Engine
   ============================================ */

(function () {
  'use strict';

  var DATA_URL = 'data/faq.json';
  var container = document.getElementById('faq-container');
  var searchInput = document.getElementById('faq-search');
  var resultCount = document.getElementById('faq-result-count');
  var noResults = document.getElementById('faq-no-results');
  var faqData = null;
  var searchIndex = [];
  var debounceTimer = null;

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function stripHtml(html) {
    var tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  function buildSearchIndex(groups) {
    var index = [];
    groups.forEach(function (group, gi) {
      group.questions.forEach(function (q, qi) {
        var answerText = stripHtml(q.answer);
        var tags = (q.tags || []).join(' ');
        var searchText = (q.question + ' ' + answerText + ' ' + tags)
          .toLowerCase()
          .replace(/[^\w\s]/g, ' ');
        index.push({
          groupIdx: gi,
          questionIdx: qi,
          searchText: searchText
        });
      });
    });
    return index;
  }

  function render(groups) {
    container.innerHTML = '';
    groups.forEach(function (group, gi) {
      var groupEl = document.createElement('div');
      groupEl.className = 'faq-group';
      groupEl.setAttribute('data-group', gi);

      var header = document.createElement('button');
      header.type = 'button';
      header.className = 'faq-group-header';
      header.setAttribute('aria-expanded', 'false');
      header.innerHTML =
        '<span>' + escapeHtml(group.title) +
        '<span class="faq-group-count">(' + group.questions.length + ')</span></span>' +
        '<span class="chevron" aria-hidden="true">&#9654;</span>';

      header.addEventListener('click', function () {
        groupEl.classList.toggle('open');
        header.setAttribute('aria-expanded', String(groupEl.classList.contains('open')));
      });

      var body = document.createElement('div');
      body.className = 'faq-group-body';

      group.questions.forEach(function (q, qi) {
        var item = document.createElement('div');
        item.className = 'faq-item';
        item.setAttribute('data-group', gi);
        item.setAttribute('data-question', qi);
        if (q.id) item.id = q.id;

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'faq-question';
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = '<span class="q-chevron" aria-hidden="true">&#9654;</span><span class="q-text">' + escapeHtml(q.question) + '</span>';

        btn.addEventListener('click', function () {
          item.classList.toggle('open');
          btn.setAttribute('aria-expanded', String(item.classList.contains('open')));
        });

        var answer = document.createElement('div');
        answer.className = 'faq-answer';
        answer.innerHTML = q.answer;

        item.appendChild(btn);
        item.appendChild(answer);
        body.appendChild(item);
      });

      groupEl.appendChild(header);
      groupEl.appendChild(body);
      container.appendChild(groupEl);
    });

    // Add copy buttons to code blocks in answers
    container.querySelectorAll('pre code').forEach(function (codeBlock) {
      var pre = codeBlock.parentElement;
      if (pre.querySelector('.copy-btn')) return;
      var btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      btn.setAttribute('aria-label', 'Copy code');
      btn.addEventListener('click', function () {
        navigator.clipboard.writeText(codeBlock.textContent).then(function () {
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          setTimeout(function () {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
          }, 1500);
        }).catch(function () {
          btn.textContent = 'Copy failed';
          setTimeout(function () {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
          }, 1500);
        });
      });
      pre.appendChild(btn);
    });
  }

  function doSearch(query) {
    var groups = container.querySelectorAll('.faq-group');
    var items = container.querySelectorAll('.faq-item');

    if (!query.trim()) {
      // Reset: show all, collapse all
      groups.forEach(function (g) {
        g.classList.remove('hidden', 'open');
        var hdr = g.querySelector('.faq-group-header');
        if (hdr) hdr.setAttribute('aria-expanded', 'false');
      });
      items.forEach(function (i) {
        i.classList.remove('hidden', 'open');
        var qBtn = i.querySelector('.faq-question');
        if (qBtn) qBtn.setAttribute('aria-expanded', 'false');
      });
      resultCount.textContent = '';
      noResults.classList.add('hidden');
      if (faqData) highlightMatches([]);
      history.replaceState(null, '', window.location.pathname + window.location.hash);
      return;
    }

    var terms = query.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(Boolean);
    var matches = searchIndex.filter(function (entry) {
      return terms.every(function (t) { return entry.searchText.indexOf(t) !== -1; });
    });

    var matchSet = {};
    matches.forEach(function (m) {
      matchSet[m.groupIdx + '-' + m.questionIdx] = true;
    });

    var matchCount = matches.length;
    var groupsWithMatches = {};

    // Hide/show items
    items.forEach(function (item) {
      var gi = item.getAttribute('data-group');
      var qi = item.getAttribute('data-question');
      var key = gi + '-' + qi;
      if (matchSet[key]) {
        item.classList.remove('hidden');
        groupsWithMatches[gi] = true;
        var qBtn = item.querySelector('.faq-question');
        // Auto-expand if 3 or fewer results
        if (matchCount <= 3) {
          item.classList.add('open');
          if (qBtn) qBtn.setAttribute('aria-expanded', 'true');
        } else {
          item.classList.remove('open');
          if (qBtn) qBtn.setAttribute('aria-expanded', 'false');
        }
      } else {
        item.classList.add('hidden');
        item.classList.remove('open');
        var qBtnH = item.querySelector('.faq-question');
        if (qBtnH) qBtnH.setAttribute('aria-expanded', 'false');
      }
    });

    // Hide/show groups
    groups.forEach(function (group) {
      var gi = group.getAttribute('data-group');
      var gHdr = group.querySelector('.faq-group-header');
      if (groupsWithMatches[gi]) {
        group.classList.remove('hidden');
        group.classList.add('open');
        if (gHdr) gHdr.setAttribute('aria-expanded', 'true');
      } else {
        group.classList.add('hidden');
        group.classList.remove('open');
        if (gHdr) gHdr.setAttribute('aria-expanded', 'false');
      }
    });

    // Highlight matching text in question titles
    highlightMatches(terms);

    // Update result count
    if (matchCount === 0) {
      resultCount.textContent = '';
      noResults.classList.remove('hidden');
    } else {
      resultCount.textContent = matchCount + ' result' + (matchCount === 1 ? '' : 's') + ' for "' + query.trim() + '"';
      noResults.classList.add('hidden');
    }

    // Update URL
    history.replaceState(null, '', '?search=' + encodeURIComponent(query.trim()));
  }

  function highlightMatches(terms) {
    container.querySelectorAll('.faq-item:not(.hidden) .q-text').forEach(function (el) {
      var original = faqData.groups[el.closest('.faq-item').getAttribute('data-group')]
        .questions[el.closest('.faq-item').getAttribute('data-question')].question;
      var html = escapeHtml(original);

      terms.forEach(function (term) {
        var regex = new RegExp('(' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
        html = html.replace(regex, '<span class="search-highlight">$1</span>');
      });

      el.innerHTML = html;
    });
  }

  // Load data — use inline FAQ_DATA global (from faq-data.js) or fetch as fallback
  function initFaq(data) {
      faqData = data;
      searchIndex = buildSearchIndex(data.groups);
      render(data.groups);

      // Check for search param in URL
      var params = new URLSearchParams(window.location.search);
      var searchParam = params.get('search');
      if (searchParam) {
        searchInput.value = searchParam;
        doSearch(searchParam);
      }

      // Check for hash (direct link to question)
      if (window.location.hash) {
        var target = document.getElementById(window.location.hash.slice(1));
        if (target && target.classList.contains('faq-item')) {
          var group = target.closest('.faq-group');
          if (group) {
            group.classList.add('open');
            var ghdr = group.querySelector('.faq-group-header');
            if (ghdr) ghdr.setAttribute('aria-expanded', 'true');
          }
          target.classList.add('open');
          var tBtn = target.querySelector('.faq-question');
          if (tBtn) tBtn.setAttribute('aria-expanded', 'true');
          setTimeout(function () {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        }
      }
  }

  // Try inline data first (works on file://), then fetch as fallback
  if (typeof FAQ_DATA !== 'undefined') {
    initFaq(FAQ_DATA);
  } else {
    fetch(DATA_URL)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(initFaq)
      .catch(function (err) {
        container.innerHTML = '<p class="text-muted text-center">Failed to load FAQ data.</p>';
        console.error('FAQ load error:', err);
      });
  }

  // Search handler with debounce
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      var val = this.value;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        doSearch(val);
      }, 150);
    });
  }
})();
