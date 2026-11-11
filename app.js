/* CalcUtile — espace personnel local (aucun serveur, aucune donnée envoyée)
   Tout est stocké dans le navigateur du visiteur (localStorage).
   - enregistre les résultats calculés
   - garde l'historique et les favoris
   - affiche des statistiques personnelles */
(function () {
  'use strict';

  var KEY = 'calc-utile-espace-v1';
  var MAX = 60;

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return { prenom: '', histo: [], fav: [], jours: [], cree: Date.now() };
      var o = JSON.parse(raw);
      o.histo = o.histo || []; o.fav = o.fav || []; o.jours = o.jours || [];
      return o;
    } catch (e) {
      return { prenom: '', histo: [], fav: [], jours: [], cree: Date.now() };
    }
  }

  function write(o) {
    try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {}
  }

  function today() { return new Date().toISOString().slice(0, 10); }

  function markDay(o) {
    var d = today();
    if (o.jours.indexOf(d) === -1) { o.jours.push(d); if (o.jours.length > 400) o.jours.shift(); }
  }

  function streak(o) {
    if (!o.jours.length) return 0;
    var set = {}, i;
    for (i = 0; i < o.jours.length; i++) set[o.jours[i]] = 1;
    var n = 0, d = new Date();
    for (i = 0; i < 400; i++) {
      var k = d.toISOString().slice(0, 10);
      if (!set[k]) {
        if (n === 0) { d.setDate(d.getDate() - 1); continue; } // aujourd'hui pas encore compté
        break;
      }
      n++; d.setDate(d.getDate() - 1);
    }
    return n;
  }

  function pageTitle() {
    var t = document.title || '';
    return t.split('—')[0].split('|')[0].trim();
  }

  function toast(msg) {
    var el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(function () { el.classList.add('on'); }, 20);
    setTimeout(function () { el.classList.remove('on'); setTimeout(function () { el.remove(); }, 300); }, 2400);
  }

  function clean(text) {
    return (text || '').replace(/\s+/g, ' ').replace(/^[\s·•-]+|[\s·•-]+$/g, '').trim().slice(0, 400);
  }

  var current = null; // dernier résultat détecté

  function findResult() {
    var nodes = document.querySelectorAll('.result');
    for (var i = nodes.length - 1; i >= 0; i--) {
      var n = nodes[i];
      if (n.classList.contains('show') || n.offsetParent !== null) {
        var t = clean(n.innerText);
        if (t && t.length > 3) return { el: n, texte: t };
      }
    }
    return null;
  }

  function ensureFab() {
    var fab = document.getElementById('cu-fab');
    if (!fab) {
      fab = document.createElement('button');
      fab.id = 'cu-fab';
      fab.className = 'save-fab';
      fab.type = 'button';
      fab.innerHTML = '＋ Enregistrer ce résultat';
      fab.addEventListener('click', function () {
        if (!current) return;
        var o = read();
        o.histo.unshift({
          page: pageTitle(),
          url: location.pathname.split('/').pop() || 'index.html',
          texte: current.texte,
          quand: Date.now()
        });
        if (o.histo.length > MAX) o.histo.length = MAX;
        markDay(o);
        write(o);
        toast('Résultat enregistré dans Mon espace');
      });
      document.body.appendChild(fab);
    }
    return fab;
  }

  function scan() {
    var r = findResult();
    var fab = document.getElementById('cu-fab');
    if (r) {
      current = r;
      if (!fab) fab = ensureFab();
      fab.classList.add('on');
    } else if (fab) {
      fab.classList.remove('on');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  function start() {
    if (location.pathname.indexOf('mon-espace') !== -1) return; // la page espace gère elle-même
    markDay(read());
    scan();
    setInterval(scan, 1200);
  }

  // ---- page Mon espace ----
  function renderSpace() {
    var o = read();
    var nom = o.prenom || 'Toi';
    var elNom = document.getElementById('sp-nom');
    if (elNom) elNom.textContent = nom;
    var av = document.getElementById('sp-avatar');
    if (av) av.textContent = (o.prenom || 'C').charAt(0).toUpperCase();
    var st = document.getElementById('sp-serie');
    if (st) st.textContent = streak(o);
    var sc = document.getElementById('sp-count');
    if (sc) sc.textContent = o.histo.length;
    var sf = document.getElementById('sp-fav');
    if (sf) sf.textContent = o.fav.length;

    var box = document.getElementById('sp-histo');
    if (box) {
      if (!o.histo.length) {
        box.innerHTML = '<p class="note">Aucun calcul enregistré pour le moment. Ouvre un outil, lance un calcul, puis clique sur « Enregistrer ce résultat ».</p>';
      } else {
        box.innerHTML = o.histo.map(function (h, i) {
          var d = new Date(h.quand);
          var ds = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) + ' · ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
          return '<div class="hist-item"><div><div class="h-t">' + esc(h.page) + '</div><div class="h-s">' + ds + ' — ' + esc(h.texte).slice(0, 160) + '</div></div>' +
            '<div style="display:flex;gap:6px;flex-shrink:0"><a href="' + esc(h.url) + '" class="pill">Ouvrir</a><button type="button" data-del="' + i + '">Supprimer</button></div></div>';
        }).join('');
        box.querySelectorAll('button[data-del]').forEach(function (b) {
          b.addEventListener('click', function () {
            var o2 = read();
            o2.histo.splice(parseInt(b.getAttribute('data-del'), 10), 1);
            write(o2); renderSpace();
          });
        });
      }
    }

    var favBox = document.getElementById('sp-favs');
    if (favBox) {
      if (!o.fav.length) {
        favBox.innerHTML = '<p class="note">Aucun favori. Ajoute un outil avec le bouton « Ajouter aux favoris » en haut de sa page.</p>';
      } else {
        favBox.innerHTML = o.fav.map(function (f) {
          return '<a class="pill" href="' + esc(f.url) + '" style="margin:4px 6px 0 0">' + esc(f.titre) + '</a>';
        }).join('');
      }
    }
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function bindSpace() {
    var inp = document.getElementById('sp-prenom');
    if (inp) {
      inp.value = read().prenom || '';
      inp.addEventListener('input', function () {
        var o = read(); o.prenom = inp.value.slice(0, 40); write(o);
        document.getElementById('sp-nom').textContent = o.prenom || 'Toi';
        document.getElementById('sp-avatar').textContent = (o.prenom || 'C').charAt(0).toUpperCase();
      });
    }
    var favBtn = document.getElementById('sp-addfav');
    if (favBtn) {
      favBtn.addEventListener('click', function () {
        var o = read();
        var t = pageTitle(), u = location.pathname.split('/').pop() || 'index.html';
        if (!o.fav.some(function (f) { return f.url === u; })) {
          o.fav.push({ titre: t, url: u });
          write(o);
          toast('Outil ajouté aux favoris');
        } else {
          toast('Cet outil est déjà dans tes favoris');
        }
      });
    }
    var exp = document.getElementById('sp-export');
    if (exp) exp.addEventListener('click', function () {
      var blob = new Blob([JSON.stringify(read(), null, 2)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'calc-utile-espace.json';
      a.click();
    });
    var clr = document.getElementById('sp-clear');
    if (clr) clr.addEventListener('click', function () {
      if (confirm('Effacer tout l\'historique et les favoris ? Cette action est définitive.')) {
        var o = read(); o.histo = []; o.fav = []; write(o); renderSpace();
        toast('Historique effacé');
      }
    });
    renderSpace();
  }

  window.CalcUtile = {
    read: read, write: write, toast: toast, esc: esc, renderSpace: renderSpace, bindSpace: bindSpace,
    streak: streak, markDay: markDay
  };
})();
