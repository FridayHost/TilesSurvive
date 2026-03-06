const tg = window.Telegram.WebApp;
tg.expand();

console.log('🚀 App started, User ID:', tg.initDataUnsafe?.user?.id);

// Переводы
const translations = {
  ru: {
    register_title: "Регистрация",
    label_nickname: "Никнейм",
    label_union: "Союз",
    label_state: "Штат",
    label_level: "Уровень электростанции (1-30)",
    btn_register: "Зарегистрироваться",
    error_required: "Заполните все поля",
    error_level: "Уровень должен быть от 1 до 30",
    error_save: "Ошибка сохранения. Попробуйте позже."
  },
  en: {
    register_title: "Registration",
    label_nickname: "Nickname",
    label_union: "Union",
    label_state: "State",
    label_level: "Power Plant Level (1-30)",
    btn_register: "Register",
    error_required: "Fill in all fields",
    error_level: "Level must be between 1 and 30",
    error_save: "Save error. Try later."
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

// Переключение языка
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

function updateLangButtons() {
  document.getElementById('lang-ru')?.classList.toggle('active', currentLang === 'ru');
  document.getElementById('lang-en')?.classList.toggle('active', currentLang === 'en');
}

// Обработка регистрации
document.getElementById('register-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  console.log('📝 Form submitted');
  
  const nickname = document.getElementById('nickname').value.trim();
  const union = document.getElementById('union').value.trim();
  const state = document.getElementById('state').value.trim();
  const level = parseInt(document.getElementById('level').value);
  const telegramId = tg.initDataUnsafe?.user?.id;
  
  console.log('📥 Data:', { nickname, union, state, level, telegramId });
  
  // Валидация
  if (!nickname || !union || !state || !level) {
    console.error('❌ Validation failed: empty fields');
    showError(translations[currentLang].error_required);
    return;
  }
  if (level < 1 || level > 30) {
    console.error('❌ Validation failed: wrong level');
    showError(translations[currentLang].error_level);
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
  
  console.log('💾 Trying to save user...');
  
  // Проверка: существует ли функция saveUser
  if (typeof saveUser !== 'function') {
    console.error('❌ saveUser function not found! Check api.js loading');
    showError('System error: saveUser not found');
    return;
  }
  
  try {
    const success = await saveUser(userData);
    console.log('💾 Save result:', success);
    
    if (success) {
      console.log('✅ Success! Redirecting...');
      localStorage.setItem('tma_user', JSON.stringify(userData));
      
      // Небольшая задержка перед переходом
      setTimeout(() => {
        window.location.href = 'profile.html';
      }, 500);
    } else {
      showError(translations[currentLang].error_save);
    }
  } catch (err) {
    console.error('❌ Exception during save:', err);
    showError('Error: ' + err.message);
  }
});

function showError(msg) {
  const el = document.getElementById('error-msg');
  if (el) {
    el.textContent = msg;
    el.style.display = 'block';
    console.error('🔴 Error shown:', msg);
  }
}

applyTranslations();
console.log('✅ App initialized');