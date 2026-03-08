// ... (существующий код инициализации Firebase)

// ✅ Удалить пользователя (с сохранением в архив)
window.deleteUser = async (telegramId) => {
  try {
    const db = firebase.firestore();
    
    // Сначала получаем данные пользователя
    const doc = await db.collection('users').doc(String(telegramId)).get();
    if (doc.exists) {
      const userData = doc.data();
      userData.deleted_at = new Date().toISOString();
      
      // Сохраняем в коллекцию deleted_users
      await db.collection('deleted_users').doc(String(telegramId)).set(userData);
      
      // Удаляем из активной коллекции
      await db.collection('users').doc(String(telegramId)).delete();
      
      console.log('🗑️ User deleted and archived:', telegramId);
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Delete error:', error);
    return false;
  }
};
