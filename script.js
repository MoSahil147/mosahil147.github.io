/* ---------- Scroll reveal for sections ---------- */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
}

/* ---------- Hero video: always playing ---------- */
const video = document.getElementById('mainVideo');
function ensureVideoPlays(){ video.muted = true; video.play().catch(()=>{}); }
window.addEventListener('DOMContentLoaded', ensureVideoPlays);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') ensureVideoPlays(); });

/* ---------- Smooth-scroll with navbar offset ---------- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

/* ---------- Custom cursor (desktop) ---------- */
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const cursor = document.getElementById('cursor');
  let pendingX = 0, pendingY = 0, rafId = null, scale = 1;

  function applyCursorPosition(){
    cursor.style.transform = `translate3d(-50%, -50%, 0) translate(${pendingX}px, ${pendingY}px) scale(${scale})`;
    rafId = null;
  }

  document.addEventListener('mousemove', e => {
    pendingX = e.clientX;
    pendingY = e.clientY;
    if (rafId === null) rafId = requestAnimationFrame(applyCursorPosition);
  }, { passive: true });

  const hoverables = document.querySelectorAll('nav a, .project-card, .cv-anchor');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      scale = 2;
      cursor.style.backgroundColor = 'rgba(255,0,0,0.7)';
      if (rafId === null) rafId = requestAnimationFrame(applyCursorPosition);
    });
    el.addEventListener('mouseleave', () => {
      scale = 1;
      cursor.style.backgroundColor = 'rgba(255,215,0,0.7)';
      if (rafId === null) rafId = requestAnimationFrame(applyCursorPosition);
    });
  });
} else {
  const cur = document.getElementById('cursor');
  if (cur) cur.remove();
}