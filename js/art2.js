/* ECOCRAYON – hình minh họa cho Thế giới khám phá:
   nhân vật 4 vùng đất, con vật, cây cối, vật liệu và sản phẩm tái chế, bản đồ, cảnh trò chơi.
   Cùng phong cách nét chì than + màu sáp như art.js. */
(function () {
  var A = EC.art, H = A.h, svg = H.svg, g = H.g, el = H.el, ci = H.ci, p = H.p, line = H.line;
  var INK = 'currentColor', X = A.EXTRA;
  function dot(cx, cy, r, fill) { return ci(cx, cy, r, fill || INK, ' stroke="none"'); }
  function nest(id, x, y, size) {
    var o = A.innerOf(id); if (!o) return '';
    return '<svg x="' + x + '" y="' + y + '" width="' + size + '" height="' + size + '" viewBox="' + o.vb + '" overflow="visible">' + o.inner + '</svg>';
  }
  A.nest = nest;

  /* ================= CON VẬT, CÂY CỐI, THIÊN NHIÊN (64×64) ================= */
  X.fish = function () {
    return g(2.6, p('M16 32 L4 20 L6 44 Z', '#F2A516') + p('M30 21 Q36 9 44 20', '#F2A516') + el(36, 32, 20, 13, '#F08A24') +
      line('M28 21 Q24 32 28 43', '#FFFFFF', 3.5) + line('M44 21 Q40 32 44 43', '#FFFFFF', 3)) + dot(48, 29, 2.6);
  };
  X.turtle = function () {
    return g(2.6, el(20, 47, 9, 4.5, '#6CB04F', 25) + el(42, 47, 9, 4.5, '#6CB04F', -25) + el(52, 34, 8, 6.5, '#6CB04F') +
      p('M8 42 C8 24 20 14 30 14 C42 14 50 24 50 42 Z', '#4C9A3B') +
      line('M16 42 L20 28 L30 22 L40 28 L44 42', '#2E6B24', 2) + line('M20 28 L40 28 M30 22 L30 42', '#2E6B24', 2)) + dot(55, 32, 1.8);
  };
  X.crab = function () {
    return g(2.4, line('M18 44 l-9 7 M17 39 l-11 1 M46 44 l9 7 M47 39 l11 1') + line('M22 32 L15 24 M42 32 L49 24') +
      p('M7 20 C7 12 17 12 18 18 L13 21 L18 25 C16 30 7 28 7 20 Z', '#E0412F') +
      p('M57 20 C57 12 47 12 46 18 L51 21 L46 25 C48 30 57 28 57 20 Z', '#E0412F') +
      el(32, 40, 19, 12, '#E0412F') + line('M27 30 L26 22 M37 30 L38 22') + ci(26, 20, 3.4, '#FFFFFF') + ci(38, 20, 3.4, '#FFFFFF')) +
      dot(26, 20, 1.5) + dot(38, 20, 1.5) + line('M28 44 Q32 47 36 44', null, 2);
  };
  X.jelly = function () {
    return g(2.4, line('M22 38 q-4 8 0 14 q4 6 0 10 M32 40 q-4 8 0 14 q4 6 0 8 M42 38 q-4 8 0 14 q4 6 0 10', '#C46BB0', 2.4) +
      p('M12 38 C12 14 52 14 52 38 C46 42 40 38 32 41 C24 38 18 42 12 38 Z', '#F2A0D0')) +
      dot(26, 29, 2) + dot(38, 29, 2) + line('M29 33 Q32 35 35 33', null, 1.8);
  };
  X.bird = function () {
    return g(2.6, p('M12 30 L2 24 L4 40 Z', '#2F62B0') + el(28, 36, 18, 14, '#5B9BD5') + ci(44, 24, 10, '#5B9BD5') +
      p('M53 21 L62 25 L53 29 Z', '#F2A516') + p('M17 34 Q28 23 39 34 Q28 43 17 34 Z', '#2F62B0') + line('M24 50 l-2 8 M32 50 l2 8')) + dot(47, 22, 2.4);
  };
  X.bee = function () {
    return g(2.4, el(25, 22, 8, 12, '#EAF4FB', -20) + el(38, 22, 8, 12, '#EAF4FB', 20) + line('M10 40 L3 40') +
      el(30, 40, 20, 13, '#F2C230') + line('M24 28 Q20 40 24 52', '#2B2722', 4) + line('M34 27 Q30 40 34 53', '#2B2722', 4) +
      ci(50, 38, 9, '#2B2722') + line('M52 30 Q54 22 58 20', null, 2)) + dot(53, 36, 2, '#FFFFFF');
  };
  X.butterfly = function () {
    return g(2.4, el(20, 22, 13, 11, '#E57AA6', -25) + el(44, 22, 13, 11, '#E57AA6', 25) + el(22, 42, 10, 9, '#F2C230', 20) +
      el(42, 42, 10, 9, '#F2C230', -20) + el(32, 32, 3.5, 17, '#2B2722') + line('M30 16 Q26 8 22 6 M34 16 Q38 8 42 6', null, 2)) +
      dot(18, 22, 3.5, '#FFFFFF') + dot(46, 22, 3.5, '#FFFFFF');
  };
  X.rabbit = function () {
    return g(2.6, el(25, 14, 5, 13, '#F3EFE4', -12) + el(39, 14, 5, 13, '#F3EFE4', 12) + el(32, 46, 17, 14, '#F3EFE4') +
      ci(14, 50, 5, '#FFFFFF') + ci(32, 30, 12, '#F3EFE4') + el(26, 58, 6, 3.5, '#F3EFE4') + el(38, 58, 6, 3.5, '#F3EFE4')) +
      el(25, 14, 2, 8, '#F2A0A0', -12, ' stroke="none"') + el(39, 14, 2, 8, '#F2A0A0', 12, ' stroke="none"') +
      dot(27, 28, 2.2) + dot(37, 28, 2.2) + el(32, 33, 2, 1.5, '#E57AA6', 0, ' stroke="none"') + line('M30 36 Q32 38 34 36', null, 1.6);
  };
  X.frog = function () {
    return g(2.6, el(14, 56, 8, 4, '#4C9A3B') + el(50, 56, 8, 4, '#4C9A3B') + el(32, 42, 22, 15, '#6CB04F') + ci(21, 26, 8, '#6CB04F') + ci(43, 26, 8, '#6CB04F')) +
      dot(21, 26, 4.4, '#FFFFFF') + dot(43, 26, 4.4, '#FFFFFF') + dot(22, 27, 2.4) + dot(44, 27, 2.4) +
      line('M22 42 Q32 50 42 42', null, 2.2) + ci(17, 45, 3, '#F2A0A0', ' opacity=".7"') + ci(47, 45, 3, '#F2A0A0', ' opacity=".7"');
  };
  X.tree = function () {
    return g(2.6, p('M27 60 C29 50 29 42 28 34 L36 34 C35 42 35 50 37 60 Z', '#8B5A2B') + ci(20, 32, 12, '#4C9A3B') + ci(44, 32, 12, '#4C9A3B') +
      ci(32, 18, 14, '#5DA34A') + ci(32, 32, 11, '#5DA34A', ' stroke="none"'));
  };
  X.flower = function () {
    var s = line('M32 34 L32 60', '#3E8530', 3) + el(40, 50, 7, 3.5, '#5DA34A', -30);
    for (var i = 0; i < 5; i++) { var a = -Math.PI / 2 + i * Math.PI * 2 / 5; s += ci((32 + 10 * Math.cos(a)).toFixed(1), (24 + 10 * Math.sin(a)).toFixed(1), 8, '#E57AA6'); }
    return g(2.4, s + ci(32, 24, 6.5, '#F2C230'));
  };
  X.mushroom = function () {
    return g(2.6, p('M24 34 L22 56 C22 59 42 59 42 56 L40 34 Z', '#F3EFE4') + p('M6 36 C6 16 22 8 32 8 C42 8 58 16 58 36 Z', '#D7263D')) +
      dot(20, 24, 4, '#FFFFFF') + dot(36, 16, 3.5, '#FFFFFF') + dot(44, 28, 4.5, '#FFFFFF') + dot(28, 31, 2.5, '#FFFFFF');
  };
  X.seed = function () {
    return g(2.6, p('M12 10 L48 10 L46 56 L14 56 Z', '#F3EFE4') + p('M12 10 L48 10 L48 19 L12 19 Z', '#E3A21A') +
      line('M30 46 L30 32', '#3E8530', 2.6) + el(24, 31, 6, 3.5, '#6CB04F', -25) + el(36, 29, 6, 3.5, '#5DA34A', 25) + el(30, 47, 9, 3, '#8B6A43') +
      el(54, 48, 3.5, 5, '#A0703A', 20) + el(51, 58, 3.5, 5, '#A0703A', -30));
  };
  X.sprout = function () {
    return g(2.6, line('M32 48 Q30 36 32 24', '#3E8530', 3) + el(22, 24, 10, 5.5, '#6CB04F', -30) + el(42, 20, 10, 5.5, '#5DA34A', 30) +
      p('M8 56 C16 44 48 44 56 56 Z', '#8B6A43'));
  };
  X.sun = function () {
    var r = '';
    for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4; r += 'M' + (32 + 20 * Math.cos(a)).toFixed(1) + ' ' + (32 + 20 * Math.sin(a)).toFixed(1) + ' L' + (32 + 29 * Math.cos(a)).toFixed(1) + ' ' + (32 + 29 * Math.sin(a)).toFixed(1) + ' '; }
    return g(2.6, line(r, '#E3A21A', 4) + ci(32, 32, 15, '#F2C230')) + dot(27, 30, 1.9) + dot(37, 30, 1.9) + line('M27 36 Q32 40 37 36', null, 1.8);
  };
  X.cloudrain = function () {
    return g(2.6, line('M22 46 l-3 9 M32 46 l-3 9 M42 46 l-3 9', '#2F62B0', 3) +
      p('M14 40 C6 40 6 28 15 28 C15 18 28 14 33 21 C37 12 52 14 51 26 C59 26 60 40 51 40 Z', '#DCE6F0'));
  };
  X.drop = function () {
    return g(2.6, p('M32 6 C40 20 50 30 50 42 C50 52 42 58 32 58 C22 58 14 52 14 42 C14 30 24 20 32 6 Z', '#5B9BD5')) + line('M22 40 Q22 32 28 26', '#FFFFFF', 3.5);
  };
  X.earth = function () {
    return g(2.6, ci(32, 32, 26, '#4F8FD9') +
      p('M12 24 C18 16 28 18 28 26 C28 32 20 34 16 38 C12 34 10 28 12 24 Z', '#6CB04F') +
      p('M36 12 C46 12 54 20 56 28 C50 28 44 30 40 26 C36 22 32 16 36 12 Z', '#6CB04F') +
      p('M32 42 C38 38 48 40 50 46 C46 52 38 56 32 52 C30 48 30 44 32 42 Z', '#6CB04F')) + line('M14 30 Q16 18 26 12', 'rgba(255,255,255,.55)', 3);
  };
  X.bulb = function () {
    return g(2.6, p('M32 6 C44 6 52 15 52 26 C52 34 46 38 42 44 L22 44 C18 38 12 34 12 26 C12 15 20 6 32 6 Z', '#F7D154') +
      '<rect x="22" y="44" width="20" height="10" rx="2" fill="#B8BEC6"/>' + line('M24 49 H40') + p('M26 54 H38 L35 59 H29 Z', '#7D8590') +
      line('M26 30 Q32 22 38 30', '#E3A21A', 2.4)) + line('M20 18 Q22 12 28 10', '#FFFFFF', 3);
  };
  X.factory = function () {
    return g(2.6, '<rect x="46" y="12" width="10" height="46" fill="#7D8590"/>' +
      p('M6 58 L6 30 L20 22 L20 30 L34 22 L34 30 L46 22 L46 58 Z', '#B8BEC6') +
      '<rect x="12" y="40" width="8" height="8" fill="#F2C230"/><rect x="25" y="40" width="8" height="8" fill="#F2C230"/><rect x="37" y="40" width="5" height="8" fill="#F2C230"/>' +
      ci(52, 6, 4.5, '#D8D3CA') + ci(59, 0, 3.5, '#D8D3CA'));
  };
  X.bag = function () {
    return g(2.6, line('M22 22 C22 8 30 8 30 22 M34 22 C34 8 42 8 42 22') + p('M14 22 L50 22 L54 56 C40 60 24 60 10 56 Z', '#E2EEF5')) +
      line('M18 32 Q26 40 22 50', '#FFFFFF', 3);
  };
  X.net = function () {
    var s = '';
    for (var i = 0; i < 5; i++) s += 'M' + (10 + i * 11) + ' 6 Q' + (6 + i * 11) + ' 32 ' + (12 + i * 10) + ' 58 ';
    return line(s + 'M6 18 Q32 12 58 18 M6 32 Q32 26 58 32 M8 46 Q32 40 56 46', '#8B6A43', 2.6) + ci(10, 6, 3.5, '#E3A21A', ' stroke="currentColor" stroke-width="2"') + ci(54, 6, 3.5, '#E3A21A', ' stroke="currentColor" stroke-width="2"');
  };
  X.vaivun = function () {
    return g(2.6, p('M8 20 L36 14 L40 38 L12 44 Z', '#E57AA6') + p('M26 28 L56 26 L56 52 L26 54 Z', '#5B9BD5') + p('M14 40 L36 44 L30 60 L8 56 Z', '#F2C230')) +
      line('M14 24 l20 -4 M16 32 l20 -4', '#FFFFFF', 2) + dot(36, 36, 2, '#FFFFFF') + dot(46, 42, 2, '#FFFFFF') + dot(40, 48, 2, '#FFFFFF');
  };
  X.day = function () {
    return g(2.6, ci(32, 32, 20, '#E9D7B0') + line('M14 26 Q32 18 50 28 M13 34 Q32 26 51 36 M16 42 Q32 34 48 44', '#B08A55', 2) + line('M46 46 Q58 52 56 62', '#B08A55', 2.6));
  };
  X.arrow = function () { return '<path d="M8 32 H48 M36 18 L52 32 L36 46" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'; };
  X.bush = function () {
    return g(2.6, ci(15, 42, 14, '#4C9A3B') + ci(49, 42, 14, '#4C9A3B') + ci(32, 34, 17, '#5DA34A') + '<rect x="1" y="42" width="62" height="20" rx="9" fill="#5DA34A"/>') +
      dot(22, 30, 2.6, '#F2A0A0') + dot(44, 38, 2.6, '#F2C230') + dot(30, 48, 2.6, '#FFFFFF');
  };
  X.boat = function () {
    return g(2.6, line('M32 8 L32 44') + p('M34 10 L54 40 L34 40 Z', '#FFFDF7') + p('M30 14 L14 40 L30 40 Z', '#F2A0A0') + p('M6 44 H58 L50 56 H14 Z', '#C8743A'));
  };

  /* Sản phẩm tái chế (Nhà phát minh tí hon) */
  X['p-penholder'] = function () {
    return g(2.4, p('M17 26 L19 10 L21 26 Z', '#B8336A') + p('M27 26 L29 6 L31 26 Z', '#2F62B0') + p('M37 26 L39 10 L41 26 Z', '#E3A21A') +
      '<rect x="14" y="26" width="34" height="32" fill="#C8A06A"/>' + el(31, 58, 17, 4, '#C8A06A') + el(31, 26, 17, 4, '#DDBB86') +
      ci(23, 42, 4, '#6CB04F') + ci(37, 39, 4, '#E57AA6') + line('M20 50 Q31 46 42 50', '#4C9A3B', 2));
  };
  X['p-pot'] = function () {
    return g(2.6, line('M32 36 Q30 24 32 14', '#3E8530', 3) + el(23, 18, 9, 5, '#6CB04F', -30) + el(41, 14, 9, 5, '#5DA34A', 25) +
      p('M14 34 L50 34 L46 58 L18 58 Z', '#BFE3F2') + el(32, 34, 18, 4, '#8B6A43') + line('M18 46 L46 46', '#7FC36B', 4));
  };
  X['p-car'] = function () {
    return g(2.6, p('M8 26 L40 26 L40 34 L56 34 L56 48 L8 48 Z', '#C99A5B') + '<rect x="13" y="30" width="10" height="8" fill="#BFE3F2"/><rect x="27" y="30" width="9" height="8" fill="#BFE3F2"/>' +
      ci(18, 50, 7, '#E0412F') + ci(46, 50, 7, '#2F62B0')) + dot(18, 50, 2.4, '#FFFFFF') + dot(46, 50, 2.4, '#FFFFFF');
  };
  X['p-phone'] = function () {
    return g(2.6, line('M24 32 Q32 42 40 32', '#B08A55', 2) + '<rect x="4" y="22" width="18" height="20" rx="3" fill="#D7263D"/><rect x="42" y="22" width="18" height="20" rx="3" fill="#2F62B0"/>' +
      el(22, 32, 3, 10, '#C8CDD3') + el(42, 32, 3, 10, '#C8CDD3')) + line('M8 26 L8 38', 'rgba(255,255,255,.6)', 2);
  };
  X['p-bag'] = function () {
    return g(2.6, line('M22 24 C22 8 42 8 42 24', '#8B5A2B', 3) + p('M10 24 H54 L50 58 H14 Z', '#E9D7B0') + ci(32, 41, 8, '#E57AA6')) + dot(32, 41, 3, '#F2C230');
  };
  X['p-sprout'] = function () {
    return g(2.6, line('M32 34 Q30 24 32 16', '#3E8530', 3) + el(24, 20, 8, 4.5, '#6CB04F', -30) + el(40, 17, 8, 4.5, '#5DA34A', 25) +
      p('M16 34 L48 34 L44 58 L20 58 Z', '#FFFFFF') + '<rect x="18" y="42" width="28" height="7" fill="#F2A0A0" stroke="none"/>' + el(32, 34, 16, 3.5, '#8B6A43'));
  };

  /* Biểu tượng nhỏ cho thanh điều hướng */
  X['i-map'] = function () {
    return g(2.6, p('M6 14 L22 8 L42 14 L58 8 L58 50 L42 56 L22 50 L6 56 Z', '#F3E7CC') + line('M22 8 L22 50 M42 14 L42 56') +
      line('M12 40 Q22 26 32 34 T52 20', '#B8336A', 2.6)) + ci(52, 20, 4, '#B8336A', ' stroke="currentColor" stroke-width="2"');
  };
  X['i-passport'] = function () {
    return g(2.6, '<rect x="12" y="6" width="40" height="52" rx="5" fill="#2F62B0"/>') +
      '<g fill="none" stroke="#F2C230" stroke-width="2.4" stroke-linecap="round"><circle cx="32" cy="28" r="10"/><path d="M22 28 H42 M32 18 C27 23 27 33 32 38 C37 33 37 23 32 18 M22 46 H42"/></g>';
  };
  X['i-home'] = function () {
    return g(2.6, p('M8 30 L32 10 L56 30', 'none') + p('M14 26 L14 56 L50 56 L50 26 L32 12 Z', '#F6D9A8') + '<rect x="26" y="38" width="12" height="18" rx="2" fill="#4C9A3B"/>');
  };
  X['i-guide'] = function () {
    return g(2.6, p('M32 16 C24 10 14 10 8 12 V50 C14 48 24 48 32 54 Z', '#F7F1E3') + p('M32 16 C40 10 50 10 56 12 V50 C50 48 40 48 32 54 Z', '#DCEED3')) +
      '<text x="44" y="40" text-anchor="middle" font-size="20" font-weight="700" fill="#2B2722" font-family="Mali, sans-serif">?</text>';
  };

  /* ================= NHÂN VẬT DẪN ĐƯỜNG (120×160) ================= */
  function face(cx, cy, mood) {
    var mouths = {
      happy: line('M' + (cx - 7) + ' ' + (cy + 10) + ' Q' + cx + ' ' + (cy + 17) + ' ' + (cx + 7) + ' ' + (cy + 10)),
      wow: el(cx, cy + 12, 4, 5, '#7A2E2E'),
      sad: line('M' + (cx - 6) + ' ' + (cy + 14) + ' Q' + cx + ' ' + (cy + 8) + ' ' + (cx + 6) + ' ' + (cy + 14)),
      think: line('M' + (cx - 5) + ' ' + (cy + 12) + ' L' + (cx + 5) + ' ' + (cy + 11))
    };
    var eyes = mood === 'think'
      ? ci(cx - 7, cy - 3, 3.6, INK) + ci(cx + 9, cy - 3, 3.6, INK)
      : ci(cx - 8, cy, 4.2, INK) + ci(cx + 8, cy, 4.2, INK) + ci(cx - 6.5, cy - 1.5, 1.3, '#FFFFFF', ' stroke="none"') + ci(cx + 9.5, cy - 1.5, 1.3, '#FFFFFF', ' stroke="none"');
    return ci(cx - 14, cy + 10, 4.5, '#F2A0A0', ' opacity=".8"') + ci(cx + 14, cy + 10, 4.5, '#F2A0A0', ' opacity=".8"') +
      '<g stroke="' + INK + '" stroke-width="3" stroke-linecap="round" fill="none">' + eyes + (mouths[mood] || mouths.happy) + '</g>';
  }
  var CH = {
    /* Mầm Xanh – người bạn thực vật (Vương quốc sắc màu) */
    mam: function (mood) {
      return g(3,
        line('M60 52 Q57 38 60 26', '#3E7A2E', 3.5) + el(45, 30, 13, 7, '#6CB04F', -28) + el(75, 26, 13, 7, '#5DA34A', 24) + ci(60, 20, 6, '#F2A0A0') +
        line('M30 100 Q16 96 12 84') + line('M90 100 Q104 96 108 86') + ci(11, 82, 5.5, '#8CC66A') + ci(109, 84, 5.5, '#8CC66A') +
        el(47, 148, 11, 6, '#4C9A3B') + el(73, 148, 11, 6, '#4C9A3B') +
        p('M60 50 C88 50 98 78 96 102 C94 128 80 146 60 146 C40 146 26 128 24 102 C22 78 32 50 60 50 Z', '#8CC66A')) +
        el(60, 124, 20, 15, '#C8E6B0', 0, ' stroke="none"') + face(60, 90, mood);
    },
    /* Giáo sư ECO (Phòng thí nghiệm phép thuật) */
    eco: function (mood) {
      return g(3,
        line('M34 118 Q20 112 16 100') + ci(15, 97, 5.5, '#F3EFE4') +
        p('M40 54 L57 23 Q60 18 63 23 L80 54 Z', '#2F62B0') +
        '<rect x="38" y="52" width="44" height="92" rx="9" fill="#2F62B0"/><rect x="38" y="64" width="44" height="40" fill="#E9D7B0"/>' +
        el(49, 150, 10, 6, '#1F4A8C') + el(71, 150, 10, 6, '#1F4A8C') +
        p('M30 148 L33 112 Q35 104 44 104 L52 104 L60 120 L68 104 L76 104 Q85 104 87 112 L90 148 Z', '#FFFFFF') +
        p('M51 106 L60 111 L51 116 Z M69 106 L60 111 L69 116 Z', '#B8336A') +
        line('M86 118 Q98 112 100 100') +
        p('M95 72 H107 M98 72 V82 L91 96 C90 99 92 100 94 100 H108 C110 100 112 99 111 96 L104 82 V72', '#F7F1E3') +
        p('M93 92 H109 L111 96 C112 99 110 100 108 100 H94 C92 100 90 99 91 96 Z', '#8A4DB0')) +
        dot(101, 64, 2.4, '#B48AD6') + dot(106, 56, 3, '#B48AD6') +
        face(60, 82, mood) +
        '<g fill="none" stroke="' + INK + '" stroke-width="2.4"><circle cx="52" cy="82" r="8.5"/><circle cx="68" cy="82" r="8.5"/></g>' +
        line('M46 69 L56 71 M74 69 L64 71', null, 2.6);
    },
    /* Rô-bốt Tái Chế – kỹ sư tái chế (Thành phố tái chế) */
    robo: function (mood) {
      return g(3,
        line('M60 22 L60 10') + ci(60, 8, 5, '#E3A21A') +
        '<rect x="20" y="38" width="10" height="18" rx="3" fill="#7D8590"/><rect x="90" y="38" width="10" height="18" rx="3" fill="#7D8590"/>' +
        '<rect x="28" y="22" width="64" height="50" rx="12" fill="#B8BEC6"/><rect x="36" y="30" width="48" height="34" rx="8" fill="#DCEED3"/>' +
        '<rect x="52" y="72" width="16" height="8" fill="#7D8590"/>' +
        line('M28 92 Q14 98 12 114') + line('M92 92 Q106 98 108 114') + ci(12, 117, 6, '#E3A21A') + ci(108, 117, 6, '#E3A21A') +
        '<rect x="36" y="132" width="16" height="14" fill="#7D8590"/><rect x="68" y="132" width="16" height="14" fill="#7D8590"/>' +
        el(44, 150, 13, 6, '#5E666F') + el(76, 150, 13, 6, '#5E666F') +
        '<rect x="24" y="78" width="72" height="56" rx="12" fill="#A9B0B8"/>' + ci(60, 106, 16, '#4C9A3B')) +
        '<g fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"><path d="M53 100 A8 8 0 0 1 66 99"/><path d="M68 108 A8 8 0 0 1 58 114"/><path d="M52 112 A8 8 0 0 1 51 103"/></g>' +
        dot(36, 88, 3, '#D7263D') + dot(84, 88, 3, '#F2C230') + face(60, 44, mood);
    },
    /* Bạn Trái Đất – người bảo vệ hành tinh (Hành tinh xanh) */
    earth: function (mood) {
      return g(3,
        line('M60 42 Q58 32 62 24', '#3E7A2E', 3) + el(71, 25, 10, 5.5, '#6CB04F', -22) +
        line('M18 100 Q8 96 6 84') + line('M102 100 Q112 96 114 84') + ci(6, 81, 5.5, '#4F8FD9') + ci(114, 81, 5.5, '#4F8FD9') +
        el(46, 140, 11, 6, '#2F62B0') + el(74, 140, 11, 6, '#2F62B0') +
        ci(60, 88, 46, '#4F8FD9') +
        p('M22 74 C30 60 46 62 48 72 C50 80 40 84 34 92 C28 96 20 88 22 74 Z', '#6CB04F') +
        p('M70 48 C84 48 98 60 100 74 C92 74 84 78 78 72 C72 66 66 56 70 48 Z', '#6CB04F') +
        p('M62 114 C72 108 88 110 94 118 C88 128 74 134 64 130 C60 124 58 118 62 114 Z', '#6CB04F')) +
        line('M24 82 Q28 60 46 48', 'rgba(255,255,255,.5)', 4) + face(60, 88, mood);
    },
    /* Bé Sáp siêu anh hùng (trò Siêu anh hùng bảo vệ Trái Đất) */
    hero: function (mood) {
      return p('M42 58 C20 92 18 130 24 152 L96 152 C102 130 100 92 78 58 Z', '#D7263D', ' stroke="currentColor" stroke-width="3" stroke-linejoin="round"') +
        A.mascotInner(mood) + '<g stroke="currentColor" stroke-width="2"><polygon points="60,104 63,111 71,111 65,116 67,123 60,119 53,123 55,116 49,111 57,111" fill="#F2C230"/></g>';
    }
  };
  var HEADBOX = { besap: '6 14 108 108', mam: '6 12 108 108', eco: '6 14 108 108', robo: '6 0 108 108', earth: '6 30 108 108', hero: '6 14 108 108' };
  A.CHARS = ['besap', 'mam', 'eco', 'robo', 'earth', 'hero'];
  A.isChar = function (id) { return A.CHARS.indexOf(id) >= 0; };
  /* Vẽ nhân vật. head = true: chỉ lấy phần đầu (dùng làm ảnh đại diện). */
  A.character = function (id, mood, cls, head) {
    var vb = head ? HEADBOX[id] || HEADBOX.besap : '0 0 120 160';
    if (!id || id === 'besap' || !CH[id]) return A.mascot(mood, cls, vb);
    return svg(vb, CH[id](mood || 'happy'), 'mascot char-' + id + ' ' + (cls || ''));
  };

  /* ================= MẨU GIAO DIỆN ================= */
  A.star = function () { return '<svg class="star-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.8 6 6.5.7-4.9 4.4 1.4 6.4L12 16.9 6.2 20.1l1.4-6.4L2.7 9.3l6.5-.7z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>'; };
  A.medal = function (icon, color, got, label) {
    /* màu có thể là biến CSS (var(--t-...)): đặt qua style vì thuộc tính fill không nhận var() */
    var isVar = got && color && color.indexOf('var(') === 0;
    return svg('0 0 120 140', g(3,
      p('M34 70 L22 132 L44 120 L56 138 L62 80 Z', got ? '#B8336A' : '#CFC6B6') +
      p('M86 70 L98 132 L76 120 L64 138 L58 80 Z', got ? '#2F62B0' : '#CFC6B6') +
      ci(60, 58, 46, got ? '#F2C230' : '#E6DED0') + ci(60, 58, 36, got ? (isVar ? '#FFFDF7' : color || '#FFFDF7') : '#F3EEE5', isVar ? ' style="fill:' + color + '"' : '')) +
      '<g class="medal-ico">' + nest(icon, 31, 29, 58) + '</g>', 'medal' + (got ? ' got' : ''), label);
  };
  A.pot = function (hex) {
    return svg('0 0 64 80', g(2.6, '<rect x="18" y="6" width="28" height="12" rx="3" fill="#8B5A2B"/>' +
      p('M16 18 H48 C54 26 56 34 56 46 V68 C56 74 52 76 46 76 H18 C12 76 8 74 8 68 V46 C8 34 10 26 16 18 Z', hex) +
      '<rect x="15" y="42" width="34" height="16" rx="4" fill="#FFFDF7"/>') + line('M14 28 Q12 36 13 46', 'rgba(255,255,255,.65)', 3), 'pot');
  };

  /* ================= HÌNH MINH HỌA BÀI HỌC ================= */
  function txt(x, y, s, size, anchor) { return '<text x="' + x + '" y="' + y + '" text-anchor="' + (anchor || 'middle') + '" font-size="' + (size || 15) + '" font-weight="700" font-family="Mali, sans-serif" fill="currentColor">' + s + '</text>'; }
  var VIS = {
    primaries: function () {
      return svg('0 0 240 170', '<g style="mix-blend-mode:multiply" stroke="currentColor" stroke-width="3">' + ci(92, 64, 50, '#E8303F', ' fill-opacity=".85"') + ci(148, 64, 50, '#F7CF2E', ' fill-opacity=".85"') + ci(120, 110, 50, '#3A6FC4', ' fill-opacity=".85"') + '</g>' +
        txt(64, 40, 'Đỏ', 15) + txt(178, 40, 'Vàng', 15) + txt(120, 146, 'Xanh dương', 15), 'lvis');
    },
    warmcool: function () {
      var w = ['#D7263D', '#E2702A', '#F2C230'], c = ['#2F62B0', '#4C9A3B', '#6E3C8F'];
      return svg('0 0 280 150', g(2.6, '<rect x="6" y="10" width="128" height="104" rx="16" fill="#FBE3CF"/><rect x="146" y="10" width="128" height="104" rx="16" fill="#DCE8F6"/>' +
        w.map(function (h, i) { return ci(34 + i * 36, 74, 15, h); }).join('') + c.map(function (h, i) { return ci(174 + i * 36, 74, 15, h); }).join('')) +
        nest('sun', 50, 14, 40) + nest('drop', 192, 16, 34) + txt(70, 138, 'Màu nóng', 16) + txt(210, 138, 'Màu lạnh', 16), 'lvis');
    },
    pairs: function () {
      var P2 = [['#D7263D', '#4C9A3B'], ['#2F62B0', '#E2702A'], ['#F2C230', '#6E3C8F']];
      return svg('0 0 280 110', g(2.6, P2.map(function (q, i) { var x = 12 + i * 92; return '<rect x="' + x + '" y="20" width="38" height="60" rx="10" fill="' + q[0] + '"/><rect x="' + (x + 40) + '" y="20" width="38" height="60" rx="10" fill="' + q[1] + '"/>'; }).join('')), 'lvis');
    },
    mixes: function () {
      var R = [['#D7263D', '#F2C230', '#EA7A22'], ['#F2C230', '#2F62B0', '#4C9A3B'], ['#D7263D', '#2F62B0', '#6E3C8F']];
      return svg('0 0 250 170', R.map(function (r, i) { var y = 30 + i * 54; return g(2.6, ci(40, y, 19, r[0]) + ci(116, y, 19, r[1]) + ci(206, y, 22, r[2])) + txt(78, y + 7, '+', 24) + txt(160, y + 7, '=', 24); }).join(''), 'lvis');
    },
    shades: function () {
      var S5 = ['#B7CCEB', '#7A9FD6', '#2F62B0', '#24497F', '#172E52'];
      return svg('0 0 290 120', g(2.6, S5.map(function (h, i) { return '<rect x="' + (12 + i * 54) + '" y="14" width="48" height="56" rx="10" fill="' + h + '"/>'; }).join('')) +
        txt(66, 100, '← thêm trắng', 14) + txt(226, 100, 'thêm đen →', 14), 'lvis');
    },
    painting: function () {
      return svg('0 0 220 160', g(3, '<rect x="6" y="6" width="208" height="148" rx="8" fill="#C8743A"/><rect x="18" y="18" width="184" height="124" fill="#BFE0F3"/>' +
        p('M18 106 C60 80 110 84 150 100 C170 92 190 92 202 98 V142 H18 Z', '#8CC66A') + ci(166, 46, 16, '#F2C230') +
        p('M50 112 L50 86 L70 70 L90 86 L90 112 Z', '#F2A0A0') + '<rect x="64" y="96" width="12" height="16" fill="#8B5A2B"/>' +
        p('M118 112 C118 96 130 86 140 86 C150 86 160 96 160 112 Z', '#4C9A3B')), 'lvis');
    },
    process: function () {
      var st = [['b-bin', 'Thu gom'], ['b-recycle', 'Phân loại'], ['factory', 'Làm sạch, nghiền'], ['p-bag', 'Đồ mới']];
      return svg('0 0 340 120', st.map(function (s, i) { var x = 8 + i * 88; return nest(s[0], x + 6, 10, 56) + txt(x + 34, 96, s[1], 12.5) + (i < 3 ? nest('arrow', x + 66, 26, 24) : ''); }).join(''), 'lvis');
    },
    ecos: function () {
      var E = [['tree', 'Rừng xanh', '#DCEED3'], ['fish', 'Đại dương', '#D8E3F5'], ['frog', 'Ao hồ', '#E2F0E6']];
      return svg('0 0 330 130', E.map(function (e, i) { var x = 56 + i * 110; return ci(x, 54, 46, e[2], ' stroke="currentColor" stroke-width="3"') + nest(e[0], x - 28, 26, 56) + txt(x, 122, e[1], 14); }).join(''), 'lvis');
    },
    plantparts: function () {
      return svg('0 0 260 220', g(3,
        p('M40 168 C90 158 170 158 220 168 L220 210 L40 210 Z', '#C9A26E') +
        line('M130 168 L122 196 M130 170 L140 200 M128 176 L108 192 M132 176 L156 190', '#8B6A43', 2.6) +
        line('M130 168 C128 130 132 100 130 60', '#3E8530', 5) + el(106, 120, 22, 9, '#6CB04F', -25) + el(154, 104, 22, 9, '#5DA34A', 25) +
        ci(158, 140, 10, '#E2702A') + (function () { var s = ''; for (var i = 0; i < 5; i++) { var a = -Math.PI / 2 + i * Math.PI * 2 / 5; s += ci((130 + 13 * Math.cos(a)).toFixed(1), (52 + 13 * Math.sin(a)).toFixed(1), 10, '#E57AA6'); } return s; })() + ci(130, 52, 8, '#F2C230')) +
        txt(196, 48, 'Hoa', 15, 'start') + txt(196, 150, 'Quả', 15, 'start') + txt(46, 112, 'Lá', 15, 'start') + txt(150, 82, 'Thân', 15, 'start') + txt(58, 202, 'Rễ', 15, 'start'), 'lvis');
    },
    bins: function () {
      return '<div class="lvis-bins">' + EC.BINS.map(function (b) { return '<div>' + A.bin(b) + '<span>' + b.name + '</span></div>'; }).join('') + '</div>';
    }
  };
  A.lessonVis = function (key) { return VIS[key] ? VIS[key]() : ''; };
  A.hasVis = function (key) { return !!VIS[key]; };
  A.VIS_KEYS = Object.keys(VIS);

  /* ================= BẢN ĐỒ 4 VÙNG ĐẤT (1000×620) ================= */
  function plate(cx, py, z) {
    return '<g class="mz-plate"><rect x="' + (cx - 165) + '" y="' + py + '" width="330" height="68" rx="18" fill="#FFFDF7" stroke="currentColor" stroke-width="3"/>' +
      '<text x="' + cx + '" y="' + (py + 30) + '" class="mz-name" text-anchor="middle">' + EC.esc(z.name) + '</text>' +
      '<text x="' + cx + '" y="' + (py + 55) + '" class="mz-sub" text-anchor="middle">' + EC.esc(z.sub || '') + '</text>' +
      (z.done ? '<g transform="translate(' + (cx + 150) + ' ' + (py - 6) + ')"><circle r="22" fill="#F2C230" stroke="currentColor" stroke-width="3"/><path d="M-9 0 L-2 7 L10 -7" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g>' : '') +
      (z.fresh ? '<g transform="translate(' + (cx - 168) + ' ' + (py - 18) + ')"><rect width="64" height="28" rx="10" fill="#D7263D" stroke="currentColor" stroke-width="2.5"/><text x="32" y="20" text-anchor="middle" class="mz-new">MỚI</text></g>' : '') + '</g>';
  }
  var ZART = {
    'sac-mau': function () {
      var cols = ['#D7263D', '#E2702A', '#F2C230', '#4C9A3B', '#2F62B0', '#6E3C8F'], rb = '';
      cols.forEach(function (c, i) { var r = 112 - i * 10; rb += '<path d="M' + (230 - r) + ' 214 A' + r + ' ' + r + ' 0 0 1 ' + (230 + r) + ' 214" fill="none" stroke="' + c + '" stroke-width="10"/>'; });
      return rb + g(3, el(230, 222, 146, 34, '#8CC66A')) + nest('ing-ca-rot', 120, 140, 70) + nest('ing-den', 182, 128, 76) + nest('flower', 262, 156, 62) + nest('sunflower', 300, 150, 60) +
        line('M100 238 l0 -16 M114 240 l0 -16 M346 238 l0 -16 M360 236 l0 -16', '#8B6A43', 3);
    },
    'phep-thuat': function () {
      return g(3, el(770, 232, 140, 22, '#D9C49A') + '<rect x="680" y="130" width="180" height="100" fill="#B48AD6"/>' + p('M690 130 A80 58 0 0 1 850 130 Z', '#8A55AA') +
        line('M770 76 L770 128', '#5B2C83', 3) + '<rect x="752" y="178" width="36" height="52" rx="18" fill="#6E3C8F"/>' + ci(712, 168, 15, '#F2C230') + ci(828, 168, 15, '#F2C230') +
        p('M866 150 H894 M871 150 V172 L856 206 C854 211 857 214 862 214 H898 C903 214 906 211 904 206 L889 172 V150', '#F7F1E3') +
        p('M860 196 H900 L904 206 C906 211 903 214 898 214 H862 C857 214 854 211 856 206 Z', '#4C9A3B')) +
        '<g class="mz-bubbles">' + ci(884, 136, 6, '#B48AD6', ' stroke="currentColor" stroke-width="2"') + ci(874, 118, 4.5, '#B48AD6', ' stroke="currentColor" stroke-width="2"') + ci(890, 102, 7, '#B48AD6', ' stroke="currentColor" stroke-width="2"') + '</g>' +
        '<g fill="#F2C230" stroke="currentColor" stroke-width="2"><path d="M700 86 l4 9 9 1 -7 6 2 9 -8 -5 -8 5 2 -9 -7 -6 9 -1z"/><path d="M838 70 l3 7 7 1 -5 5 1 7 -6 -4 -6 4 1 -7 -5 -5 7 -1z"/></g>';
    },
    'tai-che': function () {
      return g(3, el(230, 494, 150, 24, '#C9B48A') + '<rect x="250" y="374" width="28" height="118" fill="#A9B0B8"/>' +
        p('M112 492 L112 412 L152 386 L152 412 L192 386 L192 412 L232 386 L232 492 Z', '#F39A5E') +
        '<rect x="124" y="458" width="22" height="20" fill="#F2C230"/><rect x="200" y="458" width="22" height="20" fill="#F2C230"/>' +
        ci(172, 440, 26, '#FFFDF7') + p('M296 492 L296 446 L322 424 L348 446 L348 492 Z', '#F2A0A0') + '<rect x="314" y="462" width="16" height="30" fill="#8B5A2B"/>') +
        nest('b-recycle', 150, 418, 44) +
        '<g class="mz-smoke">' + ci(264, 362, 8, '#ECE7DE', ' stroke="currentColor" stroke-width="2.5"') + ci(278, 348, 10, '#ECE7DE', ' stroke="currentColor" stroke-width="2.5"') + ci(294, 334, 12, '#ECE7DE', ' stroke="currentColor" stroke-width="2.5"') + '</g>';
    },
    'hanh-tinh': function () {
      return g(3, el(770, 498, 160, 24, '#9CC9E8')) + nest('tree', 620, 418, 76) + nest('tree', 862, 420, 76) +
        '<svg x="698" y="352" width="144" height="144" viewBox="0 0 64 64" overflow="visible">' + X.earth() + '</svg>' +
        dot(759, 420, 4.5) + dot(781, 420, 4.5) + line('M760 434 Q770 442 780 434', null, 3.5) + nest('bird', 852, 352, 44);
    }
  };
  var ZPOS = { 'sac-mau': [230, 250], 'phep-thuat': [770, 250], 'tai-che': [230, 530], 'hanh-tinh': [770, 530] };
  A.mapPos = ZPOS;
  A.worldMap = function (o) {
    var dec = o.decos || {}, s = '';
    s += '<rect x="6" y="6" width="988" height="608" rx="40" fill="#F4E8CC" stroke="currentColor" stroke-width="3"/>';
    s += '<path d="M600 614 C660 560 800 584 880 544 C930 520 970 528 994 516 L994 574 Q994 614 954 614 Z" fill="#9CC9E8" stroke="currentColor" stroke-width="3"/>';
    s += '<path d="M330 236 C400 300 440 318 500 318 C560 318 600 300 670 236 M500 318 C440 338 380 372 330 420 M500 318 C560 338 620 372 670 420" fill="none" stroke="#B08A55" stroke-width="8" stroke-linecap="round" stroke-dasharray="1 20"/>';
    if (dec['deco-cau-vong']) { ['#D7263D', '#E2702A', '#F2C230', '#4C9A3B', '#2F62B0', '#6E3C8F'].forEach(function (c, i) { var r = 150 - i * 8; s += '<path d="M' + (500 - r) + ' 222 A' + r + ' ' + r + ' 0 0 1 ' + (500 + r) + ' 222" fill="none" stroke="' + c + '" stroke-width="8" opacity=".9"/>'; }); }
    if (dec['deco-khinh-khi-cau']) s += '<g class="mz-balloon">' + g(3, line('M384 96 L392 116 M410 96 L402 116') + ci(397, 70, 30, '#E57AA6') + p('M397 40 C385 52 385 88 397 100 C409 88 409 52 397 40 Z', '#F2C230') + '<rect x="388" y="114" width="18" height="14" rx="3" fill="#C8743A"/>') + '</g>';
    if (dec['deco-dan-chim']) s += '<path d="M600 70 q9 -9 18 0 q9 -9 18 0 M646 96 q7 -7 14 0 q7 -7 14 0 M672 60 q6 -6 12 0 q6 -6 12 0" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>';
    if (dec['deco-thuyen']) s += '<g class="mz-boat">' + nest('boat', 880, 520, 70) + '</g>';
    if (dec['deco-coi-xay-gio']) s += g(3, p('M58 494 L66 400 L86 400 L94 494 Z', '#F3EFE4')) + '<g class="mz-mill" style="transform-origin:76px 398px">' + g(3, p('M76 398 L70 344 L82 344 Z', '#FFFDF7') + p('M76 398 L130 392 L130 404 Z', '#FFFDF7') + p('M76 398 L82 452 L70 452 Z', '#FFFDF7') + p('M76 398 L22 404 L22 392 Z', '#FFFDF7')) + '</g>' + ci(76, 398, 6, '#C8743A', ' stroke="currentColor" stroke-width="3"');
    s += g(3, el(510, 344, 70, 12, '#D9C49A') + '<rect x="494" y="246" width="12" height="96" fill="#8B5A2B"/>' + p('M438 256 H492 V280 H438 L426 268 Z', '#E9D7B0') + p('M508 266 H562 L574 278 L562 290 H508 Z', '#E9D7B0')) +
      '<g transform="translate(524 254) scale(.55)">' + A.mascotInner('happy') + '</g>';
    o.zones.forEach(function (z) {
      var pos = ZPOS[z.id]; if (!pos || !ZART[z.id]) return;
      s += '<a href="' + z.href + '" class="mz mz-' + z.id + '" aria-label="' + EC.esc(z.name + '. ' + (z.sub || '')) + '"><g>' + ZART[z.id]() + plate(pos[0], pos[1], z) + '</g></a>';
    });
    return '<svg class="art worldmap" viewBox="0 0 1000 620" role="group" aria-label="Bản đồ 4 vùng đất ECOCRAYON">' + s + '</svg>';
  };

  /* ================= CẢNH TRÒ CHƠI ================= */
  /* Nhà máy tái chế: càng phân loại đúng, nhà máy càng có màu và chạy lại */
  A.factoryScene = function (pct) {
    var lit = Math.round(pct * 5), win = '';
    for (var i = 0; i < 5; i++) win += '<rect x="' + (52 + i * 38) + '" y="118" width="24" height="22" fill="' + (i < lit ? '#F7D154' : '#5E666F') + '"/>';
    var smoke = pct >= 1
      ? nest('leaf', 270, 6, 26) + nest('flower', 296, -10, 28) + nest('leaf', 250, -14, 22)
      : ci(266, 30, 10, '#8A8A8A') + ci(280, 14, 13, '#8A8A8A') + ci(298, -4, 15, '#8A8A8A');
    var teeth = ''; for (var t = 0; t < 8; t++) teeth += '<rect x="-6" y="-34" width="12" height="12" rx="2" fill="#7D8590" transform="rotate(' + t * 45 + ')"/>';
    return '<svg class="art factory-scene" viewBox="0 0 400 210" aria-hidden="true" style="filter:grayscale(' + (1 - pct).toFixed(2) + ')">' +
      g(3, '<rect x="0" y="180" width="400" height="30" fill="#C9B48A"/><rect x="250" y="40" width="30" height="140" fill="#A9B0B8"/>' +
        p('M36 180 L36 100 L84 72 L84 100 L132 72 L132 100 L180 72 L180 100 L236 72 L236 180 Z', '#F39A5E') + win +
        '<rect x="118" y="146" width="34" height="34" fill="#8B5A2B"/>' + '<rect x="290" y="166" width="104" height="10" rx="5" fill="#5E666F"/>') +
      '<g stroke="currentColor" stroke-width="2.6">' + smoke + '</g>' + nest('b-recycle', 54, 74, 40) +
      '<g class="gear' + (pct > 0 ? ' run' : '') + '" style="transform-origin:340px 128px"><g transform="translate(340 128)" stroke="currentColor" stroke-width="2.6">' + teeth + '<circle r="26" fill="#A9B0B8"/><circle r="8" fill="#5E666F"/></g></g>' +
      '</svg>';
  };
  /* Đáy biển cho trò Giải cứu đại dương (800×500) */
  A.seabed = function () {
    return '<svg class="seabed" viewBox="0 0 800 500" preserveAspectRatio="none" aria-hidden="true">' +
      '<path d="M0 0 H800 V22 Q760 34 720 22 T640 22 T560 22 T480 22 T400 22 T320 22 T240 22 T160 22 T80 22 T0 22 Z" fill="rgba(255,255,255,.35)"/>' +
      '<polygon points="120,0 190,0 300,500 160,500" fill="rgba(255,255,255,.08)"/><polygon points="520,0 580,0 700,500 560,500" fill="rgba(255,255,255,.08)"/>' +
      '<g stroke="#2B2722" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M0 440 C160 410 320 452 480 430 C620 410 720 432 800 420 V500 H0 Z" fill="#E9D7A8"/>' +
      '<path d="M60 446 C40 400 80 380 56 340 C40 312 70 296 62 266 C84 296 66 316 80 342 C100 380 64 410 76 446 Z" fill="#4C9A3B"/>' +
      '<path d="M700 436 C684 400 716 378 700 346 C688 324 710 306 704 286 C724 310 710 328 720 350 C736 382 708 404 716 436 Z" fill="#5DA34A"/>' +
      '<ellipse cx="420" cy="452" rx="44" ry="20" fill="#A9B0B8"/><ellipse cx="470" cy="460" rx="26" ry="14" fill="#C8CDD3"/>' +
      '<path d="M560 452 C556 426 548 410 536 400 C550 404 558 414 562 426 C564 408 562 394 556 380 C570 392 574 410 572 428 C580 416 590 412 600 412 C590 422 584 436 580 452 Z" fill="#F2A0A0"/>' +
      '</g></svg>';
  };
  /* Khu rừng còn trống cho trò Xây dựng khu rừng xanh (800×500) */
  A.forestBg = function () {
    return '<svg class="forest-bg" viewBox="0 0 800 500" preserveAspectRatio="none" aria-hidden="true">' +
      '<rect width="800" height="300" fill="#CFE8F7"/>' +
      '<g stroke="#2B2722" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">' +
      '<circle cx="720" cy="66" r="38" fill="#F2C230"/>' +
      '<path d="M120 90 C100 90 100 62 124 60 C126 40 160 34 170 52 C182 34 214 40 212 62 C236 62 236 90 214 90 Z" fill="#FFFFFF"/>' +
      '<path d="M0 270 C120 220 220 236 320 262 C420 226 560 214 800 258 V320 H0 Z" fill="#B5D99A"/>' +
      '<path d="M0 300 C200 284 600 284 800 300 V500 H0 Z" fill="#9CCB6E"/>' +
      '<ellipse cx="650" cy="412" rx="140" ry="62" fill="#7FB7DE"/>' +
      '<path d="M560 404 q14 -6 28 0 M660 430 q14 -6 28 0 M700 392 q10 -5 20 0" fill="none" stroke="#FFFFFF"/>' +
      '<path d="M60 470 l-4 -14 M68 470 l2 -16 M76 470 l6 -12 M420 330 l-4 -14 M428 330 l2 -16 M436 330 l6 -12 M330 480 l-4 -14 M338 480 l2 -16" fill="none" stroke="#3E8530"/>' +
      '</g></svg>';
  };
})();
