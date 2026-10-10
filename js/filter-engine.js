/* ============================================
   Filter Forge — Filter Engine
   Evaluates a PD2 loot filter for a sample item at a given filter level and
   returns the on-ground label. Ported from HiimFilter's README renderer
   (builderreadme/filterrender/engine.py) so both draw the same labels.

   Model: rules match top to bottom, %CONTINUE% chains them (%NAME% is the
   label built so far), the first match without %CONTINUE% ends the chain and
   an empty label hides the item. Conditions or stats an item doesn't define
   are 0 / false. Tooltips ({...}) are not drawn.
   ============================================ */

(function () {
  'use strict';

  // PD2 text colors (approximate in-game RGB).
  var COLORS = {
    WHITE: '#e8e8e8', GRAY: '#7d7d7d', LIGHT_GRAY: '#afafaf', BLUE: '#6e6eff',
    YELLOW: '#ffff64', GOLD: '#c7b377', GREEN: '#00fc00', DARK_GREEN: '#008040',
    ORANGE: '#ffa800', RED: '#ff4d4d', TAN: '#a59169', BLACK: '#282828',
    PURPLE: '#ae00ff', CORAL: '#ff8080', SAGE: '#9bcd8c', TEAL: '#00d2d2'
  };
  var QUALITY_ORDER = ['NMAG', 'MAG', 'RARE', 'SET', 'UNI', 'CRAFT'];
  var QUALITY_COLOR = { NMAG: 'WHITE', MAG: 'BLUE', RARE: 'YELLOW', SET: 'GREEN', UNI: 'GOLD', CRAFT: 'ORANGE' };
  // ÿc<x> color escapes used by some filters (and baked into some item names).
  var ESCAPE_COLORS = {
    '0': 'WHITE', '1': 'RED', '2': 'GREEN', '3': 'BLUE', '4': 'GOLD', '5': 'GRAY',
    '6': 'BLACK', '7': 'TAN', '8': 'ORANGE', '9': 'YELLOW', ':': 'DARK_GREEN',
    ';': 'PURPLE', '.': 'TEAL', ',': 'SAGE', '-': 'CORAL', '/': 'LIGHT_GRAY', '<': 'LIGHT_GRAY'
  };
  // Items whose in-game name carries its own color.
  var NAME_COLORS = { wss: 'RED', lbox: 'GOLD', lpp: 'GOLD', rkey: 'GOLD' };

  // Friendly condition names <-> D2 item stat ids (both spellings appear in filters).
  var STAT_IDS = {
    STR: 0, ENE: 1, DEX: 2, VIT: 3, LIFE: 7, MANA: 9, EDEF: 16, EDAM: 18, AR: 19,
    MINDMG: 21, MAXDMG: 22, FRES: 39, LRES: 41, CRES: 43, PRES: 45, LL: 60, ML: 62,
    GFIND: 79, MFIND: 80, IAS: 93, FRW: 96, FHR: 99, FCR: 105, SOCK: 194
  };
  // Fields only some item kinds have: a comparison on an item without one never matches.
  var TYPE_FIELDS = { GOLD: 1, MAPTIER: 1, MAPID_ITEM: 1, GEM: 1, GEMTYPE: 1, RUNE: 1 };
  var VALUE_TOKENS = {
    QTY: 1, ILVL: 1, ALVL: 1, EDAM: 1, EDEF: 1, RES: 1, DEF: 1, LIFE: 1, MANA: 1, SOCK: 1,
    LVLREQ: 1, CRAFTALVL: 1, REROLLALVL: 1, PLR: 1, REPLIFE: 1, WPNSPD: 1, UPLVL: 1, UPSTR: 1,
    UPDEX: 1, FCR: 1, IAS: 1, FHR: 1, FRW: 1, STR: 1, DEX: 1, MINDMG: 1, MAXDMG: 1, ED: 1,
    PRICE: 1, SELLPRICE: 1, SOCKETS: 1, RANGE: 1, MFIND: 1, GFIND: 1, RUNE: 1,
    MAXSOCKETS: 1, MAPTIER: 1, GEMLEVEL: 1, WIDTH: 1, HEIGHT: 1, AREA: 1, MAXRES: 1, ALLATTRIB: 1,
    BASEBLOCK: 1, REQLVL: 1, REQSTR: 1, REQDEX: 1, BASEMINONEH: 1, BASEMAXONEH: 1, BASEMINTWOH: 1,
    BASEMAXTWOH: 1, BASEMINSMITE: 1, BASEMAXSMITE: 1, BASEMINTHROW: 1, BASEMAXTHROW: 1,
    BASEMINKICK: 1, BASEMAXKICK: 1, QLVL: 1, GOLD: 1
  };
  var GEM_TYPES = ['', 'Amethyst', 'Diamond', 'Emerald', 'Ruby', 'Sapphire', 'Topaz', 'Skull'];
  // QTY is only set on stackable samples (runes, gem / skull stacks); other items have none.
  var DEFAULTS = { CLVL: 86, DIFF: 2, MAPID: 2, ILVL: 85, ALVL: 85, LVLREQ: 60, CHARSTAT12: 90 };

  var TOKEN_RE = /%([A-Za-z0-9_]+)(?:-([0-9A-Fa-f]+))?%/g;
  // Alias names may start with a digit (4_STAR_UNIQUE) but must contain a letter.
  var WORD_RE = /(^|[^A-Za-z0-9_])([A-Za-z0-9_]*[A-Za-z_][A-Za-z0-9_]*)(?![A-Za-z0-9_])/g;
  var CMP_RE = /^(.+?)(<=|>=|<|>|=|~)(.+)$/;
  var NUM_RE = /^-?\d+(\.\d+)?$/;

  // ---- loading ---------------------------------------------------------------------

  // Decode a downloaded filter: UTF-8, or Windows-1252 for ANSI filters with ÿc codes.
  function decode(buf) {
    var text = new TextDecoder('utf-8').decode(buf);
    if (text.indexOf('�') !== -1) text = new TextDecoder('windows-1252').decode(buf);
    return text;
  }

  // Level names: ItemDisplayFilterName[]: (sequential) or ItemDisplayFilterName[N]: (indexed).
  function levelNames(lines) {
    var names = {};
    var seq = 1;
    for (var i = 0; i < lines.length; i++) {
      var m = lines[i].match(/^ItemDisplayFilterName\s*\[\s*(\d*)\s*\]\s*:\s*(.+)/);
      if (!m) continue;
      var raw = m[2].replace(/ÿc./g, '').trim();
      if (m[1]) names[parseInt(m[1], 10)] = raw;
      else names[seq++] = raw;
    }
    return names;
  }

  function Filter(text) {
    // The game reads each row with everything from // stripped, then trimmed.
    var raw = text.split(/\r?\n/);
    var lines = raw.map(function (l) { return l.split('//')[0].trim(); });
    this.aliases = {};
    this.rules = []; // [condition, output, 1-based line number, raw line]
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var am = line.match(/^Alias\[([^\]]+)\]:\s?(.*)$/);
      if (am) {
        if (!(am[1] in this.aliases)) this.aliases[am[1]] = am[2];
        continue;
      }
      if (line.indexOf('ItemDisplay[') === 0) {
        var end = line.indexOf(']:');
        if (end > 0) this.rules.push([line.substring(12, end), line.substring(end + 2), i + 1, raw[i].trim()]);
      }
    }
    this.levels = levelNames(lines);
    this._cond = {};
    this._out = {};
  }

  Filter.prototype.expandCond = function (text, depth) {
    var self = this;
    depth = depth || 0;
    if (depth > 12) return text;
    return text.replace(WORD_RE, function (all, pre, name) {
      if (!Object.prototype.hasOwnProperty.call(self.aliases, name)) return all;
      var val = self.expandCond(self.aliases[name].trim(), depth + 1);
      return pre + (NUM_RE.test(val) || val.charAt(0) === '(' ? val : '(' + val + ')');
    });
  };

  Filter.prototype.expandOut = function (text, depth) {
    var self = this;
    depth = depth || 0;
    if (depth > 12) return text;
    return text.replace(TOKEN_RE, function (all, name, arg) {
      if (arg === undefined && Object.prototype.hasOwnProperty.call(self.aliases, name)) {
        return self.expandOut(self.aliases[name], depth + 1);
      }
      return all;
    });
  };

  Filter.prototype.cond = function (raw) {
    if (!(raw in this._cond)) this._cond[raw] = parseCond(this.expandCond(raw));
    return this._cond[raw];
  };

  Filter.prototype.out = function (raw) {
    if (!(raw in this._out)) this._out[raw] = this.expandOut(raw);
    return this._out[raw];
  };

  // Returns {lines: [[{text, color}]], shown}, lines top to bottom as drawn in game.
  // Lines are built in string order; the game draws them bottom-up (each new line pushes
  // the earlier text up), so the result is reversed at the end. trace, if an array, gets
  // {lineNum, raw, continued} for every rule that matched, in order.
  Filter.prototype.label = function (item, filtlvl, trace) {
    var ctx = new Context(item, filtlvl);
    var base = COLORS[itemColor(item)];
    // runewords: the base name sits under the runeword name
    var name = item.baseLine ? [[{ text: item.baseLine, color: base }], [{ text: item.name, color: base }]]
      : [[{ text: item.name, color: base }]];
    var matched = false;
    for (var i = 0; i < this.rules.length; i++) {
      var rule = this.rules[i];
      if (!ctx.evaluate(this.cond(rule[0]))) continue;
      matched = true;
      var labelText = stripTooltip(this.out(rule[1]));
      var cont = labelText.indexOf('%CONTINUE%') !== -1;
      if (trace) trace.push({ lineNum: rule[2], raw: rule[3], continued: cont });
      name = renderLabel(labelText, name, ctx, item);
      if (!cont) break;
    }
    name = trimLabel(resolveConditionals(name));
    return { lines: name.slice().reverse(), shown: !matched || name.length > 0 };
  };

  // %CL% / %CS% markers ride along the %CONTINUE% chain (a later rule can fill the text
  // around them) and are resolved on the finished label: %CL% becomes a line break only with
  // visible text on both sides of it on its line (never a blank line or two breaks in a
  // row); %CS% becomes a space only between two visible characters.
  var CL = '\u0001';
  var CS = '\u0002';

  function visible(segs) {
    return segs.filter(function (s) { return s.text !== CL && s.text !== CS; })
      .map(function (s) { return s.text; }).join('');
  }

  function resolveConditionals(lines) {
    var out = [];
    lines.forEach(function (line) {
      var cur = [[]];
      line.forEach(function (seg, k) {
        var rest = visible(line.slice(k + 1));
        var last = cur[cur.length - 1];
        if (seg.text === CL) {
          if (visible(last).trim() && rest.trim()) {
            while (last.length && last[last.length - 1].text === ' ') last.pop(); // %CS% before the break
            cur.push([]);
          }
        } else if (seg.text === CS) {
          var before = visible(last);
          if (before && !/\s$/.test(before) && rest && !/^\s/.test(rest)) last.push({ text: ' ', color: seg.color });
        } else {
          last.push(seg);
        }
      });
      out.push.apply(out, cur);
    });
    return out;
  }

  // The game trim()s the finished label: whitespace (spaces and line breaks) at its very
  // start and end is dropped; spacing inside it stays.
  function trimLabel(lines) {
    var flat = [];
    lines.forEach(function (line) {
      line.forEach(function (seg) { flat.push(seg); });
      flat.push(null); // line break
    });
    var text = flat.map(function (seg) { return seg ? seg.text : '\n'; }).join('');
    var lead = text.length - text.replace(/^\s+/, '').length;
    var keep = text.replace(/\s+$/, '').length;
    var out = [[]];
    var pos = 0;
    flat.forEach(function (seg) {
      var len = seg ? seg.text.length : 1;
      var lo = Math.max(lead - pos, 0);
      var hi = Math.min(keep - pos, len);
      pos += len;
      if (hi <= lo) return;
      if (!seg) out.push([]);
      else out[out.length - 1].push({ text: seg.text.substring(lo, hi), color: seg.color });
    });
    return out.some(function (line) { return line.length; }) ? out : [];
  }

  function itemColor(item) {
    if (item.color) return item.color;
    if (NAME_COLORS[item.code]) return NAME_COLORS[item.code];
    var flags = item.flags || [];
    for (var i = 0; i < QUALITY_ORDER.length; i++) {
      var q = QUALITY_ORDER[i];
      if (flags.indexOf(q) === -1) continue;
      if (q === 'NMAG' && (flags.indexOf('ETH') !== -1 || ((item.num || {}).SOCK || 0) > 0)) return 'GRAY';
      return QUALITY_COLOR[q];
    }
    return 'WHITE';
  }

  // ---- conditions ------------------------------------------------------------------

  function tokenize(cond) {
    var toks = [];
    var i = 0;
    var n = cond.length;
    while (i < n) {
      var c = cond.charAt(i);
      if (/\s/.test(c)) { i++; continue; }
      if (c === '(' || c === ')') { toks.push(c); i++; continue; }
      if (cond.substr(i, 3) === '$f(' || cond.substr(i, 4) === '!$f(') {
        var j = i + (c === '!' ? 4 : 3);
        var depth = 1;
        while (j < n && depth) {
          if (cond.charAt(j) === '(') depth++;
          else if (cond.charAt(j) === ')') depth--;
          j++;
        }
        var k = j;
        while (k < n && !/\s/.test(cond.charAt(k)) && cond.charAt(k) !== '(' && cond.charAt(k) !== ')') k++;
        toks.push(cond.substring(i, k));
        i = k;
        continue;
      }
      var e = i;
      while (e < n && !/\s/.test(cond.charAt(e)) && cond.charAt(e) !== '(' && cond.charAt(e) !== ')') e++;
      // "!(" splits into '!' then '('
      toks.push(cond.substring(i, e));
      i = e;
    }
    return toks;
  }

  function parseCond(text) {
    var toks = tokenize(text);
    var pos = 0;
    function peek() { return pos < toks.length ? toks[pos] : null; }
    // Like BH's shunting-yard parser: AND (also implied between terms) and OR have equal
    // precedence and apply left to right, so "A OR B C" is "(A OR B) AND C"; "!" binds to the
    // next term or parenthesised group.
    function pExpr() {
      var left = pNot();
      while (peek() !== null && peek() !== ')') {
        var op = 'and';
        if (peek() === 'OR') { op = 'or'; pos++; } else if (peek() === 'AND') { pos++; }
        if (peek() === null || peek() === ')') break;
        left = { op: op, terms: [left, pNot()] };
      }
      return left;
    }
    function pNot() {
      if (peek() === '!') { pos++; return { op: 'not', term: pNot() }; }
      return pPrim();
    }
    function pPrim() {
      var t = peek();
      pos++;
      if (t === '(') {
        var v = pExpr();
        if (peek() === ')') pos++;
        return v;
      }
      if (t === null || t === ')') return { op: 'const', value: true };
      return { op: 'atom', atom: t };
    }
    return toks.length ? pExpr() : { op: 'const', value: true };
  }

  function Context(item, filtlvl) {
    this.item = item;
    this.flags = {};
    var flags = (item.flags || []).concat(['GROUND']);
    for (var f = 0; f < flags.length; f++) this.flags[flags[f]] = true;
    var num = { FILTLVL: filtlvl };
    var k;
    for (k in DEFAULTS) num[k] = DEFAULTS[k];
    for (k in item.num || {}) num[k] = item.num[k];
    if (item.rune) num.RUNE = item.rune;
    for (k in STAT_IDS) {
      var key = 'STAT' + STAT_IDS[k];
      if (k in num && !(key in num)) num[key] = num[k];
      else if (key in num && !(k in num)) num[k] = num[key];
    }
    var res = ['FRES', 'CRES', 'LRES', 'PRES'].map(function (r) { return num[r] || 0; });
    if (!('RES' in num) && Math.min.apply(null, res) > 0) num.RES = Math.min.apply(null, res);
    if (!('SOCKETS' in num)) num.SOCKETS = num.SOCK || 0;
    this.num = num;
  }

  Context.prototype.evaluate = function (node) {
    var i;
    switch (node.op) {
      case 'const': return node.value;
      case 'not': return !this.evaluate(node.term);
      case 'and':
        for (i = 0; i < node.terms.length; i++) if (!this.evaluate(node.terms[i])) return false;
        return true;
      case 'or':
        for (i = 0; i < node.terms.length; i++) if (this.evaluate(node.terms[i])) return true;
        return false;
      default: return this.atom(node.atom);
    }
  };

  Context.prototype.value = function (name) {
    if (name in this.num) return this.num[name];
    if (name === 'RUNE') return this.item.rune || 0;
    return 0;
  };

  Context.prototype.atom = function (t) {
    var neg = false;
    while (t.charAt(0) === '!') { neg = !neg; t = t.substring(1); }
    var v = this.atomValue(t);
    return neg ? !v : v;
  };

  Context.prototype.atomValue = function (t) {
    if (t === 'TRUE') return true;
    if (t === 'FALSE') return false;
    if (t.indexOf('$f(') === 0 && t.charAt(t.length - 1) === ')') return this.formula(t.substring(3, t.length - 1)) !== 0;
    var m = t.match(CMP_RE);
    if (m && !/^[0-9a-z]+$/.test(t)) {
      var lhs = m[1];
      var op = m[2];
      var rhs = m[3];
      if (TYPE_FIELDS[lhs] && !(lhs in this.num)) return false;
      var left;
      if (lhs.indexOf('$f(') === 0) {
        left = this.formula(lhs.substring(3, lhs.lastIndexOf(')')));
      } else if (lhs.indexOf(',') !== -1) {
        left = 0; // MULTIa,b: not modelled
      } else {
        var self = this;
        left = lhs.split('+').reduce(function (sum, p) {
          return sum + (/^-?\d+$/.test(p) ? parseInt(p, 10) : self.value(p));
        }, 0);
      }
      if (op === '~') {
        var parts = rhs.split('-');
        return toNum(parts[0]) <= left && left <= toNum(parts.slice(1).join('-'));
      }
      var right = NUM_RE.test(rhs) ? parseFloat(rhs) : this.formula(rhs);
      switch (op) {
        case '<': return left < right;
        case '>': return left > right;
        case '=': return left === right;
        case '<=': return left <= right;
        case '>=': return left >= right;
      }
    }
    if (/^[0-9a-z]{2,6}$/.test(t) && /[a-z]/.test(t)) return this.item.code === t;
    if (t === 'RUNE') return !!this.item.rune;
    return !!this.flags[t];
  };

  // $f(...) formulas: arithmetic, comparisons and a few functions over item fields.
  Context.prototype.formula = function (text) {
    try {
      var v = evalFormula(text, this);
      return typeof v === 'number' && isFinite(v) ? v : 0;
    } catch (e) {
      return 0;
    }
  };

  function toNum(s) {
    var v = parseFloat(s);
    return isNaN(v) ? 0 : v;
  }

  var FUNCS = {
    ROUND: function (x) { return Math.round(x); },
    MAX: function () { return Math.max.apply(null, arguments); },
    MIN: function () { return Math.min.apply(null, arguments); },
    ABS: function (x) { return Math.abs(x); },
    IF: function (c, a, b) { return c ? a : (b === undefined ? 0 : b); },
    OR: function () { return Array.prototype.some.call(arguments, Boolean) ? 1 : 0; },
    AND: function () { return Array.prototype.every.call(arguments, Boolean) ? 1 : 0; },
    FLOOR: function (x) { return Math.floor(x); },
    CEIL: function (x) { return Math.ceil(x); },
    NOT: function (x) { return x ? 0 : 1; }
  };

  function evalFormula(text, ctx) {
    var toks = text.match(/<=|>=|<>|!=|==|[<>=+\-*\/(),!]|[A-Za-z0-9_.]+/g) || [];
    var pos = 0;
    function peek() { return toks[pos]; }
    function next() { return toks[pos++]; }
    function cmp() {
      var left = add();
      while (/^(<=|>=|<>|!=|==|=|<|>)$/.test(peek() || '')) {
        var op = next();
        var right = add();
        if (op === '<') left = left < right ? 1 : 0;
        else if (op === '>') left = left > right ? 1 : 0;
        else if (op === '<=') left = left <= right ? 1 : 0;
        else if (op === '>=') left = left >= right ? 1 : 0;
        else if (op === '<>' || op === '!=') left = left !== right ? 1 : 0;
        else left = left === right ? 1 : 0;
      }
      return left;
    }
    function add() {
      var v = mul();
      while (peek() === '+' || peek() === '-') v = next() === '+' ? v + mul() : v - mul();
      return v;
    }
    function mul() {
      var v = unary();
      while (peek() === '*' || peek() === '/') {
        var op = next();
        var r = unary();
        if (op === '/') {
          if (r === 0) throw new Error('division by zero');
          v /= r;
        } else {
          v *= r;
        }
      }
      return v;
    }
    function unary() {
      if (peek() === '-') { next(); return -unary(); }
      if (peek() === '+') { next(); return unary(); }
      if (peek() === '!') { next(); return unary() ? 0 : 1; }
      return primary();
    }
    function primary() {
      var t = next();
      if (t === undefined) throw new Error('unexpected end');
      if (t === '(') {
        var v = cmp();
        if (next() !== ')') throw new Error('expected )');
        return v;
      }
      if (/^\d+(\.\d+)?$/.test(t)) return parseFloat(t);
      if (FUNCS[t] && peek() === '(') {
        next();
        var args = [];
        if (peek() !== ')') {
          args.push(cmp());
          while (peek() === ',') { next(); args.push(cmp()); }
        }
        if (next() !== ')') throw new Error('expected )');
        return Number(FUNCS[t].apply(null, args));
      }
      if (t === 'TRUE') return 1;
      if (t === 'FALSE') return 0;
      if (/^[A-Za-z0-9_]+$/.test(t)) return Number(ctx.value(t)) || 0;
      throw new Error('bad token ' + t);
    }
    var result = cmp();
    if (pos < toks.length) throw new Error('trailing tokens');
    return result;
  }

  // ---- output ----------------------------------------------------------------------

  function stripTooltip(text) {
    var out = '';
    var depth = 0;
    for (var i = 0; i < text.length; i++) {
      var ch = text.charAt(i);
      if (ch === '{') { depth++; continue; }
      if (ch === '}') { depth = Math.max(0, depth - 1); continue; }
      if (!depth) out += ch;
    }
    return out;
  }

  function fmt(v) {
    v = Number(v) || 0;
    if (v === Math.floor(v)) return String(v);
    return v.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
  }

  // Turn one rule's label text into lines of {text, color}; prev is the label so far.
  function renderLabel(text, prev, ctx, item) {
    var color = COLORS[itemColor(item)];
    var lines = [[]];
    // $f(...) in the output prints its value
    var s;
    while ((s = text.indexOf('$f(')) !== -1) {
      var j = s + 3;
      var depth = 1;
      while (j < text.length && depth) {
        if (text.charAt(j) === '(') depth++;
        else if (text.charAt(j) === ')') depth--;
        j++;
      }
      text = text.substring(0, s) + fmt(ctx.formula(text.substring(s + 3, j - 1))) + text.substring(j);
    }
    // ÿc<x> escapes act like the matching %COLOR% token
    text = text.replace(/ÿc(.)/g, function (all, code) {
      return ESCAPE_COLORS[code] ? '%' + ESCAPE_COLORS[code] + '%' : '';
    });
    var last = 0;
    var m;
    TOKEN_RE.lastIndex = 0;
    function push(t) { if (t) lines[lines.length - 1].push({ text: t, color: color }); }
    while ((m = TOKEN_RE.exec(text)) !== null) {
      push(text.substring(last, m.index));
      last = TOKEN_RE.lastIndex;
      var tok = m[1];
      if (tok === 'NAME') {
        for (var p = 0; p < prev.length; p++) {
          if (p) lines.push([]);
          Array.prototype.push.apply(lines[lines.length - 1], prev[p]);
        }
      } else if (COLORS[tok]) {
        color = COLORS[tok];
      } else if (tok === 'NL') {
        lines.push([]);
      } else if (tok === 'CL') {
        push(CL); // conditional newline, resolved on the finished label
      } else if (tok === 'CS') {
        push(CS); // conditional space, resolved on the finished label
      } else if (tok === 'RUNENUM') {
        push(item.rune ? String(item.rune) : '');
      } else if (tok === 'RUNENAME') {
        push(item.runeName || '');
      } else if (tok === 'BASENAME') {
        push(item.base || item.name);
      } else if (tok === 'GEMTYPE') {
        push(GEM_TYPES[ctx.value('GEMTYPE')] || '');
      } else if (tok === 'CODE') {
        push(item.code);
      } else if (VALUE_TOKENS[tok] || /^(STAT|CHARSTAT|SK|TABSK|CLSK)\d+$/.test(tok)) {
        push(fmt(ctx.value(tok)));
      }
      // anything else (CONTINUE, TIER, SOUNDID, MAP, DOT, PX, BORDER, NOTIFY, unknown) draws nothing
    }
    push(text.substring(last));
    lines = lines.map(function (line) { return line.filter(function (seg) { return seg.text; }); });
    while (lines.length && !lines[lines.length - 1].length) lines.pop();
    return lines;
  }

  window.FF = window.FF || {};
  window.FF.FilterEngine = {
    COLORS: COLORS,
    decode: decode,
    parse: function (text) { return new Filter(text); }
  };
})();
