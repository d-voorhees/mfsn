// Site search: input-bar overlay + results modal, powered by Pagefind.
// Plain static script (not bundled by Vite) so the native import() of
// /pagefind/pagefind.js runs as written — see the note in search.astro.
(function () {
  var backdrop = document.getElementById('searchBackdrop');
  var bar = document.getElementById('searchBar');
  var form = document.getElementById('searchForm');
  var input = document.getElementById('searchInput');
  var modal = document.getElementById('searchModal');
  var titleEl = document.getElementById('searchModalTitle');
  var statusEl = document.getElementById('searchStatus');
  var resultsEl = document.getElementById('searchResults');
  if (!backdrop || !bar || !form || !input || !modal) return;

  var pagefind = null;
  var lastFocus = null;
  var requestId = 0;

  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function isOpen(el) { return !el.hidden; }

  function syncBackdrop() {
    var any = isOpen(bar) || isOpen(modal);
    backdrop.hidden = !any;
    document.body.classList.toggle('search-open', any);
  }

  function openBar(prefill) {
    lastFocus = document.activeElement;
    var menuClose = document.getElementById('mobileMenuClose');
    if (document.body.classList.contains('mobile-menu-open') && menuClose) menuClose.click();
    bar.hidden = false;
    syncBackdrop();
    if (typeof prefill === 'string') input.value = prefill;
    input.focus();
    input.select();
  }

  function closeBar() {
    bar.hidden = true;
    syncBackdrop();
  }

  function openModal() {
    closeBar();
    modal.hidden = false;
    syncBackdrop();
    modal.querySelector('.search-close').focus();
  }

  function closeAll() {
    bar.hidden = true;
    modal.hidden = true;
    syncBackdrop();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  async function loadPagefind() {
    if (pagefind) return pagefind;
    try {
      pagefind = await import('/pagefind/pagefind.js');
      await pagefind.init();
      return pagefind;
    } catch (err) {
      console.error('Pagefind failed to load', err);
      return null;
    }
  }

  async function runSearch(query) {
    query = query.trim();
    if (!query) return;
    var id = ++requestId;
    titleEl.textContent = 'Results for “' + query + '”';
    statusEl.textContent = 'Searching…';
    resultsEl.innerHTML = '';
    openModal();

    var pf = await loadPagefind();
    if (id !== requestId) return;
    if (!pf) {
      statusEl.textContent =
        'Search is unavailable right now. If you are running locally, run "npm run build" and "npm run preview" to generate the search index.';
      return;
    }

    var search = await pf.search(query);
    if (id !== requestId) return;
    if (search.results.length === 0) {
      statusEl.textContent = 'No results found. Try a different word.';
      return;
    }

    var items = await Promise.all(search.results.slice(0, 20).map(function (r) { return r.data(); }));
    if (id !== requestId) return;
    var n = search.results.length;
    statusEl.textContent = n + (n === 1 ? ' result' : ' results');
    resultsEl.innerHTML = items
      .map(function (item) {
        var title = (item.meta && item.meta.title ? item.meta.title : item.url)
          .replace(/\s*\|\s*(Manatee Food Security Network|MFSN).*$/, '');
        return (
          '<article class="search-result">' +
          '<h3><a href="' + esc(item.url) + '">' + esc(title) + '</a></h3>' +
          '<p>' + item.excerpt + '</p>' +
          '</article>'
        );
      })
      .join('');
    resultsEl.scrollTop = 0;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    runSearch(input.value);
  });

  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-search-open]');
    if (opener) {
      e.preventDefault();
      openBar();
      return;
    }
    if (e.target.closest('[data-search-close]')) closeAll();
  });

  backdrop.addEventListener('click', closeAll);

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (isOpen(modal) || isOpen(bar)) closeAll();
  });

  // Keep Tab / Shift+Tab inside whichever search dialog is open.
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var dialog = isOpen(modal) ? modal : isOpen(bar) ? bar : null;
    if (!dialog) return;
    var items = Array.prototype.slice.call(dialog.querySelectorAll('a[href], button, input'))
      .filter(function (el) { return !el.disabled && el.offsetParent !== null; });
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (!dialog.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // Exposed for the /search/ fallback page and any future callers.
  window.openSiteSearch = function (query) {
    if (query) {
      input.value = query;
      runSearch(query);
    } else {
      openBar();
    }
  };
})();
