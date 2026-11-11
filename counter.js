/* CalcUtile — compteur de visites anonyme (hits.sh)
   Aucun cookie, aucune donnée personnelle : on incrémente juste deux compteurs
   (total du site + page courante) via une image 1x1 invisible. */
(function () {
  if (location.protocol !== 'https:' && location.protocol !== 'http:') return;
  if (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)) return;

  var SITE = 'littl-spip.github.io';
  var path = location.pathname.replace(/\/+$/, '');
  if (path === '') path = '/index.html';
  if (!/\.[a-z0-9]+$/i.test(path)) path += '/index.html';

  function ping(urn) {
    var img = new Image(1, 1);
    img.alt = '';
    img.referrerPolicy = 'no-referrer';
    img.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;left:-9999px';
    img.src = 'https://hits.sh/' + urn + '.svg?label=visites&color=2f6f4e';
    (document.body || document.documentElement).appendChild(img);
  }

  function run() {
    ping(SITE + path);
    ping(SITE);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
