// غيّر هذا الموعد لاحقًا بالصيغة: سنة، رقم الشهر - 1، اليوم، الساعة، الدقيقة.
const targetDate = new Date(2026, 6, 25, 0, 0, 0);

const screen = document.getElementById('countdownScreen');
const surpriseScreen = document.getElementById('surpriseScreen');
const galleryScreen = document.getElementById('galleryScreen');
const pageShell = document.getElementById('pageShell');
const values = {
  days: document.getElementById('days'),
  hours: document.getElementById('hours'),
  minutes: document.getElementById('minutes'),
  seconds: document.getElementById('seconds'),
};
const envelopeButton = document.getElementById('envelopeButton');
const envelopeStage = document.getElementById('envelopeStage');
const tapCount = document.getElementById('tapCount');
const instruction = document.getElementById('instruction');
const memoriesButton = document.getElementById('memoriesButton');
const backgroundMusic = document.getElementById('backgroundMusic');
const musicToggle = document.getElementById('musicToggle');
let taps = 0;
let revealed = false;
let surpriseVisible = false;

function pad(number) { return String(number).padStart(2, '0'); }

function updateMusicToggle() {
  const isMuted = backgroundMusic.muted;
  musicToggle.setAttribute('aria-label', isMuted ? 'تشغيل الصوت' : 'كتم الصوت');
  musicToggle.setAttribute('aria-pressed', String(isMuted));
  musicToggle.innerHTML = `<span aria-hidden="true">${isMuted ? '🔇' : '🔊'}</span><span>${isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}</span>`;
}

function startMusic() {
  if (!backgroundMusic.muted && backgroundMusic.paused) {
    backgroundMusic.play().catch(() => {});
  }
}

function revealSurprise() {
  if (surpriseVisible) return;
  surpriseVisible = true;
  screen.classList.add('is-leaving');
  window.setTimeout(() => {
    screen.classList.remove('is-active');
    surpriseScreen.classList.add('is-active');
    pageShell.dataset.view = 'surprise';
  }, 500);
}

function revealGallery() {
  surpriseScreen.classList.add('is-leaving');
  window.setTimeout(() => {
    surpriseScreen.classList.remove('is-active', 'is-leaving');
    galleryScreen.classList.add('is-active');
    pageShell.dataset.view = 'gallery';
  }, 500);
}

function updateCountdown() {
  const remaining = targetDate.getTime() - Date.now();
  if (remaining <= 0) {
    Object.values(values).forEach((element) => { element.textContent = '00'; });
    revealSurprise();
    return;
  }
  const seconds = Math.floor(remaining / 1000) % 60;
  const minutes = Math.floor(remaining / 60000) % 60;
  const hours = Math.floor(remaining / 3600000) % 24;
  const days = Math.floor(remaining / 86400000);
  values.days.textContent = pad(days);
  values.hours.textContent = pad(hours);
  values.minutes.textContent = pad(minutes);
  values.seconds.textContent = pad(seconds);
}

function burst() {
  const rect = envelopeButton.getBoundingClientRect();
  const icons = ['🎉', '✨', '🎈', '🧁', '✦'];
  for (let i = 0; i < 9; i += 1) {
    const particle = document.createElement('span');
    const angle = (Math.PI * 2 * i) / 9 + (Math.random() - .5) * .35;
    const distance = 60 + Math.random() * 70;
    particle.className = 'particle';
    particle.textContent = icons[i % icons.length];
    particle.style.left = `${rect.left + rect.width / 2}px`;
    particle.style.top = `${rect.top + rect.height / 2}px`;
    particle.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
    particle.style.setProperty('--y', `${Math.sin(angle) * distance - 25}px`);
    particle.style.setProperty('--r', `${(Math.random() - .5) * 150}deg`);
    particle.style.setProperty('--size', `${13 + Math.random() * 14}px`);
    document.body.appendChild(particle);
    particle.addEventListener('animationend', () => particle.remove());
  }
}

envelopeButton.addEventListener('click', () => {
  if (revealed) return;
  taps += 1;
  tapCount.textContent = taps;
  envelopeButton.classList.remove('tapped');
  void envelopeButton.offsetWidth;
  envelopeButton.classList.add('tapped');
  burst();

  if (taps === 3) {
    revealed = true;
    envelopeStage.classList.add('open');
    instruction.textContent = 'Make a wish… your note is open';
    envelopeButton.setAttribute('aria-label', 'Birthday note opened');
    window.setTimeout(() => memoriesButton.classList.add('is-visible'), 900);
  }
});

memoriesButton.addEventListener('click', revealGallery);

musicToggle.addEventListener('click', () => {
  backgroundMusic.muted = !backgroundMusic.muted;
  updateMusicToggle();
  startMusic();
});

document.addEventListener('pointerdown', startMusic, { once: true });
backgroundMusic.play().catch(() => {});
updateMusicToggle();

updateCountdown();
window.setInterval(updateCountdown, 1000);

// للمعاينة قبل الموعد: أضف ?preview=surprise أو ?preview=gallery إلى الرابط.
const preview = new URLSearchParams(window.location.search).get('preview');
if (preview === 'surprise') {
  surpriseVisible = true;
  screen.classList.remove('is-active');
  surpriseScreen.classList.add('is-active');
  pageShell.dataset.view = 'surprise';
}
if (preview === 'gallery') {
  surpriseVisible = true;
  screen.classList.remove('is-active');
  galleryScreen.classList.add('is-active');
  pageShell.dataset.view = 'gallery';
}
