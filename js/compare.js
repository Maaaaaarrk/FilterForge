/* ============================================
   Filter Forge — Compare Page
   One column per community filter group: the same sample drops evaluated by
   each filter at its own filter level. Columns can be hidden, and the filter
   and level changed per column; the URL keeps the layout so a head to head
   can be shared (?c=<group>:<file>:<level>, one per visible column, in order).
   ============================================ */

(function () {
  'use strict';

  var Engine = window.FF.FilterEngine;
  var Samples = window.FF.SampleItems;

  // Default filter and level per group (by author), picked one by one to be roughly
  // comparable to Hiim level 6 (stricter, rejuvs but no HP/MP) on each filter's own scale.
  var DEFAULTS = {
    'HiimFilter': { file: 'Hiim.filter', level: 6 },
    'Hiim - Hyper': { file: 'Hiim_Hyper.filter', level: 6 },
    'Hiim - TalRasha': { file: 'Hiim_TalRasha_Themed.filter', level: 6 },
    'Hiim - Vanilla+': { file: 'Hiim_Vanilla_Plus.filter', level: 6 },
    'Kassahi': { file: 'Kassahi.filter', level: 6 },
    'Philanthropy777': { file: 'Kassahi_Phil777.filter', level: 6 },
    'Wolfie': { file: 'combined.filter', level: 4 },
    'Kryszard': { file: 'item.filter', level: 5 },
    'eqN': { file: 'eqN-All-In-One.filter', level: 6 },
    'Erazure': { file: 'Erazure-Main.filter', level: 6 },
    'ADevDH': { file: 'dark.filter', level: 4 },
    'Dauracul': { file: 'dauracul.filter', level: 3 },
    'Sven': { file: 'Revised.filter', level: 6 },
    'PiLLLa': { file: 'S13_Starter.filter', level: 7 },
    'Roofoo': { file: 'Roofoo.filter', level: 5 },
    'Phyx10n': { file: 'main.filter', level: 3 },
    'Vylens': { file: 'Vylens.filter', level: 5 },
    'huns1313': { file: 'MATRIX.filter', level: 1 }
  };
  // Hiim and the Kassahi family first, then everyone else in data order.
  var FIRST = ['HiimFilter', 'Hiim - Hyper', 'Hiim - TalRasha', 'Hiim - Vanilla+', 'Kassahi', 'Philanthropy777'];

  var groups = [];        // [{slug, author, name, files}]
  var columns = [];       // visible, in order: [{group, file, level, filter, error}]
  var categories = [];
  var filterCache = {};   // url -> Promise<Filter>

  var table = document.getElementById('compare-table');
  var statusEl = document.getElementById('compare-status');
  var hiddenWrap = document.getElementById('compare-hidden');
  var hiddenList = document.getElementById('compare-hidden-list');
  var copyBtn = document.getElementById('compare-copy');
  var resetBtn = document.getElementById('compare-reset');

  function slugOf(author) {
    return author.toLowerCase().replace(/\+/g, 'plus').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function loadFilter(file) {
    if (!filterCache[file.url]) {
      filterCache[file.url] = fetch(file.url)
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.arrayBuffer();
        })
        .then(function (buf) { return Engine.parse(Engine.decode(buf)); });
      // let a failed download be retried
      filterCache[file.url].catch(function () { delete filterCache[file.url]; });
    }
    return filterCache[file.url];
  }

  // ---- state <-> URL --------------------------------------------------------------

  // The URL only records what differs from the defaults, so links stay short:
  //   except=a,b        default columns without groups a and b
  //   set=tok,tok       per-group changes on top of that; a group's first token changes its
  //                     column, any further tokens for it add copies right after it
  //   only=tok,tok      exactly these columns, in this order (used when shorter, or when
  //                     the columns are reordered)
  // A token is <group>[.<file index>][@<level>], e.g. hiimfilter@8 or kassahi.5@6.

  function defaultColumn(g) {
    var d = DEFAULTS[g.author] || {};
    var file = g.files.filter(function (f) { return f.name === d.file; })[0] || g.files[0];
    return { group: g, file: file, level: d.level || 1 };
  }

  function defaultColumns() {
    return groups.map(defaultColumn);
  }

  function groupBySlug(slug) {
    return groups.filter(function (g) { return g.slug === slug; })[0] || null;
  }

  function parseToken(tok) {
    var m = tok.match(/^([a-z0-9-]+)(?:\.(\d+))?(?:@(\d+))?$/);
    var group = m && groupBySlug(m[1]);
    if (!group) return null;
    var col = defaultColumn(group);
    if (m[2] !== undefined && group.files[+m[2]]) col.file = group.files[+m[2]];
    if (m[3] !== undefined) col.level = +m[3];
    return col;
  }

  function token(col, always) {
    var def = defaultColumn(col.group);
    var t = col.group.slug;
    if (col.file !== def.file) t += '.' + col.group.files.indexOf(col.file);
    if (col.level !== def.level) t += '@' + col.level;
    return t === col.group.slug && !always ? '' : t;
  }

  function list(params, key) {
    var v = params.get(key);
    return v ? v.split(',').filter(Boolean) : [];
  }

  function columnsFromUrl() {
    var params = new URLSearchParams(location.search);
    if (params.has('only')) {
      var only = list(params, 'only').map(parseToken).filter(Boolean);
      return only.length ? only : null;
    }
    if (!params.has('except') && !params.has('set')) return null;
    var except = list(params, 'except');
    var cols = defaultColumns().filter(function (c) { return except.indexOf(c.group.slug) === -1; });
    var seen = {};
    list(params, 'set').forEach(function (tok) {
      var col = parseToken(tok);
      if (!col) return;
      var slug = col.group.slug;
      var idx = -1;
      cols.forEach(function (c, i) { if (c.group === col.group) idx = i; });
      if (idx === -1) return;
      if (!seen[slug]) {
        cols[idx] = col;      // first token: change the group's column
        seen[slug] = true;
      } else {
        cols.splice(idx + 1, 0, col);   // more tokens: copies after the last one
      }
    });
    return cols;
  }

  // except/set form, or null when the columns aren't in default group order.
  function exceptForm() {
    var order = groups.map(function (g) { return g.slug; });
    var last = -1;
    var present = {};
    for (var i = 0; i < columns.length; i++) {
      var pos = order.indexOf(columns[i].group.slug);
      if (pos < last || (pos !== last && present[pos])) return null;
      present[pos] = true;
      last = pos;
    }
    var except = groups.filter(function (g, i) { return !present[i]; }).map(function (g) { return g.slug; });
    var set = [];
    columns.forEach(function (col, i) {
      var copies = columns.filter(function (c) { return c.group === col.group; }).length;
      var t = token(col, copies > 1);
      if (t) set.push(t);
    });
    var parts = [];
    if (except.length) parts.push('except=' + except.join(','));
    if (set.length) parts.push('set=' + set.join(','));
    return parts.join('&');
  }

  function shareQuery() {
    var only = 'only=' + columns.map(function (c) { return token(c, true); }).join(',');
    var except = exceptForm();
    return except !== null && except.length <= only.length ? except : only;
  }

  function shareUrl() {
    var q = shareQuery();
    return location.pathname + (q ? '?' + q : '');
  }

  function syncUrl() {
    try { history.replaceState(null, '', shareUrl()); } catch (e) { /* file:// */ }
  }

  // ---- rendering ------------------------------------------------------------------

  function renderLabel(cell, col, item) {
    cell.textContent = '';
    if (col.error) {
      cell.appendChild(el('span', 'compare-note', '—'));
      return;
    }
    if (!col.filter) {
      cell.appendChild(el('span', 'compare-note', '…'));
      return;
    }
    var res = col.filter.label(item, col.level);
    if (!res.shown) {
      cell.appendChild(el('span', 'compare-hidden-label', 'hidden'));
      return;
    }
    var box = el('div', 'game-label');
    res.lines.forEach(function (line) {
      var row = el('div', 'game-label-line');
      line.forEach(function (seg) {
        var s = el('span', null, seg.text);
        s.style.color = seg.color;
        row.appendChild(s);
      });
      if (!line.length) row.innerHTML = '&nbsp;';
      box.appendChild(row);
    });
    cell.appendChild(box);
  }

  function levelOptions(select, col) {
    select.textContent = '';
    var names = col.filter ? col.filter.levels : {};
    var keys = Object.keys(names).map(Number);
    var max = Math.max(keys.length ? Math.max.apply(null, keys) : 0, col.level, 1);
    for (var lvl = 0; lvl <= max; lvl++) {
      var label = lvl === 0 ? '0 — Off' : lvl + (names[lvl] ? ' — ' + names[lvl] : '');
      var opt = el('option', null, label);
      opt.value = String(lvl);
      if (lvl === col.level) opt.selected = true;
      select.appendChild(opt);
    }
  }

  function headerCell(col, index) {
    var th = el('th', 'compare-col-head');
    th.scope = 'col';
    var top = el('div', 'compare-col-top');
    top.appendChild(el('span', 'compare-col-name', col.group.author));
    var copy = el('button', 'compare-col-btn', '⧉');
    copy.type = 'button';
    copy.setAttribute('aria-label', 'Add another ' + col.group.author + ' column');
    copy.title = 'Add another column for this group';
    copy.addEventListener('click', function () {
      columns.splice(index + 1, 0, { group: col.group, file: col.file, level: col.level, filter: col.filter });
      render();
      syncUrl();
    });
    top.appendChild(copy);
    var close = el('button', 'compare-col-btn', '×');
    close.type = 'button';
    close.setAttribute('aria-label', 'Hide ' + col.group.author);
    close.title = 'Hide this filter';
    close.addEventListener('click', function () {
      columns.splice(index, 1);
      render();
      syncUrl();
    });
    top.appendChild(close);
    th.appendChild(top);

    var fileId = 'cmp-file-' + index;
    var fileLabel = el('label', 'visually-hidden', 'Filter for ' + col.group.author);
    fileLabel.htmlFor = fileId;
    var fileSel = el('select', 'compare-select');
    fileSel.id = fileId;
    col.group.files.forEach(function (f) {
      var opt = el('option', null, f.displayName || f.name.replace(/\.filter$/, ''));
      opt.value = f.name;
      if (f === col.file) opt.selected = true;
      fileSel.appendChild(opt);
    });
    fileSel.addEventListener('change', function () {
      col.file = col.group.files.filter(function (f) { return f.name === fileSel.value; })[0];
      col.filter = null;
      col.error = null;
      load(col);
      syncUrl();
    });
    th.appendChild(fileLabel);
    th.appendChild(fileSel);

    var lvlId = 'cmp-level-' + index;
    var lvlLabel = el('label', 'visually-hidden', 'Filter level for ' + col.group.author);
    lvlLabel.htmlFor = lvlId;
    var lvlSel = el('select', 'compare-select compare-level');
    lvlSel.id = lvlId;
    levelOptions(lvlSel, col);
    lvlSel.addEventListener('change', function () {
      col.level = parseInt(lvlSel.value, 10) || 0;
      refreshColumn(col);
      syncUrl();
    });
    th.appendChild(lvlLabel);
    th.appendChild(lvlSel);

    var state = el('div', 'compare-col-state');
    state.setAttribute('aria-live', 'polite');
    th.appendChild(state);
    col.th = th;
    col.levelSelect = lvlSel;
    col.stateEl = state;
    return th;
  }

  function render() {
    table.textContent = '';
    var caption = el('caption', 'visually-hidden', 'Sample drops as each filter shows them at the chosen filter level');
    table.appendChild(caption);
    var thead = el('thead');
    var hr = el('tr');
    var corner = el('th', 'compare-corner', 'Item');
    corner.scope = 'col';
    hr.appendChild(corner);
    columns.forEach(function (col, i) { hr.appendChild(headerCell(col, i)); });
    thead.appendChild(hr);
    table.appendChild(thead);

    var tbody = el('tbody');
    columns.forEach(function (col) { col.cells = []; });
    categories.forEach(function (cat) {
      var cr = el('tr', 'compare-cat');
      var ch = el('th', null, cat.name);
      ch.scope = 'rowgroup';
      ch.colSpan = columns.length + 1;
      cr.appendChild(ch);
      tbody.appendChild(cr);
      if (!cat.items.length) {
        var nr = el('tr');
        var nt = el('td', 'compare-note', 'Could not load the unique and set tiers.');
        nt.colSpan = columns.length + 1;
        nr.appendChild(nt);
        tbody.appendChild(nr);
      }
      cat.items.forEach(function (item) {
        var tr = el('tr');
        var th = el('th', 'compare-legend', item.legend);
        th.scope = 'row';
        tr.appendChild(th);
        columns.forEach(function (col) {
          var td = el('td', 'compare-cell');
          col.cells.push({ td: td, item: item });
          renderLabel(td, col, item);
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    });
    table.appendChild(tbody);
    columns.forEach(function (col) { if (!col.filter && !col.error) load(col); else refreshColumn(col); });
    renderHidden();
  }

  function refreshColumn(col) {
    if (col.levelSelect) levelOptions(col.levelSelect, col);
    if (col.stateEl) {
      col.stateEl.textContent = col.error ? 'Could not load this filter.' : (col.filter ? '' : 'Loading…');
    }
    (col.cells || []).forEach(function (c) { renderLabel(c.td, col, c.item); });
  }

  function load(col) {
    var file = col.file;
    refreshColumn(col);
    loadFilter(file).then(function (flt) {
      if (col.file !== file) return; // switched while downloading
      col.filter = flt;
      refreshColumn(col);
    }, function () {
      if (col.file !== file) return;
      col.error = true;
      refreshColumn(col);
    });
  }

  function renderHidden() {
    hiddenList.textContent = '';
    var hidden = groups.filter(function (g) {
      return !columns.some(function (c) { return c.group === g; });
    });
    hiddenWrap.hidden = !hidden.length;
    hidden.forEach(function (g) {
      var li = el('li');
      var btn = el('button', 'compare-chip', '+ ' + g.author);
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Show ' + g.author);
      btn.addEventListener('click', function () {
        // back into its default spot, before the first column of a later group
        var order = groups.indexOf(g);
        var at = columns.length;
        for (var i = 0; i < columns.length; i++) {
          if (groups.indexOf(columns[i].group) > order) { at = i; break; }
        }
        columns.splice(at, 0, defaultColumn(g));
        render();
        syncUrl();
      });
      li.appendChild(btn);
      hiddenList.appendChild(li);
    });
  }

  // ---- startup --------------------------------------------------------------------

  copyBtn.addEventListener('click', function () {
    var url = location.origin + shareUrl();
    var done = function () {
      copyBtn.textContent = 'Link copied';
      setTimeout(function () { copyBtn.textContent = 'Copy link'; }, 1800);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, done);
    else done();
  });

  resetBtn.addEventListener('click', function () {
    columns = defaultColumns();
    render();
    syncUrl();
  });

  Promise.all([
    fetch('data/author-filters.json').then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }),
    fetch(Samples.TIERS_URL).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })
  ]).then(function (res) {
    var data = res[0];
    data.sort(function (a, b) {
      var ia = FIRST.indexOf(a.author);
      var ib = FIRST.indexOf(b.author);
      return (ia < 0 ? FIRST.length : ia) - (ib < 0 ? FIRST.length : ib);
    });
    groups = data.map(function (a) {
      return { slug: slugOf(a.author), author: a.author, name: a.name, files: a.files };
    });
    categories = Samples.categories(res[1]);
    columns = columnsFromUrl() || defaultColumns();
    statusEl.hidden = true;
    render();
  }).catch(function () {
    statusEl.textContent = 'Could not load the filter list.';
    statusEl.setAttribute('role', 'alert');
  });
})();
