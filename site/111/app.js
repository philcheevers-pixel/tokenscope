(function () {
  'use strict';
  var REFRESH_MS = 2000;
  var STALE_MS = 15 * 60 * 1000;
  var STATUS_RANK = { blocked: 0, running: 1, waiting: 2, done: 3 };
  var TORONTO = 'America/Toronto';
  var lastGood = null;
  var speechRec = null;
  var voiceState = 'idle';
  var saveInFlight = null;
  var statusBeforeDone = {};
  var editingCell = false;
  var lastNudge = '';
  var BOARD_ROWS = 15;
  var LANES = [
    { lane: 'Phil', colId: 'col-phil' },
    { lane: 'Cursor', colId: 'col-cursor' },
    { lane: 'Grok', colId: 'col-grok' },
    { lane: 'Claude', colId: 'col-claude' }
  ];
  function $(id) { return document.getElementById(id); }
  function ownerLane(owner) {
    var o = String(owner || '');
    if (o === 'Phil') return 'Phil';
    if (o.indexOf('Grok') >= 0) return 'Grok';
    if (o.indexOf('Claude') >= 0) return 'Claude';
    if (o.indexOf('Cursor') >= 0 || o.indexOf('Atlas') >= 0) return 'Cursor';
    return 'Phil';
  }
  function formatTorontoInstant(iso) {
    if (!iso) return 'Not set';
    try {
      return new Intl.DateTimeFormat('en-CA', { timeZone: TORONTO, dateStyle: 'medium', timeStyle: 'short', timeZoneName: 'short' }).format(new Date(iso));
    } catch (e) { return iso; }
  }
  function validatePayload(data) {
    if (!data || !Array.isArray(data.tasks)) return false;
    var allowed = { blocked: 1, running: 1, waiting: 1, done: 1 };
    for (var i = 0; i < data.tasks.length; i++) {
      var t = data.tasks[i];
      if (!t || !t.name || !t.status || !t.owner) return false;
      if (!allowed[t.status]) return false;
      if (typeof t.notes !== 'string') return false;
      if (!('startDate' in t) || !('deliveryDate' in t)) return false;
    }
    return true;
  }
  function sortTasks(tasks) {
    return tasks.slice().sort(function (a, b) {
      var ar = STATUS_RANK[a.status], br = STATUS_RANK[b.status];
      if (ar !== br) return ar - br;
      var ad = a.deliveryDate, bd = b.deliveryDate;
      if (!ad && !bd) return 0;
      if (!ad) return 1;
      if (!bd) return -1;
      return ad < bd ? -1 : ad > bd ? 1 : 0;
    });
  }
  function countByStatus(tasks) {
    var c = { blocked: 0, running: 0, waiting: 0, done: 0 };
    for (var i = 0; i < tasks.length; i++) c[tasks[i].status]++;
    c.total = tasks.length;
    return c;
  }
  function blockedReasonForTask(t) {
    if (!t) return '';
    var w = t.waitingOn;
    if (typeof w === 'string' && w.trim() !== '') return w.trim();
    var n = t.notes;
    if (typeof n === 'string' && n.trim() !== '') return n.trim();
    return '';
  }
  function blockedWhyLine(tasks) {
    var blocked = [];
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].status === 'blocked') blocked.push(tasks[i]);
    }
    var el = $('sum-blocked');
    if (!el) return;
    if (!blocked.length) {
      el.textContent = 'Nothing blocked.';
      el.className = 'blocked-why muted';
      return;
    }
    el.className = 'blocked-why';
    if (blocked.length === 1) {
      var one = blockedReasonForTask(blocked[0]);
      el.textContent = one || ('Blocked: ' + blocked[0].name + ' (no reason in notes or waitingOn)');
      return;
    }
    var parts = [];
    for (var j = 0; j < blocked.length; j++) {
      var bt = blocked[j];
      var r = blockedReasonForTask(bt);
      parts.push(bt.name + (r ? ' — ' + r : ' — no reason'));
    }
    el.textContent = parts.join(' · ');
  }
  function renderCounts(c) {
    var box = $('counts');
    if (!box) return;
    var map = {
      running: 'Running ' + c.running,
      waiting: 'Waiting ' + c.waiting,
      blocked: 'Blocked ' + c.blocked,
      done: 'Done ' + c.done,
      total: 'Total ' + c.total
    };
    var spans = box.querySelectorAll('[data-k]');
    for (var i = 0; i < spans.length; i++) {
      var k = spans[i].getAttribute('data-k');
      if (map[k] != null) spans[i].textContent = map[k];
    }
  }
  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function escapeAttr(s) {
    return escapeHtml(s).replace(/"/g, '&quot;');
  }
  function rowIsComplete(name, notes) {
    var n = String(name || '');
    var note = String(notes || '');
    if (n !== '' && n.trim() === '') return true;
    if (n.trim().toLowerCase() === 'done') return true;
    if (note.trim().toLowerCase() === 'done') return true;
    return /\bdone\b/i.test(note);
  }
  function taskId(t) {
    return t.id ? String(t.id) : '';
  }
  function rememberStatus(id, status) {
    if (id && status && status !== 'done') statusBeforeDone[id] = status;
  }
  function restoreStatus(id) {
    return statusBeforeDone[id] || 'running';
  }
  function rowDoneCheckbox(t) {
    var id = taskId(t);
    var done = t.status === 'done';
    rememberStatus(id, t.status);
    if (!id) {
      return '<span class="col-done-wrap no-id" title="No id">—</span>';
    }
    var dis = saveInFlight === id ? ' disabled' : '';
    var chk = done ? ' checked' : '';
    return '<span class="col-done-wrap"><input type="checkbox" class="task-done-cb" data-task-id="' + escapeHtml(id) + '" aria-label="Mark done: ' + escapeHtml(t.name) + '"' + chk + dis + '></span>';
  }
  function buildTaskRow(t) {
    var id = taskId(t);
    var notesVal = t.notes ? String(t.notes) : '';
    var row = document.createElement('div');
    row.className = 'task-row' + (t.status === 'done' ? ' is-done' : '');
    row.innerHTML = rowDoneCheckbox(t) +
      '<div class="task-fields">' +
      '<input class="task-cell task-name" data-field="name" data-task-id="' + escapeAttr(id) + '" data-orig="' + escapeAttr(t.name) + '" data-peer-notes="' + escapeAttr(notesVal) + '" value="' + escapeAttr(t.name) + '" aria-label="Task name" title="' + escapeAttr(notesVal) + '">' +
      '<input class="task-cell task-notes task-row-notes" data-field="notes" data-task-id="' + escapeAttr(id) + '" data-orig="' + escapeAttr(notesVal) + '" data-peer-name="' + escapeAttr(t.name) + '" value="' + escapeAttr(notesVal) + '" aria-label="Notes" placeholder="notes · type done">' +
      '</div>' +
      '<span class="badge ' + t.status + '" title="' + escapeAttr(notesVal) + '">' + t.status + '</span>';
    return row;
  }
  function buildEmptySlot() {
    var row = document.createElement('div');
    row.className = 'task-row task-slot';
    row.setAttribute('aria-hidden', 'true');
    return row;
  }
  function renderLane(colEl, laneTasks) {
    colEl.innerHTML = '';
    var i;
    for (i = 0; i < BOARD_ROWS; i++) {
      if (i < laneTasks.length) colEl.appendChild(buildTaskRow(laneTasks[i]));
      else colEl.appendChild(buildEmptySlot());
    }
  }
  function postAdd(name, owner, notes) {
    return fetch('tasks-add.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ name: name, owner: owner || 'Phil', notes: notes || '' })
    }).then(function (r) {
      return r.json().then(function (j) {
        if (!r.ok || !j.ok) throw new Error(j.error || 'HTTP ' + r.status);
        return j;
      });
    });
  }
  function submitAddFromInput(input) {
    if (!input || saveInFlight === 'add') return;
    var raw = String(input.value || '');
    var name = raw.trim();
    if (!name) return;
    if (rowIsComplete(raw, '')) return;
    var owner = input.getAttribute('data-owner') || 'Phil';
    var ph = input.getAttribute('placeholder') || '';
    saveInFlight = 'add';
    input.disabled = true;
    postAdd(name, owner, '').then(function () {
      input.value = '';
      return snapshotBackup();
    }).then(function () {
      return fetchTasksOnce();
    }).catch(function (e) {
      setRefreshError(true, 'Could not add task (' + e.message + ').');
    }).finally(function () {
      input.disabled = false;
      saveInFlight = null;
      if (ph) input.setAttribute('placeholder', ph);
      input.focus();
    });
  }
  function wireAddInput(input) {
    if (!input || input.getAttribute('data-add-wired') === '1') return;
    input.setAttribute('data-add-wired', '1');
    input.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        submitAddFromInput(input);
      }
    });
  }
  function postPatch(id, patch) {
    saveInFlight = id;
    return fetch('tasks-patch.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify(Object.assign({ id: id }, patch))
    }).then(function (r) {
      return r.json().then(function (j) {
        if (!r.ok || !j.ok) throw new Error(j.error || 'HTTP ' + r.status);
        return j;
      });
    }).finally(function () {
      saveInFlight = null;
    });
  }
  function postStatus(id, status) {
    saveInFlight = id;
    return fetch('tasks-update.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ id: id, status: status })
    }).then(function (r) {
      return r.json().then(function (j) {
        if (!r.ok || !j.ok) throw new Error(j.error || 'HTTP ' + r.status);
        return j;
      });
    }).finally(function () {
      saveInFlight = null;
    });
  }
  function snapshotBackup() {
    return fetch('tasks-backup.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: '{}'
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (j && j.ok) refreshBackupList();
    }).catch(function () {});
  }
  function submitCell(input) {
    if (!input) return;
    var id = input.getAttribute('data-task-id');
    var field = input.getAttribute('data-field');
    if (!id || !field) return;
    var val = input.value;
    var orig = input.getAttribute('data-orig');
    if (orig !== null && val === orig) return;
    var patch = {};
    patch[field] = val;
    var otherName = field === 'name' ? val : (input.getAttribute('data-peer-name') || '');
    var otherNotes = field === 'notes' ? val : (input.getAttribute('data-peer-notes') || '');
    var markDone = rowIsComplete(otherName, otherNotes);
    input.disabled = true;
    postPatch(id, patch).then(function () {
      if (markDone) return postStatus(id, 'done');
    }).then(function () {
      return snapshotBackup();
    }).then(function () {
      return fetchTasksOnce();
    }).catch(function (e) {
      setRefreshError(true, 'Could not save row (' + e.message + ').');
    }).finally(function () {
      input.disabled = false;
    });
  }
  function onCellKey(ev) {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      submitCell(ev.target);
      ev.target.blur();
    }
    if (ev.key === 'Escape') {
      ev.preventDefault();
      var orig = ev.target.getAttribute('data-orig');
      if (orig !== null) ev.target.value = orig;
      ev.target.blur();
    }
  }
  function onDoneToggle(ev) {
    var el = ev.target;
    if (!el || !el.classList || !el.classList.contains('task-done-cb')) return;
    var id = el.getAttribute('data-task-id');
    if (!id) return;
    var next = el.checked ? 'done' : restoreStatus(id);
    if (el.checked && lastGood) {
      for (var i = 0; i < lastGood.tasks.length; i++) {
        var row = lastGood.tasks[i];
        if (taskId(row) === id && row.status !== 'done') {
          statusBeforeDone[id] = row.status;
          break;
        }
      }
    }
    el.disabled = true;
    postStatus(id, next).then(function () {
      return snapshotBackup();
    }).then(function () {
      return fetchTasksOnce();
    }).catch(function (e) {
      el.checked = !el.checked;
      setRefreshError(true, 'Could not save tick (' + e.message + ').');
    }).finally(function () {
      el.disabled = false;
    });
  }
  function focusedCell() {
    var active = document.activeElement;
    if (!active || !active.classList || !active.classList.contains('task-cell')) return null;
    return {
      id: active.getAttribute('data-task-id') || '',
      field: active.getAttribute('data-field') || '',
      value: active.value
    };
  }
  function restoreFocusedCell(keep) {
    if (!keep || !keep.id) return;
    var nodes = document.querySelectorAll('.task-cell');
    var i;
    for (i = 0; i < nodes.length; i++) {
      if (nodes[i].getAttribute('data-task-id') === keep.id && nodes[i].getAttribute('data-field') === keep.field) {
        nodes[i].value = keep.value;
        nodes[i].focus();
        editingCell = true;
        return;
      }
    }
  }
  function waitingOnPhil(tasks) {
    var hits = [];
    for (var i = 0; i < tasks.length; i++) {
      var t = tasks[i];
      if (t.status === 'done') continue;
      var blob = (t.name + ' ' + (t.notes || '') + ' ' + (t.waitingOn || '')).toLowerCase();
      var waiting = t.status === 'waiting' || /awaiting|approval|waiting on phil|\bok\b/.test(blob);
      if (waiting && (t.owner === 'Phil' || /phil|approval|awaiting|ok toronto|photonews/i.test(blob))) {
        hits.push(t.name);
      }
    }
    return hits;
  }
  function writeNudge(text) {
    return fetch('say.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ text: text })
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (j && j.ok) {
        lastNudge = text;
        var hint = $('say-hint');
        if (hint) hint.textContent = text ? ('Speaker: ' + text) : 'Speaker: idle';
      }
    }).catch(function () {});
  }
  function maybeNudge(tasks) {
    var hits = waitingOnPhil(tasks);
    var text = hits.length
      ? ('Phil, an approval is waiting: ' + hits.slice(0, 3).join('; ') + '.')
      : '';
    if (text === lastNudge) return;
    writeNudge(text);
  }
  function fetchTasksOnce() {
    return fetch('tasks.json?t=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (data) {
        if (!validatePayload(data)) throw new Error('Invalid JSON');
        lastGood = data;
        var keep = focusedCell();
        render(data);
        restoreFocusedCell(keep);
        maybeNudge(data.tasks);
        setRefreshError(false);
      });
  }
  function render(data) {
    var tasks = sortTasks(data.tasks);
    var c = countByStatus(tasks);
    blockedWhyLine(tasks);
    renderCounts(c);
    $('meta-updated').textContent = 'Last updated (Toronto): ' + formatTorontoInstant(data.updatedAt);
    var byLane = { Phil: [], Cursor: [], Grok: [], Claude: [] };
    for (var i = 0; i < tasks.length; i++) {
      var lane = ownerLane(tasks[i].owner);
      if (!byLane[lane]) byLane[lane] = [];
      byLane[lane].push(tasks[i]);
    }
    for (var L = 0; L < LANES.length; L++) {
      var spec = LANES[L];
      var col = $(spec.colId);
      if (col) renderLane(col, sortTasks(byLane[spec.lane] || []));
    }
    var staleEl = $('notice-stale');
    if (data.updatedAt && Date.now() - new Date(data.updatedAt).getTime() > STALE_MS) staleEl.classList.remove('hidden');
    else staleEl.classList.add('hidden');
  }
  function setRefreshError(show, msg) {
    var el = $('notice-refresh');
    if (show) { el.textContent = msg || 'Could not refresh tasks.json.'; el.classList.remove('hidden'); }
    else el.classList.add('hidden');
  }
  function fetchTasks() {
    fetchTasksOnce().catch(function (e) {
      if (lastGood) setRefreshError(true, 'Could not refresh (' + e.message + '). Showing last good data.');
      else setRefreshError(true, 'Could not load (' + e.message + ').');
    });
  }
  function refreshBackupList() {
    fetch('backup-list.php?t=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        var meta = $('backup-meta');
        var list = $('backup-list');
        if (!j || !j.ok) return;
        if (meta) meta.textContent = 'Backups: ' + (j.count || 0);
        if (!list) return;
        list.innerHTML = '';
        var rows = j.backups || [];
        if (!rows.length) {
          list.innerHTML = '<li>None yet. First edit creates one.</li>';
          return;
        }
        for (var i = 0; i < rows.length; i++) {
          var li = document.createElement('li');
          li.textContent = rows[i].file + ' · ' + formatTorontoInstant(rows[i].mtime);
          list.appendChild(li);
        }
      }).catch(function () {});
  }
  function setVoiceState(state, detail) {
    voiceState = state;
    var el = $('voice-state');
    if (el) el.textContent = state + (detail ? ' — ' + detail : '');
  }
  function voiceList() {
    if (!window.speechSynthesis) return [];
    return window.speechSynthesis.getVoices() || [];
  }
  function pickDavid(list) {
    var i, n, v;
    for (i = 0; i < list.length; i++) {
      v = list[i];
      n = ((v && v.name) || '') + ' ' + ((v && v.voiceURI) || '');
      if (/microsoft david/i.test(n)) return v;
    }
    for (i = 0; i < list.length; i++) {
      v = list[i];
      n = (v && v.name) || '';
      if (/\bdavid\b/i.test(n)) return v;
    }
    return null;
  }
  function showVoicePick(chosen) {
    var el = $('voice-picked');
    if (!el) return;
    el.textContent = chosen ? ('Voice: ' + chosen.name) : 'Voice: David not in this browser';
  }
  function whenDavid(cb) {
    var list = voiceList();
    if (pickDavid(list)) { cb(list); return; }
    var finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      if (window.speechSynthesis) window.speechSynthesis.removeEventListener('voiceschanged', onVoices);
      cb(voiceList());
    }
    function onVoices() {
      if (pickDavid(voiceList())) finish();
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.addEventListener('voiceschanged', onVoices);
      window.speechSynthesis.getVoices();
    }
    setTimeout(finish, 900);
  }
  function speak(text) {
    if (!window.speechSynthesis || !text) return;
    whenDavid(function () {
      window.speechSynthesis.cancel();
      setTimeout(function () {
        var chosen = pickDavid(voiceList());
        showVoicePick(chosen);
        var u = new SpeechSynthesisUtterance(text);
        if (chosen) {
          u.lang = chosen.lang || 'en-US';
          u.voice = chosen;
        } else {
          u.lang = 'en-US';
        }
        u.onend = function () { setVoiceState('idle', ''); };
        setVoiceState('speaking', chosen ? chosen.name : 'default');
        window.speechSynthesis.speak(u);
        if (window.speechSynthesis.paused) window.speechSynthesis.resume();
      }, 40);
    });
  }
  function answerTimeQuestion(text) {
    if (!lastGood) { var m = 'No tasks loaded yet.'; var log0 = $('voice-log'); if (log0) log0.textContent = m; speak(m); return; }
    var q = String(text || '').toLowerCase();
    var c = countByStatus(lastGood.tasks);
    var running = lastGood.tasks.filter(function (t) { return t.status === 'running'; });
    var msg;
    if (/blocked/.test(q)) msg = running.length ? 'Check the blocked row in the table.' : 'Nothing blocked in the sample.';
    else if (/running|active|now/.test(q)) msg = running.length ? 'Running: ' + running.map(function (t) { return t.name; }).join(', ') : 'Nothing marked running.';
    else if (/how many|summary|count|total/.test(q)) msg = 'Total ' + c.total + '. Running ' + c.running + ', waiting ' + c.waiting + ', blocked ' + c.blocked + ', done ' + c.done + '.';
    else {
      var sorted = sortTasks(lastGood.tasks);
      msg = sorted[0] ? 'First on board: ' + sorted[0].name + ', ' + sorted[0].status + '.' : 'No tasks.';
    }
    var log = $('voice-log');
    if (log) log.textContent = msg;
    speak(msg);
  }
  function initVoice() {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setVoiceState('error', 'Use text box on this browser'); return; }
    speechRec = new SR();
    speechRec.onstart = function () { setVoiceState('listening', ''); };
    speechRec.onerror = function () { setVoiceState('error', 'Mic error'); };
    speechRec.onresult = function (ev) {
      var text = ev.results[0][0].transcript;
      var heard = $('voice-log');
      if (heard) heard.textContent = 'Heard: ' + text;
      answerTimeQuestion(text);
    };
    var mic = $('voice-mic');
    if (mic) mic.addEventListener('click', function () { try { speechRec.start(); } catch (e) { setVoiceState('error', ''); } });
  }
  var handoffTimer = null;
  var handoffSeen = null;
  var handoffFocused = false;
  function fitHandoff(box) {
    box.style.height = 'auto';
    box.style.height = Math.max(box.scrollHeight + 8, 140) + 'px';
  }
  function applyHandoff(data) {
    var box = $('handoff-text');
    if (!box || !data || typeof data.text !== 'string') return;
    if (handoffSeen !== null && box.value !== handoffSeen) return;
    var first = handoffSeen === null;
    handoffSeen = data.text;
    if (box.value !== data.text) box.value = data.text;
    fitHandoff(box);
    if (first && data.text) {
      var band = document.querySelector('.handoff');
      if (band && band.scrollIntoView) band.scrollIntoView({ block: 'center' });
    }
  }
  function fetchHandoff() {
    fetch('handoff.json?t=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(applyHandoff)
      .catch(function () {});
  }
  function saveHandoff() {
    var box = $('handoff-text');
    if (!box || handoffSeen === null || box.value === handoffSeen) return;
    var text = box.value;
    fetch('handoff.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ text: text })
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (j && j.ok) handoffSeen = text;
    }).catch(function () {});
  }
  function initHandoff() {
    var box = $('handoff-text');
    if (!box) return;
    box.readOnly = false;
    box.disabled = false;
    box.addEventListener('pointerdown', function () { handoffFocused = true; });
    box.addEventListener('focus', function () { handoffFocused = true; });
    box.addEventListener('blur', function () {
      handoffFocused = false;
      if (handoffTimer) clearTimeout(handoffTimer);
      saveHandoff();
    });
    box.addEventListener('input', function () {
      if (handoffTimer) clearTimeout(handoffTimer);
      handoffTimer = setTimeout(saveHandoff, 400);
    });
    var copyBtn = $('handoff-copy');
    if (copyBtn) copyBtn.addEventListener('click', function () {
      var done = function () {
        copyBtn.textContent = 'Copied';
        setTimeout(function () { copyBtn.textContent = 'Copy'; }, 1200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(box.value).then(done).catch(function () {
          box.focus();
          box.select();
        });
      } else {
        box.focus();
        box.select();
      }
    });
    fetchHandoff();
    setInterval(fetchHandoff, REFRESH_MS);
  }
  function init() {
    fetchTasks();
    setInterval(fetchTasks, REFRESH_MS);
    refreshBackupList();
    setInterval(refreshBackupList, 15000);
    var board = $('task-board');
    board.addEventListener('change', onDoneToggle);
    board.addEventListener('focusin', function (ev) {
      if (ev.target && ev.target.classList && ev.target.classList.contains('task-cell')) editingCell = true;
    });
    board.addEventListener('focusout', function (ev) {
      if (ev.target && ev.target.classList && ev.target.classList.contains('task-cell')) {
        submitCell(ev.target);
        setTimeout(function () { editingCell = !!document.querySelector('.task-cell:focus'); }, 120);
      }
    });
    board.addEventListener('keydown', function (ev) {
      if (ev.target && ev.target.classList && ev.target.classList.contains('task-cell')) onCellKey(ev);
    });
    var addInputs = document.querySelectorAll('.task-add-input');
    for (var a = 0; a < addInputs.length; a++) wireAddInput(addInputs[a]);
    initHandoff();
    var bak = $('btn-backup');
    if (bak) bak.addEventListener('click', function () {
      snapshotBackup().then(function () { bak.textContent = 'Saved'; setTimeout(function () { bak.textContent = 'Save backup'; }, 1200); });
    });
    var nudgeBtn = $('btn-nudge');
    if (nudgeBtn) nudgeBtn.addEventListener('click', function () {
      if (!lastGood) return;
      lastNudge = '';
      maybeNudge(lastGood.tasks);
    });
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.addEventListener('voiceschanged', function () {
        showVoicePick(pickDavid(voiceList()));
      });
      whenDavid(function () { showVoicePick(pickDavid(voiceList())); });
    }
    if ($('voice-mic') || $('voice-ask') || $('voice-stop')) initVoice();
    var ask = $('voice-ask');
    if (ask) ask.addEventListener('click', function () { answerTimeQuestion(($('voice-text') || {}).value || ''); });
    var stopBtn = $('voice-stop');
    if (stopBtn) stopBtn.addEventListener('click', function () {
      if (speechRec) try { speechRec.stop(); } catch (e) {}
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setVoiceState('idle', '');
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
