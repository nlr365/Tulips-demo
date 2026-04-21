// ════════════════════════════════
// FALLING PETALS ANIMATION
// ════════════════════════════════
const PETAL_EMOJIS = ['🌸','🌺','🌹','🍀','🌿','🌼','🌷','🍃','💐','✿'];
const canvas = document.getElementById('petalsCanvas');
let petals = [];

function createPetal() {
  if (!canvas) return;
  const el = document.createElement('div');
  el.className = 'petal';
  const emoji = PETAL_EMOJIS[Math.floor(Math.random() * PETAL_EMOJIS.length)];
  el.textContent = emoji;
  const size = 14 + Math.random() * 18;
  const left = Math.random() * 100;
  const duration = 6 + Math.random() * 10;
  const delay = Math.random() * 5;
  el.style.cssText = `
    left:${left}%;
    font-size:${size}px;
    animation-duration:${duration}s;
    animation-delay:${delay}s;
  `;
  canvas.appendChild(el);
  setTimeout(() => el.remove(), (duration + delay) * 1000);
}

function spawnPetals() {
  createPetal();
  setTimeout(spawnPetals, 400 + Math.random() * 600);
}
if (canvas) spawnPetals();

// ════════════════════════════════
// NAV + SCROLL
// ════════════════════════════════
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
});
function toggleMob() { document.getElementById('mobileMenu').classList.toggle('open'); }
function closeMob() { document.getElementById('mobileMenu').classList.remove('open'); }

// Fade up animations
const fadeEls = document.querySelectorAll('.fade-up');
const fadeObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });
fadeEls.forEach(f => fadeObs.observe(f));

// ════════════════════════════════
// GALLERY & LIGHTBOX
// ════════════════════════════════
const galleryImgs = [
  'img/wedding-3.jpg',
  'img/wedding-4.jpg',
  'img/wedding-5.jpg',
  'img/wedding-6.jpg',
  'img/birthday-1.jpg',
  'img/birthday-2.jpg',
  'img/birthday-3.jpg',
  'img/corporate-1.jpg',
  'img/wedding-9.jpg'
];
let lbIdx = 0;
function openLb(i) { 
  lbIdx = i; 
  const lbImg = document.getElementById('lbImg');
  if (lbImg) lbImg.src = galleryImgs[i]; 
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.add('open'); 
}
function closeLb() { 
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('open'); 
}
function lbNav(d) { 
  lbIdx = (lbIdx + d + galleryImgs.length) % galleryImgs.length; 
  const lbImg = document.getElementById('lbImg');
  if (lbImg) lbImg.src = galleryImgs[lbIdx]; 
}
const lbContainer = document.getElementById('lightbox');
if (lbContainer) {
    lbContainer.addEventListener('click', function(e){ if(e.target === this) closeLb(); });
}

function filterGallery(cat, el) {
  document.querySelectorAll('.gtab').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
  });
}

// ════════════════════════════════
// TOAST
// ════════════════════════════════
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg; 
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}
