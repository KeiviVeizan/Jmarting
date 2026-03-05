import { animate, stagger } from 'animejs';

// ============================================
// 1. SPLIT TEXT - H1 principal letra por letra
// ============================================
function animateHeroTitle() {
  const h1 = document.querySelector('.inicio-content h1');
  if (!h1) return;

  const text = h1.textContent || '';
  h1.innerHTML = '';

  text.split('').forEach((char) => {
    const span = document.createElement('span');
    span.className = 'split-letter';
    span.textContent = char === ' ' ? '\u00A0' : char;
    h1.appendChild(span);
  });

  animate('.split-letter', {
    opacity: [0, 1],
    translateY: [50, 0],
    ease: 'outExpo',
    duration: 900,
    delay: stagger(60, { start: 1200 }),
  });

  const heroP = document.querySelector('.inicio-content p');
  const heroA = document.querySelector('.inicio-content a');
  if (heroP) {
    heroP.style.opacity = '0';
    animate(heroP, {
      opacity: [0, 1],
      translateY: [30, 0],
      ease: 'outCubic',
      duration: 800,
      delay: 2000,
    });
  }
  if (heroA) {
    heroA.style.opacity = '0';
    animate(heroA, {
      opacity: [0, 1],
      translateY: [25, 0],
      scale: [0.95, 1],
      ease: 'outQuart',
      duration: 900,
      delay: 2400,
    });
  }
}

// ============================================
// 2. HERO ZOOM - Imagen de fondo con zoom lento
// ============================================
function animateHeroZoom() {
  const heroImg = document.querySelector('.inicio > img') || document.querySelector('.encabezado-img');
  if (!heroImg) return;

  animate(heroImg, {
    scale: [1, 1.15],
    ease: 'linear',
    duration: 20000,
    delay: 1000,
  });
}

// ============================================
// 3. NAVBAR - Desliza desde arriba con escala + fade
// ============================================
function animateNavbar() {
  const header = document.querySelector('header');
  if (!header) return;

  header.style.animation = 'none';
  header.style.opacity = '0';

  animate(header, {
    opacity: [0, 1],
    translateY: [-60, 0],
    scale: [0.95, 1],
    ease: 'outExpo',
    duration: 1200,
    delay: 1000,
  });

  const navLinks = document.querySelectorAll('.nav-links a');
  if (navLinks.length > 0) {
    navLinks.forEach((link) => { link.style.opacity = '0'; });
    animate(navLinks, {
      opacity: [0, 1],
      translateY: [-15, 0],
      ease: 'outCubic',
      duration: 500,
      delay: stagger(80, { start: 1600 }),
    });
  }
}

// ============================================
// 4. BOTÓN FLOTANTE - Pulso periódico
// ============================================
function animateFloatingButton() {
  const btn = document.querySelector('.pedido-float');
  if (!btn) return;

  setInterval(() => {
    animate(btn, {
      scale: [1, 1.2, 1],
      ease: 'outCubic',
      duration: 600,
    });
  }, 4000);
}

// ============================================
// 5. INTERSECTION OBSERVER - Animaciones al scroll
// ============================================
function createScrollObserver() {
  const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -30px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;

      // FADE IN
      if (el.classList.contains('animate-fade')) {
        animate(el, {
          opacity: [0, 1],
          ease: 'outCubic',
          duration: 800,
        });
        observer.unobserve(el);
      }

      // SLIDE desde abajo
      if (el.classList.contains('animate-slide')) {
        animate(el, {
          opacity: [0, 1],
          translateY: [60, 0],
          ease: 'outCubic',
          duration: 800,
        });
        observer.unobserve(el);
      }

      // SLIDE desde la izquierda
      if (el.classList.contains('animate-slide-left')) {
        animate(el, {
          opacity: [0, 1],
          translateX: [-80, 0],
          ease: 'outExpo',
          duration: 1000,
        });
        observer.unobserve(el);
      }

      // SLIDE desde la derecha
      if (el.classList.contains('animate-slide-right')) {
        animate(el, {
          opacity: [0, 1],
          translateX: [80, 0],
          ease: 'outExpo',
          duration: 1000,
        });
        observer.unobserve(el);
      }

      // CARDS en cascada
      if (el.classList.contains('animate-card')) {
        const cards = el.querySelectorAll('.card-home');
        if (cards.length > 0) {
          animate(cards, {
            opacity: [0, 1],
            translateY: [80, 0],
            scale: [0.9, 1],
            ease: 'outExpo',
            duration: 700,
            delay: stagger(120),
          });
        } else {
          animate(el, {
            opacity: [0, 1],
            translateY: [80, 0],
            scale: [0.9, 1],
            ease: 'outExpo',
            duration: 700,
          });
        }
        observer.unobserve(el);
      }

      // IMAGEN reveal (scale + opacity)
      if (el.classList.contains('animate-reveal')) {
        animate(el, {
          opacity: [0, 1],
          scale: [0.85, 1],
          ease: 'outQuart',
          duration: 1000,
        });
        observer.unobserve(el);
      }

      // TÍTULO con underline que se dibuja
      if (el.classList.contains('animate-title')) {
        animate(el, {
          opacity: [0, 1],
          translateY: [30, 0],
          ease: 'outCubic',
          duration: 700,
        });
        const underline = el.querySelector('.title-line');
        if (underline) {
          animate(underline, {
            scaleX: [0, 1],
            ease: 'outExpo',
            duration: 800,
            delay: 400,
          });
        }
        observer.unobserve(el);
      }

      // FAQ items en cascada
      if (el.classList.contains('animate-faq')) {
        const items = el.querySelectorAll('.faq-item');
        if (items.length > 0) {
          items.forEach((item) => { item.style.animation = 'none'; });
          animate(items, {
            opacity: [0, 1],
            translateX: [-40, 0],
            ease: 'outExpo',
            duration: 800,
            delay: stagger(100),
          });
        }
        observer.unobserve(el);
      }

      // FOOTER columnas en cascada
      if (el.classList.contains('animate-footer')) {
        animate(el, {
          opacity: [0, 1],
          translateY: [40, 0],
          ease: 'outCubic',
          duration: 800,
        });

        const columns = el.querySelectorAll('.footer-rigth-inf');
        if (columns.length > 0) {
          columns.forEach((col) => { col.style.opacity = '0'; });
          animate(columns, {
            opacity: [0, 1],
            translateY: [20, 0],
            ease: 'outCubic',
            duration: 600,
            delay: stagger(150, { start: 400 }),
          });
        }
        observer.unobserve(el);
      }
    });
  }, observerOptions);

  // Observar todos los elementos con clases de animación
  const selectors = [
    '.animate-fade', '.animate-slide', '.animate-slide-left',
    '.animate-slide-right', '.animate-card', '.animate-reveal',
    '.animate-title', '.animate-faq', '.animate-footer',
  ];
  document.querySelectorAll(selectors.join(', ')).forEach((el) => {
    observer.observe(el);
  });
}

// ============================================
// INICIALIZAR TODO
// ============================================
function init() {
  animateHeroTitle();
  animateHeroZoom();
  animateNavbar();
  animateFloatingButton();

  // El scroll está bloqueado durante el preloader (body.preloader-active)
  // Activar el observer cuando el preloader se quite del DOM
  const preloader = document.getElementById('preloader');
  if (preloader) {
    const check = setInterval(() => {
      if (!document.getElementById('preloader')) {
        clearInterval(check);
        createScrollObserver();
      }
    }, 100);
  } else {
    createScrollObserver();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
