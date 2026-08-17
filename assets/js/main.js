// Legacy anchor redirects: sections that moved to their own pages.
(function () {
  if (location.pathname !== '/' && !/\/index\.html$/.test(location.pathname)) return;
  const moved = { '#technology': '/technology/', '#devices': '/technology/#devices',
                  '#team': '/team/', '#faq': '/faq/' };
  const dest = moved[location.hash];
  if (dest && !document.querySelector(location.hash)) location.replace(dest);
})();

  // ── PHONE GALLERY ──
  (function () {
    const gallery = document.getElementById('phoneGallery');
    if (!gallery) return;
    const phones = Array.from(gallery.querySelectorAll('.phone-phone'));
    const dots = Array.from(gallery.querySelectorAll('.phone-dot'));
    let active = 1;

    function render() {
      phones.forEach((phone, i) => {
        phone.classList.remove('phone-center', 'phone-left', 'phone-right');
        if (i === active) {
          phone.classList.add('phone-center');
          phone.setAttribute('aria-current', 'true');
        } else if (i === (active + 2) % 3) {
          phone.classList.add('phone-left');
          phone.setAttribute('aria-current', 'false');
        } else {
          phone.classList.add('phone-right');
          phone.setAttribute('aria-current', 'false');
        }
      });
      dots.forEach((dot, i) => dot.classList.toggle('phone-dot-active', i === active));
    }

    phones.forEach((phone, i) => {
      phone.addEventListener('click', () => {
        if (i !== active) { active = i; render(); }
      });
      phone.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (i !== active) { active = i; render(); }
        }
      });
    });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        if (i !== active) { active = i; render(); }
      });
    });
  })();

  // ── THEME TOGGLE ──
  const html = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  const drawerThemeBtn = document.getElementById('drawerThemeToggle');

  // First-load detection lives in the inline head script in _layouts/default.html
  // so the theme is right before first paint; only the toggle belongs here.

  function toggleTheme() {
    const current = html.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('wl-theme', next);
  }

  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
  if (drawerThemeBtn) drawerThemeBtn.addEventListener('click', toggleTheme);

  // ── HAMBURGER MENU ──
  const hamburger = document.getElementById('navHamburger');
  const drawer    = document.getElementById('navDrawer');
  const overlay   = document.getElementById('navOverlay');

  function openMenu() {
    hamburger.classList.add('open');
    drawer.classList.add('open');
    overlay.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    hamburger.classList.remove('open');
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.contains('open') ? closeMenu() : openMenu();
    });
  }
  if (overlay) overlay.addEventListener('click', closeMenu);

  const drawerClose = document.getElementById('navDrawerClose');
  if (drawerClose) drawerClose.addEventListener('click', closeMenu);

  // Close on nav link click
  document.querySelectorAll('[data-close-nav]').forEach(a => {
    a.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) closeMenu();
  });

  // Custom cursor. Guarded: everything below this point used to die with it.
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (cursor && ring) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx - 4 + 'px';
      cursor.style.top = my - 4 + 'px';
    });

    function animRing() {
      rx += (mx - rx - 16) * 0.22;
      ry += (my - ry - 16) * 0.22;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animRing);
    }
    animRing();

    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2.5)';
        ring.style.width = '48px';
        ring.style.height = '48px';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        ring.style.width = '32px';
        ring.style.height = '32px';
      });
    });
  }

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => obs.observe(el));
  // Tells the head-script watchdog the reveal system came up, so it leaves the
  // `js` class in place. If we never get here, the class is dropped and the
  // hidden content becomes visible instead of stranding a blank page.
  window.__wlRevealReady = true;

  // Animate counter numbers
  function animateCounter(el, target, suffix='') {
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.innerHTML = Math.floor(current) + suffix;
    }, 25);
  }

  // Plane replay loop
  function replayPlane(el, delay) {
    setTimeout(() => {
      el.style.animation = 'none';
      el.offsetHeight; // reflow
      const animName = el.classList.contains('plane-wrap-2') ? 'plane-fly-2' : 'plane-fly';
      const dur = el.classList.contains('plane-wrap-2') ? '9s' : '7s';
      el.style.animation = `${animName} ${dur} cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
      el.addEventListener('animationend', () => replayPlane(el, delay), { once: true });
    }, delay);
  }

  const p1 = document.getElementById('plane1');
  const p2 = document.getElementById('plane2');
  if (p1) p1.addEventListener('animationend', () => replayPlane(p1, 4000), { once: true });
  if (p2) p2.addEventListener('animationend', () => replayPlane(p2, 6000), { once: true });

  const eegObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.eeg-wave-line').forEach(line => {
          line.style.animation = 'none';
          line.offsetHeight;
          line.style.animation = '';
        });
      }
    });
  }, { threshold: 0.3 });

  const eegCard = document.querySelector('.eeg-card');
  if (eegCard) eegObserver.observe(eegCard);

  // ── WAITLIST ──
  // AJAX submit to Brevo: stay on the page and show an inline confirmation.
  // Falls back to native POST if fetch fails for any reason other than a
  // definitive rejection. Placeholder endpoints are blocked with an honest note.
  const wlForm = document.getElementById('waitlistForm');
  if (wlForm) {
    const wlNote = (html, ok) => {
      let note = document.getElementById('wlNote');
      if (!note) {
        note = document.createElement('p');
        note.id = 'wlNote';
        note.className = 'waitlist-privacy';
        wlForm.insertAdjacentElement('afterend', note);
      }
      note.style.color = ok ? 'var(--gold)' : 'var(--crimson-glow)';
      note.innerHTML = html;
    };

    wlForm.addEventListener('submit', async (e) => {
      const action = wlForm.getAttribute('action') || '';
      if (!action.startsWith('https://')) {
        e.preventDefault();
        wlNote('The waitlist opens very soon — meanwhile, reach us at contact@werulux.com.', false);
        return;
      }

      e.preventDefault();
      const btn = wlForm.querySelector('.waitlist-submit');
      const defaultLabel = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Joining…';

      try {
        const res = await fetch(action, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new URLSearchParams(new FormData(wlForm))
        });
        const data = await res.json();
        if (data && data.success) {
          wlNote('&#10022; You&rsquo;re on the list! We&rsquo;ll be in touch with launch news.', true);
          wlForm.querySelector('#wl-email').value = '';
          btn.textContent = 'Joined ✓';
          setTimeout(() => { btn.textContent = defaultLabel; btn.disabled = false; }, 6000);
          return;
        }
        wlNote('That didn&rsquo;t go through. Please try again, or email <a href="mailto:contact@werulux.com">contact@werulux.com</a>.', false);
        btn.textContent = defaultLabel;
        btn.disabled = false;
      } catch (err) {
        // CORS or network blocked reading the result — do the native submit instead.
        btn.textContent = defaultLabel;
        btn.disabled = false;
        wlForm.submit();
      }
    });
  }

  // ── CONTACT FORM (Formspree) ──
  // Set to the real Formspree form ID (the code in https://formspree.io/f/<ID>).
  const FORMSPREE_ID = 'moeadqqz';

  const cfSubmit = document.getElementById('cfSubmit');
  const cfConfirm = document.getElementById('cfConfirm');
  const cfError = document.getElementById('cfError');
  const cfSubmitDefaultHTML = cfSubmit ? cfSubmit.innerHTML : '';
  const cfErrorDefaultHTML = cfError ? cfError.innerHTML : '';
  const showError = (html) => {
    cfError.innerHTML = html;
    cfError.classList.add('visible');
  };

  if (cfSubmit) {
    cfSubmit.addEventListener('click', async () => {
      const name    = document.getElementById('cf-name').value.trim();
      const org     = document.getElementById('cf-org').value.trim();
      const email   = document.getElementById('cf-email').value.trim();
      const subject = document.getElementById('cf-subject').value;
      const message = document.getElementById('cf-message').value.trim();
      const gotcha  = document.getElementById('cf-gotcha').value;

      if (!email || !subject || !message) {
        ['cf-email','cf-subject','cf-message'].forEach(id => {
          const el = document.getElementById(id);
          if (!el.value.trim()) {
            el.style.borderColor = 'rgba(194,49,82,0.7)';
            setTimeout(() => el.style.borderColor = '', 2000);
          }
        });
        return;
      }

      // Email format check (existence can't be verified client-side)
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        const el = document.getElementById('cf-email');
        el.style.borderColor = 'rgba(194,49,82,0.7)';
        setTimeout(() => el.style.borderColor = '', 2000);
        showError('Please enter a valid email address so we can reply to you.');
        return;
      }

      // Per-browser cooldown: stops double-sends and casual repeat submissions.
      const COOLDOWN_MS = 10 * 60 * 1000;
      const last = parseInt(localStorage.getItem('wl-cf-last') || '0', 10);
      if (Date.now() - last < COOLDOWN_MS) {
        const mins = Math.ceil((COOLDOWN_MS - (Date.now() - last)) / 60000);
        showError(`Your previous message was just sent. Please wait ${mins} more minute${mins > 1 ? 's' : ''} before sending another, or email us directly at <a href="mailto:contact@werulux.com">contact@werulux.com</a>.`);
        return;
      }

      cfConfirm.classList.remove('visible');
      cfError.classList.remove('visible');
      cfError.innerHTML = cfErrorDefaultHTML;
      cfSubmit.disabled = true;
      cfSubmit.textContent = 'Sending…';

      let ok = false;
      try {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name, organization: org, email, message,
            _subject: `[werulux.com] ${subject}`,
            _gotcha: gotcha
          })
        });
        ok = res.ok;
      } catch (e) {
        ok = false;
      }

      if (ok) {
        localStorage.setItem('wl-cf-last', String(Date.now()));
        cfConfirm.classList.add('visible');
        cfSubmit.textContent = 'Sent ✦';
        cfSubmit.style.background = 'rgba(194,49,82,0.25)';
        ['cf-name','cf-org','cf-email','cf-message'].forEach(id => document.getElementById(id).value = '');
        document.getElementById('cf-subject').selectedIndex = 0;
        setTimeout(() => {
          cfConfirm.classList.remove('visible');
          cfSubmit.innerHTML = cfSubmitDefaultHTML;
          cfSubmit.style.background = '';
          cfSubmit.disabled = false;
        }, 6000);
      } else {
        cfError.classList.add('visible');
        cfSubmit.innerHTML = cfSubmitDefaultHTML;
        cfSubmit.disabled = false;
      }
    });
  }

// ── JET LAG CALCULATOR ──
(function () {
  const fromSel = document.getElementById('jl-from');
  const toSel = document.getElementById('jl-to');
  if (!fromSel || !toSel) return;

  // Standard (non-DST) UTC offsets — an estimate is the product here, not a flight planner.
  const CITIES = [
    ['Tokyo', 9], ['Osaka', 9], ['Seoul', 9], ['Sydney', 10], ['Melbourne', 10],
    ['Auckland', 12], ['Singapore', 8], ['Hong Kong', 8], ['Shanghai', 8], ['Beijing', 8],
    ['Bangkok', 7], ['Jakarta', 7], ['Delhi', 5.5], ['Mumbai', 5.5], ['Dubai', 4],
    ['Doha', 3], ['Riyadh', 3], ['Istanbul', 3], ['Moscow', 3], ['Nairobi', 3],
    ['Cairo', 2], ['Johannesburg', 2], ['Paris', 1], ['Berlin', 1], ['Madrid', 1],
    ['Rome', 1], ['Amsterdam', 1], ['Zurich', 1], ['Lagos', 1], ['London', 0],
    ['Casablanca', 0], ['São Paulo', -3], ['Buenos Aires', -3], ['New York', -5],
    ['Boston', -5], ['Toronto', -5], ['Miami', -5], ['Chicago', -6], ['Mexico City', -6],
    ['Denver', -7], ['Los Angeles', -8], ['San Francisco', -8], ['Seattle', -8],
    ['Vancouver', -8], ['Honolulu', -10]
  ];

  CITIES.forEach(([name, off], i) => {
    for (const sel of [fromSel, toSel]) {
      const o = document.createElement('option');
      o.value = i;
      o.textContent = name + ' (UTC' + (off >= 0 ? '+' : '') + off + ')';
      sel.appendChild(o.cloneNode(true));
    }
  });
  fromSel.value = CITIES.findIndex(c => c[0] === 'Tokyo');
  toSel.value = CITIES.findIndex(c => c[0] === 'New York');

  // 24h dial: midnight at the top, clockwise (matches the app's circadian clock)
  const CX = 120, CY = 120, R = 94;
  const pointAt = (hour, radius) => {
    const t = (hour / 24) * 2 * Math.PI;
    return { x: CX + radius * Math.sin(t), y: CY - radius * Math.cos(t) };
  };

  const ticksG = document.getElementById('jl-ticks');
  const LABELS = { 0: '00', 6: '06', 12: '12', 18: '18' };
  for (let h = 0; h < 24; h++) {
    const major = h % 6 === 0;
    const a = pointAt(h, R - (major ? 15 : 9));
    const b = pointAt(h, R - 4);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', a.x); line.setAttribute('y1', a.y);
    line.setAttribute('x2', b.x); line.setAttribute('y2', b.y);
    line.setAttribute('class', major ? 'jl-tick jl-tick-major' : 'jl-tick');
    ticksG.appendChild(line);
    if (major) {
      const p = pointAt(h, R + 17);
      const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      txt.setAttribute('x', p.x); txt.setAttribute('y', p.y + 4);
      txt.setAttribute('class', 'jl-hour');
      txt.setAttribute('text-anchor', 'middle');
      txt.textContent = LABELS[h];
      ticksG.appendChild(txt);
    }
  }

  const NIGHT_START = 21, NIGHT_END = 6;   // 21:00 -> 06:00 spans 9h
  const nightPath = document.getElementById('jl-night');
  {
    const s = pointAt(NIGHT_START, R), e = pointAt(NIGHT_END, R);
    nightPath.setAttribute('d', `M ${s.x} ${s.y} A ${R} ${R} 0 0 1 ${e.x} ${e.y}`);
  }

  const els = {
    home: document.getElementById('jl-home'),
    homeHalo: document.getElementById('jl-home-halo'),
    dest: document.getElementById('jl-dest'),
    destHalo: document.getElementById('jl-dest-halo'),
    legHome: document.getElementById('jl-leg-home'),
    legDest: document.getElementById('jl-leg-dest')
  };

  // local wall clock for a given UTC offset
  const pad = (n) => String(n).padStart(2, '0');
  function wallClock(offsetHours) {
    const now = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const d = new Date(utcMs + offsetHours * 3600000);
    return { h: d.getHours(), m: d.getMinutes(), label: pad(d.getHours()) + ':' + pad(d.getMinutes()) };
  }

  function placeMarker(dot, halo, hour) {
    const p = pointAt(hour, R);
    dot.setAttribute('cx', p.x); dot.setAttribute('cy', p.y);
    halo.setAttribute('cx', p.x); halo.setAttribute('cy', p.y);
  }

  function update() {
    const from = CITIES[fromSel.value], to = CITIES[toSel.value];
    let diff = to[1] - from[1];
    if (diff > 12) diff -= 24;
    if (diff < -12) diff += 24;
    const shift = Math.abs(diff);
    const east = diff > 0;

    const daysRaw = shift === 0 ? 0 : shift * (east ? 1.0 : 0.66);
    const days = Math.round(daysRaw * 2) / 2;

    document.getElementById('jl-shift').textContent =
      shift === 0 ? 'None' : shift + (shift === 1 ? ' hour' : ' hours');
    document.getElementById('jl-direction').textContent =
      shift === 0 ? '—' : (east ? 'Eastward (harder on the body clock)' : 'Westward (easier on the body clock)');
    document.getElementById('jl-impact').textContent =
      shift === 0 ? 'None' : shift <= 3 ? 'Mild' : shift <= 6 ? 'Moderate' : 'Severe';

    const daysEl = document.getElementById('jl-days');
    const labelEl = document.getElementById('jl-days-label');
    if (shift === 0) {
      daysEl.textContent = '0';
      labelEl.textContent = 'no body-clock shift';
      document.getElementById('jl-note').textContent =
        'Same time zone — no circadian jet lag, though long flights still cost sleep and hydration.';
    } else {
      daysEl.textContent = '≈ ' + (days % 1 === 0 ? days : days.toFixed(1));
      labelEl.textContent = days === 1 ? 'day to recover' : 'days to recover';
      document.getElementById('jl-note').textContent =
        'Roughly ' + (days % 1 === 0 ? days : days.toFixed(1)) + ' day' + (days === 1 ? '' : 's') +
        ' of degraded sleep, focus, and energy — unaided. A personalized light, sleep, and caffeine plan is how that window shrinks.';
    }

    // place both cities on the 24h dial at their current local time
    const hw = wallClock(from[1]), dw = wallClock(to[1]);
    placeMarker(els.home, els.homeHalo, hw.h + hw.m / 60);
    placeMarker(els.dest, els.destHalo, dw.h + dw.m / 60);
    els.legHome.textContent = from[0] + ' ' + hw.label;
    els.legDest.textContent = to[0] + ' ' + dw.label;
  }

  fromSel.addEventListener('change', update);
  toSel.addEventListener('change', update);
  // keep both clocks honest while the page is open
  setInterval(update, 30000);
  document.getElementById('jl-swap').addEventListener('click', () => {
    const tmp = fromSel.value; fromSel.value = toSel.value; toSel.value = tmp;
    update();
  });
  update();
})();

// ── TESTIMONIAL CAROUSEL ──
// Circular list. The card set is cloned before and after the originals, and the
// position is silently re-anchored to the middle band *before* each move — so a
// slide never has to be undone afterwards and 5 → 1 looks like any other step.
(function () {
  const track = document.getElementById('tstTrack');
  if (!track) return;
  const originals = [...track.querySelectorAll('.tst-card')];
  const n = originals.length;
  if (!n) return;

  const viewport = track.parentElement;
  const dots = [...document.querySelectorAll('.tst-dot')];
  const prev = document.getElementById('tstPrev');
  const next = document.getElementById('tstNext');
  const loop = n > 1;

  if (loop) {
    const before = originals.map(c => c.cloneNode(true));
    const after = originals.map(c => c.cloneNode(true));
    [...before, ...after].forEach(c => {
      c.setAttribute('aria-hidden', 'true');
      c.tabIndex = -1;
    });
    track.prepend(...before);
    track.append(...after);
  }

  const cards = [...track.querySelectorAll('.tst-card')];
  const base = loop ? n : 0;                    // index of the first real card
  let active = base + Math.floor((n - 1) / 2);  // open on the middle card

  const realOf = (i) => ((i - base) % n + n) % n;

  function render(animate) {
    const card = cards[active];
    if (!card) return;
    if (!animate) track.classList.add('tst-no-anim');
    const offset = card.offsetLeft + card.offsetWidth / 2 - viewport.offsetWidth / 2;
    track.style.transform = `translateX(${-offset}px)`;
    cards.forEach((c, i) => c.classList.toggle('is-active', i === active));
    dots.forEach((d, i) => d.classList.toggle('tst-dot-active', i === realOf(active)));
    if (!animate) {
      void track.offsetWidth;                   // flush the jump before re-enabling
      track.classList.remove('tst-no-anim');
    }
  }

  // Jump (invisibly) to the copy of the current card that sits in the middle
  // band, so there is always a full set of cards on either side to slide into.
  function anchor() {
    if (!loop) return;
    const home = base + realOf(active);
    if (home !== active) { active = home; render(false); }
  }

  function step(dir) {
    if (!loop) { active = Math.max(0, Math.min(n - 1, active + dir)); return render(true); }
    anchor();
    active += dir;
    render(true);
  }

  function goToReal(target) {
    if (!loop) { active = target; return render(true); }
    anchor();
    // shortest route, counting the wrap-around copies
    const best = [base + target - n, base + target, base + target + n]
      .reduce((a, b) => Math.abs(b - active) < Math.abs(a - active) ? b : a);
    active = best;
    render(true);
  }

  cards.forEach((c, i) => {
    c.addEventListener('click', () => {
      if (i === active) return;
      active = i;
      render(true);
    });
    c.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goToReal(realOf(i)); }
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    });
  });

  dots.forEach((d, i) => d.addEventListener('click', () => goToReal(i)));
  if (prev) prev.addEventListener('click', () => step(-1));
  if (next) next.addEventListener('click', () => step(1));

  let x0 = null;
  viewport.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  viewport.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 45) step(dx < 0 ? 1 : -1);
    x0 = null;
  }, { passive: true });

  window.addEventListener('resize', () => render(false));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => render(false));
  render(false);
})();

// ── VALUE PANELS ON TOUCH / SMALL SCREENS ──
// Desktop opens on hover; here a tap swaps the photo for the text, one at a time.
(function () {
  const wrap = document.querySelector('.value-accordion');
  if (!wrap) return;
  const panels = [...wrap.querySelectorAll('.va-panel')];
  const compact = window.matchMedia('(max-width: 900px), (hover: none)');

  panels.forEach((panel) => {
    const toggle = () => {
      if (!compact.matches) return;
      const open = panel.classList.contains('va-open');
      panels.forEach(p => {
        p.classList.remove('va-open');
        const t = p.querySelector('.va-toggle');
        if (t) t.textContent = '+';
      });
      if (!open) {
        panel.classList.add('va-open');
        const t = panel.querySelector('.va-toggle');
        if (t) t.textContent = '−';
      }
    };
    panel.addEventListener('click', toggle);
    panel.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });

  // leaving compact mode should not strand a panel in the open state
  compact.addEventListener('change', (e) => {
    if (!e.matches) panels.forEach(p => {
      p.classList.remove('va-open');
      const t = p.querySelector('.va-toggle');
      if (t) t.textContent = '+';
    });
  });
})();
