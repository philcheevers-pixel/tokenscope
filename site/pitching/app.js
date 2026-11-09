(function () {
  'use strict';
  var ALL = [];
  var letterSel = document.getElementById('letter');
  var countrySel = document.getElementById('country');
  var languageSel = document.getElementById('language');
  var paysSel = document.getElementById('pays');
  var q = document.getElementById('q');
  var tbody = document.getElementById('tbody');
  var countEl = document.getElementById('count');
  var lettersNav = document.getElementById('letters');

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function firstLetter(name) {
    var c = (name || '').trim().charAt(0).toUpperCase();
    if (c >= 'A' && c <= 'Z') return c;
    if (c >= '0' && c <= '9') return '0-9';
    return '#';
  }
  function unique(arr) {
    var seen = {};
    var out = [];
    for (var i = 0; i < arr.length; i++) {
      var v = arr[i];
      if (!v || seen[v]) continue;
      seen[v] = 1;
      out.push(v);
    }
    out.sort();
    return out;
  }
  function fillSelect(sel, values) {
    var keep = sel.value;
    sel.innerHTML = '<option value="">All</option>';
    for (var i = 0; i < values.length; i++) {
      var opt = document.createElement('option');
      opt.value = values[i];
      opt.textContent = values[i];
      sel.appendChild(opt);
    }
    if (keep) sel.value = keep;
  }
  function filtered() {
    var letter = letterSel.value;
    var country = countrySel.value;
    var language = languageSel.value;
    var pays = paysSel.value;
    var needle = q.value.trim().toLowerCase();
    var out = [];
    for (var i = 0; i < ALL.length; i++) {
      var r = ALL[i];
      if (letter && firstLetter(r.name) !== letter) continue;
      if (country && r.country !== country) continue;
      if (language && r.language !== language) continue;
      if (pays && r.pays !== pays) continue;
      if (needle) {
        var blob = (r.name + ' ' + r.genre + ' ' + r.country + ' ' + r.jurisdiction + ' ' + r.source + ' ' + r.website).toLowerCase();
        if (blob.indexOf(needle) < 0) continue;
      }
      out.push(r);
    }
    return out;
  }
  function render() {
    var rows = filtered();
    countEl.textContent = rows.length + ' of ' + ALL.length;
    var html = [];
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      var site = r.website
        ? '<a href="' + esc(r.website) + '" target="_blank" rel="noopener">' + esc(r.website.replace(/^https?:\/\//, '')) + '</a>'
        : '';
      html.push(
        '<tr>' +
          '<td>' + esc(r.name) + '</td>' +
          '<td>' + esc(r.country) + (r.jurisdiction ? '<div class="j">' + esc(r.jurisdiction) + '</div>' : '') + '</td>' +
          '<td>' + esc(r.language) + '</td>' +
          '<td>' + esc(r.genre) + '</td>' +
          '<td>' + esc(r.pays) + '</td>' +
          '<td>' + site + '</td>' +
        '</tr>'
      );
    }
    if (!rows.length) html.push('<tr><td colspan="6">No rows match.</td></tr>');
    tbody.innerHTML = html.join('');
  }
  function setLetter(v) {
    letterSel.value = v;
    var btns = lettersNav.querySelectorAll('button');
    for (var i = 0; i < btns.length; i++) btns[i].classList.toggle('active', btns[i].getAttribute('data-l') === v);
    render();
  }
  function buildLetters() {
    var labels = ['', 'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0-9','#'];
    lettersNav.innerHTML = '';
    letterSel.innerHTML = '';
    for (var i = 0; i < labels.length; i++) {
      var v = labels[i];
      var opt = document.createElement('option');
      opt.value = v;
      opt.textContent = v || 'All';
      letterSel.appendChild(opt);
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = v || 'All';
      b.setAttribute('data-l', v);
      b.addEventListener('click', function (ev) { setLetter(ev.currentTarget.getAttribute('data-l')); });
      lettersNav.appendChild(b);
    }
  }
  fetch('publications.json', { cache: 'no-store' })
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function (rows) {
      ALL = rows;
      buildLetters();
      fillSelect(countrySel, unique(rows.map(function (r) { return r.country; })));
      fillSelect(languageSel, unique(rows.map(function (r) { return r.language; })));
      ['q','letter','country','language','pays'].forEach(function (id) {
        document.getElementById(id).addEventListener('input', render);
        document.getElementById(id).addEventListener('change', render);
      });
      setLetter('');
    })
    .catch(function (e) {
      tbody.innerHTML = '<tr><td colspan="6">Could not load publications.json (' + esc(e.message) + ').</td></tr>';
      countEl.textContent = 'Load failed';
    });
})();
