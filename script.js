(() => {
  'use strict';

  // Change this one value to the next birthday. Month is zero-based in JavaScript.
  const birthdayDate = new Date(2026, 7, 29, 0, 0, 0);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  function startCountdown() {
    const fields = { days: $('#days'), hours: $('#hours'), minutes: $('#minutes'), seconds: $('#seconds') };
    const note = $('#countdown-note');
    const update = () => {
      let distance = birthdayDate.getTime() - Date.now();
      if (distance <= 0) {
        note.textContent = 'Today is your day. Make it unforgettable.';
        distance = 0;
      }
      const values = {
        days: Math.floor(distance / 86400000),
        hours: Math.floor(distance / 3600000) % 24,
        minutes: Math.floor(distance / 60000) % 60,
        seconds: Math.floor(distance / 1000) % 60
      };
      Object.keys(fields).forEach((key) => { fields[key].textContent = String(values[key]).padStart(2, '0'); });
    };
    update();
    window.setInterval(update, 1000);
  }

  function createConfetti(amount = 90) {
    if (reducedMotion) return;
    const layer = $('.confetti-layer');
    const colors = ['#d8ab5f', '#f1d79d', '#bd7d84', '#f8f4ed', '#6c4d72'];
    for (let index = 0; index < amount; index += 1) {
      const piece = document.createElement('span');
      piece.className = 'confetti';
      piece.style.backgroundColor = colors[index % colors.length];
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.setProperty('--drift', `${(Math.random() - 0.5) * 22}vw`);
      piece.style.animationDelay = `${Math.random() * .8}s`;
      piece.style.transform = `rotate(${Math.random() * 180}deg)`;
      layer.appendChild(piece);
      window.setTimeout(() => piece.remove(), 4200);
    }
  }

  function setupCake() {
    const button = $('.wish-button');
    button.addEventListener('click', () => {
      $$('.flame').forEach((flame) => { flame.style.animation = 'none'; flame.style.opacity = '0'; });
      button.innerHTML = 'Wish made <span aria-hidden="true">&#9825;</span>';
      button.disabled = true;
      createConfetti(70);
    });
  }

  function setupGift() {
    const button = $('.gift-box');
    const message = $('#gift-message');
    button.addEventListener('click', () => {
      const isOpen = button.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(isOpen));
      message.hidden = !isOpen;
      if (isOpen) createConfetti(45);
    });
  }

  function setupMusic() {
    const audio = $('#birthday-audio');
    const button = $('.music-toggle');
    const label = $('.music-label');
    button.addEventListener('click', async () => {
      try {
        if (audio.paused) { await audio.play(); label.textContent = 'Pause song'; button.setAttribute('aria-pressed', 'true'); }
        else { audio.pause(); label.textContent = 'Play a song'; button.setAttribute('aria-pressed', 'false'); }
      } catch (error) {
        label.textContent = 'Add birthday.mp3';
      }
    });
    audio.addEventListener('ended', () => { label.textContent = 'Play a song'; button.setAttribute('aria-pressed', 'false'); });
  }

  function setupLightbox() {
    const dialog = $('.lightbox');
    const art = $('.lightbox-art');
    const title = $('#lightbox-title');
    const text = $('#lightbox-text');
    const close = $('.lightbox-close');
    const open = (card) => {
      const texture = getComputedStyle(card).getPropertyValue('--memory-texture');
      art.style.setProperty('--memory-texture', texture);
      title.textContent = card.dataset.title;
      text.textContent = card.dataset.copy;
      dialog.hidden = false;
      document.body.classList.add('no-scroll');
      close.focus();
    };
    const dismiss = () => { dialog.hidden = true; document.body.classList.remove('no-scroll'); };
    $$('.memory-card').forEach((card) => card.addEventListener('click', () => open(card)));
    close.addEventListener('click', dismiss);
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dismiss(); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !dialog.hidden) dismiss(); });
  }

  function setupFireworks() {
    const canvas = $('#fireworks-canvas');
    const context = canvas.getContext('2d');
    let rockets = [];
    let particles = [];
    let running = false;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    const launch = () => {
      rockets.push({ x: Math.random() * canvas.width, y: canvas.height + 10, target: canvas.height * (.2 + Math.random() * .4), speed: 8 + Math.random() * 3, hue: 30 + Math.random() * 330 });
    };
    const burst = (rocket) => {
      for (let index = 0; index < 36; index += 1) {
        const angle = (Math.PI * 2 * index) / 36;
        particles.push({ x: rocket.x, y: rocket.y, vx: Math.cos(angle) * (1 + Math.random() * 4), vy: Math.sin(angle) * (1 + Math.random() * 4), life: 55, hue: rocket.hue });
      }
    };
    const draw = () => {
      context.fillStyle = 'rgba(29, 19, 40, .18)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      rockets.forEach((rocket) => { rocket.y -= rocket.speed; context.fillStyle = `hsl(${rocket.hue}, 80%, 70%)`; context.fillRect(rocket.x, rocket.y, 2, 9); });
      rockets = rockets.filter((rocket) => { if (rocket.y <= rocket.target) { burst(rocket); return false; } return true; });
      particles.forEach((particle) => { particle.x += particle.vx; particle.y += particle.vy; particle.vy += .04; particle.life -= 1; context.fillStyle = `hsla(${particle.hue}, 80%, 72%, ${particle.life / 55})`; context.fillRect(particle.x, particle.y, 2, 2); });
      particles = particles.filter((particle) => particle.life > 0);
      if (running || rockets.length || particles.length) window.requestAnimationFrame(draw); else context.clearRect(0, 0, canvas.width, canvas.height);
    };
    const show = () => { if (reducedMotion) return; running = true; launch(); window.setTimeout(launch, 320); window.setTimeout(launch, 680); draw(); window.setTimeout(() => { running = false; }, 1400); };
    resize(); window.addEventListener('resize', resize); $('.fireworks-button').addEventListener('click', show);
  }

  function setupReveal() {
    if (reducedMotion || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('reveal'); observer.unobserve(entry.target); } }), { threshold: .15 });
    $$('.section-heading, .timeline-item, .wish-card, .gift-copy').forEach((element) => { element.classList.remove('reveal'); observer.observe(element); });
  }

  startCountdown(); setupCake(); setupGift(); setupMusic(); setupLightbox(); setupFireworks(); setupReveal();
  window.setTimeout(() => createConfetti(35), 900);
})();
