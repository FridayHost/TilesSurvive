// js/app.js
console.log('🔹 [APP] Script started');

const tg = window.Telegram.WebApp;
tg.expand();

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

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[currentLang][key]) {
      el.textContent = translations[currentLang][key];
    }
  });
}

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

window.addEventListener('load', async () => {
  const telegramId = tg.initDataUnsafe?.user?.id;
  if (!telegramId) return;

  if (typeof window.getUser === 'function') {
    const existingUser = await window.getUser(telegramId);
    if (existingUser) {
      window.location.href = 'profile.html';
      return;
    }
  }

  applyTranslations();
});

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

  if (!nickname || !union || !state || !level) {
    showError(translations[currentLang].error_required, errorMsg);
    return;
  }

  if (level < 1 || level > 30) {
    showError(translations[currentLang].error_level, errorMsg);
    return;
  }

  if (typeof window.saveUser !== 'function') {
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

  try {
    const success = await window.saveUser(userData);
    if (success) {
      localStorage.setItem('tma_user', JSON.stringify(userData));
      window.location.href = 'profile.html';
    } else {
      showError(translations[currentLang].error_save, errorMsg);
    }
  } catch (err) {
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
