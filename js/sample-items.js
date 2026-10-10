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
    { code: 'ci2', name: 'Tiara', flags: ['RARE', 'ARMOR', 'CIRC', 'EQ7', 'EXC'], legend: 'Unid rare circlet' },
    { code: 'utp', name: 'Archon Plate', flags: ['RARE', 'ARMOR', 'CHEST', 'EQ2', 'ELT'],
      num: { ILVL: 85, ALVL: 75 }, legend: 'Unid rare body armor, ilvl 85, alvl 75' },
    { code: 'utp', name: 'Archon Plate', flags: ['RARE', 'ARMOR', 'CHEST', 'EQ2', 'ELT'],
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

  // Loot-filter flags for every weapon and armor base code (ARMOR / WEAPON, type and group
  // codes, class item codes, 1H / 2H, NORM / EXC / ELT), generated from the game's
  // Armor.txt / Weapons.txt.
  var BASE_FLAGS = {};
  [
    ['ARMOR BELT EQ6 ELT', 'rbe uhc ulc umc utc uvc'],
    ['ARMOR BELT EQ6 EXC', 'zhb zlb zmb ztb zvb'],
    ['ARMOR BELT EQ6 NORM', 'hbl lbl mbl tbl vbl'],
    ['ARMOR BOOTS EQ5 ELT', 'uhb ulb umb utb uvb'],
    ['ARMOR BOOTS EQ5 EXC', 'xhb xlb xmb xtb xvb'],
    ['ARMOR BOOTS EQ5 NORM', 'hbt lbt mbt tbt vbt'],
    ['ARMOR CHEST EQ2 ELT', 'rar uar ucl uea uhn ula uld ult ung upl urs uth utp utu uui uul'],
    ['ARMOR CHEST EQ2 EXC', 'xar xcl xea xhn xla xld xlt xng xpl xrs xth xtp xtu xui xul'],
    ['ARMOR CHEST EQ2 NORM', 'aar brs chn fld ful gth hla lea ltp plt qui rng scl spl stu'],
    ['ARMOR CIRC EQ7 ELT', 'ci3'],
    ['ARMOR CIRC EQ7 EXC', 'ci2'],
    ['ARMOR CIRC EQ7 NORM', 'ci0 ci1'],
    ['ARMOR GLOVES EQ4 ELT', 'uhg ulg umg utg uvg'],
    ['ARMOR GLOVES EQ4 EXC', 'xhg xlg xmg xtg xvg'],
    ['ARMOR GLOVES EQ4 NORM', 'hgl lgl mgl tgl vgl'],
    ['ARMOR HELM EQ1 BAR CL2 CLASS ELT', 'bab bac bad bae baf'],
    ['ARMOR HELM EQ1 BAR CL2 CLASS EXC', 'ba6 ba7 ba8 ba9 baa'],
    ['ARMOR HELM EQ1 BAR CL2 CLASS NORM', 'ba1 ba2 ba3 ba4 ba5'],
    ['ARMOR HELM EQ1 DRU CL1 CLASS ELT', 'drb drc drd dre drf'],
    ['ARMOR HELM EQ1 DRU CL1 CLASS EXC', 'dr6 dr7 dr8 dr9 dra'],
    ['ARMOR HELM EQ1 DRU CL1 CLASS NORM', 'dr1 dr2 dr3 dr4 dr5'],
    ['ARMOR HELM EQ1 ELT', 'uap uh9 uhl uhm ukp ulm urn usk'],
    ['ARMOR HELM EQ1 EXC', 'xap xh9 xhl xhm xkp xlm xrn xsk'],
    ['ARMOR HELM EQ1 NORM', 'bhm cap crn fhl ghm hlm msk skp'],
    ['ARMOR SHIELD EQ3 DIN CL3 CLASS ELT', 'pab pac pad pae paf'],
    ['ARMOR SHIELD EQ3 DIN CL3 CLASS EXC', 'pa6 pa7 pa8 pa9 paa'],
    ['ARMOR SHIELD EQ3 DIN CL3 CLASS NORM', 'pa1 pa2 pa3 pa4 pa5'],
    ['ARMOR SHIELD EQ3 ELT', 'uit uml uow upk urg ush uts uuc'],
    ['ARMOR SHIELD EQ3 EXC', 'xit xml xow xpk xrg xsh xts xuc'],
    ['ARMOR SHIELD EQ3 NEC CL4 CLASS ELT', 'neb ned nee nef neg'],
    ['ARMOR SHIELD EQ3 NEC CL4 CLASS EXC', 'ne6 ne7 ne8 ne9 nea'],
    ['ARMOR SHIELD EQ3 NEC CL4 CLASS NORM', 'ne1 ne2 ne3 ne4 ne5'],
    ['ARMOR SHIELD EQ3 NORM', 'bsh buc gts kit lrg sml spk tow'],
    ['WEAPON AXE WP1 1H ELT', '72a 7ax 7ha 7mp 7wa'],
    ['WEAPON AXE WP1 1H EXC', '92a 9ax 9ha 9mp 9wa'],
    ['WEAPON AXE WP1 1H NORM', '2ax axe hax mpi wax'],
    ['WEAPON AXE WP1 2H ELT', '7ba 7bt 7ga 7gi 7la'],
    ['WEAPON AXE WP1 2H EXC', '9ba 9bt 9ga 9gi 9la'],
    ['WEAPON AXE WP1 2H NORM', 'bax btx gax gix lax'],
    ['WEAPON AXE WP1 THROWING WP5 1H ELT', '7b8 7ta'],
    ['WEAPON AXE WP1 THROWING WP5 1H EXC', '9b8 9ta'],
    ['WEAPON AXE WP1 THROWING WP5 1H NORM', 'bal tax'],
    ['WEAPON BOW WP9 2H ELT', '6cb 6hb 6l7 6lb 6lw 6s7 6sb 6sw'],
    ['WEAPON BOW WP9 2H EXC', '8cb 8hb 8l8 8lb 8lw 8s8 8sb 8sw'],
    ['WEAPON BOW WP9 2H NORM', 'cbw hbw lbb lbw lwb sbb sbw swb'],
    ['WEAPON BOW WP9 ZON CL7 CLASS 2H ELT', 'amb amc'],
    ['WEAPON BOW WP9 ZON CL7 CLASS 2H EXC', 'am6 am7'],
    ['WEAPON BOW WP9 ZON CL7 CLASS 2H NORM', 'am1 am2'],
    ['WEAPON DAGGER WP4 1H ELT', '7bl 7dg 7di 7kr'],
    ['WEAPON DAGGER WP4 1H EXC', '9bl 9dg 9di 9kr'],
    ['WEAPON DAGGER WP4 1H NORM', 'bld d33 dgr dir g33 kri'],
    ['WEAPON DAGGER WP4 THROWING WP5 1H ELT', '7bk 7tk'],
    ['WEAPON DAGGER WP4 THROWING WP5 1H EXC', '9bk 9tk'],
    ['WEAPON DAGGER WP4 THROWING WP5 1H NORM', 'bkf tkf'],
    ['WEAPON JAV WP6 THROWING WP5 1H ELT', '7gl 7ja 7pi 7s7 7ts'],
    ['WEAPON JAV WP6 THROWING WP5 1H EXC', '9gl 9ja 9pi 9s9 9ts'],
    ['WEAPON JAV WP6 THROWING WP5 1H NORM', 'glv jav pil ssp tsp'],
    ['WEAPON JAV WP6 THROWING WP5 ZON CL7 CLASS 1H ELT', 'amf'],
    ['WEAPON JAV WP6 THROWING WP5 ZON CL7 CLASS 1H EXC', 'ama'],
    ['WEAPON JAV WP6 THROWING WP5 ZON CL7 CLASS 1H NORM', 'am5'],
    ['WEAPON MACE WP2 CLUB 1H ELT', '7cl 7sp'],
    ['WEAPON MACE WP2 CLUB 1H EXC', '9cl 9sp'],
    ['WEAPON MACE WP2 CLUB 1H NORM', 'clb leg spc'],
    ['WEAPON MACE WP2 HAMMER 1H ELT', '7wh'],
    ['WEAPON MACE WP2 HAMMER 1H EXC', '9wh'],
    ['WEAPON MACE WP2 HAMMER 1H NORM', 'hdm hfh whm'],
    ['WEAPON MACE WP2 HAMMER 2H ELT', '7gm 7m7'],
    ['WEAPON MACE WP2 HAMMER 2H EXC', '9gm 9m9'],
    ['WEAPON MACE WP2 HAMMER 2H NORM', 'gma mau'],
    ['WEAPON MACE WP2 TMACE 1H ELT', '7fl 7ma 7mt'],
    ['WEAPON MACE WP2 TMACE 1H EXC', '9fl 9ma 9mt'],
    ['WEAPON MACE WP2 TMACE 1H NORM', 'fla mac mst qf1 qf2'],
    ['WEAPON POLEARM WP8 2H ELT', '7h7 7o7 7pa 7s8 7vo 7wc'],
    ['WEAPON POLEARM WP8 2H EXC', '9b7 9h9 9pa 9s8 9vo 9wc'],
    ['WEAPON POLEARM WP8 2H NORM', 'bar hal pax scy vou wsc'],
    ['WEAPON SCEPTER WP13 1H ELT', '7qs 7sc 7ws'],
    ['WEAPON SCEPTER WP13 1H EXC', '9qs 9sc 9ws'],
    ['WEAPON SCEPTER WP13 1H NORM', 'gsc scp wsp'],
    ['WEAPON SIN CL5 CLASS 1H ELT', '7ar 7cs 7lw 7qr 7tw 7wb 7xf'],
    ['WEAPON SIN CL5 CLASS 1H EXC', '9ar 9cs 9lw 9qr 9tw 9wb 9xf'],
    ['WEAPON SIN CL5 CLASS 1H NORM', 'axf btl ces clw ktr skr wrb'],
    ['WEAPON SOR CL6 CLASS 1H ELT', 'obb obc obd obe obf'],
    ['WEAPON SOR CL6 CLASS 1H EXC', 'ob6 ob7 ob8 ob9 oba'],
    ['WEAPON SOR CL6 CLASS 1H NORM', 'ob1 ob2 ob3 ob4 ob5'],
    ['WEAPON SPEAR WP7 2H ELT', '7br 7p7 7sr 7st 7tr'],
    ['WEAPON SPEAR WP7 2H EXC', '9br 9p9 9sr 9st 9tr'],
    ['WEAPON SPEAR WP7 2H NORM', 'brn pik spr spt tri'],
    ['WEAPON SPEAR WP7 ZON CL7 CLASS 2H ELT', 'amd ame'],
    ['WEAPON SPEAR WP7 ZON CL7 CLASS 2H EXC', 'am8 am9'],
    ['WEAPON SPEAR WP7 ZON CL7 CLASS 2H NORM', 'am3 am4'],
    ['WEAPON STAFF WP11 2H ELT', '6bs 6cs 6ls 6ss 6ws'],
    ['WEAPON STAFF WP11 2H EXC', '8bs 8cs 8ls 8ss 8ws'],
    ['WEAPON STAFF WP11 2H NORM', 'bst cst hst lst msf sst wst'],
    ['WEAPON SWORD WP3 1H ELT', '7bs 7cr 7fc 7ls 7sb 7sm 7ss 7wd'],
    ['WEAPON SWORD WP3 1H EXC', '9bs 9cr 9fc 9ls 9sb 9sm 9ss 9wd'],
    ['WEAPON SWORD WP3 1H NORM', 'bsd crs flc lsd sbr scm ssd wsd'],
    ['WEAPON SWORD WP3 2H 1H ELT', '72h 7b7 7cm 7fb 7gd 7gs'],
    ['WEAPON SWORD WP3 2H 1H EXC', '92h 9b9 9cm 9fb 9gd 9gs'],
    ['WEAPON SWORD WP3 2H 1H NORM', '2hs bsw clm flb gis gsd'],
    ['WEAPON SWORD WP3 2H ELT', '7cr2'],
    ['WEAPON THROWING WP5 1H', 'tpcl tpcm tpcs tpfl tpfm tpfs tpgl tpgm tpgs tpll tplm tpls'],
    ['WEAPON THROWING WP5 1H NORM', 'gpl gpm gps opl opm ops'],
    ['WEAPON WAND WP12 1H ELT', '7bw 7gw 7wn 7yw'],
    ['WEAPON WAND WP12 1H EXC', '9bw 9gw 9wn 9yw'],
    ['WEAPON WAND WP12 1H NORM', 'bwn gwn wnd ywn'],
    ['WEAPON XBOW WP10 2H ELT', '6hx 6lx 6mx 6rx'],
    ['WEAPON XBOW WP10 2H EXC', '8hx 8lx 8mx 8rx'],
    ['WEAPON XBOW WP10 2H NORM', 'hxb lxb mxb rxb']
  ].forEach(function (g) {
    g[1].split(' ').forEach(function (c) { BASE_FLAGS[c] = g[0].split(' '); });
  });

  // NORM / EXC / ELT for a weapon or armor code; null for anything else (jewelry, quivers, ...).
  function baseClass(code) {
    var f = BASE_FLAGS[code] || [];
    return f.filter(function (x) { return x === 'NORM' || x === 'EXC' || x === 'ELT'; })[0] || null;
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
      if (e) out.push(sample(e, ['UNI'], 'Unid unique ' + e.name));
    });
    var eth = pick(data.uniques, function (e) { return ub[e.code].eth === '4' && ub[e.code].noneth !== '4'; });
    if (eth) out.push(sample(eth, ['UNI', 'ETH'], 'Unid ETH unique ' + eth.name));
    out.push({ code: 'rin', name: 'Ring', flags: ['UNI', 'JEWELRY'], legend: 'Unid unique ring' });
    SET_SCALE.forEach(function (tier) {
      var e = pick(data.sets, function (x) { return sb[x.code] === tier; });
      if (e) out.push(sample(e, ['SET'], 'Unid set ' + e.name));
    });
    return out;
  }

  // Categories for the table; star samples fall back to none if the tiers can't load.
  // The item with its base's loot-filter flags (ARMOR / WEAPON, type and group codes, class
  // item codes, 1H / 2H, NORM / EXC / ELT) added from the game's item tables.
  function withBaseFlags(item) {
    var extra = (BASE_FLAGS[item.code] || []).filter(function (f) { return item.flags.indexOf(f) === -1; });
    if (!extra.length) return item;
    var copy = {};
    Object.keys(item).forEach(function (k) { copy[k] = item[k]; });
    copy.flags = item.flags.concat(extra);
    return copy;
  }

  function categories(tiers) {
    return [
      { name: 'Runes & currency', items: RUNES_CURRENCY },
      { name: 'Unidentified uniques & sets', items: tiers ? starSamples(tiers) : [] },
      { name: 'Bases', items: BASES },
      { name: 'Unidentified rares', items: RARES },
      { name: 'Potions', items: CONSUMABLES }
    ].map(function (c) { return { name: c.name, items: c.items.map(withBaseFlags) }; });
  }

  window.FF = window.FF || {};
  window.FF.SampleItems = { TIERS_URL: TIERS_URL, categories: categories, starSamples: starSamples };
})();
