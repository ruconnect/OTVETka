import { kv } from '@vercel/kv';

export default async function handler(request, response) {
  // Разрешаем только POST-запросы
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Метод не разрешен' });
  }

  try {
    const { fullName, street, houseNumber } = request.body;

    if (!fullName || !street || !houseNumber) {
      return response.status(400).json({ error: 'Все поля обязательны для заполнения' });
    }

    const userData = {
      fullName,
      street,
      houseNumber,
      createdAt: new Date().toISOString(),
    };

    // Генерируем уникальный ключ
    const userId = `user:${Date.now()}`;
    
    // Сохраняем в Vercel KV
    await kv.set(userId, userData);

    return response.status(200).json({ success: true, message: 'Данные сохранены' });
  } catch (error) {
    return response.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
}
