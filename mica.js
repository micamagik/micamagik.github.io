/* ============================================================
   MICA MAGIK — shared product helpers
   Loaded after products.js. Every page uses these so the card
   markup, the affiliate rel attributes and the "as of" line stay
   identical everywhere.
   ============================================================ */
(function (w) {
  'use strict';

  var IMG   = function (f) {
    return 'https://static.wixstatic.com/media/' + f +
           '/v1/fill/w_640,h_800,al_c,q_80,enc_auto/file.jpg';
  };
  var BASE  = 'https://www.themysticalspiralstore.com/product-page/';
  var STORE = 'https://www.themysticalspiralstore.com';

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function cut(p) { return p.was ? (p.was - p.price) / p.was : 0; }

  var OK = typeof PRODUCTS !== 'undefined' && Array.isArray(PRODUCTS) && PRODUCTS.length;
  var live = OK ? PRODUCTS.filter(function (p) { return !p.soldOut && p.price != null; }) : [];
  var sale = live.filter(function (p) { return p.was; });

  /* Fisher-Yates. sort(() => Math.random()-0.5) is biased and keeps
     surfacing the same few pieces, which defeats the point of a
     "different handful every time". */
  function shuffle(list) {
    var a = list.slice(), i, j, t;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function pick(list, n) { return shuffle(list).slice(0, n); }

  /* match on the product name so a guide can pull its own stones */
  function byWords(words, n) {
    var re = new RegExp(words.join('|'), 'i');
    var hits = live.filter(function (p) { return re.test(p.name); });
    return n ? pick(hits, n) : hits;
  }

  function card(p) {
    return '<a class="item" href="' + BASE + p.slug + '" target="_blank" rel="noopener sponsored">' +
      '<div class="pic">' +
        (p.was ? '<span class="cut">' + Math.round(cut(p) * 100) + '% OFF</span>' : '') +
        '<img loading="lazy" alt="' + esc(p.name) + '" src="' + IMG(p.img) + '"' +
        ' onload="this.classList.add(\'on\')" onerror="this.remove()">' +
      '</div>' +
      '<div class="txt">' +
        '<h3>' + esc(p.name) + '</h3>' +
        '<div class="pr">$' + p.price.toFixed(2) +
          (p.was ? '<s>$' + p.was.toFixed(2) + '</s>' : '') + '</div>' +
        '<div class="go">See it on the store &rarr;</div>' +
      '</div></a>';
  }

  function render(el, list) {
    var node = typeof el === 'string' ? document.getElementById(el) : el;
    if (!node) return;
    if (!list.length) { node.closest('section') && (node.closest('section').style.display = 'none'); return; }
    node.innerHTML = list.map(card).join('');
  }

  function stamp(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = OK
      ? 'Snapshot taken ' + esc(PRODUCTS_COLLECTED) + ' &mdash; <a href="' + STORE +
        '" target="_blank" rel="noopener sponsored">check the store</a> for live prices.'
      : '<a href="' + STORE + '" target="_blank" rel="noopener sponsored">Visit The Mystical Spiral Store</a>';
  }

  w.MICA = { OK: OK, live: live, sale: sale, cut: cut, esc: esc,
             pick: pick, byWords: byWords, card: card, render: render,
             stamp: stamp, BASE: BASE, STORE: STORE, IMG: IMG };
})(window);
