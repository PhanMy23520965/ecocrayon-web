/* ECOCRAYON – lớp dữ liệu, tài khoản và thống kê.
   Trang là web tĩnh (không có máy chủ), nên dữ liệu nằm trong trình duyệt của máy đang dùng:
   - localStorage: các "bảng" Users, PlayerProfiles, PlayerProgress (kèm PlayerBadges, PlayerRewards),
     GameAttempts, QRAccess, thống kê lượt truy cập, nội dung đã chỉnh trong trang Quản trị.
   - IndexedDB: bảng Artwork (tranh của bé, ảnh lớn).
   Không có gì được gửi lên mạng. Tên bảng giữ đúng như kế hoạch để sau này chuyển lên máy chủ dễ dàng. */
(function () {
  'use strict';
  var PFX = 'ecocrayon.';
  function lsGet(k, d) { try { var v = localStorage.getItem(PFX + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(PFX + k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  function lsDel(k) { try { localStorage.removeItem(PFX + k); } catch (e) { /* bỏ qua */ } }
  function ssGet(k, d) { try { var v = sessionStorage.getItem(PFX + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function ssSet(k, v) { try { sessionStorage.setItem(PFX + k, JSON.stringify(v)); } catch (e) { /* bỏ qua */ } }
  function ssDel(k) { try { sessionStorage.removeItem(PFX + k); } catch (e) { /* bỏ qua */ } }
  function clone(o) { return o == null ? o : JSON.parse(JSON.stringify(o)); }
  EC.clone = clone;
  EC.today = function (t) { var d = t ? new Date(t) : new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); };
  EC.fmtDate = function (t, withTime) {
    if (!t) return '';
    var d = new Date(t), s = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
    return withTime ? ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ' · ' + s : s;
  };

  /* ---------- SHA-256 (băm mật khẩu một chiều, không lưu mật khẩu gốc) ---------- */
  function sha256(ascii) {
    function rr(v, a) { return (v >>> a) | (v << (32 - a)); }
    var maxWord = Math.pow(2, 32), i, j, result = '', words = [], bitLen = ascii.length * 8;
    var hash = sha256.h = sha256.h || [], k = sha256.k = sha256.k || [], pc = k.length, isComp = {};
    for (var cand = 2; pc < 64; cand++) {
      if (!isComp[cand]) {
        for (i = 0; i < 313; i += cand) isComp[i] = cand;
        hash[pc] = (Math.pow(cand, 0.5) * maxWord) | 0;
        k[pc++] = (Math.pow(cand, 1 / 3) * maxWord) | 0;
      }
    }
    ascii += '\x80';
    while (ascii.length % 64 - 56) ascii += '\x00';
    for (i = 0; i < ascii.length; i++) { j = ascii.charCodeAt(i); if (j >> 8) return ''; words[i >> 2] |= j << ((3 - i) % 4) * 8; }
    words[words.length] = ((bitLen / maxWord) | 0);
    words[words.length] = bitLen;
    for (j = 0; j < words.length;) {
      var w = words.slice(j, j += 16), oldHash = hash;
      hash = hash.slice(0, 8);
      for (i = 0; i < 64; i++) {
        var w15 = w[i - 15], w2 = w[i - 2], a = hash[0], e = hash[4];
        var t1 = hash[7] + (rr(e, 6) ^ rr(e, 11) ^ rr(e, 25)) + ((e & hash[5]) ^ ((~e) & hash[6])) + k[i] +
          (w[i] = (i < 16) ? w[i] : (w[i - 16] + (rr(w15, 7) ^ rr(w15, 18) ^ (w15 >>> 3)) + w[i - 7] + (rr(w2, 17) ^ rr(w2, 19) ^ (w2 >>> 10))) | 0);
        var t2 = (rr(a, 2) ^ rr(a, 13) ^ rr(a, 22)) + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
        hash = [(t1 + t2) | 0].concat(hash);
        hash[4] = (hash[4] + t1) | 0;
      }
      for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
    }
    for (i = 0; i < 8; i++) for (j = 3; j + 1; j--) { var b = (hash[i] >> (j * 8)) & 255; result += (b < 16 ? '0' : '') + b.toString(16); }
    return result;
  }
  function utf8(s) { return unescape(encodeURIComponent(String(s))); }
  EC.sha256 = function (s) { return sha256(utf8(s)); };
  function hashPw(pw, salt) { var h = salt + '|' + pw; for (var i = 0; i < 300; i++) h = sha256(utf8(h + '|' + salt)); return h; }
  function rand(n) {
    var a = new Uint8Array(n || 12);
    try { window.crypto.getRandomValues(a); } catch (e) { for (var i = 0; i < a.length; i++) a[i] = Math.random() * 256 | 0; }
    return Array.prototype.map.call(a, function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
  }

  /* ---------- Các bảng (đọc một lần, ghi ngay khi đổi) ---------- */
  var cache = {}, CC = null;
  function col(name, def) { if (!(name in cache)) { var v = lsGet('db.' + name, null); cache[name] = v == null ? clone(def) : v; } return cache[name]; }
  function save(name) {
    if (!(name in cache)) return true;
    var ok = lsSet('db.' + name, cache[name]);
    if (!ok && EC.toast) EC.toast('Bộ nhớ trình duyệt đã đầy. Hãy xóa bớt tranh cũ trong Bộ sưu tập.');
    return ok;
  }
  window.addEventListener('storage', function (e) {
    if (!e.key || e.key.indexOf(PFX) !== 0) return;
    if (e.key.indexOf(PFX + 'db.') === 0) delete cache[e.key.slice(PFX.length + 3)];
    if (e.key === PFX + 'db.content') CC = null;
    if (e.key === PFX + 'session') { curPid = null; }
    document.dispatchEvent(new CustomEvent('ec:progress'));
  });

  function newProgress() {
    return { xp: 0, level: 0, lessons: {}, quiz: {}, games: {}, badges: {}, rewards: {}, visited: {}, cards: {}, inventions: {}, stickers: {}, done: {}, title: 0, created: Date.now() };
  }
  function fixProgress(p) { var d = newProgress(); for (var k in d) if (p[k] == null) p[k] = d[k]; return p; }

  var DB = EC.db = {
    col: col, save: save,
    users: function () { return col('users', {}); },              /* Users */
    profiles: function () { return col('profiles', {}); },        /* PlayerProfiles */
    progressAll: function () { return col('progress', {}); },     /* PlayerProgress + PlayerBadges + PlayerRewards */
    attempts: function () { return col('attempts', []); },        /* GameAttempts */
    qr: function () { return col('qr', []); },                    /* QRAccess */
    stats: function () {
      var s = col('stats', {});
      s.visits = s.visits || 0; s.days = s.days || {}; s.starts = s.starts || {}; s.zoneVisits = s.zoneVisits || {}; s.lessonViews = s.lessonViews || {};
      return s;
    },
    newProgress: newProgress,
    progress: function (pid) { var all = col('progress', {}); if (!all[pid]) all[pid] = newProgress(); return fixProgress(all[pid]); },
    addAttempt: function (a) { var L = DB.attempts(); L.push(a); if (L.length > 3000) L.splice(0, L.length - 3000); save('attempts'); },
    attemptsOf: function (pid) { return DB.attempts().filter(function (a) { return a.playerId === pid; }); },
    uid: function (p) { return (p || 'id') + '-' + Date.now().toString(36) + '-' + rand(3); },
    TABLES: ['users', 'profiles', 'progress', 'attempts', 'qr', 'stats', 'content', 'admin'],
    exportAll: function () {
      var out = { app: 'ECOCRAYON', version: 2, exportedAt: new Date().toISOString(), tables: {} };
      DB.TABLES.forEach(function (k) { out.tables[k] = lsGet('db.' + k, null); });
      return out;
    },
    importAll: function (data) {
      if (!data || data.app !== 'ECOCRAYON' || !data.tables) throw new Error('File không phải bản sao lưu ECOCRAYON.');
      Object.keys(data.tables).forEach(function (k) { if (DB.TABLES.indexOf(k) >= 0 && data.tables[k] != null) lsSet('db.' + k, data.tables[k]); });
      cache = {}; CC = null; curPid = null;
    },
    wipePlayers: function () {
      ['users', 'profiles', 'progress', 'attempts', 'qr', 'stats'].forEach(function (k) { lsDel('db.' + k); });
      lsDel('session'); ssDel('session'); cache = {}; curPid = null;
    },
    raw: { get: lsGet, set: lsSet, del: lsDel, sget: ssGet, sset: ssSet, sdel: ssDel }
  };

  /* ---------- Hồ sơ "chơi thử" khi chưa đăng nhập ---------- */
  function guestProfile() {
    var P = DB.profiles();
    if (!P.guest) P.guest = { id: 'guest', displayName: 'Bạn nhỏ', playerName: '', avatar: 'besap', frame: '', theme: '', guest: true };
    return P.guest;
  }

  /* ---------- Tài khoản ---------- */
  var curPid = null;
  function clearSession() { lsDel('session'); ssDel('session'); }
  function readSession() {
    var s = ssGet('session', null) || lsGet('session', null);
    if (!s || !s.uid) return null;
    if (s.exp && s.exp < Date.now()) { clearSession(); return null; }
    var u = DB.users()[s.uid];
    if (!u || u.token !== s.token || u.locked) { clearSession(); return null; }
    return s;
  }
  function fire() { document.dispatchEvent(new CustomEvent('ec:auth')); document.dispatchEvent(new CustomEvent('ec:progress')); }
  function startSession(uid, remember) {
    var u = DB.users()[uid], s = { uid: uid, token: u.token, exp: remember ? Date.now() + 30 * 864e5 : 0 };
    clearSession(); if (remember) lsSet('session', s); else ssSet('session', s);
    curPid = uid; fire();
  }
  function trimTo(s, n) { return String(s || '').replace(/\s+/g, ' ').trim().slice(0, n); }

  var AUTH = EC.auth = {
    pid: function () { if (curPid == null) { var s = readSession(); curPid = s ? s.uid : 'guest'; } return curPid; },
    user: function () { var p = AUTH.pid(); return p === 'guest' ? null : (DB.users()[p] || null); },
    isGuest: function () { return AUTH.pid() === 'guest'; },
    profile: function (pid) { pid = pid || AUTH.pid(); return pid === 'guest' ? guestProfile() : (DB.profiles()[pid] || guestProfile()); },
    saveProfile: function () { save('profiles'); fire(); },
    validUsername: function (u) { return /^[a-z0-9_.]{3,20}$/.test(u); },
    findByUsername: function (name) {
      name = String(name || '').trim().toLowerCase(); var U = DB.users();
      for (var k in U) if (U[k].username === name) return U[k];
      return null;
    },
    guestHasProgress: function () { var g = DB.progressAll().guest; return !!(g && (g.xp > 0 || Object.keys(g.games || {}).length)); },
    register: function (o) {
      var username = String(o.username || '').trim().toLowerCase();
      if (!trimTo(o.displayName, 30)) return { err: 'Hãy chọn một tên hiển thị cho bé.', field: 'displayName' };
      if (!AUTH.validUsername(username)) return { err: 'Tên đăng nhập gồm 3–20 ký tự: chữ thường không dấu, số, dấu chấm hoặc gạch dưới.', field: 'username' };
      if (AUTH.findByUsername(username)) return { err: 'Tên đăng nhập này đã có trên máy. Chọn tên khác nhé.', field: 'username' };
      if (String(o.password || '').length < 4) return { err: 'Mật khẩu cần ít nhất 4 ký tự.', field: 'password' };
      if (o.password !== o.password2) return { err: 'Hai lần nhập mật khẩu chưa giống nhau.', field: 'password2' };
      if (!o.consent) return { err: 'Cần phụ huynh hoặc giáo viên đồng ý trước khi tạo hồ sơ.', field: 'consent' };
      var id = DB.uid('u'), salt = rand(12), now = Date.now();
      DB.users()[id] = { id: id, username: username, salt: salt, pass: hashPw(o.password, salt), role: 'player', locked: false, createdAt: now, lastLogin: now, consentAt: now, token: rand(16) };
      DB.profiles()[id] = { id: id, displayName: trimTo(o.displayName, 30), playerName: trimTo(o.playerName, 40), ageGroup: o.ageGroup || '', avatar: o.avatar || 'besap', frame: '', theme: '', createdAt: now };
      var all = DB.progressAll();
      if (o.takeGuest && all.guest) {
        all[id] = all.guest; all.guest = newProgress();
        DB.attempts().forEach(function (a) { if (a.playerId === 'guest') a.playerId = id; });
        save('attempts'); EC.gallery.reassign('guest', id);
      } else all[id] = newProgress();
      save('users'); save('profiles'); save('progress');
      startSession(id, !!o.remember);
      return { ok: true, id: id };
    },
    login: function (username, password, remember) {
      var lock = ssGet('loginlock', null) || { n: 0, until: 0 };
      if (lock.until > Date.now()) return { err: 'Thử sai nhiều lần quá. Chờ ' + Math.ceil((lock.until - Date.now()) / 1000) + ' giây rồi thử lại nhé.' };
      var u = AUTH.findByUsername(username);
      if (!u || u.pass !== hashPw(password, u.salt)) {
        lock.n++; if (lock.n >= 5) { lock = { n: 0, until: Date.now() + 30000 }; }
        ssSet('loginlock', lock);
        return { err: 'Tên đăng nhập hoặc mật khẩu chưa đúng.' };
      }
      if (u.locked) return { err: 'Hồ sơ này đang tạm khóa. Bé hỏi thầy cô hoặc ba mẹ nhé.' };
      ssDel('loginlock');
      u.lastLogin = Date.now(); if (!u.token) u.token = rand(16); save('users');
      startSession(u.id, !!remember);
      return { ok: true };
    },
    logout: function () { clearSession(); curPid = 'guest'; fire(); },
    changePassword: function (oldPw, newPw) {
      var u = AUTH.user(); if (!u) return { err: 'Chưa đăng nhập.' };
      if (u.pass !== hashPw(oldPw, u.salt)) return { err: 'Mật khẩu cũ chưa đúng.' };
      if (String(newPw || '').length < 4) return { err: 'Mật khẩu mới cần ít nhất 4 ký tự.' };
      u.salt = rand(12); u.pass = hashPw(newPw, u.salt); save('users');
      return { ok: true };
    },
    /* Quản trị đặt lại mật khẩu: các phiên đăng nhập cũ của tài khoản đó hết hiệu lực */
    setPassword: function (uid, pw) { var u = DB.users()[uid]; if (!u) return; u.salt = rand(12); u.pass = hashPw(pw, u.salt); u.token = rand(16); save('users'); if (curPid === uid) { curPid = null; fire(); } },
    setLocked: function (uid, on) { var u = DB.users()[uid]; if (!u) return; u.locked = !!on; if (on) u.token = rand(16); save('users'); if (curPid === uid && on) { curPid = null; fire(); } },
    deleteAccount: function (uid) {
      var L = DB.attempts();
      for (var i = L.length - 1; i >= 0; i--) if (L[i].playerId === uid) L.splice(i, 1);
      delete DB.users()[uid]; delete DB.profiles()[uid]; delete DB.progressAll()[uid];
      save('users'); save('profiles'); save('progress'); save('attempts');
      EC.gallery.removeOwner(uid);
      if (curPid === uid) AUTH.logout(); else fire();
    }
  };

  /* ---------- Quản trị ---------- */
  EC.adminAuth = {
    hasPin: function () { return !!lsGet('db.admin', null); },
    setPin: function (pw) { var salt = rand(12); lsSet('db.admin', { salt: salt, pass: hashPw(pw, salt), at: Date.now() }); ssSet('admin', 1); },
    check: function (pw) { var a = lsGet('db.admin', null); if (a && a.pass === hashPw(pw, a.salt)) { ssSet('admin', 1); return true; } return false; },
    ok: function () { if (ssGet('admin', 0)) return true; var u = AUTH.user(); return !!(u && u.role === 'admin'); },
    logout: function () { ssDel('admin'); }
  };

  /* ---------- Thống kê (chỉ đếm số, không theo dõi cá nhân) ---------- */
  EC.stats = {
    visit: function () {
      if (ssGet('visited', 0)) return; ssSet('visited', 1);
      var s = DB.stats(), d = EC.today(); s.visits++; s.days[d] = (s.days[d] || 0) + 1; save('stats');
    },
    qr: function (code) { var L = DB.qr(); L.push({ code: String(code).slice(0, 20), at: Date.now() }); if (L.length > 5000) L.splice(0, L.length - 5000); save('qr'); },
    start: function (gameId) { var s = DB.stats(); s.starts[gameId] = (s.starts[gameId] || 0) + 1; save('stats'); },
    zone: function (zid) { var s = DB.stats(); s.zoneVisits[zid] = (s.zoneVisits[zid] || 0) + 1; save('stats'); },
    lesson: function (lid) { var s = DB.stats(); s.lessonViews[lid] = (s.lessonViews[lid] || 0) + 1; save('stats'); }
  };

  /* ---------- Nội dung (gốc → file content.js → bản chỉnh trên máy này) ---------- */
  function buildContent() {
    var base = EC.DEFAULT_CONTENT, file = EC.CONTENT_FILE || null, local = lsGet('db.content', null), out = {};
    Object.keys(base).forEach(function (k) {
      var v = local && local[k] != null ? local[k] : (file && file[k] != null ? file[k] : base[k]);
      out[k] = clone(v);
    });
    out.settings = Object.assign(clone(base.settings), out.settings || {});
    out.settings.contact = Object.assign(clone(base.settings.contact), out.settings.contact || {});
    return out;
  }
  EC.content = function () { if (!CC) CC = buildContent(); return CC; };
  EC.saveContent = function (c) { var ok = lsSet('db.content', c); CC = null; document.dispatchEvent(new CustomEvent('ec:content')); return ok; };
  EC.resetContent = function () { lsDel('db.content'); CC = null; document.dispatchEvent(new CustomEvent('ec:content')); };
  EC.contentIsLocal = function () { return !!lsGet('db.content', null); };
  EC.zones = function () { return EC.content().zones.filter(function (z) { return !z.hidden; }); };
  EC.zoneById = function (id) { return EC.content().zones.filter(function (z) { return z.id === id; })[0] || null; };
  EC.gamesOf = function (z) { return (z.games || []).filter(function (g) { return g.enabled !== false; }); };
  EC.gameById = function (id) {
    var zs = EC.content().zones;
    for (var i = 0; i < zs.length; i++) {
      var z = zs[i], gs = z.games || [];
      for (var j = 0; j < gs.length; j++) if (gs[j].id === id) return { game: gs[j], zone: z, isChallenge: false };
      if (z.challenge && z.challenge.id === id) return { game: z.challenge, zone: z, isChallenge: true };
    }
    return null;
  };
  EC.lessonById = function (id) {
    var zs = EC.content().zones;
    for (var i = 0; i < zs.length; i++) {
      var L = zs[i].lessons || [];
      for (var j = 0; j < L.length; j++) if (L[j].id === id) return { lesson: L[j], zone: zs[i], idx: j };
    }
    return null;
  };

  /* ---------- Bảng Artwork: tranh của bé (IndexedDB, dự phòng localStorage) ---------- */
  var IDB = (function () {
    var dbp = null;
    function open() {
      if (dbp) return dbp;
      dbp = new Promise(function (res, rej) {
        try {
          if (!window.indexedDB) throw new Error('Không có IndexedDB');
          var rq = indexedDB.open('ecocrayon', 1);
          rq.onupgradeneeded = function () { var d = rq.result; if (!d.objectStoreNames.contains('artworks')) d.createObjectStore('artworks', { keyPath: 'id' }); };
          rq.onsuccess = function () { res(rq.result); };
          rq.onerror = function () { rej(rq.error); };
          rq.onblocked = function () { rej(new Error('blocked')); };
        } catch (e) { rej(e); }
      });
      dbp.catch(function () { dbp = null; });
      return dbp;
    }
    function run(mode, fn) {
      return open().then(function (d) {
        return new Promise(function (res, rej) {
          var t = d.transaction('artworks', mode), rq = fn(t.objectStore('artworks'));
          t.oncomplete = function () { res(rq ? rq.result : undefined); };
          t.onerror = t.onabort = function () { rej(t.error); };
        });
      });
    }
    return { run: run };
  })();
  function lite() { return lsGet('db.artworks-lite', []); }
  function setLite(L) { return lsSet('db.artworks-lite', L); }
  EC.gallery = {
    list: function (owner) {
      return IDB.run('readonly', function (s) { return s.getAll(); }).catch(function () { return []; }).then(function (L) {
        L = (L || []).concat(lite());
        if (owner) L = L.filter(function (a) { return a.owner === owner; });
        return L.sort(function (a, b) { return b.createdAt - a.createdAt; });
      });
    },
    add: function (rec) {
      return IDB.run('readwrite', function (s) { return s.put(rec); }).then(function () { return rec; }).catch(function () {
        var L = lite(), small = Object.assign({}, rec, { img: rec.thumb });
        L.push(small);
        if (!setLite(L)) throw new Error('Bộ nhớ đầy');
        return small;
      });
    },
    update: function (id, patch) {
      var L = lite(), hit = false;
      L.forEach(function (a) { if (a.id === id) { Object.assign(a, patch); hit = true; } });
      if (hit) { setLite(L); return Promise.resolve(); }
      return IDB.run('readwrite', function (s) {
        var rq = s.get(id);
        rq.onsuccess = function () { if (rq.result) s.put(Object.assign(rq.result, patch)); };
        return rq;
      }).catch(function () { /* bỏ qua */ });
    },
    remove: function (id) {
      setLite(lite().filter(function (a) { return a.id !== id; }));
      return IDB.run('readwrite', function (s) { return s.delete(id); }).catch(function () { /* bỏ qua */ });
    },
    removeOwner: function (owner) { return EC.gallery.list(owner).then(function (L) { return Promise.all(L.map(function (a) { return EC.gallery.remove(a.id); })); }); },
    reassign: function (from, to) { return EC.gallery.list(from).then(function (L) { return Promise.all(L.map(function (a) { return EC.gallery.update(a.id, { owner: to }); })); }); }
  };

  /* ---------- Chuyển dữ liệu từ bản trước (lá, huy hiệu) sang hồ sơ chơi thử ---------- */
  (function migrate() {
    if (lsGet('db.migrated', 0)) return;
    var old = lsGet('progress', null);
    if (old && typeof old === 'object') {
      var g = DB.progress('guest');
      g.xp += (old.leaves || 0) * 5;
      Object.keys(old.stickers || {}).forEach(function (k) { g.stickers[k] = old.stickers[k]; });
      Object.keys(old.done || {}).forEach(function (k) { g.done[k] = old.done[k]; });
      if (old.name) { guestProfile().playerName = String(old.name).slice(0, 40); save('profiles'); }
      save('progress');
    }
    lsSet('db.migrated', 1);
  })();
})();
