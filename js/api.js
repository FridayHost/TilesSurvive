// js/api.js
console.log('🔹 [API] Script started');

// Заглушки по умолчанию
window.saveUser = async (data) => {
  console.error('❌ [API] saveUser: Firebase not initialized');
  return false;
};

window.getUser = async (id) => {
  console.error('❌ [API] getUser: Firebase not initialized');
  return null;
};

window.deleteUser = async (id) => {
  console.error('❌ [API] deleteUser: Firebase not initialized');
  return false;
};

// Проверка Firebase
if (typeof firebase === 'undefined') {
  console.error('❌ [API] Firebase SDK NOT loaded');
} else {
  console.log('🔥 [API] Firebase SDK found');

  try {
    if (typeof firebaseConfig === 'undefined') {
      console.error('❌ [API] firebaseConfig NOT defined');
    } else {
      console.log('⚙️ [API] Config found, initializing...');
      
      firebase.initializeApp(firebaseConfig);
      const db = firebase.firestore();
      console.log('✅ [API] Firebase initialized');

      window.saveUser = async (userData) => {
        try {
          await db.collection('users').doc(String(userData.telegram_id)).set(userData);
          console.log('✅ [API] User saved');
          return true;
        } catch (error) {
          console.error('❌ [API] Save error:', error);
          return false;
        }
      };

      window.getUser = async (telegramId) => {
        try {
          const doc = await db.collection('users').doc(String(telegramId)).get();
          return doc.exists ? doc.data() : null;
        } catch (error) {
          console.error('❌ [API] Get error:', error);
          return null;
        }
      };

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
    console.error('❌ [API] Init error:', err);
  }
}

console.log('🏁 [API] Functions ready');

// ✅ ЗАПИСАТЬ ПОСЕЩЕНИЕ
window.logVisit = async (telegramId) => {
  try {
    const db = firebase.firestore();
    const today = new Date().toISOString().split('T')[0]; // Дата в формате YYYY-MM-DD
    
    await db.collection('visits').doc(`${telegramId}_${today}`).set({
      telegram_id: telegramId,
      visit_date: today,
      visited_at: new Date().toISOString()
    });
    
    console.log('📊 Visit logged:', telegramId, today);
    return true;
  } catch (error) {
    console.error('❌ Visit log error:', error);
    return false;
  }
};

console.log('🏁 api.js functions ready:', {
  saveUser: typeof window.saveUser,
  getUser: typeof window.getUser,
  deleteUser: typeof window.deleteUser,
  logVisit: typeof window.logVisit
});
