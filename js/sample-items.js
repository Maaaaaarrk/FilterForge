/* ============================================
   Filter Forge — Sample items for the Compare page
   Mirrors HiimFilter's README renderer samples (builderreadme/filterrender/items.py).

   Item: code, name (in-game name before any rule), flags (condition keywords that are
   true), num (numeric fields; missing ones are 0 except the engine defaults: ILVL/ALVL 85,
   CLVL 86, Hell), and a legend for the row.
   ============================================ */

(function () {
  'use strict';

  // Star tiers come from HiimFilter's source of truth so the samples follow tier changes.
  var TIERS_URL = 'https://raw.githubusercontent.com/Maaaaaarrk/HiimFilter-PD2-Filter/main/builderfilter/data/unique-set-tiers.json';
  var UNIQUE_SCALE = ['4', '3', '2', '1', '0', 'no-star'];   // best -> worst
  var SET_SCALE = ['4', '3', '2', '1', '0'];
  var STAR = { '4': '4-star', '3': '3-star', '2': '2-star', '1': '1-star', '0': '0-star', 'no-star': 'no-star' };

  function rune(num, name) {
    return {
      code: 'r' + (num < 10 ? '0' : '') + num, name: name + ' Rune', rune: num, runeName: name,
      color: 'ORANGE', flags: [], num: { QTY: 1 }, legend: name + ' rune (#' + num + ')'
    };
  }

  var RUNES_CURRENCY = [
    rune(1, 'El'), rune(8, 'Ral'), rune(24, 'Ist'), rune(26, 'Vex'), rune(30, 'Ber'),
    { code: 'gpvs', name: 'Perfect Amethyst', flags: ['NMAG'], num: { QTY: 1 }, legend: 'Perfect gem (stack)' },
    { code: 'wss', name: 'Worldstone Shard', flags: ['NMAG'], legend: 'Worldstone Shard' },
    { code: 'lbox', name: "Larzuk's Puzzlebox", flags: ['NMAG'], legend: "Larzuk's Puzzlebox" },
    { code: 'pk1', name: 'Key of Terror', flags: ['NMAG'], legend: 'Uber key' },
    { code: 'tes', name: 'Twisted Essence of Suffering', flags: ['NMAG'], legend: 'Essence' },
    { code: 'skzs', name: 'Perfect Skull', flags: ['NMAG'], num: { QTY: 1 }, legend: 'Perfect skull (stack)' }
  ];

  var BASES = [
    { code: '7vo', name: 'Colossus Voulge', flags: ['NMAG', 'ETH', 'WEAPON', 'POLEARM', 'ELT', '2H'],
      num: { SOCK: 4, EDAM: 20 }, legend: 'ETH 4os Colossus Voulge, 20% ED' },
    { code: '7wa', name: 'Berserker Axe', flags: ['NMAG', 'ETH', 'WEAPON', 'AXE', 'ELT', '1H'],
      num: { SOCK: 0, EDAM: 18 }, legend: 'ETH 0os Berserker Axe, 18% ED' },
    { code: '6ws', name: 'Archon Staff', flags: ['NMAG', 'WEAPON', 'STAFF', 'ELT', '2H'],
      num: { SOCK: 4, SK48: 3, SK63: 3 }, legend: '4os Archon Staff, +3 Nova, +3 Lightning Mastery' }
  ];

  var RARES = [
    { code: 'ci2', name: 'Tiara', flags: ['RARE', 'ARMOR', 'CIRC', 'EXC'], legend: 'Unid rare circlet' },
    { code: 'utp', name: 'Archon Plate', flags: ['RARE', 'ARMOR', 'CHEST', 'ELT'],
      num: { ILVL: 85, ALVL: 75 }, legend: 'Unid rare body armor, ilvl 85, alvl 75' },
    { code: 'utp', name: 'Archon Plate', flags: ['RARE', 'ARMOR', 'CHEST', 'ELT'],
      num: { ILVL: 85, ALVL: 85 }, legend: 'Unid rare body armor, ilvl 85, alvl 85' }
  ];

  var CONSUMABLES = [
    { code: 'rvl', name: 'Full Rejuvenation Potion', flags: ['NMAG'], legend: 'Full rejuv' }
  ];

  // ---- star-tier samples ---------------------------------------------------------

  function rank(scale, tier) {
    return tier == null ? -1 : scale.length - scale.indexOf(tier);
  }

  function best(scale, tiers) {
    var out = null;
    tiers.forEach(function (t) { if (rank(scale, t) > rank(scale, out)) out = t; });
    return out;
  }

  // A base shows the best tier of any unique on it (unidentified items only reveal the base).
  function uniqueBaseTiers(data) {
    var acc = {};
    data.uniques.forEach(function (e) {
      var c = acc[e.code] || (acc[e.code] = { noneth: [], eth: [] });
      c.noneth.push(e.current);
      c.eth.push(e.eth ? e.eth.current : e.current);
    });
    var out = {};
    Object.keys(acc).forEach(function (code) {
      out[code] = { noneth: best(UNIQUE_SCALE, acc[code].noneth), eth: best(UNIQUE_SCALE, acc[code].eth) };
    });
    return out;
  }

  function setBaseTiers(data) {
    var acc = {};
    data.sets.forEach(function (e) { (acc[e.code] = acc[e.code] || []).push(e.current); });
    var out = {};
    Object.keys(acc).forEach(function (code) { out[code] = best(SET_SCALE, acc[code]); });
    return out;
  }

  // NORM / EXC / ELT from the code prefix; class-specific bases number differently.
  function baseClass(code) {
    if (code.length !== 3 || /^(am|ba|dr|ne|pa|ci|ob)/.test(code)) return null;
    if ('67u'.indexOf(code.charAt(0)) !== -1) return 'ELT';
    if ('89x'.indexOf(code.charAt(0)) !== -1) return 'EXC';
    return 'NORM';
  }

  // Quivers and jewelry make poor examples (they all look alike unidentified).
  function skip(e) {
    return /bolt|arrow|ring|amulet|charm|jewel/.test((e.base || '').toLowerCase());
  }

  function pick(entries, ok) {
    var c = entries.filter(function (e) { return ok(e) && !skip(e); });
    c.sort(function (a, b) {
      var ea = a.eth ? 1 : 0;
      var eb = b.eth ? 1 : 0;
      if (ea !== eb) return ea - eb;
      return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 0;
    });
    return c[0] || null;
  }

  function sample(e, flags, legend) {
    var cls = baseClass(e.code);
    return { code: e.code, name: e.base || e.code, flags: cls ? flags.concat([cls]) : flags, legend: legend };
  }

  // One unidentified unique per star tier (plus an ETH-only 4-star and a unique ring)
  // and one set item per set star tier.
  function starSamples(data) {
    var ub = uniqueBaseTiers(data);
    var sb = setBaseTiers(data);
    var out = [];
    UNIQUE_SCALE.forEach(function (tier) {
      var same = function (e) { return ub[e.code].noneth === tier && ub[e.code].eth === tier; };
      var e = tier !== 'no-star' ? pick(data.uniques, same)
        : pick(data.uniques, function (x) { return same(x) && baseClass(x.code) === 'NORM'; }) ||
          pick(data.uniques, function (x) { return same(x) && baseClass(x.code) === 'EXC'; });
      if (e) out.push(sample(e, ['UNI'], 'Unid unique ' + e.name + ' - ' + STAR[tier]));
    });
    var eth = pick(data.uniques, function (e) { return ub[e.code].eth === '4' && ub[e.code].noneth !== '4'; });
    if (eth) {
      var n = ub[eth.code].noneth;
      out.push(sample(eth, ['UNI', 'ETH'], 'Unid ETH ' + eth.name + ' - 4-star ETH, ' + (STAR[n] || 'unstarred') + ' non-ETH'));
    }
    out.push({ code: 'rin', name: 'Ring', flags: ['UNI', 'JEWELRY'], legend: 'Unid unique ring' });
    SET_SCALE.forEach(function (tier) {
      var e = pick(data.sets, function (x) { return sb[x.code] === tier; });
      if (e) out.push(sample(e, ['SET'], 'Unid set ' + e.name + ' - ' + STAR[tier] + ' set'));
    });
    return out;
  }

  // Categories for the table; star samples fall back to none if the tiers can't load.
  function categories(tiers) {
    return [
      { name: 'Runes & currency', items: RUNES_CURRENCY },
      { name: 'Unidentified uniques & sets', items: tiers ? starSamples(tiers) : [] },
      { name: 'Bases', items: BASES },
      { name: 'Unidentified rares', items: RARES },
      { name: 'Potions', items: CONSUMABLES }
    ];
  }

  window.FF = window.FF || {};
  window.FF.SampleItems = { TIERS_URL: TIERS_URL, categories: categories, starSamples: starSamples };
})();
