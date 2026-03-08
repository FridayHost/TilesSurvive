// js/api.js - Firebase API функции

console.log('🔹 [API] Script loaded');

// Заглушки по умолчанию
window.saveUser = async (data) => {
  console.error('❌ [API] saveUser called before initialization');
  return false;
};

window.getUser = async (id) => {
  console.error('❌ [API] getUser called before initialization');
  return null;
};

window.deleteUser = async (id) => {
  console.error('❌ [API] deleteUser called before initialization');
  return false;
};

// Проверка Firebase
if (typeof firebase === 'undefined') {
  console.error('❌ [API] Firebase SDK is NOT loaded. Check index.html');
} else {
  console.log('🔥 [API] Firebase SDK found');

  try {
    // Проверка конфига
    if (typeof firebaseConfig === 'undefined') {
      console.error('❌ [API] firebaseConfig is NOT defined. Check config.js');
    } else {
      console.log('⚙️ [API] Config found, initializing...');
      
      // Инициализация
      firebase.initializeApp(firebaseConfig);
      const db = firebase.firestore();
      console.log('✅ [API] Firebase initialized successfully');

      // ✅ СОХРАНИТЬ ПОЛЬЗОВАТЕЛЯ
      window.saveUser = async (userData) => {
        try {
          console.log('💾 [API] Saving user:', userData.telegram_id);
          await db.collection('users').doc(String(userData.telegram_id)).set(userData);
          console.log('✅ [API] User saved successfully');
          return true;
        } catch (error) {
          console.error('❌ [API] Save error:', error.code, error.message);
          return false;
        }
      };

      // ✅ ПОЛУЧИТЬ ПОЛЬЗОВАТЕЛЯ
      window.getUser = async (telegramId) => {
        try {
          const doc = await db.collection('users').doc(String(telegramId)).get();
          const data = doc.exists ? doc.data() : null;
          console.log('📥 [API] User loaded:', telegramId, data ? 'found' : 'not found');
          return data;
        } catch (error) {
          console.error('❌ [API] Get error:', error);
          return null;
        }
      };

      // ✅ УДАЛИТЬ ПОЛЬЗОВАТЕЛЯ (с архивацией)
      window.deleteUser = async (telegramId) => {
        try {
          const doc = await db.collection('users').doc(String(telegramId)).get();
          if (doc.exists) {
            const userData = doc.data();
            userData.deleted_at = new Date().toISOString();
            await db.collection('deleted_users').doc(String(telegramId)).set(userData);
            await db.collection('users').doc(String(telegramId)).delete();
            console.log('🗑️ [API] User deleted and archived');
            return true;
          }
          return false;
        } catch (error) {
          console.error('❌ [API] Delete error:', error);
          return false;
        }
      };
    }
  } catch (err) {
    console.error('❌ [API] Firebase init error:', err.code, err.message);
  }
}

console.log('🏁 [API] Functions ready:', {
  saveUser: typeof window.saveUser,
  getUser: typeof window.getUser,
  deleteUser: typeof window.deleteUser
});
