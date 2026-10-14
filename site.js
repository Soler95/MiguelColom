/* ============================================================
   MIGUEL COLOM — shared script for subpages
   (header, mobile menu, cookie banner, consent-based videos)
   ============================================================ */
(function () {
  // Year in footer
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Header background on scroll
  var header = document.getElementById('header');
  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  // Mobile menu
  var nav = document.getElementById('nav');
  var btn = document.getElementById('menuBtn');
  function closeMenu() {
    if (!nav || !btn) return;
    nav.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }
  if (nav && btn) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open);
      document.body.classList.toggle('menu-open', open);
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !btn.contains(e.target)) closeMenu();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  // Consent storage (never breaks the page if storage is blocked)
  function getConsent() {
    try { return localStorage.getItem('cookies'); } catch (e) { return null; }
  }
  function setConsent(value) {
    try { localStorage.setItem('cookies', value); } catch (e) {}
  }

  // Videos: loaded only after consent or a click on "Play video"
  function loadVideo(wrapper, autoplay) {
    var src = wrapper.getAttribute('data-video-src');
    if (!src) return;
    var iframe = document.createElement('iframe');
    iframe.src = src + (autoplay ? '?autoplay=1' : '');
    iframe.title = wrapper.getAttribute('data-video-title') || 'Video';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    wrapper.innerHTML = '';
    wrapper.appendChild(iframe);
    wrapper.removeAttribute('data-video-src');
  }
  function loadAllVideos() {
    document.querySelectorAll('[data-video-src]').forEach(function (w) { loadVideo(w, false); });
  }
  document.querySelectorAll('[data-video-src] .video-consent').forEach(function (b) {
    b.addEventListener('click', function () { loadVideo(b.parentElement, true); });
  });

  // Cookie banner
  var banner = document.getElementById('cookieBanner');
  window.acceptCookies = function () {
    setConsent('accepted');
    if (banner) banner.style.display = 'none';
    loadAllVideos();
  };
  window.rejectCookies = function () {
    setConsent('rejected');
    if (banner) banner.style.display = 'none';
  };

  // "Change cookie settings" links/buttons (e.g. on the privacy page)
  document.querySelectorAll('[data-cookie-reset]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      try { localStorage.removeItem('cookies'); } catch (err) {}
      window.location.reload();
    });
  });

  var consent = getConsent();
  if (consent === 'accepted') loadAllVideos();
  else if (!consent && banner) banner.style.display = 'flex';

  // Reveal sections on scroll
  var els = document.querySelectorAll('.section, .quote');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('is-visible'); });
  }
})();
