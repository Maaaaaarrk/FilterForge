/* ============================================
   Filter Forge — Editor Engine
   ============================================ */

(function () {
  'use strict';

  // ==========================================
  // DOM references
  // ==========================================
  var codeEditor = document.getElementById('code-editor');
  var lineNumbers = document.getElementById('line-numbers');
  var lineCount = document.getElementById('line-count');
  var charCount = document.getElementById('char-count');
  var ruleCount = document.getElementById('rule-count');
  var generatedCode = document.getElementById('generated-code');
  var previewResults = document.getElementById('preview-results');

  // ==========================================
  // State
  // ==========================================
  var builderState = {
    quality: '',
    tier: [],
    properties: [],
    itemcat: [],
    equipment: '',
    weapons: '',
    misc: '',
    classitems: '',
    location: [],
    negate: [],
    valueConditions: [],
    itemCode: '',
    action: 'show',
    nameDisplay: '%NAME%',
    customName: '',
    color: '',
    appendText: '',
    mapIcon: '',
    mapIconColor: '',
    sound: '',
    notify: '',
    continueKw: '',
    description: ''
  };


  // ==========================================
  // Item definitions for preview
  // ==========================================
  var PREVIEW_ITEMS = {
    // Runes (stacked — r##s format, QTY=1 means stacked)
    'rune-zod': { code: 'r33s', name: 'Zod Rune', flags: ['GROUND', 'MISC'], values: { RUNE: 33, QTY: 1, ILVL: 1, SOCKETS: 0, GOLD: 0, GEM: 0 } },
    'rune-ber': { code: 'r30s', name: 'Ber Rune', flags: ['GROUND', 'MISC'], values: { RUNE: 30, QTY: 1, ILVL: 1, SOCKETS: 0, GOLD: 0, GEM: 0 } },
    'rune-jah': { code: 'r31s', name: 'Jah Rune', flags: ['GROUND', 'MISC'], values: { RUNE: 31, QTY: 1, ILVL: 1, SOCKETS: 0, GOLD: 0, GEM: 0 } },
    'rune-lo': { code: 'r28s', name: 'Lo Rune', flags: ['GROUND', 'MISC'], values: { RUNE: 28, QTY: 1, ILVL: 1, SOCKETS: 0, GOLD: 0, GEM: 0 } },
    'rune-vex': { code: 'r26s', name: 'Vex Rune', flags: ['GROUND', 'MISC'], values: { RUNE: 26, QTY: 1, ILVL: 1, SOCKETS: 0, GOLD: 0, GEM: 0 } },
    'rune-ist': { code: 'r24s', name: 'Ist Rune', flags: ['GROUND', 'MISC'], values: { RUNE: 24, QTY: 1, ILVL: 1, SOCKETS: 0, GOLD: 0, GEM: 0 } },
    'rune-lem': { code: 'r20s', name: 'Lem Rune', flags: ['GROUND', 'MISC'], values: { RUNE: 20, QTY: 1, ILVL: 1, SOCKETS: 0, GOLD: 0, GEM: 0 } },
    'rune-sol': { code: 'r12s', name: 'Sol Rune', flags: ['GROUND', 'MISC'], values: { RUNE: 12, QTY: 1, ILVL: 1, SOCKETS: 0, GOLD: 0, GEM: 0 } },
    'rune-el': { code: 'r01s', name: 'El Rune', flags: ['GROUND', 'MISC'], values: { RUNE: 1, QTY: 1, ILVL: 1, SOCKETS: 0, GOLD: 0, GEM: 0 } },
    // Unique items (!ID — unidentified, %NAME% shows base type name)
    'uni-shako': { code: 'uap', name: 'Shako', flags: ['GROUND', 'UNI', 'ELT', 'HELM', 'ARMOR', 'EQ1'], values: { ILVL: 69, DEF: 141, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0, WIDTH: 2, HEIGHT: 2, AREA: 4, MAXSOCKETS: 2, REQLVL: 43, REQSTR: 50 } },
    'uni-griffon': { code: 'ci3', name: 'Diadem', flags: ['GROUND', 'UNI', 'ELT', 'CIRC', 'EQ7', 'ARMOR'], values: { ILVL: 85, DEF: 50, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0, WIDTH: 2, HEIGHT: 2, AREA: 4, MAXSOCKETS: 3, REQLVL: 64 } },
    'uni-coa': { code: 'urn', name: 'Corona', flags: ['GROUND', 'UNI', 'ELT', 'HELM', 'ARMOR', 'EQ1'], values: { ILVL: 85, DEF: 349, SOCKETS: 2, RUNE: 0, GOLD: 0, GEM: 0, WIDTH: 2, HEIGHT: 2, AREA: 4, MAXSOCKETS: 2, REQLVL: 66, REQSTR: 111 } },
    'uni-arach': { code: 'ulc', name: 'Spiderweb Sash', flags: ['GROUND', 'UNI', 'ELT', 'BELT', 'ARMOR', 'EQ6'], values: { ILVL: 85, DEF: 119, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0, WIDTH: 2, HEIGHT: 1, AREA: 2, REQLVL: 51, REQSTR: 50 } },
    'uni-stormshield': { code: 'uit', name: 'Monarch', flags: ['GROUND', 'UNI', 'ELT', 'SHIELD', 'ARMOR', 'EQ3'], values: { ILVL: 85, DEF: 136, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0, WIDTH: 2, HEIGHT: 3, AREA: 6, MAXSOCKETS: 4, BASEBLOCK: 52, REQLVL: 54, REQSTR: 156 } },
    'uni-facet': { code: 'jew', name: 'Jewel', flags: ['GROUND', 'UNI', 'JEWELRY'], values: { ILVL: 85, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'uni-ring': { code: 'rin', name: 'Ring', flags: ['GROUND', 'UNI', 'JEWELRY'], values: { ILVL: 85, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'uni-amu': { code: 'amu', name: 'Amulet', flags: ['GROUND', 'UNI', 'JEWELRY'], values: { ILVL: 85, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'uni-anni': { code: 'cm1', name: 'Small Charm', flags: ['GROUND', 'UNI', 'CHARM'], values: { ILVL: 99, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0, WIDTH: 1, HEIGHT: 1, AREA: 1 } },
    'uni-torch': { code: 'cm2', name: 'Large Charm', flags: ['GROUND', 'UNI', 'CHARM'], values: { ILVL: 99, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0, WIDTH: 1, HEIGHT: 2, AREA: 2 } },
    'uni-gheeds': { code: 'cm3', name: 'Grand Charm', flags: ['GROUND', 'UNI', 'CHARM'], values: { ILVL: 99, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0, WIDTH: 1, HEIGHT: 3, AREA: 3 } },
    // Set items (!ID — unidentified, %NAME% shows base type name)
    'set-ik-armor': { code: 'uth', name: 'Lacquered Plate', flags: ['GROUND', 'SET', 'ELT', 'CHEST', 'ARMOR', 'EQ2'], values: { ILVL: 85, DEF: 487, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'set-tal-amu': { code: 'amu', name: 'Amulet', flags: ['GROUND', 'SET', 'JEWELRY'], values: { ILVL: 26, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'set-lbt': { code: 'lbt', name: 'Boots', flags: ['GROUND', 'SET', 'NORM', 'BOOTS', 'ARMOR', 'EQ5'], values: { ILVL: 45, DEF: 12, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    // Rare / Crafted (!ID — unidentified, %NAME% shows base type name)
    'rare-amu': { code: 'amu', name: 'Amulet', flags: ['GROUND', 'RARE', 'JEWELRY'], values: { ILVL: 85, ALVL: 90, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'rare-ring': { code: 'rin', name: 'Ring', flags: ['GROUND', 'RARE', 'JEWELRY'], values: { ILVL: 85, ALVL: 81, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'rare-jewel': { code: 'jew', name: 'Jewel', flags: ['GROUND', 'RARE', 'JEWELRY'], values: { ILVL: 87, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'rare-circlet': { code: 'ci3', name: 'Diadem', flags: ['GROUND', 'RARE', 'ELT', 'CIRC', 'EQ7', 'ARMOR'], values: { ILVL: 85, DEF: 50, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'rare-boots-elt': { code: 'uhb', name: 'Myrmidon Greaves', flags: ['GROUND', 'RARE', 'ELT', 'BOOTS', 'ARMOR', 'EQ5'], values: { ILVL: 85, DEF: 62, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0, WIDTH: 2, HEIGHT: 2, AREA: 4, REQSTR: 208, REQLVL: 67, BASEMINKICK: 23, BASEMAXKICK: 59 } },
    'rare-gloves-elt': { code: 'utg', name: 'Crusader Gauntlets', flags: ['GROUND', 'RARE', 'ELT', 'GLOVES', 'ARMOR', 'EQ4'], values: { ILVL: 85, DEF: 59, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0, WIDTH: 2, HEIGHT: 2, AREA: 4, REQSTR: 151, REQLVL: 65 } },
    'craft-amu': { code: 'amu', name: 'Amulet', flags: ['GROUND', 'CRAFT', 'JEWELRY'], values: { ILVL: 85, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    // Magic items (!ID — unidentified, %NAME% shows base type name)
    'mag-ring': { code: 'rin', name: 'Ring', flags: ['GROUND', 'MAG', 'JEWELRY'], values: { ILVL: 45, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'mag-amu': { code: 'amu', name: 'Amulet', flags: ['GROUND', 'MAG', 'JEWELRY'], values: { ILVL: 85, CRAFTALVL: 90, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'mag-jewel': { code: 'jew', name: 'Jewel', flags: ['GROUND', 'MAG', 'JEWELRY'], values: { ILVL: 87, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'mag-gc-99': { code: 'cm3', name: 'Grand Charm', flags: ['GROUND', 'MAG', 'CHARM'], values: { ILVL: 99, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0, WIDTH: 1, HEIGHT: 3, AREA: 3 } },
    'mag-gc': { code: 'cm3', name: 'Grand Charm', flags: ['GROUND', 'MAG', 'CHARM'], values: { ILVL: 50, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0, WIDTH: 1, HEIGHT: 3, AREA: 3 } },
    'mag-sc': { code: 'cm1', name: 'Small Charm', flags: ['GROUND', 'MAG', 'CHARM'], values: { ILVL: 50, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0, WIDTH: 1, HEIGHT: 1, AREA: 1 } },
    'mag-lc': { code: 'cm2', name: 'Large Charm', flags: ['GROUND', 'MAG', 'CHARM'], values: { ILVL: 50, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0, WIDTH: 1, HEIGHT: 2, AREA: 2 } },
    'mag-monarch': { code: 'uit', name: 'Monarch', flags: ['GROUND', 'MAG', 'ELT', 'SHIELD', 'ARMOR', 'EQ3'], values: { ILVL: 72, DEF: 133, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    // Runeword bases
    'base-eth-ap': { code: 'utp', name: 'Archon Plate', flags: ['GROUND', 'NMAG', 'ELT', 'ETH', 'SUP', 'CHEST', 'ARMOR', 'EQ2'], values: { ILVL: 85, DEF: 524, SOCKETS: 4, ED: 15, RUNE: 0, GOLD: 0, GEM: 0, WIDTH: 2, HEIGHT: 3, AREA: 6, MAXSOCKETS: 4, REQSTR: 103, REQLVL: 63 } },
    'base-monarch-4': { code: 'uit', name: 'Monarch', flags: ['GROUND', 'NMAG', 'ELT', 'SHIELD', 'ARMOR', 'EQ3'], values: { ILVL: 72, DEF: 133, SOCKETS: 4, RUNE: 0, GOLD: 0, GEM: 0, WIDTH: 2, HEIGHT: 3, AREA: 6, MAXSOCKETS: 4, BASEBLOCK: 52, REQSTR: 156, REQLVL: 54 } },
    'base-pb-5': { code: '7cr', name: 'Phase Blade', flags: ['GROUND', 'NMAG', 'ELT', 'SWORD', 'WEAPON', '1H'], values: { ILVL: 73, SOCKETS: 5, RUNE: 0, GOLD: 0, GEM: 0, WIDTH: 1, HEIGHT: 3, AREA: 3, MAXSOCKETS: 3, REQDEX: 136, REQSTR: 25, REQLVL: 54, BASEMINONEH: 31, BASEMAXONEH: 35 } },
    'base-eth-thresh': { code: '7s7', name: 'Thresher', flags: ['GROUND', 'NMAG', 'ELT', 'ETH', 'POLEARM', 'WEAPON', '2H'], values: { ILVL: 85, SOCKETS: 4, RUNE: 0, GOLD: 0, GEM: 0, WIDTH: 2, HEIGHT: 4, AREA: 8, MAXSOCKETS: 4, REQSTR: 152, REQDEX: 118, REQLVL: 53, BASEMINTWOH: 12, BASEMAXTWOH: 141 } },
    'base-eth-zerker': { code: '7wa', name: 'Berserker Axe', flags: ['GROUND', 'NMAG', 'ELT', 'ETH', 'AXE', 'WEAPON', '1H'], values: { ILVL: 85, SOCKETS: 5, RUNE: 0, GOLD: 0, GEM: 0, WIDTH: 2, HEIGHT: 3, AREA: 6, MAXSOCKETS: 6, REQSTR: 138, REQDEX: 59, REQLVL: 64, BASEMINONEH: 24, BASEMAXONEH: 71 } },
    'base-eth-cb': { code: '7gd', name: 'Colossus Blade', flags: ['GROUND', 'NMAG', 'ELT', 'ETH', 'SWORD', 'WEAPON', '2H'], values: { ILVL: 85, SOCKETS: 6, RUNE: 0, GOLD: 0, GEM: 0, WIDTH: 2, HEIGHT: 4, AREA: 8, MAXSOCKETS: 6, REQSTR: 189, REQDEX: 110, REQLVL: 63, BASEMINONEH: 25, BASEMAXONEH: 65, BASEMINTWOH: 58, BASEMAXTWOH: 115 } },
    'base-diadem-0': { code: 'ci3', name: 'Diadem', flags: ['GROUND', 'NMAG', 'ELT', 'CIRC', 'EQ7', 'ARMOR'], values: { ILVL: 85, SOCKETS: 0, MAXSOCKETS: 3, RUNE: 0, GOLD: 0, GEM: 0, WIDTH: 2, HEIGHT: 2, AREA: 4, REQLVL: 64 } },
    'base-flail-4': { code: 'fla', name: 'Flail', flags: ['GROUND', 'NMAG', 'NORM', 'MACE', 'WEAPON', '1H'], values: { ILVL: 36, SOCKETS: 4, RUNE: 0, GOLD: 0, GEM: 0, WIDTH: 1, HEIGHT: 3, AREA: 3, MAXSOCKETS: 3, REQDEX: 35, REQSTR: 41, REQLVL: 15, BASEMINONEH: 1, BASEMAXONEH: 24 } },
    'base-crystal-4': { code: 'crs', name: 'Crystal Sword', flags: ['GROUND', 'NMAG', 'NORM', 'SWORD', 'WEAPON', '1H'], values: { ILVL: 26, SOCKETS: 4, RUNE: 0, GOLD: 0, GEM: 0, WIDTH: 1, HEIGHT: 3, AREA: 3, MAXSOCKETS: 3, REQSTR: 43, REQLVL: 11, BASEMINONEH: 5, BASEMAXONEH: 15 } },
    'base-pala-45res': { code: 'pab', name: 'Sacred Targe', flags: ['GROUND', 'NMAG', 'ELT', 'DIN', 'SHIELD', 'ARMOR', 'EQ3'], values: { ILVL: 85, SOCKETS: 4, RES: 45, RUNE: 0, GOLD: 0, GEM: 0, WIDTH: 2, HEIGHT: 2, AREA: 4, MAXSOCKETS: 4, BASEBLOCK: 60, REQSTR: 86, REQLVL: 47, BASEMINSMITE: 6, BASEMAXSMITE: 14 } },
    // Normal items
    'norm-cap': { code: 'cap', name: 'Cap', flags: ['GROUND', 'NMAG', 'NORM', 'HELM', 'ARMOR', 'EQ1'], values: { ILVL: 1, DEF: 3, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'norm-belt-elt': { code: 'uhc', name: 'Colossus Girdle', flags: ['GROUND', 'NMAG', 'ELT', 'BELT', 'ARMOR', 'EQ6'], values: { ILVL: 85, DEF: 71, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'norm-1os': { code: 'hlm', name: 'Helm', flags: ['GROUND', 'NMAG', 'NORM', 'HELM', 'ARMOR', 'EQ1'], values: { ILVL: 10, DEF: 15, SOCKETS: 1, RUNE: 0, GOLD: 0, GEM: 0 } },
    'norm-inf': { code: 'lea', name: 'Leather Armor', flags: ['GROUND', 'NMAG', 'NORM', 'INF', 'CHEST', 'ARMOR', 'EQ2'], values: { ILVL: 5, DEF: 12, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'norm-sup-ap': { code: 'utp', name: 'Archon Plate', flags: ['GROUND', 'NMAG', 'ELT', 'SUP', 'CHEST', 'ARMOR', 'EQ2'], values: { ILVL: 85, DEF: 524, SOCKETS: 0, ED: 15, MAXSOCKETS: 4, RUNE: 0, GOLD: 0, GEM: 0, WIDTH: 2, HEIGHT: 3, AREA: 6, REQSTR: 103, REQLVL: 63 } },
    // Consumables
    'gold-5000': { code: 'gold', name: '5000 Gold', flags: ['GROUND'], values: { GOLD: 5000, ILVL: 0, SOCKETS: 0, RUNE: 0, GEM: 0 } },
    'gold-500': { code: 'gold', name: '500 Gold', flags: ['GROUND'], values: { GOLD: 500, ILVL: 0, SOCKETS: 0, RUNE: 0, GEM: 0 } },
    'gold-50': { code: 'gold', name: '50 Gold', flags: ['GROUND'], values: { GOLD: 50, ILVL: 0, SOCKETS: 0, RUNE: 0, GEM: 0 } },
    'hp5': { code: 'hp5', name: 'Super Healing Potion', flags: ['GROUND', 'NMAG', 'MISC'], values: { ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'hp1': { code: 'hp1', name: 'Minor Healing Potion', flags: ['GROUND', 'NMAG', 'MISC'], values: { ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'mp5': { code: 'mp5', name: 'Super Mana Potion', flags: ['GROUND', 'NMAG', 'MISC'], values: { ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'rvl': { code: 'rvl', name: 'Full Rejuv Potion', flags: ['GROUND', 'NMAG', 'MISC'], values: { ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'rvs': { code: 'rvs', name: 'Rejuv Potion', flags: ['GROUND', 'NMAG', 'MISC'], values: { ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'tp-scroll': { code: 'tsc', name: 'Scroll of Town Portal', flags: ['GROUND', 'NMAG', 'MISC'], values: { ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'id-scroll': { code: 'isc', name: 'Scroll of Identify', flags: ['GROUND', 'NMAG', 'MISC'], values: { ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'key': { code: 'key', name: 'Key', flags: ['GROUND', 'NMAG', 'MISC'], values: { ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    // Gems
    'gem-perf-ame': { code: 'gpvs', name: 'Perfect Amethyst', flags: ['GROUND', 'MISC'], values: { GEM: 5, GEMLEVEL: 5, GEMTYPE: 1, ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0 } },
    'gem-flaw-dia': { code: 'glws', name: 'Flawless Diamond', flags: ['GROUND', 'MISC'], values: { GEM: 4, GEMLEVEL: 4, GEMTYPE: 2, ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0 } },
    'gem-chip-ruby': { code: 'gcrs', name: 'Chipped Ruby', flags: ['GROUND', 'MISC'], values: { GEM: 1, GEMLEVEL: 1, GEMTYPE: 4, ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0 } },
    // PD2 Special
    'pd2-wss': { code: 'wss', name: 'Worldstone Shard', flags: ['GROUND', 'MISC'], values: { ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'pd2-pbox': { code: 'lbox', name: "Larzuk's Puzzlebox", flags: ['GROUND', 'MISC'], values: { ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'pd2-essence': { code: 'tes', name: 'Twisted Essence of Suffering', flags: ['GROUND', 'MISC'], values: { ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'pd2-token': { code: 'toa', name: 'Token of Absolution', flags: ['GROUND', 'MISC'], values: { ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'pd2-key': { code: 'pk1', name: 'Key of Terror', flags: ['GROUND', 'MISC'], values: { ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'pd2-organ': { code: 'mbr', name: "Mephisto's Brain", flags: ['GROUND', 'MISC'], values: { ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'pd2-rkey': { code: 'rkey', name: 'Skeleton Key', flags: ['GROUND', 'MISC'], values: { ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'pd2-map-t1': { code: 't12', name: 'T1 Map', flags: ['GROUND', 'NMAG', 'MISC'], values: { ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0, MAPTIER: 1 } },
    'pd2-map-t3-rare': { code: 't34', name: 'T3 Rare Map', flags: ['GROUND', 'RARE', 'MISC'], values: { ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0, MAPTIER: 3 } }
  };

  // D2 color map for preview rendering
  var D2_COLORS = {
    '%WHITE%': '#ffffff',
    '%GRAY%': '#808080',
    '%RED%': '#ff4040',
    '%GREEN%': '#00c000',
    '%DARK_GREEN%': '#008000',
    '%BLUE%': '#6464ff',
    '%GOLD%': '#c8a040',
    '%YELLOW%': '#ffff40',
    '%ORANGE%': '#ff8000',
    '%PURPLE%': '#a000c8',
    '%TAN%': '#b0a080',
    '%BLACK%': '#000000',
    '%CORAL%': '#ff7f50',
    '%SAGE%': '#80b080',
    '%TEAL%': '#008080',
    '%LIGHT_GRAY%': '#c0c0c0'
  };

  var RUNE_NAMES = [
    '', 'El', 'Eld', 'Tir', 'Nef', 'Eth', 'Ith', 'Tal', 'Ral', 'Ort', 'Thul',
    'Amn', 'Sol', 'Shael', 'Dol', 'Hel', 'Io', 'Lum', 'Ko', 'Fal', 'Lem',
    'Pul', 'Um', 'Mal', 'Ist', 'Gul', 'Vex', 'Ohm', 'Lo', 'Sur', 'Ber',
    'Jah', 'Cham', 'Zod'
  ];

  // ==========================================
  // Builder: chip/color toggle logic
  // ==========================================
  function initChips() {
    document.querySelectorAll('.chip-group').forEach(function (group) {
      var field = group.getAttribute('data-field');
      var isMulti = group.getAttribute('data-multi') === 'true';

      group.querySelectorAll('.chip').forEach(function (chip) {
        chip.addEventListener('click', function () {
          if (isMulti) {
            chip.classList.toggle('active');
            var selected = [];
            group.querySelectorAll('.chip.active').forEach(function (c) {
              selected.push(c.getAttribute('data-value'));
            });
            builderState[field] = selected;
          } else {
            var wasActive = chip.classList.contains('active');
            group.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('active'); });
            if (!wasActive) {
              chip.classList.add('active');
              builderState[field] = chip.getAttribute('data-value');
            } else {
              builderState[field] = '';
            }
          }

          // Handle action show/hide toggle for output options
          if (field === 'action') {
            var opts = document.getElementById('output-options');
            if (opts) {
              opts.style.display = builderState.action === 'hide' ? 'none' : 'block';
            }
          }

          // Handle custom name toggle
          if (field === 'nameDisplay') {
            var customInput = document.getElementById('custom-name-input');
            if (customInput) {
              customInput.style.display = builderState.nameDisplay === 'custom' ? 'block' : 'none';
            }
          }

          updateGeneratedRule();
        });
      });
    });

    // Color chips
    document.querySelectorAll('.color-grid').forEach(function (grid) {
      grid.querySelectorAll('.color-chip').forEach(function (chip) {
        chip.addEventListener('click', function () {
          var wasActive = chip.classList.contains('active');
          grid.querySelectorAll('.color-chip').forEach(function (c) { c.classList.remove('active'); });
          if (!wasActive) {
            chip.classList.add('active');
            builderState.color = chip.getAttribute('data-value');
          } else {
            builderState.color = '';
          }
          updateGeneratedRule();
        });
      });
    });
  }

  // ==========================================
  // Builder: panel toggle
  // ==========================================
  function initPanelToggles() {
    document.querySelectorAll('.builder-group-header[data-toggle]').forEach(function (header) {
      var targetId = header.getAttribute('data-toggle');
      var panel = document.getElementById(targetId);
      header.setAttribute('role', 'button');
      header.setAttribute('tabindex', '0');

      // Open conditions and output by default
      if (targetId === 'conditions-panel' || targetId === 'output-panel') {
        panel.classList.add('open');
        header.querySelector('.chevron').style.transform = 'rotate(90deg)';
        header.setAttribute('aria-expanded', 'true');
      } else {
        header.setAttribute('aria-expanded', 'false');
      }

      function togglePanel() {
        panel.classList.toggle('open');
        var isOpen = panel.classList.contains('open');
        header.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        var chevron = header.querySelector('.chevron');
        if (chevron) {
          chevron.style.transform = isOpen ? 'rotate(90deg)' : '';
        }
      }

      header.addEventListener('click', togglePanel);
      header.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          togglePanel();
        }
      });
    });
  }

  // ==========================================
  // Builder: value conditions
  // ==========================================
  function initValueConditions() {
    var container = document.getElementById('value-conditions');
    var addBtn = document.getElementById('btn-add-value');

    function createRow() {
      var row = document.createElement('div');
      row.className = 'value-row';
      row.innerHTML =
        '<select class="value-code">' +
        document.querySelector('.value-code').innerHTML +
        '</select>' +
        '<select class="value-op">' +
        '<option value=">">&gt;</option><option value="<">&lt;</option><option value="=">=</option><option value="~">~ (between)</option>' +
        '</select>' +
        '<input type="text" class="value-val" placeholder="value" size="6">' +
        '<button class="btn-icon btn-remove-value" title="Remove">&times;</button>';
      return row;
    }

    // Wire up existing row
    container.querySelector('.btn-remove-value').addEventListener('click', function () {
      var rows = container.querySelectorAll('.value-row');
      if (rows.length > 1) {
        this.closest('.value-row').remove();
      } else {
        // Clear the row instead of removing last one
        var row = this.closest('.value-row');
        row.querySelector('.value-code').value = '';
        row.querySelector('.value-val').value = '';
      }
      updateGeneratedRule();
    });

    container.addEventListener('change', function () { updateGeneratedRule(); });
    container.addEventListener('input', function () { updateGeneratedRule(); });

    addBtn.addEventListener('click', function () {
      var row = createRow();
      container.appendChild(row);
      row.querySelector('.btn-remove-value').addEventListener('click', function () {
        row.remove();
        updateGeneratedRule();
      });
    });
  }

  // ==========================================
  // Builder: skill conditions
  // ==========================================
  var SKILL_DATA = {
    amazon: [['SK6','Magic Arrow'],['SK7','Fire Arrow'],['SK8','Inner Sight'],['SK9','Critical Strike'],['SK10','Jab'],['SK11','Cold Arrow'],['SK12','Multiple Shot'],['SK13','Dodge'],['SK14','Power Strike'],['SK15','Poison Javelin'],['SK16','Exploding Arrow'],['SK17','Slow Movement'],['SK18','Avoid'],['SK19','Jav/Spear Mastery'],['SK20','Lightning Bolt'],['SK21','Ice Arrow'],['SK22','Guided Arrow'],['SK23','Penetrate'],['SK24','Charged Strike'],['SK25','Plague Javelin'],['SK26','Strafe'],['SK27','Immolation Arrow'],['SK28','Decoy'],['SK29','Evade'],['SK30','Fend'],['SK31','Freezing Arrow'],['SK32','Valkyrie'],['SK33','Pierce'],['SK34','Lightning Strike'],['SK35','Lightning Fury']],
    sorceress: [['SK36','Fire Bolt'],['SK37','Warmth'],['SK38','Charged Bolt'],['SK39','Ice Bolt'],['SK40','Cold Enchant'],['SK41','Inferno'],['SK42','Static Field'],['SK43','Telekinesis'],['SK44','Frost Nova'],['SK45','Ice Blast'],['SK46','Blaze'],['SK47','Fire Ball'],['SK48','Nova'],['SK49','Lightning'],['SK50','Shiver Armor'],['SK51','Fire Wall'],['SK52','Enchant Fire'],['SK53','Chain Lightning'],['SK54','Teleport'],['SK55','Glacial Spike'],['SK56','Meteor'],['SK57','Thunder Storm'],['SK58','Energy Shield'],['SK59','Blizzard'],['SK60','Chilling Armor'],['SK61','Fire Mastery'],['SK62','Hydra'],['SK63','Lightning Mastery'],['SK64','Frozen Orb'],['SK65','Cold Mastery'],['SK369','Ice Barrage'],['SK376','Combustion'],['SK383','Lesser Hydra']],
    necromancer: [['SK66','Amplify Damage'],['SK67','Teeth'],['SK68','Bone Armor'],['SK69','Skeleton Mastery'],['SK70','Raise Skeleton'],['SK71','Dim Vision'],['SK72','Weaken'],['SK73','Poison Strike'],['SK74','Corpse Explosion'],['SK75','Clay Golem'],['SK76','Iron Maiden'],['SK77','Terror'],['SK78','Bone Wall'],['SK79','Golem Mastery'],['SK80','Skeletal Mage'],['SK81','Confuse'],['SK82','Life Tap'],['SK83','Desecrate'],['SK84','Bone Spear'],['SK85','Blood Golem'],['SK86','Attract'],['SK87','Decrepify'],['SK88','Bone Prison'],['SK89','Skeleton Archer'],['SK90','Iron Golem'],['SK91','Lower Resist'],['SK92','Poison Nova'],['SK93','Bone Spirit'],['SK94','Fire Golem'],['SK95','Revive'],['SK367','Blood Warp'],['SK374','Curse Mastery'],['SK381','Dark Pact']],
    paladin: [['SK96','Sacrifice'],['SK97','Smite'],['SK98','Might'],['SK99','Prayer'],['SK100','Resist Fire'],['SK101','Holy Bolt'],['SK102','Holy Fire'],['SK103','Thorns'],['SK104','Defiance'],['SK105','Resist Cold'],['SK106','Zeal'],['SK107','Charge'],['SK108','Blessed Aim'],['SK109','Cleansing'],['SK110','Resist Lightning'],['SK111','Vengeance'],['SK112','Blessed Hammer'],['SK113','Concentration'],['SK114','Holy Freeze'],['SK115','Vigor'],['SK116','Holy Sword'],['SK117','Holy Shield'],['SK118','Holy Shock'],['SK119','Sanctuary'],['SK120','Meditation'],['SK121','Fist of Heavens'],['SK122','Fanaticism'],['SK123','Conviction'],['SK124','Redemption'],['SK125','Salvation'],['SK364','Holy Nova'],['SK371','Holy Light'],['SK378','Joust']],
    barbarian: [['SK126','Bash'],['SK127','Sword Mastery'],['SK128','General Mastery'],['SK129','Mace Mastery'],['SK130','Howl'],['SK131','Find Potion'],['SK132','Leap'],['SK133','Double Swing'],['SK134','Polearm Mastery'],['SK135','Throwing Mastery'],['SK136','Spear Mastery'],['SK137','Taunt'],['SK138','Shout'],['SK139','Stun'],['SK140','Double Throw'],['SK141','Combat Reflexes'],['SK142','Find Item'],['SK143','Leap Attack'],['SK144','Concentrate'],['SK145','Iron Skin'],['SK146','Battle Cry'],['SK147','Frenzy'],['SK148','Increased Speed'],['SK149','Battle Orders'],['SK150','Grim Ward'],['SK151','Whirlwind'],['SK152','Berserk'],['SK153','Natural Resistance'],['SK154','War Cry'],['SK155','Battle Command'],['SK368','Deep Wounds']],
    druid: [['SK221','Raven'],['SK222','Poison Creeper'],['SK223','Werewolf'],['SK224','Lycanthropy'],['SK225','Firestorm'],['SK226','Oak Sage'],['SK227','Spirit Wolf'],['SK228','Werebear'],['SK229','Molten Boulder'],['SK230','Arctic Blast'],['SK231','Carrion Vine'],['SK232','Feral Rage'],['SK233','Maul'],['SK234','Fissure'],['SK235','Cyclone Armor'],['SK236','Heart of Wolverine'],['SK237','Dire Wolf'],['SK238','Rabies'],['SK239','Fire Claws'],['SK240','Twister'],['SK241','Solar Creeper'],['SK242','Hunger'],['SK243','Shock Wave'],['SK244','Volcano'],['SK245','Tornado'],['SK246','Spirit of Barbs'],['SK247','Grizzly'],['SK248','Fury'],['SK249','Armageddon'],['SK250','Hurricane'],['SK370','Gust']],
    assassin: [['SK251','Fire Blast'],['SK252','Claw Mastery'],['SK253','Psychic Hammer'],['SK254','Tiger Strike'],['SK255','Dragon Talon'],['SK256','Shock Web'],['SK257','Blade Sentinel'],['SK258','Burst of Speed'],['SK259','Fists of Fire'],['SK260','Dragon Claw'],['SK261','Charged Bolt Sentry'],['SK262','Wake of Fire'],['SK263','Weapon Block'],['SK264','Cloak of Shadows'],['SK265','Cobra Strike'],['SK266','Blade Fury'],['SK267','Fade'],['SK268','Shadow Warrior'],['SK269','Claws of Thunder'],['SK270','Dragon Tail'],['SK271','Chain Lightning Sentry'],['SK272','Wake of Inferno'],['SK273','Mind Blast'],['SK274','Blades of Ice'],['SK275','Dragon Flight'],['SK276','Death Sentry'],['SK277','Blade Shield'],['SK278','Venom'],['SK279','Shadow Master'],['SK280','Phoenix Strike'],['SK366','Lightning Sentry']]
  };

  // Maps each skill ID (number) to its TABSK index for MULTI code generation
  // Tab indices: Ama 0/1/2, Sor 8/9/10, Nec 16/17/18, Pal 24/25/26,
  //              Bar 32/33/34, Dru 40/41/42, Sin 48/49/50
  var SKILL_TAB_MAP = {
    // Amazon — Tab 0: Bow, Tab 1: Passive, Tab 2: Javelin
    6:0, 7:0, 11:0, 12:0, 16:0, 21:0, 22:0, 26:0, 27:0, 31:0,
    8:1, 9:1, 13:1, 17:1, 18:1, 23:1, 28:1, 29:1, 32:1, 33:1,
    10:2, 14:2, 15:2, 19:2, 20:2, 24:2, 25:2, 30:2, 34:2, 35:2,
    // Sorceress — Tab 8: Fire, Tab 9: Lightning, Tab 10: Cold
    36:8, 37:8, 41:8, 46:8, 47:8, 51:8, 52:8, 56:8, 61:8, 62:8, 376:8, 383:8,
    38:9, 42:9, 43:9, 48:9, 49:9, 53:9, 54:9, 57:9, 58:9, 63:9,
    39:10, 40:10, 44:10, 45:10, 50:10, 55:10, 59:10, 60:10, 64:10, 65:10, 369:10,
    // Necromancer — Tab 16: Curses, Tab 17: Poison & Bone, Tab 18: Summoning
    66:16, 71:16, 72:16, 76:16, 77:16, 81:16, 82:16, 86:16, 87:16, 91:16, 374:16,
    67:17, 68:17, 73:17, 74:17, 78:17, 83:17, 84:17, 88:17, 92:17, 93:17, 367:17, 381:17,
    69:18, 70:18, 75:18, 79:18, 80:18, 85:18, 89:18, 90:18, 94:18, 95:18,
    // Paladin — Tab 24: Combat, Tab 25: Offensive Auras, Tab 26: Defensive Auras
    96:24, 97:24, 101:24, 106:24, 107:24, 111:24, 112:24, 116:24, 117:24, 121:24, 364:24, 371:24, 378:24,
    98:25, 102:25, 108:25, 113:25, 114:25, 118:25, 122:25, 123:25,
    99:26, 100:26, 103:26, 104:26, 105:26, 109:26, 110:26, 115:26, 119:26, 120:26, 124:26, 125:26,
    // Barbarian — Tab 32: Combat, Tab 33: Masteries, Tab 34: Warcries
    126:32, 132:32, 133:32, 139:32, 140:32, 143:32, 144:32, 147:32, 151:32, 152:32,
    127:33, 128:33, 129:33, 134:33, 135:33, 136:33, 141:33, 145:33, 148:33, 153:33, 368:33,
    130:34, 131:34, 137:34, 138:34, 142:34, 146:34, 149:34, 150:34, 154:34, 155:34,
    // Druid — Tab 40: Summoning, Tab 41: Shape Shifting, Tab 42: Elemental
    221:40, 222:40, 226:40, 227:40, 231:40, 236:40, 237:40, 241:40, 246:40, 247:40,
    223:41, 224:41, 228:41, 232:41, 233:41, 238:41, 239:41, 242:41, 243:41, 248:41,
    225:42, 229:42, 230:42, 234:42, 235:42, 240:42, 244:42, 245:42, 249:42, 250:42, 370:42,
    // Assassin — Tab 48: Traps, Tab 49: Shadow, Tab 50: Martial Arts
    251:48, 256:48, 257:48, 261:48, 262:48, 266:48, 271:48, 272:48, 276:48, 277:48, 366:48,
    252:49, 253:49, 258:49, 263:49, 264:49, 267:49, 268:49, 273:49, 278:49, 279:49,
    254:50, 255:50, 259:50, 260:50, 265:50, 269:50, 270:50, 274:50, 275:50, 280:50
  };

  // Maps class name to CLSK class index for MULTI code generation
  var CLASS_INDEX_MAP = {
    amazon: 0, sorceress: 1, necromancer: 2, paladin: 3,
    barbarian: 4, druid: 5, assassin: 6
  };

  function initSkillConditions() {
    var container = document.getElementById('skill-conditions');
    var addBtn = document.getElementById('btn-add-skill');
    var multiCheckbox = document.getElementById('skill-multi-mode');
    var MAX_SKILLS = 3;

    if (multiCheckbox) {
      multiCheckbox.addEventListener('change', function () { updateGeneratedRule(); });
    }

    function populateSkills(row) {
      var classSelect = row.querySelector('.skill-class');
      var skillSelect = row.querySelector('.skill-name');
      classSelect.addEventListener('change', function () {
        var cls = classSelect.value;
        skillSelect.innerHTML = '<option value="">-- Skill --</option>';
        if (cls && SKILL_DATA[cls]) {
          SKILL_DATA[cls].forEach(function (sk) {
            var opt = document.createElement('option');
            opt.value = sk[0];
            opt.textContent = sk[1];
            skillSelect.appendChild(opt);
          });
          skillSelect.disabled = false;
        } else {
          skillSelect.disabled = true;
        }
        updateGeneratedRule();
      });
      skillSelect.addEventListener('change', function () { updateGeneratedRule(); });
      row.querySelector('.skill-op').addEventListener('change', function () { updateGeneratedRule(); });
      row.querySelector('.skill-level').addEventListener('change', function () { updateGeneratedRule(); });
    }

    function createRow() {
      var row = document.createElement('div');
      row.className = 'skill-row';
      row.innerHTML =
        '<select class="skill-class" aria-label="Skill class">' +
        '<option value="">-- Class --</option>' +
        '<option value="amazon">Amazon</option><option value="sorceress">Sorceress</option>' +
        '<option value="necromancer">Necromancer</option><option value="paladin">Paladin</option>' +
        '<option value="barbarian">Barbarian</option><option value="druid">Druid</option>' +
        '<option value="assassin">Assassin</option></select>' +
        '<select class="skill-name" aria-label="Skill name" disabled><option value="">-- Skill --</option></select>' +
        '<select class="skill-op" aria-label="Skill operator"><option value="=">=</option><option value=">">&gt; (at least)</option><option value="<">&lt;</option></select>' +
        '<select class="skill-level" aria-label="Skill level"><option value="1">1</option><option value="2">2</option><option value="3">3</option></select>' +
        '<button class="btn-icon btn-remove-skill" title="Remove">&times;</button>';
      return row;
    }

    // Wire up existing first row
    var firstRow = container.querySelector('.skill-row');
    populateSkills(firstRow);
    firstRow.querySelector('.btn-remove-skill').addEventListener('click', function () {
      var rows = container.querySelectorAll('.skill-row');
      if (rows.length > 1) {
        firstRow.remove();
      } else {
        firstRow.querySelector('.skill-class').value = '';
        firstRow.querySelector('.skill-name').innerHTML = '<option value="">-- Skill --</option>';
        firstRow.querySelector('.skill-name').disabled = true;
        firstRow.querySelector('.skill-op').value = '=';
        firstRow.querySelector('.skill-level').value = '1';
      }
      addBtn.style.display = '';
      updateGeneratedRule();
    });

    addBtn.addEventListener('click', function () {
      if (container.querySelectorAll('.skill-row').length >= MAX_SKILLS) return;
      var row = createRow();
      container.appendChild(row);
      populateSkills(row);
      row.querySelector('.btn-remove-skill').addEventListener('click', function () {
        row.remove();
        addBtn.style.display = '';
        updateGeneratedRule();
      });
      if (container.querySelectorAll('.skill-row').length >= MAX_SKILLS) {
        addBtn.style.display = 'none';
      }
    });
  }

  // ==========================================
  // Builder: text inputs
  // ==========================================
  function initTextInputs() {
    var ids = ['item-code-input', 'custom-name-input', 'prepend-text', 'append-text', 'map-icon-color', 'description-input'];
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', function () { updateGeneratedRule(); });
      }
    });

    var soundSelect = document.getElementById('sound-select');
    if (soundSelect) {
      soundSelect.addEventListener('change', function () { updateGeneratedRule(); });
    }

    var allTiersCheck = document.getElementById('item-code-alltiers');
    if (allTiersCheck) {
      allTiersCheck.addEventListener('change', function () { updateGeneratedRule(); });
    }
  }

  // ==========================================
  // Generate rule from builder state
  // ==========================================
  // Tier mapping: each code maps to [norm, exc, elite] variants
  var ITEM_TIER_GROUPS = [
    // Helms
    ['cap','xap','uap'],['skp','xkp','ukp'],['hlm','xlm','ulm'],['fhl','xhl','uhl'],['ghm','xhm','uhm'],['crn','xrn','urn'],['msk','xsk','usk'],
    // Armor
    ['qui','xui','uui'],['lea','xea','uea'],['hla','xla','ula'],['stu','xtu','utu'],['rng','xng','ung'],['scl','xmg','umg'],['chn','xcl','ucl'],
    ['brs','xhn','uhn'],['spl','xrs','urs'],['plt','xpl','upl'],['fld','xlt','ult'],['gth','xld','uld'],['ful','xth','uth'],['aar','xul','uul'],['ltp','xar','uar'],
    // Shields
    ['buc','xuc','uuc'],['sml','xml','uml'],['lrg','xrg','urg'],['spk','xpk','upk'],['kit','xit','uit'],['bsh','xsh','ush'],['tow','xow','uow'],['gts','xts','uts'],
    // Gloves
    ['lgl','xlg','ulg'],['vgl','xvg','uvg'],['mgl','xmg','umg'],['tgl','xtg','utg'],['hgl','xhg','uhg'],
    // Boots
    ['lbt','xlb','ulb'],['vbt','xvb','uvb'],['mbt','xmb','umb'],['tbt','xtb','utb'],['hbt','xhb','uhb'],
    // Belts
    ['lbl','zlb','ulc'],['vbl','zvb','uvc'],['mbl','zmb','umc'],['tbl','ztb','utc'],['hbl','zhb','uhc'],
    // Axes
    ['hax','9ha','7ha'],['axe','9ax','7ax'],['2ax','92a','72a'],['mpi','9mp','7mp'],['wax','9wa','7wa'],['lax','9la','7la'],['bax','9ba','7ba'],['btx','9bt','7bt'],['gax','9ga','7ga'],['gix','9gi','7gi'],
    // Maces
    ['clb','9cl','7cl'],['spc','9sp','7sp'],['mac','9ma','7ma'],['mst','9mt','7mt'],['fla','9fl','7fl'],['whm','9wh','7wh'],['mau','9m9','7m7'],['gma','9gm','7gm'],
    // Swords
    ['ssd','9ss','7ss'],['scm','9sm','7sm'],['sbr','9sb','7sb'],['flc','9fc','7fc'],['crs','9cr','7cr'],['bsd','9bs','7bs'],['lsd','9ls','7ls'],['wsd','9wd','7wd'],['2hs','92h','72h'],['clm','9cm','7cm'],['gis','9gs','7gs'],['bsw','9b9','7b7'],['flb','9fb','7fb'],['gsd','9gd','7gd'],
    // Daggers
    ['dgr','9dg','7dg'],['dir','9di','7di'],['kri','9kr','7kr'],['bld','9bl','7bl'],
    // Spears
    ['spr','9sr','7sr'],['tri','9tr','7tr'],['brn','9br','7br'],['spt','9st','7st'],['pik','9p9','7p7'],
    // Polearms
    ['bar','9b7','7o7'],['vou','9vo','7vo'],['scy','9s8','7s8'],['pax','9pa','7pa'],['hal','9h9','7h7'],['wsc','9wc','7wc'],
    // Javelins
    ['jav','9ja','7ja'],['pil','9pi','7pi'],['ssp','9s9','7s7'],['glv','9gl','7gl'],['tsp','9ts','7ts'],
    // Throwing
    ['tkf','9tk','7tk'],['tax','9ta','7ta'],['bkf','9bk','7bk'],['bal','9b8','7b8'],
    // Bows
    ['sbw','8sb','6sb'],['hbw','8hb','6hb'],['lbw','8lb','6lb'],['cbw','8cb','6cb'],['sbb','8s8','6s7'],['lbb','8l8','6l7'],['swb','8sw','6sw'],['lwb','8lw','6lw'],
    // Crossbows
    ['lxb','8lx','6lx'],['mxb','8mx','6mx'],['hxb','8hx','6hx'],['rxb','8rx','6rx'],
    // Staves
    ['sst','8ss','6ss'],['lst','8ls','6ls'],['cst','8cs','6cs'],['bst','8bs','6bs'],['wst','8ws','6ws'],
    // Scepters
    ['scp','9qs','7qs'],['gsc','9sc','7sc'],['wsp','9ws','7ws'],
    // Assassin Katars
    ['ktr','9ar','7ar'],['wrb','9wb','7wb'],['axf','9xf','7xf'],['ces','9cs','7cs'],['clw','9lw','7lw'],['btl','9tw','7tw'],['skr','9qr','7qr'],
    // Amazon Bows
    ['am1','am6','amb'],['am2','am7','amc'],
    // Amazon Spears/Pikes/Javelins
    ['am3','am8','amd'],['am4','am9','ame'],['am5','ama','amf'],
    // Druid Pelts
    ['dr1','dr6','drb'],['dr2','dr7','drc'],['dr3','dr8','drd'],['dr4','dr9','dre'],['dr5','dra','drf'],
    // Barbarian Helms
    ['ba1','ba6','bab'],['ba2','ba7','bac'],['ba3','ba8','bad'],['ba4','ba9','bae'],['ba5','baa','baf'],
    // Paladin Shields
    ['pa1','pa6','pab'],['pa2','pa7','pac'],['pa3','pa8','pad'],['pa4','pa9','pae'],['pa5','paa','paf']
  ];
  var ITEM_TIER_MAP = {};
  ITEM_TIER_GROUPS.forEach(function (group) {
    group.forEach(function (code) {
      ITEM_TIER_MAP[code] = group;
    });
  });

  function updateGeneratedRule() {
    var conditions = [];

    // Quality
    if (builderState.quality) conditions.push(builderState.quality);

    // Tier
    // Tier (multi-select: wraps in OR group)
    if (builderState.tier && builderState.tier.length) {
      if (builderState.tier.length === 1) {
        conditions.push(builderState.tier[0]);
      } else {
        conditions.push('(' + builderState.tier.join(' OR ') + ')');
      }
    }

    // Properties (multi)
    if (builderState.properties && builderState.properties.length) {
      builderState.properties.forEach(function (p) { conditions.push(p); });
    }

    // Item category (ARMOR, WEAPON — multi-select)
    if (builderState.itemcat && builderState.itemcat.length) {
      if (builderState.itemcat.length === 1) {
        conditions.push(builderState.itemcat[0]);
      } else {
        conditions.push('(' + builderState.itemcat.join(' OR ') + ')');
      }
    }

    // Armor slot
    if (builderState.equipment) conditions.push(builderState.equipment);

    // Weapon type
    if (builderState.weapons) conditions.push(builderState.weapons);

    // Misc
    if (builderState.misc) conditions.push(builderState.misc);

    // Class items
    if (builderState.classitems) conditions.push(builderState.classitems);

    // Location (multi-select: wraps in OR group)
    if (builderState.location && builderState.location.length) {
      if (builderState.location.length === 1) {
        conditions.push(builderState.location[0]);
      } else {
        conditions.push('(' + builderState.location.join(' OR ') + ')');
      }
    }

    // Negate (multi)
    if (builderState.negate && builderState.negate.length) {
      builderState.negate.forEach(function (n) { conditions.push(n); });
    }

    // Item code (with optional all-tiers expansion)
    var itemCode = document.getElementById('item-code-input').value.trim();
    var allTiers = document.getElementById('item-code-alltiers').checked;
    if (itemCode && allTiers) {
      var tierCodes = ITEM_TIER_MAP[itemCode];
      if (tierCodes && tierCodes.length > 1) {
        conditions.push('(' + tierCodes.join(' OR ') + ')');
      } else {
        conditions.push(itemCode);
      }
    } else if (itemCode) {
      conditions.push(itemCode);
    }

    // Value conditions
    var vcContainer = document.getElementById('value-conditions');
    vcContainer.querySelectorAll('.value-row').forEach(function (row) {
      var code = row.querySelector('.value-code').value;
      var op = row.querySelector('.value-op').value;
      var val = row.querySelector('.value-val').value.trim();
      if (code && val) {
        conditions.push(code + op + val);
      }
    });

    // Skill conditions
    var skContainer = document.getElementById('skill-conditions');
    var useMulti = document.getElementById('skill-multi-mode') && document.getElementById('skill-multi-mode').checked;
    if (skContainer) {
      skContainer.querySelectorAll('.skill-row').forEach(function (row) {
        var code = row.querySelector('.skill-name').value;
        var cls = row.querySelector('.skill-class').value;
        var op = row.querySelector('.skill-op').value;
        var level = row.querySelector('.skill-level').value;
        if (code && level) {
          if (useMulti && cls) {
            var skillNum = parseInt(code.replace('SK', ''), 10);
            var tabIdx = SKILL_TAB_MAP[skillNum];
            var classIdx = CLASS_INDEX_MAP[cls];
            if (tabIdx !== undefined && classIdx !== undefined) {
              conditions.push('MULTI107,' + skillNum + '+MULTI188,' + tabIdx + '+MULTI83,' + classIdx + '+ALLSK' + op + level);
            } else {
              conditions.push(code + op + level);
            }
          } else {
            conditions.push(code + op + level);
          }
        }
      });
    }

    // Build conditions string
    var condStr = conditions.join(' ');

    // Build output
    var output = '';
    if (builderState.action !== 'hide') {
      var color = builderState.color || '';
      var nameDisplay = builderState.nameDisplay || '%NAME%';
      var customName = document.getElementById('custom-name-input').value.trim();
      var prependText = document.getElementById('prepend-text').value.trim();
      var appendText = document.getElementById('append-text').value.trim();
      var mapIcon = builderState.mapIcon || '';
      var mapIconColor = document.getElementById('map-icon-color').value.trim().toUpperCase();
      var sound = document.getElementById('sound-select').value;
      var notify = builderState.notify || '';
      var continueKw = builderState.continueKw || '';
      var description = document.getElementById('description-input').value.trim();

      output += color;

      if (prependText) {
        output += prependText;
      }

      if (nameDisplay === 'custom' && customName) {
        output += customName;
      } else {
        output += '%NAME%';
      }

      if (appendText) {
        output += appendText;
      }

      if (description) {
        output += '{' + description + '}';
      }

      if (mapIcon) {
        var iconBase = mapIcon.replace(/%/g, '');
        // BORDER, MAP, DOT, PX require a color code — default to FF if none given
        var effectiveColor = mapIconColor || 'FF';
        output += '%' + iconBase + '-' + effectiveColor + '%';
      }

      if (sound) {
        output += '%SOUNDID-' + sound + '%';
      }

      if (notify) {
        output += notify;
      }

      if (continueKw) {
        output += continueKw;
      }
    }

    var rule = 'ItemDisplay[' + condStr + ']: ' + output;
    generatedCode.textContent = rule;
    generatedCode.classList.remove('empty-state');
  }

  // ==========================================
  // Code editor: line numbers + stats
  // ==========================================
  var cachedLineCount = 0;
  var statsTimer = null;
  var highlightTimer = null;
  var resizeTimer = null;

  // Compute line height once (in px) for virtual line number rendering
  var lineHeightPx = 0;
  function getLineHeight() {
    if (lineHeightPx) return lineHeightPx;
    var computed = window.getComputedStyle(codeEditor);
    lineHeightPx = parseFloat(computed.lineHeight) || (parseFloat(computed.fontSize) * 1.55);
    return lineHeightPx;
  }

  function updateLineNumbers() {
    var text = codeEditor.value;
    var count = 1;
    for (var i = 0; i < text.length; i++) {
      if (text.charCodeAt(i) === 10) count++;
    }
    cachedLineCount = count;

    // Line numbers — only rebuild if count changed
    if (lineNumbers._lastCount !== count) {
      lineNumbers._lastCount = count;
      renderVisibleLineNumbers();
    }

    // Update simple stats immediately (cheap DOM writes)
    lineCount.textContent = 'Lines: ' + count;
    charCount.textContent = 'Chars: ' + text.length;

    // Debounce everything expensive for large files
    var isLarge = count > 300;

    // Rule count
    clearTimeout(statsTimer);
    if (!isLarge) {
      ruleCount.textContent = 'Rules: ' + countRules(text);
    } else {
      statsTimer = setTimeout(function () {
        ruleCount.textContent = 'Rules: ' + countRules(text);
      }, 500);
    }

    // Syntax highlighting
    clearTimeout(highlightTimer);
    if (typeof highlightCode === 'function') {
      if (!isLarge) {
        highlightCode();
      } else {
        highlightTimer = setTimeout(highlightCode, 200);
      }
    }

    // Auto-resize textarea (debounced — avoids forced reflow per keystroke)
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      codeEditor.style.height = 'auto';
      codeEditor.style.height = codeEditor.scrollHeight + 'px';
    }, isLarge ? 200 : 50);
  }

  function countRules(text) {
    var rules = 0;
    var lines = text.split('\n');
    for (var i = 0; i < lines.length; i++) {
      var t = lines[i].trimStart();
      if (t.length > 12 && (t.indexOf('ItemDisplay[') === 0 || t.indexOf('ItemDisplay [') === 0)) {
        rules++;
      }
    }
    return rules;
  }

  function renderVisibleLineNumbers() {
    // Full render — editor is full-length, no virtual scroll needed
    var nums = [];
    for (var i = 1; i <= cachedLineCount; i++) {
      nums.push(i);
    }
    lineNumbers.style.paddingTop = '';
    lineNumbers.style.paddingBottom = '';
    lineNumbers.textContent = nums.join('\n');
  }

  var highlightEl = document.getElementById('code-highlight');

  // Known valid condition tokens for validation
  var KNOWN_FLAGS = ['UNI','SET','RARE','MAG','NMAG','CRAFT','ETH','SUP','INF','ID','RW','NORM','EXC','ELT','ARMOR','WEAPON','HELM','CHEST','SHIELD','GLOVES','BOOTS','BELT','CIRC','AXE','MACE','SWORD','DAGGER','SPEAR','POLEARM','BOW','XBOW','STAFF','WAND','SCEPTER','JAV','THROWING','JEWELRY','CHARM','QUIVER','MISC','GEMMED','GROUND','EQUIPPED','INVENTORY','STASH','CUBE','SHOP','MERC','1H','2H','CLASS','ZON','SOR','NEC','DIN','BAR','DRU','SIN','CL1','CL2','CL3','CL4','CL5','CL6','CL7','EQ1','EQ2','EQ3','EQ4','EQ5','EQ6','EQ7'];
  var KNOWN_NEGATES = KNOWN_FLAGS.map(function (f) { return '!' + f; });
  var KNOWN_VALUE_CODES = ['SOCKETS','SOCK','DEF','ED','EDEF','EDAM','ILVL','CLVL','ALVL','QLVL','RUNE','GOLD','PRICE','SELLPRICE','FRES','CRES','LRES','PRES','RES','STR','DEX','LIFE','MANA','FCR','IAS','FHR','FRW','MFIND','LVLREQ','MAXSOCKETS','GEMLEVEL','GEM','GEMTYPE','FILTLVL','DIFF','MAPID','MAPTIER','ALLSK','QTY','TABSK0','TABSK1','TABSK2','TABSK3','TABSK4','TABSK5','TABSK6','CHARSTAT','WIDTH','HEIGHT','AREA','UPDEX','UPSTR','UPLVL','MAXRES','ALLATTRIB','BASEBLOCK','REQLVL','REQSTR','REQDEX','BASEMINONEH','BASEMAXONEH','BASEMINTWOH','BASEMAXTWOH','BASEMINSMITE','BASEMAXSMITE','BASEMINTHROW','BASEMAXTHROW','BASEMINKICK','BASEMAXKICK'];
  var KNOWN_OUTPUT_TOKENS = ['NAME','RUNENAME','RUNENUM','ILVL','ALVL','CRAFTALVL','REROLLALVL','SOCKETS','SOCK','MAXSOCKETS','DEF','ED','EDEF','EDAM','RES','PRICE','SELLPRICE','QTY','MAPTIER','BASENAME','CODE','RANGE','WPNSPD','GEMTYPE','GEMLEVEL','CONTINUE','NL','CL','CS','WHITE','GRAY','RED','GREEN','DARK_GREEN','BLUE','GOLD','YELLOW','ORANGE','PURPLE','TAN','BLACK','CORAL','SAGE','TEAL','LIGHT_GRAY','LVLREQ','WIDTH','HEIGHT','AREA','UPDEX','UPSTR','UPLVL','MAXRES','ALLATTRIB','BASEBLOCK','REQLVL','REQSTR','REQDEX','BASEMINONEH','BASEMAXONEH','BASEMINTWOH','BASEMAXTWOH','BASEMINSMITE','BASEMAXSMITE','BASEMINTHROW','BASEMAXTHROW','BASEMINKICK','BASEMAXKICK'];

  function escapeForHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function highlightLine(line) {
    var trimmed = line.trim();

    // Empty line
    if (!trimmed) return escapeForHtml(line);

    // Comment
    if (trimmed.startsWith('//')) {
      return '<span class="hl-comment">' + escapeForHtml(line) + '</span>';
    }

    // Alias line
    var aliasMatch = trimmed.match(/^(Alias\s*)\[([^\]]*)\]\s*:\s*(.*)/);
    if (aliasMatch) {
      var pre = line.substring(0, line.indexOf('Alias'));
      return pre + '<span class="hl-alias-kw">Alias</span>[<span class="hl-alias-name">' + escapeForHtml(aliasMatch[2]) + '</span>]: <span class="hl-alias-val">' + escapeForHtml(aliasMatch[3]) + '</span>';
    }

    // Formula line
    var formulaMatch = trimmed.match(/^(Formula\s*)\[([^\]]*)\]\s*:\s*(.*)/);
    if (formulaMatch) {
      var pre = line.substring(0, line.indexOf('Formula'));
      return pre + '<span class="hl-alias-kw">Formula</span>[<span class="hl-alias-name">' + escapeForHtml(formulaMatch[2]) + '</span>]: <span class="hl-alias-val">' + escapeForHtml(formulaMatch[3]) + '</span>';
    }

    // ItemDisplay line
    var ruleMatch = trimmed.match(/^(ItemDisplay\s*)\[([^\]]*)\]\s*:\s*(.*)/);
    if (ruleMatch) {
      var pre = line.substring(0, line.indexOf('ItemDisplay'));
      var conditions = ruleMatch[2];
      var output = ruleMatch[3];

      // Validate and highlight condition tokens
      // First, mark $f(...) inline formulas so they are not flagged as unknown
      var escapedConds = escapeForHtml(conditions);
      // Replace $f(...) with a placeholder to avoid word-token warnings inside formulas
      var formulaPlaceholders = [];
      escapedConds = escapedConds.replace(/\$f\((?:[^()]*|\([^()]*\))*\)/g, function (m) {
        var idx = formulaPlaceholders.length;
        formulaPlaceholders.push(m);
        return '\x00FORMULA_PH_' + idx + '\x00';
      });
      var highlightedConds = escapedConds.replace(/!?[A-Za-z][A-Za-z0-9_]*/g, function (tok) {
        // Skip OR keyword
        if (tok === 'OR') return tok;
        // Strip leading ! for base token check
        var baseTok = tok.replace(/^!/, '');
        // Known flags and negations
        if (KNOWN_FLAGS.indexOf(baseTok) !== -1) return tok;
        // Known value codes (SOCKETS, ILVL, RUNE, etc.)
        if (KNOWN_VALUE_CODES.indexOf(baseTok) !== -1) return tok;
        // Dynamic stat/skill tokens: STAT###, SK###, CLSK###, TABSK###, MULTI###
        if (/^!?(STAT|SK|CLSK|TABSK|CHARSTAT|MULTI)\d*$/.test(tok)) return tok;
        // Formula references: FORMULA followed by a key (e.g. FORMULAA, FORMULA_B)
        if (/^!?FORMULA[A-Z_0-9]+$/.test(tok)) return tok;
        // Item codes (2-4 alphanumeric chars) — allow lowercase
        if (baseTok.length <= 4 && baseTok.length >= 2) return tok;
        // Unknown token — warn
        return '<span class="hl-warn" title="Unknown condition: ' + tok + '">' + tok + '</span>';
      });
      // Restore $f(...) formula placeholders
      highlightedConds = highlightedConds.replace(/\x00FORMULA_PH_(\d+)\x00/g, function (m, idx) {
        return formulaPlaceholders[parseInt(idx, 10)];
      });

      // Highlight color tokens in output with their actual color, validate others
      var highlightedOutput = escapeForHtml(output).replace(/%([A-Z_0-9+,]+(?:-[A-Z0-9]+)?)%/g, function (m, tok) {
        var colorKey = '%' + tok + '%';
        if (D2_COLORS[colorKey]) {
          return '<span class="hl-color-token" style="color:' + D2_COLORS[colorKey] + '">' + m + '</span>';
        }
        // Known output tokens
        var baseTok = tok.replace(/-.*/, '');
        if (KNOWN_OUTPUT_TOKENS.indexOf(baseTok) !== -1) return m;
        // Notification tokens (BORDER-XX, MAP-XX, DOT-XX, SOUNDID-XXXX, etc.)
        // Warn if BORDER/MAP/DOT/PX is used without a color code (e.g. %BORDER% instead of %BORDER-FF%)
        if (/^(BORDER|MAP|DOT|PX)$/.test(tok)) return '<span class="hl-warn" title="' + m + ' requires a color code (e.g. %' + tok + '-FF%)">' + m + '</span>';
        if (/^(BORDER|MAP|DOT|PX|SOUNDID|SOUND|NOTIFY|TIER|STAT\d+|SK\d+|CLSK\d+|TABSK\d+|MULTI)/.test(tok)) return m;
        // Formula references: %FORMULAA%, %FORMULA_B%, etc.
        if (/^FORMULA[A-Z_0-9]+$/.test(tok)) return m;
        // Escaped percent
        if (tok === '') return m;
        // Unknown — warn
        return '<span class="hl-warn" title="Unknown token: ' + m + '">' + m + '</span>';
      });

      return pre + '<span class="hl-keyword">ItemDisplay</span>[<span class="hl-condition">' + highlightedConds + '</span>]: <span class="hl-output">' + highlightedOutput + '</span>';
    }

    // FilterDisplayName line
    if (trimmed.match(/^ItemDisplayFilter(Name|Description)\s*\[/)) {
      return '<span class="hl-keyword">' + escapeForHtml(line) + '</span>';
    }

    // Only flag lines that look like broken rules (start with ItemDisplay but malformed)
    if (trimmed.indexOf('ItemDisplay') === 0 && !trimmed.match(/^ItemDisplay\s*\[/)) {
      return '<span class="hl-error">' + escapeForHtml(line) + '</span>';
    }

    // Flag malformed Formula lines
    if (trimmed.indexOf('Formula') === 0 && !trimmed.match(/^Formula\s*\[/)) {
      return '<span class="hl-error">' + escapeForHtml(line) + '</span>';
    }

    // Everything else: plain text (don't flag unknown lines as errors)
    return escapeForHtml(line);
  }

  var hlCache = [];

  function showHighlight() {
    highlightEl.style.display = '';
    codeEditor.style.color = 'transparent';
  }

  function hideHighlight() {
    highlightEl.style.display = 'none';
    codeEditor.style.color = 'var(--text-primary)';
  }

  function highlightCode() {
    var text = codeEditor.value;
    var lines = text.split('\n');
    var changed = false;

    if (lines.length !== hlCache.length) {
      hlCache = lines.map(function (l) { return { src: l, html: highlightLine(l) }; });
      changed = true;
    } else {
      for (var i = 0; i < lines.length; i++) {
        if (hlCache[i].src !== lines[i]) {
          hlCache[i] = { src: lines[i], html: highlightLine(lines[i]) };
          changed = true;
        }
      }
    }

    if (changed) {
      highlightEl.innerHTML = hlCache.map(function (c) { return c.html; }).join('\n') + '\n';
    }
    showHighlight();
  }

  // Community editor syntax highlighting
  function highlightCommunityTA(id) {
    var ta = document.getElementById(id);
    var hlMap = {
      'community-top-block': 'community-top-hl',
      'community-filter-text': 'community-mid-hl',
      'community-bottom-block': 'community-bottom-hl',
      'community-grail-text': 'community-grail-hl'
    };
    var hl = document.getElementById(hlMap[id]);
    if (!ta || !hl) return;
    var lines = ta.value.split('\n');
    hl.innerHTML = lines.map(function (l) { return highlightLine(l); }).join('\n') + '\n';
    // Auto-size textarea to content so the container scrolls
    ta.style.height = 'auto';
    ta.style.height = ta.scrollHeight + 'px';
  }

  function highlightAllCommunityTAs() {
    highlightCommunityTA('community-top-block');
    highlightCommunityTA('community-filter-text');
    highlightCommunityTA('community-bottom-block');
    highlightCommunityTA('community-grail-text');
  }

  function syncScroll() {
    var wrap = document.querySelector('.code-editor-wrap');
    lineNumbers.scrollTop = wrap.scrollTop;
    renderVisibleLineNumbers();
  }

  // ==========================================
  // Tab handling for code editor (insert tab char)
  // ==========================================
  function handleTab(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      var start = codeEditor.selectionStart;
      var end = codeEditor.selectionEnd;
      var value = codeEditor.value;
      codeEditor.value = value.substring(0, start) + '\t' + value.substring(end);
      codeEditor.selectionStart = codeEditor.selectionEnd = start + 1;
      updateLineNumbers();
    }
  }

  // ==========================================
  // Insert rule into editor
  // ==========================================
  function getCommunityInsertTarget() {
    // In community mode, insert into the top block by default
    if (communityMode.active) return document.getElementById('community-top-block');
    return null;
  }

  function afterCommunityInsert(target) {
    highlightCommunityTA(target.id);
    codeEditor.value = getFullFilterText();
    updateLineNumbers();
    saveCommunityState();
  }

  function insertRule() {
    if (generatedCode.classList.contains('empty-state')) return;
    var rule = generatedCode.textContent;
    var target = getCommunityInsertTarget() || codeEditor;
    var val = target.value;
    var pos = target.selectionStart;

    // Find the boundaries of the current line
    var lineStart = val.lastIndexOf('\n', pos - 1) + 1;
    var lineEnd = val.indexOf('\n', pos);
    if (lineEnd === -1) lineEnd = val.length;
    var currentLine = val.substring(lineStart, lineEnd);

    // If the current line has content, insert on a new line below it
    if (currentLine.trim().length > 0) {
      var before = val.substring(0, lineEnd);
      var after = val.substring(lineEnd);
      var suffix = after.length > 0 && !after.startsWith('\n') ? '\n' : '';
      target.value = before + '\n' + rule + suffix + after;
      var newPos = lineEnd + 1 + rule.length;
      target.selectionStart = target.selectionEnd = newPos;
    } else {
      // Empty line — insert directly here
      var before = val.substring(0, lineStart);
      var after = val.substring(lineEnd);
      var suffix = after.length > 0 && !after.startsWith('\n') ? '\n' : '';
      target.value = before + rule + suffix + after;
      var newPos = lineStart + rule.length;
      target.selectionStart = target.selectionEnd = newPos;
    }
    target.focus();
    if (communityMode.active) { afterCommunityInsert(target); } else { updateLineNumbers(); saveToStorage(); }
  }

  function insertRuleAtTop() {
    if (generatedCode.classList.contains('empty-state')) return;
    var rule = generatedCode.textContent;
    var target = getCommunityInsertTarget() || codeEditor;
    var val = target.value;
    var suffix = val.length > 0 && !val.startsWith('\n') ? '\n' : '';
    target.value = rule + suffix + val;
    target.selectionStart = target.selectionEnd = rule.length;
    target.focus();
    if (communityMode.active) { afterCommunityInsert(target); } else { updateLineNumbers(); saveToStorage(); }
  }

  function insertRuleAtEnd() {
    if (generatedCode.classList.contains('empty-state')) return;
    var rule = generatedCode.textContent;
    if (communityMode.active) {
      // In community mode, "insert at end" goes to the bottom block
      var target = document.getElementById('community-bottom-block');
      var val = target.value;
      var prefix = val.length > 0 && !val.endsWith('\n') ? '\n' : '';
      target.value = val + prefix + rule;
      var newPos = val.length + prefix.length + rule.length;
      target.selectionStart = target.selectionEnd = newPos;
      target.focus();
      afterCommunityInsert(target);
    } else {
      var val = codeEditor.value;
      var prefix = val.length > 0 && !val.endsWith('\n') ? '\n' : '';
      codeEditor.value = val + prefix + rule;
      var newPos = val.length + prefix.length + rule.length;
      codeEditor.selectionStart = codeEditor.selectionEnd = newPos;
      codeEditor.focus();
      updateLineNumbers();
      saveToStorage();
    }
  }

  // ==========================================
  // Import / Export
  // ==========================================
  function initImportExport() {
    var fileInput = document.getElementById('file-import');
    var btnImport = document.getElementById('btn-import');
    var btnExport = document.getElementById('btn-export');
    var btnNew = document.getElementById('btn-new');

    btnImport.addEventListener('click', function () {
      fileInput.click();
    });

    fileInput.addEventListener('change', function (e) {
      var file = e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (ev) {
        var buf = ev.target.result;
        // Try UTF-8 first, fall back to Windows-1252 for ANSI filters
        var text = new TextDecoder('utf-8').decode(buf);
        if (text.indexOf('\uFFFD') !== -1) {
          text = new TextDecoder('windows-1252').decode(buf);
        }
        if (communityMode.active) {
          communityMode.active = false;
          saveCommunityState();
          document.getElementById('pane-community').style.display = 'none';
          document.getElementById('pane-code').style.display = 'block';
        }
        codeEditor.value = text;
        updateLineNumbers();
        saveToStorage();
      };
      reader.readAsArrayBuffer(file);
      fileInput.value = '';
    });

    btnExport.addEventListener('click', function () {
      var text = getFullFilterText();
      if (!text.trim()) {
        text = '// Empty filter\nItemDisplay[]: %NAME%';
      }
      var blob = new Blob([text], { type: 'text/plain' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'loot.filter';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    btnNew.addEventListener('click', function () {
      if (codeEditor.value.trim() && !confirm('Start a new filter? Unsaved changes will be lost.')) return;
      codeEditor.value = '';
      updateLineNumbers();
      saveToStorage();
      if (communityMode.active) {
        communityMode.active = false;
        saveCommunityState();
        document.getElementById('pane-community').style.display = 'none';
        document.getElementById('pane-code').style.display = 'block';
      }
    });
  }


  // ==========================================
  // Tabs
  // ==========================================
  // ==========================================
  // Holy Grail
  // ==========================================
  var GRAIL_DATA = {
    'Helms': [
      {code:'uap',name:'Shako'},{code:'urn',name:'Crown of Ages'},{code:'ci3',name:"Griffon's Eye"},
      {code:'ci2',name:"Kira's Guardian"},{code:'ulm',name:'Steel Shade'},{code:'xh9',name:'Vampire Gaze'},
      {code:'uhm',name:'Veil of Steel'},{code:'xsk',name:"Blackhorn's Face"},{code:'xkp',name:'Rockstopper'},
      {code:'xlm',name:'Stealskull'},{code:'xhl',name:'Darksight Helm'},{code:'cap',name:'Biggin\'s Bonnet'},
      {code:'skp',name:'Tarnhelm'},{code:'hlm',name:'Coif of Glory'},{code:'fhl',name:'Duskdeep'},
      {code:'ghm',name:'Howltusk'},{code:'xap',name:'Peasant Crown'},{code:'bhm',name:'Wormskull'},
      {code:'msk',name:'The Face of Horror'},{code:'cap',name:'Sander\'s Paragon'},
      {code:'xrn',name:'Crown of Thieves'}
    ],
    'Body Armor': [
      {code:'uar',name:"Tyrael's Might"},{code:'uui',name:"Ormus' Robes"},
      {code:'xlt',name:'Guardian Angel'},{code:'utu',name:"Gladiator's Bane"},{code:'uar',name:"Templar's Might"},
      {code:'uul',name:'Steel Carapace'},{code:'xrs',name:"Duriel's Shell"},{code:'xpl',name:"Skullder's Ire"},
      {code:'upl',name:"Arkaine's Valor"},{code:'xui',name:'The Spirit Shroud'},{code:'xea',name:'Skin of the Vipermagi'},
      {code:'xtu',name:'Iron Pelt'},{code:'qui',name:'Greyform'},{code:'lea',name:'Blinkbat\'s Form'},
      {code:'hla',name:'The Centurion'},{code:'stu',name:'Twitchthroe'},{code:'rng',name:'Darkglow'},
      {code:'chn',name:'Sparking Mail'},{code:'brs',name:'Venom Ward'},{code:'spl',name:'Iceblink'},
      {code:'aar',name:'Silks of the Victor'},{code:'ltp',name:'Heavenly Garb'},{code:'ful',name:'Goldskin'}
    ],
    'Shields': [
      {code:'uit',name:'Stormshield'},{code:'xsh',name:'Lidless Wall'},{code:'ush',name:"Head Hunter's Glory"},
      {code:'pa9',name:'Herald of Zakarum'},{code:'pac',name:'Alma Negra'},
      {code:'buc',name:'Pelta Lunata'},{code:'sml',name:'Umbral Disk'},{code:'lrg',name:'Stormguild'},
      {code:'spk',name:'Swordback Hold'},{code:'kit',name:'Steelclash'},{code:'tow',name:'Bverrit Keep'},
      {code:'gts',name:'The Ward'},{code:'xpk',name:'Lance Guard'},{code:'xit',name:'Tiamat\'s Rebuke'},
      {code:'upk',name:'Spike Thorn'}
    ],
    'Gloves': [
      {code:'uhg',name:'Steelrend'},{code:'uvg',name:"Dracul's Grasp"},{code:'ulg',name:'Laying of Hands'},
      {code:'xmg',name:"Trang-Oul's Claws"},{code:'xmg',name:'Ghoulhide'},
      {code:'lgl',name:'The Hand of Broc'},{code:'vgl',name:'Bloodfist'},{code:'mgl',name:'Chance Guards'},
      {code:'tgl',name:'Magefist'},{code:'hgl',name:'Frostburn'}
    ],
    'Boots': [
      {code:'uhb',name:'Shadow Dancer'},{code:'xhb',name:'Gore Rider'},{code:'uvb',name:'Sandstorm Trek'},
      {code:'xtb',name:'War Traveler'},{code:'umb',name:'Marrowwalk'},{code:'xvb',name:'Waterwalk'},
      {code:'xlb',name:'Infernostride'},{code:'xmb',name:'Silkweave'},{code:'lbt',name:'Hotspur'},
      {code:'vbt',name:'Gorefoot'},{code:'mbt',name:'Treads of Cthon'},{code:'hbt',name:'Goblin Toe'},
      {code:'tbt',name:'Tearhaunch'}
    ],
    'Belts': [
      {code:'ulc',name:'Arachnid Mesh'},{code:'umc',name:"Verdungo's Hearty Cord"},
      {code:'zhb',name:"Thundergod's Vigor"},
      {code:'zlb',name:'String of Ears'},{code:'zvb',name:'Razortail'},
      {code:'zmb',name:'Gloom\'s Trap'},{code:'lbl',name:'Lenymo'},{code:'vbl',name:'Snakecord'},
      {code:'mbl',name:'Nightsmoke'},{code:'tbl',name:'Goldwrap'},{code:'hbl',name:'Bladebuckle'}
    ],
    'Weapons - Swords': [
      {code:'7b7',name:'Doombringer'},{code:'7ba',name:'Ethereal Edge'},{code:'7gd',name:'The Grandfather'},
      {code:'7sp',name:'Demon Limb'},{code:'7gs',name:'Flamebellow'},{code:'9bs',name:'Headstriker'},
      {code:'7cr',name:'Lightsabre'},{code:'7cr',name:'Azurewrath'}
    ],
    'Weapons - Axes & Maces': [
      {code:'7wa',name:'Death Cleaver'},{code:'7m7',name:'Windhammer'},{code:'7mp',name:'Cranebeak'},
      {code:'7fl',name:'Stormlash'},{code:'7fl',name:"Horizon's Tornado"},{code:'7mt',name:"Baranar's Star"},
      {code:'7gm',name:'Earth Shifter'},{code:'7gm',name:'The Cranium Basher'}
    ],
    'Weapons - Polearms & Spears': [
      {code:'7pa',name:'Tomb Reaver'},{code:'7ws',name:"Astreon's Iron Ward"},
      {code:'7br',name:'Viperfork'}
    ],
    'Weapons - Bows & Crossbows': [
      {code:'6lw',name:'Windforce'},{code:'am7',name:"Lycander's Aim"},{code:'6l7',name:'Eaglehorn'},
      {code:'7ts',name:"Gargoyle's Bite"},{code:'8hx',name:'Buriza-Do Kyanon'}
    ],
    'Weapons - Staves & Wands': [
      {code:'6ws',name:"Mang Song's Lesson"},{code:'obf',name:"Death's Fathom"},
      {code:'oba',name:'The Oculus'},{code:'6cs',name:'Ondal\'s Wisdom'}
    ],
    'Weapons - Throwing': [
      {code:'7b8',name:'Lacerator'},{code:'7bk',name:'Warshrike'},{code:'7ta',name:'Gimmershred'},
      {code:'ama',name:"Titan's Revenge"},{code:'amf',name:'Thunderstroke'}
    ],
    'Class Items - Amazon': [
      {code:'ama',name:"Titan's Revenge"},{code:'am7',name:"Lycander's Aim"},
      {code:'am9',name:"Lycander's Flank"}
    ],
    'Class Items - Sorceress': [
      {code:'oba',name:'The Oculus'},{code:'obf',name:"Death's Fathom"},
      {code:'6ws',name:"Mang Song's Lesson"}
    ],
    'Class Items - Necromancer': [
      {code:'nea',name:'Homunculus'},{code:'nee',name:'Boneflame'},{code:'nef',name:'Darkforce Spawn'}
    ],
    'Class Items - Paladin': [
      {code:'pa9',name:'Herald of Zakarum'},{code:'pac',name:'Alma Negra'},
      {code:'paf',name:"Griswold's Honor"}
    ],
    'Class Items - Barbarian': [
      {code:'baa',name:"Arreat's Face"},{code:'xh9',name:'Vampire Gaze'},
      {code:'drb',name:"Cerebus' Bite"}
    ],
    'Class Items - Druid': [
      {code:'drd',name:'Spirit Keeper'},{code:'drb',name:"Cerebus' Bite"},
      {code:'dra',name:"Jalal's Mane"},{code:'dre',name:'Ravenlore'},{code:'bac',name:'Wolfhowl'}
    ],
    'Class Items - Assassin': [
      {code:'9tw',name:"Bartuc's Cut-Throat"},{code:'7lw',name:"Firelizard's Talons"},
      {code:'7wb',name:'Jade Talon'}
    ],
    'Jewelry': [
      {code:'rin',name:'The Stone of Jordan'},{code:'rin',name:'Bul-Kathos\' Wedding Band'},
      {code:'rin',name:'Wisp Projector'},{code:'rin',name:'Raven Frost'},
      {code:'rin',name:'Dwarf Star'},{code:'rin',name:'Nature\'s Peace'},
      {code:'amu',name:"Mara's Kaleidoscope"},{code:'amu',name:'The Cat\'s Eye'},
      {code:'amu',name:"Highlord's Wrath"},{code:'amu',name:'Atma\'s Scarab'},
      {code:'amu',name:'The Rising Sun'},{code:'amu',name:'Seraph\'s Hymn'},
      {code:'amu',name:'Metalgrid'},{code:'amu',name:'Crescent Moon'},
      {code:'amu',name:'Nokozan Relic'},{code:'amu',name:'The Eye of Etlich'},
      {code:'amu',name:'Saracen\'s Chance'},{code:'amu',name:'The Mahim-Oak Curio'},
      {code:'jew',name:'Rainbow Facet'}
    ],
    'Charms': [
      {code:'cm3',name:"Gheed's Fortune"},{code:'cm2',name:'Hellfire Torch'},
      {code:'cm1',name:'Annihilus'}
    ]
  };

  function initGrail() {
    var grailList = document.getElementById('grail-list');
    var grailSearch = document.getElementById('grail-search');
    var grailProgress = document.getElementById('grail-progress');
    var btnGenerate = document.getElementById('btn-grail-generate');
    var btnUpdate = document.getElementById('btn-grail-update');
    var btnReset = document.getElementById('btn-grail-reset');

    // Load found items from localStorage
    var found = {};
    try { found = JSON.parse(localStorage.getItem('filterforge-grail') || '{}'); } catch (e) {}

    var totalItems = 0;
    Object.keys(GRAIL_DATA).forEach(function (cat) { totalItems += GRAIL_DATA[cat].length; });

    function saveGrail() {
      try {
        localStorage.setItem('filterforge-grail', JSON.stringify(found));
      } catch (e) {}
    }

    function countFound() {
      return Object.keys(found).filter(function (k) { return found[k]; }).length;
    }

    function updateProgress() {
      grailProgress.textContent = countFound() + ' / ' + totalItems + ' found';
    }

    function renderGrail(filter) {
      grailList.innerHTML = '';
      var filterLower = (filter || '').toLowerCase();

      Object.keys(GRAIL_DATA).forEach(function (category) {
        var items = GRAIL_DATA[category];
        var filtered = items.filter(function (item) {
          return !filterLower || item.name.toLowerCase().indexOf(filterLower) !== -1;
        });
        if (filtered.length === 0) return;

        var catDiv = document.createElement('div');
        catDiv.className = 'grail-category';

        var header = document.createElement('div');
        header.className = 'grail-category-header';
        header.textContent = category + ' (' + filtered.filter(function (it) { return found[category + ':' + it.name]; }).length + '/' + filtered.length + ')';
        catDiv.appendChild(header);

        var itemsDiv = document.createElement('div');
        itemsDiv.className = 'grail-items';

        filtered.forEach(function (item) {
          var key = category + ':' + item.name;
          var el = document.createElement('label');
          el.className = 'grail-item' + (found[key] ? ' found' : '');
          el.innerHTML = '<span class="grail-check">' + (found[key] ? '&#9745;' : '&#9744;') + '</span> ' + item.name;
          el.addEventListener('click', function () {
            found[key] = !found[key];
            saveGrail();
            el.className = 'grail-item' + (found[key] ? ' found' : '');
            el.querySelector('.grail-check').innerHTML = found[key] ? '&#9745;' : '&#9744;';
            updateProgress();
            header.textContent = category + ' (' + filtered.filter(function (it) { return found[category + ':' + it.name]; }).length + '/' + filtered.length + ')';
          });
          itemsDiv.appendChild(el);
        });

        catDiv.appendChild(itemsDiv);
        grailList.appendChild(catDiv);
      });

      updateProgress();
    }

    grailSearch.addEventListener('input', function () {
      renderGrail(grailSearch.value);
    });

    btnReset.addEventListener('click', function () {
      if (confirm('Reset all Holy Grail progress? This cannot be undone.')) {
        found = {};
        saveGrail();
        renderGrail(grailSearch.value);
      }
    });

    function getGrailStyle() {
      return {
        color: document.getElementById('grail-color').value,
        prefix: document.getElementById('grail-prefix').value,
        suffix: document.getElementById('grail-suffix').value,
        notify: document.getElementById('grail-notify').value,
        sound: document.getElementById('grail-sound').value
      };
    }

    function buildGrailLine(itemName, itemCode, style) {
      return 'ItemDisplay[UNI !ID ' + itemCode + ']: ' + style.color + style.prefix + itemName + style.suffix + style.notify + style.sound;
    }

    function buildGrailLines() {
      var style = getGrailStyle();
      var lines = [];
      lines.push('// ============================================================');
      lines.push('// HOLY GRAIL — Highlight unfound uniques');
      lines.push('// ============================================================');
      Object.keys(GRAIL_DATA).forEach(function (category) {
        GRAIL_DATA[category].forEach(function (item) {
          var key = category + ':' + item.name;
          if (!found[key]) {
            lines.push(buildGrailLine(item.name, item.code, style));
          }
        });
      });
      lines.push('// ============================================================');
      lines.push('// END HOLY GRAIL');
      lines.push('// ============================================================');
      return lines;
    }

    function updateGrailPreview() {
      var style = getGrailStyle();
      var example = buildGrailLine("Mang Song's Lesson", '6ws', style);
      var previewEl = document.getElementById('grail-style-preview');
      // Render colored preview
      var colorMap = {'%PURPLE%':'#a000c8','%RED%':'#ff4040','%ORANGE%':'#ff8000','%YELLOW%':'#ffff40','%GREEN%':'#00c000','%BLUE%':'#6464ff','%GOLD%':'#c8a040','%WHITE%':'#ffffff','%TEAL%':'#008080'};
      var displayColor = colorMap[style.color] || '#a000c8';
      var displayText = style.prefix + "Mang Song's Lesson" + style.suffix;
      previewEl.innerHTML = '<span style="color:' + displayColor + '">' + displayText.replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</span>';
      previewEl.title = example;
    }

    function removeGrailSection(code) {
      var startMarker = '// HOLY GRAIL';
      var endMarker = '// END HOLY GRAIL';
      var grailStart = code.indexOf(startMarker);
      if (grailStart === -1) return code;
      var lineStart = code.lastIndexOf('\n', grailStart);
      if (lineStart === -1) lineStart = 0;
      var endIdx = code.indexOf(endMarker, grailStart);
      if (endIdx === -1) return code;
      var lineEnd = code.indexOf('\n', endIdx);
      if (lineEnd === -1) lineEnd = code.length;
      // Also remove the closing === line after END HOLY GRAIL
      var nextLine = code.indexOf('\n', lineEnd + 1);
      if (nextLine !== -1 && code.substring(lineEnd + 1, nextLine).trim().indexOf('// ====') === 0) {
        lineEnd = nextLine;
      }
      return code.substring(0, lineStart) + code.substring(lineEnd);
    }

    function switchToCodeTab() {
      document.querySelectorAll('.editor-tab').forEach(function (t) { t.classList.remove('active'); });
      document.querySelector('[data-tab="code"]').classList.add('active');
      if (communityMode.active) {
        document.getElementById('pane-community').style.display = 'block';
        document.getElementById('pane-code').style.display = 'none';
      } else {
        document.getElementById('pane-code').style.display = 'block';
      }
      document.getElementById('pane-preview').style.display = 'none';
      document.getElementById('pane-grail').style.display = 'none';
      document.getElementById('pane-allitems').style.display = 'none';
    }

    function afterGrailInsert() {
      if (communityMode.active) {
        updateCommunityGrailSection();
        highlightCommunityTA('community-grail-text');
        codeEditor.value = getFullFilterText();
        updateLineNumbers();
        saveCommunityState();
      } else {
        updateLineNumbers();
        saveToStorage();
      }
    }

    btnGenerate.addEventListener('click', function () {
      var lines = buildGrailLines();
      if (lines.length <= 4) {
        alert('All items found! No grail rules needed.');
        return;
      }

      switchToCodeTab();
      if (communityMode.active) {
        // In community mode, grail goes into its own read-only section
        document.getElementById('community-grail-text').value = lines.join('\n');
      } else {
        var currentCode = removeGrailSection(codeEditor.value);
        codeEditor.value = lines.join('\n') + '\n' + currentCode;
      }
      afterGrailInsert();
    });

    btnUpdate.addEventListener('click', function () {
      if (communityMode.active) {
        // In community mode, just regenerate the grail section
        var grailTA = document.getElementById('community-grail-text');
        if (!grailTA.value.trim()) {
          alert('No grail section found. Use "Insert Grail Rules" first.');
          return;
        }
        var lines = buildGrailLines();
        switchToCodeTab();
        grailTA.value = lines.join('\n');
        afterGrailInsert();
      } else {
        var currentCode = codeEditor.value;
        if (currentCode.indexOf('// HOLY GRAIL') === -1) {
          alert('No grail section found in the filter. Use "Insert Grail Rules" first.');
          return;
        }
        var lines = buildGrailLines();
        switchToCodeTab();
        var cleaned = removeGrailSection(currentCode);
        codeEditor.value = lines.join('\n') + '\n' + cleaned;
        afterGrailInsert();
      }
    });

    // Wire style options to live preview
    ['grail-color','grail-prefix','grail-suffix','grail-notify','grail-sound'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', updateGrailPreview);
    });

    renderGrail('');
    updateGrailPreview();
  }

  function initTabs() {
    document.querySelectorAll('.editor-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = tab.getAttribute('data-tab');
        document.querySelectorAll('.editor-tab').forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');

        if (communityMode.active) {
          document.getElementById('pane-community').style.display = target === 'code' ? 'block' : 'none';
          document.getElementById('pane-code').style.display = 'none';
        } else {
          document.getElementById('pane-community').style.display = 'none';
          document.getElementById('pane-code').style.display = target === 'code' ? 'block' : 'none';
        }
        document.getElementById('pane-preview').style.display = target === 'preview' ? 'flex' : 'none';
        document.getElementById('pane-grail').style.display = target === 'grail' ? 'block' : 'none';
        document.getElementById('pane-allitems').style.display = target === 'allitems' ? 'block' : 'none';

        // Auto-run preview test when switching to Live Preview
        if (target === 'preview') {
          testAllItems();
        }
        if (target === 'allitems' && initAllItems.render) {
          ALL_ITEMS_CACHE = null; // Force rebuild to pick up any item data changes
          initAllItems.render();
        }
      });
    });
  }

  // ==========================================
  // Preview / Rule testing
  // ==========================================
  // Go to a specific line in the editor
  function goToLine(lineNum) {
    // Switch to code tab
    document.querySelectorAll('.editor-tab').forEach(function (t) { t.classList.remove('active'); });
    document.querySelector('[data-tab="code"]').classList.add('active');
    document.getElementById('pane-preview').style.display = 'none';
    document.getElementById('pane-grail').style.display = 'none';
    document.getElementById('pane-allitems').style.display = 'none';

    if (communityMode.active) {
      // Navigate within community mode
      document.getElementById('pane-community').style.display = 'block';
      document.getElementById('pane-code').style.display = 'none';

      var topText = document.getElementById('community-top-block').value;
      var midText = document.getElementById('community-filter-text').value;
      var topLines = topText ? topText.split('\n').length : 0;
      var midLines = midText ? midText.split('\n').length : 0;

      var targetTextarea, localLine;
      if (topText.trim() && lineNum <= topLines) {
        // Line is in top block
        targetTextarea = document.getElementById('community-top-block');
        localLine = lineNum;
      } else if (lineNum <= topLines + midLines) {
        // Line is in community filter (read-only)
        targetTextarea = document.getElementById('community-filter-text');
        localLine = lineNum - (topText.trim() ? topLines : 0);
        // Expand the community filter if collapsed
        var midWrap = document.getElementById('community-mid-wrap');
        if (midWrap.style.display === 'none') {
          midWrap.style.display = '';
          highlightCommunityTA('community-filter-text');
          document.getElementById('btn-community-toggle').textContent = 'Hide';
        }
      } else {
        // Line is in bottom block
        targetTextarea = document.getElementById('community-bottom-block');
        localLine = lineNum - (topText.trim() ? topLines : 0) - midLines;
      }

      // Select the line in the target textarea
      var lines = targetTextarea.value.split('\n');
      var pos = 0;
      for (var i = 0; i < Math.min(localLine - 1, lines.length); i++) {
        pos += lines[i].length + 1;
      }
      var lineEnd = pos + (lines[localLine - 1] || '').length;
      targetTextarea.setSelectionRange(pos, lineEnd);
      targetTextarea.focus();

      // Scroll into view
      var container = targetTextarea.parentElement;
      var lh = parseFloat(getComputedStyle(targetTextarea).lineHeight) || 18;
      var scrollTarget = (localLine - 1) * lh - container.clientHeight / 3;
      container.scrollTop = Math.max(0, scrollTarget);

      // Also scroll the page to the textarea
      targetTextarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    document.getElementById('pane-code').style.display = 'block';

    var text = codeEditor.value;
    var lines = text.split('\n');
    var pos = 0;
    for (var i = 0; i < Math.min(lineNum - 1, lines.length); i++) {
      pos += lines[i].length + 1;
    }
    var lineEnd = pos + (lines[lineNum - 1] || '').length;

    // Select the line in the textarea
    codeEditor.setSelectionRange(pos, lineEnd);
    codeEditor.focus();

    // Scroll the page to the target line (editor is full-length, page scrolls)
    var lh = getLineHeight();
    var editorTop = codeEditor.getBoundingClientRect().top + window.scrollY;
    var lineOffset = (lineNum - 1) * lh;
    var targetY = editorTop + lineOffset - (window.innerHeight / 3);
    window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
  }

  function initPreview() {
    var btnTest = document.getElementById('btn-test-rule');
    var itemSelect = document.getElementById('preview-item-type');
    var filtlvlSelect = document.getElementById('preview-filtlvl');

    btnTest.addEventListener('click', function () {
      testAllItems();
    });

    // Re-test on item or filter level change
    itemSelect.addEventListener('change', function () {
      testAllItems();
    });

    if (filtlvlSelect) {
      filtlvlSelect.addEventListener('change', function () {
        testAllItems();
      });
    }

    // Delegated click handler for go-to-line buttons
    previewResults.addEventListener('click', function (e) {
      var btn = e.target.closest('.btn-goto-line');
      if (btn) {
        var line = parseInt(btn.getAttribute('data-line'), 10);
        if (line) goToLine(line);
      }
    });

    // Custom tooltip for preview code elements
    var tooltip = document.getElementById('preview-tooltip');
    previewResults.addEventListener('mouseover', function (e) {
      var code = e.target.closest('code[data-fulltext]');
      if (!code) return;
      var text = code.getAttribute('data-fulltext');
      if (!text) return;
      tooltip.textContent = text;
      tooltip.classList.add('visible');
    });
    previewResults.addEventListener('mousemove', function (e) {
      if (!tooltip.classList.contains('visible')) return;
      var x = e.clientX + 12;
      var y = e.clientY + 12;
      // Keep tooltip on screen
      var rect = tooltip.getBoundingClientRect();
      if (x + rect.width > window.innerWidth - 8) x = e.clientX - rect.width - 12;
      if (y + rect.height > window.innerHeight - 8) y = e.clientY - rect.height - 12;
      tooltip.style.left = x + 'px';
      tooltip.style.top = y + 'px';
    });
    previewResults.addEventListener('mouseout', function (e) {
      var code = e.target.closest('code[data-fulltext]');
      if (!code) return;
      tooltip.classList.remove('visible');
    });
  }

  function testAllItems() {
    var text = typeof getFullFilterText === 'function' ? getFullFilterText() : codeEditor.value;
    var previewFLSelect = document.getElementById('preview-filtlvl');
    var previewFLName = document.getElementById('preview-filtlvl-name');
    if (previewFLSelect && previewFLName) {
      populateFilterLevelDropdown(previewFLSelect, previewFLName, text);
    }
    var lines = text.split('\n');
    var rules = parseRules(lines);
    var selectedKey = document.getElementById('preview-item-type').value;

    // Test the selected item + a few related ones
    var itemKeys = [selectedKey];
    // Add all items for a comprehensive view
    Object.keys(PREVIEW_ITEMS).forEach(function (k) {
      if (k !== selectedKey) itemKeys.push(k);
    });

    var html = '';
    itemKeys.forEach(function (key) {
      var item = PREVIEW_ITEMS[key];
      var result = matchItem(item, rules);
      html += renderPreviewItem(item, result, key === selectedKey);
    });

    if (!rules.length) {
      html = '<p class="text-muted text-center">No rules found in the editor. Write some rules or use the wizard to get started.</p>';
    }

    previewResults.innerHTML = html;
  }

  function parseRules(lines) {
    // First pass: collect Alias[] definitions
    var aliases = {};
    for (var a = 0; a < lines.length; a++) {
      var al = lines[a].trim();
      var aliasMatch = al.match(/^Alias\s*\[([^\]]+)\]\s*:\s*(.*)/);
      if (aliasMatch) {
        // Don't trim the value — spaces in alias values are intentional formatting
        aliases[aliasMatch[1].trim()] = aliasMatch[2];
      }
    }

    // Sort alias keys longest-first to prevent "SET" matching inside "SET_TIER3_ITEM"
    var sortedKeys = Object.keys(aliases).sort(function (a, b) { return b.length - a.length; });

    // PD2 aliases are raw find-and-replace at load time. For our preview:
    // - In OUTPUT strings: only expand %KEY% wrapped tokens (safe, no false matches)
    // - In CONDITION strings: expand bare KEY as full find-and-replace (like PD2 does)
    function expandOutput(str) {
      if (!sortedKeys.length) return str;
      var changed = true;
      var iterations = 0;
      while (changed && iterations < 10) {
        changed = false;
        iterations++;
        for (var k = 0; k < sortedKeys.length; k++) {
          var key = sortedKeys[k];
          var wrapped = '%' + key + '%';
          if (str.indexOf(wrapped) !== -1) {
            str = str.split(wrapped).join(aliases[key]);
            changed = true;
          }
        }
      }
      return str;
    }

    function expandConditions(str) {
      if (!sortedKeys.length) return str;
      var changed = true;
      var iterations = 0;
      while (changed && iterations < 10) {
        changed = false;
        iterations++;
        for (var k = 0; k < sortedKeys.length; k++) {
          var key = sortedKeys[k];
          if (str.indexOf(key) !== -1) {
            str = str.split(key).join(aliases[key]);
            changed = true;
          }
        }
      }
      return str;
    }

    // Second pass: collect ItemDisplay rules with aliases expanded
    var rules = [];
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      // Remove inline comments (but not inside the rule)
      var commentIdx = line.indexOf('//');
      if (commentIdx === 0) continue; // full comment line
      if (commentIdx > 0) {
        // Only strip if // is after the colon output
        var colonIdx = line.indexOf(':');
        if (colonIdx >= 0 && commentIdx > colonIdx) {
          line = line.substring(0, commentIdx).trim();
        }
      }

      var match = line.match(/^ItemDisplay\s*\[([^\]]*)\]\s*:\s*(.*)/);
      if (match) {
        var cond = expandConditions(match[1].trim());
        var out = expandOutput(match[2].trim());
        rules.push({
          conditions: cond,
          output: out,
          lineNum: i + 1,
          raw: lines[i].trim()
        });
      }
    }
    return rules;
  }

  function matchItem(item, rules) {
    // PD2 %CONTINUE% semantics (from wiki):
    // - %CONTINUE% stores the current rule's output into %NAME% and continues checking.
    // - %NAME% outside {} = the stored NAME portion (text outside braces)
    // - %NAME% inside {} = the stored DESCRIPTION portion (text inside braces)
    // - Both are tracked separately and resolved contextually.
    // - %CONTINUE% must be outside braces.

    var storedName = item.name; // %NAME% outside {} starts as item's default name
    var storedDesc = '';        // %NAME% inside {} starts empty
    var lastRule = null;
    var anyMatched = false;
    var allMatchedRules = [];

    for (var i = 0; i < rules.length; i++) {
      var rule = rules[i];
      if (evaluateConditions(rule.conditions, item)) {
        var output = rule.output;
        var hasContinue = output.indexOf('%CONTINUE%') !== -1;

        // Remove %CONTINUE% token
        output = output.replace(/%CONTINUE%/g, '');

        // Split into name part and description part
        var namePart = output;
        var descPart = '';
        var braceMatch = output.match(/^([^{]*)\{(.*)\}(.*)$/);
        if (braceMatch) {
          namePart = braceMatch[1] + braceMatch[3]; // text outside braces
          descPart = braceMatch[2]; // text inside braces
        }

        // Resolve %NAME% in each part contextually
        namePart = namePart.replace(/%NAME%/g, storedName);
        descPart = descPart.replace(/%NAME%/g, storedDesc || storedName);

        allMatchedRules.push(rule);

        if (hasContinue) {
          // Store for next rule
          storedName = namePart;
          storedDesc = descPart;
          lastRule = rule;
          anyMatched = true;
          continue;
        }

        // Final match — reconstruct full output for display
        var finalOutput = namePart;
        if (descPart) {
          finalOutput = namePart + '{' + descPart + '}';
        }
        return {
          matched: true,
          rule: rule,
          hidden: finalOutput === '' || !namePart.replace(/%[A-Z_0-9-]+%/g, '').trim(),
          output: finalOutput,
          continued: anyMatched,
          allRules: allMatchedRules
        };
      }
    }

    // Only %CONTINUE% rules matched, no terminal rule
    if (anyMatched) {
      var finalOut = storedName;
      if (storedDesc) finalOut = storedName + '{' + storedDesc + '}';
      var nameVisible = storedName.replace(/%[A-Z_0-9-]+%/g, '').trim();
      return { matched: true, rule: lastRule, hidden: !nameVisible, output: finalOut, continued: true, allRules: allMatchedRules };
    }
    return { matched: false, hidden: false, output: '', rule: null, allRules: [] };
  }

  function evaluateConditions(condStr, item) {
    if (!condStr.trim()) return true; // empty = match all

    // Simple evaluator: split by spaces, each token is AND
    // Handle basic flags, item codes, and value conditions
    var tokens = tokenize(condStr);
    return evaluateTokens(tokens, item);
  }

  function tokenize(condStr) {
    // Split on whitespace, but keep parenthesized groups together
    var tokens = [];
    var current = '';
    var depth = 0;
    for (var i = 0; i < condStr.length; i++) {
      var ch = condStr[i];
      if (ch === '(') {
        depth++;
        current += ch;
      } else if (ch === ')') {
        depth--;
        current += ch;
      } else if (ch === ' ' && depth === 0) {
        if (current) tokens.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
    if (current) tokens.push(current);
    return tokens;
  }

  function evaluateTokens(tokens, item) {
    // Handle OR groups in parentheses
    // Simple AND evaluation for now
    var i = 0;
    while (i < tokens.length) {
      var token = tokens[i];

      // Skip explicit AND keyword (implicit in PD2 — conditions are AND by default)
      if (token === 'AND') { i++; continue; }

      // Check for OR group: (A OR B OR C)
      if (token.charAt(0) === '(' && token.charAt(token.length - 1) === ')') {
        var inner = token.substring(1, token.length - 1);
        var orParts = inner.split(/\s+OR\s+/);
        var anyMatch = false;
        for (var j = 0; j < orParts.length; j++) {
          if (evaluateToken(orParts[j].trim(), item)) {
            anyMatch = true;
            break;
          }
        }
        if (!anyMatch) return false;
      }
      // Check for OR keyword (look ahead)
      else if (i + 2 < tokens.length && tokens[i + 1] === 'OR') {
        // Collect all OR terms
        var orTerms = [token];
        while (i + 2 < tokens.length && tokens[i + 1] === 'OR') {
          orTerms.push(tokens[i + 2]);
          i += 2;
        }
        var orMatch = false;
        for (var k = 0; k < orTerms.length; k++) {
          if (evaluateToken(orTerms[k], item)) {
            orMatch = true;
            break;
          }
        }
        if (!orMatch) return false;
      }
      else {
        if (!evaluateToken(token, item)) return false;
      }
      i++;
    }
    return true;
  }

  function evaluateToken(token, item) {
    if (!token) return true;

    // NOT
    if (token.charAt(0) === '!') {
      return !evaluateToken(token.substring(1), item);
    }

    // Parenthesized group
    if (token.charAt(0) === '(' && token.charAt(token.length - 1) === ')') {
      var inner = token.substring(1, token.length - 1);
      var orParts = inner.split(/\s+OR\s+/);
      for (var j = 0; j < orParts.length; j++) {
        if (evaluateToken(orParts[j].trim(), item)) return true;
      }
      return false;
    }

    // FILTLVL — use value from preview selector (must be checked BEFORE generic value conditions)
    if (token.indexOf('FILTLVL') === 0) {
      var flSelect = document.getElementById('preview-filtlvl');
      var currentFL = flSelect ? parseInt(flSelect.value, 10) : 1;
      var flMatch = token.match(/FILTLVL([<>=~])(.+)/);
      if (flMatch) {
        var flOp = flMatch[1];
        var flValStr = flMatch[2];
        if (flOp === '~') {
          var flParts = flValStr.split('-');
          return currentFL >= parseInt(flParts[0], 10) && currentFL <= parseInt(flParts[1], 10);
        }
        var flVal = parseInt(flValStr, 10);
        if (flOp === '>') return currentFL > flVal;
        if (flOp === '<') return currentFL < flVal;
        if (flOp === '=') return currentFL === flVal;
      }
      return true;
    }

    // DIFF — treat as Hell (2) in preview
    if (token.indexOf('DIFF') === 0) {
      var diffMatch = token.match(/DIFF([<>=])(\d+)/);
      if (diffMatch) {
        var diffOp = diffMatch[1];
        var diffVal = parseInt(diffMatch[2], 10);
        if (diffOp === '>') return 2 > diffVal;
        if (diffOp === '<') return 2 < diffVal;
        if (diffOp === '=') return 2 === diffVal;
      }
      return true;
    }

    // CLVL — treat as 85 in preview
    if (token.indexOf('CLVL') === 0) {
      var clMatch = token.match(/CLVL([<>=])(\d+)/);
      if (clMatch) {
        var clOp = clMatch[1];
        var clVal = parseInt(clMatch[2], 10);
        if (clOp === '>') return 85 > clVal;
        if (clOp === '<') return 85 < clVal;
        if (clOp === '=') return 85 === clVal;
      }
      return true;
    }

    // Inline formula condition: $f(...) — cannot evaluate in preview, assume true
    if (token.indexOf('$f(') !== -1) return true;

    // Formula reference condition: FORMULAA>5, FORMULA_B=1, etc. — cannot evaluate in preview
    if (/^FORMULA[A-Z_0-9]+/.test(token)) return true;

    // Value condition: CODE<val, CODE>val, CODE=val, CODE~min-max
    var valueMatch = token.match(/^([A-Z0-9]+)([<>=~])(.+)$/);
    if (valueMatch) {
      var code = valueMatch[1];
      var op = valueMatch[2];
      var valStr = valueMatch[3];
      if (code === 'SOCK') code = 'SOCKETS';
      var itemVal = (item.values && item.values[code] !== undefined) ? item.values[code] : 0;

      // GOLD conditions only match gold piles (items with code 'gold')
      if (code === 'GOLD' && item.code !== 'gold') return false;
      // RUNE conditions only match actual runes (items with RUNE value > 0)
      if (code === 'RUNE' && (!item.values || !item.values.RUNE)) return false;
      // GEM/GEMLEVEL conditions only match gems
      if ((code === 'GEM' || code === 'GEMLEVEL') && (!item.values || !item.values.GEM)) return false;
      // MAPTIER only match maps
      if (code === 'MAPTIER' && (!item.values || !item.values.MAPTIER)) return false;

      if (op === '~') {
        var parts = valStr.split('-');
        var min = parseInt(parts[0], 10);
        var max = parseInt(parts[1], 10);
        return itemVal >= min && itemVal <= max;
      }

      var val = parseInt(valStr, 10);
      if (op === '>') return itemVal > val;
      if (op === '<') return itemVal < val;
      if (op === '=') return itemVal === val;
      return false;
    }

    // Boolean flag
    if (item.flags && item.flags.indexOf(token) !== -1) return true;

    // Preview rune samples use stackable codes (r30s), but site examples often use r30.
    // Treat both forms as equivalent so exact rune-code rules preview correctly.
    var tokenCode = token.toLowerCase();
    var itemCode = item.code.toLowerCase();
    if (tokenCode === itemCode) return true;
    if (item.values && item.values.RUNE > 0) {
      var shortRuneCode = itemCode.replace(/s$/, '');
      if (tokenCode === shortRuneCode || tokenCode === shortRuneCode + 's') return true;
    }

    // GOLD special
    if (token === 'GOLD' && item.values && item.values.GOLD > 0) return true;

    return false;
  }

  function renderPreviewItem(item, result, isSelected) {
    var cssClass = 'preview-item';

    if (!result.matched) {
      cssClass += ' preview-item-default';
    } else if (result.hidden) {
      cssClass += ' preview-item-hidden';
    } else {
      cssClass += ' preview-item-shown';
    }
    if (isSelected) {
      cssClass += ' selected';
    }

    // Default rarity color for items before filter applies
    var rarityColor = '#ffffff';
    if (item.flags.indexOf('UNI') !== -1) rarityColor = '#c8a040'; // gold
    else if (item.flags.indexOf('SET') !== -1) rarityColor = '#00c000'; // green
    else if (item.flags.indexOf('RARE') !== -1) rarityColor = '#ffff40'; // yellow
    else if (item.flags.indexOf('CRAFT') !== -1) rarityColor = '#ff8000'; // orange
    else if (item.flags.indexOf('MAG') !== -1) rarityColor = '#6464ff'; // blue
    else if (item.values && item.values.RUNE > 0) rarityColor = '#ff8000'; // orange for runes
    else if (item.flags.indexOf('NMAG') !== -1) rarityColor = '#ffffff'; // white
    // PD2 special item base colors
    if (item.code === 'wss' || item.code === 'cwss') rarityColor = '#ff4040'; // red for Worldstone Shard
    else if (item.code === 'lbox' || item.code === 'lpp') rarityColor = '#c8a040'; // gold for Puzzlebox/Puzzlepiece

    var displayName;
    if (result.matched && result.output) {
      displayName = renderOutput(result.output, item);
    } else {
      displayName = '<span style="color:' + rarityColor + '">' + escapeHtml(item.name) + '</span>';
    }

    // Build item info tag
    var rarity = '';
    if (item.flags.indexOf('UNI') !== -1) rarity = 'Unique';
    else if (item.flags.indexOf('SET') !== -1) rarity = 'Set';
    else if (item.flags.indexOf('RARE') !== -1) rarity = 'Rare';
    else if (item.flags.indexOf('CRAFT') !== -1) rarity = 'Crafted';
    else if (item.flags.indexOf('MAG') !== -1) rarity = 'Magic';
    else if (item.flags.indexOf('NMAG') !== -1) rarity = 'Normal';
    if (item.flags.indexOf('ETH') !== -1) rarity = 'Eth ' + rarity;
    if (item.flags.indexOf('SUP') !== -1) rarity = 'Sup ' + rarity;
    if (item.flags.indexOf('INF') !== -1) rarity = 'Inf ' + rarity;
    var itemType = '';
    var typeFlags = ['HELM','CHEST','SHIELD','GLOVES','BOOTS','BELT','CIRC','AXE','MACE','SWORD','DAGGER','SPEAR','POLEARM','BOW','XBOW','STAFF','WAND','SCEPTER','JAV','THROWING','JEWELRY','CHARM','QUIVER','MISC'];
    for (var tf = 0; tf < typeFlags.length; tf++) {
      if (item.flags.indexOf(typeFlags[tf]) !== -1) { itemType = typeFlags[tf]; break; }
    }
    var infoTag = '<span class="preview-item-info">' + escapeHtml(item.name) + ' <code>' + item.code + '</code>';
    if (rarity) infoTag += ' <span class="preview-rarity">' + rarity + '</span>';
    if (itemType) infoTag += ' <span class="preview-type">' + itemType + '</span>';
    // Show key values
    var vals = [];
    if (item.values.RUNE) vals.push('RUNE=' + item.values.RUNE);
    if (item.values.GEM) vals.push('GEM=' + item.values.GEM);
    if (item.values.GOLD) vals.push('GOLD=' + item.values.GOLD);
    if (item.values.SOCKETS) vals.push('SOCK=' + item.values.SOCKETS);
    if (item.values.ILVL) vals.push('iLvl=' + item.values.ILVL);
    if (item.values.DEF) vals.push('DEF=' + item.values.DEF);
    if (item.values.MAPTIER) vals.push('T' + item.values.MAPTIER);
    if (vals.length) infoTag += ' <span class="preview-vals">' + vals.join(' ') + '</span>';
    infoTag += '</span>';

    var html = '<div class="' + cssClass + '"' + (isSelected ? ' style="border-width:2px;"' : '') + '>';
    html += '<div class="preview-item-name">' + displayName + '</div>';
    html += infoTag;

    if (!result.matched) {
      html += '<div class="preview-item-rule">No matching rule — shown with default name</div>';
    } else if (result.hidden) {
      html += '<div class="preview-item-rule">HIDDEN by line ' + result.rule.lineNum;
      html += ' <button class="btn-goto-line" data-line="' + result.rule.lineNum + '">Go to line &rarr;</button>';
      html += '</div>';
    } else if (result.allRules && result.allRules.length > 1) {
      // %CONTINUE% chain — show computed result + each contributing rule
      html += '<div class="preview-chain">';
      // Effective computed output
      html += '<div class="preview-chain-rule chain-result">';
      html += '<span class="chain-effective">computed</span> ';
      html += '<code data-fulltext="' + escapeHtml(result.output) + '">' + escapeHtml(truncateRule(result.output, 100)) + '</code>';
      html += '</div>';
      // Each rule in the chain
      for (var ri = 0; ri < result.allRules.length; ri++) {
        var r = result.allRules[ri];
        var isLast = (ri === result.allRules.length - 1);
        var label = isLast ? '<span class="chain-terminal">terminal</span>' : '<span class="chain-continue">%CONTINUE%</span>';
        html += '<div class="preview-chain-rule">';
        html += '<span class="chain-line">L' + r.lineNum + '</span> ';
        html += label + ' ';
        html += '<code data-fulltext="' + escapeHtml(r.raw) + '">' + escapeHtml(truncateRule(r.raw, 70)) + '</code> ';
        html += '<button class="btn-goto-line" data-line="' + r.lineNum + '">&rarr;</button>';
        html += '</div>';
      }
      html += '</div>';
    } else {
      html += '<div class="preview-item-rule">Matched line ' + result.rule.lineNum;
      html += ' — <code data-fulltext="' + escapeHtml(result.rule.raw) + '">' + escapeHtml(truncateRule(result.rule.raw, 90)) + '</code>';
      html += ' <button class="btn-goto-line" data-line="' + result.rule.lineNum + '">Go to line &rarr;</button>';
      html += '</div>';
    }

    html += '</div>';
    return html;
  }

  function truncateRule(str, max) {
    if (str.length <= max) return str;
    return str.substring(0, max) + '...';
  }

  function renderOutput(output, item) {
    var text = output;
    // %NAME% is resolved by matchItem during %CONTINUE% processing
    // Only replace if there are still unresolved %NAME% tokens (non-CONTINUE rules)
    if (text.indexOf('%NAME%') !== -1) {
      text = text.replace(/%NAME%/g, item.name);
    }
    text = text.replace(/%RUNENAME%/g, RUNE_NAMES[item.values.RUNE] || '');
    text = text.replace(/%RUNENUM%/g, item.values.RUNE || '');
    var GEM_TYPE_NAMES = ['', 'Amethyst', 'Diamond', 'Emerald', 'Ruby', 'Sapphire', 'Topaz', 'Skull'];
    text = text.replace(/%GEMTYPE%/g, GEM_TYPE_NAMES[item.values.GEMTYPE] || '');
    text = text.replace(/%GEMLEVEL%/g, item.values.GEMLEVEL || '0');
    text = text.replace(/%ILVL%/g, item.values.ILVL || '');
    text = text.replace(/%ALVL%/g, item.values.ALVL || '');
    text = text.replace(/%CRAFTALVL%/g, item.values.CRAFTALVL || '');
    text = text.replace(/%REROLLALVL%/g, item.values.REROLLALVL || '');
    text = text.replace(/%SOCKETS%/g, item.values.SOCKETS || '0');
    text = text.replace(/%SOCK%/g, item.values.SOCKETS || '0');
    text = text.replace(/%MAXSOCKETS%/g, item.values.MAXSOCKETS || '0');
    text = text.replace(/%DEF%/g, item.values.DEF || '0');
    text = text.replace(/%ED%/g, item.values.ED || '0');
    text = text.replace(/%EDEF%/g, item.values.EDEF || item.values.ED || '0');
    text = text.replace(/%EDAM%/g, item.values.EDAM || item.values.ED || '0');
    text = text.replace(/%RES%/g, item.values.RES || '0');
    text = text.replace(/%PRICE%/g, item.values.PRICE || '0');
    text = text.replace(/%SELLPRICE%/g, item.values.SELLPRICE || '0');
    text = text.replace(/%QTY%/g, item.values.QTY || '0');
    text = text.replace(/%MAPTIER%/g, item.values.MAPTIER || '0');
    text = text.replace(/%BASENAME%/g, item.name);
    text = text.replace(/%LVLREQ%/g, item.values.LVLREQ || '0');
    // New BH keys — dimensions, upgrade reqs, current reqs, base damage, etc.
    text = text.replace(/%WIDTH%/g, item.values.WIDTH || '0');
    text = text.replace(/%HEIGHT%/g, item.values.HEIGHT || '0');
    text = text.replace(/%AREA%/g, item.values.AREA || '0');
    text = text.replace(/%UPDEX%/g, item.values.UPDEX || '0');
    text = text.replace(/%UPSTR%/g, item.values.UPSTR || '0');
    text = text.replace(/%UPLVL%/g, item.values.UPLVL || '0');
    text = text.replace(/%MAXRES%/g, item.values.MAXRES || '0');
    text = text.replace(/%ALLATTRIB%/g, item.values.ALLATTRIB || '0');
    text = text.replace(/%BASEBLOCK%/g, item.values.BASEBLOCK || '0');
    text = text.replace(/%REQLVL%/g, item.values.REQLVL || '0');
    text = text.replace(/%REQSTR%/g, item.values.REQSTR || '0');
    text = text.replace(/%REQDEX%/g, item.values.REQDEX || '0');
    text = text.replace(/%BASEMINONEH%/g, item.values.BASEMINONEH || '0');
    text = text.replace(/%BASEMAXONEH%/g, item.values.BASEMAXONEH || '0');
    text = text.replace(/%BASEMINTWOH%/g, item.values.BASEMINTWOH || '0');
    text = text.replace(/%BASEMAXTWOH%/g, item.values.BASEMAXTWOH || '0');
    text = text.replace(/%BASEMINSMITE%/g, item.values.BASEMINSMITE || '0');
    text = text.replace(/%BASEMAXSMITE%/g, item.values.BASEMAXSMITE || '0');
    text = text.replace(/%BASEMINTHROW%/g, item.values.BASEMINTHROW || '0');
    text = text.replace(/%BASEMAXTHROW%/g, item.values.BASEMAXTHROW || '0');
    text = text.replace(/%BASEMINKICK%/g, item.values.BASEMINKICK || '0');
    text = text.replace(/%BASEMAXKICK%/g, item.values.BASEMAXKICK || '0');
    // Formula references — show 0 in preview (real values computed by BH client)
    text = text.replace(/%FORMULA[A-Z_0-9]+%/g, '0');
    // Inline $f(...) formulas — show 0 in preview (real values computed by BH client)
    text = text.replace(/\$f\((?:[^()]*|\([^()]*\))*\)/g, '0');
    // Generic STAT### tokens — show 0 for unknown
    text = text.replace(/%STAT\d+%/g, '0');
    text = text.replace(/%CLSK\d+%/g, '0');
    text = text.replace(/%TABSK\d+%/g, '0');
    text = text.replace(/%SK\d+%/g, '0');

    // Remove notification and special tokens for display
    text = text.replace(/%(?:BORDER|MAP|DOT|PX)(?:-[0-9A-Fa-f]{1,2})?%/g, '');
    text = text.replace(/%SOUNDID-\d+%/g, '');
    text = text.replace(/%SOUND_\d+%/g, '');
    text = text.replace(/%NOTIFY[^%]*%/g, '');
    text = text.replace(/%CONTINUE%/g, '');
    text = text.replace(/%TIER-\d+%/g, '');
    text = text.replace(/%NL%/g, ' | ');
    text = text.replace(/%CL%/g, ' | ');
    text = text.replace(/%CS%/g, ' ');
    text = text.replace(/%CODE%/g, item.code || '');
    text = text.replace(/%RANGE%/g, '0');
    text = text.replace(/%WPNSPD%/g, '0');
    text = text.replace(/%MULTI[^%]*%/g, '0');
    // Unknown %TOKEN% patterns are handled by the char-by-char color parser (skipped silently)

    // Convert ÿcX color codes (Kassahi/ANSI format) to %COLOR% format
    var yColorMap = {
      '\xFF\x63\x30':'%WHITE%', '\xFF\x63\x31':'%RED%', '\xFF\x63\x32':'%GREEN%',
      '\xFF\x63\x33':'%BLUE%', '\xFF\x63\x34':'%GOLD%', '\xFF\x63\x35':'%GRAY%',
      '\xFF\x63\x36':'%BLACK%', '\xFF\x63\x37':'%TAN%', '\xFF\x63\x38':'%ORANGE%',
      '\xFF\x63\x39':'%YELLOW%', '\xFF\x63\x3A':'%DARK_GREEN%', '\xFF\x63\x3B':'%PURPLE%',
      '\xFF\x63\x2E':'%TEAL%', '\xFF\x63\x2C':'%SAGE%', '\xFF\x63\x2D':'%CORAL%',
      '\xFF\x63\x2F':'%LIGHT_GRAY%'
    };
    // Also handle the decoded ÿ character (U+00FF) when loaded as Latin-1
    text = text.replace(/\u00FFc(.)/g, function (m, code) {
      var lookup = {
        '0':'%WHITE%','1':'%RED%','2':'%GREEN%','3':'%BLUE%','4':'%GOLD%',
        '5':'%GRAY%','6':'%BLACK%','7':'%TAN%','8':'%ORANGE%','9':'%YELLOW%',
        ':':'%DARK_GREEN%',';':'%PURPLE%','.':'%TEAL%',',':'%SAGE%',
        '-':'%CORAL%','/':'%LIGHT_GRAY%','<':'%LIGHT_GRAY%'
      };
      return lookup[code] || '';
    });

    // Remove descriptions {} for inline display
    text = text.replace(/\{[^}]*\}/g, '');

    // Convert colors to spans — start with item's rarity color
    var rarityColor = '#ffffff'; // default white
    if (item.flags.indexOf('UNI') !== -1) rarityColor = '#c8a040';
    else if (item.flags.indexOf('SET') !== -1) rarityColor = '#00c000';
    else if (item.flags.indexOf('RARE') !== -1) rarityColor = '#ffff40';
    else if (item.flags.indexOf('CRAFT') !== -1) rarityColor = '#ff8000';
    else if (item.flags.indexOf('MAG') !== -1) rarityColor = '#6464ff';
    else if (item.values && item.values.RUNE > 0) rarityColor = '#ff8000';
    else if (item.flags.indexOf('NMAG') !== -1) rarityColor = '#ffffff';
    // PD2 special item base colors
    if (item.code === 'wss' || item.code === 'cwss') rarityColor = '#ff4040'; // red for Worldstone Shard
    else if (item.code === 'lbox' || item.code === 'lpp') rarityColor = '#c8a040'; // gold for Puzzlebox/Puzzlepiece
    var currentColor = rarityColor;
    var result = '';
    // Split by color tokens — but also handle adjacent tokens carefully
    // Process character by character to avoid regex split issues
    var ci = 0;
    while (ci < text.length) {
      // Check if current position starts a %COLOR% token
      if (text.charAt(ci) === '%') {
        var endPct = text.indexOf('%', ci + 1);
        if (endPct !== -1) {
          var token = text.substring(ci, endPct + 1);
          if (D2_COLORS[token]) {
            currentColor = D2_COLORS[token];
            ci = endPct + 1;
            continue;
          }
          // Unknown %TOKEN% — skip it
          if (/^%[A-Z_0-9]+%$/.test(token)) {
            ci = endPct + 1;
            continue;
          }
        }
        // Orphan % — skip it
        ci++;
        continue;
      }
      // Collect text until next % or end
      var textStart = ci;
      while (ci < text.length && text.charAt(ci) !== '%') ci++;
      var chunk = text.substring(textStart, ci);
      if (chunk) {
        result += '<span style="color:' + currentColor + '">' + escapeHtml(chunk) + '</span>';
      }
    }

    return result || escapeHtml(item.name);
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ==========================================
  // Local storage persistence
  // ==========================================
  var STORAGE_KEY = 'filterforge-editor-content';

  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, codeEditor.value);
    } catch (e) { /* ignore */ }
  }

  function loadFromStorage() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        codeEditor.value = saved;
      }
    } catch (e) { /* ignore */ }
  }


  // ==========================================
  // Community Edit Mode
  // ==========================================
  var COMMUNITY_STORAGE_KEY = 'filterforge-community-mode';
  var communityMode = {
    active: false,
    filterName: '',
    authorName: '',
    fileUrl: '',
    filterText: '',
    topBlock: '',
    bottomBlock: '',
    grailText: ''
  };

  function getFullFilterText() {
    if (communityMode.active) {
      var top = document.getElementById('community-top-block').value;
      var grail = document.getElementById('community-grail-text').value;
      var mid = document.getElementById('community-filter-text').value;
      var bot = document.getElementById('community-bottom-block').value;
      var parts = [];
      if (top.trim()) parts.push(top);
      if (grail.trim()) parts.push(grail);
      if (mid.trim()) parts.push(mid);
      if (bot.trim()) parts.push(bot);
      return parts.join('\n');
    }
    return codeEditor.value;
  }

  function updateCommunityGrailSection() {
    var grailText = document.getElementById('community-grail-text').value;
    var section = document.getElementById('community-grail-section');
    var countEl = document.getElementById('community-grail-count');
    if (grailText.trim()) {
      section.style.display = '';
      var lc = grailText.split('\n').length;
      countEl.textContent = lc + ' lines (read-only)';
    } else {
      section.style.display = 'none';
    }
  }

  function saveCommunityState() {
    try {
      if (communityMode.active) {
        communityMode.topBlock = document.getElementById('community-top-block').value;
        communityMode.bottomBlock = document.getElementById('community-bottom-block').value;
        communityMode.filterText = document.getElementById('community-filter-text').value;
        communityMode.grailText = document.getElementById('community-grail-text').value;
        localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(communityMode));
        localStorage.setItem(STORAGE_KEY, getFullFilterText());
      } else {
        localStorage.removeItem(COMMUNITY_STORAGE_KEY);
      }
    } catch (e) { /* ignore */ }
  }

  function loadCommunityState() {
    try {
      var saved = localStorage.getItem(COMMUNITY_STORAGE_KEY);
      if (saved) {
        var state = JSON.parse(saved);
        if (state && state.active) {
          communityMode = state;
          enterCommunityMode(state.filterText, state.filterName, state.authorName, state.fileUrl, true);
          return true;
        }
      }
    } catch (e) { /* ignore */ }
    return false;
  }

  function enterCommunityMode(filterText, filterName, authorName, fileUrl, isRestore) {
    communityMode.active = true;
    communityMode.filterName = filterName;
    communityMode.authorName = authorName;
    communityMode.fileUrl = fileUrl;
    communityMode.filterText = filterText;

    document.getElementById('community-filter-name').textContent = filterName + ' by ' + authorName;
    document.getElementById('community-filter-text').value = filterText;
    var lc = filterText.split('\n').length;
    document.getElementById('community-line-count').textContent = lc + ' lines (read-only)';

    if (isRestore) {
      document.getElementById('community-top-block').value = communityMode.topBlock || '';
      document.getElementById('community-bottom-block').value = communityMode.bottomBlock || '';
    } else {
      document.getElementById('community-top-block').value = '';
      document.getElementById('community-bottom-block').value = '';
    }

    // Restore grail section if present
    var grailText = isRestore ? (communityMode.grailText || '') : '';
    document.getElementById('community-grail-text').value = grailText;
    updateCommunityGrailSection();

    // Community filter starts collapsed (user clicks Show to expand)
    document.getElementById('community-mid-wrap').style.display = 'none';
    document.getElementById('btn-community-toggle').textContent = 'Show';

    document.getElementById('pane-code').style.display = 'none';
    document.getElementById('pane-community').style.display = 'block';
    document.getElementById('pane-preview').style.display = 'none';
    var grailPane = document.getElementById('pane-grail');
    if (grailPane) grailPane.style.display = 'none';

    document.querySelectorAll('.editor-tab').forEach(function (t) { t.classList.remove('active'); });
    document.querySelector('[data-tab="code"]').classList.add('active');

    codeEditor.value = getFullFilterText();
    updateLineNumbers();
    highlightAllCommunityTAs();

    if (!isRestore) {
      saveCommunityState();
    }
  }

  function exitCommunityMode() {
    codeEditor.value = getFullFilterText();
    communityMode.active = false;

    document.getElementById('pane-community').style.display = 'none';
    document.getElementById('pane-code').style.display = 'block';

    updateLineNumbers();
    highlightCode();
    saveToStorage();
    saveCommunityState();
  }

  function refreshCommunityFilter() {
    if (!communityMode.fileUrl) return;
    var el = document.getElementById('community-line-count');
    el.textContent = 'Refreshing...';

    fetch(communityMode.fileUrl)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.arrayBuffer();
      })
      .then(function (buf) {
        var text = new TextDecoder('utf-8').decode(buf);
        if (text.indexOf('\uFFFD') !== -1) {
          text = new TextDecoder('windows-1252').decode(buf);
        }
        communityMode.filterText = text;
        document.getElementById('community-filter-text').value = text;
        var lc = text.split('\n').length;
        el.textContent = lc + ' lines (read-only) \u2014 updated!';
        codeEditor.value = getFullFilterText();
        updateLineNumbers();
        highlightCommunityTA('community-filter-text');
        saveCommunityState();
        setTimeout(function () { el.textContent = lc + ' lines (read-only)'; }, 3000);
      })
      .catch(function () {
        el.textContent = 'Failed to refresh. Try again later.';
        setTimeout(function () {
          var lc = communityMode.filterText.split('\n').length;
          el.textContent = lc + ' lines (read-only)';
        }, 3000);
      });
  }

  function initCommunityMode() {
    var btnRefresh = document.getElementById('btn-community-refresh');
    var btnExit = document.getElementById('btn-community-exit');
    var btnToggle = document.getElementById('btn-community-toggle');
    var topBlock = document.getElementById('community-top-block');
    var bottomBlock = document.getElementById('community-bottom-block');
    var midWrap = document.getElementById('community-mid-wrap');
    var grailWrap = document.getElementById('community-grail-wrap');
    var btnGrailToggle = document.getElementById('btn-community-grail-toggle');

    if (!btnRefresh) return;

    btnRefresh.addEventListener('click', refreshCommunityFilter);

    btnGrailToggle.addEventListener('click', function () {
      var isHidden = grailWrap.style.display === 'none';
      grailWrap.style.display = isHidden ? '' : 'none';
      btnGrailToggle.textContent = isHidden ? 'Hide' : 'Show';
      if (isHidden) highlightCommunityTA('community-grail-text');
    });

    btnExit.addEventListener('click', function () {
      if (!confirm('Switch to Full Editor?\n\nYour top block, community filter, and bottom block will be merged into one editable document. You can always re-import the community filter later.')) return;
      exitCommunityMode();
    });

    btnToggle.addEventListener('click', function () {
      var isHidden = midWrap.style.display === 'none';
      midWrap.style.display = isHidden ? '' : 'none';
      btnToggle.textContent = isHidden ? 'Hide' : 'Show';
      if (isHidden) highlightCommunityTA('community-filter-text');
    });

    var saveDebounce = null;
    function onBlockInput() {
      highlightCommunityTA(this.id);
      codeEditor.value = getFullFilterText();
      updateLineNumbers();
      clearTimeout(saveDebounce);
      saveDebounce = setTimeout(function () {
        saveCommunityState();
      }, 500);
    }

    topBlock.addEventListener('input', onBlockInput);
    bottomBlock.addEventListener('input', onBlockInput);
  }

  // ==========================================
  // Builder action buttons
  // ==========================================
  function initBuilderActions() {
    document.getElementById('btn-insert-top').addEventListener('click', insertRuleAtTop);
    document.getElementById('btn-insert-rule').addEventListener('click', insertRule);
    document.getElementById('btn-insert-end').addEventListener('click', insertRuleAtEnd);

    document.getElementById('btn-clear-builder').addEventListener('click', function () {
      // Reset all chips
      document.querySelectorAll('.chip.active').forEach(function (c) { c.classList.remove('active'); });
      document.querySelectorAll('.color-chip.active').forEach(function (c) { c.classList.remove('active'); });

      // Reset defaults
      var showChip = document.querySelector('[data-field="action"] [data-value="show"]');
      var nameChip = document.querySelector('[data-field="nameDisplay"] [data-value="%NAME%"]');
      var noneNotify = document.querySelector('[data-field="notify"] [data-value=""]');
      var noContinue = document.querySelector('[data-field="continueKw"] [data-value=""]');
      var noMap = document.querySelector('[data-field="mapIcon"] [data-value=""]');
      if (showChip) showChip.classList.add('active');
      if (nameChip) nameChip.classList.add('active');
      if (noneNotify) noneNotify.classList.add('active');
      if (noContinue) noContinue.classList.add('active');
      if (noMap) noMap.classList.add('active');

      // Reset state
      builderState.quality = '';
      builderState.tier = [];
      builderState.properties = [];
      builderState.itemcat = [];
      builderState.equipment = '';
      builderState.weapons = '';
      builderState.misc = '';
      builderState.classitems = '';
      builderState.location = [];
      builderState.negate = [];
      builderState.action = 'show';
      builderState.nameDisplay = '%NAME%';
      builderState.color = '';
      builderState.mapIcon = '';
      builderState.notify = '';
      builderState.continueKw = '';

      // Reset inputs
      document.getElementById('item-code-input').value = '';
      document.getElementById('custom-name-input').value = '';
      document.getElementById('custom-name-input').style.display = 'none';
      document.getElementById('prepend-text').value = '';
      document.getElementById('append-text').value = '';
      document.getElementById('map-icon-color').value = '';
      document.getElementById('sound-select').value = '';
      document.getElementById('description-input').value = '';
      document.getElementById('output-options').style.display = 'block';

      // Reset value conditions
      var vcContainer = document.getElementById('value-conditions');
      var rows = vcContainer.querySelectorAll('.value-row');
      for (var i = rows.length - 1; i > 0; i--) {
        rows[i].remove();
      }
      if (rows[0]) {
        rows[0].querySelector('.value-code').value = '';
        rows[0].querySelector('.value-val').value = '';
      }

      // Reset skill conditions
      var skContainer = document.getElementById('skill-conditions');
      var skRows = skContainer.querySelectorAll('.skill-row');
      for (var si = skRows.length - 1; si > 0; si--) {
        skRows[si].remove();
      }
      if (skRows[0]) {
        skRows[0].querySelector('.skill-class').value = '';
        skRows[0].querySelector('.skill-name').innerHTML = '<option value="">-- Skill --</option>';
        skRows[0].querySelector('.skill-name').disabled = true;
        skRows[0].querySelector('.skill-op').value = '=';
        skRows[0].querySelector('.skill-level').value = '1';
      }
      var addSkillBtn = document.getElementById('btn-add-skill');
      if (addSkillBtn) addSkillBtn.style.display = '';

      generatedCode.textContent = 'Use the Rule Builder to generate a rule';
      generatedCode.classList.add('empty-state');
    });
  }

  // ==========================================
  // Build My Filter Wizard
  // ==========================================
  function initWizard() {
    var modal = document.getElementById('wizard-modal');
    var btnOpen = document.getElementById('btn-wizard');
    var btnClose = document.getElementById('wizard-modal-close');
    var btnPrev = document.getElementById('wiz-prev');
    var btnNext = document.getElementById('wiz-next');
    var progressBar = document.getElementById('wizard-progress-bar');
    var stepLabel = document.getElementById('wizard-step-label');
    var summaryEl = document.getElementById('wizard-summary');

    var totalSteps = 10;
    var currentStep = 1;
    var choices = {
      'class': [],
      notifications: '',
      colorprofile: '',
      decoration: '',
      extras: [],
      rwbases: '',
      consumables: [],
      tooltips: []
    };

    function openWizard() {
      modal.style.display = 'flex';
      btnNext.disabled = false;
      goToStep(1);
    }

    btnOpen.addEventListener('click', openWizard);
    btnClose.addEventListener('click', function () { modal.style.display = 'none'; });
    modal.addEventListener('click', function (e) { if (e.target === modal) modal.style.display = 'none'; });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.style.display !== 'none') modal.style.display = 'none';
    });

    // Auto-open wizard if ?wizard=true in URL
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('wizard') === 'true') {
      openWizard();
      urlParams.delete('wizard');
      var nextSearch = urlParams.toString();
      history.replaceState(null, '', window.location.pathname + (nextSearch ? '?' + nextSearch : '') + window.location.hash);
    }

    // Wire up option buttons
    document.querySelectorAll('.wizard-options').forEach(function (group) {
      var key = group.getAttribute('data-wiz');
      var multi = group.getAttribute('data-multi') === 'true';

      group.querySelectorAll('.wizard-opt').forEach(function (opt) {
        opt.addEventListener('click', function () {
          var val = opt.getAttribute('data-value');
          if (multi) {
            opt.classList.toggle('selected');
            var selected = [];
            group.querySelectorAll('.wizard-opt.selected').forEach(function (s) {
              selected.push(s.getAttribute('data-value'));
            });
            choices[key] = selected;
          } else {
            group.querySelectorAll('.wizard-opt').forEach(function (o) { o.classList.remove('selected'); });
            opt.classList.add('selected');
            choices[key] = val;
          }
        });
      });
    });

    btnPrev.addEventListener('click', function () {
      if (currentStep > 1) goToStep(currentStep - 1);
    });

    btnNext.addEventListener('click', function () {
      if (currentStep < totalSteps) {
        goToStep(currentStep + 1);
      } else {
        btnNext.disabled = true;
        buildFilter();
      }
    });

    function goToStep(n) {
      currentStep = n;
      for (var i = 1; i <= totalSteps; i++) {
        var el = document.getElementById('wiz-step-' + i);
        if (el) el.style.display = i === n ? 'block' : 'none';
      }
      progressBar.style.width = Math.round((n / totalSteps) * 100) + '%';
      stepLabel.textContent = 'Step ' + n + ' of ' + totalSteps;
      btnPrev.style.visibility = n === 1 ? 'hidden' : 'visible';
      btnNext.textContent = n === totalSteps ? 'Build Filter' : 'Next \u2192';

      if (n === totalSteps) renderSummary();
    }

    function label(key, val) {
      var labels = {
        'all': 'All Classes', amazon: 'Amazon', sorceress: 'Sorceress', necromancer: 'Necromancer',
        paladin: 'Paladin', barbarian: 'Barbarian', druid: 'Druid', assassin: 'Assassin',
        none: 'None', minimal: 'Minimal', standard: 'Standard', full: 'Full', max: 'Maximum',
        'default': 'Default', fire: 'Fire', water: 'Water', earth: 'Earth', rainbow: 'Rainbow', clean: 'Clean',
        arrows: 'Arrows', stars: 'Stars', diamonds: 'Diamonds', pipes: 'Pipes', exclaim: 'Exclaim',
        circles: 'Circles', dots: 'Dots', crosses: 'Crosses', middot: 'Middle Dots',
        sockets: 'Socket Count', ilvl: 'Item Level', price: 'Vendor Price',
        crafting: 'Crafting Info', eth: 'Ethereal Tag', shortnames: 'Short Names', charmshort: 'Charm Short Names', uniquenames: 'Reveal Uniques', staffmods: 'Staffmods', wpnspeed: 'Weapon Speed',
        'all-rw': 'All Good Bases', 'eth-rw': 'Eth Bases Only', 'none-rw': 'None',
        hidegold: 'Hide Low Gold', hidekeys: 'Hide Keys',
        hidescrolls: 'Hide Scrolls', hidepots: 'Hide Small Potions',
        hideallhp: 'Hide ALL HP', hideallmp: 'Hide ALL MP',
        socketrecipe: 'Socket Recipes', sellvalue: 'Sell Value $', upgraderecipe: 'Upgrade Recipes', imbue: 'Imbue/Slam Tips',
        shopping: 'Shopping: Crafting', skillbases: 'Shopping: Skill Bases'
      };
      return labels[val] || val;
    }

    function renderSummary() {
      var rows = [
        { l: 'Class', v: choices['class'].length ? choices['class'].map(function (x) { return label('', x); }).join(', ') : 'None' },
        { l: 'Notifications', v: label('', choices.notifications) || 'None' },
        { l: 'Color Theme', v: label('', choices.colorprofile) || 'Default' },
        { l: 'Decoration', v: label('', choices.decoration) || 'Arrows' },
        { l: 'Extra Info', v: choices.extras.length ? choices.extras.map(function (x) { return label('', x); }).join(', ') : 'None' },
        { l: 'Runeword Bases', v: choices.rwbases ? label('', choices.rwbases + '-rw') : 'None' },
        { l: 'Hide Consumables', v: choices.consumables.length ? choices.consumables.map(function (x) { return label('', x); }).join(', ') : 'None' },
        { l: 'Tooltips', v: choices.tooltips.length ? choices.tooltips.map(function (x) { return label('', x); }).join(', ') : 'None' }
      ];
      summaryEl.innerHTML = rows.map(function (r) {
        return '<div class="wizard-summary-row"><span class="wizard-summary-label">' + r.l + '</span><span class="wizard-summary-value">' + r.v + '</span></div>';
      }).join('');
    }

    // ==============================
    // Filter Generation Engine
    // ==============================
    function buildFilter() {
      var c = choices;
      var lines = [];
      // Always build with strict settings — player controls strictness via in-game FILTLVL
      // Color profile
      var profile = c.colorprofile || 'default';
      var colorHR, colorMidRune, colorLowRune, colorUni, colorSet, colorRare, colorCraft;
      if (profile === 'fire') {
        colorHR = '%RED%'; colorMidRune = '%ORANGE%'; colorLowRune = '%ORANGE%';
        colorUni = '%GOLD%'; colorSet = '%GREEN%'; colorRare = '%YELLOW%'; colorCraft = '%ORANGE%';
      } else if (profile === 'water') {
        colorHR = '%PURPLE%'; colorMidRune = '%BLUE%'; colorLowRune = '%TEAL%';
        colorUni = '%GOLD%'; colorSet = '%GREEN%'; colorRare = '%YELLOW%'; colorCraft = '%ORANGE%';
      } else if (profile === 'earth') {
        colorHR = '%DARK_GREEN%'; colorMidRune = '%TAN%'; colorLowRune = '%TAN%';
        colorUni = '%GOLD%'; colorSet = '%GREEN%'; colorRare = '%YELLOW%'; colorCraft = '%ORANGE%';
      } else if (profile === 'rainbow') {
        colorHR = '%ORANGE%'; colorMidRune = '%PURPLE%'; colorLowRune = '%ORANGE%';
        colorUni = '%GOLD%'; colorSet = '%GREEN%'; colorRare = '%YELLOW%'; colorCraft = '%ORANGE%';
      } else if (profile === 'clean') {
        colorHR = '%ORANGE%'; colorMidRune = '%ORANGE%'; colorLowRune = '%ORANGE%';
        colorUni = '%GOLD%'; colorSet = '%GREEN%'; colorRare = '%YELLOW%'; colorCraft = '%ORANGE%';
      } else {
        // default
        colorHR = '%ORANGE%'; colorMidRune = '%ORANGE%'; colorLowRune = '%DARK_GREEN%';
        colorUni = '%GOLD%'; colorSet = '%GREEN%'; colorRare = '%YELLOW%'; colorCraft = '%ORANGE%';
      }

      // Decoration style
      var deco = c.decoration || 'arrows';
      var decoHR_L, decoHR_R, decoMid_L, decoMid_R, decoLow_L, decoLow_R;
      if (deco === 'stars') {
        decoHR_L = '***** '; decoHR_R = ' *****'; decoMid_L = '*** '; decoMid_R = ' ***'; decoLow_L = '* '; decoLow_R = ' *';
      } else if (deco === 'diamonds') {
        decoHR_L = '<> <> <> '; decoHR_R = ' <> <> <>'; decoMid_L = '<> <> '; decoMid_R = ' <> <>'; decoLow_L = '<> '; decoLow_R = ' <>';
      } else if (deco === 'pipes') {
        decoHR_L = '||| '; decoHR_R = ' |||'; decoMid_L = '|| '; decoMid_R = ' ||'; decoLow_L = '| '; decoLow_R = ' |';
      } else if (deco === 'exclaim') {
        decoHR_L = '!!! '; decoHR_R = ' !!!'; decoMid_L = '!! '; decoMid_R = ' !!'; decoLow_L = '! '; decoLow_R = ' !';
      } else if (deco === 'circles') {
        decoHR_L = 'oOoOo '; decoHR_R = ' oOoOo'; decoMid_L = 'oOo '; decoMid_R = ' oOo'; decoLow_L = 'oO '; decoLow_R = ' Oo';
      } else if (deco === 'dots') {
        decoHR_L = '..... '; decoHR_R = ' .....'; decoMid_L = '... '; decoMid_R = ' ...'; decoLow_L = '.. '; decoLow_R = ' ..';
      } else if (deco === 'crosses') {
        decoHR_L = 'xXxXx '; decoHR_R = ' xXxXx'; decoMid_L = 'xXx '; decoMid_R = ' xXx'; decoLow_L = 'xX '; decoLow_R = ' Xx';
      } else if (deco === 'middot') {
        decoHR_L = '\xB7\xB7\xB7\xB7\xB7 '; decoHR_R = ' \xB7\xB7\xB7\xB7\xB7'; decoMid_L = '\xB7\xB7\xB7 '; decoMid_R = ' \xB7\xB7\xB7'; decoLow_L = '\xB7 '; decoLow_R = ' \xB7';
      } else if (deco === 'none') {
        decoHR_L = ''; decoHR_R = ''; decoMid_L = ''; decoMid_R = ''; decoLow_L = ''; decoLow_R = '';
      } else {
        // arrows (default)
        decoHR_L = '>>> '; decoHR_R = ' <<<'; decoMid_L = '>> '; decoMid_R = ' <<'; decoLow_L = '> '; decoLow_R = ' <';
      }

      // Rainbow: override decorations with color-per-character
      // Left side: R O Y G B P, Right side: P B G Y O R (reversed)
      if (profile === 'rainbow' && deco !== 'none') {
        var rbColors = ['%RED%', '%ORANGE%', '%YELLOW%', '%GREEN%', '%BLUE%', '%PURPLE%'];
        var rbReverse = ['%PURPLE%', '%BLUE%', '%GREEN%', '%YELLOW%', '%ORANGE%', '%RED%'];
        function rainbowText(str, colors) {
          var out = '', ci = 0;
          for (var ri = 0; ri < str.length; ri++) {
            if (str[ri] === ' ') { out += ' '; }
            else { out += colors[ci % colors.length] + str[ri]; ci++; }
          }
          return out;
        }
        decoHR_L = rainbowText(decoHR_L.trim(), rbColors) + ' '; decoHR_R = ' ' + rainbowText(decoHR_R.trim(), rbReverse);
        decoMid_L = rainbowText(decoMid_L.trim(), rbColors) + ' '; decoMid_R = ' ' + rainbowText(decoMid_R.trim(), rbReverse);
        decoLow_L = decoLow_L ? rainbowText(decoLow_L.trim(), rbColors) + ' ' : '';
        decoLow_R = decoLow_R ? ' ' + rainbowText(decoLow_R.trim(), rbReverse) : '';
        // Decorations have embedded colors. The decoHR_L ends with "char " (last rainbow color + char + space).
        // We don't need colorHR as a prefix — instead embed the name color INTO decoHR_L's trailing space.
        // This avoids %ORANGE%%RED%< adjacent color issue.
        decoHR_L += '%ORANGE%'; decoMid_L += '%PURPLE%'; decoLow_L += decoLow_L ? '%ORANGE%' : '';
        colorHR = ''; colorMidRune = ''; colorLowRune = '';
      }

      // Notification levels: none < minimal < standard < full < max
      var notifyLevel = c.notifications || 'none';
      var wantDots = notifyLevel !== 'none'; // minimal+
      var wantMapIcons = notifyLevel === 'standard' || notifyLevel === 'full' || notifyLevel === 'max';
      var wantSounds = notifyLevel === 'full' || notifyLevel === 'max';
      var wantBigNotify = notifyLevel === 'max';
      var wantSockets = c.extras.indexOf('sockets') !== -1;
      var wantIlvl = c.extras.indexOf('ilvl') !== -1;
      var wantPrice = c.extras.indexOf('price') !== -1;
      var wantCrafting = c.extras.indexOf('crafting') !== -1;
      var wantEthTag = c.extras.indexOf('eth') !== -1;
      var wantShortNames = c.extras.indexOf('shortnames') !== -1;
      var wantCharmShort = c.extras.indexOf('charmshort') !== -1;
      var wantUniqueNames = c.extras.indexOf('uniquenames') !== -1;
      var wantStaffmods = c.extras.indexOf('staffmods') !== -1;
      var wantWpnSpeed = c.extras.indexOf('wpnspeed') !== -1;
      var rwBases = c.rwbases || 'none';
      var wantSocketRecipe = c.tooltips.indexOf('socketrecipe') !== -1;
      var wantSellValue = c.tooltips.indexOf('sellvalue') !== -1;
      var wantUpgradeRecipe = c.tooltips.indexOf('upgraderecipe') !== -1;
      var wantImbue = c.tooltips.indexOf('imbue') !== -1;
      var wantShopping = c.tooltips.indexOf('shopping') !== -1;
      var wantSkillBases = c.tooltips.indexOf('skillbases') !== -1;

      // Class code mapping
      var classMap = {
        amazon: 'ZON', sorceress: 'SOR', necromancer: 'NEC', paladin: 'DIN',
        barbarian: 'BAR', druid: 'DRU', assassin: 'SIN'
      };
      var selectedClasses = (c['class'] || []).map(function (cl) { return classMap[cl]; }).filter(Boolean);
      function hasClass(code) { return selectedClasses.indexOf(code) !== -1; }

      // ---- Notification helpers (escalating by level) ----
      // High runes: border(max) > map(full/std) > dot(min) + sound(full+)
      var hrNotify = (wantBigNotify ? '%BORDER-FF%' : wantMapIcons ? '%MAP-0A%' : wantDots ? '%DOT-0A%' : '') + (wantSounds ? '%SOUNDID-4716%' : '');
      // Mid-high runes: map(std+) > dot(min) + sound(full+)
      var midNotify = (wantMapIcons ? '%MAP-0A%' : wantDots ? '%DOT-0A%' : '') + (wantSounds ? '%SOUNDID-4715%' : '');
      // Mid runes: dot + optional sound
      var midRuneDot = wantDots ? '%DOT-0A%' : '';
      var midRuneNotify = midRuneDot + (wantSounds ? '%SOUNDID-4718%' : '');
      // Low runes: small dot only at minimal+
      var lowRuneDot = wantDots ? '%DOT-60%' : '';
      // Unique notification: border(max) > map(std+) > dot(min)
      var uniNotify = (wantBigNotify ? '%BORDER-62%' : wantMapIcons ? '%MAP-62%' : wantDots ? '%DOT-D3%' : '') + (wantSounds ? '%SOUNDID-4715%' : '');
      // Set notification
      var setNotify = (wantBigNotify ? '%BORDER-84%' : wantMapIcons ? '%MAP-84%' : wantDots ? '%DOT-7D%' : '') + (wantSounds ? '%SOUNDID-4715%' : '');
      // Special PD2 items: map(std+) > dot(min)
      var pd2Notify = wantMapIcons ? '%MAP-68%' : wantDots ? '%DOT-68%' : '';
      var pd2BigNotify = (wantBigNotify ? '%BORDER-62%' : wantMapIcons ? '%MAP-62%' : wantDots ? '%DOT-62%' : '') + (wantSounds ? '%SOUNDID-4716%' : '');
      // Quest items
      var questNotify = wantMapIcons ? '%MAP-58%' : wantDots ? '%DOT-58%' : '';
      // Charm notify
      var charmNotify = wantDots ? '%DOT-97%' : '';
      // Gem notify
      var gemNotify = wantDots ? '%DOT-5B%' : '';
      // RW base notify: map(std+) > dot(min)
      var rwNotify = wantMapIcons ? '%MAP-18%' : wantDots ? '%DOT-18%' : '';

      // ---- Description builder ----
      var descParts = [];
      if (wantIlvl) descParts.push('iLvl: %ILVL%');
      if (wantPrice) descParts.push('Price: %PRICE%');
      var descStr = descParts.length ? '{' + descParts.join('%NL%') + '}' : '';
      var craftDesc = wantCrafting ? '{cALVL: %CRAFTALVL%}' : '';
      var ilvlStr = wantIlvl ? '{iLvl: %ILVL%}' : '';

      // ======================================================================
      //  BUILD FILTER
      // ======================================================================

      lines.push('// ============================================================');
      lines.push('// Filter Forge -- Custom Filter');
      lines.push('// Generated by FilterForge');
      lines.push('// https://maaaaaarrk.github.io/FilterForge/editor.html');
      lines.push('//');
      lines.push('// Class: ' + (selectedClasses.length ? selectedClasses.join(', ') : 'None'));
      lines.push('// Strictness: Controlled by in-game Filter Level (1-4)');
      lines.push('// Notifications: ' + (label('', c.notifications) || 'None'));
      lines.push('// Color Theme: ' + (label('', c.colorprofile) || 'Default'));
      lines.push('// Decoration: ' + (label('', c.decoration) || 'Arrows'));
      lines.push('// Extras: ' + (c.extras.length ? c.extras.map(function (x) { return label('', x); }).join(', ') : 'None'));
      lines.push('// RW Bases: ' + (c.rwbases ? label('', c.rwbases + '-rw') : 'None'));
      lines.push('// Consumables: ' + (c.consumables.length ? c.consumables.map(function (x) { return label('', x); }).join(', ') : 'Default'));
      lines.push('// Tooltips: ' + (c.tooltips.length ? c.tooltips.map(function (x) { return label('', x); }).join(', ') : 'None'));
      lines.push('// ============================================================');
      lines.push('');

      // ==========================
      // 1. FILTER LEVEL NAMES
      // ==========================
      lines.push('// --- Filter Level Names ---');
      lines.push('ItemDisplayFilterName[]: Level 1 - Relaxed');
      lines.push('ItemDisplayFilterName[]: Level 2 - Normal');
      lines.push('ItemDisplayFilterName[]: Level 3 - Strict');
      lines.push('ItemDisplayFilterName[]: Level 4 - Very Strict');
      lines.push('');

      // ==========================
      // 2. ALIASES
      // ==========================
      lines.push('// --- Aliases ---');
      lines.push('Alias[RWBASE]: (NMAG !INF !RW SOCK=0)');
      lines.push('Alias[TOWN]: (MAPID=1 OR MAPID=40 OR MAPID=75 OR MAPID=103 OR MAPID=109)');
      lines.push('Alias[THROWPOTS]: (opm OR gpm OR opl OR ops OR gps OR gpl OR tpfs OR tpgs OR tpcs OR tpls OR tpfm OR tpgm OR tpcm OR tplm OR tpfl OR tpgl OR tpcl OR tpll)');
      lines.push('');

      // ==========================
      // 3. %CONTINUE% CHAINS
      // ==========================
      lines.push('// ============================================================');
      lines.push('// %CONTINUE% CHAINS -- ETH / SOCKET / CORRUPTION DISPLAY');
      lines.push('// ============================================================');
      // Corruption marker (always applied — from Kryszard/HiimFilter pattern)
      lines.push('// Corruption marker');
      lines.push('ItemDisplay[STAT360>0]: %NAME% %RED%[C]%CONTINUE%');
      lines.push('');

      if (wantEthTag || wantSockets) {
        if (wantEthTag && wantSockets) {
          lines.push('// Magic+ items: Eth tag and socket count');
          lines.push('ItemDisplay[(MAG OR UNI OR SET OR RARE OR CRAFT) !RW ETH SOCK>0]: %NAME% %GRAY%[Eth] [%SOCKETS%]%CONTINUE%');
          lines.push('ItemDisplay[(MAG OR UNI OR SET OR RARE OR CRAFT) ETH]: %NAME% %GRAY%[Eth]%CONTINUE%');
          lines.push('ItemDisplay[(MAG OR UNI OR SET OR RARE OR CRAFT) !RW !ETH SOCK>0]: %NAME% [%SOCKETS%]%CONTINUE%');
          lines.push('// Normal items: Eth tag and socket count');
          lines.push('ItemDisplay[NMAG !RW ETH SOCK>0]: %GRAY%%NAME% [Eth] [%SOCKETS%]%CONTINUE%');
          lines.push('ItemDisplay[NMAG ETH]: %GRAY%%NAME% [Eth]%CONTINUE%');
          lines.push('ItemDisplay[NMAG !RW !ETH SOCK>0]: %GRAY%%NAME% [%SOCKETS%]%CONTINUE%');
        } else if (wantEthTag) {
          lines.push('ItemDisplay[(MAG OR UNI OR SET OR RARE OR CRAFT) ETH]: %NAME% %GRAY%[Eth]%CONTINUE%');
          lines.push('ItemDisplay[NMAG ETH]: %GRAY%%NAME% [Eth]%CONTINUE%');
        } else {
          lines.push('ItemDisplay[(MAG OR UNI OR SET OR RARE OR CRAFT) !RW SOCK>0]: %NAME% [%SOCKETS%]%CONTINUE%');
          lines.push('ItemDisplay[NMAG !RW SOCK>0]: %GRAY%%NAME% [%SOCKETS%]%CONTINUE%');
        }
      }
      lines.push('');

      // ==========================
      // 4. QUEST ITEMS
      // ==========================
      lines.push('// ============================================================');
      lines.push('// QUEST ITEMS -- always show');
      lines.push('// ============================================================');
      lines.push('ItemDisplay[bks]: %NAME%' + questNotify);
      lines.push('ItemDisplay[bkd]: %NAME%' + questNotify);
      lines.push('ItemDisplay[leg]: %GOLD%%NAME%' + questNotify);
      lines.push('ItemDisplay[hdm]: %NAME%' + questNotify);
      lines.push('ItemDisplay[ass]: %GOLD%Book of Skill' + questNotify);
      lines.push('ItemDisplay[box]: %NAME%' + questNotify);
      lines.push('ItemDisplay[hst]: %NAME%' + questNotify);
      lines.push('ItemDisplay[vip]: %NAME%' + questNotify);
      lines.push('ItemDisplay[msf]: %NAME%' + questNotify);
      lines.push('ItemDisplay[j34]: %NAME%' + questNotify);
      lines.push('ItemDisplay[g34]: %NAME%' + questNotify);
      lines.push('ItemDisplay[xyz]: %GOLD%Potion of Life' + questNotify);
      lines.push('ItemDisplay[g33]: %NAME%' + questNotify);
      lines.push('ItemDisplay[qey]: %NAME%' + questNotify);
      lines.push('ItemDisplay[qbr]: %NAME%' + questNotify);
      lines.push('ItemDisplay[qhr]: %NAME%' + questNotify);
      lines.push('ItemDisplay[qf1]: %NAME%' + questNotify);
      lines.push('ItemDisplay[qf2]: %NAME%' + questNotify);
      lines.push('ItemDisplay[bbb]: %NAME%' + questNotify);
      lines.push('ItemDisplay[mss]: %NAME%' + questNotify);
      lines.push('ItemDisplay[hfh]: %NAME%' + questNotify);
      lines.push('ItemDisplay[ice]: %GOLD%Malahs Potion' + questNotify);
      lines.push('ItemDisplay[tr2]: %GOLD%Scroll of Resistance' + questNotify);
      lines.push('');

      // ==========================
      // 5. SPECIAL PD2 ITEMS
      // ==========================
      lines.push('// ============================================================');
      lines.push('// SPECIAL PD2 ITEMS');
      lines.push('// ============================================================');

      // Essences
      lines.push('// --- Essences ---');
      lines.push('ItemDisplay[tes]: %ORANGE%%NAME%' + pd2Notify);
      lines.push('ItemDisplay[ceh]: %ORANGE%%NAME%' + pd2Notify);
      lines.push('ItemDisplay[bet]: %ORANGE%%NAME%' + pd2Notify);
      lines.push('ItemDisplay[fed]: %ORANGE%%NAME%' + pd2Notify);

      // Token of Absolution
      lines.push('// --- Token ---');
      lines.push('ItemDisplay[toa]: %ORANGE%Token of Absolution' + pd2Notify);

      // Pandemonium Keys
      lines.push('// --- Pandemonium Keys ---');
      lines.push('ItemDisplay[pk1]: %ORANGE%%NAME%' + pd2Notify);
      lines.push('ItemDisplay[pk2]: %ORANGE%%NAME%' + pd2Notify);
      lines.push('ItemDisplay[pk3]: %ORANGE%%NAME%' + pd2Notify);

      // Pandemonium Organs
      lines.push('// --- Pandemonium Organs ---');
      lines.push('ItemDisplay[mbr]: %ORANGE%%NAME%' + pd2Notify);
      lines.push('ItemDisplay[dhn]: %ORANGE%%NAME%' + pd2Notify);
      lines.push('ItemDisplay[bey]: %ORANGE%%NAME%' + pd2Notify);

      // Uber mini items
      lines.push('// --- Uber / Standard of Heroes ---');
      lines.push('ItemDisplay[ubtm]: %ORANGE%%NAME%' + pd2Notify);
      lines.push('ItemDisplay[std]: %NAME%' + pd2Notify);

      // Worldstone Shard, Puzzlebox, Puzzlepiece
      lines.push('// --- Corruption & Crafting Materials ---');
      lines.push('ItemDisplay[wss]: %PURPLE%+ %RED%Worldstone Shard %PURPLE%+' + pd2BigNotify);
      lines.push('ItemDisplay[lbox]: %PURPLE%+ %GOLD%Larzuks Puzzlebox %PURPLE%+' + pd2BigNotify);
      lines.push('ItemDisplay[lpp]: %PURPLE%+ %GOLD%Larzuks Puzzlepiece %PURPLE%+' + pd2BigNotify);

      // Skeleton Key
      lines.push('// --- Skeleton Key ---');
      lines.push('ItemDisplay[rkey]: %NAME%' + pd2BigNotify);

      // Map-related items
      lines.push('// --- Map Items ---');
      lines.push('ItemDisplay[scou]: %NAME%');
      lines.push('ItemDisplay[scrb]: %NAME%' + pd2BigNotify);
      lines.push('ItemDisplay[iwss]: %NAME%' + pd2BigNotify);

      // DClone items
      lines.push('// --- DClone Items ---');
      lines.push('ItemDisplay[dcho]: %RED%%NAME%' + pd2BigNotify);
      lines.push('ItemDisplay[dcso]: %RED%%NAME%' + pd2BigNotify);
      lines.push('ItemDisplay[dcbl]: %RED%%NAME%' + pd2BigNotify);
      lines.push('ItemDisplay[dcma]: %RED%%NAME%' + pd2BigNotify);

      // Rathma items
      lines.push('// --- Rathma Items ---');
      lines.push('ItemDisplay[rtmo]: %RED%%NAME%' + pd2BigNotify);
      lines.push('ItemDisplay[rtmv]: %RED%%NAME%' + pd2BigNotify);
      lines.push('ItemDisplay[cm2f]: %RED%%NAME%' + pd2BigNotify);
      lines.push('ItemDisplay[rtma]: %RED%%NAME%' + pd2BigNotify);
      lines.push('ItemDisplay[cwss]: %RED%%NAME%' + pd2BigNotify);
      lines.push('ItemDisplay[rid]: %NAME%' + pd2BigNotify);
      lines.push('ItemDisplay[rtp]: %NAME%' + pd2BigNotify);

      // Uber boss items
      lines.push('// --- Uber Boss Items ---');
      lines.push('ItemDisplay[lucb OR lucc OR lucd]: %NAME%' + pd2BigNotify);
      lines.push('ItemDisplay[luca]: %NAME%');
      lines.push('ItemDisplay[ubaa]: %NAME%');
      lines.push('ItemDisplay[ubab]: %NAME%');
      lines.push('ItemDisplay[ubac]: %NAME%');
      lines.push('ItemDisplay[uba]: %NAME%');

      // Craft Infusion Orbs
      lines.push('// --- Craft Infusion Orbs ---');
      lines.push('ItemDisplay[crfb]: %RED%Blood %GOLD%Craft Infusion');
      lines.push('ItemDisplay[crfc]: %PURPLE%Caster %GOLD%Craft Infusion');
      lines.push('ItemDisplay[crfs]: %GREEN%Safety %GOLD%Craft Infusion');
      lines.push('ItemDisplay[crfh]: %BLUE%Hitpower %GOLD%Craft Infusion');
      lines.push('ItemDisplay[crfv]: %GRAY%Vampiric %GOLD%Craft Infusion');
      lines.push('ItemDisplay[crfu]: %YELLOW%Bountiful %GOLD%Craft Infusion');
      lines.push('ItemDisplay[crfp]: %WHITE%Brilliant %GOLD%Craft Infusion');

      // Jewel Fragment
      lines.push('// --- Jewel Fragment ---');
      lines.push('ItemDisplay[jewf]: %NAME%');

      // Ears & misc hidden items
      lines.push('// --- Hidden ---');
      lines.push('ItemDisplay[ear]:')

      // Map Orbs
      lines.push('// --- Map Orbs ---');
      lines.push('ItemDisplay[rera]: %NAME%');
      lines.push('ItemDisplay[imra]: %NAME%');
      lines.push('ItemDisplay[upma]: %NAME%');
      lines.push('ItemDisplay[imma]: %NAME%');
      lines.push('ItemDisplay[rrra]: %NAME%');
      lines.push('ItemDisplay[irra]: %NAME%');
      lines.push('ItemDisplay[urma]: %NAME%');
      lines.push('ItemDisplay[irma]: %NAME%');
      lines.push('ItemDisplay[upmp]: %NAME%');
      lines.push('ItemDisplay[fort]: %NAME%');
      lines.push('');

      // ==========================
      // 5b. MAPS
      // ==========================
      lines.push('// ============================================================');
      lines.push('// MAPS');
      lines.push('// ============================================================');
      lines.push('ItemDisplay[MAPTIER=1]: %DARK_GREEN%[T1] %NAME%');
      lines.push('ItemDisplay[MAPTIER=2]: %TAN%[T2] %NAME%');
      lines.push('ItemDisplay[MAPTIER=3]: %ORANGE%[T3] %NAME%');
      lines.push('ItemDisplay[MAPTIER=4]: %RED%[D] %NAME%');
      lines.push('ItemDisplay[MAPTIER=5]: %ORANGE%[T3] %NAME%');
      // Unique maps (from Wolfie)
      lines.push('ItemDisplay[UNI MAPTIER>0]: %GOLD%%NAME%' + (wantMapIcons ? '%MAP-53%' : ''));
      lines.push('');

      // ==========================
      // 6. RUNES (tiered)
      // ==========================
      lines.push('// ============================================================');
      lines.push('// RUNES');
      lines.push('// ============================================================');

      // Tier 1: High Runes (Lo #28 through Zod #33)
      lines.push('// --- High Runes (Lo - Zod) ---');
      lines.push('ItemDisplay[RUNE~28-33]: ' + colorHR + decoHR_L + '%RUNENAME% Rune' + decoHR_R + ' (#%RUNENUM%)' + hrNotify);

      // Tier 2: Mid-high Runes (Ist #24 through Ohm #27)
      lines.push('// --- Mid-High Runes (Ist - Ohm) ---');
      lines.push('ItemDisplay[RUNE>23 RUNE<28]: ' + colorMidRune + decoMid_L + '%RUNENAME% Rune' + decoMid_R + ' (#%RUNENUM%)' + midNotify);

      // Tier 3: Mid Runes (Lem #20 through Mal #23)
      lines.push('// --- Mid Runes (Lem - Mal) ---');
      lines.push('ItemDisplay[RUNE>19 RUNE<24]: ' + colorMidRune + decoLow_L + '%RUNENAME% Rune' + decoLow_R + ' (#%RUNENUM%)' + midRuneNotify);

      // Tier 4: Low Runes (El #1 through Fal #19)
      lines.push('// --- Low Runes (El - Fal) ---');
      lines.push('ItemDisplay[RUNE>14 RUNE<20]: ' + colorLowRune + '%RUNENAME% Rune (#%RUNENUM%)' + lowRuneDot);
      lines.push('ItemDisplay[RUNE>10 RUNE<15]: %ORANGE%%RUNENAME% (#%RUNENUM%)');
      lines.push('ItemDisplay[RUNE>0 RUNE<11]: %ORANGE%%RUNENAME% (#%RUNENUM%)');
      lines.push('');

      // Rune stacking display (from Wolfie/HiimFilter)
      // Must come after all tier rules so CONTINUE doesn't suppress tier decoration
      lines.push('// --- Rune Stack Display ---');
      lines.push('ItemDisplay[RUNE>0 QTY>1]: %NAME% %TAN%x%QTY%{%NAME%}%CONTINUE%');
      lines.push('');

      // ==========================
      // 7. UNIQUE & SET (tiered)
      // ==========================

      // Reveal unique/set names on unidentified items (must be above display rules)
      if (wantUniqueNames) {
        lines.push('// ============================================================');
        lines.push('// UNIQUE & SET NAME REVEALS');
        lines.push('// ============================================================');
        var uniNames = [
          // Rathma
          ['UNI !ID ram', 'The Third Eye'],
          ['UNI !ID rar', 'Cage of the Unsullied'],
          ['UNI !ID rbe', 'Band of Skulls'],
          // Jewelry
          ['UNI !ID amu', 'Unique Amulet'],
          ['UNI !ID rin', 'Unique Ring'],
          ['UNI !ID jew', 'Rainbow Facet'],
          // Circlets
          ['UNI !ID ci2', 'Kiras Guardian'],
          ['UNI !ID ci3', 'Griffons Eye'],
          // Amazon Bows
          ['UNI !ID am7', 'Lycanders Aim'],
          ['UNI !ID amb', 'Bloodravens Charge'],
          ['UNI !ID amc', 'Ebonbane'],
          // Amazon Javelins
          ['UNI !ID am5', 'True Silver'],
          ['UNI !ID ama', 'Titans Revenge'],
          ['UNI !ID amf', 'Thunderstroke'],
          // Amazon Spears
          ['UNI !ID am9', 'Lycanders Flank'],
          ['UNI !ID amd', 'Stoneraven'],
          ['UNI !ID ame', 'Zeraes Resolve'],
          // Assassin Katars
          ['UNI !ID 9ar', 'Mage Slayer'],
          ['UNI !ID 9tw', 'Bartucs Cut-Throat'],
          ['UNI !ID 7wb', 'Jade Talon'],
          ['UNI !ID 7xf', 'Whispering Mirage'],
          ['UNI !ID 7cs', 'Shadowkiller'],
          ['UNI !ID 7lw', 'Firelizards Talons'],
          ['UNI !ID 7tw', 'Stalkers Cull'],
          ['UNI !ID 7qr', 'Aidans Scar'],
          // Barbarian Helms
          ['UNI !ID ba6', 'Cyclopean Roar'],
          ['UNI !ID ba7', 'Wildspeaker'],
          ['UNI !ID baa', 'Arreats Face'],
          ['UNI !ID bac', 'Wolfhowl'],
          ['UNI !ID bad', 'Demonhorns Edge'],
          ['UNI !ID bae', 'Halaberds Reign'],
          ['UNI !ID baf', 'Raekors Virtue'],
          // Druid Pelts
          ['UNI !ID dr2', 'Quetzalcoatl'],
          ['UNI !ID dr6', 'Fenris'],
          ['UNI !ID dra', 'Jalals Mane'],
          ['UNI !ID drb', 'Cerebus Bite'],
          ['UNI !ID drc', 'Denmother'],
          ['UNI !ID drd', 'Spirit Keeper'],
          ['UNI !ID dre', 'Ravenlore'],
          ['UNI !ID drf', 'Ursas Nightmare'],
          // Necromancer Heads
          ['UNI !ID ne6', 'Kalans Legacy'],
          ['UNI !ID nea', 'Homunculus'],
          ['UNI !ID neg', 'Sacred Totem'],
          ['UNI !ID ned', 'Martyrdom'],
          ['UNI !ID nee', 'Boneflame'],
          ['UNI !ID nef', 'Darkforce Spawn'],
          // Paladin Shields
          ['UNI !ID pa3', 'Sankekurs Fall'],
          ['UNI !ID pa9', 'Herald of Zakarum'],
          ['UNI !ID pac', 'Alma Negra'],
          ['UNI !ID pae', 'Dragonscale'],
          ['UNI !ID paf', 'Skywarden'],
          // Sorceress Orbs
          ['UNI !ID ob6', 'Tempest'],
          ['UNI !ID ob7', 'Skorn'],
          ['UNI !ID oba', 'The Oculus'],
          ['UNI !ID obc', 'Eschutas Temper'],
          ['UNI !ID obf', 'Deaths Fathom'],
          // Normal Armor
          ['UNI !ID qui', 'Greyform'],
          ['UNI !ID lea', 'Blinkbats Form'],
          ['UNI !ID hla', 'The Centurion'],
          ['UNI !ID stu', 'Twitchthroe'],
          ['UNI !ID rng', 'Darkglow'],
          ['UNI !ID scl', 'Hawkmail'],
          ['UNI !ID brs', 'Venom Ward'],
          ['UNI !ID chn', 'Sparking Mail'],
          ['UNI !ID spl', 'Iceblink'],
          ['UNI !ID ltp', 'Heavenly Garb'],
          ['UNI !ID fld', 'Rockfleece'],
          ['UNI !ID plt', 'Boneflesh'],
          ['UNI !ID gth', 'Rattlecage'],
          ['UNI !ID ful', 'Goldskin'],
          ['UNI !ID aar', 'Silks of the Victor'],
          // Exceptional Armor
          ['UNI !ID xui', 'The Spirit Shroud'],
          ['UNI !ID xea', 'Skin of the Vipermagi'],
          ['UNI !ID xla', 'Skin of the Flayed One'],
          ['UNI !ID xtu', 'Iron Pelt'],
          ['UNI !ID xng', 'Spirit Forge'],
          ['UNI !ID xcl', 'Crow Caw'],
          ['UNI !ID xrs', 'Duriels Shell'],
          ['UNI !ID xhn', 'Shaftstop'],
          ['UNI !ID xpl', 'Skullders Ire'],
          ['UNI !ID xtp', 'Que-Hegans Wisdom'],
          ['UNI !ID xld', 'Toothrow'],
          ['UNI !ID xlt', 'Guardian Angel'],
          ['UNI !ID xth', 'Atmas Wail'],
          ['UNI !ID xul', 'Black Hades'],
          ['UNI !ID xar', 'Corpsemourn'],
          // Elite Armor
          ['UNI !ID uui', 'Ormus Robes'],
          ['UNI !ID utu', 'The Gladiators Bane'],
          ['UNI !ID ung', 'Wraithskin'],
          ['UNI !ID uhn', 'Cage of the Unsullied'],
          ['UNI !ID upl', 'Arkaines Valor'],
          ['UNI !ID utp', 'Purgatory'],
          ['UNI !ID uld', 'Leviathan'],
          ['UNI !ID uth', 'Dark Abyss'],
          ['UNI !ID uul', 'Steel Carapace'],
          ['UNI !ID uar !ETH', 'Templars Might'],
          ['UNI !ID uar ETH', 'Tyraels Might'],
          // Normal Belts
          ['UNI !ID lbl', 'Lenymo'],
          ['UNI !ID vbl', 'Snakecord'],
          ['UNI !ID mbl', 'Nightsmoke'],
          ['UNI !ID tbl', 'Goldwrap'],
          ['UNI !ID hbl', 'Bladebuckle'],
          // Exceptional Belts
          ['UNI !ID zlb', 'String of Ears'],
          ['UNI !ID zvb', 'Razortail'],
          ['UNI !ID zmb', 'Glooms Trap'],
          ['UNI !ID ztb', 'Snowclash'],
          ['UNI !ID zhb', 'Thundergods Vigor'],
          // Elite Belts
          ['UNI !ID ulc', 'Arachnid Mesh'],
          ['UNI !ID uvc', 'Nosferatus Coil'],
          ['UNI !ID umc', 'Verdungos Hearty Cord'],
          ['UNI !ID utc', 'Band of Skulls'],
          ['UNI !ID uhc', 'Siggards Staunch'],
          // Normal Boots
          ['UNI !ID lbt', 'Hotspur'],
          ['UNI !ID vbt', 'Gorefoot'],
          ['UNI !ID mbt', 'Treads of Cthon'],
          ['UNI !ID tbt', 'Goblin Toe'],
          ['UNI !ID hbt', 'Tearhaunch'],
          // Exceptional Boots
          ['UNI !ID xlb', 'Infernostride'],
          ['UNI !ID xvb', 'Waterwalk'],
          ['UNI !ID xmb', 'Silkweave'],
          ['UNI !ID xtb', 'War Traveler'],
          ['UNI !ID xhb', 'Gore Rider'],
          // Elite Boots
          ['UNI !ID ulb', 'Mermans Sprocket'],
          ['UNI !ID uvb', 'Sandstorm Trek'],
          ['UNI !ID umb', 'Marrowwalk'],
          ['UNI !ID utb', 'Itheraels Path'],
          ['UNI !ID uhb', 'Shadow Dancer'],
          // Normal Gloves
          ['UNI !ID lgl', 'The Hand of Broc'],
          ['UNI !ID vgl', 'Bloodfist'],
          ['UNI !ID mgl', 'Chance Guards'],
          ['UNI !ID tgl', 'Magefist'],
          ['UNI !ID hgl', 'Frostburn'],
          // Exceptional Gloves
          ['UNI !ID xlg', 'Venom Grip'],
          ['UNI !ID xvg', 'Gravepalm'],
          ['UNI !ID xmg', 'Ghoulhide'],
          ['UNI !ID xtg', 'Lava Gout'],
          ['UNI !ID xhg', 'Hellmouth'],
          // Elite Gloves
          ['UNI !ID ulg', 'Titans Grip'],
          ['UNI !ID uvg', 'Draculs Grasp'],
          ['UNI !ID umg', 'Soul Drainer'],
          ['UNI !ID utg', 'Occultist'],
          ['UNI !ID uhg', 'Steelrend'],
          // Normal Helms
          ['UNI !ID cap', 'Biggins Bonnet'],
          ['UNI !ID skp', 'Tarnhelm'],
          ['UNI !ID hlm', 'Coif of Glory'],
          ['UNI !ID fhl', 'Duskdeep'],
          ['UNI !ID ghm', 'Howltusk'],
          ['UNI !ID msk', 'The Face of Horror'],
          ['UNI !ID crn', 'Undead Crown'],
          ['UNI !ID bhm', 'Wormskull'],
          // Exceptional Helms
          ['UNI !ID xap', 'Peasant Crown'],
          ['UNI !ID xkp', 'Rockstopper'],
          ['UNI !ID xlm', 'Stealskull'],
          ['UNI !ID xhl', 'Darksight Helm'],
          ['UNI !ID xhm', 'Valkyrie Wing'],
          ['UNI !ID xsk', 'Blackhorns Face'],
          ['UNI !ID xrn', 'Crown of Thieves'],
          ['UNI !ID xh9', 'Vampire Gaze'],
          // Elite Helms
          ['UNI !ID uap', 'Shako'],
          ['UNI !ID ulm', 'Steel Shade'],
          ['UNI !ID uhl', 'Overlords Helm'],
          ['UNI !ID uhm', 'Veil of Steel or Nightwings Veil'],
          ['UNI !ID usk', 'Andariels Visage'],
          ['UNI !ID urn', 'Crown of Ages'],
          ['UNI !ID uh9', 'Giant Skull'],
          // Normal Shields
          ['UNI !ID buc', 'Pelta Lunata'],
          ['UNI !ID sml', 'Umbral Disk'],
          ['UNI !ID lrg', 'Stormguild'],
          ['UNI !ID kit', 'Steelclash'],
          ['UNI !ID spk', 'Swordback Hold'],
          ['UNI !ID tow', 'Bverrit Keep'],
          ['UNI !ID bsh', 'Wall of the Eyeless'],
          ['UNI !ID gts', 'The Ward'],
          // Exceptional Shields
          ['UNI !ID xuc', 'Viscerataunt'],
          ['UNI !ID xml', 'Mosers Blessed Circle'],
          ['UNI !ID xrg', 'Stormchaser'],
          ['UNI !ID xpk', 'Lance Guard'],
          ['UNI !ID xit', 'Tiamats Rebuke'],
          ['UNI !ID xsh', 'Lidless Wall'],
          ['UNI !ID xow', 'Gerkes Sanctuary'],
          ['UNI !ID xts', 'Radaments Sphere'],
          // Elite Shields
          ['UNI !ID uml', 'Blackoak Shield'],
          ['UNI !ID urg', 'Twilights Reflection'],
          ['UNI !ID uit', 'Stormshield'],
          ['UNI !ID upk', 'Spike Thorn'],
          ['UNI !ID uow', 'Medusas Gaze'],
          ['UNI !ID ush', 'Head Hunters Glory'],
          ['UNI !ID uts', 'Spirit Ward'],
          // Normal Axes
          ['UNI !ID hax', 'The Gnasher'],
          ['UNI !ID axe', 'Deathspade'],
          ['UNI !ID 2ax', 'Bladebone'],
          ['UNI !ID mpi', 'Skull Splitter'],
          ['UNI !ID wax', 'Rakescar'],
          ['UNI !ID lax', 'Axe of Fechmar'],
          ['UNI !ID bax', 'Goreshovel'],
          ['UNI !ID btx', 'The Chieftain'],
          ['UNI !ID gax', 'Brainhew'],
          ['UNI !ID gix', 'Humongous'],
          // Exceptional Axes
          ['UNI !ID 9ha', 'Coldkill'],
          ['UNI !ID 9ax', 'Butchers Pupil'],
          ['UNI !ID 92a', 'Islestrike'],
          ['UNI !ID 9mp', 'Pompeiis Wrath'],
          ['UNI !ID 9wa', 'Guardian Naga'],
          ['UNI !ID 9la', 'Warlords Trust'],
          ['UNI !ID 9ba', 'Spellsteel'],
          ['UNI !ID 9bt', 'Stormrider'],
          ['UNI !ID 9ga', 'Boneslayer Blade'],
          ['UNI !ID 9gi', 'The Minotaur'],
          // Elite Axes
          ['UNI !ID 7ha', 'Razors Edge'],
          ['UNI !ID 72a', 'Rune Master'],
          ['UNI !ID 7mp', 'Cranebeak'],
          ['UNI !ID 7wa', 'Death Cleaver'],
          ['UNI !ID 7ba', 'Ethereal Edge'],
          ['UNI !ID 7bt', 'Hellslayer'],
          ['UNI !ID 7ga', 'Messerschmidts Reaver'],
          ['UNI !ID 7gi', 'Executioners Justice'],
          // Normal Bows
          ['UNI !ID sbw', 'Pluckeye'],
          ['UNI !ID hbw', 'Witherstring'],
          ['UNI !ID lbw', 'Raven Claw'],
          ['UNI !ID cbw', 'Rogues Bow'],
          ['UNI !ID sbb', 'Stormstrike'],
          ['UNI !ID lbb', 'Wizendraw'],
          ['UNI !ID swb', 'Hellclap'],
          ['UNI !ID lwb', 'Blastbark'],
          // Exceptional Bows
          ['UNI !ID 8sb', 'Skystrike'],
          ['UNI !ID 8hb', 'Riphook'],
          ['UNI !ID 8lb', 'Kuko Shakaku'],
          ['UNI !ID 8cb', 'Endlesshail'],
          ['UNI !ID 8s8', 'Witchwild String'],
          ['UNI !ID 8l8', 'Cliffkiller'],
          ['UNI !ID 8sw', 'Magewrath'],
          ['UNI !ID 8lw', 'Goldstrike Arch'],
          // Elite Bows
          ['UNI !ID 6hb', 'Crackleshot'],
          ['UNI !ID 6l7', 'Eaglehorn'],
          ['UNI !ID 6sw', 'Widowmaker'],
          ['UNI !ID 6lw', 'Windforce'],
          // Normal Crossbows
          ['UNI !ID lxb', 'Leadcrow'],
          ['UNI !ID mxb', 'Ichorsting'],
          ['UNI !ID hxb', 'Hellcast'],
          ['UNI !ID rxb', 'Doomslinger'],
          // Exceptional Crossbows
          ['UNI !ID 8lx', 'Langer Briser'],
          ['UNI !ID 8mx', 'Pus Spitter'],
          ['UNI !ID 8hx', 'Buriza-Do Kyanon'],
          ['UNI !ID 8rx', 'Demon Machine'],
          // Elite Crossbows
          ['UNI !ID 6hx', 'Hellrack'],
          ['UNI !ID 6rx', 'Gut Siphon'],
          // Normal Daggers
          ['UNI !ID dgr', 'Gull'],
          ['UNI !ID dir', 'The Diggler'],
          ['UNI !ID kri', 'The Jade Tan Do'],
          ['UNI !ID bld', 'Spectral Shard'],
          // Exceptional Daggers
          ['UNI !ID 9dg', 'Spineripper'],
          ['UNI !ID 9di', 'Heart Carver'],
          ['UNI !ID 9kr', 'Blackbogs Sharp'],
          ['UNI !ID 9bl', 'Stormspike'],
          // Elite Daggers
          ['UNI !ID 7dg', 'Wizardspike'],
          ['UNI !ID 7di', 'Shatterblade'],
          ['UNI !ID 7kr', 'Fleshripper'],
          ['UNI !ID 7bl', 'Ghostflame'],
          // Elite Javelins
          ['UNI !ID 7s7', 'Demons Arch'],
          ['UNI !ID 7gl', 'Wraith Flight'],
          ['UNI !ID 7ts', 'Gargoyles Bite'],
          // Normal Maces
          ['UNI !ID clb', 'Felloak'],
          ['UNI !ID spc', 'Stoutnail'],
          ['UNI !ID mac', 'Crushflange'],
          ['UNI !ID mst', 'Bloodrise'],
          ['UNI !ID fla', 'The Generals Tan Do Li Ga'],
          ['UNI !ID whm', 'Ironstone'],
          ['UNI !ID mau', 'Bonesnap'],
          ['UNI !ID gma', 'Steeldriver'],
          // Exceptional Maces
          ['UNI !ID 9cl', 'Dark Clan Crusher'],
          ['UNI !ID 9sp', 'Fleshrender'],
          ['UNI !ID 9ma', 'Sureshrill Frost'],
          ['UNI !ID 9mt', 'Moonfall'],
          ['UNI !ID 9fl', 'Baezils Vortex'],
          ['UNI !ID 9wh', 'Earthshaker'],
          ['UNI !ID 9m9', 'Bloodtree Stump'],
          ['UNI !ID 9gm', 'The Gavel of Pain'],
          // Elite Maces
          ['UNI !ID 7cl', 'Nords Tenderizer'],
          ['UNI !ID 7sp', 'Demon Limb'],
          ['UNI !ID 7mt', 'Baranars Star'],
          ['UNI !ID 7fl', 'Horizons Tornado or Stormlash'],
          ['UNI !ID 7wh', 'Stone Crusher or Schaefers Hammer'],
          ['UNI !ID 7m7', 'Windhammer'],
          ['UNI !ID 7gm', 'Earth Shifter or The Cranium Basher'],
          // Normal Polearms
          ['UNI !ID bar', 'Dimoaks Hew'],
          ['UNI !ID vou', 'Steelgoad'],
          ['UNI !ID scy', 'Soul Harvest'],
          ['UNI !ID pax', 'The Battlebranch'],
          ['UNI !ID hal', 'Woestave'],
          ['UNI !ID wsc', 'The Grim Reaper'],
          // Exceptional Polearms
          ['UNI !ID 9b7', 'The Meat Scraper'],
          ['UNI !ID 9vo', 'Blackleach Blade'],
          ['UNI !ID 9s8', 'Athenas Wrath'],
          ['UNI !ID 9pa', 'Pierre Tombale Couant'],
          ['UNI !ID 9h9', 'Husoldal Evo'],
          ['UNI !ID 9wc', 'Grims Burning Dead'],
          // Elite Polearms
          ['UNI !ID 7o7', 'Bonehew'],
          ['UNI !ID 7s8', 'The Reapers Toll'],
          ['UNI !ID 7pa', 'Tomb Reaver'],
          ['UNI !ID 7wc', 'Stormspire'],
          // Normal Scepters
          ['UNI !ID scp', 'Knell Striker'],
          ['UNI !ID gsc', 'Rusthandle'],
          ['UNI !ID wsp', 'Stormeye'],
          // Exceptional Scepters
          ['UNI !ID 9sc', 'Zakarums Hand'],
          ['UNI !ID 9qs', 'The Fetid Sprinkler'],
          ['UNI !ID 9ws', 'Hand of Blessed Light'],
          // Elite Scepters
          ['UNI !ID 7sc', 'Heavens Light or The Redeemer'],
          ['UNI !ID 7qs', 'Akarats Devotion'],
          ['UNI !ID 7ws', 'Astreons Iron Ward'],
          // Normal Spears
          ['UNI !ID spr', 'The Dragon Chang'],
          ['UNI !ID tri', 'Razortine'],
          ['UNI !ID brn', 'Bloodthief'],
          ['UNI !ID spt', 'Lance of Yaggai'],
          ['UNI !ID pik', 'The Tannr Gorerod'],
          // Exceptional Spears
          ['UNI !ID 9sr', 'The Impaler'],
          ['UNI !ID 9tr', 'Kelpie Snare'],
          ['UNI !ID 9br', 'Soulfeast Tine'],
          ['UNI !ID 9st', 'Hone Sundan'],
          ['UNI !ID 9p9', 'Spire of Honor'],
          // Elite Spears
          ['UNI !ID 7sr', 'Ariocs Needle'],
          ['UNI !ID 7br', 'Viperfork'],
          ['UNI !ID 7st', 'Uldyssians Awakening'],
          ['UNI !ID 7p7', 'Steel Pillar'],
          // Normal Staves
          ['UNI !ID sst', 'Bane Ash'],
          ['UNI !ID lst', 'Serpent Lord'],
          ['UNI !ID cst', 'Spire of Lazarus'],
          ['UNI !ID bst', 'The Salamander'],
          ['UNI !ID wst', 'The Iron Jang Bong'],
          // Exceptional Staves
          ['UNI !ID 8ss', 'Razorswitch'],
          ['UNI !ID 8ls', 'Ribcracker'],
          ['UNI !ID 8cs', 'Chromatic Ire'],
          ['UNI !ID 8bs', 'Warpspear'],
          ['UNI !ID 8ws', 'Skull Collector'],
          // Elite Staves
          ['UNI !ID 6cs', 'Ondals Wisdom'],
          ['UNI !ID 6bs', 'Brimstone Rain'],
          ['UNI !ID 6ws', 'Mang Songs Lesson'],
          // Normal Swords 1H
          ['UNI !ID ssd', 'Rixots Keen'],
          ['UNI !ID scm', 'Blood Crescent'],
          ['UNI !ID sbr', 'Skewer of Krintiz'],
          ['UNI !ID flc', 'Gleamscythe'],
          ['UNI !ID bsd', 'Griswolds Edge'],
          ['UNI !ID lsd', 'Hellplague'],
          ['UNI !ID wsd', 'Culwens Point'],
          // Normal Swords 2H
          ['UNI !ID 2hs', 'Shadowfang'],
          ['UNI !ID clm', 'Soulflay'],
          ['UNI !ID gis', 'Kinemils Awl'],
          ['UNI !ID bsw', 'Blacktongue'],
          ['UNI !ID flb', 'Ripsaw'],
          ['UNI !ID gsd', 'The Patriarch'],
          // Exceptional Swords 1H
          ['UNI !ID 9ss', 'Bloodletter'],
          ['UNI !ID 9sm', 'Coldsteel Eye'],
          ['UNI !ID 9sb', 'Hexfire'],
          ['UNI !ID 9fc', 'Blade of Ali Baba'],
          ['UNI !ID 9cr', 'Ginthers Rift'],
          ['UNI !ID 9bs', 'Headstriker'],
          ['UNI !ID 9ls', 'Plague Bearer'],
          ['UNI !ID 9wd', 'The Atlantean'],
          // Exceptional Swords 2H
          ['UNI !ID 92h', 'Crainte Vomir'],
          ['UNI !ID 9cm', 'Bing Sz Wang'],
          ['UNI !ID 9gs', 'The Vile Husk'],
          ['UNI !ID 9b9', 'Cloudcrack'],
          ['UNI !ID 9fb', 'Todesfaelle Flamme'],
          ['UNI !ID 9gd', 'Swordguard'],
          // Elite Swords 1H
          ['UNI !ID 7sm', 'Djinn Slayer'],
          ['UNI !ID 7sb', 'Bloodmoon'],
          ['UNI !ID 7cr', 'Lightsabre or Azurewrath'],
          ['UNI !ID 7bs', 'Hadriels Hand'],
          ['UNI !ID 7ls', 'Frostwind'],
          // Elite Swords 2H
          ['UNI !ID 7cm', 'Leroics Mithril Bane'],
          ['UNI !ID 7gs', 'Flamebellow'],
          ['UNI !ID 7b7', 'Doombringer'],
          ['UNI !ID 7fb', 'Odium'],
          ['UNI !ID 7gd', 'The Grandfather'],
          // Exceptional Throwing
          ['UNI !ID 9tk', 'Deathbit'],
          ['UNI !ID 9ta', 'The Scalper'],
          ['UNI !ID 9b8', 'Achilles Strike'],
          // Elite Throwing
          ['UNI !ID 7bk', 'Warshrike'],
          ['UNI !ID 7ta', 'Gimmershred'],
          ['UNI !ID 7b8', 'Lacerator'],
          // Normal Wands
          ['UNI !ID wnd', 'Torch of Iro'],
          ['UNI !ID ywn', 'Maelstrom'],
          ['UNI !ID bwn', 'Gravenspine'],
          ['UNI !ID gwn', 'Umes Lament'],
          // Exceptional Wands
          ['UNI !ID 9wn', 'Suicide Branch'],
          ['UNI !ID 9yw', 'Carin Shard'],
          ['UNI !ID 9bw', 'Arm of King Leoric'],
          ['UNI !ID 9gw', 'Blackhand Key'],
          // Elite Wands
          ['UNI !ID 7bw', 'Boneshade'],
          ['UNI !ID 7gw', 'Deaths Web'],
          // --- SET ITEMS ---
          // Multi-base sets
          ['SET !ID amu', 'Set Amulet'],
          ['SET !ID rin', 'Set Ring'],
          ['SET !ID cap', 'Infernal or Sanders'],
          ['SET !ID crn', 'Iratha or Milabrega'],
          ['SET !ID mbl', 'Hsaru or Hwanin'],
          ['SET !ID tbl', 'Infernal or Iratha'],
          ['SET !ID tgl', 'Arctic or Iratha'],
          ['SET !ID vbt', 'Cow King or Sander'],
          // Angelic
          ['SET !ID rng', 'Angelic Mantle'],
          ['SET !ID sbr', 'Angelic Sickle'],
          // Arcanna
          ['SET !ID skp', 'Arcannas Head'],
          ['SET !ID ltp', 'Arcannas Flesh'],
          ['SET !ID wst', 'Arcannas Deathwand'],
          // Arctic
          ['SET !ID qui', 'Arctic Furs'],
          ['SET !ID vbl', 'Arctic Binding'],
          ['SET !ID swb', 'Arctic Horn'],
          // Berserker
          ['SET !ID hlm', 'Berserkers Headgear'],
          ['SET !ID spl', 'Berserkers Hauberk'],
          ['SET !ID 2ax', 'Berserkers Hatchet'],
          // Cathan
          ['SET !ID msk', 'Cathans Visage'],
          ['SET !ID chn', 'Cathans Mesh'],
          ['SET !ID bst', 'Cathans Rule'],
          // Civerb
          ['SET !ID gsc', 'Civerbs Cudgel'],
          ['SET !ID lrg', 'Civerbs Ward'],
          // Cleglaw
          ['SET !ID lsd', 'Cleglaws Tooth'],
          ['SET !ID mgl', 'Cleglaws Pincers'],
          ['SET !ID sml', 'Cleglaws Claw'],
          // Death
          ['SET !ID wsd', 'Deaths Touch'],
          ['SET !ID lgl', 'Deaths Hand'],
          ['SET !ID lbl', 'Deaths Guard'],
          // Hsarus
          ['SET !ID buc', 'Hsarus Iron Fist'],
          ['SET !ID mbt', 'Hsarus Iron Heel'],
          // Infernal
          ['SET !ID dgr', 'Infernal Spine'],
          // Isenhart
          ['SET !ID bsd', 'Isenharts Lightbrand'],
          ['SET !ID fhl', 'Isenharts Horns'],
          ['SET !ID brs', 'Isenharts Case'],
          ['SET !ID gts', 'Isenharts Parry'],
          // Milabrega
          ['SET !ID aar', 'Milabregas Robe'],
          ['SET !ID kit', 'Milabregas Orb'],
          ['SET !ID wsp', 'Milabregas Rod'],
          // Sigon
          ['SET !ID ghm', 'Sigons Visor'],
          ['SET !ID gth', 'Sigons Shelter'],
          ['SET !ID hbt', 'Sigons Sabot'],
          ['SET !ID tow', 'Sigons Guard'],
          ['SET !ID hbl', 'Sigons Wrap'],
          ['SET !ID hgl', 'Sigons Gage'],
          // Tancred
          ['SET !ID bhm', 'Tancreds Skull'],
          ['SET !ID ful', 'Tancreds Spine'],
          ['SET !ID lbt', 'Tancreds Hobnails'],
          ['SET !ID mpi', 'Tancreds Crowbill'],
          // Vidala
          ['SET !ID lbb', 'Vidalas Barb'],
          ['SET !ID lea', 'Vidalas Ambush'],
          ['SET !ID tbt', 'Vidalas Fetlock'],
          // Aldur
          ['SET !ID dr8', 'Aldurs Stony Gaze'],
          ['SET !ID xtb', 'Aldurs Advance'],
          ['SET !ID uul', 'Aldurs Deception'],
          ['SET !ID 9mt', 'Aldurs Rhythm'],
          // Bul-Kathos
          ['SET !ID 7gd', 'Bul-Kathos Sacred Charge'],
          ['SET !ID 7fb', 'Bul-Kathos Tribal Guardian'],
          // Cow King
          ['SET !ID xap', 'Cow Kings Horns'],
          ['SET !ID stu', 'Cow Kings Hide'],
          // Disciple
          ['SET !ID ulg', 'Laying of Hands'],
          ['SET !ID uui', 'Dark Adherent'],
          ['SET !ID xlb', 'Rite of Passage'],
          ['SET !ID umc', 'Credendum'],
          // Griswold
          ['SET !ID xar', 'Griswolds Heart'],
          ['SET !ID urn', 'Griswolds Valor'],
          ['SET !ID 7ws', 'Griswolds Redemption'],
          ['SET !ID paf', 'Griswolds Honor'],
          // Heaven
          ['SET !ID xrs', 'Haemosus Adamant'],
          ['SET !ID 7ma', 'Dangoons Teaching'],
          ['SET !ID uts', 'Taebaeks Glory'],
          ['SET !ID uhm', 'Ondals Almighty'],
          // Hwanin
          ['SET !ID xrn', 'Hwanins Splendor'],
          ['SET !ID 9vo', 'Hwanins Justice'],
          ['SET !ID xcl', 'Hwanins Refuge'],
          // Immortal King
          ['SET !ID ba5', 'IK Will'],
          ['SET !ID 7m7', 'IK Stone Crusher'],
          ['SET !ID uar', 'IK Soul Cage'],
          ['SET !ID zhb', 'IK Detail'],
          ['SET !ID xhg', 'IK Forge'],
          ['SET !ID xhb', 'IK Pillar'],
          // Mavina
          ['SET !ID ci3', 'Mavinas True Sight'],
          ['SET !ID amc', 'Mavinas Caster'],
          ['SET !ID uld', 'Mavinas Embrace'],
          ['SET !ID xtg', 'Mavinas Icy Clutch'],
          ['SET !ID zvb', 'Mavinas Tenet'],
          // Natalya
          ['SET !ID xh9', 'Natalyas Totem'],
          ['SET !ID 7qr', 'Natalyas Mark'],
          ['SET !ID ucl', 'Natalyas Shadow'],
          ['SET !ID xmb', 'Natalyas Soul'],
          // Naj
          ['SET !ID ci0', 'Najs Circlet'],
          ['SET !ID ult', 'Najs Light Plate'],
          ['SET !ID 6cs', 'Najs Puzzler'],
          // Orphan (Guillaume etc)
          ['SET !ID xhm', 'Guillaumes Face'],
          ['SET !ID xml', 'Whitstans Guard'],
          ['SET !ID xvg', 'Magnus Skin'],
          ['SET !ID ztb', 'Wilhelms Pride'],
          // Sander
          ['SET !ID bwn', 'Sanders Superstition'],
          ['SET !ID vgl', 'Sanders Taboo'],
          // Sazabi
          ['SET !ID xhl', 'Sazabis Mental Sheath'],
          ['SET !ID 7ls', 'Sazabis Cobalt Redeemer'],
          ['SET !ID upl', 'Sazabis Ghost Liberator'],
          // Tal Rasha
          ['SET !ID oba', 'Tal Rashas Lidless Eye'],
          ['SET !ID xsk', 'Tal Rashas Horadric Crest'],
          ['SET !ID uth', 'Tal Rashas Guardianship'],
          ['SET !ID zmb', 'Tal Rashas Fine-Spun Cloth'],
          // Trang-Oul
          ['SET !ID uh9', 'Trang-Ouls Guise'],
          ['SET !ID xul', 'Trang-Ouls Scales'],
          ['SET !ID ne9', 'Trang-Ouls Wing'],
          ['SET !ID utc', 'Trang-Ouls Girth'],
          ['SET !ID xmg', 'Trang-Ouls Claws']
        ];
        uniNames.forEach(function (entry) {
          var color = entry[0].indexOf('SET') === 0 ? '%GREEN%' : '%GOLD%';
          lines.push('ItemDisplay[' + entry[0] + ']: ' + color + entry[1] + '%CONTINUE%');
        });
        lines.push('');
      }

      lines.push('// ============================================================');
      lines.push('// UNIQUE & SET ITEMS');
      lines.push('// ============================================================');

      // Unique charms always show with big notification
      lines.push('// --- Unique Charms (Annihilus, Torch, Gheeds) ---');
      lines.push('ItemDisplay[UNI cm1]: %GOLD%+ Annihilus +' + descStr + (wantBigNotify ? '%BORDER-62%' : wantMapIcons ? '%MAP-62%' : '') + (wantSounds ? '%SOUNDID-4716%' : ''));
      lines.push('ItemDisplay[UNI cm2]: %GOLD%+ Hellfire Torch +' + descStr + (wantBigNotify ? '%BORDER-62%' : wantMapIcons ? '%MAP-62%' : '') + (wantSounds ? '%SOUNDID-4716%' : ''));
      lines.push('ItemDisplay[UNI cm3]: %GOLD%+ Gheeds Fortune +' + descStr + (wantBigNotify ? '%BORDER-62%' : wantMapIcons ? '%MAP-62%' : '') + (wantSounds ? '%SOUNDID-4716%' : ''));

      // Unique/Set tiering based on HiimFilter star system
      // Item code groups by value tier
      var uni4star = '(ci3 OR pa9 OR obf OR uar OR ulc OR uap OR uhm OR usk OR urn OR uit OR uts OR 7wh OR 7ws OR 6bs OR 6ws OR 7gw OR xhb OR uhc OR ci2 OR nef OR uui OR upl OR uul OR 8mx OR dre OR 7pa OR drd OR umc OR umg OR utg OR ztb OR xvb OR cqv3 OR xsh)';
      var uni4eth = '(utp OR amf OR 9gm OR 7p7 OR 7xf OR 9la OR 7s8 OR 7b7 OR 7b8 OR ama OR aar OR xlt OR 7gd OR 7pa OR 8ls OR 7gm OR 7ts)';
      var uni3star = '(amf OR bae OR xhn OR utu OR zlb OR uvc OR uhg OR uh9 OR 9gm OR 7fl OR 7wc OR 9bw OR 9gw OR 6lw OR xtb OR xui OR 7cr OR uvg OR ulm OR uow OR 7p7 OR nee OR 7xf OR ned OR xh9 OR zvb OR 6sw OR 7gd OR paf OR 8ls OR 7mp OR scl OR 8cb OR 7gm OR zhb OR 7b7 OR drc OR 8rx OR aqv3 OR aqv2)';
      var uni2star = '(drb OR oba OR xea OR xmb OR tgl OR xvg OR 7bl OR 9wn OR 7bw OR xld OR ulb OR umb OR 9la OR 7bt OR pae OR xtg OR 7wa OR 8ws OR obc OR uhb OR bad OR 9s8 OR ba6 OR dra OR 7ls OR pac OR 7s8 OR neg)';
      var set3star = '(ne9 OR utc OR xmg OR uhm OR xul OR 7ws OR paf OR lgl OR xvg OR amu OR rin OR lbt)';
      var set2star = '(xap OR stu OR uts OR xar OR urn OR dr8 OR ucl OR xh9 OR 7qr OR vbt)';
      var set1star = '(ulg OR 6cs OR xtb OR uul OR ba5 OR 7m7 OR zhb OR xhg OR xhb OR xmb OR oba OR xsk OR zmb OR uh9 OR uar OR xhm OR ci3 OR amc OR uld OR xtg OR zvb OR uth OR mbl)';

      // Unique boss items (DClone/Rathma) — always show with max decoration
      lines.push('// --- Boss Uniques (DClone/Rathma — always show) ---');
      lines.push('ItemDisplay[UNI !ID (ram OR rar OR rbe OR 7qr OR uhn OR uth OR utb OR 7bs OR 7cr2)]: %GOLD%' + decoHR_L + '%NAME%' + decoHR_R + (wantBigNotify ? '%BORDER-62%' : wantMapIcons ? '%MAP-62%' : '') + (wantSounds ? '%SOUNDID-4719%' : ''));

      // Unique jewels (Rainbow Facet) — always show with high decoration
      lines.push('ItemDisplay[jew UNI !ID]: %GOLD%' + decoHR_L + '%NAME%' + decoHR_R + uniNotify);
      // Unique rings/amulets — always show with mid decoration
      lines.push('ItemDisplay[(rin OR amu) UNI !ID]: %GOLD%' + decoMid_L + '%NAME%' + decoMid_R + uniNotify);

      // 4-star uniques — always show with high decoration + full notifications
      lines.push('// --- 4-Star Uniques (GG tier — always show) ---');
      lines.push('ItemDisplay[UNI !ID ' + uni4star + ']: %GOLD%' + decoHR_L + '%NAME%' + decoHR_R + descStr + uniNotify);
      lines.push('ItemDisplay[UNI !ID ETH ' + uni4eth + ']: %GOLD%' + decoHR_L + '%NAME%' + decoHR_R + descStr + uniNotify);

      // 3-star uniques — always show with mid decoration
      lines.push('// --- 3-Star Uniques (high value) ---');
      lines.push('ItemDisplay[UNI !ID ' + uni3star + ']: %GOLD%' + decoMid_L + '%NAME%' + decoMid_R + descStr + (wantMapIcons ? '%MAP-A5%' : '') + (wantSounds ? '%SOUNDID-4715%' : ''));

      // 2-star uniques — low decoration, shown with dot, hidden at FILTLVL 4
      lines.push('// --- 2-Star Uniques (mid value) ---');
      lines.push('ItemDisplay[UNI !ID FILTLVL<4 ' + uni2star + ']: %GOLD%' + decoLow_L + '%NAME%' + decoLow_R + descStr + (wantDots ? '%DOT-D3%' : ''));

      // Remaining uniques — no decoration, shown at lower FILTLVL
      lines.push('// --- Low-tier Uniques (shown at FILTLVL 1-2) ---');
      lines.push('ItemDisplay[UNI !ID FILTLVL<3]: %GOLD%%NAME%' + descStr);
      lines.push('ItemDisplay[UNI !ID]: %GOLD%%NAME%');

      // 3-star sets — always show with mid decoration
      lines.push('// --- 3-Star Sets (top tier — always show) ---');
      lines.push('ItemDisplay[SET !ID ' + set3star + ']: %GREEN%' + decoMid_L + '%NAME%' + decoMid_R + descStr + setNotify);

      // 2-star sets — low decoration, shown with dot
      lines.push('// --- 2-Star Sets (high value) ---');
      lines.push('ItemDisplay[SET !ID ' + set2star + ']: %GREEN%' + decoLow_L + '%NAME%' + decoLow_R + descStr + (wantDots ? '%DOT-84%' : ''));

      // 1-star sets — shown at FILTLVL 1-3
      lines.push('// --- 1-Star Sets (mid value) ---');
      lines.push('ItemDisplay[SET !ID FILTLVL<4 ' + set1star + ']: %GREEN%%NAME%' + descStr);

      // Remaining sets — shown at lower FILTLVL
      lines.push('// --- Low-tier Sets (shown at FILTLVL 1-2) ---');
      lines.push('ItemDisplay[SET !ID FILTLVL<3]: %GREEN%%NAME%' + descStr);
      lines.push('// Set catch-all — still show with minimal display');
      lines.push('ItemDisplay[SET !ID]: %GREEN%%NAME%');
      lines.push('');

      // ==========================
      // 8. RARE & CRAFTED
      // ==========================
      lines.push('// ============================================================');
      lines.push('// RARE & CRAFTED');
      lines.push('// ============================================================');
      // Rare jewels always
      lines.push('ItemDisplay[!ID RARE jew]: %NAME%{cALVL:%CRAFTALVL%}');
      // Rare amulets/rings with high ALVL
      lines.push('ItemDisplay[FILTLVL<4 !ID RARE amu ILVL>84 ALVL>89]: %NAME%{cALVL:%CRAFTALVL%}');
      lines.push('ItemDisplay[FILTLVL<4 !ID RARE rin ILVL>84 ALVL>80]: %NAME%{cALVL:%CRAFTALVL%}');
      lines.push('ItemDisplay[FILTLVL<3 !ID RARE QUIVER ILVL>84 ALVL>76]: %NAME%{cALVL:%CRAFTALVL%}');
      // Armor
      lines.push('//Armor');
      lines.push('ItemDisplay[!ID RARE CIRC ILVL>84 ALVL>89]: %NAME%{cALVL:%CRAFTALVL%}');
      lines.push('ItemDisplay[FILTLVL<3 !ID RARE HELM ILVL>84 ALVL>80]: %NAME%{cALVL:%CRAFTALVL%}');
      lines.push('ItemDisplay[FILTLVL<4 !ID RARE CHEST ILVL>84 ALVL>84]: %NAME%{cALVL:%CRAFTALVL%}');
      lines.push('ItemDisplay[FILTLVL<4 !ID RARE GLOVES ILVL>84 ALVL>74]: %NAME%{cALVL:%CRAFTALVL%}');
      lines.push('ItemDisplay[FILTLVL<4 !ID RARE BELT ILVL>84 ALVL>69]: %NAME%{cALVL:%CRAFTALVL%}');
      lines.push('ItemDisplay[FILTLVL<4 !ID RARE BOOTS ILVL>84 ALVL>69]: %NAME%{cALVL:%CRAFTALVL%}');
      lines.push('ItemDisplay[FILTLVL<3 !ID RARE SHIELD ILVL>84 ALVL>84]: %NAME%{cALVL:%CRAFTALVL%}');
      // Weapons
      lines.push('//Weapons');
      lines.push('ItemDisplay[(FILTLVL<4 OR ETH) !ID RARE (gax OR 9ga OR 7ga OR mau OR 9m9 OR 7m7 OR flb OR 9fb OR 7fb OR gsd OR 9gd OR 7gd OR glv OR 9gl OR 7gl OR pik OR 9p9 OR 7p7 OR axf OR 9xf OR 7xf) ILVL>84 ALVL>76]: %NAME%{cALVL:%CRAFTALVL%}');
      lines.push('ItemDisplay[(FILTLVL<3 OR (FILTLVL<4 ETH)) !ID RARE (gix OR 9gi OR 7gi OR whm OR 9wh OR 7wh OR gma OR 9gm OR 7gm OR gis OR 9gs OR 7gs OR pil OR 9pi OR 7pi OR ssp OR 9s9 OR 7s7 OR tsp OR 9ts OR 7ts OR ktr OR 9ar OR 7ar OR skr OR 9qr OR 7qr OR am2 OR am7 OR amc) ILVL>84 ALVL>76]: %NAME%{cALVL:%CRAFTALVL%}');
      // Catch all & hide
      lines.push('//Catch All Rare');
      lines.push('ItemDisplay[FILTLVL<3 !ID RARE]:%NAME%');
      // Crafted always shown
      lines.push('ItemDisplay[CRAFT !ID]: %ORANGE%%NAME%' + descStr);
      lines.push('');

      // ==========================
      // 9. CHARMS (with ilvl info)
      // ==========================
      lines.push('// ============================================================');
      lines.push('// CHARMS');
      lines.push('// ============================================================');
      // Grand charms: highlight high-ilvl ones for skillers
      var gcName = wantCharmShort ? 'GC' : '%NAME%';
      var lcName = wantCharmShort ? 'LC' : '%NAME%';
      var scName = wantCharmShort ? 'SC' : '%NAME%';
      lines.push('ItemDisplay[cm3 MAG !ID ILVL>90]: %BLUE%' + gcName + ilvlStr + charmNotify);
      lines.push('ItemDisplay[cm3 MAG !ID]: %BLUE%' + gcName + ilvlStr);
      // Large charms
      lines.push('ItemDisplay[cm2 MAG !ID]: %BLUE%' + lcName);
      // Small charms: show ilvl for max-roll hunting
      lines.push('ItemDisplay[cm1 MAG !ID ILVL>90]: %BLUE%' + scName + ilvlStr + charmNotify);
      lines.push('ItemDisplay[cm1 MAG !ID]: %BLUE%' + scName + ilvlStr);
      lines.push('');

      // ==========================
      // 10. GEMS (tiered by quality)
      // ==========================
      lines.push('// ============================================================');
      lines.push('// GEMS');
      lines.push('// ============================================================');
      // Perfect gems always shown with notification
      lines.push('ItemDisplay[GEM=5]: %NAME%' + gemNotify);
      // Flawless shown, hide chipped/flawed/normal by DIFF
      lines.push('ItemDisplay[GEM=4]: %NAME%');
      lines.push('ItemDisplay[GEM=3 DIFF<2]: %NAME%');
      lines.push('ItemDisplay[GEM=3 DIFF>1]:');
      lines.push('ItemDisplay[GEM=2 DIFF<1]: %NAME%');
      lines.push('ItemDisplay[GEM=2 DIFF>0]:');
      lines.push('ItemDisplay[GEM=1 DIFF<1]: %NAME%');
      lines.push('ItemDisplay[GEM=1 DIFF>0]:');
      lines.push('');

      // ==========================
      // 11. JEWELRY (rings, amulets, jewels)
      // ==========================
      lines.push('// ============================================================');
      lines.push('// JEWELRY');
      lines.push('// ============================================================');
      lines.push('ItemDisplay[RARE rin]: %YELLOW%%NAME%' + descStr);
      lines.push('ItemDisplay[RARE amu]: %YELLOW%%NAME%' + descStr);
      lines.push('ItemDisplay[RARE jew]: %YELLOW%%NAME%' + descStr + ilvlStr);
      lines.push('ItemDisplay[MAG jew]: %BLUE%%NAME%' + ilvlStr);
      lines.push('ItemDisplay[MAG rin]: %BLUE%%NAME%' + craftDesc);
      lines.push('ItemDisplay[MAG amu]: %BLUE%%NAME%' + craftDesc);
      lines.push('');

      // ==========================
      // 12. CRAFTING BASES (with CRAFTALVL)
      // ==========================
      if (wantCrafting) {
        lines.push('// ============================================================');
        lines.push('// CRAFTING BASES -- shows CRAFTALVL on good bases');
        lines.push('// ============================================================');
        lines.push('// 2H Axes, Mauls, 2H Swords, Glaives, Pikes, Cestus (ETH)');
        lines.push('ItemDisplay[!ID (MAG OR RARE) ETH (gax OR 9ga OR 7ga OR mau OR 9m9 OR 7m7 OR flb OR 9fb OR 7fb OR gsd OR 9gd OR 7gd OR glv OR 9gl OR 7gl OR pik OR 9p9 OR 7p7 OR axf OR 9xf OR 7xf) CRAFTALVL>76]: %NAME%{cALVL:%CRAFTALVL%}');
        lines.push('// Amazon Bows');
        lines.push('ItemDisplay[!ID (MAG OR RARE) (am2 OR am7 OR amc) CRAFTALVL>76]: %NAME%{cALVL:%CRAFTALVL%}');
        lines.push('// Assassin Katars (ETH)');
        lines.push('ItemDisplay[!ID (MAG OR RARE) ETH (ktr OR 9ar OR 7ar OR skr OR 9qr OR 7qr) CRAFTALVL>76]: %NAME%{cALVL:%CRAFTALVL%}');
        lines.push('// Giant Axes, War Hammers, Great Mauls, Giant Swords, Pilums, Spears, Throwing Spears (ETH)');
        lines.push('ItemDisplay[!ID (MAG OR RARE) ETH (gix OR 9gi OR 7gi OR whm OR 9wh OR 7wh OR gma OR 9gm OR 7gm OR gis OR 9gs OR 7gs OR pil OR 9pi OR 7pi OR ssp OR 9s9 OR 7s7 OR tsp OR 9ts OR 7ts) CRAFTALVL>76]: %NAME%{cALVL:%CRAFTALVL%}');
        lines.push('// Battle Axes, Giant Axes (ETH)');
        lines.push('ItemDisplay[!ID (MAG OR RARE) ETH (btx OR 9bt OR 7bt OR gix OR 9gi OR 7gi) CRAFTALVL>76]: %NAME%{cALVL:%CRAFTALVL%}');
        lines.push('// 1H Maces, Morning Stars, Flails (ETH)');
        lines.push('ItemDisplay[!ID (MAG OR RARE) ETH (mac OR 9ma OR 7ma OR mst OR 9mt OR 7mt OR fla OR 9fl OR 7fl) CRAFTALVL>76]: %NAME%{cALVL:%CRAFTALVL%}');
        lines.push('// Sorceress Orbs');
        lines.push('ItemDisplay[!ID (MAG OR RARE) (ob5 OR oba OR obf) CRAFTALVL>76]: %NAME%{cALVL:%CRAFTALVL%}');
        lines.push('');
      }

      // ==========================
      // 13b. NMAG ITEM ENRICHMENT (from HiimFilter)
      // ==========================
      lines.push('// ============================================================');
      lines.push('// NMAG ITEM ENRICHMENT');
      lines.push('// ============================================================');
      // Base coloring: white for 0os, gray for socketed (skip ETH — already tagged in section 3)
      lines.push('// Base item coloring');
      lines.push('ItemDisplay[(ARMOR OR WEAPON) NMAG !ETH SOCK=0]: %WHITE%%NAME%%CONTINUE%{%NAME%}');
      lines.push('ItemDisplay[(ARMOR OR WEAPON) NMAG !ETH SOCK>0]: %GRAY%%NAME%%CONTINUE%{%NAME%}');
      // SUP enhanced defense/damage display
      lines.push('// Superior ED% display');
      lines.push('ItemDisplay[!INF !RW NMAG SUP EDEF>0]: %BLUE%[%EDEF%%] %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[!INF !RW NMAG SUP EDAM>0]: %RED%[%EDAM%%] %NAME%{%NAME%}%CONTINUE%');
      // Paladin shield all-res
      if (selectedClasses.length === 0 || hasClass('DIN')) {
        lines.push('// Paladin shield All Res');
        lines.push('ItemDisplay[!INF !RW NMAG DIN RES>19]: %GREEN%[%RES%r] %NAME%{%NAME%}%CONTINUE%');
        lines.push('ItemDisplay[!INF !RW NMAG DIN RES~1-19]: %TAN%[%RES%r] %NAME%{%NAME%}%CONTINUE%');
      }
      // High-defense chests
      lines.push('// High defense chest armor');
      lines.push('ItemDisplay[CHEST !INF !RW NMAG DEF>799]: %TAN%[%DEF% Def] %NAME%{%NAME%}%CONTINUE%' + (wantMapIcons ? '%DOT-D6%' : ''));
      lines.push('');

      // ==========================
      // 13c. STAFFMOD DISPLAY (from HiimFilter community filter)
      // ==========================
      if (wantStaffmods) {
      lines.push('// ============================================================');
      lines.push('// STAFFMOD DISPLAY -- skill bonuses on white/magic items');
      lines.push('// ============================================================');

      // Tab-based staffmods (all classes, +3 only)
      lines.push('// --- Skill Tab Display (+3 all classes) ---');
      var tabSkills = [
        ['TABSK0','Bow'],['TABSK1','PassMag'],['TABSK2','Java'],
        ['TABSK8','Fire'],['TABSK9','Light'],['TABSK10','Cold'],
        ['TABSK16','Curses'],['TABSK17','PnB'],['TABSK18','NecSum'],
        ['TABSK24','PalCmbt'],['TABSK25','OffAura'],['TABSK26','DefAura'],
        ['TABSK32','BarCmbt'],['TABSK33','Masteries'],['TABSK34','Warcries'],
        ['TABSK40','DruSum'],['TABSK41','Shape'],['TABSK42','Elem'],
        ['TABSK48','Traps'],['TABSK49','Shadow'],['TABSK50','MartArt']
      ];
      tabSkills.forEach(function (t) {
        lines.push('ItemDisplay[NMAG !RW ' + t[0] + '>2]: %GREEN%+3 ' + t[1] + ' %NAME%{%NAME%}%CONTINUE%');
      });

      // Individual skill staffmods — data: [SK#, name, top] where top=true means show at all FILTLVL
      // Amazon
      var aznSkills = [
        ['SK6','MagicArw',0],['SK7','FireArw',0],['SK8','ColdArw',0],['SK9','MultShot',0],['SK10','ExplArw',0],
        ['SK11','IceArw',1],['SK12','GuidArw',1],['SK13','Strafe',1],['SK14','Immolation',1],
        ['SK16','InnerSight',0],['SK17','CritStrike',0],['SK18','Dodge',0],['SK19','SlwMissle',0],
        ['SK20','Avoid',0],['SK21','Penetrate',0],['SK22','Decoy',0],['SK23','Evade',0],
        ['SK24','Valkyrie',1],['SK25','Pierce',1],
        ['SK26','Jab',0],['SK27','PwrStrk',0],['SK28','PoisJav',0],['SK29','Impale',0],
        ['SK30','LghtBolt',0],['SK31','ChrgStrk',1],['SK32','PlgJav',1],['SK33','Fend',0],
        ['SK34','LghtStrk',1],['SK35','LghtFury',1]
      ];
      // Sorceress
      var sorSkills = [
        ['SK36','FireBolt',0],['SK37','Warmth',0],['SK38','Inferno',0],['SK39','Blaze',0],
        ['SK40','FireBall',1],['SK41','FireWall',0],['SK42','Enchant',1],['SK43','Meteor',1],
        ['SK44','FireMstry',1],['SK45','Hydra',1],
        ['SK46','ChrgBolt',0],['SK47','StatFld',0],['SK48','Telekinesis',0],['SK49','Nova',1],
        ['SK50','ShivArm',1],['SK51','Lghtn',1],['SK52','ChainLght',1],['SK53','ThndStorm',1],
        ['SK54','Teleport',1],['SK55','LghtMstry',1],['SK56','EnrgShld',1],
        ['SK57','FrstBolt',0],['SK58','IceBlst',0],['SK59','FrstNova',1],['SK60','Blizzard',1],
        ['SK61','GlacSpike',1],['SK62','ColdMstry',1],['SK63','FrzOrb',1],['SK64','ShvrArm',1],
        ['SK65','ColdSnap',1]
      ];
      // Necromancer
      var necSkills = [
        ['SK66','AmpDmg',1],['SK67','Terror',1],['SK68','Weaken',1],['SK69','LifeTap',1],
        ['SK70','IronMaid',1],['SK71','Confuse',0],['SK72','Attract',0],['SK73','Decrepify',1],
        ['SK74','LwrRes',1],['SK75','DimVsn',1],
        ['SK79','SkeletonMsry',1],['SK80','CorpExpl',1],['SK83','BneSpear',1],
        ['SK84','BneWall',1],['SK85','BnePrison',1],['SK87','BneSpirit',1],
        ['SK89','PsnNova',1],['SK91','PsnExpl',0],['SK92','Revive',1],
        ['SK94','SkelMage',1],['SK95','BloodGolem',1]
      ];
      // Paladin
      var palSkills = [
        ['SK99','Sacrifice',1],['SK101','HlyBolt',1],['SK102','Zeal',1],
        ['SK105','Charge',1],['SK109','Vengeance',1],['SK110','BlessHammer',1],
        ['SK111','Conversion',0],['SK112','HlyShld',1],['SK113','FistHvns',1],
        ['SK114','Might',1],['SK116','HlyFire',1],['SK117','Thorns',0],
        ['SK118','Defiance',1],['SK119','Resist',1],['SK121','Cleansing',1],
        ['SK122','Vigor',1],['SK123','Meditate',1],['SK125','Conviction',1],
        ['SK364','Fanaticism',1]
      ];
      // Barbarian
      var barSkills = [
        ['SK126','Bash',0],['SK128','GenMstry',1],['SK130','Howl',0],
        ['SK131','FindPot',0],['SK132','Taunt',0],['SK133','Shout',1],
        ['SK134','Stun',1],['SK135','DblSwng',1],['SK136','Leap',1],
        ['SK137','DblThrow',0],['SK138','LeapAtk',1],['SK139','Concentrate',0],
        ['SK140','IrnSkin',1],['SK141','BattleCry',1],['SK142','Frenzy',0],
        ['SK143','Whirlwind',1],['SK144','Berserk',0],['SK145','NatRes',1],
        ['SK146','WarCry',1],['SK147','BattleOrders',1],['SK148','GrimWrd',1],
        ['SK149','BattleCommand',1],['SK150','FindItem',0],['SK151','IncSpeed',1],
        ['SK153','CombMstry',1],['SK154','AxeMstry',1],['SK155','MaceMstry',1],['SK368','PolearmMstry',1]
      ];
      // Druid
      var druSkills = [
        ['SK222','Raven',1],['SK223','PlagPoppy',0],['SK224','OakSage',1],
        ['SK225','SumSpirit',0],['SK226','Carrion',1],['SK227','HoW',1],
        ['SK228','SumGrizzly',1],['SK229','SumDire',1],
        ['SK230','Werewolf',0],['SK231','Lycanthrpy',0],['SK232','Werebear',0],
        ['SK233','FeralRage',0],['SK234','Maul',0],['SK235','Rabies',1],
        ['SK236','FireClaws',1],['SK237','Hunger',1],['SK238','ShockWave',0],
        ['SK239','Fury',0],
        ['SK240','Firestorm',0],['SK241','MoltenBldr',0],['SK242','Arctic',0],
        ['SK243','Fissure',1],['SK244','CycloneArmr',1],['SK245','Twister',1],
        ['SK246','Volcano',1],['SK247','Tornado',1],['SK248','Armageddon',1],
        ['SK249','Hurricane',1],['SK370','SumVine',1]
      ];
      // Assassin
      var sinSkills = [
        ['SK251','FireBlast',0],['SK252','ClawMstry',1],['SK253','PsyHammer',0],
        ['SK254','TigerStrk',0],['SK255','DrgnTalon',0],['SK256','ShckWeb',0],
        ['SK257','BladeSent',1],['SK258','BurstSpd',1],['SK259','FistOFire',1],
        ['SK260','DrgnClaw',0],['SK261','ChrgBoltSent',1],['SK262','WakeOFire',1],
        ['SK263','WpnBlock',1],['SK264','CloakShadow',0],['SK265','CobraStrk',0],
        ['SK266','BladeFury',1],['SK267','Fade',1],['SK268','ShadowWarr',0],
        ['SK269','ClawsThund',1],['SK270','DrgnTail',0],['SK271','LghtSent',1],
        ['SK272','WakeInferno',1],['SK273','MindBlast',1],['SK274','BladeIce',1],
        ['SK275','DrgnFlight',1],['SK276','DeathSent',1],['SK277','BladeShield',1],
        ['SK278','Venom',1],['SK279','ShadowMstr',0],['SK280','PhnxStrk',1],['SK366','LghtSentry',1]
      ];

      var allClassSkills = [
        {name:'Amazon', skills:aznSkills},
        {name:'Sorceress', skills:sorSkills},
        {name:'Necromancer', skills:necSkills},
        {name:'Paladin', skills:palSkills},
        {name:'Barbarian', skills:barSkills},
        {name:'Druid', skills:druSkills},
        {name:'Assassin', skills:sinSkills}
      ];

      allClassSkills.forEach(function (cls) {
        lines.push('// --- ' + cls.name + ' Staffmods ---');
        cls.skills.forEach(function (sk) {
          var code = sk[0], name = sk[1], top = sk[2];
          if (top) {
            // Top skills: show +3 always, show +1/+2 at low FILTLVL
            lines.push('ItemDisplay[!UNI !SET !RW ' + code + '=3]: %ORANGE%+3 ' + name + ' %NAME%{%NAME%}%CONTINUE%');
            lines.push('ItemDisplay[!UNI !SET !RW ' + code + '=2 FILTLVL<3]: %GREEN%+2 ' + name + ' %NAME%{%NAME%}%CONTINUE%');
            lines.push('ItemDisplay[!UNI !SET !RW ' + code + '=1 FILTLVL<2]: %GREEN%+1 ' + name + ' %NAME%{%NAME%}%CONTINUE%');
          } else {
            // Non-top skills: only show at low FILTLVL
            lines.push('ItemDisplay[!UNI !SET !RW ' + code + '=3 FILTLVL<3]: %GREEN%+3 ' + name + ' %NAME%{%NAME%}%CONTINUE%');
            lines.push('ItemDisplay[!UNI !SET !RW ' + code + '=2 FILTLVL<2]: %GREEN%+2 ' + name + ' %NAME%{%NAME%}%CONTINUE%');
            lines.push('ItemDisplay[!UNI !SET !RW ' + code + '=1 FILTLVL<2]: %GREEN%+1 ' + name + ' %NAME%{%NAME%}%CONTINUE%');
          }
        });
        lines.push('');
      });
      } // end wantStaffmods

      // ==========================
      // 13d. CLASS-SPECIFIC ITEMS
      // ==========================
      if (selectedClasses.length > 0) {
        lines.push('// ============================================================');
        lines.push('// CLASS-SPECIFIC ITEMS (' + selectedClasses.join(', ') + ')');
        lines.push('// ============================================================');
        selectedClasses.forEach(function (cls) {
          lines.push('ItemDisplay[UNI !ID ' + cls + ']: %GOLD%%NAME%' + descStr);
          lines.push('ItemDisplay[' + cls + ' RARE ELT]: %YELLOW%%NAME%' + descStr);
          lines.push('ItemDisplay[' + cls + ' MAG ELT]: %BLUE%%NAME%' + descStr);
        });
        if (hasClass('DIN')) {
          lines.push('// Paladin shields with +All Res');
          lines.push('ItemDisplay[NMAG !INF (pa3 OR pa4 OR pa5 OR pa7 OR pad) SOCK>1 ELT]: %GOLD%RW Base: %WHITE%%NAME% %GRAY%[%SOCKETS%os]' + rwNotify);
          lines.push('ItemDisplay[NMAG !INF (pa3 OR pa4 OR pa5 OR pa7 OR pad) SOCK=0 ELT]: %GOLD%Larzuk: %WHITE%%NAME% %GRAY%[Max:%MAXSOCKETS%]');
          lines.push('// Paladin scepters (Caduceus line)');
          lines.push('ItemDisplay[NMAG !INF SOCK>0 (scp OR 9sc OR 7sc OR gsc OR 9qs OR 7qs OR wsp OR 9ws OR 7ws) ELT]: %GRAY%%SOCKETS%os %WHITE%%NAME%');
          lines.push('// Griswold\'s Legacy set');
          lines.push('ItemDisplay[SET !ID (xar OR urn OR 7ws OR paf)]: %GREEN%%NAME%' + descStr);
        }
        if (hasClass('NEC')) {
          lines.push('// Necromancer heads');
          lines.push('ItemDisplay[NMAG !INF SOCK>0 (nea OR ned OR nef OR neg OR neh) ELT]: %GRAY%%SOCKETS%os %WHITE%%NAME%');
          lines.push('// Necromancer wands');
          lines.push('ItemDisplay[NMAG !INF SOCK>0 (wnd OR ywn OR bwn OR gwn OR 9wn OR 9yw OR 9bw OR 9gw OR 7wn OR 7yw OR 7bw OR 7gw) ELT]: %GRAY%%SOCKETS%os %WHITE%%NAME%');
          lines.push('// Trang-Oul\'s Avatar set');
          lines.push('ItemDisplay[SET !ID (uh9 OR xul OR ne9 OR utc OR xmg)]: %GREEN%%NAME%' + descStr);
        }
        if (hasClass('SOR')) {
          lines.push('// Sorceress orbs');
          lines.push('ItemDisplay[NMAG !INF SOCK>0 (ob6 OR ob7 OR ob8 OR ob9 OR oba) ELT]: %GRAY%%SOCKETS%os %WHITE%%NAME%');
          lines.push('// Tal Rasha\'s Wrappings set');
          lines.push('ItemDisplay[SET !ID (oba OR xsk OR uth OR zmb)]: %GREEN%%NAME%' + descStr);
        }
        if (hasClass('BAR')) {
          lines.push('// Barbarian helms');
          lines.push('ItemDisplay[NMAG !INF SOCK>0 (baa OR bab OR bac OR bad OR bae) ELT]: %GRAY%%SOCKETS%os %WHITE%%NAME%');
          lines.push('// Barbarian weapons — 2H axes, mauls, 2H swords, maces, flails, war hammers');
          lines.push('ItemDisplay[NMAG !INF SOCK>0 (gax OR 9ga OR 7ga OR mau OR 9m9 OR 7m7 OR flb OR 9fb OR 7fb OR gsd OR 9gd OR 7gd OR gix OR 9gi OR 7gi OR whm OR 9wh OR 7wh OR gma OR 9gm OR 7gm OR gis OR 9gs OR 7gs OR btx OR 9bt OR 7bt OR mac OR 9ma OR 7ma OR mst OR 9mt OR 7mt OR fla OR 9fl OR 7fl) ELT]: %GRAY%%SOCKETS%os %WHITE%%NAME%');
          lines.push('// Barbarian weapons — pikes, glaives, pilums, spears, throwing spears');
          lines.push('ItemDisplay[NMAG !INF SOCK>0 (pik OR 9p9 OR 7p7 OR glv OR 9gl OR 7gl OR pil OR 9pi OR 7pi OR ssp OR 9s9 OR 7s7 OR tsp OR 9ts OR 7ts) ELT]: %GRAY%%SOCKETS%os %WHITE%%NAME%');
          lines.push('// Immortal King set');
          lines.push('ItemDisplay[SET !ID (ba5 OR 7m7 OR uar OR zhb OR xhg OR xhb)]: %GREEN%%NAME%' + descStr);
        }
        if (hasClass('DRU')) {
          lines.push('// Druid pelts');
          lines.push('ItemDisplay[NMAG !INF SOCK>0 (dra OR drb OR drc OR drd OR dre) ELT]: %GRAY%%SOCKETS%os %WHITE%%NAME%');
          lines.push('// Druid clubs');
          lines.push('ItemDisplay[NMAG !INF SOCK>0 (clb OR 9cl OR 7cl OR spc OR 9sp OR 7sp) ELT]: %GRAY%%SOCKETS%os %WHITE%%NAME%');
          lines.push('// Aldur\'s Watchtower set');
          lines.push('ItemDisplay[SET !ID (dr8 OR xtb OR uul OR 9mt)]: %GREEN%%NAME%' + descStr);
        }
        if (hasClass('ZON')) {
          lines.push('// Amazon javelins / bows');
          lines.push('ItemDisplay[NMAG !INF SOCK>0 (ama OR amb OR amc OR amd OR ame) ELT]: %GRAY%%SOCKETS%os %WHITE%%NAME%');
          lines.push('// Amazon quivers');
          lines.push('ItemDisplay[RARE QUIVER !ID]: %YELLOW%%NAME%' + descStr);
          lines.push('ItemDisplay[MAG QUIVER !ID]: %BLUE%%NAME%');
          lines.push('// M\'avina\'s Battle Hymn set');
          lines.push('ItemDisplay[SET !ID (ci3 OR amc OR uld OR xtg OR zvb)]: %GREEN%%NAME%' + descStr);
        }
        if (hasClass('SIN')) {
          lines.push('// Assassin claws');
          lines.push('ItemDisplay[NMAG !INF SOCK>0 (9lw OR 9tw OR 9qr OR 7lw OR 7tw OR 7qr) ELT]: %GRAY%%SOCKETS%os %WHITE%%NAME%');
          lines.push('// Natalya\'s Odium set');
          lines.push('ItemDisplay[SET !ID (xh9 OR 7qr OR ucl OR xmb)]: %GREEN%%NAME%' + descStr);
        }
        lines.push('');
      }

      // 13e. WEAPON BASE SPEED & RANGE
      if (wantWpnSpeed) {
        lines.push('// ============================================================');
        lines.push('// WEAPON BASE SPEED & RANGE');
        lines.push('// ============================================================');
        lines.push('ItemDisplay[WEAPON !BOW !XBOW !WAND !SOR]: %NAME%{%CL%%WHITE%Base Speed: %WPNSPD% || Range: +%RANGE%}%CONTINUE%');
        lines.push('ItemDisplay[WEAPON (BOW OR XBOW)]: %NAME%{%CL%%WHITE%Base Speed: %WPNSPD%}%CONTINUE%');
      }
      lines.push('');

      // ==========================
      // 13d. UNID MAGIC/RARE CLASS ITEM DISPLAY (from HiimFilter)
      // ==========================
      lines.push('// ============================================================');
      lines.push('// UNID MAGIC & RARE CLASS ITEM DISPLAY');
      lines.push('// ============================================================');
      var classUpperMap = {ZON:'ZON',SOR:'SOR',NEC:'NEC',DIN:'DIN',BAR:'BAR',DRU:'DRU',SIN:'SIN'};
      var clNumMap = {ZON:'CL7',SOR:'CL6',NEC:'CL4',DIN:'CL3',BAR:'CL2',DRU:'CL1',SIN:'CL5'};
      if (selectedClasses.length > 0) {
        lines.push('// Your class magic items get extra callout');
        selectedClasses.forEach(function (cls) {
          var classUpper = classUpperMap[cls];
          var clNum = clNumMap[cls];
          lines.push('ItemDisplay[' + classUpper + ' ' + clNum + ' FILTLVL<2 MAG !ID]: %BLUE%** %NAME% **');
          lines.push('ItemDisplay[' + classUpper + ' ' + clNum + ' FILTLVL<5 RARE !ID]: %YELLOW%** %NAME% **');
        });
      }
      if (wantShortNames) {
        // Class item rename on ground at strict levels
        lines.push('// Class item shortnames on ground at strict levels');
        if (selectedClasses.length === 0 || hasClass('NEC')) lines.push('ItemDisplay[(MAG OR RARE) NEC !ID GROUND FILTLVL>2]: Nec Head%CONTINUE%');
        if (selectedClasses.length === 0 || hasClass('SOR')) lines.push('ItemDisplay[(MAG OR RARE) SOR !ID GROUND FILTLVL>2]: Sorc Orb%CONTINUE%');
        if (selectedClasses.length === 0 || hasClass('BAR')) lines.push('ItemDisplay[(MAG OR RARE) BAR !ID GROUND FILTLVL>2]: Barb Helm%CONTINUE%');
        if (selectedClasses.length === 0 || hasClass('DRU')) lines.push('ItemDisplay[(MAG OR RARE) DRU !ID GROUND FILTLVL>2]: Druid Pelt%CONTINUE%');
        if (selectedClasses.length === 0 || hasClass('DIN')) lines.push('ItemDisplay[(MAG OR RARE) DIN !ID GROUND FILTLVL>2]: Pala Shield%CONTINUE%');
        if (selectedClasses.length === 0 || hasClass('SIN')) lines.push('ItemDisplay[(MAG OR RARE) SIN !ID GROUND FILTLVL>2]: Sin Claw%CONTINUE%');
        if (selectedClasses.length === 0 || hasClass('ZON')) lines.push('ItemDisplay[(MAG OR RARE) ZON !ID GROUND FILTLVL>2]: Zon Weapon%CONTINUE%');
      }
      // General magic/rare unid display by slot (from HiimFilter FILTLVL-gated)
      lines.push('// --- Unid magic/rare by slot ---');
      lines.push('ItemDisplay[RARE (rin OR amu) !ID]: %YELLOW%%NAME%');
      lines.push('ItemDisplay[RARE jew !ID]: %YELLOW%%NAME%');
      lines.push('ItemDisplay[RARE (CIRC OR EQ7) !ID]: %YELLOW%%NAME%');
      lines.push('ItemDisplay[MAG jew !ID ILVL>84]: %BLUE%%NAME%' + (wantMapIcons ? '%DOT-9A%' : ''));
      lines.push('ItemDisplay[MAG jew !ID]: %BLUE%%NAME%');
      lines.push('ItemDisplay[MAG (rin OR amu) !ID FILTLVL<3]: %BLUE%%NAME%');
      lines.push('ItemDisplay[MAG (CIRC OR EQ7) !ID]: %BLUE%%NAME%');
      // Necro heads — always show magic and rare
      lines.push('ItemDisplay[RARE NEC !ID]: %YELLOW%%NAME%');
      lines.push('ItemDisplay[MAG NEC !ID]: %BLUE%%NAME%');
      // Sorc orbs — always show rare
      lines.push('ItemDisplay[RARE SOR !ID]: %YELLOW%%NAME%');
      lines.push('');

      // ==========================
      // 14. RUNEWORD BASES
      // ==========================
      if (rwBases !== 'none') {
        lines.push('// ============================================================');
        lines.push('// RUNEWORD BASES');
        lines.push('// ============================================================');
        var showEthBases = (rwBases === 'eth' || rwBases === 'all');
        var showNonEthBases = (rwBases === 'all');

        // Helper to push a base rule for eth and/or non-eth
        function pushBase(cond, sockets, baseLabel) {
          if (showEthBases) {
            lines.push('ItemDisplay[NMAG !INF !RW ETH SOCK=' + sockets + ' ' + cond + ']: %WHITE%' + baseLabel + ' %GRAY%ETH %WHITE%%NAME%' + rwNotify);
          }
          if (showNonEthBases) {
            lines.push('ItemDisplay[NMAG !INF !RW !ETH SOCK=' + sockets + ' ' + cond + ']: %GRAY%' + baseLabel + ' %WHITE%%NAME%');
          }
        }

        // Superior ED=15 bases (from Kryszard/Phyx10n — top-tier bases)
        lines.push('// --- Superior ED=15 Bases (best-in-slot) ---');
        if (showEthBases) {
          lines.push('ItemDisplay[NMAG !INF !RW ETH SUP ED=15 ELT CHEST (SOCK=0 OR SOCK>2)]: %GOLD%15ED %GRAY%ETH %WHITE%%NAME%' + rwNotify);
          lines.push('ItemDisplay[NMAG !INF !RW ETH SUP ED=15 ELT POLEARM (SOCK=0 OR SOCK>3)]: %GOLD%15ED %GRAY%ETH %WHITE%%NAME%' + rwNotify);
        }
        lines.push('ItemDisplay[NMAG !INF !RW SUP ED=15 ELT (CHEST OR SHIELD) (SOCK=0 OR SOCK>2)]: %GOLD%15ED %WHITE%%NAME%' + (wantMapIcons ? '%DOT-D6%' : ''));
        lines.push('');

        // GG specific bases (from HiimFilter — high-value eth bases with DEF/skill checks)
        lines.push('// --- GG Specific Bases (high demand) ---');
        if (showEthBases) {
          // Eth elite armors by DEF threshold (Archon Plate, Dusk Shroud, Wire Fleece, etc.)
          lines.push('ItemDisplay[NMAG !INF !RW ETH ELT CHEST (SOCK=0 OR SOCK>2) DEF>849]: %GOLD%GG Base %GRAY%ETH %WHITE%%NAME%' + rwNotify);
          // Eth Berserker Axe (7wa) — top Grief/Beast base
          lines.push('ItemDisplay[NMAG !INF !RW ETH (SOCK=0 OR SOCK>3) 7wa]: %GOLD%GG Base %GRAY%ETH %WHITE%Berserker Axe' + rwNotify);
          // Eth Phase Blade (7cr) — cannot be eth, but include anyway for completeness
          // Eth Colossus Blade/Sword for BotD/Death
          lines.push('ItemDisplay[NMAG !INF !RW ETH (SOCK=0 OR SOCK>3) (7gd OR 7fb)]: %GOLD%GG Base %GRAY%ETH %WHITE%%NAME%' + rwNotify);
          // Eth Feral Claws (7xf) for Chaos — with skill checks
          lines.push('ItemDisplay[NMAG !INF !RW ETH (SOCK=0 OR SOCK=3) 7xf SK263>2 SK252>2]: %GOLD%GG Chaos %GRAY%ETH %WHITE%%NAME%{+3Venom +3WpnBlck}' + rwNotify);
          lines.push('ItemDisplay[NMAG !INF !RW ETH (SOCK=0 OR SOCK=3) 7xf (SK263>2 OR SK252>2)]: %GOLD%Chaos Base %GRAY%ETH %WHITE%%NAME%' + rwNotify);
        }

        // GG Skill-Checked Bases (from HiimFilter)
        // Perfect (all skills) = GG, partial (key skill only) = Good
        lines.push('// --- GG Skill-Checked Bases ---');

        // Chaos claw — perfect: +3 Venom AND +3 Weapon Block; good: either one
        lines.push('// Chaos: Feral Claws (7xf) — Venom (SK263), Weapon Block (SK252)');
        if (showEthBases) {
          lines.push('ItemDisplay[7xf ETH !INF NMAG !RW SK263>2 SK252>2 (SOCK=0 OR SOCK=3)]: %GOLD%GG Chaos %GRAY%ETH %WHITE%%NAME%' + rwNotify);
          lines.push('ItemDisplay[7xf ETH !INF NMAG !RW (SK263>2 OR SK252>2) (SOCK=0 OR SOCK=3)]: %WHITE%Chaos Base %GRAY%ETH %WHITE%%NAME%' + (wantMapIcons ? '%DOT-0E%' : ''));
        }
        lines.push('ItemDisplay[7xf !INF NMAG !RW (SK263>2 OR SK252>2 OR SK267>2 OR SK266>2) (SOCK=0 OR SOCK=3)]: %WHITE%Chaos Base %NAME%' + (wantMapIcons ? '%DOT-0E%' : ''));

        // Dominion wand — perfect: +3 Fire Golem + Bone Armor + LR/Revive; good: +3 Lower Res OR +3 Revive
        lines.push('// Dominion: Wands — Lower Res (SK91), Revive (SK95), Fire Golem (SK94), Bone Armor (SK68)');
        lines.push('ItemDisplay[WAND !(wnd OR ywn OR 9wn) SK94>2 SK68>0 (SK91>0 OR SK95>0) !SOCK=1 NMAG !RW]: %GOLD%GG Dominion %WHITE%%NAME%' + rwNotify);
        lines.push('ItemDisplay[WAND !(wnd OR ywn OR 9wn) (SK91>2 OR SK95>2 OR SK94>2) !SOCK=1 NMAG !RW]: %WHITE%Dominion Base %NAME%' + (wantMapIcons ? '%DOT-0E%' : ''));

        // Infinity staff — perfect: +3 light skill + mastery; good: any +3 light skill
        lines.push('// Infinity: Elite Staves — Nova (SK48), ChrgBolt (SK38), ChainLight (SK53), LightMast (SK63)');
        lines.push('ItemDisplay[(6ls OR 6cs OR 6bs OR 6ws) (SK48>2 OR SK38>2 OR SK53>2) (SK63>0 OR SK54>0) NMAG !RW (SOCK=0 OR SOCK=4)]: %GOLD%GG Infinity %WHITE%%NAME%' + rwNotify);
        lines.push('ItemDisplay[(6ls OR 6cs OR 6bs OR 6ws) (SK48>2 OR SK38>2 OR SK53>2 OR SK63>2) NMAG !RW (SOCK=0 OR SOCK=4)]: %WHITE%Infinity Base %NAME%' + (wantMapIcons ? '%DOT-0E%' : ''));

        // CTA staff — perfect: Enchant + ES + Thunder Storm; good: any 2 of 3
        lines.push('// CTA: War Staves — Enchant (SK58), Energy Shield (SK50), Thunder Storm (SK57)');
        lines.push('ItemDisplay[(wst OR 8ws OR 6ws) SK58>0 (SK50>0 OR SK60>0) SK57>0 !INF NMAG !RW SOCK=5]: %GOLD%GG CTA %WHITE%%NAME%' + rwNotify);
        lines.push('ItemDisplay[(wst OR 8ws OR 6ws) (SK58>0 OR SK57>0) (SK50>0 OR SK60>0) !INF NMAG !RW SOCK=5]: %WHITE%CTA Base %NAME%' + (wantMapIcons ? '%DOT-0E%' : ''));

        // Memory staff — perfect: +3 TStorm + +3 LightMast + ES; good: +3 TStorm + +3 LightMast
        lines.push('// Memory: Staves — Thunder Storm (SK57), Lightning Mastery (SK63), Energy Shield (SK50)');
        lines.push('ItemDisplay[STAFF SK57>2 SK63>2 (SK50>0 OR SK60>0) !INF NMAG !RW SOCK=4]: %GOLD%GG Memory %WHITE%%NAME%' + rwNotify);
        lines.push('ItemDisplay[STAFF SK57>2 SK63>2 !INF NMAG !RW SOCK=4]: %WHITE%Memory Base %NAME%' + (wantMapIcons ? '%DOT-0E%' : ''));

        // Obsession staff — perfect: +3 Meteor/FireMast + +3 Warmth; good: any +3
        lines.push('// Obsession: Archon Staff (6ws) — Meteor (SK56), Fire Mastery (SK62), Warmth (SK61)');
        lines.push('ItemDisplay[6ws (SK56>2 OR SK62>2) SK61>2 NMAG !RW (SOCK=0 OR SOCK=6)]: %GOLD%GG Obsession %WHITE%%NAME%' + rwNotify);
        lines.push('ItemDisplay[6ws (SK56>2 OR SK62>2 OR SK61>2) NMAG !RW (SOCK=0 OR SOCK=6)]: %WHITE%Obsession Base %NAME%' + (wantMapIcons ? '%DOT-0E%' : ''));
        lines.push('');

        // Phase Blade (7cr) — always show, cannot be eth, fixed speed
        lines.push('ItemDisplay[NMAG !INF !RW (SOCK=0 OR SOCK>3) 7cr]: %WHITE%Phase Blade %GRAY%[%SOCKETS%os]' + (wantMapIcons ? '%DOT-D6%' : ''));
        // Monarch (uit) — Spirit base
        lines.push('ItemDisplay[NMAG !INF !RW (SOCK=0 OR SOCK=4) uit]: %WHITE%Monarch %GRAY%[%SOCKETS%os]' + (wantMapIcons ? '%DOT-D6%' : ''));
        // Diadem (ci3) — imbue/runeword base
        lines.push('ItemDisplay[NMAG !INF !RW ci3]: %WHITE%Diadem %GRAY%[%SOCKETS%os]' + (wantMapIcons ? '%DOT-D6%' : ''));
        // Crystal Sword removed — Monarch is the endgame Spirit base
        // Flail (fla) — HotO base
        lines.push('ItemDisplay[NMAG !INF !RW (SOCK=0 OR SOCK=4) fla]: %WHITE%Flail %GRAY%[%SOCKETS%os]');
        // Caduceus (7ws) — HoJ/CTA scepter base with skill checks
        lines.push('ItemDisplay[NMAG !INF !RW (SOCK=0 OR SOCK>3) 7ws]: %WHITE%Caduceus %GRAY%[%SOCKETS%os]');
        // Archon Staff (6ws) — Infinity/Obsession staff base
        lines.push('ItemDisplay[NMAG !INF !RW (SOCK=0 OR SOCK>3) 6ws]: %WHITE%Archon Staff %GRAY%[%SOCKETS%os]');
        lines.push('');

        // Elite armor bases (generic — catches remaining)
        lines.push('// --- Elite Armor Bases ---');
        pushBase('CHEST ELT', '4', '4os');
        pushBase('CHEST ELT', '3', '3os');
        pushBase('(HELM OR CIRC) ELT', '3', '3os');

        // Elite weapon bases
        lines.push('// --- Elite Weapon Bases ---');
        pushBase('POLEARM ELT', '4', '4os');
        pushBase('POLEARM ELT', '5', '5os');
        pushBase('SWORD ELT', '5', '5os');
        pushBase('SWORD ELT', '6', '6os');
        pushBase('SWORD ELT', '4', '4os');
        pushBase('AXE ELT', '4', '4os');
        pushBase('AXE ELT', '5', '5os');
        pushBase('MACE ELT', '5', '5os');
        pushBase('MACE ELT', '4', '4os');

        // Shield bases (always show regardless of eth preference)
        lines.push('// --- Shield Bases ---');
        lines.push('ItemDisplay[NMAG !INF !RW SOCK=4 SHIELD ELT]: %GRAY%4os %WHITE%%NAME%');
        lines.push('ItemDisplay[NMAG !INF !RW SOCK=3 SHIELD ELT]: %GRAY%3os %WHITE%%NAME%');

        // Starter bases (shown at relaxed FILTLVL only)
        lines.push('// --- Starter Bases ---');
        lines.push('ItemDisplay[NMAG !INF !RW SOCK=4 CHEST EXC FILTLVL<2]: %WHITE%%NAME%');
        lines.push('ItemDisplay[NMAG !INF !RW SOCK=3 CHEST FILTLVL<3]: %WHITE%%NAME%');
        lines.push('ItemDisplay[NMAG !INF !RW SOCK=4 POLEARM EXC FILTLVL<2]: %WHITE%%NAME%');
        lines.push('ItemDisplay[NMAG !INF !RW SOCK=4 POLEARM ELT FILTLVL<3]: %WHITE%%NAME%');

        // 0-socket bases for Larzuk quest
        lines.push('// --- Unsocketed Elite Bases (Larzuk Quest) ---');
        if (showEthBases) {
          lines.push('ItemDisplay[RWBASE ETH ELT SOCK=0 MAXSOCKETS>3 CHEST]: %WHITE%Larzuk: %GRAY%ETH %WHITE%%NAME% %GRAY%[Max:%MAXSOCKETS%]' + rwNotify);
          lines.push('ItemDisplay[RWBASE ETH ELT SOCK=0 MAXSOCKETS>3 POLEARM]: %WHITE%Larzuk: %GRAY%ETH %WHITE%%NAME% %GRAY%[Max:%MAXSOCKETS%]' + rwNotify);
          lines.push('ItemDisplay[RWBASE ETH ELT SOCK=0 MAXSOCKETS>3 SWORD]: %WHITE%Larzuk: %GRAY%ETH %WHITE%%NAME% %GRAY%[Max:%MAXSOCKETS%]');
        }
        if (showNonEthBases) {
          lines.push('ItemDisplay[RWBASE !ETH ELT SOCK=0 MAXSOCKETS>3 CHEST]: %GRAY%Larzuk: %WHITE%%NAME% %GRAY%[Max:%MAXSOCKETS%]');
          lines.push('ItemDisplay[RWBASE !ETH ELT SOCK=0 MAXSOCKETS>3 POLEARM]: %GRAY%Larzuk: %WHITE%%NAME% %GRAY%[Max:%MAXSOCKETS%]');
          lines.push('ItemDisplay[RWBASE !ETH ELT SOCK=0 MAXSOCKETS>3 SWORD]: %GRAY%Larzuk: %WHITE%%NAME% %GRAY%[Max:%MAXSOCKETS%]');
        }
        lines.push('');
      }

      // ==========================
      // 15. CONSUMABLES (gold, potions, scrolls, keys)
      // ==========================
      lines.push('// ============================================================');
      lines.push('// CONSUMABLES & GOLD');
      lines.push('// ============================================================');

      // Gold: scaled by CLVL (Wolfie pattern)
      if (c.consumables.indexOf('hidegold') !== -1) {
        lines.push('// --- Gold Hiding (scaled by CLVL) ---');
        lines.push('ItemDisplay[GOLD<25]:');
        lines.push('ItemDisplay[GOLD<50 CLVL>9]:');
        lines.push('ItemDisplay[GOLD<100 CLVL>19]:');
        lines.push('ItemDisplay[GOLD<200 CLVL>29]:');
        lines.push('ItemDisplay[GOLD<300 CLVL>39]:');
        lines.push('ItemDisplay[GOLD<500 CLVL>49]:');
        lines.push('ItemDisplay[GOLD<1000 CLVL>59]:');
        lines.push('ItemDisplay[GOLD<3000 CLVL>69]:');
        lines.push('ItemDisplay[GOLD<5000 CLVL>79]:');
      }
      lines.push('ItemDisplay[GOLD>0]: %NAME%');

      // Potions: hide by DIFF (Wolfie pattern)
      lines.push('// --- Potion Hiding ---');
      // Health potions
      if (c.consumables.indexOf('hideallhp') !== -1) {
        lines.push('ItemDisplay[hp1]:');
        lines.push('ItemDisplay[hp2]:');
        lines.push('ItemDisplay[hp3]:');
        lines.push('ItemDisplay[hp4]:');
        lines.push('ItemDisplay[hp5]:');
      } else {
        if (c.consumables.indexOf('hidepots') !== -1) {
          lines.push('ItemDisplay[hp1 DIFF>0]:');
          lines.push('ItemDisplay[hp2 DIFF>0]:');
          lines.push('ItemDisplay[hp3 DIFF>0]:');
          lines.push('ItemDisplay[hp4 DIFF>1]:');
        }
        lines.push('ItemDisplay[hp1]: %RED%+%WHITE%HP1');
        lines.push('ItemDisplay[hp2]: %RED%+%WHITE%HP2');
        lines.push('ItemDisplay[hp3]: %RED%+%WHITE%HP3');
        lines.push('ItemDisplay[hp4]: %RED%+%WHITE%HP4');
        lines.push('ItemDisplay[hp5]: %RED%+%WHITE%HP5');
      }
      // Mana potions
      if (c.consumables.indexOf('hideallmp') !== -1) {
        lines.push('ItemDisplay[mp1]:');
        lines.push('ItemDisplay[mp2]:');
        lines.push('ItemDisplay[mp3]:');
        lines.push('ItemDisplay[mp4]:');
        lines.push('ItemDisplay[mp5]:');
      } else {
        if (c.consumables.indexOf('hidepots') !== -1) {
          lines.push('ItemDisplay[mp1 DIFF>0]:');
          lines.push('ItemDisplay[mp2 DIFF>0]:');
          lines.push('ItemDisplay[mp3 DIFF>0]:');
          lines.push('ItemDisplay[mp4 DIFF>1]:');
        }
        lines.push('ItemDisplay[mp1]: %BLUE%+%WHITE%MP1');
        lines.push('ItemDisplay[mp2]: %BLUE%+%WHITE%MP2');
        lines.push('ItemDisplay[mp3]: %BLUE%+%WHITE%MP3');
        lines.push('ItemDisplay[mp4]: %BLUE%+%WHITE%MP4');
        lines.push('ItemDisplay[mp5]: %BLUE%+%WHITE%MP5');
      }
      // Rejuvenation potions
      lines.push('ItemDisplay[rvs FILTLVL>3]:');
      lines.push('ItemDisplay[rvs]: %PURPLE%+%WHITE%35%%');
      lines.push('ItemDisplay[rvl]: %PURPLE%+%WHITE%65%%');
      // PvP mana potion
      lines.push('ItemDisplay[pvpp]: %BLUE%+%WHITE%DMP');
      // Antidote and thawing
      lines.push('ItemDisplay[yps]: %GREEN%+%WHITE%Anti');
      lines.push('ItemDisplay[wms]: %GREEN%+%WHITE%Thaw');
      // Stamina potion
      lines.push('ItemDisplay[vps DIFF>1]:');
      lines.push('ItemDisplay[vps]: %WHITE%Stam');
      // Throwing potions (hidden progressively — from Kryszard)
      lines.push('// --- Throwing Potions ---');
      lines.push('ItemDisplay[THROWPOTS CLVL>29]:');
      lines.push('ItemDisplay[THROWPOTS]: %NAME%');

      // Tomes (refill warning from Wolfie)
      lines.push('// --- Tomes ---');
      lines.push('ItemDisplay[ibk QTY<5]: %RED%! %WHITE%ID %RED%REFILL !');
      lines.push('ItemDisplay[ibk]: %RED%!%WHITE%ID%RED%!');
      lines.push('ItemDisplay[tbk QTY<5]: %BLUE%! %WHITE%TP %RED%REFILL %BLUE%!');
      lines.push('ItemDisplay[tbk]: %BLUE%!%WHITE%TP%BLUE%!');

      // Scrolls and keys
      lines.push('// --- Scrolls & Keys ---');
      if (c.consumables.indexOf('hidescrolls') !== -1) {
        lines.push('ItemDisplay[isc DIFF>0]:');
        lines.push('ItemDisplay[tsc DIFF>0]:');
      }
      lines.push('ItemDisplay[isc]: %WHITE%ID');
      lines.push('ItemDisplay[tsc]: %WHITE%TP');

      if (c.consumables.indexOf('hidekeys') !== -1) {
        lines.push('ItemDisplay[key DIFF>0]:');
      }
      lines.push('ItemDisplay[key]: %GRAY%Key');
      lines.push('');

      // ==========================
      // 15b-pre. IDENTIFIED ITEM STAT DISPLAY (from HiimFilter/Phyx10n)
      // ==========================
      lines.push('// ============================================================');
      lines.push('// IDENTIFIED ITEM STAT DISPLAY');
      lines.push('// ============================================================');
      // Key combat stats on identified magic/rare/craft items
      lines.push('// --- Combat Stats ---');
      lines.push('ItemDisplay[(ARMOR OR WEAPON OR rin OR amu) (MAG OR RARE OR CRAFT) ID FCR>0]: %TAN%%STAT105%FCR %NAME%%CONTINUE%{%NAME%}');
      lines.push('ItemDisplay[(ARMOR OR WEAPON OR rin OR amu) (MAG OR RARE OR CRAFT) ID IAS>0 !WAND !SOR]: %ORANGE%%STAT93%IAS %NAME%%CONTINUE%{%NAME%}');
      lines.push('ItemDisplay[(ARMOR OR WEAPON OR rin OR amu) (MAG OR RARE OR CRAFT) ID FHR>0]: %GOLD%%STAT99%FHR %NAME%%CONTINUE%{%NAME%}');
      lines.push('ItemDisplay[(ARMOR OR WEAPON OR rin OR amu) (MAG OR RARE OR CRAFT) ID FRW>0]: %GOLD%%STAT96%FRW %NAME%%CONTINUE%{%NAME%}');
      lines.push('ItemDisplay[(ARMOR OR WEAPON OR rin OR amu) (MAG OR RARE OR CRAFT) ID FBR>0]: %ORANGE%%STAT102%FBR %NAME%%CONTINUE%{%NAME%}');
      // Resistances
      lines.push('// --- Resistances ---');
      lines.push('ItemDisplay[(ARMOR OR rin OR amu) (MAG OR RARE OR CRAFT) ID RES>0]: %PURPLE%%RES%Res %NAME%%CONTINUE%{%NAME%}');
      // Life/Mana
      lines.push('// --- Life & Mana ---');
      lines.push('ItemDisplay[(ARMOR OR rin OR amu) (MAG OR RARE OR CRAFT) ID LIFE>29]: %RED%+%STAT7%Life %NAME%%CONTINUE%{%NAME%}');
      lines.push('ItemDisplay[(ARMOR OR rin OR amu) (MAG OR RARE OR CRAFT) ID MANA>19]: %BLUE%+%STAT9%Mana %NAME%%CONTINUE%{%NAME%}');
      // Damage stats
      lines.push('// --- Damage ---');
      lines.push('ItemDisplay[WEAPON (MAG OR RARE OR CRAFT) ID EDAM>149]: %RED%%EDAM%ED %NAME%%CONTINUE%{%NAME%}');
      lines.push('ItemDisplay[(ARMOR OR rin OR amu) (MAG OR RARE OR CRAFT) ID STAT80>0]: %GREEN%%STAT80%MF %NAME%%CONTINUE%{%NAME%}');
      // Skills on identified items
      lines.push('// --- Skills ---');
      lines.push('ItemDisplay[ID (MAG OR RARE OR CRAFT) CLSK0>0]: %PURPLE%%CLSK0%ZonSk %NAME%%CONTINUE%{%NAME%}');
      lines.push('ItemDisplay[ID (MAG OR RARE OR CRAFT) CLSK1>0]: %PURPLE%%CLSK1%SorSk %NAME%%CONTINUE%{%NAME%}');
      lines.push('ItemDisplay[ID (MAG OR RARE OR CRAFT) CLSK2>0]: %PURPLE%%CLSK2%NecSk %NAME%%CONTINUE%{%NAME%}');
      lines.push('ItemDisplay[ID (MAG OR RARE OR CRAFT) CLSK3>0]: %PURPLE%%CLSK3%PalSk %NAME%%CONTINUE%{%NAME%}');
      lines.push('ItemDisplay[ID (MAG OR RARE OR CRAFT) CLSK4>0]: %PURPLE%%CLSK4%BarSk %NAME%%CONTINUE%{%NAME%}');
      lines.push('ItemDisplay[ID (MAG OR RARE OR CRAFT) CLSK5>0]: %PURPLE%%CLSK5%DruSk %NAME%%CONTINUE%{%NAME%}');
      lines.push('ItemDisplay[ID (MAG OR RARE OR CRAFT) CLSK6>0]: %PURPLE%%CLSK6%SinSk %NAME%%CONTINUE%{%NAME%}');
      // Corruption type display (from HiimFilter)
      lines.push('// --- Corruption Types ---');
      lines.push('ItemDisplay[STAT360=27]: %NAME% +1Skill%CONTINUE%{%NAME%}');
      lines.push('ItemDisplay[STAT360=50]: %NAME% +1Skill%CONTINUE%{%NAME%}');
      lines.push('ItemDisplay[STAT360=45]: %NAME% CBF%CONTINUE%{%NAME%}');
      lines.push('ItemDisplay[STAT360=16]: %NAME% FCR%CONTINUE%{%NAME%}');
      lines.push('ItemDisplay[STAT360=42]: %NAME% FCR%CONTINUE%{%NAME%}');
      lines.push('ItemDisplay[STAT360=72]: %NAME% MaxRes%CONTINUE%{%NAME%}');
      lines.push('ItemDisplay[STAT360=52]: %NAME% PDR%CONTINUE%{%NAME%}');
      lines.push('ItemDisplay[STAT360=19]: %NAME% DS%CONTINUE%{%NAME%}');
      lines.push('ItemDisplay[STAT360=25]: %NAME% ED-DS%CONTINUE%{%NAME%}');
      // Desecrated items (from HiimFilter)
      lines.push('// --- Desecrated Items ---');
      lines.push('ItemDisplay[STAT206>0 GROUND]: %BORDER-55%%MAP-58%%GOLD%Desecrated %NAME%');
      lines.push('ItemDisplay[STAT206>0]: %NAME% %GOLD%[D]%CONTINUE%{%NAME%}');
      // Weapon ED color coding (from HiimFilter)
      lines.push('// --- Weapon ED tiers ---');
      lines.push('ItemDisplay[WEAPON (MAG OR RARE OR CRAFT) ID EDAM>299]: %PURPLE%%EDAM%ED %NAME%%CONTINUE%{%NAME%}');
      lines.push('ItemDisplay[WEAPON (MAG OR RARE OR CRAFT) ID EDAM>199]: %ORANGE%%EDAM%ED %NAME%%CONTINUE%{%NAME%}');
      // Chest DEF display
      lines.push('ItemDisplay[CHEST (MAG OR RARE OR CRAFT) ID DEF>400]: %TAN%%DEF%Def %NAME%%CONTINUE%{%NAME%}');
      lines.push('');

      // ==========================
      // 15b. INFERIOR ITEM HIDING
      // ==========================
      lines.push('// ============================================================');
      lines.push('// INFERIOR ITEM HIDING');
      lines.push('// ============================================================');
      lines.push('ItemDisplay[!RW INF ID (ARMOR OR WEAPON) CLVL>10]:');
      lines.push('');

      // ==========================
      // 15c. SOCKET CUBE RECIPES (from Wolfie/Kryszard)
      // ==========================
      if (wantSocketRecipe) {
        lines.push('// ============================================================');
        lines.push('// SOCKET CUBE RECIPES -- shown on unsocketed bases');
        lines.push('// ============================================================');
        lines.push('ItemDisplay[CHEST !INF SOCK=0 NMAG !RW !SHOP]: %NAME%{%WHITE%Tal + Thul + Perf %YELLOW%Topaz%CL%%TAN%Socket Recipe:}%CONTINUE%');
        lines.push('ItemDisplay[(HELM OR CIRC) !INF SOCK=0 NMAG !RW !SHOP !BAR !DRU]: %NAME%{%WHITE%Ral + Thul + Perf %BLUE%Sapphire%CL%%TAN%Socket Recipe:}%CONTINUE%');
        lines.push('ItemDisplay[(SHIELD OR QUIVER) !INF SOCK=0 NMAG !RW !SHOP !DIN !NEC]: %NAME%{%WHITE%Tal + Amn + Perf %RED%Ruby%CL%%TAN%Socket Recipe:}%CONTINUE%');
        lines.push('ItemDisplay[(WEAPON !THROWING) !INF SOCK=0 NMAG !RW !SHOP]: %NAME%{%WHITE%Ral + Amn + Perf %PURPLE%Amethyst%CL%%TAN%Socket Recipe:}%CONTINUE%');
        lines.push('ItemDisplay[DIN !INF SOCK=0 NMAG !RW !SHOP]: %NAME%{%WHITE%Tal + Amn + Perf %RED%Ruby%CL%%TAN%Socket Recipe:}%CONTINUE%');
        lines.push('ItemDisplay[NEC !INF SOCK=0 NMAG !RW !SHOP]: %NAME%{%WHITE%Tal + Amn + Perf %RED%Ruby%CL%%TAN%Socket Recipe:}%CONTINUE%');
        lines.push('ItemDisplay[BAR !INF SOCK=0 NMAG !RW !SHOP]: %NAME%{%WHITE%Ral + Thul + Perf %BLUE%Sapphire%CL%%TAN%Socket Recipe:}%CONTINUE%');
        lines.push('ItemDisplay[DRU !INF SOCK=0 NMAG !RW !SHOP]: %NAME%{%WHITE%Ral + Thul + Perf %BLUE%Sapphire%CL%%TAN%Socket Recipe:}%CONTINUE%');
        lines.push('ItemDisplay[SIN !INF SOCK=0 NMAG !RW !SHOP]: %NAME%{%WHITE%Ral + Amn + Perf %PURPLE%Amethyst%CL%%TAN%Socket Recipe:}%CONTINUE%');
        lines.push('ItemDisplay[SOR !INF SOCK=0 NMAG !RW !SHOP]: %NAME%{%WHITE%Ral + Amn + Perf %PURPLE%Amethyst%CL%%TAN%Socket Recipe:}%CONTINUE%');
        lines.push('ItemDisplay[ZON BOW !INF SOCK=0 NMAG !RW !SHOP]: %NAME%{%WHITE%Ral + Amn + Perf %PURPLE%Amethyst%CL%%TAN%Socket Recipe:}%CONTINUE%');
        lines.push('');
      }

      // ==========================
      // 15d. SELL VALUE HIGHLIGHT (from Wolfie)
      // ==========================
      if (wantSellValue) {
        lines.push('// ============================================================');
        lines.push('// SELL VALUE HIGHLIGHT -- vendor-worthy items get $ tag');
        lines.push('// ============================================================');
        lines.push('ItemDisplay[RARE !RW SELLPRICE>34999]: %DARK_GREEN%$ %YELLOW%%NAME%{%NAME%}');
        lines.push('ItemDisplay[RARE !RW SELLPRICE>19999 DIFF<2]: %DARK_GREEN%$ %YELLOW%%NAME%{%NAME%}');
        lines.push('ItemDisplay[RARE !RW SELLPRICE>9999 DIFF<1]: %DARK_GREEN%$ %YELLOW%%NAME%{%NAME%}');
        lines.push('ItemDisplay[MAG !RW SELLPRICE>34999]: %DARK_GREEN%$ %BLUE%%NAME%{%NAME%}');
        lines.push('ItemDisplay[MAG !RW SELLPRICE>19999 DIFF<2]: %DARK_GREEN%$ %BLUE%%NAME%{%NAME%}');
        lines.push('ItemDisplay[MAG !RW SELLPRICE>9999 DIFF<1]: %DARK_GREEN%$ %BLUE%%NAME%{%NAME%}');
        lines.push('ItemDisplay[NMAG !RW SELLPRICE>34999]: %DARK_GREEN%$ %WHITE%%NAME%{%NAME%}');
        lines.push('');
      }

      // ==========================
      // 15e. UPGRADE RECIPES (from Wolfie/Kryszard)
      // ==========================
      if (wantUpgradeRecipe) {
        lines.push('// ============================================================');
        lines.push('// UPGRADE RECIPES -- shown on identified items');
        lines.push('// ============================================================');
        // Unique armor upgrades
        lines.push('ItemDisplay[UNI ID NORM ARMOR]: %NAME%{%TAN%Rune + Perf Diamond%NL%Cube w/ Tal, Shael,%NL%%ORANGE%Upgrade Recipe:%CL%}%CONTINUE%');
        lines.push('ItemDisplay[UNI ID EXC ARMOR]: %NAME%{%TAN%Rune + Perf Diamond%NL%Cube w/ Ko, Lem,%NL%%ORANGE%Upgrade Recipe:%CL%}%CONTINUE%');
        lines.push('ItemDisplay[UNI ID NORM WEAPON]: %NAME%{%TAN%Rune + Perf Emerald%NL%Cube w/ Ral, Sol,%NL%%ORANGE%Upgrade Recipe:%CL%}%CONTINUE%');
        lines.push('ItemDisplay[UNI ID EXC WEAPON]: %NAME%{%TAN%Rune + Perf Emerald%NL%Cube w/ Lum, Pul,%NL%%ORANGE%Upgrade Recipe:%CL%}%CONTINUE%');
        // Set armor upgrades
        lines.push('ItemDisplay[SET ID NORM ARMOR]: %NAME%{%TAN%Rune + Perf Diamond%NL%Cube w/ Tal, Shael,%NL%%GREEN%Set Upgrade:%CL%}%CONTINUE%');
        lines.push('ItemDisplay[SET ID EXC ARMOR]: %NAME%{%TAN%Rune + Perf Diamond%NL%Cube w/ Ko, Lem,%NL%%GREEN%Set Upgrade:%CL%}%CONTINUE%');
        lines.push('ItemDisplay[SET ID NORM WEAPON]: %NAME%{%TAN%Rune + Perf Emerald%NL%Cube w/ Ral, Sol,%NL%%GREEN%Set Upgrade:%CL%}%CONTINUE%');
        lines.push('ItemDisplay[SET ID EXC WEAPON]: %NAME%{%TAN%Rune + Perf Emerald%NL%Cube w/ Lum, Pul,%NL%%GREEN%Set Upgrade:%CL%}%CONTINUE%');
        // Rare/Craft armor upgrades
        lines.push('ItemDisplay[RARE ID NORM (ARMOR OR QUIVER)]: %NAME%{%TAN%Rune + Perf Amethyst%NL%Cube w/ Ral, Thul,%NL%%YELLOW%Rare Upgrade:%CL%}%CONTINUE%');
        lines.push('ItemDisplay[RARE ID EXC (ARMOR OR QUIVER)]: %NAME%{%TAN%Rune + Perf Amethyst%NL%Cube w/ Ko, Pul,%NL%%YELLOW%Rare Upgrade:%CL%}%CONTINUE%');
        lines.push('ItemDisplay[RARE ID NORM WEAPON]: %NAME%{%TAN%Rune + Perf Sapphire%NL%Cube w/ Ort, Amn,%NL%%YELLOW%Rare Upgrade:%CL%}%CONTINUE%');
        lines.push('ItemDisplay[RARE ID EXC WEAPON]: %NAME%{%TAN%Rune + Perf Sapphire%NL%Cube w/ Fal, Um,%NL%%YELLOW%Rare Upgrade:%CL%}%CONTINUE%');
        lines.push('ItemDisplay[CRAFT ID NORM (ARMOR OR QUIVER)]: %NAME%{%TAN%Rune + Perf Amethyst%NL%Cube w/ Ral, Thul,%NL%%ORANGE%Craft Upgrade:%CL%}%CONTINUE%');
        lines.push('ItemDisplay[CRAFT ID EXC (ARMOR OR QUIVER)]: %NAME%{%TAN%Rune + Perf Amethyst%NL%Cube w/ Ko, Pul,%NL%%ORANGE%Craft Upgrade:%CL%}%CONTINUE%');
        lines.push('ItemDisplay[CRAFT ID NORM WEAPON]: %NAME%{%TAN%Rune + Perf Sapphire%NL%Cube w/ Ort, Amn,%NL%%ORANGE%Craft Upgrade:%CL%}%CONTINUE%');
        lines.push('ItemDisplay[CRAFT ID EXC WEAPON]: %NAME%{%TAN%Rune + Perf Sapphire%NL%Cube w/ Fal, Um,%NL%%ORANGE%Craft Upgrade:%CL%}%CONTINUE%');
        lines.push('');
      }

      // ==========================
      // 15f. IMBUE / SLAM SUGGESTIONS (from Wolfie/HiimFilter)
      // ==========================
      if (wantImbue) {
        lines.push('// ============================================================');
        lines.push('// IMBUE & SLAM SUGGESTIONS');
        lines.push('// ============================================================');
        lines.push('// Eth bases worth imbuing at Charsi');
        lines.push('ItemDisplay[NMAG ETH !RW SOCK=0 FILTLVL<3 (EQ7 OR lax OR 9la OR 7la OR 7cr OR 9cr OR crs OR 7gl OR 9gl OR glv OR 7wa OR 9wa OR wax OR 7gm OR 9gm OR gma OR 7m7 OR 9m9 OR mau OR 7gd OR 9gd OR gsd OR 7fb OR 9fb OR flb OR 7gi OR 9gi OR gix OR 7wh OR 9wh OR whm OR 7p7 OR 9p9 OR pik OR 7pi OR 9pi OR pil OR 7s7 OR 9s9 OR ssp OR 7ts OR 9ts OR tsp OR axf OR 9xf OR 7xf)]: * * %NAME% * *{%GOLD%Imbue %WHITE%at Charsi for %YELLOW%Rare item%CL%%NAME%}%CONTINUE%');
        lines.push('// Diadem always worth imbuing');
        lines.push('ItemDisplay[ci3 NMAG !ETH SOCK=0]: %NAME%{%TAN%Imbue at Charsi for %YELLOW%Rare Diadem}');
        lines.push('// Non-eth bases can be slammed');
        lines.push('ItemDisplay[NMAG !ETH !RW SOCK=0 ELT (WEAPON OR ARMOR)]: %NAME%{%RED%Slam %WHITE%for chance of %YELLOW%Rare item%CL%%NAME%}%CONTINUE%');
        lines.push('');
      }

      // ==========================
      // 15g. SHOPPING — Affordable Crafting Bases
      // ==========================
      if (wantShopping) {
        lines.push('// ============================================================');
        lines.push('// SHOPPING — Affordable Crafting Bases');
        lines.push('// ============================================================');
        lines.push("ItemDisplay[SHOP MAG BUYPRICE<60000 FILTLVL>2 FILTLVL<8 (CHEST OR STAFF OR SCEPTER OR WAND OR SIN OR CLUB OR bhm OR xh9 OR bsh OR xsh OR lbt OR xlb OR vbt OR xvb)]: %NAME%%SAGE%{%SAGE%Affordable Crafting Base%CL%%NAME%}%CONTINUE%");
        lines.push('');
      }

      // ==========================
      // 15h. SHOPPING — Skill Base Tooltips (+5/6/7 to skill)
      // ==========================
      if (wantSkillBases) {
        lines.push('// ============================================================');
        lines.push('// SHOPPING — Skill Base Tooltips (+5/6/7 to skill)');
        lines.push('// ============================================================');

        var skillData = {
          SOR: [
            {id:49,tab:9,name:'Lightning'},{id:48,tab:9,name:'Nova'},{id:53,tab:9,name:'Chain Lightning'},
            {id:38,tab:9,name:'Charged Bolt'},{id:63,tab:9,name:'Lightning Mastery'},{id:57,tab:9,name:'Thunder Storm'},
            {id:44,tab:10,name:'Frost Nova'},{id:59,tab:10,name:'Blizzard'},{id:64,tab:10,name:'Frozen Orb'},
            {id:369,tab:10,name:'Ice Barrage'},{id:65,tab:10,name:'Cold Mastery'},{id:40,tab:10,name:'Cold Enchant'},
            {id:52,tab:8,name:'Fire Enchant'},{id:376,tab:8,name:'Combustion'},{id:62,tab:8,name:'Hydra'},
            {id:56,tab:8,name:'Meteor'},{id:61,tab:8,name:'Fire Mastery'}
          ],
          NEC: [
            {id:381,tab:16,name:'Dark Pact'},{id:66,tab:16,name:'Amp Damage'},{id:91,tab:16,name:'Lower Res'},
            {id:83,tab:17,name:'Desecrate'},{id:92,tab:17,name:'Psn Nova'},{id:74,tab:17,name:'Corpse Explosion'},
            {id:67,tab:17,name:'Teeth'},{id:84,tab:17,name:'Bone Spear'},{id:93,tab:17,name:'Bone Spirit'},
            {id:94,tab:18,name:'Fire Golem'},{id:75,tab:18,name:'Clay Golem'},{id:85,tab:18,name:'Blood Golem'},
            {id:69,tab:18,name:'Skele Mastery'},{id:70,tab:18,name:'Skele Warrior'},{id:89,tab:18,name:'Skele Archers'},
            {id:80,tab:18,name:'Skele Mages'}
          ],
          DIN: [
            {id:102,tab:25,name:'Holy Fire'},{id:114,tab:25,name:'Holy Freeze'},{id:118,tab:25,name:'Holy Shock'},
            {id:119,tab:25,name:'Sanctuary'},{id:122,tab:25,name:'Fanaticism'},{id:123,tab:25,name:'Conviction'},
            {id:113,tab:25,name:'Concentration'},{id:364,tab:24,name:'Holy Nova'},{id:101,tab:24,name:'Holy Bolt'},
            {id:112,tab:24,name:'Blessed Hammer'},{id:111,tab:24,name:'Vengeance'},{id:117,tab:24,name:'Holy Shield'}
          ],
          BAR: [
            {id:149,tab:34,name:'Battle Orders'},{id:154,tab:34,name:'War Cry'},{id:155,tab:34,name:'Battle Command'},
            {id:150,tab:34,name:'Grim Ward'},{id:146,tab:34,name:'Battle Cry'},{id:368,tab:33,name:'Deep Wounds'}
          ],
          DRU: [
            {id:245,tab:42,name:'Tornado'},{id:240,tab:42,name:'Twister'},{id:229,tab:42,name:'Molten Boulder'},
            {id:234,tab:42,name:'Fissure'},{id:244,tab:42,name:'Volcano'},{id:249,tab:42,name:'Armageddon'},
            {id:250,tab:42,name:'Hurricane'},{id:222,tab:40,name:'Poison Creeper'},{id:221,tab:40,name:'Raven'},
            {id:226,tab:40,name:'Oak Sage'},{id:247,tab:40,name:'Grizzly'},{id:227,tab:40,name:'Spirit Wolf'},
            {id:237,tab:40,name:'Dire Wolf'},{id:236,tab:40,name:'Heart of Wolverine'}
          ],
          SIN: [
            {id:280,tab:50,name:'Phoenix Strike'},{id:254,tab:50,name:'Tiger Strike'},{id:265,tab:50,name:'Cobra Strike'},
            {id:269,tab:50,name:'Claws of Thunder'},{id:259,tab:50,name:'Fists of Fire'},{id:274,tab:50,name:'Blades of Ice'},
            {id:263,tab:48,name:'Venom'},{id:252,tab:48,name:'Weapon Block'},{id:271,tab:48,name:'Shadow Master'},
            {id:267,tab:48,name:'Mind Blast'},{id:277,tab:48,name:'Blade Fury'},{id:264,tab:48,name:'Fade'},
            {id:258,tab:48,name:'Burst of Speed'},{id:253,tab:48,name:'Claw Mastery'}
          ],
          ZON: [
            {id:6,tab:0,name:'Guided Arrow'},{id:11,tab:0,name:'Strafe'},{id:7,tab:0,name:'Multi Shot'},
            {id:22,tab:2,name:'Lightning Fury'},{id:14,tab:2,name:'Plague Javelin'},{id:10,tab:2,name:'Power Strike'},
            {id:20,tab:2,name:'Lightning Strike'},{id:24,tab:2,name:'Charged Strike'}
          ]
        };

        // Class ID mapping for MULTI83 condition
        var classIdMap = {SOR:1, NEC:2, DIN:3, BAR:4, DRU:5, SIN:6, ZON:0};

        selectedClasses.forEach(function(cls) {
          var skills = skillData[cls];
          if (!skills) return;
          var cid = classIdMap[cls];
          lines.push('// --- ' + cls + ' Skill Tooltips ---');
          skills.forEach(function(sk) {
            for (var total = 7; total >= 5; total--) {
              lines.push('ItemDisplay[!RW !UNI !SET ID SK' + sk.id + '>0 (MULTI188,' + sk.tab + '+MULTI83,' + cid + '+MULTI107,' + sk.id + '+STAT127=' + total + ')]: %CONTINUE%%NAME%%BORDER-ED%{%PURPLE%> > > >   +' + total + ' ' + sk.name + '   < < < <%CL%%NAME%}');
            }
          });
          lines.push('');
        });
        // If no classes selected, emit all
        if (selectedClasses.length === 0) {
          Object.keys(skillData).forEach(function(cls) {
            var skills = skillData[cls];
            var cid = classIdMap[cls];
            lines.push('// --- ' + cls + ' Skill Tooltips ---');
            skills.forEach(function(sk) {
              for (var total = 7; total >= 5; total--) {
                lines.push('ItemDisplay[!RW !UNI !SET ID SK' + sk.id + '>0 (MULTI188,' + sk.tab + '+MULTI83,' + cid + '+MULTI107,' + sk.id + '+STAT127=' + total + ')]: %CONTINUE%%NAME%%BORDER-ED%{%PURPLE%> > > >   +' + total + ' ' + sk.name + '   < < < <%CL%%NAME%}');
              }
            });
            lines.push('');
          });
        }
      }

      // ==========================
      // 16. NORMAL & MAGIC ITEM HIDING (FILTLVL-gated)
      // ==========================
      lines.push('// ============================================================');
      lines.push('// NORMAL & MAGIC ITEM HIDING');
      lines.push('// ============================================================');
      // FILTLVL-gated progressive hiding
      // Level 1 (Relaxed): show almost everything
      // Level 2 (Normal): hide normal-tier junk + low magic
      // Level 3 (Strict): hide exceptional bases + most magic
      // Level 4 (Very Strict): hide everything except elite + jewelry + charms
      lines.push('// --- 1-Socket junk (always hide past CLVL 30) ---');
      lines.push('ItemDisplay[NMAG SOCK=1 !RW (ARMOR OR WEAPON) CLVL>30]:');
      lines.push('');
      lines.push('// --- FILTLVL 2+: ---');
      lines.push('ItemDisplay[NMAG !SUP !ETH NORM FILTLVL>1]:');
      lines.push('ItemDisplay[MAG !ID !JEWELRY !CHARM FILTLVL>1]:');
      lines.push('');
      lines.push('// --- FILTLVL 3+: ---');
      lines.push('ItemDisplay[NMAG !SUP !ETH EXC FILTLVL>2]:');
      lines.push('ItemDisplay[RARE !ID FILTLVL>2]:');
      lines.push('');
      lines.push('// --- FILTLVL 4+: Very strict ---');
      lines.push('ItemDisplay[NMAG !ETH !RW !SUP ELT SOCK=0 FILTLVL>3]:');
      lines.push('ItemDisplay[MAG !ID !JEWELRY !CHARM FILTLVL>3]:');
      lines.push('');

      // ==========================
      // ==========================
      // 16b. ALWAYS SHOW — identified quality items & runewords
      // ==========================
      lines.push('// ============================================================');
      lines.push('// ALWAYS SHOW — these should never be hidden by FILTLVL rules');
      lines.push('// ============================================================');
      lines.push('ItemDisplay[UNI ID]: %GOLD%%NAME%' + descStr);
      lines.push('ItemDisplay[SET ID]: %GREEN%%NAME%' + descStr);
      lines.push('ItemDisplay[RARE ID]: %YELLOW%%NAME%' + descStr);
      lines.push('ItemDisplay[CRAFT ID]: %ORANGE%%NAME%' + descStr);
      lines.push('ItemDisplay[RW]: %GOLD%%NAME%' + descStr);
      lines.push('');

      // 17. CATCH-ALL
      // ==========================
      lines.push('// ============================================================');
      lines.push('// CATCH-ALL -- show everything else with default name');
      lines.push('// ============================================================');
      lines.push('ItemDisplay[]: %NAME%' + descStr);

      // ======================================================================
      //  LOAD INTO EDITOR
      // ======================================================================
      var filterText = lines.join('\n');
      if (codeEditor.value.trim() && !confirm('Build new filter? This will replace your current editor content.')) {
        return;
      }
      codeEditor.value = filterText;
      updateLineNumbers();
      saveToStorage();
      modal.style.display = 'none';
    }
  }

  // ==========================================
  // Item Code Finder
  // ==========================================
  var ITEM_CODES = {
    runes: [
      ['r01s','El'],['r02s','Eld'],['r03s','Tir'],['r04s','Nef'],['r05s','Eth'],['r06s','Ith'],['r07s','Tal'],['r08s','Ral'],['r09s','Ort'],['r10s','Thul'],
      ['r11s','Amn'],['r12s','Sol'],['r13s','Shael'],['r14s','Dol'],['r15s','Hel'],['r16s','Io'],['r17s','Lum'],['r18s','Ko'],['r19s','Fal'],['r20s','Lem'],
      ['r21s','Pul'],['r22s','Um'],['r23s','Mal'],['r24s','Ist'],['r25s','Gul'],['r26s','Vex'],['r27s','Ohm'],['r28s','Lo'],['r29s','Sur'],['r30s','Ber'],
      ['r31s','Jah'],['r32s','Cham'],['r33s','Zod']
    ],
    pd2: [
      ['wss','Worldstone Shard'],['lbox','Larzuk\'s Puzzlebox'],['lpp','Larzuk\'s Puzzlepiece'],['rkey','Skeleton Key'],
      ['tes','Twisted Essence of Suffering'],['ceh','Charged Essense of Hatred'],['bet','Burning Essence of Terror'],['fed','Festering Essence of Destruction'],
      ['toa','Token of Absolution'],['pk1','Key of Terror'],['pk2','Key of Hate'],['pk3','Key of Destruction'],
      ['mbr','Mephisto\'s Brain'],['dhn','Diablo\'s Horn'],['bey','Baal\'s Eye'],['std','Standard of Heroes'],
      ['dcho','Dclone Heart'],['dcso','Dclone Soul'],['dcbl','Dclone Blood'],['dcma','Dclone Matter'],
      ['rtmo','Rathma Material 1'],['rtmv','Rathma Material 2'],['cwss','Corrupted WSS'],['rid','Rathma ID'],['rtp','Rathma TP'],
      ['jewf','Jewel Fragment'],['crfb','Blood Craft Infusion'],['crfc','Caster Craft Infusion'],['crfs','Safety Craft Infusion'],
      ['crfh','Hitpower Craft Infusion'],['crfv','Vampiric Craft Infusion'],['crfu','Bountiful Craft Infusion'],['crfp','Brilliant Craft Infusion'],
      ['scou','Map Scout'],['scrb','Map Scroll B'],['iwss','Imbued WSS'],['upmp','Map Upgrade'],['fort','Fortify Orb'],
      ['rera','Reroll Area Orb'],['imra','Imbue Rare Orb'],['upma','Upgrade Map Orb'],['imma','Imbue Magic Orb']
    ],
    norm: [
      ['cap','Cap'],['skp','Skull Cap'],['hlm','Helm'],['fhl','Full Helm'],['msk','Mask'],['bhm','Bone Helm'],['ghm','Great Helm'],['crn','Crown'],['ci0','Circlet'],['ci1','Coronet'],
      ['qui','Quilted Armor'],['lea','Leather Armor'],['hla','Hard Leather Armor'],['stu','Studded Leather'],['rng','Ring Mail'],['scl','Scale Mail'],['chn','Chain Mail'],['brs','Breast Plate'],['spl','Splint Mail'],['plt','Plate Mail'],['fld','Field Plate'],['gth','Gothic Plate'],['ltp','Light Plate'],['ful','Full Plate Mail'],['aar','Ancient Armor'],
      ['buc','Buckler'],['sml','Small Shield'],['lrg','Large Shield'],['spk','Spiked Shield'],['kit','Kite Shield'],['bsh','Bone Shield'],['tow','Tower Shield'],['gts','Gothic Shield'],
      ['lgl','Leather Gloves'],['vgl','Heavy Gloves'],['mgl','Chain Gloves'],['tgl','Light Gauntlets'],['hgl','Gauntlets'],
      ['lbt','Boots'],['vbt','Heavy Boots'],['mbt','Chain Boots'],['tbt','Light Plated Boots'],['hbt','Greaves'],
      ['lbl','Sash'],['vbl','Light Belt'],['mbl','Belt'],['tbl','Heavy Belt'],['hbl','Plated Belt'],
      ['ne1','Preserved Head'],['ne2','Zombie Head'],['ne3','Unraveller Head'],['ne4','Gargoyle Head'],['ne5','Demon Head'],
      ['hax','Hand Axe'],['axe','Axe'],['2ax','Double Axe'],['mpi','Military Pick'],['wax','War Axe'],['lax','Large Axe'],['bax','Broad Axe'],['btx','Battle Axe'],['gax','Great Axe'],['gix','Giant Axe'],
      ['clb','Club'],['spc','Spiked Club'],['mac','Mace'],['mst','Morning Star'],['fla','Flail'],['whm','War Hammer'],['mau','Maul'],['gma','Great Maul'],
      ['ssd','Short Sword'],['scm','Scimitar'],['sbr','Sabre'],['flc','Falchion'],['crs','Crystal Sword'],['bsd','Broad Sword'],['lsd','Long Sword'],['wsd','War Sword'],['2hs','Two-handed Sword'],['clm','Claymore'],['gis','Giant Sword'],['bsw','Bastard Sword'],['flb','Flamberge'],['gsd','Great Sword'],
      ['dgr','Dagger'],['dir','Dirk'],['kri','Kris'],['bld','Blade'],
      ['tkf','Throwing Knife'],['tax','Throwing Axe'],['bkf','Balanced Knife'],['bal','Balanced Axe'],
      ['jav','Javelin'],['pil','Pilum'],['ssp','Short Spear'],['glv','Glaive'],['tsp','Throwing Spear'],
      ['spr','Spear'],['tri','Trident'],['brn','Brandistock'],['spt','Spetum'],['pik','Pike'],
      ['bar','Bardiche'],['vou','Voulge'],['scy','Scythe'],['pax','Poleaxe'],['hal','Halberd'],['wsc','War Scythe'],
      ['sbw','Short Bow'],['hbw','Hunter\'s Bow'],['lbw','Long Bow'],['cbw','Composite Bow'],['sbb','Short Battle Bow'],['lbb','Long Battle Bow'],['swb','Short War Bow'],['lwb','Long War Bow'],
      ['lxb','Light Crossbow'],['mxb','Crossbow'],['hxb','Heavy Crossbow'],['rxb','Repeating Crossbow'],
      ['sst','Short Staff'],['lst','Long Staff'],['cst','Gnarled Staff'],['bst','Battle Staff'],['wst','War Staff'],
      ['wnd','Wand'],['ywn','Yew Wand'],['bwn','Bone Wand'],['gwn','Grim Wand'],
      ['scp','Scepter'],['gsc','Grand Scepter'],['wsp','War Scepter'],
      ['ob1','Eagle Orb'],['ob2','Sacred Globe'],['ob3','Smoked Sphere'],['ob4','Clasped Orb'],['ob5','Jared\'s Stone'],
      ['rin','Ring'],['amu','Amulet'],['jew','Jewel'],
      ['aqv','Arrow Quiver'],['cqv','Bolt Quiver']
    ],
    exc: [
      ['xap','War Hat'],['xkp','Sallet'],['xlm','Casque'],['xhl','Basinet'],['xsk','Death Mask'],['xh9','Grim Helm'],['xhm','Winged Helm'],['xrn','Grand Crown'],['ci2','Tiara'],
      ['xui','Ghost Armor'],['xea','Serpentskin Armor'],['xla','Demonhide Armor'],['xtu','Trellised Armor'],['xng','Linked Mail'],['xcl','Tigulated Mail'],['xhn','Mesh Armor'],['xrs','Cuirass'],['xpl','Russet Armor'],['xlt','Templar Coat'],['xld','Sharktooth Armor'],['xth','Embossed Plate'],['xtp','Mage Plate'],['xul','Chaos Armor'],['xar','Ornate Plate'],
      ['xuc','Defender'],['xml','Round Shield'],['xrg','Scutum'],['xpk','Barbed Shield'],['xit','Dragon Shield'],['xsh','Grim Shield'],['xow','Pavise'],['xts','Ancient Shield'],
      ['xlg','Demonhide Gloves'],['xvg','Sharkskin Gloves'],['xmg','Heavy Bracers'],['xtg','Battle Gauntlets'],['xhg','War Gauntlets'],
      ['xlb','Demonhide Boots'],['xvb','Sharkskin Boots'],['xmb','Mesh Boots'],['xtb','Battle Boots'],['xhb','War Boots'],
      ['zlb','Demonhide Sash'],['zvb','Sharkskin Belt'],['zmb','Mesh Belt'],['ztb','Battle Belt'],['zhb','War Belt'],
      ['ne6','Mummified Trophy'],['ne7','Fetish Trophy'],['ne8','Sexton Trophy'],['ne9','Cantor Trophy'],['nea','Hierophant Trophy'],
      ['9ha','Hatchet'],['9ax','Cleaver'],['92a','Twin Axe'],['9mp','Crowbill'],['9wa','Naga'],['9la','Military Axe'],['9ba','Bearded Axe'],['9bt','Tabar'],['9ga','Gothic Axe'],['9gi','Ancient Axe'],
      ['9cl','Cudgel'],['9sp','Barbed Club'],['9ma','Flanged Mace'],['9mt','Jagged Star'],['9fl','Knout'],['9wh','Battle Hammer'],['9m9','War Club'],['9gm','Martel de Fer'],
      ['9ss','Gladius'],['9sm','Cutlass'],['9sb','Shamshir'],['9fc','Tulwar'],['9cr','Dimensional Blade'],['9bs','Battle Sword'],['9ls','Rune Sword'],['9wd','Ancient Sword'],['92h','Espandon'],['9cm','Dacian Falx'],['9gs','Tusk Sword'],['9b9','Gothic Sword'],['9fb','Zweihander'],['9gd','Executioner Sword'],
      ['9dg','Poignard'],['9di','Rondel'],['9kr','Cinquedeas'],['9bl','Stiletto'],
      ['9tk','Battle Dart'],['9ta','Francisca'],['9bk','War Dart'],['9b8','Hurlbat'],
      ['9ja','War Javelin'],['9pi','Great Pilum'],['9s9','Simbilan'],['9gl','Spiculum'],['9ts','Harpoon'],
      ['9sr','War Spear'],['9tr','Fuscina'],['9br','War Fork'],['9st','Yari'],['9p9','Lance'],
      ['9b7','Lochaber Axe'],['9vo','Bill'],['9s8','Battle Scythe'],['9pa','Partizan'],['9h9','Bec-de-Corbin'],['9wc','Grim Scythe'],
      ['8sb','Edge Bow'],['8hb','Razor Bow'],['8lb','Cedar Bow'],['8cb','Double Bow'],['8s8','Short Siege Bow'],['8l8','Large Siege Bow'],['8sw','Rune Bow'],['8lw','Gothic Bow'],
      ['8lx','Arbalest'],['8mx','Siege Crossbow'],['8hx','Ballista'],['8rx','Chu-Ko-Nu'],
      ['8ss','Jo Staff'],['8ls','Quarterstaff'],['8cs','Cedar Staff'],['8bs','Gothic Staff'],['8ws','Rune Staff'],
      ['9wn','Burnt Wand'],['9yw','Petrified Wand'],['9bw','Tomb Wand'],['9gw','Grave Wand'],
      ['9sc','Rune Scepter'],['9qs','Holy Water Sprinkler'],['9ws','Divine Scepter'],
      ['ob6','Glowing Orb'],['ob7','Crystalline Globe'],['ob8','Cloudy Sphere'],['ob9','Sparkling Ball'],['oba','Swirling Crystal']
    ],
    elt: [
      ['uap','Shako'],['ukp','Hydraskull'],['ulm','Armet'],['uhl','Giant Conch'],['usk','Demonhead'],['uh9','Bone Visage'],['uhm','Spired Helm'],['urn','Corona'],['ci3','Diadem'],
      ['uui','Dusk Shroud'],['uea','Wyrmhide'],['ula','Scarab Husk'],['utu','Wire Fleece'],['ung','Diamond Mail'],['ucl','Loricated Mail'],['uhn','Boneweave'],['urs','Great Hauberk'],['upl','Balrog Skin'],['ult','Hellforge Plate'],['uld','Kraken Shell'],['uth','Lacquered Plate'],['utp','Archon Plate'],['uul','Shadow Plate'],['uar','Sacred Armor'],
      ['uuc','Heater'],['uml','Luna'],['urg','Hyperion'],['upk','Blade Barrier'],['uit','Monarch'],['ush','Troll Nest'],['uow','Aegis'],['uts','Ward'],
      ['ulg','Bramble Mitts'],['uvg','Vampirebone Gloves'],['umg','Vambraces'],['utg','Crusader Gauntlets'],['uhg','Ogre Gauntlets'],
      ['ulb','Wyrmhide Boots'],['uvb','Scarabshell Boots'],['umb','Boneweave Boots'],['utb','Mirrored Boots'],['uhb','Myrmidon Greaves'],
      ['ulc','Spiderweb Sash'],['uvc','Vampirefang Belt'],['umc','Mithril Coil'],['utc','Troll Belt'],['uhc','Colossus Girdle'],
      ['neb','Minion Skull'],['neg','Hellspawn Skull'],['ned','Overseer Skull'],['nee','Succubus Skull'],['nef','Bloodlord Skull'],
      ['7ha','Tomahawk'],['7ax','Small Crescent'],['72a','Ettin Axe'],['7mp','War Spike'],['7wa','Berserker Axe'],['7la','Feral Axe'],['7ba','Silver-edged Axe'],['7bt','Decapitator'],['7ga','Champion Axe'],['7gi','Glorious Axe'],
      ['7cl','Truncheon'],['7sp','Tyrant Club'],['7ma','Reinforced Mace'],['7mt','Devil Star'],['7fl','Scourge'],['7wh','Legendary Mallet'],['7m7','Ogre Maul'],['7gm','Thunder Maul'],
      ['7ss','Falcata'],['7sm','Ataghan'],['7sb','Elegant Blade'],['7fc','Hydra Edge'],['7cr','Phase Blade'],['7bs','Conquest Sword'],['7ls','Cryptic Sword'],['7wd','Mythical Sword'],['72h','Legend Sword'],['7cm','Highland Blade'],['7gs','Balrog Blade'],['7b7','Champion Sword'],['7fb','Colossus Sword'],['7gd','Colossus Blade'],
      ['7dg','Bone Knife'],['7di','Mithril Point'],['7kr','Fanged Knife'],['7bl','Legend Spike'],
      ['7tk','Flying Knife'],['7ta','Flying Axe'],['7bk','Winged Knife'],['7b8','Winged Axe'],
      ['7ja','Hyperion Javelin'],['7pi','Stygian Pilum'],['7s7','Balrog Spear'],['7gl','Ghost Glaive'],['7ts','Winged Harpoon'],
      ['7sr','Hyperion Spear'],['7tr','Stygian Pike'],['7br','Mancatcher'],['7st','Ghost Spear'],['7p7','War Pike'],
      ['7o7','Ogre Axe'],['7vo','Colossus Voulge'],['7s8','Thresher'],['7pa','Cryptic Axe'],['7h7','Great Poleaxe'],['7wc','Giant Thresher'],
      ['6sb','Spider Bow'],['6hb','Blade Bow'],['6lb','Shadow Bow'],['6cb','Great Bow'],['6s7','Diamond Bow'],['6l7','Crusader Bow'],['6sw','Ward Bow'],['6lw','Hydra Bow'],
      ['6lx','Pellet Bow'],['6mx','Gorgon Crossbow'],['6hx','Colossus Crossbow'],['6rx','Demon Crossbow'],
      ['6ss','Walking Stick'],['6ls','Stalagmite'],['6cs','Elder Staff'],['6bs','Shillelagh'],['6ws','Archon Staff'],
      ['7wn','Polished Wand'],['7yw','Ghost Wand'],['7bw','Lich Wand'],['7gw','Unearthed Wand'],
      ['7sc','Mighty Scepter'],['7qs','Seraph Rod'],['7ws','Caduceus'],
      ['obb','Heavenly Stone'],['obc','Eldritch Orb'],['obd','Demon Heart'],['obe','Vortex Orb'],['obf','Dimensional Shard'],
      ['aqv3','Elite Arrow Quiver'],['cqv3','Elite Bolt Quiver']
    ],
    uni: [
      ['2ax','Bladebone - Double Axe'],['2hs','Shadowfang - Two-handed Sword'],['6bs','Brimstone Rain - Shillelagh'],['6cb','Great Bow (No Unique for this base)'],['6cs','Ondals Wisdom - Elder Staff'],
      ['6hb','Crackleshot - Blade Bow'],['6hx','Hellrack - Colossus Crossbow'],['6l7','Eaglehorn - Crusader Bow'],['6lb','Shadow Bow (No Unique for this base)'],['6ls','Stalagmite (No Unique for this base)'],
      ['6lw','Windforce - Hydra Bow'],['6lx','Pellet Bow (No Unique for this base)'],['6mx','Gorgon Crossbow (No Unique for this base)'],['6rx','Gut Siphon - Demon Crossbow'],['6s7','Diamond Bow (No Unique for this base)'],
      ['6sb','Spider Bow (No Unique for this base)'],['6ss','Walking Stick (No Unique for this base)'],['6sw','Widowmaker - Ward Bow'],['6ws','Mang Songs Lesson - Archon Staff'],['72a','Rune Master - Ettin Axe'],
      ['72h','Legend Sword (No Unique for this base)'],['7ar','Suwayyah (No Unique for this base)'],['7ax','Small Crescent (No Unique for this base)'],['7b7','Doombringer - Champion Sword'],['7b8','Lacerator - Winged Axe'],
      ['7ba','Ethereal Edge - Silver-Edged Axe'],['7bk','Warshrike - Winged Knife'],['7bl','Ghostflame - Legend Spike'],['7br','Viperfork - Mancatcher'],['7bs','Hadriels Hand'],
      ['7bt','Hellslayer - Decapitator'],['7bw','Boneshade - Lich Wand'],['7cl','Nords Tenderizer - Truncheon'],['7cm','Leroics Mithril Bane - Highland Blade'],['7cr','Lightsabre or Azurewrath'],
      ['7cs','Shadowkiller - Battle Cestus'],['7dg','Wizardspike - Bone Knife'],['7di','Shatterblade - Mithril Point'],['7fb','Odium - Colossus Sword'],['7fc','Hydra Edge (No Unique for this base)'],
      ['7fl','Horizons Tornado or Stormlash - Scourge'],['7ga','Messerschmidts Reaver - Champion Axe'],['7gd','The Grandfather - Colossus Blade'],['7gi','Executioners Justice - Glorious Axe'],['7gl','Wraith Flight - Ghost Glaive'],
      ['7gm','Earth Shifter or The Cranium Basher'],['7gs','Flamebellow - Balrog Blade'],['7gw','Deaths Web - Unearthed Wand'],['7h7','Great Poleaxe (No Unique for this base)'],['7ha','Razors Edge - Tomahawk'],
      ['7ja','Hyperion Javelin (No Unique for this base)'],['7kr','Fleshripper - Fanged Knife'],['7la','Feral Axe (No Unique for this base)'],['7ls','Frostwind - Cryptic Sword'],['7lw','Firelizards Talons - Feral Claws'],
      ['7m7','Windhammer - Ogre Maul'],['7ma','Reinforced Mace (No Unique for this base)'],['7mp','Cranebeak - War Spike'],['7mt','Baranars Star - Devil Star'],['7o7','Bonehew - Ogre Axe'],
      ['7p7','Steel Pillar - War Pike'],['7pa','Tomb Reaver - Cryptic Axe'],['7pi','Stygian Pilum (No Unique for this base)'],['7qr','Aidans Scar'],['7qs','Akarat\'s Devotion - Seraph Rod'],
      ['7s7','Demons Arch - Balrog Spear'],['7s8','The Reapers Toll - Thresher'],['7sb','Bloodmoon - Elegant Blade'],['7sc','Heavens Light or The Redeemer - Mighty Scepter'],['7sm','Djinn Slayer - Ataghan'],
      ['7sp','Demon Limb - Tyrant Club'],['7sr','Ariocs Needle - Hyperion Spear'],['7ss','Falcata (No Unique for this base)'],['7st','Uldyssians Awakening - Ghost Spear'],['7ta','Gimmershred - Flying Axe'],
      ['7tk','Flying Knife (No Unique for this base)'],['7tr','Stygian Pike (No Unique for this base)'],['7ts','Gargoyles Bite - Winged Harpoon'],['7tw','Stalker\'s Cull - Runic Talons'],['7vo','Colossus Voulge (No Unique for this base)'],
      ['7wa','Death Cleaver - Berserker Axe'],['7wb','Jade Talon - Wrist Sword'],['7wc','Stormspire - Giant Thresher'],['7wd','Mythical Sword (No Unique for this base)'],['7wh','Stone Crusher or Schaefers Hammer'],
      ['7wn','Polished Wand (No Unique for this base)'],['7ws','Astreons Iron Ward - Caduceus'],['7xf','War Fist - Whispering Mirage'],['7yw','Ghost Wand (No Unique for this base)'],['8bs','Warpspear - Gothic Staff'],
      ['8cb','Endlesshail - Double Bow'],['8cs','Chromatic Ire - Cedar Staff'],['8hb','Riphook - Razor Bow'],['8hx','Buriza-Do Kyanon - Ballista'],['8l8','Cliffkiller - Large Siege Bow'],
      ['8lb','Kuko Shakaku - Cedar Bow'],['8ls','Ribcracker - Quarterstaff'],['8lw','Goldstrike - Arch Gothic Bow'],['8lx','Langer Briser - Arbalest'],['8mx','Pus Spitter - Siege Crossbow'],
      ['8rx','Demon Machine - Chu-Ko-Nu'],['8s8','Witchwild String - Short Siege Bow'],['8sb','Skystrike - Edge Bow'],['8ss','Razorswitch - Jo Staff'],['8sw','Magewrath - Rune Bow'],
      ['8ws','Skull Collector - Rune Staff'],['92a','Islestrike - Twin Axe'],['92h','Crainte Vomir - Espandon'],['9ar','Mage Slayer - Quhab'],['9ax','Butchers Pupil - Cleaver'],
      ['9b7','The Meat Scraper - Lochaber Axe'],['9b8','Achilles Strike - Hurlbat'],['9b9','Cloudcrack - Gothic Sword'],['9ba','Spellsteel - Bearded Axe'],['9bk','War Dart (No Unique for this base)'],
      ['9bl','Stormspike - Stiletto'],['9br','Soulfeast Tine - War Fork'],['9bs','Headstriker - Battle Sword'],['9bt','Stormrider - Tabar'],['9bw','Arm of King Leoric - Tomb Wand'],
      ['9cl','Dark Clan Crusher - Cudgel'],['9cm','Bing Sz Wang - Dacian Falx'],['9cr','Ginthers Rift - Dimensional Blade'],['9cs','Hand Scythe (No Unique for this base)'],['9dg','Spineripper - Poignard'],
      ['9di','Heart Carver - Rondel'],['9fb','Todesfaelle - Flamme Zweihander'],['9fc','Blade of Ali Baba - Tulwar'],['9fl','Baezils Vortex - Knout'],['9ga','Boneslayer Blade - Gothic Axe'],
      ['9gd','Swordguard - Executioner Sword'],['9gi','The Minotaur - Ancient Axe'],['9gl','Spiculum (No Unique for this base)'],['9gm','The Gavel Of Pain - Martel de Fer'],['9gs','The Vile Husk - Tusk Sword'],
      ['9gw','Blackhand Key - Grave Wand'],['9h9','Husoldal Evo - Bec-de-Corbin'],['9ha','Coldkill - Hatchet'],['9ja','War Javelin (No Unique for this base)'],['9kr','Blackbogs Sharp - Cinquedeas'],
      ['9la','Warlords Trust - Military Axe'],['9ls','Plague Bearer - Rune Sword'],['9lw','Greater Claws (No Unique for this base)'],['9m9','Bloodtree Stump - War Club'],['9ma','Sureshrill Frost - Flanged Mace'],
      ['9mp','Pompeiis Wrath - Crowbill'],['9mt','Moonfall - Jagged Star'],['9p9','Spire of Honor - Lance'],['9pa','Pierre Tombale Couant - Partizan'],['9pi','Great Pilum (No Unique for this base)'],
      ['9qr','Scissors Quhab (No Unique for this base)'],['9qs','The Fetid Sprinkler - Holy Water Sprinkler'],['9s8','Athenas Wrath - Battle Scythe'],['9s9','Simbilan (No Unique for this base)'],['9sb','Hexfire - Shamshir'],
      ['9sc','Zakarums Hand - Rune Scepter'],['9sm','Coldsteel Eye - Cutlass'],['9sp','Fleshrender - Barbed Club'],['9sr','The Impaler - War Spear'],['9ss','Bloodletter - Gladius'],
      ['9st','Hone Sundan - Yari'],['9ta','The Scalper - Francisca'],['9tk','Deathbit - Battle Dart'],['9tr','Kelpie Snare - Fuscina'],['9ts','Harpoon (No Unique for this base)'],
      ['9tw','Bartucs Cut-Throat - Greater Talons'],['9vo','Blackleach Blade - Bill'],['9wa','Guardian Naga - Naga'],['9wb','Wrist Spike (No Unique for this base)'],['9wc','Grims Burning Dead Grim - Scythe'],
      ['9wd','The Atlantean - Ancient Sword'],['9wh','Earthshaker - Battle Hammer'],['9wn','Suicide Branch - Burnt Wand'],['9ws','Hand of Blessed Light - Divine Scepter'],['9xf','Fascia (No Unique for this base)'],
      ['9yw','Carin Shard - Petrified Wand'],['aar','Silks of the Victor - Ancient Armor'],['am1','Stag Bow (No Unique for this base)'],['am2','Reflex Bow (No Unique for this base)'],['am3','Maiden Spear (No Unique for this base)'],
      ['am4','Maiden Pike (No Unique for this base)'],['am5','True Silver - Maiden Javelin'],['am6','Ashwood Bow (No Unique for this base)'],['am7','Lycanders Aim - Ceremonial Bow'],['am8','Ceremonial Spear (No Unique for this base)'],
      ['am9','Lycanders Flank - Ceremonial Pike'],['ama','Titans Revenge - Ceremonial Javelin'],['amb','Bloodravens Charge - Matriarchal Bow'],['amc','Ebonbane - Grand Matron Bow'],['amd','Stoneraven - Matriarchal Spear'],
      ['ame','Zerae\'s Resolve - Matriarchal Pike'],['amf','Thunderstroke - Matriarchal Javelin'],['amu','Unique Amulet'],['axe','Deathspade - Axe'],['axf','Hatchet Hands (No Unique for this base)'],
      ['ba1','Jawbone Cap (No Unique for this base)'],['ba2','Fanged Helm (No Unique for this base)'],['ba3','Horned Helm (No Unique for this base)'],['ba4','Assault Helmet (No Unique for this base)'],['ba5','Avenger Guard (No Unique for this base)'],
      ['ba6','Cyclopean Roar - Jawbone Visor'],['ba7','Wildspeaker - Lion Helm'],['ba8','Rage Mask (No Unique for this base)'],['ba9','Savage Helmet (No Unique for this base)'],['baa','Arreats Face - Slayer Guard'],
      ['bab','Carnage Helm (No Unique for this base)'],['bac','Wolfhowl - Fury Visor'],['bad','Demonhorns Edge - Destroyer Helm'],['bae','Halaberds Reign - Conqueror Crown'],['baf','Raekor\'s Virtue - Guardian Crown'],
      ['bal','Balanced Axe (No Unique for this base)'],['bar','Dimoaks Hew - Bardiche'],['bax','Goreshovel - Broad Axe'],['bhm','Wormskull - Bone Helm'],['bkf','Balanced Knife (No Unique for this base)'],
      ['bld','Spectral Shard - Blade'],['brn','Bloodthief - Brandistock'],['brs','Venom Ward - Breast Plate'],['bsd','Griswolds Edge - Broad Sword'],['bsh','Wall of the Eyeless - Bone Shield'],
      ['bst','The Salamander - Battle Staff'],['bsw','Blacktongue - Bastard Sword'],['btl','Blade Talons (No Unique for this base)'],['btx','The Chieftain - Battle Axe'],['buc','Pelta Lunata - Buckler'],
      ['bwn','Gravenspine - Bone Wand'],['cap','Biggins Bonnet - Cap'],['cbw','Rogues Bow - Composite Bow'],['ces','Cestus (No Unique for this base)'],['chn','Sparking Mail - Chain Mail'],
      ['ci0','Circlet (No Unique for this base)'],['ci1','Coronet (No Unique for this base)'],['ci2','Kiras Guardian - Tiara'],['ci3','Griffons Eye - Diadem'],['clb','Felloak - Club'],
      ['clm','Soulflay - Claymore'],['clw','Claws (No Unique for this base)'],['crn','Undead Crown'],['crs','Crystal Sword (No Unique for this base)'],['cst','Spire of Lazarus - Gnarled Staff'],
      ['dgr','Gull Dagger'],['dir','The Diggler - Dirk'],['dr1','Wolf Head (No Unique for this base)'],['dr2','Quetzalcoatl - Hawk Helm'],['dr3','Antlers (No Unique for this base)'],
      ['dr4','Falcon Mask (No Unique for this base)'],['dr5','Spirit Mask (No Unique for this base)'],['dr6','Fenris - Alpha Helm'],['dr7','Griffon Headdress (No Unique for this base)'],['dr8','Hunters Guise (No Unique for this base)'],
      ['dr9','Sacred Feathers (No Unique for this base)'],['dra','Jalals Mane - Totemic Mask'],['drb','Cerebus Bite - Blood Spirit'],['drc','Denmother - Sun Spirit'],['drd','Spirit Keeper - Earth Spirit'],
      ['dre','Ravenlore - Sky Spirit'],['drf','Ursa\'s Nightmare - Dream Spirit'],['fhl','Duskdeep - Full Helm'],['fla','The Generals Tan Do Li Ga - Flail'],['flb','Ripsaw - Flamberge'],
      ['flc','Gleamscythe - Falchion'],['fld','Rockfleece - Field Plate'],['ful','Goldskin - Full Plate Mail'],['gax','Brainhew - Great Axe'],['ghm','Howltusk - Great Helm'],
      ['gis','Kinemils Awl - Giant Sword'],['gix','Humongous - Giant Axe'],['glv','Glaive (No Unique for this base)'],['gma','Steeldriver - Great Maul'],['gsc','Rusthandle - Grand Scepter'],
      ['gsd','The Patriarch - Great Sword'],['gth','Rattlecage - Gothic Plate'],['gts','The Ward - Gothic Shield'],['gwn','Umes Lament - Grim Wand'],['hal','Woestave - Halberd'],
      ['hax','The Gnasher - Hand Axe'],['hbl','Bladebuckle - Plated Belt'],['hbt','Tearhaunch - Greaves'],['hbw','Witherstring - Hunters Bow'],['hgl','Frostburn - Gauntlets'],
      ['hla','The Centurion - Hard Leather Armor'],['hlm','Coif of Glory - Helm'],['hxb','Hellcast - Heavy Crossbow'],['jav','Javelin (No Unique for this base)'],['jew','Rainbow Facet'],
      ['kit','Steelclash - Kite Shield'],['kri','The Jade Tan Do - Kris'],['ktr','Katar (No Unique for this base)'],['lax','Axe of Fechmar - Large Axe'],['lbb','Wizendraw - Long Battle Bow'],
      ['lbl','Lenymo - Sash'],['lbt','Hotspur - Boots'],['lbw','Raven Claw - Long Bow'],['lea','Blinkbats Form - Leather Armor'],['lgl','The Hand of Broc - Leather Gloves'],
      ['lrg','Stormguild - Large Shield'],['lsd','Hellplague - Long Sword'],['lst','Serpent - Lord Long Staff'],['ltp','Heavenly Garb - Light Plate'],['lwb','Blastbark - Long War Bow'],
      ['lxb','Leadcrow - Light Crossbow'],['mac','Crushflange - Mace'],['mau','Bonesnap - Maul'],['mbl','Nightsmoke - Belt'],['mbt','Treads of Cthon - Chain Boots'],
      ['mgl','Chance Guards - Chain Gloves'],['mpi','Skull Splitter - Military Pick'],['msk','The Face of Horror - Mask'],['mst','Bloodrise - Morning Star'],['mxb','Ichorsting - Crossbow'],
      ['ne1','Preserved Head (No Unique for this base)'],['ne2','Zombie Head (No Unique for this base)'],['ne3','Unraveller Head (No Unique for this base)'],['ne4','Gargoyle Head (No Unique for this base)'],['ne5','Demon Head (No Unique for this base)'],
      ['ne6','Kalans Legacy - Mummified Trophy'],['ne7','Fetish Trophy (No Unique for this base)'],['ne8','Sexton Trophy (No Unique for this base)'],['ne9','Cantor Trophy (No Unique for this base)'],['nea','Homunculus - Hierophant Trophy'],
      ['neb','Minion Skull (No Unique for this base)'],['ned','Martyrdom - Overseer Skull'],['nee','Boneflame - Succubus Skull'],['nef','Darkforce - Spawn Bloodlord Skull'],['neg','Sacred Totem - Hellspawn Skull'],
      ['ob1','Eagle Orb (No Unique for this base)'],['ob2','Sacred Globe (No Unique for this base)'],['ob3','Smoked Sphere (No Unique for this base)'],['ob4','Clasped Orb (No Unique for this base)'],['ob5','Jareds Stone (No Unique for this base)'],
      ['ob6','Tempest - Glowing Orb'],['ob7','Skorn - Crystalline Globe'],['ob8','Cloudy Sphere (No Unique for this base)'],['ob9','Sparkling Ball (No Unique for this base)'],['oba','The Oculus - Swirling Crystal'],
      ['obb','Heavenly Stone (No Unique for this base)'],['obc','Eschutas Temper - Eldritch Orb'],['obd','Demon Heart (No Unique for this base)'],['obe','Vortex Orb (No Unique for this base)'],['obf','Deaths Fathom - Dimensional Shard'],
      ['pa1','Targe (No Unique for this base)'],['pa2','Rondache (No Unique for this base)'],['pa3','Sankekurs Fall - Heraldic Shield'],['pa4','Aerin Shield (No Unique for this base)'],['pa5','Crown Shield (No Unique for this base)'],
      ['pa6','Akaran Targe (No Unique for this base)'],['pa7','Akaran Rondache (No Unique for this base)'],['pa8','Protector Shield (No Unique for this base)'],['pa9','Herald of Zakarum - Gilded Shield'],['paa','Royal Shield (No Unique for this base)'],
      ['pab','Sacred Targe (No Unique for this base)'],['pac','Alma Negra - Sacred Rondache'],['pad','Kurast Shield (No Unique for this base)'],['pae','Dragonscale - Zakarum Shield'],['paf','Vortex Shield - Skywarden'],
      ['pax','The Battlebranch - Poleaxe'],['pik','The Tannr Gorerod - Pike'],['pil','Pilum (No Unique for this base)'],['plt','Boneflesh - Plate Mail'],['qui','Greyform - Quilted Armor'],
      ['ram','The Third Eye'],['rar','Cage of the Unsullied'],['rbe','Band of Skulls'],['rin','Unique Ring'],['rng','Darkglow - Ring Mail'],
      ['rxb','Doomslinger - Repeating Crossbow'],['sbb','Stormstrike - Short Battle Bow'],['sbr','Skewer of Krintiz - Sabre'],['sbw','Pluckeye - Short Bow'],['scl','Hawkmail - Scale Mail'],
      ['scm','Blood Crescent - Scimitar'],['scp','Knell Striker - Scepter'],['scy','Soul Harvest - Scythe'],['skp','Tarnhelm - Skull Cap'],['skr','Scissors Katar (No Unique for this base)'],
      ['sml','Umbral Disk - Small Shield'],['spc','Stoutnail - Spiked Club'],['spk','Swordback Hold - Spiked Shield'],['spl','Iceblink - Splint Mail'],['spr','The Dragon Chang - Spear'],
      ['spt','Lance of Yaggai - Spetum'],['ssd','Rixots Keen - Short Sword'],['ssp','Short Spear (No Unique for this base)'],['sst','Bane Ash - Short Staff'],['stu','Twitchthroe - Studded Leather'],
      ['swb','Hellclap - Short War Bow'],['tax','Throwing Axe (No Unique for this base)'],['tbl','Goldwrap - Heavy Belt'],['tbt','Goblin Toe - Light Plated Boots'],['tgl','Magefist - Light Gauntlets'],
      ['tkf','Throwing Knife (No Unique for this base)'],['tow','Bverrit Keep - Tower Shield'],['tri','Razortine - Trident'],['tsp','Throwing Spear (No Unique for this base)'],['uap','SHAKO'],
      ['ucl','Loricated Mail (No Unique for this base)'],['uea','Wyrmhide (No Unique for this base)'],['uh9','Giant Skull - Bone Visage'],['uhb','Shadow Dancer - Myrmidon Greaves'],['uhc','Siggard\'s Staunch - Colossus Girdle'],
      ['uhg','Steelrend - Ogre Gauntlets'],['uhl','Overlords Helm'],['uhm','Veil of Steel or Nightwings Veil'],['uhn','Cage of the Unsullied'],['uit','Stormshield'],
      ['ukp','Hydraskull (No Unique for this base)'],['ula','Scarab Husk (No Unique for this base)'],['ulb','Merman\'s Sprocket - Wyrmhide Boots'],['ulc','Arachnid Mesh - Spiderweb Sash'],['uld','Leviathan - Kraken Shell'],
      ['ulg','Titans Grip - Bramble Mitts'],['ulm','Steel Shade - Armet'],['ult','Hellforge Plate (No Unique for this base)'],['umb','Marrowwalk - Boneweave Boots'],['umc','Verdungos Hearty Cord - Mithril Coil'],
      ['umg','Soul Drainer - Vambraces'],['uml','Blackoak Shield - Luna'],['ung','Wraithskin - Diamond Mail'],['uow','Medusas Gaze - Aegis'],['upk','Spike Thorn - Blade Barrier'],
      ['upl','Arkaines Valor - Balrog Skin'],['urg','Twilights Reflection - Hyperion'],['urn','Crown of Ages - Corona'],['urs','Great Hauberk (No Unique for this base)'],['ush','Head Hunters Glory - Troll Nest'],
      ['usk','Andariels Visage - Demonhead'],['utb','Itheraels Path'],['utc','Band of Skulls'],['utg','Occultist - Crusader Gauntlets'],['uth','Dark Abyss'],
      ['utp','Purgatory - Archon Plate'],['uts','Spirit Ward'],['utu','The Gladiators Bane Wire Fleece'],['uuc','Heater (No Unique for this base)'],['uui','Ormus Robes - Dusk Shroud'],
      ['uul','Steel Carapace - Shadow Plate'],['uvb','Sandstorm Trek - Scarabshell Boots'],['uvc','Nosferatus Coil - Vampirefang Belt'],['uvg','Draculs Grasp - Vampirebone Gloves'],['vbl','Snakecord - Light Belt'],
      ['vbt','Gorefoot - Heavy Boots'],['vgl','Bloodfist - Heavy Gloves'],['vou','Steelgoad - Voulge'],['wax','Rakescar - War Axe'],['whm','Ironstone - War Hammer'],
      ['wnd','Torch of Iro - Wand'],['wrb','Wrist Blade (No Unique for this base)'],['wsc','The Grim Reaper - War Scythe'],['wsd','Culwens Point - War Sword'],['wsp','Stormeye - War Scepter'],
      ['wst','The Iron Jang Bong - War Staff'],['xap','Peasant Crown - War Hat'],['xar','Corpsemourn - Ornate Plate'],['xcl','Crow Caw - Tigulated Mail'],['xea','Skin of the Vipermagi - Serpentskin Armor'],
      ['xh9','Vampire Gaze - Grim Helm'],['xhb','Gore Rider - War Boots'],['xhg','Hellmouth - War Gauntlets'],['xhl','Darksight Helm - Basinet'],['xhm','Valkyrie Wing - Winged Helm'],
      ['xhn','Shaftstop - Mesh Armor'],['xit','Tiamats Rebuke - Dragon Shield'],['xkp','Rockstopper - Sallet'],['xla','Skin of the Flayed One - Demonhide Armor'],['xlb','Infernostride - Demonhide Boots'],
      ['xld','Toothrow - Sharktooth Armor'],['xlg','Venom Grip - Demonhide Gloves'],['xlm','Stealskull - Casque'],['xlt','Guardian Angel - Templar Coat'],['xmb','Silkweave - Mesh Boots'],
      ['xmg','Ghoulhide - Heavy Bracers'],['xml','Mosers Blessed Circle - Round Shield'],['xng','Spirit Forge - Linked Mail'],['xow','Gerkes Sanctuary - Pavise'],['xpk','Lance Guard - Barbed Shield'],
      ['xpl','Skullders Ire - Russet Armor'],['xrg','Stormchaser - Scutum'],['xrn','Crown of Thieves - Grand Crown'],['xrs','Duriels Shell - Cuirass'],['xsh','Lidless Wall - Grim Shield'],
      ['xsk','Blackhorns Face - Death Mask'],['xtb','War Traveler - Battle Boots'],['xtg','Lava Gout - Battle Gauntlets'],['xth','Atmas Wail - Embossed Plate'],['xtp','Que-Hegans Wisdom - Mage Plate'],
      ['xts','Radaments Sphere - Ancient Shield'],['xtu','Iron Pelt - Trellised Armor'],['xuc','Viscerataunt Defender - Defender'],['xui','The Spirit Shroud - Ghost Armor'],['xul','Black Hades - Chaos Armor'],
      ['xvb','Waterwalk - Sharkskin Boots'],['xvg','Gravepalm - Sharkskin Gloves'],['ywn','Maelstrom - Yew Wand'],['zhb','Thundergods Vigor - War Belt'],['zlb','String of Ears - Demonhide Sash'],
      ['zmb','Glooms Trap - Mesh Belt'],['ztb','Snowclash - Battle Belt'],['zvb','Razortail - Sharkskin Belt'],
      ['cm1','Annihilus'],['cm2','Hellfire Torch'],['cm3','Gheeds Fortune']
    ],
    set: [
      ['2ax','Berserker\'s Hatchet - Double Axe'],['6cs','Naj\'s Puzzler'],['7fb','Bul-Katho\'s Tribal Guardian'],['7gd','Bul-Katho\'s Sacred Charge'],['7ls','Sazabis Cobalt Redeemer - Cryptic Sword'],
      ['7m7','Immortal Kings Stone Crusher - Ogre Maul'],['7ma','Dangoons Teaching - Reinforced Mace'],['7qr','Natalya\'s Mark - Scissors Suwayyah'],['7wd','Bul-Katho\'s Tribal Guardian'],['7ws','Griswold\'s Redemption - Caduceus'],
      ['9mt','Aldur\'s Rhythm - Jagged Star'],['9vo','Hwanin\'s Justice - Bill'],['aar','Milabrega\'s Robe - Ancient Armor'],['amc','Mavinas Caster - Grand Matron Bow'],['amu','Set Amulet'],
      ['ba5','Immortal Kings Will - Avenger Guard'],['bhm','Tancred\'s Skull - Bone Helm'],['brs','Isenhart\'s Case - Breast Plate'],['bsd','Isenhart\'s Lightbrand - Broad Sword'],['bst','Cathan\'s Rule - Battle Staff'],
      ['buc','Hsarus Iron Fist - Buckler'],['bwn','Sanders Superstition - Bone Wand'],['cap','Infernal or Sanders - Cap'],['chn','Cathan\'s Mesh - Chain Mail'],['ci0','Naj\'s Circlet'],
      ['ci3','Mavinas True Sight - Diadem'],['crn','Iratha or Milabrega - Crown'],['dgr','Infernal Spine - Dagger'],['dr8','Aldur\'s Stony Gaze - Hunters Guise'],['fhl','Isenhart\'s Horns - Full Helm'],
      ['ful','Tancred\'s Spine - Full Plate Mail'],['ghm','Sigon\'s Visor - Great Helm'],['gsc','Civerb\'s Cudgel - Grand Scepter'],['gth','Sigon\'s Shelter - Gothic Plate'],['gts','Isenhart\'s Parry - Gothic Shield'],
      ['hbl','Sigon\'s Wrap - Plated Belt'],['hbt','Sigon\'s Sabot - Greaves'],['hgl','Sigon\'s Gage - Gauntlets'],['hlm','Berserker\'s Headgear - Helm'],['kit','Milabrega\'s Orb - Kite Shield'],
      ['lbb','Vidala\'s Barb Long - Battle Bow'],['lbl','Death\'s Guard - Sash'],['lbt','Tancred\'s Hobnails - Boots'],['lea','Vidala\'s Ambush - Leather Armor'],['lgl','Death\'s Hand - Leather Gloves'],
      ['lrg','Civerb\'s Ward - Large Shield'],['lsd','Cleglaw\'s Tooth - Long Sword'],['ltp','Arcanna\'s Flesh Light Plate'],['mbl','Hsaru or Hwanin - Belt'],['mbt','Hsarus Iron Heel - Chain Boots'],
      ['mgl','Cleglaw\'s Pincers - Chain Gloves'],['mpi','Tancred\'s Crowbill - Military Pick'],['msk','Cathan\'s Visage - Mask'],['ne9','Trang-Oul\'s Wing - Cantor Trophy'],['oba','Tal Rasha\'s Lidless Eye - Swirling Crystal'],
      ['paf','Griswold\'s Honor - Vortex Shield'],['qui','Arctic Furs - Quilted Armor'],['rin','Set Ring'],['rng','Angelic Mantle - Ring Mail'],['sbr','Angelic Sickle - Sabre'],
      ['skp','Arcanna\'s - Skull Cap'],['sml','Cleglaw\'s Claw - Small Shield'],['spl','Berserker\'s Hauberk - Splint Mail'],['stu','Cow King\'s Hide - Studded Leather'],['swb','Arctic Horn - Short War Bow'],
      ['tbl','Infernal or Iratha - Heavy Belt'],['tbt','Vidala\'s Fetlock - Light Plated Boots'],['tgl','Arctic or Iratha - Light Gauntlet'],['tow','Sigon\'s Guard - Tower Shield'],['uar','Immortal Kings Soul Cage - Sacred Armor'],
      ['ucl','Natalya\'s Shadow - Loricated Mail'],['uh9','Trang-Oul\'s Guise - Bone Visage'],['uhm','Ondals Almighty - Spired Helm'],['uld','Mavinas Embrace - Kraken Shell'],['ulg','Laying of Hands - Bramble Mitts'],
      ['ult','Naj\'s Light Plate'],['umc','Credendum - Mithril Coil'],['upl','Sazabis Ghost Liberator - Balrog Skin'],['urn','Griswold\'s Valor - Corona'],['utc','Trang-Oul\'s Girth - Troll Belt'],
      ['uth','Tal Rasha\'s Guardianship - Lacquered Plate'],['uts','Taebaeks Glory - Ward'],['uui','Dark Adherent - Dusk Shroud'],['uul','Aldur\'s Deception - Shadow Plate'],['vbl','Arctic Binding - Light Belt'],
      ['vbt','Cow King or Sander - Heavy Boots'],['vgl','Sanders Taboo - Heavy Gloves'],['wsd','Death\'s Touch - War Sword'],['wsp','Milabrega\'s Rod - War Scepter'],['wst','Arcanna\'s Deathwand - War Staff'],
      ['xap','Cow King\'s Horns - War Hat'],['xar','Griswold\'s Heart - Ornate Plate'],['xcl','Hwanin\'s Refuge - Tigulated Mail'],['xh9','Natalya\'s Totem - Grim Helm'],['xhb','Immortal Kings Pillar - War Boots'],
      ['xhg','Immortal Kings Forge - War Gauntlets'],['xhl','Sazabis Mental Sheath - Basinet'],['xhm','Guillaumes Face'],['xlb','Rite of Passage - Demonhide Boots'],['xmb','Natalya\'s Soul - Mesh Boots'],
      ['xmg','Trang-Oul\'s Claws - Heavy Bracers'],['xml','Whitstans Guard - Round Shield'],['xrn','Hwanin\'s Splendor - Grand Crown'],['xrs','Haemosus Adamant - Cuirass'],['xsk','Tal Rasha\'s Horadric Crest - Death Mask'],
      ['xtb','Aldur\'s Advance - Battle Boots'],['xtg','Mavinas Icy Clutch - Battle Gauntlets'],['xul','Trang-Oul\'s Scales - Chaos Armor'],['xvg','Magnus Skin - Sharkskin Gloves'],['zhb','Immortal Kings Detail - War Belt'],
      ['zmb','Tal Rasha\'s Fine-Spun Cloth - Mesh Belt'],['ztb','Wilhelms Pride - Battle Belt'],['zvb','Mavinas Tenet - Sharkskin Belt']
    ],
    classitems: [
      // Druid Pelts
      ['dr1','Wolf Head'],['dr2','Hawk Helm'],['dr3','Antlers'],['dr4','Falcon Mask'],['dr5','Spirit Mask'],
      ['dr6','Alpha Helm'],['dr7','Griffon Headress'],['dr8','Hunter\'s Guise'],['dr9','Sacred Feathers'],['dra','Totemic Mask'],
      ['drb','Blood Spirit'],['drc','Sun Spirit'],['drd','Earth Spirit'],['dre','Sky Spirit'],['drf','Dream Spirit'],
      // Barbarian Helms
      ['ba1','Jawbone Cap'],['ba2','Fanged Helm'],['ba3','Horned Helm'],['ba4','Assault Helmet'],['ba5','Avenger Guard'],
      ['ba6','Jawbone Visor'],['ba7','Lion Helm'],['ba8','Rage Mask'],['ba9','Savage Helmet'],['baa','Slayer Guard'],
      ['bab','Carnage Helm'],['bac','Fury Visor'],['bad','Destroyer Helm'],['bae','Conqueror Crown'],['baf','Guardian Crown'],
      // Paladin Shields
      ['pa1','Targe'],['pa2','Rondache'],['pa3','Heraldic Shield'],['pa4','Aerin Shield'],['pa5','Crown Shield'],
      ['pa6','Akaran Targe'],['pa7','Akaran Rondache'],['pa8','Protector Shield'],['pa9','Gilded Shield'],['paa','Royal Shield'],
      ['pab','Sacred Targe'],['pac','Sacred Rondache'],['pad','Kurast Shield'],['pae','Zakarum Shield'],['paf','Vortex Shield'],
      // Assassin Katars
      ['ktr','Katar'],['wrb','Wrist Blade'],['axf','Hatchet Hands'],['ces','Cestus'],['clw','Claws'],['btl','Blade Talons'],['skr','Scissors Katar'],
      ['9ar','Quhab'],['9wb','Wrist Spike'],['9xf','Fascia'],['9cs','Hand Scythe'],['9lw','Greater Claws'],['9tw','Greater Talons'],['9qr','Scissors Quhab'],
      ['7ar','Suwayyah'],['7wb','Wrist Sword'],['7xf','War Fist'],['7cs','Battle Cestus'],['7lw','Feral Claws'],['7tw','Runic Talons'],['7qr','Scissors Suwayyah'],
      // Amazon Bows
      ['am1','Stag Bow'],['am2','Reflex Bow'],['am6','Ashwood Bow'],['am7','Ceremonial Bow'],['amb','Matriarchal Bow'],['amc','Grand Matron Bow'],
      // Amazon Spears/Pikes
      ['am3','Maiden Spear'],['am8','Ceremonial Spear'],['amd','Matriarchal Spear'],
      ['am4','Maiden Pike'],['am9','Ceremonial Pike'],['ame','Matriarchal Pike'],
      // Amazon Javelins
      ['am5','Maiden Javelin'],['ama','Ceremonial Javelin'],['amf','Matriarchal Javelin']
    ],
    misc: [
      ['hp1','Minor Healing'],['hp2','Light Healing'],['hp3','Healing'],['hp4','Greater Healing'],['hp5','Super Healing'],
      ['mp1','Minor Mana'],['mp2','Light Mana'],['mp3','Mana'],['mp4','Greater Mana'],['mp5','Super Mana'],
      ['rvs','Rejuv (35%)'],['rvl','Full Rejuv (65%)'],['yps','Antidote'],['wms','Thawing'],['vps','Stamina'],['pvpp','PvP Mana'],
      ['gcvs','Chipped Amethyst'],['gfvs','Flawed Amethyst'],['gsvs','Amethyst'],['gzvs','Flawless Amethyst'],['gpvs','Perfect Amethyst'],
      ['gcws','Chipped Diamond'],['gfws','Flawed Diamond'],['gsws','Diamond'],['glws','Flawless Diamond'],['gpws','Perfect Diamond'],
      ['gcgs','Chipped Emerald'],['gfgs','Flawed Emerald'],['gsgs','Emerald'],['glgs','Flawless Emerald'],['gpgs','Perfect Emerald'],
      ['gcrs','Chipped Ruby'],['gfrs','Flawed Ruby'],['gsrs','Ruby'],['glrs','Flawless Ruby'],['gprs','Perfect Ruby'],
      ['gcbs','Chipped Sapphire'],['gfbs','Flawed Sapphire'],['gsbs','Sapphire'],['glbs','Flawless Sapphire'],['gpbs','Perfect Sapphire'],
      ['gcys','Chipped Topaz'],['gfys','Flawed Topaz'],['gsys','Topaz'],['glys','Flawless Topaz'],['gpys','Perfect Topaz'],
      ['skcs','Chipped Skull'],['skfs','Flawed Skull'],['skus','Skull'],['skls','Flawless Skull'],['skzs','Perfect Skull'],
      ['key','Key'],['tsc','TP Scroll'],['isc','ID Scroll'],['tbk','TP Tome'],['ibk','ID Tome'],['gold','Gold'],
      ['ear','Ear'],['leg','Wirt\'s Leg'],['ass','Book of Skill'],['toa','Token of Absolution']
    ]
  };

  // Item code autocomplete on the builder's item code input
  function initItemCodeAutocomplete() {
    var input = document.getElementById('item-code-input');
    var dropdown = document.getElementById('itemcode-dropdown');
    if (!input || !dropdown) return;

    // Build flat lookup from all categories
    var allCodes = [];
    var seen = {};
    Object.keys(ITEM_CODES).forEach(function (cat) {
      ITEM_CODES[cat].forEach(function (item) {
        if (!seen[item[0]]) {
          seen[item[0]] = true;
          allCodes.push(item);
        }
      });
    });

    function positionDropdown() {
      var rect = input.getBoundingClientRect();
      dropdown.style.top = rect.bottom + 'px';
      dropdown.style.left = rect.left + 'px';
      dropdown.style.width = Math.max(rect.width, 220) + 'px';
    }

    function showDropdown(matches) {
      dropdown.innerHTML = '';
      if (!matches.length) {
        dropdown.classList.remove('open');
        return;
      }
      positionDropdown();
      matches.slice(0, 15).forEach(function (item) {
        var div = document.createElement('div');
        div.className = 'itemcode-dd-item';
        div.innerHTML = '<span class="itemcode-dd-code">' + item[0] + '</span><span class="itemcode-dd-name">' + escapeHtml(item[1]) + '</span>';
        div.addEventListener('mousedown', function (e) {
          e.preventDefault(); // Prevent blur
          input.value = item[0];
          dropdown.classList.remove('open');
          updateGeneratedRule();
        });
        dropdown.appendChild(div);
      });
      dropdown.classList.add('open');
    }

    input.addEventListener('input', function () {
      var val = this.value.trim().toLowerCase();
      if (val.length < 1) {
        dropdown.classList.remove('open');
        return;
      }
      var matches = allCodes.filter(function (item) {
        return item[0].toLowerCase().indexOf(val) !== -1 || item[1].toLowerCase().indexOf(val) !== -1;
      });
      showDropdown(matches);
    });

    input.addEventListener('focus', function () {
      var val = this.value.trim().toLowerCase();
      if (val.length >= 1) {
        var matches = allCodes.filter(function (item) {
          return item[0].toLowerCase().indexOf(val) !== -1 || item[1].toLowerCase().indexOf(val) !== -1;
        });
        showDropdown(matches);
      }
    });

    input.addEventListener('blur', function () {
      // Small delay so mousedown on dropdown item fires first
      setTimeout(function () { dropdown.classList.remove('open'); }, 150);
    });
  }

  function initItemCodeFinder() {
    var searchInput = document.getElementById('itemcode-search');
    var listEl = document.getElementById('itemcode-list');
    var tabs = document.querySelectorAll('.itemcode-tab');
    var currentCat = 'runes';

    function renderItems(cat, filter) {
      var items = ITEM_CODES[cat] || [];
      if (filter) {
        var f = filter.toLowerCase();
        items = items.filter(function (item) {
          return item[0].toLowerCase().indexOf(f) !== -1 || item[1].toLowerCase().indexOf(f) !== -1;
        });
      }
      listEl.innerHTML = '';
      if (!items.length) {
        listEl.innerHTML = '<div style="padding:0.5rem;color:var(--text-secondary);font-size:0.8rem;">No matches</div>';
        return;
      }
      items.forEach(function (item) {
        var row = document.createElement('div');
        row.className = 'itemcode-row';
        row.title = 'Click to copy: ' + item[0];
        row.innerHTML = '<span class="itemcode-code">' + item[0] + '</span><span class="itemcode-name">' + escapeHtml(item[1]) + '</span><span class="itemcode-copy">copy</span>';
        row.addEventListener('click', function () {
          navigator.clipboard.writeText(item[0]).then(function () {
            var copyEl = row.querySelector('.itemcode-copy');
            copyEl.textContent = 'copied!';
            copyEl.style.opacity = '1';
            setTimeout(function () { copyEl.textContent = 'copy'; copyEl.style.opacity = ''; }, 1000);
          }).catch(function () {
            var copyEl = row.querySelector('.itemcode-copy');
            copyEl.textContent = 'copy failed';
            copyEl.style.opacity = '1';
            setTimeout(function () { copyEl.textContent = 'copy'; copyEl.style.opacity = ''; }, 1000);
          });
        });
        listEl.appendChild(row);
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        currentCat = tab.getAttribute('data-cat');
        renderItems(currentCat, searchInput.value);
      });
    });

    searchInput.addEventListener('input', function () {
      // Search across all categories if there's a filter
      if (this.value.trim()) {
        // Search all categories, show combined results
        var filter = this.value.trim().toLowerCase();
        var allItems = [];
        Object.keys(ITEM_CODES).forEach(function (cat) {
          ITEM_CODES[cat].forEach(function (item) {
            if (item[0].toLowerCase().indexOf(filter) !== -1 || item[1].toLowerCase().indexOf(filter) !== -1) {
              allItems.push(item);
            }
          });
        });
        // Deduplicate by code
        var seen = {};
        var unique = [];
        allItems.forEach(function (item) {
          if (!seen[item[0]]) { seen[item[0]] = true; unique.push(item); }
        });
        listEl.innerHTML = '';
        unique.forEach(function (item) {
          var row = document.createElement('div');
          row.className = 'itemcode-row';
          row.title = 'Click to copy: ' + item[0];
          row.innerHTML = '<span class="itemcode-code">' + item[0] + '</span><span class="itemcode-name">' + escapeHtml(item[1]) + '</span><span class="itemcode-copy">copy</span>';
          row.addEventListener('click', function () {
            navigator.clipboard.writeText(item[0]).then(function () {
              var copyEl = row.querySelector('.itemcode-copy');
              copyEl.textContent = 'copied!';
              copyEl.style.opacity = '1';
              setTimeout(function () { copyEl.textContent = 'copy'; copyEl.style.opacity = ''; }, 1000);
            }).catch(function () {
              var copyEl = row.querySelector('.itemcode-copy');
              copyEl.textContent = 'copy failed';
              copyEl.style.opacity = '1';
              setTimeout(function () { copyEl.textContent = 'copy'; copyEl.style.opacity = ''; }, 1000);
            });
          });
          listEl.appendChild(row);
        });
        if (!unique.length) {
          listEl.innerHTML = '<div style="padding:0.5rem;color:var(--text-secondary);font-size:0.8rem;">No matches</div>';
        }
      } else {
        renderItems(currentCat, '');
      }
    });

    // Initial render
    renderItems(currentCat, '');
  }


  // ==========================================
  // All Items - Bird's Eye View
  // ==========================================
  function buildAllItemsList() {
    // Build comprehensive item list from PREVIEW_ITEMS and ITEM_CODES
    var items = [];
    var seen = {};

    // First add all PREVIEW_ITEMS (they have full flag/value data for accurate matching)
    Object.keys(PREVIEW_ITEMS).forEach(function (key) {
      var pi = PREVIEW_ITEMS[key];
      seen[key] = true;
      var cat = 'nmag';
      if (pi.flags.indexOf('UNI') !== -1) cat = 'uni';
      else if (pi.flags.indexOf('SET') !== -1) cat = 'set';
      else if (pi.flags.indexOf('RARE') !== -1 || pi.flags.indexOf('CRAFT') !== -1) cat = 'rare';
      else if (pi.flags.indexOf('MAG') !== -1) cat = 'mag';
      else if (pi.values && pi.values.RUNE > 0) cat = 'runesgems';
      else if (pi.values && pi.values.GEM > 0) cat = 'runesgems';
      else if (pi.flags.indexOf('MISC') !== -1) cat = 'misc';
      else if (pi.values && pi.values.GOLD > 0) cat = 'misc';
      items.push({
        key: key,
        code: pi.code,
        name: pi.name,
        flags: pi.flags,
        values: pi.values,
        cat: cat,
        hasFullData: true
      });
    });

    // Add items from ITEM_CODES that aren't already in PREVIEW_ITEMS
    var catMap = {
      runes: 'runesgems',
      pd2: 'misc',
      norm: 'nmag',
      exc: 'nmag',
      elt: 'nmag',
      uni: 'uni',
      set: 'set',
      classitems: 'nmag',
      misc: 'misc'
    };

    Object.keys(ITEM_CODES).forEach(function (codeCat) {
      ITEM_CODES[codeCat].forEach(function (entry) {
        var code = entry[0];
        var name = entry[1];
        var itemKey = codeCat + '-' + code;

        // Check if this code is already covered by a PREVIEW_ITEMS entry
        var alreadyHas = items.some(function (it) { return it.code === code && it.cat === catMap[codeCat]; });
        if (alreadyHas) return;

        var flags = ['GROUND'];
        var isCharm = ['cm1', 'cm2', 'cm3'].indexOf(code) !== -1;
        var values = { ILVL: isCharm ? 99 : 85, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 };
        var cat = catMap[codeCat] || 'misc';

        // Set appropriate flags based on category
        if (codeCat === 'runes') {
          var runeNum = parseInt(code.replace(/[^0-9]/g, ''), 10) || 1;
          flags.push('MISC');
          values.RUNE = runeNum;
          values.QTY = 1;
          values.ILVL = 1;
        } else if (codeCat === 'uni') {
          flags.push('UNI');
          if (['rin', 'amu', 'jew'].indexOf(code) !== -1) flags.push('JEWELRY');
          else if (isCharm) flags.push('CHARM');
          else flags.push('ARMOR');
        } else if (codeCat === 'set') {
          flags.push('SET');
          if (['rin', 'amu'].indexOf(code) !== -1) flags.push('JEWELRY');
          else flags.push('ARMOR');
        } else if (codeCat === 'norm') {
          if (code === 'rin' || code === 'amu' || code === 'jew') {
            // Rings, amulets, jewels are never NMAG — they appear as MAG/RARE/UNI/SET
            return;
          }
          flags.push('NMAG', 'NORM');
          if (code.match(/^(aq|cq)/)) flags.push('MISC');
          else flags.push('ARMOR');
        } else if (codeCat === 'exc') {
          flags.push('NMAG', 'EXC');
          flags.push('ARMOR');
        } else if (codeCat === 'elt') {
          flags.push('NMAG', 'ELT');
          flags.push('ARMOR');
        } else if (codeCat === 'classitems') {
          flags.push('NMAG');
          flags.push('WEAPON');
        } else if (codeCat === 'misc') {
          flags.push('MISC');
          if (code.match(/^g[cfglps][a-z]s$/) || code.match(/^sk[cfulz]s$/)) {
            var gemLevelMap = { c: 1, f: 2, s: 3, l: 4, p: 5 };
            values.GEM = gemLevelMap[code[1]] || 1;
            cat = 'runesgems';
            values.ILVL = 1;
          } else if (isCharm) {
            flags.push('CHARM');
            cat = 'mag';
          } else if (code === 'gold') {
            flags = ['GROUND'];
            values = { GOLD: 5000, ILVL: 0, SOCKETS: 0, RUNE: 0, GEM: 0 };
          } else {
            values.ILVL = 1;
          }
        } else if (codeCat === 'pd2') {
          flags.push('MISC');
          values.ILVL = 1;
        }

        items.push({
          key: itemKey,
          code: code,
          name: name,
          flags: flags,
          values: values,
          cat: cat,
          hasFullData: false
        });
      });
    });

    // Generate MAG and RARE entries for all equipment bases and charms
    var equipCats = ['norm', 'exc', 'elt', 'classitems'];
    var magRareSkip = ['aqv', 'cqv']; // quivers: no magic/rare
    equipCats.forEach(function (codeCat) {
      ITEM_CODES[codeCat].forEach(function (entry) {
        var code = entry[0];
        var name = entry[1];
        if (magRareSkip.indexOf(code) !== -1) return;

        var tierFlag = codeCat === 'exc' ? 'EXC' : codeCat === 'elt' ? 'ELT' : 'NORM';
        var equipFlag = codeCat === 'classitems' ? 'WEAPON' : 'ARMOR';

        // MAG version
        var magKey = 'mag-gen-' + code;
        if (!items.some(function (it) { return it.code === code && it.cat === 'mag'; })) {
          items.push({
            key: magKey, code: code, name: name,
            flags: ['GROUND', 'MAG', tierFlag, equipFlag],
            values: { ILVL: 85, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 },
            cat: 'mag', hasFullData: false
          });
        }

        // RARE version (not class items — those are class-specific)
        var rareKey = 'rare-gen-' + code;
        if (!items.some(function (it) { return it.code === code && it.cat === 'rare'; })) {
          items.push({
            key: rareKey, code: code, name: name,
            flags: ['GROUND', 'RARE', tierFlag, equipFlag],
            values: { ILVL: 85, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 },
            cat: 'rare', hasFullData: false
          });
        }
      });
    });

    // MAG charms (ilvl 99)
    [['cm1','Small Charm'],['cm2','Large Charm'],['cm3','Grand Charm']].forEach(function (entry) {
      var code = entry[0], name = entry[1];
      if (!items.some(function (it) { return it.code === code && it.cat === 'mag'; })) {
        items.push({
          key: 'mag-charm-' + code, code: code, name: name,
          flags: ['GROUND', 'MAG', 'CHARM'],
          values: { ILVL: 99, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 },
          cat: 'mag', hasFullData: false
        });
      }
    });

    // MAG jewelry
    [['rin','Ring'],['amu','Amulet'],['jew','Jewel']].forEach(function (entry) {
      var code = entry[0], name = entry[1];
      if (!items.some(function (it) { return it.code === code && it.cat === 'mag'; })) {
        items.push({
          key: 'mag-jewel-' + code, code: code, name: name,
          flags: ['GROUND', 'MAG', 'JEWELRY'],
          values: { ILVL: 85, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 },
          cat: 'mag', hasFullData: false
        });
      }
    });

    // RARE jewelry
    [['rin','Ring'],['amu','Amulet'],['jew','Jewel']].forEach(function (entry) {
      var code = entry[0], name = entry[1];
      if (!items.some(function (it) { return it.code === code && it.cat === 'rare'; })) {
        items.push({
          key: 'rare-jewel-' + code, code: code, name: name,
          flags: ['GROUND', 'RARE', 'JEWELRY'],
          values: { ILVL: 85, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 },
          cat: 'rare', hasFullData: false
        });
      }
    });

    // Generate NMAG variants: Superior, Ethereal, Superior+Ethereal
    var nmagSkip = ['rin', 'amu', 'jew', 'aqv', 'cqv', 'aqv3', 'cqv3']; // jewelry/quivers: no SUP/ETH
    var nmagBases = items.filter(function (it) {
      return it.cat === 'nmag' && nmagSkip.indexOf(it.code) === -1 &&
        it.flags.indexOf('SUP') === -1 && it.flags.indexOf('ETH') === -1 &&
        it.flags.indexOf('MISC') === -1;
    });
    nmagBases.forEach(function (base) {
      var isWeapon = base.flags.indexOf('WEAPON') !== -1;
      var edKey = isWeapon ? 'EDAM' : 'EDEF';

      // Superior variant
      var supFlags = base.flags.slice();
      supFlags.push('SUP');
      var supValues = {};
      for (var k in base.values) supValues[k] = base.values[k];
      supValues[edKey] = 15;
      items.push({
        key: base.key + '-sup', code: base.code, name: 'Sup ' + base.name,
        flags: supFlags, values: supValues, cat: 'nmag', hasFullData: false
      });

      // Ethereal variant
      var ethFlags = base.flags.slice();
      ethFlags.push('ETH');
      items.push({
        key: base.key + '-eth', code: base.code, name: 'Eth ' + base.name,
        flags: ethFlags, values: Object.assign({}, base.values), cat: 'nmag', hasFullData: false
      });

      // Superior + Ethereal variant
      var supEthFlags = base.flags.slice();
      supEthFlags.push('SUP', 'ETH');
      var supEthValues = {};
      for (var k2 in base.values) supEthValues[k2] = base.values[k2];
      supEthValues[edKey] = 15;
      items.push({
        key: base.key + '-sup-eth', code: base.code, name: 'Sup Eth ' + base.name,
        flags: supEthFlags, values: supEthValues, cat: 'nmag', hasFullData: false
      });
    });

    // Generate ETH variants for MAG items (equipment only, not jewelry/charms)
    var magEthSkip = ['rin', 'amu', 'jew', 'cm1', 'cm2', 'cm3'];
    var magBases = items.filter(function (it) {
      return it.cat === 'mag' && magEthSkip.indexOf(it.code) === -1 &&
        it.flags.indexOf('ETH') === -1 &&
        it.flags.indexOf('MISC') === -1 && it.flags.indexOf('CHARM') === -1 &&
        it.flags.indexOf('JEWELRY') === -1;
    });
    magBases.forEach(function (base) {
      var ethFlags = base.flags.slice();
      ethFlags.push('ETH');
      items.push({
        key: base.key + '-eth', code: base.code, name: 'Eth ' + base.name,
        flags: ethFlags, values: Object.assign({}, base.values), cat: 'mag', hasFullData: false
      });
    });

    // Generate ETH variants for RARE items (equipment only, not jewelry)
    var rareEthSkip = ['rin', 'amu', 'jew'];
    var rareBases = items.filter(function (it) {
      return it.cat === 'rare' && rareEthSkip.indexOf(it.code) === -1 &&
        it.flags.indexOf('ETH') === -1 &&
        it.flags.indexOf('MISC') === -1 &&
        it.flags.indexOf('JEWELRY') === -1;
    });
    rareBases.forEach(function (base) {
      var ethFlags = base.flags.slice();
      ethFlags.push('ETH');
      items.push({
        key: base.key + '-eth', code: base.code, name: 'Eth ' + base.name,
        flags: ethFlags, values: Object.assign({}, base.values), cat: 'rare', hasFullData: false
      });
    });

    return items;
  }

  var ALL_ITEMS_CACHE = null;

  function parseFilterLevelNames(text) {
    var names = {};
    var lines = text.split('\n');
    var level = 1;
    for (var i = 0; i < lines.length; i++) {
      var m = lines[i].match(/^ItemDisplayFilterName\s*\[\s*\]\s*:\s*(.+)/);
      if (m) {
        names[level] = m[1].trim();
        level++;
      }
    }
    return names;
  }

  function populateFilterLevelDropdown(selectEl, nameEl, text) {
    var names = parseFilterLevelNames(text);
    var currentVal = selectEl.value || '1';
    selectEl.innerHTML = '<option value="0">0 — Off</option>';
    var maxLevel = Math.max(Object.keys(names).length, 1);
    for (var lvl = 1; lvl <= maxLevel; lvl++) {
      var label = names[lvl] ? lvl + ' — ' + names[lvl] : String(lvl);
      selectEl.innerHTML += '<option value="' + lvl + '"' + (String(lvl) === currentVal ? ' selected' : '') + '>' + label + '</option>';
    }
    // Show current level name at top
    var cur = parseInt(selectEl.value, 10);
    nameEl.textContent = names[cur] || '';
  }

  function initAllItems() {
    var resultsEl = document.getElementById('allitems-results');
    var statsEl = document.getElementById('allitems-stats');
    var filtlvlSelect = document.getElementById('allitems-filtlvl-select');
    var filtlvlName = document.getElementById('allitems-filtlvl-name');
    var catButtons = document.querySelectorAll('.allitems-cat');

    if (!resultsEl) return;

    var currentCat = 'runesgems';
    // Set default active button
    catButtons.forEach(function (b) {
      b.classList.remove('active');
      if (b.getAttribute('data-cat') === 'runesgems') b.classList.add('active');
    });

    catButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        catButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentCat = btn.getAttribute('data-cat');
        renderAllItems();
      });
    });

    filtlvlSelect.addEventListener('change', function () {
      var names = parseFilterLevelNames(typeof getFullFilterText === 'function' ? getFullFilterText() : codeEditor.value);
      filtlvlName.textContent = names[parseInt(this.value, 10)] || '';
      renderAllItems();
    });

    var renderPending = false;

    function renderAllItems() {
      if (renderPending) return;
      renderPending = true;

      // Show loading spinner
      resultsEl.innerHTML = '<div class="allitems-loading"><div class="allitems-spinner"></div><p>Loading items...</p></div>';
      statsEl.innerHTML = '';

      // Use setTimeout to allow the spinner to paint before heavy work
      setTimeout(function () {
        if (!ALL_ITEMS_CACHE) {
          ALL_ITEMS_CACHE = buildAllItemsList();
        }
        var items = ALL_ITEMS_CACHE;
        var filtlvl = parseInt(filtlvlSelect.value, 10);

        // Sync filtlvl to the preview select so matchItem picks it up
        var previewFL = document.getElementById('preview-filtlvl');
        if (previewFL) previewFL.value = filtlvl;

        // Filter by category
        var filtered = items;
        if (currentCat !== 'all') {
          filtered = items.filter(function (it) { return it.cat === currentCat; });
        }

        // Parse current filter rules
        var text = typeof getFullFilterText === 'function' ? getFullFilterText() : codeEditor.value;

        // Populate the filter level dropdown with names from the filter
        populateFilterLevelDropdown(filtlvlSelect, filtlvlName, text);
        var lines = text.split('\n');
        var rules = parseRules(lines);

        var html = '';
        var shownCount = 0;
        var hiddenCount = 0;
        var defaultCount = 0;

        filtered.forEach(function (item) {
          var previewItem = {
            code: item.code,
            name: item.name,
            flags: item.flags,
            values: item.values
          };

          var result = matchItem(previewItem, rules);
          var status = 'default';
          if (!result.matched) status = 'default';
          else if (result.hidden) status = 'hide';
          else status = 'show';

          if (status === 'show') shownCount++;
          else if (status === 'hide') hiddenCount++;
          else defaultCount++;

          var cssClass = 'allitems-item';
          if (status === 'hide') cssClass += ' allitems-item-hidden';
          else if (status === 'show') cssClass += ' allitems-item-shown';
          else cssClass += ' allitems-item-default';

          var nameClass = 'allitems-item-name';
          if (item.cat === 'mag') nameClass += ' allitems-name-mag';
          else if (item.cat === 'rare') nameClass += ' allitems-name-rare';
          else if (item.cat === 'set') nameClass += ' allitems-name-set';
          else if (item.cat === 'uni') nameClass += ' allitems-name-uni';
          else if (item.cat === 'runesgems' && item.values && item.values.RUNE > 0) nameClass += ' allitems-name-rune';

          html += '<div class="' + cssClass + '" title="' + escapeHtml(item.code) + ' | ' + escapeHtml(item.flags.join(' ')) + '">';
          html += '<span class="' + nameClass + '">' + escapeHtml(item.name) + '</span>';
          html += '<span class="allitems-item-code">' + escapeHtml(item.code) + '</span>';
          html += '<span class="allitems-item-status allitems-status-' + status + '">' + status + '</span>';
          html += '</div>';
        });

        if (!filtered.length) {
          html = '<p class="text-muted text-center">No items in this category.</p>';
        }

        resultsEl.innerHTML = html;
        statsEl.innerHTML = '<span class="allitems-stat-shown">' + shownCount + ' shown</span> · <span class="allitems-stat-hidden">' + hiddenCount + ' hidden</span> · <span class="allitems-stat-default">' + defaultCount + ' default</span> · <span>' + filtered.length + ' total</span>';
        renderPending = false;
      }, 20);
    }

    // Expose for tab switching
    initAllItems.render = renderAllItems;
  }

  // ==========================================
  // Import from Community Author
  // ==========================================
  var AUTHOR_FILTERS_DATA = [
    {name:"Wolfie's PD2 Loot Filters",author:"Wolfie",repo:"WolfieeifloW/pd2filter",files:[
      {name:"btneandertha1.filter",url:"https://raw.githubusercontent.com/WolfieeifloW/pd2filter/main/btneandertha1.filter",size:335391},
      {name:"combined.filter",url:"https://raw.githubusercontent.com/WolfieeifloW/pd2filter/main/combined.filter",size:510450},
      {name:"template.filter",url:"https://raw.githubusercontent.com/WolfieeifloW/pd2filter/main/template.filter",size:23553}
    ]},
    {name:"Kryszard's PD2 Loot Filter",author:"Kryszard",repo:"Kryszard-POD/Kryszard-s-PD2-Loot-Filter",files:[
      {name:"futureal.filter",url:"https://raw.githubusercontent.com/Kryszard-POD/Kryszard-s-PD2-Loot-Filter/main/futureal.filter",size:724417},
      {name:"item.filter",url:"https://raw.githubusercontent.com/Kryszard-POD/Kryszard-s-PD2-Loot-Filter/main/item.filter",size:720579}
    ]},
    {name:"Kassahi's PD2 Filter",author:"Kassahi",repo:"KassahiPD2/Kassahi",files:[
      {name:"Meme-Hyper.filter",url:"https://raw.githubusercontent.com/KassahiPD2/Kassahi/main/Meme-Hyper.filter",size:1003410},
      {name:"Meme.filter",url:"https://raw.githubusercontent.com/KassahiPD2/Kassahi/main/Meme.filter",size:1002787},
      {name:"Mystery-Hyper.filter",url:"https://raw.githubusercontent.com/KassahiPD2/Kassahi/main/Mystery-Hyper.filter",size:1003541},
      {name:"Mystery-Luxe.filter",url:"https://raw.githubusercontent.com/KassahiPD2/Kassahi/main/Mystery-Luxe.filter",size:1006420},
      {name:"Mystery.filter",url:"https://raw.githubusercontent.com/KassahiPD2/Kassahi/main/Mystery.filter",size:1002924},
      {name:"Regular-Hyper.filter",url:"https://raw.githubusercontent.com/KassahiPD2/Kassahi/main/Regular-Hyper.filter",size:1001978},
      {name:"Regular-Luxe.filter",url:"https://raw.githubusercontent.com/KassahiPD2/Kassahi/main/Regular-Luxe.filter",size:1004813},
      {name:"Regular.filter",url:"https://raw.githubusercontent.com/KassahiPD2/Kassahi/main/Regular.filter",size:1001355}
    ]},
    {name:"Erazure's PD2 Loot Filter",author:"Erazure",repo:"FiltersBy-Erazure/PD2-Loot-Filter",files:[
      {name:"Erazure-BIG-GG-PoE.filter",displayName:"BIG GG \u2014 PoE Sounds",description:"Strict filter with PoE-style drop sounds.",url:"https://raw.githubusercontent.com/FiltersBy-Erazure/PD2-Loot-Filter/main/Erazure-BIG-GG-PoE.filter",size:775381},
      {name:"Erazure-BIG-GG.filter",displayName:"BIG GG",description:"Strict filter for endgame mapping.",url:"https://raw.githubusercontent.com/FiltersBy-Erazure/PD2-Loot-Filter/main/Erazure-BIG-GG.filter",size:774777},
      {name:"Erazure-Main-PoE.filter",displayName:"Main \u2014 PoE Sounds",description:"Standard filter with PoE-style drop sounds.",url:"https://raw.githubusercontent.com/FiltersBy-Erazure/PD2-Loot-Filter/main/Erazure-Main-PoE.filter",size:770903},
      {name:"Erazure-Main.filter",displayName:"Main",description:"Standard all-purpose filter.",url:"https://raw.githubusercontent.com/FiltersBy-Erazure/PD2-Loot-Filter/main/Erazure-Main.filter",size:770819}
    ]},
    {name:"HiimFilter by Maaaark + HiimDave",author:"HiimFilter",repo:"Maaaaaarrk/HiimFilter-PD2-Filter",
      definitionsUrl:"https://raw.githubusercontent.com/Maaaaaarrk/HiimFilter-PD2-Filter/main/filter_definitions.json",
      files:[
      {name:"Hiim.filter",displayName:"Hiim \u2014 Standard",description:"All-in-one balanced filter. The standard recommendation for most players.",url:"https://raw.githubusercontent.com/Maaaaaarrk/HiimFilter-PD2-Filter/main/Hiim.filter",size:695221},
      {name:"Hiim_Crafting_Amazon_Focused.filter",displayName:"Class \u2014 Amazon",description:"Class filter tuned for Amazon. Shows Amazon-relevant items and crafting bases at higher filter levels.",url:"https://raw.githubusercontent.com/Maaaaaarrk/HiimFilter-PD2-Filter/main/Hiim_Crafting_Amazon_Focused.filter",size:691835},
      {name:"Hiim_Crafting_Assassin_Focused.filter",displayName:"Class \u2014 Assassin",description:"Class filter tuned for Assassin. Shows Assassin-relevant items and crafting bases at higher filter levels.",url:"https://raw.githubusercontent.com/Maaaaaarrk/HiimFilter-PD2-Filter/main/Hiim_Crafting_Assassin_Focused.filter",size:691556},
      {name:"Hiim_Crafting_Barbarian_Focused.filter",displayName:"Class \u2014 Barbarian",description:"Class filter tuned for Barbarian. Shows Barbarian-relevant items and crafting bases at higher filter levels.",url:"https://raw.githubusercontent.com/Maaaaaarrk/HiimFilter-PD2-Filter/main/Hiim_Crafting_Barbarian_Focused.filter",size:692662},
      {name:"Hiim_Crafting_Druid_Focused.filter",displayName:"Class \u2014 Druid",description:"Class filter tuned for Druid. Shows Druid-relevant items and crafting bases at higher filter levels.",url:"https://raw.githubusercontent.com/Maaaaaarrk/HiimFilter-PD2-Filter/main/Hiim_Crafting_Druid_Focused.filter",size:691185},
      {name:"Hiim_Crafting_Necromancer_Focused.filter",displayName:"Class \u2014 Necromancer",description:"Class filter tuned for Necromancer. Shows Necromancer-relevant items and crafting bases at higher filter levels.",url:"https://raw.githubusercontent.com/Maaaaaarrk/HiimFilter-PD2-Filter/main/Hiim_Crafting_Necromancer_Focused.filter",size:690811},
      {name:"Hiim_Crafting_Paladin_Focused.filter",displayName:"Class \u2014 Paladin",description:"Class filter tuned for Paladin. Shows Paladin-relevant items and crafting bases at higher filter levels.",url:"https://raw.githubusercontent.com/Maaaaaarrk/HiimFilter-PD2-Filter/main/Hiim_Crafting_Paladin_Focused.filter",size:691266},
      {name:"Hiim_Crafting_Sorceress_Focused.filter",displayName:"Class \u2014 Sorceress",description:"Class filter tuned for Sorceress. Shows Sorceress-relevant items and crafting bases at higher filter levels.",url:"https://raw.githubusercontent.com/Maaaaaarrk/HiimFilter-PD2-Filter/main/Hiim_Crafting_Sorceress_Focused.filter",size:690551},
      {name:"Hiim_Crafting.filter",displayName:"Crafting",description:"Same as the standard filter, but good crafting bases are not limited in higher filter levels.",url:"https://raw.githubusercontent.com/Maaaaaarrk/HiimFilter-PD2-Filter/main/Hiim_Crafting.filter",size:695038},
      {name:"Hiim_Grail.filter",displayName:"Grail Friendly",description:"All-in-one filter that always shows Uniques and Set items on filter levels 1-8.",url:"https://raw.githubusercontent.com/Maaaaaarrk/HiimFilter-PD2-Filter/main/Hiim_Grail.filter",size:695072},
      {name:"Hiim_LLD_Focused.filter",displayName:"LLD",description:"Shows LLD-relevant items at higher filter levels. Includes LLD jewel point evaluation and LLD tags.",url:"https://raw.githubusercontent.com/Maaaaaarrk/HiimFilter-PD2-Filter/main/Hiim_LLD_Focused.filter",size:698176},
      {name:"Hiim_LLD_Hyper.filter",displayName:"LLD \u2014 Hyper",description:"LLD Focused filter with a Hyper visual theme.",url:"https://raw.githubusercontent.com/Maaaaaarrk/HiimFilter-PD2-Filter/main/Hiim_LLD_Hyper.filter",size:699474},
      {name:"Hiim_Mystery.filter",displayName:"Mystery",description:"All-in-one filter where Runes Pul+ and GG uniques are renamed to hide their identity.",url:"https://raw.githubusercontent.com/Maaaaaarrk/HiimFilter-PD2-Filter/main/Hiim_Mystery.filter",size:701089},
      {name:"Hiim_Only_Filter.filter",displayName:"Only A Filter",description:"Filtering only, no annotations or re-naming.",url:"https://raw.githubusercontent.com/Maaaaaarrk/HiimFilter-PD2-Filter/main/Hiim_Only_Filter.filter",size:190498},
      {name:"Hiim_Hyper.filter",displayName:"Style \u2014 Hyper",description:"All-in-one filter with a Hyper visual theme.",url:"https://raw.githubusercontent.com/Maaaaaarrk/HiimFilter-PD2-Filter/main/Hiim_Hyper.filter",size:696423},
      {name:"Hiim_TalRasha_Themed.filter",displayName:"Style \u2014 TalRasha",description:"All-in-one filter with a TalRasha color theme.",url:"https://raw.githubusercontent.com/Maaaaaarrk/HiimFilter-PD2-Filter/main/Hiim_TalRasha_Themed.filter",size:695227},
      {name:"Hiim_Vanilla_Plus.filter",displayName:"Vanilla Plus",description:"All-in-one filter without item re-naming.",url:"https://raw.githubusercontent.com/Maaaaaarrk/HiimFilter-PD2-Filter/main/Hiim_Vanilla_Plus.filter",size:609129},
      {name:"Hiim_Closed_Beta.filter",displayName:"Closed Beta",description:"Filter for closed beta testing.",url:"https://raw.githubusercontent.com/Maaaaaarrk/HiimFilter-PD2-Filter/main/Hiim_Closed_Beta.filter",size:695339}
    ]},
    {name:"eqN's PD2 Filters",author:"eqN",repo:"eqNj/eqN-PD2-Filter",files:[
      {name:"eqN-All-In-One.filter",url:"https://raw.githubusercontent.com/eqNj/eqN-PD2-Filter/main/eqN-All-In-One.filter",size:1050813},
      {name:"eqN-Potionless.filter",url:"https://raw.githubusercontent.com/eqNj/eqN-PD2-Filter/main/eqN-Potionless.filter",size:1052580},
      {name:"eqN-Specialized-LLD.filter",url:"https://raw.githubusercontent.com/eqNj/eqN-PD2-Filter/main/eqN-Specialized-LLD.filter",size:5339620},
      {name:"eqN-Specialized-SSF.filter",url:"https://raw.githubusercontent.com/eqNj/eqN-PD2-Filter/main/eqN-Specialized-SSF.filter",size:1054432}
    ]},
    {name:"DarkHumility + ADev Filter",author:"ADevDH",repo:"DarkHumility/DHFilter",files:[
      {name:"dark.filter",url:"https://raw.githubusercontent.com/DarkHumility/DHFilter/main/dark.filter",size:337513}
    ]},
    {name:"PiLLLa Filter",author:"PiLLLa",repo:"PiLLLaa/pd2",files:[
      {name:"S12_Blank.filter",url:"https://raw.githubusercontent.com/PiLLLaa/pd2/main/S12_Blank.filter",size:1768449},
      {name:"S12_Hype.filter",url:"https://raw.githubusercontent.com/PiLLLaa/pd2/main/S12_Hype.filter",size:1771318},
      {name:"S12_Hype_POEsound.filter",url:"https://raw.githubusercontent.com/PiLLLaa/pd2/main/S12_Hype_POEsound.filter",size:1543768},
      {name:"S12_NoBlank.filter",url:"https://raw.githubusercontent.com/PiLLLaa/pd2/main/S12_NoBlank.filter",size:1743449},
      {name:"S12_PurpleGold_hide.filter",url:"https://raw.githubusercontent.com/PiLLLaa/pd2/main/S12_PurpleGold_hide.filter",size:1736547},
      {name:"S12_Starter.filter",url:"https://raw.githubusercontent.com/PiLLLaa/pd2/main/S12_Starter.filter",size:1695620}
    ]},
    {name:"Roofoo's Filter",author:"Roofoo",repo:"RoofooEvazan/Roofoo-s-PD2-Loot-Filter",files:[
      {name:"Roofoo.filter",url:"https://raw.githubusercontent.com/RoofooEvazan/Roofoo-s-PD2-Loot-Filter/main/Roofoo.filter",size:737758}
    ]},
    {name:"Dauracul's PD2 Loot Filter",author:"Dauracul",repo:"Dauracul/filter",files:[
      {name:"dauracul.filter",url:"https://raw.githubusercontent.com/Dauracul/filter/main/dauracul.filter",size:514739}
    ]},
    {name:"Sven's Filter",author:"Sven",repo:"StandInTheRiver/Sven-s-Filter",files:[
      {name:"loot.filter",url:"https://raw.githubusercontent.com/StandInTheRiver/Sven-s-Filter/main/loot.filter",size:637955}
    ]},
    {name:"Loot Goblin Filter",author:"PreyInstinct",repo:"PreyInstinct/Loot-Goblin-Filter",files:[
      {name:"Loot_Goblin.filter",url:"https://raw.githubusercontent.com/PreyInstinct/Loot-Goblin-Filter/main/Loot_Goblin.filter",size:1373241},
      {name:"Loot_Goblin_experimental.filter",url:"https://raw.githubusercontent.com/PreyInstinct/Loot-Goblin-Filter/main/Loot_Goblin_experimental.filter",size:1373241}
    ]},
    {name:"Phyx10n's Filter",author:"Phyx10n",repo:"Phyx10n/PD2-Filter",files:[
      {name:"crafting+revealed.filter",url:"https://raw.githubusercontent.com/Phyx10n/PD2-Filter/main/crafting+revealed.filter",size:175253},
      {name:"crafting.filter",url:"https://raw.githubusercontent.com/Phyx10n/PD2-Filter/main/crafting.filter",size:175254},
      {name:"main.filter",url:"https://raw.githubusercontent.com/Phyx10n/PD2-Filter/main/main.filter",size:175255},
      {name:"revealed.filter",url:"https://raw.githubusercontent.com/Phyx10n/PD2-Filter/main/revealed.filter",size:175254}
    ]}
  ];
  var authorFilters = [];

  function initAuthorImport() {
    var modal = document.getElementById('author-modal');
    var btnOpen = document.getElementById('btn-import-author');
    var btnClose = document.getElementById('author-modal-close');
    var btnBack = document.getElementById('author-back');
    var step1 = document.getElementById('author-step-1');
    var step2 = document.getElementById('author-step-2');
    var step3 = document.getElementById('author-step-3');
    var step4 = document.getElementById('author-step-4');
    var authorList = document.getElementById('author-list');
    var fileList = document.getElementById('filter-file-list');
    var selectedName = document.getElementById('author-selected-name');
    var loadingMsg = document.getElementById('author-loading-msg');

    function showModal() {
      modal.style.display = 'flex';
      showStep(1);
      loadAuthorList();
    }

    function hideModal() {
      modal.style.display = 'none';
    }

    function showStep(n) {
      step1.style.display = n === 1 ? 'block' : 'none';
      step2.style.display = n === 2 ? 'block' : 'none';
      step3.style.display = n === 3 ? 'block' : 'none';
      step4.style.display = n === 4 ? 'block' : 'none';
    }

    btnOpen.addEventListener('click', showModal);
    btnClose.addEventListener('click', hideModal);
    btnBack.addEventListener('click', function () { showStep(1); });

    modal.addEventListener('click', function (e) {
      if (e.target === modal) hideModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.style.display !== 'none') hideModal();
    });

    function loadAuthorList() {
      if (!authorFilters.length) {
        authorFilters = AUTHOR_FILTERS_DATA.filter(function (a) { return a.files && a.files.length > 0; });
      }
      renderAuthors();
    }

    function renderAuthors() {
      authorList.innerHTML = '';
      authorFilters.forEach(function (f) {
        var fileCount = f.files.length;
        var item = document.createElement('div');
        item.className = 'author-item';
        item.innerHTML =
          '<div>' +
            '<div class="author-item-name">' + escapeHtml(f.name) + '</div>' +
            '<div class="author-item-by">by ' + escapeHtml(f.author) + ' &middot; ' + fileCount + ' filter' + (fileCount !== 1 ? 's' : '') + '</div>' +
          '</div>' +
          '<span class="author-item-arrow">&#9654;</span>';
        item.addEventListener('click', function () {
          selectAuthor(f);
        });
        authorList.appendChild(item);
      });
    }

    function selectAuthor(f) {
      selectedName.textContent = f.name + ' by ' + f.author;
      showStep(2);

      // If the author has a definitionsUrl, try fetching live definitions first
      // to pick up any newly added filters since our static data was built
      if (f.definitionsUrl) {
        fileList.innerHTML = '<p class="text-muted text-center">Loading filter list...</p>';
        fetch(f.definitionsUrl)
          .then(function (res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json();
          })
          .then(function (defs) {
            // Build file list from live definitions
            var info = defs.filter_info;
            if (!info) throw new Error('No filter_info');
            var baseUrl = f.definitionsUrl.replace('filter_definitions.json', '');
            var liveFiles = [];
            Object.keys(info).forEach(function (key) {
              var entry = info[key];
              liveFiles.push({
                name: entry.file_name,
                displayName: entry.display_name,
                description: entry.description,
                url: baseUrl + entry.file_name
              });
            });
            renderFileList(liveFiles, f);
          })
          .catch(function () {
            // Fall back to static data
            renderFileList(f.files, f);
          });
      } else {
        renderFileList(f.files, f);
      }
    }

    function renderFileList(files, author) {
      fileList.innerHTML = '';
      files.forEach(function (file) {
        var sizeKB = file.size ? (file.size / 1024).toFixed(0) + ' KB' : '';
        var hasDetails = file.displayName || file.description;
        var item = document.createElement('div');
        item.className = 'filter-file-item' + (hasDetails ? ' filter-file-detailed' : '');

        if (hasDetails) {
          item.innerHTML =
            '<div class="filter-file-info">' +
              '<div class="filter-file-display-name">' + escapeHtml(file.displayName || file.name) + '</div>' +
              (file.description ? '<div class="filter-file-desc">' + escapeHtml(file.description) + '</div>' : '') +
              '<div class="filter-file-filename">' + escapeHtml(file.name) + '</div>' +
            '</div>' +
            (sizeKB ? '<span class="filter-file-size">' + sizeKB + '</span>' : '');
        } else {
          item.innerHTML =
            '<span class="filter-file-name">' + escapeHtml(file.name) + '</span>' +
            '<span class="filter-file-size">' + sizeKB + '</span>';
        }

        item.addEventListener('click', function () {
          downloadFilterFile(file, author);
        });
        fileList.appendChild(item);
      });
    }

    // Auto-open to a specific author (from ?author= URL param)
    function openToAuthor(authorName) {
      loadAuthorList();
      var match = authorFilters.find(function (f) {
        return f.author.toLowerCase() === authorName.toLowerCase();
      });
      if (match) {
        showModal();
        selectAuthor(match);
      }
    }

    // Expose for URL param handling
    initAuthorImport.openToAuthor = openToAuthor;

    function downloadFilterFile(file, author) {
      showStep(3);
      loadingMsg.textContent = 'Downloading ' + file.name + '...';

      // Fetch as binary to handle both UTF-8 and ANSI/Latin-1 encoded filters
      // Some filters (like Kassahi) use 0xFF-based color codes that require Latin-1
      fetch(file.url)
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.arrayBuffer();
        })
        .then(function (buf) {
          // Try UTF-8 first
          var text = new TextDecoder('utf-8').decode(buf);
          // If it contains replacement chars (U+FFFD), the file isn't valid UTF-8
          // Fall back to Windows-1252 (ANSI) which preserves 0xFF etc.
          if (text.indexOf('\uFFFD') !== -1) {
            text = new TextDecoder('windows-1252').decode(buf);
          }
          // Show step 4: choice between community mode and full editor
          document.getElementById('author-choice-file').textContent = file.name + ' by ' + author.author;
          showStep(4);

          var btnCommunity = document.getElementById('btn-import-community');
          var btnFull = document.getElementById('btn-import-full');

          // Remove old listeners by cloning
          var newBtnC = btnCommunity.cloneNode(true);
          var newBtnF = btnFull.cloneNode(true);
          btnCommunity.parentNode.replaceChild(newBtnC, btnCommunity);
          btnFull.parentNode.replaceChild(newBtnF, btnFull);

          newBtnC.addEventListener('click', function () {
            enterCommunityMode(text, file.name, author.author, file.url, false);
            hideModal();
          });

          newBtnF.addEventListener('click', function () {
            if (codeEditor.value.trim() && !confirm('This will replace your current filter. Continue?')) {
              showStep(4);
              return;
            }
            if (communityMode.active) {
              communityMode.active = false;
              saveCommunityState();
              document.getElementById('pane-community').style.display = 'none';
              document.getElementById('pane-code').style.display = 'block';
            }
            codeEditor.value = text;
            updateLineNumbers();
            saveToStorage();
            hideModal();
          });
        })
        .catch(function () {
          loadingMsg.innerHTML = 'Failed to download file.';
          setTimeout(function () { showStep(2); }, 2000);
        });
    }
  }

  // ==========================================
  // Initialize everything
  // ==========================================
  function init() {
    if (!codeEditor) return; // Not on editor page
    loadFromStorage();
    updateLineNumbers();

    // Restore community edit mode if it was active
    loadCommunityState();

    initChips();
    initPanelToggles();
    initValueConditions();
    initSkillConditions();
    initTextInputs();
    initImportExport();
    initTabs();
    initGrail();
    initPreview();
    initBuilderActions();
    initWizard();
    initItemCodeFinder();
    initItemCodeAutocomplete();
    initAuthorImport();
    initCommunityMode();
    initAllItems();

    // Auto-open author import if ?author= in URL
    var urlParams2 = new URLSearchParams(window.location.search);
    var authorParam = urlParams2.get('author');
    if (authorParam && initAuthorImport.openToAuthor) {
      initAuthorImport.openToAuthor(authorParam);
      urlParams2.delete('author');
      history.replaceState(null, '', window.location.pathname + (urlParams2.toString() ? '?' + urlParams2.toString() : '') + window.location.hash);
    }

    // Code editor events
    var inputDebounce = null;
    codeEditor.addEventListener('input', function () {
      // Immediately hide highlight so typed characters show in plain text
      hideHighlight();

      // After 500ms idle: re-highlight, update stats, save
      clearTimeout(inputDebounce);
      inputDebounce = setTimeout(function () {
        updateLineNumbers();
        saveToStorage();
      }, 500);
    });
    var editorWrap = document.querySelector('.code-editor-wrap');
    editorWrap.addEventListener('scroll', syncScroll);
    codeEditor.addEventListener('keydown', handleTab);

    // Initial rule generation
    updateGeneratedRule();
  }

  init();
})();
