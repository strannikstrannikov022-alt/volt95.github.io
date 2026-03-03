// ============================================================
// ⚡ APP.JS — Вся логика сайта Volt95
// ============================================================

// ---- ИНИЦИАЛИЗАЦИЯ: заполнение страницы из CONFIG ----

// Навигация
document.getElementById('nav-brand').textContent = CONFIG.brandName;

// Hero
document.getElementById('hero-brand').textContent = CONFIG.brandName;
document.getElementById('hero-service-type').textContent = CONFIG.serviceType;
document.getElementById('hero-region').querySelector('span:last-child').textContent = CONFIG.region;
document.getElementById('hero-subtitle').textContent = CONFIG.heroSubtitle;
document.getElementById('hero-call').href = 'tel:' + CONFIG.phoneRaw;
document.getElementById('hero-wa').href = CONFIG.whatsappLink;
document.getElementById('hero-tg').href = CONFIG.telegramLink;

// Контакты
document.getElementById('contact-brand').textContent = CONFIG.brandName;
document.getElementById('contact-region').textContent = CONFIG.region;
document.getElementById('contact-phone').href = 'tel:' + CONFIG.phoneRaw;
document.getElementById('contact-phone-text').textContent = CONFIG.phoneFormatted;
document.getElementById('contact-wa').href = CONFIG.whatsappLink;
document.getElementById('contact-tg').href = CONFIG.telegramLink;
document.getElementById('contact-map').href = CONFIG.mapLink;
document.getElementById('cta-call').href = 'tel:' + CONFIG.phoneRaw;
document.getElementById('cta-wa').href = CONFIG.whatsappLink;
document.getElementById('cta-tg').href = CONFIG.telegramLink;

// Мобильная панель
document.getElementById('mob-call').href = 'tel:' + CONFIG.phoneRaw;
document.getElementById('mob-wa').href = CONFIG.whatsappLink;
document.getElementById('mob-tg').href = CONFIG.telegramLink;

// Футер
document.getElementById('footer-brand').textContent = CONFIG.brandName;
document.getElementById('footer-brand2').textContent = CONFIG.brandName;
document.getElementById('footer-service').textContent = CONFIG.serviceType;
document.getElementById('footer-region').textContent = CONFIG.region;
document.getElementById('footer-year').textContent = new Date().getFullYear();


// ============================================================
// УСЛУГИ
// ============================================================
const servicesGrid = document.getElementById('services-grid');
CONFIG.services.forEach((s, i) => {
  const card = document.createElement('div');
  card.className = 'card-hover bg-slate-50 rounded-2xl p-6 border border-slate-100 fade-in';
  card.style.transitionDelay = (i * 0.05) + 's';
  card.innerHTML = `
    <div class="text-4xl mb-4">${s.icon}</div>
    <h3 class="text-xl font-bold text-slate-900 mb-2">${s.title}</h3>
    <p class="text-slate-500 text-sm leading-relaxed">${s.desc}</p>
  `;
  servicesGrid.appendChild(card);
});


// ============================================================
// ПРЕИМУЩЕСТВА
// ============================================================
const advGrid = document.getElementById('advantages-grid');
CONFIG.advantages.forEach((a, i) => {
  const card = document.createElement('div');
  card.className = 'bg-slate-800 rounded-2xl p-6 border border-slate-700 fade-in';
  card.style.transitionDelay = (i * 0.05) + 's';
  card.innerHTML = `
    <div class="text-4xl mb-4">${a.icon}</div>
    <h3 class="text-xl font-bold text-white mb-2">${a.title}</h3>
    <p class="text-white/60 text-sm leading-relaxed">${a.desc}</p>
  `;
  advGrid.appendChild(card);
});


// ============================================================
// ПРИМЕРЫ РАБОТ — ФИЛЬТРЫ + КАРУСЕЛЬ
// ============================================================

// Собираем теги
const allTags = new Set();
CONFIG.works.forEach(w => w.tags.forEach(t => allTags.add(t)));

const filtersContainer = document.getElementById('work-filters');
allTags.forEach(tag => {
  const btn = document.createElement('button');
  btn.className = 'tag-filter px-4 py-2 rounded-full text-sm font-semibold border-2 border-slate-300 text-slate-600';
  btn.dataset.tag = tag;
  btn.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
  btn.onclick = () => filterWorks(tag);
  filtersContainer.appendChild(btn);
});

const worksGrid = document.getElementById('works-grid');

// ---- Карусель ----
function initCarousel(container) {
  const track = container.querySelector('.carousel-track');
  const imgs = track.querySelectorAll('img');
  const dots = container.querySelectorAll('.carousel-dot');
  const counter = container.querySelector('.carousel-counter');
  const total = imgs.length;
  let current = 0;
  let startX = 0, moveX = 0, isDragging = false;

  function goTo(idx) {
    if (idx < 0) idx = total - 1;
    if (idx >= total) idx = 0;
    current = idx;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    if (counter) counter.textContent = `${current + 1} / ${total}`;
  }

  // Кнопки
  const prevBtn = container.querySelector('.carousel-btn.prev');
  const nextBtn = container.querySelector('.carousel-btn.next');
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); goTo(current - 1); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); goTo(current + 1); });

  // Точки
  dots.forEach((dot, i) => {
    dot.addEventListener('click', (e) => { e.stopPropagation(); goTo(i); });
  });

  // Тач-свайп
  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    track.style.transition = 'none';
  }, { passive: true });
  track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    moveX = e.touches[0].clientX - startX;
    const offset = -(current * 100) + (moveX / track.offsetWidth) * 100;
    track.style.transform = `translateX(${offset}%)`;
  }, { passive: true });
  track.addEventListener('touchend', () => {
    isDragging = false;
    track.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
    if (moveX < -40) goTo(current + 1);
    else if (moveX > 40) goTo(current - 1);
    else goTo(current);
    moveX = 0;
  });

  // Мышь-свайп
  track.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    isDragging = true;
    track.style.transition = 'none';
    track.style.cursor = 'grabbing';
    e.preventDefault();
  });
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    moveX = e.clientX - startX;
    const offset = -(current * 100) + (moveX / track.offsetWidth) * 100;
    track.style.transform = `translateX(${offset}%)`;
  });
  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
    track.style.cursor = '';
    if (moveX < -40) goTo(current + 1);
    else if (moveX > 40) goTo(current - 1);
    else goTo(current);
    moveX = 0;
  });

  goTo(0);
  return { goTo, getCurrent: () => current };
}

function renderWorks(filter) {
  if (filter === undefined) filter = 'all';
  worksGrid.innerHTML = '';
  const filtered = filter === 'all' ? CONFIG.works : CONFIG.works.filter(w => w.tags.includes(filter));

  filtered.forEach((w, wi) => {
    const card = document.createElement('div');
    card.className = 'card-hover bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 fade-in';
    card.style.transitionDelay = (wi * 0.05) + 's';

    const tagsHtml = w.tags.map(t =>
      `<span class="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full">${t}</span>`
    ).join(' ');

    const hasMultiple = w.images.length > 1;

    const imgsHtml = w.images.map((src, imgI) =>
      `<img src="${src}" alt="${w.title} — фото ${imgI+1}" loading="lazy" onclick="openLightbox(${wi}, ${imgI}, '${filter}')">`
    ).join('');

    const dotsHtml = hasMultiple ? w.images.map((_, i) =>
      `<button class="carousel-dot${i === 0 ? ' active' : ''}" aria-label="Фото ${i+1}"></button>`
    ).join('') : '';

    card.innerHTML = `
      <div class="carousel" data-work="${wi}">
        <div class="carousel-track">${imgsHtml}</div>
        ${hasMultiple ? `<button class="carousel-btn prev" aria-label="Назад">‹</button>` : ''}
        ${hasMultiple ? `<button class="carousel-btn next" aria-label="Вперёд">›</button>` : ''}
        ${hasMultiple ? `<div class="carousel-dots">${dotsHtml}</div>` : ''}
        ${hasMultiple ? `<div class="carousel-counter">1 / ${w.images.length}</div>` : ''}
      </div>
      <div class="p-5">
        <div class="flex flex-wrap items-center gap-2 mb-2">${tagsHtml}</div>
        <h3 class="text-lg font-bold text-slate-900 mb-1">${w.title}</h3>
        <p class="text-slate-500 text-sm mb-2">${w.description}</p>
        <p class="text-xs text-slate-400">${formatDate(w.date)}</p>
      </div>
    `;
    worksGrid.appendChild(card);

    if (hasMultiple) {
      const carouselEl = card.querySelector('.carousel');
      initCarousel(carouselEl);
    }
  });

  // Анимация появления
  setTimeout(() => {
    worksGrid.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
  }, 50);
}

function filterWorks(tag) {
  document.querySelectorAll('.tag-filter').forEach(b => {
    b.classList.remove('active', 'bg-yellow-400', 'text-slate-900');
    if (b.dataset.tag === tag) {
      b.classList.add('active', 'bg-yellow-400', 'text-slate-900');
    }
  });
  renderWorks(tag);
}

function formatDate(dateStr) {
  const months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
  const d = new Date(dateStr);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

renderWorks();


// ============================================================
// ЛАЙТБОКС
// ============================================================
let lbImages = [];
let lbCurrentIndex = 0;
let lbWorkTitle = '';
let lbTouchStartX = 0;
let lbTouchMoveX = 0;

function openLightbox(workIndex, imgIndex, currentFilter) {
  const filtered = currentFilter === 'all' ? CONFIG.works : CONFIG.works.filter(w => w.tags.includes(currentFilter));
  const work = filtered[workIndex];
  if (!work) return;

  lbImages = work.images;
  lbCurrentIndex = imgIndex || 0;
  lbWorkTitle = work.title;

  updateLightbox();
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';

  const showNav = lbImages.length > 1;
  document.getElementById('lb-prev').style.display = showNav ? '' : 'none';
  document.getElementById('lb-next').style.display = showNav ? '' : 'none';
}

function updateLightbox() {
  document.getElementById('lb-img').src = lbImages[lbCurrentIndex];
  document.getElementById('lb-title').textContent = lbWorkTitle;
  document.getElementById('lb-counter').textContent = lbImages.length > 1
    ? `${lbCurrentIndex + 1} из ${lbImages.length}`
    : '';
}

function closeLightbox(e) {
  if (e && e.target !== document.getElementById('lightbox')) return;
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

function forceCloseLightbox(e) {
  if (e) e.stopPropagation();
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

function lbNav(dir, e) {
  if (e) e.stopPropagation();
  if (lbImages.length <= 1) return;
  lbCurrentIndex += dir;
  if (lbCurrentIndex < 0) lbCurrentIndex = lbImages.length - 1;
  if (lbCurrentIndex >= lbImages.length) lbCurrentIndex = 0;
  updateLightbox();
}

// Клавиатура
document.addEventListener('keydown', function(e) {
  if (!document.getElementById('lightbox').classList.contains('active')) return;
  if (e.key === 'Escape') forceCloseLightbox();
  if (e.key === 'ArrowLeft') lbNav(-1);
  if (e.key === 'ArrowRight') lbNav(1);
});

// Тач-свайп в лайтбоксе
(function() {
  const lb = document.getElementById('lightbox');
  lb.addEventListener('touchstart', (e) => {
    lbTouchStartX = e.touches[0].clientX;
    lbTouchMoveX = 0;
  }, { passive: true });
  lb.addEventListener('touchmove', (e) => {
    lbTouchMoveX = e.touches[0].clientX - lbTouchStartX;
  }, { passive: true });
  lb.addEventListener('touchend', () => {
    if (lbTouchMoveX < -60) lbNav(1);
    else if (lbTouchMoveX > 60) lbNav(-1);
    lbTouchMoveX = 0;
  });
})();


// ============================================================
// ФОРМА ЗАЯВКИ
// ============================================================
function getFormText() {
  const name = document.getElementById('form-name').value.trim() || 'Не указано';
  const msg = document.getElementById('form-message').value.trim() || 'Не указано';
  return `Заявка с сайта ${CONFIG.brandName}%0A%0AИмя: ${encodeURIComponent(name)}%0AСообщение: ${encodeURIComponent(msg)}`;
}

function sendToWhatsApp() {
  const text = getFormText();
  window.open(`${CONFIG.whatsappLink}?text=${text}`, '_blank');
}

function sendToTelegram() {
  const text = getFormText();
  window.open(`${CONFIG.telegramLink}?text=${text}`, '_blank');
}


// ============================================================
// НАВИГАЦИЯ
// ============================================================

// Прозрачность навбара при скролле
window.addEventListener('scroll', function() {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 80) {
    nav.classList.add('bg-slate-900/95', 'backdrop-blur', 'shadow-lg');
    nav.classList.remove('bg-transparent');
  } else {
    nav.classList.remove('bg-slate-900/95', 'backdrop-blur', 'shadow-lg');
    nav.classList.add('bg-transparent');
  }
});

// Мобильное меню
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
mobileMenuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

function closeMobileMenu() {
  mobileMenu.classList.add('hidden');
}


// ============================================================
// АНИМАЦИИ ПОЯВЛЕНИЯ
// ============================================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Повторно для динамических элементов
setTimeout(() => {
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}, 100);
