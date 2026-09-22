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
    }

    function closeMenu() {
      menu.classList.remove('is-open');
      overlay.classList.remove('is-open');
      document.body.classList.remove('mobile-menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      menu.setAttribute('data-active-panel', 'root');
    }

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
      });
    });

    backButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        menu.setAttribute('data-active-panel', 'root');
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
