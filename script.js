/* Guillory's Collision Center — redesign concept interactions */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Current year in footer ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---- Sticky header shrink on scroll ---- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 24);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Mobile nav toggle ---- */
  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.getElementById('nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      navLinks.classList.toggle('open', !open);
    });
    navLinks.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
        navLinks.classList.remove('open');
      }
    });
  }

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
