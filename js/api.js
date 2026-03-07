// js/api.js - Firebase API функции

console.log('🔹 api.js loaded');

// Заглушки по умолчанию
window.saveUser = async (data) => {
  console.warn('⚠️ saveUser: Firebase not initialized');
  return false;
};

window.getUser = async (id) => {
  console.warn('⚠️ getUser: Firebase not initialized');
  return null;
};

window.deleteUser = async (id) => {
  console.warn('⚠️ deleteUser: Firebase not initialized');
  return false;
};

// Проверка Firebase
if (typeof firebase === 'undefined') {
  console.error('❌ Firebase SDK not loaded');
} else {
  console.log('🔥 Firebase SDK found');

  try {
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    console.log('✅ Firebase initialized');

    // Сохранить пользователя
    window.saveUser = async (userData) => {
      try {
        await db.collection('users').doc(String(userData.telegram_id)).set(userData);
        console.log('✅ User saved:', userData.telegram_id);
        return true;
      } catch (error) {
        console.error('❌ Save error:', error);
        return false;
      }
    };

    // Получить пользователя
    window.getUser = async (telegramId) => {
      try {
        const doc = await db.collection('users').doc(String(telegramId)).get();
        const data = doc.exists ? doc.data() : null;
        console.log('📥 User loaded:', telegramId, data ? 'found' : 'not found');
        return data;
      } catch (error) {
        console.error('❌ Get error:', error);
        return null;
      }
    };

    // Удалить пользователя
    window.deleteUser = async (telegramId) => {
      try {
        await db.collection('users').doc(String(telegramId)).delete();
        console.log('🗑️ User deleted:', telegramId);
        return true;
      } catch (error) {
        console.error('❌ Delete error:', error);
        return false;
      }
    };

  } catch (err) {
    console.error('❌ Firebase init error:', err);
  }
}

console.log('🏁 api.js functions ready');
