/* ========================================================================
   DATTATREYA HOSABALE — Clean, Functional JavaScript
   No gimmicks. Scroll reveals, counters, lightbox, language switcher.
   ======================================================================== */

/* ── Temporary Password Protection ── */
(function () {
  const PASS = '1123581321';
  const STORAGE_KEY = '__dh_auth';

  if (sessionStorage.getItem(STORAGE_KEY) === 'true') return;

  // Script loads at bottom of <body>, so document.body is already available.
  // Hide page content immediately.
  document.body.style.visibility = 'hidden';
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';

  // Build overlay
  const overlay = document.createElement('div');
  overlay.id = 'pw-gate';
  overlay.innerHTML = '<div id="pw-box">'
    + '<div id="pw-logo">\u0926</div>'
    + '<h2>Protected Site</h2>'
    + '<p>Please enter the password to continue.</p>'
    + '<input type="password" id="pw-input" placeholder="Password" autocomplete="off" />'
    + '<button id="pw-submit">Enter</button>'
    + '<p id="pw-error" style="color:#ff6b6b;margin-top:12px;font-size:0.85rem;display:none;">Incorrect password. Please try again.</p>'
    + '</div>';
  document.body.appendChild(overlay);

  // Inject styles
  const style = document.createElement('style');
  style.textContent = '#pw-gate {'
    + 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:99999;visibility:visible;'
    + 'display:flex;align-items:center;justify-content:center;'
    + 'background:#0c0c0c;'
    + "font-family:'Inter','Segoe UI',sans-serif;}"
    + '#pw-box {'
    + 'background:#161616;border:1px solid rgba(255,255,255,0.06);'
    + 'border-radius:16px;padding:48px 40px;text-align:center;'
    + 'width:380px;max-width:90vw;'
    + 'box-shadow:0 24px 80px rgba(0,0,0,0.6);}'
    + '#pw-logo {'
    + 'width:56px;height:56px;margin:0 auto 24px;'
    + 'background:linear-gradient(135deg,#e8772e,#ff9f43);'
    + 'border-radius:12px;display:flex;align-items:center;justify-content:center;'
    + 'font-size:28px;color:#fff;font-weight:700;}'
    + '#pw-box h2 {color:#fff;font-size:1.35rem;font-weight:600;margin:0 0 8px;}'
    + '#pw-box>p:first-of-type {color:rgba(255,255,255,0.4);font-size:0.9rem;margin:0 0 28px;}'
    + '#pw-input {'
    + 'width:100%;box-sizing:border-box;padding:14px 16px;'
    + 'background:#0c0c0c;border:1px solid rgba(255,255,255,0.1);'
    + 'border-radius:10px;color:#fff;font-size:1rem;'
    + 'outline:none;transition:border-color 0.2s;}'
    + '#pw-input:focus {border-color:#e8772e;}'
    + '#pw-submit {'
    + 'margin-top:16px;width:100%;padding:14px;'
    + 'background:linear-gradient(135deg,#e8772e,#ff9f43);'
    + 'border:none;border-radius:10px;color:#fff;'
    + 'font-size:1rem;font-weight:600;cursor:pointer;'
    + 'transition:transform 0.15s,box-shadow 0.15s;}'
    + '#pw-submit:hover {transform:translateY(-1px);box-shadow:0 6px 24px rgba(232,119,46,0.35);}'
    + '#pw-submit:active {transform:translateY(0);}';
  document.head.appendChild(style);

  // Logic
  var input = document.getElementById('pw-input');
  var submit = document.getElementById('pw-submit');
  var error = document.getElementById('pw-error');

  function attempt() {
    if (input.value === PASS) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      overlay.style.transition = 'opacity 0.35s';
      overlay.style.opacity = '0';
      setTimeout(function () {
        overlay.remove();
        style.remove();
        document.body.style.visibility = '';
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }, 350);
    } else {
      error.style.display = 'block';
      input.value = '';
      input.focus();
      submit.style.transform = 'translateX(-6px)';
      setTimeout(function () { submit.style.transform = 'translateX(6px)'; }, 80);
      setTimeout(function () { submit.style.transform = ''; }, 160);
    }
  }

  submit.addEventListener('click', attempt);
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter') attempt(); });
  input.focus();
})();

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll effect ──
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // Active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Mobile hamburger
  const burger = document.querySelector('.nav-burger');
  const navLinks = document.querySelector('.nav-links');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Scroll Reveal (Intersection Observer) ──
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));
  }

  // ── Animated Counters ──
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    let triggered = false;

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !triggered) {
          triggered = true;
          animateCounter(el, target, suffix);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    counterObserver.observe(el);
  });

  function animateCounter(el, target, suffix) {
    const duration = 1800;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(tick);
  }

  // ── Gallery Lightbox ──
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  let galleryItems = document.querySelectorAll('.gallery-item');
  let currentIdx = 0;
  let galleryData = [];

  function buildGalleryData() {
    galleryData = [];
    galleryItems.forEach(item => {
      if (item.style.display !== 'none') {
        const img = item.querySelector('img');
        galleryData.push({ src: img.src, caption: item.getAttribute('data-caption') || '' });
      }
    });
  }

  if (galleryItems.length && lightbox) {
    buildGalleryData();
    galleryItems.forEach((item, i) => {
      item.addEventListener('click', () => {
        currentIdx = i;
        openLightbox(i);
      });
    });
  }

  function openLightbox(i) {
    if (!lightbox || !galleryData[i]) return;
    lightboxImg.src = galleryData[i].src;
    if (lightboxCaption) lightboxCaption.textContent = galleryData[i].caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  const lbClose = document.querySelector('.lightbox-close');
  const lbPrev = document.querySelector('.lightbox-prev');
  const lbNext = document.querySelector('.lightbox-next');

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbPrev) lbPrev.addEventListener('click', () => {
    currentIdx = (currentIdx - 1 + galleryData.length) % galleryData.length;
    openLightbox(currentIdx);
  });
  if (lbNext) lbNext.addEventListener('click', () => {
    currentIdx = (currentIdx + 1) % galleryData.length;
    openLightbox(currentIdx);
  });
  if (lightbox) lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight' && lbNext) lbNext.click();
    if (e.key === 'ArrowLeft' && lbPrev) lbPrev.click();
  });

  // Gallery Filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      galleryItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = '';
          item.style.opacity = '1';
        } else {
          item.style.display = 'none';
        }
      });

      setTimeout(buildGalleryData, 100);
    });
  });

  // ── Language Switcher ──
  let currentLang = 'en';

  window.switchLanguage = function (lang) {
    if (lang === currentLang) return;
    currentLang = lang;

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    document.querySelectorAll('[data-en]').forEach(el => {
      const newText = el.getAttribute('data-' + lang);
      if (newText) {
        el.textContent = newText;
        if (lang === 'hi') {
          el.style.fontFamily = "'Noto Sans Devanagari', sans-serif";
        } else {
          el.style.fontFamily = '';
        }
      }
    });

    document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
  };

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => switchLanguage(btn.getAttribute('data-lang')));
  });

  // ── Smooth scroll for anchors ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
