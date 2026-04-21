/**
 * Global interaction engine — Smart Seed Australia
 * Handles: scroll reveals, animated counters, parallax, ripple, scroll progress
 * Uses IntersectionObserver only — no layout-thrashing, no GSAP dependency
 * All effects respect prefers-reduced-motion
 */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── Scroll Progress Bar ───────────────────────────────────────────
export function initScrollProgress() {
  const bar = document.querySelector<HTMLElement>('.scroll-progress');
  if (!bar) return;

  const update = () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = total > 0 ? scrolled / total : 0;
    bar.style.transform = `scaleX(${progress})`;
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ─── Scroll Reveal (IntersectionObserver) ─────────────────────────
export function initScrollReveals() {
  if (reducedMotion) {
    // Make all elements visible immediately
    document.querySelectorAll<HTMLElement>('.reveal, .reveal-stagger').forEach(el => {
      el.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll<HTMLElement>('.reveal, .reveal-stagger').forEach(el => {
    observer.observe(el);
  });
}

// ─── Animated Counters ────────────────────────────────────────────
function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function animateCounter(el: HTMLElement) {
  const target = parseFloat(el.dataset.target || '0');
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = parseInt(el.dataset.duration || '1800', 10);
  const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals, 10) : 0;

  let startTime: number | null = null;

  const step = (timestamp: number) => {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutExpo(progress);
    const current = target * eased;

    el.textContent = prefix + (decimals > 0 ? current.toFixed(decimals) : Math.floor(current).toLocaleString()) + suffix;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = prefix + (decimals > 0 ? target.toFixed(decimals) : target.toLocaleString()) + suffix;
      // Pulse on complete
      el.classList.add('pulse');
      setTimeout(() => el.classList.remove('pulse'), 400);
    }
  };

  requestAnimationFrame(step);
}

export function initCounters() {
  const counters = document.querySelectorAll<HTMLElement>('[data-counter]');
  if (!counters.length) return;

  if (reducedMotion) {
    counters.forEach(el => {
      const target = parseFloat(el.dataset.target || '0');
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals, 10) : 0;
      el.textContent = prefix + (decimals > 0 ? target.toFixed(decimals) : target.toLocaleString()) + suffix;
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => observer.observe(counter));
}

// ─── Parallax Hero ────────────────────────────────────────────────
export function initParallax() {
  if (reducedMotion) return;

  const hero = document.querySelector<HTMLElement>('.parallax-hero-img');
  if (!hero) return;

  const update = () => {
    const scrollY = window.scrollY;
    // Subtle: move at 30% of scroll speed
    hero.style.transform = `translateY(${scrollY * 0.30}px)`;
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ─── Button Ripple (tracks cursor position for radial gradient) ───
export function initButtonRipple() {
  document.querySelectorAll<HTMLElement>('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      btn.style.setProperty('--mx', `${x}%`);
      btn.style.setProperty('--my', `${y}%`);
    });
  });
}

// ─── Smooth Anchor Scroll ─────────────────────────────────────────
export function initSmoothAnchors() {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href')!.slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  });
}

// ─── Header Scroll State ──────────────────────────────────────────
export function initHeaderScroll() {
  const header = document.querySelector<HTMLElement>('.site-header');
  if (!header) return;

  const update = () => {
    const scrolled = window.scrollY > 20;
    header.classList.toggle('header--scrolled', scrolled);
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ─── FAQ Accordion (height transition) ───────────────────────────
export function initFaqAnimations() {
  if (reducedMotion) return;

  document.querySelectorAll<HTMLButtonElement>('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answerId = btn.getAttribute('aria-controls')!;
      const answer = document.getElementById(answerId) as HTMLElement;
      if (!answer) return;

      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      if (!isOpen) {
        // Opening: animate height
        answer.hidden = false;
        answer.style.overflow = 'hidden';
        answer.style.maxHeight = '0';
        answer.style.opacity = '0';
        answer.style.transition = 'max-height 0.35s var(--ease-out-expo), opacity 0.25s ease';

        requestAnimationFrame(() => {
          answer.style.maxHeight = answer.scrollHeight + 'px';
          answer.style.opacity = '1';
        });

        answer.addEventListener('transitionend', () => {
          answer.style.maxHeight = '';
          answer.style.overflow = '';
        }, { once: true });
      } else {
        // Closing
        answer.style.overflow = 'hidden';
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.style.opacity = '1';
        answer.style.transition = 'max-height 0.25s ease-in, opacity 0.2s ease-in';

        requestAnimationFrame(() => {
          answer.style.maxHeight = '0';
          answer.style.opacity = '0';
        });

        answer.addEventListener('transitionend', () => {
          answer.hidden = true;
          answer.style.maxHeight = '';
          answer.style.overflow = '';
          answer.style.opacity = '';
        }, { once: true });
      }
    });
  });
}

// ─── Gallery Filter Animation ─────────────────────────────────────
export function initGalleryFilter() {
  if (reducedMotion) return;

  const items = document.querySelectorAll<HTMLElement>('.gallery-item');

  document.querySelectorAll<HTMLButtonElement>('.gallery-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;

      items.forEach((item, i) => {
        const show = category === 'All' || item.dataset.category === category;

        if (show) {
          item.style.display = '';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95) translateY(12px)';
          item.style.transition = `opacity 0.35s ease ${i * 30}ms, transform 0.35s var(--ease-out-expo) ${i * 30}ms`;
          requestAnimationFrame(() => {
            item.style.opacity = '1';
            item.style.transform = 'none';
          });
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            if (item.style.opacity === '0') {
              item.style.display = 'none';
              item.style.transform = '';
              item.style.opacity = '';
              item.style.transition = '';
            }
          }, 300);
        }
      });
    });
  });
}

// ─── Init All ─────────────────────────────────────────────────────
export function initAll() {
  initScrollProgress();
  initScrollReveals();
  initCounters();
  initParallax();
  initButtonRipple();
  initSmoothAnchors();
  initHeaderScroll();
  initFaqAnimations();
  initGalleryFilter();
}
