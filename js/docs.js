/* ============================================
   Filter Forge — Documentation Engine
   ============================================ */

(function () {
  'use strict';

  var DATA_URL = 'data/docs.json';
  var content = document.getElementById('docs-content');
  var nav = document.getElementById('docs-nav');
  var sidebar = document.getElementById('docs-sidebar');
  var sectionEls = [];
  var navLinks = [];
  var scrollTimer = null;
  var activeLink = null;

  /* ------------------------------------------
     Render sections into the main content area
     ------------------------------------------ */
  function renderContent(sections) {
    sections.forEach(function (section) {
      var el = document.createElement('section');
      el.id = section.id;

      var h2 = document.createElement('h2');
      h2.textContent = section.title;
      el.appendChild(h2);

      var body = document.createElement('div');
      body.innerHTML = section.content;
      el.appendChild(body);

      if (section.subsections && section.subsections.length) {
        section.subsections.forEach(function (sub) {
          var subEl = document.createElement('div');
          subEl.id = sub.id;
          subEl.className = 'docs-subsection';
          subEl.style.scrollMarginTop = 'calc(var(--nav-height, 60px) + 20px)';

          var h3 = document.createElement('h3');
          h3.textContent = sub.title;
          subEl.appendChild(h3);

          var subBody = document.createElement('div');
          subBody.innerHTML = sub.content;
          subEl.appendChild(subBody);

          el.appendChild(subEl);
        });
      }

      content.appendChild(el);
    });
  }

  /* ------------------------------------------
     Build sidebar navigation
     ------------------------------------------ */
  function renderNav(sections) {
    sections.forEach(function (section) {
      var a = document.createElement('a');
      a.href = '#' + section.id;
      a.textContent = section.title;
      a.className = 'nav-section-title';
      a.setAttribute('data-target', section.id);
      nav.appendChild(a);
      navLinks.push(a);

      if (section.subsections && section.subsections.length) {
        section.subsections.forEach(function (sub) {
          var subA = document.createElement('a');
          subA.href = '#' + sub.id;
          subA.textContent = sub.title;
          subA.className = 'nav-subsection';
          subA.setAttribute('data-target', sub.id);
          nav.appendChild(subA);
          navLinks.push(subA);
        });
      }
    });

    // Smooth scroll on nav click
    navLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var targetId = link.getAttribute('data-target');
        var target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.replaceState(null, '', '#' + targetId);
          setActiveLink(link);
          // Close sidebar on mobile
          if (sidebar) sidebar.classList.remove('open');
        }
      });
    });
  }

  /* ------------------------------------------
     Scrollspy — highlight current section
     ------------------------------------------ */
  function collectSectionEls() {
    sectionEls = [];
    navLinks.forEach(function (link) {
      var id = link.getAttribute('data-target');
      var el = document.getElementById(id);
      if (el) {
        sectionEls.push({ id: id, el: el, link: link });
      }
    });
  }

  function setActiveLink(link) {
    if (activeLink === link) return;
    if (activeLink) activeLink.classList.remove('active');
    link.classList.add('active');
    activeLink = link;

    // Scroll sidebar to keep active link visible
    if (sidebar && link.offsetParent) {
      var linkTop = link.offsetTop;
      var sidebarScroll = sidebar.scrollTop;
      var sidebarHeight = sidebar.clientHeight;
      if (linkTop < sidebarScroll + 60 || linkTop > sidebarScroll + sidebarHeight - 60) {
        sidebar.scrollTop = linkTop - sidebarHeight / 3;
      }
    }
  }

  function onScroll() {
    if (scrollTimer) return;
    scrollTimer = setTimeout(function () {
      scrollTimer = null;
      updateScrollspy();
    }, 50);
  }

  function updateScrollspy() {
    var scrollY = window.scrollY || window.pageYOffset;
    var offset = 100; // px from top to consider "current"
    var current = null;

    for (var i = sectionEls.length - 1; i >= 0; i--) {
      var rect = sectionEls[i].el.getBoundingClientRect();
      if (rect.top <= offset) {
        current = sectionEls[i];
        break;
      }
    }

    if (!current && sectionEls.length) {
      current = sectionEls[0];
    }

    if (current) {
      setActiveLink(current.link);
    }
  }

  /* ------------------------------------------
     Copy-to-clipboard for code blocks
     ------------------------------------------ */
  function addCopyButtons() {
    content.querySelectorAll('pre code').forEach(function (codeBlock) {
      var pre = codeBlock.parentElement;
      if (pre.querySelector('.copy-btn')) return;
      var btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      btn.addEventListener('click', function () {
        navigator.clipboard.writeText(codeBlock.textContent).then(function () {
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          setTimeout(function () {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
          }, 1500);
        });
      });
      pre.appendChild(btn);
    });
  }

  /* ------------------------------------------
     Mobile sidebar toggle button
     ------------------------------------------ */
  function addSidebarToggle() {
    var existing = document.querySelector('.docs-sidebar-toggle');
    if (existing) return;

    var btn = document.createElement('button');
    btn.className = 'docs-sidebar-toggle';
    btn.setAttribute('aria-label', 'Toggle sidebar navigation');
    btn.innerHTML = '&#9776;';
    document.body.appendChild(btn);

    btn.addEventListener('click', function () {
      if (sidebar) {
        sidebar.classList.toggle('open');
        btn.innerHTML = sidebar.classList.contains('open') ? '&#10005;' : '&#9776;';
      }
    });
  }

  /* ------------------------------------------
     Deep linking — scroll to hash on load
     ------------------------------------------ */
  function handleDeepLink() {
    if (!window.location.hash) return;
    var id = window.location.hash.slice(1);
    var target = document.getElementById(id);
    if (target) {
      setTimeout(function () {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);

      // Highlight matching nav link
      for (var i = 0; i < navLinks.length; i++) {
        if (navLinks[i].getAttribute('data-target') === id) {
          setActiveLink(navLinks[i]);
          break;
        }
      }
    }
  }

  /* ------------------------------------------
     Bootstrap — fetch data and initialize
     ------------------------------------------ */
  fetch(DATA_URL)
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (data) {
      if (!data.sections || !data.sections.length) {
        content.innerHTML += '<p class="text-muted text-center">No documentation available.</p>';
        return;
      }

      renderContent(data.sections);
      renderNav(data.sections);
      addCopyButtons();
      addSidebarToggle();
      collectSectionEls();

      // Scrollspy
      window.addEventListener('scroll', onScroll, { passive: true });
      updateScrollspy();

      // Deep link
      handleDeepLink();

      // Handle hash changes (e.g. user clicks a link elsewhere)
      window.addEventListener('hashchange', function () {
        handleDeepLink();
      });
    })
    .catch(function (err) {
      content.innerHTML += '<p class="text-muted text-center">Failed to load documentation data.</p>';
      console.error('Docs load error:', err);
    });

})();
