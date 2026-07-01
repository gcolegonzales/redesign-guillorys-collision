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
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 20);
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
      navLinks.classList.toggle('open', !open);
    });
    // Close on link click (mobile)
    navLinks.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
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

  /* ---- File input label ---- */
  var fileInput = document.getElementById('f-photo');
  var fileName = document.getElementById('file-name');
  if (fileInput && fileName) {
    fileInput.addEventListener('change', function () {
      var files = fileInput.files;
      if (!files || !files.length) {
        fileName.textContent = 'No file chosen';
      } else if (files.length === 1) {
        fileName.textContent = files[0].name;
      } else {
        fileName.textContent = files.length + ' photos selected';
      }
    });
  }

  /* ---- Estimate form (non-wired demo) ---- */
  var form = document.getElementById('estimate-form');
  var success = document.getElementById('form-success');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (success) {
        success.hidden = false;
        success.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      }
      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = 'Request Sent ✓';
        btn.disabled = true;
      }
    });
  }
})();
