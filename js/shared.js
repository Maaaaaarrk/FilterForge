/* ============================================
   Filter Forge — Shared JavaScript
   ============================================ */

(function () {
  'use strict';

  // Highlight active nav link
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // Mobile hamburger toggle
  var hamburger = document.querySelector('.nav-hamburger');
  var navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      var expanded = navLinks.classList.contains('open');
      hamburger.setAttribute('aria-expanded', String(expanded));
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.focus();
      }
    });
  }

  // Retro/Modern style toggle (same styles as hiimpd2.com)
  var themeToggles = document.querySelectorAll('.theme-toggle');
  function renderThemeToggles() {
    var next = document.documentElement.dataset.theme === 'modern' ? 'retro' : 'modern';
    themeToggles.forEach(function (btn) {
      btn.querySelector('.theme-toggle-label').textContent = next === 'modern' ? 'Modern style' : 'Retro style';
      btn.setAttribute('aria-label', 'Switch to the ' + next + ' style');
      btn.title = 'Switch to the ' + next + ' style';
    });
  }
  themeToggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = document.documentElement.dataset.theme === 'modern' ? 'retro' : 'modern';
      if (next === 'modern') document.documentElement.dataset.theme = 'modern';
      else delete document.documentElement.dataset.theme;
      try { localStorage.setItem('filterforge.theme', next); } catch (e) {}
      renderThemeToggles();
    });
  });
  renderThemeToggles();

  // Copy-to-clipboard for code blocks
  document.querySelectorAll('pre code').forEach(function (codeBlock) {
    var pre = codeBlock.parentElement;
    if (pre.querySelector('.copy-btn')) return;
    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.setAttribute('aria-label', 'Copy code');
    btn.addEventListener('click', function () {
      navigator.clipboard.writeText(codeBlock.textContent).then(function () {
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(function () {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 1500);
      }).catch(function () {
        btn.textContent = 'Copy failed';
        setTimeout(function () {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 1500);
      });
    });
    pre.appendChild(btn);
  });
})();
