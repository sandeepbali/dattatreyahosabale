/* ========================================================================
   DATTATREYA HOSABALE — Clean, Functional JavaScript
   No gimmicks. Scroll reveals, counters, lightbox, language switcher.
   ======================================================================== */

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
