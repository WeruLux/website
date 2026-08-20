// Runs synchronously in <head>, before the stylesheets, so the theme is right
// at first paint and .reveal content is only hidden when scripts work (the
// watchdog drops the class if main.js never signals). Lives in its own file
// rather than inline so the Content-Security-Policy needs no script hashes.
(function () {
  var d = document.documentElement;
  d.className += ' js';
  try {
    var t = localStorage.getItem('wl-theme');
    if (t) d.setAttribute('data-theme', t);
    else if (!window.matchMedia('(prefers-color-scheme: dark)').matches) d.setAttribute('data-theme', 'light');
  } catch (e) {}
  addEventListener('load', function () {
    setTimeout(function () {
      if (!window.__wlRevealReady) d.classList.remove('js');
    }, 1200);
  });
})();
