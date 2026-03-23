/* script.js — Tower Front Website */
'use strict';

// ── NAV: scroll class ──
const navbar = document.getElementById('navbar');

function updateNav() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ── MOBILE NAV ──
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const mobLinks  = document.querySelectorAll('.mob-link');

function openMobileNav(open) {
  hamburger.classList.toggle('open', open);
  mobileNav.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

hamburger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.contains('open');
  openMobileNav(!isOpen);
});

mobLinks.forEach(link => {
  link.addEventListener('click', () => openMobileNav(false));
});

// ── HERO: staggered reveal on load ──
window.addEventListener('load', () => {
  const heroItems = document.querySelectorAll('#hero .reveal-up');
  heroItems.forEach(el => {
    el.style.transition = 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
    requestAnimationFrame(() => {
      el.classList.add('revealed');
    });
  });
});

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll(
  '.reveal-up:not(#hero .reveal-up), .reveal-fade, .reveal-left, .reveal-right'
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));

// ── GALLERY: lightbox ──
const galleryItems = document.querySelectorAll('.gallery-item');

// Build lightbox DOM
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.innerHTML = `
  <div id="lb-backdrop"></div>
  <div id="lb-inner">
    <button id="lb-close" aria-label="Close">✕</button>
    <img id="lb-img" src="" alt="" />
    <p id="lb-caption"></p>
  </div>
`;
document.body.appendChild(lightbox);

// Lightbox styles (injected)
const lbStyle = document.createElement('style');
lbStyle.textContent = `
  #lightbox {
    position: fixed; inset: 0; z-index: 999;
    display: flex; align-items: center; justify-content: center;
    opacity: 0; pointer-events: none;
    transition: opacity 0.35s cubic-bezier(0.16,1,0.3,1);
  }
  #lightbox.lb-open { opacity: 1; pointer-events: all; }
  #lb-backdrop {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.88);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    cursor: pointer;
  }
  #lb-inner {
    position: relative; z-index: 1;
    max-width: min(90vw, 1100px);
    transform: scale(0.92);
    transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
  }
  #lightbox.lb-open #lb-inner { transform: scale(1); }
  #lb-close {
    position: absolute; top: -44px; right: 0;
    background: none; border: none; cursor: pointer;
    font-size: 22px; color: rgba(255,255,255,0.6);
    transition: color 0.2s;
  }
  #lb-close:hover { color: #fff; }
  #lb-img {
    width: 100%; border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 40px 120px rgba(0,0,0,0.7);
    display: block;
  }
  #lb-caption {
    text-align: center; margin-top: 16px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 13px; letter-spacing: 0.15em;
    text-transform: uppercase; color: rgba(255,255,255,0.4);
  }
`;
document.head.appendChild(lbStyle);

const lbImg     = document.getElementById('lb-img');
const lbCaption = document.getElementById('lb-caption');
const lbClose   = document.getElementById('lb-close');
const lbBackdrop = document.getElementById('lb-backdrop');

function openLightbox(imgSrc, caption) {
  lbImg.src = imgSrc;
  lbCaption.textContent = caption || '';
  lightbox.classList.add('lb-open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('lb-open');
  document.body.style.overflow = '';
}

galleryItems.forEach(item => {
  item.style.cursor = 'pointer';
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const cap = item.querySelector('.gallery-caption');
    openLightbox(img.src, cap ? cap.textContent : '');
  });
});

lbClose.addEventListener('click', closeLightbox);
lbBackdrop.addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

// ── STAT CARDS: count-up on reveal ──
const statNums = document.querySelectorAll('.stat-num');

const countUpObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const raw = el.textContent.trim();
    // Only animate pure numbers
    const numMatch = raw.match(/^(\d+)/);
    if (!numMatch) return;
    const target = parseInt(numMatch[1]);
    const suffix = raw.replace(numMatch[1], '');
    let start = 0;
    const step = Math.ceil(target / 30);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      el.textContent = start + suffix;
      if (start >= target) clearInterval(timer);
    }, 40);
    countUpObserver.unobserve(el);
  });
}, { threshold: 0.8 });

statNums.forEach(el => countUpObserver.observe(el));

// ── PARALLAX: subtle hero background ──
function onScroll() {
  const heroBg = document.querySelector('.hero-bg-img');
  if (!heroBg) return;
  const scrolled = window.scrollY;
  heroBg.style.transform = `scale(1.06) translateY(${scrolled * 0.18}px)`;
}
window.addEventListener('scroll', onScroll, { passive: true });

// ── CURSOR: subtle accent dot ──
(function initCursor() {
  const dot = document.createElement('div');
  dot.id = 'cursor-dot';
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    #cursor-dot {
      position: fixed;
      width: 6px; height: 6px;
      border-radius: 50%;
      background: var(--accent);
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      transition: transform 0.1s, opacity 0.3s;
      mix-blend-mode: screen;
      opacity: 0;
    }
    @media (hover: none) { #cursor-dot { display: none; } }
  `;
  document.head.appendChild(styleEl);
  document.body.appendChild(dot);

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
    dot.style.opacity = '1';
  });

  document.querySelectorAll('a, button, .gallery-item, .mode-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.transform = 'translate(-50%,-50%) scale(3)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.transform = 'translate(-50%,-50%) scale(1)';
    });
  });
})();

// ── SMOOTH ANCHOR SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 68;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

console.log('%cTOWER FRONT', 'font-size:28px;font-weight:900;color:#7B4FD4;letter-spacing:0.2em;');
console.log('%cOfficial website — Built for the Front.', 'color:#808898;font-size:12px;');
