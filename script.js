// ============================================================
// Bordignon LP — interactions
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
  initCarousel();
  initLogosCarousel();
  initYear();
});

// ---------- NAV (scroll state + burger toggle) ----------
function initNav() {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const links = document.querySelector('.nav__links');

  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (burger && links) {
    burger.addEventListener('click', () => {
      links.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('.nav__links a').forEach(a => {
    a.addEventListener('click', () => links?.classList.remove('is-open'));
  });
}

// ---------- REVEAL ON SCROLL ----------
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || els.length === 0) {
    els.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => io.observe(el));
}

// ---------- CAROUSEL ----------
function initCarousel() {
  const track = document.getElementById('track');
  const prev = document.getElementById('prevBtn');
  const next = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('dots');
  if (!track || !prev || !next) return;

  const cards = Array.from(track.children);

  // Build dots (one per card)
  cards.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'carousel__dot';
    d.setAttribute('aria-label', `Ir para slide ${i + 1}`);
    d.addEventListener('click', () => scrollToCard(i));
    dotsWrap.appendChild(d);
  });
  const dots = Array.from(dotsWrap.children);

  function cardStep() {
    if (cards.length < 2) return track.clientWidth;
    return cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left;
  }

  function scrollToCard(i) {
    const step = cardStep();
    track.scrollTo({ left: step * i, behavior: 'smooth' });
  }

  function updateState() {
    const step = cardStep();
    const idx = Math.round(track.scrollLeft / step);
    dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));

    prev.disabled = track.scrollLeft <= 2;
    const maxScroll = track.scrollWidth - track.clientWidth - 2;
    next.disabled = track.scrollLeft >= maxScroll;
  }

  prev.addEventListener('click', () => {
    track.scrollBy({ left: -cardStep(), behavior: 'smooth' });
  });
  next.addEventListener('click', () => {
    track.scrollBy({ left: cardStep(), behavior: 'smooth' });
  });

  track.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateState);
  }, { passive: true });
  window.addEventListener('resize', updateState);

  // Drag-to-scroll (desktop)
  let isDown = false, startX = 0, startLeft = 0;
  track.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX;
    startLeft = track.scrollLeft;
    track.style.cursor = 'grabbing';
  });
  window.addEventListener('mouseup', () => {
    if (!isDown) return;
    isDown = false;
    track.style.cursor = '';
  });
  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    track.scrollLeft = startLeft - (e.pageX - startX);
  });

  updateState();
}

// ---------- LOGOS CAROUSEL (shadcn/embla-like, vanilla) ----------
function initLogosCarousel() {
  const track = document.getElementById('logosTrack');
  const prev = document.getElementById('logosPrev');
  const next = document.getElementById('logosNext');
  if (!track || !prev || !next) return;

  const items = Array.from(track.children);

  function itemStep() {
    if (items.length < 2) return track.clientWidth;
    return items[1].getBoundingClientRect().left - items[0].getBoundingClientRect().left;
  }

  function visibleCount() {
    return Math.max(1, Math.round(track.clientWidth / itemStep()));
  }

  function updateButtons() {
    prev.disabled = track.scrollLeft <= 2;
    const maxScroll = track.scrollWidth - track.clientWidth - 2;
    next.disabled = track.scrollLeft >= maxScroll;
  }

  prev.addEventListener('click', () => {
    track.scrollBy({ left: -itemStep() * visibleCount(), behavior: 'smooth' });
  });
  next.addEventListener('click', () => {
    track.scrollBy({ left: itemStep() * visibleCount(), behavior: 'smooth' });
  });

  track.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateButtons);
  }, { passive: true });
  window.addEventListener('resize', updateButtons);

  // Keyboard nav
  const region = track.closest('.logos-carousel');
  region?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev.click(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); next.click(); }
  });
  region?.setAttribute('tabindex', '0');

  // Drag-to-scroll
  let isDown = false, startX = 0, startLeft = 0;
  track.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX;
    startLeft = track.scrollLeft;
    track.style.cursor = 'grabbing';
  });
  window.addEventListener('mouseup', () => {
    if (!isDown) return;
    isDown = false;
    track.style.cursor = '';
  });
  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    track.scrollLeft = startLeft - (e.pageX - startX);
  });

  updateButtons();
}

// ---------- FOOTER YEAR ----------
function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}
