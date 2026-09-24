(function () {
  function initMobileMenu() {
    var toggle = document.getElementById('mobileMenuToggle');
    var menu = document.getElementById('mobileMenu');
    var overlay = document.getElementById('mobileMenuOverlay');
    var closeBtn = document.getElementById('mobileMenuClose');
    if (!toggle || !menu || !overlay) return;

    var drillButtons = menu.querySelectorAll('.mobile-menu-drill');
    var backButtons = menu.querySelectorAll('.mobile-menu-back');
    var links = menu.querySelectorAll('.mobile-menu-list a');

    function openMenu() {
      menu.classList.add('is-open');
      overlay.classList.add('is-open');
      document.body.classList.add('mobile-menu-open');
      toggle.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-hidden', 'false');
      // Move focus into the dialog (the closed menu is visibility:hidden, so
      // it is only focusable once open).
      if (closeBtn) closeBtn.focus();
    }

    function closeMenu() {
      menu.classList.remove('is-open');
      overlay.classList.remove('is-open');
      document.body.classList.remove('mobile-menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      menu.setAttribute('data-active-panel', 'root');
      toggle.focus();
    }

    // Keep Tab / Shift+Tab inside the open menu, and only inside the panel
    // that is currently showing (the other drill-down panels are off-screen).
    function focusables() {
      var active = menu.getAttribute('data-active-panel');
      var scope = menu.querySelector('.mobile-menu-panel[data-panel="' + active + '"]');
      var list = Array.prototype.slice.call(menu.querySelectorAll('.mobile-menu-header a, .mobile-menu-header button'));
      if (scope) list = list.concat(Array.prototype.slice.call(scope.querySelectorAll('a[href], button')));
      return list;
    }

    menu.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var items = focusables();
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    toggle.addEventListener('click', function () {
      if (menu.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);

    drillButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        menu.setAttribute('data-active-panel', btn.getAttribute('data-target'));
        var next = menu.querySelector('.mobile-menu-panel[data-panel="' + btn.getAttribute('data-target') + '"] .mobile-menu-back');
        if (next) next.focus();
      });
    });

    backButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        menu.setAttribute('data-active-panel', 'root');
        var root = menu.querySelector('.mobile-menu-panel[data-panel="root"] .mobile-menu-drill');
        if (root) root.focus();
      });
    });

    links.forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu();
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 768 && menu.classList.contains('is-open')) closeMenu();
    });

    var currentPath = window.location.pathname.split('/').pop() || 'index.html';
    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href && href === currentPath) link.classList.add('is-current');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
  } else {
    initMobileMenu();
  }
})();
