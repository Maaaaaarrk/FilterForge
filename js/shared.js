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

  // Mobile hamburger toggle. The button sits before the links in the DOM
  // so keyboard focus moves straight into the open menu.
  var hamburger = document.querySelector('.nav-hamburger');
  var navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    var setMenuOpen = function (open) {
      navLinks.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    };
    var isMenuOpen = function () {
      return navLinks.classList.contains('open');
    };

    setMenuOpen(false);
    hamburger.addEventListener('click', function () {
      setMenuOpen(!isMenuOpen());
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMenuOpen(false); });
    });
    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isMenuOpen()) {
        setMenuOpen(false);
        hamburger.focus();
      }
    });
    // Close on a click outside the menu
    document.addEventListener('click', function (e) {
      if (isMenuOpen() && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        setMenuOpen(false);
      }
    });
    // Close when keyboard focus leaves the menu
    navLinks.addEventListener('focusout', function (e) {
      var next = e.relatedTarget;
      if (isMenuOpen() && next && !navLinks.contains(next) && next !== hamburger) {
        setMenuOpen(false);
      }
    });
    // Close when the viewport grows past the mobile breakpoint
    var desktopQuery = window.matchMedia('(min-width: 961px)');
    var onBreakpoint = function (e) { if (e.matches) setMenuOpen(false); };
    if (desktopQuery.addEventListener) desktopQuery.addEventListener('change', onBreakpoint);
    else if (desktopQuery.addListener) desktopQuery.addListener(onBreakpoint);
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
