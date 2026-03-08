// js/api.js - Firebase API функции
// Версия: 1.0 (с архивацией удалённых пользователей)

console.log('🔹 api.js loaded');

// Заглушки по умолчанию (чтобы не было ошибки "not defined")
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
    // Инициализация Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    console.log('✅ Firebase initialized');

    // ============================================
    // ✅ СОХРАНИТЬ ПОЛЬЗОВАТЕЛЯ
    // ============================================
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

    // ============================================
    // ✅ ПОЛУЧИТЬ ПОЛЬЗОВАТЕЛЯ
    // ============================================
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

    // ============================================
    // ✅ УДАЛИТЬ ПОЛЬЗОВАТЕЛЯ (с архивацией)
    // ============================================
    window.deleteUser = async (telegramId) => {
      try {
        const db = firebase.firestore();
        
        // Сначала получаем данные пользователя
        const doc = await db.collection('users').doc(String(telegramId)).get();
        
        if (doc.exists) {
          const userData = doc.data();
          
          // Добавляем дату удаления
          userData.deleted_at = new Date().toISOString();
          
          // Сохраняем в коллекцию deleted_users (архив)
          await db.collection('deleted_users').doc(String(telegramId)).set(userData);
          console.log('📁 User archived to deleted_users:', telegramId);
          
          // Удаляем из активной коллекции users
          await db.collection('users').doc(String(telegramId)).delete();
          console.log('🗑️ User deleted from users:', telegramId);
          
          return true;
        }
        
        console.warn('⚠️ User not found for deletion:', telegramId);
        return false;
        
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
console.log('📋 Available functions:', {
  saveUser: typeof window.saveUser,
  getUser: typeof window.getUser,
  deleteUser: typeof window.deleteUser
});
