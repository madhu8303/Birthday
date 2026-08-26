const countdownTitle = document.querySelector('#countdown-title');
const countdownLabel = document.querySelector('#countdown .eyebrow');
const parts = { days: document.querySelector('#days'), hours: document.querySelector('#hours'), minutes: document.querySelector('#minutes'), seconds: document.querySelector('#seconds') };

function updateCountdown() {
  const now = new Date();
  const target = new Date(now.getFullYear(), 7, 29);
  if (now >= target) target.setFullYear(now.getFullYear() + 1);
  const difference = Math.max(0, target - now);
  const values = { days: Math.floor(difference / 86400000), hours: Math.floor(difference / 3600000) % 24, minutes: Math.floor(difference / 60000) % 60, seconds: Math.floor(difference / 1000) % 60 };
  Object.keys(parts).forEach((key) => { parts[key].textContent = String(values[key]).padStart(key === 'days' ? 3 : 2, '0'); });
  if (difference === 0) { countdownLabel.textContent = 'Today is your day'; countdownTitle.innerHTML = 'Happy<br><em>birthday.</em>'; }
}
updateCountdown();
setInterval(updateCountdown, 1000);

const giftButton = document.querySelector('#giftButton');
const giftReveal = document.querySelector('#giftReveal');
const giftHint = document.querySelector('#giftHint');
giftButton.addEventListener('click', () => {
  const isOpen = giftButton.classList.toggle('open');
  giftButton.setAttribute('aria-expanded', String(isOpen));
  giftReveal.classList.toggle('visible', isOpen);
  giftReveal.setAttribute('aria-hidden', String(!isOpen));
  giftHint.textContent = isOpen ? 'A little piece of my heart, just for you.' : 'Tap the box. You know you want to.';
  if (isOpen) launchConfetti();
});

const letterImage = document.querySelector('#giftReveal img');
function downloadLetter() {
  if (!letterImage.complete || !letterImage.naturalWidth) return;
  const canvas = document.createElement('canvas');
  canvas.width = letterImage.naturalWidth;
  canvas.height = letterImage.naturalHeight;
  canvas.getContext('2d').drawImage(letterImage, 0, 0);
  const link = document.createElement('a');
  link.href = canvas.toDataURL('images\letter.jpeg', .92);
  link.download = 'images\letter.jpeg';
  link.click();
}
letterImage.addEventListener('click', downloadLetter);
letterImage.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    downloadLetter();
  }
});

document.querySelectorAll('img').forEach((image) => {
  image.addEventListener('error', () => { image.classList.add('missing-image'); image.alt = `${image.alt} — add the matching file in the images folder`; });
});

const canvas = document.querySelector('#celebrationCanvas');
const context = canvas.getContext('2d');
let particles = [];
let fireworks = [];
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resizeCanvas); resizeCanvas();
function launchConfetti() {
  particles = Array.from({ length: 150 }, () => ({ x: window.innerWidth / 2, y: window.innerHeight * .55, vx: (Math.random() - .5) * 12, vy: Math.random() * -12 - 4, size: Math.random() * 7 + 3, life: 1, color: ['#d4a85b', '#f4efe5', '#b65c3b', '#8f9d75'][Math.floor(Math.random() * 4)], spin: Math.random() * 0.2 }));
  fireworks = Array.from({ length: 3 }, (_, index) => ({ x: window.innerWidth * (.25 + index * .25), y: window.innerHeight * (.25 + Math.random() * .2), age: 0, color: ['#d4a85b', '#f4efe5', '#b65c3b'][index] }));
  requestAnimationFrame(animateCelebration);
}
function animateCelebration() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter((particle) => particle.life > 0);
  particles.forEach((particle) => { particle.x += particle.vx; particle.y += particle.vy; particle.vy += .25; particle.life -= .009; context.save(); context.globalAlpha = particle.life; context.fillStyle = particle.color; context.translate(particle.x, particle.y); context.rotate(particle.life * 8); context.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 1.8); context.restore(); });
  fireworks.forEach((firework) => { firework.age += .04; context.save(); context.globalAlpha = Math.max(0, 1 - firework.age / 2); context.strokeStyle = firework.color; context.lineWidth = 2; for (let ray = 0; ray < 18; ray += 1) { const angle = ray * Math.PI / 9; const radius = firework.age * 90; context.beginPath(); context.moveTo(firework.x + Math.cos(angle) * radius * .35, firework.y + Math.sin(angle) * radius * .35); context.lineTo(firework.x + Math.cos(angle) * radius, firework.y + Math.sin(angle) * radius); context.stroke(); } context.restore(); });
  fireworks = fireworks.filter((firework) => firework.age < 2);
  if (particles.length || fireworks.length) requestAnimationFrame(animateCelebration); else context.clearRect(0, 0, canvas.width, canvas.height);
}

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('in-view'); }), { threshold: .12 });
document.querySelectorAll('section').forEach((section) => observer.observe(section));
