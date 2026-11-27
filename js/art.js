/* ECOCRAYON – hình minh họa SVG vẽ tay bằng code. */
(function () {
  var A = EC.art = {};
  var INK = 'currentColor';

  function svg(vb, inner, cls, label) {
    var a = label ? ' role="img" aria-label="' + label + '"' : ' aria-hidden="true" focusable="false"';
    return '<svg class="art ' + (cls || '') + '" viewBox="' + vb + '"' + a + '>' + inner + '</svg>';
  }
  function g(sw, inner) {
    return '<g stroke="' + INK + '" stroke-width="' + sw + '" stroke-linejoin="round" stroke-linecap="round">' + inner + '</g>';
  }
  function el(cx, cy, rx, ry, fill, rot, extra) {
    return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + fill + '"' +
      (rot ? ' transform="rotate(' + rot + ' ' + cx + ' ' + cy + ')"' : '') + (extra || '') + '/>';
  }
  function ci(cx, cy, r, fill, extra) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + fill + '"' + (extra || '') + '/>'; }
  function p(d, fill, extra) { return '<path d="' + d + '" fill="' + (fill || 'none') + '"' + (extra || '') + '/>'; }
  function line(d, color, w) { return '<path d="' + d + '" fill="none" stroke="' + (color || INK) + '"' + (w ? ' stroke-width="' + w + '"' : '') + '/>'; }
  A.svg = svg;
  /* Cho các file hình khác (art2.js) dùng chung bút vẽ và kho hình. */
  A.h = { svg: svg, g: g, el: el, ci: ci, p: p, line: line };
  A.EXTRA = {};

  /* ---------- Nguyên liệu (120×120) ---------- */
  var ING = {
    den: function () {
      return g(3,
        el(34, 24, 10, 20, '#5DA34A', -35) + el(62, 18, 10, 19, '#4C9A3B') + el(89, 26, 10, 19, '#5DA34A', 35) +
        line('M57 50 Q46 38 37 27', '#B8336A', 3) + line('M60 50 L62 20', '#B8336A', 3) + line('M63 50 Q74 38 86 28', '#B8336A', 3) +
        p('M60 46 C88 46 100 66 95 84 C90 100 74 106 62 108 L58 108 C46 106 30 100 25 84 C20 66 32 46 60 46 Z', '#B8336A') +
        line('M60 108 Q63 114 57 119') +
        line('M40 64 Q35 76 40 90', '#E57AA6', 4) + line('M72 60 Q80 66 81 76', '#8E2150', 2.5));
    },
    nghe: function () {
      return g(3,
        p('M86 8 C106 30 104 60 88 76 C76 56 74 30 86 8 Z', '#6AA84F') + line('M86 12 Q86 44 88 74', '#3E7A2E', 2) +
        p('M44 66 C38 50 46 40 55 43 C62 46 61 57 57 63 Z', '#C98A3A') +
        p('M78 70 C80 55 92 50 97 58 C100 65 93 71 86 73 Z', '#C98A3A') +
        p('M18 82 C16 68 32 61 46 64 C58 58 74 60 82 70 C96 68 106 78 100 90 C96 100 80 100 70 96 C58 104 40 104 30 98 C20 96 15 89 18 82 Z', '#C98A3A') +
        line('M38 70 Q35 84 39 97', '#8C5A22', 2) + line('M62 66 Q59 82 63 99', '#8C5A22', 2) + line('M84 73 Q82 84 85 95', '#8C5A22', 2) +
        ci(24, 100, 14, '#C98A3A') + ci(24, 100, 9.5, '#F2A516', ' stroke="none"') + ci(24, 100, 4, '#F7C548', ' stroke="none"'));
    },
    'la-dua': function () {
      var tips = [[14, 34], [34, 10], [60, 4], [88, 12], [108, 36]], fills = ['#3E8530', '#5DA34A', '#4C9A3B', '#6CB04F', '#3E8530'], out = '';
      tips.forEach(function (t, i) {
        var bx = 60, by = 110, mx = (bx + t[0]) / 2, my = (by + t[1]) / 2;
        out += p('M' + (bx - 5) + ' ' + by + ' Q' + (mx - 9) + ' ' + my + ' ' + t[0] + ' ' + t[1] + ' Q' + (mx + 9) + ' ' + my + ' ' + (bx + 5) + ' ' + by + ' Z', fills[i]);
        out += line('M' + bx + ' ' + (by - 4) + ' Q' + mx + ' ' + my + ' ' + t[0] + ' ' + t[1], '#2E6B24', 1.6);
      });
      return g(2.6, out + '<rect x="49" y="94" width="22" height="9" rx="3" fill="#D9BC8C"/>' + line('M54 94 L54 103') + line('M66 94 L66 103'));
    },
    'dau-biec': function () {
      return g(3,
        line('M4 110 C30 90 40 104 60 94 C80 84 96 102 116 88', '#4C9A3B', 3.5) +
        el(26, 90, 7, 13, '#6CB04F', -50) + el(94, 98, 7, 13, '#6CB04F', 50) + el(110, 80, 6, 11, '#5DA34A', 20) +
        p('M54 92 L60 102 L66 92 Z', '#4C9A3B') +
        el(47, 89, 9, 6, '#4C7BD0') + el(73, 89, 9, 6, '#4C7BD0') +
        p('M60 14 C90 14 104 38 99 62 C95 82 74 92 60 92 C46 92 25 82 21 62 C16 38 30 14 60 14 Z', '#2F62B0') +
        line('M60 26 Q57 40 59 48', '#1F4A8C', 2) + line('M40 34 Q48 44 52 52', '#1F4A8C', 2) + line('M80 34 Q72 44 68 52', '#1F4A8C', 2) +
        line('M30 56 Q42 58 50 62', '#1F4A8C', 2) + line('M90 56 Q78 58 70 62', '#1F4A8C', 2) +
        p('M60 46 C71 52 71 72 60 82 C49 72 49 52 60 46 Z', '#F6EBC0') + p('M60 54 C65 60 65 70 60 76 C55 70 55 60 60 54 Z', '#F2C744', ' stroke="none"'));
    },
    'bap-cai': function () {
      return g(3,
        ci(60, 66, 46, '#6E3C8F') +
        p('M16 72 C10 42 30 18 55 18 C40 30 30 52 34 80 Z', '#8A55AA') +
        p('M104 72 C110 42 90 18 65 18 C80 30 90 52 86 80 Z', '#8A55AA') +
        ci(60, 68, 30, '#7B479D') +
        line('M38 62 Q60 38 82 62', '#4E2468', 2.5) +
        line('M60 108 Q56 84 60 44', '#DCC6EC', 2.5) + line('M58 104 Q40 86 30 60', '#DCC6EC', 2) + line('M62 104 Q80 86 90 60', '#DCC6EC', 2) +
        line('M24 70 Q20 54 26 42', '#DCC6EC', 2) + line('M96 70 Q100 54 94 42', '#DCC6EC', 2));
    },
    'ca-rot': function () {
      return g(3,
        el(50, 22, 7, 18, '#4C9A3B', -22) + el(62, 16, 7, 19, '#5DA34A') + el(75, 23, 7, 18, '#4C9A3B', 22) +
        p('M38 34 C50 30 72 30 84 34 C86 44 74 80 63 112 C61 117 58 117 56 112 C44 80 34 44 38 34 Z', '#E2702A') +
        line('M46 50 l11 2', '#A8501A', 2.5) + line('M76 60 l-11 2', '#A8501A', 2.5) + line('M50 78 l9 2', '#A8501A', 2.5) + line('M70 92 l-7 1', '#A8501A', 2.5) +
        line('M47 42 Q50 62 57 86', '#F5A06A', 3));
    }
  };
  A.ingredient = function (id, cls, label) { return svg('0 0 120 120', ING[id](), 'ing ' + (cls || ''), label); };
  A.ingInner = function (id) { return ING[id](); };

  /* ---------- Đồ vật trong tự nhiên (64×64) ---------- */
  var NAT = {
    tomato: function () { return g(2.6, ci(32, 36, 20, '#E0412F') + p('M21 20 L28 21 L32 13 L36 21 L43 20 L37 25 L32 23 L27 25 Z', '#4C9A3B') + line('M21 33 Q21 27 26 25', '#F7A08F', 3)); },
    strawberry: function () {
      var seeds = [[26, 32], [38, 32], [32, 40], [24, 42], [40, 42], [32, 49]].map(function (s) { return el(s[0], s[1], 1.4, 2.2, '#F4D35E', 0, ' stroke="none"'); }).join('');
      return g(2.6, p('M32 57 C18 49 11 35 15 27 C19 20 27 22 32 24 C37 22 45 20 49 27 C53 35 46 49 32 57 Z', '#E0413F') + seeds + p('M19 23 L25 15 L32 21 L39 15 L45 23 L32 27 Z', '#4C9A3B'));
    },
    chili: function () { return g(2.6, p('M12 18 C20 15 24 21 26 29 C30 43 40 52 55 56 C41 61 22 53 16 37 C13 29 12 23 12 18 Z', '#D7263D') + line('M12 18 Q9 11 14 6', '#3E8530', 3.5) + line('M20 26 Q22 36 28 42', '#F27B8A', 2.5)); },
    watermelon: function () {
      var seeds = [[22, 34], [32, 40], [42, 34], [27, 44], [37, 44]].map(function (s) { return el(s[0], s[1], 1.6, 2.6, '#2B2722', 0, ' stroke="none"'); }).join('');
      return g(2.6, p('M6 24 A26 26 0 0 0 58 24 Z', '#4C9A3B') + p('M11 24 A21 21 0 0 0 53 24 Z', '#EF5A6F', ' stroke="none"') + seeds);
    },
    banana: function () { return g(2.6, p('M10 16 C14 40 31 52 53 48 C57 47 59 44 55 42 C37 42 23 32 18 15 C17 11 11 11 10 16 Z', '#F2CF3A') + line('M16 22 Q24 38 40 44', '#C9A21E', 2) + ci(54, 45, 2, '#5A4A1A', ' stroke="none"')); },
    corn: function () {
      var k = ''; for (var y = 14; y <= 46; y += 8) k += line('M24 ' + y + ' L44 ' + y, '#C99A1A', 1.6);
      return g(2.6, el(34, 30, 11, 22, '#F4C430') + k + line('M30 10 L30 52', '#C99A1A', 1.6) + line('M38 10 L38 52', '#C99A1A', 1.6) +
        p('M22 28 C15 42 19 56 31 60 C26 50 26 40 30 33 Z', '#6CB04F') + p('M46 28 C53 42 49 56 37 60 C42 50 42 40 38 33 Z', '#5DA34A'));
    },
    sunflower: function () {
      var pet = ''; for (var i = 0; i < 12; i++) { var a = i * 30, r = a * Math.PI / 180; pet += el((32 + 14 * Math.cos(r)).toFixed(1), (26 + 14 * Math.sin(r)).toFixed(1), 4.5, 8, '#F4C430', a + 90); }
      return g(2.2, line('M32 36 L32 62', '#3E8530', 3) + el(42, 52, 4, 8, '#5DA34A', 50) + pet + ci(32, 26, 9, '#7A4A1E'));
    },
    mango: function () { return g(2.6, p('M17 41 C11 24 26 10 42 14 C56 18 58 38 46 50 C36 60 21 55 17 41 Z', '#F6B32B') + line('M38 14 Q40 8 44 6', '#6B4A1E', 3) + el(50, 9, 4, 8, '#4C9A3B', 60) + line('M24 32 Q26 22 34 19', '#FBD56E', 3)); },
    cucumber: function () { return g(2.6, '<rect x="8" y="24" width="48" height="18" rx="9" transform="rotate(-25 32 33)" fill="#4E8F37"/>' + [[20, 38], [30, 33], [40, 28], [26, 30], [36, 36]].map(function (d) { return ci(d[0], d[1], 1.4, '#A8D48A', ' stroke="none"'); }).join('')); },
    broccoli: function () { return g(2.6, p('M28 34 L26 58 L38 58 L36 34 Z', '#8CC66A') + ci(20, 28, 10, '#3E8530') + ci(44, 28, 10, '#3E8530') + ci(32, 20, 11, '#4C9A3B') + ci(32, 33, 9, '#3E8530')); },
    leaf: function () { return g(2.6, p('M10 54 C10 28 28 10 54 10 C54 36 36 54 10 54 Z', '#4C9A3B') + line('M10 54 L44 20', '#2E6B24', 2) + line('M22 42 L22 30', '#2E6B24', 1.8) + line('M30 34 L40 34', '#2E6B24', 1.8)); },
    lime: function () { return g(2.6, el(46, 14, 5, 10, '#4C9A3B', 50) + ci(30, 36, 19, '#6DB33F') + ci(30, 36, 2, '#3E7A2E', ' stroke="none"') + line('M18 30 Q20 22 27 20', '#B5DE8E', 3)); },
    sky: function () { return g(2.6, '<rect x="6" y="10" width="52" height="44" rx="10" fill="#5B9BD5"/>' + p('M16 40 C11 40 11 31 18 31 C18 24 27 22 31 27 C33 20 44 20 45 29 C52 29 53 40 46 40 Z', '#FFFFFF')); },
    wave: function () { return g(2.6, p('M6 30 C14 21 23 21 31 30 C39 39 47 39 58 29 L58 56 L6 56 Z', '#2F62B0') + line('M10 40 C18 33 26 34 32 41', '#A9C7F0', 2.5)); },
    eggplant: function () { return g(2.6, p('M41 18 C53 24 55 41 47 51 C39 61 22 59 16 51 C10 42 16 34 26 30 C32 28 35 20 41 18 Z', '#5B2C83') + p('M36 14 L45 11 L50 20 L41 23 Z', '#4C9A3B') + line('M24 40 Q28 36 32 36', '#9C78C2', 2.5)); },
    grapes: function () {
      var pts = [[22, 24], [34, 24], [46, 24], [28, 35], [40, 35], [34, 46], [22, 35], [46, 35]].slice(0, 7);
      return g(2.4, line('M34 18 Q34 10 40 6', '#6B4A1E', 3) + el(44, 10, 5, 8, '#4C9A3B', 60) + pts.map(function (q) { return ci(q[0], q[1], 7, '#6E3C8F'); }).join('') + ci(34, 56, 7, '#6E3C8F'));
    },
    sweetpotato: function () { return g(2.6, line('M10 38 Q4 40 3 46', null, 2) + line('M54 38 Q60 34 62 28', null, 2) + p('M10 36 C12 24 28 18 42 22 C54 26 58 36 52 44 C44 52 22 52 14 46 C10 44 9 40 10 36 Z', '#7B3F8C') + line('M24 30 l3 2', '#C79AD8', 2) + line('M38 40 l3 2', '#C79AD8', 2)); },
    orange: function () { return g(2.6, el(42, 14, 5, 9, '#4C9A3B', 60) + ci(30, 36, 20, '#F08A24') + [[24, 30], [36, 42], [30, 46], [40, 32]].map(function (d) { return ci(d[0], d[1], 1.2, '#C2611A', ' stroke="none"'); }).join('') + line('M18 30 Q20 22 27 19', '#F9C08A', 3)); },
    pumpkin: function () { return g(2.6, line('M32 22 Q31 14 36 10', '#6B4A1E', 4) + el(20, 38, 13, 17, '#E57A26') + el(44, 38, 13, 17, '#E57A26') + el(32, 38, 12, 19, '#F08A3A')); }
  };

  /* ---------- Rác (64×64) ---------- */
  var WASTE = {
    bao: function () { return g(2.4, p('M10 14 L50 10 L54 52 L14 56 Z', '#F3EFE4') + '<rect x="17" y="18" width="16" height="10" fill="#9DB4CF" transform="rotate(-5 25 23)"/>' + line('M37 18 L47 17', null, 2) + line('M37 24 L47 23', null, 2) + line('M18 34 L48 31', null, 2) + line('M18 40 L48 37', null, 2) + line('M18 46 L40 44', null, 2)); },
    carton: function () { return g(2.6, p('M10 26 L42 26 L42 56 L10 56 Z', '#C99A5B') + p('M42 26 L54 18 L54 48 L42 56 Z', '#B3864A') + p('M10 26 L22 18 L54 18 L42 26 Z', '#DDB57A') + line('M18 38 L34 38', '#8A6334', 2) + p('M10 26 L4 16 L22 18 Z', '#DDB57A')); },
    vo: function () { return g(2.6, '<rect x="14" y="8" width="38" height="48" rx="3" fill="#6FA8DC"/>' + '<rect x="22" y="18" width="22" height="10" rx="2" fill="#FFFFFF"/>' + [14, 22, 30, 38, 46].map(function (y) { return ci(14, y, 2.4, '#F3EFE4'); }).join('')); },
    loigiay: function () { return g(2.6, '<rect x="16" y="16" width="32" height="38" fill="#C8A06A"/>' + el(32, 54, 16, 6, '#C8A06A') + el(32, 16, 16, 6, '#DDBB86') + el(32, 16, 8, 3, '#6E5230')); },
    chainhua: function () { return g(2.6, p('M24 22 L24 16 L40 16 L40 22 C48 26 48 32 48 36 L48 54 C48 57 46 58 44 58 L20 58 C18 58 16 57 16 54 L16 36 C16 32 16 26 24 22 Z', '#BFE3F2') + '<rect x="25" y="8" width="14" height="8" rx="2" fill="#2F62B0"/>' + '<rect x="16" y="36" width="32" height="10" fill="#7FC36B"/>' + line('M21 26 L21 33', '#FFFFFF', 2.5)); },
    nap: function () { return g(2.6, '<rect x="14" y="22" width="36" height="20" rx="4" fill="#E0412F"/>' + el(32, 22, 18, 6, '#F06A55') + [20, 26, 32, 38, 44].map(function (x) { return line('M' + x + ' 30 L' + x + ' 40', '#9C2A1E', 1.6); }).join('')); },
    hopsua: function () { return g(2.6, p('M14 18 L50 18 L45 56 L19 56 Z', '#FFFFFF') + '<rect x="17" y="30" width="30" height="10" fill="#F2A0A0" stroke="none"/>' + el(32, 18, 18, 4, '#E9E2D2')); },
    daugoi: function () { return g(2.6, '<rect x="18" y="20" width="28" height="38" rx="7" fill="#9C6ADE"/>' + '<rect x="26" y="12" width="12" height="9" fill="#F3EFE4"/>' + line('M32 12 L32 6 L42 6', null, 3) + '<rect x="23" y="32" width="18" height="12" rx="2" fill="#F3EFE4"/>'); },
    lon: function () { return g(2.6, '<rect x="18" y="12" width="28" height="44" rx="5" fill="#D7263D"/>' + el(32, 12, 14, 4, '#C8CDD3') + line('M30 12 L36 10', null, 2) + line('M22 26 C28 30 36 22 42 26', '#FFFFFF', 3)); },
    hopca: function () { return g(2.6, '<rect x="10" y="22" width="44" height="26" rx="4" fill="#A9B0B8"/>' + el(32, 22, 22, 5, '#C8CDD3') + '<rect x="10" y="29" width="44" height="12" fill="#F2A516"/>' + p('M22 35 C26 31 34 31 38 35 C34 39 26 39 22 35 Z M38 35 L43 32 L43 38 Z', '#2F62B0', ' stroke-width="1.6"')); },
    napkl: function () {
      var pts = []; for (var i = 0; i < 21; i++) { var r = i % 2 ? 17 : 21, a = i / 21 * Math.PI * 2; pts.push((32 + r * Math.cos(a)).toFixed(1) + ',' + (32 + r * Math.sin(a)).toFixed(1)); }
      return g(2.4, '<polygon points="' + pts.join(' ') + '" fill="#B8BEC6"/>' + ci(32, 32, 12, '#D5DADF'));
    },
    vochuoi: function () { return g(2.6, p('M32 30 C22 34 12 46 10 56 C18 50 24 44 30 40 Z', '#F2CF3A') + p('M32 30 C42 34 52 46 54 56 C46 50 40 44 34 40 Z', '#F2CF3A') + p('M28 30 C26 40 28 52 32 58 C36 52 38 40 36 30 Z', '#FFF2B0') + p('M27 32 C27 22 30 14 32 8 C34 14 37 22 37 32 Z', '#F2CF3A') + '<rect x="30" y="4" width="4" height="6" fill="#5A4A1A"/>'); },
    loitao: function () { return g(2.6, p('M20 14 C28 18 36 18 44 14 C46 20 40 26 38 32 C40 38 46 44 44 50 C36 46 28 46 20 50 C18 44 24 38 26 32 C24 26 18 20 20 14 Z', '#FFF4D6') + p('M20 14 C28 18 36 18 44 14 C40 9 24 9 20 14 Z', '#E0412F') + p('M20 50 C28 46 36 46 44 50 C40 56 24 56 20 50 Z', '#E0412F') + el(30, 31, 1.8, 3, '#5A3A1A', 0, ' stroke="none"') + el(34, 33, 1.8, 3, '#5A3A1A', 0, ' stroke="none"') + line('M32 10 L33 4', null, 3)); },
    votrung: function () { return g(2.6, p('M12 32 L18 26 L23 33 L29 25 L35 33 L41 26 L46 33 L52 28 C54 46 44 56 32 56 C20 56 10 46 12 32 Z', '#F8EEDC') + line('M20 44 Q28 48 36 46', '#E2D2B4', 2.5)); },
    lakho: function () { return g(2.6, p('M8 50 C10 26 28 10 54 8 C54 34 36 52 8 50 Z', '#C98A3A') + line('M8 50 L42 18', '#7A4E1E', 2) + line('M20 40 L18 28', '#7A4E1E', 1.6) + line('M28 32 L40 34', '#7A4E1E', 1.6)); },
    raucu: function () { return g(2.6, p('M8 40 C18 30 30 34 34 42 C26 40 18 42 12 48 Z', '#E2702A') + p('M30 50 C36 38 48 36 56 42 C48 44 42 48 38 56 Z', '#F08A3A') + p('M22 20 C30 14 40 18 42 26 C34 24 28 26 24 30 Z', '#E57A26') + line('M44 14 L48 6', '#3E8530', 3) + line('M48 16 L54 10', '#3E8530', 3)); }
  };

  /* ---------- Huy hiệu, bộ sản phẩm (64×64) ---------- */
  var BADGE = {
    'b-rainbow': function () { return '<g fill="none" stroke-linecap="round" stroke-width="5">' + ['#B8336A', '#E2702A', '#E3A21A', '#4C9A3B', '#2F62B0', '#6E3C8F'].map(function (c, i) { var r = 26 - i * 4; return '<path d="M' + (32 - r) + ' 46 A' + r + ' ' + r + ' 0 0 1 ' + (32 + r) + ' 46" stroke="' + c + '"/>'; }).join('') + '</g>'; },
    'b-cards': function () { return g(2.6, '<rect x="10" y="14" width="24" height="34" rx="4" fill="#E3A21A" transform="rotate(-12 22 31)"/>' + '<rect x="30" y="14" width="24" height="34" rx="4" fill="#F7F1E3" transform="rotate(10 42 31)"/>' + ci(42, 31, 6, '#B8336A')); },
    'b-bin': function () { return g(2.6, '<rect x="14" y="14" width="36" height="7" rx="2" fill="#4C9A3B"/>' + p('M17 21 H47 L44 54 H20 Z', '#6CB04F') + line('M27 28 L27 48', null, 2) + line('M37 28 L37 48', null, 2)); },
    'b-quiz': function () { return g(2.6, p('M10 14 H54 V42 H30 L20 52 V42 H10 Z', '#2F62B0') + '<text x="32" y="36" text-anchor="middle" font-size="22" font-weight="700" fill="#FFFFFF" stroke="none" font-family="Mali, sans-serif">?</text>'); },
    'b-bowl': function () { return g(2.6, p('M8 30 H56 C56 46 46 54 32 54 C18 54 8 46 8 30 Z', '#F7F1E3') + el(32, 30, 24, 6, '#5C9A3A') + line('M24 30 Q30 26 36 30 Q40 33 44 30', '#E3A21A', 2.5)); },
    'b-beaker': function () { return g(2.6, p('M24 8 H40 M27 8 V24 L12 52 C10 56 12 58 16 58 H48 C52 58 54 56 52 52 L37 24 V8', '#F7F1E3') + p('M18 42 H46 L52 52 C54 56 52 58 48 58 H16 C12 58 10 56 12 52 Z', '#8A4DB0')); },
    'b-crayon': function () { return g(2.6, '<g transform="rotate(35 32 32)"><path d="M26 10 L32 0 L38 10 Z" fill="#B8336A"/><rect x="26" y="10" width="12" height="46" rx="2" fill="#B8336A"/><rect x="26" y="20" width="12" height="26" fill="#DCC29A"/></g>'); },
    'b-story': function () { return g(2.6, p('M32 18 C24 12 14 12 8 14 V50 C14 48 24 48 32 54 Z', '#F7F1E3') + p('M32 18 C40 12 50 12 56 14 V50 C50 48 40 48 32 54 Z', '#F7F1E3') + line('M14 24 L26 26', null, 2) + line('M14 32 L26 34', null, 2) + line('M38 26 L50 24', null, 2)); },
    'b-wave': function () { return g(2.6, p('M6 34 C14 26 22 26 30 34 C38 42 46 42 58 33 L58 56 L6 56 Z', '#2F62B0') + p('M32 26 C26 18 16 22 20 30 C22 34 32 40 32 40 C32 40 42 34 44 30 C48 22 38 18 32 26 Z', '#E0413F')); },
    'b-leaf': function () { return NAT.leaf(); },
    'b-star': function () { var pts = []; for (var i = 0; i < 10; i++) { var r = i % 2 ? 11 : 25, a = -Math.PI / 2 + i * Math.PI / 5; pts.push((32 + r * Math.cos(a)).toFixed(1) + ',' + (33 + r * Math.sin(a)).toFixed(1)); } return g(2.6, '<polygon points="' + pts.join(' ') + '" fill="#E3A21A"/>'); },
    'b-recycle': function () { return '<g fill="none" stroke="#4C9A3B" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 18 A18 18 0 0 1 48 22"/><path d="M50 34 A18 18 0 0 1 34 52"/><path d="M22 48 A18 18 0 0 1 14 26"/><path d="M42 14 L49 22 L40 26"/><path d="M42 52 L33 52 L36 44"/><path d="M10 34 L14 25 L22 30"/></g>'; },
    'k-crayon': function () { return g(2.4, ['#B8336A', '#E3A21A', '#4C9A3B'].map(function (c, i) { var x = 14 + i * 14; return '<path d="M' + x + ' 18 L' + (x + 5) + ' 6 L' + (x + 10) + ' 18 Z" fill="' + c + '"/><rect x="' + x + '" y="18" width="10" height="40" rx="2" fill="' + c + '"/><rect x="' + x + '" y="28" width="10" height="20" fill="#DCC29A"/>'; }).join('')); },
    'k-box': function () { return WASTE.carton(); },
    'k-book': function () { return g(2.6, '<rect x="12" y="8" width="40" height="50" rx="3" fill="#F7F1E3"/>' + ci(32, 28, 10, '#E3A21A') + el(26, 44, 6, 4, '#4C9A3B', -20) + line('M18 8 L18 58', null, 2)); },
    'k-card': function () { return g(2.6, '<rect x="14" y="6" width="36" height="52" rx="5" fill="#F7F1E3"/>' + '<rect x="14" y="6" width="36" height="14" rx="5" fill="#E3A21A"/>' + ci(32, 36, 8, '#C98A3A') + line('M22 50 L42 50', null, 2)); },
    'k-qr': function () { return g(2, '<rect x="8" y="8" width="48" height="48" rx="4" fill="#FFFFFF"/>' + '<rect x="13" y="13" width="14" height="14" fill="#2B2722"/><rect x="37" y="13" width="14" height="14" fill="#2B2722"/><rect x="13" y="37" width="14" height="14" fill="#2B2722"/><rect x="37" y="37" width="6" height="6" fill="#2B2722" stroke="none"/><rect x="45" y="45" width="6" height="6" fill="#2B2722" stroke="none"/><rect x="31" y="31" width="4" height="4" fill="#2B2722" stroke="none"/>'); },
    'k-bag': function () { return g(2.6, p('M8 22 H56 V50 C56 54 54 56 50 56 H14 C10 56 8 54 8 50 Z', '#8FB6C9') + line('M8 34 H56', null, 2) + [18, 28, 38, 48].map(function (x) { return line('M' + x + ' 34 V56', null, 1.6); }).join('') + line('M56 30 C62 30 62 40 56 40', '#B8336A', 3)); }
  };

  A.thing = function (id, cls, label) {
    if (id.indexOf('ing-') === 0) return A.ingredient(id.slice(4), cls, label);
    var f = NAT[id] || WASTE[id] || BADGE[id] || A.EXTRA[id];
    if (!f) return '';
    return svg('0 0 64 64', f(), 'thing ' + (cls || ''), label);
  };
  A.has = function (id) { id = String(id || ''); return id.indexOf('ing-') === 0 ? !!ING[id.slice(4)] : !!(NAT[id] || WASTE[id] || BADGE[id] || A.EXTRA[id]); };
  /* Phần ruột của một hình (không có thẻ <svg> ngoài) để lồng vào hình lớn hơn. */
  A.innerOf = function (id) {
    id = String(id || '');
    if (id.indexOf('ing-') === 0) return ING[id.slice(4)] ? { vb: '0 0 120 120', inner: ING[id.slice(4)]() } : null;
    var f = NAT[id] || WASTE[id] || BADGE[id] || A.EXTRA[id];
    return f ? { vb: '0 0 64 64', inner: f() } : null;
  };
  A.ids = function () { return Object.keys(NAT).concat(Object.keys(WASTE), Object.keys(BADGE), Object.keys(A.EXTRA), Object.keys(ING).map(function (k) { return 'ing-' + k; })); };

  /* ---------- Thùng rác (100×110) ---------- */
  A.bin = function (b) {
    var icon = { giay: 'bao', nhua: 'chainhua', kimloai: 'lon', huuco: 'vochuoi' }[b.id];
    return svg('0 0 100 110', g(3,
      '<rect x="40" y="2" width="20" height="9" rx="3" fill="' + b.color + '"/>' +
      '<rect x="6" y="10" width="88" height="14" rx="5" fill="' + b.color + '"/>' +
      p('M12 24 H88 L81 106 H19 Z', b.color) +
      line('M30 32 L32 98', 'rgba(0,0,0,.18)', 3) + line('M70 32 L68 98', 'rgba(0,0,0,.18)', 3) +
      ci(50, 62, 24, '#FFFDF7')) +
      '<svg x="30" y="42" width="40" height="40" viewBox="0 0 64 64">' + WASTE[icon]() + '</svg>', 'bin');
  };

  /* ---------- Bút sáp (40×170) ---------- */
  A.crayonShape = function (hex) {
    return g(2.6,
      p('M7 42 L17 8 Q20 2 23 8 L33 42 Z', hex) +
      '<rect x="5" y="40" width="30" height="128" rx="5" fill="' + hex + '"/>' +
      '<rect x="5" y="66" width="30" height="78" fill="#DCC29A"/>' +
      '<rect x="5" y="72" width="30" height="5" fill="' + hex + '" stroke="none"/><rect x="5" y="133" width="30" height="5" fill="' + hex + '" stroke="none"/>' +
      line('M12 46 L12 162', 'rgba(255,255,255,.35)', 3));
  };
  A.crayon = function (hex, cls, label) { return svg('0 0 40 170', A.crayonShape(hex), 'crayon ' + (cls || ''), label); };

  A.logo = function () {
    return svg('0 0 40 40', g(2.4,
      p('M20 10 C22 4 30 1 36 3 C34 9 28 12 20 10 Z', '#6CB04F') +
      p('M10 38 L10 22 L18 9 Q20 6 22 9 L30 22 L30 38 Z', '#4C9A3B') +
      '<rect x="10" y="24" width="20" height="10" fill="#DCC29A"/>'), 'logo');
  };

  /* ---------- Linh vật Bé Sáp (120×160) ---------- */
  A.mascot = function (mood, cls, vb) { return svg(vb || '0 0 120 160', A.mascotInner(mood), 'mascot ' + (cls || '')); };
  A.mascotInner = function (mood) {
    var mouth = {
      happy: line('M53 99 Q60 106 67 99'),
      wow: el(60, 101, 4, 5, '#7A2E2E'),
      sad: line('M54 103 Q60 97 66 103'),
      think: line('M55 101 L65 100')
    }[mood] || line('M53 99 Q60 106 67 99');
    var eyes = mood === 'think'
      ? ci(53, 86, 3.6, INK) + ci(69, 86, 3.6, INK)
      : ci(52, 89, 4.2, INK) + ci(68, 89, 4.2, INK) + ci(53.5, 87.5, 1.3, '#FFFFFF', ' stroke="none"') + ci(69.5, 87.5, 1.3, '#FFFFFF', ' stroke="none"');
    return g(3,
      line('M60 22 Q58 14 62 8', '#3E7A2E', 3) +
      p('M61 12 C64 2 78 -1 90 4 C85 15 72 18 61 12 Z', '#6CB04F') +
      p('M40 54 L57 23 Q60 18 63 23 L80 54 Z', '#4C9A3B') +
      '<rect x="38" y="52" width="44" height="92" rx="9" fill="#4C9A3B"/>' +
      '<rect x="38" y="70" width="44" height="54" fill="#DDBF8E"/>' +
      line('M38 70 L44 66 L50 70 L56 66 L62 70 L68 66 L74 70 L82 66', '#B08A55', 2) +
      line('M38 96 Q26 92 20 80') + line('M82 96 Q94 92 100 82') + ci(19, 78, 5, '#4C9A3B') + ci(101, 80, 5, '#4C9A3B') +
      el(50, 148, 10, 6, '#3E8530') + el(70, 148, 10, 6, '#3E8530')) +
      ci(46, 99, 4.5, '#F2A0A0', ' opacity=".8"') + ci(74, 99, 4.5, '#F2A0A0', ' opacity=".8"') +
      '<g stroke="' + INK + '" stroke-width="3" stroke-linecap="round" fill="none">' + eyes + mouth + '</g>';
  };

  /* ---------- Hộp bút ở trang chủ (440×380) ---------- */
  A.heroBox = function () {
    var heights = [62, 40, 56, 32, 50, 66];
    var crayons = EC.COLORS.map(function (c, i) {
      var x = 76 + i * 50;
      return '<a class="hero-crayon" href="#mau-' + c.id + '" aria-label="' + c.color + ' từ ' + c.name + '" style="--i:' + i + '">' +
        '<title>' + c.color + ' – ' + c.name + '</title>' +
        '<g transform="translate(' + x + ' ' + heights[i] + ') scale(1.05)"><rect x="5" y="150" width="30" height="110" fill="' + c.hex + '" stroke="currentColor" stroke-width="2.6"/>' + A.crayonShape(c.hex) + '</g></a>';
    }).join('');
    var fibers = '';
    for (var i = 0; i < 26; i++) {
      var fx = 60 + (i * 53) % 320, fy = 248 + (i * 37) % 92;
      fibers += '<path d="M' + fx + ' ' + fy + ' l' + (6 + i % 5) + ' ' + (i % 3 - 1) + '" stroke="#B08A55" stroke-width="1.4" opacity=".55"/>';
    }
    return '<svg class="art herobox" viewBox="0 0 440 380" role="group" aria-label="Hộp bút sáp ECOCRAYON với 6 màu">' +
      '<ellipse cx="220" cy="356" rx="190" ry="16" fill="rgba(60,40,10,.18)"/>' +
      g(3, p('M56 122 L92 34 L408 34 L384 122 Z', '#B48A52') + line('M120 60 Q150 46 180 60 M250 56 Q280 42 310 56', '#8C6838', 2)) +
      g(3, '<rect x="56" y="120" width="328" height="132" fill="#6E5030"/>') +
      '<clipPath id="hb-clip"><rect x="0" y="0" width="440" height="240"/></clipPath><g clip-path="url(#hb-clip)">' + crayons + '</g>' +
      g(3, p('M38 232 L402 232 L392 352 L48 352 Z', '#D2AE74') + '<rect x="34" y="226" width="372" height="14" rx="4" fill="#C49C5E"/>') +
      fibers +
      '<text x="220" y="296" text-anchor="middle" class="herobox-word">ECOCRAYON</text>' +
      '<text x="220" y="322" text-anchor="middle" class="herobox-sub">bộ màu sáp thiên nhiên</text>' +
      '<g transform="translate(46 268) scale(.55)">' + g(3, p('M10 54 C10 28 28 10 54 10 C54 36 36 54 10 54 Z', 'none') + line('M10 54 L44 20')) + '</g>' +
      '<g transform="translate(358 268) scale(.55)">' + g(3, p('M54 54 C54 28 36 10 10 10 C10 36 28 54 54 54 Z', 'none') + line('M54 54 L20 20')) + '</g>' +
      '</svg>';
  };

  /* ---------- Cây xanh của bé (220×220) ---------- */
  A.tree = function (stage) {
    var ground = g(3, p('M8 194 C60 176 160 176 212 194 L212 216 L8 216 Z', '#8B6A43')) +
      line('M30 186 l-3 -8 M36 184 l1 -9 M186 186 l3 -8 M180 184 l-1 -9', '#4C9A3B', 2.5);
    var t = '';
    if (stage === 0) {
      t = g(3, el(110, 190, 13, 9, '#A0703A', -15)) + '<text x="132" y="170" class="tree-z">z</text><text x="146" y="156" class="tree-z small">z</text>';
    } else if (stage === 1) {
      t = g(3, line('M110 190 Q108 172 110 160', '#3E8530', 5) + el(97, 158, 13, 7, '#6CB04F', -25) + el(123, 158, 13, 7, '#5DA34A', 25));
    } else if (stage === 2) {
      t = g(3, line('M110 190 Q106 160 110 126', '#3E8530', 6) + el(94, 162, 15, 8, '#5DA34A', -25) + el(126, 150, 15, 8, '#6CB04F', 25) + el(95, 132, 14, 7, '#6CB04F', -30) + el(124, 122, 14, 7, '#5DA34A', 30) + el(110, 112, 7, 13, '#4C9A3B'));
    } else {
      var big = stage >= 4;
      var trunk = big ? 'M98 192 C102 160 100 130 96 100 L124 100 C120 130 118 160 124 192 Z' : 'M103 192 C106 168 104 146 102 126 L118 126 C116 146 114 168 118 192 Z';
      var canopy = big
        ? ci(70, 92, 34, '#4C9A3B') + ci(150, 92, 34, '#4C9A3B') + ci(110, 60, 44, '#5DA34A') + ci(86, 116, 28, '#3E8530') + ci(134, 116, 28, '#3E8530') + ci(110, 98, 34, '#5DA34A', ' stroke="none"')
        : ci(88, 108, 26, '#4C9A3B') + ci(132, 108, 26, '#4C9A3B') + ci(110, 84, 32, '#5DA34A') + ci(110, 112, 24, '#5DA34A', ' stroke="none"');
      t = g(3, p(trunk, '#8B5A2B') + '<g class="canopy">' + canopy + '</g>');
      if (stage >= 5) {
        var spots = [[78, 84], [140, 80], [110, 46], [92, 120], [130, 122], [110, 92]];
        t += g(2.5, EC.COLORS.map(function (c, i) { return ci(spots[i][0], spots[i][1], 9, c.hex); }).join(''));
      }
    }
    return svg('0 0 220 220', ground + t, 'tree tree-' + stage, 'Cây ở mức ' + (EC.TREE[stage] ? EC.TREE[stage].name : ''));
  };

  /* ---------- Cảnh phim nhỏ "Màu được làm ra thế nào" (200×140) ---------- */
  A.film = function (step, color) {
    var c = color.hex, ingMini = '<g transform="translate(70 18) scale(.5)">' + ING[color.id]() + '</g>';
    var scenes = [
      function () { return g(3, p('M30 80 H170 L158 124 H42 Z', '#9CC9E8') + el(100, 80, 70, 10, '#BFE0F3')) + ingMini.replace('translate(70 18)', 'translate(72 34)') + '<g class="drip">' + ci(60, 30, 4, '#7FB7DE') + ci(140, 40, 4, '#7FB7DE') + ci(100, 20, 4, '#7FB7DE') + '</g>'; },
      function () { return g(3, '<rect x="26" y="88" width="148" height="30" rx="8" fill="#D9B178"/>' + '<g class="chop"><rect x="112" y="40" width="54" height="16" rx="3" fill="#C9CED4"/><rect x="160" y="42" width="26" height="12" rx="4" fill="#5A3A1A"/></g>' + ci(52, 86, 8, c) + ci(70, 84, 7, c) + ci(86, 86, 8, c)); },
      function () { return g(3, p('M44 96 H156 C156 120 132 130 100 130 C68 130 44 120 44 96 Z', '#F7F1E3') + el(100, 96, 56, 8, c)) + ingMini + '<g class="drip">' + ci(100, 78, 4, c) + ci(92, 86, 3, c) + '</g>'; },
      function () { return '<g class="spin" style="transform-origin:160px 30px">' + g(3, ci(160, 30, 14, '#F4C430') + line('M160 8 V2 M160 52 V58 M138 30 H132 M182 30 H188 M145 15 L141 11 M175 45 L179 49 M145 45 L141 49 M175 15 L179 11', '#E3A21A', 3)) + '</g>' + g(3, '<rect x="30" y="104" width="120" height="16" rx="5" fill="#D9B178"/>' + p('M50 104 C60 76 110 74 126 104 Z', c)); },
      function () { return '<g class="steam">' + line('M80 30 q-6 -8 0 -16 q6 -8 0 -16', '#B9AE9A', 3) + line('M110 34 q-6 -8 0 -16 q6 -8 0 -16', '#B9AE9A', 3) + '</g>' + g(3, '<rect x="40" y="56" width="120" height="66" rx="12" fill="#9AA3AD"/>' + el(100, 58, 60, 10, '#F1E3B8') + '<g class="swirl">' + line('M74 58 Q100 50 126 58', c, 5) + '</g>' + line('M130 40 L150 10', '#8B5A2B', 5) + '<rect x="20" y="70" width="22" height="8" rx="4" fill="#5E666F"/><rect x="158" y="70" width="22" height="8" rx="4" fill="#5E666F"/>'); },
      function () { return g(3, '<rect x="20" y="92" width="160" height="34" rx="6" fill="#B9AE9A"/>' + [44, 80, 116].map(function (x) { return '<rect x="' + x + '" y="100" width="28" height="12" rx="5" fill="' + c + '"/>'; }).join('')) + '<g class="pop"><g transform="translate(150 6) rotate(18) scale(.5)">' + A.crayonShape(c) + '</g></g>'; }
    ];
    return svg('0 0 200 140', scenes[step](), 'film-scene');
  };

  /* ---------- Cốc thí nghiệm (120×150) ---------- */
  A.beaker = function () {
    return svg('0 0 120 150', g(3,
      p('M22 20 H98 L92 138 C92 143 88 146 83 146 H37 C32 146 28 143 28 138 Z', 'rgba(255,255,255,.55)') +
      '<path class="lab-liquid" d="M25 60 H95 L92 138 C92 143 88 146 83 146 H37 C32 146 28 143 28 138 Z"/>' +
      line('M36 34 L38 132', 'rgba(255,255,255,.8)', 4) + line('M18 20 H102')), 'beaker');
  };

  /* ================= TRANH TÔ MÀU (800×600) ================= */
  var INKC = '#2B2722';
  function f(tag, attrs) { return '<' + tag + ' class="f" ' + attrs + '/>'; }
  function l(d) { return '<path class="l" fill="none" d="' + d + '"/>'; }
  function eye(cx, cy, r) { return '<circle class="e" fill="' + INKC + '" stroke="none" cx="' + cx + '" cy="' + cy + '" r="' + (r || 4) + '"/>'; }
  function eyeE(cx, cy, rx, ry) { return '<ellipse class="e" fill="' + INKC + '" stroke="none" cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '"/>'; }
  function fe(cx, cy, rx, ry, rot) { return f('ellipse', 'cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '"' + (rot ? ' transform="rotate(' + rot + ' ' + cx + ' ' + cy + ')"' : '')); }
  function fc(cx, cy, r) { return f('circle', 'cx="' + cx + '" cy="' + cy + '" r="' + r + '"'); }
  function fp(d, extra) { return f('path', 'd="' + d + '"' + (extra || '')); }
  function rays(cx, cy, r1, r2, n) { var s = ''; for (var i = 0; i < n; i++) { var a = i / n * Math.PI * 2; s += l('M' + (cx + r1 * Math.cos(a)).toFixed(1) + ' ' + (cy + r1 * Math.sin(a)).toFixed(1) + ' L' + (cx + r2 * Math.cos(a)).toFixed(1) + ' ' + (cy + r2 * Math.sin(a)).toFixed(1)); } return s; }
  function cloud(tx, ty, s) { return fp('M110 150 C88 150 88 118 114 116 C114 92 152 84 165 104 C176 80 216 82 220 110 C246 108 252 142 228 150 Z', ' transform="translate(' + tx + ' ' + ty + ') scale(' + s + ')"'); }
  function flower(cx, cy) {
    var s = l('M' + cx + ' ' + (cy + 8) + ' L' + cx + ' ' + (cy + 46)) + fe(cx + 10, cy + 34, 5, 10, 45);
    for (var i = 0; i < 5; i++) { var a = -Math.PI / 2 + i * Math.PI * 2 / 5; s += fc((cx + 11 * Math.cos(a)).toFixed(1), (cy + 11 * Math.sin(a)).toFixed(1), 8); }
    return s + fc(cx, cy, 7);
  }
  function blade(bx, by, tx, ty, w) { var mx = (bx + tx) / 2, my = (by + ty) / 2; return fp('M' + (bx - w) + ' ' + by + ' Q' + (mx - 10) + ' ' + my + ' ' + tx + ' ' + ty + ' Q' + (mx + 10) + ' ' + my + ' ' + (bx + w) + ' ' + by + ' Z'); }
  function star(cx, cy, R, r) { var pts = []; for (var i = 0; i < 10; i++) { var rr = i % 2 ? r : R, a = -Math.PI / 2 + i * Math.PI / 5; pts.push((cx + rr * Math.cos(a)).toFixed(1) + ',' + (cy + rr * Math.sin(a)).toFixed(1)); } return f('polygon', 'points="' + pts.join(' ') + '"'); }

  var PAGES = {};
  PAGES.vuon = function () {
    var s = f('rect', 'x="2" y="2" width="796" height="596"') +
      fc(690, 95, 48) + rays(690, 95, 60, 82, 12) +
      cloud(0, 0, 1) + cloud(330, -46, 0.8) +
      fp('M2 330 C130 260 250 270 360 318 C470 262 620 250 798 305 L798 598 L2 598 Z') +
      flower(120, 330) + flower(220, 352) + flower(400, 340) +
      f('rect', 'x="540" y="318" width="252" height="16" rx="3"') + f('rect', 'x="540" y="362" width="252" height="16" rx="3"');
    for (var i = 0; i < 5; i++) { var x = 552 + i * 48; s += fp('M' + x + ' 412 V300 L' + (x + 16) + ' 280 L' + (x + 32) + ' 300 V412 Z'); }
    s += l('M545 300 C580 280 600 322 640 300 C680 280 700 322 770 294');
    [[592, 290], [684, 286], [748, 298]].forEach(function (q) {
      var cx = q[0], cy = q[1];
      s += fe(cx - 18, cy + 12, 5, 9, -50) + fp('M' + cx + ' ' + (cy - 16) + ' C' + (cx + 16) + ' ' + (cy - 16) + ' ' + (cx + 18) + ' ' + (cy + 4) + ' ' + (cx + 8) + ' ' + (cy + 12) + ' C' + (cx + 4) + ' ' + (cy + 16) + ' ' + (cx - 4) + ' ' + (cy + 16) + ' ' + (cx - 8) + ' ' + (cy + 12) + ' C' + (cx - 18) + ' ' + (cy + 4) + ' ' + (cx - 16) + ' ' + (cy - 16) + ' ' + cx + ' ' + (cy - 16) + ' Z') + fe(cx, cy + 2, 4, 8);
    });
    s += fp('M2 432 C200 406 600 406 798 432 L798 598 L2 598 Z') +
      l('M30 590 C200 572 420 574 600 590') + l('M260 470 C330 462 400 462 440 470');
    // cà rốt
    s += fe(52, 474, 9, 26, -30) + fe(70, 466, 9, 28) + fe(88, 476, 9, 26, 30) +
      fp('M46 500 C60 492 84 492 98 500 C100 520 82 560 74 584 C72 590 70 590 68 584 C58 560 42 520 46 500 Z') +
      l('M58 520 l12 3') + l('M88 540 l-12 3') + l('M64 560 l10 2');
    // củ dền
    s += l('M188 488 Q176 460 166 448') + l('M192 488 L194 442') + l('M196 488 Q210 462 222 452') +
      fe(160, 440, 10, 22, -35) + fe(194, 428, 10, 22) + fe(228, 442, 10, 22, 35) +
      fp('M192 486 C222 486 232 506 228 524 C224 540 208 548 196 550 L190 550 C178 548 160 540 156 524 C152 506 164 486 192 486 Z') +
      l('M193 550 Q196 560 190 568');
    // bắp cải tím
    s += fc(330, 512, 56) + fp('M276 522 C268 480 292 454 322 454 C300 472 292 498 298 532 Z') + fp('M384 522 C392 480 368 454 338 454 C360 472 368 498 362 532 Z') +
      fc(330, 518, 30) + l('M330 560 Q326 534 330 494');
    // cây nghệ
    s += fe(448, 412, 16, 48, -25) + fe(474, 396, 16, 52) + fe(500, 412, 16, 48, 25) +
      l('M462 450 L440 380') + l('M474 446 L474 350') + l('M486 450 L508 380') +
      fp('M450 470 C448 456 468 450 478 458 C490 452 504 460 500 472 C496 484 470 486 458 482 C452 480 449 476 450 470 Z');
    // bụi lá dứa
    [[578, 384], [604, 352], [640, 342], [676, 354], [702, 386]].forEach(function (t) { s += blade(640, 482, t[0], t[1], 7); });
    // bướm
    s += fe(282, 178, 20, 16, -20) + fe(318, 178, 20, 16, 20) + fe(286, 202, 13, 11) + fe(314, 202, 13, 11) + fe(300, 192, 5, 20) +
      l('M298 174 Q292 158 286 156') + l('M302 174 Q308 158 314 156');
    // giun đất
    s += fp('M690 566 C690 552 706 552 712 560 C718 552 732 552 736 562 C740 572 732 580 722 576 C714 584 698 584 692 576 C689 573 690 569 690 566 Z') + eye(728, 563, 2.6);
    return s;
  };

  PAGES.dongvat = function () {
    var s = f('rect', 'x="2" y="2" width="796" height="596"') +
      fc(100, 95, 44) + rays(100, 95, 56, 78, 12) + cloud(300, -40, 0.85) +
      l('M300 130 q12 -12 24 0 q12 -12 24 0') + l('M380 100 q9 -9 18 0 q9 -9 18 0') +
      fp('M2 380 C250 350 550 366 798 382 L798 598 L2 598 Z') +
      // nhà
      fp('M16 256 L115 176 L214 256 Z') + f('rect', 'x="30" y="252" width="170" height="140"') + f('rect', 'x="98" y="318" width="40" height="74" rx="4"') +
      f('rect', 'x="44" y="282" width="38" height="34"') + l('M63 282 V316 M44 299 H82') + f('rect', 'x="150" y="282" width="38" height="34"') + l('M169 282 V316 M150 299 H188') +
      // cây
      fp('M640 402 C646 362 646 300 640 250 L676 250 C670 300 670 362 680 402 Z') +
      fp('M590 252 C560 242 560 190 596 186 C594 150 640 136 660 158 C680 130 730 146 726 184 C760 190 760 246 726 252 Z') +
      fc(612, 216, 11) + fc(662, 188, 11) + fc(706, 222, 11) +
      // ao và vịt
      fe(170, 506, 140, 52) + l('M70 530 q14 -6 28 0') + l('M240 534 q14 -6 28 0') +
      fp('M120 502 C120 480 150 474 176 482 C196 472 214 482 210 496 C206 514 180 522 150 520 C132 519 120 514 120 502 Z') +
      fc(200, 464, 18) + fp('M216 462 L236 467 L216 474 Z') + eye(204, 459, 3) + l('M146 494 Q164 488 180 500');
    // gà mái
    s += fp('M330 422 C300 402 300 372 318 362 C324 382 336 394 352 402 Z') + fe(392, 442, 66, 48) +
      fp('M360 434 C380 422 410 426 420 444 C404 462 376 462 360 452 Z') +
      fp('M436 368 C436 356 446 354 450 362 C452 352 464 352 464 364 C470 360 476 368 470 374 L440 374 Z') +
      fc(450, 392, 26) + fp('M474 388 L492 396 L474 402 Z') + fe(468, 410, 5, 8) + eye(458, 386, 3.5) +
      l('M380 488 L376 514 M376 514 l-10 6 M376 514 l8 6') + l('M404 488 L408 514 M408 514 l-10 6 M408 514 l8 6');
    // gà con
    [[500, 506], [550, 520]].forEach(function (q) {
      var x = q[0], y = q[1];
      s += fc(x, y, 20) + fc(x + 14, y - 22, 13) + fp('M' + (x + 26) + ' ' + (y - 24) + ' L' + (x + 36) + ' ' + (y - 21) + ' L' + (x + 26) + ' ' + (y - 17) + ' Z') + eye(x + 18, y - 25, 2.6) +
        l('M' + (x - 6) + ' ' + (y + 19) + ' l-2 10 M' + (x + 6) + ' ' + (y + 19) + ' l2 10');
    });
    // mèo
    s += fp('M692 522 C742 522 752 482 732 462 C744 488 732 508 696 508 Z') + fe(662, 488, 42, 50) +
      fp('M634 406 L630 368 L658 392 Z') + fp('M690 406 L694 368 L666 392 Z') + fc(662, 422, 34) +
      eyeE(650, 420, 3.5, 5.5) + eyeE(674, 420, 3.5, 5.5) +
      fp('M657 432 L667 432 L662 438 Z') + l('M662 438 Q656 446 650 442 M662 438 Q668 446 674 442') +
      l('M640 434 L618 430 M640 440 L618 444 M684 434 L706 430 M684 440 L706 444') +
      fe(646, 536, 14, 9) + fe(678, 536, 14, 9);
    s += l('M260 590 l-4 -14 M268 590 l2 -16 M276 590 l6 -12') + l('M740 590 l-4 -14 M748 590 l2 -16 M756 590 l6 -12') + flower(250, 380) + flower(560, 378);
    return s;
  };

  PAGES.bien = function () {
    var wave = 'M2 98'; for (var i = 0; i < 16; i++) wave += (i ? ' t50 0' : ' q25 -14 50 0');
    var s = f('rect', 'x="2" y="2" width="796" height="100"') + fc(700, 50, 32) +
      fp(wave + ' L798 598 L2 598 Z') +
      fp('M2 522 C200 490 480 542 798 502 L798 598 L2 598 Z') +
      fe(120, 534, 46, 24) + fe(176, 544, 30, 18) +
      fp('M60 542 C40 502 80 472 56 432 C40 402 70 382 60 352 C84 382 66 402 80 432 C100 472 64 502 76 542 Z') +
      fp('M262 532 C246 498 280 476 262 446 C250 424 272 408 266 386 C286 410 272 428 282 450 C298 480 270 500 278 532 Z') +
      fp('M742 512 C726 476 760 452 742 420 C730 398 752 382 746 360 C766 384 752 402 762 424 C778 456 750 478 758 512 Z') +
      fp('M598 528 C594 500 588 480 574 466 C588 470 596 480 602 494 C604 472 602 456 594 440 C610 452 614 472 612 494 C620 480 630 474 642 474 C630 486 624 502 620 528 Z');
    // cá lớn
    s += fp('M214 174 C222 156 240 158 248 174 Z') + fp('M262 200 L298 176 L294 226 Z') + fe(220, 200, 48, 30) + eye(192, 192, 4) +
      l('M234 174 Q224 200 234 226') + l('M252 180 Q244 200 252 220') + l('M174 204 q6 4 10 0');
    // cá nhỏ
    s += fp('M532 170 L508 154 L510 186 Z') + fe(562, 170, 32, 20) + eye(580, 165, 3) + l('M556 154 Q548 170 556 186');
    s += fp('M612 262 L590 248 L592 276 Z') + fe(638, 262, 28, 17) + eye(654, 258, 3) + l('M632 248 Q626 262 632 276');
    // rùa biển
    s += fe(352, 290, 30, 12, -30) + fe(448, 290, 30, 12, 30) + fe(358, 360, 24, 10, 30) + fe(442, 360, 24, 10, -30) + fp('M394 380 L400 396 L406 380 Z') +
      fe(400, 250, 20, 24) + eye(392, 244, 3) + eye(408, 244, 3) +
      fe(400, 322, 56, 64) + fp('M400 292 L424 306 L424 336 L400 350 L376 336 L376 306 Z') +
      l('M400 292 L400 258 M424 306 L452 296 M424 336 L452 346 M400 350 L400 386 M376 336 L348 346 M376 306 L348 296');
    // sứa
    s += fp('M80 262 C80 222 140 222 140 262 C130 268 120 264 110 268 C100 264 90 268 80 262 Z') +
      l('M90 268 q-6 16 0 32 q6 16 0 32') + l('M110 270 q-6 16 0 32 q6 16 0 32') + l('M130 268 q-6 16 0 32 q6 16 0 32');
    // sao biển, cua
    s += star(330, 552, 26, 11);
    s += l('M458 550 l-16 10 M458 556 l-16 14 M502 550 l16 10 M502 556 l16 14') + l('M470 528 L466 512 M490 528 L494 512') +
      fc(446, 524, 11) + fc(514, 524, 11) + fe(480, 544, 30, 18) + eye(466, 510, 3.2) + eye(494, 510, 3.2);
    // bong bóng
    [[300, 150, 8], [312, 128, 6], [470, 200, 9], [480, 176, 6], [720, 300, 10], [706, 274, 6], [160, 400, 7]].forEach(function (b) { s += fc(b[0], b[1], b[2]); });
    // rác lạc vào biển (bé nhặt lên)
    s += '<g class="trash" data-trash="tui">' + fp('M150 132 L210 132 L216 198 C200 206 160 206 144 198 Z') + l('M162 132 C162 112 178 112 178 132') + l('M184 132 C184 112 200 112 200 132') + '</g>';
    s += '<g class="trash" data-trash="chai" transform="rotate(28 660 420)">' + fp('M648 380 L672 380 L672 392 C684 398 686 406 686 414 L686 458 C686 462 684 464 680 464 L640 464 C636 464 634 462 634 458 L634 414 C634 406 636 398 648 392 Z') +
      f('rect', 'x="650" y="368" width="20" height="12" rx="3"') + f('rect', 'x="634" y="420" width="52" height="18"') + '</g>';
    return s;
  };

  PAGES.trang = function () { return f('rect', 'x="2" y="2" width="796" height="596"'); };

  A.pageInner = function (id) {
    return '<g fill="#FFFFFF" stroke="' + INKC + '" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">' + PAGES[id]() + '</g>';
  };
  A.INKC = INKC;
})();
