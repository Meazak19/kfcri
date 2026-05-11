/* =========================================================
   LOAD HTML PARTIALS
========================================================= */
function loadHTML(id, file) {
  return fetch(file)
    .then(res => res.text())
    .then(data => {
      const el = document.getElementById(id);

      if (el) {
        el.innerHTML = data;
      }

      initHeaderFeatures();
      setActiveMenu();
    });
}

/* =========================================================
   STICKY HEADER + BACK TO TOP
========================================================= */
function initHeaderFeatures() {

  const navbar = document.getElementById('main-navbar');
  const btt = document.querySelector('.back-to-top');

  function onScroll() {

    const y = window.scrollY;

    if (navbar) {
      navbar.classList.toggle('scrolled', y > 80);
    }

    if (btt) {
      btt.classList.toggle('visible', y > 300);
    }

  }

  window.addEventListener('scroll', onScroll, { passive: true });

  if (btt) {
    btt.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

}

/* =========================================================
   ACTIVE MENU
========================================================= */
let menuInitialized = false;

function setActiveMenu() {

  if (menuInitialized) return;

  menuInitialized = true;

  const currentPath =
    window.location.pathname.split("/").pop() || "index.html";

  const menuItems = document.querySelectorAll('#main-navbar li');

  menuItems.forEach(li => {
    li.classList.remove("current-menu-item");
  });

  menuItems.forEach(li => {

    const link = li.querySelector("a");

    if (!link) return;

    let href = link.getAttribute("href");

    if (!href) return;

    href = href.replace("./", "");

    if (href === currentPath) {
      li.classList.add("current-menu-item");
    }

  });

}

/* =========================================================
   MOBILE MENU
========================================================= */
function initMobileMenu() {

  const mobileToggle =
    document.querySelector('.mobile-toggle');

  const mobileClose =
    document.querySelector('.mobile-close');

  const mobilePanel =
    document.querySelector('.mobile-menu-panel');

  const mobileOverlay =
    document.querySelector('.mobile-menu-overlay');

  function openMobileMenu() {

    if (mobilePanel) {
      mobilePanel.classList.add('open');
    }

    if (mobileOverlay) {
      mobileOverlay.classList.add('open');
    }

    document.body.style.overflow = 'hidden';

  }

  function closeMobileMenu() {

    if (mobilePanel) {
      mobilePanel.classList.remove('open');
    }

    if (mobileOverlay) {
      mobileOverlay.classList.remove('open');
    }

    document.body.style.overflow = '';

  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', openMobileMenu);
  }

  if (mobileClose) {
    mobileClose.addEventListener('click', closeMobileMenu);
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
  }

  /* =========================
     LEVEL 1 DROPDOWN
  ========================= */
  document.querySelectorAll(
    '.mobile-nav .has-m-sub > a'
  ).forEach(link => {

    link.addEventListener('click', function (e) {

      const submenu = this.nextElementSibling;

      if (
        submenu &&
        submenu.classList.contains('m-sub')
      ) {

        e.preventDefault();

        this.parentElement.classList.toggle('m-open');

      }

    });

  });

  /* =========================
     LEVEL 2 DROPDOWN
  ========================= */
  document.querySelectorAll(
    '.mobile-nav .has-m-sub2 > a'
  ).forEach(link => {

    link.addEventListener('click', function (e) {

      const submenu = this.nextElementSibling;

      if (
        submenu &&
        submenu.classList.contains('m-sub2')
      ) {

        e.preventDefault();

        this.parentElement.classList.toggle('m-open2');

      }

    });

  });

}

/* =========================================================
   LOAD HEADER + FOOTER
========================================================= */
Promise.all([
  loadHTML("headerParent", "header.html"),
  loadHTML("footer", "footer.html")
]).then(() => {

  initMobileMenu();

});

/* =========================================================
   MAIN APP
========================================================= */
(function () {

  'use strict';

  /* =======================================================
     PRELOADER
  ======================================================= */
  window.addEventListener('load', function () {

    const preloader =
      document.getElementById('preloader');

    if (preloader) {

      setTimeout(() => {
        preloader.classList.add('done');
      }, 500);

    }

  });

  /* =======================================================
     RIPPLE BUTTON
  ======================================================= */
  function addRipple(e) {

    const btn = e.currentTarget;

    const rect = btn.getBoundingClientRect();

    const size = Math.max(rect.width, rect.height);

    const x = e.clientX - rect.left - size / 2;

    const y = e.clientY - rect.top - size / 2;

    const circle = document.createElement('span');

    circle.classList.add('ripple-circle');

    circle.style.cssText = `
      width:${size}px;
      height:${size}px;
      left:${x}px;
      top:${y}px;
    `;

    btn.appendChild(circle);

    setTimeout(() => {
      circle.remove();
    }, 700);

  }

  document.querySelectorAll(
    '.btn, .cea-button-link'
  ).forEach(btn => {

    btn.addEventListener('click', addRipple);

  });

  /* =======================================================
     HERO SLIDER
  ======================================================= */
  const slides =
    document.querySelectorAll('.hero-slider .slide');

  const dots =
    document.querySelectorAll('.slider-dots .dot');

  let currentSlide = 0;

  let sliderTimer;

  const slider =
    document.querySelector('.hero-slider');

  let isDragging = false;
  let startX = 0;
  let endX = 0;
  let threshold = 100;

  if (slider) {

    slider.addEventListener('mousedown', e => {

      isDragging = true;

      startX = e.clientX;

      endX = startX;

    });

    slider.addEventListener('mousemove', e => {

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

    slider.addEventListener('touchstart', e => {

      startX = e.touches[0].clientX;

      endX = startX;

    });

    slider.addEventListener('touchmove', e => {

      endX = e.touches[0].clientX;

    });

    slider.addEventListener('touchend', () => {

      handleSwipe();

    });

  }

  function handleSwipe() {

    let diff = startX - endX;

    if (Math.abs(diff) < threshold) return;

    if (diff > 0) {

      goToSlide(currentSlide + 1);

    } else {

      goToSlide(currentSlide - 1);

    }

    startAutoSlide();

  }

  function goToSlide(index) {

    if (!slides.length) return;

    slides[currentSlide]?.classList.remove('active');

    dots[currentSlide]?.classList.remove('active');

    currentSlide =
      ((index % slides.length) + slides.length) %
      slides.length;

    slides[currentSlide]?.classList.add('active');

    dots[currentSlide]?.classList.add('active');

  }

  function startAutoSlide() {

    clearInterval(sliderTimer);

    if (slides.length < 2) return;

    sliderTimer = setInterval(() => {

      goToSlide(currentSlide + 1);

    }, 5000);

  }

  if (slides.length) {

    slides[0].classList.add('active');

    dots[0]?.classList.add('active');

    startAutoSlide();

    dots.forEach((dot, i) => {

      dot.addEventListener('click', () => {

        goToSlide(i);

        startAutoSlide();

      });

    });

  }

})();


// Service Accordion

  function toggleService(id) {
    const card = document.getElementById(id);
    const isActive = card.classList.contains('active');
 
    // Close all
    document.querySelectorAll('.service-card').forEach(c => {
      c.classList.remove('active');
      const icon = c.querySelector('.service-toggle i');
      if (icon) { icon.className = 'fas fa-chevron-down'; }
    });
 
    // Open clicked if it wasn't already open
    if (!isActive) {
      card.classList.add('active');
      const icon = card.querySelector('.service-toggle i');
      if (icon) { icon.className = 'fas fa-chevron-up'; }
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }




  
$(document).ready(function () {
  $('.adrPractise').owlCarousel({
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
  $('.testiCarousel').owlCarousel({
    loop            : true,
    margin          : 25,
    nav             : false,
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
        items  : 1,
        margin : 15
      },
      992: {
        items  : 1,
        margin : 20
      },
      1200: {
        items  : 1,
        margin : 25
      }
    }
  });
  $('.newsSlider').owlCarousel({
    loop            : true,
    margin          : 25,
    nav             : false,
    dots            : true,
    autoplay        : false,
    autoplayTimeout : 4500,
    smartSpeed      : 1000,
    items           : 2,
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
        items  : 1,
        margin : 15
      },
      992: {
        items  : 1,
        margin : 20
      },
      1200: {
        items  : 2,
        margin : 25
      }
    }
  });
});


  /* ============================================
     STAT ITEMS stagger on scroll
     ============================================ */
  document.querySelectorAll('.stat-item').forEach(function (item, i) {
    item.classList.add('anim-zoomIn');
    item.dataset.delay = String(i * 100);
  });



  
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

  document.addEventListener("DOMContentLoaded", function () {

  const counters = document.querySelectorAll(".num");

  counters.forEach(counter => {

    const target = parseInt(counter.getAttribute("data-count"));

    let count = 0;

    const increment = target / 200;

    function updateCounter() {

      count += increment;

      if (count < target) {

        counter.innerText = Math.ceil(count);

        requestAnimationFrame(updateCounter);

      } else {

        counter.innerText = target.toLocaleString();

      }

    }

    updateCounter();

  });

});