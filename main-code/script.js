/* ---------- Hero video: always playing ---------- */
const video = document.getElementById('mainVideo');
function ensureVideoPlays(){ video.muted = true; video.play().catch(()=>{}); }
window.addEventListener('DOMContentLoaded', ensureVideoPlays);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') ensureVideoPlays(); });

/* ---------- Smooth-scroll with navbar offset ---------- */
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    const offset = target.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

/* ---------- Custom cursor (desktop) ---------- */
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const cursor = document.getElementById('cursor');
  document.addEventListener('mousemove', e => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });
  const hoverables = document.querySelectorAll('nav a, .project-card, .cv-anchor, .audio-toggle');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'scale(2)';
      cursor.style.backgroundColor = 'rgba(255,0,0,0.7)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'scale(1)';
      cursor.style.backgroundColor = 'rgba(255,215,0,0.7)';
    });
  });
} else {
  const cur = document.getElementById('cursor');
  if (cur) cur.remove();
}

/* ---------- Background audio loop (0 → 1:53), start UNMUTED ---------- */
const audio = document.getElementById('bgAudio');
const toggleBtn = document.getElementById('audioToggle');
const END_AT = 55; 
let userMuted = false;

function updateIcon(){ toggleBtn.classList.toggle('muted', audio.muted); }

/* Keep only first 1:53 */
audio.addEventListener('timeupdate', () => {
  if (audio.currentTime >= END_AT) {
    audio.currentTime = 0;
    audio.play().catch(()=>{});
  }
});

/* Mute/Unmute button (doesn't control play state) */
toggleBtn.addEventListener('click', () => {
  audio.muted = !audio.muted;
  userMuted = audio.muted;
  updateIcon();
});

/* ---------- Autoplay with retries & gesture fallback ---------- */
function startAudioNow(){
  audio.autoplay = true;
  audio.muted = false;
  audio.play().catch(()=>{});
  updateIcon();
}

/* Retry a few times in case the browser soft-blocks autoplay */
let retries = 0;
const maxRetries = 12; // ~12s total
let retryTimer = null;

function ensureAudioIsPlaying(){
  if (!userMuted && (audio.paused || audio.currentTime === 0)) {
    startAudioNow();
    retries++;
    if (retries < maxRetries) {
      retryTimer = setTimeout(ensureAudioIsPlaying, 1000);
    }
  } else if (retryTimer) {
    clearTimeout(retryTimer);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  startAudioNow();
  ensureAudioIsPlaying();
});

/* Kick on first gesture if the browser required interaction */
const kickEvents = ['click','keydown','touchstart','pointerdown','mousemove','wheel','scroll'];
kickEvents.forEach(ev => {
  window.addEventListener(ev, () => {
    if (!userMuted && (audio.paused || audio.currentTime === 0)) startAudioNow();
  }, { once: true, passive: true });
});

/* Also try again when tab becomes visible */
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') ensureAudioIsPlaying();
});