// js/api.js

// 🔴 ВАЖНО: Сразу создаем заглушки, чтобы не было ошибки "not defined"
window.saveUser = async (data) => {
  console.error('❌ saveUser: Firebase not initialized');
  return false;
};

window.getUser = async (id) => {
  console.error('❌ getUser: Firebase not initialized');
  return null;
};

window.deleteUser = async (id) => {
  console.error('❌ deleteUser: Firebase not initialized');
  return false;
};

// Проверяем, что Firebase загружен
if (typeof firebase === 'undefined') {
  console.error('❌ Firebase SDK not loaded! Check index.html script order');
} else {
  console.log('🔥 Firebase SDK found, initializing...');
  
  try {
    // Инициализируем Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    console.log('✅ Firebase initialized successfully');
    
    // ✅ Сохранить пользователя
    window.saveUser = async (userData) => {
      try {
        await db.collection('users').doc(String(userData.telegram_id)).set(userData);
        console.log('✅ User saved to Firestore');
        return true;
      } catch (error) {
        console.error('❌ Firestore save error:', error);
        return false;
      }
    };
    
    // ✅ Получить пользователя
    window.getUser = async (telegramId) => {
      try {
        const doc = await db.collection('users').doc(String(telegramId)).get();
        const data = doc.exists ? doc.data() : null;
        console.log('📥 User data:', data);
        return data;
      } catch (error) {
        console.error('❌ Firestore get error:', error);
        return null;
      }
    };
    
    // ✅ Удалить пользователя
    window.deleteUser = async (telegramId) => {
      try {
        console.log('🗑️ Deleting user:', telegramId);
        await db.collection('users').doc(String(telegramId)).delete();
        console.log('✅ User deleted from Firestore');
        return true;
      } catch (error) {
        console.error('❌ Firestore delete error:', error);
        return false;
      }
    };
    
  } catch (err) {
    console.error('❌ Firebase init error:', err);
  }
}

console.log('🏁 api.js loaded, functions available:', {
  saveUser: typeof window.saveUser,
  getUser: typeof window.getUser,
  deleteUser: typeof window.deleteUser
});
