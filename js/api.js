// Проверяем, что Firebase загружен
if (typeof firebase === 'undefined') {
  console.error('❌ Firebase SDK not loaded! Check index.html');
  
  // Заглушка для тестов без Firebase
  window.saveUser = async (data) => {
    console.log('⚠️ Mock save (Firebase not loaded):', data);
    return true;
  };
  
  window.getUser = async (id) => {
    return JSON.parse(localStorage.getItem('tma_user'));
  };
  
  window.deleteUser = async (id) => {
    console.log('⚠️ Mock delete (Firebase not loaded):', id);
    localStorage.removeItem('tma_user');
    return true;
  };
} else {
  console.log('🔥 Firebase SDK loaded, initializing...');
  
  try {
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    console.log('✅ Firebase initialized');
    
    // Сохранить пользователя
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
    
    // Получить пользователя
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
        await db.collection('users').doc(String(telegramId)).delete();
        console.log('✅ User deleted from Firestore:', telegramId);
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
