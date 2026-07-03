/* Guillory's Collision Center — redesign concept interactions */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Current year in footer ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---- Mobile nav toggle (side drawer + scrim) ---- */
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.getElementById('nav-links');
  var scrim = document.querySelector('.nav-scrim');
  var mainEl = document.getElementById('main');
  var footerEl = document.querySelector('.site-footer');
  var closeBtn = null;
  var navIsOpen = false;

  // Inject a close (X) button at the top of the drawer.
  if (navLinks) {
    closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'nav-close';
    closeBtn.setAttribute('aria-label', 'Close menu');
    closeBtn.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
    navLinks.insertBefore(closeBtn, navLinks.firstChild);
  }

  function isMobile() { return window.innerWidth <= 760; }

  function setInert(on) {
    // Mark the rest of the page inert / aria-hidden while the drawer is open.
    [mainEl, footerEl].forEach(function (el) {
      if (!el) return;
      if (on) { el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true'); }
      else { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); }
    });
  }

  function focusableInDrawer() {
    return navLinks.querySelectorAll('a[href], button:not([disabled])');
  }

  function setNav(open) {
    navIsOpen = open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    navLinks.classList.toggle('open', open);
    if (scrim) {
      if (open) scrim.hidden = false;
      scrim.classList.toggle('open', open);
    }
    if (header) header.classList.toggle('nav-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    document.documentElement.style.overflow = open ? 'hidden' : '';

    // Keep off-canvas links out of the tab order when the drawer is closed
    // (or at desktop widths where it isn't used).
    if (open && isMobile()) {
      navLinks.removeAttribute('inert');
      setInert(true);
      var first = focusableInDrawer()[0];
      if (first) first.focus();
    } else {
      setInert(false);
      if (isMobile()) navLinks.setAttribute('inert', '');
      else navLinks.removeAttribute('inert');
    }
  }

  if (toggle && navLinks) {
    // At mobile widths the closed drawer must not be reachable by Tab.
    if (isMobile()) navLinks.setAttribute('inert', '');

    toggle.addEventListener('click', function () {
      var willOpen = !navIsOpen;
      setNav(willOpen);
      if (!willOpen) toggle.focus();
    });
    navLinks.addEventListener('click', function (e) {
      if (e.target.closest('a')) { setNav(false); toggle.focus(); }
    });
    if (closeBtn) closeBtn.addEventListener('click', function () { setNav(false); toggle.focus(); });
    if (scrim) scrim.addEventListener('click', function () { setNav(false); toggle.focus(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navIsOpen) { setNav(false); toggle.focus(); return; }
      // Focus trap: cycle Tab within the drawer.
      if (e.key === 'Tab' && navIsOpen) {
        var items = focusableInDrawer();
        if (!items.length) return;
        var firstEl = items[0], lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault(); lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault(); firstEl.focus();
        } else if (!navLinks.contains(document.activeElement)) {
          e.preventDefault(); firstEl.focus();
        }
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 760) {
        if (navIsOpen) setNav(false);
        navLinks.removeAttribute('inert');
        setInert(false);
      } else if (!navIsOpen) {
        navLinks.setAttribute('inert', '');
      }
    });
  }

  /* ---- Sticky header: shrink on scroll + reveal on any upward scroll ---- */
  var lastY = window.scrollY;
  function onScroll() {
    var y = window.scrollY;
    if (header) {
      header.classList.toggle('scrolled', y > 24);
      if (navIsOpen) {
        header.classList.remove('header-hidden');
      } else if (y > lastY && y > 120) {
        header.classList.add('header-hidden');       // scrolling down
      } else if (y < lastY) {
        header.classList.remove('header-hidden');     // any upward scroll
      }
    }
    lastY = y;
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Scroll reveal ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---- Count-up on the "37 years" ledger number ---- */
  var counter = document.querySelector('.ledger-num[data-count]');
  if (counter && !reduceMotion && 'IntersectionObserver' in window) {
    var target = parseInt(counter.getAttribute('data-count'), 10) || 0;
    var counted = false;
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !counted) {
          counted = true;
          var start = null, dur = 1100;
          function tick(ts) {
            if (start === null) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            counter.textContent = String(Math.round(eased * target));
            if (p < 1) requestAnimationFrame(tick);
            else counter.textContent = String(target);
          }
          requestAnimationFrame(tick);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    cio.observe(counter);
  }

  /* ---- File input label ---- */
  var fileInput = document.getElementById('f-photo');
  var fileName = document.getElementById('file-name');
  if (fileInput && fileName) {
    fileInput.addEventListener('change', function () {
      var files = fileInput.files;
      if (!files || !files.length) fileName.textContent = 'No file chosen';
      else if (files.length === 1) fileName.textContent = files[0].name;
      else fileName.textContent = files.length + ' photos selected';
    });
  }

  /* ---- Estimate form (redesign concept — no live backend) ---- */
  var form = document.getElementById('estimate-form');
  var success = document.getElementById('form-success');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (success) {
        success.hidden = false;
        success.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      }
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.textContent = 'Request sent ✓'; btn.disabled = true; }
    });
  }
})();
