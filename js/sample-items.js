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

  // Base item tier (NORM / EXC / ELT) per weapon and armor code, generated from the game's
  // Armor.txt / Weapons.txt (normcode / ubercode / ultracode).
  var BASE_TIERS = {};
  '2ax 2hs aar am1 am2 am3 am4 am5 axe axf ba1 ba2 ba3 ba4 ba5 bal bar bax bhm bkf bld brn brs bsd bsh bst bsw btl btx buc bwn cap cbw ces chn ci0 ci1 clb clm clw crn crs cst d33 dgr dir dr1 dr2 dr3 dr4 dr5 fhl fla flb flc fld ful g33 gax ghm gis gix glv gma gpl gpm gps gsc gsd gth gts gwn hal hax hbl hbt hbw hdm hfh hgl hla hlm hst hxb jav kit kri ktr lax lbb lbl lbt lbw lea leg lgl lrg lsd lst ltp lwb lxb mac mau mbl mbt mgl mpi msf msk mst mxb ne1 ne2 ne3 ne4 ne5 ob1 ob2 ob3 ob4 ob5 opl opm ops pa1 pa2 pa3 pa4 pa5 pax pik pil plt qf1 qf2 qui rng rxb sbb sbr sbw scl scm scp scy skp skr sml spc spk spl spr spt ssd ssp sst stu swb tax tbl tbt tgl tkf tow tri tsp vbl vbt vgl vou wax whm wnd wrb wsc wsd wsp wst ywn'.split(' ').forEach(function (c) { BASE_TIERS[c] = 'NORM'; });
  '8bs 8cb 8cs 8hb 8hx 8l8 8lb 8ls 8lw 8lx 8mx 8rx 8s8 8sb 8ss 8sw 8ws 92a 92h 9ar 9ax 9b7 9b8 9b9 9ba 9bk 9bl 9br 9bs 9bt 9bw 9cl 9cm 9cr 9cs 9dg 9di 9fb 9fc 9fl 9ga 9gd 9gi 9gl 9gm 9gs 9gw 9h9 9ha 9ja 9kr 9la 9ls 9lw 9m9 9ma 9mp 9mt 9p9 9pa 9pi 9qr 9qs 9s8 9s9 9sb 9sc 9sm 9sp 9sr 9ss 9st 9ta 9tk 9tr 9ts 9tw 9vo 9wa 9wb 9wc 9wd 9wh 9wn 9ws 9xf 9yw am6 am7 am8 am9 ama ba6 ba7 ba8 ba9 baa ci2 dr6 dr7 dr8 dr9 dra ne6 ne7 ne8 ne9 nea ob6 ob7 ob8 ob9 oba pa6 pa7 pa8 pa9 paa xap xar xcl xea xh9 xhb xhg xhl xhm xhn xit xkp xla xlb xld xlg xlm xlt xmb xmg xml xng xow xpk xpl xrg xrn xrs xsh xsk xtb xtg xth xtp xts xtu xuc xui xul xvb xvg zhb zlb zmb ztb zvb'.split(' ').forEach(function (c) { BASE_TIERS[c] = 'EXC'; });
  '6bs 6cb 6cs 6hb 6hx 6l7 6lb 6ls 6lw 6lx 6mx 6rx 6s7 6sb 6ss 6sw 6ws 72a 72h 7ar 7ax 7b7 7b8 7ba 7bk 7bl 7br 7bs 7bt 7bw 7cl 7cm 7cr 7cr2 7cs 7dg 7di 7fb 7fc 7fl 7ga 7gd 7gi 7gl 7gm 7gs 7gw 7h7 7ha 7ja 7kr 7la 7ls 7lw 7m7 7ma 7mp 7mt 7o7 7p7 7pa 7pi 7qr 7qs 7s7 7s8 7sb 7sc 7sm 7sp 7sr 7ss 7st 7ta 7tk 7tr 7ts 7tw 7vo 7wa 7wb 7wc 7wd 7wh 7wn 7ws 7xf 7yw amb amc amd ame amf bab bac bad bae baf ci3 drb drc drd dre drf neb ned nee nef neg obb obc obd obe obf pab pac pad pae paf rar rbe uap uar ucl uea uh9 uhb uhc uhg uhl uhm uhn uit ukp ula ulb ulc uld ulg ulm ult umb umc umg uml ung uow upk upl urg urn urs ush usk utb utc utg uth utp uts utu uuc uui uul uvb uvc uvg'.split(' ').forEach(function (c) { BASE_TIERS[c] = 'ELT'; });

  // NORM / EXC / ELT for a weapon or armor code; null for anything else (jewelry, quivers, ...).
  function baseClass(code) {
    return BASE_TIERS[code] || null;
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
