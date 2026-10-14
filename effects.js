/* ============================================================
   MIGUEL COLOM — effects.js
   Scroll progress, hero strings, pointer spotlight, staggered
   reveals. Pure enhancement: the site works without it.
   ============================================================ */
(function () {
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. Thin progress bar at the top of the page */
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);

  function updateProgress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    bar.style.transform = 'scaleX(' + p + ')';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  /* 2. Four violin strings (G · D · A · E) across the hero */
  var hero = document.querySelector('.hero');
  if (hero) {
    var strings = document.createElement('div');
    strings.className = 'hero-strings';
    strings.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < 4; i++) {
      var s = document.createElement('span');
      s.style.setProperty('--i', i);
      strings.appendChild(s);
    }
    hero.appendChild(strings);

    /* 3. Spotlight follows the pointer (desktop only) */
    if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
      var raf = null;
      hero.addEventListener('pointermove', function (e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          var r = hero.getBoundingClientRect();
          hero.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
          hero.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
          raf = null;
        });
      });
      hero.addEventListener('pointerleave', function () {
        hero.style.removeProperty('--mx');
        hero.style.removeProperty('--my');
      });
    }

    /* 4. Gentle parallax on the hero photo */
    var img = hero.querySelector('.hero-bg img');
    if (img && !reduceMotion) {
      window.addEventListener('scroll', function () {
        var y = Math.min(window.scrollY, window.innerHeight);
        img.style.translate = '0 ' + (y * 0.18).toFixed(1) + 'px';
      }, { passive: true });
    }
  }

  /* 5. Stagger: children of revealed blocks appear one after another */
  var groups = document.querySelectorAll('.split-content, .video-grid, .contact-form, .legal .container');
  groups.forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (child, idx) {
      child.classList.add('stagger');
      child.style.setProperty('--d', Math.min(idx, 10) * 70 + 'ms');
    });
  });
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -5% 0px' });
    document.querySelectorAll('.stagger').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.stagger').forEach(function (el) { el.classList.add('in'); });
  }

  /* 6. Mobile menu: number the links so they can cascade in */
  document.querySelectorAll('#nav a').forEach(function (a, idx) {
    a.style.setProperty('--n', idx);
  });
})();
