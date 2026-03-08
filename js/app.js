// js/app.js - Основная логика приложения

console.log('🔹 [APP] Script loaded');

const tg = window.Telegram.WebApp;
tg.expand();

// Переводы
const translations = {
  ru: {
    title: 'Регистрация',
    label_nickname: 'Никнейм',
    label_union: 'Союз',
    label_state: 'Штат',
    label_level: 'Уровень электростанции (1-30)',
    btn_register: 'Зарегистрироваться',
    error_required: 'Заполните все поля',
    error_level: 'Уровень должен быть от 1 до 30',
    error_save: 'Ошибка сохранения'
  },
  en: {
    title: 'Registration',
    label_nickname: 'Nickname',
    label_union: 'Union',
    label_state: 'State',
    label_level: 'Power Plant Level (1-30)',
    btn_register: 'Register',
    error_required: 'Fill in all fields',
    error_level: 'Level must be 1-30',
    error_save: 'Save error'
  }
};

let currentLang = 'ru';

// Применение переводов
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[currentLang][key]) {
      el.textContent = translations[currentLang][key];
    }
  });
}

// Переключение языка
function updateLangButtons() {
  document.getElementById('lang-ru')?.classList.toggle('active', currentLang === 'ru');
  document.getElementById('lang-en')?.classList.toggle('active', currentLang === 'en');
}

document.getElementById('lang-ru')?.addEventListener('click', () => {
  currentLang = 'ru';
  updateLangButtons();
  applyTranslations();
});

document.getElementById('lang-en')?.addEventListener('click', () => {
  currentLang = 'en';
  updateLangButtons();
  applyTranslations();
});

// Проверка при загрузке
window.addEventListener('load', async () => {
  const telegramId = tg.initDataUnsafe?.user?.id;

  if (!telegramId) {
    console.warn('⚠️ [APP] No Telegram ID');
    return;
  }

  // Проверка: загрузилась ли функция getUser?
  if (typeof window.getUser !== 'function') {
    console.error('❌ [APP] getUser function not found!');
    return;
  }

  // Если пользователь уже зарегистрирован — редирект в профиль
  const existingUser = await window.getUser(telegramId);
  if (existingUser) {
    console.log('✅ [APP] User exists, redirecting to profile');
    window.location.href = 'profile.html';
    return;
  }

  console.log('📝 [APP] New user, showing registration');
  applyTranslations();
});

// Обработка формы
document.getElementById('register-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const errorMsg = document.getElementById('error-msg');
  errorMsg.textContent = '';
  errorMsg.classList.remove('visible');

  const nickname = document.getElementById('nickname')?.value.trim();
  const union = document.getElementById('union')?.value.trim();
  const state = document.getElementById('state')?.value.trim();
  const level = parseInt(document.getElementById('level')?.value);
  const telegramId = tg.initDataUnsafe?.user?.id;

  console.log('📝 [APP] Form submitted', { nickname, union, state, level, telegramId });

  // Валидация
  if (!nickname || !union || !state || !level) {
    showError(translations[currentLang].error_required, errorMsg);
    return;
  }

  if (level < 1 || level > 30) {
    showError(translations[currentLang].error_level, errorMsg);
    return;
  }

  // Проверка функции сохранения
  if (typeof window.saveUser !== 'function') {
    console.error('❌ [APP] saveUser function NOT found!');
    showError('System error: saveUser not loaded', errorMsg);
    return;
  }

  const userData = {
    telegram_id: telegramId,
    nickname,
    union,
    state,
    level,
    language: currentLang,
    registered_at: new Date().toISOString()
  };

  console.log('💾 [APP] Saving user:', userData);

  try {
    const success = await window.saveUser(userData);
    if (success) {
      localStorage.setItem('tma_user', JSON.stringify(userData));
      console.log('✅ [APP] Registration complete');
      window.location.href = 'profile.html';
    } else {
      showError(translations[currentLang].error_save, errorMsg);
    }
  } catch (err) {
    console.error('❌ [APP] Registration error:', err);
    showError('Error: ' + err.message, errorMsg);
  }
});

function showError(msg, element) {
  if (element) {
    element.textContent = msg;
    element.classList.add('visible');
  }
}

console.log('🏁 [APP] Ready');
