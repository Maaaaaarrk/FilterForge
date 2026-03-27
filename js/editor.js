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
    tier: '',
    properties: [],
    equipment: '',
    weapons: '',
    misc: '',
    classitems: '',
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
  // Templates
  // ==========================================
  var TEMPLATES = {
    starter: [
      '// ==========================================',
      '// Filter Forge — Starter Filter',
      '// A beginner-friendly filter that shows most items',
      '// ==========================================',
      '',
      '// --- Filter Level Names ---',
      'ItemDisplayFilterName[]: Level 1 - Show Everything',
      'ItemDisplayFilterName[]: Level 2 - Hide Junk',
      'ItemDisplayFilterName[]: Level 3 - Normal',
      '',
      '// --- High Value: Unique, Set, Rare ---',
      'ItemDisplay[UNI]: %GOLD%%NAME%%MAP%',
      'ItemDisplay[SET]: %GREEN%%NAME%%MAP%',
      'ItemDisplay[RARE]: %YELLOW%%NAME%',
      '',
      '// --- Runes ---',
      'ItemDisplay[RUNE>19]: %ORANGE%%RUNENAME% Rune%BORDER%%SOUNDID-4718%',
      'ItemDisplay[RUNE>10]: %ORANGE%%RUNENAME% Rune%MAP%',
      'ItemDisplay[RUNE>0]: %ORANGE%%RUNENAME% Rune',
      '',
      '// --- Gems ---',
      'ItemDisplay[GEM=5]: %PURPLE%%NAME%%DOT%',
      'ItemDisplay[GEM>0]: %PURPLE%%NAME%',
      '',
      '// --- Charms ---',
      'ItemDisplay[CHARM]: %BLUE%%NAME%',
      '',
      '// --- Jewelry ---',
      'ItemDisplay[JEWELRY]: %NAME%',
      '',
      '// --- Keys, Scrolls ---',
      'ItemDisplay[key FILTLVL>1]:',
      'ItemDisplay[tsc FILTLVL>1]:',
      'ItemDisplay[isc FILTLVL>1]:',
      '',
      '// --- Gold ---',
      'ItemDisplay[GOLD<100 FILTLVL>1]:',
      'ItemDisplay[GOLD<500 FILTLVL>2]:',
      '',
      '// --- Hide low normal/magic at higher filter levels ---',
      'ItemDisplay[NMAG NORM !ETH FILTLVL>2]:',
      'ItemDisplay[MAG NORM FILTLVL>2]:',
      '',
      '// --- Socket Info ---',
      'ItemDisplay[NMAG SOCKETS>0]: %NAME% %GRAY%[%SOCKETS%]',
      '',
      '// --- Show Everything Else ---',
      'ItemDisplay[]: %NAME%'
    ].join('\n'),

    endgame: [
      '// ==========================================',
      '// Filter Forge — Endgame Strict Filter',
      '// Hides most items, highlights only valuable drops',
      '// ==========================================',
      '',
      'ItemDisplayFilterName[]: Strict',
      'ItemDisplayFilterName[]: Very Strict',
      'ItemDisplayFilterName[]: Ultra Strict',
      '',
      '// --- Always Show ---',
      'ItemDisplay[UNI]: %GOLD%%NAME%%BORDER%%SOUNDID-4715%',
      'ItemDisplay[SET]: %GREEN%%NAME%%MAP%%SOUNDID-4718%',
      '',
      '// --- High Runes (Vex+) ---',
      'ItemDisplay[RUNE>25]: %ORANGE%%RUNENAME% Rune (#%RUNENUM%)%BORDER%%SOUNDID-4716%',
      'ItemDisplay[RUNE>19]: %ORANGE%%RUNENAME% Rune (#%RUNENUM%)%MAP%%SOUNDID-4718%',
      '',
      '// --- Mid Runes ---',
      'ItemDisplay[RUNE>10]: %ORANGE%%RUNENAME% Rune',
      'ItemDisplay[RUNE>0 FILTLVL<2]: %ORANGE%%RUNENAME% Rune',
      'ItemDisplay[RUNE>0]:',
      '',
      '// --- Perfect Gems ---',
      'ItemDisplay[GEM=5]: %PURPLE%%NAME%%DOT%',
      'ItemDisplay[GEM>0 FILTLVL<2]: %PURPLE%%NAME%',
      'ItemDisplay[GEM>0]:',
      '',
      '// --- Charms ---',
      'ItemDisplay[cm3 MAG]: %BLUE%GC %NAME%{iLvl: %ILVL%}',
      'ItemDisplay[cm1 MAG]: %BLUE%SC %NAME%',
      'ItemDisplay[CHARM]: %BLUE%%NAME%',
      '',
      '// --- Rare Jewelry ---',
      'ItemDisplay[RARE JEWELRY]: %YELLOW%%NAME%',
      '',
      '// --- Crafted ---',
      'ItemDisplay[CRAFT]: %ORANGE%%NAME%',
      '',
      '// --- Runeword Bases ---',
      'ItemDisplay[NMAG !INF SOCKETS=4 CHEST ELT ETH]: %GRAY%4os %NAME% %WHITE%[Base]%MAP%',
      'ItemDisplay[NMAG !INF SOCKETS=3 HELM ELT]: %GRAY%3os %NAME% %WHITE%[Base]',
      'ItemDisplay[NMAG !INF SOCKETS=4 POLEARM ELT ETH]: %GRAY%4os %NAME% %WHITE%[Base]%MAP%',
      'ItemDisplay[NMAG !INF SOCKETS=5 WEAPON ELT]: %GRAY%5os %NAME% %WHITE%[Base]',
      '',
      '// --- Hide Everything Else ---',
      'ItemDisplay[GOLD<5000]:',
      'ItemDisplay[NMAG]:',
      'ItemDisplay[MAG]:',
      '',
      '// --- Catch-all ---',
      'ItemDisplay[]: %NAME%'
    ].join('\n'),

    runes: [
      '// ==========================================',
      '// Rune Display Rules',
      '// Paste these near the top of your filter',
      '// ==========================================',
      '',
      '// --- Zod ---',
      'ItemDisplay[RUNE=33]: %ORANGE%>> Zod Rune <<  %RED%#%RUNENUM%%BORDER-FF%%SOUNDID-4716%',
      '',
      '// --- Cham ---',
      'ItemDisplay[RUNE=32]: %ORANGE%>> Cham Rune <<  %RED%#%RUNENUM%%BORDER-0A%%SOUNDID-4716%',
      '',
      '// --- Jah ---',
      'ItemDisplay[RUNE=31]: %ORANGE%>> Jah Rune <<  %RED%#%RUNENUM%%BORDER-0A%%SOUNDID-4716%',
      '',
      '// --- Ber ---',
      'ItemDisplay[RUNE=30]: %ORANGE%>> Ber Rune <<  %RED%#%RUNENUM%%BORDER-0A%%SOUNDID-4716%',
      '',
      '// --- Sur ---',
      'ItemDisplay[RUNE=29]: %ORANGE%> Sur Rune <  #%RUNENUM%%BORDER-0A%%SOUNDID-4715%',
      '',
      '// --- Lo ---',
      'ItemDisplay[RUNE=28]: %ORANGE%> Lo Rune <  #%RUNENUM%%BORDER-0A%%SOUNDID-4715%',
      '',
      '// --- Ohm ---',
      'ItemDisplay[RUNE=27]: %ORANGE%> Ohm Rune <  #%RUNENUM%%MAP-0A%%SOUNDID-4715%',
      '',
      '// --- Vex ---',
      'ItemDisplay[RUNE=26]: %ORANGE%> Vex Rune <  #%RUNENUM%%MAP-0A%%SOUNDID-4718%',
      '',
      '// --- Gul to Ist ---',
      'ItemDisplay[RUNE>23]: %ORANGE%%RUNENAME% Rune  #%RUNENUM%%MAP%%SOUNDID-4718%',
      '',
      '// --- Um to Mal ---',
      'ItemDisplay[RUNE>21]: %ORANGE%%RUNENAME% Rune  #%RUNENUM%%DOT%',
      '',
      '// --- Mid Runes (Lem to Pul) ---',
      'ItemDisplay[RUNE>19]: %ORANGE%%RUNENAME% Rune  #%RUNENUM%',
      '',
      '// --- Low-Mid Runes (Io to Ko) ---',
      'ItemDisplay[RUNE>15]: %ORANGE%%RUNENAME%',
      '',
      '// --- Low Runes ---',
      'ItemDisplay[RUNE>0]: %ORANGE%%RUNENAME%'
    ].join('\n'),

    crafting: [
      '// ==========================================',
      '// Crafting Base Highlights',
      '// Highlights items useful for crafting recipes',
      '// ==========================================',
      '',
      '// --- Blood Crafting (Ral + Jewel + base) ---',
      '// Blood Helm: Magic Helm with ALVL',
      'ItemDisplay[MAG HELM !ID]: %RED%Craft? %NAME%{ALVL: %ALVL% | cALVL: %CRAFTALVL%}',
      '',
      '// --- Caster Crafting (Amn + Jewel + base) ---',
      '// Caster Amulet: Magic Amulet',
      'ItemDisplay[MAG amu !ID]: %BLUE%Craft? %NAME%{ALVL: %ALVL% | cALVL: %CRAFTALVL%}',
      '// Caster Belt: Magic Belt',
      'ItemDisplay[MAG BELT !ID]: %BLUE%Craft? %NAME%{ALVL: %ALVL% | cALVL: %CRAFTALVL%}',
      '',
      '// --- Safety Crafting (Ort + Jewel + base) ---',
      '// Safety Shield: Magic Shield',
      'ItemDisplay[MAG SHIELD !ID]: %GREEN%Craft? %NAME%{ALVL: %ALVL% | cALVL: %CRAFTALVL%}',
      '',
      '// --- Hitpower Crafting (Tir + Jewel + base) ---',
      '// Hitpower Gloves: Magic Gloves',
      'ItemDisplay[MAG GLOVES !ID]: %YELLOW%Craft? %NAME%{ALVL: %ALVL% | cALVL: %CRAFTALVL%}',
      '',
      '// --- Show ALVL/CRAFTALVL on all Magic items ---',
      '// Uncomment the line below to see crafting info on everything:',
      '// ItemDisplay[MAG !ID]: %NAME%{ALVL: %ALVL% | cALVL: %CRAFTALVL%}'
    ].join('\n'),

    mapping: [
      '// ==========================================',
      '// Mapping-Specific Rules',
      '// Use MAPTIER and MAPID for map-aware filtering',
      '// ==========================================',
      '',
      '// --- Map Tier Display ---',
      '// Show map tier in item descriptions while mapping',
      '',
      '// --- Strict filtering in high-tier maps ---',
      'ItemDisplay[NMAG NORM MAPTIER>2]:',
      'ItemDisplay[MAG NORM MAPTIER>2]:',
      'ItemDisplay[NMAG EXC MAPTIER>3]:',
      '',
      '// --- Always show in maps ---',
      'ItemDisplay[UNI MAPTIER>0]: %GOLD%%NAME% %RED%[T%MAPTIER%]%BORDER%%SOUNDID-4715%',
      'ItemDisplay[SET MAPTIER>0]: %GREEN%%NAME% %RED%[T%MAPTIER%]%MAP%',
      '',
      '// --- Gold threshold scales with map tier ---',
      'ItemDisplay[GOLD<1000 MAPTIER>0]:',
      'ItemDisplay[GOLD<3000 MAPTIER>3]:',
      '',
      '// --- Show good bases only in maps ---',
      'ItemDisplay[NMAG ELT ETH SOCKETS>3 MAPTIER>0]: %WHITE%%NAME% [%SOCKETS%os]%MAP%',
      'ItemDisplay[NMAG ELT SOCKETS>3 MAPTIER>0]: %GRAY%%NAME% [%SOCKETS%os]',
      '',
      '// --- Filter level integration ---',
      '// Use FILTLVL to let players choose strictness',
      'ItemDisplay[RARE MAPTIER>0 FILTLVL>2]:',
      'ItemDisplay[MAG MAPTIER>0 FILTLVL>1]:'
    ].join('\n')
  };

  // ==========================================
  // Item definitions for preview
  // ==========================================
  var PREVIEW_ITEMS = {
    // Runes
    'rune-zod': { code: 'r33', name: 'Zod Rune', flags: ['MISC'], values: { RUNE: 33, ILVL: 1, SOCKETS: 0, GOLD: 0, GEM: 0 } },
    'rune-ber': { code: 'r30', name: 'Ber Rune', flags: ['MISC'], values: { RUNE: 30, ILVL: 1, SOCKETS: 0, GOLD: 0, GEM: 0 } },
    'rune-jah': { code: 'r31', name: 'Jah Rune', flags: ['MISC'], values: { RUNE: 31, ILVL: 1, SOCKETS: 0, GOLD: 0, GEM: 0 } },
    'rune-lo': { code: 'r28', name: 'Lo Rune', flags: ['MISC'], values: { RUNE: 28, ILVL: 1, SOCKETS: 0, GOLD: 0, GEM: 0 } },
    'rune-vex': { code: 'r26', name: 'Vex Rune', flags: ['MISC'], values: { RUNE: 26, ILVL: 1, SOCKETS: 0, GOLD: 0, GEM: 0 } },
    'rune-ist': { code: 'r24', name: 'Ist Rune', flags: ['MISC'], values: { RUNE: 24, ILVL: 1, SOCKETS: 0, GOLD: 0, GEM: 0 } },
    'rune-lem': { code: 'r20', name: 'Lem Rune', flags: ['MISC'], values: { RUNE: 20, ILVL: 1, SOCKETS: 0, GOLD: 0, GEM: 0 } },
    'rune-sol': { code: 'r12', name: 'Sol Rune', flags: ['MISC'], values: { RUNE: 12, ILVL: 1, SOCKETS: 0, GOLD: 0, GEM: 0 } },
    'rune-el': { code: 'r01', name: 'El Rune', flags: ['MISC'], values: { RUNE: 1, ILVL: 1, SOCKETS: 0, GOLD: 0, GEM: 0 } },
    // Unique items
    'uni-shako': { code: 'uap', name: 'Harlequin Crest', flags: ['UNI', 'ELT', 'HELM', 'ARMOR', 'EQ1'], values: { ILVL: 69, DEF: 141, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'uni-griffon': { code: 'ci3', name: 'Griffons Eye', flags: ['UNI', 'ELT', 'CIRC', 'EQ7', 'ARMOR'], values: { ILVL: 85, DEF: 50, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'uni-coa': { code: 'urn', name: 'Crown of Ages', flags: ['UNI', 'ELT', 'HELM', 'ARMOR', 'EQ1'], values: { ILVL: 85, DEF: 349, SOCKETS: 2, RUNE: 0, GOLD: 0, GEM: 0 } },
    'uni-arach': { code: 'ulc', name: 'Arachnid Mesh', flags: ['UNI', 'ELT', 'BELT', 'ARMOR', 'EQ6'], values: { ILVL: 85, DEF: 119, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'uni-stormshield': { code: 'uit', name: 'Stormshield', flags: ['UNI', 'ELT', 'SHIELD', 'ARMOR', 'EQ3'], values: { ILVL: 85, DEF: 136, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'uni-facet': { code: 'jew', name: 'Rainbow Facet', flags: ['UNI', 'JEWELRY'], values: { ILVL: 85, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'uni-ring': { code: 'rin', name: 'Stone of Jordan', flags: ['UNI', 'JEWELRY'], values: { ILVL: 85, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'uni-amu': { code: 'amu', name: 'Maras Kaleidoscope', flags: ['UNI', 'JEWELRY'], values: { ILVL: 85, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'uni-anni': { code: 'cm1', name: 'Annihilus', flags: ['UNI', 'CHARM'], values: { ILVL: 99, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'uni-torch': { code: 'cm2', name: 'Hellfire Torch', flags: ['UNI', 'CHARM'], values: { ILVL: 99, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'uni-gheeds': { code: 'cm3', name: 'Gheeds Fortune', flags: ['UNI', 'CHARM'], values: { ILVL: 99, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    // Set items
    'set-shako': { code: 'uap', name: 'Tal Rashas Horadric Crest', flags: ['SET', 'ELT', 'HELM', 'ARMOR', 'EQ1'], values: { ILVL: 66, DEF: 98, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'set-ik-armor': { code: 'uth', name: 'Immortal Kings Soul Cage', flags: ['SET', 'ELT', 'CHEST', 'ARMOR', 'EQ2'], values: { ILVL: 85, DEF: 487, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'set-tal-amu': { code: 'amu', name: 'Tal Rashas Adjudication', flags: ['SET', 'JEWELRY'], values: { ILVL: 26, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    // Rare / Crafted
    'rare-amu': { code: 'amu', name: 'Amulet', flags: ['RARE', 'JEWELRY'], values: { ILVL: 85, ALVL: 90, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'rare-ring': { code: 'rin', name: 'Ring', flags: ['RARE', 'JEWELRY'], values: { ILVL: 85, ALVL: 81, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'rare-jewel': { code: 'jew', name: 'Jewel', flags: ['RARE', 'JEWELRY'], values: { ILVL: 87, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'rare-circlet': { code: 'ci3', name: 'Diadem', flags: ['RARE', 'ELT', 'CIRC', 'EQ7', 'ARMOR'], values: { ILVL: 85, DEF: 50, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'rare-boots-elt': { code: 'uhb', name: 'Myrmidon Greaves', flags: ['RARE', 'ELT', 'BOOTS', 'ARMOR', 'EQ5'], values: { ILVL: 85, DEF: 62, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'rare-gloves-elt': { code: 'utg', name: 'Crusader Gauntlets', flags: ['RARE', 'ELT', 'GLOVES', 'ARMOR', 'EQ4'], values: { ILVL: 85, DEF: 59, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'craft-amu': { code: 'amu', name: 'Amulet', flags: ['CRAFT', 'JEWELRY'], values: { ILVL: 85, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    // Magic items
    'mag-ring': { code: 'rin', name: 'Ring', flags: ['MAG', 'JEWELRY'], values: { ILVL: 45, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'mag-amu': { code: 'amu', name: 'Amulet', flags: ['MAG', 'JEWELRY'], values: { ILVL: 85, CRAFTALVL: 90, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'mag-jewel': { code: 'jew', name: 'Jewel', flags: ['MAG', 'JEWELRY'], values: { ILVL: 87, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'mag-gc-90': { code: 'cm3', name: 'Grand Charm', flags: ['MAG', 'CHARM'], values: { ILVL: 91, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'mag-gc': { code: 'cm3', name: 'Grand Charm', flags: ['MAG', 'CHARM'], values: { ILVL: 50, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'mag-sc': { code: 'cm1', name: 'Small Charm', flags: ['MAG', 'CHARM'], values: { ILVL: 50, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'mag-lc': { code: 'cm2', name: 'Large Charm', flags: ['MAG', 'CHARM'], values: { ILVL: 50, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'mag-monarch': { code: 'uit', name: 'Monarch', flags: ['MAG', 'ELT', 'SHIELD', 'ARMOR', 'EQ3'], values: { ILVL: 72, DEF: 133, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    // Runeword bases
    'base-eth-ap': { code: 'utp', name: 'Archon Plate', flags: ['NMAG', 'ELT', 'ETH', 'SUP', 'CHEST', 'ARMOR', 'EQ2'], values: { ILVL: 85, DEF: 524, SOCKETS: 4, ED: 15, RUNE: 0, GOLD: 0, GEM: 0 } },
    'base-monarch-4': { code: 'uit', name: 'Monarch', flags: ['NMAG', 'ELT', 'SHIELD', 'ARMOR', 'EQ3'], values: { ILVL: 72, DEF: 133, SOCKETS: 4, RUNE: 0, GOLD: 0, GEM: 0 } },
    'base-pb-5': { code: '7cr', name: 'Phase Blade', flags: ['NMAG', 'ELT', 'SWORD', 'WEAPON', '1H'], values: { ILVL: 73, SOCKETS: 5, RUNE: 0, GOLD: 0, GEM: 0 } },
    'base-eth-thresh': { code: '7s7', name: 'Thresher', flags: ['NMAG', 'ELT', 'ETH', 'POLEARM', 'WEAPON', '2H'], values: { ILVL: 85, SOCKETS: 4, RUNE: 0, GOLD: 0, GEM: 0 } },
    'base-eth-zerker': { code: '7wa', name: 'Berserker Axe', flags: ['NMAG', 'ELT', 'ETH', 'AXE', 'WEAPON', '1H'], values: { ILVL: 85, SOCKETS: 5, RUNE: 0, GOLD: 0, GEM: 0 } },
    'base-eth-cb': { code: '7gd', name: 'Colossus Blade', flags: ['NMAG', 'ELT', 'ETH', 'SWORD', 'WEAPON', '2H'], values: { ILVL: 85, SOCKETS: 6, RUNE: 0, GOLD: 0, GEM: 0 } },
    'base-diadem-0': { code: 'ci3', name: 'Diadem', flags: ['NMAG', 'ELT', 'CIRC', 'EQ7', 'ARMOR'], values: { ILVL: 85, SOCKETS: 0, MAXSOCKETS: 3, RUNE: 0, GOLD: 0, GEM: 0 } },
    'base-flail-4': { code: 'fla', name: 'Flail', flags: ['NMAG', 'NORM', 'MACE', 'WEAPON', '1H'], values: { ILVL: 36, SOCKETS: 4, RUNE: 0, GOLD: 0, GEM: 0 } },
    'base-crystal-4': { code: 'crs', name: 'Crystal Sword', flags: ['NMAG', 'NORM', 'SWORD', 'WEAPON', '1H'], values: { ILVL: 26, SOCKETS: 4, RUNE: 0, GOLD: 0, GEM: 0 } },
    'base-pala-45res': { code: 'pa5', name: 'Sacred Targe', flags: ['NMAG', 'EXC', 'DIN', 'SHIELD', 'ARMOR', 'EQ3'], values: { ILVL: 85, SOCKETS: 4, RES: 45, RUNE: 0, GOLD: 0, GEM: 0 } },
    // Normal items
    'norm-cap': { code: 'cap', name: 'Cap', flags: ['NMAG', 'NORM', 'HELM', 'ARMOR', 'EQ1'], values: { ILVL: 1, DEF: 3, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'norm-belt-elt': { code: 'uhc', name: 'Colossus Girdle', flags: ['NMAG', 'ELT', 'BELT', 'ARMOR', 'EQ6'], values: { ILVL: 85, DEF: 71, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'norm-1os': { code: 'hlm', name: 'Helm', flags: ['NMAG', 'NORM', 'HELM', 'ARMOR', 'EQ1'], values: { ILVL: 10, DEF: 15, SOCKETS: 1, RUNE: 0, GOLD: 0, GEM: 0 } },
    'norm-inf': { code: 'lea', name: 'Leather Armor', flags: ['NMAG', 'NORM', 'INF', 'CHEST', 'ARMOR', 'EQ2'], values: { ILVL: 5, DEF: 12, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'norm-sup-ap': { code: 'utp', name: 'Archon Plate', flags: ['NMAG', 'ELT', 'SUP', 'CHEST', 'ARMOR', 'EQ2'], values: { ILVL: 85, DEF: 524, SOCKETS: 0, ED: 15, MAXSOCKETS: 4, RUNE: 0, GOLD: 0, GEM: 0 } },
    // Consumables
    'gold-5000': { code: 'gold', name: '5000 Gold', flags: [], values: { GOLD: 5000, ILVL: 0, SOCKETS: 0, RUNE: 0, GEM: 0 } },
    'gold-500': { code: 'gold', name: '500 Gold', flags: [], values: { GOLD: 500, ILVL: 0, SOCKETS: 0, RUNE: 0, GEM: 0 } },
    'gold-50': { code: 'gold', name: '50 Gold', flags: [], values: { GOLD: 50, ILVL: 0, SOCKETS: 0, RUNE: 0, GEM: 0 } },
    'hp5': { code: 'hp5', name: 'Super Healing Potion', flags: ['NMAG', 'MISC'], values: { ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'hp1': { code: 'hp1', name: 'Minor Healing Potion', flags: ['NMAG', 'MISC'], values: { ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'mp5': { code: 'mp5', name: 'Super Mana Potion', flags: ['NMAG', 'MISC'], values: { ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'rvl': { code: 'rvl', name: 'Full Rejuv Potion', flags: ['NMAG', 'MISC'], values: { ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'rvs': { code: 'rvs', name: 'Rejuv Potion', flags: ['NMAG', 'MISC'], values: { ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'tp-scroll': { code: 'tsc', name: 'Scroll of Town Portal', flags: ['NMAG', 'MISC'], values: { ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'id-scroll': { code: 'isc', name: 'Scroll of Identify', flags: ['NMAG', 'MISC'], values: { ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'key': { code: 'key', name: 'Key', flags: ['NMAG', 'MISC'], values: { ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    // Gems
    'gem-perf-ame': { code: 'gpv', name: 'Perfect Amethyst', flags: ['MISC'], values: { GEM: 5, GEMLEVEL: 5, GEMTYPE: 1, ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0 } },
    'gem-flaw-dia': { code: 'glw', name: 'Flawless Diamond', flags: ['MISC'], values: { GEM: 4, GEMLEVEL: 4, GEMTYPE: 2, ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0 } },
    'gem-chip-ruby': { code: 'gcr', name: 'Chipped Ruby', flags: ['MISC'], values: { GEM: 1, GEMLEVEL: 1, GEMTYPE: 4, ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0 } },
    // PD2 Special
    'pd2-wss': { code: 'wss', name: 'Worldstone Shard', flags: ['MISC'], values: { ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'pd2-pbox': { code: 'lbox', name: 'Larzuks Puzzlebox', flags: ['MISC'], values: { ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'pd2-essence': { code: 'tes', name: 'Twisted Essence of Suffering', flags: ['MISC'], values: { ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'pd2-token': { code: 'toa', name: 'Token of Absolution', flags: ['MISC'], values: { ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'pd2-key': { code: 'pk1', name: 'Key of Terror', flags: ['MISC'], values: { ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'pd2-organ': { code: 'mbr', name: 'Mephistos Brain', flags: ['MISC'], values: { ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'pd2-rkey': { code: 'rkey', name: 'Skeleton Key', flags: ['MISC'], values: { ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0 } },
    'pd2-map-t1': { code: 't12', name: 'T1 Map', flags: ['NMAG', 'MISC'], values: { ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0, MAPTIER: 1 } },
    'pd2-map-t3-rare': { code: 't34', name: 'T3 Rare Map', flags: ['RARE', 'MISC'], values: { ILVL: 1, SOCKETS: 0, RUNE: 0, GOLD: 0, GEM: 0, MAPTIER: 3 } }
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

      // Open conditions and output by default
      if (targetId === 'conditions-panel' || targetId === 'output-panel') {
        panel.classList.add('open');
        header.querySelector('.chevron').style.transform = 'rotate(90deg)';
      }

      header.addEventListener('click', function () {
        panel.classList.toggle('open');
        var chevron = header.querySelector('.chevron');
        if (chevron) {
          chevron.style.transform = panel.classList.contains('open') ? 'rotate(90deg)' : '';
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
  // Builder: text inputs
  // ==========================================
  function initTextInputs() {
    var ids = ['item-code-input', 'custom-name-input', 'append-text', 'map-icon-color', 'description-input'];
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
  }

  // ==========================================
  // Generate rule from builder state
  // ==========================================
  function updateGeneratedRule() {
    var conditions = [];

    // Quality
    if (builderState.quality) conditions.push(builderState.quality);

    // Tier
    if (builderState.tier) conditions.push(builderState.tier);

    // Properties (multi)
    if (builderState.properties && builderState.properties.length) {
      builderState.properties.forEach(function (p) { conditions.push(p); });
    }

    // Equipment
    if (builderState.equipment) conditions.push(builderState.equipment);

    // Weapons
    if (builderState.weapons) conditions.push(builderState.weapons);

    // Misc
    if (builderState.misc) conditions.push(builderState.misc);

    // Class items
    if (builderState.classitems) conditions.push(builderState.classitems);

    // Negate (multi)
    if (builderState.negate && builderState.negate.length) {
      builderState.negate.forEach(function (n) { conditions.push(n); });
    }

    // Item code
    var itemCode = document.getElementById('item-code-input').value.trim();
    if (itemCode) conditions.push(itemCode);

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

    // Build conditions string
    var condStr = conditions.join(' ');

    // Build output
    var output = '';
    if (builderState.action !== 'hide') {
      var color = builderState.color || '';
      var nameDisplay = builderState.nameDisplay || '%NAME%';
      var customName = document.getElementById('custom-name-input').value.trim();
      var appendText = document.getElementById('append-text').value.trim();
      var mapIcon = builderState.mapIcon || '';
      var mapIconColor = document.getElementById('map-icon-color').value.trim().toUpperCase();
      var sound = document.getElementById('sound-select').value;
      var notify = builderState.notify || '';
      var continueKw = builderState.continueKw || '';
      var description = document.getElementById('description-input').value.trim();

      output += color;

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
        if (mapIconColor) {
          output += mapIcon.replace('%', '%').replace(/%$/, '-' + mapIconColor + '%');
          // Fix: replace e.g. %MAP% with %MAP-0A%
          var iconBase = mapIcon.replace(/%/g, '');
          output = output.replace(mapIcon, '%' + iconBase + '-' + mapIconColor + '%');
        } else {
          output += mapIcon;
        }
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
  }

  // ==========================================
  // Code editor: line numbers + stats
  // ==========================================
  var cachedLineCount = 0;
  var statsTimer = null;

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

    // Only render visible line numbers (virtual scroll)
    renderVisibleLineNumbers();

    // Update simple stats immediately
    lineCount.textContent = 'Lines: ' + count;
    charCount.textContent = 'Chars: ' + text.length;

    // Debounce the expensive rule count for large files
    clearTimeout(statsTimer);
    if (count < 2000) {
      ruleCount.textContent = 'Rules: ' + countRules(text);
    } else {
      statsTimer = setTimeout(function () {
        ruleCount.textContent = 'Rules: ' + countRules(text);
      }, 500);
    }
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
    var lh = getLineHeight();
    if (!lh) return;

    var scrollTop = codeEditor.scrollTop;
    var viewHeight = codeEditor.clientHeight;
    var paddingTop = parseFloat(window.getComputedStyle(codeEditor).paddingTop) || 12;

    // Which lines are visible
    var firstVisible = Math.floor(scrollTop / lh);
    var visibleCount = Math.ceil(viewHeight / lh) + 2; // buffer
    var startLine = Math.max(0, firstVisible - 1);
    var endLine = Math.min(cachedLineCount, startLine + visibleCount + 2);

    // Build only visible line numbers with spacer divs for positioning
    var topPad = startLine * lh + paddingTop;
    var nums = [];
    for (var i = startLine + 1; i <= endLine; i++) {
      nums.push(i);
    }

    lineNumbers.style.paddingTop = topPad + 'px';
    lineNumbers.style.paddingBottom = Math.max(0, (cachedLineCount - endLine) * lh) + 'px';
    lineNumbers.textContent = nums.join('\n');

    // Keep scroll in sync
    lineNumbers.scrollTop = scrollTop;
  }

  function syncScroll() {
    lineNumbers.scrollTop = codeEditor.scrollTop;
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
  function insertRule() {
    var rule = generatedCode.textContent;
    var val = codeEditor.value;
    var pos = codeEditor.selectionStart;

    // Find start of current line
    var before = val.substring(0, pos);
    var after = val.substring(pos);

    // Insert on new line
    var prefix = before.length > 0 && !before.endsWith('\n') ? '\n' : '';
    var suffix = after.length > 0 && !after.startsWith('\n') ? '\n' : '';

    codeEditor.value = before + prefix + rule + suffix + after;
    var newPos = before.length + prefix.length + rule.length;
    codeEditor.selectionStart = codeEditor.selectionEnd = newPos;
    codeEditor.focus();
    updateLineNumbers();
    saveToStorage();
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
        codeEditor.value = ev.target.result;
        updateLineNumbers();
        saveToStorage();
      };
      reader.readAsText(file);
      fileInput.value = '';
    });

    btnExport.addEventListener('click', function () {
      var text = codeEditor.value;
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
    });
  }

  // ==========================================
  // Templates
  // ==========================================
  function initTemplates() {
    document.querySelectorAll('.template-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-template');
        var template = TEMPLATES[key];
        if (!template) return;

        if (codeEditor.value.trim() && !confirm('Load template? This will replace your current filter.')) return;

        codeEditor.value = template;
        updateLineNumbers();
        saveToStorage();
      });
    });
  }

  // ==========================================
  // Tabs
  // ==========================================
  function initTabs() {
    document.querySelectorAll('.editor-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = tab.getAttribute('data-tab');
        document.querySelectorAll('.editor-tab').forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');

        document.getElementById('pane-code').style.display = target === 'code' ? 'flex' : 'none';
        document.getElementById('pane-preview').style.display = target === 'preview' ? 'flex' : 'none';
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
    document.getElementById('pane-code').style.display = 'flex';
    document.getElementById('pane-preview').style.display = 'none';

    var text = codeEditor.value;
    var lines = text.split('\n');
    var pos = 0;
    for (var i = 0; i < Math.min(lineNum - 1, lines.length); i++) {
      pos += lines[i].length + 1;
    }
    var lineEnd = pos + (lines[lineNum - 1] || '').length;
    var lh = getLineHeight();
    var targetScroll = Math.max(0, (lineNum - 5) * lh);

    // Focus and select the line, then force scroll position after browser settles
    codeEditor.focus();
    codeEditor.setSelectionRange(pos, lineEnd);
    codeEditor.scrollTop = targetScroll;
    // Browser may override scrollTop on focus — force it again after a frame
    requestAnimationFrame(function () {
      codeEditor.scrollTop = targetScroll;
      renderVisibleLineNumbers();
    });
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
  }

  function testAllItems() {
    var text = codeEditor.value;
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
      html = '<p class="text-muted text-center">No rules found in the editor. Write some rules or load a template to test.</p>';
    }

    previewResults.innerHTML = html;
  }

  function parseRules(lines) {
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
        rules.push({
          conditions: match[1].trim(),
          output: match[2].trim(),
          lineNum: i + 1,
          raw: lines[i].trim()
        });
      }
    }
    return rules;
  }

  function matchItem(item, rules) {
    // PD2 %CONTINUE% behavior:
    // 1. When a rule matches and has %CONTINUE%, its output (with %NAME% resolved)
    //    becomes the new value of %NAME% for subsequent rules.
    // 2. Processing continues to the next rule.
    // 3. When a rule matches WITHOUT %CONTINUE%, that's the final display.
    //
    // This means %CONTINUE% chains build up the display string step by step,
    // each rule modifying %NAME% before the next one sees it.

    var currentName = item.name; // Start with the item's original name
    var lastRule = null;
    var anyMatched = false;
    var allMatchedRules = [];

    for (var i = 0; i < rules.length; i++) {
      var rule = rules[i];
      if (evaluateConditions(rule.conditions, item)) {
        var output = rule.output;
        var hasContinue = output.indexOf('%CONTINUE%') !== -1;

        if (hasContinue) {
          // Remove %CONTINUE% token
          output = output.replace(/%CONTINUE%/g, '');
          // Resolve %NAME% in the output to the current accumulated name
          output = output.replace(/%NAME%/g, currentName);
          // This becomes the new %NAME% for subsequent rules
          if (output) currentName = output;
          lastRule = rule;
          anyMatched = true;
          allMatchedRules.push(rule);
          continue; // Keep processing
        }

        // Final match (no %CONTINUE%)
        // Resolve %NAME% with accumulated value
        output = output.replace(/%NAME%/g, currentName);
        allMatchedRules.push(rule);
        return {
          matched: true,
          rule: rule,
          hidden: output === '' && !anyMatched,
          output: output,
          continued: anyMatched,
          allRules: allMatchedRules
        };
      }
    }

    // If we only had %CONTINUE% rules with no final terminal match
    if (anyMatched) {
      return { matched: true, rule: lastRule, hidden: false, output: currentName, continued: true, allRules: allMatchedRules };
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

    // Value condition: CODE<val, CODE>val, CODE=val, CODE~min-max
    var valueMatch = token.match(/^([A-Z]+)([<>=~])(.+)$/);
    if (valueMatch) {
      var code = valueMatch[1];
      var op = valueMatch[2];
      var valStr = valueMatch[3];
      var itemVal = (item.values && item.values[code] !== undefined) ? item.values[code] : 0;

      // GOLD conditions only match gold piles (items with code 'gold')
      if (code === 'GOLD' && item.code !== 'gold') return false;

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

    // Item code match
    if (token === item.code) return true;

    // GOLD special
    if (token === 'GOLD' && item.values && item.values.GOLD > 0) return true;

    return false;
  }

  function renderPreviewItem(item, result, isSelected) {
    var cssClass = 'preview-item';
    var statusText = '';

    if (!result.matched) {
      cssClass += ' preview-item-default';
      statusText = 'No matching rule — shown with default name';
    } else if (result.hidden) {
      cssClass += ' preview-item-hidden';
      statusText = 'HIDDEN by line ' + result.rule.lineNum;
    } else {
      cssClass += ' preview-item-shown';
      if (result.continued && result.allRules && result.allRules.length > 1) {
        statusText = result.allRules.length + ' rules matched (lines ' + result.allRules.map(function (r) { return r.lineNum; }).join(', ') + ')';
      } else {
        statusText = 'Matched line ' + result.rule.lineNum;
      }
    }

    if (isSelected) {
      cssClass += ' selected';
    }

    var displayName = item.name;
    if (result.matched && result.output) {
      displayName = renderOutput(result.output, item);
    }

    var html = '<div class="' + cssClass + '"' + (isSelected ? ' style="border-width:2px;"' : '') + '>';
    html += '<div class="preview-item-name">' + displayName + '</div>';
    html += '<div class="preview-item-rule">' + escapeHtml(statusText);
    if (result.rule) {
      html += ' <button class="btn-goto-line" data-line="' + result.rule.lineNum + '">Line ' + result.rule.lineNum + ' &rarr;</button>';
    }
    html += '</div></div>';
    return html;
  }

  function renderOutput(output, item) {
    var text = output;

    // %NAME% may already be resolved by matchItem's %CONTINUE% handling
    // Only replace remaining %NAME% tokens that weren't resolved
    text = text.replace(/%NAME%/g, item.name);
    text = text.replace(/%RUNENAME%/g, RUNE_NAMES[item.values.RUNE] || '');
    text = text.replace(/%RUNENUM%/g, item.values.RUNE || '');
    text = text.replace(/%ILVL%/g, item.values.ILVL || '');
    text = text.replace(/%SOCKETS%/g, item.values.SOCKETS || '0');
    text = text.replace(/%DEF%/g, item.values.DEF || '0');
    text = text.replace(/%ED%/g, item.values.ED || '0');
    text = text.replace(/%MAPTIER%/g, '0');

    // Remove notification tokens for display
    text = text.replace(/%(?:BORDER|MAP|DOT|PX)(?:-[0-9A-Fa-f]{1,2})?%/g, '');
    text = text.replace(/%SOUNDID-\d+%/g, '');
    text = text.replace(/%NOTIFY[^%]*%/g, '');
    text = text.replace(/%CONTINUE%/g, '');
    text = text.replace(/%TIER-\d+%/g, '');

    // Remove descriptions {} for inline display
    text = text.replace(/\{[^}]*\}/g, '');

    // Convert colors to spans
    var currentColor = '#ffffff';
    var result = '';
    var parts = text.split(/(%[A-Z_]+%)/g);
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];
      if (D2_COLORS[part]) {
        currentColor = D2_COLORS[part];
      } else if (part && part.charAt(0) !== '%') {
        result += '<span style="color:' + currentColor + '">' + escapeHtml(part) + '</span>';
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
  // Builder action buttons
  // ==========================================
  function initBuilderActions() {
    document.getElementById('btn-insert-rule').addEventListener('click', insertRule);

    document.getElementById('btn-copy-rule').addEventListener('click', function () {
      navigator.clipboard.writeText(generatedCode.textContent).then(function () {
        var btn = document.getElementById('btn-copy-rule');
        btn.textContent = 'Copied!';
        setTimeout(function () { btn.textContent = 'Copy'; }, 1500);
      });
    });

    document.getElementById('btn-clear-builder').addEventListener('click', function () {
      // Reset all chips
      document.querySelectorAll('.chip.active').forEach(function (c) { c.classList.remove('active'); });
      document.querySelectorAll('.color-chip.active').forEach(function (c) { c.classList.remove('active'); });

      // Reset defaults
      var showChip = document.querySelector('[data-field="action"] [data-value="show"]');
      var nameChip = document.querySelector('[data-field="nameDisplay"] [data-value="%NAME%"]');
      var noneNotify = document.querySelector('[data-field="notify"] [data-value=""]');
      var noContinue = document.querySelector('[data-field="continue"] [data-value=""]');
      var noMap = document.querySelector('[data-field="mapIcon"] [data-value=""]');
      if (showChip) showChip.classList.add('active');
      if (nameChip) nameChip.classList.add('active');
      if (noneNotify) noneNotify.classList.add('active');
      if (noContinue) noContinue.classList.add('active');
      if (noMap) noMap.classList.add('active');

      // Reset state
      builderState.quality = '';
      builderState.tier = '';
      builderState.properties = [];
      builderState.equipment = '';
      builderState.weapons = '';
      builderState.misc = '';
      builderState.classitems = '';
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

      updateGeneratedRule();
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

    var totalSteps = 8;
    var currentStep = 1;
    var choices = {
      'class': '',
      experience: '',
      notifications: [],
      extras: [],
      rwbases: '',
      consumables: [],
      tooltips: []
    };

    function openWizard() {
      modal.style.display = 'flex';
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
        'new': 'New to PD2', casual: 'Casual', experienced: 'Experienced', endgame: 'Endgame',
        mapicons: 'Map Icons', sounds: 'Drop Sounds', bignotify: 'Big Notifications',
        sockets: 'Socket Count', ilvl: 'Item Level', price: 'Vendor Price',
        crafting: 'Crafting Info', eth: 'Ethereal Tag',
        'all-rw': 'All Good Bases', 'eth-rw': 'Eth Bases Only', 'none-rw': 'None',
        hidegold: 'Hide Low Gold', hidekeys: 'Hide Keys',
        hidescrolls: 'Hide Scrolls', hidepots: 'Hide Small Potions',
        hideallhp: 'Hide ALL HP', hideallmp: 'Hide ALL MP',
        socketrecipe: 'Socket Recipes', sellvalue: 'Sell Value $', upgraderecipe: 'Upgrade Recipes', imbue: 'Imbue/Slam Tips'
      };
      return labels[val] || val;
    }

    function renderSummary() {
      var rows = [
        { l: 'Class', v: label('', choices['class']) || 'Not selected' },
        { l: 'Experience', v: label('', choices.experience) || 'Not selected' },
        { l: 'Notifications', v: choices.notifications.length ? choices.notifications.map(function (x) { return label('', x); }).join(', ') : 'None' },
        { l: 'Extra Info', v: choices.extras.length ? choices.extras.map(function (x) { return label('', x); }).join(', ') : 'None' },
        { l: 'Runeword Bases', v: label('', choices.rwbases + '-rw') },
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
      var isStrict = c.experience === 'endgame';
      var isMid = c.experience === 'experienced';
      var isCasual = c.experience === 'casual';
      var isNew = c.experience === 'new';
      var wantMapIcons = c.notifications.indexOf('mapicons') !== -1;
      var wantSounds = c.notifications.indexOf('sounds') !== -1;
      var wantBigNotify = c.notifications.indexOf('bignotify') !== -1;
      var wantSockets = c.extras.indexOf('sockets') !== -1;
      var wantIlvl = c.extras.indexOf('ilvl') !== -1;
      var wantPrice = c.extras.indexOf('price') !== -1;
      var wantCrafting = c.extras.indexOf('crafting') !== -1;
      var wantEthTag = c.extras.indexOf('eth') !== -1;
      var rwBases = c.rwbases || 'none';
      var wantSocketRecipe = c.tooltips.indexOf('socketrecipe') !== -1;
      var wantSellValue = c.tooltips.indexOf('sellvalue') !== -1;
      var wantUpgradeRecipe = c.tooltips.indexOf('upgraderecipe') !== -1;
      var wantImbue = c.tooltips.indexOf('imbue') !== -1;

      // Class code mapping
      var classMap = {
        amazon: 'ZON', sorceress: 'SOR', necromancer: 'NEC', paladin: 'DIN',
        barbarian: 'BAR', druid: 'DRU', assassin: 'SIN'
      };
      var myClass = classMap[c['class']] || '';

      // ---- Notification helpers ----
      // High runes: border + loud sound
      var hrNotify = (wantBigNotify ? '%BORDER-FF%' : wantMapIcons ? '%MAP-0A%' : '') + (wantSounds ? '%SOUNDID-4716%' : '');
      // Mid-high runes: map icon + sound
      var midNotify = (wantMapIcons ? '%MAP-0A%' : '') + (wantSounds ? '%SOUNDID-4715%' : '');
      // Mid runes: dot + optional sound
      var midRuneDot = wantMapIcons ? '%DOT-0A%' : '';
      var midRuneNotify = midRuneDot + (wantSounds ? '%SOUNDID-4718%' : '');
      // Low runes: small dot only
      var lowRuneDot = wantMapIcons ? '%DOT-60%' : '';
      // Unique notification
      var uniNotify = (wantBigNotify ? '%BORDER-62%' : wantMapIcons ? '%MAP-62%' : '') + (wantSounds ? '%SOUNDID-4715%' : '');
      // Set notification
      var setNotify = (wantBigNotify ? '%BORDER-84%' : wantMapIcons ? '%MAP-84%' : '') + (wantSounds ? '%SOUNDID-4715%' : '');
      // Special PD2 items
      var pd2Notify = wantMapIcons ? '%MAP-68%' : '';
      var pd2BigNotify = (wantBigNotify ? '%BORDER-62%' : wantMapIcons ? '%MAP-62%' : '') + (wantSounds ? '%SOUNDID-4716%' : '');
      // Quest items
      var questNotify = wantMapIcons ? '%MAP-58%' : '';
      // Charm notify
      var charmNotify = wantMapIcons ? '%DOT-97%' : '';
      // Gem notify
      var gemNotify = wantMapIcons ? '%DOT-5B%' : '';
      // RW base notify
      var rwNotify = wantMapIcons ? '%MAP-18%' : '';

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
      lines.push('// Generated by the Build My Filter wizard');
      lines.push('// Class: ' + (label('', c['class']) || 'All') + ' | Strictness: ' + (label('', c.experience) || 'Casual'));
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
          lines.push('ItemDisplay[(MAG OR UNI OR SET OR RARE OR CRAFT) ETH]: %NAME% %GRAY%[Eth]%CONTINUE%');
          lines.push('ItemDisplay[(MAG OR UNI OR SET OR RARE OR CRAFT) !RW !ETH SOCK>0]: %NAME% [%SOCKETS%]%CONTINUE%');
          lines.push('ItemDisplay[(MAG OR UNI OR SET OR RARE OR CRAFT) !RW ETH SOCK>0]: %NAME%[%SOCKETS%]%CONTINUE%');
          lines.push('// Normal items: Eth tag and socket count');
          lines.push('ItemDisplay[NMAG ETH]: %GRAY%%NAME% [Eth]%CONTINUE%');
          lines.push('ItemDisplay[NMAG !RW !ETH SOCK>0]: %GRAY%%NAME% [%SOCKETS%]%CONTINUE%');
          lines.push('ItemDisplay[NMAG !RW ETH SOCK>0]: %GRAY%%NAME%[%SOCKETS%]%CONTINUE%');
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
      lines.push('ItemDisplay[lbox]: %PURPLE%+ %RED%Larzuks Puzzlebox %PURPLE%+' + pd2BigNotify);
      lines.push('ItemDisplay[lpp]: %PURPLE%+ %RED%Larzuks Puzzlepiece %PURPLE%+' + pd2BigNotify);

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
      lines.push('ItemDisplay[RUNE=33]: %ORANGE%>> %RUNENAME% Rune << (#%RUNENUM%)' + hrNotify);
      lines.push('ItemDisplay[RUNE=32]: %ORANGE%>> %RUNENAME% Rune << (#%RUNENUM%)' + hrNotify);
      lines.push('ItemDisplay[RUNE=31]: %ORANGE%>> %RUNENAME% Rune << (#%RUNENUM%)' + hrNotify);
      lines.push('ItemDisplay[RUNE=30]: %ORANGE%>> %RUNENAME% Rune << (#%RUNENUM%)' + hrNotify);
      lines.push('ItemDisplay[RUNE=29]: %ORANGE%>> %RUNENAME% Rune << (#%RUNENUM%)' + hrNotify);
      lines.push('ItemDisplay[RUNE=28]: %ORANGE%>> %RUNENAME% Rune << (#%RUNENUM%)' + hrNotify);

      // Tier 2: Mid-high Runes (Ist #24 through Ohm #27)
      lines.push('// --- Mid-High Runes (Ist - Ohm) ---');
      lines.push('ItemDisplay[RUNE>23 RUNE<28]: %ORANGE%> %RUNENAME% Rune < (#%RUNENUM%)' + midNotify);

      // Tier 3: Mid Runes (Lem #20 through Mal #23)
      lines.push('// --- Mid Runes (Lem - Mal) ---');
      lines.push('ItemDisplay[RUNE>19 RUNE<24]: %ORANGE%%RUNENAME% Rune (#%RUNENUM%)' + midRuneNotify);

      // Rune stacking display (from Wolfie/HiimFilter)
      lines.push('// --- Rune Stack Display ---');
      lines.push('ItemDisplay[RUNE>0 QTY>1]: %NAME% %TAN%x%QTY%{%NAME%}%CONTINUE%');
      lines.push('');

      // Tier 4: Low Runes (El #1 through Fal #19)
      lines.push('// --- Low Runes (El - Fal) ---');
      if (isStrict) {
        // Strict: show Ko-Fal (#18-19) with dot, hide lowest at FILTLVL>2
        lines.push('ItemDisplay[RUNE>17 RUNE<20]: %ORANGE%%RUNENAME% (#%RUNENUM%)' + lowRuneDot);
        lines.push('ItemDisplay[RUNE>10 RUNE<18]: %ORANGE%%RUNENAME% (#%RUNENUM%)');
        lines.push('ItemDisplay[RUNE>0 RUNE<11 FILTLVL<2]: %ORANGE%%RUNENAME% (#%RUNENUM%)');
        lines.push('ItemDisplay[RUNE>0 RUNE<11 FILTLVL>1]:');
      } else if (isMid) {
        lines.push('ItemDisplay[RUNE>14 RUNE<20]: %ORANGE%%RUNENAME% Rune (#%RUNENUM%)' + lowRuneDot);
        lines.push('ItemDisplay[RUNE>10 RUNE<15]: %ORANGE%%RUNENAME% (#%RUNENUM%)');
        lines.push('ItemDisplay[RUNE>0 RUNE<11]: %ORANGE%%RUNENAME% (#%RUNENUM%)');
      } else {
        lines.push('ItemDisplay[RUNE>0 RUNE<20]: %ORANGE%%RUNENAME% Rune (#%RUNENUM%)' + lowRuneDot);
      }
      lines.push('');

      // ==========================
      // 7. UNIQUE & SET (tiered)
      // ==========================
      lines.push('// ============================================================');
      lines.push('// UNIQUE & SET ITEMS');
      lines.push('// ============================================================');

      // Unique charms always show with big notification
      lines.push('// --- Unique Charms (Annihilus, Torch, Gheeds) ---');
      lines.push('ItemDisplay[UNI cm1]: %GOLD%+ Annihilus +' + descStr + (wantBigNotify ? '%BORDER-62%' : wantMapIcons ? '%MAP-62%' : '') + (wantSounds ? '%SOUNDID-4716%' : ''));
      lines.push('ItemDisplay[UNI cm2]: %GOLD%+ Hellfire Torch +' + descStr + (wantBigNotify ? '%BORDER-62%' : wantMapIcons ? '%MAP-62%' : '') + (wantSounds ? '%SOUNDID-4716%' : ''));
      lines.push('ItemDisplay[UNI cm3]: %GOLD%+ Gheeds Fortune +' + descStr + (wantBigNotify ? '%BORDER-62%' : wantMapIcons ? '%MAP-62%' : '') + (wantSounds ? '%SOUNDID-4716%' : ''));

      lines.push('// --- Unique Items ---');
      if (isStrict) {
        // Endgame: show all uniques but tier them
        lines.push('ItemDisplay[UNI ELT]: %GOLD%%NAME%' + descStr + uniNotify);
        lines.push('ItemDisplay[UNI EXC]: %GOLD%%NAME%' + descStr + (wantMapIcons ? '%MAP-62%' : ''));
        lines.push('ItemDisplay[UNI NORM FILTLVL<3]: %GOLD%%NAME%' + descStr);
        lines.push('ItemDisplay[UNI NORM FILTLVL>2]: %GOLD%%NAME%');
      } else {
        lines.push('ItemDisplay[UNI]: %GOLD%%NAME%' + descStr + uniNotify);
      }

      lines.push('// --- Set Items ---');
      if (isStrict) {
        lines.push('ItemDisplay[SET ELT]: %GREEN%%NAME%' + descStr + setNotify);
        lines.push('ItemDisplay[SET EXC]: %GREEN%%NAME%' + descStr + (wantMapIcons ? '%MAP-84%' : ''));
        lines.push('ItemDisplay[SET NORM FILTLVL<3]: %GREEN%%NAME%' + descStr);
        lines.push('ItemDisplay[SET NORM FILTLVL>2]: %GREEN%%NAME%');
      } else {
        lines.push('ItemDisplay[SET]: %GREEN%%NAME%' + descStr + setNotify);
      }
      lines.push('');

      // ==========================
      // 8. RARE & CRAFTED
      // ==========================
      lines.push('// ============================================================');
      lines.push('// RARE & CRAFTED');
      lines.push('// ============================================================');
      if (isStrict) {
        lines.push('// Endgame: only show valuable rare slot types');
        lines.push('ItemDisplay[RARE JEWELRY]: %YELLOW%%NAME%' + descStr);
        lines.push('ItemDisplay[RARE (CIRC OR CIRCLET)]: %YELLOW%%NAME%' + descStr);
        lines.push('ItemDisplay[RARE GLOVES ELT]: %YELLOW%%NAME%' + descStr);
        lines.push('ItemDisplay[RARE BOOTS ELT]: %YELLOW%%NAME%' + descStr);
        lines.push('ItemDisplay[RARE BELT ELT]: %YELLOW%%NAME%' + descStr);
        if (myClass) {
          lines.push('ItemDisplay[RARE ' + myClass + ' ELT]: %YELLOW%%NAME%' + descStr);
        }
        lines.push('ItemDisplay[RARE ELT FILTLVL<2]: %YELLOW%%NAME%' + descStr);
        lines.push('ItemDisplay[RARE FILTLVL<2]: %YELLOW%%NAME%');
        lines.push('ItemDisplay[RARE]:');
      } else if (isMid) {
        lines.push('ItemDisplay[RARE JEWELRY]: %YELLOW%%NAME%' + descStr);
        lines.push('ItemDisplay[RARE (CIRC OR CIRCLET)]: %YELLOW%%NAME%' + descStr);
        lines.push('ItemDisplay[RARE ELT]: %YELLOW%%NAME%' + descStr);
        lines.push('ItemDisplay[RARE EXC]: %YELLOW%%NAME%' + descStr);
        lines.push('ItemDisplay[RARE NORM FILTLVL<3]: %YELLOW%%NAME%' + descStr);
        lines.push('ItemDisplay[RARE NORM FILTLVL>2]:');
      } else {
        lines.push('ItemDisplay[RARE]: %YELLOW%%NAME%' + descStr);
      }
      lines.push('ItemDisplay[CRAFT]: %ORANGE%%NAME%' + descStr);
      lines.push('');

      // ==========================
      // 9. CHARMS (with ilvl info)
      // ==========================
      lines.push('// ============================================================');
      lines.push('// CHARMS');
      lines.push('// ============================================================');
      // Grand charms: highlight high-ilvl ones for skillers
      lines.push('ItemDisplay[cm3 MAG ILVL>90]: %BLUE%GC %NAME%' + ilvlStr + charmNotify);
      lines.push('ItemDisplay[cm3 MAG]: %BLUE%GC %NAME%' + ilvlStr);
      // Large charms
      lines.push('ItemDisplay[cm2 MAG]: %BLUE%LC %NAME%');
      // Small charms: show ilvl for max-roll hunting
      lines.push('ItemDisplay[cm1 MAG ILVL>90]: %BLUE%SC %NAME%' + ilvlStr + charmNotify);
      lines.push('ItemDisplay[cm1 MAG]: %BLUE%SC %NAME%' + ilvlStr);
      lines.push('');

      // ==========================
      // 10. GEMS (tiered by quality)
      // ==========================
      lines.push('// ============================================================');
      lines.push('// GEMS');
      lines.push('// ============================================================');
      // Perfect gems always shown with notification
      lines.push('ItemDisplay[GEM=5]: %PURPLE%%NAME%' + gemNotify);
      if (isStrict) {
        // Flawless shown, hide chipped/flawed/normal by DIFF
        lines.push('ItemDisplay[GEM=4]: %PURPLE%%NAME%');
        lines.push('ItemDisplay[GEM=3 DIFF<2]: %PURPLE%%NAME%');
        lines.push('ItemDisplay[GEM=3 DIFF>1]:');
        lines.push('ItemDisplay[GEM=2 DIFF<1]: %PURPLE%%NAME%');
        lines.push('ItemDisplay[GEM=2 DIFF>0]:');
        lines.push('ItemDisplay[GEM=1 DIFF<1]: %PURPLE%%NAME%');
        lines.push('ItemDisplay[GEM=1 DIFF>0]:');
      } else if (isMid) {
        lines.push('ItemDisplay[GEM=4]: %PURPLE%%NAME%');
        lines.push('ItemDisplay[GEM=3]: %PURPLE%%NAME%');
        lines.push('ItemDisplay[GEM=2 DIFF<1]: %PURPLE%%NAME%');
        lines.push('ItemDisplay[GEM=2 DIFF>0]:');
        lines.push('ItemDisplay[GEM=1 DIFF<1]: %PURPLE%%NAME%');
        lines.push('ItemDisplay[GEM=1 DIFF>0]:');
      } else {
        lines.push('ItemDisplay[GEM>0]: %PURPLE%%NAME%');
      }
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
        lines.push('// Amulet crafting: cALVL > 89 for best results');
        lines.push('ItemDisplay[MAG amu CRAFTALVL>89]: %BLUE%%NAME% %ORANGE%{cALVL:%CRAFTALVL%}');
        lines.push('ItemDisplay[RARE amu CRAFTALVL>89]: %YELLOW%%NAME% %ORANGE%{cALVL:%CRAFTALVL%}');
        lines.push('// Ring crafting: cALVL > 80');
        lines.push('ItemDisplay[MAG rin CRAFTALVL>80]: %BLUE%%NAME% %ORANGE%{cALVL:%CRAFTALVL%}');
        lines.push('ItemDisplay[RARE rin CRAFTALVL>80]: %YELLOW%%NAME% %ORANGE%{cALVL:%CRAFTALVL%}');
        lines.push('// Body Armor / Shield: cALVL > 84');
        lines.push('ItemDisplay[MAG (CHEST OR SHIELD) CRAFTALVL>84]: %BLUE%%NAME% %ORANGE%{cALVL:%CRAFTALVL%}');
        lines.push('// Helm: cALVL > 80');
        lines.push('ItemDisplay[MAG (HELM OR CIRC) CRAFTALVL>80]: %BLUE%%NAME% %ORANGE%{cALVL:%CRAFTALVL%}');
        lines.push('// Weapons: cALVL > 76');
        lines.push('ItemDisplay[MAG WEAPON CRAFTALVL>76]: %BLUE%%NAME% %ORANGE%{cALVL:%CRAFTALVL%}');
        lines.push('// Gloves: cALVL > 74');
        lines.push('ItemDisplay[MAG GLOVES CRAFTALVL>74]: %BLUE%%NAME% %ORANGE%{cALVL:%CRAFTALVL%}');
        lines.push('// Belt: cALVL > 70');
        lines.push('ItemDisplay[MAG BELT CRAFTALVL>70]: %BLUE%%NAME% %ORANGE%{cALVL:%CRAFTALVL%}');
        lines.push('// Boots: cALVL > 69');
        lines.push('ItemDisplay[MAG BOOTS CRAFTALVL>69]: %BLUE%%NAME% %ORANGE%{cALVL:%CRAFTALVL%}');
        lines.push('');
      }

      // ==========================
      // 13. CLASS-SPECIFIC ITEMS
      // ==========================
      if (myClass) {
        lines.push('// ============================================================');
        lines.push('// CLASS-SPECIFIC ITEMS (' + label('', c['class']) + ')');
        lines.push('// ============================================================');
        lines.push('ItemDisplay[' + myClass + ' RARE ELT]: %YELLOW%%NAME%' + descStr);
        lines.push('ItemDisplay[' + myClass + ' MAG ELT]: %BLUE%%NAME%' + descStr);
        if (myClass === 'DIN') {
          lines.push('// Paladin shields with +All Res');
          lines.push('ItemDisplay[NMAG !INF (pa3 OR pa4 OR pa5 OR pa7 OR pad) SOCK>0 ELT]: %GOLD%RW Base: %WHITE%%NAME% %GRAY%[%SOCKETS%os]' + rwNotify);
          lines.push('ItemDisplay[NMAG !INF (pa3 OR pa4 OR pa5 OR pa7 OR pad) SOCK=0 ELT]: %GOLD%Larzuk: %WHITE%%NAME% %GRAY%[Max:%MAXSOCKETS%]');
        }
        if (myClass === 'NEC') {
          lines.push('// Necromancer heads');
          lines.push('ItemDisplay[NMAG !INF SOCK>0 (nea OR ned OR nef OR neg OR neh) ELT]: %GRAY%%SOCKETS%os %WHITE%%NAME%');
        }
        if (myClass === 'SOR') {
          lines.push('// Sorceress orbs');
          lines.push('ItemDisplay[NMAG !INF SOCK>0 (ob6 OR ob7 OR ob8 OR ob9 OR oba) ELT]: %GRAY%%SOCKETS%os %WHITE%%NAME%');
        }
        if (myClass === 'BAR') {
          lines.push('// Barbarian helms');
          lines.push('ItemDisplay[NMAG !INF SOCK>0 (baa OR bab OR bac OR bad OR bae) ELT]: %GRAY%%SOCKETS%os %WHITE%%NAME%');
        }
        if (myClass === 'DRU') {
          lines.push('// Druid pelts');
          lines.push('ItemDisplay[NMAG !INF SOCK>0 (dra OR drb OR drc OR drd OR dre) ELT]: %GRAY%%SOCKETS%os %WHITE%%NAME%');
        }
        if (myClass === 'ZON') {
          lines.push('// Amazon javelins / bows');
          lines.push('ItemDisplay[NMAG !INF SOCK>0 (ama OR amb OR amc OR amd OR ame) ELT]: %GRAY%%SOCKETS%os %WHITE%%NAME%');
          lines.push('// Amazon quivers');
          lines.push('ItemDisplay[RARE QUIVER !ID]: %YELLOW%%NAME%' + descStr);
          lines.push('ItemDisplay[MAG QUIVER !ID]: %BLUE%%NAME%');
        }
        if (myClass === 'SIN') {
          lines.push('// Assassin claws');
          lines.push('ItemDisplay[NMAG !INF SOCK>0 (9lw OR 9tw OR 9qr OR 7lw OR 7tw OR 7qr) ELT]: %GRAY%%SOCKETS%os %WHITE%%NAME%');
        }
        lines.push('');
      }

      // ==========================
      // 13b. NMAG ITEM ENRICHMENT (from HiimFilter)
      // ==========================
      lines.push('// ============================================================');
      lines.push('// NMAG ITEM ENRICHMENT');
      lines.push('// ============================================================');
      // Base coloring: white for 0os, gray for socketed
      lines.push('// Base item coloring');
      lines.push('ItemDisplay[(ARMOR OR WEAPON) NMAG SOCK=0]: %WHITE%%NAME%%CONTINUE%{%NAME%}');
      lines.push('ItemDisplay[(ARMOR OR WEAPON) NMAG SOCK>0]: %GRAY%%NAME%%CONTINUE%{%NAME%}');
      // SUP enhanced defense/damage display
      lines.push('// Superior ED% display');
      lines.push('ItemDisplay[!INF !RW NMAG SUP EDEF>0]: %BLUE%[%EDEF%%%] %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[!INF !RW NMAG SUP EDAM>0]: %RED%[%EDAM%%%] %NAME%{%NAME%}%CONTINUE%');
      // Paladin shield all-res
      if (!myClass || myClass === 'DIN') {
        lines.push('// Paladin shield All Res');
        lines.push('ItemDisplay[!INF !RW NMAG DIN RES>19]: %GREEN%[%RES%r] %NAME%{%NAME%}%CONTINUE%');
        lines.push('ItemDisplay[!INF !RW NMAG DIN RES>0]: %TAN%[%RES%r] %NAME%{%NAME%}%CONTINUE%');
      }
      // High-defense chests
      lines.push('// High defense chest armor');
      lines.push('ItemDisplay[CHEST !INF !RW NMAG DEF>799]: %TAN%[%DEF% Def] %NAME%{%NAME%}%CONTINUE%' + (wantMapIcons ? '%DOT-D6%' : ''));
      lines.push('');

      // ==========================
      // 13c. STAFFMOD DISPLAY (from HiimFilter/Kryszard)
      // ==========================
      lines.push('// ============================================================');
      lines.push('// STAFFMOD DISPLAY -- skill bonuses on white/magic items');
      lines.push('// ============================================================');

      // Tab-based staffmods (all classes)
      lines.push('// --- Skill Tab Display (all classes) ---');
      // Amazon
      lines.push('ItemDisplay[NMAG !RW TABSK0>2]: %GREEN%+3 Bow %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW TABSK1>2]: %GREEN%+3 PassMag %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW TABSK2>2]: %GREEN%+3 Java %NAME%{%NAME%}%CONTINUE%');
      // Sorceress
      lines.push('ItemDisplay[NMAG !RW TABSK8>2]: %GREEN%+3 Fire %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW TABSK9>2]: %GREEN%+3 Light %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW TABSK10>2]: %GREEN%+3 Cold %NAME%{%NAME%}%CONTINUE%');
      // Necromancer
      lines.push('ItemDisplay[NMAG !RW TABSK16>2]: %GREEN%+3 Curses %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW TABSK17>2]: %GREEN%+3 PnB %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW TABSK18>2]: %GREEN%+3 NecSum %NAME%{%NAME%}%CONTINUE%');
      // Paladin
      lines.push('ItemDisplay[NMAG !RW TABSK24>2]: %GREEN%+3 PalCmbt %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW TABSK25>2]: %GREEN%+3 OffAura %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW TABSK26>2]: %GREEN%+3 DefAura %NAME%{%NAME%}%CONTINUE%');
      // Barbarian
      lines.push('ItemDisplay[NMAG !RW TABSK32>2]: %GREEN%+3 BarCmbt %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW TABSK33>2]: %GREEN%+3 Masteries %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW TABSK34>2]: %GREEN%+3 Warcries %NAME%{%NAME%}%CONTINUE%');
      // Druid
      lines.push('ItemDisplay[NMAG !RW TABSK40>2]: %GREEN%+3 DruSum %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW TABSK41>2]: %GREEN%+3 Shape %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW TABSK42>2]: %GREEN%+3 Elem %NAME%{%NAME%}%CONTINUE%');
      // Assassin
      lines.push('ItemDisplay[NMAG !RW TABSK48>2]: %GREEN%+3 Traps %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW TABSK49>2]: %GREEN%+3 Shadow %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW TABSK50>2]: %GREEN%+3 MartArt %NAME%{%NAME%}%CONTINUE%');

      // Key individual staffmods (valuable for runewords — always show)
      lines.push('// --- Key Individual Staffmods (valuable for RW bases) ---');
      // Assassin claws: Weapon Block, Burst of Speed, Blade Fury, Venom, Fade
      lines.push('ItemDisplay[NMAG !RW SIN SK263>2]: %ORANGE%+3 WpnBlck %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW SIN SK258>2]: %ORANGE%+3 BurstSpd %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW SIN SK266>2]: %ORANGE%+3 BldFury %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW SIN SK278>2]: %ORANGE%+3 Venom %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW SIN SK267>2]: %ORANGE%+3 Fade %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW SIN SK252>2]: %ORANGE%+3 ClwMast %NAME%{%NAME%}%CONTINUE%');
      // Sorceress orbs: Energy Shield, Shiver Armor, Enchant Fire, Teleport
      lines.push('ItemDisplay[NMAG !RW SOR SK58>2]: %ORANGE%+3 E.Shield %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW SOR SK50>2]: %ORANGE%+3 ShivArm %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW SOR SK52>2]: %ORANGE%+3 Enchant %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW SOR SK54>2]: %ORANGE%+3 Tele %NAME%{%NAME%}%CONTINUE%');
      // Necromancer wands: Lower Resist, Corpse Explosion, Bone Spear, Revive
      lines.push('ItemDisplay[NMAG !RW NEC SK91>2]: %ORANGE%+3 LwrRes %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW NEC SK74>2]: %ORANGE%+3 CorpExpl %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW NEC SK84>2]: %ORANGE%+3 BneSpr %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW NEC SK95>2]: %ORANGE%+3 Revive %NAME%{%NAME%}%CONTINUE%');
      // Paladin scepters: Holy Shield, Conviction, Fanaticism, Blessed Hammer
      lines.push('ItemDisplay[NMAG !RW DIN SK117>2]: %ORANGE%+3 HlyShld %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW DIN SK123>2]: %ORANGE%+3 Convic %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW DIN SK122>2]: %ORANGE%+3 Fanat %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW DIN SK112>2]: %ORANGE%+3 BHammer %NAME%{%NAME%}%CONTINUE%');
      // Barbarian helms: Battle Orders, Battle Command, Natural Resistance, War Cry
      lines.push('ItemDisplay[NMAG !RW BAR SK149>2]: %ORANGE%+3 BO %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW BAR SK155>2]: %ORANGE%+3 BCmnd %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW BAR SK153>2]: %ORANGE%+3 NatRes %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW BAR SK154>2]: %ORANGE%+3 WarCry %NAME%{%NAME%}%CONTINUE%');
      // Druid pelts: Tornado, Fissure, Volcano, Heart of Wolverine, Oak Sage, Grizzly
      lines.push('ItemDisplay[NMAG !RW DRU SK245>2]: %ORANGE%+3 Tornado %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW DRU SK234>2]: %ORANGE%+3 Fissure %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW DRU SK244>2]: %ORANGE%+3 Volcano %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW DRU SK236>2]: %ORANGE%+3 HOW %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW DRU SK226>2]: %ORANGE%+3 OakSage %NAME%{%NAME%}%CONTINUE%');
      lines.push('ItemDisplay[NMAG !RW DRU SK247>2]: %ORANGE%+3 Grizzly %NAME%{%NAME%}%CONTINUE%');
      lines.push('');

      // ==========================
      // 13d. UNID MAGIC/RARE CLASS ITEM DISPLAY (from HiimFilter)
      // ==========================
      lines.push('// ============================================================');
      lines.push('// UNID MAGIC & RARE CLASS ITEM DISPLAY');
      lines.push('// ============================================================');
      if (myClass) {
        var classUpper = {ZON:'AMAZON',SOR:'SORCERESS',NEC:'NECROMANCER',DIN:'PALADIN',BAR:'BARBARIAN',DRU:'DRUID',SIN:'ASSASSIN'}[myClass];
        var clNum = {ZON:'CL7',SOR:'CL6',NEC:'CL4',DIN:'CL3',BAR:'CL2',DRU:'CL1',SIN:'CL5'}[myClass];
        // Your class magic items highlighted at low FILTLVL
        lines.push('// Your class magic items get extra callout');
        lines.push('ItemDisplay[' + classUpper + ' ' + clNum + ' FILTLVL<2 MAG !ID]: %BLUE%** %NAME% **');
        lines.push('ItemDisplay[' + classUpper + ' ' + clNum + ' FILTLVL<5 RARE !ID]: %YELLOW%** %NAME% **');
        // Class item rename on ground at strict levels
        lines.push('// Class item shortnames on ground at strict levels');
        if (myClass === 'NEC' || !myClass) lines.push('ItemDisplay[(MAG OR RARE) NEC !ID GROUND FILTLVL>4]: %CONTINUE%Nec Head');
        if (myClass === 'SOR' || !myClass) lines.push('ItemDisplay[(MAG OR RARE) SOR !ID GROUND FILTLVL>4]: %CONTINUE%Sorc Orb');
        if (myClass === 'BAR' || !myClass) lines.push('ItemDisplay[(MAG OR RARE) BAR !ID GROUND FILTLVL>4]: %CONTINUE%Barb Helm');
        if (myClass === 'DRU' || !myClass) lines.push('ItemDisplay[(MAG OR RARE) DRU !ID GROUND FILTLVL>4]: %CONTINUE%Druid Pelt');
        if (myClass === 'DIN' || !myClass) lines.push('ItemDisplay[(MAG OR RARE) DIN !ID GROUND FILTLVL>4]: %CONTINUE%Pala Shield');
        if (myClass === 'SIN' || !myClass) lines.push('ItemDisplay[(MAG OR RARE) SIN !ID GROUND FILTLVL>4]: %CONTINUE%Asn Claw');
        if (myClass === 'ZON' || !myClass) lines.push('ItemDisplay[(MAG OR RARE) ZON !ID GROUND FILTLVL>4]: %CONTINUE%Zon Weapon');
      } else {
        // All classes: show class item renames at strict
        lines.push('// Class item shortnames on ground at strict levels');
        lines.push('ItemDisplay[(MAG OR RARE) NEC !ID GROUND FILTLVL>4]: %CONTINUE%Nec Head');
        lines.push('ItemDisplay[(MAG OR RARE) SOR !ID GROUND FILTLVL>4]: %CONTINUE%Sorc Orb');
        lines.push('ItemDisplay[(MAG OR RARE) BAR !ID GROUND FILTLVL>4]: %CONTINUE%Barb Helm');
        lines.push('ItemDisplay[(MAG OR RARE) DRU !ID GROUND FILTLVL>4]: %CONTINUE%Druid Pelt');
        lines.push('ItemDisplay[(MAG OR RARE) DIN !ID GROUND FILTLVL>4]: %CONTINUE%Pala Shield');
        lines.push('ItemDisplay[(MAG OR RARE) SIN !ID GROUND FILTLVL>4]: %CONTINUE%Asn Claw');
        lines.push('ItemDisplay[(MAG OR RARE) ZON !ID GROUND FILTLVL>4]: %CONTINUE%Zon Weapon');
      }
      // General magic/rare unid display by slot (from HiimFilter FILTLVL-gated)
      lines.push('// --- Unid magic/rare by slot ---');
      lines.push('ItemDisplay[RARE (rin OR amu) !ID FILTLVL<5]: %YELLOW%%NAME%');
      lines.push('ItemDisplay[RARE jew !ID]: %YELLOW%%NAME%');
      lines.push('ItemDisplay[RARE (CIRC OR EQ7) !ID FILTLVL<5]: %YELLOW%%NAME%');
      lines.push('ItemDisplay[RARE ELT !ID FILTLVL<5]: %YELLOW%%NAME%');
      lines.push('ItemDisplay[RARE EXC !ID FILTLVL<3]: %YELLOW%%NAME%');
      lines.push('ItemDisplay[MAG jew !ID ILVL>84]: %BLUE%%NAME%' + (wantMapIcons ? '%DOT-9A%' : ''));
      lines.push('ItemDisplay[MAG jew !ID FILTLVL<5]: %BLUE%%NAME%');
      lines.push('ItemDisplay[MAG (rin OR amu) !ID FILTLVL<3]: %BLUE%%NAME%');
      lines.push('ItemDisplay[MAG (CIRC OR EQ7) !ID FILTLVL<5]: %BLUE%%NAME%');
      lines.push('');

      // ==========================
      // 14. RUNEWORD BASES
      // ==========================
      if (rwBases !== 'none') {
        lines.push('// ============================================================');
        lines.push('// RUNEWORD BASES');
        lines.push('// ============================================================');
        var showEthBases = (rwBases === 'eth' || rwBases === 'all');
        var showNonEthBases = (rwBases === 'noneth' || rwBases === 'all');

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
          lines.push('ItemDisplay[NMAG !INF !RW ETH (SOCK=0 OR SOCK=3) 7xf SK263>2]: %GOLD%GG Chaos %GRAY%ETH %WHITE%%NAME%' + rwNotify);
        }
        // Phase Blade (7cr) — always show, cannot be eth, fixed speed
        lines.push('ItemDisplay[NMAG !INF !RW (SOCK=0 OR SOCK>3) 7cr]: %WHITE%Phase Blade %GRAY%[%SOCKETS%os]' + (wantMapIcons ? '%DOT-D6%' : ''));
        // Monarch (uit) — Spirit base
        lines.push('ItemDisplay[NMAG !INF !RW (SOCK=0 OR SOCK=4) uit]: %WHITE%Monarch %GRAY%[%SOCKETS%os]' + (wantMapIcons ? '%DOT-D6%' : ''));
        // Diadem (ci3) — imbue/runeword base
        lines.push('ItemDisplay[NMAG !INF !RW ci3]: %WHITE%Diadem %GRAY%[%SOCKETS%os]' + (wantMapIcons ? '%DOT-D6%' : ''));
        // Crystal Sword (crs) — early Spirit base
        if (!isStrict) {
          lines.push('ItemDisplay[NMAG !INF !RW (SOCK=0 OR SOCK=4) crs FILTLVL<3]: %WHITE%Crystal Sword %GRAY%[%SOCKETS%os]');
        }
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

        // Exceptional bases (only at relaxed FILTLVL)
        if (!isStrict) {
          lines.push('// --- Exceptional Bases (hidden at strict levels) ---');
          lines.push('ItemDisplay[NMAG !INF !RW SOCK=4 CHEST EXC FILTLVL<2]: %GRAY%4os %WHITE%%NAME%');
          lines.push('ItemDisplay[NMAG !INF !RW SOCK=4 POLEARM EXC FILTLVL<2]: %GRAY%4os %WHITE%%NAME%');
        }

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
          if (isStrict || isMid) {
            lines.push('ItemDisplay[hp4 DIFF>1]:');
          }
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
          if (isStrict || isMid) {
            lines.push('ItemDisplay[mp4 DIFF>1]:');
          }
        }
        lines.push('ItemDisplay[mp1]: %BLUE%+%WHITE%MP1');
        lines.push('ItemDisplay[mp2]: %BLUE%+%WHITE%MP2');
        lines.push('ItemDisplay[mp3]: %BLUE%+%WHITE%MP3');
        lines.push('ItemDisplay[mp4]: %BLUE%+%WHITE%MP4');
        lines.push('ItemDisplay[mp5]: %BLUE%+%WHITE%MP5');
      }
      // Rejuvenation potions
      if (isStrict) {
        lines.push('ItemDisplay[rvs FILTLVL>3]:');
      }
      lines.push('ItemDisplay[rvs]: %PURPLE%+%WHITE%35%%');
      lines.push('ItemDisplay[rvl]: %PURPLE%+%WHITE%65%%');
      // PvP mana potion
      lines.push('ItemDisplay[pvpp]: %BLUE%+%WHITE%DMP');
      // Antidote and thawing
      lines.push('ItemDisplay[yps]: %GREEN%+%WHITE%Anti');
      lines.push('ItemDisplay[wms]: %GREEN%+%WHITE%Thaw');
      // Stamina potion
      if (isMid || isStrict) {
        lines.push('ItemDisplay[vps DIFF>1]:');
      }
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
      lines.push('ItemDisplay[(ARMOR OR WEAPON OR rin OR amu) (MAG OR RARE OR CRAFT) ID FRW>0]: %GOLD%%FRW%FRW %NAME%%CONTINUE%{%NAME%}');
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
        lines.push('ItemDisplay[NMAG !RW SELLPRICE>34999 (NORM OR EXC OR ELT)]: %DARK_GREEN%$ %WHITE%%NAME%{%NAME%}');
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
        lines.push('ItemDisplay[UNI ID NORM ARMOR]: %NAME%{%TAN%Rune + Perf Diamond%NL%Cube w/ Tal, Shael,%NL%%ORANGE%Upgrade Recipe:}%CONTINUE%');
        lines.push('ItemDisplay[UNI ID EXC ARMOR]: %NAME%{%TAN%Rune + Perf Diamond%NL%Cube w/ Ko, Lem,%NL%%ORANGE%Upgrade Recipe:}%CONTINUE%');
        lines.push('ItemDisplay[UNI ID NORM WEAPON]: %NAME%{%TAN%Rune + Perf Emerald%NL%Cube w/ Ral, Sol,%NL%%ORANGE%Upgrade Recipe:}%CONTINUE%');
        lines.push('ItemDisplay[UNI ID EXC WEAPON]: %NAME%{%TAN%Rune + Perf Emerald%NL%Cube w/ Lum, Pul,%NL%%ORANGE%Upgrade Recipe:}%CONTINUE%');
        // Set armor upgrades
        lines.push('ItemDisplay[SET ID NORM ARMOR]: %NAME%{%TAN%Rune + Perf Diamond%NL%Cube w/ Tal, Shael,%NL%%GREEN%Set Upgrade:}%CONTINUE%');
        lines.push('ItemDisplay[SET ID EXC ARMOR]: %NAME%{%TAN%Rune + Perf Diamond%NL%Cube w/ Ko, Lem,%NL%%GREEN%Set Upgrade:}%CONTINUE%');
        lines.push('ItemDisplay[SET ID NORM WEAPON]: %NAME%{%TAN%Rune + Perf Emerald%NL%Cube w/ Ral, Sol,%NL%%GREEN%Set Upgrade:}%CONTINUE%');
        lines.push('ItemDisplay[SET ID EXC WEAPON]: %NAME%{%TAN%Rune + Perf Emerald%NL%Cube w/ Lum, Pul,%NL%%GREEN%Set Upgrade:}%CONTINUE%');
        // Rare/Craft armor upgrades
        lines.push('ItemDisplay[RARE ID NORM (ARMOR OR QUIVER)]: %NAME%{%TAN%Rune + Perf Amethyst%NL%Cube w/ Ral, Thul,%NL%%YELLOW%Rare Upgrade:}%CONTINUE%');
        lines.push('ItemDisplay[RARE ID EXC (ARMOR OR QUIVER)]: %NAME%{%TAN%Rune + Perf Amethyst%NL%Cube w/ Ko, Pul,%NL%%YELLOW%Rare Upgrade:}%CONTINUE%');
        lines.push('ItemDisplay[RARE ID NORM WEAPON]: %NAME%{%TAN%Rune + Perf Sapphire%NL%Cube w/ Ort, Amn,%NL%%YELLOW%Rare Upgrade:}%CONTINUE%');
        lines.push('ItemDisplay[RARE ID EXC WEAPON]: %NAME%{%TAN%Rune + Perf Sapphire%NL%Cube w/ Fal, Um,%NL%%YELLOW%Rare Upgrade:}%CONTINUE%');
        lines.push('ItemDisplay[CRAFT ID NORM (ARMOR OR QUIVER)]: %NAME%{%TAN%Rune + Perf Amethyst%NL%Cube w/ Ral, Thul,%NL%%ORANGE%Craft Upgrade:}%CONTINUE%');
        lines.push('ItemDisplay[CRAFT ID EXC (ARMOR OR QUIVER)]: %NAME%{%TAN%Rune + Perf Amethyst%NL%Cube w/ Ko, Pul,%NL%%ORANGE%Craft Upgrade:}%CONTINUE%');
        lines.push('ItemDisplay[CRAFT ID NORM WEAPON]: %NAME%{%TAN%Rune + Perf Sapphire%NL%Cube w/ Ort, Amn,%NL%%ORANGE%Craft Upgrade:}%CONTINUE%');
        lines.push('ItemDisplay[CRAFT ID EXC WEAPON]: %NAME%{%TAN%Rune + Perf Sapphire%NL%Cube w/ Fal, Um,%NL%%ORANGE%Craft Upgrade:}%CONTINUE%');
        lines.push('');
      }

      // ==========================
      // 15f. IMBUE / SLAM SUGGESTIONS (from Wolfie/HiimFilter)
      // ==========================
      if (wantImbue) {
        lines.push('// ============================================================');
        lines.push('// IMBUE & SLAM SUGGESTIONS');
        lines.push('// ============================================================');
        lines.push('// Eth elite bases worth imbuing at Charsi');
        lines.push('ItemDisplay[NMAG ETH !RW SOCK=0 ELT (WEAPON OR CIRC)]: %NAME%{%GOLD%Imbue %WHITE%at Charsi for %YELLOW%Rare item%CL%%NAME%}%CONTINUE%');
        lines.push('// Diadem always worth imbuing');
        lines.push('ItemDisplay[ci3 NMAG !ETH SOCK=0]: %NAME%{%TAN%Imbue at Charsi for %YELLOW%Rare Diadem}');
        lines.push('// Non-eth bases can be slammed');
        lines.push('ItemDisplay[NMAG !ETH !RW SOCK=0 ELT (WEAPON OR ARMOR)]: %NAME%{%RED%Slam %WHITE%for chance of %YELLOW%Rare item%CL%%NAME%}%CONTINUE%');
        lines.push('');
      }

      // ==========================
      // 16. NORMAL & MAGIC ITEM HIDING (FILTLVL-gated)
      // ==========================
      lines.push('// ============================================================');
      lines.push('// NORMAL & MAGIC ITEM HIDING');
      lines.push('// ============================================================');
      if (isStrict) {
        lines.push('// Endgame: aggressively hide normal/magic, FILTLVL gates for fine-tuning');
        lines.push('// FILTLVL>1: hide normal tier');
        lines.push('ItemDisplay[NMAG !SUP !ETH NORM]:');
        lines.push('ItemDisplay[NMAG !SUP !ETH EXC]:');
        lines.push('ItemDisplay[NMAG !ETH !RW ELT SOCK=0]:');
        lines.push('// FILTLVL>2: hide magic tier');
        lines.push('ItemDisplay[MAG NORM]:');
        lines.push('ItemDisplay[MAG EXC]:');
        lines.push('ItemDisplay[MAG ELT FILTLVL>2]:');
        lines.push('// FILTLVL>3: hide remaining non-elite magic');
        lines.push('ItemDisplay[MAG !JEWELRY !CHARM FILTLVL>3]:');
      } else if (isMid) {
        lines.push('// Experienced: moderate hiding with FILTLVL gates');
        lines.push('ItemDisplay[NMAG !SUP !ETH NORM CLVL>20]:');
        lines.push('ItemDisplay[NMAG !SUP !ETH EXC CLVL>50]:');
        lines.push('ItemDisplay[NMAG !ETH !RW ELT SOCK=0 FILTLVL>2]:');
        lines.push('ItemDisplay[MAG NORM CLVL>30]:');
        lines.push('ItemDisplay[MAG EXC FILTLVL>2]:');
      } else if (isCasual) {
        lines.push('// Casual: light hiding only at higher levels');
        lines.push('ItemDisplay[NMAG !SUP !ETH NORM CLVL>40]:');
        lines.push('ItemDisplay[NMAG !SUP !ETH EXC CLVL>70 FILTLVL>2]:');
        lines.push('ItemDisplay[MAG NORM CLVL>50]:');
      }
      // New players: no hiding
      lines.push('');

      // ==========================
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
      ['r01','El'],['r02','Eld'],['r03','Tir'],['r04','Nef'],['r05','Eth'],['r06','Ith'],['r07','Tal'],['r08','Ral'],['r09','Ort'],['r10','Thul'],
      ['r11','Amn'],['r12','Sol'],['r13','Shael'],['r14','Dol'],['r15','Hel'],['r16','Io'],['r17','Lum'],['r18','Ko'],['r19','Fal'],['r20','Lem'],
      ['r21','Pul'],['r22','Um'],['r23','Mal'],['r24','Ist'],['r25','Gul'],['r26','Vex'],['r27','Ohm'],['r28','Lo'],['r29','Sur'],['r30','Ber'],
      ['r31','Jah'],['r32','Cham'],['r33','Zod']
    ],
    pd2: [
      ['wss','Worldstone Shard'],['lbox','Larzuks Puzzlebox'],['lpp','Larzuks Puzzlepiece'],['rkey','Skeleton Key'],
      ['tes','Twisted Essence of Suffering'],['ceh','Charged Essense of Hatred'],['bet','Burning Essence of Terror'],['fed','Festering Essence of Destruction'],
      ['toa','Token of Absolution'],['pk1','Key of Terror'],['pk2','Key of Hate'],['pk3','Key of Destruction'],
      ['mbr','Mephistos Brain'],['dhn','Diablos Horn'],['bey','Baals Eye'],['std','Standard of Heroes'],
      ['dcho','Dclone Heart'],['dcso','Dclone Soul'],['dcbl','Dclone Blood'],['dcma','Dclone Matter'],
      ['rtmo','Rathma Material 1'],['rtmv','Rathma Material 2'],['cwss','Corrupted WSS'],['rid','Rathma ID'],['rtp','Rathma TP'],
      ['jewf','Jewel Fragment'],['crfb','Blood Craft Infusion'],['crfc','Caster Craft Infusion'],['crfs','Safety Craft Infusion'],
      ['crfh','Hitpower Craft Infusion'],['crfv','Vampiric Craft Infusion'],['crfu','Bountiful Craft Infusion'],['crfp','Brilliant Craft Infusion'],
      ['scou','Map Scout'],['scrb','Map Scroll B'],['iwss','Imbued WSS'],['upmp','Map Upgrade'],['fort','Fortify Orb'],
      ['rera','Reroll Area Orb'],['imra','Imbue Rare Orb'],['upma','Upgrade Map Orb'],['imma','Imbue Magic Orb']
    ],
    norm: [
      ['cap','Cap'],['skp','Skull Cap'],['hlm','Helm'],['fhl','Full Helm'],['ghm','Great Helm'],['crn','Crown'],['msk','Mask'],['buc','Buckler'],['sml','Small Shield'],['lrg','Large Shield'],['kit','Kite Shield'],['tow','Tower Shield'],['gts','Gothic Shield'],
      ['qui','Quilted Armor'],['lea','Leather Armor'],['hla','Hard Leather'],['stu','Studded Leather'],['rng','Ring Mail'],['scl','Scale Mail'],['chn','Chain Mail'],['brs','Breast Plate'],['spl','Splint Mail'],['plt','Plate Mail'],['fld','Field Plate'],['gth','Gothic Plate'],['ful','Full Plate Mail'],['aar','Ancient Armor'],['ltp','Light Plate'],
      ['lgl','Leather Gloves'],['vgl','Heavy Gloves'],['mgl','Chain Gloves'],['tgl','Light Gauntlets'],['hgl','Gauntlets'],
      ['lbt','Boots'],['vbt','Heavy Boots'],['mbt','Chain Boots'],['tbt','Light Plated Boots'],['hbt','Greaves'],
      ['lbl','Sash'],['vbl','Light Belt'],['mbl','Belt'],['tbl','Heavy Belt'],['hbl','Plated Belt'],
      ['hax','Hand Axe'],['axe','Axe'],['2ax','Double Axe'],['mpi','Military Pick'],['wax','War Axe'],['lax','Large Axe'],['bax','Broad Axe'],['btx','Battle Axe'],['gax','Great Axe'],['gix','Giant Axe'],
      ['clb','Club'],['spc','Spiked Club'],['mac','Mace'],['mst','Morning Star'],['fla','Flail'],['whm','War Hammer'],['mau','Maul'],['gma','Great Maul'],
      ['ssd','Short Sword'],['scm','Scimitar'],['sbr','Sabre'],['flc','Falchion'],['crs','Crystal Sword'],['bsd','Broad Sword'],['lsd','Long Sword'],['wsd','War Sword'],['2hs','Two-Handed Sword'],['clm','Claymore'],['gis','Giant Sword'],['bsw','Bastard Sword'],['flb','Flamberge'],['gsd','Great Sword'],
      ['dgr','Dagger'],['dir','Dirk'],['kri','Kris'],['bld','Blade'],
      ['spr','Spear'],['tri','Trident'],['brn','Brandistock'],['spt','Spetum'],['pik','Pike'],
      ['bar','Bardiche'],['vou','Voulge'],['scy','Scythe'],['pax','Poleaxe'],['hal','Halberd'],['wsc','War Scythe'],
      ['sst','Short Staff'],['lst','Long Staff'],['cst','Gnarled Staff'],['bst','Battle Staff'],['wst','War Staff'],
      ['wnd','Wand'],['ywn','Yew Wand'],['bwn','Bone Wand'],['gwn','Grim Wand'],
      ['scp','Scepter'],['gsc','Grand Scepter'],['wsp','War Scepter'],
      ['sbw','Short Bow'],['hbw','Hunters Bow'],['lbw','Long Bow'],['cbw','Composite Bow'],['sbb','Short Battle Bow'],['lbb','Long Battle Bow'],['swb','Short War Bow'],['lwb','Long War Bow'],
      ['lxb','Light Crossbow'],['mxb','Crossbow'],['hxb','Heavy Crossbow'],['rxb','Repeating Crossbow'],
      ['key','Key'],['tsc','TP Scroll'],['isc','ID Scroll'],['tbk','TP Tome'],['ibk','ID Tome'],
      ['rin','Ring'],['amu','Amulet'],['jew','Jewel'],
      ['cm1','Small Charm'],['cm2','Large Charm'],['cm3','Grand Charm'],
      ['aqv','Arrow Quiver'],['cqv','Bolt Quiver']
    ],
    exc: [
      ['xap','War Hat'],['xkp','Sallet'],['xlm','Casque'],['xhl','Winged Helm'],['xhm','Grand Crown'],['xrn','Death Mask'],['xsk','Grim Helm'],
      ['xui','Ghost Armor'],['xea','Serpentskin'],['xla','Demonhide'],['xtu','Trellised Armor'],['xng','Linked Mail'],['xmg','Tigulated Mail'],['xcl','Mesh Armor'],['xhn','Cuirass'],['xrs','Russet Armor'],['xpl','Templar Coat'],['xlt','Sharktooth'],['xld','Embossed Plate'],['xth','Chaos Armor'],['xul','Ornate Plate'],['xar','Mage Plate'],['xtp','Archon Plate'],
      ['xuc','Defender'],['xml','Round Shield'],['xrg','Scutum'],['xts','Dragon Shield'],['xsh','Pavise'],['xow','Ancient Shield'],
      ['xlg','Demonhide Gloves'],['xvg','Sharkskin Gloves'],['xmb','Heavy Bracers'],['xtg','Battle Gauntlets'],['xhg','War Gauntlets'],
      ['xlb','Demonhide Boots'],['xvb','Sharkskin Boots'],['xmb','Mesh Boots'],['xtb','Battle Boots'],['xhb','War Boots'],
      ['zlb','Demonhide Sash'],['zvb','Sharkskin Belt'],['zmb','Mesh Belt'],['ztb','Battle Belt'],['zhb','War Belt'],
      ['ci0','Circlet'],['ci1','Coronet'],['ci2','Tiara'],['ci3','Diadem']
    ],
    elt: [
      ['uap','Shako/War Hat'],['ukp','Hydraskull'],['ulm','Armet'],['uhl','Spired Helm'],['uhm','Giant Conch'],['urn','Demonhead'],['usk','Bone Visage'],['uh9','Corona'],
      ['uui','Dusk Shroud'],['uea','Scarab Husk'],['ula','Wire Fleece'],['utu','Wyrmhide'],['ung','Diamond Mail'],['umg','Loricated Mail'],['ucl','Boneweave'],['uhn','Great Hauberk'],['urs','Balrog Skin'],['upl','Hellforge Plate'],['ult','Kraken Shell'],['uld','Shadow Plate'],['uth','Sacred Armor'],['uul','Lacquered Plate'],['uar','Archon Plate'],['utp','Elite Archon Plate'],
      ['uit','Monarch'],['uow','Aegis'],['uts','Ward'],['ush','Troll Nest'],
      ['ulg','Bramble Mitts'],['uvg','Vampirebone Gloves'],['umg','Vambraces'],['utg','Crusader Gauntlets'],['uhg','Ogre Gauntlets'],
      ['ulb','Wyrmhide Boots'],['uvb','Scarabshell Boots'],['umb','Boneweave Boots'],['utb','Mirrored Boots'],['uhb','Myrmidon Greaves'],
      ['ulc','Spiderweb Sash'],['uvc','Vampirefang Belt'],['umc','Mithril Coil'],['utc','Troll Belt'],['uhc','Colossus Girdle'],
      ['7wa','Berserker Axe'],['72a','Ettin Axe'],['7bt','Champion Axe'],['7ga','Decapitator'],['7gi','Feral Axe'],['7la','Cryptic Axe'],
      ['7wh','Legendary Mallet'],['7m7','Ogre Maul'],['7gm','Thunder Maul'],
      ['7cr','Phase Blade'],['7fb','Colossus Sword'],['7gd','Colossus Blade'],['7ls','Balrog Blade'],
      ['7s7','Thresher'],['7pa','Giant Thresher'],['7s8','Colossus Voulge'],['7p7','War Pike'],
      ['6ws','Archon Staff'],['6ls','Elder Staff'],['6cs','Shillelagh'],['6bs','Stalagmite'],
      ['7ws','Caduceus'],['7qs','Divine Scepter'],
      ['6lw','Hydra Bow'],['6sw','Ward Bow'],['6mx','Pellet Bow'],['6rx','Gorgon Crossbow'],
      ['7xf','Feral Claws'],['7ar','Scissors Suwayyah'],['7qr','Suwayyah'],
      ['aqv3','Elite Arrow Quiver'],['cqv3','Elite Bolt Quiver']
    ],
    uni: [
      ['uap','Harlequin Crest (Shako)'],['ci3','Griffons Eye'],['ci2','Kiras Guardian'],['uhm','Andariel\'s Visage'],['urn','Crown of Ages'],['usk','Giant Skull'],['uh9','Nightwings Veil'],
      ['uar','Enigma base / Tyrael\'s Might'],['uui','Skin of the Vipermagi'],['uth','Sacred Armor (Templar/Tyrael)'],['xlt','Skullder\'s Ire'],
      ['uit','Stormshield'],['uow','Aegis (Herald of Zakarum)'],
      ['utg','Dracul\'s Grasp'],['uhg','Steelrend'],['uvg','Magefist base'],
      ['xtb','War Traveler'],['xhb','Gore Rider'],['uhb','Shadow Dancer'],['uvb','Sandstorm Trek'],
      ['ulc','Arachnid Mesh'],['umc','Verdungo\'s'],['zhb','Thundergod\'s Vigor'],
      ['rin','Unique Rings (SoJ, BK, Raven, etc.)'],['amu','Unique Amulets (Mara\'s, Highlord\'s, etc.)'],['jew','Rainbow Facet'],
      ['cm1','Annihilus'],['cm2','Hellfire Torch'],['cm3','Gheeds Fortune'],
      ['7gw','Death\'s Web'],['obf','Death\'s Fathom'],['oba','The Oculus'],['7wa','Beast base / Grief base'],
      ['6lw','Windforce'],['7cr','Lightsabre'],['7ws','Astreons Iron Ward'],
      ['ama','Titan\'s Revenge'],['amf','Thunderstroke'],
      ['rar','Cage of the Unsullied'],['rbe','Band of Skulls'],['ram','The Third Eye']
    ],
    set: [
      ['rin','Set Rings (BK, Angelic, etc.)'],['amu','Set Amulets (Tal\'s, etc.)'],
      ['xhm','Tal Rasha\'s Horadric Crest'],['xul','Tal Rasha\'s Guardianship'],['uth','Immortal King\'s Soul Cage'],['paf','Herald of Zakarum base'],
      ['xtb','Aldur\'s Advance'],['ulg','Laying of Hands'],['7ws','Griswold\'s Honor'],
      ['xvg','Trang-Oul\'s Claws'],['ne9','Trang-Oul\'s Wing'],['utc','Trang-Oul\'s Girth'],
      ['urn','Crown of Ages base (IK Helm)'],['xap','Guillaume\'s Face'],['uhm','IK Helm'],
      ['uar','Natalya\'s Shadow'],['uts','Natalya\'s Mark'],
      ['lbt','Aldur\'s Advance / Natalya\'s Soul']
    ],
    misc: [
      ['hp1','Minor Healing'],['hp2','Light Healing'],['hp3','Healing'],['hp4','Greater Healing'],['hp5','Super Healing'],
      ['mp1','Minor Mana'],['mp2','Light Mana'],['mp3','Mana'],['mp4','Greater Mana'],['mp5','Super Mana'],
      ['rvs','Rejuv (35%)'],['rvl','Full Rejuv (65%)'],['yps','Antidote'],['wms','Thawing'],['vps','Stamina'],['pvpp','PvP Mana'],
      ['gcv','Chipped Amethyst'],['gfv','Flawed Amethyst'],['gsv','Amethyst'],['gzv','Flawless Amethyst'],['gpv','Perfect Amethyst'],
      ['gcw','Chipped Diamond'],['gfw','Flawed Diamond'],['gsw','Diamond'],['glw','Flawless Diamond'],['gpw','Perfect Diamond'],
      ['gcg','Chipped Emerald'],['gfg','Flawed Emerald'],['gsg','Emerald'],['glg','Flawless Emerald'],['gpg','Perfect Emerald'],
      ['gcr','Chipped Ruby'],['gfr','Flawed Ruby'],['gsr','Ruby'],['glr','Flawless Ruby'],['gpr','Perfect Ruby'],
      ['gcb','Chipped Sapphire'],['gfb','Flawed Sapphire'],['gsb','Sapphire'],['glb','Flawless Sapphire'],['gpb','Perfect Sapphire'],
      ['gcy','Chipped Topaz'],['gfy','Flawed Topaz'],['gsy','Topaz'],['gly','Flawless Topaz'],['gpy','Perfect Topaz'],
      ['skc','Chipped Skull'],['skf','Flawed Skull'],['sku','Skull'],['skl','Flawless Skull'],['skz','Perfect Skull'],
      ['ear','Ear'],['leg','Wirt\'s Leg'],['ass','Book of Skill'],['toa','Token of Absolution']
    ]
  };

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
      {name:"Erazure-BIG-GG-PoE.filter",url:"https://raw.githubusercontent.com/FiltersBy-Erazure/PD2-Loot-Filter/main/Erazure-BIG-GG-PoE.filter",size:775381},
      {name:"Erazure-BIG-GG.filter",url:"https://raw.githubusercontent.com/FiltersBy-Erazure/PD2-Loot-Filter/main/Erazure-BIG-GG.filter",size:774777},
      {name:"Erazure-Main-PoE.filter",url:"https://raw.githubusercontent.com/FiltersBy-Erazure/PD2-Loot-Filter/main/Erazure-Main-PoE.filter",size:770903},
      {name:"Erazure-Main.filter",url:"https://raw.githubusercontent.com/FiltersBy-Erazure/PD2-Loot-Filter/main/Erazure-Main.filter",size:770819}
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
      {name:"Hiim_Vanilla_Plus.filter",displayName:"Vanilla Plus",description:"All-in-one filter without item re-naming.",url:"https://raw.githubusercontent.com/Maaaaaarrk/HiimFilter-PD2-Filter/main/Hiim_Vanilla_Plus.filter",size:609129}
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

    function downloadFilterFile(file, author) {
      showStep(3);
      loadingMsg.textContent = 'Downloading ' + file.name + '...';

      // file.url is a direct raw.githubusercontent.com link — returns plain text
      fetch(file.url)
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.text();
        })
        .then(function (text) {
          if (codeEditor.value.trim() && !confirm('Load "' + file.name + '" from ' + author.author + '? This will replace your current filter.')) {
            showStep(2);
            return;
          }
          codeEditor.value = text;
          updateLineNumbers();
          saveToStorage();
          hideModal();
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
    loadFromStorage();
    updateLineNumbers();

    initChips();
    initPanelToggles();
    initValueConditions();
    initTextInputs();
    initImportExport();
    initTemplates();
    initTabs();
    initPreview();
    initBuilderActions();
    initWizard();
    initItemCodeFinder();
    initAuthorImport();

    // Code editor events
    codeEditor.addEventListener('input', function () {
      updateLineNumbers();
      saveToStorage();
    });
    codeEditor.addEventListener('scroll', syncScroll);
    codeEditor.addEventListener('keydown', handleTab);

    // Initial rule generation
    updateGeneratedRule();
  }

  init();
})();
