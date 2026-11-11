(function () {
  'use strict';
  var DOT_VER = '6';
  var CSS_VER = '31';
  var IMG_VER = '20261107b';
  var PH_HOME = 'https://pinkhouse.tech/';

  function isPortfolioSection() {
    var path = (window.location.pathname || '/').replace(/\\/g, '/');
    return /^\/portfolio(\/|$)/i.test(path);
  }

  function homeWithHeader() {
    var path = (window.location.pathname || '/').replace(/\/index\.html$/i, '').replace(/\/$/, '');
    if (path === '' || path === '/') {
      return !!document.querySelector('header.site-header .logo-mark');
    }
    return !!document.querySelector('header.site-header .logo-mark');
  }

  function removeCornerDot() {
    var el = document.getElementById('ph-site-home-dot');
    if (el) el.remove();
  }

  function ensureCornerDot() {
    if (isPortfolioSection()) {
      removeCornerDot();
      return;
    }
    if (homeWithHeader()) {
      removeCornerDot();
      return;
    }
    if (!document.querySelector('link[href*="vision.css"]')) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/a11y/vision.css?v=' + CSS_VER;
      document.head.appendChild(link);
    }
    if (document.getElementById('ph-site-home-dot')) return;
    var a = document.createElement('a');
    a.id = 'ph-site-home-dot';
    a.className = 'ph-site-home-dot';
    a.href = PH_HOME;
    a.setAttribute('aria-label', 'Pink House home');
    var img = document.createElement('img');
    img.src = '/assets/pinkdot-ph.png?v=' + IMG_VER;
    img.alt = '';
    img.width = 72;
    img.height = 72;
    img.className = 'ph-site-home-dot-img';
    img.setAttribute('decoding', 'async');
    a.appendChild(img);
    a.setAttribute('data-ph-site-dot-ver', DOT_VER);
    (document.body || document.documentElement).appendChild(a);
  }

  function convertPinkMasterButtonsToHome() {
    document.querySelectorAll('button.ph-master[data-ph-widget-toggle], button.logo-mark.ph-master').forEach(function (btn) {
      if (!btn.querySelector('img')) return;
      var a = document.createElement('a');
      a.href = PH_HOME;
      a.className = btn.className.replace(/\bph-master\b/g, '').trim();
      a.setAttribute('aria-label', 'Pink House home');
      while (btn.firstChild) a.appendChild(btn.firstChild);
      btn.parentNode.replaceChild(a, btn);
    });
  }

  function normalizePinkHomeAnchors() {
    document.querySelectorAll('a.logo-mark, a.ph-site-home-dot').forEach(function (a) {
      a.href = PH_HOME;
      a.setAttribute('aria-label', 'Pink House home');
    });
    document.querySelectorAll('a.ph-sight-mark').forEach(function (a) {
      a.href = PH_HOME;
      a.setAttribute('aria-label', 'Pink House home');
    });
    document.querySelectorAll('img.logo-button').forEach(function (img) {
      var a = img.closest('a');
      if (a) {
        a.href = PH_HOME;
        a.setAttribute('aria-label', 'Pink House home');
      }
    });
  }

  function linkOrphanPinkDots() {
    document.querySelectorAll('.ph-loop-hub-dot, .card-pinkloop-dot').forEach(function (img) {
      if (img.closest('a')) {
        img.closest('a').href = PH_HOME;
        return;
      }
      var a = document.createElement('a');
      a.href = PH_HOME;
      a.className = 'ph-pink-dot-home-link';
      a.setAttribute('aria-label', 'Pink House home');
      img.parentNode.insertBefore(a, img);
      a.appendChild(img);
    });
    document.querySelectorAll('.pw-dot--fuzzy img[src*="pinkdot"]').forEach(function (img) {
      if (img.closest('a')) return;
      var a = document.createElement('a');
      a.href = PH_HOME;
      a.className = 'ph-pink-dot-home-link';
      a.setAttribute('aria-label', 'Pink House home');
      img.parentNode.insertBefore(a, img);
      a.appendChild(img);
    });
  }

  function wirePinkDotsToHome() {
    convertPinkMasterButtonsToHome();
    normalizePinkHomeAnchors();
    linkOrphanPinkDots();
    var corner = document.getElementById('ph-site-home-dot');
    if (corner) corner.href = PH_HOME;
  }

  function run() {
    wirePinkDotsToHome();
    if (isPortfolioSection()) {
      removeCornerDot();
      return;
    }
    if (homeWithHeader()) {
      removeCornerDot();
      return;
    }
    ensureCornerDot();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
