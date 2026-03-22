/* =============================================
   IGUAL – Law Firm & Attorney
   Full Consolidated JavaScript
   All animations, interactions & effects
   ============================================= */
(function () {
  'use strict';

  /* ============================================
     PRELOADER
     ============================================ */
  window.addEventListener('load', function () {
    var preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(function () { preloader.classList.add('done'); }, 500);
    }
  });

  /* ============================================
     BUTTON RIPPLE EFFECT
     Matches original "cea-button-animation" extra
     ============================================ */
  function addRipple(e) {
    var btn  = e.currentTarget;
    var rect = btn.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height);
    var x    = e.clientX - rect.left - size / 2;
    var y    = e.clientY - rect.top  - size / 2;

    var circle = document.createElement('span');
    circle.classList.add('ripple-circle');
    circle.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' + x + 'px;top:' + y + 'px;';
    btn.appendChild(circle);
    setTimeout(function () { circle.remove(); }, 700);
  }

  document.querySelectorAll('.btn, .cea-button-link').forEach(function (btn) {
    btn.addEventListener('click', addRipple);
  });

  /* ============================================
     STICKY HEADER  (original: sticky-head / header-sticky)
     ============================================ */
  var navbar = document.getElementById('main-navbar');
  var btt    = document.querySelector('.back-to-top');

  function onScroll() {
    var y = window.scrollY;

    // Sticky nav
    if (navbar) {
      navbar.classList.toggle('scrolled', y > 80);
    }

    // Back-to-top visibility
    if (btt) {
      btt.classList.toggle('visible', y > 300);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ============================================
     BACK TO TOP
     ============================================ */
  if (btt) {
    btt.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================
     HERO SLIDER
     Original: rs-slides with ken-burns bg,
     text layer mask transitions, dot bullets
     ============================================ */
  var slides       = document.querySelectorAll('.hero-slider .slide');
  var dots         = document.querySelectorAll('.slider-dots .dot');
  var currentSlide = 0;
  var sliderTimer;
  const slider = document.querySelector('.hero-slider');

  let isDragging = false;
let startX = 0;
let endX = 0;
let threshold = 100;

// --- Mouse Events ---
slider.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.clientX;
  endX = startX; // reset
});

slider.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  endX = e.clientX;
});

slider.addEventListener('mouseup', () => {
  if (!isDragging) return;
  handleSwipe();
  isDragging = false;
});

slider.addEventListener('mouseleave', () => {
  isDragging = false;
});

// --- Touch Events ---
slider.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
  endX = startX; // reset
});

slider.addEventListener('touchmove', (e) => {
  endX = e.touches[0].clientX;
});

slider.addEventListener('touchend', () => {
  handleSwipe();
});

function handleSwipe() {
  let diff = startX - endX;

  if (Math.abs(diff) < threshold) return; // prevents click trigger

  if (diff > 0) {
    goToSlide(currentSlide + 1);
  } else {
    goToSlide(currentSlide - 1);
  }

  startAutoSlide();
}

  function resetSlideText(slide) {
    // Reset all animated children so they re-trigger next time
    slide.querySelectorAll('.slide-label span, .slide-title .line, .slide-text, .slide-btn, .slide-deco-ring, .slide-deco-num, .arrorDown').forEach(function (el) {
      // forcing reflow so CSS transitions restart
      void el.offsetWidth;
    });
  }

  function goToSlide(index) {
    var prev = currentSlide;
    slides[prev].classList.remove('active');
    dots[prev] && dots[prev].classList.remove('active');
    currentSlide = ((index % slides.length) + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide] && dots[currentSlide].classList.add('active');
  }

  function startAutoSlide() {
    clearInterval(sliderTimer);
    if (slides.length < 2) return;
    sliderTimer = setInterval(function () { goToSlide(currentSlide + 1); }, 5000);
  }

  if (slides.length) {
    slides[0].classList.add('active');
    dots[0] && dots[0].classList.add('active');
    startAutoSlide();

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        goToSlide(i);
        startAutoSlide();
      });
    });
  }

  /* ============================================
     TESTIMONIAL AUTO-CAROUSEL
     Original: owl-carousel items cycling
     ============================================ */
  var testiItems      = document.querySelectorAll('.testimonial-item');
  var testiDots       = document.querySelectorAll('.testi-dot');
  var currentTesti    = 0;
  var testiTimer;

  function showTesti(index) {
    testiItems[currentTesti].classList.remove('active');
    testiDots[currentTesti] && testiDots[currentTesti].classList.remove('active');
    currentTesti = ((index % testiItems.length) + testiItems.length) % testiItems.length;
    testiItems[currentTesti].classList.add('active');
    testiDots[currentTesti] && testiDots[currentTesti].classList.add('active');
  }

  if (testiItems.length) {
    testiItems[0].classList.add('active');
    testiDots[0] && testiDots[0].classList.add('active');
    testiTimer = setInterval(function () { showTesti(currentTesti + 1); }, 5000);

    testiDots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        clearInterval(testiTimer);
        showTesti(i);
        testiTimer = setInterval(function () { showTesti(currentTesti + 1); }, 5000);
      });
    });
  }


  /* ============================================
     SCROLL-REVEAL  (IntersectionObserver)
     Original: elementor-invisible → visible
     Supports: anim-fadeInUp, anim-fadeInLeft,
               anim-fadeInRight, anim-zoomIn, anim-fadeIn
     ============================================ */
  var revealEls = document.querySelectorAll(
    '.anim-fadeInUp, .anim-fadeInLeft, .anim-fadeInRight, .anim-zoomIn, .anim-fadeIn'
  );

  if ('IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { revealObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ============================================
     COUNTER ANIMATION  (original: counter-up plugin)
     Counts from 0 → target with easing + digit-flip
     ============================================ */
  function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

  function animateCounter(numEl, target, duration) {
    var start    = null;
    var valueEl  = numEl.closest('.stat-value');

    function step(timestamp) {
      if (!start) start = timestamp;
      var elapsed  = timestamp - start;
      var progress = Math.min(elapsed / duration, 1);
      var eased    = easeOutQuart(progress);
      var value    = Math.floor(eased * target);

      numEl.textContent = value.toLocaleString();
      if (valueEl) valueEl.classList.add('flipping');

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        numEl.textContent = target.toLocaleString();
        if (valueEl) setTimeout(function () { valueEl.classList.remove('flipping'); }, 400);
      }
    }

    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var counterObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          animateCounter(entry.target, parseInt(entry.target.dataset.count, 10), 2000);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (c) { counterObs.observe(c); });
  }

  /* ============================================
     MOBILE MENU
     ============================================ */
  var mobileToggle  = document.querySelector('.mobile-toggle');
  var mobileClose   = document.querySelector('.mobile-close');
  var mobilePanel   = document.querySelector('.mobile-menu-panel');
  var mobileOverlay = document.querySelector('.mobile-menu-overlay');

  function openMobileMenu() {
    mobilePanel   && mobilePanel.classList.add('open');
    mobileOverlay && mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileMenu() {
    mobilePanel   && mobilePanel.classList.remove('open');
    mobileOverlay && mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ============================================
     MOBILE MENU ACCORDION
     L1: .has-m-sub toggle .m-open
     L2: .has-m-sub2 toggle .m-open2
     ============================================ */
  document.querySelectorAll('.mobile-nav .has-m-sub > a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var li = link.closest('.has-m-sub');
      var isOpen = li.classList.contains('m-open');
      // close all L1 siblings
      document.querySelectorAll('.mobile-nav .has-m-sub').forEach(function (s) {
        s.classList.remove('m-open');
      });
      if (!isOpen) li.classList.add('m-open');
    });
  });

  document.querySelectorAll('.mobile-nav .has-m-sub2 > a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var li = link.closest('.has-m-sub2');
      var isOpen = li.classList.contains('m-open2');
      // close all L2 siblings within same parent
      var parent = li.closest('.m-sub');
      if (parent) parent.querySelectorAll('.has-m-sub2').forEach(function (s) {
        s.classList.remove('m-open2');
      });
      if (!isOpen) li.classList.add('m-open2');
    });
  });

  mobileToggle  && mobileToggle.addEventListener('click', openMobileMenu);
  mobileClose   && mobileClose.addEventListener('click', closeMobileMenu);
  mobileOverlay && mobileOverlay.addEventListener('click', closeMobileMenu);

  /* ============================================
     SEARCH OVERLAY
     ============================================ */
  var searchWrapper   = document.querySelector('.full-search-wrapper');
  var searchCloseBtn  = document.querySelector('.search-close-btn');

  document.querySelectorAll('.search-toggle').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (!searchWrapper) return;
      var isOpen = searchWrapper.classList.contains('open');
      searchWrapper.classList.toggle('open', !isOpen);
      if (!isOpen) {
        var inp = searchWrapper.querySelector('input[type="search"]');
        inp && setTimeout(function () { inp.focus(); }, 200);
      }
    });
  });

  searchCloseBtn && searchCloseBtn.addEventListener('click', function () {
    searchWrapper && searchWrapper.classList.remove('open');
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && searchWrapper && searchWrapper.classList.contains('open')) {
      searchWrapper.classList.remove('open');
    }
  });

  /* ============================================
     PARALLAX on hero overlay (subtle mouse-move)
     Original: revslider uses cyc(-10|10) x/y pan
     ============================================ */
  var heroSlider = document.querySelector('.hero-slider');
  if (heroSlider && window.matchMedia('(min-width:1025px)').matches) {
    heroSlider.addEventListener('mousemove', function (e) {
      var rect = heroSlider.getBoundingClientRect();
      var xPct = (e.clientX - rect.left) / rect.width  - 0.5;   // -0.5 → 0.5
      var yPct = (e.clientY - rect.top)  / rect.height - 0.5;

      var activeBg = heroSlider.querySelector('.slide.active .slide-bg');
      if (activeBg) {
        activeBg.style.transform = 'scale(1.06) translate(' + (-xPct * 12) + 'px,' + (-yPct * 8) + 'px)';
      }
    });
    heroSlider.addEventListener('mouseleave', function () {
      var activeBg = heroSlider.querySelector('.slide.active .slide-bg');
      if (activeBg) { activeBg.style.transform = ''; }
    });
  }

  /* ============================================
     SERVICE CAROUSEL  (Practice Areas)
     3-up visible, slides by 1, prev/next with
     smooth translateX, disabled state on edges,
     touch/swipe support
     ============================================ */
  var svcTrack   = document.getElementById('svcTrack');
  var svcPrev    = document.getElementById('svcPrev');
  var svcNext    = document.getElementById('svcNext');

  if (svcTrack && svcPrev && svcNext) {
    var svcCards       = svcTrack.querySelectorAll('.svc-card');
    var svcTotal       = svcCards.length;
    var svcVisible     = 3;           // cards shown at once
    var svcIndex       = 0;           // current leading card index
    var svcGap         = 30;          // px — must match CSS gap

    function getCardWidth() {
      if (!svcCards[0]) return 0;
      return svcCards[0].getBoundingClientRect().width;
    }

    function updateSvcCarousel(animate) {
      var cardW  = getCardWidth();
      var offset = svcIndex * (cardW + svcGap);

      if (animate === false) {
        svcTrack.style.transition = 'none';
      } else {
        svcTrack.style.transition = 'transform 0.55s cubic-bezier(.25,.46,.45,.94)';
      }
      svcTrack.style.transform = 'translateX(-' + offset + 'px)';

      // disable buttons at edges
      // svcPrev.disabled = svcIndex === 0;
      // svcNext.disabled = svcIndex >= svcTotal - svcVisible;

      // visual active state — next btn filled, prev muted
      // svcPrev.style.background = svcIndex === 0 ? '#e8e2db' : 'var(--secondary)';
      // svcPrev.style.color      = svcIndex === 0 ? 'var(--heading)' : 'var(--white)';
    }

    svcNext.addEventListener('click', function () {
  svcIndex = (svcIndex + 1) % svcTotal;
  updateSvcCarousel();
});

svcPrev.addEventListener('click', function () {
  svcIndex = (svcIndex - 1 + svcTotal) % svcTotal;
  updateSvcCarousel();
});

    // touch / swipe
   
var svcDragStartX = 0;
var svcDragging   = false;

// ── Touch ──────────────────────────────────────────────
svcTrack.addEventListener('touchstart', function (e) {
  svcDragStartX = e.touches[0].clientX;
}, { passive: true });

svcTrack.addEventListener('touchend', function (e) {
  var diff = svcDragStartX - e.changedTouches[0].clientX;
if (Math.abs(diff) > 50) {
  if (diff > 0) { svcIndex = (svcIndex + 1) % svcTotal; updateSvcCarousel(); }
  if (diff < 0) { svcIndex = (svcIndex - 1 + svcTotal) % svcTotal; updateSvcCarousel(); }
}
}, { passive: true });

// ── Mouse drag ─────────────────────────────────────────
svcTrack.addEventListener('mousedown', function (e) {
  svcDragStartX = e.clientX;
  svcDragging   = true;
  svcTrack.style.cursor = 'grabbing';
});

window.addEventListener('mouseup', function (e) {
  if (!svcDragging) return;
  svcDragging = false;
  svcTrack.style.cursor = 'grab';

  var diff = svcDragStartX - e.clientX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) { svcIndex = (svcIndex + 1) % svcTotal; updateSvcCarousel(); }
  if (diff < 0) { svcIndex = (svcIndex - 1 + svcTotal) % svcTotal; updateSvcCarousel(); }
  }
});

// cancel drag if mouse leaves the window
window.addEventListener('mouseleave', function () {
  svcDragging = false;
  svcTrack.style.cursor = 'grab';
});

// prevent ghost image drag on child elements (images, links)
svcTrack.addEventListener('dragstart', function (e) {
  e.preventDefault();
});

// initial cursor
svcTrack.style.cursor = 'grab';

    // re-calc on resize
    window.addEventListener('resize', function () {
      // recalculate visible count
      var wrap = svcTrack.parentElement;
      if (wrap) {
        var wrapW = wrap.offsetWidth;
        var cW    = getCardWidth();
        if (cW > 0) svcVisible = Math.round(wrapW / (cW + svcGap));
      }
      // clamp index
      if (svcIndex > svcTotal - svcVisible) svcIndex = Math.max(0, svcTotal - svcVisible);
      updateSvcCarousel(false);
      setTimeout(function () { svcTrack.style.transition = ''; }, 50);
    });

    // init
    updateSvcCarousel(false);
    setTimeout(function () { svcTrack.style.transition = ''; }, 50);
  }

  /* ============================================
     NEWSLETTER FORM
     ============================================ */
  var newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = newsletterForm.querySelector('input[type="email"]');
      var msg   = newsletterForm.querySelector('.form-msg');
      if (input && input.value && msg) {
        msg.textContent = '✓ You are subscribed now!';
        msg.style.color = '#b8967e';
        input.value = '';
        setTimeout(function () { msg.textContent = ''; }, 4500);
      }
    });
  }

  /* ============================================
     SMOOTH SCROLL for anchor links
     ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var offset = 100; // account for fixed header height
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ============================================
     TEAM CARD stagger on scroll
     ============================================ */
  document.querySelectorAll('.team-card').forEach(function (card, i) {
    card.classList.add('anim-fadeInUp');
    card.dataset.delay = String(i * 100);
  });

  /* ============================================
     BLOG CARD stagger on scroll
     ============================================ */
  document.querySelectorAll('.blog-card').forEach(function (card, i) {
    card.classList.add('anim-fadeInUp');
    card.dataset.delay = String(i * 150);
  });

  /* ============================================
     STAT ITEMS stagger on scroll
     ============================================ */
  document.querySelectorAll('.stat-item').forEach(function (item, i) {
    item.classList.add('anim-zoomIn');
    item.dataset.delay = String(i * 100);
  });

  /* Re-observe newly classified elements */
  if ('IntersectionObserver' in window) {
    var newRevealEls = document.querySelectorAll(
      '.team-card, .blog-card, .stat-item'
    );
    var newObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          newObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

    newRevealEls.forEach(function (el) { newObs.observe(el); });
  }

  /* ============================================
     HEADER nav link hover — force underline on
     current-menu-item for scrolled state too
     ============================================ */
  var currentItems = document.querySelectorAll('.primary-menu .current-menu-item > a');
  currentItems.forEach(function (a) {
    a.style.color = 'var(--primary)';
  });

  /* ============================================
     NEW TESTIMONIAL CAROUSEL (.testi-item-new)
     pill-dot nav, auto-cycle 5.5s
     ============================================ */
  var tnItems  = document.querySelectorAll('.testi-item-new');
  var tnPills  = document.querySelectorAll('.tpill');
  var tnCur    = 0;
  var tnTimer;

  function showTN(idx) {
    tnItems[tnCur].classList.remove('active');
    tnPills[tnCur] && tnPills[tnCur].classList.remove('active');
    tnCur = ((idx % tnItems.length) + tnItems.length) % tnItems.length;
    tnItems[tnCur].classList.add('active');
    tnPills[tnCur] && tnPills[tnCur].classList.add('active');
  }
  function startTN() {
    clearInterval(tnTimer);
    tnTimer = setInterval(function () { showTN(tnCur + 1); }, 5500);
  }
  if (tnItems.length) {
    tnPills.forEach(function (p, i) {
      p.addEventListener('click', function () { showTN(i); startTN(); });
    });
    startTN();
  }

  /* ============================================
     ARCH TEAM CAROUSEL (#archTrack)
     3-up, page-based, pill-dot nav, touch swipe
     ============================================ */
  var archTrack = document.getElementById('archTrack');
  var archDots  = document.querySelectorAll('.arch-dot');

  if (archTrack) {
    var archCards  = archTrack.querySelectorAll('.arch-card');
    var archTotal  = archCards.length;
    var archPerPg  = 3;
    var archPage   = 0;
    var archGap    = 26;

    function archCardW() {
      return archCards[0] ? archCards[0].getBoundingClientRect().width : 0;
    }
    function goArch(pg) {
      var maxPg = Math.ceil(archTotal / archPerPg) - 1;
      pg = Math.max(0, Math.min(pg, maxPg));
      var offset = pg * archPerPg * (archCardW() + archGap);
      archTrack.style.transform = 'translateX(-' + offset + 'px)';
      archTrack.style.transition = 'transform .55s cubic-bezier(.25,.46,.45,.94)';
      archDots.forEach(function (d, i) { d.classList.toggle('active', i === pg); });
      archPage = pg;
    }
    archDots.forEach(function (d, i) {
      d.addEventListener('click', function () { goArch(i); });
    });
    /* touch */
    var atx = 0;
    archTrack.addEventListener('touchstart', function (e) { atx = e.touches[0].clientX; }, { passive: true });
    archTrack.addEventListener('touchend', function (e) {
      var diff = atx - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goArch(diff > 0 ? archPage + 1 : archPage - 1);
    }, { passive: true });
    /* resize */
    window.addEventListener('resize', function () {
      var vw = window.innerWidth;
      archPerPg = vw <= 600 ? 1 : vw <= 1024 ? 2 : 3;
      goArch(0);
    });
  }

})();


$(document).ready(function () {
  $('.owl-carousel').owlCarousel({
    loop            : true,
    margin          : 25,
    nav             : true,
    dots            : false,
    autoplay        : false,
    autoplayTimeout : 4500,
    smartSpeed      : 1000,
    items           : 3,
    responsive      : {
      0: {
        items  : 1,
        margin : 10
      },
      576: {
        items  : 2,
        margin : 15
      },
      768: {
        items  : 2,
        margin : 15
      },
      992: {
        items  : 3,
        margin : 20
      },
      1200: {
        items  : 3,
        margin : 25
      }
    }
  });
});